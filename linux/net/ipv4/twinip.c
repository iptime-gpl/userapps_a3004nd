#include <linux/ctype.h>
#include <linux/ip.h>
#include <linux/udp.h>
#include <linux/tcp.h>
#include <net/tcp.h>
#include <linux/icmp.h>
#include <linux/if_arp.h>

#include <linux/netfilter.h>

static u32 IPCLONE_WAN1_VIRTUAL_IP = 0xc0a8ff02; /* 192.168.255.2 */
static u32 IPCLONE_WAN2_VIRTUAL_IP = 0xc0a8ff03; /* 192.168.255.3 */
u32 ipclone_virtual_ip[2] = {0,0};
u32 ipclone_wanip[2] = {0,0};
extern unsigned char  ipclone_mac[2][6];
u8  ipclone_skip[2] = {1,1};
static void ipclone_from_lan_to_wan(struct sk_buff *skb);
static void ipclone_from_wan_to_lan(struct sk_buff *skb);
extern unsigned int get_dev_ip( struct net_device *dev );
static int create_proc_ipclone(void);

extern void (*twinip_rx_handler)(struct sk_buff *skb);
extern void (*twinip_tx_handler)(struct sk_buff *skb, char *ifname);

void twinip_rx(struct sk_buff *skb)
{
	if (ipclone_virtual_ip[0] || ipclone_virtual_ip[1])
	{
		if (!strcmp(skb->dev->name, CONFIG_LOCAL_IFNAME))
			ipclone_from_lan_to_wan(skb);
        }
}

void twinip_tx(struct sk_buff *skb, char *ifname)
{
        if (ipclone_virtual_ip[0] || ipclone_virtual_ip[1])
        {
                if (!strcmp(ifname, CONFIG_LOCAL_IFNAME))
                        ipclone_from_wan_to_lan(skb);
        }
}

static int compare_mac(unsigned char *m1, unsigned char *m2)
{
        int rc = 0;

        if ((m1[0] == m2[0]) && (m1[1] == m2[1]) &&
            (m1[2] == m2[2]) && (m1[3] == m2[3]) &&
            (m1[4] == m2[4]) && (m1[5] == m2[5]))
                rc = 1;
        return rc;
}

