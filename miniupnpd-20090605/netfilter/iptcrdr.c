/* $Id: iptcrdr.c,v 1.24 2017/06/16 06:30:03 bcm5357 Exp $ */
/* MiniUPnP project
 * http://miniupnp.free.fr/ or http://miniupnp.tuxfamily.org/
 * (c) 2006-2008 Thomas Bernard
 * This software is subject to the conditions detailed
 * in the LICENCE file provided within the distribution */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <syslog.h>
#include <sys/errno.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <dlfcn.h>
#include <libiptc/libiptc.h>
#include <iptables.h>

#include <linux/version.h>

#if IPTABLES_143
#include <stdbool.h>
/* IPTABLES API version >= 1.4.3 */
#include <net/netfilter/nf_nat.h>
#define ip_nat_multi_range	nf_nat_multi_range
#define ip_nat_range		nf_nat_range
#define IPTC_HANDLE		struct iptc_handle *
#define IPT_ALIGN		XT_ALIGN
#else
/* IPTABLES API version < 1.4.3 */
#if LINUX_VERSION_CODE < KERNEL_VERSION(2,6,22)
#include <linux/netfilter_ipv4/ip_nat.h>
#else
#if 1
#include <linux/netfilter/nf_nat.h>
#else
#include "tiny_nf_nat.h"
#define ip_nat_multi_range	nf_nat_multi_range
#define ip_nat_range		nf_nat_range
#define IPTC_HANDLE		struct iptc_handle *
#endif
#endif
#define IPTC_HANDLE		iptc_handle_t
#endif

#include "iptcrdr.h"
#include "../upnpglobalvars.h"

#ifdef USE_PC_IPDISK_SERVER
#define MAX_FTP_PRIVATE_PORT 6
#endif

static char nat_chain_name[][32] = {
#ifdef USE_PORTFORWARD_V2
		"upnp",
		"preroute_upnp",
#ifdef USE_DUAL_WAN
		"preroute_upnp2",
#endif
		"upnp_app_postroute",
		"",
#else
		"upnp",
		"upnp_in_public_preroute",
#ifdef USE_DUAL_WAN
		"upnp_in_public_preroute2",
#endif
		"upnp_app_postroute",
		"",
#endif
};

/* dummy init and shutdown functions */
int init_redirect(void)
{
	return 0;
}

void shutdown_redirect(void)
{
	return;
}

/* convert an ip address to string */
static int snprintip(char * dst, size_t size, uint32_t ip)
{
	return snprintf(dst, size,
	       "%u.%u.%u.%u", ip >> 24, (ip >> 16) & 0xff,
	       (ip >> 8) & 0xff, ip & 0xff);
}

/* netfilter cannot store redirection descriptions, so we use our
 * own structure to store them */
struct rdr_desc {
	struct rdr_desc * next;
	unsigned short eport;
	short proto;
	char str[128];
};

/* pointer to the chained list where descriptions are stored */
static struct rdr_desc * rdr_desc_list = 0;

void
add_redirect_desc(unsigned short eport, int proto, const char * desc)
{
	struct rdr_desc * p;
	size_t l;
	if(desc)
	{
		l = strlen(desc) + 1;
		//p = malloc(sizeof(struct rdr_desc) + l);
		p = malloc(sizeof(struct rdr_desc));
		memset((char *)p, 0, sizeof(struct rdr_desc));
		if(p)
		{
			p->next = rdr_desc_list;
			p->eport = eport;
			p->proto = (short)proto;
			memcpy(p->str, desc, l);
			rdr_desc_list = p;
		}
	}
}

static void
del_redirect_desc(unsigned short eport, int proto)
{
	struct rdr_desc * p, * last;
	p = rdr_desc_list;
	last = 0;
	while(p)
	{
		if(p->eport == eport && p->proto == proto)
		{
			if(!last)
				rdr_desc_list = p->next;
			else
				last->next = p->next;
			free(p);
			return;
		}
		last = p;
		p = p->next;
	}
}

static void
get_redirect_desc(unsigned short eport, int proto,
                  char * desc, int desclen)
{
	struct rdr_desc * p;
	if(!desc || (desclen == 0))
		return;
	for(p = rdr_desc_list; p; p = p->next)
	{
		if(p->eport == eport && p->proto == (short)proto)
		{
			strncpy(desc, p->str, desclen);
			return;
		}
	}
	/* if no description was found, reture miniupnpd as default */
	strncpy(desc, "miniupnpd", desclen);
}

