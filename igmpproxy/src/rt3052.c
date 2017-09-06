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
 *  By steping the IP address list, we can know the ports which the IGMP group is interesting in.
 *
 *  A mirror of rt3052 internal mac table is created in memory to increase performance. The time 
 *  interval of sync is 10 secs.
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

/* ioctl commands */
#define RAETH_ESW_REG_READ		0x89F1
#define RAETH_ESW_REG_WRITE		0x89F2

/* rt3052 embedded ethernet switch registers */
#define REG_ESW_PFC1     		0x14
#define REG_ESW_VLAN_ID_BASE		0x50
#define REG_ESW_VLAN_MEMB_BASE		0x70
#define REG_ESW_TABLE_SEARCH		0x24
#define REG_ESW_TABLE_STATUS0		0x28
#define REG_ESW_TABLE_STATUS1		0x2C
#define REG_ESW_TABLE_STATUS2		0x30
#define REG_ESW_WT_MAC_AD0		0x34
#define REG_ESW_WT_MAC_AD1		0x38
#define REG_ESW_WT_MAC_AD2		0x3C
#define REG_ESW_GLOBAL_CONTROL		0x9C
#define REG_ESW_MAX			0xFC

#ifdef USE_MT7628
#define WANPORT                 0x1                     /* 0000001 */

#define LAN_VLAN_IDX            0
#define WAN_VLAN_IDX            1
#endif

typedef struct rt3052_esw_reg {
	unsigned int off;
	unsigned int val;
} esw_reg;

static int esw_fd = -1;
static struct ifreq	ifr;
static esw_reg		reg;

static inline int reg_read(int offset, int *value);
static inline int reg_write(int offset, int value);
static void create_all_hosts_rule(void);
static void destory_all_hosts_rule();
void sync_internal_mac_table(void *argu);

struct mac_table internal_mac_table[1024];

extern int igmp_router_port;

#define READ	0
#define WRITE	1
void switch_init(void)
{
	unsigned int value;
	int lockfd;

	lockfd=lock_file("switch");

#ifdef USE_MT7628
        /* 1011009c */
        value = rareg(READMODE, 0x1011009c, 0);
        value = value & 0xE7FFFFFF;
        rareg(WRITEMODE, 0x1011009c, value);

        /* 10110014 */
        value = rareg(READMODE, 0x10110014, 0);
        value = value | 0x00800000;
        rareg(WRITEMODE, 0x10110014, value);
#endif
	esw_fd = socket(AF_INET, SOCK_DGRAM, 0);
	if (esw_fd < 0) {
		perror("socket");
		unlock_file(lockfd);
		exit(0);
	}

	strncpy(ifr.ifr_name, "eth2", 5);
	ifr.ifr_data = (char *)&reg;

	unlock_file(lockfd);

        /* Because aging timeout should be long enough than general query timer & specific query timer */
        system("/bin/switch reg w 9c 0x8a302"); /* Aging timeout : 10mins (previous: 5mins)*/

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
	sync_internal_mac_table(NULL);
}

void switch_fini(void)
{
	/*
	 *  handle RT3052 registers
	 */
	/* 1011009c */
	unsigned int value;
	int lockfd;

	lockfd=lock_file("switch");

#ifdef USE_MT7628
	/* 10110014 */
        value = rareg(READMODE, 0x10110014, 0);
        value = value & 0xFF7FFFFF;
        rareg(WRITEMODE, 0x10110014, value);
#endif

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();

	/* delete all mac tables */
	if(esw_fd >= 0) close(esw_fd);

	unlock_file(lockfd);
}


/*
 * ripped from user/rt2880/switch/switch.c
 */
