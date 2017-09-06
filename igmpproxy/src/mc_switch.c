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
#include <linosconfig.h>

#include "defs.h"

#define IP_GET_LOST_MAPPING(mip)    	((mip & 0x0F800000) >> 23) 
#define IP_MULTICAST_A0(a0)		((a0 >> 1) | 0xE0)
#define IP_MULTICAST_A1(a0, a1)		(((a0 & 0x1) << 7) | a1)
//#define HOOK_CHECK			if(!(hook_value & 0x3FF)) return;
#define HOOK_CHECK

#define DD printf("%s %d\n", __FUNCTION__, __LINE__);

#define MCGROUP_FILE "/var/run/mcgroup"

// function prototype
static int  portLookUpByIP(char *ip);
static void update_group_port_map(struct group *entry);
static void write_entry(void);
static int arpLookUp(char *ip, char *arp);

#ifdef USE_MT7620
extern void updateMacTable(struct group *entry, int delay_deleted);
#else
extern void updateMacTable(struct group *entry);
#endif
extern int get_switch_port_num(char *mac);


// global variables.
static struct group 	*group_list = NULL;
int    igmp_router_port = -1;

static struct group *find_entry(uint32 ip_addr)
{
	unsigned ua1, ua2, ua3;
	struct group *pos = group_list;

	ua1 = ( ip_addr & 0x007F0000 ) >> 16;
	ua2 = ( ip_addr & 0x0000FF00 ) >> 8;
	ua3 = ( ip_addr & 0x000000FF );

	while(pos){
		if(pos->a1 == ua1 && pos->a2 == ua2 && pos->a3 == ua3)
			return pos;
		pos = pos->next;
	}
	return NULL;
}

static struct group *build_entry(uint32 m_ip_addr, uint32 u_ip_addr)
{
	unsigned char 		a1, a2, a3;
	struct group 		*new_entry;

	static int group_count = 0;

#if 0
	// crowd control
	if(group_count++ > MAX_MULTICASTS_GROUP)
		return NULL;
#endif

	a1 = ( m_ip_addr & 0x007F0000 ) >> 16;
	a2 = ( m_ip_addr & 0x0000FF00 ) >> 8;
	a3 = ( m_ip_addr & 0x000000FF );

	/* check if "all hosts" address*/
	if(a1 == 0 && a2 == 0 && a3 == 1)
		return NULL;

	new_entry = (struct group *)malloc(sizeof(struct group));
	if(!new_entry){
		log(LOG_WARNING, 0, "*** Out of memory.");
		return NULL;
	}
	log(LOG_DEBUG, 0, "%s, %s\n", __FUNCTION__,  inetFmt(htonl(m_ip_addr), s1));
	
	/* set up address */
	new_entry->a0 = IP_GET_LOST_MAPPING(m_ip_addr); //EFM
	new_entry->a1 = a1;
	new_entry->a2 = a2;
	new_entry->a3 = a3;

	/* set up ip address bitmap */
	new_entry->port_map = 0x0;

	new_entry->members = NULL;
	/* GND */
	new_entry->next = NULL;
	return new_entry;
}

static struct group_member *lookup_member(struct group *entry, uint32 m_ip_addr, uint32 u_ip_addr)
{
	struct group_member *pos = entry->members;
	while(pos){
		unsigned char a0 = IP_GET_LOST_MAPPING(m_ip_addr);
		if(pos->ip_addr == u_ip_addr && pos->a0 == a0)
			return pos;
		pos = pos->next;
	}
	return NULL;
} 

static struct group_member *insert_member(struct group *entry, uint32 m_ip_addr, uint32 u_ip_addr)
{
	struct in_addr 		tmp;
	struct group_member *new_member;

	if(entry->members != NULL){
		struct group_member *member = lookup_member(entry, m_ip_addr, u_ip_addr);
		if(member){
			char port_num;

			/* check if port changed */
			tmp.s_addr = htonl(u_ip_addr);
			port_num = portLookUpByIP(inet_ntoa(tmp));
			if(port_num != member->port_num)
				member->port_num = port_num;

			/* update its report flag */
			member->has_report = 10;
			member->sent_report = 0;

			log(LOG_WARNING, 0, "*** find the same member [%s] in [%s]. (has_report=%d", inetFmt(u_ip_addr, s1), inetFmt(m_ip_addr, s2), member->has_report);
			return NULL;
		}
	}

