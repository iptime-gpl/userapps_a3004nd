#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <net/if.h>

#include <rtk_api.h>
#include <rtk_api_ext.h>

#define DUPLICATED_TYPE	1
#define USE_LINUX_IN_H
#include "defs.h"

extern int lock_file(char *lockfile);
extern int unlock_file(int fd);
extern int strtomac( char *macstr , unsigned char *mac);

static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();

struct mac_table internal_mac_table[1024];

extern int igmp_router_port;

void switch_init(void)
{
	int lockfd=lock_file("switch");

	// initialize multicast configuration
	//

	unlock_file(lockfd);

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
}

void switch_fini(void)
{
	int lockfd=lock_file("switch");

	// Clear multicast configuration
	//

	unlock_file(lockfd);

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();

}

#ifdef USE_RTL8370_RTL8367B
extern int l2_mcastAddr_add(unsigned char *mac, int fid, unsigned int portmap);
extern int l2_mcastAddr_del(unsigned char *mac, int fid);
extern int l2_addr_get_port(unsigned char *mac);
#endif

void updateMacTable(struct group *entry)
{
	rtk_mac_t mac;
	rtk_portmask_t port_map;
	char wholestr[13];
	int lockfd;
	int rc; 

	lockfd=lock_file("switch");
	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);
	log(LOG_NOTICE, 0,"updateMacTable : %s, %08x", wholestr, entry->port_map);

	mac.octet[0] = 0x01;
	mac.octet[1] = 0x00;
	mac.octet[2] = 0x5e;
	mac.octet[3] = entry->a1;
	mac.octet[4] = entry->a2;
	mac.octet[5] = entry->a3;

	// multicast mac address updated in switch register

	if (entry->port_map)
	{
#ifdef USE_RTL8367B
		port_map.bits[0] = entry->port_map | (1 << 5) ; // add CPU port
#else
		port_map.bits[0] = entry->port_map | (1 << 9) ; // add CPU port
#endif
		port_map.bits[0] &= ~0x80000000; // remove wireless 

		if (igmp_router_port >= 0)
		{
			port_map.bits[0] |= ((1 << igmp_router_port));
			log(LOG_WARNING, 0,"updateMacTable : add router port : %08x", port_map.bits[0]);
		}

#ifdef USE_RTL8370_RTL8367B
		l2_mcastAddr_add(&mac.octet[0], 1, port_map.bits[0]);
#elif defined(USE_RTL8370)
		rtk_l2_mcastAddr_add(&mac, 1, port_map);
#else
		rc = rtk_l2_mcastAddr_add(&mac, 0, 1, port_map);
#endif
		log(LOG_DEBUG,0,"1st port map : %08x\n", port_map.bits[0]);
	}
	else
	{
		port_map.bits[0] = 0;
#ifdef USE_RTL8370_RTL8367B
		l2_mcastAddr_del(&mac.octet[0], 1);
#elif defined(USE_RTL8370)
		rtk_l2_mcastAddr_del(&mac, 1);
#else
		rc = rtk_l2_mcastAddr_del(&mac, 0, 1);
		if (rc != RT_ERR_OK)
			fprintf(stderr, "rtk_l2_mcastAddr_del() failed [%d].\n", rc);
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
#ifdef USE_RTL8367B
                .port_map       = 0x3f,
#else
                .port_map       = 0x3ff,
#endif
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
#ifdef USE_RTL8370_RTL8367B
	return l2_addr_get_port(mac);
#else
	int lockfd;
	rtk_mac_t SrcMac;
	rtk_l2_ucastAddr_t L2_data;


	strtomac( mac, SrcMac.octet);
	memset((char *)&L2_data, 0x0, sizeof(rtk_l2_ucastAddr_t));
	L2_data.fid = 1;

        lockfd=lock_file("switch");

	if (rtk_l2_addr_get(&SrcMac, &L2_data) != RT_ERR_OK)
	{
		fprintf(stderr, "Can't find MAC in switch ARL: mac_temp=[%02x:%02x:%02x:%02x:%02x:%02x]\n",
				SrcMac.octet[0], SrcMac.octet[1], SrcMac.octet[2],
				SrcMac.octet[3], SrcMac.octet[4], SrcMac.octet[5]);
		unlock_file(lockfd);
		return -1;
	}
#if 0
	fprintf(stderr, "port: %d\n", L2_data.port);
	fprintf(stderr, "fid: %d\n", L2_data.fid);
	fprintf(stderr, "efid: %d\n", L2_data.efid);
	fprintf(stderr, "ivl: %d\n", L2_data.ivl);
	fprintf(stderr, "cvid: %d\n", L2_data.cvid);
#endif
	unlock_file(lockfd);

	return (int)L2_data.port;
#endif
}

