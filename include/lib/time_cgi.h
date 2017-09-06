#ifndef _TIME_CGI_H
#define _TIME_CGI_H

#include <stdio.h>
#include <time.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <ctype.h>
#include <signal.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <net/if.h>
#include <net/if_arp.h>
#include <net/route.h>
#include <sys/wait.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <sys/reboot.h>
#include <sys/types.h>
#include <linux/reboot.h>

/* configuration file */
#define RC_FILE                         "/etc/rc"

#define NETWORK_CONF_FILE               "/etc/network"
#define RESOLV_CONF_FILE                "/etc/resolv.conf"
#define PPP_PAP_SECRET_FILE           "/etc/ppp/pap-secrets"
#define PPP_CHAP_SECRET_FILE          "/etc/ppp/chap-secrets"
#define PPP_CHAP_SECRET_BACKUP_FILE   "/etc/ppp/chap-secrets.b"
#define PPPOE_OPTION_FILE_ETH1          "/etc/ppp/options.eth1"
#define PPPOE_OPTION_FILE_ETH2          "/etc/ppp/options.eth2"
#define PPPOE_OPTION_FILE               "/etc/ppp/options"
#define PPPOE_MTU_FILE                  "/etc/ppp/mtu"
#define PPTP_OPTION_FILE                "/etc/ppp/options.ttyp0"

#define ROOT_FS_CONFIGURATION_FILE      "/proc/image/command"
#define COMPANY_NAME_FILE               "/etc/company"

/* database file */
#define DHCPD_LEASE_FILE                    "/var/lib/dhcp/dhcpd.leases"
#define DHCLIENT_LEASE_FILE                 "/var/lib/dhcp/dhclient.leases"
#define PROC_ROUTE_TABLE_FILE               "/proc/net/route"

/* status file */
#define INTERNAL_NETWORK_INFO_FILE      "/etc/internal"
#define EXTERNAL_NETWORK_INFO_FILE      "/etc/external"
#define LAN_INFO_FILE			"/etc/lan"
#define DHCPC_RCV_FILE			"/etc/dhcpc_ip"
#define PPP0_STATUS_FILE                PPP_STATUS_FILE
#define PPPOE_STATUS_FILE               PPP0_STATUS_FILE


/* program file */
#define IPTABLES_PROGRAM                "/sbin/iptables"
#define DHCPD_PROGRAM                   "/sbin/dhcpd"
#define DHCLIENT_PROGRAM                "/sbin/dhclient"
#define PPPOE_PROGRAM                   "/bin/startpppoe"

/* pid file */
#define PPPOE_PID_FILE                  "/etc/ppp/adsl.pid.pppoe"
#define PPTP_CALL_MGR_PID_FILE          "/etc/ppp/callmgr0.pid"

/* httpd password file */
#define HTTPD_PASSWORD_FILE             "/etc/httpd.passwd"
#define HTTPD_ORIGINAL_PASSWORD_FILE    "/etc/httpd.passwd~"
#define HTTPD_ENCRYPT_PASSWORD_FILE     "/home/httpd/passwd.enc"

#ifdef USE_REAL_IPCLONE
#define IPCLONE_CONF_FILE          	"/etc/ipclone.conf"
#define IPCLONE_LEASETIME_FILE        	"/etc/ipclone.leasetime"

#define IPCLONE_WAN1_VITURAL_IP	  	"192.168.255.2"
#define IPCLONE_WAN2_VITURAL_IP	  	"192.168.255.3"
#endif

#define MAX_DHCP_ACTIVE_LEASE_IP                253
#define MAX_LINE_PER_PAGE                       10
#define MAX_INTERNAL_IP_NUMBER                  256

#define DHCP_DEFAULT_LEASE_TIME             43200       /* 12 hours */
#define DHCP_MAX_LEASE_TIME                 86400       /* 24 hours */

#define DEFAULT_INTERNAL_IP_ADDRESS         "192.168.0.1"
#define DEFAULT_EXTERNAL_IP_ADDRESS         "0.0.0.0"

#define SYSTEM_REBOOT_TIME                  20
#define SW_UPGRADE_TIME 			    60	
#define UPGRADE_MODE_CHAGNE_TIME            40

/* reloadPage status */
#define NULL_STATUS        0
#define NO_RELOAD_STATUS   1
#define REBOOT_STATUS      2
#define UPGRADE_STATUS     3

typedef struct {
    char ip[16];
    char mac[20];
    int  active_flag;
} dhcp_active_lease_ip_t;

typedef struct entry_s {
    char *name;
    char *value;
    struct entry_s *next;
} entry_t;