	printf("%s, %s, %s\n", __FUNCTION__,  inetFmt(htonl(m_ip_addr), s1), inetFmt(htonl(u_ip_addr), s2));

	/* create a new member */
	new_member = (struct group_member *)malloc(sizeof(struct group_member));
	if(!new_member){
			log(LOG_WARNING, 0, "*** Out of memory.");
			return NULL;
	}
	tmp.s_addr		= htonl(u_ip_addr);
	new_member->ip_addr 	= u_ip_addr;
	new_member->a0		= IP_GET_LOST_MAPPING( m_ip_addr);
	new_member->port_num 	= portLookUpByIP(inet_ntoa(tmp));
	new_member->has_report	= 10;
	new_member->sent_report     = 0;
	new_member->next		= entry->members;

	entry->members = new_member;

	return new_member;
}

void insert_multicast_ip(uint32 m_ip_addr, uint32 u_ip_addr)
{
#ifdef RALINK_WIFI_IGMPSNOOP_SUPPORT
        char cmd[128];
#endif
	struct group_member *new_member;
	struct group *entry = find_entry(m_ip_addr);

	HOOK_CHECK;
	if(!entry){
		// This entry isn't in the list, create one.
		if( (entry = build_entry(m_ip_addr, u_ip_addr)) == NULL)
			return;
#ifdef RALINK_WIFI_IGMPSNOOP_SUPPORT
                sprintf(cmd, "iwpriv ra0 set IgmpAdd=%s", inetFmt(htonl(m_ip_addr), s1));
                system(cmd);
#endif
		if(group_list)
			entry->next = group_list;
		group_list = entry;

		printf("%s, %s, %s\n", __FUNCTION__,  inetFmt(htonl(m_ip_addr), s1), inetFmt(htonl(u_ip_addr), s2));
	}
	new_member = insert_member(entry, m_ip_addr, u_ip_addr);
#ifdef RALINK_WIFI_IGMPSNOOP_SUPPORT
        if(new_member && new_member->port_num == WIRELESS_PORT_NUM){
                char mac[32];
                if( arpLookUp(inetFmt( htonl(u_ip_addr), mac), s1) != -1){
                        sprintf(cmd, "iwpriv ra0 set IgmpAdd=%s-%s", inetFmt(htonl(m_ip_addr), s1), mac);
                        system(cmd);
                }else
                        log(LOG_WARNING, 0, "Can't find Mac address(%s)", u_ip_addr);
        }
#endif
	update_group_port_map(entry);
	write_entry();
	return;
}

void remove_member(uint32 m_ip_addr, uint32 u_ip_addr, int write_option)
{
	unsigned char a0;
	struct group *entry;
	struct group_member *pos;
	struct group_member *del=NULL;

	HOOK_CHECK;

#ifdef RALINK_WIFI_IGMPSNOOP_SUPPORT
        {
                char mac[32], cmd[128];
                if( arpLookUp(inetFmt(htonl(u_ip_addr), s1), mac) != -1){
                        sprintf(cmd, "iwpriv ra0 set IgmpDel=%s-%s", inetFmt(htonl(m_ip_addr), s1), mac);
                        system(cmd);
                }else{
                        log(LOG_WARNING, 0, "Can't find Mac address(%s)", inetFmt(htonl(u_ip_addr), s1));
                }
        }
#endif

	entry = find_entry(m_ip_addr);
	if(!entry){
		log(LOG_WARNING, 0, "*** can't find the group [%s].", inetFmt(htonl(m_ip_addr), s1));
		return;
	}

	pos = entry->members;
	if(!pos){
		log(LOG_WARNING, 0, "*** group [%s] member list is empty.", inetFmt(htonl(m_ip_addr), s1));
		return;
	}

	printf("%s, %s, %s\n", __FUNCTION__,  inetFmt(htonl(m_ip_addr), s1), inetFmt(htonl(u_ip_addr), s2));

	a0 = IP_GET_LOST_MAPPING(m_ip_addr);
	if(entry->members->ip_addr == u_ip_addr && entry->members->a0 == a0){
		del = pos;
		entry->members = entry->members->next;
	}else{
		while(pos->next){
			if(pos->next->ip_addr == u_ip_addr && pos->next->a0 == a0){
				del = pos->next;
				pos->next = del->next;
				break;
			}
			pos = pos->next;
		}
	}

	if(del)
		free(del);
	else{
		log(LOG_WARNING, 0, "************************************************");
		log(LOG_WARNING, 0, "*** can't delete [%s] in the group [%s].", inetFmt(htonl(u_ip_addr), s1) , inetFmt(htonl(m_ip_addr), s2));
		log(LOG_WARNING, 0, "************************************************");
	}

	update_group_port_map(entry);
	if (write_option) write_entry();

	return;
}

