/*
 *  This implementation is for rtGSW Switch.
 */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <sys/socket.h>

#include "defs.h"
//#include "ralink.h"

#include "ra_ioctl.h"			/*new switch address define*/

#define END_OF_MAC_TABLE		0xFFFFFFFF

/* GSW embedded ethernet switch registers */
#define REG_ESW_VLAN_MEMB_BASE		0x70
#define REG_ESW_TABLE_SEARCH		0x24
#define REG_ESW_TABLE_STATUS0		0x28
#define REG_ESW_TABLE_STATUS1		0x2C
#define REG_ESW_TABLE_STATUS2		0x30
#define REG_ESW_WT_MAC_AD0		0x34
#define REG_ESW_WT_MAC_AD1		0x38
#define REG_ESW_WT_MAC_AD2		0x3C

#define LAN_VLAN_ID		1
#define WAN_VLAN_ID		2

#ifdef USE_MT7621
//#define CONFIG_WAN_AT_P0	1
#elif defined(USE_MT7623)
#define CONFIG_WAN_AT_P4	1
#endif

#if defined (CONFIG_WAN_AT_P0)
#define WANPORT                 0x1             /* 0000001 */
#define LANPORT_RANGE           {1,2,3,4}
#elif defined (CONFIG_WAN_AT_P4)
#define WANPORT                 0x10            /* 0010000 */
#define LANPORT_RANGE           {0,1,2,3}
#else
#define WANPORT                 0x0             /* no wan port */
#define LANPORT_RANGE           {0,1,2,3,4}
#endif


// function prototype
static inline int reg_read(int offset, unsigned int *value);
static inline int reg_write(int offset, unsigned int value);

// global variables.
static struct mac_table 	internal_mac_table[2048];
static int 			esw_fd = -1;
static struct ifreq		ifr;
static esw_reg			reg;
#if defined(USE_MT7621) || defined(USE_MT7623)
ra_mii_ioctl_data mii;
#endif

void dump_table(void)
{
	int i=0;
	unsigned int mac1;
	char show_buf[128];
//	mac1 = internal_mac_table[i].mac1;
//	while( i< 2048 && mac1 != END_OF_MAC_TABLE){
	while (i < 2048){
		mac1 = internal_mac_table[i].mac1;
		if (mac1 != END_OF_MAC_TABLE){
			sprintf(show_buf, "%08x%04x, %08x %08x,\n", internal_mac_table[i].mac1, internal_mac_table[i].mac2, internal_mac_table[i].port_map, internal_mac_table[i].vid);
			printf("%s\n", show_buf);
			i++;
//			mac1 = internal_mac_table[i].mac1;
		}else
			return;
	}
}

static void create_all_hosts_rule(void)
{
        struct group entry      = {
                .a1 = 0x00,
                .a2 = 0x00,
                .a3 = 0x01,
                .port_map = (0x5f & ~(WANPORT)),        /* All LAN ports */
                .next           = NULL
        };
        updateMacTable(&entry, ZEROED);
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
        updateMacTable(&entry, DELETED);
}

void sync_internal_mac_table(void *argu)
{
	unsigned int value, value1, mac2, i = 0;

	reg_write(REG_ESW_WT_MAC_ATC, 0x8004);
	usleep(5000);
	while( i < 0x7fe) {
		reg_read(REG_ESW_WT_MAC_ATC, &value);
		if ((value & (0x1 << 13)) && (((value >> 15) &0x1) == 0)) { //search_rdy and Address Table is not busy
			reg_read(REG_ESW_TABLE_ATRD, &value1);
			if ((value1 & 0xff000000) == 0) {
				log(LOG_WARNING, 0, "*** rtGSW: found an unused entry (age = 3'b000), please check!");
			        reg_write(REG_ESW_WT_MAC_ATC, 0x8005); //search for next address
				continue;
			}

			// read mac1
			reg_read(REG_ESW_TABLE_TSRA1, &(internal_mac_table[i].mac1));

			// read mac2
			reg_read(REG_ESW_TABLE_TSRA2, &mac2);
			internal_mac_table[i].mac2 = (mac2 >> 16);
			internal_mac_table[i].vid = (mac2 & 0xfff);  //vid
			//reg_read(REG_ESW_TABLE_ATRD, &value1);
			internal_mac_table[i].port_map = (value1 & 0x0007f0) >> 4 ;

			if (value & 0x4000) {
				log(LOG_WARNING, 0, "*** rtGSW: end of table. %d", i);
				printf("sync table at_table_end 1\n\r");
				internal_mac_table[i+1].mac1 = END_OF_MAC_TABLE;
				return;
			}
			reg_write(REG_ESW_WT_MAC_ATC, 0x8005); //search for next address
			usleep(5000);
			i++;
		}else if (value & 0x4000) { //at_table_end
			//log(LOG_WARNING, 0, "*** rtGSW: found the last entry (not ready). %d", i);
			printf("sync table at_table_end\n\r");
			internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
			return;
		}else
			usleep(5000);
			//usleep(1000);
	}
	internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
	return;
}

