/*
**  igmpproxy - IGMP proxy based multicast router 
**  Copyright (C) 2005 Johnny Egeland <johnny@rlo.org>
**
**  This program is free software; you can redistribute it and/or modify
**  it under the terms of the GNU General Public License as published by
**  the Free Software Foundation; either version 2 of the License, or
**  (at your option) any later version.
**
**  This program is distributed in the hope that it will be useful,
**  but WITHOUT ANY WARRANTY; without even the implied warranty of
**  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
**  GNU General Public License for more details.
**
**  You should have received a copy of the GNU General Public License
**  along with this program; if not, write to the Free Software
**  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
**
**----------------------------------------------------------------------------
**
**  This software is derived work from the following software. The original
**  source code has been modified from it's original state by the author
**  of igmpproxy.
**
**  smcroute 0.92 - Copyright (C) 2001 Carsten Schill <carsten@cschill.de>
**  - Licensed under the GNU General Public License, version 2
**  
**  mrouted 3.9-beta3 - COPYRIGHT 1989 by The Board of Trustees of 
**  Leland Stanford Junior University.
**  - Original license can be found in the "doc/mrouted-LINCESE" file.
**
*/
/**
*   defs.h - Header file for common includes.
*/

#include <errno.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <syslog.h>
#include <signal.h>

#include <sys/socket.h>
#include <sys/un.h>
#include <sys/time.h>

#include <net/if.h>

// The multicats API needs linux spesific headers !!!                  
#ifdef USE_LINUX_IN_H
    #include <linux/in.h>
    #include <linux/mroute.h>
#else
    #include <netinet/in.h>
    #include <netinet/ip.h>
    #include <netinet/igmp.h>
    #include <arpa/inet.h>
#endif

#define WAN1_NAME       "wan1"
#define IGMP_PROXY_REALTEK_METHOD     1

// The default path for the config file...
#define     IGMPPROXY_CONFIG_FILEPATH     "/etc/igmpproxy.conf"
#define     ENABLE_DEBUG    1

/*
 * Limit on length of route data
 */
#define MAX_IP_PACKET_LEN	576
#define MIN_IP_HEADER_LEN	20
#define MAX_IP_HEADER_LEN	60

#define MAX_MC_VIFS    32     // !!! check this const in the specific includes

// Useful macros..          
#define MIN( a, b ) ((a) < (b) ? (a) : (b))
#define MAX( a, b ) ((a) < (b) ? (b) : (a))
#define VCMC( Vc )  (sizeof( Vc ) / sizeof( (Vc)[ 0 ] ))
#define VCEP( Vc )  (&(Vc)[ VCMC( Vc ) ])

// Bit manipulation macros...
#define BIT_ZERO(X)      ((X) = 0)
#define BIT_SET(X,n)     ((X) |= 1 << (n))
#define BIT_CLR(X,n)     ((X) &= ~(1 << (n)))
#define BIT_TST(X,n)     ((X) & 1 << (n))


// Useful defs...
#define FALSE		0
#define TRUE		1

typedef void (*cfunc_t)   (void *);

#ifndef DUPLICATED_TYPE
typedef unsigned char u_int8_t;
typedef unsigned short u_int16_t;
typedef unsigned int u_int32_t;
#endif

#ifndef DUPLICATED_TYPE
typedef unsigned char uint8;
typedef unsigned short uint16;
typedef unsigned int uint32;
#endif

//#################################################################################
//  Globals
//#################################################################################

/*
 * External declarations for global variables and functions.
 */
#define RECV_BUF_SIZE 8192
extern char     *recv_buf;
extern char     *send_buf;

extern char     s1[];
extern char     s2[];
extern char		s3[];
extern char		s4[];



//#################################################################################
//  Lib function prototypes.
//#################################################################################

/* syslog.c
 */
extern int  Log2Stderr;           // Log threshold for stderr, LOG_WARNING .... LOG_DEBUG 
extern int  LogLastServerity;     // last logged serverity
extern int  LogLastErrno;         // last logged errno value
extern char LogLastMsg[ 128 ];    // last logged message

#ifndef SIZE_OPTI_L3
#define	    IF_DEBUG	if(Log2Stderr & LOG_DEBUG)
void log( int Serverity, int Errno, const char *FmtSt, ... );
#else
#define log(x,...)
#define	IF_DEBUG 
#endif


/* ifvc.c
 */
#define MAX_IF         40     // max. number of interfaces recognized 

// Interface states
#define IF_STATE_DISABLED      0   // Interface should be ignored.
#define IF_STATE_UPSTREAM      1   // Interface is the upstream interface
#define IF_STATE_DOWNSTREAM    2   // Interface is a downstream interface

// Multicast default values...
#define DEFAULT_ROBUSTNESS     5
#define DEFAULT_THRESHOLD      1
#define DEFAULT_RATELIMIT      0

// Define timer constants (in seconds...)
#define INTERVAL_QUERY          (60 * 2) // EFM, ysyoo
#define INTERVAL_QUERY_RESPONSE  5
#define INTERVAL_UNICAST_QUERY_RESPONSE  1

#define ROUTESTATE_NOTJOINED            0   // The group corresponding to route is not joined
#define ROUTESTATE_JOINED               1   // The group corresponding to route is joined
#define ROUTESTATE_CHECK_LAST_MEMBER    2   // The router is checking for hosts

#define MAX_MULTICASTS_GROUP            256
#define END_OF_MAC_TABLE                        0xFFFFFFFF

#ifdef USE_WIRELESS_CGI
#define WIRELESS_PORT_NUM	0x7f
#endif

#define INADDR_IGMP	0xe0000016  /* 224.0.0.22 */

