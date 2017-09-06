// A broadcast packet repeater.  This packet repeater (currently designed for
// udp packets) will listen for broadcast packets.
// When it receives the packets, it will then re-broadcast the packet.
//
// Written by TheyCallMeLuc(at)yahoo.com.au
// I accept no responsiblity for the function of this program if you
// choose to use it.
// Modified for Poptop by Richard de Vroede <r.devroede@linvision.com>
// Ditto on the no responsibility.
//
// This software is completely free.  You can use and/or modify this
// software to your hearts content.  You are free to redistribute it as
// long as it is accompanied with the source and my credit is included.

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#ifdef __linux__
#define _GNU_SOURCE 1           /* strdup() prototype, broken arpa/inet.h */
#endif

#ifdef __svr4__
#define __EXTENSIONS__ 1        /* strdup() prototype */
#endif

#ifdef __sgi__
#define _XOPEN_SOURCE 500       /* strdup() prototype */
#endif

#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <netdb.h>
#include <unistd.h>
#include <string.h>
#include <libgen.h>
#include <time.h>
#include <sys/time.h>
#include <regex.h>
#include <net/if.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <netpacket/packet.h>
#include <net/ethernet.h>
#include <netinet/ip.h>
#include <netinet/udp.h>
#include <netinet/tcp.h>
#include <dirent.h>

#include "defaults.h"
#include "our_syslog.h"
#include "our_getopt.h"

#define VERSION "0.5"

const time_t TIMEOUT = 30;      // Rescan interface bus after TIMEOUT seconds
#define MAXIF 255		// Maximum interfaces to use

/* Local function prototypes */
static void showusage(char *prog);
static void showversion();
#ifndef HAVE_DAEMON
static void my_daemon(int argc, char **argv);
#endif
static void mainloop(int argc, char **argv);
struct iflist *discoverActiveInterfaces(int s);

struct packet {
  struct iphdr ip;
  struct udphdr udp;
  char data[ETHERMTU];
};

struct iflist {
//Fix 3mar2003
  //char index;
  int index;
  u_int32_t bcast;
};

static char interfaces[32];
static char *ipsec = "";
unsigned short checksum(void *addr, int count);

static void showusage(char *prog)
{
        printf("\nBCrelay v%s\n\n", VERSION);
	printf("A broadcast packet repeater. This packet repeater (currently designed for udp packets) will listen\n");
	printf(" for broadcast packets. When it receives the packets, it will then re-broadcast the packet.\n\n");
        printf("Usage: %s [options], where options are:\n\n", prog);
        printf(" [-d] [--daemon]           Run as daemon.\n");
        printf(" [-h] [--help]             Displays this help message.\n");
        printf(" [-i] [--incoming <ifin>]  Defines from which interface broadcasts will be relayed.\n");
        printf(" [-o] [--outgoing <ifout>] Defines to which interface broadcasts will be relayed.\n");
        printf(" [-s] [--ipsec <arg>]      Defines an ipsec tunnel to be relayed to.\n");
	printf("                           Since ipsec tunnels terminate on the same interface, we need to define the broadcast\n");
	printf("                           address of the other end-point of the tunnel.  This is done as ipsec0:x.x.x.255\n");
        printf(" [-v] [--version]          Displays the BCrelay version number.\n");
        printf("\nLog messages and debugging go to syslog as DAEMON.\n\n");
        printf("\nInterfaces can be specified as regexpressions, ie. ppp[0-9]+\n\n");
}

static void showversion()
{
        printf("BCrelay v%s\n", VERSION);
}

static void create_bcrelaypid(char *ifout)
{
	char process_name[256];

	sprintf(process_name,"bcrelay.%s", ifout);
	create_pid(process_name);
}

static void my_daemon(int argc, char **argv)
{
        pid_t pid;
#ifndef BCRELAY_BIN
/* Need a smart way to locate the binary -rdv */
#define BCRELAY_BIN argv[0]
#endif
#ifndef HAVE_FORK
        /* need to use vfork - eg, uClinux */
        char **new_argv;
        extern char **environ;
	int minusd=0;
	int i;
        int fdr;

	/* Strip -d option */
        new_argv = malloc((argc) * sizeof(char **));
        fdr = open("/dev/null", O_RDONLY);
	new_argv[0] = BCRELAY_BIN;
	for (i = 1; argv[i] != NULL; i++) {
		if (fdr != 0) { dup2(fdr, 0); close(fdr); }
		if ( (strcmp(argv[i],"-d")) == 0 ) { 
			minusd=1;
		} 
		if (minusd) {
			new_argv[i] = argv[i+1];
		} else {
			new_argv[i] = argv[i];
		}
	}
        syslog(LOG_DEBUG, "Option parse OK, re-execing as daemon");
        fflush(stderr);
        if ((pid = vfork()) == 0) {
    		if (setsid() < 0) {                      /* shouldn't fail */
      			syslog(LOG_ERR, "Setsid failed!");
      			_exit(1);
    		}
    		chdir("/");
                umask(0);
		/* execve only returns on an error */
                execve(BCRELAY_BIN, new_argv, environ);
		exit(1);
        } else if (pid > 0) {
                syslog(LOG_DEBUG, "Success re-execing as daemon!");
                exit(0);
        } else {
                syslog(LOG_ERR, "Error vforking");
                exit(1);
        }
#else
    pid=fork();
    if (pid<0) { syslog(LOG_ERR, "Error forking"); _exit(1); }
    if (pid>0) { syslog(LOG_DEBUG, "Parent exits"); _exit(0); }
    if (pid=0) { syslog(LOG_DEBUG, "Running as child"); }
    /* child (daemon) continues */
    if (setsid() < 0) {                      /* shouldn't fail */
      syslog(LOG_ERR, "Setsid failed!");
      _exit(1);
    }
    chdir("/");
#endif
}

