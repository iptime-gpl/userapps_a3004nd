/* 
 * leases.c -- tools to manage DHCP leases 
 * Russ Dill <Russ.Dill@asu.edu> July 2001
 */

#include <time.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include "debug.h"
#include "dhcpd.h"
#include "files.h"
#include "options.h"
#include "leases.h"
#include "arpping.h"

#include <linosconfig.h>
unsigned char blank_chaddr[] = {[0 ... 15] = 0};

/* clear every lease out that chaddr OR yiaddr matches and is nonzero */
void clear_lease(u_int8_t *chaddr, u_int32_t yiaddr)
{
	unsigned int i, j;
	
	for (j = 0; j < 16 && !chaddr[j]; j++);
	
	for (i = 0; i < server_config.max_leases; i++)
		if ((j != 16 && !memcmp(leases[i].chaddr, chaddr, 16)) ||
		    (yiaddr && leases[i].yiaddr == yiaddr)) {
			memset(&(leases[i]), 0, sizeof(struct dhcpOfferedAddr));
		}
}


/* add a lease into the table, clearing out any old ones */
struct dhcpOfferedAddr *add_lease(u_int8_t *chaddr, u_int32_t yiaddr, unsigned long lease, char *hostname)
{
	struct dhcpOfferedAddr *oldest;
	
	/* clean out any old ones */
	clear_lease(chaddr, yiaddr);
		
	oldest = oldest_expired_lease();
	
	if (oldest) {
		memcpy(oldest->chaddr, chaddr, 16);
		oldest->yiaddr = yiaddr;
		oldest->expires = time(0) + lease;
		strcpy(oldest->hostname, (hostname) ? hostname : "");
	}
	
	return oldest;
}


/* true if a lease has expired */
int lease_expired(struct dhcpOfferedAddr *lease)
{
	return (lease->expires < (unsigned long) time(0));
}	


/* Find the oldest expired lease, NULL if there are no expired leases */
struct dhcpOfferedAddr *oldest_expired_lease(void)
{
	struct dhcpOfferedAddr *oldest = NULL;
	unsigned long oldest_lease = time(0);
	unsigned int i;

	
	for (i = 0; i < server_config.max_leases; i++)
		if (oldest_lease > leases[i].expires) {
			oldest_lease = leases[i].expires;
			oldest = &(leases[i]);
		}
	return oldest;
		
}


/* Find the first lease that matches chaddr, NULL if no match */
struct dhcpOfferedAddr *find_lease_by_chaddr(u_int8_t *chaddr)
{
	unsigned int i;

	for (i = 0; i < server_config.max_leases; i++)
	{
		if (!memcmp(leases[i].chaddr, chaddr, 16)) 
		{
			return &(leases[i]);
		}
	}
	
	return NULL;
}


/* Find the first lease that matches yiaddr, NULL is no match */
struct dhcpOfferedAddr *find_lease_by_yiaddr(u_int32_t yiaddr)
{
	unsigned int i;

	for (i = 0; i < server_config.max_leases; i++)
		if (leases[i].yiaddr == yiaddr) return &(leases[i]);
	
	return NULL;
}


/* find an assignable address, it check_expired is true, we check all the expired leases as well.
 * Maybe this should try expired leases by age... */
