#ifndef __API__H
#define __API__H

#include "listhead.h"

#ifdef USE_DDNS_CLIENT
#define DDNS_CLIENT "ddns_client"
#endif

#define INTEGRATED_CONFIG_FILE "/etc/iconfig.cfg"
#define INTEGRATED_DEFAULT_FILE "/default/etc/iconfig.cfg"
//#define INTEGRATED_DEFAULT_FILE "/etc/idefault.cfg"
#define INTEGRATED_STATUS_FILE "/var/run/istatus"
#define INTEGRATED_PID_FILE "/var/run/pidstatus"
#define	HARDWAREINFO_FILENAME "/var/run/hwinfo"
#define ICONFIG_MAX_VALUE 1024

#define PVLAN_CPU_PORT_BIT 0x80000000
#define PVLAN_MULTICAST_BIT 0x40000000


#ifdef USE_QOS
#define TC_PRIORITY_ORDER_FILE  "/etc/tc_prio_order"
#define TC_LOCK_FILE_NAME       "tc_lock_file"
#endif

#ifdef USE_SMART_QOS
#if defined(USE_BCM470X) || defined(USE_MV6281) || (USE_MT7620) || (USE_QCA)
#define PROC_SMART_QOS "/proc/smart_qos"
#else
#define PROC_SMART_QOS "/proc/net/smart_qos"
#endif
#endif

#include "time_cgi.h"
#include "filter_rule.h"
#include "pptpvpn_conf.h"
#include "rt_db.h"
#include "urlconfig.h"
#include "wireless.h"
#include "cm_struct.h"
#include "pppinfo.h"
#ifdef USE_NEW_LIB
#include "dmztwinip.h"
#ifdef USE_ACCESS_LIST
#include "accesslist.h"
#endif
#endif
#include "sched/sched.h"
#include "tc/tc.h"

#ifdef USE_IP_MAC_BIND
#include "static_ipmac_bind.h"
#endif

#ifdef USE_CMU_SNMPD
#include "lgdacom_snmp_var.h"
#endif

#ifdef USE_SYSINFO
#include "sysinfo.h"
#endif
typedef struct ppp_option_s {
#define MAX_PPPOE_ID 128
	char id[MAX_PPPOE_ID];
#ifdef USE_SPECIAL_PPPOE_ENCODE
#define MAX_PPPOE_PASSWORD 2048
	char password[MAX_PPPOE_PASSWORD];
#else
#define MAX_PPPOE_PASSWORD 128
	char password[MAX_PPPOE_PASSWORD];
#endif
	char local_ip[20];
	char remote_ip[20];
	int lcp_flag;
	int lcp_echo_interval;
	int lcp_echo_failure;
	int idle_time;
	int mtu;
#ifdef USE_SPECIAL_PPPOE_ENCODE
	char encode[32];
#endif
} ppp_option_t;


typedef struct pptp_option_s {
	ppp_option_t ppp_opt;
	char server_ip[20];
	int mppe_flag;
} pptp_option_t;

int system2(char *format, ...);

/* cgi_api.c */
int decode_string(char *val);
extern int maccmp(char *m1,char *m2);
int macncmp(char *mac1, char *mac2, int n);
extern char *collapse(char *str, int size);
extern int get_value(char *argv[], char *key, char *value, int max);
extern char *get_pvalue(char *argv[], char *key);
extern int get_intvalue(char *argv[], char *key, int *value);
extern int get_value_array(char *argv[], char *key, int idx, char *value, int max);
extern char *get_pvalue_array(char *argv[], char *key, int idx);
extern int get_value_array_post(char *post, char *key, int idx, char *value, int max);
extern int get_value_post(char *post, char *key, char *value, int max);
extern int get_intvalue_post(char *post, char *key, int *intvalue );
int get_value_op(char *argv[], char *post, char *key, char *value);
extern char *get_post_line(char *start, int len, char *line_data);
extern entry_t *parse_multipart_data(void);
extern void entry_free(entry_t *entry_head);
extern char *get_multipart_data_value(entry_t *entry_head, char *name);
extern char *memsearch(char *input, char *key, int size);
extern int get_filename(char *disposition, char *filename, int max_filename);
extern int get_name(char *disposition, char *name, int max);
extern char *make_conf_filename(char *file, char *ext);
extern int get_value_post_multipart_file(char *post, char *key, char **fileptr, char *filename, int max_filename,int *len);
extern int get_value_post_multipart(char *post, char *key, char *value, int max);
extern char *post_process(void);
extern int strtocap( char *string );
/* cgi_common.c */
extern void main_frame(int flag);
extern void print_html_title(char *main_title, char *title);
extern void print_html_ip_address(char *name, char *ip_addr, int type);
extern void print_html_list_table(char *name, int size, int type);
extern void print_js_check_range(void);
extern void print_js_check_optional_range(void);
extern void print_js_check_hardware_range(void);
extern void print_js_iprange_check( char *formname, char *startip, char *endip, char *alert, int ret, int elseflag );
#ifdef USE_NEW_LIB
extern void print_js_progress_bar(int time_value);
#else
extern void print_js_progress_bar(int time_value, char *cgi_name, int status);
#endif
extern int print_js_common(void);
extern void remote_connect_write_log(void);

#ifdef USE_NEW_LIB
extern void print_html_progress_bar(int waittime, int width, int res);
#else
extern void print_html_progress_bar(int time_value);
#endif
extern void print_sub_title(char *title, int width);
#ifdef USE_NEW_LIB
extern void print_item_desc(char *item, int width, int left,int right, char *option);
#else
extern void print_item_desc(char *item, int width);
#endif
extern void print_item_desc_option(char *item, int width, char *option);
extern void print_blank_line(int colspan, int height);
#ifdef USE_NEW_LIB
extern void print_item(char *item, int width, int left, int right, char *option);
#else
extern void print_item(char *item, int width);
#endif
extern void print_nbsp(int n);
extern void str(void);
extern void etr(void);
extern void br(void);
extern void print_item_start(int width, int cols);
extern void print_smallitem_start(int width, int cols);
extern void print_item_align_start(int width, int cols, char *align);
extern void print_item_end(void);
extern void print_itemdesc_start(int width, int cols);
extern void print_smallitemdesc_start(int width, int cols);
extern void print_itemdesc_end(void);
extern void print_class_string(char *string, char *class);
extern void print_class_td(char *class, int width, int height, int cols, char *align);
extern void etd(void);
extern void print_radio_bt(char *name, char *value, char *onclick, char *desc, int check);
extern void print_hidden_type(char *name, char *value);
extern void print_button(char *name, char *value, char *onclick, int flag);
extern void print_popup_button(char *l, char *popup_name, char *popup_opt, char *buttonname, char *buttonvalue, int flag);
extern void print_popup_button_alert( char *l, char *popup_name, char *popup_opt, char *buttonname, char *buttonvalue, int flag, char *alert_msg );
#ifdef USE_NEW_LIB
extern void print_hwaddress_inputbox(char *prefix, char *default_value, int disabled);
#else
extern void print_hwaddress_inputbox(char *formname, char *prefix, char *default_value, int disabled);
#endif
extern void print_js_ip_check(char *formname, char *input_prefix, char *alert_msg, int else_flag, int option);
extern void print_js_mask_check(char *formname, char *input, char *alert_msg, int else_flag);
extern void print_js_port_check(char *formname, char *input, char *alert_msg, int else_flag);
extern void print_js_hardware_check(char *formname, char *input_prefix, char *alert_msg, int else_flag);
extern void print_js_ip_enable(char *formname, char *input_prefix, char enable);
extern void print_js_hw_enable(char *formname, char *input_prefix, char enable);
extern void print_js_hw_value(char *formname, char *input_prefix, char *hardware);
extern int get_ip_value_op( char *argv[], char *post, char *input_prefix, char *ip_addr );
extern int get_ip_value_post( char *post, char *input_prefix, char *ip_addr );
#ifdef USE_NEW_LIB
int get_hw_value_post( char *post, char *input_prefix, char *hw_addr );
int strtomac( char *hw_addr, unsigned char *retmac);
#endif
extern int get_ip_value(char *argv[], char *input_prefix, char *ip_addr);
extern int get_hw_value(char *argv[], char *input_prefix, char *hw_addr);
extern char *get_remote_addr(void);
extern int convert_mac(char *hwaddr);
extern int convert_mac2(char *hwaddr);
extern char *strtoupper(char *string);
extern char *strtolower(char *string);
extern int strtomac( char *macstr , unsigned char *mac);
extern int print_start_form( char *cgi_name, char *method, char *formname, char *tmenu, char *smenu);
extern int print_start_main_table(void);
extern int print_end_main_table(void);
extern int print_start_content_table(void);
extern int print_end_content_table(void);
extern int print_end_table(void);
extern int print_end_form(void);
#ifdef USE_NEW_LIB
extern void print_input_select( char *option_list, char *value_list, char deli, char *select_name, char *onchange_script,  char*selected_value);
#else
extern void print_input_select( char *option_list, char *value_list, char deli, char *select_name, char *onchange_script,  char*selected_value, int item);
#endif
extern void print_input_hidden(char *name, char *initial_value);
extern void print_input_radio_bt( char *name, char *value, char *option , char *desc , int check, int item);


extern void print_input_text( char *name, char *initial_value, int size, int maxlength, char *opt , int item);
extern void print_input_passwd( char *name, char *initial_value, int size, int maxlength, char *opt , int item);
extern void print_input_button( char *name, char *initial_value, char *opt , int item);
extern void print_script_start(void);
extern void print_script_end(void);
extern void print_input_checkbox(char *name, char *initial_value, char *opt, int checked, int item );
extern void print_page_refresh_meta( char *url, int refresh_time);




extern void print_tab_title( char *title, char *alink, int selected , int width);
extern void print_start_tab_main(char colspan, int width);
extern void print_end_tab_main(void);
extern void print_tab_blank( int width );


int check_remote_connection(void);




/* dhcp_api.c */
extern int dhclient_stop(char *ifname);
/* dual_wan_api.c */
extern int get_default_gateway(char *ifname, char *gw);
extern int set_default_gateway(char *ifname, char *gw);
extern int set_default_gateway2(char *ifname, char *ip, char *mask, char *gw);
extern int save_internal_network_configuration(char *ip, char *netmask);
extern int save_external_network_configuration(char *ifname, char *ip, char *netmask, char *gw);
extern int apply_network_configuration(void);
extern int get_wan_ifname(char *wan_name, char *ifname);
extern int wan_is_alive(char *wan_name);
/* encrypt_api.c */
extern int encode_file(char *file, int headersize);
extern int encode_auth_file(char *file, char *output, int headersize);
/* ippool_api.c */
extern int add_ippool(char *start_ip, char *end_ip);
extern int remove_ippool(int idx);
extern int read_ippool(ippool_db_t *pool_db);
extern int write_ippool(ippool_db_t *pool_db);
extern int get_iprange_from_pool(int idx, char *sip, char *eip);
extern int check_ippool_range(char *sip, char *eip);
extern int apply_ippool(void);
/* iproute_api.c */
extern int iproute_set_default_gw(char *ifname, char *gw, int table);
extern int iproute_get_default_gw(char *ifname, char *gw, int table);
extern int iproute_get_routing_table_id(char *ifname);
extern int iproute_set_default_routing_table(char *wan_name);
extern int iproute_get_default_routing_table(char *wan_name);
/* iptables_api.c */
extern int get_firewall_rule_count(void);
extern int remove_firewall_rule(int line);
extern int get_port_forward_rule_count(char *filename);
extern int remove_port_forward_rule(char *filename, int line);
extern int read_ddns_chain_status(void);
extern int check_ddns_chain_status(char *ip);
extern int save_ddns_chain_status(void);
extern int destroy_ddns_chain(char *ip);
extern int delete_all_ddns_rule(char *ip);
/* netfilter_api.c */
extern int netfilter_execute_rule(netfilter_rule_t *rule, char cmd, int idx);
extern int netfilter_execute_postroute_rule(netfilter_rule_t *nf_rule, char cmd);
extern int netfilter_read_rule_db(char *db_file, rule_db_t *rule_db);
extern int netfilter_write_rule_db(char *db_file, rule_db_t *rule_db);
extern int netfilter_add_rule(rule_db_t *rule_db, netfilter_rule_t *nf_rule);
extern int netfilter_modify_rule(rule_db_t *rule_db, netfilter_rule_t *nf_rule, int modify_idx);
extern int netfilter_remove_rule_by_index(rule_db_t *rule_db, int idx);
extern int netfilter_remove_rule_by_indexlist(rule_db_t *rule_db, int *idxlist, int size);
extern int netfilter_disable_rule_by_indexlist(rule_db_t *rule_db, int *idxlist, int size);
extern int netfilter_remove_rule_by_name(rule_db_t *rule_db, char *rule_name);
extern netfilter_rule_t *netfilter_search_rule_by_name(rule_db_t *rule_db, char *rule_name);
extern int netfilter_setup(void);
extern int netfilter_setup(void);
extern int netfilter_clear_all_db(void);
extern int netfilter_execute_inpublic_preroute(netfilter_rule_t *rule, char cmd, char *chain);
extern int netfilter_execute_rule_list(netfilter_rule_t *rule, char cmd, int count);
#ifdef USE_APPS_TEMPLATE
/* netfilter_template_api.c */
extern int netfilter_read_app_ruledb(app_rule_db_t *app_rule_db, char *dbfile, char *template_file);
extern int netfilter_write_app_ruledb(app_rule_db_t *app_rule_db);
extern int netfilter_close_app_ruledb(app_rule_db_t *app_rule_db);
extern int netfilter_add_app_rule(app_rule_db_t *app_rule_db, app_template_t *templ);
extern int netfilter_remove_app_rulelist(app_rule_db_t *app_rule_db, char *rule_name_list, int count);
extern int netfilter_modify_app_rule( app_rule_db_t * app_rule_db, app_template_t *n_templ);
extern int netfilter_disable_app_rule( app_rule_db_t *app_rule_db, int *idxlist, int size);
extern int netfilter_fill_app_rule_template_by_rulename(app_rule_db_t *app_rule_db, char *rulename, void *target_data, app_template_t *templ);
extern void netfilter_app_init(void);
#endif
/* network_api.c */
typedef struct interface_stat_s {
        unsigned int rxpackets;
        unsigned int rxbytes;
        unsigned int rxerror;
        unsigned int txpackets;
        unsigned int txbytes;
        unsigned int txerror;
} interface_stat_t;
extern int get_interface_stat( char *ifname, interface_stat_t *st);
extern int get_ifindex(char *ifname);
extern int get_mtu_value( char *ifname, int from );
extern int init_mtu_value( void );
extern int set_mtu_value( char *ifname, int mtu);
extern char *get_wan_name(char *ifname, int type);
extern int get_wan_ifname(char *wanname, char *ifname);
extern int get_wan_hw_ifname(char *wanname, char *ifname);

int get_wanidx_by_name(char *wan_name);

