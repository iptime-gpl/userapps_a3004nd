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

static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();
extern int set_hw_igmp(int flag);

struct mac_table internal_mac_table[1024];


void switch_init(void)
{
	// initialize multicast configuration
	set_hw_igmp(1);

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
}

void switch_fini(void)
{
	// Clear multicast configuration
	set_hw_igmp(0);

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();
}

void updateMacTable(struct group *entry)
{
	unsigned char mac[6];
	char wholestr[13];

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
		// update switch address table
	}
	else
	{
		// clear switch address table
	}

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
	return 1;
}

