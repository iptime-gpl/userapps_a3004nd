
#ifndef __LIB_WIRELESS_H__
#define __LIB_WIRELESS_H__

#define MAX_BSS_NUM 4
#define MAX_SSID_BUFLEN 128
#define MAX_SSID_LENGTH    32 
#define MAX_WL_COUNTRY 8
#define MAX_IFNAME_LEN 32

#ifndef USE_SYSINFO
#ifdef USE_MULTI_PLATFORM
#define WL_IPTIME_HELPER_SSID "iptime_multi_setup_ssid"
#else

#ifdef USE_1PORT_AP

#define WL_IPTIME_HELPER_IP "192.168.254.1"
#ifdef USE_DOME_PLATFORM
#define WL_IPTIME_HELPER_SSID "iptime_ring_setup"
#endif
#else

#ifdef USE_MINI_IPTIME_HELPER
#define WL_IPTIME_HELPER_SSID "iptime_mobile_ap_setup_ssid"
#else

#ifdef USE_TOTO_PRODUCT
#ifdef USE_EXTENDER_ONLY
#define WL_IPTIME_HELPER_SSID "totolink_extender_setup_ssid"
#else
#define WL_IPTIME_HELPER_SSID "totolink_setup_ssid"
#endif
#else
#ifdef USE_EXTENDER_ONLY
#define WL_IPTIME_HELPER_SSID "iptime_extender_setup_ssid"
#else
#define WL_IPTIME_HELPER_SSID "iptime_setup_ssid"
#endif
#endif
#endif
#endif

#endif
#define WL_IPTIME_HELPER_PASSWORD "12098309ausoifuaOsidflAisur091Q84uoqif"
#endif


#define ISL3890_DRIVER_MODULE_PATH "/lib/modules/net/islpci.o"
#define INPROCOMM_DRIVER_MODULE_PATH "/lib/modules/net/IPN2220AP.o"
#define INPROCOMM_STA_DRIVER_MODULE_PATH "/lib/modules/net/IPN2220STA.o"
#define RT25XX_DRIVER_MODULE_PATH "/lib/modules/kernel/drivers/net/wireless/rt256x/rt61ap.o"

#define PCI_CODE_OK 0x0
#define PCI_CODE_DRIVER_NOT_FOUND 0x1
#define PCI_CODE_NOT_SUPPORT_MODULE 0x2


#define WIRELESS_AP_MODE 0
#define WIRELESS_CLIENT_BRIDGE_MODE 1
#define WIRELESS_CLIENT_WAN_MODE 2
#define WIRELESS_KAI_MODE 3
#define WIRELESS_MULTI_BRIDGE_MODE 4

#define MULTIBRIDGE_WITHOUT_APMODE 	0
#define MULTIBRIDGE_WITH_APMODE 	1

#define MODE_G_AND_B    1
#define MODE_B_ONLY	2
#define MODE_G_ONLY     3

#define MODE_N_ONLY     4
#define MODE_G_N	5	
#define MODE_B_G_N      6

#ifdef USE_BCM5354
#define MODE_G_PERFORMANCE 7
#define MODE_G_LRS         8 
#endif
#define MODE_N_5G 	9 
#define MODE_11AC 	10 
#define MODE_11AC_ONLY 	11

#ifdef USE_11N_SUPPORT
#define IS_N_MODE(mode) ((mode == MODE_N_ONLY)||(mode==MODE_G_N)||(mode==MODE_B_G_N)||(mode== MODE_N_5G))
#else
#define IS_N_MODE(mode) 0
#endif
#define IS_BG_MODE(mode) ((mode == MODE_G_AND_B)||(mode==MODE_B_ONLY)||(mode==MODE_G_ONLY))

#define IS_AC_MODE(mode) ((mode == MODE_11AC)||(mode==MODE_11AC_ONLY))

#define REGION_KOREA    0
#define REGION_USA      1
#define REGION_JAPAN    2
#define REGION_OTHERS   3
#define REGION_CHINA    4
#define REGION_EU	5

#define AUTH_UNKNOWN	-1
#define AUTH_OPEN       1
#define AUTH_KEY        2
#define AUTH_AUTO       3
#define AUTH_WPA	4	
#define AUTH_WPAPSK	5
#define AUTH_OPEN8021X  6
#define AUTH_WPANONE  	7
#define AUTH_WPA2	8	
#define AUTH_WPA2PSK	9
#define AUTH_WPAPSKWPA2PSK 10
#define AUTH_WPAWPA2	 11

#define MULTIBRIDGE_AUTH_WPAPSK 100

#define AUTH_NOCHANGE	100

#define ENCRYPT_UNKNOWN	-1
#define ENCRYPT_OFF     0
#define ENCRYPT_64      1
#define ENCRYPT_128     2
#define ENCRYPT_TKIP	3
#define ENCRYPT_AES	4
#define ENCRYPT_TKIPAES 5

#define WPA_ECRYPT_STRING "1,2,3,4"
#define WPAPSK_ENCRYPT_STRING "3,4"
#define SHAREDKEY_ENCRYPT_STRING "1,2"

#define KEY_STRING      0
#define KEY_HEX         1
#define KEY_PASSPHRASE  2
#define NO_KEY		-1

#ifndef USE_WIRELESSCONF_V2
#define WIRELESS_CONF_FILE      "/etc/wireless.conf"
#endif
#define DEFAULT_WIRELESS_CONF_FILE      "/var/run/wireless.conf.default"
#define DEFAULT_WIRELESS_CONF_FILE_5G      "/var/run/wireless.conf.5g.default"


#define WPS_STOPPED	0x0
#define WPS_2G_STARTED 0x1
#define WPS_5G_STARTED 0x2

/* 
   -- New wireless configuration specification --

   run -> run=1,0
   ssid -> ssid= 
   mode -> mode={gonly,bonly,gb}
   region -> region=korea,usa,japan,others,china
   channel -> channel={#channel_number}
   broadcast_ssid -> broadcast_ssid={on|off}
   auth_type -> auth_type={open|key|auto|wpa|wpapsk|open8021x|wpanone|wpapsk2|wpa2}
   encrypt_type -> encrypt_type={off|64wep|128wep|tkip|aes} 
   phrase -> passphrase= 

   auto_key -> auto_key={on|off}
   basic_key -> default_key={1~4}
   key_input -> key_input_method={hex|string|passphrase|nokey}
   wep.key1 -> wepkey1=
   wep.key2 -> wepkey2=
   wep.key3 -> wepkey3=
   wep.key4 -> wepkey4=
   wpapsk -> wpapsk_key=
   txrate_bitmap -> txrate=
   basicrate_bitmap -> basicrate_bitmap=

   net_type -> net_type={infra|adhoc} 
   tx_power -> tx_power=
   bg_protect -> bg_protect={auto|on|off}
   preamble_length; -> preamble_length={long|short}
   rts_threshold  -> rts_threshold={1 ~ 2347} 
   frag_threshold -> frag_threshold={256  ~ 2346}
   tx_burst -> tx_burst={on|off} 
   beacon_interval -> beacon_interval={50~1024}
   aggregation-> {on|off}
   short_slot -> {on|off}	

*/


