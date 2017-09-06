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

#include "defs.h"
#include <lib/libdeclare.h>

static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();
extern int bcm_add_multicast_address(unsigned char *mac, int portmap, int vid);
extern int bcm_del_multicast_address(unsigned char *mac, int vid);
extern int bcm_read_address_entry(unsigned char *mac, int vid, int *port);

struct mac_table internal_mac_table[1024];

extern int igmp_router_port;

void switch_init(void)
{
	int lock_fd = lock_file("switch");

	// initialize multicast configuration
#ifdef USE_BCM5357
#ifndef USE_BCM53115S
	bcm_ether_set_page_reg(0x0, 0x21, 0x1);
#endif
	bcm_ether_set_page_reg(0x5, 0x8, 0x1);
#endif

#ifdef USE_BCM53115S
	//bcm_ether_set_page_reg(0x0, 0x21, 0x80);
	//bcm_ether_set_page_reg(0x0, 0x34, 0x20);
#endif

	unlock_file(lock_fd);

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
}

void switch_fini(void)
{
	// Clear multicast configuration
	bcm_ether_set_page_reg(0x0, 0x21, 0x0);

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();
}

#define PORTMAP_CPU_PORT_BIT 0x20
#ifndef USE_BCM53115S
#define CHECK_CPU_PORT_NUMBER
#endif

void updateMacTable(struct group *entry)
{
	int lock_fd;
	unsigned char mac[6], lanmac[6];
	char wholestr[20];
#ifdef CHECK_CPU_PORT_NUMBER
	int temp[6], i;
#endif

	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);
	log(LOG_WARNING, 0,"updateMacTable : %s", wholestr);

	mac[5] = 0x01;
	mac[4] = 0x00;
	mac[3] = 0x5e;
	mac[2] = entry->a1;
	mac[1] = entry->a2;
	mac[0] = entry->a3;

	// multicast mac address updated in switch register
	lock_fd = lock_file("switch");

	if (entry->port_map)
	{
		unsigned int port_map;
		int port = -1;

		port_map = entry->port_map | PORTMAP_CPU_PORT_BIT ; // add CPU port
		if (igmp_router_port >= 0)
		{
			port_map |= ((1 << igmp_router_port));
			log(LOG_WARNING, 0,"updateMacTable : add router port : %08x", port_map);
		}

		printf("[%s] port map : %08x\n", wholestr, port_map);
#ifdef CHECK_CPU_PORT_NUMBER 
		// check CPU port number
		get_hwaddr_kernel(IF_LOCAL, wholestr);
		sscanf(wholestr, "%02x:%02x:%02x:%02x:%02x:%02x",
			&temp[5], &temp[4], &temp[3], &temp[2], &temp[1], &temp[0]);
		for (i=0;i<6;i++) lanmac[i] = (unsigned char)temp[i];

		bcm_read_address_entry(lanmac, atoi(IF_LAN_VIDX), &port);	
		printf("LAN MAC  %02x:%02x:%02x:%02x:%02x:%02x ==> port %d \n ",
			temp[5], temp[4], temp[3], temp[2], temp[1], temp[0], port);
#endif

		// add mcast address to ARL
		bcm_add_multicast_address(mac, port_map, atoi(IF_LAN_VIDX));

	}
	else
	{
		// del mcast address from ARL
		bcm_del_multicast_address(mac, atoi(IF_LAN_VIDX));
	}

	unlock_file(lock_fd);

}

static void create_all_hosts_rule(void)
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map       = 0x7f,
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

#define BCM_ARL_REG_PAGE       0x05


#ifdef USE_BCM53115S
#define BCM_ARL_SEARCH_CTL_REG           0x50
#define BCM_ARL_SEARCH_RSLT_0_MACVID_REG 0x60
#define BCM_ARL_SEARCH_RSLT_REG          0x68
#define BCM_ARL_SEARCH_RSLT_1_MACVID_REG 0x70
#define BCM_ARL_SEARCH_RSLT_1_REG        0x78

int get_switch_port_num(char *mac)
{
	int   port, lock_fd;
	char mstr[20];
	unsigned int reg, value, arl_value;
	unsigned char arl_entry[8];
	int rslt = 0; 

	// get port number from ARL
	lock_fd = lock_file("switch");

	port = -1;
	value = 0;

	bcm_ether_set_page_reg(BCM_ARL_REG_PAGE, BCM_ARL_SEARCH_CTL_REG, 0x80);
	while (1)
	{
		if (rslt == 0)	
			value = bcm_ether_get_page_reg(BCM_ARL_REG_PAGE, BCM_ARL_SEARCH_CTL_REG);

		if (!(value & 0x80)) break;

		if (value & 0x1)
		{
			reg = (rslt == 0) ? BCM_ARL_SEARCH_RSLT_0_MACVID_REG : BCM_ARL_SEARCH_RSLT_1_MACVID_REG;
			bcm_ether_get_arl_entry(BCM_ARL_REG_PAGE, reg, arl_entry);

			reg = (rslt == 0) ? BCM_ARL_SEARCH_RSLT_REG : BCM_ARL_SEARCH_RSLT_1_REG;
			arl_value = bcm_ether_get_page_reg(BCM_ARL_REG_PAGE, reg);

#if 0
			printf("(%08x) %02x %02x %02x %02x %02x %02x %02x %02x \n",
				 arl_value, arl_entry[7], arl_entry[6],
				 arl_entry[5], arl_entry[4], arl_entry[3],
				 arl_entry[2], arl_entry[1], arl_entry[0]);
#endif
			rslt = (rslt) ? 0 : 1;

			sprintf(mstr, "%02x%02x%02x%02x%02x%02x",
				 arl_entry[5], arl_entry[4], arl_entry[3],
				 arl_entry[2], arl_entry[1], arl_entry[0]);

			//if ((arl_value & (1 << 16)) == 0) continue; // invalid
			if (arl_entry[5]& 0x1)  // multicast address
				continue;

			if (strcasecmp(mac, mstr))
				continue;

			port = arl_value & 0xf;
			printf("[%s] port = %d \n", mstr, port);
			break;
		}
	}	

	unlock_file(lock_fd);

	return port;
}

#else
#define BCM_ARL_SEARCH_CTL_REG 0x20

int get_switch_port_num(char *mac)
{
	int   port, lock_fd;
	char mstr[20];
	unsigned int value;
	unsigned char arl_entry[8];

	// get port number from ARL
	lock_fd = lock_file("switch");

	port = -1;

	bcm_ether_set_page_reg(BCM_ARL_REG_PAGE, BCM_ARL_SEARCH_CTL_REG, 0x80);
	while (1)
	{
		value = bcm_ether_get_page_reg(BCM_ARL_REG_PAGE, BCM_ARL_SEARCH_CTL_REG);
		if (!(value & 0x80)) break;

		if (value & 0x1)
		{
			bcm_ether_get_arl_entry(BCM_ARL_REG_PAGE, 0x24, arl_entry);

			if ((arl_entry[7]& 0x80) == 0) continue; // invalid
			if (arl_entry[5]& 0x1)  // multicast address
				continue;
			sprintf(mstr, "%02x%02x%02x%02x%02x%02x",
				 arl_entry[5], arl_entry[4], arl_entry[3],
				 arl_entry[2], arl_entry[1], arl_entry[0]);

			if (strcasecmp(mac, mstr))
				continue;
			port = arl_entry[6]& 0xf;
			//fprintf(stderr, "[%s] port = %d \n", mstr, port);
			break;
		}
	}	

	unlock_file(lock_fd);

	return port;
}
#endif