/* add_redirect_rule2() */
int
add_redirect_rule2(const char * ifname, unsigned short eport,
                   const char * iaddr, unsigned short iport, int proto,
				   const char * desc)
{
	int r=0, n=0;
       
	while (strcmp(nat_chain_name[n], ""))
	{
		if (!strcmp(nat_chain_name[n], "upnp_app_postroute"))
			r = addsnatrule(proto, iaddr, iport, nat_chain_name[n]);
		else
			r = addnatrule(proto, eport, iaddr, iport, nat_chain_name[n]);
		n++;
	}

	if(r >= 0)
	{
		add_redirect_desc(eport, proto, desc);

#ifdef USE_PC_IPDISK_SERVER
                // check ipDISK PC Server Private Port. ysyoo, 2012-06-20
                // check NS series Private Port.  ysyoo, 2013-02-13
                if ((strstr(desc, "ipDISK_Server_FTP") || strstr(desc, "ipdisk_ftp"))
		    && iport!= 21)
                {
                        int idx;
                        int ftp_port[MAX_FTP_PRIVATE_PORT] = {0,0,0,0,0,0};

                        idx = read_ftp_private_port(ftp_port, MAX_FTP_PRIVATE_PORT);
                        if (idx < MAX_FTP_PRIVATE_PORT)
                        {
                                ftp_port[idx] = iport;
                                write_ftp_private_port(ftp_port, MAX_FTP_PRIVATE_PORT);
                        }
                }
#endif
	}

	return r;
}

int
add_filter_rule2(const char * ifname, const char * iaddr,
                 unsigned short eport, unsigned short iport,
                 int proto, const char * desc)
{
	return add_filter_rule(proto, iaddr, iport);
}

/* get_redirect_rule() 
 * returns -1 if the rule is not found */
int
get_redirect_rule(const char * ifname, unsigned short eport, int proto,
                  char * iaddr, int iaddrlen, unsigned short * iport,
                  char * desc, int desclen,
                  u_int64_t * packets, u_int64_t * bytes)
{
	int r = -1;
	IPTC_HANDLE h;
	const struct ipt_entry * e;
	const struct ipt_entry_target * target;
	const struct ip_nat_multi_range * mr;
	const struct ipt_entry_match *match;

	h = iptc_init("nat");
	if(!h)
	{
		syslog(LOG_ERR, "get_redirect_rule() : "
		                "iptc_init() failed : %s",
		       iptc_strerror(errno));
		return -1;
	}
	if(!iptc_is_chain(miniupnpd_nat_chain, h))
	{
		syslog(LOG_ERR, "chain %s not found", miniupnpd_nat_chain);
	}
	else
	{
#ifdef IPTABLES_143
		for(e = iptc_first_rule(miniupnpd_nat_chain, h);
		    e;
			e = iptc_next_rule(e, h))
#else
		for(e = iptc_first_rule(miniupnpd_nat_chain, &h);
		    e;
			e = iptc_next_rule(e, &h))
#endif
		{
			if(proto==e->ip.proto)
			{
				match = (const struct ipt_entry_match *)&e->elems;
				if(0 == strncmp(match->u.user.name, "tcp", IPT_FUNCTION_MAXNAMELEN))
				{
					const struct ipt_tcp * info;
					info = (const struct ipt_tcp *)match->data;
					if(eport != info->dpts[0])
						continue;
				}
				else
				{
					const struct ipt_udp * info;
					info = (const struct ipt_udp *)match->data;
					if(eport != info->dpts[0])
						continue;
				}
				target = (void *)e + e->target_offset;
				//target = ipt_get_target(e);
				mr = (const struct ip_nat_multi_range *)&target->data[0];
				if (iaddr)
					snprintip(iaddr, iaddrlen, ntohl(mr->range[0].min_ip));
				*iport = ntohs(mr->range[0].min.tcp.port);
				/*if(desc)
					strncpy(desc, "miniupnpd", desclen);*/
				get_redirect_desc(eport, proto, desc, desclen);
				if(packets)
					*packets = e->counters.pcnt;
				if(bytes)
					*bytes = e->counters.bcnt;
				r = 0;
				break;
			}
		}
	}
#ifdef IPTABLES_143
	iptc_free(h);
#else
	iptc_free(&h);
#endif
	return r;
}