typedef struct wl_channel_s {
        int control_channel;
        int central_channel;
        int center_freq;
	int crosstalk;
	int bw;
} wl_channel_t;

int wireless_get_best_channel_by_driver(char *ifname, wl_channel_t *chan);



#define OLD_WIRELESS_CONF_FILE      "/etc/wireless.conf"

#define ANTENNA_CONFIG_DIVERSITY 0
#define ANTENNA_CONFIG_RECEIVE_PRIMARY 1
#define ANTENNA_CONFIG_RECEIVE_SECONDARY 2
#ifdef USE_SELECT_KAI_SERVER
#define KAI_OBT_SERVERLIST_TEMP_FILE 	"/var/run/obtserverlist_temp"
#define KAI_OBT_SERVERLIST_FILE 	"/var/run/obtserverlist"
#endif


#define BASE_FREQ 2412
#define MFREQ_TO_NUM(x) ((x - BASE_FREQ)/5 + 1)  
#define MAX_CHANNEL 14

typedef struct {
#define WEPKEY_ARRAY_LENGTH 27
	char key1[WEPKEY_ARRAY_LENGTH];
	char key2[WEPKEY_ARRAY_LENGTH];
	char key3[WEPKEY_ARRAY_LENGTH];
	char key4[WEPKEY_ARRAY_LENGTH];
} wep_key_t;


typedef struct {
	int 	run;
        char    ssid[13];
        int     mode;
        int     region;
        int     channel;
        int     broadcast_ssid;
        int     auth_type;
        int     encrypt_type;
        char    phrase[15];
        int     auto_key;
        int     basic_key;
        int     key_input;

	union {
		wep_key_t wep;
		char wpapsk[108];
	} key;

	/* added */
	unsigned int tx_power;		
	unsigned int reserved[4];
} old_wireless_conf_t;

typedef struct {
	int 	run;
        char    ssid[36];
        int     mode;
        int     region;
        int     channel;
        int     broadcast_ssid;
        int     auth_type;
        int     encrypt_type;
        char    phrase[15];
        int     auto_key;
        int     basic_key;
        int     key_input;

	union {
		wep_key_t wep;
#define MAX_KEY_BUFLEN 108
		char wpapsk[MAX_KEY_BUFLEN];
	} key;

	/* added */
	unsigned int tx_power;		

	unsigned int txrate_bitmap;
	unsigned int basicrate_bitmap; /* -> if 0  -> all rate, if not 0 -> fixed rate */
#define MINRATE_FLAG 0x80000000
#define MAXRATE_FLAG 0x40000000
#define FIXEDRATE_FLAG 0x20000000

	unsigned int net_type;
#define UNKNOWN_MODE -1
#define INFRA_MODE 0x0
#define ADHOC_MODE 0x1
	unsigned int reserved[1];
} o_wireless_conf_t;


#ifdef USE_WMM_PARAMS_CONTROL
typedef struct wmm_tx_params_s {
	char tag[4];  /* be,bk,vi,vo */
	unsigned int short_retry;
	unsigned int short_fallback;
	unsigned int long_retry;
	unsigned int long_fallback;
	unsigned int max_rate;
} wmm_tx_params_t;

typedef struct wmm_ap_params_s {
	char tag[4];  /* be,bk,vi,vo */
	unsigned int cwmin;
	unsigned int cwmax;
	unsigned int aifsn;
	unsigned int txop_b;
	unsigned int txop_ag;
	unsigned int admin_forced;
	unsigned int oldest_first;
} wmm_ap_params_t;

typedef struct wmm_params_s 
{
#define MAX_AC 4
	wmm_ap_params_t ap_param[MAX_AC];
	wmm_tx_params_t tx_param[MAX_AC];
} wmm_params_t;

#endif

typedef struct key_s {
	wep_key_t wep;
#define MAX_WPAPSK_KEY_LEN 108
	char wpapsk[MAX_WPAPSK_KEY_LEN];
} wifi_key_t;

