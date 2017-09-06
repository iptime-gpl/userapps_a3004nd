/* serverpacket.c
 *
 * Constuct and send DHCP server packets
 *
 * Russ Dill <Russ.Dill@asu.edu> July 2001
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include <time.h>

#include "packet.h"
#include "debug.h"
#include "dhcpd.h"
#include "options.h"
#include "leases.h"


#ifdef USE_REAL_IPCLONE
static int get_ipclone_lease_time(char *wan_name);
static void set_ipclone_address(char *wan_name);
#endif

/* send a packet to giaddr using the kernel ip stack */
static int send_packet_to_relay(struct dhcpMessage *payload)
{
	DEBUG(LOG_INFO, "Forwarding packet to relay");

	return kernel_packet(payload, server_config.server, SERVER_PORT,
			payload->giaddr, SERVER_PORT);
}


/* send a packet to a specific arp address and ip address by creating our own ip packet */
static int send_packet_to_client(struct dhcpMessage *payload, int force_broadcast)
{
	unsigned char *chaddr;
	u_int32_t ciaddr;
	
	if (force_broadcast) {
		DEBUG(LOG_INFO, "broadcasting packet to client (NAK)");
		ciaddr = INADDR_BROADCAST;
		chaddr = MAC_BCAST_ADDR;
	} else if (payload->ciaddr) {
		DEBUG(LOG_INFO, "unicasting packet to client ciaddr");
		ciaddr = payload->ciaddr;
		chaddr = payload->chaddr;
	} else if (ntohs(payload->flags) & BROADCAST_FLAG) {
		DEBUG(LOG_INFO, "broadcasting packet to client (requested)");
		ciaddr = INADDR_BROADCAST;
		chaddr = MAC_BCAST_ADDR;
	} else {
		DEBUG(LOG_INFO, "unicasting packet to client yiaddr");
		ciaddr = payload->yiaddr;
		chaddr = payload->chaddr;
	}
	return raw_packet(payload, server_config.server, SERVER_PORT, 
			ciaddr, CLIENT_PORT, chaddr, server_config.ifindex);
}


/* send a dhcp packet, if force broadcast is set, the packet will be broadcast to the client */
static int send_packet(struct dhcpMessage *payload, int force_broadcast)
{
	int ret;

	if (payload->giaddr)
		ret = send_packet_to_relay(payload);
	else ret = send_packet_to_client(payload, force_broadcast);
	return ret;
}


static void init_packet(struct dhcpMessage *packet, struct dhcpMessage *oldpacket, char type)
{
	init_header(packet, type);
	packet->xid = oldpacket->xid;
	memcpy(packet->chaddr, oldpacket->chaddr, 16);
	packet->flags = oldpacket->flags;
	packet->giaddr = oldpacket->giaddr;
	packet->ciaddr = oldpacket->ciaddr;
	add_simple_option(packet->options, DHCP_SERVER_ID, server_config.server);
}


/* add in the bootp options */
static void add_bootp_options(struct dhcpMessage *packet)
{
	packet->siaddr = server_config.siaddr;
	if (server_config.sname)
		strncpy(packet->sname, server_config.sname, sizeof(packet->sname) - 1);
	if (server_config.boot_file)
		strncpy(packet->file, server_config.boot_file, sizeof(packet->file) - 1);
}
	


#ifdef USE_SYSTEM_LOG
#include <syslog_msg.h>
#endif

#ifdef USE_WL_IPTIME_HELPER
extern int helper_dhcpd;
#endif

