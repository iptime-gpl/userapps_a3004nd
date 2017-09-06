#include <linosconfig.h>
#define RULENAME_FIELD_PARSE_MODE 0
#define GLOBAL_FIELD_PARSE_MODE 1
#define NETFILTER_FIELD_PARSE_MODE 2
#define NONE_OR_ERROR_PARSE_MODE -1

#define PORTFORWARD_VERSION_STRING "1.0.0"

#if defined(USE_UPNP) || defined(USE_MINIUPNP)
typedef struct __port_map
{
        int m_PortMappingEnabled;
        long int m_PortMappingLeaseDuration;
        char m_RemoteHost[16];
        char m_ExternalPort[6];
        char m_InternalPort[6];
        char m_PortMappingProtocol[4];
        char m_InternalClient[16];
        char m_PortMappingDescription[50];
        int reserve1;
        int reserve2;
} upnpStruct;
#endif

typedef struct __PORTFORWARD_NETFILTER_STRUCT{
#define __MAX_PF_PROTOCOL_LENGTH 8
#define __MAX_PF_IP_LENGTH 20
	/*Data Fields*/
	char protocol[__MAX_PF_PROTOCOL_LENGTH]; //TCP | UDP | GRE + NULL character
	unsigned int ext_sport, ext_eport;
	unsigned int int_sport, int_eport;
	char local_ip[__MAX_PF_IP_LENGTH];	//xxx.xxx.xxx.xxx + NULL character

	/*Next Netfilter Link*/
	struct __PORTFORWARD_NETFILTER_STRUCT *next;
}portforward_nf_t;

#ifdef USE_PORTTRIGGER_V2
typedef struct __PORTTRIGGER_NETFILTER_STRUCT{
#define __MAX_PT_PROTOCOL_LENGTH 8
#define __MAX_PT_FORWARD_LENGTH 10
#define __MAX_PT_IP_LENGTH 20
        /*Data Fields*/
        char trigger_protocol[__MAX_PT_PROTOCOL_LENGTH]; //TCP | UDP + NULL character
        int trigger_sport, trigger_eport;
        char forward_protocol[__MAX_PT_PROTOCOL_LENGTH]; //TCP | UDP + NULL character
        int forward_ports[__MAX_PT_FORWARD_LENGTH];
	char forward_ip[__MAX_PT_IP_LENGTH];

        struct __PORTTRIGGER_NETFILTER_STRUCT *next;
}porttrigger_nf_t;
#endif

typedef struct __PORTFORWARD_RULE_STRUCT{
	/*Each Rule Link Type : single Linked List*/
	struct __PORTFORWARD_RULE_STRUCT *next;
	
	/*Global Fields*/
#ifdef USE_UTF8
#define __MAX_PF_RULE_NAME_LENGTH 512
#else
#define __MAX_PF_RULE_NAME_LENGTH 256
#endif
	char name[__MAX_PF_RULE_NAME_LENGTH];	//(WIDE)127 + NULL character
	unsigned char enable;
	unsigned char fixed;
	unsigned int flag;
#define HAIRPIN_FLAG 0x1
#define WAN1_FLAG 0x100
#define WAN2_FLAG 0x200
	unsigned char invalid;

#define __FORWARD_RULE 0
#define __TRIGGER_RULE 1
	int trigger;

	/*Netfilter Fields*/
	portforward_nf_t *nflist;
#ifdef USE_PORTTRIGGER_V2
	/*Trigger Fields*/
	porttrigger_nf_t *trlist;
#endif
}portforward_rule_t;

typedef struct __PORTFORWARD_LINKED_LIST{
	portforward_rule_t *head;
	portforward_rule_t *tail;
	unsigned int count;
}portforward_ll_t;

#define MAX_PORTFORWARD_RULE_COUNT 100
#define PF_USER_RULE_CHAIN_NAME "app_forward"

void delete_pf_netfilter(portforward_rule_t *rt, portforward_nf_t *nt);
void delete_pf_rule(portforward_ll_t *pf_ll, portforward_rule_t *rt);
void free_portforward_list(portforward_ll_t *pf_ll);
int pf_line_spchar_validate(char *rule_name);
int is_valid_pf_ipv4(char *ipstr);
void init_pf_rule(portforward_rule_t *rt);
void init_pf_netfilter(portforward_nf_t *nt);
void insert_nf_to_rule(portforward_rule_t *rt, portforward_nf_t *nt);
#ifdef USE_PORTTRIGGER_V2
void delete_tr_netfilter(portforward_rule_t *rt, porttrigger_nf_t *tt);
void init_tr_netfilter(porttrigger_nf_t *tt);
void insert_tr_to_rule(portforward_rule_t *rt, porttrigger_nf_t *tt);
portforward_rule_t *portforward_search_by_trigger_port(portforward_ll_t *pf_ll, char *protocol, int trigger_port);
#endif

int portforward_read_db(char *db_name, portforward_ll_t *pf_ll);
int portforward_add_rule(char *db_name, portforward_rule_t *prt, int priority);
int portforward_remove_rule(char *db_name, char *rule_name);
int portforward_remove_rules(char *db_name, char (*namelist)[__MAX_PF_RULE_NAME_LENGTH], int count);
int portforward_modify_rule(char *db_name, portforward_rule_t *prt, int new_priority);
//int portforward_activate_rules(char *db_name, char *rulelist[], int count);
//int portforward_activate_rule(char *db_name, char *rule_name, int enable);
int portforward_update_by_file(char *filename, char *db_name);
int portforward_write_db(char *db_name, portforward_ll_t *pf_ll);
int portforward_update_by_file(char *filename,char *db_name);
void portforward_convert_db();
void portforward_init(char *db_name);

#ifdef USE_UPNP_RELAY
void portforward_upnp_relay_signal(char *cmd, char *name, portforward_nf_t *pnf);
void portforward_upnp_relay_init(char *db_name);
#endif

#ifdef USE_KT_TELECOP
#ifdef L_kt_telecop_trigger
void kt_telecop_trigger_init_triggerv2(void);
void kt_telecop_trigger_forward_triggerv2(char *forward_ip);
#endif
#endif