static void ipclone_from_lan_to_wan(struct sk_buff *skb)
{
	int ipcloned[2] = {0,0}, ipcloned_id;
	struct ethhdr *ethh = eth_hdr(skb);
	unsigned int src_ip;
	int dest_clone = 0;

	ipcloned[0] = compare_mac(ethh->h_source, ipclone_mac[0]);
	ipcloned[1] = compare_mac(ethh->h_source, ipclone_mac[1]);
	ipcloned_id = (ipcloned[1]) ? 1 : 0;

#if 0
	{
	struct iphdr *iph = (struct iphdr *)(ethh + 1);
	printk("== RX => %s [%d]: ", skb->dev->name, ipcloned[0]);

	if (htons(ethh->h_proto) == ETH_P_IP)
		printk(" %08x -> %08x : ", iph->saddr, iph->daddr);
	else
		printk(" NO IP Type : %04x ", ethh->h_proto);

	printk(" %02x-%02x-%02x-%02x-%02x-%02x ", 
		ethh->h_dest[0], ethh->h_dest[1], ethh->h_dest[2], 
		ethh->h_dest[3], ethh->h_dest[4], ethh->h_dest[5]);
	printk(" : %02x-%02x-%02x-%02x-%02x-%02x \n", 
		ethh->h_source[0], ethh->h_source[1], ethh->h_source[2], 
		ethh->h_source[3], ethh->h_source[4], ethh->h_source[5]);
	}
#endif

        if (!ipcloned[0] && !ipcloned[1])
        {
                if (htons(ethh->h_proto) == ETH_P_ARP)
                {
			struct arphdr *arph = arp_hdr(skb);
                        char *target = (char *)(arph + 1) + 16; /* target ip address */

                        if (arph->ar_op != htons(ARPOP_REPLY)) return;

                        dest_clone = 1;

                        if (*(u32 *)target == htonl(ipclone_virtual_ip[0]))
                                ipcloned_id = 0;
                        else if (*(u32 *)target == htonl(ipclone_virtual_ip[1]))
                                ipcloned_id = 1;
                        else
                                return;
                }
                else
                        return;
        }

	if(htons(ethh->h_proto) == ETH_P_IP)
	{
		struct iphdr *iph = ip_hdr(skb);
		src_ip = iph->saddr;

		if ((((get_dev_ip(skb->dev) & htonl(0xffffff00)) == (src_ip & htonl(0xffffff00))) || src_ip == 0) &&
		      (ipcloned[0] || ipcloned[1]))
		{
			ipclone_skip[ipcloned_id] = 1;
		}
		else if (ipcloned[0] || ipcloned[1])
		{

#if defined CONFIG_ARCH_TIMEG && defined CONFIG_BRIDGE_PASSTHROUGH
			if( !strcmp(skb->dev->name, "br0") && compare_mac(skb->dev->dev_addr, ethh->h_dest ))
#endif
			{
				int oldip=0, newip=0;

				oldip = src_ip;
				newip = htonl(ipclone_virtual_ip[ipcloned_id]);
				csum_replace4(&iph->check, iph->saddr, newip); 
				iph->saddr = newip;

				if (iph->protocol == 17 && !(htons(iph->frag_off) & 0xff))
				{
					struct udphdr *udph = (struct udphdr *)((char *)iph + (iph->ihl<<2));
					if (udph->check)
						csum_replace4(&udph->check, oldip, newip); 
				}
				else if (iph->protocol == 6 && !(htons(iph->frag_off) & 0xff))
				{
					struct tcphdr *tcph = (struct tcphdr *)((char *)iph + (iph->ihl<<2));
					csum_replace4(&tcph->check, oldip, newip); 
				}
				// printk("REAL IP clone Rx-  %08x, %08x\n", iph->saddr, iph->daddr);

				ipclone_skip[ipcloned_id] = 0;
				return;
			}
		}
	}
	else if ((htons(ethh->h_proto) == ETH_P_ARP) && (ipcloned[0] || ipcloned[1]))
	{
		struct arphdr *arph = arp_hdr(skb);
		char *source = (char *)(arph + 1) + 6; /* source ip address */
		char *target = (char *)(arph + 1) + 16; /* target ip address */

		//printk("arp(L2W) : op:%d, (src :%08x) (dst : %08x)\n", ntohs(arph->ar_op), *(u32 *)source, *(u32 *)target);

                if (arph->ar_op == htons(ARPOP_REQUEST) && (ipcloned[0] || ipcloned[1]))
                {
                        if ((get_dev_ip(skb->dev) & htonl(0xffffff00)) == (*(u32 *)source & htonl(0xffffff00)))
                        {
                                ipclone_skip[ipcloned_id] = 1; // still use a private ip on twinip PC
                        }
                        else if (!*(u32 *)source)
                        {
                                //printk("   1. arp-req(source) : %08x -> ",  *(u32 *)source);
                                *(__u32 *)source = *(__u32 *)target;
                                //printk("      %08x  \n", *(u32 *)source);
                        }
                        else if ((*(u32 *)source !=  *(__u32 *)target) &&
                                (*(u32 *)source != htonl(ipclone_virtual_ip[ipcloned_id])))
                        {       // CASE 1: Twin IP ARP request
                                //printk("   2. arp-req(source) : %08x -> ",  *(u32 *)source);
                                *(u32 *)source = htonl(ipclone_virtual_ip[ipcloned_id]); // WAN_IP -> Virtual_IP
                                //printk("      %08x  \n", *(u32 *)source);
                                ipclone_skip[ipcloned_id] = 0;
                        }
                        else if ((*(u32 *)source ==  *(u32 *)target) &&
                                (*(u32 *)source == htonl(ipclone_wanip[ipcloned_id])))
                        {       // Gratuitous ARP from Twin IP
                                //printk("   5. arp-req(gratuitous) : %08x -> ",  *(u32 *)target);
                                *(u32 *)source = htonl(ipclone_virtual_ip[ipcloned_id]); // WAN_IP -> Virtual_IP
                                *(u32 *)target = htonl(ipclone_virtual_ip[ipcloned_id]); // WAN_IP -> Virtual_IP
                                //printk("      %08x  \n", *(u32 *)target);
                        }
                }
                else if (arph->ar_op == htons(ARPOP_REPLY) && *(u32 *)source !=  *(u32 *)target)
                {
                        if (*(u32 *)source == htonl(ipclone_wanip[ipcloned_id]) && (ipcloned[0] || ipcloned[1]))
                        {       // CASE 2: Twin IP ARP reply
                                //printk("   3. arp-rsp(source) : %08x -> ",  *(u32 *)source);
                                *(u32 *)source = htonl(ipclone_virtual_ip[ipcloned_id]);  // WAN_IP -> Virtual_IP
                                //printk("      %08x  \n", *(u32 *)source);
                        }
                        else if ((*(__u32 *)source == htonl((ipclone_virtual_ip[0] & 0xffffff00) | 0x1)) && dest_clone)
                        {       // CASE 3: Private IP that communicate with Twin IP : ARP reply
                                //printk("   4. arp-rsp(target) : %08x -> ",  *(u32 *)target);
                                *(u32 *)target = htonl(ipclone_wanip[ipcloned_id]);  // Virtual_IF_IP -> WAN_IP
                                //printk("      %08x  \n", *(u32 *)target);
                        }
                }

                return;




	}
}