/* get_redirect_rule_by_index() 
 * return -1 when the rule was not found */
int
get_redirect_rule_by_index(int idx,
                           char * ifname, unsigned short * eport,
                           char * iaddr, int iaddrlen, unsigned short * iport,
                           int * proto, char * desc, int desclen,
                           u_int64_t * packets, u_int64_t * bytes)
{
	int r = -1;
	int i = 0;
	IPTC_HANDLE h;
	const struct ipt_entry * e;
	const struct ipt_entry_target * target;
	const struct ip_nat_multi_range * mr;
	const struct ipt_entry_match *match;

	h = iptc_init("nat");
	if(!h)
	{
		syslog(LOG_ERR, "get_redirect_rule_by_index() : "
		                "iptc_init() failed : %s",
		       iptc_strerror(errno));
		return -1;
	}
	if(!iptc_is_chain(miniupnpd_nat_chain, h))
	{
		syslog(LOG_ERR, "chain %s not found", miniupnpd_nat_chain);
	}
	else
	{
#ifdef IPTABLES_143
		for(e = iptc_first_rule(miniupnpd_nat_chain, h);
		    e;
			e = iptc_next_rule(e, h))
#else
		for(e = iptc_first_rule(miniupnpd_nat_chain, &h);
		    e;
			e = iptc_next_rule(e, &h))
#endif
		{
			if(i==idx)
			{
				*proto = e->ip.proto;
				match = (const struct ipt_entry_match *)&e->elems;
				if(0 == strncmp(match->u.user.name, "tcp", IPT_FUNCTION_MAXNAMELEN))
				{
					const struct ipt_tcp * info;
					info = (const struct ipt_tcp *)match->data;
					*eport = info->dpts[0];
				}
				else
				{
					const struct ipt_udp * info;
					info = (const struct ipt_udp *)match->data;
					*eport = info->dpts[0];
				}
				target = (void *)e + e->target_offset;
				mr = (const struct ip_nat_multi_range *)&target->data[0];
				if (iaddr)
					snprintip(iaddr, iaddrlen, ntohl(mr->range[0].min_ip));
				//*iport = ntohs(mr->range[0].min.all);
				*iport = ntohs(mr->range[0].min.tcp.port);
                /*if(desc)
				    strncpy(desc, "miniupnpd", desclen);*/
				get_redirect_desc(*eport, *proto, desc, desclen);
				if(packets)
					*packets = e->counters.pcnt;
				if(bytes)
					*bytes = e->counters.bcnt;
				r = 0;
				break;
			}
			i++;
		}
	}
#ifdef IPTABLES_143
	iptc_free(h);
#else
	iptc_free(&h);
#endif
	return r;
}

/* delete_rule_and_commit() :
 * subfunction used in delete_redirect_and_filter_rules() */
static int
delete_rule_and_commit(unsigned int idx, IPTC_HANDLE h,
                       const char * miniupnpd_chain,
                       const char * logcaller)
{
	int r = 0;
#ifdef IPTABLES_143
	if(!iptc_delete_num_entry(miniupnpd_chain, idx, h))
#else
	if(!iptc_delete_num_entry(miniupnpd_chain, idx, &h))
#endif
	{
		syslog(LOG_ERR, "%s(idx:%d) : iptc_delete_num_entry(): %s\n",
	    	   logcaller, idx, iptc_strerror(errno));
		r = -1;
	}
#ifdef IPTABLES_143
	else if(!iptc_commit(h))
#else
	else if(!iptc_commit(&h))
#endif
	{
		syslog(LOG_ERR, "%s() : iptc_commit(): %s\n",
	    	   logcaller, iptc_strerror(errno));
		r = -1;
	}
	return r;
}


#ifdef USE_PC_IPDISK_SERVER
static int del_ftp_private_port(int del_port)
{
        int  cur_port[MAX_FTP_PRIVATE_PORT];
        int  i, j;

        if (!read_ftp_private_port(cur_port, MAX_FTP_PRIVATE_PORT))
                return 0;

        /* finding port was deleted */
        for (i=0; i<MAX_FTP_PRIVATE_PORT; i++)
        {
                if (cur_port[i] == del_port)
                        cur_port[i] = 0;
        }

        write_ftp_private_port(cur_port, MAX_FTP_PRIVATE_PORT);
        return 0;
}
#endif

