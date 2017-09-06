#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

#define PRODUCT_NAME "timehs"
#define MAX_PORT_NUMBER 5
#define SECTOR_SIZE 0x10000
#define MAX_BOOTLOADER_SIZE  0x3000
#define MAC_ADDRESS_OFFSET  (MAX_BOOTLOADER_SIZE-0x80) 
#define MAX_IMAGE_SIZE (0x100000 - MAX_BOOTLOADER_SIZE - 0x10000 )
#define EFM_OUI "00-08-9f-"


#define PPP_STATUS_FILE "/var/run/pppstatus"
#define RAW_FLASH_DEV  "/dev/rawflash"

#define PASSWD_FILE "/etc/httpd.passwd"

#define CONFIG_SAVE_CMD "/sbin/saveconf"
#define CONFIG_RESTORE_CMD "/sbin/restoreconf"
#define CONFIG_DEFAULT_CMD "/sbin/defaultconf"

#define PUBLIC_IP_FILE "/var/run/publicip"

#define DHCPD_STATUS_FILE "/etc/dhcpd_status"

#define DHCPD_PROGRAM                   "/sbin/dhcpd"
#define RESOLV_CONF_FILE                "/etc/resolv.conf"
#define INTERNAL_NETWORK_INFO_FILE      "/etc/internal"

#define DHCPD_PID_FILE                  "/var/run/dhcpd.pid"
#define DHCLIENT_PID_FILE               "/var/run/dhclient.pid"
#define PPPD_PID_FILE               	"/var/run/ppp1.pid"
#define PPPCRON_PID_FILE		"/var/run/pppcron.pid"
#define IPTABLESQ_PID_FILE		"/var/run/iptableq.pid"
#define TIMED_PID_FILE			"/var/run/timed.pid"


#define SCHED_CFG_FILE  "/etc/sched.conf"
#define SCHED_CFG_FILE2 "/etc/sched2.conf"
#define SCHED_CFG_RUNNING_FILE  "/var/run/sched.conf"

#define DOS_CFG_FILE  "/etc/dos.conf"

/*
 *  TIME update daemon pid file
 */
#define TIMED_PID_FILE_PREFIX "/var/run/timed"
#define TIMED_STATUS_FILE     "/var/run/timed.status"
#define MAX_TIMED_NUM 5
#define TIMED_CONFIG "/etc/timed.conf"


#define PORT_CONFIG_SYSTEM_FILE         "/proc/interface/eth/%d/phy_control"
#define PORT_STAT_FILE_DIRECTORY        "/proc/interface/eth/%d/mibii"
#define LINK_STATUS_FILE_DIRECTORY      "/proc/interface/eth/%d/phy_status"
#define CLEAR_ETHER_STAT                "/proc/interface/eth/clear"
#define PORT_CONFIG_FILE                "/etc/port_config"
#define FTP_PRIVATE_PORT_FILE           "/etc/ftp_private_port"
#define FTP_PRIVATE_PORT_SYSTEM_FILE    "/proc/ftp/private_port"
#define FTP_PRIVATE_PORT_STATE_FILE     "/proc/ftp/invalid_port"
#define H323_PORT_FILE                  "/etc/h323_port"
#define H323_PORT_SYSTEM_FILE           "/proc/h323/h323_port"
#define CONNTRACK_CLEANUP_FILE          "/proc/ctproc/cleanup"

#define MAX_FTP_PRIVATE_PORT       6


#define SW_UPGRADE_STATUS_FILE          "/var/run/upgrade_status"
#define SW_UPGRADE_TMP_FILE "/tmp/timehs.bin"   /* refer to Makefile of root filesystem */    
 
#define INVALID_OP              (-1)

#define INITIAL_STATUS    0x0   /* not upgrade */
#define UPGRADE_SUCCESS                 0x00000001
#define UPGRADE_FAIL                    0x00000002
#define UPGRADE_CONN_TIMEOUT            0x00000012
#define UPGRADE_SAME_VERSION            0x00000022
#define UPGRADE_SERVER_NOT_FOUND        0x00000032
#define UPGRADE_FILE_NOT_FOUND          0x00000042
#define UPGRADE_LOGIN_FAIL              0x00000052
#define UPGRADE_INVALIDFILE_FAIL        0x00000062



#define NETWORK_CONF_FILE       "/etc/network"


#define ORIGINAL_HARDWARE_ADDRESS_FILE "/etc/hardware_org"
#define HARDWARE_ADDRESS_FILE           "/etc/hardware"




#define INTERNET_STATUS_FILE "/var/run/internet_apply"

#define FLASH_SAVE_OFFSET 0xf0000 
#define FLASH_SAVE_SIZE    0x10000

#define NEW_TIMED_CONFIG "/etc/new_timed.conf"


#endif