#ifdef USE_MT7628
static inline wait_switch_done(void)
{
        int i, value;
        for (i = 0; i < 20; i++) {
                reg_read(REG_ESW_WT_MAC_AD0, &value);
                if (value & 0x2) {      //w_mac_done
                        //printf("done.\n");
                        break;
                }
                usleep(1000);
        }
        if (i == 20)
                log(LOG_WARNING, 0, "*** RT3052: timeout.");
}
void updateMacTable(struct group *entry, int delay_delete)
{
        int i, value;
        char wholestr[13];
        char tmpstr[9];

        sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);

        strncpy(tmpstr, wholestr, 8);
        tmpstr[8] = '\0';

        value = strtoul(tmpstr, NULL, 16);
        reg_write(REG_ESW_WT_MAC_AD2, value);
        strncpy(tmpstr, &wholestr[8], 4);
        tmpstr[4] = '\0';
        value = strtoul(tmpstr, NULL, 16);
        reg_write(REG_ESW_WT_MAC_AD1, value);

        value = 0;
        if(entry->port_map){
                /*
                 * force all mulicast addresses to bind with CPU.
                 */
                value = value | (0x1 << 18);

                /*
                 * fill the port map
                 */
                value = value | (entry->port_map & (0x7f)) << 12;
                value += (7 << 4); //w_age_field
                value += (LAN_VLAN_IDX << 7); //w_age_field
                value += 1;                             //w_mac_cmd
                reg_write(REG_ESW_WT_MAC_AD0, value);
                wait_switch_done();

                /*
                 * new an additional entry for IGMP Inquery/Report on WAN.
                 */
                if(WANPORT){
                        value = (WANPORT << 12);
                        value |= (1 << 18);
                        value |= (7 << 4);              //w_age_field
                        value |= (WAN_VLAN_IDX << 7);           //w_index
                        value |= 1;                             //w_mac_cmd
                        reg_write(REG_ESW_WT_MAC_AD0, value);
                        wait_switch_done();
                }
	}else{
                if(delay_delete == ZEROED){
                        /*
                         * Can't delete this entry too early.
                         *
                         * Because multicast packets from WAN may still come even receiver on LAN has left, and
                         * at the same time the kernel routing rule is not yet deleted by igmpproxy.
                         *
                         * If we delete mac entry earier than deleting routing rule (by igmpproxy),
                         * these packets would be forwarded to "br0" and then flood on eth2.1(vlan1) due to our
                         * default policy -- "Broadcast if not found". So we may see flooding packets on
                         * LAN until the kernel routing rule is deleted.
                         *
                         * So we keep the mac entry alive to avoid the our default policy until the igmp group
                         * is actually eliminated.
                         */

                        /*
                         * zero the entry
                         */
                        value |= (7 << 4);              //w_age_field, keep it alive
                        value |= 1;                             //w_mac_cmd
                        reg_write(REG_ESW_WT_MAC_AD0, value);
                        wait_switch_done();
                }else if (delay_delete == DELETED){
                        /*
                         * delete the entry
                         */
                        value |= 1;                             //w_mac_cmd
                        value |= (LAN_VLAN_IDX << 7); //w_age_field
                        reg_write(REG_ESW_WT_MAC_AD0, value);
                        wait_switch_done();

                        /*
                         * delete the additional entry on WAN.
                         */
                        value = 0;
                        value |= (WAN_VLAN_IDX  << 7);          //w_index
                        value |= 1;                             //w_mac_cmd
                        reg_write(REG_ESW_WT_MAC_AD0, value);
                        wait_switch_done();
                }
        }
}

#else
void updateMacTable(struct group *entry)
{
	int i, value, lockfd;
	char wholestr[13];
	char tmpstr[9];

	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);

	log(LOG_NOTICE, 0,"updateMacTable : %s", wholestr);

	strncpy(tmpstr, wholestr, 8);
	tmpstr[8] = '\0';

	lockfd=lock_file("switch");

	value = strtoul(tmpstr, NULL, 16);
	reg_write(REG_ESW_WT_MAC_AD2, value);
	strncpy(tmpstr, &wholestr[8], 4);
	tmpstr[4] = '\0';
	value = strtoul(tmpstr, NULL, 16);
	reg_write(REG_ESW_WT_MAC_AD1, value);

	value = 0;
	if(entry->port_map){
		/*
		 * force all mulicast addresses to bind with the MAC.
		 */
		value = value | (0x1 << 18);
		/*
		 * fill the port map
		 */
		value = value | (entry->port_map << 12);
		if (igmp_router_port >= 0)
		{
			value = value | ((1 << igmp_router_port) << 12);
			log(LOG_WARNING, 0,"updateMacTable : add router port : %08x", value);
		}
		value += (7 << 4); //w_age_field
	}

	value += 1;				//w_mac_cmd
	reg_write(REG_ESW_WT_MAC_AD0, value);

	for (i = 0; i < 20; i++) {
		reg_read(REG_ESW_WT_MAC_AD0, &value);
		if (value & 0x2) {	//w_mac_done
			//printf("done.\n");
			unlock_file(lockfd);
			return;
		}
		usleep(1000);
	}
	if (i == 20)
		log(LOG_WARNING, 0, "*** RT3052: timeout.");
	unlock_file(lockfd);
}
#endif

static void create_all_hosts_rule(void)
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map       = 0x5e,
                .next           = NULL
        };
#ifdef USE_MT7628
        updateMacTable(&entry, ZEROED);
#else
        updateMacTable(&entry);
#endif

#if 0
	/* IGMP V3 */
	entry.a1 = 0x00;
	entry.a2 = 0x00;
	entry.a3 = 0x16;
        entry.port_map = 0x01,
        updateMacTable(&entry);