struct ipt_natinfo
{
	struct ipt_entry_target t;
	struct ip_nat_multi_range mr;
};

/* delete_redirect_and_filter_rules()
 */
int
delete_redirect_and_filter_rules(unsigned short eport, int proto)
{
	int r = -1, r2, n = -1, is_chain;
	unsigned idx = -1;
	unsigned i = 0;
	IPTC_HANDLE h;
	const struct ipt_entry * e;
	const struct ipt_entry_match *match;
	const struct ipt_entry_target *target;
	struct in_addr iaddr;
	unsigned short iport = 0 ;

	h = iptc_init("nat");
	if(!h)
	{
		syslog(LOG_ERR, "delete_redirect_and_filter_rules() : "
		                "iptc_init() failed : %s",
		       iptc_strerror(errno));
		return -1;
	}
	is_chain = iptc_is_chain(miniupnpd_nat_chain, h);
#ifdef IPTABLES_143
	if (h) iptc_free(h);
#else
	if (h) iptc_free(&h);
#endif

	if(!is_chain)
	{
		syslog(LOG_ERR, "chain %s not found", miniupnpd_nat_chain);
	}
	else
	{
		n = -1;
		while (strcmp(nat_chain_name[++n], ""))
		{
			idx = -1;
			i = 0;
        
			h = iptc_init("nat");
#ifdef IPTABLES_143
			for(e = iptc_first_rule(nat_chain_name[n], h); 
			    e;
				e = iptc_next_rule(e, h), i++)
#else  
			for(e = iptc_first_rule(nat_chain_name[n], &h);
			    e;
				e = iptc_next_rule(e, &h), i++)
#endif
			{
				if(proto==e->ip.proto)
				{
					match = (const struct ipt_entry_match *)&e->elems;
					target = ipt_get_target(e);

					if(0 == strncmp(match->u.user.name, "tcp", IPT_FUNCTION_MAXNAMELEN))
					{
						const struct ipt_tcp *info = (const struct ipt_tcp *)match->data;
						const struct ipt_natinfo *natinfo = (void *)target;
						const struct ip_nat_range *range = (struct ip_nat_range *)&natinfo->mr.range[0];

						if (!strcmp(nat_chain_name[n], "upnp_app_postroute"))
						{
							syslog(LOG_NOTICE, "APP_POSTROUTE(TCP) : addr(%08x, %08x), iport(%d,%d)", 
										iaddr.s_addr, e->ip.dst.s_addr, iport, info->dpts[0]);

							if((iaddr.s_addr != e->ip.dst.s_addr) || (iport != info->dpts[0])) continue;
						}
						else
						{
							if(eport != info->dpts[0]) continue;

							if (!strcmp(nat_chain_name[n], "upnp"))
							{
								iaddr.s_addr = range->min_ip;
								iport = ntohs(range->min.tcp.port);
								syslog(LOG_NOTICE, "IADDR : %08x, IPORT : %d", iaddr.s_addr, iport);
							}
						}
					}
					else
					{
						const struct ipt_udp *info = (const struct ipt_udp *)match->data;
						const struct ipt_natinfo *natinfo = (void *)target;
						const struct ip_nat_range *range = (struct ip_nat_range *)&natinfo->mr.range[0];

						if (!strcmp(nat_chain_name[n], "upnp_app_postroute"))
						{
							syslog(LOG_NOTICE, "APP_POSTROUTE(UDP) : addr(%08x, %08x), iport(%d,%d)", 
										iaddr.s_addr, e->ip.dst.s_addr, iport, info->dpts[0]);

							if((iaddr.s_addr != e->ip.dst.s_addr) || (iport != info->dpts[0])) continue;
						}
						else
						{
							if(eport != info->dpts[0]) continue;

							if (!strcmp(nat_chain_name[n], "upnp"))
							{
								iaddr.s_addr = range->min_ip;
								iport = ntohs(range->min.tcp.port);
								syslog(LOG_NOTICE, "IADDR : %08x, IPORT : %d", iaddr.s_addr, iport);
							}
						}
					}
					idx = i;
        
#ifdef USE_PC_IPDISK_SERVER
					{
					char desc[128];
					get_redirect_desc(eport, proto, desc, 128);
					if ((strstr(desc, "ipDISK_Server_FTP") || strstr(desc, "ipdisk_ftp"))
					    && iport!= 21)
						del_ftp_private_port(iport);
					}
#endif

					break;
				}
			}
#ifdef IPTABLES_143
			if (h) iptc_free(h);
#else
			if (h) iptc_free(&h);
#endif
        
			r = 0;
			if (idx == -1) continue;
        
			syslog(LOG_NOTICE, "Trying to delete rules at idx %u %d, %d from %s ", idx, proto, eport, nat_chain_name[n]);

			/* Now delete both rules */
			h = iptc_init("nat");
			if(h)
			{
				r2 = delete_rule_and_commit(idx, h, nat_chain_name[n], "delete_redirect_rule");
#ifdef IPTABLES_143
				iptc_free(h);
#else
#ifndef IPTABLES_127
				iptc_free(&h);
#endif
#endif
			}
#ifdef USE_FORWARD_CHAIN
			if (!strcmp(nat_chain_name[n], miniupnpd_nat_chain))
			{
				h = iptc_init("filter");
				if(h && (r2 == 0))
				{
					r2 = delete_rule_and_commit(idx, h, miniupnpd_forward_chain, "delete_filter_rule");
#ifdef IPTABLES_143
					iptc_free(h);
#else
#ifndef IPTABLES_127
					iptc_free(&h);
#endif
#endif
				}
			}
#endif 
		} // while
	}

	del_redirect_desc(eport, proto);
	return r;
}