typedef struct {
	int 	run;
#ifndef USE_NEW_LIB
	char 	ifname[16];
#endif
        char    ssid[MAX_SSID_BUFLEN];
        int     mode;
	/* deprecated */
     // int     region;
	wl_channel_t channel;
        int     broadcast_ssid;
        int     auth_type;
        int     encrypt_type;
        char    phrase[15];
        int     auto_key;
        int     basic_key;
        int     key_input;

	wifi_key_t  key;

#if	0
	struct {
		wep_key_t wep;
		char wpapsk[108];
	} key;
#endif

	/* added */

	unsigned int txrate_bitmap;
	unsigned int basicrate_bitmap; /* -> if 0  -> all rate, if not 0 -> fixed rate */
#define MINRATE_FLAG 0x80000000
#define MAXRATE_FLAG 0x40000000
#define FIXEDRATE_FLAG 0x20000000

	unsigned int net_type;
#define INFRA_MODE 0x0
#define ADHOC_MODE 0x1


	unsigned int tx_power;		
	unsigned int bg_protect; 
#define BGPROTECT_AUTO 		0
#define BGPROTECT_ALWAYS_ON 	1
#define BGPROTECT_ALWAYS_OFF 	2
	unsigned int preamble_length;
#define LONG_PREAMBLE 0
#define SHORT_PREAMBLE 1
	unsigned int rts_threshold;
	unsigned int frag_threshold;
	unsigned int tx_burst;
	unsigned int tx_burst_slottime;
	unsigned int beacon_interval;
	unsigned int aggregation;
#define AGGREGATION_AMPDU 0x1
#define AGGREGATION_AMSDU 0x2

	unsigned int short_slot;

#ifdef USE_MULTI_BRIDGE_SUPPORT
	int mbridge_enable;
	char mbridge_ssid[MAX_SSID_BUFLEN];
	char mbridge_bssid[20];
	int mbridge_auth_mode;
	int mbridge_encrypt_type;
	int mbridge_default_key;
	int mbridge_key_type;
	wifi_key_t mbridge_key;
#ifdef USE_WL_WAN_MB	
	int wwan_enable;
#endif
#ifdef USE_STA_WDS
	int wds_enable;
#endif
	char bridge_ifname[32];
	int mbridge_auto_channel;
#endif

#ifdef USE_NEW_LIB
#ifdef USE_WIRELESS_CLIENT_BRIDGE_MODE
	char cbridge_mac[20]; 
	int cbridge_mode;
#define CBRIDGE_DYNAMIC  0
#define CBRIDGE_STATIC   1
	char cbridge_local[20];
#endif
#define MAX_BSSID_BUFLEN 36
        char    bssid[MAX_BSSID_BUFLEN];
#endif

#ifdef USE_ATH_AR2317
	int xr;
#endif
	int channel_width;
	unsigned int rdg;
#ifdef USE_MULTI_BSSID
	int mbss_policy;
#define MBSS_ALLOW_ALL 0x0
#define MBSS_ALLOW_INTERNET_ONLY 0x1
#define MBSS_ALLOW_INTERNAL_ONLY 0x2
#define NO_ALLOW_ALL 0x3
#ifdef USE_MSSID_QOS
	int tx_rate, rx_rate;
#endif
#endif

#ifdef USE_WMM
	int wmm;
	int wmm_ps;
#endif
#ifdef USE_TX_BEAMFORMING
	int tx_bf;
#endif
#ifdef USE_LDPC
	int ldpc;
#endif
#ifdef USE_STBC
	int stbc;
#endif

#ifdef USE_MS_WDS
	int wds_mode;
#define WDS_OFF 0
#define WDS_MASTER_MODE  1
#define WDS_SLAVE_MODE   2
	int wds_prefer_mode;
	char wds_slave_ssid[128];
	char wds_slave_bssid[32];
#endif
	int max_station;
#ifdef USE_LGDACOM
	char passphrase[64];
	int key_input_auto;
#endif
	int dtim;

	int pre_auth;
	int antenna_rx_diversity;
	char country[MAX_WL_COUNTRY];
	int idx;
	int akm;
	char prefix[32];
	char ifname[16];
#ifdef USE_BCM5354 
	int afterburner;
	int valid;
#endif
#ifdef USE_WPS
	int sc_status; /* simple config status */
	int wps_mode; // enabled(1) or disabled(0)
	int wps_keep_current_wlconf;
#ifdef USE_WPS_NOTIFICATION
	int wps_extended_timeout;
	int wps_notification;
	int wps_noti_run;
	char wps_noti_ssid[128];
	int wps_noti_bss;

#endif
#ifdef USE_WPS_PIN
	int wps_auto_connect;
	int accept_pin;
#endif
#endif

	int wl_mode;
#define WL_MODE_24G 	0
#define WL_MODE_5G 	1

/* wl_idx : 32 bit,    
wl_mode:upper 16bit : Index for 2.4 or 5G, 
wl_bss_idx:lower 16bit : Index for multiple bss 

*/

#ifdef USE_WMM_PARAMS_CONTROL
	wmm_params_t wmm_param;
#endif
#ifdef USE_WL_RATESET
	char ratestr[64]; /* {rate*2}{b|}, 1M,2M -> 2b,4b ... */
#endif
	int igmpsn_enable;

#ifdef USE_WIFI_EXTENDER
#if	0
	int wifi_extender; /* 0 :disable, 1: enable , 2: aponly_enable*/ 
#define EXTENDER_APONLY_OP 2
#define EXTENDER_EXTENDER_OP 1
#define EXTENDER_DISABLED 0
#endif

	int wifi_ssid_method;
#define EXTENDER_SAME_SSID_SETUP 0   
#define EXTENDER_MAC_SSID_SETUP 	1
#define EXTENDER_MANUAL_SSID_SETUP 	2

	int wifi_extender_state;
#define WIFI_EXTENDER_STATE_INIT 0
#define WIFI_EXTENDER_STATE_CONFIGURING 1
#define WIFI_EXTENDER_STATE_CONFIGURED 2
#endif
	int init_flag;

#ifdef USE_DYNAMIC_CHANNEL_SEARCH
	int dynamic_channel;
	int dcs_period_min; /* dcs -> dynamic_channel_search */
#endif
	int dfs;

#ifdef USE_RADIUS
	char radius_server[32];
	char radius_secret[128];
#define MAX_RADIUS_SECRET 128
	int radius_port;
#endif

#ifdef USE_BCM_PHY_WATCHDOG
	int phy_watchdog;
#endif

	int ui_idx;

#ifdef USE_MTK_TXBF_MUMIMO_UI
	int txbf_mu_mode;
#define MODE_ETXBF_FLAG		0x1
#define MODE_ITXBF_FLAG 	0x2
#define MODE_MU_FLAG	 	0x4
#endif
#if defined(USE_QCA_MUMIMO_UI) || defined(USE_RTL_MUMIMO_UI)
	int mu_flag;
#endif

	int num_of_streams;
} wireless_conf_t;

#define EXTENDER_AP_OP 0x1
#define EXTENDER_CLIENT_OP 0x2
#define EXTENDER_EXT_OP (EXTENDER_AP_OP|EXTENDER_CLIENT_OP)

struct bsscfg_list {
        int count;
        wireless_conf_t mbss[1];
};

struct bsscfg_list *wireless_api_get_bsscfgs(wireless_conf_t *mcfg, char *ifname);



#ifndef USE_NEW_LIB
typedef struct {
	int flag;
#define RM_FLAG 0x1
	char mac_address[20]; /* string xx:xx:xx:xx:xx:xx */
} mac_t;	

typedef struct {
	int policy;
#define OPEN_POLICY 0x0
#define ACCEPT_POLICY 0x1
#define REJECT_POLICY 0x2
	int count;
	mac_t maclist[254];
} macauth_db_t;
#else
/* New MAC DB */
typedef struct macinfo_s {
	int rmflag;
	unsigned char mac[8];
	char *info;
} macinfo_t;

typedef struct mac_db_s {
	int count;
#define MAX_MAC_DB 256
	macinfo_t mac_arr[MAX_MAC_DB];
} mac_db_t;
int wireless_apply_macauth(int wl_idx, mac_db_t *mdb);