#endif
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
#ifdef USE_MT7628
        updateMacTable(&entry, DELETED);
#else
        updateMacTable(&entry);
#endif

#if 0
	/* IGMP V3 */
	entry.a1 = 0x00;
	entry.a2 = 0x00;
	entry.a3 = 0x16;
        updateMacTable(&entry);
#endif
}


int get_switch_port_num(char *mac)
{
	unsigned int  mac1, mac2, i = 0, mac_iter;
	char mac_entry1[16], mac_entry2[16];

	i = 0;	
	memset(mac_entry1, 0, 16);
	memset(mac_entry2, 0, 16);


	strncpy(mac_entry1, mac, 8);
	strncpy(mac_entry2, &mac[8], 4);
#ifdef USE_MT7628
	mac1 = strtoul(mac_entry1, 0, 16);
	mac2 = strtoul(mac_entry2, 0, 16);
#else
	mac1 = string_to_hexa(mac_entry1);
	mac2 = (string_to_hexa(mac_entry2) >> 16) & 0xffff;
#endif
	//printf("Target mac : %s (%s, %s) (%08x)\n", mac, mac_entry1, mac_entry2, string_to_hexa(mac_entry1));

	mac_iter = internal_mac_table[i].mac1;
	while(i < 0x3fe && mac_iter != END_OF_MAC_TABLE) {
#ifdef USE_MT7628
		if(internal_mac_table[i].vidx != LAN_VLAN_IDX)
			goto next_entry;
#endif
		if(	internal_mac_table[i].mac1 == mac1 &&
			internal_mac_table[i].mac2 == mac2){
			switch( internal_mac_table[i].port_map ){
			case 0x1:
				return 0;	// WAN port
			case 0x2:
				return 1;
			case 0x4:
				return 2;
			case 0x8:
				return 3;
			case 0x10:
				return 4;
			default:
				log(LOG_WARNING, 0, "No/Multi ports found");
				return -1;
			}
		}
next_entry:
		i++;
		mac_iter = internal_mac_table[i].mac1;
	}

	printf("no mac entry \n");
	return -1;
}

#define INTERNAL_SYNC_TIMEOUT		10	// secs
/*
 *	The cpu overhead of this function is low.
 */
void sync_internal_mac_table(void *argu)
{
	unsigned int value, mac1, mac2, i = 0;
	int lockfd;

#ifndef USE_MT7628
	timer_setTimer(INTERNAL_SYNC_TIMEOUT, sync_internal_mac_table, NULL);
#endif

	lockfd=lock_file("switch");

	reg_write(REG_ESW_TABLE_SEARCH, 0x1);
	while( i < 0x3fe) {
		reg_read(REG_ESW_TABLE_STATUS0, &value);
		if (value & 0x1) { //search_rdy
			if ((value & 0x70) == 0) {
				log(LOG_WARNING, 0, "*** RT3052: found an unused entry (age = 3'b000), please check!");
				reg_write(REG_ESW_TABLE_SEARCH, 0x2); //search for next address
				continue;
			}
#ifdef USE_MT7628
			internal_mac_table[i].vidx = (value >> 7) & 0xf;
#endif
			// read mac1
			reg_read(REG_ESW_TABLE_STATUS2, &(internal_mac_table[i].mac1));
			// read mac2
			reg_read(REG_ESW_TABLE_STATUS1, &mac2);
			internal_mac_table[i].mac2 = (mac2 & 0xffff);

			internal_mac_table[i].port_map = (value & 0x0007f000) >> 12 ;

			if (value & 0x2) {
				log(LOG_WARNING, 0, "*** RT3052: end of table. %d", i);
				internal_mac_table[i+1].mac1 = END_OF_MAC_TABLE;
				unlock_file(lockfd);
				return;
			}
			reg_write(REG_ESW_TABLE_SEARCH, 0x2); //search for next address
			i++;
		}else if (value & 0x2) { //at_table_end
			//log(LOG_WARNING, 0, "*** RT3052: found the last entry (not ready). %d", i);
			internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
			unlock_file(lockfd);
			return;
		}else
			usleep(2000);
	}

	unlock_file(lockfd);
	internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
	return;
}

static inline int reg_read(int offset, int *value)
{
    reg.off = offset;
    if (-1 == ioctl(esw_fd, RAETH_ESW_REG_READ, &ifr)) {
        perror("ioctl");
        close(esw_fd);
        exit(0);
    }
    *value = reg.val;
    return 0;
}

static inline int reg_write(int offset, int value)
{
    reg.off = offset;
    reg.val = value;
    if (-1 == ioctl(esw_fd, RAETH_ESW_REG_WRITE, &ifr)) {
        perror("ioctl");
        close(esw_fd);
        exit(0);
    }
    return 0;
}


