#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <sys/socket.h>

//#include "linux/autoconf.h"

#include "defs.h"

#define _LINUX_IF_H
#include <linux/wireless.h>

/*new switch address define*/
#include "ra_ioctl.h"

#define MAX_MULTICASTS_GROUP		256
#define INTERNAL_SYNC_TIMEOUT		10		// secs

#define END_OF_MAC_TABLE			0xFFFFFFFF

/* ioctl commands */
#define RAETH_ESW_REG_READ			0x89F1
#define RAETH_ESW_REG_WRITE			0x89F2

#if 0
/* GSW embedded ethernet switch registers */
#define REG_ESW_VLAN_ID_BASE		0x50
#define REG_ESW_VLAN_MEMB_BASE		0x70
#define REG_ESW_TABLE_SEARCH		0x24
#define REG_ESW_TABLE_STATUS0		0x28
#define REG_ESW_TABLE_STATUS1		0x2C
#define REG_ESW_TABLE_STATUS2		0x30
#define REG_ESW_WT_MAC_AD0			0x34
#define REG_ESW_WT_MAC_AD1			0x38
#define REG_ESW_WT_MAC_AD2			0x3C
#define REG_ESW_MAX				0xFC
#endif


#define IP_GET_LOST_MAPPING(mip)    ((mip & 0x0F800000) >> 23) 
#define IP_MULTICAST_A0(a0)			((a0 >> 1) | 0xE0)
#define IP_MULTICAST_A1(a0, a1)		(((a0 & 0x1) << 7) | a1)

#if defined (CONFIG_WAN_AT_P0)
#define WANPORT			0x1			/* 0000001 */
#define LANPORT_RANGE		{1,2,3,4}
#elif defined (CONFIG_WAN_AT_P4)
#define WANPORT			0x10		/* 0010000 */
#define LANPORT_RANGE		{0,1,2,3}
#else
#define WANPORT			0x0			/* no wan port */
#define LANPORT_RANGE		{0,1,2,3,4}
#endif

#define OTHER_INTERFACE				7		/* port 7  (wifi)  */

#define ADDENTRY		1
#define DELENTRY		2

#ifdef CONFIG_RAETH_SPECIAL_TAG
#define LAN_VLAN_IDX              6
#define WAN_VLAN_IDX              7
#else
#define LAN_VLAN_IDX              0
#define WAN_VLAN_IDX              1
#endif



// function prototype
void updateMacTable(struct group *entry, int delay_deleted);
static inline int reg_read(int offset, int *value);
static inline int reg_write(int offset, int value);

// global variables.
static struct mac_table internal_mac_table[2048];
static int esw_fd = -1;

static struct ifreq		ifr;
static esw_reg			reg;
#ifdef USE_MT7530_SWITCH
ra_mii_ioctl_data mii;
#endif
static int			snooping_enabled = 0;

extern unsigned int rareg(int mode, unsigned int addr, long long int new_value);

#if 0
static struct group_member *lookup_ip_group(struct group *entry, uint32 m_ip_addr)
{
	struct group_member *pos = entry->members;
	while(pos){
		unsigned char a0 = IP_GET_LOST_MAPPING(m_ip_addr);
		if(pos->a0 == a0)
			return pos;
		pos = pos->next;
	}
	return NULL;
} 
#endif