static void ipclone_from_wan_to_lan(struct sk_buff *skb)
{
	struct ethhdr *ethh = (struct ethhdr *)(skb->data);
	int ipcloned[2] = {0,0}, ipcloned_id;

#if 0
	{
	struct iphdr *iph = (struct iphdr *)(ethh + 1);

	printk("== TX => %s : ", skb->dev->name);

	if (htons(ethh->h_proto) == ETH_P_IP)
		printk(" %08x -> %08x : ", iph->saddr, iph->daddr);
	else
		printk(" NO IP Type : %04x ", ethh->h_proto);

	printk(" %02x-%02x-%02x-%02x-%02x-%02x ", 
		ethh->h_dest[0], ethh->h_dest[1], ethh->h_dest[2], 
		ethh->h_dest[3], ethh->h_dest[4], ethh->h_dest[5]);
	printk(" : %02x-%02x-%02x-%02x-%02x-%02x \n", 
		ethh->h_source[0], ethh->h_source[1], ethh->h_source[2], 
		ethh->h_source[3], ethh->h_source[4], ethh->h_source[5]);
	}
#endif
	ipcloned[0] = compare_mac(ethh->h_dest, ipclone_mac[0]);
	ipcloned[1] = compare_mac(ethh->h_dest, ipclone_mac[1]);
	ipcloned_id = (ipcloned[1]) ? 1 : 0;


	if (htons(ethh->h_proto) == ETH_P_IP)
	{
		if (ipclone_skip[ipcloned_id] || !ipclone_virtual_ip[ipcloned_id])
		{
			; /* nothing */
		}
		else if (ipcloned[0] || ipcloned[1])
		{
			struct iphdr *iph = (struct iphdr *)(ethh + 1);
			u32 oldip=0, newip=0;

			oldip = iph->daddr;
			newip = htonl(ipclone_wanip[ipcloned_id]);
			csum_replace4(&iph->check, iph->daddr, newip); 
			iph->daddr = newip;

			if (iph->protocol == 17 && !(htons(iph->frag_off) & 0xff))
			{
				struct udphdr *udph = (struct udphdr *)((char *)iph + (iph->ihl<<2));
				if (udph->check)
					inet_proto_csum_replace4(&udph->check, skb, oldip, newip, 1);	
					//csum_replace4(&udph->check, oldip, newip);
			}
			else if (iph->protocol == 6 && !(htons(iph->frag_off) & 0xff))
			{
				struct tcphdr *tcph = (struct tcphdr *)((char *)iph + (iph->ihl<<2));
				inet_proto_csum_replace4(&tcph->check, skb, oldip, newip, 1);	
				//csum_replace4(&tcph->check, oldip, newip);
			}
			else if (iph->protocol == 1) /* ICMP */
			{
				/* Type 3 : Unreachable,
				Code 3 : Destination unreachable, Code 4 : Need to fragment */

				struct icmphdr *icmph = (struct icmphdr *)((char *)iph + (iph->ihl<<2));
				if (icmph->type == 3 && (icmph->code == 3 || icmph->code == 4))
				{
					struct iphdr *iph = (struct iphdr *)(icmph + 1);
					oldip = iph->saddr;
					iph->saddr = htonl(ipclone_wanip[ipcloned_id]);
					newip = iph->saddr;

					//iph->check = ip_nat_cheat_check( ~oldip, newip, iph->check );
					csum_replace4(&iph->check, oldip, newip); 
				}
			}
		}
	}
	else if (htons(ethh->h_proto) == ETH_P_ARP)
	{
		struct arphdr *arph = arp_hdr(skb);
		char *target = (char *)(arph + 1) + 16; /* target address */
		char *source = (char *)(arph + 1) + 6; /* source ip address */

                //printk("arp(W2L) : op:%d, (src :%08x) (dst : %08x)\n", ntohs(arph->ar_op), *(u32 *)source, *(u32 *)target);

                if (arph->ar_op == htons(ARPOP_REQUEST) && (!ipclone_skip[0] || !ipclone_skip[1]))
                {

                        if ((*(u32 *)target == htonl(ipclone_virtual_ip[0])) && !ipclone_skip[0])
                        {       // CASE 2 : CPU ARP request to Twin IP
                                //printk("   1. arp-req(target) : %08x -> ",  *(u32 *)target);
                                *(u32 *)target = htonl(ipclone_wanip[0]); /* Virtual_IP -> WAN1_IP */
                                //printk("      %08x  \n", *(u32 *)target);
                        }
                        else if ((*(u32 *)target == htonl(ipclone_virtual_ip[1])) && !ipclone_skip[1])
                        {       // CASE 2 : CPU ARP request to Twin IP
                                //printk("   2. arp-req(target) : %08x -> ",  *(u32 *)target);
                                *(u32 *)target = htonl(ipclone_wanip[1]); /* Virtual_IP -> WAN2_IP */
                                //printk("      %08x  \n", *(u32 *)target);
                        }
                        else if ((*(u32 *)source == htonl(ipclone_wanip[0])) || (*(u32 *)source == htonl(ipclone_wanip[1])))
                        {       // CASE 3: CPU ARP request to Private IP that communicate with Twin IP
                                //printk("   3. arp-req(source) : %08x -> ",  *(u32 *)source);
                                *(u32 *)source = htonl((ipclone_virtual_ip[0] & 0xffffff00) | 0x1);
                                //printk("      %08x  \n", *(u32 *)source);
                        }
                }
                else if (arph->ar_op == htons(ARPOP_REPLY) && (!ipclone_skip[0] || !ipclone_skip[1]))
                {
                        if ((*(u32 *)target == htonl(ipclone_virtual_ip[ipcloned_id])))
                        {       // CASE 1: CPU ARP reply to Twin IP
                                //printk("   4. arp-rsq(target) [%d] : %08x -> ", ipclone_skip[0], *(u32 *)target);
                                *(u32 *)target = htonl(ipclone_wanip[ipcloned_id]);  /*  Virtual_IP -> WAN2_IP */
                                //printk("%08x \n", *(u32 *)target);
                        }
                }
	}
}


