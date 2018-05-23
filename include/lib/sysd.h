#ifndef __SYSD_H
#define __SYSD_H

#ifdef USE_SYSINFO
extern sysinfo_t si_sysd;
#endif


typedef struct app_timer_s {
        int valid;
        char name[64];
        int period;  /* period is zero, it is not period timer callback */
#define REALTIME_FLAG 0x80000000
        int (*callback)(struct app_timer_s *t); /* if return 0, don't run again, if return 1, run after period */
        int counter;
        int run_counter;
        int event_map;
	int run_now;
} app_timer_t;


#define MINS 60
#define HOUR 60*MINS
#define DAY HOUR*24



typedef struct config_cache_s {
	char wan_name[16];
	char wan_type[32];
	int  dhcpc_pid;
	int  ppp_pid;
	char wan_ip[20];
	char wan_oldip[20];
	int wanip_changed;
	char ifname[16];

#if defined USE_WIRELESS_WAN_SELECTION || defined USE_WL_WAN_MB
	int wwan_enable;
#endif
#ifdef USE_REAL_HUB_MODE
	int hub_mode_enable;
#endif
#ifdef USE_LINKUP_DHCP_RESTART
	int dhcp_auto_restart;
#endif
#ifdef USE_BCM5354
	int run_led_mode;
#define RUNLED_BLINK 0
#define RUNLED_ON 1
#define RUNLED_OFF 2
#endif

#ifdef USE_RTL8196B
	int hw_nat_enabled;	
#endif

} config_cache_t;

#ifdef USE_DUAL_WAN
#define NUM_OF_WAN 	2
#else
#define NUM_OF_WAN 	1
#endif
extern config_cache_t config_cache[NUM_OF_WAN];

#define MAX_APP_TIMER 50

#define EVENT_WAN_IP_CHANGED 0x1
#define EVENT_CONFIG_UPDATE  0x2
#define EVENT_REALTIME_UPDATE   0x4

int update_signal_process(int event);

void init_timers(void);
int insert_timer(char *name, int period, int (*callback)(app_timer_t *t), int event_map);
void run_timers(int period, int loglevel);
int start_timer(char *name);
int stop_timer(char *name);
int update_timer_event(int evt);
int get_timer_valid(char *name);


int qos_callback(app_timer_t *t);
#ifdef USE_SMART_QOS
int smart_qos_callback(app_timer_t *t);
#endif
int fakedns_callback(app_timer_t *t);
int update_remote_mgmt_callback(app_timer_t *t);
int ez_ipupdate_callback(app_timer_t *t);
int dyn_portforward_callback(app_timer_t *t);
int fwsched_callback(app_timer_t *t);
int ipclone_callback(app_timer_t *t);
int timed_callback(app_timer_t *t);
int keepalive_ping_callback(app_timer_t *t);
int icmp_solicite_message_callback(app_timer_t *t);
int check_daemon_callback(app_timer_t *t);
int process_ppp_callback(app_timer_t *t);
#ifdef USE_DUAL_WAN
int process_ppp2_callback(app_timer_t *t);
int check_main_routering_table_callback(app_timer_t *t);
int i8255x_phy_polling_callback(app_timer_t *t);

#endif
int hostscan_callback(app_timer_t *t);
int sendauth_callback(app_timer_t *t);
int syslog_email_callback(app_timer_t *t);
int netdetector_callback(app_timer_t *);
int restrict_pc_internet_callback(app_timer_t *t);
int ip_confliction_detect_callback(app_timer_t *);
int wcbridge_mac_clone_callback(app_timer_t *);
int mswds_sync_callback(app_timer_t *);
int process_lan_callback(app_timer_t *t);
int set_forwardchain_speedup_callback(app_timer_t *t);
int dhcp_protection_callback(app_timer_t *t);
int run_led_callback(app_timer_t *t);
int wps_callback(app_timer_t *t);
int wps5g_callback(app_timer_t *t);
int wps_concurrent_callback(app_timer_t *t);
int wps_pbc_callback(app_timer_t *t);
int wps_2g_extender_callback(app_timer_t *t);
int wps_5g_extender_callback(app_timer_t *t);
int kai_callback(app_timer_t *t);
int hubmode_callback(app_timer_t *t);
int mbridge_auto_channel_callback(app_timer_t *t);
int mbridge_auto_channel_callback_5g(app_timer_t *t);
#ifdef USE_MBRIDGE_STATUS_DAEMON 
int mbridge_status(app_timer_t *t);
int mbridge_status_5g(app_timer_t *t);
#endif
int wanlink_monitor_callback(app_timer_t *t);
#ifdef USE_IGMP_PROXY
int igmp_proxy_callback(app_timer_t *t);
#endif
int led_silent_control_callback(app_timer_t *t);
#ifdef USE_SHRINK_MEM
int shrink_mem_callback(app_timer_t *t);
#endif
#ifdef USE_GET_URL
int get_url_callback(app_timer_t *t);
#endif
#ifdef USE_FAST_L2_ROAMING
int fast_l2_roaming_callback(app_timer_t *t);
#endif
#if defined(USE_RT305X_WITH_EXTERNAL_SWITCH) && (defined(USE_RTL8326) || defined(USE_RTL8318P))
int port_speed_led_control_callback(app_timer_t *t);
#endif


int mbridge_reconnect_callback(app_timer_t *t);

int auto_reboot_callback(app_timer_t *t);

int lgdacom_snmp_nat_aware_rule(int new, int old);

int restart_wscd(char *ifname, int forced);

#ifdef USE_URL_REDIRECT
int url_redirect_check_host_callback(app_timer_t *t);
#endif

#ifdef USE_WL_IPTIME_HELPER
int wl_iptime_helper_callback(app_timer_t *t);
#endif

#ifdef USE_ROUTER_NAS
int nas_callback(app_timer_t *t);
#endif

#ifdef USE_HTTP_SESSION
int session_callback(app_timer_t *t);
#endif
int get_run_led_state(void);


int dcs_2g_callback(app_timer_t *t);
int dcs_5g_callback(app_timer_t *t);
int gen_sched_callback(app_timer_t *t);

#ifdef USE_SNMPD
int snmpd_callback(app_timer_t *t);
#endif
#ifdef USE_PLANTYNET
int plantynet_callback(app_timer_t *t);
#ifdef USE_PLANTYNET_V2
int plantynet_keepalive_callback(app_timer_t *t);
int plantynet_sync_callback(app_timer_t *t);
#endif
#endif
int restart_8021xd_callback(app_timer_t *t);
#ifdef USE_BAND_STEERING
int restart_band_steering_callback(app_timer_t *t);
#endif
int fuse_callback(app_timer_t *t);

int wps_extender_cb(app_timer_t *t);
int wps_extender_2g_cb(app_timer_t *t);
int wps_extender_5g_cb(app_timer_t *t);

int wps_auto_dhcpc_callback(app_timer_t *t);
int wps_open_cgi_callback(app_timer_t *t);

int media_callback(char *arg);
int torrent_callback(char *arg);

int reloadusb_callback(app_timer_t *t);
int tethering_callback(app_timer_t *t);

int apache_callback(char *arg);
int mysql_callback(char *arg);

int firmup_callback(app_timer_t *t);
int firmupui_callback(app_timer_t *t);
int firmupcheck_callback(app_timer_t *t);

int fan_control_callback(app_timer_t *t);


int upnp_download_callback(app_timer_t *t);

int lp_callback(app_timer_t *t);
int check_periodic_callback(app_timer_t *t);
int wifi_switch_callback(app_timer_t *t);


int wifi_switch_callback(app_timer_t *t);


#endif