#if 0
void remove_multicast_ip(uint32 m_ip_addr)
{
	unsigned char a0;
	unsigned char new_portmap = 0;
	struct group *entry = find_entry(m_ip_addr);
	struct group *group_pos = group_list;

	int delete_found = 0;
	struct group_member *mem_pos, *tmp;

	if(!snooping_enabled)
		return;

#ifdef WIFI_IGMPSNOOP_SUPPORT
	{
	char cmd[128];
	sprintf(cmd, "iwpriv ra0 set IgmpDel=%s", inetFmt(htonl(m_ip_addr), s1));
	system(cmd);
	}
#endif

	if(!entry){
		// This entry isn't in the list.
		log(LOG_WARNING, 0, "*** rtGSW: can't find group entry [%s].", inetFmt(htonl(m_ip_addr), s1));
		return;
	}

	a0 = IP_GET_LOST_MAPPING(m_ip_addr);

	while(entry->members && entry->members->a0 == a0){
		tmp = entry->members->next;
		free(entry->members);
		entry->members = tmp;
		delete_found = 1;
	}

	mem_pos = entry->members;
	while(mem_pos){
		if(mem_pos->next && mem_pos->next->a0 == a0){
			mem_pos->next = mem_pos->next->next;
			free(mem_pos->next);
			delete_found = 1;
		}else
			new_portmap = new_portmap | (0x1 << mem_pos->port_num);
		mem_pos = mem_pos->next;
	}

	if(delete_found){
		log(LOG_WARNING, 0, "*** RT3052: group entry [%s] found undeleted member.", inetFmt(htonl(m_ip_addr), s1));
	}

	if(entry->members == NULL || new_portmap == 0){
		entry->port_map = 0;

		/* remove from group_list */
		if(group_list == entry){
			group_list = entry->next;
		}else{
			int found = 0;
			while(group_pos->next){
				if(group_pos->next == entry){
					group_pos->next = entry->next;
					found = 1;
					break;
				}
				group_pos = group_pos->next;
			}
			if(!found){
				// impossible
		log(LOG_WARNING, 0, "*** rtGSW: can't find grou entry [%s].", inetFmt(htonl(m_ip_addr), s1));
		return;
	}
		}

#ifndef CONFIG_RAETH_SPECIAL_TAG
		updateMacTable(entry, DELETED);
#endif
		// free myself
		free(entry);
	}else if(entry->port_map != new_portmap){
		entry->port_map = new_portmap;
		update_group_port_map(entry);
	}

	return;
}
#endif


static void create_all_hosts_rule(void)
{
	struct group entry	= {
		.a1 = 0x00,
		.a2 = 0x00,
		.a3 = 0x01,
		.port_map = (0x5f & ~(WANPORT)),	/* All LAN ports */
		.next 		= NULL
	};
	updateMacTable(&entry, ZEROED);
}

static void destory_all_hosts_rule()
{
	struct group entry	= {
		.a1 = 0x00,
		.a2 = 0x00,
		.a3 = 0x01,
		.port_map = 0x0,
		.next = NULL
	};
	updateMacTable(&entry, DELETED);
}

/*
 *	The cpu overhead of this function is low.
 */
void sync_internal_mac_table(void *argu)
{
	unsigned int value, value1, mac2, i = 0;
	int noop = 0;

	printf("!sync table\n\r");
	reg_write(REG_ESW_WT_MAC_ATC, 0x8004);
	while( i < 0x7fe) {
	//while( i < 0x3fe) {
		reg_read(REG_ESW_WT_MAC_ATC, &value);
		if (value & (0x1 << 13)) { //search_rdy
			reg_read(REG_ESW_TABLE_ATRD, &value1);
			if ((value1 & 0xff000000) == 0) {
				log(LOG_WARNING, 0, "*** rtGSW: found an unused entry (age = 3'b000), please check!");
				reg_write(REG_ESW_TABLE_SEARCH, 0x2); //search for next address

				if (++noop > 0x10)
				{
					internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
					printf("*** rtGSW: found an unused entry (age = 3'b000), please check! \n");
					return;
				}
				printf("*** rtGSW: please check! \n");
				//system("/bin/switch dump");
				continue;
			}

			internal_mac_table[i].vidx = (value >> 7) & 0xf;
			// read mac1
			reg_read(REG_ESW_TABLE_TSRA1, &(internal_mac_table[i].mac1));

			// read mac2
			reg_read(REG_ESW_TABLE_TSRA2, &mac2);
			internal_mac_table[i].mac2 = (mac2 >> 16);

			//reg_read(REG_ESW_TABLE_ATRD, &value1);
			internal_mac_table[i].port_map = (value1 & 0x0007f0) >> 4 ;

			if (value & 0x4000) {
				log(LOG_WARNING, 0, "*** rtGSW: end of table. %d", i);
				printf("sync table at_table_end 1\n\r");
				internal_mac_table[i+1].mac1 = END_OF_MAC_TABLE;
				return;
			}
			reg_write(REG_ESW_WT_MAC_ATC, 0x8005); //search for next address
			i++;
			noop = 0;
		}else if (value & 0x4000) { //at_table_end
			//log(LOG_WARNING, 0, "*** rtGSW: found the last entry (not ready). %d", i);
			printf("sync table at_table_end\n\r");
			internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
			return;
		}else
		{
			if (++noop > 0x10)
			{
				internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
				printf("sync_internal_mac_table() no search hit.. (idx : %08x)\n", i);
				return;
			}
			usleep(2000);
			//usleep(1000);
		}
	}

	printf("sync table OK\n\r");
	internal_mac_table[i].mac1 = END_OF_MAC_TABLE;
	return;
}

