/* script.c
 *
 * Functions to call the DHCP client notification scripts 
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

#include <string.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <errno.h>

#include "options.h"
#include "dhcpd.h"
#include "dhcpc.h"
#include "packet.h"
#include "options.h"
#include "debug.h"

#ifdef USE_SYSTEM_LOG
#include <linosconfig.h>
#endif
#ifndef DHCPC_USE_SCRIPT
int set_ifconfig(char *ifname, char *ip, char *netmask);
int set_default_gateway(char *ifname, char *gw);
int set_default_gateway2(char *ifname, char *ip, char *mask, char *gw);
int determine_dhcpd_restart(char *dns1, char *dns2);
#endif

/* get a rough idea of how long an option will be (rounding up...) */
static int max_option_length[] = {
	[OPTION_IP] =		sizeof("255.255.255.255 "),
	[OPTION_IP_PAIR] =	sizeof("255.255.255.255 ") * 2,
	[OPTION_STRING] =	1,
	[OPTION_BOOLEAN] =	sizeof("yes "),
	[OPTION_U8] =		sizeof("255 "),
	[OPTION_U16] =		sizeof("65535 "),
	[OPTION_S16] =		sizeof("-32768 "),
	[OPTION_U32] =		sizeof("4294967295 "),
	[OPTION_S32] =		sizeof("-2147483684 "),
};


static int upper_length(int length, struct dhcp_option *option)
{
	return max_option_length[option->flags & TYPE_MASK] *
	       (length / option_lengths[option->flags & TYPE_MASK]);
}


static int sprintip(char *dest, char *pre, unsigned char *ip) {
	return sprintf(dest, "%s%d.%d.%d.%d ", pre, ip[0], ip[1], ip[2], ip[3]);
}


/* Fill dest with the text of option 'option'. */
static void fill_options(char *dest, unsigned char *option, struct dhcp_option *type_p)
{
	int type, optlen;
	u_int16_t val_u16;
	int16_t val_s16;
	u_int32_t val_u32;
	int32_t val_s32;
	int len = option[OPT_LEN - 2];

	dest += sprintf(dest, "%s=", type_p->name);

	type = type_p->flags & TYPE_MASK;
	optlen = option_lengths[type];
	for(;;) {
		switch (type) {
		case OPTION_IP_PAIR:
			dest += sprintip(dest, "", option);
			*(dest++) = '/';
			option += 4;
			optlen = 4;
		case OPTION_IP:	/* Works regardless of host byte order. */
			dest += sprintip(dest, "", option);
 			break;
		case OPTION_BOOLEAN:
			dest += sprintf(dest, *option ? "yes " : "no ");
			break;
		case OPTION_U8:
			dest += sprintf(dest, "%u ", *option);
			break;
		case OPTION_U16:
			memcpy(&val_u16, option, 2);
			dest += sprintf(dest, "%u ", ntohs(val_u16));
			break;
		case OPTION_S16:
			memcpy(&val_s16, option, 2);
			dest += sprintf(dest, "%d ", ntohs(val_s16));
			break;
		case OPTION_U32:
			memcpy(&val_u32, option, 4);
			dest += sprintf(dest, "%lu ", (unsigned long) ntohl(val_u32));
			break;
		case OPTION_S32:
			memcpy(&val_s32, option, 4);
			dest += sprintf(dest, "%ld ", (long) ntohl(val_s32));
			break;
		case OPTION_STRING:
			memcpy(dest, option, len);
			dest[len] = '\0';
			return;	 /* Short circuit this case */
		}
		option += optlen;
		len -= optlen;
		if (len <= 0) break;
	}
}


static char *find_env(const char *prefix, char *defaultstr)
{
	extern char **environ;
	char **ptr;
	const int len = strlen(prefix);

	for (ptr = environ; *ptr != NULL; ptr++) {
		if (strncmp(prefix, *ptr, len) == 0)
			return *ptr;
	}
	return defaultstr;
}


