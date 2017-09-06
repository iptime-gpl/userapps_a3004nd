#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

#define PRODUCT_NAME "timenx"

#define MAX_PORT_NUMBER 5
#define MAX_BOOTLOADER_SIZE  0x20000
#define FIRST_SECTOR_SIZE    0x10000
#define MAC_ADDRESS_OFFSET  (0x20)
#define EFM_OUI "00-08-9f-"

#define PPP_STATUS_FILE "/var/run/pppstatus"
#define RAW_FLASH_DEV  "/dev/rawflash"

#define PASSWD_FILE "/etc/httpd.passwd"

#define CONFIG_SAVE_CMD "/sbin/saveconf"
#define CONFIG_RESTORE_CMD "/sbin/restoreconf"
#define CONFIG_DEFAULT_CMD "/sbin/defaultconf"

#define MSMSTATUS_FILE  "/proc/image/msm"
#define MSM_PID_FILE   "/var/run/msm.pid"

#define PUBLIC_IP_FILE "/var/run/publicip"

#define DHCPD_STATUS_FILE "/etc/dhcpd_status"

#define DHCPD_PROGRAM                   "/sbin/dhcpd"
#define RESOLV_CONF_FILE                "/etc/resolv.conf"
#define INTERNAL_NETWORK_INFO_FILE      "/etc/internal"
#define DHCPD_PID_FILE                  "/var/run/dhcpd.pid"


#define PORT_CONFIG_SYSTEM_FILE         "/proc/interface/eth/%d/phy_control"
#define PORT_STAT_FILE_DIRECTORY        "/proc/interface/eth/%d/mibii"
#define LINK_STATUS_FILE_DIRECTORY      "/proc/interface/eth/%d/phy_status"
#define CLEAR_ETHER_STAT                "/proc/interface/eth/clear"
#define PORT_CONFIG_FILE                "/etc/port_config"
#define FTP_PRIVATE_PORT_FILE           "/etc/ftp_private_port"
#define FTP_PRIVATE_PORT_SYSTEM_FILE    "/proc/ftp/private_port"
#define H323_PORT_FILE                  "/etc/h323_port"
#define H323_PORT_SYSTEM_FILE           "/proc/h323/h323_port"

#define MAX_FTP_PRIVATE_PORT       6


#define SW_UPGRADE_STATUS_FILE          "/var/run/upgrade_status"
 
#define INVALID_OP              (-1)
#define INITIAL_STATUS    0x0   /* not upgrade */
#define INVALID_SOFTWARE  0x1
#define SAVE_SOFTWARE     0x2
#define SAVE_COMPLETE  0x3
#define UPGRADE_COMPLETE    0x4

#define NETWORK_CONF_FILE       "/etc/network"


#define ORIGINAL_HARDWARE_ADDRESS_FILE "/etc/hardware_org"
#define HARDWARE_ADDRESS_FILE           "/etc/hardware"




#define URLFILTERING_CONFIG_FILE "/etc/urlstring"
typedef struct filter_string_s {
	unsigned int string_count;
#define MAX_FILTERING_STRING_SIZE 64
#define MAX_FILTERING_RULE_STRING_SIZE 100
       char string[MAX_FILTERING_STRING_SIZE];
       char rule_string[MAX_FILTERING_RULE_STRING_SIZE];
} filter_string_t;

typedef struct urlfilter_config_s {
       unsigned int flag;
       unsigned int count;
#define MAX_FILTERING_STRING_NUM  20
       filter_string_t array[MAX_FILTERING_STRING_NUM];
} urlfilter_config_t;


#define INTERNET_STATUS_FILE "/var/run/internet_apply"


#define MAX_BOOTLOADER_SIZE 0x20000
#define NEW_TIMED_CONFIG "/etc/new_timed.conf"

#endif