extern unsigned int rareg(int mode, unsigned int addr, long long int new_value);

void switch_fini(void)
{
#if !defined(USE_MT7621) && !defined(USE_MT7623)
	unsigned int value;

	/*IGMP forward to cpu*/
	/* 10110014 */
	value = rareg(READMODE, 0x1011001c, 0);
	value = value & 0xffff9ff9;
	rareg(WRITEMODE, 0x1011001c, value);

#endif

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();

	/*      delete all mac tables */
	remove_all_groups();

	if(esw_fd >= 0)
		close(esw_fd);
}

void switch_init(void)
{
#if !defined(USE_MT7621) && !defined(USE_MT7623)
#error
	unsigned int value;

	/* to check default IGMP flooding rule*/
	/*IGMP report forward to cpu/query: default policy*/
	/* 10110014 */
	value = rareg(READMODE, 0x1011001c, 0);
	value = value | 0x00006000;
	rareg(WRITEMODE, 0x1011001c, value);

#endif


#if defined(USE_MT7621) || defined(USE_MT7623)
	/* Because aging timeout should be long enough than general query timer & specific query timer */
	system("/bin/switch reg w a0 0x95003"); /* Aging timeout : 10mins */
#endif
	esw_fd = socket(AF_INET, SOCK_DGRAM, 0);
	if (esw_fd < 0) {
		perror("socket");
		exit(-1);
	}

	strncpy(ifr.ifr_name, "eth2", 5);
	ifr.ifr_data = (char *)&reg;

	 /* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();

	sync_internal_mac_table(NULL);
}

#if defined(USE_MT7621) || defined(USE_MT7623)
int reg_read(int offset, unsigned int *value)
{
	strncpy(ifr.ifr_name, "eth2", 5);
	ifr.ifr_data = &mii;

	mii.phy_id = 0x1f;
	mii.reg_num = offset;

	if (-1 == ioctl(esw_fd, RAETH_MII_READ, &ifr)) {
		perror("ioctl");
		close(esw_fd);
		exit(0);
	}
	*value = mii.val_out;
	return 0;
}

int reg_write(int offset, unsigned int value)
{
	strncpy(ifr.ifr_name, "eth2", 5);
	ifr.ifr_data = &mii;

	mii.phy_id = 0x1f;
	mii.reg_num = offset;
	mii.val_in = value;

	if (-1 == ioctl(esw_fd, RAETH_MII_WRITE, &ifr)) {
		perror("ioctl");
		close(esw_fd);
		exit(0);
	}
	return 0;
}
#else
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
#endif /* CONFIG_RALINK_MT7621 */

static inline void wait_switch_done(void)
{
	unsigned int i, value;

	for (i = 0; i < 20; i++) {
	    reg_read(REG_ESW_WT_MAC_ATC, &value);
	    if ((value & 0x8000) == 0 ){ //mac address busy
		printf("mac table IO done.\n");
		break;
	    }
	    usleep(1000);
	}
	if (i == 20)
		//log(LOG_WARNING, 0, "*** rtGSW: timeout.");
		syslog_msg(LOG_WARNING, 0, "*** rtGSW: MAC Table IO timeout.");
}

void updateMacTable(struct group *entry, int delay_delete)
{
	int value = 0, value1 = 0;
	char wholestr[13];
	char tmpstr[9];

        //printf("updateMacTable: delay_delete is %d\n\r", delay_delete);
	sprintf(wholestr, "%s%02x%02x%02x", "01005e", entry->a1, entry->a2, entry->a3);

	strncpy(tmpstr, wholestr, 8);
	tmpstr[8] = '\0';

	value = strtoul(tmpstr, NULL, 16);
	
	reg_write(REG_ESW_WT_MAC_ATA1, value);
	printf("REG_ESW_WT_MAC_ATA1 is 0x%x\n\r",value);


	strncpy(tmpstr, &wholestr[8], 4);
	tmpstr[4] = '\0';

	value = strtoul(tmpstr, NULL, 16);
	value = (value << 16);
	value |= (1 << 15);//IVL=1

#if defined(USE_MT7621) || defined(USE_MT7623)
	value |= ((LAN_VLAN_ID) << 0); //LAN ID ==1
#elif defined (CONFIG_P5_RGMII_TO_MT7530_MODE)

#else
	value |= ((LAN_VLAN_ID) << 0); //LAN ID ==1
#endif	
	reg_write(REG_ESW_WT_MAC_ATA2, value);
	printf("REG_ESW_WT_MAC_ATA2 is 0x%x\n\r",value);
	value1 = value; //save for later usage        

	value = 0;
	if(entry->port_map || delay_delete == ZEROED){
		/*
		 * force all mulicast addresses to bind with CPU.
		 */
		value |= (0x1 << 10);//port 6 cpu port
		/*
		 * fill the port map
		 */
		printf("entry->port_map is 0x%x\n\r", entry->port_map);
		value |= (entry->port_map & (0x7f)) << 4;

                value |= (0xff << 24); //w_age_field
		value |= (0x3<< 2); //static

		reg_write(REG_ESW_WT_MAC_ATWD, value);
		value = 0x8001;  //w_mac_cmd
	        reg_write(REG_ESW_WT_MAC_ATC, value);

		wait_switch_done();

		/*
		 * new an additional entry for IGMP Inquery/Report on WAN.
		 */
		if(WANPORT){
		        value = value1;
			value = (value & 0xffffff00);
			value |= ((WAN_VLAN_ID) << 0); //WAN ID ==2
	
			reg_write(REG_ESW_WT_MAC_ATA2, value);
			printf("WAN REG_ESW_WT_MAC_ATA2 is 0x%x\n\r",value);

			value1 = (WANPORT << 4);
#if defined(USE_MT7621) || defined(USE_MT7623) // 2017-03-16
			value1 |= (0x1 << 9);//port 5 cpu port
#else
			value1 |= (0x1 << 10);//port 6 cpu port
#endif

			value1 |= (0xff << 24); //w_age_field
			value1 |= (0x3<< 2); //static

			reg_write(REG_ESW_WT_MAC_ATWD, value1);

			value1 = 0x8001;  //w_mac_cmd
			reg_write(REG_ESW_WT_MAC_ATC, value1);

			wait_switch_done();
			printf("for wan port is done\n\r");
		}
	}else{
#ifndef USE_MT7623 // 2017-03-16
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
			 * zero the bitmap entry
			 */

			value = (0xff << 24); //w_age_field
			value |= (0x3<< 2); //static
			reg_write(REG_ESW_WT_MAC_ATWD, value);
			printf("delay delete = zer0 REG_ESW_WT_MAC_ATWD is 0x%x\n\r",value);
			  
			value = 0x8001;  //w_mac_cmd
			reg_write(REG_ESW_WT_MAC_ATC, value);
			wait_switch_done();
		}else if (delay_delete == DELETED)
#endif
		{
			/*
			 * delete the entry
			 */
			value = 0; //STATUS=0, delete mac
			reg_write(REG_ESW_WT_MAC_ATWD, value);

			value = 0x8001;  //w_mac_cmd
			reg_write(REG_ESW_WT_MAC_ATC, value);
			wait_switch_done();

			/*
			 * delete the additional entry on WAN.
			 */
			if(WANPORT)
			{
				value = value1;
				value = (value & 0xffffff00);
				value |= (2 << 0); //WAN ID ==2
                                
				reg_write(REG_ESW_WT_MAC_ATA2, value);
				printf("REG_ESW_WT_MAC_ATA2 is 0x%x\n\r",value);
                                
				value = 0; //STATUS=0, delete mac
				reg_write(REG_ESW_WT_MAC_ATWD, value);
                                
				value = 0x8001;  //w_mac_cmd
				reg_write(REG_ESW_WT_MAC_ATC, value);
				wait_switch_done();
			}
		}
	}
}

