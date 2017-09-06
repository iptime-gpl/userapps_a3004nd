#include <linux/module.h>
#include <linux/skbuff.h>
#include <linux/if.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/icmp.h>
#include <net/checksum.h>
#include <linux/proc_fs.h>
#include <linux/timer.h>
#include <linux/time.h>

#include <linux/netfilter/x_tables.h>
#include <linux/netfilter/xt_NETDETECT.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("EFM");
MODULE_ALIAS("ipt_NETDETECT_handle");

extern struct net_detect_history ND_history[MAX_HISTORY];
extern struct net_detect_history NDip_history[255];
extern u32  ND_limit_burst;

static int net_detect_interval = 1 * HZ;
static struct timer_list net_detect_timer;

static u32  net_detect_start_flag = 0;
static u32  event_detect_flag = 0;
static u32  new_event_detect_flag = 0;

static void net_detect_checker(unsigned long dummy)
{
	unsigned long now = jiffies;
	int idx;

	for (idx = 0; idx < MAX_HISTORY; idx++)
	{
		if (ND_history[idx].ipaddr == 0)
			continue;

		if (ND_history[idx].pcount >= ND_limit_burst)
		{
			//printk("event : %08x %d\n", ND_history[idx].ipaddr, ND_history[idx].port);
			ND_history[idx].ecount++;
			ND_history[idx].pcount = 0;
			ND_history[idx].flag = NET_DETECT_UPDATED;

			event_detect_flag = 1;
			new_event_detect_flag = (ND_history[idx].ecount == 1) ? 1:0;
		}
		else if (ND_history[idx].ecount != 0)
		{
			//printk("ecount != 0 : %08x %d\n", ND_history[idx].ipaddr, ND_history[idx].port);
			ND_history[idx].pcount = 0;
		}
		else if (ND_history[idx].ecount == 0)
		{
			//printk("ecount == 0 : %08x %d\n", ND_history[idx].ipaddr, ND_history[idx].port);
			memset(&ND_history[idx], 0, sizeof(struct net_detect_history));
		}
	}

	/* Multi port Virus */
	for (idx = 0; idx < 255; idx++)
	{
		if (NDip_history[idx].ipaddr == 0)
			continue;

		if (NDip_history[idx].pcount >= (ND_limit_burst * 2))
		{
			//printk("event : %08x %d\n", NDip_history[idx].ipaddr, NDip_history[idx].port);
			NDip_history[idx].ecount++;
			NDip_history[idx].pcount = 0;
			NDip_history[idx].flag = NET_DETECT_UPDATED;

			event_detect_flag = 1;
			new_event_detect_flag = (NDip_history[idx].ecount == 1) ? 1:0;
		}
		else if (NDip_history[idx].ecount != 0)
		{
			NDip_history[idx].pcount = 0;
		}
		else if (NDip_history[idx].ecount == 0)
		{
			memset(&NDip_history[idx], 0, sizeof(struct net_detect_history));
		}
	}

	mod_timer(&net_detect_timer, now + net_detect_interval);	
}

static int proc_read_net_detect_start(char *buffer, char **start, off_t offset, int length, int *eof, void *data)
{
        char *p = buffer;
        int len;

        p +=  sprintf(p, "%d", net_detect_start_flag);

        len = p - buffer;
        if( len <= offset+length ) *eof = 1;
        *start = buffer + offset;
        len -= offset;
        if( len > length ) len = length;
        if( len < 0 ) len = 0;

        return len;
}

static int proc_write_net_detect_start(struct file *file, const char *buffer, u_long count, void *data)
{
        if(buffer[0] == '0' )
	{
                net_detect_start_flag= 0;
		del_timer(&net_detect_timer);
	}
        else
	{
                net_detect_start_flag= 1;
		init_timer(&net_detect_timer);
		net_detect_timer.function = net_detect_checker;
		net_detect_timer.expires = jiffies + net_detect_interval;
		add_timer(&net_detect_timer);
	}

        return count;
}


static int proc_read_new_detect(char *buffer, char **start, off_t offset, int length, int *eof, void *data)
{
        char *p = buffer;
        int len;

        p +=  sprintf(p, "%d %d", event_detect_flag, new_event_detect_flag);

        len = p - buffer;
        if( len <= offset+length ) *eof = 1;
        *start = buffer + offset;
        len -= offset;
        if( len > length ) len = length;
        if( len < 0 ) len = 0;

        event_detect_flag= 0;
        new_event_detect_flag= 0;

        return len;
}


static int proc_write_clear_all(struct file *file, const char *buffer, u_long count, void *data)
{
	memset(ND_history, 0, sizeof(struct net_detect_history) * MAX_HISTORY);
	memset(NDip_history, 0, sizeof(struct net_detect_history) * 255);
	event_detect_flag = 0;
	new_event_detect_flag = 0;
        return count;
}

static int proc_read_history(char *buffer, char **start, off_t offset, int length, int *eof, void *data)
{
	char *p = buffer;
	int len;
	int idx;

	for (idx = 0; idx < MAX_HISTORY; idx++)
	{
		if (ND_history[idx].ecount == 0) continue;

		p +=  sprintf(p, "%08x %08x %2d %5d %5d %5d %5d\n",
			ND_history[idx].etime, 
			ND_history[idx].ipaddr, 
			ND_history[idx].proto,
			ND_history[idx].port,
			ND_history[idx].pcount,
			ND_history[idx].ecount,
			ND_history[idx].flag);

		ND_history[idx].flag = 0; /* clear update flag */
	}

	for (idx = 0; idx < 255; idx++)
	{
		if (NDip_history[idx].ecount == 0) continue;

		p +=  sprintf(p, "%08x %08x %2d %5d %5d %5d %5d\n",
			NDip_history[idx].etime, 
			NDip_history[idx].ipaddr, 
			NDip_history[idx].proto,
			NDip_history[idx].port,
			NDip_history[idx].pcount,
			NDip_history[idx].ecount,
			NDip_history[idx].flag);

		NDip_history[idx].flag = 0; /* clear update flag */
	}

	len = p - buffer;
	if( len <= offset+length ) *eof = 1;
	*start = buffer + offset;
	len -= offset;
	if( len > length ) len = length;
	if( len < 0 ) len = 0;

	return len;
}


static u32 init_net_detect_proc(void)
{
	struct proc_dir_entry *proc_entry;

	proc_entry = create_proc_entry("netdetect/nd_start", 0, 0);
	if( proc_entry != NULL )
	{
		proc_entry->read_proc = &proc_read_net_detect_start;
		proc_entry->write_proc = &proc_write_net_detect_start;
	}

	proc_entry = create_proc_entry("netdetect/new_detect", 0, 0);
	if( proc_entry != NULL )
	{
		proc_entry->read_proc = &proc_read_new_detect;
	}

	proc_entry = create_proc_entry("netdetect/clear_all", 0, 0);
	if( proc_entry != NULL )
	{
		proc_entry->write_proc = &proc_write_clear_all;
	}

	proc_entry = create_proc_entry("netdetect/history", 0, 0);
	if( proc_entry != NULL )
	{
		proc_entry->read_proc = &proc_read_history;
	}

	return 0;
}


/* Not __exit: called from init() */
static void fini(void)
{
}

static int __init init(void)
{
	init_net_detect_proc();
	return 0;
}


module_init(init);
module_exit(fini);