/* ==================================== */
/* TODO : add the -m state --state NEW,ESTABLISHED,RELATED 
 * only for the filter rule */
static struct ipt_entry_match *
get_tcp_match(unsigned short dport)
{
	struct ipt_entry_match *match;
	struct ipt_tcp * tcpinfo;
	size_t size;
	size =   IPT_ALIGN(sizeof(struct ipt_entry_match))
	       + IPT_ALIGN(sizeof(struct ipt_tcp));
	match = calloc(1, size);
	match->u.match_size = size;
	strncpy(match->u.user.name, "tcp", IPT_FUNCTION_MAXNAMELEN);
	tcpinfo = (struct ipt_tcp *)match->data;
	tcpinfo->spts[0] = 0;		/* all source ports */
	tcpinfo->spts[1] = 0xFFFF;
	tcpinfo->dpts[0] = dport;	/* specified destination port */
	tcpinfo->dpts[1] = dport;
	return match;
}

static struct ipt_entry_match *
get_udp_match(unsigned short dport)
{
	struct ipt_entry_match *match;
	struct ipt_udp * udpinfo;
	size_t size;
	size =   IPT_ALIGN(sizeof(struct ipt_entry_match))
	       + IPT_ALIGN(sizeof(struct ipt_udp));
	match = calloc(1, size);
	match->u.match_size = size;
	strncpy(match->u.user.name, "udp", IPT_FUNCTION_MAXNAMELEN);
	udpinfo = (struct ipt_udp *)match->data;
	udpinfo->spts[0] = 0;		/* all source ports */
	udpinfo->spts[1] = 0xFFFF;
	udpinfo->dpts[0] = dport;	/* specified destination port */
	udpinfo->dpts[1] = dport;
	return match;
}

static struct ipt_entry_target *
get_dnat_target(const char * daddr, unsigned short dport)
{
	struct ipt_entry_target * target;
	struct ip_nat_multi_range * mr;
	struct ip_nat_range * range;
	size_t size;

	size =   IPT_ALIGN(sizeof(struct ipt_entry_target))
	       + IPT_ALIGN(sizeof(struct ip_nat_multi_range));
	target = calloc(1, size);
	target->u.target_size = size;
	strncpy(target->u.user.name, "DNAT", IPT_FUNCTION_MAXNAMELEN);
	/* one ip_nat_range already included in ip_nat_multi_range */
	mr = (struct ip_nat_multi_range *)&target->data[0];
	mr->rangesize = 1;
	range = &mr->range[0];
	range->min_ip = range->max_ip = inet_addr(daddr);
	range->flags |= IP_NAT_RANGE_MAP_IPS;
	range->min.tcp.port = range->max.tcp.port = htons(dport);
	range->flags |= IP_NAT_RANGE_PROTO_SPECIFIED;
	return target;
}

