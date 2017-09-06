#ifndef __TIME_CONFIG_H
#define __TIME_CONFIG_H

/* flash map & device */
#define EFM_OUI "00-08-9f-"
#ifndef USE_BCM5354
#define RAW_FLASH_DEV  "/dev/rawflash"
#endif
#define SAVE_FS_ID              0x5

/* to be removed */
#define PUBLIC_IP_FILE "/var/run/publicip"
#define SW_UPGRADE_STATUS_FILE          "/var/run/upgrade_status"
#define RESOLV_CONF_FILE                "/etc/resolv.conf"

/* proc for system control */
#define PORT_CONFIG_SYSTEM_FILE         "/proc/interface/eth/%d/phy_control"
#define PORT_STAT_FILE_DIRECTORY        "/proc/interface/eth/%d/mibii"
#define LINK_STATUS_FILE_DIRECTORY      "/proc/interface/eth/%d/phy_status"
#define CLEAR_ETHER_STAT                "/proc/interface/eth/clear"
#define FTP_PRIVATE_PORT_SYSTEM_FILE    "/proc/ftp/private_port"
#define FTP_PRIVATE_PORT_STATE_FILE     "/proc/ftp/invalid_port"
#define H323_PORT_SYSTEM_FILE           "/proc/h323/h323_port"
#define CONNTRACK_CLEANUP_FILE          "/proc/ctproc/cleanup"
#define MAX_FTP_PRIVATE_PORT       6
#define STA_LIST_PROC	"/proc/interface/wireless/stalist"

/* system global constant */
#define UPGRADE_NORMAL   0x0
#define UPGRADE_STARTED  0x1
#define UPGRADE_FILE_WRITE_END  0x2
#define UPGRADE_CHECKING_FILE   0x3
#define UPGRADE_INVALID_FILE    0x4

#ifdef USE_NEW_TREE
/* swap for online upgrade backward compatibility ... */
#define UPGRADE_FILE_IS_GOOD        0x6
#define UPGRADE_FLASH_WRITE_START   0x5
#else
#define UPGRADE_FILE_IS_GOOD    0x5
#define UPGRADE_FLASH_WRITE_START   0x6
#endif

#define UPGRADE_FLASH_WRITING   0x7
#define UPGRADE_FLASH_WRITE_END 0x8
#define UPGRADE_REBOOTING       0x9
#define UPGRADE_SMALL_FILE       0xa

/* pci id list */
#define INTERSIL_PCI_ID 0x1260
#define RALINK_PCI_ID	0x1814
#define ATHEROS_PCI_ID  0x168C 
#define INPROCOM_PCI_ID  0x17fe 
#define ZYDAS_PCI_ID    0x167b
#define RT256X_PCI_ID  0x1814

#define PCI_ID_INTERSIL_11G   0x12603890
#define PCI_ID_RALINK_RT2500  0x18140201
#define PCI_ID_ATHEROS_11G    0x168C0013	
#define PCI_ID_AR2317_11G    0x168C2317
#define PCI_ID_INPROCOM_11G   0x17fe2220
#define PCI_ID_RALINK_RT256X 0x18140301 
#define PCI_ID_RALINK_RT2561 0x18140301 
#define PCI_ID_RALINK_RT2661 0x18140401 
#define PCI_ID_RALINK_RT2860 0x18140601
#define PCI_ID_ZYDAS1212 0x167b2112 
#define PCI_ID_BCM5354	0x14e44318
#define PCI_ID_RTL8196B 0x11112222
#define PCI_ID_QCA 	0x98782878 /* can be Random  but ca't be duplicated */ 




/********************************************************************************************/
/* 				TWO WAN CONFIG 						    */
/********************************************************************************************/

#define RTMARK_TABLE  "nat"
#define WAN1_INPUT_MARK   0x8001
#define WAN2_INPUT_MARK   0x8002
#define WAN1_RTID         201
#define WAN2_RTID         202
#define MAIN_RTID         254
#define DEFAULT_RTID_TAG  255

#ifdef USE_DUAL_WAN

#define LOADSHARE_WRR_CONF      "/etc/lswrr.conf"
#define LOADSHARE_IP_WRR_CONF   "/etc/lsipwrr.conf"

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


#define LINKMON_PID_FILE        "/var/run/linkmon.pid"
#define LINKMON_CONF_FILE       "/etc/linkmon.conf"
#define LINKMON_SYSTEM_FILE     RTMARK_STATUS

#define LINKMON_METHOD_ARP	0x1
#define LINKMON_METHOD_PING	0x2
#define LINKMON_METHOD_DNS	0x4
#define LINKMON_METHOD_TCPSYN	0x8

#define UPNP_WAN  "/etc/upnpd.wan"

#endif

#ifdef USE_ISYSD
#include <lib/sysd.h>
#endif

#endif