int main(int argc, char **argv) {
  regex_t preg;
  /* command line options */
  int c;
  char *ifout = "";
  char *ifin = "";
  int daemon_flag = 0;

        /* open a connection to the syslog daemon */
        openlog("bcrelay", LOG_PID, LOG_DAEMON);

  while (1) {
                int option_index = 0;

                static struct option long_options[] =
                {
                        {"daemon", 0, 0, 0},
                        {"help", 0, 0, 0},
                        {"incoming", 1, 0, 0},
                        {"outgoing", 1, 0, 0},
                        {"ipsec", 1, 0, 0},
                        {"version", 0, 0, 0},
                        {0, 0, 0, 0}
                };

                c = getopt_long(argc, argv, "dhi:o:s:v", long_options, &option_index);
                if (c == -1)
                        break;
                /* convert long options to short form */
                if (c == 0)
                        c = "dhiosv"[option_index];
                switch (c) {
                case 'd':
                        daemon_flag = 1;
                        break;
                case 'h':
                        showusage(argv[0]);
                        return 0;
                case 'i':
                        ifin = strdup(optarg);
                        break;
                case 'o':
                        ifout = strdup(optarg);
                        break;
                case 's':
                        ipsec = strdup(optarg);
                        // Validate the ipsec parameters
			regcomp(&preg, "ipsec[0-9]+:[0-9]+.[0-9]+.[0-9]+.255", REG_EXTENDED);
			if (regexec(&preg, ipsec, 0, NULL, 0)) {
				syslog(LOG_INFO,"Bad syntax: %s", ipsec);
				fprintf(stderr, "\nBad syntax: %s\n", ipsec);
                        	showusage(argv[0]);
                        	return 0;
			} else {
				regfree(&preg);
				break;
			}
                case 'v':
                        showversion();
                        return 0;
                default:
                        showusage(argv[0]);
                        return 1;
                }                       	
  }                               
  if (ifin == "") {
       syslog(LOG_INFO,"Incoming interface required!");
       showusage(argv[0]);
       _exit(1);
  }
  if (ifout == "" && ipsec == "") {
       syslog(LOG_INFO,"Listen-mode or outgoing or IPsec interface required!");
       showusage(argv[0]);
       _exit(1);
  } else {
	sprintf(interfaces,"%s|%s", ifin, ifout);
  } 

  // If specified, become Daemon.
  if (daemon_flag) {
#if HAVE_DAEMON
    closelog();
    freopen("/dev/null", "r", stdin);
    /* set noclose, we want stdout/stderr still attached if we can */
    daemon(0, 1);
    /* returns to child only */
    /* pid will have changed */
    openlog("bcrelay", LOG_PID, LOG_DAEMON);
#else   /* !HAVE_DAEMON */
    my_daemon(argc, argv);
    /* returns to child if !HAVE_FORK
     * never returns if HAVE_FORK (re-execs without -d)
     */
#endif
  } else {
    syslog(LOG_INFO, "Running as child\n");
  }

  create_bcrelaypid(ifout);

  mainloop(argc,argv);
  _exit(0);
}