/* send a DHCP OFFER to a DHCP DISCOVER */
int sendOffer(struct dhcpMessage *oldpacket)
{
	struct dhcpMessage packet;
	struct dhcpOfferedAddr *lease = NULL;
	u_int32_t req_align, lease_time_align = server_config.lease;
	unsigned char *req, *lease_time;
	struct option_set *curr;
	struct in_addr addr;
#ifdef USE_REAL_IPCLONE
	char wan_name[20];
#endif
	int opt_len;

	init_packet(&packet, oldpacket, DHCPOFFER);
	
	/* ADDME: if static, short circuit */
	/* the client is in our lease/offered table */
	if ((packet.yiaddr = find_static_lease_by_chaddr(oldpacket->chaddr)))
	{
	}
	else if ((lease = find_lease_by_chaddr(oldpacket->chaddr))) {
		if (!lease_expired(lease)) 
			lease_time_align = lease->expires - time(0);
		packet.yiaddr = lease->yiaddr;

		/* ysyoo, 2007.1.2 */	
		if (find_static_lease_by_yiaddr(packet.yiaddr))
		{
			//syslog_msg(SYSMSG_LOG_INFO, "other host already occupied, %08x", packet.yiaddr);
#ifndef USE_SKT_SEMO_OPTION
			packet.yiaddr = find_address(0);
			/* try for an expired lease */
			if (!packet.yiaddr) packet.yiaddr = find_address(1);
#else
			packet.yiaddr = find_address(oldpacket->chaddr, 0);
			/* try for an expired lease */
			if (!packet.yiaddr) packet.yiaddr = find_address(oldpacket->chaddr, 1);
#endif
		}

	/* ysyoo. 2003.5.30, static leases */		
#if 0
	} else if ((packet.yiaddr = find_static_lease_by_chaddr(oldpacket->chaddr))) {
		;
#endif
	/* Or the client has a requested ip */
	} else if ((req = get_option(oldpacket, DHCP_REQUESTED_IP, &opt_len)) &&

		   /* Don't look here (ugly hackish thing to do) */
		   memcpy(&req_align, req, 4) &&

		   /* and the ip is in the lease range */
		   ntohl(req_align) >= ntohl(server_config.start) &&
		   ntohl(req_align) <= ntohl(server_config.end) &&
		   
		   /* and its not already taken/offered */ /* ADDME: check that its not a static lease */
		   /* ysyoo. 2003.5.29, static leases */		
		   ((lease = (struct dhcpOfferedAddr *)find_static_lease_by_yiaddr(req_align)) ||
		   (!(lease = find_lease_by_yiaddr(req_align)) ||
		   /* or its taken, but expired */ /* ADDME: or maybe in here */
		   lease_expired(lease)))) {

		if(check_ip(req_align))
		{
#ifndef USE_SKT_SEMO_OPTION
			packet.yiaddr = find_address(0);
			if(packet.yiaddr)
				packet.yiaddr = find_address(1);
#else
			packet.yiaddr = find_address(oldpacket->chaddr, 0);
			if(packet.yiaddr)
				packet.yiaddr = find_address(oldpacket->chaddr, 1);
#endif
		}
		else
			packet.yiaddr = req_align;


	/* otherwise, find a free IP */ /*ADDME: is it a static lease? */
	} else {
		/* ysyoo. 2003.5.29, static leases */
		packet.yiaddr = find_static_lease_by_chaddr(packet.chaddr);

#ifndef USE_SKT_SEMO_OPTION
		if (!packet.yiaddr) packet.yiaddr = find_address(0);

		/* try for an expired lease */
		if (!packet.yiaddr) packet.yiaddr = find_address(1);
#else
		if (!packet.yiaddr) packet.yiaddr = find_address(packet.chaddr, 0);

		/* try for an expired lease */
		if (!packet.yiaddr) packet.yiaddr = find_address(packet.chaddr, 1);
#endif
	}
	
	if(!packet.yiaddr) {
		LOG(LOG_WARNING, "no IP addresses to give -- OFFER abandoned");
		return -1;
	}
	
	if (!add_lease(packet.chaddr, packet.yiaddr, server_config.offer_time, 0)) {
		LOG(LOG_WARNING, "lease pool is full -- OFFER abandoned");
		return -1;
	}		

	if ((lease_time = get_option(oldpacket, DHCP_LEASE_TIME, &opt_len))) {
		memcpy(&lease_time_align, lease_time, 4);
		lease_time_align = ntohl(lease_time_align);
		if (lease_time_align > server_config.lease) 
			lease_time_align = server_config.lease;
	}

	/* Make sure we aren't just using the lease time from the previous offer */
	if (lease_time_align < server_config.min_lease) 
		lease_time_align = server_config.lease;

#ifdef USE_REAL_IPCLONE

	/* ysyoo, IPCLONE lease time */
	if ((htonl(packet.yiaddr) & server_config.sys_netmask) != (htonl(server_config.start) & server_config.sys_netmask))
	{
		//lease_time_align = server_config.min_lease;
		if (check_ipclone_ipaddr(packet.chaddr, wan_name)) /* in : chaddr, out : wan_name */
			lease_time_align = get_ipclone_lease_time(wan_name);
	}
#ifdef USE_NEW_LIB
	else
	{
#ifndef USE_URL_REDIRECT_FOR_EXTENDER
		/* if dhcp off, no offer for all normal ip allocation ( not twinip ) */
		if(
#ifdef USE_WL_IPTIME_HELPER
			!helper_dhcpd && 
#endif
			!dhcpd_get_op()) return -1;
#endif
	}
#endif

#endif
#ifdef USE_SYSTEM_LOG
	syslog_set_flag( "dhcpd", 1); 
#endif

	/* ADDME: end of short circuit */		
	add_simple_option(packet.options, DHCP_LEASE_TIME, htonl(lease_time_align));

	curr = server_config.options;
	while (curr) {
		if (curr->data[OPT_CODE] != DHCP_LEASE_TIME)
		{
#ifdef USE_REAL_IPCLONE
			if (strcmp(wan_name,"")&&((htonl(packet.yiaddr) & server_config.sys_netmask) != (htonl(server_config.start) & server_config.sys_netmask)))
			{
				char info[32], ifname[32];
#ifdef USE_NEW_LIB
				get_wan_type(wan_name, info);
#else
				get_external_network_info(wan_name, info);
#endif

				if (curr->data[OPT_CODE] == DHCP_ROUTER)
				{
					char dhcp_router[128], gateway[16];
					unsigned int gwip;

					memcpy(dhcp_router, curr->data, curr->data[OPT_LEN]+2+1);
        
					if (!strcmp(info, "pppoe"))
					{
						gwip = (htonl(packet.yiaddr) & server_config.sys_netmask) | 0x1;
						gwip = ntohl(gwip);
						memcpy(&dhcp_router[2], (char *)(&gwip), dhcp_router[OPT_LEN]);
						; //memcpy(&dhcp_router[2], (char *)(&packet.yiaddr), dhcp_router[OPT_LEN]);
					}
					else
					{
						strcpy(ifname, (!strcmp(wan_name, WAN2_NAME)) ? IF_WAN2 : IF_WAN);
						get_default_gateway(ifname, gateway);
						gwip = inet_addr(gateway);
						memcpy(&dhcp_router[2], (char *)(&gwip), dhcp_router[OPT_LEN]);
					}
					add_option_string(packet.options, dhcp_router);
					curr = curr->next;
					continue;
				}
				else if (curr->data[OPT_CODE] == DHCP_SUBNET)
				{
					char dhcp_subnet[128], ip_str[32], subnet_str[32];
					unsigned int subnet;

					if (strcmp(info, "pppoe"))
					{
						memcpy(dhcp_subnet, curr->data, curr->data[OPT_LEN]+2+1);

						strcpy(ifname, (!strcmp(wan_name, WAN2_NAME)) ? IF_WAN2 : IF_WAN);
						get_ifconfig(ifname, ip_str, subnet_str);
						subnet = inet_addr(subnet_str);
						memcpy(&dhcp_subnet[2], (char *)(&subnet), dhcp_subnet[OPT_LEN]);
						add_option_string(packet.options, dhcp_subnet);
						curr = curr->next;
						continue;
					// 	syslog_msg(0," *** DHCP_SUBNET :%s (%s)", subnet_str, ifname);
					}
				}
			}
#endif 		
			add_option_string(packet.options, curr->data);
		}
		curr = curr->next;
	}


	add_bootp_options(&packet);
	
	addr.s_addr = packet.yiaddr;
	LOG(LOG_INFO, "sending OFFER of %s", inet_ntoa(addr));
	return send_packet(&packet, 0);
}


