/* dhcpc.c
 *
 * udhcp DHCP client
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
 
#include <stdio.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/file.h>
#include <unistd.h>
#include <getopt.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <signal.h>
#include <time.h>
#include <string.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <errno.h>

#include "dhcpd.h"
#include "dhcpc.h"
#include "options.h"
#include "clientpacket.h"
#include "packet.h"
#include "script.h"
#include "socket.h"
#include "debug.h"
#include "pidfile.h"

#ifdef USE_SYSTEM_LOG
#include <syslog_msg.h>
#endif
static int state;
static unsigned long requested_ip; /* = 0 */
static unsigned long server_addr;
static unsigned long timeout;
static int packet_num; /* = 0 */
static int fd;
static int signal_pipe[2];

#define LISTEN_NONE 0
#define LISTEN_KERNEL 1
#define LISTEN_RAW 2
static int listen_mode;

#define DEFAULT_SCRIPT	"/usr/share/udhcpc/default.script"



#ifdef USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER 
int check_private_ip(char *ifname, struct dhcpMessage *packet );
#endif

static int makeip(char *dest, unsigned char *ip) {
        return sprintf(dest, "%d.%d.%d.%d ", ip[0], ip[1], ip[2], ip[3]);
}


struct client_config_t client_config = {
	/* Default options. */
	abort_if_no_lease: 0,
	foreground: 0,
	quit_after_lease: 0,
	background_if_no_lease: 0,
	interface: IF_LOCAL,
	pidfile: NULL,
	script: DEFAULT_SCRIPT,
	clientid: NULL,
	hostname: NULL,
	ifindex: 0,
	arp: "\0\0\0\0\0\0",		/* appease gcc-3.0 */
};

#ifdef GLOBAL_INIT_PROBLEM
int _code_base;
void init_client_config(void) 
{
	client_config.interface = IF_LOCAL;
	client_config.script =  DEFAULT_SCRIPT;
}
#endif

#ifndef BB_VER
static void show_usage(void)
{
	printf(
"Usage: udhcpc [OPTIONS]\n\n"
"  -c, --clientid=CLIENTID         Client identifier\n"
"  -H, --hostname=HOSTNAME         Client hostname\n"
"  -h                              Alias for -H\n"
"  -f, --foreground                Do not fork after getting lease\n"
"  -b, --background                Fork to background if lease cannot be\n"
"                                  immediately negotiated.\n"
"  -i, --interface=INTERFACE       Interface to use (default: eth0)\n"
"  -n, --now                       Exit with failure if lease cannot be\n"
"                                  immediately negotiated.\n"
"  -p, --pidfile=file              Store process ID of daemon in file\n"
"  -q, --quit                      Quit after obtaining lease\n"
"  -r, --request=IP                IP address to request (default: none)\n"
"  -s, --script=file               Run file at dhcp events (default:\n"
"                                  " DEFAULT_SCRIPT ")\n"
"  -v, --version                   Display version\n"
	);
	exit(0);
}
#endif


/* just a little helper */
static void change_mode(int new_mode)
{
	DEBUG(LOG_INFO, "entering %s listen mode",
		new_mode ? (new_mode == 1 ? "kernel" : "raw") : "none");
	close(fd);
	fd = -1;
	listen_mode = new_mode;
}


/* perform a renew */
static void perform_renew(void)
{
	LOG(LOG_INFO, "Performing a DHCP renew");
	switch (state) {
	case BOUND:
		change_mode(LISTEN_KERNEL);
	case RENEWING:
	case REBINDING:
		state = RENEW_REQUESTED;
		break;
	case RENEW_REQUESTED: /* impatient are we? fine, square 1 */
		run_script(NULL, "deconfig");
	case REQUESTING:
	case RELEASED:
		change_mode(LISTEN_RAW);
		state = INIT_SELECTING;
		break;
	case INIT_SELECTING:
		break;
	}

	/* start things over */
	packet_num = 0;

	/* Kill any timeouts because the user wants this to hurry along */
	timeout = 0;
}