#define READ	0
#define WRITE	1
void switch_fini(void)
{
	/*
	 *  handle rtGSW registers
	 */
	/* 1011009c */
//	unsigned int value;

	if(!snooping_enabled)
		return;

#if 0 
	/*IGMP forward to cpu*/
	/* 10110014 */
	value = rareg(READMODE, 0x1011001c, 0);
	value = value & 0xffff9ff9;
	rareg(WRITEMODE, 0x1011001c, value);
#endif

	/* del 224.0.0.1( 01:00:5e:00:00:01) from mac table */
	destory_all_hosts_rule();

	/*	delete all mac tables */
	remove_all_groups();

	if(esw_fd >= 0)
		close(esw_fd);

#ifdef WIFI_IGMPSNOOP_SUPPORT
	system("iwpriv ra0 set IgmpSnEnable=0");
#endif

}

void switch_init()
{
	/*
	 *  handle rtGSW registers
	 */
	unsigned int value;

	snooping_enabled = 1;

	if(!snooping_enabled)
		return;

/* to check default IGMP flooding rule*/
/*IGMP report forward to cpu/query: default policy*/
	/* 10110014 */
	value = rareg(READ, 0x1011001c, 0);
#if 0 
	value = value | 0x00006000;
#else
	value = value | 0x00005000;
#endif
	rareg(WRITE, 0x1011001c, value);

        /* Because aging timeout should be long enough than general query timer & specific query timer */
        system("/bin/switch reg w a0 0x95003"); /* Aging timeout : 10mins */

	esw_fd = socket(AF_INET, SOCK_DGRAM, 0);
	if (esw_fd < 0) {
		perror("socket");
		switch_fini();
		exit(0);
	}

	strncpy(ifr.ifr_name, "eth2", 5);
#ifdef USE_MT7530_SWITCH
	ifr.ifr_data = &mii;
#else
	ifr.ifr_data = (char *)&reg;
#endif

	/* add 224.0.0.1( 01:00:5e:00:00:01) to mac table */
	create_all_hosts_rule();
	sync_internal_mac_table(NULL);

#ifdef WIFI_IGMPSNOOP_SUPPORT
	system("iwpriv ra0 set IgmpSnEnable=1");
#endif

}


static inline int reg_read(int offset, int *value)
{
#ifdef USE_MT7530_SWITCH
        mii.phy_id = 0x1f;
        mii.reg_num = offset;

        if (-1 == ioctl(esw_fd, RAETH_MII_READ, &ifr)) {
                perror("ioctl");
                close(esw_fd);
                return -1;
        }

        *value = mii.val_out;
#else
        reg.off = offset;
        if (-1 == ioctl(esw_fd, RAETH_ESW_REG_READ, &ifr)) {
            perror("ioctl");
            close(esw_fd);
            exit(0);
        }
        *value = reg.val;
#endif
    return 0;
}

static inline int reg_write(int offset, int value)
{
#ifdef USE_MT7530_SWITCH
        mii.phy_id = 0x1f;
        mii.reg_num = offset;
        mii.val_in = value;

        if (-1 == ioctl(esw_fd, RAETH_MII_WRITE, &ifr)) {
                perror("ioctl");
                close(esw_fd);
                return -1;
        }	
#else
        reg.off = offset;
        reg.val = value;
        if (-1 == ioctl(esw_fd, RAETH_ESW_REG_WRITE, &ifr)) {
            perror("ioctl");
            close(esw_fd);
            exit(0);
        }
#endif
    return 0;
}

static inline void wait_switch_done(void)
{
	int i, value;

	for (i = 0; i < 20; i++) {
	    reg_read(REG_ESW_WT_MAC_ATC, &value);
	    if ((value & 0x8000) == 0 ){ //mac address busy
		printf("mac table IO done.\n");
		break;
	    }
	    usleep(1000);
	}
	if (i == 20)
		log(LOG_WARNING, 0, "*** rtGSW: timeout.");
}


/*
 * ripped from user/rt2880/switch/switch.c
 */
