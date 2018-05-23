/* dhcpd.c
 *
 * udhcp Server
 * Copyright (C) 1999 Matthew Ramsay <matthewr@moreton.com.au>
 *			Chris Trew <ctrew@moreton.com.au>
 *
 * Rewrite by Russ Dill <Russ.Dill@asu.edu> July 2001
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

#include <fcntl.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>
#include <sys/ioctl.h>
#include <time.h>
#include <sys/time.h>
#include <sys/param.h>

#include "debug.h"
#include "dhcpd.h"
#include "arpping.h"
#include "socket.h"
#include "options.h"
#include "files.h"
#include "leases.h"
#include "packet.h"
#include "serverpacket.h"
#include "pidfile.h"


/* globals */
struct dhcpOfferedAddr *leases;
struct server_config_t server_config;
static int signal_pipe[2];
/* ysyoo. 2003.5.28, static leases */
struct dhcpOfferedStaticAddr *static_leases;

/* Exit and cleanup */
static void exit_server(int retval)
{
	pidfile_delete(server_config.pidfile);
	CLOSE_LOG();
	exit(retval);
}


/* Signal handler */
static void signal_handler(int sig)
{
	if (send(signal_pipe[1], &sig, sizeof(sig), MSG_DONTWAIT) < 0) {
		LOG(LOG_ERR, "Could not send signal: %s", 
			strerror(errno));
	}
}

#ifndef NR_OPEN
#define NR_OPEN 10
#endif

#ifdef USE_WL_IPTIME_HELPER
int helper_dhcpd;
#endif