static struct ipt_entry_target *
get_snat_target(const char * saddr, unsigned short sport)
{
	struct ipt_entry_target * target;
	struct ip_nat_multi_range * mr;
	struct ip_nat_range * range;
	size_t size;

	size =   IPT_ALIGN(sizeof(struct ipt_entry_target))
	       + IPT_ALIGN(sizeof(struct ip_nat_multi_range));
	target = calloc(1, size);
	target->u.target_size = size;
	strncpy(target->u.user.name, "SNAT", IPT_FUNCTION_MAXNAMELEN);
	/* one ip_nat_range already included in ip_nat_multi_range */
	mr = (struct ip_nat_multi_range *)&target->data[0];
	mr->rangesize = 1;
	range = &mr->range[0];
	range->min_ip = range->max_ip = inet_addr(saddr);
	range->flags |= IP_NAT_RANGE_MAP_IPS;
	if (sport)
	{
		range->min.tcp.port = range->max.tcp.port = htons(sport);
		range->flags |= IP_NAT_RANGE_PROTO_SPECIFIED;
	}
	return target;
}


/* iptc_init_verify_and_append()
 * return 0 on success, -1 on failure */
static int
iptc_init_verify_and_append(const char * table, const char * miniupnpd_chain, struct ipt_entry * e,
                            const char * logcaller)
{
	IPTC_HANDLE h;

	h = iptc_init(table);
	if(!h)
	{
		syslog(LOG_ERR, "%s : iptc_init() error : %s\n",
		       logcaller, iptc_strerror(errno));
		return -1;
	}
	if(!iptc_is_chain(miniupnpd_chain, h))
	{
		syslog(LOG_ERR, "%s : iptc_is_chain() error : %s\n",
		       logcaller, iptc_strerror(errno));
		return -1;
	}
#ifdef IPTABLES_143
	if(!iptc_append_entry(miniupnpd_chain, e, h))
#else
	if(!iptc_append_entry(miniupnpd_chain, e, &h))
#endif
	{
		syslog(LOG_ERR, "%s : iptc_append_entry() error : %s\n",
		       logcaller, iptc_strerror(errno));
		return -1;
	}
#ifdef IPTABLES_143
	if(!iptc_commit(h))
#else
	if(!iptc_commit(&h))
#endif
	{
		syslog(LOG_ERR, "%s : iptc_commit() error : %s\n",
		       logcaller, iptc_strerror(errno));
		return -1;
	}

#ifdef IPTABLES_143
	iptc_free(h);
#endif

	return 0;
}

extern int get_ifconfig(char *ifname, char *ip, char *netmask);

/* add nat rule 
 * iptables -t nat -A MINIUPNPD -p proto --dport eport -j DNAT --to iaddr:iport
 * */
int
addnatrule(int proto, unsigned short eport,
           const char * iaddr, unsigned short iport, char *nat_chain)
{
	int r = 0;
	struct ipt_entry * e;
	struct ipt_entry_match *match = NULL;
	struct ipt_entry_target *target = NULL;

	e = calloc(1, sizeof(struct ipt_entry));

	if (!strcmp(nat_chain, miniupnpd_nat_chain))
	{
		strcpy(e->ip.iniface, IF_LOCAL);
		memset(e->ip.iniface_mask, 0xFF, strlen(e->ip.iniface) + 1);
		memset(e->ip.iniface_mask + strlen(e->ip.iniface) + 1, 0, IFNAMSIZ - strlen(e->ip.iniface) - 1);
		e->ip.invflags = IPT_INV_VIA_IN;	
	}

	e->ip.proto = proto;
	if(proto == IPPROTO_TCP)
	{
		match = get_tcp_match(eport);
	}
	else
	{
		match = get_udp_match(eport);
	}
	e->nfcache = NFC_IP_DST_PT;
	target = get_dnat_target(iaddr, iport);
	e->nfcache |= NFC_UNKNOWN;
	e = realloc(e, sizeof(struct ipt_entry)
	               + match->u.match_size
				   + target->u.target_size);

	memcpy(e->elems, match, match->u.match_size);
	memcpy(e->elems + match->u.match_size, target, target->u.target_size);
	e->target_offset = sizeof(struct ipt_entry)
	                   + match->u.match_size;
	e->next_offset = sizeof(struct ipt_entry)
	                 + match->u.match_size
					 + target->u.target_size;
	
	r = iptc_init_verify_and_append("nat", nat_chain, e, "addnatrule()");
	free(target);
	free(match);
	free(e);
	return r;
}
/* add snat rule 
 * iptables -t nat -A upnp_app_postroute -s localnet/mask -d iaddr -p proto --dport iport -j SNAT --to-source localip
 * */