mac_db_t *macdb_read(int bssidx,int max_mac);
int macdb_write(int bssidx, mac_db_t *mdb);
int macdb_free(mac_db_t *mdb);
macinfo_t *macdb_search(mac_db_t *mdb, char *macstr);
macinfo_t *macdb_binary_search(mac_db_t *mdb, char *macstr);

#endif
	


typedef struct auth_mac_s {
        unsigned char mac[8];
        int timestamp;
} auth_mac_t;

typedef struct auth_maclist_s {
        int count;
#define MAX_AUTH_MAC_NUM 128
        auth_mac_t maclist[MAX_AUTH_MAC_NUM];
} auth_maclist_t;



typedef struct {
       char *name;     /* Long name */
       char *code;   /* Abbreviation */
       int region_24G;
       int region_5G;
} country_name_t;



void read_wireless_default_conf(wireless_conf_t *wl_conf, char *ifname);
void read_wireless_conf(wireless_conf_t *wl_conf, char *ifname);
#ifdef USE_NEW_LIB
void write_wireless_conf(wireless_conf_t *wl_conf, char *ifname);
void set_wireless_conf(wireless_conf_t *wl_conf, char *ifname );
#else
void write_wireless_conf(wireless_conf_t *wl_conf);
void set_wireless_conf(wireless_conf_t *wl_conf, int flag);
#endif

#ifdef USE_NEW_LIB
int get_active_wl(int idx, char *ifname, int *wireless_mode);
int set_active_wl(char *ifname, int wireless_mode);
int clear_active_wl(void);
int get_wireless_mode(char *ifname, int *wireless_mode);
int get_wireless_mode_by_ipaddr(char *ip_addr);

int wireless_api_get_ifname(int bssidx, char *ifname);
char *get_wl_ifname(int wl_idx);


#define OPEN_POLICY 0x0
#define ACCEPT_POLICY 0x1
#define REJECT_POLICY 0x2
int macauth_get_policy(int bssidx);
int macauth_set_policy(int bssidx, int policy);
int macauth_search_mac(int bssidx, char *mac);
int macauth_add_mac(int bssidx, char *mac, char *info);
int macauth_del_mac(int bssidx, char *mac);
int macauth_get_mac(int bssidx, int idx, char *mac, char *info);
int macauth_get_count(int bssidx);
int macauth_get_mac_info(int idx, char *mac, char *info); 
int macauth_apply(int bssidx);
#else
int set_mac_auth_policy(macauth_db_t *mac_db, int policy);
int add_mac_auth(macauth_db_t *mac_db, char *mac);
int del_mac_auth_by_idxlist(macauth_db_t *mac_db, int *idxlist, int size );
void read_macauth_db( macauth_db_t *mac_db );
void write_macauth_db( macauth_db_t *mac_db );
int search_mac_auth( macauth_db_t *mac_db, char *mac );
#endif
int get_wireless_plugged_status(void);

typedef struct ap_info_s {
        char essid[MAX_SSID_BUFLEN];
        char bssid[20];
        char src_mac[20];

	/*
        int  channel;
        int  central_channel;
        int  center_freq;
	*/
	wl_channel_t channel;

        int  norm_power;
	int  rssi;
	int  time_stamp;
	int  net_type;
#ifndef USE_NEW_LIB
#define APLIST_WIRELESS_TYPE_NOT_SUPPORT 0x0
#define APLIST_INFRA_WIRELESS_TYPE 0x1
#define APLIST_ADHOC_WIRELESS_TYPE 0x2
#endif
	int  enc_type;
#ifndef USE_NEW_LIB
#define APLIST_ENC_TYPE_NOT_SUPPORT 0x0
#define APLIST_ENC_TYPE_NONE	0x1
#define APLIST_ENC_TYPE_WEP	0x2
#define APLIST_ENC_TYPE_TKIP	0x3
#define APLIST_ENC_TYPE_AES	0x4
#define APLIST_ENC_TYPE_TKIPAES_AUTO 0x5
#define APLIST_ENC_TYPE_UNKNOWN	0x10
#endif
	int  auth_type;
#ifndef USE_NEW_LIB
#define APLIST_AUTH_TYPE_NOT_SUPPORT 	0x0
#define APLIST_AUTH_TYPE_OPEN	 	0x1
#define APLIST_AUTH_TYPE_SHARED	 	0x2
#define APLIST_AUTH_TYPE_WPA	 	0x3
#define APLIST_AUTH_TYPE_WPA_PSK 	0x4
#define APLIST_AUTH_TYPE_WPANONE 	0x5
#define APLIST_AUTH_TYPE_WPA2	 	0x6
#define APLIST_AUTH_TYPE_WPA2_PSK 	0x7
#define APLIST_AUTH_TYPE_UNKNOWN 	0x10
#endif

#ifdef USE_WPS_PBC_SCAN
	int wps_flag;
#define WPS_PBC_RUNNING 0x1
#define WPS_PIN_SUPPORT 0x2

#endif

} ap_info_t;

/* in case of ralink : 64 */
//#define MAX_BSS 0x40
#define MAX_BSS 0x100

typedef struct ap_infolist_s {
        int count;
	int flag;
#define APLIST_NET_TYPE_SUPPORT 0x1
#define APLIST_AUTH_TYPE_SUPPORT 0x2
#define APLIST_ENC_TYPE_SUPPORT 0x4
	char ifname[MAX_IFNAME_LEN]; /* main wireless ifname */
	char country[MAX_WL_COUNTRY];
        ap_info_t ap_info[MAX_BSS];
} ap_infolist_t;

#define MAX_STATION_INFO 64
typedef struct station_info_s {
	char mac[20];
	int bssidx;
	unsigned int psm_mode; 
	unsigned int aid; 
	unsigned int last_tx_timestamp; 
	unsigned int rx_packet; 
	unsigned int tx_packet; 
	unsigned int current_tx_rate;
	unsigned int last_tx_rate; 
	unsigned int last_rx_rate; 
	unsigned int rssi;
	unsigned char ssid[MAX_SSID_BUFLEN];

	unsigned int real_rssi;
	unsigned int tx_failure;
	unsigned int idle_time;
	unsigned int cap;
} station_info_t;