u_int32_t find_address(int check_expired) 
{
	u_int32_t saddr, eaddr, addr, ret;
	struct dhcpOfferedAddr *lease = NULL;		

	unsigned int local_ip, n;
	char ip_addr[20], netmask[20];	

	char ohw_addr[20];
	int range_base, random_offset;
	int hw1, hw2, hw3, hw4, hw5, hw6;


	get_ifconfig( IF_LOCAL,  ip_addr, netmask ); 	
	local_ip = inet_addr( ip_addr ); 

	saddr = ntohl(server_config.start); /* addr is in host order here */
	eaddr = ntohl(server_config.end); /* addr is in host order here */

	range_base = eaddr - saddr;

	get_hwaddr_org("eth1",ohw_addr);
	sscanf(ohw_addr, "%02X:%02X:%02X:%02X:%02X:%02X",
		&hw1, &hw2, &hw3, &hw4, &hw5, &hw6);


	// 1. try to get a random address
	for (n=saddr; n<=eaddr; n++) // just random trial times
	{
		random_offset = (hw1+hw2+hw3+hw4+hw5+hw6+time(0)) % (range_base+1);
		addr = saddr + random_offset;

		if( addr == ntohl(local_ip) ) continue;	
		/* ie, 192.168.55.0 */
		if (!(addr & 0xFF)) continue;
		/* ie, 192.168.55.255 */
		if ((addr & 0xFF) == 0xFF) continue;

		/* lease is not taken */
		ret = htonl(addr);
		/* static leases */
		if (find_static_lease_by_yiaddr(ret)) continue;

		lease=find_lease_by_yiaddr(ret);
		     /* or it expired and we are checking for expired leases */
		if ((!lease || (check_expired  && lease_expired(lease))) 
				&&
		     /* and it isn't on the network */
	    	     !check_ip(ret)) {
			return ret;
		}
	}

	// 2. if random failed, then sequencial search 
	for (;addr <= eaddr; addr++) {

		/* scchoi */
		/* exclude interface ip	 */
		if( addr == ntohl(local_ip) ) continue;	
		/* ie, 192.168.55.0 */
		if (!(addr & 0xFF)) continue;
		/* ie, 192.168.55.255 */
		if ((addr & 0xFF) == 0xFF) continue;

		/* lease is not taken */
		ret = htonl(addr);

		/* ysyoo. 2003.5.29. static leases */
		if (find_static_lease_by_yiaddr(ret)) continue;

		lease=find_lease_by_yiaddr(ret);
		     /* or it expired and we are checking for expired leases */
		if ((!lease || (check_expired  && lease_expired(lease))) 
				&&
		     /* and it isn't on the network */
	    	     !check_ip(ret)) {
			return ret;
		}
	}
	return 0;
}


/* check is an IP is taken, if it is, add it to the lease table */
int check_ip(u_int32_t addr)
{
	struct in_addr temp;
	
	if (arpping(addr, server_config.server, server_config.arp, server_config.interface, 0) == 0) {
		temp.s_addr = addr;
	 	LOG(LOG_INFO, "%s belongs to someone, reserving it for %ld seconds", 
	 		inet_ntoa(temp), server_config.conflict_time);
		add_lease(blank_chaddr, addr, server_config.conflict_time, 0);
		return 1;
	} else return 0;
}


/* ysyoo. 2003.5.29, static leases */
/* add a static lease into the table */
struct dhcpOfferedStaticAddr *add_static_lease(u_int8_t *chaddr, u_int32_t yiaddr, unsigned long lease)
{
        struct dhcpOfferedStaticAddr *new = NULL;
	unsigned int i;
	
	for (i = 0; i < server_config.max_static; i++)
	{
		if (!static_leases[i].yiaddr)
			new = &(static_leases[i]);
	}

        if (new) {
                memcpy(new->chaddr, chaddr, 16);
                new->yiaddr = yiaddr;
                new->expires = time(0) + lease;
        }

        return new;
}

/* ysyoo. 2003.5.29, static leases */
/* Find the first lease that matches chaddr, NULL if no match */
u_int32_t find_static_lease_by_chaddr(u_int8_t *chaddr)
{
	unsigned int i;

	for (i = 0; i < server_config.max_static; i++)
	{
		if (!memcmp(static_leases[i].chaddr, chaddr, 16)) 
			return static_leases[i].yiaddr;
	}
	
	return 0;
}

/* ysyoo. 2003.5.29, static leases */
/* Find the first lease that matches yiaddr, NULL is no match */
struct dhcpOfferedStaticAddr *find_static_lease_by_yiaddr(u_int32_t yiaddr)
{
	unsigned int i;

	for (i = 0; i < server_config.max_static; i++)
		if (static_leases[i].yiaddr == yiaddr) return &(static_leases[i]);
	
	return NULL;
}