typedef struct link_status_s {
#define MAX_LINK_STATUS_STR_BUFLEN 10
    char status[MAX_LINK_STATUS_STR_BUFLEN];
    char speed[MAX_LINK_STATUS_STR_BUFLEN];
    char duplex[MAX_LINK_STATUS_STR_BUFLEN];
} link_status_t;

#if defined USE_BCM53115S

typedef struct port_stat_s {
    unsigned long long rx_packets;
    unsigned long long rx_bytes;
    unsigned long long rx_bcast;
    unsigned long long rx_mcast;
    unsigned long long rx_crc;
    unsigned long long rx_drop;
    unsigned long long rx_pause;

    unsigned long long tx_packets;
    unsigned long long tx_bytes;
    unsigned long long tx_bcast;
    unsigned long long tx_mcast;
    unsigned long long tx_collision;
    unsigned long long tx_pause;

} port_stat_t;
#elif defined USE_MT7620
typedef struct port_stat_s {
#ifdef USE_MT7530_SWITCH
    unsigned long long rx_packets;
    unsigned long long rx_mcast;
    unsigned long long rx_bcast;
    unsigned long long rx_crc;
    unsigned long long rx_drop;
    unsigned long long rx_bytes;

    unsigned long long tx_packets;
    unsigned long long tx_mcast;
    unsigned long long tx_bcast;
    unsigned long long tx_collision;
    unsigned long long tx_bytes;
#else
    unsigned int rx_packets;
    unsigned int rx_bytes;
    unsigned int rx_crc;
    unsigned int tx_packets;
    unsigned int tx_bytes;
#endif
} port_stat_t;

#elif defined USE_MV6281

typedef struct port_stat_s {
    unsigned long long rx_bytes;
    unsigned long long rx_bad_bytes;
    unsigned long long mac_trans_err;
    unsigned long long rx_packets;
    unsigned long long rx_bad_packets;
    unsigned long long rx_bcast;
    unsigned long long rx_mcast;
    unsigned long long rx_64;
    unsigned long long rx_127;
    unsigned long long rx_255;
    unsigned long long rx_511;
    unsigned long long rx_1023;
    unsigned long long rx_1024max;

    unsigned long long tx_bytes;
    unsigned long long tx_packets;
    unsigned long long tx_collision;
    unsigned long long tx_mcast;
    unsigned long long tx_bcast;

    unsigned long long rx_unrecog_mac_ctl;
    unsigned long long tx_pause;
    unsigned long long rx_pause;
    unsigned long long rx_undersize;
    unsigned long long rx_fragments;
    unsigned long long rx_oversize;
    unsigned long long rx_jabber;
    unsigned long long rx_mac_err;
    unsigned long long rx_crc;

    unsigned long long collisions;
    unsigned long long late_collisions;
} port_stat_t;

#else

typedef struct port_stat_s {
#if defined  USE_RTL8318P || defined USE_RTL8326
    unsigned int rx_packets;
    unsigned int rx_bytes;
    unsigned int tx_packets;
    unsigned int tx_bytes;
#elif defined  USE_RTL8306S
    unsigned int rx_packets;
    unsigned int rx_drop;
    unsigned int rx_crc;
    unsigned int rx_frag;
    unsigned int tx_packets;
#elif defined USE_RTL8366S || defined USE_RTL8370 || USE_RTL8367B
    unsigned long long rx_packets;
    unsigned long long rx_bytes;
    unsigned long long rx_bcast;
    unsigned long long rx_mcast;
    unsigned long long rx_crc;
    unsigned long long rx_drop;
    unsigned long long tx_packets;
    unsigned long long tx_bytes;
    unsigned long long tx_bcast;
    unsigned long long tx_mcast;
    unsigned long long tx_collision;
#elif defined USE_RTL8196B

#if defined USE_RTL8198 || defined USE_RTL8196C_92D || defined USE_RTL8196C_92C || defined USE_NETSTAT_LL_TYPE
    unsigned long long rx_packets;
#ifdef USE_RTL8367R
    unsigned long long rx_bytes;
#endif
    unsigned long long rx_bcast;
    unsigned long long rx_mcast;
    unsigned long long rx_crc;
    unsigned long long rx_drop;
    unsigned long long tx_packets;
#ifdef USE_RTL8367R
    unsigned long long tx_bytes;
#endif
    unsigned long long tx_bcast;
    unsigned long long tx_mcast;
    unsigned long long tx_collision;
#else
    unsigned int rx_packets;
    unsigned int rx_bytes;
    unsigned int rx_bcast;
    unsigned int rx_mcast;
    unsigned int rx_crc;
    unsigned int rx_drop;
    unsigned int rx_pause;

    unsigned int tx_packets;
    unsigned int tx_bytes;
    unsigned int tx_bcast;
    unsigned int tx_mcast;
    unsigned int tx_collision;
    unsigned int tx_pause;
#endif

#elif defined USE_GIGA_SWITCH
    unsigned long long rx_packets;
    unsigned long long rx_bytes;
    unsigned long long rx_crc;
    unsigned long long tx_packets;
    unsigned long long tx_bytes;
#else
    unsigned int rx_packets;
#if !defined USE_BCM5325E && !defined USE_BCM5354
    unsigned int rx_bytes;
#endif
    unsigned int rx_bcast;
#if !defined USE_BCM5325E && !defined USE_BCM5354
    unsigned int rx_mcast;
    unsigned int rx_err;
#endif
    unsigned int tx_packets;
#if !defined USE_BCM5325E && !defined USE_BCM5354
    unsigned int tx_bytes;
    unsigned int tx_collision;
#endif
#endif
} port_stat_t;
#endif