typedef struct station_infolist_s {
        int count;
	int flag;
#define STALIST_LINKSTATUS_SUPPORT 0x1
#define STALIST_RXTX_PACKET_SUPPORT 0x2
#define STALIST_LAST_PACKET_TIMESTAMP_SUPPORT 0x4
#define STALIST_RSSI_SUPPORT 0x8
#define STALIST_TIME_FROM_ASSOC 0x10
#define STALIST_ASSOC_SSID 0x20

#define STALIST_RXTX_FAILTURE 0x40
#define STALIST_IDLE_TIME 0x80
#define STALIST_CAPABILITY 0x100
#define STALIST_RATE_SET   0x200	
#define STALIST_RATE_SET   0x200	
#define STALIST_TXRX_RATE  0x400

	char ifname[MAX_IFNAME_LEN]; /* main wireless ifname */
        station_info_t station_info[MAX_STATION_INFO];
} station_infolist_t;

#ifdef USE_GET_APLIST_FAILOVER
int wireless_api_check_scan_result_in_kernel(char *ifname);
int wireless_api_set_ap_list_to_tempfile( ap_infolist_t *ap_list );
int wireless_api_get_ap_list_from_tempfile( ap_infolist_t *ap_list );
#endif

int wireless_api_clear_station_info( char *ifname );
int wireless_api_get_mbridge_status( char *ifname, ap_info_t *ap_info );
int wireless_api_get_ap_list(ap_infolist_t *ap_list);
int wireless_api_get_ap_signal_strengh(char *ssid);
int wireless_api_get_ap_info( char *ssid, ap_info_t *ap_info );
int isl3890_wireless_api_get_ap_info( char *ssid, ap_info_t *ap_info );
int inprocomm_wireless_api_get_ap_info( char *ssid, ap_info_t *ap_info );

int wireless_api_set_txpower( char *ifname, int tx_power );
int isl3890_wireless_api_set_txpower( char *ifname, int tx_power );
int inprocomm_wireless_api_set_txpower( char *ifname, int tx_power );

int isl3890_wireless_api_wireless_disable(void);
int inprocomm_wireless_api_wireless_disable(void);
int wireless_api_wireless_disable(void);
int wireless_api_support_set_tx_power( void );
int wireless_api_start_8021Xd(void);
int wireless_api_stop_8021Xd(void);
int wireless_api_support_wireless_station_stat( void );




int wireless_api_start_ap_scan(char *ifname);
int wireless_api_stop_ap_scan(char *ifname);
int wireless_api_wait_scan_end(char *ifname);
int parse_aplist_file(char *filename, ap_infolist_t *ap_list);
int wireless_api_get_ap_list(ap_infolist_t *ap_list);

#ifdef USE_NEW_LIB
int wireless_macauth_set_policy( int idx, int policy );
int wireless_macauth_kickall( int idx  );
int wireless_macauth_add_macaddr( int idx, char *mac );
int wireless_macauth_del_macaddr( int idx, char *mac );
int wireless_macauth_kickmac( int idx, char *mac );
int wireless_api_get_current_channel(char *ifname);
#else
int wireless_macauth_set_policy( int policy );
int wireless_macauth_kickall( void );
int wireless_macauth_add_macaddr( char *mac );
int wireless_macauth_del_macaddr( char *mac );
int wireless_macauth_kickmac( char *mac );
#endif


int isl3890_wireless_macauth_set_policy( int policy );
int isl3890_wireless_macauth_kickall( void );
int isl3890_wireless_macauth_add_macaddr( char *mac );
int isl3890_wireless_macauth_del_macaddr( char *mac );
int isl3890_wireless_macauth_kick_macaddr( char *mac );
int isl3890_wireless_macauth_init(void);
int isl3890_wireless_api_get_ap_list( ap_infolist_t *ap_list );
int isl3890_wireless_api_stop_ap_scan(void);
int isl3890_wireless_api_start_ap_scan(void);




int inprocomm_wireless_macauth_set_policy( int policy );
int inprocomm_wireless_macauth_kickall( void );
int inprocomm_wireless_macauth_add_macaddr( char *mac );
int inprocomm_wireless_macauth_del_macaddr( char *mac );
int inprocomm_wireless_macauth_kick_macaddr( char *mac );
int inprocomm_wireless_macauth_init(void);
int inprocomm_wireless_api_get_ap_list( ap_infolist_t *ap_list );
int inprocomm_wireless_api_stop_ap_scan(void);
int inprocomm_wireless_api_start_ap_scan(void);



int macauth_read_trylist( auth_maclist_t *maclist, char *file);
int macauth_write_trylist( auth_maclist_t *maclist, char *file);
int macauth_add_trylist( auth_maclist_t *maclist, unsigned char *mac);
int macauth_remove_trylist( auth_maclist_t *maclist, int idx);
int macauth_timeout_list( auth_maclist_t *maclist, int timeout );
int process_macauth_trylist(unsigned char *mac, char *file);

#define WDS_NOT_SUPPORT 0x0
#define WDS_MAC_TYPE 0x1
#define WDS_ESSID_TYPE 0x2

typedef struct {
	int run;
#define WDS_LINK_ON  1
#define WDS_LINK_OFF 0
        int 	idx;
#define WDS_NAME_STR_LEN 32
        char    wdsname[WDS_NAME_STR_LEN];
        int 	ifidx;
#define WDS_MAC_STR_LEN 20
        char    wdsmac[WDS_MAC_STR_LEN];
#define WDS_SSID_STR_LEN 64
        char    ssid[WDS_SSID_STR_LEN];
        int     mode;
#define WDS_B_MODE 0x0
#define WDS_G_MODE 0x1
        int     cipher;
#define WDS_CYPHER_NO  		0x0
#define WDS_CYPHER_WEP64	0x1	
#define WDS_CYPHER_WEP128	0x2
        char    wdskey[32];
	int flag;
	int wl_mode;
	unsigned int reserved[4];
} wds_conf_t;

#define WDS_STATUS_WDS_INIT 0
#define WDS_STATUS_WDS_CONNECTED 1
#define WDS_STATUS_AP_SEARCHING 2
#define WDS_STATUS_AP_SEARCH_TIMEOUT 3
#define WDS_STATUS_WDS_CHANNEL_CHANGED 4
#define WDS_STATUS_WDS_DISCONNECTED 5
int mswds_sync(void);
int mswds_get_wds_status(void);
int mswds_set_wds_status(int status);



//#ifndef USE_NEW_LIB
typedef struct {
	int count;
#ifdef USE_RT256X
#define MAX_WDSLIST 4
#else
#define MAX_WDSLIST 10
#endif
	wds_conf_t wds[MAX_WDSLIST];
} wds_list_t;
//#endif

typedef struct radius_conf_s {
	char server_ip[20];
	char server_port[8];
	char secret[256];
	int  ieee8021X;
	char own_ip_addr[20];
	char ethifname[128];
	char reserved[256];
} radius_conf_t;

