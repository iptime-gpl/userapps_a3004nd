/* leases.h */
#ifndef _LEASES_H
#define _LEASES_H

#define HOSTNAME_LEN 24

struct dhcpOfferedAddr {
	u_int8_t chaddr[16];
	u_int32_t yiaddr;	/* network order */
	u_int32_t expires;	/* host order */
	char hostname[HOSTNAME_LEN]; 
};

struct dhcpOfferedStaticAddr {
	u_int8_t chaddr[16];
	u_int32_t yiaddr;	/* network order */
	u_int32_t expires;	/* host order */
};

extern unsigned char blank_chaddr[];

void clear_lease(u_int8_t *chaddr, u_int32_t yiaddr);
struct dhcpOfferedAddr *add_lease(u_int8_t *chaddr, u_int32_t yiaddr, unsigned long lease, char *hostname);
int lease_expired(struct dhcpOfferedAddr *lease);
struct dhcpOfferedAddr *oldest_expired_lease(void);
struct dhcpOfferedAddr *find_lease_by_chaddr(u_int8_t *chaddr);
struct dhcpOfferedAddr *find_lease_by_yiaddr(u_int32_t yiaddr);
#ifndef USE_SKT_SEMO_OPTION
u_int32_t find_address(int check_expired);
#else
u_int32_t find_address(unsigned char *mac, int check_expired);
#endif
int check_ip(u_int32_t addr);

/* ysyoo. 2003.5.29, static leases */
struct dhcpOfferedStaticAddr *add_static_lease(u_int8_t *chaddr, u_int32_t yiaddr, unsigned long lease);
u_int32_t find_static_lease_by_chaddr(u_int8_t *chaddr);
struct dhcpOfferedStaticAddr *find_static_lease_by_yiaddr(u_int32_t yiaddr);


#endif
