
#include <linux/ctype.h>
#include <linux/if_arp.h>
#include <linux/ip.h>
#include <linux/udp.h>
#include <linux/tcp.h>
#include <linux/icmp.h>
#include <linux/netfilter.h>


#define MAX_SKIP_PORT_LIST_SKIP_NF 16
typedef struct skip_s {
        char ifname[16];
        int port;
	int skip_count;
} skip_t;

skip_t skip_list[MAX_SKIP_PORT_LIST_SKIP_NF];
extern int sysctl_nf_skip_input_output_flag;

/* direction -> 1 : output , 0 : input */
int check_skip_packet(int direction,struct sk_buff *skb)
{
        struct iphdr *iph;
        struct tcphdr *th;
        struct net_device *dev;
	int i,port;

        if(skb->pkt_type!=PACKET_HOST)
                return 0; /* don't skip */
        iph = ip_hdr(skb);
        if(iph->protocol!=IPPROTO_TCP)
                return 0; /* don't skip */

        th=(void *)iph + iph->ihl*4;
        if(direction)
        {
                //dev=skb->dst->dev;
                dev=skb_dst(skb)->dev;
                port=htons(th->source);
        }
        else
        {
                dev=skb->dev;
                port=htons(th->dest);
        }

        for(i=0;i<MAX_SKIP_PORT_LIST_SKIP_NF;i++)
        {
                if(!skip_list[i].port) return 0;
		//printk("SKIP: direction 0:dev->%s - %s,%d  :%s -> %d\n", direction?"output":"input", dev->name, port, skip_list[i].ifname, skip_list[i].port);
                if((skip_list[i].port == port) && (!strcmp(skip_list[i].ifname,"all") || !strcmp(skip_list[i].ifname,dev->name)))
		{
			//printk("SKIP: direction 1:%s , %s -> %d\n", direction?"output":"input", skip_list[i].ifname, skip_list[i].port);
			skip_list[i].skip_count++;
		        return 1; /* skip this port */
		}
        }
        return 0;

}

static int proc_read_skip_nf_list(char *buffer, char **start, off_t offset, int length, int *eof, void *data)
{
        char *p = buffer;
        int len;
	int i;


	for( i = 0 ; i < MAX_SKIP_PORT_LIST_SKIP_NF;i++)
	{
		if(!skip_list[i].port) 
			break;
		p += sprintf(p,"%s,%d,%d\n", (skip_list[i].ifname[0]==0)?"all":skip_list[i].ifname,skip_list[i].port, skip_list[i].skip_count);
	}

        len = p - buffer;
        if( len <= offset+length ) *eof = 1;
        *start = buffer + offset;
        len -= offset;
        if( len > length ) len = length;
        if( len < 0 ) len = 0;

        return len;
}


static int my_atoi(const char *s)
{
        int val = 0;

        for (;; s++) {
                switch (*s) {
                        case '0'...'9':
                        val = 10*val+(*s-'0');
                        break;
                default:
                        return val;
                }
        }
}

static int parse_skip_config(char *line, skip_t *skip)
{
	char *ptr;

	ptr=strchr(line,',');
	if(!ptr) return 0;

	*ptr=0;
	strcpy(skip->ifname,line);
	ptr++;
	skip->port=my_atoi(ptr);
	skip->skip_count=0;
	return 1;
}


int add_skip_config(char *buf)
{
	int i;
	skip_t skip;	

	if(!parse_skip_config(buf,&skip))
		return 0;

	for(i=0;i<MAX_SKIP_PORT_LIST_SKIP_NF;i++)
	{
		if(!skip_list[i].port)
		{
			skip_list[i]=skip;
			return 1;
		}
		else if((skip_list[i].port == skip.port) && !strcmp(skip_list[i].ifname,skip.ifname) )
			return 1;
	}
	return 0;
}


int remove_skip_config(char *buf)
{
	int i;
	skip_t skip;	

	if(!parse_skip_config(buf,&skip))
		return 0;

	for(i=0;i<MAX_SKIP_PORT_LIST_SKIP_NF;i++)
	{
		if(!skip_list[i].port)
			return 0;
		else if((skip_list[i].port == skip.port) && !strcmp(skip_list[i].ifname,skip.ifname) )
		{
			int j;
			for(j=i;j<(MAX_SKIP_PORT_LIST_SKIP_NF-1);j++)
			{
				memset(&skip_list[j],0x0,sizeof(skip_t));
				if(!skip_list[j+1].port)
					break;
				skip_list[j]=skip_list[j+1];
			}

			return 1;
		}
	}
	return 0;
}



static int proc_write_skip_nf_list( struct file *file, const char *buffer, u_long count, void *data )
{
        char buf[1024];

	if(count > 1023)
	{
		printk("proc_write_skip_nf_list:Too long arguments\n");
		return count;
	}

        memcpy(buf, buffer, count);
        buf[count]=0x0;

	if(!strcmp(buf,"clearall"))
		memset(skip_list,0x0,sizeof(skip_t)*MAX_SKIP_PORT_LIST_SKIP_NF);
	else 
	{
		char *ptr,*nptr;

		ptr=buf;
		nptr=strchr(ptr,',');
		if(!nptr) return count;

		*nptr=0;
		nptr++;
		if(!strcmp(ptr,"add"))
			add_skip_config(nptr);
		else if(!strcmp(ptr,"remove"))
			remove_skip_config(nptr);
	}

        return count;
}

static void fini(void)
{
        remove_proc_entry("driver/skip_nf_list", NULL );
}

static int __init init(void)
{

        struct proc_dir_entry *proc_entry;
        char name[128];

	printk("Init SKIP Netfilter\n");

        sprintf(name, "driver/skip_nf_list");
        proc_entry = create_proc_entry(name,0,0);
        if(proc_entry)
        {
                proc_entry->write_proc=&proc_write_skip_nf_list;
                proc_entry->read_proc=&proc_read_skip_nf_list;
        }

        return 0;
}

module_init(init);
module_exit(fini);