/* put all the paramaters into an environment */
static char **fill_envp(struct dhcpMessage *packet)
{
	int num_options = 0;
	int i, j;
	char **envp;
	unsigned char *temp;
	char over = 0;
	int opt_len;

	if (packet == NULL)
		num_options = 0;
	else {



		for (i = 0; options[i].code; i++)
			if (get_option(packet, options[i].code, &opt_len))
				num_options++;

		if (packet->siaddr) num_options++;
		if ((temp = get_option(packet, DHCP_OPTION_OVER, &opt_len)))
			over = *temp;
		if (!(over & FILE_FIELD) && packet->file[0]) num_options++;
		if (!(over & SNAME_FIELD) && packet->sname[0]) num_options++;		
	}
	
	envp = xmalloc((num_options + 5) * sizeof(char *));
	envp[0] = xmalloc(sizeof("interface=") + strlen(client_config.interface));
	sprintf(envp[0], "interface=%s", client_config.interface);
	envp[1] = find_env("PATH", "PATH=/bin:/usr/bin:/sbin:/usr/sbin");
	envp[2] = find_env("HOME", "HOME=/");

	if (packet == NULL) {
		envp[3] = NULL;
		return envp;
	}

	envp[3] = xmalloc(sizeof("ip=255.255.255.255"));
	sprintip(envp[3], "ip=", (unsigned char *) &packet->yiaddr);
	for (i = 0, j = 4; options[i].code; i++) {
		if ((temp = get_option(packet, options[i].code, &opt_len))) {
			envp[j] = xmalloc(upper_length(temp[OPT_LEN - 2], &options[i]) + strlen(options[i].name) + 2);
			fill_options(envp[j], temp, &options[i]);
			j++;
		}
	}
	if (packet->siaddr) {
		envp[j] = xmalloc(sizeof("siaddr=255.255.255.255"));
		sprintip(envp[j++], "siaddr=", (unsigned char *) &packet->siaddr);
	}
	if (!(over & FILE_FIELD) && packet->file[0]) {
		/* watch out for invalid packets */
		packet->file[sizeof(packet->file) - 1] = '\0';
		envp[j] = xmalloc(sizeof("boot_file=") + strlen(packet->file));
		sprintf(envp[j++], "boot_file=%s", packet->file);
	}
	if (!(over & SNAME_FIELD) && packet->sname[0]) {
		/* watch out for invalid packets */
		packet->sname[sizeof(packet->sname) - 1] = '\0';
		envp[j] = xmalloc(sizeof("sname=") + strlen(packet->sname));
		sprintf(envp[j++], "sname=%s", packet->sname);
	}	
	envp[j] = NULL;


	for( i = 0 ; i < j ; i++ )
		fprintf(stderr, "%s\n", envp[i]);

	return envp;
}


#ifndef DHCPC_USE_SCRIPT
static char *get_env_vars(char **envp, char *prefix)
{
	char **ptr;
	const int len = strlen(prefix);

	for (ptr = envp; *ptr != NULL; ptr++) {
		if (strncmp(prefix, *ptr, len) == 0)
		{
			int opt_len;
			char *opt_end;

			opt_len = strlen(*ptr);
			opt_end = *ptr+opt_len - 1;
			if(*opt_end==' ') *opt_end = 0x0;
			return (*ptr + len);
		}
	}
	return NULL;
}
#endif


#ifdef USE_USB_TETHERING
extern int usb_tethering;
#endif


