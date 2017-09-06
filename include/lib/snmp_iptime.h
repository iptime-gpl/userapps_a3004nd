#ifndef _SNMP_IPTIME_H_
#define _SNMP_IPTIME_H_

#define STRMAX  512

#define WIRELESS_MODE_24G     0
#define WIRELESS_MODE_5G      1

#define IFTYPE_ETHERNET 1
#define IFTYPE_WL24G    2
#define IFTYPE_WL5G     3

#define MAX_ESS_NUM_PER_MODE	4

#define SS_NO_ENCRYPT              0
#define SS_WPA2PSK_AES             1
#define SS_WPAPSK_WPA2PSK_AES      2
#define SS_WPAPSK_AES              3
#define SS_WPA2PSK_TKIP_AES        4
#define SS_WPAPSK_WPA2PSK_TKIP_AES 5
#define SS_WPAPSK_TKIP_AES         6
#define SS_WPAPSK_TKIP             7
#define SS_WPA2PSK_TKIP            8
#define SS_WPAPSK_WPA2PSK_TKIP     9
#define SS_AUTO_WEP                10
#define SS_OPEN_WEP                11
#define SS_KEY_WEP                 12
#define SS_8021X_WPA2_AES          13
#define SS_8021X_WPAWPA2_TKIPAES   14
#define SS_8021X_WPA_AES           15
#define SS_UNKNOWN                 0xff

typedef struct {
	int  idx;
	int  run;
	char ssid[36];
	int  ssid_broadcast;
	int  mode;	// WIRELESS_MODE_24G, WIRELESS_MODE_5G
	int  security_set;
	char security_key[128];
	char radius_ip[16];
	char radius_key[128];
	int  radius_port;
	int  channel;
} essTable;

int get_port_link_status(int port);
int wireless_get_mbss_count(int mode);
int wireless_get_all_ess_entry(int mode, essTable *ess_table);
int system_get_lanmac(char *mac);
int system_get_wanmac(char *mac);
int system_get_dns(int idx, in_addr_t *dnsip);
int system_get_remote_port(void);
int system_set_upgrade_url(char *url);
int system_get_upgrade_url(char *url);
int system_set_upgrade_start(int flag);
int system_set_upgrade_status(void);
int addressTable_get_description(char *macstr, char *desc);
int check_snmp_reboot_trap(void);


#endif