/* delay mac table deletion - mt7620 */
#define DELETED                 1
#define ZEROED                  2

#define READMODE        0x0
#define WRITEMODE       0x1
#define WRITE_DELAY     100                     /* ms */


// Linked list of networks... 
struct SubnetList {
    unsigned int              subnet_addr;
    unsigned int              subnet_mask;
    struct SubnetList*  next;
};

struct IfDesc {
    char                Name[ sizeof( ((struct ifreq *)NULL)->ifr_name ) ];
    struct in_addr      InAdr;          /* == 0 for non IP interfaces */            
    short               Flags;
    short               state;
    struct SubnetList*  allowednets;
    unsigned int        robustness;
    unsigned char       threshold;   /* ttl limit */
    unsigned int        ratelimit; 
    unsigned int        index;
};

// Keeps common configuration settings 
struct Config {
    unsigned int        robustnessValue;
    unsigned int        queryInterval;
    unsigned int        queryResponseInterval;
    // Used on startup..
    unsigned int        startupQueryInterval;
    unsigned int        startupQueryCount;
    // Last member probe...
    unsigned int        lastMemberQueryInterval;
    unsigned int        lastMemberQueryCount;
    // Set if upstream leave messages should be sent instantly..
    unsigned short      fastUpstreamLeave;
};


struct group_member
{
        unsigned long           ip_addr;
        unsigned char           a0;             // class D, the 1st byte.
        char                            port_num;
        char                            has_report;     // 0 or 1
        char                            sent_report;     // 0 or 1
        struct group_member *next;
};

struct group
{
        unsigned char   a0;             // class D, the 1st byte. //EFM
        unsigned char   a1;             // class D, the 2nd byte
        unsigned char   a2;             // class D, the 3rd byte
        unsigned char   a3;             // class D, the 4th byte
        unsigned int    port_map;       // port map
        struct group_member     *members;
        struct group    *next;
};

struct mac_table{
        unsigned int           mac1;           // 4 byte mac address
        unsigned short int     mac2;           // 2 byte mac address
#if defined USE_MT7621 || defined USE_MT7623
	unsigned char          vid;
        unsigned char          port_map;
#else
	unsigned char          vidx;
        unsigned int           port_map;
#endif
};


// Defines the Index of the upstream VIF...
extern int upStreamVif;

/* ifvc.c
 */
void buildIfVc( void );
struct IfDesc *getIfByName( const char *IfName );
struct IfDesc *getIfByIx( unsigned Ix );
struct IfDesc *getIfByAddress( unsigned int Ix );

/* mroute-api.c
 */
struct MRouteDesc {
    struct in_addr  OriginAdr, McAdr;
    short           InVif;
    unsigned char           TtlVc[ MAX_MC_VIFS ];
};

// IGMP socket as interface for the mrouted API
// - receives the IGMP messages
extern int MRouterFD;

int enableMRouter( void );
void disableMRouter( void );
void addVIF( struct IfDesc *Dp );
int addMRoute( struct MRouteDesc * Dp );
int delMRoute( struct MRouteDesc * Dp );
int getVifIx( struct IfDesc *IfDp );

/* config.c
 */
int loadConfig(char *configFile);
void configureVifs();
struct Config *getCommonConfig();

/* igmp.c
*/
extern unsigned int allhosts_group;
extern unsigned int allrouters_group;
void initIgmp(void);
void acceptIgmp(int);
void sendIgmp (unsigned int, unsigned int, int, int, unsigned int,int);

/* lib.c
 */
char   *fmtInAdr( char *St, struct in_addr InAdr );
char   *inetFmt(unsigned int addr, char *s);
char   *inetFmts(unsigned int addr, unsigned int mask, char *s);
int     inetCksum(u_short *addr, u_int len);

/* kern.c
 */
void k_set_rcvbuf(int bufsize, int minsize);
void k_hdr_include(int bool);
void k_set_ttl(int t);
void k_set_loop(int l);
void k_set_if(unsigned int ifa);
/*
void k_join(unsigned int grp, unsigned int ifa);
void k_leave(unsigned int grp, unsigned int ifa);
*/

/* udpsock.c
 */
int openUdpSocket( unsigned int PeerInAdr, unsigned short PeerPort );

/* mcgroup.c
 */
int joinMcGroup( int UdpSock, struct IfDesc *IfDp, unsigned int mcastaddr );
int leaveMcGroup( int UdpSock, struct IfDesc *IfDp, unsigned int mcastaddr );


/* rttable.c
 */
void initRouteTable();
void clearAllRoutes();
int insertRoute(unsigned int group, int ifx);
int activateRoute(unsigned int group, unsigned int originAddr);
void ageActiveRoutes();
void setRouteLastMemberMode(unsigned int group);
int lastMemberGroupAge(unsigned int group);

/* request.c
 */
void acceptGroupReport(unsigned int src, unsigned int group, unsigned char type);
void acceptLeaveMessage(unsigned int src, unsigned int group);
void sendGeneralMembershipQuery();
void sendSpecificMembershipQueryToSpecificMember(unsigned int dst, unsigned int group);

/* callout.c 
*/
void callout_init();
void free_all_callouts();
void age_callout_queue(int);
int timer_nextTimer();
int timer_setTimer(int, cfunc_t, void *);
int timer_clearTimer(int);
int timer_leftTimer(int);

/* confread.c
 */
#define MAX_TOKEN_LENGTH    30

int openConfigFile(char *filename);
void closeConfigFile();
char* nextConfigToken();
char* getCurrentConfigToken();

void switch_init(void);
void switch_fini(void);
void remove_all_groups(void);



