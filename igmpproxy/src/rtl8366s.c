/*
 *   Status :  hold due to timeout/leave issue.
 */


/*
 *
 *  We maintain a IGMP group list:
 *
 *				group[ 01:00:5E:00:00:02 ]
 *				group[ 01:00:5E:00:00:05 ]
 *		            ...
 *
 *  In every IGMP group entry, an IP address list keeps the record who has sent IGMP report.
 *
 *       group[ 01:00:5E:00:00:02 ] --> 10.10.10.100(port1) --> 10.10.10.102(port3) -> ... -> NULL
 *       group[ 01:00:5E:00:00:05 ] --> 10.10.10.103(port3) --> NULL
 *        ...
 *
 *
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <net/if.h>

#include <rtl8366s_asicdrv.h>
#define DUPLICATED_TYPE	1
#include "defs.h"
#include <lib/libdeclare.h>

static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();

extern int32 rtl8366s_addLUTMulticast_with_fid(uint32 chipid, uint8 *mac, uint32 portmask, uint32 fid);
extern int32 rtl8366s_delLUTMACAddress_with_fid(uint32 chipid, uint8 *mac, uint32 fid);


struct mac_table internal_mac_table[1024];

extern int igmp_router_port;

void switch_init(void)
{
	uint32 bcstorm, mcstorm, undastorm;
	int i;
	int lockfd=lock_file("switch");

	// initialize multicast configuration

	/* turn off multicast storm filter */
	for(i=0; i<PORT_MAX; i++)
	{
		rtl8366s_getAsicStormFiltering(0, i, &bcstorm, &mcstorm, &undastorm);
		rtl8366s_setAsicStormFiltering(0, i, bcstorm, FALSE, undastorm);
#ifdef USE_2ND_RTL8366S
		rtl8366s_getAsicStormFiltering(1, i, &bcstorm, &mcstorm, &undastorm);
		rtl8366s_setAsicStormFiltering(1, i, bcstorm, FALSE, undastorm);
#endif
	}

#if 0
	/* trap IGMP/MLD packet to CPU */
	rtl8366s_setAsicRma(0, RMA_IGMP_MLD_PPPOE, TRUE);
	rtl8366s_setAsicRma(0, RMA_IGMP, TRUE);
	rtl8366s_setAsicRma(0, RMA_MLD, TRUE);
	/* disable CPU port learning */
	//rtl8366s_setAsicPortLearnDisable(1<<cpuPortNum);

#ifdef USE_2ND_RTL8366S
	rtl8366s_setAsicRma(1, RMA_IGMP_MLD_PPPOE, TRUE);
	rtl8366s_setAsicRma(1, RMA_IGMP, TRUE);
	rtl8366s_setAsicRma(1, RMA_MLD, TRUE);
	/* disable CPU port learning */
	//rtl8366s_setAsicPortLearnDisable(1<<cpuPortNum);
#endif
#endif
	unlock_file(lockfd);

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
}

void switch_fini(void)
{
	uint32 bcstorm, mcstorm, undastorm;
	int i;
	int lockfd=lock_file("switch");

	// Clear multicast configuration

	/* turn off multicast storm filter */
	for(i=0; i<PORT_MAX; i++)
	{
		rtl8366s_getAsicStormFiltering(0, i, &bcstorm, &mcstorm, &undastorm);
		log(LOG_WARNING, 0,"F[%d] Chip1 : b:%d, m:%d, u:%d", i, bcstorm, mcstorm, undastorm);
		rtl8366s_setAsicStormFiltering(0, i, bcstorm, TRUE, undastorm);
#ifdef USE_2ND_RTL8366S
		rtl8366s_getAsicStormFiltering(1, i, &bcstorm, &mcstorm, &undastorm);
		log(LOG_WARNING, 0,"F[%d] Chip2 : b:%d, m:%d, u:%d", i, bcstorm, mcstorm, undastorm);
		rtl8366s_setAsicStormFiltering(1, i, bcstorm, TRUE, undastorm);
#endif
	}


#if 0
	rtl8366s_setAsicRma(0, RMA_IGMP_MLD_PPPOE, FALSE);
	rtl8366s_setAsicRma(0, RMA_IGMP, FALSE);
	rtl8366s_setAsicRma(0, RMA_MLD, FALSE);
	//rtl8366s_setAsicPortLearnDisable(0);

#ifdef USE_2ND_RTL8366S
	rtl8366s_setAsicRma(1, RMA_IGMP_MLD_PPPOE, FALSE);
	rtl8366s_setAsicRma(1, RMA_IGMP, FALSE);
	rtl8366s_setAsicRma(1, RMA_MLD, FALSE);
	//rtl8366s_setAsicPortLearnDisable(0);
#endif
#endif

	unlock_file(lockfd);
	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();
}