int read_radius_conf( radius_conf_t *rconf );
int write_radius_conf( radius_conf_t *rconf );
int inprocomm_wireless_read_radius_conf( radius_conf_t *rconf );
int inprocomm_wireless_write_radius_conf( radius_conf_t *rconf );


#ifdef USE_NEW_LIB
int wds_get_config( int wl_mode, int idx, wds_conf_t *wds );
int wds_get_config_by_mac( int wl_mode,char *mac, wds_conf_t *wds);
int wds_add( wds_conf_t *wds );
int wds_remove( int wl_mode, char *mac  );
int wds_run(int wl_mode, char *mac, int run);
int wds_removeall(int wl_mode);
int wds_count( int wl_mode );
#else
void read_wds_db( wds_list_t *wds_list );
void write_wds_db( wds_list_t *wds_list );
int wds_add( wds_list_t *wds_list, char *name, char *mac, int mode, int cipher, char *wdskey );
int wds_remove( wds_list_t *wds_list, char *mac  );
int wds_run( wds_list_t *wds_list, char *mac, int run);
int wds_removeall_system(wds_list_t *wds_list);
#endif



int wireless_api_support_wpapsk(void);

#ifdef USE_NEW_LIB
int wireless_api_remove_wdslink(wds_conf_t *wds);
int wireless_api_add_wdslink(wds_conf_t *wds);
int wireless_api_wds_linkcontrol(wds_conf_t *wds);
int wireless_api_support_wds(void);
#else
int wireless_api_set_wdstype(int ifidx, int wdstype);
int wireless_api_set_wdscipher(int ifidx, int ciphertype, char *key );
int wireless_api_remove_wdslink(int ifidx, char *mac );
int wireless_api_add_wdslink(int ifidx, char *mac );
int wireless_api_wds_linkcontrol( int ifidx, char run );
int wireless_api_support_wds(void);
#endif

//int wireless_api_get_best_channel(wl_channel_t *chan_arr,int channel_count, ap_infolist_t *ap_list);
//int wireless_api_get_max_channel( char *ifname );

int wireless_api_get_antenna_config(void);
int wireless_api_set_antenna_config(int config);
int wireless_api_support_antenna_config(void);
int wireless_api_support_onlyb(void);
int wireless_api_support_clientmode(void);


int wireless_api_eeprom_config(char *macarray);

int inprocomm_wireless_api_get_antenna_config(void);



int inprocomm_wireless_api_set_wdstype(int idx, int wdstype);
int inprocomm_wireless_api_set_wdscipher(int idx, int ciphertype, char *key );
int inprocomm_wireless_api_remove_wdslink(int idx, char *mac );
int inprocomm_wireless_api_add_wdslink(int idx, char *mac );
int inprocomm_wireless_api_support_wds(void);
int inprocomm_wireless_api_wds_linkcontrol( int idx, char run );
int inprocomm_wireless_api_set_antenna_config(int config);




/************************ iwconfig api decl ***********************/
int iwconfig_client_get_essid(char *ifname, char *essid);
int iwconfig_client_get_link_speed(char *ifname);
int iwconfig_client_get_channel(char *ifname, wl_channel_t *chan);
int iwconfig_client_get_ap_mac(char *ifname, char *mac);
int iwconfig_client_get_ap_list(char *ifname,  ap_infolist_t *ap_list);
int iwconfig_client_get_ap_signal_level(char *ifname, char *mac);
int iwconfig_client_haskey(char *ifname);


int wireless_api_support_pspkai( void );


int wireless_api_init_antenna(void);
int inprocomm_wireless_api_init_antenna(void);
int wireless_api_check_time54g_firmware(void);
int wireless_api_get_mimo(void);


int wireless_api_get_operation_mode(void);
int wireless_api_set_operation_mode(int mode, int commit);
int wireless_api_install_module(int mode);
int wireless_api_remove_module(int mode);
int wireless_api_get_connected_apinfo(  ap_info_t *ap_info );
#ifdef USE_NEW_LIB
int wireless_api_wcbridge_set( void );
#else
int wireless_api_wcbridge_set( char *mac , int commit);
#endif
int wireless_api_wcbridge_mac_clone( void );
#ifdef USE_NEW_LIB
int wireless_api_check_and_reconnect_in_client_mode(int duration);
#else
int wireless_api_check_and_reconnect_in_client_mode(void);
#endif
int wireless_api_wcbridge_get( char *mode , char *mac );
int wireless_api_wcbridge_init( void );

int wireless_api_get_station_list( station_infolist_t *station_list );
int wireless_api_get_ifstatus(char *ifname);

int wireless_api_control_led(int flag);
int wireless_api_get_advanced_params_flag(void);

#ifdef USE_WIRELESSCONF_V2

#define WIRELESS_CONF_V2_PREFIX      "/etc/wirelessconf"
#define GET_WL_MODE_STR_BY_IDX(idx)    (((((idx)>>16)&0xffff)==WL_MODE_24G)?"2g":"5g")
#define GET_WL_MODE_BY_IDX(idx)    (((idx)>>16)&0xffff)
#define GET_WL_IDX(wl_mode,idx)   ((((wl_mode)<<16)&0xffff0000)+(idx))
#define WIRELESS_WPS_CONF_FILE_PREFIX      "/etc/wireless.conf"

/* wl_idx :  left 16bit : WL_MODE_2G or WL_MODE_5G , right 16bit: bssidx */

int read_mbssid_conf(int wl_idx, wireless_conf_t *wl_conf);
void write_mbssid_conf(int wl_idx, wireless_conf_t *wl_conf);
int wireless_api_run_mbss(int wl_idx,int flag, int commit);
int wireless_api_add_mbss(int wl_idx, wireless_conf_t *wl_conf, int commit);
int wireless_api_del_mbss(int wl_idx, int commit);
#else
int read_mbssid_conf(wireless_conf_t *wl_conf, int wl_mode, char *ssid);
int wireless_api_run_mbss(char *run_ssid, int wl_mode,int flag, int commit);
void write_mbssid_conf(wireless_conf_t *wl_conf);
int wireless_api_add_mbss(wireless_conf_t *wl_conf, char *old_ssid, int commit);
int wireless_api_del_mbss(char *ssid, int wl_mode,int commit);
int wireless_api_del_mbss_by_idx(int idx, int wl_mode, int commit);
#endif
int wireless_api_apply_mbssid(int wl_mode);

