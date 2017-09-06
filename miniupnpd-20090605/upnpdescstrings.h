/* $Id: upnpdescstrings.h,v 1.3 2009/09/09 09:05:16 ysrt2880 Exp $ */
/* miniupnp project
 * http://miniupnp.free.fr/ or http://miniupnp.tuxfamily.org/
 * (c) 2006 Thomas Bernard
 * This software is subject to the coditions detailed in
 * the LICENCE file provided within the distribution */
#ifndef __UPNPDESCSTRINGS_H__
#define __UPNPDESCSTRINGS_H__

#include "config.h"

#if 0
/* strings used in the root device xml description */
#define ROOTDEV_FRIENDLYNAME		OS_NAME " router"
#define ROOTDEV_MANUFACTURER		OS_NAME
#define ROOTDEV_MANUFACTURERURL		OS_URL
#define ROOTDEV_MODELNAME		OS_NAME " router"
#define ROOTDEV_MODELDESCRIPTION	OS_NAME " router"
#define ROOTDEV_MODELURL		OS_URL
#endif

#define WANDEV_FRIENDLYNAME		"WANDevice"
#define WANDEV_MANUFACTURER		"UPnP"
//#define WANDEV_MANUFACTURERURL		"http://www.iptime.co.kr/"
#define WANDEV_MODELNAME		"WAN Device"
#define WANDEV_MODELDESCRIPTION		"WAN Device"
#define WANDEV_MODELNUMBER		UPNP_VERSION
//#define WANDEV_MODELURL			"http://www.iptime.co.kr/"
#define WANDEV_UPC			"UPNPD"

#define WANCDEV_FRIENDLYNAME		"WANConnectionDevice"
#define WANCDEV_MANUFACTURER		WANDEV_MANUFACTURER
#define WANCDEV_MANUFACTURERURL		WANDEV_MANUFACTURERURL
#define WANCDEV_MODELNAME		"UPnPd"
#define WANCDEV_MODELDESCRIPTION	"UPnP daemon"
#define WANCDEV_MODELNUMBER		UPNP_VERSION
//#define WANCDEV_MODELURL		"http://www.iptime.co.kr/"
#define WANCDEV_UPC			"UPNPD"

#endif