/* Call a script with a par file and env vars */
void run_script(struct dhcpMessage *packet, const char *name)
{
#ifdef DHCPC_USE_SCRIPT
	int pid;
#endif
	char **envp;

#ifdef DHCPC_USE_SCRIPT
	if (client_config.script == NULL)
		return;

	/* call script */
	pid = fork();
	if (pid) {
		waitpid(pid, NULL, 0);
		return;
	} else if (pid == 0) {
		envp = fill_envp(packet);
		
		/* close fd's? */
		
		/* exec script */
		DEBUG(LOG_INFO, "execle'ing %s", client_config.script);
		execle(client_config.script, client_config.script,
		       name, NULL, envp);
		LOG(LOG_ERR, "script %s failed: %s",
		    client_config.script, strerror(errno));
		exit(1);
	}			
#else
	char *interface;

	envp = fill_envp(packet);
	interface = get_env_vars(envp, "interface="); 
	if(!interface)
	{
		fprintf(stderr, "debug: no interface ???\n");
	}

	if(!strcmp( name, "deconfig"))
		set_ifconfig( interface, "0.0.0.0", "255.255.255.0");
	else if( ( !strcmp( name, "renew")) || (!strcmp( name, "bound")))
	{
		char *ip, *subnet, *router, *dns;
                char cur_ip[20], cur_subnet[20], cur_router[20];
		int update = 0;

		get_wan_ipinfo(get_wan_name(interface, 0), cur_ip, cur_subnet, cur_router);

		ip = get_env_vars(envp, "ip=");
		subnet = get_env_vars(envp, "subnet=");

#if	0
		{
			unsigned int checkip; 
			unsigned char ifmac[8];

			checkip = inet_addr(ip);
			get_hardware_address_raw(interface,ifmac);
			arpping(checkip, checkip, ifmac, interface,1);
			arpping(checkip, checkip, ifmac, interface,1);
			sleep(1);
			if(arpping(checkip, checkip, ifmac, interface,0) == 0)
			{
#ifdef USE_SYSTEM_LOG
				syslog_msg( SYSMSG_LOG_INFO, "IP Conflict: %s", ip );
#endif
			}
		}
#endif
                if ((!strcmp( name, "bound")) ||
                    (!strcmp( name, "renew") && (strcmp(ip, cur_ip) || strcmp(subnet, cur_subnet))))
		{
			if(!strcmp(name,"renew"))
				syslog_msg( SYSMSG_LOG_INFO, SYSLOG_CHANGE_DHCP_IP_CONFIG, cur_ip,  cur_subnet, ip, subnet);
			set_ifconfig( interface, ip, subnet);

			update = 1;
		}

#ifdef USE_LGDACOM
		if(update) clear_timed_status();
#endif

#ifdef USE_CONFIG_WIZARD
		wizard_api_set_status(interface, "detected");
#endif
		router = get_env_vars(envp, "router=");

		{
			char router_string[256]; 
			char *rt_ptr, *prev_rt_str;
			struct in_addr in;

			
			if(router) strncpy(router_string, router, 256);
			else strcpy(router_string, "");

			prev_rt_str = router_string;
			do
			{
				rt_ptr = strchr(prev_rt_str,' ');
				if(rt_ptr)
					*rt_ptr = 0x0;

				if(!strncmp(prev_rt_str,"255",3))
				{
#ifdef USE_SYSTEM_LOG	
					syslog_msg( SYSMSG_LOG_INFO, "DHCP Received invalid Router Address: %s", prev_rt_str );
#endif
					if(rt_ptr) prev_rt_str = rt_ptr+1;
					else break;

					continue;
				}
				if(inet_aton( prev_rt_str, &in ) == 0 ) 
					break;

				if(strcmp(prev_rt_str,cur_router))
				{
					if(strcmp(cur_router,""))
						syslog_msg( SYSMSG_LOG_INFO, SYSLOG_CHANGE_DHCP_GATEWAY_ADDR, cur_router, prev_rt_str );

#ifdef USE_DUAL_WAN
					set_default_gateway(interface, prev_rt_str);
#else
#ifdef USE_USB_TETHERING
					if(get_usb_tethering_status())
					{
						set_default_gateway(IF_WAN,NULL);
						set_default_gateway(IF_USB,NULL);
						if(!strcmp(interface,IF_USB))
						{
							system("/sbin/iptables -t nat -D POSTROUTING -o "IF_USB" -j MASQUERADE");
							system("/sbin/iptables -t nat -I POSTROUTING -o "IF_USB" -j MASQUERADE");
						}
					}
#endif

					set_default_gateway(IF_LOCAL,NULL); /* remove IF_LOCAL's gateway first */
					if(set_default_gateway(interface, prev_rt_str))
						set_default_gateway2(interface, ip, subnet, prev_rt_str);
#endif
				}

				/* always break */
				/* first gateway should be applied */
				break;

				if(rt_ptr)
					prev_rt_str = rt_ptr + 1;
				else
					break;
			} while(1);
		}

		if((dns = get_env_vars(envp, "dns=")) != NULL)
		{
			char *dns1 = NULL, *dns2 = NULL, *dns3=NULL;
			char dns_string[128];
#ifdef USE_DUAL_WAN
			char dns_select[128];
#endif
                
			strncpy(dns_string, dns, 128 );
			dns1 = dns_string;
			if((dns2 =  strchr(dns_string,' ')) != NULL)
			{
				*dns2=0x0;
				dns2++;
				if((dns3=strchr(dns2,' ')) != NULL )
					*dns3 =0x0;
			}

#ifdef USE_NEW_LIB
#ifdef USE_USB_TETHERING
			if(get_autodns() || usb_tethering) 
				dhcpd_set_dns(dns1, dns2);
#else
			if(get_autodns()) 
				dhcpd_set_dns(dns1, dns2);
#endif
#else
			if(get_autodns())
				determine_dhcpd_restart(dns1, dns2);
#endif
#ifdef USE_ROUTER_DNS_STATIC
			if(!get_manual_dns_flag(interface, "dynamic"))
			{
				set_dns_shadow(interface,"dynamic", dns1,dns2);
				set_system_dns(!strcmp(interface, IF_WAN)?WAN1_NAME:WAN2_NAME);
			}
#else
#ifdef USE_WIFI_EXTENDER
			if(!strcmp(interface,IF_LOCAL))
				set_dns_shadow(interface,"local",dns1,dns2);
#endif
			set_domain_name_server(dns1,dns2, interface);
#endif

#ifdef USE_MULTI_PLATFORM
			{
				char mode[32];
				if(get_extender_switch(mode) && !strcmp(mode,"extender"))
				{	
					if(!strcmp(interface,IF_LOCAL))
					{		
						set_dns_shadow(interface,"local",dns1,dns2);
						set_domain_name_server(dns1,dns2, interface);
					}
				}
			}
#endif
		}

#ifdef USE_SYSTEM_LOG
		if(!strcmp(name, "bound"))
		{
#ifdef USE_GET_URL
			gu_add_history();
#endif

#ifndef USE_JUST_AP	
#ifdef USE_DUAL_WAN
			syslog_msg( SYSMSG_LOG_INFO, "%s: %s ( %s )", SYSLOG_MSG_DHCPC_RCV_IP, ip, get_wan_name(client_config.interface,1) );
#else
			syslog_msg( SYSMSG_LOG_INFO, "%s: %s", SYSLOG_MSG_DHCPC_RCV_IP, ip );
#endif
#else
			syslog_msg( SYSMSG_LOG_INFO, "%s: %s ( %s )", SYSLOG_MSG_DHCPC_RCV_IP, ip, IF_LOCAL );
			make_virtual_host_page( ip );
#endif


			syslog_set_flag(client_config.interface, 0);
		}
#endif

#ifdef USE_NAT_ONOFF
		if(!strcmp(name,"bound") && !sysconf_nat_get(1))
			make_virtual_host_page( ip );
#endif

#ifdef USE_ISYSD
#ifdef USE_DUAL_WAN
		if (!check_linkmon_conf(NULL, NULL))
#endif
			if(update) 
			{
				signal_wan();
#ifdef USE_KT_SPEED_TEST
                                        signal_start("ktspeedtest");
#endif
			}	
#endif

	}
	else if(!strcmp( name, "nak"))
	{
	}

	{
 		char *discovery;

		discovery = get_env_vars(envp, "discovery=");
		if(discovery && strcmp(discovery,"0"))
		{
#ifdef USE_FS_OPTIMIZED
			istatus_set_intvalue_direct("icmp_solicite", 1 );
#else
				write_file("/var/run/icmp_solicite", "1");
#endif
#ifdef USE_SYSTEM_LOG
				syslog_msg( SYSMSG_LOG_INFO, "DHCP Discovery On");
#endif
		}
		else
#ifdef USE_FS_OPTIMIZED
			istatus_set_intvalue_direct("icmp_solicite", 0 );
#else
			write_file("/var/run/icmp_solicite", "0");
#endif
	}



#endif
}