int get_switch_port_num(char *mac)
{
	unsigned long long int  mac1, mac2;
	unsigned int i = 0, mac_iter;
	char mac_entry1[16], mac_entry2[16];

	memset(mac_entry1, 0, sizeof(mac_entry1));
	memset(mac_entry2, 0, sizeof(mac_entry2));

	/* 11223344 5566 */
	strncpy(mac_entry1, mac, 8);
	strncpy(mac_entry2, &mac[8], 4);
	mac1 = strtoll(mac_entry1, 0, 16);
	mac2 = strtol(mac_entry2, 0, 16);

	mac_iter = internal_mac_table[i].mac1;
	while(i < 0x7fe && mac_iter != END_OF_MAC_TABLE) {
		if(internal_mac_table[i].vid != LAN_VLAN_ID)
			goto next_entry;
		if(	internal_mac_table[i].mac1 == mac1 &&
			internal_mac_table[i].mac2 == mac2){
			switch( internal_mac_table[i].port_map ){
			case 0x1:
				return 0;
			case 0x2:
				return 1;
			case 0x4:
				return 2;
			case 0x8:
				return 3;
			case 0x10:
				return 4;
			case 0x40:	/* CPU Only */
				break;
			default:
				log(LOG_WARNING, 0, "No/Multi ports found:%x", internal_mac_table[i].port_map);
				return -1;
			}
		}
next_entry:
		i++;
		mac_iter = internal_mac_table[i].mac1;
	}

	return -1;
}