extern int get_ifexist(char *ifname);
extern int get_ifconfig(char *ifname, char *ip, char *netmask);
extern int get_ifstatus(char *ifname);
extern int get_wan_exist(void);
#ifdef USE_NEW_LIB
extern int get_netaddr(char *ifname, char *netaddr);
extern int get_localbroadaddr(char *ifname, char *netaddr);
extern int switch_set_dscp_port( int port, int rx, int tx );
extern int switch_add_dscp_value( int dscp );
extern int switch_remove_dscp_value( int dscp );

#ifdef USE_IPTIME_SERVICE_NETWORK
extern int set_iptime_service_network(char *srv_network);
extern int get_iptime_service_network(char *srv_network);
extern char *get_twinip_wan_virtual_ip(char *wan_name);
#endif

int detect_and_log_ip_confliction(void);

int get_routerap_mode(void);
int set_routerap_mode(int mode);
int apply_routerap_mode(int mode);
void init_routerap_mode(void);
#define ROUTER_MODE_NAT 1
#define ROUTER_MODE_SWITCH 2
#define ROUTER_MODE_WDS_SLAVE 4

#endif
extern int get_netmask_bit_count(char *netmask);
extern int set_ifconfig(char *ifname, char *ip, char *netmask);
extern int get_external_network_info(char *wan_name, char *info);
extern int get_wan_string(char *info, char *msg);
extern int set_external_network_info(char *wan_name, char *info);
extern int check_default_gateway(char *gateway, char *ip, char *subnet);
extern int get_hardware_address(char *ifname, char *hw_addr);
extern int get_hardware_address_raw(char *ifname, unsigned char *hw_addr);
extern int set_hardware_address(char *ifname, char *hw_addr);
extern int read_hardware_address(char *file,char *hw_addr);
extern int save_hardware_address(char *filename,char *hw_addr);
extern int get_internal_network_info(char *info);
extern int set_internal_network_info(char *info);
extern int get_lan_info(char *info);
extern int set_lan_info(char *info);
extern int get_link_status(int port, link_status_t *lnk);
extern int get_port_stat(int port, port_stat_t *stt );
extern int clear_port_statistics(void);
extern int select_port_stat_category(int category);
extern int get_port_config(int port, link_status_t *lnk);
extern int set_port_config(int port, link_status_t *lnk);
extern int read_port_conf_info(link_status_t lnk[], int size);
extern int write_port_conf_info(link_status_t lnk[], int size);

int get_lan_ipconfig(char *ip, char *netmask, char *gw);
int set_lan_ipconfig(char *ip, char *netmask, char *gw);

#ifdef USE_NEW_LIB
extern int read_portconfig(int port, link_status_t *lnk);
extern int write_portconfig(int port, link_status_t *lnk);
extern int init_portconfig(void);
#endif

extern int get_wan_link(char *wanname);
extern int get_internal_pc_hardware_address(char *ip_addr, char *hw_addr);
extern int get_any_hardware_address_by_interface(char *ifname, char *hw_addr);
extern int get_hardware_address_with_maxcount_by_interface( char *ifname , char (*hw_addr)[18], int max_count );
extern int set_ftp_private_port(int *port, int max_port);
extern int write_ftp_private_port(int *port, int max_port);
extern int read_ftp_private_port(int *port, int max_port);
extern int write_h323_port(int port);
extern int read_h323_port(int *port);
extern int setup_h323_port(void);
extern int read_rt_db(rt_db_t *rt_db);
extern int write_rt_db(rt_db_t *rt_db);
extern int sync_rt_db( char *ip_address );
extern int kernel_route(rt_entry_t *rt_entry, char action);
extern int add_rt_entry(rt_db_t *rt_db, rt_entry_t *rt_entry, int idx);
extern int delete_rt_entry_list(rt_db_t *rt_db, int *idxlist, int size);
extern void setup_route(void);
extern int ifdownup(char *ifname);
extern int get_wansetup_status(char *wan_name);
extern int set_wansetup_status(char *wan_name, int status);
extern int set_autodns(int status);
extern int get_autodns(void);
extern int set_dhclient_block_private_ip(char *ifname, int flag);
extern int get_dhclient_block_private_ip(char *ifname);
extern int set_dhcp_lease_time(char *ifname, int lease_time);
extern int get_dhcp_lease_time(char *ifname);
extern int clear_dhcp_lease_time(char *ifname);
extern int decrease_dhcp_lease_counter(char *ifname, int gap);
extern int get_dhcp_lease_counter(char *ifname);
extern int set_proxy_dns(char *old_dns1, char *dns1, char *ifname);
extern int init_proxy_dns(void);
extern int ifdown(char *ifname);
extern int ifup(char *ifname);
extern int ifset_flags(char *ifname, int flags);
extern int ifset_broadcast(char *ifname, int flag);
extern int get_wan_ip(char *wan_name, char *ip_addr);
extern int get_default_ip(char *ip);
extern int get_ip_by_hwaddr(char *ip_addr, char *hw_addr);
extern int get_hostinfo_from_bridge(int portnum, int max, hostinfo_t *hinfo);
extern int get_hostinfo_from_arp(char *ifname, int max, hostinfo_t *hinfo);
extern int set_loadshare_wrr(int on, int w1weight, int w2weight);
extern int get_loadshare_wrr(int *w1weight, int *w2weight);
extern int set_loadshare_ipwrr(int on, int force);
extern int get_loadshare_ipwrr(void);
extern int set_wan_backup_status(int wan1status, int wan2status);
extern int get_wan_backup_status(int *wan1status, int *wan2status);
#ifdef USE_PORT_TRIGGER
/* port_trigger_api.c */
extern int port_trigger_execute_rule(port_trigger_rule_t *rule, char cmd);
extern int port_trigger_read_rule_db(char *db_file, pt_rule_db_t *rule_db);
extern int port_trigger_write_rule_db(char *db_file, pt_rule_db_t *rule_db);
extern int port_trigger_add_rule(pt_rule_db_t *rule_db, port_trigger_rule_t *pt_rule);
extern int port_trigger_remove_rule_by_index(pt_rule_db_t *rule_db, int idx);
extern int port_trigger_remove_rule_by_indexlist(pt_rule_db_t *rule_db, int *idxlist, int size);
extern int port_trigger_remove_rule_by_name(pt_rule_db_t *rule_db, char *rule_name);
extern port_trigger_rule_t *port_trigger_search_rule_by_name(pt_rule_db_t *rule_db, char *rule_name);
extern port_trigger_rule_t *port_trigger_search_rule_by_trigger_port(pt_rule_db_t *rule_db, char *protocol, unsigned short trigger_port);
extern int port_trigger_setup(void);
extern int port_trigger_clear_all_db(void);
#endif
/* pppinfo_api.c */
extern int pppinfo_read_db(pppinfo_db_t *pppdb);
extern int pppinfo_write_db(pppinfo_db_t *pppdb);
extern int pppinfo_dump(void);
extern int pppinfo_add_info(char *account, char *ifname, int pid);
extern int pppinfo_remove_info(char *account, char *ifname);
extern int pppinfo_check_account(char *account);
extern int pppinfo_get_ifname(char *account, char *ifname);
extern int pppinfo_get_pid(char *account, char *pid);
/* pppoe_api.c */
extern int get_pppoe_status(char *ifname);
extern int set_pppoe_status(char *ifname, int status);
extern int get_ppp_ifname(char *ifname);
extern int save_pppoe_pap_secret(char *ifname, char *id, char *passwd);
extern int save_pppoe_chap_secret(char *ifname, char *id, char *passwd);
extern int save_pppoe_option(char *ifname, ppp_option_t *opt);
extern int read_pppoe_option(char *ifname, ppp_option_t *opt);
extern int pppoe_stop(char *ifname);
extern int read_pppoe_mtu(char *ifname);
extern int save_pppoe_mtu(char *ifname, char *mtu);
extern int get_pppoe_mtu(char *ifname, char *mtu);
extern int get_pppoe_secret_info(char *ifname, char *id, char *passwd);
extern int get_pppoe_option_ip(char *ifname, char *local_ip, char *remote_ip);
extern int get_pppoe_keepalive(char *ifname);
extern int get_pppoe_maxidle(char *ifname);
extern int set_idle_timeout(char *ifname);
extern int clear_idle_timeout(char *ifname);
extern int get_idle_timeout(char *ifname);
extern int set_connect_on_demand(char *ifname, int flag);
extern int get_connect_on_demand(char *ifname);

extern int add_pap_secret(char *account, char *passwd, char *ip);
extern int add_chap_secret(char *account, char *passwd, char *ip);
extern int remove_chap_secret(char *account);
extern int remove_pap_secret(char *account);

extern int read_pppoe_mtu_from_optionfile( char *ifname, char *mtu );

int set_pppoe_detect_status(char *wanname,char *status);
int get_pppoe_detect_status(char *wanname,char *status);


int stop_wan(char *wan_name);



extern int update_remote_mgmt(char *wanname);
extern int write_wbm_config( remotewbm_config_t *rwbm );
extern int read_wbm_config( remotewbm_config_t *rwbm );

int set_remote_mgmt_flag(int flag);
int set_remote_mgmt_port(int port);
int get_remote_mgmt_flag(void);
int get_remote_mgmt_port(void);

int get_arp_update_per_min(void);
int set_arp_update_per_min(int count);


/* pptp_api.c */
extern void update_pptp_configfiles(int encrypt);
extern void pptpvpn_enable_pptp_server(pptpvpn_db_t *rule_db);
extern void pptpvpn_disable_pptp_server(pptpvpn_db_t *rule_db);
extern void pptpvpn_read_rule_db(pptpvpn_db_t *rule_db);
extern int pptpvpn_setup(void);
extern int pptpvpn_check_pptp_server(void);
extern void write_chap_secrets(pptpvpn_db_t *rule_db);
extern int sync_chap_secrets(void);
extern int pptpvpn_apply_app_postroute(pptpvpn_db_t *rule_db, char cmd);
/* single_wan_api.c */
extern int get_default_gateway(char *ifname, char *gw);
extern int set_default_gateway(char *ifname, char *gw);
extern int set_default_gateway2(char *ifname, char *ip, char *mask, char *gw);
extern int save_internal_network_configuration(char *ip, char *netmask);
extern int save_external_network_configuration(char *ifname, char *ip, char *netmask, char *gw);
extern int apply_network_configuration(void);
/* system_api.c */
int sleep_forced(int sec);

#ifdef USE_NEW_LIB
#define KILL_PROCESS_REMOVE_PID_FLAG 0x1 
#define KILL_PROCESS_SIGTERM_FLAG 0x2 
#define KILL_PROCESS_SIGTERM_ONLY_FLAG 0x4 
extern int kill_process( char *processname , int remove_flag);
extern int kill_process2( char *pid_file , int sig);
extern int check_process(char *process_name);
extern int check_process2(char *process_name);
extern int get_wbm_popup_flag(void);
extern int set_wbm_popup_flag(int flag);
extern void check_reset_button(void);
#define SAVE_STATUS_NOOP 0
#define SAVE_STATUS_START 1
#define SAVE_STATUS_SAVING 2
extern int get_save_signal(void);
extern int set_save_signal(int sig);


#ifdef USE_ISYSD
extern int signal_update(void);
extern int signal_toggle(void);
extern int signal_wan(void);
extern int signal_start(char *service);
extern int signal_isysd_toggle(void); /* toggle run/stop */
#ifdef USE_WPS
extern int signal_wps(void);
extern int signal_pbc(void);
#endif
#endif
#ifdef USE_ROUTER_NAS
extern int signal_nas(char *service);
#endif

extern int set_autosaving(int flag);
extern int get_autosaving();

#else
extern int kill_process(char *pidfile);
#endif
extern int convert_time_to_string(time_t t, char *string, int opt);
extern int is_downgrade_disable(void);
extern int set_dhcp_auto_detect_status(char *ifname,int flag);
extern int get_dhcp_auto_detect_status(char *ifname);
extern int set_dhcp_auto_detect(int flag);
extern int get_dhcp_auto_detect(void);
extern int open_mgmt_port(char *wanname, char *port);
extern int close_mgmt_port(char *wanname, char *port);
extern int check_saved_flash(void);
extern int make_virtual_host_page( char *ip );
extern int current_check_password(char *current_pwd, char *passwd);
extern int check_password(char *id, char *passwd);
extern int get_id_password(char *id, char *passwd);
int get_default_id_password(char *id, char *passwd);
extern int save_password(char *id, char *passwd);
#ifdef USE_NEW_LIB
extern int init_httpd(void);
#endif
extern int get_sw_upgrade_status(void);
extern int set_sw_upgrade_status(int status);
extern int recover_default_configuration(void);
extern int set_speed_up_FORWARD(void);
extern int send_system_reboot_signal(void);
extern int signal_reboot(int delay);
#ifdef USE_NEW_LIB
extern int check_reboot(void);
extern int get_firmware_builddate(char *date, int len);
#endif
extern int get_firmware_version(char *version);
extern char *get_firmware_version2(void);
int parse_version(char *ver,int *major,int *minor);
extern int get_upgrade_mode(void);
extern void kill_daemons(void);
extern int set_upgrade_mode(int flag);
extern int get_soribada_status(void);
extern int set_soribada_status(int status);
extern int read_real_ipclone_leasetime(char *wan_name, int *leasetime);
extern int write_real_ipclone_leasetime(char *wan_name, int leasetime);
extern int read_real_ipclone(char *wan_name, int *mac, unsigned int *public_ip);
extern int set_real_ipclone(char *mac1, char *mac2);
extern int write_real_ipclone(char *wan_name, char *mac, unsigned int public_ip);
extern int check_ipclone_ipaddr(unsigned char *chaddr, char *wan_name);
extern int set_hostname(char *hostname);
extern int get_hostname(char *hostname);
extern int kill_timed(void);
extern int set_timed_server(char *td);
extern int get_timed_server(char *td);
extern int get_product_code(char *code);
extern int get_company_name(char *name);
extern int get_language_postfix(char *lang);
extern char *get_full_lang_string(char *lang_postfix);
extern int is_bulk_firmware(void);
extern int get_product_name(char *name);
extern int get_company_url(char *url);
extern int set_h323_enable(void);
extern int get_h323_enable(void);
extern int clear_h323_enable(void);
extern int check_httpd_status(void);
extern int httpd_start_callback(void);
extern int httpd_die_callback(void);
extern int get_copyright_flag(void);
extern int kill_httpd(void);
extern void print_file(char *filename);
extern void fprint_file(FILE *wfp, char *filename);

//#define TIMED_REALTIME_GET_STATUS 2 
//#define TIMED_CANT_GET_BUT_NO_RETRY 1

extern int set_timed_status(int status);
extern int get_timed_status(void);

extern int clear_timed_status(void);
#ifdef USE_NEW_LIB
extern int set_hw_csum_flag(void);
#else
extern int set_hw_csum_flag(int flag);
#endif
extern int set_forward_speed_up_flag(int flag);
extern int set_queue_speed_up_flag(int flag);
extern int set_upnp_enable(void);
extern int get_upnp_enable(void);
extern int clear_upnp_enable(void);
extern int kill_upnp(void);
extern int setup_upnp(int flag);

