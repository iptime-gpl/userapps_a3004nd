#ifndef __NETDETECT_H__
#define __NETDETECT_H__

struct net_detect_history
{
	unsigned int   id;
	unsigned int     ipaddr;
	unsigned int     proto;
	unsigned int     port;
	unsigned int     ecount;
	time_t        	 etime;
	unsigned int 	 flag;
};

struct net_detect_option
{
	unsigned int     ipaddr;
	unsigned int     proto;
	unsigned int     port;
	time_t        	 etime;
	unsigned int 	 flag;
#define NET_DETECT_UPDATED_FLAG		0x0001     	
#define NET_DETECT_REDIRECT_FLAG	0x8000	
};

#define MAX_HISTORY 1000

#define NET_DETECT_OFF	0
#define NET_DETECT_ON	1

#define NET_DETECT_WELL_KNOWN_PORT      0
#define NET_DETECT_ALL_PORT             1

#define NET_DETECT_MON_LOW_LEVEL        0
#define NET_DETECT_MON_MID_LEVEL        1
#define NET_DETECT_MON_HIGH_LEVEL       2

#define NET_DETECT_MON_LOW_CONNECTION   150
#define NET_DETECT_MON_MID_CONNECTION   100
#define NET_DETECT_MON_HIGH_CONNECTION  40


#define NET_DETECT_BURST_DROP_OFF       0
#define NET_DETECT_BURST_DROP_ON        1

#define NET_DETECT_FIRST_TIME_REPORT_OFF 0     
#define NET_DETECT_FIRST_TIME_REPORT_ON  1
#define NET_DETECT_DEFAULT_REPORT_TIME   9

#define NET_DETECT_REPORT_CLEAR_OFF     0
#define NET_DETECT_REPORT_CLEAR_ON      1

int netdetect_set_on_off(int on);
int netdetect_get_on_off(void);
int netdetect_set_detect_port_range(int mode);
int netdetect_get_detect_port_range(void);
int netdetect_set_monitor_level(int level);
int netdetect_get_monitor_level(void);
int netdetect_set_portrange_and_monitorlevel(int mode, int level);
int netdetect_set_burst_drop(int drop, int virus_drop);
int netdetect_get_burst_drop(void);
int netdetect_get_virus_drop(void);
int netdetect_set_email_policy(int report_time, int first_time, int report_clear);
int netdetect_get_email_policy(int *report_time, int *first_time, int *report_clear);
int netdetect_clear_all_history(void);
int netdetect_read_current_history(void);
struct net_detect_history *netdetect_get_history_by_index(int idx);

void netdetect_write_option(unsigned short id, unsigned int option);
int netdetect_check_and_update_option(unsigned int ipaddr, unsigned proto, unsigned port, time_t now);
void netdetect_set_option_rule(char cmd, char *ipaddr);
int netdetect_read_option_table(void);
void netdetect_write_option_table(void);
struct net_detect_option *netdetect_get_option_by_index(int idx);

int netdetect_make_email_report(void);
char *netdetect_comment_for_specified_port(int proto, int port);
int netdetect_checker(void);

#include "../lib_string.h"

#endif