static char * __rstrtok;
static char * rstrtok(char * s,const char * ct)
{
        char *sbegin, *send;

        sbegin  = s ? s : __rstrtok;
        if (!sbegin)
        {
                return NULL;
        }

        sbegin += strspn(sbegin,ct);
        if (*sbegin == '\0')
        {
                __rstrtok = NULL;
                return( NULL );
        }

        send = strpbrk( sbegin, ct);
        if (send && *send != '\0')
                *send++ = '\0';

        __rstrtok = send;

        return (sbegin);
}

static int proc_read_ipclone(char *page, char **start, off_t off, int count, int *eof, void *data_unused)
{
        char *p = page;

        p += sprintf(p, "%08x %02x-%02x-%02x-%02x-%02x-%02x\n",
                ipclone_virtual_ip[0],
                ipclone_mac[0][0], ipclone_mac[0][1], ipclone_mac[0][2],
                ipclone_mac[0][3], ipclone_mac[0][4], ipclone_mac[0][5]);
        p += sprintf(p, "%08x %02x-%02x-%02x-%02x-%02x-%02x\n",
                ipclone_virtual_ip[1],
                ipclone_mac[1][0], ipclone_mac[1][1], ipclone_mac[1][2],
                ipclone_mac[1][3], ipclone_mac[1][4], ipclone_mac[1][5]);
        *eof = 1;

        return strlen(page);
}