#ifdef USE_MINIUPNP
void send_signal_upnpd(char *wanname);
#ifdef USE_UPNP_RELAY
int set_upnp_relay(int flag);
int get_upnp_relay(void);
int check_upper_upnp_igd(void);
#endif
#endif

extern unsigned int get_pci_id(int busnum);
extern unsigned int get_real_pci_id(int busnum);
extern int pci_install(void);
extern int write_file(char *filename, char *string);
extern int write_file_char(char *filename, char ch);
extern int write_file_intval(char *filename, int value);
extern int write_sched_message(int op, int fontsize, char *bgcolor, char *textcolor, char *msg);
extern int read_sched_message(int *op, int *fontsize, char *bgcolor, char *textcolor, char *msg);
extern int make_sched_message(void);
extern int check_productid(void);
extern int syslog_get_sendmail_flag(void);
extern int syslog_set_sendmail(void);
extern int syslog_clear_sendmail(int flag);
extern int syslog_get_status(void);
extern int syslog_set_status(int flag);
extern int syslog_get_email_status(int *email_flag, int *hour, int *del_log);
extern int syslog_set_email_status(int flag, int hour, int del_log_flag);
extern int append_file(FILE *fp, char *file);
extern int copy_file(char *f1, char *f2);
extern int syslog_msg(int level, char *fmt, ...);
extern int syslog_save(void);
extern int syslog_restore(void);
extern int syslog_max_count(void);
extern int syslog_get_filename(char *name);
extern int syslog_get_flag(char *name);
extern int syslog_set_flag(char *name, int flag);
extern int syslog_get_count(void);
extern int syslog_increase_count(void);
extern int syslog_clear(void);
extern int set_admin_email(char *email);
extern int get_admin_email(char *email);

#define CAPTCHA_FILENAME_LEN 32
int set_http_auth_method(char *method);
int get_http_auth_method(char *method);
int get_captcha_usage_type(void);
int set_use_captcha_code(int on);
int get_use_captcha_code(void);

int get_client_login_trial_count(char *ip);
int set_client_login_trial_count(char *ip, int rflag);
int get_client_login_trial_count_without_captchar(void);
int set_client_login_trial_count_without_captchar(int count);


extern int set_smtp_server(char *smtp);
extern int get_smtp_server(char *smtp);
extern int set_smtp_account(char *account);
extern int get_smtp_account(char *account);
extern int set_smtp_auth(int flag);
extern int get_smtp_auth(void);
extern int set_smtp_password(char *password);
extern int get_smtp_password(char *password);
extern int send_email_to_admin(char *subject, char *filename, char *type);
extern int conv_time(time_t ti, char *tstr, int flag);
extern int email_clear_report(int flag, char *type);
extern char *email_make_title(char *usermsg);
extern int check_restore_file(char *restorefile);
extern int save_backup_config( void );
extern int restore_backup_config( char *file );
extern int base64_decode(void *dst, char *src, int maxlen);
extern void base64_encode(unsigned char *from, char *to, int len);
extern int Base64encode(char *encoded, const char *string, int len);
extern int Base64decode(char *bufplain, const char *bufcoded);
extern int file_exists(char *filename);
extern int set_nologin_page(int flag);
extern int get_nologin_page(void);
extern int apply_nologin_page(void);
extern int check_diag_flag(void);
extern int write_diag_flag(void);
extern int clear_diag_flag(void);
extern int set_wireless_client_diag(void);
extern int get_wireless_client_diag(void);
extern int wireless_diag_client_setup(void);
//extern int check_default_button(void);
extern int check_default_button(int ms, int times);
extern int check_wps_button(int ms, int times);
extern int check_ext_button(int wl_mode);

extern void set_hwaddress_to_flash(unsigned char *mac);
extern int flash_get_hardware_address(unsigned char *haddress);
extern int increase_file_counter(char *file);
extern int get_file_value(char *file, int type);
extern int get_file_string(char *file, char *value, int max);
#ifdef USE_DUAL_WAN
extern int check_linkmon_conf(int *lb_time, int *interval);
extern int get_linkmon_method(int *method,char *domain);
#endif
extern char *get_wireless_ifname(void);
extern int set_wireless_ifname(char *ifname);
extern int sysconf_nat_set(int flag, int update);
extern int sysconf_nat_get(int update);
extern int print_message_box(char *msg, int width, int height);
extern int get_wireless_wan_enable(void);
extern int set_send_email(char *send_email);
extern int get_send_email(char *send_email);

extern int get_new_timed_conf(char *t_server,int *i,int *ts_id,int *gmt_id);
extern int file_gz_compression(char *filename);
extern int file_gz_uncompression(char *filename);
extern int setfile_uncompression(void);

/* urlfilter_api.c */
extern int read_urlfilter_config(char *config_file, urlfilter_config_t *urlconfig);
extern int write_urlfilter_config(char *config_file, urlfilter_config_t *urlconfig);
extern int enable_urlfilter(void);
extern int disable_urlfilter(void);
extern int add_urlfilter_string(char *st, char *ip, char *ip2,char *mac, unsigned int flag);
extern int remove_urlfilter_string(char *config_file, int idx);
extern int make_urlfilter_string(char *src, char *out);
extern int apply_urlfiltering_rules(filter_string_t *filter_string, char flag);
extern int urlfilter_config(void);
extern int apply_urlfiltering_rules_list( filter_string_t *filter_string, char cmd, int count);
extern int urlfilter_execute_rule( filter_string_t *filter_string, char cmd, int idx);

/* wireless_api.c */
/*
extern void read_wireless_conf(wireless_conf_t *wl_conf, char *ifname);
extern void write_wireless_conf(wireless_conf_t *wl_conf);
extern void set_wireless_conf(wireless_conf_t *wl_conf, int flag);
extern int set_wireless_tools(wireless_conf_t *wl_conf, int flag);
extern int set_wireless_isl3890(wireless_conf_t *wl_conf);
extern int set_wireless_rt2500(wireless_conf_t *wl_conf);
extern int get_wireless_plugged_status(void);
*/
extern void apply_wireless_conf(void);
#ifdef USE_NEW_LIB
extern void init_wireless(void); 
#endif

#ifndef USE_NEW_LIB
extern void read_macauth_db(macauth_db_t *mac_db);
extern void write_macauth_db(macauth_db_t *mac_db);
extern int set_mac_auth_policy(macauth_db_t *mac_db, int policy);
extern int add_mac_auth(macauth_db_t *mac_db, char *macaddr);
extern int del_mac_auth_by_idxlist(macauth_db_t *mac_db, int *idxlist, int size);
extern int search_mac_auth(macauth_db_t *mac_db, char *macaddr);
#endif
extern int wireless_api_support_wds_individual_encrypt(void);
extern int get_hostinfo_from_wireless(char *ifname, int max_num, hostinfo_t *hinfo);
extern int set_diag_client_tx_power(int txpower);
extern int get_diag_client_tx_power(void);
extern int wireless_workaround(void);
extern int get_wireless_link_speed(char *ifname);
extern int wireless_api_get_linkrate_control(void);
extern int wireless_api_get_txrate_control(void);
extern int wireless_api_get_linkrate_control(void);
extern int wireless_api_get_basicrate_control(void);
extern int wireless_api_get_supportedrates( unsigned int *rate_array );
extern int wireless_api_support_adhocmode( void );
extern int wireless_api_get_macaccess_max(void);
extern int wireless_api_support_wds_individual_encrypt(void);
extern int wireless_api_support_wds_individual_mode(void);
extern int wireless_api_get_wds_max(void);
extern int wireless_api_start_wds(int wl_mode);
extern int wireless_api_stop_wds(int wl_mode);
extern int wireless_api_ate_set_txpower(int power);
extern int wireless_api_ate_set_channel(int channel,int repeat,int rate);
extern int wireless_api_ate_set_freqoffset(int freq);
extern int wireless_api_ate_set_carrier(void);
extern int wireless_api_ate_set_rxpreset(int channel, int freqoffset);
extern int get_resolveconf_update_flag(void);
extern int set_resolveconf_update_flag(int status);
#ifdef USE_NEW_LIB
#ifdef USE_DUAL_WAN
extern int get_dns_dynamic_check(char *wan_name);
extern int set_dns_dynamic_check(char *wan_name,int status);
extern int get_dns_pppoe_check(char *wan_name);
extern int set_dns_pppoe_check(char *wan_name,int status);
#else
extern int get_dns_dynamic_check(void);
extern int set_dns_dynamic_check(int status);
extern int get_dns_pppoe_check(void);
extern int set_dns_pppoe_check(int status);
#endif
#endif
extern int wireless_api_set_hardware_address(char *mac);
extern int wireless_api_get_max_channel( char *ifname );
extern int wireless_api_get_crosstalk( int channel_num ,ap_infolist_t *ap_list);
extern int wireless_api_get_run(char *ifname);

int wireless_set_wps_led(char *ifname,int flag);
int wireless_which_wps_button_pushed(char *bt);
int wireless_get_wwan_enable(char *bridge_ifname);
int wireless_get_multibridge_enable(int wl_mode);

int wireless_set_igmpsnoop(char *ifname,int flag);

int wireless_api_stop_config_wireless_if(void);
int wireless_api_start_config_wireless_if(void);

int wireless_check_channel_valid(char *ifname, char *abbrev, int bw, int channel);


/* wizard_api.c */
extern int wizard_api_set_mode(int flag);
extern int wizard_api_get_mode(void);
extern int wizard_api_get_status(char *ifname, char *status);
extern int wizard_api_set_status(char *ifname, char *status);
extern int wizard_api_start_search(void);
extern int wizard_api_get_counter(void);
extern int wizard_api_set_counter(int count);
extern int get_wizardexe_status(void);
extern int set_wizardexe_status(int status);

/* ppp_secret.c */
int read_ppp_secret(char *filename, ppp_secret_db_t *ppp_secret_db);
int write_ppp_secret(char *filename, ppp_secret_db_t *ppp_secret_db);
int add_ppp_secret(ppp_secret_db_t *ppp_secret_db, char *account, char *password, char *ip);
int remove_ppp_secret(ppp_secret_db_t *ppp_secret_db, char *account);

/* dhcplib.c */
int dhcplib_set_dns_server(char *dns1, char *dns2);
int dhcplib_get_dns_server(char *dns1, char *dns2);
int get_domain_name_server(char *dns1, char *dns2);
int set_domain_name_server(char *dns1, char *dns2, char *ifname);
int dhcplib_set_range_and_gateway(char *start, char *end, char *mask, char *router);
int dhcplib_get_range_and_gateway(char *start, char *end, char *mask, char *router);
int get_active_lease_count(char *file);
int dhcplib_get_active_lease_count(void);
int dhcplib_get_active_static_lease_count(void);
int get_lease_info(char *file, int idx, char *ip, char *mac, int *lease_time, char *hostname);
int dhcplib_get_lease_info(int idx, char *ip, char *mac, int *lease_time, char *hostname);
int dhcplib_get_static_lease_info(int idx, char *ip, char *mac, int *lease_time);
int dhcpd_start(void);
int dhcpd_stop(void);
int dhcplib_flush_static_lease(void);
int dhcplib_flush_dhcpd_leases(void);
void dhcplib_static_leases(char *hwaddr, u_int32_t yiaddr, int add);
int compare_domain_name_server(char *new_dns1, char *new_dns2);
int determine_dhcpd_restart(char *dns1, char *dns2);
int get_internal_network_info(char *info);
int dhcplib_search_lease_by_ip(char *ip, char *hostname);
int dhcplib_search_static_lease(char *ip, char *mac);
int dhcplib_get_mac_by_ip( char *ip, char *mac );
int dhcpd_remove_dynamic_lease(char *ip_addr, char *hw_addr);

#define MAC_RESTRICT_POLICY 0x1
#define IPMAC_BIND_POLICY 0x2
int set_ipmac_bind(int flag);
int remove_ipmac_bind(char *ip_addr, char *hw_addr);
int add_ipmac_bind(char *ip_addr, char *hw_addr);
int get_ipmac_bind(void);
int init_ipmac_bind(void);


/*******************************************************/
/* TC LIBRARY                                          */
/*******************************************************/
/* tc/tc.c */
extern int tc_mode_set(int mode);
extern int tc_mode_get(int *mode);
extern int is_qos_enabled(void);
extern int tc_count_file_write(int count);
extern int tc_count_file_read(int *count);
extern int max_bandwidth_set(unsigned int id, char *service, unsigned int down, unsigned char down_unit, unsigned int up, unsigned char up_unit);
extern int max_bandwidth_get(unsigned int id, char *service, unsigned int *down, unsigned char *downunit, unsigned int *up, unsigned char *upunit);
extern unsigned int *class_id_list_get(int type);
extern int class_create(char *name, int type, unsigned char direction, int rate, unsigned char unit, unsigned char property, int bpi_count);
extern int class_change(int class_id, char *name, unsigned char direction, int rate, unsigned char unit, unsigned char property);
extern int class_destroy(int class_id);
extern Class *class_get(int class_id);
extern int class_make_couple(int c1, int c2);
extern int filter_add_to_class(int class_id, int protocol, char *in_ip, unsigned int in_subnet, unsigned short *in_port, char *ex_ip, unsigned int ex_subnet, unsigned short *ex_port);
extern int filter_remove_from_class(int class_id, int filter_id);
extern int filter_change(int class_id, int filter_id, int protocol, char *in_ip, unsigned int in_subnet, unsigned short *in_port, char *ex_ip, unsigned int ex_subnet, unsigned short *ex_port);
extern Filter *filter_get(int class_id, int filter_id);
extern int tc_rate_sum_of_class(int skip_id, int direction);
extern void tc_reconfig(char *wan_name);
extern void show_all_tc_configuration(void);
extern int filter_templet_add(char *name, int protocol, char *in_ip, unsigned int in_subnet, unsigned short *in_port, char *ex_ip, unsigned int ex_subnet, unsigned short *ex_port);
extern int filter_templet_delete(int filter_id);
extern Filter *filter_templet_get(int filter_id);
extern int smart_qos_mode_set(int mode);
extern int smart_qos_mode_get(void);
extern int class_priority_order_write(int down_id, int up_id, int prio);

/* tc/tc_command.c */
extern int root_qdisc_command(int command, int id, Max_Bandwidth *maxband);
extern int class_command(int command, Max_Bandwidth *maxband, Class *myclass, int bpi_idx);
extern int filter_command(int command, Class *myclass, Filter *filter);
extern int tc_enable_command(void);
extern int tc_disable_command(char *wan_name);

#ifdef USE_DUAL_WAN
extern int tc_dual_wan_init_command(int mode);
extern int set_resolveconf_update_flag_wan1(int status);
extern int set_resolveconf_update_flag_wan2(int status);
extern int get_resolveconf_update_flag_wan1(void);
extern int get_resolveconf_update_flag_wan2(void);
#endif

