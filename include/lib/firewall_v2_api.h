#include <linosconfig.h>

#define RULENAME_FIELD_PARSE_MODE 0
#define GLOBAL_FIELD_PARSE_MODE 1
#define NETFILTER_FIELD_PARSE_MODE 2
#define NONE_OR_ERROR_PARSE_MODE -1

#define DEFAULT_FIREWALL_DB_PATH "/etc/user_fw.set"
#define DEFAULT_FIREWALL_STATUS_PATH "/var/run/stat_fw.set"

#define FW_ACTION_ADD "add"
#define FW_ACTION_DEL "delete"
#define FW_ACTION_INS "insert"

#define MAX_FW_FILTER_RULE_COUNT 200

#define FW_VERSION_STRING "1.0.0"

typedef struct __FIREWALL_NETFILTER_STRUCT{
#define __DIRECTION_MAX_LENGTH 8
	char direction[__DIRECTION_MAX_LENGTH];
#define __SRC_ADDRESS_TYPE_LENGTH 8
	char src_addr_type[__SRC_ADDRESS_TYPE_LENGTH];
#define __IPADDRESS_MAX_LENGTH 32
	char src_sip[__IPADDRESS_MAX_LENGTH];
	char src_eip[__IPADDRESS_MAX_LENGTH];
	char dst_sip[__IPADDRESS_MAX_LENGTH];
	char dst_eip[__IPADDRESS_MAX_LENGTH];
#define __MACADDRESS_MAX_LENGTH 32
	char src_mac[__MACADDRESS_MAX_LENGTH];
#define __URL_MAX_LENGTH 256
	char url[__URL_MAX_LENGTH];
#define __PROTOCOL_MAX_LENGTH 8
	char protocol[__PROTOCOL_MAX_LENGTH];
	
	int dst_sport;
	int dst_eport;
#define __ACCEPT_POLICY_VALUE 1
#define __DROP_POLICY_VALUE 0
	int policy;

	struct __FIREWALL_NETFILTER_STRUCT *next;
} fw_nf_t;

typedef struct __FIREWALL_RULE_STRUCT{
#ifdef USE_UTF8
#define __MAX_RULE_NAME_LENGTH 512
#else
#define __MAX_RULE_NAME_LENGTH 256
#endif
	char rule_name[__MAX_RULE_NAME_LENGTH];

	int enable;
	int day;
	int stime;
	int etime;
#define __FW_FLAG_NETFILTER_RULE 0x0
#define __FW_FLAG_WIFI_RULE 0x1
	int flag;	

	fw_nf_t *nflist;

#define __MAX_BAND_STRING_LENGTH 8
	char band[__MAX_BAND_STRING_LENGTH];

	struct __FIREWALL_RULE_STRUCT *next;
} fw_rule_t;

typedef struct __FIREWALL_LINKED_LIST{
	int count;

	fw_rule_t *head;
	fw_rule_t *tail;
} fw_ll_t;
//Utility functions
void init_fw_netfilter(fw_nf_t *nt);
void init_fw_rule(fw_rule_t *rt);
int fw_spchar_validate(char *vstr);
int validate_ipv4_addr(char *ipstr);
int validate_mac_addr(char *macaddr);
void delete_fw_rule(fw_ll_t *fw_ll, fw_rule_t *rt);
void delete_fw_netfilter(fw_rule_t *rt, fw_nf_t *nt);
//Utility functions end

//DB API functions
int fw_read_status(char *statusfile, char **list);
int fw_write_status(char *statusfile, char **list);
void free_fw_status_list(char **list);
void insert_rule_to_list(fw_ll_t *fw_ll, fw_rule_t *rt);
void convert_mac_addr(char *macaddr);
void convert_url_to_new(char *original, char *converted);

int fw_validate_data(fw_ll_t *fw_ll);
void apply_fw_list(char *statusfile, fw_ll_t *fwlist, time_t refer, int tmode);
void free_fw_list(fw_ll_t *fw_ll);
int fw_write_db(char *db_name, fw_ll_t *fw_ll);
int fw_read_db(char *db_name, fw_ll_t *fw_ll);
int fw_add_db(char *db_name, char *statusfile, fw_rule_t *prt, int priority);
//int fw_delete_db(char *db_name, char *statusfile, char *rule_name);
int fw_delete_rules(char *db_name, char *statusfile, char (*namelist)[__MAX_RULE_NAME_LENGTH], int count);
int fw_modify_db(char *db_name, char *statusfile, fw_rule_t *prt, int new_priority);
int firewall_update_by_file(char *filename, char *statusfile, char *dbname);
int get_fw_active_nf_rule_count();
//DB API functions end
