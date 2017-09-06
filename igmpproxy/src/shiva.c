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

extern int igmp_router_port;

void switch_init(void)
{
	int age_time = 600;
	int lockfd=lock_file("switch");

	control_qca_router_port_set((0x1 << 5)); /*router port 5 , cpu port 0*/
	control_qca_age_timer(&age_time);	/*age time 600 second (10 minute)*/
	control_qca_igmp_port_enable(1);	/*igmp snooping (igmp mode) enable at port 1~4*/
	control_qca_igmp_port_enable(2);
	control_qca_igmp_port_enable(3);
	control_qca_igmp_port_enable(4);

        unlock_file(lockfd);
}

void switch_fini(void)
{
}

void updateMacTable(struct group *entry)
{
	unsigned char mac[6];
        unsigned int port_map;
        char wholestr[13];
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

        // multicast mac address updated in switch register

        if (entry->port_map) /*add mcast*/
        {
		//port_map = entry->port_map | (1 << 0); // add CPU port
		port_map = entry->port_map;

		if (igmp_router_port >= 0)
                {
                        port_map |= ((1 << igmp_router_port));
                }

		//fprintf(stderr, "add mcast [port_map]%x [add]%x\n", port_map, control_qca_fdb_add(mac, port_map));
		control_qca_fdb_add(mac, port_map);
        }
        else /*remove mcast*/
        {
                port_map = 0;

		//fprintf(stderr, "del mcast [port_map]%x [del]%x\n", port_map, control_qca_fdb_del(mac, port_map));
		control_qca_fdb_del(mac, port_map);
        }

        unlock_file(lockfd);
}

int get_switch_port_num(char *mac)
{
	int lockfd, retval = 0, result = 0;
	unsigned char mac_temp[6];

	//fprintf(stderr, "mac : [%s]\n",mac);
	strtomac(mac, mac_temp);

	lockfd=lock_file("switch");

	//fprintf(stderr, "mac : [%02x:%02x:%02x:%02x:%02x:%02X]\n",mac_temp[0],mac_temp[1],mac_temp[2],mac_temp[3],mac_temp[4],mac_temp[5]);
	retval = control_qca_fdb_find(mac_temp);

	switch(retval){
		case 0x2:
			result = 1;	break;
		case 0x4:
			result = 2;	break;
		case 0x8:
			result = 3;	break;
		case 0x10:
			result = 4;	break;
		case 0x20:
			result = 5;	break;
		default:
			result = 0;	break;
	}
	//fprintf(stderr, "switch port num [port_num]%d [result]%x\n",result, retval);

	unlock_file(lockfd);

	return result;
}