#ifdef COMBINED_BINARY	
int udhcpd_main(int argc, char *argv[])
#else
int main(int argc, char *argv[])
#endif
{	
	int i;
	fd_set rfds;
	struct timeval tv;
	int server_socket = -1;
	int bytes, retval;
	struct dhcpMessage packet;
	unsigned char *state;
	unsigned char *server_id, *requested;
	u_int32_t server_id_align, requested_align, static_lease_ip;
	unsigned long timeout_end;
	struct option_set *option;
	struct dhcpOfferedAddr *lease;
	int pid_fd;
	int max_sock;
	int sig;
	int opt_len;
	
#ifdef GLOBAL_INIT_PROBLEM
	init_config_keyword();
#endif
	for( i = 0 ; i < NR_OPEN; i++ )
	{
		if( i!=2)
			close(i);
	}
	setpgid(0, getpid());

	OPEN_LOG("udhcpd");
	LOG(LOG_INFO, "udhcp server (v%s) started", VERSION);

	memset(&server_config, 0, sizeof(struct server_config_t));
	
#ifdef ARCH_TIME
	/* for compatiblity of previos vesion */
	//argc = 1;
#endif
	if (argc < 2)
		read_config(DHCPD_CONF_FILE);
	else read_config(argv[1]);

#ifdef USE_REAL_IPCLONE 
	{
		char ip_addr[20], netmask[20];
		get_ifconfig( server_config.interface, ip_addr, netmask ); 
		server_config.sys_netmask = htonl(inet_addr(netmask)); 
		//server_config.sys_netmask = 0xffffff00; 
		//syslog_msg(1,"-------> Netmask : %08x", server_config.sys_netmask );
	}
#endif

#ifdef USE_NEW_LIB
#ifdef USE_WL_IPTIME_HELPER
        if (strstr(argv[0],"dhcpd.helper"))
	{
		helper_dhcpd=1;
		create_pid("dhcpd.helper");
	}
	else
#endif
		create_pid("dhcpd");
#else
	pid_fd = pidfile_acquire(server_config.pidfile);
	pidfile_write_release(pid_fd);
#endif

	if ((option = find_option(server_config.options, DHCP_LEASE_TIME))) {
		memcpy(&server_config.lease, option->data + 2, 4);
		server_config.lease = ntohl(server_config.lease);
	}
	else server_config.lease = LEASE_TIME;
	
	leases = malloc(sizeof(struct dhcpOfferedAddr) * server_config.max_leases);
	memset(leases, 0, sizeof(struct dhcpOfferedAddr) * server_config.max_leases);
	read_leases(server_config.lease_file);

	/* ysyoo. 2003.5.28. static leases */
	static_leases = malloc(sizeof(struct dhcpOfferedStaticAddr) * server_config.max_static);
	memset(static_leases, 0, sizeof(struct dhcpOfferedStaticAddr) * server_config.max_static);
	read_static_leases(server_config.static_lease_file);

#ifdef DEBUGGING
	for( i = 0 ; i < server_config.max_static; i++ )
	{
		int j;
		fprintf(stderr, "HW address - ");
                for (j = 0; j < 6; j++) {
                        fprintf(stderr, "%02x", static_leases[i].chaddr[j]);
                        if (j != 5) printf(":");
                }
		fprintf(stderr,"\n");
	}
#endif

	if (read_interface(server_config.interface, &server_config.ifindex,
			   &server_config.server, server_config.arp) < 0)
		exit_server(1);

#ifndef DEBUGGING
#if 0
	pid_fd = pidfile_acquire(server_config.pidfile); /* hold lock during fork. */
	if (daemon(0, 0) == -1) {
		perror("fork");
		exit_server(1);
	}
	pidfile_write_release(pid_fd);
#endif
#endif


	socketpair(AF_UNIX, SOCK_STREAM, 0, signal_pipe);
	signal(SIGUSR1, signal_handler);
	signal(SIGTERM, signal_handler);

	timeout_end = time(0) + server_config.auto_time;
	while(1) { /* loop until universe collapses */

		if (server_socket < 0)
			if ((server_socket = listen_socket(INADDR_ANY, SERVER_PORT, server_config.interface)) < 0) {
				LOG(LOG_ERR, "FATAL: couldn't create server socket, %s", strerror(errno));
				exit_server(0);
			}			

		FD_ZERO(&rfds);
		FD_SET(server_socket, &rfds);
		FD_SET(signal_pipe[0], &rfds);
		if (server_config.auto_time) {
			tv.tv_sec = timeout_end - time(0);
			tv.tv_usec = 0;
		}

		if (!server_config.auto_time || tv.tv_sec > 0) {
			max_sock = server_socket > signal_pipe[0] ? server_socket : signal_pipe[0];
			retval = select(max_sock + 1, &rfds, NULL, NULL, 
					server_config.auto_time ? &tv : NULL);
		} else retval = 0; /* If we already timed out, fall through */

		if (retval == 0) {
			write_leases();
			timeout_end = time(0) + server_config.auto_time;
			continue;
		} else if (retval < 0 && errno != EINTR) {
			DEBUG(LOG_INFO, "error on select");
			continue;
		}
		
		if (FD_ISSET(signal_pipe[0], &rfds)) {
			if (read(signal_pipe[0], &sig, sizeof(sig)) < 0)
				continue; /* probably just EINTR */
			switch (sig) {
			case SIGUSR1:
				LOG(LOG_INFO, "Received a SIGUSR1");
				write_leases();
				/* why not just reset the timeout, eh */
				timeout_end = time(0) + server_config.auto_time;
				continue;
			case SIGTERM:
				LOG(LOG_INFO, "Received a SIGTERM");
				exit_server(0);
			}
		}

		if ((bytes = get_packet(&packet, server_socket)) < 0) { /* this waits for a packet - idle */
			if (bytes == -1 && errno != EINTR) {
				DEBUG(LOG_INFO, "error on read, %s, reopening socket", strerror(errno));
				close(server_socket);
				server_socket = -1;
			}
			continue;
		}

#ifdef USE_DHCP_AUTO_DETECT
		if(get_dhcp_auto_detect_status(server_config.interface))
			continue;
#endif
		if ((state = get_option(&packet, DHCP_MESSAGE_TYPE, &opt_len)) == NULL) {
			DEBUG(LOG_ERR, "couldn't get option from packet, ignoring");
			continue;
		}
		
		/* ADDME: look for a static lease */
		lease = find_lease_by_chaddr(packet.chaddr);


		switch (state[0]) {
		case DHCPDISCOVER:
			DEBUG(LOG_INFO,"received DISCOVER");
			
			if (sendOffer(&packet) < 0) {
				LOG(LOG_ERR, "send OFFER failed");
			}
			write_leases();
			break;			
 		case DHCPREQUEST:
			DEBUG(LOG_INFO, "received REQUEST");

			requested = get_option(&packet, DHCP_REQUESTED_IP, &opt_len);
			server_id = get_option(&packet, DHCP_SERVER_ID, &opt_len);

			if (requested) memcpy(&requested_align, requested, 4);
			if (server_id) memcpy(&server_id_align, server_id, 4);
		
			if (lease) { /*ADDME: or static lease */

#ifdef USE_REAL_IPCLONE 
// ignore DHCP Request with 'requested ip' option if ipclone is on client and requested ip is local.
				char buf[12];
				if (requested && check_ipclone_ipaddr(packet.chaddr, buf) && 
				    ((htonl(requested_align)&server_config.sys_netmask) == (htonl(server_config.start)&server_config.sys_netmask))) {
					sendNAK(&packet);
				} else	
// ignore DHCP Request with 'requested ip' option if ipclone is off client and requested ip is not local.
				if (requested && !check_ipclone_ipaddr(packet.chaddr, buf) && 
				    ((htonl(requested_align)&server_config.sys_netmask) != (htonl(server_config.start)&server_config.sys_netmask))) {
					sendNAK(&packet);
				} else	
#endif
				if (server_id) {
					/* SELECTING State */
					DEBUG(LOG_INFO, "server_id = %08x", ntohl(server_id_align));
					if (server_id_align == server_config.server && requested && 
					    requested_align == lease->yiaddr) {
						sendACK(&packet, lease->yiaddr);
					}
				} else {
					if (requested) {
						/* INIT-REBOOT State */
						if (lease->yiaddr == requested_align)
							sendACK(&packet, lease->yiaddr);
						else sendNAK(&packet);
					} else {
						/* RENEWING or REBINDING State */
						if (lease->yiaddr == packet.ciaddr)
							sendACK(&packet, lease->yiaddr);
						else {
							/* don't know what to do!!!! */
							sendNAK(&packet);
						}
					}						
				}
			
			/* what to do if we have no record of the client */
			} else if (server_id) {
				/* SELECTING State */

			} else if (requested) {
				static_lease_ip = find_static_lease_by_chaddr(packet.chaddr);
				if (static_lease_ip && (static_lease_ip != requested_align))
					; /* do nothing */
				/* INIT-REBOOT State */
				else if ((lease = find_lease_by_yiaddr(requested_align))) {
					if (lease_expired(lease)) {
						/* probably best if we drop this lease */
						memset(lease->chaddr, 0, 16);
					/* make some contention for this address */
					} else sendNAK(&packet);
				} else if (ntohl(requested_align) < ntohl(server_config.start) || 
					   ntohl(requested_align) > ntohl(server_config.end)) {
					sendNAK(&packet);
				} 
				/* ysyoo, 2007-12-31,  requested ip is other's ip */
				else if (find_static_lease_by_yiaddr(requested_align))
				{
					sendNAK(&packet);
				} 
				/* else remain silent */
				else
				{
					sendACK(&packet, requested_align);
				}

			} else {
				 /* RENEWING or REBINDING State */
				/* added by scchoi 2006-02-06 */ 
				sendNAK(&packet);
			}
			write_leases();
			break;
		case DHCPDECLINE:
			DEBUG(LOG_INFO,"received DECLINE");
			if (lease) {
				memset(lease->chaddr, 0, 16);
				lease->expires = time(0) + server_config.decline_time;
			}			
			break;
		case DHCPRELEASE:
			DEBUG(LOG_INFO,"received RELEASE");
			if (lease) lease->expires = time(0);
			write_leases();

#ifdef USE_DHCP_ACCESS_POLICY
		        if(get_dhcp_access_policy()) remove_dhcp_access_host(packet.chaddr);
#endif
			break;
		case DHCPINFORM:
			DEBUG(LOG_INFO,"received INFORM");
			send_inform(&packet);
			break;	
		default:
			LOG(LOG_WARNING, "unsupported DHCP message (%02x) -- ignoring", state[0]);
		}
	}

	return 0;
}