void updateMacTable(struct group *entry)
{
	unsigned char mac[6];
	char wholestr[13];
	int lockfd;

	lockfd=lock_file("switch");
	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);
	log(LOG_NOTICE, 0,"updateMacTable : %s", wholestr);

	mac[0] = 0x01;
	mac[1] = 0x00;
	mac[2] = 0x5e;
	mac[3] = entry->a1;
	mac[4] = entry->a2;
	mac[5] = entry->a3;

	// multicast mac address updated in switch register

	if (entry->port_map)
	{
		unsigned int port_map;
		char wanip[20];

#ifdef USE_2ND_RTL8366S
		port_map = (entry->port_map & 0xF) | 0x20; // add CPU port
		if (entry->port_map & 0x1F0)
			port_map |= 0x10; // 2nd switch linked port
#else
		port_map = entry->port_map | 0x20 ; // add CPU port
#endif
		port_map &= ~0x80000000; // remove wireless 

		if (igmp_router_port >= 0)
		{
			port_map |= ((1 << igmp_router_port));
			log(LOG_WARNING, 0,"updateMacTable : add router port : %08x", port_map);
		}

		rtl8366s_addLUTMulticast_with_fid(0, mac, port_map, 1);
		rtl8366s_addLUTMulticast_with_fid(0, mac, 0x21, 2); // WAN FID : CPU & WAN port
		log(LOG_DEBUG,0,"1st port map : %08x\n", port_map);

#ifdef USE_2ND_RTL8366S
		if (entry->port_map & 0x1F0)
		{
			port_map = (((entry->port_map & 0x1F0) >> 4) | 0x20 ) & ~0x80000000;
			rtl8366s_addLUTMulticast(1, mac, port_map );
			log(LOG_DEBUG,0,"2nd port map : %08x\n", port_map);
		}
#endif
	}
	else
	{
		rtl8366s_delLUTMACAddress_with_fid(0, mac, 2);
		rtl8366s_delLUTMACAddress_with_fid(0, mac, 1);
#ifdef USE_2ND_RTL8366S
		rtl8366s_delLUTMACAddress(1, mac);
#endif
	}

	unlock_file(lockfd);
}

static void create_all_hosts_rule(void)
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map       = 0x1FE,
                .next           = NULL
        };
        updateMacTable(&entry);
}

static void destory_all_hosts_rule()
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map = 0x0,
                .next = NULL
        };
        updateMacTable(&entry);
}

int get_switch_port_num(char *mac)
{
	enum PORTID   port;
	unsigned char mac_temp[6];
	int lockfd;

	strtomac( mac, mac_temp);
	// user port    - 1 2 3 4
	// 1st rtl8366s	- 1 2 3 4

        lockfd=lock_file("switch");

	if (rtl8366s_getLUTUnicast_with_fid(0, mac_temp, &port, 1))
	{
		fprintf(stderr, "Can't find MAC in switch ARL: mac_temp=[%02x:%02x:%02x:%02x:%02x:%02x]\n",
				mac_temp[0],
				mac_temp[1],
				mac_temp[2],
				mac_temp[3],
				mac_temp[4],
				mac_temp[5]
				);
		unlock_file(lockfd);
		return -1;
	}

#ifdef USE_2ND_RTL8366S
	// user port    - 8 7 6 5 4 3 2 1   1st-2nd
	// 1st rtl8366s	- 1 2 3             4
	// 2nd rtl8366s -       0 1 2 3 4   5 
	// system port  - 1 2 3 4 5 6 7 8
	if (port == 4)
	{
		//if (rtl8366s_getLUTUnicast_with_fid(1, mac_temp, &port, 1))
		if (rtl8366s_getLUTUnicast(1, mac_temp, &port))
		{
			fprintf(stderr, "Can't find MAC in switch ARL: mac_temp=[%02x:%02x:%02x:%02x:%02x:%02x]\n",
				mac_temp[0],
				mac_temp[1],
				mac_temp[2],
				mac_temp[3],
				mac_temp[4],
				mac_temp[5]
				);
			unlock_file(lockfd);
			return -1;
		}
		port +=4;
	}
#endif
	unlock_file(lockfd);

	return port;
}

