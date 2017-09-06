#ifndef FILTERING_RULES_H

#include "urlconfig.h"

#define FILTERING_RULES_H

#define MAX_MULTIPORT 15

#define MAX_RULE_NAME 32
#define MAX_RULE_ALIAS 16
#define MAX_TABLE_NAME 8
#define MAX_CHAIN_NAME 20

#define MAX_IP_ADDRESS 20
#define MAX_INTERFACE_NAME 8
#define MAX_PROTOCOL_NAME 8

#define MAX_MULTIPORT_STRING 256
#define MAX_PORT_RANGE 8
#define MAX_PORT_STRING 8
#define MAX_IP_STRING  32

#define MAX_ADDITIONAL_FILTERING_RULE 64

#define MAX_TARGET_CMD 32
#define MAX_FILTERING_STRING 64

#define MAX_DB_NAME 32

#define INT_APPS_DB_NAME "int_apps"
#define INTERNAL_APPS_DB_FILE "/etc/int_apps.set"
#define MAX_INTERNAL_APPS_DB 30  

#define INT_SERVER_DB_NAME "int_server"
#define INTERNAL_SERVER_DB_FILE "/etc/int_server.set"
#define MAX_INT_SERVER_DB 30 

#define PORT_FORWARD_DB_NAME "port_forward"
#define PORT_FORWARD_DB_FILE "/etc/port_forward.set"
#ifdef USE_DUAL_WAN
#define MAX_PORT_FORWARD_DB_FILE 120
#else
#define MAX_PORT_FORWARD_DB_FILE 60
#endif

#define ACCESS_LIST_DB_NAME "access_list"
#define ACCESS_LIST_DB_FILE "/etc/access_list.set"
#define MAX_ACCESS_LIST_DB_FILE 100

#define DDNS_FORWARD_DB_NAME "ddns_forward"
#define DDNS_FORWARD_DB_FILE "/etc/ddns_forward.set"
#define MAX_DDNS_FORWARD_DB_FILE 20

#ifdef USE_DUAL_WAN
#define LOADSHARE_DB_NAME "loadshare"
#define LOADSHARE_DB_FILE "/etc/loadshare.set"
#ifdef LOADSHARE_EXTENDED_DB
#define MAX_LOADSHARE_DB_FILE 200
#else
#define MAX_LOADSHARE_DB_FILE 60
#endif
#ifdef USE_STRATEGY_ROUTING
#define LS_SR_DB_NAME       "ls_sr"
#define LS_SR_DB_FILE       "/etc/ls_sr.set"
#define MAX_LS_SR_DB_FILE   10
#endif // USE_STRATEGY_ROUTING
#endif

#define DMZ_DB_NAME "dmz"
#define DMZ_DB_FILE "/etc/dmz.set"
#define MAX_DMZ_DB_FILE 1

#ifdef LOADSHARE_EXTENDED_DB
#define MAX_DB_RULES 200   /* max */
#else
#define MAX_DB_RULES MAX_ACCESS_LIST_DB_FILE   /* max */
#endif

#define MAX_TARGET_SIZE 32
typedef struct nat_target_s {
	unsigned int ip_start;
	unsigned int ip_end;
	unsigned short port_start;
	unsigned short port_end;
} nat_target_t;

typedef struct filter_source_s {
	char ip_address[20];
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	char ip_address2[20];
#endif
#endif
	char hw_address[20];
} filter_source_t;

typedef struct policy_target_s {
	unsigned int policy;
#define POLICY_ACCEPT 0x1
#define POLICY_DROP   0x2
#define POLICY_RETURN 0x3
} policy_target_t;

typedef struct netfilter_alias_s { 
	char *alias;
	unsigned int rule_count;  
	char *rule_name;	
} netfilter_alias_t;


typedef struct {
        char rule_name[MAX_RULE_NAME];
        char table_name[MAX_TABLE_NAME]; /* iptables table name */
        char chain_name[MAX_CHAIN_NAME];
        char iifname[MAX_INTERFACE_NAME];
        char oifname[MAX_INTERFACE_NAME];
        unsigned int src_ip;
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	unsigned int src_ip2;
#endif
#endif
	unsigned int src_mask;
        unsigned int dst_ip;
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	unsigned int dst_ip2;
#endif
#endif
	unsigned int dst_mask;
        char protocol[MAX_PROTOCOL_NAME];
        /* only tcp/udp rule options */
        unsigned short src_port_start;
        unsigned short src_port_end;
        unsigned short dst_port_start;
        unsigned short dst_port_end;
        unsigned short not_flag;
	char additional_filter[MAX_FILTERING_STRING];
	int flag;
	int target_type;
	union {
		nat_target_t nat; 
		policy_target_t policy; 
		char target_string[MAX_TARGET_SIZE];
		unsigned int rtmark;
	} u;
} old_netfilter_rule_t;