/* perform a release */
static void perform_release(void)
{
	char buffer[16];
	struct in_addr temp_addr;

	/* send release packet */
	if (state == BOUND || state == RENEWING || state == REBINDING) {
		temp_addr.s_addr = server_addr;
		sprintf(buffer, "%s", inet_ntoa(temp_addr));
		temp_addr.s_addr = requested_ip;
		LOG(LOG_INFO, "Unicasting a release of %s to %s", 
				inet_ntoa(temp_addr), buffer);
		send_release(server_addr, requested_ip); /* unicast */
		run_script(NULL, "deconfig");
	}
	LOG(LOG_INFO, "Entering released state");

	change_mode(LISTEN_NONE);
	state = RELEASED;
	timeout = 0x7fffffff;
}


/* Exit and cleanup */
static void exit_client(int retval)
{
#ifdef USE_NEW_LIB
	delete_pid(client_config.pidfile);
#else
	pidfile_delete(client_config.pidfile);
#endif
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


static void background(void)
{
#ifdef USE_NEW_LIB
	create_pid(client_config.pidfile);
#else
	int pid_fd;
#ifndef UCLINUX 
	pid_fd = pidfile_acquire(client_config.pidfile); /* hold lock during fork. */
	while (pid_fd >= 0 && pid_fd < 3) pid_fd = dup(pid_fd); /* don't let daemon close it */
	if (daemon(0, 0) == -1) {
		perror("fork");
		exit_client(1);
	}
	client_config.foreground = 1; /* Do not fork again. */
	pidfile_write_release(pid_fd);
#endif
#endif
}

#ifdef USE_CONFIG_WIZARD	
int wizard_timeout;
#endif

#ifdef USE_USB_TETHERING
int usb_tethering;
#endif
#ifdef USE_DHCP_AUTO_DETECT
int dhclient_chk;
#endif



#ifdef COMBINED_BINARY
int udhcpc_main(int argc, char *argv[])
#else
int main(int argc, char *argv[])
#endif
{
	unsigned char *temp, *message;
	unsigned long t1 = 0, t2 = 0, xid = 0;
	unsigned long start = 0, lease;
	fd_set rfds;
	int retval;
	struct timeval tv;
	int c, len;
	struct dhcpMessage packet;
	struct in_addr temp_addr;
	int pid_fd;
	time_t now;
	int max_fd;
	int sig;
#if defined USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER || defined USE_DHCP_CHECK_SAME_SUBNET
	unsigned int chk_ip;
#endif
	int opt_len;

	static struct option arg_options[] = {
		{"clientid",	required_argument,	0, 'c'},
		{"foreground",	no_argument,		0, 'f'},
		{"background",	no_argument,		0, 'b'},
		{"hostname",	required_argument,	0, 'H'},
		{"hostname",    required_argument,      0, 'h'},
		{"interface",	required_argument,	0, 'i'},
		{"now", 	no_argument,		0, 'n'},
		{"pidfile",	required_argument,	0, 'p'},
		{"quit",	no_argument,		0, 'q'},
		{"request",	required_argument,	0, 'r'},
		{"script",	required_argument,	0, 's'},
		{"version",	no_argument,		0, 'v'},
		{"help",	no_argument,		0, '?'},
		{0, 0, 0, 0}
	};

#ifdef USE_MULTI_PLATFORM
	char extmode[32];	
	int extender_mode=0;

	get_extender_switch(extmode);
	if(!strcmp(extmode,"extender"))
		extender_mode = 1;
#endif

#ifdef GLOBAL_INIT_PROBLEM
	init_client_config();
#endif
#ifdef USE_USB_TETHERING
	if(!strcmp(argv[0],"/sbin/usbdhclient"))
	{
		fprintf(stderr,"Start USB Tethering DHCLIENT\n");
		usb_tethering=1;
	}
#endif
#ifdef USE_DHCP_AUTO_DETECT
	if(!strcmp(argv[0],"/sbin/dhclientchk"))
	{
		fprintf(stderr,"Start DHCLIENT for Checking\n");
		dhclient_chk=1;
	}
#endif


	/* get options */
	while (1) {
		int option_index = 0;
		c = getopt_long(argc, argv, "c:fbH:h:i:np:qr:s:v", arg_options, &option_index);
		if (c == -1) break;
		
		switch (c) {
		case 'c':
			len = strlen(optarg) > 255 ? 255 : strlen(optarg);
			if (client_config.clientid) free(client_config.clientid);
			client_config.clientid = xmalloc(len + 2);
			client_config.clientid[OPT_CODE] = DHCP_CLIENT_ID;
			client_config.clientid[OPT_LEN] = len;
			client_config.clientid[OPT_DATA] = '\0';
			strncpy(client_config.clientid + OPT_DATA, optarg, len);
			break;
		case 'f':
			client_config.foreground = 1;
			break;
		case 'b':
			client_config.background_if_no_lease = 1;
			break;
		case 'h':
		case 'H':
			len = strlen(optarg) > 255 ? 255 : strlen(optarg);
			if (client_config.hostname) free(client_config.hostname);
			client_config.hostname = xmalloc(len + 2);
			client_config.hostname[OPT_CODE] = DHCP_HOST_NAME;
			client_config.hostname[OPT_LEN] = len;
			strncpy(client_config.hostname + 2, optarg, len);
			break;
		case 'i':
			client_config.interface =  optarg;
			break;
		case 'n':
			client_config.abort_if_no_lease = 1;
			break;
		case 'p':
			client_config.pidfile = optarg;
			break;
		case 'q':
			client_config.quit_after_lease = 1;
			break;
		case 'r':
			requested_ip = inet_addr(optarg);
			break;
		case 's':
			client_config.script = optarg;
			break;
		case 'v':
			printf("udhcpcd, version %s\n\n", VERSION);
			exit_client(0);
			break;
		default:
			show_usage();
		}
	}

	OPEN_LOG("udhcpc");
	LOG(LOG_INFO, "udhcp client (v%s) started", VERSION);

#ifdef USE_NEW_LIB
	create_pid(client_config.pidfile);
#else
	pid_fd = pidfile_acquire(client_config.pidfile);
	pidfile_write_release(pid_fd);
#endif

	if (read_interface(client_config.interface, &client_config.ifindex, 
			   NULL, client_config.arp) < 0)
		exit_client(1);
		
	if (!client_config.clientid) {
		client_config.clientid = xmalloc(6 + 3);
		client_config.clientid[OPT_CODE] = DHCP_CLIENT_ID;
		client_config.clientid[OPT_LEN] = 7;
		client_config.clientid[OPT_DATA] = 1;
		memcpy(client_config.clientid + 3, client_config.arp, 6);
	}

	/* setup signal handlers */
	socketpair(AF_UNIX, SOCK_STREAM, 0, signal_pipe);
	signal(SIGUSR1, signal_handler);
	signal(SIGUSR2, signal_handler);
	signal(SIGTERM, signal_handler);
	
	state = INIT_SELECTING;

#ifdef USE_DHCP_AUTO_DETECT
#ifdef USE_MULTI_PLATFORM
	if(extender_mode)	
		run_script(NULL, "deconfig");
	else
#endif
	if(!dhclient_chk)
		run_script(NULL, "deconfig");
#else
	run_script(NULL, "deconfig");
#endif
	change_mode(LISTEN_RAW);

	for (;;) {

		tv.tv_sec = timeout - time(0);
		tv.tv_usec = 0;

		/* 2006-07-02 , scchoi, time update workaround */ 
		/* 2008-01-14 , scchoi, timeout added for FTTH env */
		if(tv.tv_sec < 0 && timeout) tv.tv_sec = 1;

		FD_ZERO(&rfds);

		if (listen_mode != LISTEN_NONE && fd < 0) {
			if (listen_mode == LISTEN_KERNEL)
				fd = listen_socket(INADDR_ANY, CLIENT_PORT, client_config.interface);
			else
				fd = raw_socket(client_config.ifindex);
			if (fd < 0) {
				LOG(LOG_ERR, "FATAL: couldn't listen on socket, %s", strerror(errno));
				exit_client(0);
			}
		}
		if (fd >= 0) FD_SET(fd, &rfds);
		FD_SET(signal_pipe[0], &rfds);		

		if (tv.tv_sec > 0) {
			DEBUG(LOG_INFO, "Waiting on select...\n");
			max_fd = signal_pipe[0] > fd ? signal_pipe[0] : fd;
			retval = select(max_fd + 1, &rfds, NULL, NULL, &tv);
		} else retval = 0; /* If we already timed out, fall through */

		now = time(0);
		if (retval == 0) {
			/* timeout dropped to zero */
			switch (state) {
			case INIT_SELECTING:
				if (packet_num < 3) {
					if (packet_num == 0)
						xid = random_xid();

					/* send discover packet */
					send_discover(xid, requested_ip); /* broadcast */
					
					timeout = now + ((packet_num == 2) ? 4 : 2);
					packet_num++;
				} else {
					if (client_config.background_if_no_lease) {
						LOG(LOG_INFO, "No lease, forking to background.");
						background();
					} else if (client_config.abort_if_no_lease) {
						LOG(LOG_INFO, "No lease, failing.");
						exit_client(1);
				  	}
					/* wait to try again */
					packet_num = 0;
#if 0
					timeout = now + 60;
#else
					timeout = now + 20;
#endif
#ifdef USE_CONFIG_WIZARD	
					wizard_timeout++;
					if(wizard_timeout >= 2 ) 
						wizard_api_set_status(client_config.interface, "timeout");
#endif
#ifdef USE_DHCP_AUTO_DETECT

#ifdef USE_MULTI_PLATFORM
					if(!extender_mode)	
					{
#endif
					if(dhclient_chk)
					{
#ifdef USE_SYSTEM_LOG
						if(get_dhcp_auto_detect_status(client_config.interface)) syslog_msg( SYSMSG_LOG_INFO, SYSLOG_MSG_DHCP_SERVER_RESUME );
#endif
						set_dhcp_auto_detect_status(client_config.interface,0);
						exit_client(0);
					}
#endif

#ifdef USE_SYSTEM_LOG
					if(!syslog_get_flag(client_config.interface))
					{
						syslog_set_flag(client_config.interface, 1);
						syslog_msg( SYSMSG_LOG_INFO, "%s ( %s )", SYSLOG_MSG_DHCPC_SERVER_TIMEOUT, get_wan_name(client_config.interface,1));
					}

#ifdef USE_MULTI_PLATFORM
					}	
#endif
#endif
				}
				break;
			case RENEW_REQUESTED:
			case REQUESTING:
				if (packet_num < 3) {
					/* send request packet */
					if (state == RENEW_REQUESTED)
					{
						xid = random_xid();
						send_renew(xid, server_addr, requested_ip); /* unicast */
					}
					else send_selecting(xid, server_addr, requested_ip); /* broadcast */
					
					timeout = now + ((packet_num == 2) ? 10 : 2);
					packet_num++;
				} else {
					/* timed out, go back to init state */
					if (state == RENEW_REQUESTED) run_script(NULL, "deconfig");
					state = INIT_SELECTING;
					timeout = now;
					packet_num = 0;
					change_mode(LISTEN_RAW);
				}
				break;
			case BOUND:
				/* Lease is starting to run out, time to enter renewing state */
				state = RENEWING;
				change_mode(LISTEN_KERNEL);
				DEBUG(LOG_INFO, "Entering renew state");
				/* fall right through */
			case RENEWING:
				/* Either set a new T1, or enter REBINDING state */
				if ((t2 - t1) <= (lease / 14400 + 1)) {
					/* timed out, enter rebinding state */
					state = REBINDING;
					timeout = now + (t2 - t1);
					DEBUG(LOG_INFO, "Entering rebinding state");
				} else {
					/* send a request packet */
					xid = random_xid();
					send_renew(xid, server_addr, requested_ip); /* unicast */
					
					t1 = (t2 - t1) / 2 + t1;
					timeout = t1 + start;
				}
				break;
			case REBINDING:
				/* Either set a new T2, or enter INIT state */
				if ((lease - t2) <= (lease / 14400 + 1)) {
					/* timed out, enter init state */
					state = INIT_SELECTING;
					LOG(LOG_INFO, "Lease lost, entering init state");


#ifdef USE_ISYSD
#ifdef USE_DUAL_WAN
			                if (!check_linkmon_conf(NULL, NULL))
#endif
                       				 signal_wan();
#endif

#ifdef USE_SYSTEM_LOG
					syslog_msg( SYSMSG_LOG_INFO, "%s( %s )", SYSLOG_MSG_DHCPC_LEASE, get_wan_name(client_config.interface, 1));
#endif

					run_script(NULL, "deconfig");
					timeout = now;
					packet_num = 0;
					change_mode(LISTEN_RAW);
				} else {
					/* send a request packet */
					xid = random_xid();
					send_renew(xid, 0, requested_ip); /* broadcast */

					t2 = (lease - t2) / 2 + t2;
					timeout = t2 + start;
				}
				break;
			case RELEASED:
				/* yah, I know, *you* say it would never happen */
				timeout = 0x7fffffff;
				break;
			}
		} else if (retval > 0 && listen_mode != LISTEN_NONE && FD_ISSET(fd, &rfds)) {
			/* a packet is ready, read it */
			
			if (listen_mode == LISTEN_KERNEL)
				len = get_packet(&packet, fd);
			else len = get_raw_packet(&packet, fd);
			
			if (len == -1 && errno != EINTR) {
				DEBUG(LOG_INFO, "error on read, %s, reopening socket", strerror(errno));
				change_mode(listen_mode); /* just close and reopen */
			}
			if (len < 0) continue;
			
			if (packet.xid != xid) {
				DEBUG(LOG_INFO, "Ignoring XID %lx (our xid is %lx)",
					(unsigned long) packet.xid, xid);
				continue;
			}

#ifdef USE_DHCP_AUTO_DETECT
#ifdef USE_MULTI_PLATFORM
			if(!extender_mode)
			{
#endif
			if(dhclient_chk)
			{
				//if(get_dhcp_auto_detect())
				{
// fprintf(stderr,"DHCP SERVER AUTO DETECTED\n");
 					char *ptr;

#ifdef USE_SYSTEM_LOG
					if(!get_dhcp_auto_detect_status(client_config.interface))
						syslog_msg( SYSMSG_LOG_INFO, SYSLOG_MSG_DHCP_SERVER_SUSPENDED );
#endif

					set_dhcp_auto_detect_status(client_config.interface,1);
 
        			 	ptr = get_option(&packet, DHCP_SUBNET, &opt_len); /* get subnet mask option */
					if(ptr)
					{
						char wanip[32],wanmask[32], router[32], dnsserver[32];

						makeip(wanip,(unsigned char *)&packet.yiaddr);
						makeip(wanmask,ptr);

						ptr = get_option(&packet, DHCP_ROUTER, &opt_len);
						if (ptr) makeip(router,ptr);
						else strcpy(router, "null");

						ptr = get_option(&packet, DHCP_DNS_SERVER, &opt_len);
						if (ptr) makeip(dnsserver, ptr);
						else strcpy(dnsserver, "null");

						set_dhcp_chk_info(client_config.interface,wanip,wanmask, router, dnsserver);
					}
				}
				//else
				//	set_dhcp_auto_detect_status(client_config.interface,0);
				exit_client(0);
			}

#ifdef USE_MULTI_PLATFORM
			}
#endif

#endif
			if ((message = get_option(&packet, DHCP_MESSAGE_TYPE, &opt_len)) == NULL) {
				DEBUG(LOG_ERR, "couldnt get option from packet -- ignoring");
				continue;
			}
			
			switch (state) {
			case INIT_SELECTING:
				/* Must be a DHCPOFFER to one of our xid's */
				if (*message == DHCPOFFER) {
					if ((temp = get_option(&packet, DHCP_SERVER_ID, &opt_len))) {

#if defined USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER || defined USE_DHCP_CHECK_SAME_SUBNET
						memcpy(&chk_ip, temp, 4);
						if(!check_private_ip(client_config.interface, &packet))
						{
#endif
						memcpy(&server_addr, temp, 4);
						{
							struct in_addr in;
							in.s_addr = server_addr;
							istatus_set_value_direct("dhcpserver", inet_ntoa(in));
						}
						xid = packet.xid;
						requested_ip = packet.yiaddr;
						
						/* enter requesting state */
						state = REQUESTING;
						timeout = now;
						packet_num = 0;
#if defined USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER || defined USE_DHCP_CHECK_SAME_SUBNET
						}
#endif



					} else {
						DEBUG(LOG_ERR, "No server ID in message");
					}
				}
				break;
			case RENEW_REQUESTED:
			case REQUESTING:
			case RENEWING:
			case REBINDING:
				if (*message == DHCPACK) {
					if (!(temp = get_option(&packet, DHCP_LEASE_TIME, &opt_len))) {
						LOG(LOG_ERR, "No lease time with ACK, using 1 hour lease");
						lease = 60 * 60;
					} else {
						memcpy(&lease, temp, 4);
						lease = ntohl(lease);
					}

					set_dhcp_lease_time(client_config.interface, lease);
						
					/* enter bound state */
					t1 = lease / 2;
					
					/* little fixed point for n * .875 */
					t2 = (lease * 0x7) >> 3;
					temp_addr.s_addr = packet.yiaddr;
					LOG(LOG_INFO, "Lease of %s obtained, lease time %ld", 
						inet_ntoa(temp_addr), lease);
					start = now;
					timeout = t1 + start;
					requested_ip = packet.yiaddr;
					run_script(&packet,
						   ((state == RENEWING || state == REBINDING) ? "renew" : "bound"));

					state = BOUND;
					change_mode(LISTEN_NONE);
					if (client_config.quit_after_lease) 
						exit_client(0);
					if (!client_config.foreground)
						background();

				} else if (*message == DHCPNAK) {
					/* return to init state */
					LOG(LOG_INFO, "Received DHCP NAK");
					run_script(&packet, "nak");
					if (state != REQUESTING)
						run_script(NULL, "deconfig");
					state = INIT_SELECTING;
					timeout = now;
					requested_ip = 0;
					packet_num = 0;
					change_mode(LISTEN_RAW);
					sleep(3); /* avoid excessive network traffic */
				}
				break;
			/* case BOUND, RELEASED: - ignore all packets */
			}	
		} else if (retval > 0 && FD_ISSET(signal_pipe[0], &rfds)) {
			sig = 0;
#ifdef USE_BCM5354
			/* sizeof(signal) is 1 in some system */
			if (read(signal_pipe[0], &sig, 4) < 0) {
#else
			/* Check it in other system */
			if (read(signal_pipe[0], &sig, sizeof(signal)) < 0) {
#endif
				DEBUG(LOG_ERR, "Could not read signal: %s", 
					strerror(errno));
				continue; /* probably just EINTR */
			}
			switch (sig) {
			case SIGUSR1: 
				perform_renew();
				break;
			case SIGUSR2:
				perform_release();
				break;
			case SIGTERM:
				LOG(LOG_INFO, "Received SIGTERM");
				exit_client(0);
			}
		} else if (retval == -1 && errno == EINTR) {
			/* a signal was caught */		
		} else {
			/* An error occured */
			DEBUG(LOG_ERR, "Error on select");
		}
		
	}
	return 0;
}


#if defined USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER || defined USE_DHCP_CHECK_SAME_SUBNET

#define A_CLASS_PREFIX 0xff000000
#define A_CLASS_PRVIATE_IP 0x0a000000 /*10.0.0.0 */

#define B_CLASS_PREFIX 0xfff00000
#define B_CLASS_PRVIATE_IP 0xac100000 /* 172.16.0.0 */

#define C_CLASS_PREFIX 0xffff0000
#define C_CLASS_PRVIATE_IP 0xc0a80000 /* 192.168.0.0 */

static int check_same_network2(char *ip1str,char *ip1mask, char *ip2str, char *ip2mask)
{
        unsigned int ip1, ip2, mask1,mask2;

        ip1 = inet_addr(ip1str);
        ip2 = inet_addr(ip2str);
        mask1= inet_addr(ip1mask);
        mask2= inet_addr(ip2mask);

        return ((htonl(ip1) & htonl(mask1)) ==  (htonl(ip2) & htonl(mask2)));
}

#ifdef USE_CHANGE_LOCAL_IP_BY_WAN_SUBNET
int change_lan_ip_config_by_wan_subnet(char *lanip,char *lanmask)
{
	dhcpd_conf_t dc;	
        unsigned int i_lanip,i_lanmask, i_netaddr, mask_shift;
	int i;	
	struct in_addr i_newip;
	char *new_lanip;	

        i_lanip=inet_addr(lanip);
        i_lanmask=inet_addr(lanmask);

	for(mask_shift=0;mask_shift<32;mask_shift++) 
		if(i_lanmask & (0x1<<mask_shift))
			break;
	printf("i_lanmask -->%08x\n", i_lanmask);
	printf("MASK SHIFT-->%d\n", mask_shift);

	if(mask_shift>=32) return -1;
	if(mask_shift==0) return -1;


	i_netaddr=(i_lanip&i_lanmask);
	i_netaddr=(i_netaddr>>mask_shift);
	i_netaddr--;
	i_netaddr=(i_netaddr<<mask_shift);

	i_newip.s_addr=i_netaddr+1;
	new_lanip=inet_ntoa(i_newip);
	if(!new_lanip) return -1;

	printf("NEW LAN IP -> %s\n",new_lanip);

	set_lan_ipconfig(new_lanip, lanmask, NULL);
	dhcpd_read_config(&dc);
	strcpy(dc.gw,new_lanip);
	get_subnet_range(new_lanip, lanmask, dc.sip, dc.eip);
	

	dhcpd_commit_config(&dc);
	dhcpd_flush_dynamic_lease();


        return 0;
}

#endif

int check_private_ip(char *ifname, struct dhcpMessage *packet )
{
	char lanip[32], lanmask[32],wanip[32],wanmask[32];
	char *ptr;
	int opt_len;
	unsigned int ip;

	makeip(wanip,(unsigned char *)&packet->yiaddr);
	ptr = get_option(packet, 0x1, &opt_len); /* get subnet mask option */
	if(ptr) makeip(wanmask,ptr);
	else return 0;

	fprintf(stderr,"[DHCPC:Check IP] : Check WAN IP : %s, %s\n", wanip, wanmask);

#ifdef USE_DHCP_CHECK_SAME_SUBNET
	get_ifconfig(IF_LOCAL, lanip, lanmask );
	if(check_same_network2(lanip,lanmask,wanip,wanmask))
	{
		fprintf(stderr,"[DHCPC:Check IP] : Same network \n");
		syslog_msg(SYSMSG_LOG_WANRING, SYSLOG_SAME_SUBNET_IP_ASSIGN, wanip);

		istatus_set_intvalue_direct("lanwan_samenetwork",1);
		wizard_api_set_status(client_config.interface, "timeout");

#ifdef USE_CHANGE_LOCAL_IP_BY_WAN_SUBNET
		/* Change Local */
		if(change_lan_ip_config_by_wan_subnet(lanip,lanmask) != -1)
		{
			saveconf();
			kill(1,SIGTERM); /* reboot */
		}
#endif

		return 1;
	}

#if defined USE_SYSINFO && defined USE_WL_IPTIME_HELPER
	if(is_default_config())	
	{
		sw_t sw;

		get_si("sw",&sw);

		if(sw.wl_helper.enable && sw.wl_helper.redirect && check_same_network2(sw.wl_helper.ip,"255.255.255.0",wanip,wanmask))
		{		
			fprintf(stderr,"[DHCPC:Check IP] : Same network with Helper network: %s\n",wanip);
			return 1;
		}
#ifdef USE_EASY_ROUTER_SETUP
		if(sw.wl_helper2.enable && sw.wl_helper2.redirect && check_same_network2(sw.wl_helper2.ip,"255.255.255.0",wanip,wanmask))
		{		
			fprintf(stderr,"[DHCPC:Check IP] : Same network with Helper network: %s\n", wanip);
			return 1;
		}
#endif
	}
#endif


	istatus_remove_status_tag("lanwan_samenetwork");
#endif

#ifdef USE_DHCPCLIENT_BLOCK_PRIVATE_IP_SERVER 
	if(get_dhclient_block_private_ip(ifname))
	{
		ip = htonl(packet->yiaddr);
		if( ((ip & A_CLASS_PREFIX) == A_CLASS_PRVIATE_IP) ||
		    ((ip & B_CLASS_PREFIX) == B_CLASS_PRVIATE_IP) ||
		    ((ip & C_CLASS_PREFIX) == C_CLASS_PRVIATE_IP)
		    )
		{
			fprintf(stderr,"Server ip is private IP..\n");
			syslog_msg(SYSMSG_LOG_WANRING,SYSLOG_PRIVATE_IP_ASSIGN, wanip);
			istatus_set_intvalue_direct("privateip",1);
			return 1;
		}
		istatus_remove_status_tag("privateip");
	}
#endif

#ifdef USE_IPTIME_SERVICE_NETWORK_CALLBACK
	{
		char srv_net[32], srv_mask[32], server_ip[32], relay_ip[32];	
		int chk_clear = 0;

		strcpy(srv_mask, "255.255.255.0");
		get_iptime_service_network(srv_net);
		strcat(srv_net, ".0");
		makeip(server_ip, (unsigned char *)&packet->siaddr);
		makeip(relay_ip, (unsigned char *)&packet->giaddr);

		while (!chk_clear)
		{
			if (check_same_network2(srv_net, srv_mask, wanip, wanmask) ||
			    check_same_network2(srv_net, srv_mask, server_ip, srv_mask) ||
			    check_same_network2(srv_net, srv_mask, relay_ip, srv_mask))
			{
				ip = inet_addr(srv_net);
				ptr = (char *)&ip;
				if (ptr[2]) ptr[2] -= 1;
				else ptr[2] = 255;
				makeip(srv_net, (unsigned char *)&ip);
			}
			else
			{	
				ptr = strrchr(srv_net, '.');
				if (ptr) 
				{
					*ptr = '\0';
					set_iptime_service_network(srv_net);
				}
				chk_clear = 1;
			}
		}
	}
#endif

	return 0;
}

#endif