void updateMacTable(struct group *entry, int delay_delete)
{
	int  value = 0, value1 = 0;
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

#ifndef USE_MT7530_SWITCH
#endif
	value |= (1 << 0); //LAN ID ==1
	reg_write(REG_ESW_WT_MAC_ATA2, value);
	printf("REG_ESW_WT_MAC_ATA2 is 0x%x\n\r",value);
	value1 = value; //save for later usage        


	value = 0;
	if(entry->port_map){
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
			value |= (2 << 0); //WAN ID ==2
	
			reg_write(REG_ESW_WT_MAC_ATA2, value);
			printf("WAN REG_ESW_WT_MAC_ATA2 is 0x%x\n\r",value);

			value1 = (WANPORT << 4);
			value1 |= (0x1 << 10);//port 6 cpu port

			value1 |= (0xff << 24); //w_age_field
			value1 |= (0x3<< 2); //static

			reg_write(REG_ESW_WT_MAC_ATWD, value1);

			value1 = 0x8001;  //w_mac_cmd
			reg_write(REG_ESW_WT_MAC_ATC, value1);

			wait_switch_done();
			printf("for wan port is done\n\r");
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
			 * zero the bitmap entry
			 */
#if 0
		    value |= (7 << 4);		//w_age_field, keep it alive
		    value |= 1;				//w_mac_cmd
		    reg_write(REG_ESW_WT_MAC_AD0, value);
		    wait_switch_done();
#else

		    value = (0xff << 24); //w_age_field
		    value |= (0x3<< 2); //static
		    reg_write(REG_ESW_WT_MAC_ATWD, value);
		    printf("delay delete = zer0 REG_ESW_WT_MAC_ATWD is 0x%x\n\r",value);
		  
		    value = 0x8001;  //w_mac_cmd
		    reg_write(REG_ESW_WT_MAC_ATC, value);
		    wait_switch_done();

#endif

		}else if (delay_delete == DELETED){
			/*
			 * delete the entry
			 */
#if 0
			value |= 1;				//w_mac_cmd
			reg_write(REG_ESW_WT_MAC_AD0, value);
			wait_switch_done();

			/*
			 * delete the additional entry on WAN.
			 */
			value = 0;
			value |= (1 << 7);		//w_index
			value |= 1;				//w_mac_cmd
			reg_write(REG_ESW_WT_MAC_AD0, value);
			wait_switch_done();
#else
			value = 0; //STATUS=0, delete mac
			reg_write(REG_ESW_WT_MAC_ATWD, value);

			value = 0x8001;  //w_mac_cmd
			reg_write(REG_ESW_WT_MAC_ATC, value);
			wait_switch_done();


			/*
			 * delete the additional entry on WAN.
			 */

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
#endif
		}
	}

}


#define RALINK_WIFI_INTF	"ra0"
#define RTPRIV_IOCTL_GET_MAC_TABLE          (SIOCIWFIRSTPRIV + 0x0F)
#define RTPRIV_IOCTL_GET_MAC_TABLE_STRUCT   (SIOCIWFIRSTPRIV + 0x1F)

typedef union _MACHTTRANSMIT_SETTING {
	struct  {
		unsigned short  MCS:7;  // MCS
		unsigned short  BW:1;   //channel bandwidth 20MHz or 40 MHz
		unsigned short  ShortGI:1;
		unsigned short  STBC:2; //SPACE
		unsigned short  eTxBF:1;
		unsigned short  rsv:1;
		unsigned short  iTxBF:1;
		unsigned short  MODE:2; // Use definition MODE_xxx.
	} field;
	unsigned short      word;
} MACHTTRANSMIT_SETTING;

typedef struct _RT_802_11_MAC_ENTRY {
	unsigned char			ApIdx;
	unsigned char           Addr[6];
	unsigned char           Aid;
	unsigned char           Psm;     // 0:PWR_ACTIVE, 1:PWR_SAVE
	unsigned char           MimoPs;  // 0:MMPS_STATIC, 1:MMPS_DYNAMIC, 3:MMPS_Enabled
	char                    AvgRssi0;
	char                    AvgRssi1;
	char                    AvgRssi2;
	unsigned int            ConnectedTime;
	MACHTTRANSMIT_SETTING	TxRate;
	unsigned int			LastRxRate;
	int						StreamSnr[3];
	int						SoundingRespSnr[3];
#if 0
	short					TxPER;
	short					reserved;
#endif
} RT_802_11_MAC_ENTRY;

