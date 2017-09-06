#ifndef _TC_COMMAND_H_
#define _TC_COMMAND_H_

#define TC_ADD  	0
#define TC_DEL  	1
#define TC_CHANGE	2

#define IPPROTO_ANY     0

#define QDISC_ROOT	0
#define QDISC_SUB_ROOT	1

#define CLASS_MAIN 	1

#define TC_DOWN    	0
#define TC_UP    	1

int tc_enable_command(void);
int tc_disable_command(char *wan_name);
int root_qdisc_command(int command, int id, Max_Bandwidth *MaxBand);
int class_command(int command, Max_Bandwidth *MaxBand, Class *myclass, int bpi_idx);
int filter_command(int command, Class *myclass, Filter *filter);
#ifdef USE_DUAL_WAN
int tc_dual_wan_init_command(int mode);
#endif

#endif
