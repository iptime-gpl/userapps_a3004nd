#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

#define PRODUCT_NAME "zion"
#define MAX_PORT_NUMBER 6
#define SECTOR_SIZE 0x10000
#define MAX_FLASH_SIZE 0x200000
#define MAX_BOOTLOADER_SIZE  0x3000
#define MAC_ADDRESS_OFFSET  (MAX_BOOTLOADER_SIZE-0x80) 
#define MAX_IMAGE_SIZE (0x200000 - MAX_BOOTLOADER_SIZE - 0x10000 )
#define FLASH_SAVE_OFFSET 0x1e0000 
#define FLASH_SAVE_SIZE    0x20000
#define MAX_FIRMWARE_SIZE  0x1e0000  
// #define FIRSTBOOT_MAGIC_OFFSET 0x1c0000

#ifdef USE_SECONDARY_SAVESECTOR
#define SECONDARY_SAVE_SECTOR_BASE 0x1d0000
#define MAX_SECONDARY_SAVE_SIZE 0x10000
#endif


#define SAVE_FS_ID              0x10

#define EFM_OUI "00-08-9f-"


#define PPP_STATUS_FILE "/var/run/pppstatus"
#define RAW_FLASH_DEV  "/dev/rawflash"
#define FIRSTBOOT_MAGIC_STRING  "NORMAL BOOT 1122334455667822"

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
#define PPPD_PID_FILE               	"/var/run/%s.pid"
#define PPPCRON_PID_FILE		"/var/run/pppcron.pid"
#define IPTABLESQ_PID_FILE		"/var/run/iptableq.pid"
#define TIMED_PID_FILE			"/var/run/timed.pid"
#define IN_PUBLIC_PID_FILE		"/var/run/in_public.pid"
#define LINKMON_PID_FILE		"/var/run/linkmon.pid"

#if defined(USE_BCM470X) || defined(USE_MV6281)
#define RTMARK_STATUS           "/proc/rtmark_status"
#define RTMARK_CLEANUP          "/proc/rtmark_cleanup"
#define RTMARK_WRR              "/proc/rtmark_wrr"
#define RTMARK_IPWRR            "/proc/rtmark_ipwrr"
#else
#define RTMARK_STATUS           "/proc/net/rtmark_status"
#define RTMARK_CLEANUP          "/proc/net/rtmark_cleanup"
#define RTMARK_WRR              "/proc/net/rtmark_wrr"
#define RTMARK_IPWRR            "/proc/net/rtmark_ipwrr"
#endif

#define LINKMON_CONF_FILE       "/etc/linkmon.conf"
#define LINKMON_SYSTEM_FILE     RTMARK_STATUS

#define SCHED_CFG_FILE  "/etc/sched.conf"
#define SCHED_CFG_FILE2 "/etc/sched2.conf"
#define SCHED_CFG_RUNNING_FILE  "/var/run/sched.conf"

#define DOS_CFG_FILE  "/etc/dos.conf"

#define UPNP_WAN  "/etc/upnpd.wan"

/*
 *  TIME update daemon pid file
 */
#define TIMED_PID_FILE_PREFIX "/var/run/timed"
#define TIMED_STATUS_FILE     "/var/run/timed.status"
#define MAX_TIMED_NUM 5
#define TIMED_CONFIG "/etc/timed.conf"
#define NEW_TIMED_CONFIG "/etc/new_timed.conf"


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
 
#define INVALID_OP              (-1)
#define INITIAL_STATUS    0x0   /* not upgrade */
#define INVALID_SOFTWARE  0x1
#define SAVE_SOFTWARE     0x2
#define SAVE_COMPLETE  0x3
#define UPGRADE_COMPLETE    0x4

#define NETWORK_CONF_FILE       "/etc/network"


#define ORIGINAL_HARDWARE_ADDRESS_FILE "/etc/hardware_org"
#define HARDWARE_ADDRESS_FILE           "/etc/hardware"




#define INTERNET_STATUS_FILE "/var/run/internet_apply"


#define IF_LOCAL "eth0" 


//#define SYSTEM_DEFAULT_IP "192.168.10.1"
//#define SYSTEM_DEFAULT_IP "192.168.123.254"


#define UPGRADE_NORMAL   0x0
#define UPGRADE_STARTED  0x1
#define UPGRADE_FILE_WRITE_END  0x2
#define UPGRADE_CHECKING_FILE   0x3
#define UPGRADE_INVALID_FILE    0x4
#define UPGRADE_FILE_IS_GOOD    0x5
#define UPGRADE_FLASH_WRITE_START   0x6
#define UPGRADE_FLASH_WRITING   0x7
#define UPGRADE_FLASH_WRITE_END 0x8
#define UPGRADE_REBOOTING       0x9
#define UPGRADE_SMALL_FILE       0xa

#define WAN1_RTID         201
#define WAN2_RTID         202
#define MAIN_RTID         254
#define DEFAULT_RTID_TAG  255
#define WAN1_INPUT_MARK   1001
#define WAN2_INPUT_MARK   1002

#define RTMARK_TABLE  "nat"

#define LOADSHARE_WRR_CONF	"/etc/lswrr.conf"
#define LOADSHARE_IP_WRR_CONF	"/etc/lsipwrr.conf"

#endif
