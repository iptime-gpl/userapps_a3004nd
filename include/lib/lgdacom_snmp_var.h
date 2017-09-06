#ifndef _SNMP_VAR_API_H_
#define _SNMP_VAR_API_H_

#define QOS_HFC         0
#define QOS_XDSL        1
#define QOS_DISABLE     2


extern void snmp_read_get_community_config(char *community);
extern void snmp_write_get_community_config(char *community);
extern void snmp_read_set_community_config(char *community);
extern void snmp_write_set_community_config(char *community);
extern int snmp_read_access_ipgroup(int idx, char *ipgroup);
extern int snmp_write_access_ipgroup(int idx, char *ipgroup);
extern void snmp_init_access_ipgroup(void);

extern int lgdacom_qos_get_config (int *mode, int *bandwidth);
extern int lgdacom_qos_set_config (int mode, int bandwidth);
extern int lgdacom_qos_xdsl(void);

#endif
