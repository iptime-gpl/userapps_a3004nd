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
	char cmd[256];

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
		port_map = entry->port_map | (1 << 8);

		if (igmp_router_port >= 0)
                {
                        port_map |= ((1 << igmp_router_port));
                }
		memset(cmd, 0x0, sizeof(char) * 256);
		sprintf(cmd, "echo \"madd 0x%x 0x%x 0x%x 0x%x 0x%x 0x%x 0x%x\" > /proc/fdbmanage"
			, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], port_map);
		system(cmd);
        }
        else /*remove mcast*/
        {
                port_map = 0;

		memset(cmd, 0x0, sizeof(char) * 256);
		sprintf(cmd, "echo \"mdel 0x%x 0x%x 0x%x 0x%x 0x%x 0x%x\" > /proc/fdbmanage"
			, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
		system(cmd);
        }

        unlock_file(lockfd);
}

int get_switch_port_num(char *mac)
{
	int lockfd, result = 0;
	unsigned char mac_temp[6];
	char cmd[256];
	FILE *fp;

	strtomac(mac, mac_temp);

	lockfd=lock_file("switch");

	memset(cmd, 0x0, sizeof(char) * 256);
	sprintf(cmd, "echo \"uget 0x%x 0x%x 0x%x 0x%x 0x%x 0x%x\" > /proc/fdbmanage"
		, mac_temp[0], mac_temp[1], mac_temp[2], mac_temp[3], mac_temp[4], mac_temp[5]);
	system(cmd);

	if((fp = fopen("/proc/fdbmanage", "r+")) != NULL)
	{
		memset(cmd, 0x0, sizeof(char) * 256);
		fgets(cmd, 255, fp);
		if(strcmp(cmd, "ERROR"))
			result = atoi(cmd);
		fclose(fp);
	}

	unlock_file(lockfd);

	return result;
}