int all_member_leaved(uint32 m_ip_addr)
{
	struct group *entry = find_entry(m_ip_addr);

	if (entry)
		log(LOG_WARNING, 0, "====> %s , %08x", inetFmt(htonl(m_ip_addr), s1), entry->port_map);
	else
		log(LOG_WARNING, 0, "====> %s NULL", inetFmt(htonl(m_ip_addr), s1));

	return ((!entry) ? 1: entry->port_map ? 0 : 1);
}


void query_specific_members(void)
{
	struct group *pos = group_list;

	HOOK_CHECK;

	while(pos){
		struct group_member *member = pos->members;

		while(member){
			member->has_report--;
			if (member->has_report <= 5)
			{
				unsigned int craft_mip = 0x0;
                                
				/* craft a multicast ip for remove_member() */
				craft_mip |=  (unsigned long)( IP_MULTICAST_A0(member->a0)) ;
				craft_mip |= ((unsigned long)( IP_MULTICAST_A1(member->a0, pos->a1) ) << 8 );
				craft_mip |= ((unsigned long)(pos->a2) << 16) ;
				craft_mip |= ((unsigned long)(pos->a3) << 24) ;
                                
				log(LOG_WARNING, 0, "***** requery [%s] in the group [%s]. (has_report=%d)", 
					inetFmt(htonl(member->ip_addr), s1) , inetFmt(craft_mip, s2), member->has_report);
				#if 0
				syslog_msg(0, "***** requery [%s] in the group [%s]. (has_report=%d)", 
					inetFmt(htonl(member->ip_addr), s1) , inetFmt(craft_mip, s2), member->has_report);
				#endif
                                
				sendSpecificMembershipQueryToSpecificMember(htonl(member->ip_addr), craft_mip);
			}
			member = member->next;
			//if (member) sleep(INTERVAL_UNICAST_QUERY_RESPONSE+1); //EFM 2014-04-21
		}
		pos = pos->next;
	}
}

int sweap_no_report_members(unsigned int mc_ipaddr)
{
	struct group *pos = group_list;
	unsigned int craft_mip = 0x0;
	int sweap = 0;

	HOOK_CHECK;

	while(pos){
		struct group_member *member = pos->members;
		craft_mip = 0x0;

		/* craft a multicast ip for remove_member() */
		craft_mip |=  (unsigned long)( IP_MULTICAST_A0(pos->a0)) ;
		craft_mip |= ((unsigned long)( IP_MULTICAST_A1(pos->a0, pos->a1) ) << 8 );
		craft_mip |= ((unsigned long)(pos->a2) << 16) ;
		craft_mip |= ((unsigned long)(pos->a3) << 24) ;

		while((mc_ipaddr == craft_mip) && member) {
			struct group_member *next_backup = NULL;

			if(!member->has_report){
				log(LOG_DEBUG, 0, "no report : *** remove [%s] in the group [%s].", 
					inetFmt(htonl(member->ip_addr), s1) , inetFmt(craft_mip, s2));
				#if 0
				syslog_msg(0, "no report : *** remove [%s] in the group [%s].", 
					inetFmt(htonl(member->ip_addr), s1) , inetFmt(craft_mip, s2));
				#endif
				next_backup = member->next;
				remove_member( ntohl(craft_mip), member->ip_addr, 0);
			}

			member = (next_backup) ? next_backup : member->next;
		}
		
		if ((mc_ipaddr == craft_mip) && (pos->members == NULL))
		{
			sweap = 1;
			break;
		}
		pos = pos->next;
	}

	write_entry();

	return sweap;
}