typedef struct netfilter_rule_s {
/*
 * To add more variables, you should append it to the end of this structure
 * and then modify two functions "netfilter_read_rule_db" and "netfilter_write_rule_db".
 * That's maybe the best way to keep compatibility on fread/fwrite.
 *
 */
        char rule_name[MAX_RULE_NAME];
        char table_name[MAX_TABLE_NAME]; /* iptables table name */
        char chain_name[MAX_CHAIN_NAME];

        char iifname[MAX_INTERFACE_NAME];
        char oifname[MAX_INTERFACE_NAME];
        unsigned int src_ip;
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	unsigned int src_ip2;
#endif
#endif
	unsigned int src_mask;
#define IP_RANGE_BASE_MASK 0x20
        unsigned int dst_ip;
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	unsigned int dst_ip2;
#endif
#endif
	unsigned int dst_mask;
        char protocol[MAX_PROTOCOL_NAME];
        /* only tcp/udp rule options */
        unsigned short src_port_start;
        unsigned short src_port_end;
        unsigned short dst_port_start;
        unsigned short dst_port_end;
        unsigned short not_flag;
#define SRC_IP_NOT 0x1
#define DST_IP_NOT 0x2
#define SRC_PORT_NOT 0x4
#define DST_PORT_NOT 0x8
#define PROTOCOL_NOT    0x10
#define ICMP_TYPE_NOT 0x20 
#define INPUT_INTERFACE_NOT  0x40 
#define OUTPUT_INTERFACE_NOT 0x80 

	char additional_filter[MAX_FILTERING_STRING];
	int flag;
#define INTERNAL_FORWARD_RULE 0x1
#define REMOVE_SCHEDULE_FLAG  0x2
#define WAN1_INPUT_FLAG       0x4
#define WAN2_INPUT_FLAG       0x8
#define URL_FILTER_FLAG	      0x10
#define PORT_FILTER_FLAG      0x20
#define FILTER_RULE_DISABLE   0x40
#define FILTER_RULE_OUTOF_SCHED   0x80

	int target_type;
#define DNAT_TARGET 0x1
#define SNAT_TARGET 0x2
#define MASQUERADE_TARGET  0x3
#define POLICY_TARGET 0x4  /* accept or drop */
#define APPS_TARGET 0x5
#define RTMARK_TARGET 0x6
#define FILTER_DNAT_TARGET 0x7
	union {
		nat_target_t nat; 
		policy_target_t policy; 
		char target_string[MAX_TARGET_SIZE];
		unsigned int rtmark;
	} u;
/*
 * Additional variables that doesn't exist at old_netfilter_rule_t
 */
        char rname[MAX_RULE_NAME];
} netfilter_rule_t;


typedef struct rule_db_s {
	int db_version;
#define NETFILTER_DB_VER 0x1
	int rule_count;
	netfilter_rule_t rule[MAX_DB_RULES];
} rule_db_t;


#ifdef USE_PORT_TRIGGER
/*--------    Port Trigger Rule : Start    --------*/
#define PORT_TRIGGER_DB_NAME 	"porttrigger"
#define PORT_TRIGGER_DB_FILE 	"/etc/porttrigger.set"
#define MAX_PT_DB_RULES  	10

#ifdef USE_KT_TELECOP
#define KTT_PORT_TRIGGER_DB_NAME 	"ktt_porttrigger"
#define KTT_PORT_TRIGGER_DB_FILE 	"/etc/ktt_porttrigger.set"
#define KT_TELECOP_TRIGGER_IP   "121.170.197.180"
#endif

typedef struct port_trigger_rule_s {
	char rule_name[MAX_RULE_NAME];

	char trigger_chain_name[MAX_CHAIN_NAME];
	char trigger_proto[MAX_PROTOCOL_NAME];	
	unsigned short trigger_port[2];

	char forward_chain_name[MAX_CHAIN_NAME];
	char forward_proto[MAX_PROTOCOL_NAME];	
	unsigned short forward_port[5];
        unsigned int forward_ip;

	int flag;
} port_trigger_rule_t;

typedef struct pt_rule_db_s {
	int rule_count;
	port_trigger_rule_t rule[MAX_PT_DB_RULES];
} pt_rule_db_t;

/*--------    Port Trigger Rule : End      --------*/
#endif