static void mainloop(int argc, char **argv) {
  socklen_t salen = sizeof(struct sockaddr_ll);
  int i, s, len, interface;
  struct iflist *iflist = NULL;         // Initialised after the 1st packet
  struct sockaddr_ll sa;
  time_t lasttime = 0;
  struct packet p;
  struct iphdr ip;
  // Create Socket and listen to ALL ethernet traffic.
  if ((s = socket(PF_PACKET, SOCK_DGRAM, htons(ETH_P_ALL))) < 0)
    syslog(LOG_INFO,"%s: Error creating socket", *argv);

  // Main loop
  while ((len = recvfrom(s, &p, sizeof(p), 0,
                        (struct sockaddr *)&sa, &salen)) > 0) {



    // Ignore packets that are not UDP Broadcasts
    if (p.ip.protocol != IPPROTO_UDP ||
        (p.ip.daddr & 0xff000000) != 0xff000000)
      continue;

    // Check for new interfaces after TIMEOUT seconds
    if (time(NULL) - lasttime > TIMEOUT) {
      iflist = discoverActiveInterfaces(s);
      time(&lasttime);
    }

    // Make sure the packet is coming from a valid interface
    for (i = 0; iflist[i].index; i++)
      if (iflist[i].index == sa.sll_ifindex)
        break;
    if (iflist[i].index == 0)
      continue;

    // Now forward the packet to every other interface in our list.
    interface = sa.sll_ifindex;

     

    for (i = 0; iflist[i].index; i++) {
      // Skip the interface the packet came in on
      if (iflist[i].index == interface)
        continue;

      // Set the outgoing hardware address to 1's.  True Broadcast
      sa.sll_addr[0] = sa.sll_addr[1] = sa.sll_addr[2] = sa.sll_addr[3] = 0xff;
      sa.sll_addr[4] = sa.sll_addr[5] = sa.sll_addr[6] = sa.sll_addr[7] = 0xff;


      // The CRC gets broken here when sending over ipsec tunnels but that
      // should not matter as we reassemble the packet at the other end.
      if(p.ip.daddr != iflist[i].bcast)
      {
            p.ip.daddr = iflist[i].bcast;
 
            p.ip.check = 0x0;
            p.ip.check = checksum(&p.ip, sizeof(p.ip));
 
            ip = p.ip; /* backup ip header */
            memset( &p.ip, 0x0, sizeof(p.ip));  
 
            /* make pseudo header */
            p.ip.protocol = ip.protocol;
            p.ip.saddr = ip.saddr;
            p.ip.daddr = ip.daddr;
 
            p.ip.tot_len = p.udp.len; /* udp datagram length */
            p.udp.check = 0x0;
 
            p.udp.check = checksum(&p.ip, len);
            p.ip = ip; /* restore */
      }

      sa.sll_ifindex = iflist[i].index;

      /* scchoi: 20090824 salen is set 12 by recvfrom */
      /* 12 dosen't work in 2.6 kernel */
     //sendto(s, &p, len, 0, (struct sockaddr *)&sa, salen);
      sendto(s, &p, len, 0, (struct sockaddr *)&sa, sizeof(sa));
    }
  }

  // Finish up.  When do we get here?
  close(s);
}

// Discover active interfaces
struct iflist *
discoverActiveInterfaces(int s) {
  static struct iflist iflist[MAXIF+1];         // Allow for MAXIF interfaces
  static struct ifconf ifs;
  int i, cntr = 0;
  regex_t preg;

  //regcomp(&preg, argv[1], REG_ICASE|REG_EXTENDED);
  regcomp(&preg, interfaces, REG_ICASE|REG_EXTENDED);
  ifs.ifc_len = MAXIF*sizeof(struct ifreq);
  ifs.ifc_req = malloc(ifs.ifc_len);
  ioctl(s, SIOCGIFCONF, &ifs);                  // Discover active interfaces
  for (i = 0; i * sizeof(struct ifreq) < ifs.ifc_len && cntr < MAXIF; i++)
    if (regexec(&preg, ifs.ifc_req[i].ifr_name, 0, NULL, 0) == 0) {
      ioctl(s, SIOCGIFINDEX, &ifs.ifc_req[i]);  // Discover interface index
//Fix 3mar2003
      //iflist[cntr].index = (char)ifs.ifc_req[i].ifr_ifindex;
      iflist[cntr].index = ifs.ifc_req[i].ifr_ifindex;

      iflist[cntr++].bcast = INADDR_BROADCAST;

    // IPSEC tunnels are a fun one.  We must change the destination address
    // so that it will be routed to the correct tunnel end point.
    // We can define several tunnel end points for the same ipsec interface.
    } else if (ipsec != "" && strncmp(ifs.ifc_req[i].ifr_name, "ipsec", 5) == 0) {
        if (strncmp(ifs.ifc_req[i].ifr_name, ipsec, 6) == 0) {
          struct hostent *hp = gethostbyname(ipsec+7);
          ioctl(s, SIOCGIFINDEX, &ifs.ifc_req[i]);
          iflist[cntr].index = (char)ifs.ifc_req[i].ifr_ifindex;
          memcpy(&(iflist[cntr++].bcast), hp->h_addr, sizeof(u_int32_t));
        }
    }

  iflist[cntr].index = 0;                       // Terminate list
  free(ifs.ifc_req);                            // Stop that leak.
  regfree(&preg);

  return iflist;
}

unsigned short checksum(void *addr, int count)
{
        /* Compute Internet Checksum for "count" bytes
         *          *         beginning at location "addr".
         *                   */
        register int32_t sum = 0;
        u_int16_t *source = (u_int16_t *) addr;

        while (count > 1)  {
                /*  This is the inner loop */
                sum += *source++;
                count -= 2;
        }

        /*  Add left-over byte, if any */
        if (count > 0) {
                /* Make sure that the left-over byte is added correctly both
                 *                  * with little and big endian hosts */
                u_int16_t tmp = 0;
                *(unsigned char *) (&tmp) = * (unsigned char *) source;
                sum += tmp;
        }
        /*  Fold 32-bit sum to 16 bits */
        while (sum >> 16)
                sum = (sum & 0xffff) + (sum >> 16);

        return ~sum;
}