int sendNAK(struct dhcpMessage *oldpacket)
{
	struct dhcpMessage packet;

	init_packet(&packet, oldpacket, DHCPNAK);
	
	DEBUG(LOG_INFO, "sending NAK");
	return send_packet(&packet, 1);
}


int sendACK(struct dhcpMessage *oldpacket, u_int32_t yiaddr)
{
	struct dhcpMessage packet;
	struct option_set *curr;
	unsigned char *lease_time;
	u_int32_t lease_time_align = server_config.lease;
	struct in_addr addr;
	int opt_len;
	char hostname[HOSTNAME_LEN], *hnp;
	struct in_addr offer_ip;

	init_packet(&packet, oldpacket, DHCPACK);
	packet.yiaddr = yiaddr;
	offer_ip.s_addr = yiaddr;
	
	if ((lease_time = get_option(oldpacket, DHCP_LEASE_TIME, &opt_len))) {
		memcpy(&lease_time_align, lease_time, 4);
		lease_time_align = ntohl(lease_time_align);
		if (lease_time_align > server_config.lease) 
			lease_time_align = server_config.lease;
		else if (lease_time_align < server_config.min_lease) 
			lease_time_align = server_config.lease;
	}

#ifdef USE_REAL_IPCLONE
	/* ysyoo, IPCLONE lease time */
	if ((htonl(packet.yiaddr) & server_config.sys_netmask) != (htonl(server_config.start) & server_config.sys_netmask))
	{
		char wan_name[20];
		//lease_time_align = server_config.min_lease;
		if (check_ipclone_ipaddr(packet.chaddr, wan_name)) /* in : chaddr, out : wan_name */
		{
			lease_time_align = get_ipclone_lease_time(wan_name);
			set_ipclone_address(wan_name);

#ifdef USE_SYSTEM_LOG
			if(syslog_get_flag("dhcpd"))
			{
#ifndef USE_WIFI_EXTENDER
				syslog_msg( SYSMSG_LOG_INFO, "%s: %s (TWIN IP)", SYSLOG_MSG_DHCPD_OFFER_IP, inet_ntoa(offer_ip));
#endif
				syslog_set_flag("dhcpd",-1);
			}
#endif
		}
	}
#endif
#if defined USE_REAL_IPCLONE && defined USE_SYSTEM_LOG
	else
#endif

#ifdef USE_SYSTEM_LOG
	if(syslog_get_flag("dhcpd"))
	{
#ifndef USE_WIFI_EXTENDER
		syslog_msg( SYSMSG_LOG_INFO, "%s: %s (MAC : %02X-%02X-%02X-%02X-%02X-%02X)", 
			SYSLOG_MSG_DHCPD_OFFER_IP,
			inet_ntoa(offer_ip),
			packet.chaddr[0],
			packet.chaddr[1],
			packet.chaddr[2],
			packet.chaddr[3],
			packet.chaddr[4],
			packet.chaddr[5]
			);
#endif
		syslog_set_flag("dhcpd",-1);
	}
#endif


	
	add_simple_option(packet.options, DHCP_LEASE_TIME, htonl(lease_time_align));

//	add_simple_option(packet.options, DHCP_DISCOVERY, 1);
	
	curr = server_config.options;
	while (curr) {
		if (curr->data[OPT_CODE] != DHCP_LEASE_TIME)
		{
#ifdef USE_REAL_IPCLONE
			if (((htonl(packet.yiaddr) & server_config.sys_netmask) != (htonl(server_config.start) & server_config.sys_netmask)))
			{
				char info[32], ifname[32], wan_name[64];

				if(check_ipclone_ipaddr(packet.chaddr, wan_name)) /* in : chaddr, out : wan_name */
				{
#ifdef USE_NEW_LIB
					get_wan_type(wan_name, info);
#else                                   
					get_external_network_info(wan_name, info);
#endif                                  
					if (curr->data[OPT_CODE] == DHCP_ROUTER)
					{
						char dhcp_router[128], gateway[16];
						unsigned int gwip;
                                        
						memcpy(dhcp_router, curr->data, curr->data[OPT_LEN]+2+1);
                                        
						if (!strcmp(info, "pppoe"))
						{
							gwip = (htonl(packet.yiaddr) & server_config.sys_netmask) | 0x1;
							gwip = ntohl(gwip);
							memcpy(&dhcp_router[2], (char *)(&gwip), dhcp_router[OPT_LEN]);
							; //memcpy(&dhcp_router[2], (char *)(&packet.yiaddr), dhcp_router[OPT_LEN]);
						}
						else
						{
							get_wan_hw_ifname(wan_name,ifname);
							get_default_gateway(ifname, gateway);
							gwip = inet_addr(gateway);
							memcpy(&dhcp_router[2], (char *)(&gwip), dhcp_router[OPT_LEN]);
						}
						add_option_string(packet.options, dhcp_router);
						curr=curr->next;
						continue;
					}
					else if (curr->data[OPT_CODE] == DHCP_SUBNET)
					{
						char dhcp_subnet[128], ip_str[32], subnet_str[32];
						unsigned int subnet;
                                        
						if (strcmp(info, "pppoe"))
						{
							memcpy(dhcp_subnet, curr->data, curr->data[OPT_LEN]+2+1);
                                        
							get_wan_hw_ifname(wan_name,ifname);
							get_ifconfig(ifname, ip_str, subnet_str);
							subnet = inet_addr(subnet_str);
							memcpy(&dhcp_subnet[2], (char *)(&subnet), dhcp_subnet[OPT_LEN]);
							add_option_string(packet.options, dhcp_subnet);
							curr=curr->next;
							continue;
						}
					}
				}
			}
#endif
			add_option_string(packet.options, curr->data);
		}
		curr = curr->next;
	}

	add_bootp_options(&packet);

	addr.s_addr = packet.yiaddr;
	LOG(LOG_INFO, "sending ACK to %s", inet_ntoa(addr));

	if (send_packet(&packet, 0) < 0) 
		return -1;

	hnp = (char *)get_option(oldpacket, DHCP_HOST_NAME, &opt_len);
	memset(hostname, 0, HOSTNAME_LEN);

	if(opt_len > (HOSTNAME_LEN-1))
		opt_len = (HOSTNAME_LEN-1);

	memcpy(hostname, hnp, opt_len);

	if (check_unpermitted_chars(hostname))
		memset(hostname, 0, HOSTNAME_LEN);

#if 0
	{
		char buffer[128];
		sprintf(buffer, "echo %s %d > /var/hostname", hostname, opt_len);
		system(buffer);
	}
#endif

	add_lease(packet.chaddr, packet.yiaddr, lease_time_align, hostname);


#ifdef USE_DHCP_ACCESS_POLICY
	if(get_dhcp_access_policy()) add_dhcp_access_host(packet.chaddr, inet_ntoa(offer_ip));
#endif

#ifdef USE_PHILTEC_OPTION
	do_philtec_option(packet.chaddr, packet.yiaddr);
#endif
#ifdef USE_SKT_SEMO_OPTION
	if (get_skt_semo_option())
		do_skt_semo_option(packet.chaddr, packet.yiaddr);
#endif

	return 0;
}