int wireless_api_get_max_mbss(void);
int wireless_api_get_current_mbss_num(int wl_mode);
int wireless_api_stop_all_mbss(int wl_mode,int commit);
int wireless_api_stop_mbss(void);
int wireless_api_get_channel_spec(char *ifname, char *country_code, int *channel_array);


#define RT61_MAX_MBSSID 4



int wireless_get_wps_pincode(char *ifname);
unsigned int wireless_gen_pincode(char *ifname);



#define WIRELESS_ADVANCED_PARAMS_TX_POWER_FLAG 0x1
#define WIRELESS_ADVANCED_PARAMS_SHORT_SLOT    0x2
#define WIRELESS_ADVANCED_PARAMS_PREAMBLE_LENGTH   0x4
#define WIRELESS_ADVANCED_PARAMS_TX_BURST   0x8
#define WIRELESS_ADVANCED_PARAMS_RTS_THRESHOLD   0x10
#define WIRELESS_ADVANCED_PARAMS_FRAG_THRESHOLD   0x10
#define WIRELESS_ADVANCED_PARAMS_BG_PROTECTION   0x20
#define WIRELESS_ADVANCED_PARAMS_BEACON_INTV     0x40
#define WIRELESS_ADVANCED_PARAMS_RALINK_FRAME_AGGREGATION 0x80
#define WIRELESS_ADVANCED_PARAMS_ATHEROS_XR     0x100

#define RT256X_ADVANCED_FLAGS \
			( WIRELESS_ADVANCED_PARAMS_TX_POWER_FLAG | WIRELESS_ADVANCED_PARAMS_SHORT_SLOT | \
			WIRELESS_ADVANCED_PARAMS_PREAMBLE_LENGTH | \
			WIRELESS_ADVANCED_PARAMS_TX_BURST | \
			WIRELESS_ADVANCED_PARAMS_RTS_THRESHOLD | \
			WIRELESS_ADVANCED_PARAMS_FRAG_THRESHOLD | \
			WIRELESS_ADVANCED_PARAMS_BG_PROTECTION | \
			WIRELESS_ADVANCED_PARAMS_BEACON_INTV | \
			WIRELESS_ADVANCED_PARAMS_RALINK_FRAME_AGGREGATION )

#define AR2317_ADVANCED_FLAGS \
			( WIRELESS_ADVANCED_PARAMS_TX_POWER_FLAG | \
			WIRELESS_ADVANCED_PARAMS_RTS_THRESHOLD | \
			WIRELESS_ADVANCED_PARAMS_FRAG_THRESHOLD | \
			WIRELESS_ADVANCED_PARAMS_BG_PROTECTION | \
			WIRELESS_ADVANCED_PARAMS_BEACON_INTV | \
			WIRELESS_ADVANCED_PARAMS_ATHEROS_XR )



typedef struct wps_conf_s {
        //int sc_status; /* simple config status */
#define KEEP_WL_CONFIG          0x0
#define CHANGE_WL_CONFIG        0x1
        int wps_pin;
        int pincode;
#define WPS_STOP 0
#define WPS_IDLE 1
#define WPS_START 2
#define WPS_PROCESSING  3
#define WPS_CONFIGURED  4
#define WPS_ERROR       5
#define WPS_TIMEOUT     6

        int wps_change_config;
} wps_conf_t;

int wireless_remove_wps_src(char *ifname);
int wireless_set_wps_src(char *ifname);
int wireless_get_clear_wps_src(char *ifname);

int wireless_set_wps_status(char *ifname,int status);



int wireless_wps_set_src(char *src);
int wireless_wps_get_src(char *src);

int wireless_wps_stop(char *ifname);
int wireless_wps_stop_signal(char *ifname);
int wireless_update_wps(char *ifname);
int wireless_wps_start(char *ifname, wps_conf_t *wps);
int wireless_get_wps_status(char *ifname, int *err);

int wireless_reset_wps_status(char *ifname);
int wireless_generate_wps_devpin(int flag);
int wireless_init_wps_info(int forced);

int read_wps_conf(char *ifname,wps_conf_t *wps);
int write_wps_conf(char *ifname,wps_conf_t *wps);
int remove_wps_conf(char *ifname);

int wireless_wps_signal(char *ifname,wps_conf_t *wps);
int wireless_wps_issue_cmd(void);
int wireless_get_wps_mode(char *ifname);
int wireless_prepare_wps(char *ifname, int forced);
int wireless_get_wps_configured_ifname(char *ifname);
int wireless_get_wps_change_config(char *ifname);


#ifdef USE_MBRIDGE_STATUS_DAEMON
typedef enum {
	CONNECTION_FAILED	= 0,
	CONNECTION_UNDEFINED	= 1,
	CONNECTION_TRYING	= 2,
	CONNECTION_ESTABLISHED	= 3,
	CONNECTION_BUTT		= 4,
} mbridge_status_t;

#define MBRIDGE_STATUS_LIST	\
	"CONNECTION_FAILED",	\
	"CONNECTION_UNDEFINED",	\
	"CONNECTION_TRYING",	\
	"CONNECTION_ESTABLISHED"

int wireless_api_set_mbridge_connection_status(char *bridge_ifname, mbridge_status_t status);
int wireless_api_get_mbridge_connection_status(char *bridge_ifname, mbridge_status_t *status);
int wireless_api_clear_mbridge_connection_status(char *bridge_ifname);
#endif



int wireless_ifdown(char *ifname);

int wireless_set_led(char *ifname,int flag);
int mtk_wireless_set_led(char *ifname,int flag);
int rtl_wireless_set_led(char *ifname,int flag);
int bcm_wireless_set_led(char *ifname,int flag);
int qca_wireless_set_led(char *ifname,int flag);


#ifdef USE_5G_WL

#define CHECK_5G_IF(x) ((!strcmp(x,IF_WIRELESS_5G))?1:0)
#define GET_WL_IF(wl_mode) ((wl_mode==WL_MODE_5G)?IF_WIRELESS_5G:IF_WIRELESS)

#ifndef USE_WIRELESSCONF_V2
#define MK_MBSS_FILENAME(x,wl_mode,ssid) sprintf(x,"%s.%d.%s", WIRELESS_CONF_FILE, wl_mode,ssid )
#define MK_MBSS_SAVE_FILENAME(x,wl_mode,ssid) sprintf(x,"/save%s.%d.%s", WIRELESS_CONF_FILE, wl_mode,ssid )
#define MK_MBSS_TAG_PREFIX(x,wl_mode) sprintf(x,"multi_bssid_%d", wl_mode)
#define MK_MBSS_TAG(x,wl_mode,ssid) sprintf(x,"multi_bssid_%d+%s", wl_mode,ssid)
#endif

