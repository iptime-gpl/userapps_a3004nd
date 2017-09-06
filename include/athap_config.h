#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

#define PRODUCT_NAME "timeap"
#define MAX_PORT_NUMBER 1
#define WAN1_PORT_NUMBER -1

#define SECTOR_SIZE 0x10000

/* rdc(i386) flash map : bootloader bottom location */
/* if bootloader location is top, MAX_BOOTLOADER_SIZE definition is available */
/* if bootloader location is bottom, MAX_BOOTLOADER_SIZE definition should be ZERO */
#define MAX_BOOTLOADER_SIZE  0x0	
#define BOTTOM_BOOTLOADER_SIZE  0x20000

#ifndef MAX_FLASH_SIZE
#define MAX_FLASH_SIZE 0x200000
#endif

/* if FLASH_SAVE_SIZE value is changed, you should be change a savefs zone of mtd in kernel */
#ifndef FLASH_SAVE_SIZE
#define FLASH_SAVE_SIZE    0x10000
#endif

#ifndef MAC_ADDRESS_SIZE
#define MAC_ADDRESS_SIZE    0x80
#endif


#define MAX_IMAGE_SIZE     (MAX_FLASH_SIZE - BOTTOM_BOOTLOADER_SIZE - FLASH_SAVE_SIZE - MAC_ADDRESS_SIZE)
#define MAX_FIRMWARE_SIZE  MAX_IMAGE_SIZE
/* if FLASH_SAVE_OFFSET value is changed, you should be change a savefs zone of mtd in kernel */
#define FLASH_SAVE_OFFSET  0x1d0000 // 0x1d000 == (MAX_FLASH_SIZE - BOTTOM_BOOTLOADER_SIZE - FLASH_SAVE_SIZE)

#define MAC_ADDRESS_OFFSET (MAX_FLASH_SIZE - 1024 - MAC_ADDRESS_SIZE)  

#define FLASH_DIAG_SIZE     FLASH_SAVE_SIZE
#define FLASH_DIAG_OFFSET   FLASH_SAVE_OFFSET

#define EFM_OUI "00-08-9f-"

#define SAVE_FS_ID              0x4

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

#define WIRELESS_IF_FILE		"/etc/wireless_ifname"


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


#define IF_LOCAL "br0"
#define IF_WIRELESS "eth2"

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




#define STA_LIST_PROC	"/proc/interface/wireless/stalist"

#define NEW_TIMED_CONFIG "/etc/new_timed.conf"

#define INTERSIL_PCI_ID 0x1260
#define RALINK_PCI_ID	0x1814
#define ATHEROS_PCI_ID  0x168C 
#define INPROCOM_PCI_ID  0x17fe 
#define ZYDAS_PCI_ID    0x167b
#define RT256X_PCI_ID  0x1814

#define PCI_ID_INTERSIL_11G   0x12603890
#define PCI_ID_RALINK_RT2500  0x18140201
#define PCI_ID_ATHEROS_11G    0x168C0013	
#define PCI_ID_INPROCOM_11G   0x17fe2220
#define PCI_ID_RALINK_RT256X 0x18140301 

#define PCI_ID_RALINK_RT2561 0x18140301 
#define PCI_ID_RALINK_RT2661 0x18140401 

#define PCI_ID_ZYDAS1212 0x167b2112 

#endif
