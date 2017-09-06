#include <asm/system.h>
#include <asm/bitops.h>
#include <linux/config.h>
#include <linux/types.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/string.h>
#include <linux/mm.h>
#include <linux/socket.h>
#include <linux/sockios.h>
#include <linux/errno.h>
#include <linux/interrupt.h>
#include <linux/if_ether.h>
#include <linux/inetdevice.h>
#include <linux/etherdevice.h>
#include <linux/notifier.h>
#include <linux/skbuff.h>
//#include <linux/brlock.h>
#include <net/sock.h>
#include <linux/rtnetlink.h>
#include <linux/proc_fs.h>
#include <linux/stat.h>
#include <linux/if_bridge.h>
//#include <linux/divert.h>
#include <net/dst.h>
#include <net/pkt_sched.h>
//#include <net/profile.h>
#include <net/checksum.h>
#include <linux/highmem.h>
#include <linux/init.h>
#include <linux/kmod.h>
#include <linux/module.h>
#include <linux/ip.h>
#include <linux/udp.h>
#include <linux/tcp.h>

unsigned char  ipclone_mac[2][6] = {{0,0,0,0,0,0}, {0,0,0,0,0,0}};
unsigned int get_dev_ip( struct net_device *dev )
{
        struct in_device *in_dev;
        struct in_ifaddr **ifap = NULL;
        struct in_ifaddr *ifa = NULL;

        in_dev = (struct in_device *)(dev->ip_ptr);
        if( !in_dev ) return 0;

        ifap = &in_dev->ifa_list;
        ifa=*ifap;
        if(!ifa) return 0;

        return ifa->ifa_local;
}

EXPORT_SYMBOL(ipclone_mac);
EXPORT_SYMBOL(get_dev_ip);