typedef struct hostinfo_s {
#define MAX_HOSTINFO_PCNAME_LEN 128
        char pcname[MAX_HOSTINFO_PCNAME_LEN];
        char ip[20];
#define MAX_HINFO_MAC_LEN 20
        char mac[MAX_HINFO_MAC_LEN];
#ifdef USE_EFM_PRODUCT
        char ifname[20];
#endif
} hostinfo_t;

typedef struct ppp_secret_s {
#ifdef USE_SPECIAL_PPPOE_ENCODE
        char account[128];
        char password[2048];
#else
        char account[64];
        char password[64];
#endif
        char ip[64];
        int flag;
#define PPPOE_ACCOUNT 0x2
#define PPTP_VPN_ACCOUNT 0x1 
} ppp_secret_t;
#define MAX_PPP_SECRET 32

typedef struct ppp_secret_db_s {
        int count;
        ppp_secret_t ppp_secret[MAX_PPP_SECRET];
} ppp_secret_db_t;


extern int dhcplib_set_range_and_gateway( char *start, char *end, char *mask, char *router);
extern int dhcplib_get_range_and_gateway( char *start, char *end, char *mask, char *router);
extern int dhcplib_get_active_lease_count(void);
extern char *crypt(const char *key, const char *salt);


typedef struct ippool_s {
        char poolname[8];
        char start_ip[16];
        char end_ip[16];
        int flag;
#define EMPTY_FLAG 0x0
#define FILL_FLAG 0x1
} ippool_t;

typedef struct ippool_db_s {
        int count;
#define MAX_IPPOOL 300
        ippool_t ippool[MAX_IPPOOL];
} ippool_db_t;

#define IPPOOL_CONF_FILE "/etc/ippool.conf"
#define IPPOOL_DB_FILE   "/etc/ippool.set"


#ifdef USE_DDNS_CLIENT

typedef struct ezddns_config_s {
	int idx;
#define MAX_DDNS_SERVICE_TYPE 32
        char service_type[MAX_DDNS_SERVICE_TYPE];
#define MAX_DDNS_HOST_NAME 1024
        char host[MAX_DDNS_HOST_NAME];  /* 5 host, deli ',' */
#define MAX_DDNS_ID 64
        char id[MAX_DDNS_ID]; /* email */ 
#define MAX_DDNS_PASSWORD 64
        char passwd[MAX_DDNS_PASSWORD];
#define MAX_DDNS_SERVER 64
        char server[MAX_DDNS_SERVER];
	char wanname[16]; /* for dualwan */
	int wildcard;
#if defined(USE_PC_IPDISK_SERVER) || defined(USE_ROUTER_NAS)
	int ftp_port;
	int http_port;
#endif
} ezddns_config_t;


#define DDNS_BURST_TIME 3

#ifdef USE_NEW_LIB
typedef struct ezddns_status_s {
	int code;
#define DDNS_FAILED 		0
#define DDNS_SUCCESS_UPDATE 	1
#define DDNS_RETRY		2
#define MAX_DDNS_STATUS_IP_LEN 16
        char ip[MAX_DDNS_STATUS_IP_LEN];
	unsigned int timestamp; 
	unsigned int remaintime;
	char msg[64];
} ezddns_status_t;

/* 1: iptime + 5: dyndns */
#define MAX_EZDDNS_HOSTNAME_NUM 6 
#else
#define MAX_EZDDNS_HOSTNAME_NUM 10
#endif

#define EZDDNS_HOSTS_FILE "/etc/ezddns.hosts"
#define EZDDNS_CONF_PREFIX "/etc/ezddns.conf."


#endif


#define REMOTEWBM_CONFIG_FILE           "/etc/rwbm"
typedef struct remotewbm_config_s {
	        unsigned int   flag;
		        unsigned short port;
} remotewbm_config_t;

#define MAX_REMOTE_CONTROL_PC_NUMBER 100



#endif