void clear_all_entries_report(void)
{
#if 0
	struct group *pos = group_list;

	HOOK_CHECK;
	while(pos){
		struct group_member *member = pos->members;
		while(member){
			if (member->sent_report == 0)
				member->sent_report = 1;
			else
				member->has_report = 0;
			member = member->next;
		}
		pos = pos->next;
	}
#endif
//#if defined(USE_MT7621) || defined(USE_MT7628) || defined(USE_MT7623)
#ifdef USE_RT256X
	sync_internal_mac_table(NULL);
#endif
}

void remove_all_members(struct group *entry)
{
	struct group_member *del, *pos = entry->members;

	HOOK_CHECK;

	while(pos){
		del = pos;
		pos = pos->next;
		free(del);
	}
	entry->members = NULL;
}

void remove_multicast_ip(uint32 m_ip_addr)
{
	int found_flag = 0;
	struct group *group_pos = group_list;
	struct group *entry = find_entry(m_ip_addr);

	IF_DEBUG log(LOG_DEBUG, 0, "===> remove_multicast_ip : %s ", inetFmt(m_ip_addr, s1));
	HOOK_CHECK;

#ifdef RALINK_WIFI_IGMPSNOOP_SUPPORT
        {
        char cmd[128];
        sprintf(cmd, "iwpriv ra0 set IgmpDel=%s", inetFmt(htonl(m_ip_addr), s1));
        system(cmd);
        }
#endif

	if(!entry){
		// This entry isn't in the list.
		log(LOG_WARNING, 0, "*** can't find group entry [%s].", inetFmt(m_ip_addr, s1));
		return;
	}

	printf("%s, %s\n", __FUNCTION__,  inetFmt(htonl(m_ip_addr), s1));

	// find the previous group entry
	if(group_list == entry){
		group_list = entry->next;
		found_flag = 1;
	}else{
		while(group_pos->next){
			if(group_pos->next == entry){
				group_pos->next = entry->next;
				found_flag = 1;
				break;
			}
			group_pos = group_pos->next;
		}
	}

	if(!found_flag){
		/* this shouldn't happen */
		log(LOG_WARNING, 0, "*** can't find grou entry [%s].", inetFmt(m_ip_addr, s1));
		return;
	}
	
	/* clear mac table */
	entry->port_map = 0x0;
#ifdef USE_MT7620
	updateMacTable(entry, DELETED);
#else
	updateMacTable(entry);
#endif

	// free all members memory.
	remove_all_members(entry);

	// free myself
	free(entry);

	write_entry();
}

void remove_all_groups(void)
{
	struct group *del, *pos = group_list;	

	HOOK_CHECK;

	/*  TODO: call remove_multicast_ip() instead. */
	while(pos){
		del = pos;
		pos = pos->next;
		del->port_map = 0x0;
#ifdef USE_MT7620
		updateMacTable(del, DELETED);
#else
		updateMacTable(del);
#endif
		remove_all_members(del);
		free(del);
	}
	group_list =  NULL;	

	unlink(MCGROUP_FILE);
}

static void update_group_port_map(struct group *entry)
{
	unsigned int new_portmap = 0x0;
	struct group_member *pos = entry->members;
#ifdef USE_SYSINFO
	hw_t hw;

	get_si("hw",&hw);
#endif

	IF_DEBUG log(LOG_DEBUG, 0,"===> %s", __FUNCTION__);
	printf("===> %s", __FUNCTION__);

	while(pos){
		if(pos->port_num == (char)-1){
			// can't find which port it's in, so opens all ports for it.
			log(LOG_WARNING, 0, "****************************************");
			log(LOG_WARNING, 0, "*** can't find %s's port number.", inetFmt(htonl(pos->ip_addr), s1));
			log(LOG_WARNING, 0, "****************************************");
#ifdef USE_SYSINFO
			new_portmap=0x5f&(~(0x1<<hw.board.eport.wan[0]));
#else
#ifdef USE_MT7623
			//syslog_msg(0, "*** can't find %s's port number.", inetFmt(htonl(pos->ip_addr), s1));
			new_portmap =  0x4f; // 0100 1111
#else
			new_portmap =  0x5e; // 0101 1110
#endif
#endif
			break;
#ifdef USE_WIRELESS_CGI
		} else if (pos->port_num == WIRELESS_PORT_NUM)  {
			new_portmap = new_portmap | (0x1 << 31);
			pos = pos->next;
			continue;
#endif
		} else{
			new_portmap = new_portmap | (0x1 << pos->port_num);
			pos = pos->next;
		}
	}
	if(entry->port_map != new_portmap){
		entry->port_map = new_portmap;
#ifdef USE_MT7620
		updateMacTable(entry, ZEROED);
#else
		updateMacTable(entry);
#endif
	}

	IF_DEBUG log(LOG_DEBUG, 0, "===> port map : %08x",  entry->port_map);
	printf( "===> port map : %08x",  entry->port_map);
}