#if defined (CONFIG_RT2860V2_AP_WAPI) || defined (CONFIG_RT3090_AP_WAPI) || \
    defined (CONFIG_RT3572_AP_WAPI) || defined (CONFIG_RT5392_AP_WAPI) || \
    defined (CONFIG_RT5572_AP_WAPI) || defined (CONFIG_RT5592_AP_WAPI) || \
    defined (CONFIG_RT3593_AP_WAPI) || defined (CONFIG_RT3680_iNIC_AP_WAPI)
#define MAX_NUMBER_OF_MAC               96
#else
#define MAX_NUMBER_OF_MAC               32 // if MAX_MBSSID_NUM is 8, this value can't be larger than 211
#endif

typedef struct _RT_802_11_MAC_TABLE {
	unsigned long            Num;
	RT_802_11_MAC_ENTRY      Entry[MAX_NUMBER_OF_MAC]; //MAX_LEN_OF_MAC_TABLE = 32
} RT_802_11_MAC_TABLE;

int WiFiSTALookUPByMac(unsigned int mac1, unsigned int mac2)
{
	int i, s;
	struct iwreq iwr;
	RT_802_11_MAC_TABLE table = {0};

	s = socket(AF_INET, SOCK_DGRAM, 0);
	strncpy(iwr.ifr_name, RALINK_WIFI_INTF, IFNAMSIZ);
	iwr.u.data.pointer = (caddr_t) &table;
	if (s < 0) {
		log(LOG_WARNING, 0, "ioctl sock failed!");
		return 0;
	}
#if 1 //def CONFIG_RT2860V2_AP_V24_DATA_STRUCTURE
	if (ioctl(s, RTPRIV_IOCTL_GET_MAC_TABLE_STRUCT, &iwr) < 0) {
		log(LOG_WARNING, 0, "ioctl -> RTPRIV_IOCTL_GET_MAC_TABLE_STRUCT failed!");
#else
	if (ioctl(s, RTPRIV_IOCTL_GET_MAC_TABLE, &iwr) < 0) {
		log(LOG_WARNING, 0, "ioctl -> RTPRIV_IOCTL_GET_MAC_TABLE failed!");
#endif
		close(s);
		return 0;
	}
	close(s);

	for (i = 0; i < table.Num; i++) {
		unsigned int c_mac1 = 0, c_mac2 = 0;
#ifdef CONFIG_RT2860V2_AP_TXBF
		RT_802_11_MAC_ENTRY *pe = &(table.Entry[i]);
		c_mac1 = (pe->Addr[3]) | (pe->Addr[2] << 8) | (pe->Addr[1] << 16) | (pe->Addr[0] << 24);
		c_mac2 = pe->Addr[5] | (pe->Addr[4] << 8);
#else
		c_mac1 = (table.Entry[i].Addr[3]) | (table.Entry[i].Addr[2] << 8) | (table.Entry[i].Addr[1] << 16) | (table.Entry[i].Addr[0] << 24);
		c_mac2 = (table.Entry[i].Addr[5]) | (table.Entry[i].Addr[4] << 8);
#endif
		if(c_mac1 == mac1 && c_mac2 == mac2)
 			return 1;
	}
	return 0;
}

int get_switch_port_num(char *mac)
{
	unsigned long long int  mac1, mac2;
	unsigned int i = 0, mac_iter;
	char mac_entry1[16], mac_entry2[16];

	memset(mac_entry1, 0, sizeof(mac_entry1));
	memset(mac_entry2, 0, sizeof(mac_entry2));

	strncpy(mac_entry1, mac, 8);
	strncpy(mac_entry2, &mac[8], 4);
	mac1 = strtoll(mac_entry1, 0, 16);
	mac2 = strtol(mac_entry2, 0, 16);

	mac_iter = internal_mac_table[i].mac1;
	//while(i < 0x3fe && mac_iter != END_OF_MAC_TABLE) {
	while(i < 0x7fe && mac_iter != END_OF_MAC_TABLE) {
		//printf("look for [%s] %08x %04x, %08x %04x\n", mac, internal_mac_table[i].mac1, internal_mac_table[i].mac2, mac1, mac2);
		if(internal_mac_table[i].vidx != LAN_VLAN_IDX)
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

#ifdef SEARCH_CLIENT_IN_WIFI_MACTABLE
	if(WiFiSTALookUPByMac(mac1, mac2)){
		return OTHER_INTERFACE;
	}else
#endif
		return -1;
}

#if 0
void sigUSR1Handler(int signo)
{
	if(!snooping_enabled)
		return;

	dump_entry();
	dump_table();
}
#endif