#ifndef NEW_LIB
/*******************************************************/
/* SCHED LIBRARY                                       */
/*******************************************************/
/* sched/sched.c */
extern int sched_cfg_set(struct sched_cfg *cfg);
extern struct sched_cfg *sched_cfg_get(int idx);
extern int sched_cfg_delete(int idx);
extern void sched_checker(int duration);
#endif

/*******************************************************/
/* NETDETECT LIBRARY                                   */
/*******************************************************/
/* netdetect/netdetect.c */
extern int netdetect_set_on_off(int on);
extern int netdetect_get_on_off(void);
extern int netdetect_set_detect_port_range(int mode);
extern int netdetect_get_detect_port_range(void);
extern int netdetect_set_monitor_level(int level);
extern int netdetect_get_monitor_level(void);
extern int netdetect_set_portrange_and_monitorlevel(int mode, int level);
extern int netdetect_set_burst_drop(int drop, int virus_drop);
extern int netdetect_get_burst_drop(void);
extern int netdetect_get_virus_drop(void);
extern int netdetect_set_email_policy(int report_time, int first_time, int report_clear);
extern int netdetect_get_email_policy(int *report_time, int *first_time, int *report_clear);
extern int netdetect_clear_all_history(void);
extern int netdetect_read_current_history(void);
extern void netdetect_write_history(void);
extern struct net_detect_history *netdetect_get_history_by_index(int idx);
extern void netdetect_write_option(unsigned short id, unsigned int option);
extern void netdetect_set_option_rule(char cmd, char *ip_addr);
extern int netdetect_make_email_report(void);
extern int netdetect_checker(void);
extern char *netdetect_comment_for_specified_port(int proto, int port);

/*******************************************************/
/* DYNDNS LIBRARY                                      */
/*******************************************************/
/* dyndns/base64encode.c */
extern void base64encode(char *intext, char *output);
/* cachefile.c */
extern void save_ipcache(char *ip_addr);
extern int check_ipcache(char *newip);
extern int read_dyndns_config(int *flag, char *user, char *passwd);
extern int write_dyndns_config(int flag, char *user, char *passwd);
extern int check_dyndns_status(char *hostname);
extern void save_dyndns_status(char *hostname, int status);
extern int read_dyndns_hostname(char *hostlist[]);
extern int add_dyndns_hostname(char *hostname);
extern int del_dyndns_hostname(int hostid);
extern int set_ddns_server(int serverid);
extern int get_ddns_server(void);
/* dyndns/dyndnsupdate.c */
extern void save_ipcache(char *ip_addr);
extern int check_ipcache(char *newip);
extern int read_dyndns_config(int *flag, char *user, char *passwd);
extern int write_dyndns_config(int flag, char *user, char *passwd);
extern int check_dyndns_status(char *hostname);
extern void save_dyndns_status(char *hostname, int status);
extern int read_dyndns_hostname(char *hostlist[]);
extern int add_dyndns_hostname(char *hostname);
extern int del_dyndns_hostname(int hostid);
extern char *ipcheckif(char *interface);
extern int dyndns_checker(unsigned int ip_addr);
extern int dyndns_main(int argc, char *argv[]);
extern int strcomp(char *str1, char *str2);
extern void print_error(char *message, char *option);
extern int check4options(char *st);
extern void close_socket(void);
extern int connect_socket(void);
extern int init_socket(char server[]);
extern void ipcheck(char *ipaddress);
extern void show_help(void);
extern int check_error(char *http_response);
extern int update_dyndns(char *user, char *ip, char *wildcard, char *mxhost, char *hostname, char *backmx, char *offline, char *systemt);
extern void send_func(const char *send_msg_to_server);
extern void print_msg(int level, const char *fmt, ...);
extern void *xmalloc(size_t size);
extern int send_email_to_iptime_dns(char *email);
/* dyndns/interface.c */
extern char *ipcheckif(char *interface);

/*******************************************************/
/* AUTH LIBRARY                                        */
/*******************************************************/
/* auth/auth.c */
extern void auth_checker(void);



#ifdef USE_DDNS_CLIENT
int ez_ipupdate(int period);
int ez_ipupdate_cmd( ezddns_config_t* ezddns_conf, char *wanip, int forced);
int ddnsapi_add_config(ezddns_config_t *ezddns_conf);
int ddnsapi_read_config( int hostidx, ezddns_config_t *ezddns_conf);
#ifdef USE_NEW_LIB
int ddnsapi_get_status( char *hostname, ezddns_status_t *ddns_status);
int ddnsapi_set_status( int code, char *hostname, char *updateip, char *msg);
int ddnsapi_set_status2( char *hostname, ezddns_status_t *ddns_status);
int ddnsapi_check_status( char *hostname );
#else
int ddnsapi_get_status( char *hostname, char *updateip, char *status_msg);
int ddnsapi_set_status( int code, char *hostname, char *updateip, char *msg);
#endif
int ddnsapi_remove_host(char *rmhost);
int ddnsapi_set_refresh_flag(char *host, int flag);
int ddnsapi_get_refresh_flag(char *host);
int ddnsapi_clear_status( char *hostname );
int ddnsapi_get_refresh_one_at_least(void);
int ddnsapi_get_host_count(char *s_type);
int ddnsapi_remove_by_service_type(char *service_type);
int ddnsapi_clear_status_by_service_type(char *service_type);
int ddnsapi_read_config_by_service_type(int didx,char *service_type, ezddns_config_t *ddns_conf);

int ddnsapi_update_remaintime(char *hostname, int elapsed );
#define FORCE_UPDATE_TIMEOUT 1440000
//#define FORCE_UPDATE_TIMEOUT 7200


#endif


#ifdef USE_LIVE_UPDATE
void live_update_init(void);
int live_update_check(int force);
void live_update_skip(char *ipaddr);
int live_update_downloading(void);
int live_update_get_config(int *enable, int *checktime);
int live_update_set_config(int enable, int checktime);
int live_update_get_new_version(int *major, int *minor);
#endif

#ifdef USE_VAHA_APPS
int set_vaha_config( int channel, int id0, int id1, int id2 );
int get_vaha_config( int *channel, int *id0, int *id1, int *id2 );
int start_vaha_apps(void);
int vaha_apps_start(void);
#endif

#ifdef USE_ORAN_APPS
int start_oran_apps(void);
int orange_apps_start(void);
#endif

#ifdef USE_APPS_INTERFACE
int check_unzip_apps(int load, char *apps_name);
int apps_write_flash( char *tfile, int len );
int get_apps_version( char *version );
int check_apps_write_tmp( unsigned char *data, char *tfile, int len, char *msg , char *apps_name);

#endif

extern char *memsearch2( char *input, char *key, int size);
extern unsigned int file_crc_sum( FILE *fp, int size );

extern int lzss_encode(unsigned char *infile, FILE *outfile, unsigned int size);
extern int lzss_decode(unsigned char *outfile, FILE *infile, unsigned int size);

int get_nodowngrade_version(int *major, int *minor);

int restore_extra_config(void);
int save_extra_config(char *filename);


/* kaid api */

#define KAID_STATUS_INIT 0
#define KAID_STATUS_START 1
#define KAID_STATUS_DOWNLOADING 2
#define KAID_STATUS_DOWNLOAD_COMPLETE 3
#define KAID_STATUS_READY 4
#define KAID_STATUS_DOWNLOADSTART 5
#ifdef USE_SELECT_KAI_SERVER
#define KAID_WAIT_SERVER_SELECT 6
#define KAID_SERVER_SELECT_DONE 7
#endif



#ifdef USE_NEW_LIB
#define KAID_MODE_AP 0
#define KAID_MODE_PSP 1
#define KAID_MODE_XBOX 2
#else
#define KAID_MODE_INIT 0
#define KAID_MODE_PSP 1
#define KAID_MODE_NORMAL 2
#endif

#define KAID_STATUS_ERROR_BASE		 0x1000
#define KAID_STATUS_INTERNET_CONNECTION_ERROR 0x1001
#define KAID_STATUS_DOWNLOAD_TIMEOUT 	      0x1002
#define KAID_STATUS_NOT_FOUND_HOST 	      0x1003
#define KAID_STATUS_DOWNLOAD_FILE_INVALID     0x1004
#define KAID_STATUS_AUTH_ERROR     	0x1005
#define KAID_STATUS_OBTSERVER_LIST_DOWNLOAD_ERROR   0x1006

#define PSPSCAN_STATUS_START 0x0
#define PSPSCAN_STATUS_DETECTED 0x2
#define PSPSCAN_STATUS_NOTDETECTED 0x3
#define PSPSCAN_STATUS_STOP 0x4


#define PSP_REG_STATUS_INIT 0
#define PSP_REG_STATUS_NORMAL 1
#define PSP_REG_STATUS_CHANGED 2

int get_kaid_config(char *tag, char *value);
int set_kaid_config(char *tag, char *value);
int get_kaid_mode(void);
int get_kaid_mode(void);
int set_kaid_mode(int flag);
int set_kaid_status(int status);
int get_kaid_status(void);
int get_pspscan_info(ap_info_t *ap);
int set_pspscan_status(int status);
int get_pspscan_status(void);
int clear_pspscan_status(void);
int psp_schedule(int period);
int get_pspgame_title( char *essid, char *ginfo );
int get_pspgame_info( char *essid, char *info );
int restart_kaid(void);
int get_static_psp_info( int *channel, char *mac );
int set_static_psp_info( int channel, char *mac );
int get_kaid_engine_port(void);
int set_kaid_engine_port(int port);
int get_register_pspinfo(ap_info_t *ap_info);
int get_kai_daemon_status(void);





/* sip_api.c */
#ifdef USE_SIP
int sip_execute_preroute(netfilter_rule_t *rule, char cmd);
int sip_execute_postroute( netfilter_rule_t *nf_rule, char cmd );
int sip_add_rule(rule_db_t *rule_db, netfilter_rule_t *nf_rule);
int sip_remove_rule_by_indexlist(rule_db_t *rule_db, int *idxlist, int size );
#endif


/* fit structure size to 256 for memory optimization */
int lock_file(char *lockfile);
int unlock_file(int fd);
int unlock_filename(char *lockfile);


typedef struct genconfig_item_s {
#define GENCONFIG_MAX_ITEM_LEN 64
#define GENCONFIG_MAX_VALUE_LEN (256-GENCONFIG_MAX_ITEM_LEN-12)
        char tag[GENCONFIG_MAX_ITEM_LEN];
#define TAGLEN GENCONFIG_MAX_ITEM_LEN
        char value[GENCONFIG_MAX_VALUE_LEN];
	char *long_value;
        struct genconfig_item_s *next;
        struct genconfig_item_s *prev;
} genconfig_item_t;

typedef struct genconfig_ll_s {
        genconfig_item_t *head;
        genconfig_item_t *tail;
} genconfig_ll_t;
int genconfig_free_item(genconfig_item_t *item);
int additem_ll(genconfig_ll_t *gen_ll, char *tag, char *value);
int genconfig_read_file(char *filename, genconfig_ll_t *gen_ll);
int genconfig_write_file(char *filename, genconfig_ll_t *gen_ll);
int genconfig_free_ll(genconfig_ll_t *gen_ll);
int genconfig_set_value(genconfig_ll_t *gen_ll, char *item, char *value);
int genconfig_set_intvalue(genconfig_ll_t *gen_ll, char *item, int value); 
int genconfig_get_value(genconfig_ll_t *gen_ll, char *item, char *value);
char *genconfig_get_pvalue(genconfig_ll_t *gen_ll, char *tag);
int genconfig_get_value_direct(char *filename, char *tag, char *value);
int genconfig_get_intvalue_direct(char *filename, char *tag);
int genconfig_set_value_direct(char *filename, char *tag, char *value);
int genconfig_remove_item(char *filename, char *tag);
int genconfig_set_intvalue_direct(char *filename, char *tag, int value);
char *genconfig_get_index_pvalue(genconfig_ll_t *gen_ll, char *itag, int idx);



int genconfig_remove_index_item(char *filename, int idx, char *tag);
int genconfig_remove_index_allitem(char *filename, char *tag);
int genconfig_set_index_value(genconfig_ll_t *gen_ll, char *tag, int idx, char *value);
int genconfig_get_index_value(genconfig_ll_t *gen_ll, char *tag, int idx, char *value);

int iconfig_set_index_value_direct(char *tag, int idx, char *value);
int iconfig_get_index_value_direct(char *tag, int idx, char *value);
int iconfig_remove_index_tag(char *tag, int idx);
int iconfig_remove_index_alltag(char *tag);

int istatus_get_index_value_direct(char *tag, int idx, char *value);
int istatus_set_index_value_direct(char *tag, int idx, char *value);
int istatus_remove_index_tag(char *tag, int idx);
int istatus_remove_index_alltag(char *tag);

int iconfig_get_value_direct(char *tag, char *value);
int iconfig_get_intvalue_direct(char *tag);
int iconfig_make_default(char *tag);
int iconfig_set_value_direct(char *tag, char *value);
int iconfig_set_intvalue_direct(char *tag, int value);
int iconfig_get_default_value_direct(char *tag, char *value);
int iconfig_is_changed(char *tag);
int iconfig_remove_config_tag(char *tag);

int istatus_get_value_direct(char *tag, char *value);
int istatus_set_value_direct(char *tag, char *value);
int istatus_get_intvalue_direct(char *tag);
int istatus_set_intvalue_direct(char *tag,int value);
int istatus_remove_status_tag(char *tag);
int istatus_remove_tag_prefix(char *tag_prefix);

int iconfig_get_index_info_direct(char *tag, int idx, genconfig_item_t *info);
int istatus_get_index_info_direct(char *tag, int idx, genconfig_item_t *info);



/* rt61 : ralink driver api declare */
#ifdef USE_NEW_LIB
int set_wireless_rt61(wireless_conf_t *wl_conf, char *ifname);
#else
int set_wireless_rt61(wireless_conf_t *wl_conf);
#endif
int rt61_get_connected_apinfo(char *ifname, ap_info_t *ap_info);