#define GET_WDS_TAG_PREFIX(x,wl_mode) snprintf(x,TAGLEN,"wds_%d",wl_mode)
#define GET_WDS_CIPHERTAG(x,wl_mode,mac) snprintf(x,TAGLEN,"wdscipher_%d+%s",wl_mode,mac)
#define GET_WDS_TAG(x,wl_mode, mac) snprintf(x,TAGLEN,"wds_%d+%s",wl_mode,mac)

#define GET_WL_BRIDGE_IF(wl_mode) ((wl_mode==WL_MODE_5G)?IF_WWAN_5G:IF_WWAN)
#define GET_WWAN_IF(x) ((!strcmp(x,IF_WIRELESS_5G))?IF_WWAN_5G:IF_WWAN)


#ifdef USE_DYNAMIC_CONCURRENT_BAND
int CHECK_5G_IF_DYN_CONCURRENT(char *ifname);
#else
#define CHECK_5G_IF_DYN_CONCURRENT CHECK_5G_IF
#endif

#else

#define CHECK_5G_IF(x) 0

#ifndef USE_WIRELESSCONF_V2
#define MK_MBSS_FILENAME(x,wl_mode,ssid) sprintf(x,"%s.%s", WIRELESS_CONF_FILE, ssid )
#define MK_MBSS_SAVE_FILENAME(x,wl_mode,ssid) sprintf(x,"/save%s.%s", WIRELESS_CONF_FILE, ssid )
#define MK_MBSS_TAG_PREFIX(x,wl_mode) sprintf(x,"multi_bssid")
#define MK_MBSS_TAG(x,wl_mode,ssid) sprintf(x,"multi_bssid+%s", ssid)
#endif

#define GET_WL_IF(wl_mode) IF_WIRELESS

#define GET_WDS_TAG_PREFIX(x,wl_mode) snprintf(x,TAGLEN,"wds")
#define GET_WDS_CIPHERTAG(x,wl_mode,mac) snprintf(x,TAGLEN,"wdscipher+%s",mac)
#define GET_WDS_TAG(x,wl_mode, mac) snprintf(x,TAGLEN,"wds+%s",mac)

#define GET_WL_BRIDGE_IF(wl_mode) IF_WWAN

#define GET_WWAN_IF(x) IF_WWAN

#endif

#define GET_WL_MODE(ifname) (CHECK_5G_IF(ifname)?WL_MODE_5G:WL_MODE_24G)
#define GET_WL_MODESTR(ifname) (CHECK_5G_IF(ifname)?"5GHz":"2.4GHz")




int wireless_api_get_current_channelspec(char *ifname, wl_channel_t *chan);
int wireless_get_channel_list(char *ifname, char *abbrev, int bw, wl_channel_t *chan_arr);

int print_mbridge_status( wireless_conf_t *wl_conf );


/* realtek wireless driver */
int rtl_get_mbss_max(char *ifname);
int rtl_get_wds_max(char *ifname);

int wireless_mbss_up(char *ifname);
int wireless_mbss_down(char *ifname);

#define WIRELESS_CONCURRENT_MODE 	1
#define WIRELESS_SINGLE_2G	2
#define WIRELESS_SINGLE_5G	3
int wireless_set_band_option(int band);
int wireless_get_band_option(void);

int get_wl_mode_int(char *value);
char *get_wl_mode_str(int mode);
int get_wl_auth_int(char *value);
char *get_wl_auth_str(int auth);
int get_wl_enc_int(char *value);
char *get_wl_enc_str(int enc);
int parse_channel_str(char *chstr, wl_channel_t *channel);

int wireless_enter_wifi_extender_mode(char *ifname);
int wireless_exit_wifi_extender_mode(char *ifname);
int wireless_configure_wifi_extender_mode(char *ifname);
int wireless_wifi_extender_start(char *ifname);

int wireless_api_get_best_channel(wl_channel_t *chan_arr, int channelcount, ap_infolist_t *ap_list);
int wireless_api_get_best_channel2(char *ifname,char *country, int bw, wl_channel_t *best_channel);

int wireless_get_scan_buf(char *ifname,char *buf,int max);

int wireless_get_wifi_extender_mode(void);
int wireless_set_wifi_extender_mode(int wifi_extender);

int wireless_check_8021x_enabled(wireless_conf_t *wl_conf);
int wireless_check_8021x_enabled2(int wl_mode);
/* mbss can be NULL, if mbss is NULL, read all mbss config and check */
int wireless_check_8021x_enable_for_band(char *ifname, wireless_conf_t *mbss, int count);


int read_all_mbss_conf(char *ifname, wireless_conf_t *mbss, int max);

int wireless_init_radius_chain(void);
int wireless_set_radius_iptables(char *ifname, wireless_conf_t *mbss_conf, int mbssnum);

int wireless_restart_8021xd(void);

char * get_racfg_filename(int wl_mode);


int wireless_api_enable_bss(char *ifname, int flag);
int wireless_api_get_keyinfo_status(char *ifname);

int wireless_get_wps_uuid(char *ifname, char *uuid, int *len);
int wireless_set_wps_uuid(char *ifname, char *uuid, int len);


int set_wifi_sched_ifstatus(char *ifname,int flag);
int get_wifi_sched_ifstatus(char *ifname);

int get_extender_opmode(wireless_conf_t *wc);

int wireless_set_wps_cli_status(char *ifname,int flag);
int wireless_get_wps_cli_status(char *ifname);

int wireless_ifdown(char *ifname);
int wireless_ifup(char *ifname);



int hwinfo_get_ftm_channel(char *ifname, wl_channel_t *chan);
int wireless_api_apply_mbss_qos(char *ifname);

int apply_wireless_config_from_other_interface(char *other_ifname, char *ifname);
#ifdef USE_BCM5354
#define radio_turnoff(x) wireless_mbss_down(x)
#else
#define radio_turnoff(x)
#endif


int wireless_set_wbcc(char *ifname,wireless_conf_t *wbcc);
int wireless_get_wbcc(char *ifname,wireless_conf_t *wbcc);

int commit_extcheck_config(char *bridge_ifname, wireless_conf_t *wl_conf);
int release_extcheck(char *bridge_ifname, int connected);
int wireless_api_restart(char *ifname);

int check_wireless_ifstatus(int wl_mode);
int check_wireless_ifrun(int wl_mode);



#endif
