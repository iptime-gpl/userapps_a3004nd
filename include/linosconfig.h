#ifndef __LINOS_CONFIG_H
#define __LINOS_CONFIG_H

#include "module_name.h"

#define HIDDEN_IP "169.254.123.187"
#define HIDDEN_NETWORK "169.254.0.0"

#define WAN1_NAME       "wan1"
#define WAN2_NAME       "wan2"

#define ACCESSLISTCONF "/etc/accesslist.conf"   //iplist
#define ACCESSLISTSET "/etc/accesslist.set"     //stat set
#define ACCESSLISTCONFTEMP "/var/run/iptable_temp.temp"  //temp file
#define MAX_TEXT                32

#ifndef USE_NEW_LIB
typedef struct accesslist_s
{
        char consecstat[MAX_TEXT];
        char check[MAX_TEXT];
        char count[MAX_TEXT];
        char admincheck[MAX_TEXT];
} accesslist;
#endif

#ifdef USE_SYSTEM_LOG
#include "syslog_msg.h"
#endif


#define PPPOE_INITIAL_STATUS 0
#define PPPOE_CONNECTED	     4	
#define PPPOE_AUTH_FAILED    6
#define PPPOE_WIZARD_TIMEOUT 7	

#include "lib/libdeclare.h"

#ifndef PPPOE_DEFAULT_MTU
#define PPPOE_DEFAULT_MTU 1454
#endif

#define COD_FLAG  0x7f000010
#define COD_PPP1_FLAG  COD_FLAG
#define COD_PPP2_FLAG  0x7f000020

#ifdef USE_PORT_TRIGGER
#define PORT_TRIGGER_FLAG           0x7f000011 
#endif
#ifdef USE_PLANTYNET_V2
#define PLANTYNET_NOTICE_MARK       0x7f000012 // used by iptable-q
#endif
#ifdef USE_NO_HWNAT_FILTER_MARK
#define NO_HWNAT_FILTER_MARK        0x7f000013
#endif

#ifdef USE_XSCALE
#if defined(ARCH_TIME2WAN) && defined(ARCH_TIMEAIR)
	#include "ixpwl2wan_config.h"
#elif ARCH_IXPW2ZION
	#include "ixpw2zion_config.h"
#elif ARCH_TIME2WAN
	#include "ixp2wan_config.h"
#elif ARCH_TIMEAIR
	#include "ixpwl_config.h"
#elif ARCH_TIMENV
	#include "timenv_config.h"
#else
	#include "timeixp_config.h"
#endif

#else
#ifdef ARCH_TIMEPRO
#include "timepro_config.h"
#endif
#ifdef ARCH_TIMEPROV
#include "timeprov_config.h"
#endif
#ifdef ARCH_TIMEHS
#include "timehs_config.h"
#endif
#ifdef ARCH_TIMENX
#include "timenx_config.h"
#endif
#ifdef ARCH_TIMEQOS
#include "timeqos_config.h"
#endif
#ifdef ARCH_TIMEAIR
#include "timeair_config.h"
#endif
#ifdef ARCH_TIMENV
#include "timenv_config.h"
#else
#ifdef ARCH_ATHAP
#include "athap_config.h"
#endif
#endif

#ifdef ARCH_TIMEWLNZION
#include "timeair_config.h"
#endif
#ifdef ARCH_HAIER
#include "haier_config.h"
#endif
#ifdef ARCH_TIMEZION
#include "timezion_config.h"
#endif
#ifdef ARCH_TIMEQ
#include "timeve_config.h"
#endif
#ifdef ARCH_TIMEVQ
#include "timevq_config.h"
#endif
#ifdef ARCH_NETMAN
#include "netman_config.h"
#endif
#ifdef ARCH_TIME2WAN
#include "time2wan_config.h"
#endif
#ifdef ARCH_TIMEZB
#include "timezb_config.h"
#endif
#endif

#ifdef ARCH_TIMEBOOT
#include "timeboot_config.h"
#endif

#ifdef ARCH_TIMENV
#include "timenv_config.h"
#else
#ifdef ARCH_TIMEAP
#include "timeap_config.h"
#endif
#endif


#ifndef USE_NEW_LIB
#ifndef WAN1_PORT_NUMBER
#ifdef USE_DUAL_WAN
#define WAN1_PORT_NUMBER  (MAX_PORT_NUMBER-1)
#define WAN2_PORT_NUMBER  (MAX_PORT_NUMBER)
#define LAN_PORT_MAX_NUMBER	(MAX_PORT_NUMBER-2)
#else
#define WAN1_PORT_NUMBER  (MAX_PORT_NUMBER)
#define LAN_PORT_MAX_NUMBER	(MAX_PORT_NUMBER-1)
#endif
#endif
#endif

#if defined USE_BIG_ENDIAN || defined USE_XSCALE
#define LE_TO_BE_UINT(x) \
        ((unsigned int)((((unsigned int)(x)) >> 24) + ((((unsigned int)(x)) & 0x00ff0000) >> 8) + \
                ((((unsigned int)(x)) & 0x0000ff00) << 8) + (((unsigned int)(x)) << 24)))
#else
#define LE_TO_BE_UINT(x) ((unsigned int)(x))
#endif

#ifdef USE_SAVE_SIGNAL 
#define SIGNAL_SAVE signal_save();
#else
#define SIGNAL_SAVE ;
#endif

#ifdef USE_ISYSD
#define SIGNAL_UPDATE signal_update();
#else
#define SIGNAL_UPDATE ;
#endif

#define SIGNAL_RUN_TOGGLE signal_toggle();

#ifdef USE_SNPRINTF2
#include <stdarg.h>
#define snprintf snprintf2
#define vsnprintf vsnprintf2

extern int snprintf2(char *str, size_t count, const char *fmt, ...);
extern int vsnprintf2(char *str, size_t count, const char *fmt, va_list args);
#endif


#endif