#ifdef USE_NEW_LIB
int rt61_wireless_macauth_set_policy( int idx, int policy );
int rt61_wireless_macauth_kickall( int idx );
int rt61_wireless_macauth_add_macaddr( int idx, char *macaddr );
int rt61_wireless_macauth_del_macaddr( int idx, char *macaddr );
int rt61_wireless_macauth_kick_macaddr( int idx, char *macaddr );
#else
int rt61_wireless_macauth_set_policy( int policy );
int rt61_wireless_macauth_kickall( void );
int rt61_wireless_macauth_add_macaddr( char *macaddr );
int rt61_wireless_macauth_del_macaddr( char *macaddr );
int rt61_wireless_macauth_kick_macaddr( char *macaddr );
#endif
int rt61_wireless_macauth_init(void);
int rt61_wireless_api_start_ap_scan(char *ifname);
int rt61_wireless_api_stop_ap_scan(char *ifname);
int rt61_wireless_api_get_ap_list(ap_infolist_t *ap_list);
int rt61_wireless_api_get_ap_info(char *ssid, ap_info_t *ap_info);
int rt61_wireless_api_set_txpower( char *ifname, int tx_power );
int rt61_wireless_api_wireless_disable(void);
int rt61_get_wireless_link_speed(char *ifname);
int rt61_get_hostinfo_from_wireless( char *ifname, hostinfo_t *hinfo );
#ifdef USE_NEW_LIB
int rt61_wireless_api_get_connected_apinfo(ap_info_t *ap_info);
int rt61_wireless_api_remove_wdslink(wds_conf_t *wds);
int rt61_wireless_api_add_wdslink(wds_conf_t *wds);
int rt61_wireless_api_wds_linkcontrol(wds_conf_t *wds);
#else
int rt61_wireless_api_set_wdstype(int idx, int wdstype);
int rt61_wireless_api_set_wdscipher(int wl_mode, int ciphertype, char *key );
int rt61_wireless_api_remove_wdslink(int idx, char *mac );
int rt61_wireless_api_add_wdslink(int idx, char *mac );
int rt61_wireless_api_wds_linkcontrol( int idx, char run );
#endif
int rt61_wireless_read_radius_conf( radius_conf_t *rconf );
int rt61_wireless_write_radius_conf( radius_conf_t *rconf );
int rt61_wireless_api_get_supportedrates( unsigned int *rate_array );
int rt61_wireless_api_start_wds(int wl_mode);
int rt61_wireless_api_stop_wds(int wl_mode);
#ifdef USE_NEW_LIB
int rt61_wireless_api_wds_init( int wl_mode );
#else
int rt61_wireless_api_wds_init( wds_list_t *wds_list );
#endif
int rt61_set_tx_antenna(int idx);
int rt61_wireless_api_ate_set_txpower(int idx);
int rt61_wireless_api_ate_set_channel(int channel,int repeat,int rate);
int rt61_wireless_api_ate_set_freqoffset(int idx);
int rt61_wireless_api_ate_set_carrier(void);
int rt61_wireless_api_ate_set_rxpreset(int channel,int freqoffset);
#ifdef USE_NEW_LIB
int rt61_convert_wlconf_to_rt61conf(wireless_conf_t *wl_conf, int wireless_mode, int init_flag);
#else
int rt61_convert_wlconf_to_rt61conf(wireless_conf_t *wl_conf);
#endif
int rt61_api_install_module(int mode);
int rt61_api_remove_module(int mode);
int rt61_api_ap_set_config( char *tag, char *value );
int rt61_api_station_set_config( char *tag, char *value );
int rt61_wireless_api_get_ap_norm_power(char *bssid);
int rt61_wireless_api_get_station_list( station_infolist_t *slist);
int rt61_wireless_api_clear_station_info(char *ifname);
int rt61_wireless_api_wds_backward(void);
int rt61_mbridge_init(wireless_conf_t *wl_conf, char *ifname);

int rt61_mbridge_init(wireless_conf_t *wl_conf, char *ifname);

int rt61_wireless_api_update_bssnum(void);
int rt61_wireless_api_apply_mbssid(int wl_mode);

int rt61_wireless_api_update_wps(wireless_conf_t *wl_conf);

int rt61_wireless_ifdown(char *ifname);
int rt61_get_current_channel(void);
int rt61_wireless_api_get_channel_spec(char *cc, int *array);
int rt61_wireless_api_get_max_channel(char *cc);
int rt61_wireless_api_set_mbss_policy(char *ifname);





#ifdef USE_ATH_AR2317

/* ar2317 : atheros ar2317 driver api declare */
int set_wireless_ar2317(wireless_conf_t *wl_conf);
int ar2317_wireless_macauth_set_policy( int policy );
int ar2317_wireless_macauth_kickall( void );
int ar2317_wireless_macauth_add_macaddr( char *macaddr );
int ar2317_wireless_macauth_del_macaddr( char *macaddr );
int ar2317_wireless_macauth_kick_macaddr( char *macaddr );
int ar2317_wireless_macauth_init(void);
int ar2317_wireless_api_start_ap_scan(void);
int ar2317_wireless_api_stop_ap_scan(void);
int ar2317_wireless_api_get_ap_list(ap_infolist_t *ap_list);
int ar2317_wireless_api_get_ap_info(char *ssid, ap_info_t *ap_info);
int ar2317_wireless_api_set_txpower( char *ifname, int tx_power );
int ar2317_wireless_api_wireless_disable(void);
int ar2317_get_wireless_link_speed(void);
int ar2317_get_hostinfo_from_wireless( hostinfo_t *hinfo );
int ar2317_wireless_api_set_wdstype(int idx, int wdstype);
int ar2317_wireless_api_set_wdscipher(int ciphertype, char *key );
#ifdef USE_NEW_LIB
int ar2317_wireless_api_add_wdslink(wds_conf_t *wds );
int ar2317_wireless_api_remove_wdslink( );
int ar2317_wireless_api_wds_linkcontrol( wds_conf_t *wds );
#else
int ar2317_wireless_api_add_wdslink(int idx, char *mac );
int ar2317_wireless_api_remove_wdslink(int idx, char *mac );
int ar2317_wireless_api_wds_linkcontrol( int idx, char run );
#endif
int ar2317_wireless_read_radius_conf( radius_conf_t *rconf );
int ar2317_wireless_write_radius_conf( radius_conf_t *rconf );
int ar2317_wireless_api_get_supportedrates( unsigned int *rate_array );
int ar2317_wireless_api_start_wds(void);
int ar2317_wireless_api_stop_wds(void);
//int ar2317_wireless_api_wds_init( wds_list_t *wds_list );
int ar2317_wireless_api_wds_init( );
int ar2317_set_tx_antenna(int idx);
int ar2317_wireless_api_ate_set_txpower(int idx);
int ar2317_wireless_api_ate_set_channel(int channel,int repeat,int rate);
int ar2317_wireless_api_ate_set_freqoffset(int idx);
int ar2317_wireless_api_ate_set_carrier(void);
int ar2317_wireless_api_ate_set_rxpreset(int channel);
int ar2317_api_ap_set_config( char *tag, char *value );
int ar2317_api_station_set_config( char *tag, char *value );
int ar2317_wireless_api_get_ap_norm_power(char *bssid);
int ar2317_wireless_api_get_station_list( station_infolist_t *slist);
int ar2317_wireless_api_clear_station_info(void);
int ar2317_wireless_api_wds_backward(void);
int ar2317_set_mac_address(char *mac);
int install_ar2317_module(int mode);
int ar2317_ated_procedure_start(void);
int ar2317_wireless_api_get_connected_ap_info(ap_info_t *ap_info);

#endif


#ifdef USE_BCM5354
int is_bcm_wps_capable(wireless_conf_t *wl_conf,int forced);

int bcm_wireless_get_ifname_prefix(int bssidx, char *ifname, char *prefix);
int init_bcm(void);
void init_bcm_wireless(void);
int bcm_wireless_macauth_set_policy( int idx, int policy );
int bcm_wireless_macauth_kickall( int idx );
int bcm_wireless_macauth_add_macaddr( int idx, char *macaddr );
int bcm_wireless_macauth_del_macaddr( int idx, char *macaddr );
int bcm_wireless_macauth_kick_macaddr( int idx, char *macaddr );
int bcm_wireless_api_start_ap_scan(char *ifname);
int bcm_wireless_api_stop_ap_scan(char *ifname);
int bcm_wireless_api_get_ap_list(ap_infolist_t *ap_list);
int bcm_wireless_api_get_ap_norm_power(char *bssid);
int bcm_wireless_api_get_ap_info(char *ssid, ap_info_t *ap_info);
int bcm_wireless_api_get_connected_ap_info(ap_info_t *ap_info);
int bcm_wireless_api_set_txpower( char *ifname, int tx_power );
int bcm_wireless_api_wireless_disable(void);
int bcm_get_wireless_link_speed(void);
int bcm_get_hostinfo_from_wireless( hostinfo_t *hinfo );
int bcm_wireless_api_set_wdstype(int idx, int wdstype);
int bcm_wireless_api_start_wds(void);
int bcm_wireless_api_stop_wds(void);
int bcm_wireless_api_set_wdscipher(int encrypt, char *key );
int bcm_wireless_api_remove_wdslink(wds_conf_t *wds);
int bcm_wireless_api_add_wdslink(wds_conf_t *wds);
int bcm_wireless_api_wds_linkcontrol(wds_conf_t *wds);
int bcm_wireless_api_wds_init( void );
int bcm_wireless_read_radius_conf( radius_conf_t *rconf);
int bcm_wireless_write_radius_conf( radius_conf_t *rconf );
int bcm_wireless_api_get_station_list( station_infolist_t *slist);
int bcm_wireless_api_clear_station_info(void);
int bcm_wireless_api_get_max_channel(char *ifname, char *abbrev);
int bcm_wireless_api_get_channel_spec(char *ifname, char *country_code, int *array);
int bcm_wireless_api_get_current_channel(char *ifname);
int bcm_wireless_api_apply_mbssid(int wl_mode);
int bcm_ether_get_link_status(int port, link_status_t *lnk);
int bcm_ether_set_port_config(int port, link_status_t *lnk);
int bcm_ether_get_statistics(int port, port_stat_t *stt);
int bcm_ether_set_phy_reg( int port , int reg, int value );
int bcm_ether_get_phy_reg( int port , int reg);
unsigned int bcm_ether_get_phy_reg32( int port , int reg);
unsigned long long bcm_ether_get_phy_reg64( int port , int reg);
int bcm_ether_clear_statistics(void);
int bcm_wireless_notify_nas(char *ifname);

unsigned int bcm_ether_set_page_reg(int page ,int reg, int value);
unsigned int bcm_ether_get_page_reg(int page ,int reg);
unsigned int bcm_ether_get_arl_entry(int page ,int reg, unsigned char *arl_entry);
unsigned int bcm_ether_set_arl_entry(int page ,int reg, unsigned char *value);

int bcm_ether_set_mirror_port(int port);

int bcm_mbridge_init(wireless_conf_t *wl_conf , int init_flag);
int bcm_get_connected_apinfo( char *ifname, ap_info_t *ap_info );


int bcm_check_ctf_loaded(void);
int bcm_stop_wps_noti_interface(char *ifname);

int bcm_swap_wireless_mac(char *ifname);
int bcm_need_swap_for_wwan(char *ifname);

int bcm_wireless_ldpc_control(char *ifname, int flag);

#ifdef USE_TRUNK
int bcm_set_trunk(int id, int trunkmap);
int bcm_get_trunk(int id);
void bcm_init_trunk(void);
#endif

#ifdef USE_GET_APLIST_FAILOVER
int bcm_wireless_api_check_scan_result_in_kernel(char *ifname);
#endif
int bcm_wireless_api_get_ifname(int bssidx, char *ifname);
#endif




#ifdef USE_RTL8196B
int init_rtl(void);
void init_rtl_wireless(char *ifname , int wireless_mode );
int rtl_wireless_macauth_set_policy( int idx, int policy );
int rtl_wireless_macauth_kickall( int idx );
int rtl_wireless_macauth_add_macaddr( int idx, char *macaddr );
int rtl_wireless_macauth_del_macaddr( int idx, char *macaddr );
int rtl_wireless_macauth_kick_macaddr( int idx, char *macaddr );
int rtl_wireless_api_start_ap_scan(char *ifname);
int rtl_wireless_api_stop_ap_scan(char *ifname);
int rtl_wireless_api_get_ap_list(ap_infolist_t *ap_list);
int rtl_wireless_api_get_ap_norm_power(char *bssid);
int rtl_wireless_api_get_ap_info(char *ssid, ap_info_t *ap_info);
int rtl_wireless_api_get_connected_ap_info(ap_info_t *ap_info);
int rtl_wireless_api_set_txpower( char *ifname, int tx_power );
int rtl_wireless_api_wireless_disable(void);
int rtl_get_wireless_link_speed(char *ifname);
int rtl_get_hostinfo_from_wireless( char *ifname, hostinfo_t *hinfo );
int rtl_wireless_api_set_wdstype(int idx, int wdstype);
int rtl_wireless_api_start_wds(void);
int rtl_wireless_api_stop_wds(void);
int rtl_wireless_api_set_wdscipher(int encrypt, char *key );
int rtl_wireless_api_remove_wdslink(wds_conf_t *wds);
int rtl_wireless_api_add_wdslink( wds_conf_t *wds);
int rtl_wireless_api_wds_linkcontrol( wds_conf_t *wds);
int rtl_wireless_api_wds_init( void );
int rtl_wireless_read_radius_conf( radius_conf_t *rconf);
int rtl_wireless_write_radius_conf( radius_conf_t *rconf );
int rtl_wireless_api_get_station_list( station_infolist_t *slist);
int rtl_wireless_api_clear_station_info(void);
int rtl_wireless_api_get_max_channel(char *abbrev);
int rtl_wireless_api_get_channel_spec(char *country_code, int *array);
int rtl_wireless_api_get_current_channel(void);
int rtl_wireless_api_apply_mbssid(int wl_mode);
int set_wireless_rtl(wireless_conf_t *wl_conf, char *ifname);
int rtl_get_connected_apinfo( char *ifname, ap_info_t *apinfo);

int rtl_set_default_hwparam(void);
int get_real_port(int port);

int get_dyn_concurrent_ifname(char *ifname,char *ifname_org);
int get_dyn_concurrent_bridge_ifname(char *ifname,char *ifname_org);



#endif

char *get_rtl_chip_name(void);




#if defined(USE_RT305X_WITH_EXTERNAL_SWITCH) && (defined(USE_RTL8326) || defined(USE_RTL8318P))
int port_speed_led_control(int port, int mode);
#endif


char *get_advanced_dmz_string(void);

#define VLAN_CONFIG_FILE        "/etc/vlan_config"
#ifdef USE_TRUNK
#define TRUNK_CONFIG_FILE        "/etc/trunk_config"
#endif

#ifdef USE_MV6281
int vlan_add_config(char *vname, char *vlanmap);
int vlan_add_port_config(char *vname, int port);
int vlan_remove_config(char *vname, int opt);
int vlan_remove_port_config(char *vname, int port);
int vlan_check_vname_available(char *vname);
int vlan_apply_system(void);

#ifdef USE_TRUNK
#define MAX_TRUNK_NUM 4
#define MAX_TRUNK_MEMBER_NUM 4
int trunk_group_is_full(void);
int trunk_add_config(char *tname, char *trunkmap);
int trunk_add_port_config(char *tname, int port);
int trunk_remove_config(char *tname, int opt);
int trunk_remove_port_config(char *tname, int port);
int trunk_check_tname_available(char *tname);
int trunk_apply_system(void);
#endif

#else
#define MAX_VLAN_CONFIG 5
int vlan_add_config(char *vlanmap);
int vlan_remove_config(char *tag);
int get_vlan_config(char *name, char *vlanmap);
int alloc_vlan_free_slot(void);
int get_vlan_unicast_flag(void);
int set_vlan_unicast_flag(int flag);
int apply_vlan_config(void);
int unicast_leaky_vlan_confg(int mode);

#ifdef USE_TRUNK
#define MAX_TRUNK_NUM 2
#define MAX_TRUNK_MEMBER_NUM 2

