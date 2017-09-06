#ifndef _XT_NET_DETECT_H_target
#define _XT_NET_DETECT_H_target

struct xt_net_detect_target_info
{
        unsigned int     limit;
};

struct net_detect_history
{
        unsigned int     ipaddr;
        unsigned char    proto;
        unsigned short   port;
        unsigned int     pcount; /* packet count */
        unsigned int     ecount; /* event count */
        unsigned long    etime;
        unsigned char    flag;
#define NET_DETECT_UPDATED      0x1
};

#define MAX_HISTORY 1000

#endif
