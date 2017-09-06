#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

#define PRODUCT_NAME "timepro"

#define MAX_PORT_NUMBER 5
#define SECTOR_SIZE 0x10000
#define MAX_BOOTLOADER_SIZE  0x10000
#define USE_OLD_BOOTLOADER 1
#define MAC_ADDRESS_OFFSET  (MAX_BOOTLOADER_SIZE-0x100) 
#define EFM_OUI "00-08-9f-"
#define MAX_BOOTLOADER_SIZE 0x10000
#define FLASH_SAVE_OFFSET  0x1e0000 
#define FLASH_SAVE_SIZE    0x20000
#define MAX_IMAGE_SIZE    (0x200000 - MAX_BOOTLOADER_SIZE - 0x10000 )
#define MAX_FIRMWARE_SIZE  0x1c0000
#define SYSLOG_SECTOR_BASE 0x1d0000
#define SYSLOG_SECTOR_SIZE 0x10000

#ifdef USE_SECONDARY_SAVESECTOR
#define SECONDARY_SAVE_SECTOR_BASE 0x1c0000
#define MAX_SECONDARY_SAVE_SIZE 0x10000
#endif

#define SAVE_FS_ID		0x1

#define PPP_STATUS_FILE "/var/run/pppstatus"
#define RAW_FLASH_DEV  "/dev/rawflash"

#define PASSWD_FILE "/etc/httpd.passwd"

#define CONFIG_SAVE_CMD "/sbin/saveconf"
#define CONFIG_RESTORE_CMD "/sbin/restoreconf"
#define CONFIG_DEFAULT_CMD "/sbin/defaultconf"

#define MSMSTATUS_FILE  "/proc/image/msm"
#define MSM_PID_FILE   "/var/run/msm.pid"

#define PUBLIC_IP_FILE "/var/run/publicip"


#define DHCPD_PROGRAM                   "/sbin/dhcpd"
#define RESOLV_CONF_FILE                "/etc/resolv.conf"
#define INTERNAL_NETWORK_INFO_FILE      "/etc/internal"
#define DHCPD_PID_FILE                  "/var/run/dhcpd.pid"
#define DHCLIENT_PID_FILE               "/var/run/dhclient.pid"
#define PPPD_PID_FILE                 "/var/run/ppp1.pid"
#define PPPCRON_PID_FILE                "/var/run/pppcron.pid"
#define IPTABLESQ_PID_FILE              "/var/run/iptableq.pid"
#define IN_PUBLIC_PID_FILE              "/var/run/in_public.pid"

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
#define TIMED_PID_FILE                  "/var/run/timed.pid"




#define PORT_CONFIG_SYSTEM_FILE         "/proc/interface/eth/%d/phy_control"
#define PORT_STAT_FILE_DIRECTORY        "/proc/interface/eth/%d/mibii"
#define LINK_STATUS_FILE_DIRECTORY      "/proc/interface/eth/%d/phy_status"
#define CLEAR_ETHER_STAT                "/proc/interface/eth/clear"
#define PORT_CONFIG_FILE                "/etc/port_config"
#ifdef USE_FS_OPTIMIZED
#define FTP_PRIVATE_PORT_FILE           "ftp_private_port"
#else
#define FTP_PRIVATE_PORT_FILE           "/etc/ftp_private_port"
#endif
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
#define SYSTEM_DEFAULT_IP "192.168.0.1"

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

#define NEW_TIMED_CONFIG "/etc/new_timed.conf"

#endif