int trunk_add_config(char *tname, int trunkmap);
int trunk_remove_config(char *tname, int opt);
int trunk_read_config(int idx, char *tname, int *trunkmap);
int trunk_apply_system(void);
#endif

#endif

int get_netmask_bit_count(char *netmask);

int mactoint( char *hwaddr, int *mac);

#ifdef USE_PORT_MIRROR
int set_sniff_port(int port);
int get_sniff_port(void);
int init_sniff_port(void);
#endif

#ifdef USE_VOIP_DSCP_QOS
int get_voip_dscp_qos(void);
int set_voip_dscp_qos(int enable);
int voip_dscp_qos_config(int enable);
#endif

int is_wds_enable(int wl_mode);
int wds_get_count(int wl_mode);
int get_user_port(int real_port);

int mactoint( char *hardware, int *mac);

#ifndef USE_NEW_LIB
void accesslist_set_write_config(accesslist *set);
void accesslist_set_read_config(accesslist *set);
#endif

void chameleon_dh_stream(FILE *inputstream , FILE *outputstream, char *password, int mode, int headersize, char *randominit);
int chameleon_dh_stream_raw (unsigned char * inputstream , unsigned char * outputstream, char * password, int mode, int headersize, char * randominit, int insize);
int check_icv(char *file, int offset, int totalsize);

int check_ated_flag(void);
int set_ated_flag(void);
int clear_ated_flag(void);
int check_auth_flag(void);
int set_noauth_flag(int flag);

int set_pincode_flash(unsigned int pincode);
unsigned int get_pincode_flash(void);



#ifdef USE_DHCP_ACCESS_POLICY
int get_dhcp_access_policy(void);
int set_dhcp_access_policy(int flag);
int remove_dhcp_access_host(unsigned char *mac);
int add_dhcp_access_host(unsigned char *mac, char *ip);
int init_dhcp_access_policy(void);
#endif

#ifdef USE_RESTRICTIVE_PC_INTERNET
int get_restrictive_pc_access_policy(void);
int set_restrictive_pc_access_policy(int flag);
int get_restrictive_pc_maxcount(void);
int set_restrictive_pc_maxcount(int maxcount);
int init_restrictive_pc_access_policy(void);
int do_restrictive_pc_iptables_command(int cmd, char *hwaddr);
#endif

int apply_dos_config(dos_conf_t *dosconf);
int read_dos_config(dos_conf_t *dosconf);
int write_dos_config(dos_conf_t *dosconf);
int init_dos_config(void);

int pid_db_set_value(char *tag, int value );
int pid_db_get_value(char *tag );
int pid_db_remove_value(char *tag);

int hwinfo_get_value_direct(char *tag, char *value);
int hwinfo_get_intvalue_direct(char *tag);







int pptp_start(char *wan_name);
void begin_pptp_iptable(char *ifname);
int pptp_stop(char *ifname);
int save_pptp_option(char *ifname, pptp_option_t *opt);
int read_pptp_option(char *ifname, pptp_option_t *opt);


int get_multicast_forward_flag(void);
int set_multicast_forward_flag(int flag, int force);

int set_ks8695_hwcrc_flag(int flag);
int get_ks8695_hwcrc_flag(void);


int extapp_get_main_app_path(char *app_path);
int extapp_start_app_daemon(void);
int extapp_check_unzip_apps(int load, char *apps_name);
int extapp_check_apps_write_tmp( unsigned char *data, char *tfile, int len, char *msg , char *apps_name);
int extapp_apps_write_flash( char *tfile, int len );
int extapp_get_apps_version( char *version);
int extapp_get_apps_used_size(void);

int signal_save(void);
int saveconf(void);
int restoreconf(void);
int defaultconf(void);
int get_fakedns(void);
int set_fakedns(int flag);

int get_master_password(char *pass);
int set_master_password(char *pass);

int get_1st_firmware_update_flag(void);
int dump_mem(unsigned char *data, int size);

int get_filesize(char *file_name);
int safe_fread(void *ptr, size_t size, size_t nmemb, FILE *stream);
int safe_fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);
int waitfor(int fd, int timeout);





typedef struct {
#define MAX_TIME_SERVER_BUFLEN 64
	char server[MAX_TIME_SERVER_BUFLEN];
#define MAX_GMT_NICK 8
	char gmt_nick[MAX_GMT_NICK];
	int polar;
	int utc_offset;
	int summer_flag;
} time_server_t;
int get_timeserver_conf(time_server_t *tserv);
int set_timeserver_conf(time_server_t *tserv);
int get_timeserver_list( int idx,char *name);
#define MAX_TSERVER 15



#ifdef USE_NEW_LIB
void print_html_prefix(void);
void print_html_postfix(void);
void print_html_apply_wait(char *msg, int waittime, char *next_url);

void print_http_header(void);


int get_firmup_duration(void);

typedef struct {
    char pcname[128];
#define MAX_REMOTEPC_PCNAME_BUFLEN 128
    char macaddr[20];
#define MAX_REMOTEPC_MACADDR_BUFLEN 20
    char ip[20];
    char status;
#define PC_ON 0x1
#define PC_OFF 0x0
#define MAX_REMOTEPC_SERVICE_BUFLEN 20
    char service[16];
} remotepc_t;


#include <netdb.h>

void add_hosts_file(char *hostname, struct hostent *he);
int get_wan_status(void);


int hwinfo_get_product_code(char *code);
int hwinfo_get_language_postfix(char *lang);
char *hwinfo_get_full_lang_string(char *lang_postfix);
int hwinfo_get_company_name(char *name);
int hwinfo_get_product_name(char *name);
int hwinfo_get_company_url(char *url);
int hwinfo_get_firmup_duration(void);
int hwinfo_get_reboot_duration(void);
int hwinfo_get_lanport_swap(void);
int hwinfo_get_max_vlan_num(void);
int hwinfo_get_num_lanport(void);
int hwinfo_get_default_mirror_port(void);
int hwinfo_get_default_ip(char *ip_addr);
int hwinfo_get_num_maxport(void);
#define get_company_name hwinfo_get_company_name
#define get_product_name hwinfo_get_product_name
#define get_company_url hwinfo_get_company_url
#define get_product_code hwinfo_get_product_code
int hwinfo_get_max_wds(void);
int hwinfo_get_max_macauth(void);
int hwinfo_get_wireless_ifname(char *ifname);
int hwinfo_get_wan_ifname(char *ifname);
int hwinfo_get_wan2_ifname(char *ifname);
int hwinfo_get_wan_port(char *wanname);
int hwinfo_get_bulkfirm(void);
int hwinfo_get_port_diag(void);
int hwinfo_get_flash_sector_size(void);
int hwinfo_get_save_flash_offset(void);
int hwinfo_get_max_firmware_size(void);
int hwinfo_get_mac_flash_offset(void);
int hwinfo_get_bootloader_size(void);
int hwinfo_get_save_flash_size(void);
int hwinfo_get_max_syslog(void);
int hwinfo_get_mtu(char *sel);
int hwinfo_get_switch_control(void);
int hwinfo_get_mirror_port_display(void);
int hwinfo_get_firmware_offset(int idx);
int hwinfo_get_auth_server(char *auth);
int hwinfo_get_max_txpower_gain(void);
int hwinfo_get_flash_diag_dev(char *dev);
int hwinfo_get_wps_ssid_prefix(char *prefix);

int hwinfo_get_online_upgrade_url(char *url);
int hwinfo_get_wps_button(void);


int hwinfo_get_dram_size_mb(void);
int hwinfo_get_flash_size_mb(void);
int hwinfo_get_nflash_size_mb(void);
#ifdef USE_TRUNK
int hwinfo_get_default_trunk_portmap(void);
#endif


typedef struct conn_ctrl_s {
	int all;
	int udp_max;
	int icmp_max;
	int rate_per_ip;

	int tcp_timeout_syn_sent;
	int tcp_timeout_syn_recv;
	int tcp_timeout_eastablished;
	int tcp_timeout_fin_wait;
	int tcp_timeout_close_wait;
	int tcp_timeout_last_ack;
	int tcp_timeout_time_wait;
	int tcp_timeout_close;
	int udp_timeout;
	int udp_timeout_stream;
	int icmp_timeout;
	int generic_timeout;

} conn_ctrl_t;

int hwinfo_get_conntrack_default(conn_ctrl_t *conn);
int hwinfo_get_runled_mode(char *mode);
int hwinfo_check_giga_port(int port);
char *hwinfo_get_mimo_config(void);
char *hwinfo_get_rf_switch(void);
int hwinfo_get_wps_button(void);
int hwinfo_get_runled_polarity(void);

int hwinfo_get_ky_auth(void);
int hwinfo_get_extender_wire_portnum(void);





void print_start_progress_bar(void);

int get_nologin(void);
int set_nologin(int flag);
int apply_nologin(void);
#define apply_nologin_page apply_nologin

int get_upnp(void);
int set_upnp(int flag);
int kill_upnp(void);
int do_diag(int loop);


/* network_api.c */
/* retrun 1 -> ok, return 0 -> not ok */
int get_subnet_range(char *ip, char *mask, char *sip, char *eip);

int get_hwaddr_flash_raw(char *ifname, unsigned char *hwaddr );
int get_hwaddr_flash(char *ifname,  char *hwaddr );
int set_hwaddr_flash(char *mac );
int set_hwaddr_flash_raw(unsigned char *hwaddr);


int get_hwaddr_kernel(char *ifname, char *hwaddr);
int get_hwaddr_kernel_raw(char *ifname, unsigned char *hwaddr);
int set_hwaddr_kernel(char *ifname, char *hw_addr, int run);

int get_hwaddr_cloned(char *ifname,char *hw_addr);
int set_hwaddr_cloned(char *ifname,char *hw_addr);

int get_hwaddr_org(char *ifname,char *hw_addr);
int set_hwaddr_org(char *ifname,char *hw_addr);


int get_wan_type(char *wanname, char *type );
int set_wan_type(char *wanname, char *type );

int get_lan_type(char *type );
int set_lan_type(char *type );
	
int wan2eth( char *eth, char *wan);
int eth2wan( char *eth, char *wan);
int get_wan_ipinfo(char *wan_name, char *ip_addr, char *netmask, char *gateway);
int check_wan_connected( char *wan_name );

int check_same_network(char *ip1str,char *ip2str, char *maskstr);

int set_pppoe_account(char *ifname, char *id, char *password, int mtu);
int get_pppoe_account(char *ifname, char *id, char *password);
int set_wan_ipconfig(char *ifname, char *ip, char *netmask, char *gw);
#ifdef USE_DUAL_WAN
int get_wan_ipconfig(char *wan_name, char *ifname, char *ip, char *netmask, char *gw);
#else
int get_wan_ipconfig(char *ifname, char *ip, char *netmask, char *gw);
#endif
int set_lan_ipconfig( char *ip, char *netmask, char *gw);




int set_dns_shadow(char *ifname,char *info, char *fdns, char *sdns);
int get_dns_shadow(char *ifname,char *info, char *fdns, char *sdns);
int set_manual_dns_flag(char *ifname,char *info, int flag);
int get_manual_dns_flag(char *ifname,char *info);
int set_system_dns(char *wan_name);


int init_connctrl(void);
void fwsched_init(void);


int check_hostscan(char *cmd);
int start_hostscan(char *cmd);
int get_hostscan(char *cmd);
int stop_hostscan(int killflag);
int clear_hostscan_log(void);
int do_hostscan(void);

int create_pid(char *process_name);
int delete_pid(char *process_name);


int arp_ping(char *target_ip, char *dest_mac, char *source_ip, char *source_mac, char *interface, int timeout);

typedef struct dhcpd_lease_info_s {
	char ip_addr[20];
	char hw_addr[20];
	int expires; /* remained time */ 
#define MAX_DHCPD_LEASE_HOSTNAME_LEN 64
	char hostname[MAX_DHCPD_LEASE_HOSTNAME_LEN];
} dhcpd_lease_info_t;

typedef struct dhcpd_conf_s {
#define MAX_DHCP_IFNAME_LEN 16
	char ifname[MAX_DHCP_IFNAME_LEN];
#define MAX_DHCP_IPSTR_LEN 20
	char sip[MAX_DHCP_IPSTR_LEN];
	char eip[MAX_DHCP_IPSTR_LEN];
	char gw[MAX_DHCP_IPSTR_LEN];
	char mask[MAX_DHCP_IPSTR_LEN];
	char dns1[MAX_DHCP_IPSTR_LEN];
	char dns2[MAX_DHCP_IPSTR_LEN];
	int autotime;
	int leasetime;
	int max_static_lease;
#define DEFAULT_LEASETIME 864000
#define MAX_DNS_SUFFIX 32
	char dns_suffix[MAX_DNS_SUFFIX];
	char lease_file[256];
	char static_lease_file[256];
	char config_file[256];
	int miprange; /*2016-02-24 jiy*/
} dhcpd_conf_t;


/* return */
#define ERROR_MANUAL_IPALLOC_ALREADY_EXIST_IP 0x1
#define ERROR_MANUAL_IPALLOC_ALREADY_EXIST_MAC 0x2
int dhcpd_add_static_lease(char *ip_addr, char *hw_addr);
int dhcpd_remove_static_lease(char *ip_addr, char *hw_addr);
int dhcpd_search_static_lease(char *ip_addr, char *hw_addr);
int dhcpd_set_all_static_lease( dhcpd_lease_info_t *lease_arr, int count );
int dhcpd_get_all_static_lease( dhcpd_lease_info_t *lease_arr, int max );
int dhcpd_get_all_dynamic_lease( dhcpd_lease_info_t *lease_arr, int max );
int dhcpd_stop(void);
int dhcpd_start(void);
int dhcpd_set_dns(char *dns1, char *dns2);
int dhcpd_commit_config(dhcpd_conf_t *config);
int dhcpd_read_config(dhcpd_conf_t *config);
int dhcpd_get_dynamic_lease( char *ip_addr, dhcpd_lease_info_t *l_info );
int dhcpd_get_op(void);
int dhcpd_set_op(int flag);
int update_udhcpd_config(dhcpd_conf_t *config);
int dhcpd_flush_static_lease( void );
int dhcpd_flush_dynamic_lease( void );
int init_dhcpd(void);




/* navi_cgi.c */
extern void print_detail_menu(int blankcount,char *imgsrc,char *tmenu,char *smenu,char *string,int last_flag,int help_flag);
extern void print_blank_td(int count,int width);
extern void print_navi_image(char *file,char *imgid,char *tableid,int flag);
extern void print_navi_title(char *tableid,char *string);
extern void print_display_block_td(char *tdid);
extern void print_display_none_td(char *tdid);

#endif