int send_inform(struct dhcpMessage *oldpacket)
{
	struct dhcpMessage packet;
	struct option_set *curr;

	init_packet(&packet, oldpacket, DHCPACK);
	
	curr = server_config.options;
	while (curr) {
		if (curr->data[OPT_CODE] != DHCP_LEASE_TIME)
			add_option_string(packet.options, curr->data);
		curr = curr->next;
	}

	add_bootp_options(&packet);

	return send_packet(&packet, 0);
}

#ifdef USE_REAL_IPCLONE
static int get_ipclone_lease_time(char *wan_name)
{
	int lease_time = 60;

	read_real_ipclone_leasetime(wan_name, &lease_time);
	return lease_time;
}

static void set_ipclone_address(char *wan_name)
{
#ifdef USE_IP3210
#ifdef USE_DUAL_WAN
#error "IP3210 doesn't support 2WAN"
#endif
	write_file("/proc/driver/twinip", "1");
#else
	unsigned int ipaddr[2] = {0,0};
	char ipstr[2][20], buf[64];
	struct in_addr in;
	int idx;
	FILE *fp;

	fp = fopen("/proc/driver/wanip", "r");
	if (fp)
	{
		fscanf(fp, "%08x %08x", &ipaddr[0], &ipaddr[1]);
		fclose(fp);
	}

	in.s_addr = htonl(ipaddr[0]);	
	strcpy(ipstr[0], inet_ntoa(in));
	in.s_addr = htonl(ipaddr[1]);	
	strcpy(ipstr[1], inet_ntoa(in));

	idx = !strcmp(WAN2_NAME, wan_name) ? 1 : 0;
        get_wan_ip(wan_name, ipstr[idx]);

        if(strcmp(ipstr[idx],""))
	{
		sprintf(buf, "%s %s", ipstr[0], ipstr[1]);
                write_file("/proc/driver/wanip", buf);
	}
#endif
}
#endif