static int proc_write_ipclone(struct file *file, const char __user * buffer, size_t count, loff_t *ppos)
{
        char *deli, *start, buf[50], *buf2;
        int mac[2][6], w,i;

	if(count>49) return count;

        if (copy_from_user(buf, buffer, count))
		return -EFAULT;

	for(w=0;w<2;w++)
	{
		for(i=0;i<6;i++) mac[w][i]=0;
	}

	buf[count]=0;

        w = 0;
        buf2 = rstrtok(buf, " ");
        do
        {
                if (strlen(buf2) < strlen("00-00-00-00-00-00"))
                        break;

                for(i=0, start=buf2; i<6  ; i++ )
                {
                        deli = strchr(start, '-' );
                        if(deli)
                                *deli = 0x0;
                        mac[w][i] = simple_strtoul(start, NULL, 16);
                        start = deli+1;
                }
                w++;
        } while ((w < 2) && ((buf2 = rstrtok(NULL, " ")) != NULL));

        for (w = 0; w < 2; w++)
        {
                if (mac[w][0] == 0 && mac[w][1] == 0 && mac[w][2] == 0 &&
                    mac[w][3] == 0 && mac[w][4] == 0 && mac[w][5] == 0)
                {
                        ipclone_virtual_ip[w] = 0;
                        ipclone_skip[w] = 1;
                }
                else
                {
                        ipclone_virtual_ip[w] = (w) ? IPCLONE_WAN2_VIRTUAL_IP : IPCLONE_WAN1_VIRTUAL_IP;
                }
                for (i=0; i<6; i++)
                        ipclone_mac[w][i] = (unsigned char)mac[w][i];
        }
        return count;
}


static int proc_read_wanip(char *page, char **start, off_t off, int count, int *eof, void *data_unused)
{
        sprintf(page, "%08x %08x", ipclone_wanip[0], ipclone_wanip[1] );
        *eof = 1;

	return strlen(page);
}

static int str_to_u32( char *pbuf, u32 *pval )
{
        int n = 0;

        *pval = 0;
        while( pbuf[n] >= '0' && pbuf[n] <= '9' )
        {
                *pval = (*pval * 10) + (pbuf[n] - '0');
                n++;
        }

        return n;
}

static unsigned int ipstr_to_u32 ( char *ipstr )
{
        u32 ipaddr = 0;
        int n = 0, i, tmp;

        while (isdigit(ipstr[n]) || ipstr[n] == '.')
        {
                if (ipstr[n] == '.')
                {
                        ipaddr = (ipaddr << 8) | tmp;
                        n++;
                }
                else
                {
                        i = str_to_u32(&ipstr[n], &tmp);
                        n += i;
                }
        }
        ipaddr = (ipaddr << 8) | tmp;

        return ipaddr;
}


