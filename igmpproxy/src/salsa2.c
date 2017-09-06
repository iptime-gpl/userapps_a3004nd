#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <net/if.h>

#include <salsa2.h>

#define DUPLICATED_TYPE	1
#define USE_LINUX_IN_H
#include "defs.h"

extern int lock_file(char *lockfile);
extern int unlock_file(int fd);
extern int strtomac( char *macstr , unsigned char *mac);

static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();


#define MAX_MGROUP		64
#define MGROUP_BASE_INDEX	256
struct mgroup_table_s {
	unsigned char mac[6];
	unsigned int portmap;
}; 

struct mgroup_table_s mgroup_table[MAX_MGROUP];

extern int igmp_router_port;

void switch_init(void)
{
	int lockfd=lock_file("switch");

	memset((char *)mgroup_table, 0x0, sizeof(struct mgroup_table_s) * MAX_MGROUP);

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */

	unlock_file(lockfd);

	create_all_hosts_rule();
}

void switch_fini(void)
{
	unsigned short midx;
	int lockfd=lock_file("switch");

	for (midx = 0; midx < MAX_MGROUP; midx++)
	{
		if (mgroup_table[midx].portmap)
		{
			mv_salsa2_regist_mac(mgroup_table[midx].mac, (MGROUP_BASE_INDEX+midx)|0x80, 1);
			mv_salsa2_write_register(SALSA2_MULTICAST_GROUP_REG+SALSA2_MULTICAST_GROUP_STEP*midx, 0);
		}
	}

	unlock_file(lockfd);

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();
}

static short get_mgroup_index(unsigned char *mac)
{
	short i, idx;

	idx = -1;
	for(i = 0; i < MAX_MGROUP; i++)
	{
		if (memcmp(mgroup_table[i].mac, mac, 6) == 0)
			return i;
		if ((mgroup_table[i].portmap == 0) && (idx == -1))
			idx = i;
	} 

	return idx;
}


void updateMacTable(struct group *entry)
{
	unsigned char mac[6];
	unsigned int port_map;
	char wholestr[13];
	short midx; 
	unsigned int reg = 0;
	int lockfd;

	lockfd=lock_file("switch");
	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);
	log(LOG_NOTICE, 0,"updateMacTable : %s, %08x", wholestr, entry->port_map);

	mac[0] = 0x01;
	mac[1] = 0x00;
	mac[2] = 0x5e;
	mac[3] = entry->a1;
	mac[4] = entry->a2;
	mac[5] = entry->a3;

	midx = get_mgroup_index(mac);
	if (midx != -1)
		reg = SALSA2_MULTICAST_GROUP_REG + (SALSA2_MULTICAST_GROUP_STEP*midx);

	// multicast mac address updated in switch register

	if (entry->port_map)
	{
		port_map = (entry->port_map << 1); // | 0x1; // cpu port (0x1)

		if (igmp_router_port >= 0)
		{
			port_map |= ((1 << igmp_router_port));
			log(LOG_WARNING, 0,"updateMacTable : add router port : %08x", port_map);
		}
		if (midx != -1)
		{
			memcpy(mgroup_table[midx].mac, mac, 6);
			mgroup_table[midx].portmap = port_map;
			mv_salsa2_regist_mac(mac, MGROUP_BASE_INDEX+midx, 1);
			mv_salsa2_write_register(reg, port_map);

			//syslog_msg(0,"%s, portmap=%x, midx=%d(%d), reg=%x\n", wholestr, port_map, MGROUP_BASE_INDEX+midx, midx, reg);
		}
		log(LOG_DEBUG,0,"port map : %08x\n", port_map);
	}
	else
	{
		port_map = 0;

		if (midx != -1)
		{
			memset(mgroup_table[midx].mac, 0x0, 6);
			mgroup_table[midx].portmap = port_map;
			// remove address flag : 0x8000 
			mv_salsa2_regist_mac(mac, (MGROUP_BASE_INDEX+midx)|0x8000, 1);
			mv_salsa2_write_register(reg, port_map);
		}	
	}

	unlock_file(lockfd);
}

static void create_all_hosts_rule(void)
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map       = 0x1ffffff,
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

extern int get_bridge_portnum_of_mac(char *mac);
int get_switch_port_num(char *mac)
{
	return (get_bridge_portnum_of_mac(mac)-1);
}

