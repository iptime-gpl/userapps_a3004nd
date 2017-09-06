#include <linux/init.h>
#include <linux/module.h>
#include <linux/skbuff.h>
#include <linux/netdevice.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/proc_fs.h>
#include <linux/spinlock.h>
#include <linux/timer.h>
#include <linux/time.h>

#define IPCLONE_WAN1_VIRTUAL_IP 0xc0a8ff02 /* 192.168.255.2 */
#define IPCLONE_WAN2_VIRTUAL_IP 0xc0a8ff03 /* 192.168.255.3 */

#define MAX_COUNT	258
#define GC_TIMEOUT	(10*60*HZ) // 10 mins

#define NIPQUAD(addr) \
        ((unsigned char *)&addr)[0], \
        ((unsigned char *)&addr)[1], \
        ((unsigned char *)&addr)[2], \
        ((unsigned char *)&addr)[3]

#undef printk

struct _qos_list_t {
	unsigned int  ip;
	unsigned long updated;
	unsigned int  command;
#define ADD_IP	0x1
#define DEL_IP	0x2
}; 
static struct _qos_list_t qos_list[MAX_COUNT] = {{0,0,0}, };

static struct timer_list smart_qos_timer;
static spinlock_t qos_list_lock;

extern void (*smart_qos_mon_callback)(struct sk_buff *skb);
extern int check_internal_subnet(u32 ipaddr);

void smart_callback(struct sk_buff *skb)
{
	struct ethhdr *ethh = eth_hdr(skb);
	struct iphdr *iph = ip_hdr(skb);
	int idx;

	if ((htons(ethh->h_proto) != ETH_P_IP)) return;
	if (strcmp(skb->dev->name, CONFIG_LOCAL_IFNAME)) return;
	if (iph->saddr == 0) return;
	if (!check_internal_subnet(iph->saddr)) return;

#if defined(CONFIG_DRIVERLEVEL_REAL_IPCLONE) || defined(CONFIG_DRIVERLEVEL_REAL_IPCLONE_MODULE)
	if (ntohl(iph->saddr) == IPCLONE_WAN1_VIRTUAL_IP)
		idx = 256;
	else if (ntohl(iph->saddr) == IPCLONE_WAN2_VIRTUAL_IP)
		idx = 257;
	else
#endif
		idx = ntohl(iph->saddr) & 0xff;

	spin_lock_bh(&qos_list_lock);

	if (qos_list[idx].updated == 0)
	{
		qos_list[idx].ip = iph->saddr;
		qos_list[idx].command = ADD_IP;
	}
	if (qos_list[idx].command == DEL_IP) // expired and re-communicate almost concurrently
		qos_list[idx].command = 0;

	qos_list[idx].updated = jiffies;

	spin_unlock_bh(&qos_list_lock);
}

static void smart_qos_gc(unsigned long dummy)
{
	int i;

	spin_lock_bh(&qos_list_lock);
	for (i = 0; i < MAX_COUNT; i++)
	{
		if (qos_list[i].updated && ((long)(jiffies - qos_list[i].updated) > (GC_TIMEOUT/2)))
		{
			printk("smart_qos_gc : DEL IP %08x \n", qos_list[i].ip);
			qos_list[i].command = DEL_IP;
		}
	}
	spin_unlock_bh(&qos_list_lock);

	mod_timer(&smart_qos_timer, jiffies + GC_TIMEOUT);
}


static int proc_write_smart_qos(struct file *file, const char *buffer, u_long count, void *data)
{
	if (buffer[0] == '0') // stop smart qos monitor
	{
		smart_qos_mon_callback = NULL;
		del_timer(&smart_qos_timer);
	}
	else if (buffer[0] == '1') // start smart qos monitor
	{
		smart_qos_mon_callback = smart_callback;
		init_timer(&smart_qos_timer);
		smart_qos_timer.function = smart_qos_gc;
		smart_qos_timer.expires = jiffies + GC_TIMEOUT;
		add_timer(&smart_qos_timer);
	}

	spin_lock_bh(&qos_list_lock);
	memset((char *)&qos_list[0], 0, sizeof(struct _qos_list_t) * MAX_COUNT);
	spin_unlock_bh(&qos_list_lock);

	return count;
}

static int proc_read_smart_qos(char *buffer, char **start, off_t offset, int length, int *eof, void *data)
{
	char *p = buffer;
	int len, i;

	p += sprintf(p, "Smart QoS : %s\n\n", (smart_qos_mon_callback) ? "On" : "Off");

	spin_lock_bh(&qos_list_lock);

	// read and clear
	for (i = 0; i < MAX_COUNT; i++)
	{
		if (qos_list[i].command)
		{
			p += sprintf(p, "%c %u.%u.%u.%u\n", 
				(qos_list[i].command == ADD_IP) ? 'N' : 
				(qos_list[i].command == DEL_IP) ? 'D' : 'U', 
				NIPQUAD(qos_list[i].ip));

			if (qos_list[i].command & DEL_IP) 
				qos_list[i].updated = 0;

			qos_list[i].command = 0;
		}
	}

	spin_unlock_bh(&qos_list_lock);

        len = p - buffer;
	if( len <= offset+length ) *eof = 1;
	*start = buffer + offset;
	len -= offset;
	if( len > length ) len = length;
	if( len < 0 ) len = 0;

	return len;
}


static u32 init_smart_qos_proc(void)
{
	struct proc_dir_entry *proc_entry;

	proc_entry = create_proc_entry("smart_qos", 0, 0);
	if (proc_entry != NULL )
	{
		proc_entry->write_proc = &proc_write_smart_qos;
		proc_entry->read_proc = &proc_read_smart_qos;
	}
	return 0;
}

static int __init init(void)
{
	printk("--> Init Smart QoS Monitor\n");
	init_smart_qos_proc();
	//smart_qos_mon_callback = smart_callback;
	smart_qos_mon_callback = NULL;
	memset((char *)&qos_list[0], 0, sizeof(struct _qos_list_t) * MAX_COUNT);
	return 0;
}

static void fini(void)
{
	smart_qos_mon_callback = NULL;
	remove_proc_entry("net/smart_qos", NULL);
	del_timer(&smart_qos_timer);
}

module_init(init);
module_exit(fini);