#ifdef USE_ATH_AR2317 
struct ar531x_boarddata {
        u_int32_t magic;             /* board data is valid */
#define AR531X_BD_MAGIC 0x35333131   /* "5311", for all 531x platforms */
        u_int16_t cksum;             /* checksum (starting with BD_REV 2) */
        u_int16_t rev;               /* revision of this struct */
#define BD_REV  4
        char   boardName[64];        /* Name of board */
        u_int16_t major;             /* Board major number */
        u_int16_t minor;             /* Board minor number */
        u_int32_t config;            /* Board configuration */
#define BD_ENET0        0x00000001   /* ENET0 is stuffed */
#define BD_ENET1        0x00000002   /* ENET1 is stuffed */
#define BD_UART1        0x00000004   /* UART1 is stuffed */
#define BD_UART0        0x00000008   /* UART0 is stuffed (dma) */
#define BD_RSTFACTORY   0x00000010   /* Reset factory defaults stuffed */
#define BD_SYSLED       0x00000020   /* System LED stuffed */
#define BD_EXTUARTCLK   0x00000040   /* External UART clock */
#define BD_CPUFREQ      0x00000080   /* cpu freq is valid in nvram */
#define BD_SYSFREQ      0x00000100   /* sys freq is set in nvram */
#define BD_WLAN0        0x00000200   /* Enable WLAN0 */
#define BD_MEMCAP       0x00000400   /* CAP SDRAM @ memCap for testing */
#define BD_DISWATCHDOG  0x00000800   /* disable system watchdog */
#define BD_WLAN1        0x00001000   /* Enable WLAN1 (ar5212) */
#define BD_ISCASPER     0x00002000   /* FLAG for AR2312 */
#define BD_WLAN0_2G_EN  0x00004000   /* FLAG for radio0_2G */
#define BD_WLAN0_5G_EN  0x00008000   /* FLAG for radio0_2G */
#define BD_WLAN1_2G_EN  0x00020000   /* FLAG for radio0_2G */
#define BD_WLAN1_5G_EN  0x00040000   /* FLAG for radio0_2G */
        u_int16_t resetConfigGpio;   /* Reset factory GPIO pin */
        u_int16_t sysLedGpio;        /* System LED GPIO pin */

        u_int32_t cpuFreq;           /* CPU core frequency in Hz */
        u_int32_t sysFreq;           /* System frequency in Hz */
        u_int32_t cntFreq;           /* Calculated C0_COUNT frequency */

        u_int8_t  wlan0Mac[6];
        u_int8_t  enet0Mac[6];
        u_int8_t  enet1Mac[6];

        u_int16_t pciId;             /* Pseudo PCIID for common code */
        u_int16_t memCap;            /* cap bank1 in MB */

        /* version 3 */
        u_int8_t  wlan1Mac[6];       /* (ar5212) */
};
#endif


int encode_crypt(char *src, char *dst, int headersize, int type, int src_size);

int cookie_check(char *req_cookie);
void cookie_set_send(void);
int flash_writing_test( int step, unsigned char data );
int copy_firmware(char *src, int srcoffset, char *dest, int destoffset);
int copy_firmware_with_size(char *src, int srcoffset, char *dest, int destoffset, int size);
int check_firmware(char *filename, int offset);
int compare_firmware_version(char *f1, char *f2);
int firmware_rollback(void);
int get_data_offset_in_firmware( char *filename );

void fwsched_checker(int duration);

#ifdef USE_MERGE_TO_INIT
int iptablesq_main(void); 
int apcpd_main(void); 
#endif
#ifdef USE_ARP_PROTECTION
int arpprotection_main(int period, char *ifname); 
int get_arp_protection(int *flag, int *period, char *ifname);
int set_arp_protection(int flag, int period, char *ifname);
#endif

int soft_reset(void);


#ifdef USE_IP3210
int ip3210_update_hnat(void);
int ip3210_send_hnat_cmd(char *cmd);
int ip3210_set_port_qos( int hwport, int txrate, int rxrate );
unsigned short mdio_read(int phy_id, int reg_num);
void mdio_write(int phy_id, int reg_num, unsigned short value);
#endif

#define CPU_PORT_ALIAS 0xffff
#define WAN_PORT_ALIAS 0xfffe

typedef struct port_mirror_s {
	int enable;
	int mirrored_port;
	int mirror_port;
} port_mirror_t;

#ifdef USE_PORT_ADVANCED_MIRROR
#ifdef USE_MV6281
int set_mirroring_port(int port, int enable);
int get_mirroring_port(void);
int set_mirrored_port(int port, int enable);
int get_mirrored_port(void);
int init_port_mirror(void);
int set_mirroring_op(int op);
int get_mirroring_op(void);
#else

int get_port_mirror( port_mirror_t *port_mirror);
int set_port_mirror( port_mirror_t *port_mirror);
int init_port_mirror( void );
#ifdef USE_IP3210
int ip3210_set_port_mirror(port_mirror_t *port_mirror);
#endif //USE_IP3210
#endif // USE_MV6281
#endif // USE_PORT_ADVANCED_MIRROR

int set_port_hwqos_rate(int port, int txrate, int rxrate);
int get_port_hwqos_rate(int port, int *txrate, int *rxrate);
int init_port_hwqos(void);

int get_udp_hw_nat(void);
int set_udp_hw_nat(int flag);
int init_hw_nat(void);

#ifdef USE_PPPOE_SCHEDULE
/* iconfig.cfg ->  pppoe_sched+{}={flag=0|1},{start hour},{start_min},{end_hour},{end_min} */  
#define MAX_PPPOE_SCHED 32

#define PPPOE_BLOCK_STATUS 0x1
#define PPPOE_RUN_STATUS   0x0

typedef struct pppoe_sched_s {
#define MAX_WAN_NAME 16
	char wan_name[MAX_WAN_NAME];
	int flag;
	int shour;
	int smin;
	int ehour;
	int emin;
} pppoe_sched_t;


int make_pppoe_sched_tag( char *tag, int taglen, pppoe_sched_t *pppoe_sched);
int get_pppoe_schedule(int idx, pppoe_sched_t *pppoe_sched);
int add_pppoe_schedule(pppoe_sched_t *pppoe_sched);
int remove_pppoe_schedule(char *tag);
int set_pppoe_schedule_flag(char *wan_name,int flag);
int get_pppoe_schedule_flag(char *wan_name);
int get_pppoe_schedule_status(char *wan_name, int *ruleidx);
int set_pppoe_schedule_status(char *wan_name, int status , int ruleidx);
int remove_pppoe_schedule_status(char *wan_name);
int update_pppoe_scheduler(void);
int process_pppoe_schedule(char *wan_name);


typedef struct pppoe_sched_cache_s {
	int wan1_flag;
#ifdef USE_DUAL_WAN
	int wan2_flag;
#endif
	int sched_count;
#ifdef USE_DUAL_WAN
	pppoe_sched_t pppoe_sched[MAX_PPPOE_SCHED*2];
#else
	pppoe_sched_t pppoe_sched[MAX_PPPOE_SCHED];
#endif
} pppoe_sched_cache_t;
#endif

int get_pppoe_ifname(char *wan_name, char *pppifname);

int set_router_mode(char *mode);
int get_router_mode(char *mode);

unsigned int get_system_running_time(void);
unsigned int get_internet_connected_time(char *wan_name);
unsigned int set_internet_connected_time_now(char *wan_name);


int get_multicast_forward_wireless(void);
int set_multicast_forward_wireless(int flag);
int get_igmp_proxy(void);
int set_igmp_proxy(int flag);
int get_iptv_config(void);
int set_iptv_config(int flag, int rbt);
int set_iptv_system(int flag);
#define PUBLIC_IPTV_FLAG 0x1
#define PRIVATE_IPTV_FLAG 0x2


int init_rt288x(void);


#ifdef USE_DUAL_WAN
extern int icmpecho(unsigned char *d_mac, unsigned int d_ip, unsigned char *s_mac, unsigned int s_ip, char *interface, int flag, int timeout);
extern int dnsquery(unsigned char *d_mac, unsigned int d_ip, unsigned char *s_mac, unsigned int s_ip, char *domain_name, char *interface, int flag, int timeout);

#endif


int set_dhcp_auto_restart(char *ifname,int flag);
int get_dhcp_auto_restart(char *ifname);

typedef struct led_control_s {
        int flag;
#define LED_ALWAYS_ON 0
#define LED_ALWAYS_OFF 1
#define LED_SCHEDULE_OFF 2 
        unsigned int start; /* day timestamp secs */
        unsigned int end;
} led_control_t;

int get_led_silent_control(led_control_t *ledctl);
int set_led_silent_control(led_control_t *ledctl);
int get_led_silent_state(void);


typedef struct gu_config_s {
        int gu_run;
        int gu_retry_period;
        int gu_modem_flag;
}gu_config_t;


typedef struct gu_url_s {
	int run;
	int skip_count;
        char desc[256];
        char url[2048];
} gu_url_t;



typedef struct gu_status_s {
        char desc[256];
        int tcount;
        int tfail;
        unsigned int next_offset;
        unsigned int slotbase;
} gu_status_t;

int get_gu_url(int idx, gu_url_t *gu_url);


int get_gu_config( gu_config_t *gu_config);
int set_gu_config( gu_config_t *gu_config);
int parse_gu_status(char *v,gu_status_t *gu_status);
int get_gu_status(char *desc, gu_status_t *gu_status);
int set_gu_status(gu_status_t *gu_status);

unsigned int get_random_int(void);
unsigned char get_random_byte(void);


int update_led_silent_control(int forced,int on);

int update_pptp_config(void);

int sysget_ui_version(void);
int sysset_ui_version(int ui_ver);


int get_ispfake(char *newpath);
int set_ispfake(int flag, char *newpath);
int set_all_ports_down(void);
int set_all_ports_up(void);

int sysget_config_size(void);
int sysset_config_size(int size);

int sysget_max_config_size(void);
int sysset_max_config_size(int size);


void refresh_saveinfo(void);

#ifdef USE_SAVE_INFO
/* Deprecated */
//#define REFRESH_SAVEINFO refresh_saveinfo();
#define REFRESH_SAVEINFO
#else
#define REFRESH_SAVEINFO
#endif

void init_config_cache(void);
int waitfor(int fd, int timeout);

int set_hw_nat(int flag);
int get_hw_nat(void);
int set_address_learning_flag(int flag);
int get_address_learning_flag(void);

#define IE_AGENT     0
#define IPHONE_AGENT 1
int get_agent_id(void);

int get_use_local_gateway(void);
int set_use_local_gateway(int flag);

int decode_crypt(char *src, char *dst, int headersize, int type, int src_size);


typedef struct apcp_station_info_s { 
	char mac[20];
	char hostname[128];
	char version[128];
	char product_name[128];
	char lan_ip[20];
	char subnet[20];
	char dhcp[20];
	int ifidx;
	int webui_port;
#ifdef USE_SYSINFO
	char type[32]; // wired_router|wireless_router|extender|ap
#endif
	int iux;
} apcp_station_info_t;

int apcp_add_iptime_station(unsigned char *mac, char *message);
int apcp_get_iptime_station(int idx, apcp_station_info_t *apcpsta);
int apcp_remove_all_iptime_station(void);
int apcp_get_station_count(void);

#ifdef USE_MSSID_QOS
extern int mssid_qos_set(int bss_idx, int down, int up);
extern int mssid_qos_clear_all(int wl_mode);
extern void mssid_qos_config(void);
#endif

int set_run_led_op(char *op);
int get_run_led_op(char *op);

int set_wan_for_lan(int flag);
int get_wan_for_lan(void);
int init_wan_for_lan(void);

int set_pppoe_relay_enabled(int flag);
int get_pppoe_relay_enabled(void);

int init_rtl98_hwnat(void);

#ifdef USE_APCPD_SUPPORT
int get_apcplan_flag(void);
int set_apcplan_flag(int flag);
#endif

#ifdef USE_SKT_SEMO_OPTION
int get_skt_semo_option(void);
int set_skt_semo_option(int flag);
#endif

#ifdef USE_URL_REDIRECT
#define FREE_DEVICE_MARK        0x8888

int init_url_redirection_chain(void);
int init_url_redirection(int make_interface);
int clear_url_redirection(void);
int appply_url_redirect_option(void);
int get_url_redirect_option(char *url);
int set_url_redirect_option(int flag, char *url);
int get_url_redirect_autoconfirm(void);
int set_url_redirect_autoconfirm(int on);
int get_url_redirect_whitelist(char *url);
int set_url_redirect_whitelist(char *url);
int get_url_redirect_usermsg(char *msg);
int set_url_redirect_usermsg(char *msg);
int get_url_redirect_usermsg2(char *msg);
int set_url_redirect_usermsg2(char *msg);
int get_url_redirect_btnmsg(char *msg);
int set_url_redirect_btnmsg(char *msg);
int get_url_redirect_cycle(void);
int set_url_redirect_cycle(int cycle);
#define URL_REDIR_FREEDEVICE_MAX_COUNT	10
int add_url_redir_freedevice(char *ip, char *desc);
int remove_url_redir_freedevice(char *ip);
int get_url_redir_freedevice(int idx, char *ip, char *desc);
int get_url_redir_freedevice_num(void);
#endif

#ifdef USE_PLANTYNET
enum {
        FREE_USER = 0,
        PAID_USER,
        UNREGISTER_USER,
        EXPIRED_USER,
        TERMINATION_USER,
        EXPIRED_NOTICE_USER,
        OTHER_USER

};

#ifdef USE_PLANTYNET_V2
#define PLANTYNET_SYNC_INTERNET_BLOCK_DEVICE	0x1  /* ISYN */
#define PLANTYNET_SYNC_FREE_DEVICE      	0x2  /* ESYN */
#define PLANTYNET_SYNC_CACHE_RESET      	0x4  /* CRST */
#define PLANTYNET_SYNC_NOTICE           	0x8  /* NTC */

#define PLANTYNET_ADD_FREE_DEVICE        	0x100  /* from UI */
#define PLANTYNET_DEL_FREE_DEVICE        	0x200  /* from UI */

int plantynet_service_request(char *protocol, char msg, char *mac, char *msg_data);
int plantynet_service_event(int event, char *value);
#else
int plantynet_service_request(char msg, char *msg_data);
#endif
int set_plantynet_service(int op);
int get_plantynet_service(void);
int set_plantynet_status(char *status);
int get_plantynet_status(char *status);
int add_plantynet_freedevice(char *mac, char *desc);
int remove_plantynet_freedevice(char *mac);
int get_plantynet_freedevice(int idx, char *mac, char *desc);
int get_plantynet_freedevice_num(void);
#ifdef USE_PLANTYNET_V2
int apply_plantynet_freedevice(char *message);
int apply_plantynet_blockdevice(char *message);
int notice_plantynet_iptables(int on, char *url);
int notice_plantynet_view_node(char *ipaddr);
#endif
int get_plantynet_service_server(char *sname);
int set_plantynet_service_server(char *sname);
int get_plantynet_web_server(char *sname);
int set_plantynet_web_server(char *sname);
#endif

int add_remotepc_config( remotepc_t *r);
int remove_remotepc_config(char *macaddr);
int get_remotepc_config(int idx, remotepc_t *r);
int get_remotepc_num( void );