static int portLookUpByMac(char *mac)
{
#ifdef USE_WIRELESS_CGI
	int idx;
	station_infolist_t sta_list;

	strcpy(sta_list.ifname, IF_WIRELESS );
	wireless_api_get_station_list(&sta_list);
	for(idx=0; idx < sta_list.count; idx++)
	{
		if(!maccmp(sta_list.station_info[idx].mac, mac))
			return WIRELESS_PORT_NUM;
	}


#ifdef USE_5G_WL
	strcpy(sta_list.ifname, IF_WIRELESS_5G );
	wireless_api_get_station_list(&sta_list);
	for(idx=0; idx < sta_list.count; idx++)
	{
		if(!maccmp(sta_list.station_info[idx].mac, mac))
			return WIRELESS_PORT_NUM;
	}
#endif

#endif
	return get_switch_port_num(mac);
}

/*
 * send a udp packet to target if its mac address can't be found.
 */
static void sendUDP(char *ip)
{
	int socket_fd;
	struct sockaddr_in user_addr;
	char buf[16];

	memset(&user_addr, 0, sizeof(struct sockaddr_in));
	user_addr.sin_family	= AF_INET;
	user_addr.sin_port	= htons(53);
	user_addr.sin_addr.s_addr = inet_addr(ip);

	if((socket_fd = socket(AF_INET,SOCK_DGRAM, 0)) == -1) {
		log(LOG_WARNING, 0, "*** socket error");
		return;
	}
	strcpy(buf, "arp please");
	sendto(socket_fd, buf, strlen(buf), 0, (struct sockaddr *)&user_addr, sizeof(user_addr));
	close(socket_fd);

	return ;
}

static int arpLookUp(char *ip, char *arp)
{
	char buf[256];
	FILE *fp = fopen("/proc/net/arp", "r");
	if(!fp){
		log(LOG_ERR, 0, "*** no proc fs!");
		return -1;
	}

	while(fgets(buf, sizeof(buf), fp)){
		char ip_entry[32], hw_type[8],flags[8], hw_address[32];
		sscanf(buf, "%s %s %s %s", ip_entry, hw_type, flags, hw_address);
		if(!strcmp(ip, ip_entry)){
			strcpy(arp, hw_address);
			fclose(fp);
			if(!strcmp("00:00:00:00:00:00", hw_address)){
				return -1;
                        }
			return 0;
		}
	}

	fclose(fp);
	return -1;
}

static void strip_mac(char *mac)
{
	char *pos = mac, *strip = mac;
	while(*pos != '\0'){
		if(*pos == ':')
			pos++;
		else{
			*strip = *pos;
			strip++;
			pos++;
		}
	}
	*strip = '\0';
}

/*
 * Unfortunately IGMP packets from linux raw socket layer don't have layer2 header, we
 * can get its mac address from ARP table. If there is no entry in the table then we send a dummy
 * udp packet to target, and wait its ARP reply.
 */
static int portLookUpByIP(char *ip)
{
	char mac[32];
	if( arpLookUp(ip, mac) == -1){
		// send an udp then wait.
		sendUDP(ip);
		usleep(20000);	
		if(arpLookUp(ip, mac) == -1){
			// means flooding.
			return -1;
		}
	}
	strip_mac(mac);
#if	0
#if defined(USE_MT7621) || defined(USE_MT7623)
#elif defined(USE_MT7628)
#elif defined(USE_MT7620)
        sync_internal_mac_table(NULL);
#endif
#endif
	return portLookUpByMac(mac);
}