int
addsnatrule(int proto, const char * iaddr, unsigned short iport, char *nat_chain)
{
	int r = 0;
	struct ipt_entry * e;
	struct ipt_entry_match *match = NULL;
	struct ipt_entry_target *target = NULL;
	char local_ifname[12], local_ip[20], local_mask[20];

	e = calloc(1, sizeof(struct ipt_entry));

	strcpy(local_ifname, IF_LOCAL);
	get_ifconfig(local_ifname, local_ip, local_mask);

	e->ip.src.s_addr = inet_addr(local_ip);
	e->ip.smsk.s_addr = inet_addr(local_mask);
	e->ip.src.s_addr &= e->ip.smsk.s_addr;
	e->ip.dst.s_addr = inet_addr(iaddr);
	e->ip.dmsk.s_addr = 0xffffffff;

	e->ip.proto = proto;
	if(proto == IPPROTO_TCP)
	{
		match = get_tcp_match(iport);
	}
	else
	{
		match = get_udp_match(iport);
	}
	e->nfcache = NFC_IP_SRC_PT;

	target = get_snat_target(local_ip, 0);

	e->nfcache |= NFC_UNKNOWN;
	e = realloc(e, sizeof(struct ipt_entry)
	               + match->u.match_size
				   + target->u.target_size);
	memcpy(e->elems, match, match->u.match_size);
	memcpy(e->elems + match->u.match_size, target, target->u.target_size);
	e->target_offset = sizeof(struct ipt_entry)
	                   + match->u.match_size;
	e->next_offset = sizeof(struct ipt_entry)
	                 + match->u.match_size
					 + target->u.target_size;
	
	r = iptc_init_verify_and_append("nat", nat_chain, e, "addnatrule()");
	free(target);
	free(match);
	free(e);
	return r;
}
/* ================================= */
static struct ipt_entry_target *
get_accept_target(void)
{
	struct ipt_entry_target * target = NULL;
	size_t size;
	size =   IPT_ALIGN(sizeof(struct ipt_entry_target))
	       + IPT_ALIGN(sizeof(int));
	target = calloc(1, size);
	target->u.user.target_size = size;
	strncpy(target->u.user.name, "ACCEPT", IPT_FUNCTION_MAXNAMELEN);
	return target;
}

/* add_filter_rule()
 * */
int
add_filter_rule(int proto, const char * iaddr, unsigned short iport)
{
	int r = 0;
#ifdef USE_FORWARD_CHAIN
	struct ipt_entry * e;
	struct ipt_entry_match *match = NULL;
	struct ipt_entry_target *target = NULL;

	e = calloc(1, sizeof(struct ipt_entry));
	e->ip.proto = proto;
	if(proto == IPPROTO_TCP)
	{
		match = get_tcp_match(iport);
	}
	else
	{
		match = get_udp_match(iport);
	}
	e->nfcache = NFC_IP_DST_PT;
	e->ip.dst.s_addr = inet_addr(iaddr);
	e->ip.dmsk.s_addr = INADDR_NONE;
	target = get_accept_target();
	e->nfcache |= NFC_UNKNOWN;
	e = realloc(e, sizeof(struct ipt_entry)
	               + match->u.match_size
				   + target->u.target_size);
	memcpy(e->elems, match, match->u.match_size);
	memcpy(e->elems + match->u.match_size, target, target->u.target_size);
	e->target_offset = sizeof(struct ipt_entry)
	                   + match->u.match_size;
	e->next_offset = sizeof(struct ipt_entry)
	                 + match->u.match_size
					 + target->u.target_size;
	
	r = iptc_init_verify_and_append("filter", miniupnpd_forward_chain, e, "add_filter_rule()");
	free(target);
	free(match);
	free(e);
#endif
	return r;
}