int netfilter_execute_rule( netfilter_rule_t *rule, char cmd , int idx);
int netfilter_read_rule_db(char *db_file, rule_db_t *rule_db);
int netfilter_write_rule_db(char *db_file, rule_db_t *rule_db);
int netfilter_add_rule(rule_db_t *rule_db, netfilter_rule_t *nf_rule);
int netfilter_remove_rule_by_index(rule_db_t *rule_db, int idx );
int netfilter_remove_rule_by_name(rule_db_t *rule_db, char *rule_name);
netfilter_rule_t* netfilter_search_rule_by_name(rule_db_t *rule_db, char *alias);
int netfilter_execute_postroute_rule( netfilter_rule_t *nf_rule, char cmd );
int netfilter_execute_inpublic_preroute(netfilter_rule_t *rule, char cmd, char *chain);
int netfilter_remove_rule_by_indexlist(rule_db_t *rule_db, int *idxlist, int size );
int netfilter_clear_all_db(void);
int netfilter_setup(void);

#ifdef USE_PORT_TRIGGER
int port_trigger_execute_rule( port_trigger_rule_t *rule, char cmd );
int port_trigger_read_rule_db(char *db_file, pt_rule_db_t *rule_db);
int port_trigger_write_rule_db(char *db_file, pt_rule_db_t *rule_db);
int port_trigger_add_rule(pt_rule_db_t *rule_db, port_trigger_rule_t *pt_rule);
int port_trigger_remove_rule_by_index(pt_rule_db_t *rule_db, int idx );
int port_trigger_remove_rule_by_indexlist(pt_rule_db_t *rule_db, int *idxlist, int size );
int port_trigger_remove_rule_by_name(pt_rule_db_t *rule_db, char *rule_name);
port_trigger_rule_t* port_trigger_search_rule_by_name(pt_rule_db_t *rule_db, char *rule_name);
int port_trigger_setup(void);
int port_trigger_clear_all_db(void);

#ifdef USE_KT_TELECOP
void kt_telecop_trigger_init(void);
void kt_telecop_trigger_forward(char *forward_ip);
#endif
#endif

int netfilter_execute_rule_list( netfilter_rule_t *rule, char cmd, int count );

/***** Application rule definition *****/ 
typedef struct app_template_s {
#define MAX_APP_RULE_ALIAS 16
#define MAX_APP_RULE_NAME 32
	char rulealias[MAX_APP_RULE_ALIAS];
	char rulename[MAX_APP_RULE_NAME];
	int rule_count;
#define USER_DEFINED_FLAG	0x8000
#define WITH_URL_FILTER_FLAG	0x1000
#define CHECKED_RULE_FLAG	0x10000000
	int flag;
	old_netfilter_rule_t *rule_list;
#ifdef USE_NEW_LIB
	int url_rule_count;
	filter_string_t  *url_rule_list;
	int priority;
	int reserved;
#endif
} app_template_t;

typedef struct app_rule_db_s {
	int count;
	char template_filename[32];
	char db_filename[32];
#ifdef USE_NEW_LIB
#define MAX_APP_TEMPLATE_RULE 200
#else
#define MAX_APP_TEMPLATE_RULE 40 
#endif
	app_template_t temp_list[MAX_APP_TEMPLATE_RULE];
} app_rule_db_t;

#define APP_FIREWALL_DB_FILE "/etc/app_firewall.set"
#define APP_VIRTUALSERVER_DB_FILE "/etc/app_virtual.set"
#define APP_PORTTRIGGER_DB_FILE "/etc/app_porttriger.set"

#define APP_FIREWALL_TEMPLATE "/var/firewall_rule"
#define APP_VIRTUALSERVER_TEMPLATE "/var/virtsvr_rule"
#define APP_PORTTRIGGER_TEMPLATE "/var/porttrigger_rule"

void netfilter_app_init(void);
int netfilter_read_app_ruledb( app_rule_db_t *app_rule_db, char *dbfile , char *template_file); 
int netfilter_write_app_ruledb( app_rule_db_t *app_rule_db );
int netfilter_close_app_ruledb( app_rule_db_t *app_rule_db );

int netfilter_add_app_rule( app_rule_db_t *app_rule_db, app_template_t *templ );
int netfilter_remove_app_rule( app_rule_db_t *app_rule_db, char *rule_name );
int netfilter_modify_app_rule( app_rule_db_t * app_rule_db, app_template_t *n_templ);
int netfilter_disable_app_rule( app_rule_db_t *app_rule_db, int *idxlist, int size);

int netfilter_remove_app_rulelist( app_rule_db_t *app_rule_db, char *rule_name_list, int count );
int netfilter_fill_app_rule_template_by_rulename( app_rule_db_t *app_rule_db,
                 char *rulename,
                 void *target_data,
                 app_template_t *templ );

#endif