static void write_entry(void)
{
	unsigned int port_map, i;
	struct group *pos = group_list;
	FILE *fp;
	int fd;
#ifdef USE_SYSINFO
	hw_t hw;
#else
	int numlanport, portswap;
#endif

	fd = lock_file(MCGROUP_FILE);

	fp = fopen(MCGROUP_FILE, "w");
	if (!fp) 
	{
		unlock_file(fd);
		return;
	}

#ifdef USE_SYSINFO
	get_si("hw",&hw);
#else
	numlanport = hwinfo_get_num_lanport();
	portswap = hwinfo_get_lanport_swap();
#endif

	while(pos)
	{
		struct group_member *member;

		member = pos->members;

		if (member)
		{
			fprintf(fp, "G %d.%d.%d.%d ", IP_MULTICAST_A0(member->a0), IP_MULTICAST_A1(member->a0, pos->a1), pos->a2, pos->a3);
			fprintf(fp, "01:00:5e:%02x:%02x:%02x ", pos->a1, pos->a2, pos->a3);

			port_map = pos->port_map;
			for(i=0; i<32; i++)
			{
				if(port_map & 0x1) fprintf(fp, "%d ",  i);
				port_map = port_map >> 1;
			}
			fprintf(fp, "\n");
		}


		while(member)
		{
			struct in_addr tmp;
			int user_port;

#ifdef USE_WIRELESS_CGI
			if (member->port_num == WIRELESS_PORT_NUM)
				user_port = WIRELESS_PORT_NUM;
			else
#endif
			{
#ifdef USE_SYSINFO
				user_port = get_ux_port(&hw,member->port_num);
#else
				user_port = get_user_port(member->port_num);
				user_port = (portswap) ? (numlanport-user_port+1) : user_port;
#endif
			}

			tmp.s_addr = htonl(member->ip_addr);
			fprintf(fp, "M %s %d %s\n", 
				inet_ntoa(tmp), user_port,
				member->has_report ? "reported" : "not-reported");
			member = member->next;
		}

		pos = pos->next;
	}

	fclose(fp);
	unlock_file(fd);
}

void update_router_port(uint32 src)
{
	struct in_addr tmp;
	struct group *pos = group_list;
	int temp_rport;

	tmp.s_addr = src;
	temp_rport  = portLookUpByIP(inet_ntoa(tmp));

	if (temp_rport == igmp_router_port)
		return;

	igmp_router_port = temp_rport;

	IF_DEBUG log(LOG_DEBUG, 0,"==> IGMP Query (src %08x) router port %d", ntohl(src), igmp_router_port);
	
	if (igmp_router_port >= 0)
	{
		while(pos && (igmp_router_port >= 0))
		{
#ifdef USE_MT7620
			updateMacTable(pos, ZEROED);
#else
			updateMacTable(pos);
#endif
			pos = pos->next;
		}
		//query_specific_members();
	}
}

static void dump_table(void)
{
#if 0
	int i=0;
	unsigned int mac1;
	char show_buf[128];
	mac1 = internal_mac_table[i].mac1;
	//while( i< 1024 && mac1 != END_OF_MAC_TABLE){
	while( i< 10 && mac1 != END_OF_MAC_TABLE){ // test
		sprintf(show_buf, "%08x%04x, %08x\n", internal_mac_table[i].mac1, internal_mac_table[i].mac2, internal_mac_table[i].port_map);
		printf("%s\n", show_buf);
		i++;
		mac1 = internal_mac_table[i].mac1;
	}
#endif
}

static void dump_entry(void)
{
	unsigned int port_map, i;
	struct group *pos = group_list;
	printf("=== Dump group entries:\n");
	while(pos){
		struct group_member *member;

		printf("01:00:5e:%02x:%02x:%02x (%08x)\t", pos->a1, pos->a2, pos->a3, pos->port_map);
		port_map = pos->port_map;
		for(i=0; i<8; i++)
		{
			if(port_map & 0x1){
				printf("%d ",  i);
			}
			port_map = port_map >> 1;
		}

		printf("\n");
		member = pos->members;
		while(member){
			struct in_addr tmp;
			tmp.s_addr = htonl(member->ip_addr);
			printf("\t\t%d.%d.%d.%d\t%s(%d)\tport%d\t%s\n", IP_MULTICAST_A0(member->a0), IP_MULTICAST_A1(member->a0, pos->a1), pos->a2, pos->a3, inet_ntoa(tmp), member->a0, member->port_num, member->has_report ? "reported" : "not-reported");
			member = member->next;
		}

		pos = pos->next;
		printf("\n");
	}
	printf("===\n");
}

void sigUSR1Handler(int signo)
{
	dump_entry();
	dump_table();
}