static int proc_write_wanip(struct file *file, const char __user * buffer, size_t count, loff_t *ppos)
{
        char buf[32], *buf2;
        int w;

	if(count>31) return count;

        if (copy_from_user(buf, buffer, count))
		return -EFAULT;

        w = 0;
	buf[count]=0;
        buf2 = rstrtok(buf, " ");
        do
        {
                ipclone_wanip[w] = ipstr_to_u32(buf2);
                w++;

        } while ((buf2 = rstrtok(NULL, " ")) != NULL);
        return count;
}


#ifndef CONFIG_DRIVERLEVEL_REAL_IPCLONE_MODULE
static int proc_twinip_read(char *page, char **start, off_t off, int count, int *eof, void *data_unused)
{
	char *p;

	p = page;
        if (twinip_rx_handler)
	{
                sprintf(p, "1");
		p += sprintf(p, " %08x", IPCLONE_WAN1_VIRTUAL_IP);
                p += sprintf(p, " %08x", IPCLONE_WAN2_VIRTUAL_IP);
	}
        else
                sprintf(p, "0");
	*eof = 1;

        return strlen(page);
}

static int proc_twinip_write(struct file *file, const char __user * buffer, size_t count, loff_t *ppos)
{
	char buf[64], *buf2;

	if(count>63) return count;

	if (copy_from_user(buf, buffer, count))
		return -EFAULT;

	buf[count]=0;

        if (buffer[0] == '1')
        {
		if ((buf2 = rstrtok(&buf[2], " ")) != NULL)
		{
		        IPCLONE_WAN1_VIRTUAL_IP = ipstr_to_u32 (buf2);
		        if ((buf2 = rstrtok(NULL, " ")) != NULL)
		                IPCLONE_WAN2_VIRTUAL_IP = ipstr_to_u32 (buf2);
		}
                twinip_rx_handler = twinip_rx;
                twinip_tx_handler = twinip_tx;
        }
        else
        {
		IPCLONE_WAN1_VIRTUAL_IP = 0;
		IPCLONE_WAN2_VIRTUAL_IP = 0;
                twinip_rx_handler = NULL;
                twinip_tx_handler = NULL;
        }

        return count;
}
#endif


static int create_proc_ipclone(void)
{
        struct proc_dir_entry *proc_entry;
        char name[128];

        sprintf(name, "driver/ipclone");
        proc_entry = create_proc_entry(name,0,0);
        if(proc_entry)
        {
                proc_entry->write_proc = (write_proc_t*)&proc_write_ipclone;
                proc_entry->read_proc = (read_proc_t*)&proc_read_ipclone;
        }

        sprintf(name, "driver/wanip");
        proc_entry = create_proc_entry(name,0,0);
        if(proc_entry)
        {
                proc_entry->write_proc = (write_proc_t*)&proc_write_wanip;
                proc_entry->read_proc = (read_proc_t*)&proc_read_wanip;
        }


#ifndef CONFIG_DRIVERLEVEL_REAL_IPCLONE_MODULE
        proc_entry = create_proc_entry("driver/twinip",0,0);
        if(proc_entry)
        {
                proc_entry->read_proc = (read_proc_t*)&proc_twinip_read;
                proc_entry->write_proc = (write_proc_t*)&proc_twinip_write;
        }
#endif

        return 0;
}

static int delete_proc_ipclone(void)
{
	remove_proc_entry("driver/ipclone", NULL );
	remove_proc_entry("driver/wanip", NULL );
	return 0;
}

static void fini(void)
{
	delete_proc_ipclone();
	twinip_rx_handler = NULL;
	twinip_tx_handler = NULL;
}

static int __init init(void)
{
	printk("Twin IP Module Init\n");
	create_proc_ipclone();
#ifdef CONFIG_DRIVERLEVEL_REAL_IPCLONE_MODULE
	twinip_rx_handler = twinip_rx;
	twinip_tx_handler = twinip_tx;
#endif
	return 0;
}

module_init(init);
module_exit(fini);