/* ================================ */
static int
print_match(const struct ipt_entry_match *match)
{
	printf("match %s\n", match->u.user.name);
	if(0 == strncmp(match->u.user.name, "tcp", IPT_FUNCTION_MAXNAMELEN))
	{
		struct ipt_tcp * tcpinfo;
		tcpinfo = (struct ipt_tcp *)match->data;
		printf("srcport = %hu:%hu dstport = %hu:%hu\n",
		       tcpinfo->spts[0], tcpinfo->spts[1],
			   tcpinfo->dpts[0], tcpinfo->dpts[1]);
	}
	else if(0 == strncmp(match->u.user.name, "udp", IPT_FUNCTION_MAXNAMELEN))
	{
		struct ipt_udp * udpinfo;
		udpinfo = (struct ipt_udp *)match->data;
		printf("srcport = %hu:%hu dstport = %hu:%hu\n",
		       udpinfo->spts[0], udpinfo->spts[1],
			   udpinfo->dpts[0], udpinfo->dpts[1]);
	}
	return 0;
}

static void
print_iface(const char * iface, const unsigned char * mask, int invert)
{
	unsigned i;
	if(mask[0] == 0)
		return;
	if(invert)
		printf("! ");
	for(i=0; i<IFNAMSIZ; i++)
	{
		if(mask[i])
		{
			if(iface[i])
				putchar(iface[i]);
		}
		else
		{
			if(iface[i-1])
				putchar('+');
			break;
		}
	}
}

static void
printip(uint32_t ip)
{
	printf("%u.%u.%u.%u", ip >> 24, (ip >> 16) & 0xff,
	       (ip >> 8) & 0xff, ip & 0xff);
}

/* for debug */
/* read the "filter" and "nat" tables */
int
list_redirect_rule(const char * ifname)
{
	IPTC_HANDLE h;
	const struct ipt_entry * e;
	const struct ipt_entry_target * target;
	const struct ip_nat_multi_range * mr;
	const char * target_str;

	h = iptc_init("nat");
	if(!h)
	{
		printf("iptc_init() error : %s\n", iptc_strerror(errno));
		return -1;
	}
	if(!iptc_is_chain(miniupnpd_nat_chain, h))
	{
		printf("chain %s not found\n", miniupnpd_nat_chain);
		return -1;
	}
#ifdef IPTABLES_143
	for(e = iptc_first_rule(miniupnpd_nat_chain, h);
		e;
		e = iptc_next_rule(e, h))
	{
		target_str = iptc_get_target(e, h);
#else
	for(e = iptc_first_rule(miniupnpd_nat_chain, &h);
		e;
		e = iptc_next_rule(e, &h))
	{
		target_str = iptc_get_target(e, &h);
#endif
		printf("===\n");
		printf("src = %s%s/%s\n", (e->ip.invflags & IPT_INV_SRCIP)?"! ":"",
		       inet_ntoa(e->ip.src), inet_ntoa(e->ip.smsk));
		printf("dst = %s%s/%s\n", (e->ip.invflags & IPT_INV_DSTIP)?"! ":"",
		       inet_ntoa(e->ip.dst), inet_ntoa(e->ip.dmsk));
		/*printf("in_if = %s  out_if = %s\n", e->ip.iniface, e->ip.outiface);*/
		printf("in_if = ");
		print_iface(e->ip.iniface, e->ip.iniface_mask,
		            e->ip.invflags & IPT_INV_VIA_IN);
		printf(" out_if = ");
		print_iface(e->ip.outiface, e->ip.outiface_mask,
		            e->ip.invflags & IPT_INV_VIA_OUT);
		printf("\n");
		printf("ip.proto = %s%d\n", (e->ip.invflags & IPT_INV_PROTO)?"! ":"",
		       e->ip.proto);
		/* display matches stuff */
		if(e->target_offset)
		{
			IPT_MATCH_ITERATE(e, print_match);
			/*printf("\n");*/
		}
		printf("target = %s\n", target_str);
		target = (void *)e + e->target_offset;
		mr = (const struct ip_nat_multi_range *)&target->data[0];
		printf("ips ");
		printip(ntohl(mr->range[0].min_ip));
		printf(" ");
		printip(ntohl(mr->range[0].max_ip));
		printf("\nports %hu %hu\n", ntohs(mr->range[0].min.tcp.port),
		          ntohs(mr->range[0].max.tcp.port));
		printf("flags = %x\n", mr->range[0].flags);
	}
#ifdef IPTABLES_143
	iptc_free(h);
#else
	iptc_free(&h);
#endif
	return 0;
}

