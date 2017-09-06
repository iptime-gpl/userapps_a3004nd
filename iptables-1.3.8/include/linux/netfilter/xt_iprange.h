#ifndef _LINUX_NETFILTER_XT_IPRANGE_H
#define _LINUX_NETFILTER_XT_IPRANGE_H 1

enum {
	IPRANGE_SRC     = 1 << 0,	/* match source IP address */
	IPRANGE_DST     = 1 << 1,	/* match destination IP address */
	IPRANGE_SRC_INV = 1 << 4,	/* negate the condition */
	IPRANGE_DST_INV = 1 << 5,	/* -"- */
};

#if	0
#ifndef NF_INET_ADDR
union nf_inet_addr {
        unsigned int          all[4];
        unsigned int          ip;
        unsigned int          ip6[4];
        struct in_addr  in;
        struct in6_addr in6;
};
#endif
#endif

struct xt_iprange_mtinfo {
	union nf_inet_addr src_min, src_max;
	union nf_inet_addr dst_min, dst_max;
	unsigned char flags;
};

#endif /* _LINUX_NETFILTER_XT_IPRANGE_H */
