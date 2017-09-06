#include <linux/ctype.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/netfilter.h>
#include <linux/in.h>
#include <linux/netfilter_ipv4.h>
#include <linux/rtnetlink.h>
#include <net/netfilter/nf_conntrack.h>
#include <net/netfilter/nf_conntrack_helper.h>
#include <net/netfilter/nf_conntrack_l4proto.h>
#include <net/netfilter/nf_conntrack_l3proto.h>
#include <net/netfilter/nf_conntrack_core.h>
#include <net/netfilter/ipv4/nf_conntrack_ipv4.h>


static struct proc_dir_entry *proc_entry;

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

static u32 ipstr_to_u32 ( char *ipstr )
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

char * __my_strtok;
char * my_strtok(char * s,const char * ct)
{
        char *sbegin, *send;

        sbegin  = s ? s : __my_strtok;
        if (!sbegin)
        {
                return NULL;
        }

        sbegin += strspn(sbegin,ct);
        if (*sbegin == '\0')
        {
                __my_strtok = NULL;
                return( NULL );
        }

        send = strpbrk( sbegin, ct);
        if (send && *send != '\0')
                *send++ = '\0';

        __my_strtok = send;

        return (sbegin);
}

static void convert_data(char *data, u32 *ip, u32 *mask, u16 *proto, u16 *dport)
{
	char *p, buffer[32];
	int m, i;

	strcpy(buffer, data);
	/* ip */	
	p = my_strtok(buffer, " ");
	*ip = htonl(ipstr_to_u32(p));
	/* mask */	
	p = my_strtok(NULL, " ");	
	m = my_atoi(p);
	*mask = 0;
	for (i = m; i > 0; i--)
		*mask |= (1 << (32-i));
	*mask = htonl(*mask);
	/* protocol */
	p = my_strtok(NULL, " ");	
	if (p) 
	{
		*proto = (u16)my_atoi(p);
		/* dport */
		p = my_strtok(NULL, " ");	
		if (p) 
			*dport = (u16)my_atoi(p);
		else 
			*dport = 0;
	}
	else 
		*proto = 0;
	
}

#undef printk

static int kill_ct_original(struct nf_conn *i, void *data)
{
	u32  src_ipaddr=0, mask=0;
	u16  proto=0, dport=0;
	int rst = 0;

	/* WBM connection */
	if (ntohs(i->tuplehash[IP_CT_DIR_REPLY].tuple.src.u.tcp.port) == 55555)
		return 0;

	if (!strcmp("ALL IP\n", (char *)data))
		return 1;

	convert_data((char *)data, &src_ipaddr, &mask, &proto, &dport);

	rst = ((src_ipaddr & mask) == 
		(i->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip & mask));

	if (rst && proto)
	{
		if (proto == IPPROTO_ICMP)
		{
			rst = (proto == i->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.protonum);
		}
		else if (dport)
		{
			rst = ((proto == i->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.protonum) &&
			       (htons(dport) == i->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.u.tcp.port));
		}
	}
	return rst;
}

static int kill_ct_reply(struct nf_conn *i, void *data)
{
	u32  src_ipaddr=0, mask=0;
	u16  proto=0, dport=0;
	int rst = 0;

	/* WBM connection */
	if (ntohs(i->tuplehash[IP_CT_DIR_REPLY].tuple.src.u.tcp.port) == 55555)
		return 0;

	if (!strcmp("ALL IP\n", (char *)data))
		return 1;

	convert_data((char *)data, &src_ipaddr, &mask, &proto, &dport);

	rst = ((src_ipaddr & mask) == 
		(i->tuplehash[IP_CT_DIR_REPLY].tuple.src.u3.ip & mask));

	if (rst && proto)
	{
		if (proto == IPPROTO_ICMP)
		{
			rst = (proto == i->tuplehash[IP_CT_DIR_REPLY].tuple.dst.protonum);
		}
		else if (dport)
		{
			rst = ((proto == i->tuplehash[IP_CT_DIR_REPLY].tuple.dst.protonum) &&
			       (htons(dport) == i->tuplehash[IP_CT_DIR_REPLY].tuple.dst.u.tcp.port));
		}
	}
	return rst;
}

static int proc_write(struct file *file, const char __user * buffer, size_t count, loff_t *ppos)
{
	char buf[1024];

	if (copy_from_user(buf, buffer, count))
		return -EFAULT;

	rtnl_lock();
	nf_ct_iterate_cleanup(&init_net, kill_ct_original, (void *)buf);
	nf_ct_iterate_cleanup(&init_net, kill_ct_reply, (void *)buf);
	rtnl_unlock();

	return count;
}


static u32 init_conntrack_proc(void)
{
        struct proc_dir_entry *conn_proc;

        proc_entry = proc_mkdir( "ctproc", 0 );
	if (!proc_entry)
              return -1;

        conn_proc = create_proc_entry("cleanup", 0, proc_entry);
        if( conn_proc != NULL )
	{
              conn_proc->write_proc = (write_proc_t*)&proc_write;
	}
	return 0;
}

static void fini(void)
{
        remove_proc_entry("cleanup", proc_entry);
}

static int __init init(void)
{
	init_conntrack_proc();
	return 0;
}

module_init(init);
module_exit(fini);
MODULE_LICENSE("GPL");
