/* $Id: miniupnpdpath.h,v 1.1 2009/06/19 02:34:10 ysrt305x Exp $ */
/* MiniUPnP project
 * http://miniupnp.free.fr/ or http://miniupnp.tuxfamily.org/
 * (c) 2006-2008 Thomas Bernard
 * This software is subject to the conditions detailed
 * in the LICENCE file provided within the distribution */

#ifndef __MINIUPNPDPATH_H__
#define __MINIUPNPDPATH_H__

#include "config.h"

/* Paths and other URLs in the miniupnpd http server */

#if 0
#define ROOTDESC_PATH 		"/rootDesc.xml"

#ifdef HAS_DUMMY_SERVICE
#define DUMMY_PATH			"/dummy.xml"
#endif

#define WANCFG_PATH			"/WANCfg.xml"
#define WANCFG_CONTROLURL	"/ctl/CmnIfCfg"
#define WANCFG_EVENTURL		"/evt/CmnIfCfg"

#define WANIPC_PATH			"/WANIPCn.xml"
#define WANIPC_CONTROLURL	"/ctl/IPConn"
#define WANIPC_EVENTURL		"/evt/IPConn"

#ifdef ENABLE_L3F_SERVICE
#define L3F_PATH			"/L3F.xml"
#define L3F_CONTROLURL		"/ctl/L3F"
#define L3F_EVENTURL		"/evt/L3F"
#endif
#else
#define ROOTDESC_PATH 		"/etc/linuxigd/gatedesc.xml"

#ifdef HAS_DUMMY_SERVICE
#define DUMMY_PATH		"/etc/linuxigd/dummy.xml"
#endif

#define WANCFG_PATH		"/etc/linuxigd/gateicfgSCPD.xml"
#define WANCFG_CONTROLURL	"/etc/linuxigd/gateicfgSCPD.ctl"
#define WANCFG_EVENTURL		"/etc/linuxigd/gateicfgSCPD.evt"

#define WANIPC_PATH		"/etc/linuxigd/gateconnSCPD.xml"
#define WANIPC_CONTROLURL	"/etc/linuxigd/gateconnSCPD.ctl"
#define WANIPC_EVENTURL		"/etc/linuxigd/gateconnSCPD.evt"

#ifdef ENABLE_L3F_SERVICE
#define L3F_PATH		"/etc/linuxigd/l3forwardSCPD.xml"
#define L3F_CONTROLURL		"/etc/linuxigd/l3forwardSCPD.ctl"
#define L3F_EVENTURL		"/etc/linuxigd/l3forwardSCPD.evt"
#endif
#endif

#endif