#ifdef USE_STP
int stp_set_operation(char *brname, int op);
int stp_get_operation(char *brname, int *op);
int stp_set_bridge_priority(char *brname, int priority);
int stp_get_bridge_priority(char *brname, int *priority);
int stp_set_bridge_forward_delay(char *brname, int value);
int stp_get_bridge_forward_delay(char *brname, int *value);
int stp_set_bridge_hello_time(char *brname, int value);
int stp_get_bridge_hello_time(char *brname, int *value);
int stp_set_bridge_max_message_age(char *brname, int value);
int stp_get_bridge_max_message_age(char *brname, int *value);
int stp_set_bridge_port_cost(char *brname, int port, int value);
int stp_get_bridge_port_cost(char *brname, int port, int *value);
int stp_set_bridge_port_priority(char *brname, int port, int value);
int stp_get_bridge_port_priority(char *brname, int port, int *value);
#endif



char *sf_strncpy(char *dst,char *src,int n);
char *sf_strcpy(char *dst,char *src);

int is_default_config(void);
int set_default_status(int flag);

int set_usbled(int usbidx,int on);
int turnoff_usbled(void);
int get_usbidx_by_devname(char *devname);
int check_usbdev_exist_by_idx(int idx);
int check_usbdev_is_active(int idx);




int local_gateway_is_default_gateway(void);

int get_hwaddr_by_ip(char *ip_addr, char *hw_addr);

int get_auto_reboot_period(void);
int set_auto_reboot_period(int period);


typedef struct gpio_profile_s {
	int profile_num;
	int reset;
	int run;
	int wps;
	int usb;
} gpio_profile_t;
int hwinfo_get_gpio_profile(gpio_profile_t *gp);




int get_lanwan_switch(char *mode);
int get_extender_switch(char *mode);


/* General Scheduler */
typedef struct gen_sched_s {
#define SCHED_ID_BUF_LENGTH 32
	char id[SCHED_ID_BUF_LENGTH]; /* 16 bytes random bytes */
#define SCHED_ID_LENGTH 16
	int flag;
	int everyday;  /* everyday flag: ignore wday */
	char wday[8];  /* idx: 0:sun ... 6:sat */
	int always24;     /* 24 hours : ignore shour,smin... */
	int shour;   /* 0 ~ 23 */
	int smin;    /* 0 ~ 59 */
	int ehour;
	int emin;
} gen_sched_t;

typedef struct gen_sched_act_s {
	char *sched_tag;
	int (*action)(int in_schedule); 
	int (*release)(void);
} gen_sched_act_t;

int read_sched_array(char *sched_tag, gen_sched_t *sched_arr, int max);
int add_gen_schedule(char *sched_tag, gen_sched_t *sched);
int remove_gen_schedule(char *sched_tag,char *id);
int remove_all_gen_schedule(char *sched_tag);
int parse_sched_value(char *value, gen_sched_t *sched);

int gen_sched_get_active_id(char *sched_tag, char *id);
int gen_sched_set_active_id(char *sched_tag, char *id);
int gen_sched_remove_active_id(char *sched_tag);



#define MAX_SCHEDULER_NUM 256
#define GEN_SCHEDULER_CONFIG_PREFIX "/etc/gen_sched"



/* wifi scheduler */
typedef struct wifi_sched_s {
	int flag;
	int policy; 
#define WIFI_POLICY_ON 1
#define WIFI_POLICY_OFF 2
#define WIFI_POLICY_MAC 3
} wifi_sched_t;


int wifi_scheduler_2g(int in_sched);
int wifi_scheduler_5g(int in_sched);
int wifi_release_2g(void);
int wifi_release_5g(void);

int read_wifi_sched_config(char *ifname, wifi_sched_t *wifi_c);
int write_wifi_sched_config(char *ifname, wifi_sched_t *wifi_c);
int get_random_str(char *pstr, int length);



typedef struct snmp_conf_s {
        int run;
        int service_port;
        char community[128];
        char sysname[128];
        char location[128];
        char contact[128];
        char desc[128];
} snmp_conf_t;
int write_snmp_conf(snmp_conf_t *snmpc);
int read_snmp_conf(snmp_conf_t *snmpc);
int apply_snmp_conf(snmp_conf_t *snmpc);

extern char * get_racfg_filename(int wl_mode);
extern char *get_wl_ifname(int wl_idx);

int check_module_installed(char *module_name);


int configure_bridge_network_for_extender(void);

int set_wps_auto_dhcpc(int flag);
int get_wps_auto_dhcpc(void);


int get_ap_sync_config(char *ifname,char *config_tag);
int set_ap_sync_config(char *ifname,char *config_tag, int enable);

int get_iflocal_wl(char *ifname);
int set_iflocal_wl(char *ifname);

int get_wps_open_cgi(void);
int set_wps_open_cgi(int flag);

int get_mtu_config(char *wanname);
void log_to_catch_hacker(char *post);
int check_default_pass(void);
int check_valid_account(void);


int check_over_c_class(void);


int get_bootconfig(char *tag,char *value);
int set_bootconfig(char *action,char *value);

int pop_queue(char *qname,char *val,int maxval);
int push_queue(char *qname,char *val);
int check_queue(char *qname);


int get_timezone_abbr_from_config(char *tz);


int get_jumbo_frame_control(void);
int set_jumbo_frame_control(int flag);
int apply_jumbo_frame_control(int flag);
void init_jumbo_frame(void);

int bcm_all_led_control(int on);

int patch_for_mcsoffset_a3004(void);
int patch_for_korea_regulation(void);

int is_factory_test_mode(void);
int set_ftm_cache(void);

#ifdef USE_USB_MODULE_RELOAD_WA
int check_usb_reload_case(void);
int bcm_set_enable_usb30(int flag);
int bcm_get_enable_usb30(void);


#endif



/* Boot config */
typedef struct boot_config_s {
         char boot_magic[8];
#define BOOT_CONF_MAGIC_VAL "BOOTCON"
         unsigned int iptv;
         char factory_test_mode[4];
#define FACTORY_TEST_MODE_MAGIC  "FTM"
         unsigned int kt_flag;
#define MAX_OEM_PROFILE_LEN 16
         int oem_profile_flag;
         char oem_profile[MAX_OEM_PROFILE_LEN];

#define MAX_SENDAUTH2_MAGIC_LEN 4 
#define SENDAUTH2_MAGIC "SA2"
         char send_auth2_magic[MAX_SENDAUTH2_MAGIC_LEN];

#ifdef  USE_RT288X
         unsigned int reserved[53];
#else
	unsigned int reserved[117];
#endif
} boot_config_t;



int flash_get_bootconfig( boot_config_t *bc);
int flash_set_bootconfig( boot_config_t *bc);
int flash_set_default_bootconfig(void);

int set_ftm_cache(void);
int is_factory_test_mode(void);
int set_bootconfig(char *action, char *tag_val);
int get_bootconfig(char *tag,char *value);
int start_runled(void);
int stop_runled(void);

/* system info */
typedef struct mem_info_s {
	unsigned int dram_size_mb;
	unsigned int flash_size_mb;
#ifdef USE_ADDITIONAL_NAND_SUPPORT
	unsigned int nflash_size_mb;
#endif
} mem_info_t;
int get_meminfo(mem_info_t *mi);


int get_upper_ap_status(void);
int set_extender_xmode(int flag);
int get_extender_xmode(void);


int update_firmware(char *fn);
int verify_firmware(char *fn);



typedef struct fan_control_s {
#define MAX_FAN_METHOD_LEN 16
        char method[MAX_FAN_METHOD_LEN]; /* manual, auto */
#define MAX_FAN_OP_LEN 8
        char manual_op[MAX_FAN_OP_LEN]; /* max,min,off */
        int maxtemper; /* if over maxtemper, fan is max */
        int mintemper; /* if under mintemper, fan is off */
} fan_control_t;

int get_fan_config(fan_control_t *fan);
int set_fan_config(fan_control_t *fan);
int check_fan_control(int temper);
int check_fan_status(int temper);
int get_temperature(char *chipset);

int fan_control(char *op);
int get_fan_status(void);

int hwinfo_get_fan_control_default(fan_control_t *fc);



#define FIRMUP_CHK_NOACTION 0
#define FIRMUP_CHK_TRYING   1
#define FIRMUP_CHK_FOUND_NEW_VERSION        3
#define FIRMUP_CHK_NO_NEED_UPDATE           4
#define FIRMUP_CHK_FAILED	            5

#define FIRMUP_CHK_VERSION_FILE	"/tmp/firmup_ver"


#define FIRMUP_COMP_FAILED	-1
#define FIRMUP_COMP_NONEED	-2



int get_firmupcheck_status(void);
int set_firmupcheck_status(int status);
int get_firmupcheck_version(char *version);



#define FIRMUP_STATUS_NOACTION                  0
#define FIRMUP_STATUS_START_UPGRADE             1
#define FIRMUP_STATUS_CHECKING_VERSION          2
#define FIRMUP_STATUS_DOWNLOADING_FIRMWARE      3
#define FIRMUP_STATUS_CHECKING_FIRMWARE         4
#define FIRMUP_STATUS_WRITING_FIRMWARE          5
#define FIRMUP_STATUS_DONE                      6

#define FIRMUP_STATUS_DOWNLOAD_FIRMWARE_FAILED          10
#define FIRMUP_STATUS_CHECKING_FIRMWARE_FAILED          11
#define FIRMUP_STATUS_CHECKING_VERSION_FAILED           12
#define FIRMUP_STATUS_WRITING_FAILED                    13
#define FIRMUP_STATUS_DOWNLOAD_CANCEL_FAILED            14

#define FIRMUP_STATUS_WRITE_COMMAND 			100

#define DOWNLOAD_TEMP_FIRMWARE "/tmp/firmware"

int get_firmup_status(void);
int set_firmup_status(int status);


int is_mobile_agent(void);
int check_invalid_hwaddr(char *hwaddr);
int check_same_subnet_with_local(char *ipaddr);


int mtk_optimize_set(char *opt);


/* wifi scheduler */
typedef struct autoreboot_config_s {
	int flag;
} autoreboot_config_t;

int get_autoreboot_config(autoreboot_config_t *ac);
int set_autoreboot_config(autoreboot_config_t *ac);
int autoreboot_scheduler(int in_sched);


int get_wifi_switch_status(void *);
int get_ledswitch_status(void *);


int get_usb_devidx_by_block_devname(char *devname);
int get_block_devname_by_usb_devidx(int usb_devidx,char *devname);
int set_usbdev_idx_cache(char *devname,int idx);
int get_usbdev_idx_cache(char *devname);
int remove_usbdev_idx_cache(char *devname);

#ifdef USE_SECURITY_PATCH_1
int set_csrf_op(int op);
int get_csrf_op(void);
int set_csrf_whites(char *whites);
int get_csrf_whites(char *whites);
int check_referer(char *referer);
#endif

int check_and_copy_firmware(void);

int set_usb_mode(int mode);
int get_usb_mode(void);
int init_usb_mode(void);

int check_alpha_num(char *s);
int check_unpermitted_chars(char *s);
int check_unpermitted_ssid_chars(char *s);
int check_unpermitted_password_chars(char *s);
char *convert_html_special_char_to_html_code(char *s);
int check_ip_str(char *s);


int get_router_mgmt_port(void);
int set_router_mgmt_port(int mgmt_port);


int get_macclone_in_giga(void);
int set_macclone_in_giga(int flag);

int quote_r(char *s,int max);

int conv_ssid_html(char *s,char *r);

int set_port_role(char *role,int commit);
char *get_port_role(void);
int init_port_role(void);

#ifdef USE_UPNP_RELAY
int set_upnp_relay(int flag);
int get_upnp_relay(void);
int discover_upper_upnp_igd(void);
int upnp_relay(char *params);
#endif

int siconv_main(int argc, char **argv); 
int convconf(int argc, char **argv); 
void conv_config_utf8(void);
void convert_file_euckr_to_utf8(char *fn);
int check_tag_val(char *fn,char *tag,char *val,int maxcheckline);
int convert_euckr_to_utf8(unsigned char *p1, unsigned char *p2);


int get_dhcp_chk_info(char *ifname,char *ip,char *mask);
int get_dhcp_chk_extinfo(char *ifname,char *ip,char *mask,char *gw,char *dns);
int set_dhcp_chk_info(char *ifname,char *ip,char *mask,char *gw,char *dns);



typedef struct ip_s {
        int  scan_type;
#define SCAN_BY_DHCP 1
#define SCAN_BY_PASSIVE_ARPSCAN 2
#define SCAN_BY_ACTIVE_ARPSCAN 3
#define MAX_IPBUF_LEN 32
        char ip[MAX_IPBUF_LEN];
        char mask[MAX_IPBUF_LEN];
} ip_t;

typedef struct iplist_s {
        int count;
#define MAX_IPSCANLIST 256
        ip_t iplist[MAX_IPSCANLIST];
} iplist_t;

int check_helper_ip(char *ip);

int redirect_login(void);


int get_ftm_flag(void);
int set_ftm_flag(int flag);

int get_oem_profile_for_setting(char *profile,int max);
int has_installed_iux_packaged(void);

int wireless_api_check_station_exist(char *wl_ifname, char *target_mac);

#ifdef USE_MULTI_LANG
void get_ux_lang(char* lang);
void get_system_lang(char *lang);
int set_system_lang(char* lang);
int get_syslog_text_size();
char *get_ux_text_syslog(int idx);
void set_ux_text_syslog();
void make_country_names();
void set_ux_text_lib_string();
char *get_ux_text_lib_string(int idx);
#endif

char* itoa_with_comma(unsigned long long value, int is_unsigned);
int wl_helper_is_started(void);


#ifdef USE_SYSTEM_LOG
typedef struct {
	FILE *fp;
	int id;
	char *buffer;
	size_t buffer_length;
} syslog_msg_input;

typedef struct {
        int level;
        int logid;
        char *timestamp;
	size_t message_length;
#define SYSLOG_MAX_ARGS_SUPPORT 8
        char *message, *args[SYSLOG_MAX_ARGS_SUPPORT];
} syslog_msg_data;

int syslog_read_syslog_msg	(syslog_msg_input *input, syslog_msg_data *data);
void malloc_syslog_msg_structure(syslog_msg_input *input, syslog_msg_data *data, int id);
void free_syslog_msg_structure  (syslog_msg_input *input, syslog_msg_data *data);

#ifdef USE_MULTI_LANG
typedef struct {
        char *str;
        size_t size;
} syslog_string;

void malloc_syslog_string(syslog_string *string);
void free_syslog_string(syslog_string *string);
void syslog_string_strcpy(syslog_string *string, char *message);
void syslog_string_strncat(syslog_string *string, char *message, size_t size);
void syslog_string_strcat(syslog_string *string, char *message);
void syslog_string_reserve(syslog_string *string, size_t size);
void syslog_decode_text(char *before, syslog_string *after);
void syslog_convert_syslog_message(syslog_string *msg_buffer, syslog_string *tmp_buffer);
#endif
#endif

#ifdef USE_FAN_CONTROL
int is_support_fan();
#endif


#ifdef USE_QCA
int qca_get_connected_apinfo(char *ifname,ap_info_t *ap_info);
#endif


#endif


