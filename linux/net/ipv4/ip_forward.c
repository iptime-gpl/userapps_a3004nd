/*
 * INET		An implementation of the TCP/IP protocol suite for the LINUX
 *		operating system.  INET is implemented using the  BSD Socket
 *		interface as the means of communication with the user level.
 *
 *		The IP forwarding functionality.
 *
 * Authors:	see ip.c
 *
 * Fixes:
 *		Many		:	Split from ip.c , see ip_input.c for
 *					history.
 *		Dave Gregorich	:	NULL ip_rt_put fix for multicast
 *					routing.
 *		Jos Vos		:	Add call_out_firewall before sending,
 *					use output device for accounting.
 *		Jos Vos		:	Call forward firewall after routing
 *					(always use output device).
 *		Mike McLagan	:	Routing by source
 */

#include <linux/types.h>
#include <linux/mm.h>
#include <linux/skbuff.h>
#include <linux/ip.h>
#include <linux/icmp.h>
#include <linux/netdevice.h>
#include <linux/slab.h>
#include <net/sock.h>
#include <net/ip.h>
#include <net/tcp.h>
#include <net/udp.h>
#include <net/icmp.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/netfilter_ipv4.h>
#include <net/checksum.h>
#include <linux/route.h>
#include <net/route.h>
#include <net/xfrm.h>

static int ip_forward_finish(struct sk_buff *skb)
{
	struct ip_options * opt	= &(IPCB(skb)->opt);

	IP_INC_STATS_BH(dev_net(skb_dst(skb)->dev), IPSTATS_MIB_OUTFORWDATAGRAMS);

	if (unlikely(opt->optlen))
		ip_forward_options(skb);

	return dst_output(skb);
}

#ifdef CONFIG_FORWARD_SPEED_UP_PATCH
int sysctl_forward_speed_up_flag= 1;
#endif
#if defined(CONFIG_NF_NAT_ISPFAKE) || defined(CONFIG_NF_NAT_ISPFAKE_MODULE)
extern int sysctl_tcp_mss_ispfake;
#endif

#ifdef CONFIG_EMBEDDED_TCP_MSS_PMTU_PATCH
static inline unsigned int
optlen(const u_int8_t *opt, unsigned int offset)
{
        /* Beware zero-length options: make finite progress */
        if (opt[offset] <= TCPOPT_NOP || opt[offset+1] == 0) return 1;
        else return opt[offset+1];
}

unsigned int opti_ipt_tcpmss_pmtu_target(struct sk_buff **pskb)
{
        struct tcphdr *tcph;
        struct iphdr *iph = ip_hdr(*pskb);
        unsigned int tcplen, i;
        u16 newmss;
        u8 *opt;
        u32 minlen = sizeof(*iph) + sizeof(struct tcphdr);
        unsigned int tcphoff = iph->ihl * 4;

        if (!skb_make_writable(pskb, (*pskb)->len))
                return -1;

        tcplen = (*pskb)->len - tcphoff;
        tcph = (void *)iph + tcphoff;

        /* Since it passed flags test in tcp match, we know it is is
           not a fragment, and has data >= tcp header length.  SYN
           packets should not contain data: if they did, then we risk
           running over MTU, sending Frag Needed and breaking things
           badly. --RR */
        if (tcplen != tcph->doff*4) {
                if (net_ratelimit())
                        printk(KERN_ERR "xt_TCPMSS: bad length (%u bytes)\n",
                               (*pskb)->len);
                return -1;
        }

        if (dst_mtu(skb_dst(*pskb)) <= minlen) {
                if (net_ratelimit())
                        printk(KERN_ERR "xt_TCPMSS: "
                               "unknown or invalid path-MTU (%u)\n",
                               dst_mtu(skb_dst(*pskb)));
                return -1;
        }
        newmss = dst_mtu(skb_dst(*pskb)) - minlen;
#if defined(CONFIG_NF_NAT_ISPFAKE) || defined(CONFIG_NF_NAT_ISPFAKE_MODULE)
        if (sysctl_tcp_mss_ispfake) newmss -= 32;
#endif
        opt = (u_int8_t *)tcph;
        for (i = sizeof(struct tcphdr); i < tcph->doff*4; i += optlen(opt, i)) {
                if (opt[i] == TCPOPT_MSS && tcph->doff*4 - i >= TCPOLEN_MSS &&
                    opt[i+1] == TCPOLEN_MSS) {
                        u_int16_t oldmss;

                        oldmss = (opt[i+2] << 8) | opt[i+3];

                        if (oldmss <= newmss)
                                return 0;

                        opt[i+2] = (newmss & 0xff00) >> 8;
                        opt[i+3] = (newmss & 0x00ff);

                        inet_proto_csum_replace2(&tcph->check, *pskb,
                                               htons(oldmss), htons(newmss), 0);
                        return 0;
                }
        }

        return 0;
}
#endif

int ip_forward(struct sk_buff *skb)
{
	struct iphdr *iph;	/* Our header */
	struct rtable *rt;	/* Route we use */
	struct ip_options * opt	= &(IPCB(skb)->opt);

	if (skb_warn_if_lro(skb))
		goto drop;

	if (!xfrm4_policy_check(NULL, XFRM_POLICY_FWD, skb))
		goto drop;

	if (IPCB(skb)->opt.router_alert && ip_call_ra_chain(skb))
		return NET_RX_SUCCESS;

	if (skb->pkt_type != PACKET_HOST)
		goto drop;

	skb_forward_csum(skb);

	/*
	 *	According to the RFC, we must first decrease the TTL field. If
	 *	that reaches zero, we must reply an ICMP control message telling
	 *	that the packet's lifetime expired.
	 */
	if (ip_hdr(skb)->ttl <= 1)
		goto too_many_hops;

	if (!xfrm4_route_forward(skb))
		goto drop;

	rt = skb_rtable(skb);

	if (opt->is_strictroute && rt->rt_dst != rt->rt_gateway)
		goto sr_failed;

	if (unlikely(skb->len > dst_mtu(&rt->dst) && !skb_is_gso(skb) &&
		     (ip_hdr(skb)->frag_off & htons(IP_DF))) && !skb->local_df) {
		IP_INC_STATS(dev_net(rt->dst.dev), IPSTATS_MIB_FRAGFAILS);
		icmp_send(skb, ICMP_DEST_UNREACH, ICMP_FRAG_NEEDED,
			  htonl(dst_mtu(&rt->dst)));
		goto drop;
	}

	/* We are about to mangle packet. Copy it! */
	if (skb_cow(skb, LL_RESERVED_SPACE(rt->dst.dev)+rt->dst.header_len))
		goto drop;
	iph = ip_hdr(skb);

	/* Decrease ttl after skb cow done */
	ip_decrease_ttl(iph);

	/*
	 *	We now generate an ICMP HOST REDIRECT giving the route
	 *	we calculated.
	 */
	if (rt->rt_flags&RTCF_DOREDIRECT && !opt->srr && !skb_sec_path(skb))
		ip_rt_send_redirect(skb);

	/*
         * 1.In general case, we use DSCP to stand for different priority not tos.
         * 2.To make sure vlan priority is the same in rx/tx packet
         * FIXME - Steven
         */
#if !defined (CONFIG_RA_NAT_HW)
        if(iph->tos != 0) {
            skb->priority = rt_tos2priority(iph->tos);
        }
#endif

#ifdef CONFIG_EMBEDDED_TCP_MSS_PMTU_PATCH
        {
                struct tcphdr *tcph;
                struct iphdr *iph = ip_hdr(skb);

                if( iph->protocol == IPPROTO_TCP )
                {
                        tcph = (void *)iph + iph->ihl*4;
                        if((tcph->rst == 0) && (tcph->syn == 1 ))
                                opti_ipt_tcpmss_pmtu_target(&skb);
                }
        }
#endif

#ifdef CONFIG_FORWARD_SPEED_UP_PATCH
        if(sysctl_forward_speed_up_flag)
                return ip_forward_finish(skb);
        else
#endif

	return NF_HOOK(NFPROTO_IPV4, NF_INET_FORWARD, skb, skb->dev,
		       rt->dst.dev, ip_forward_finish);

sr_failed:
	/*
	 *	Strict routing permits no gatewaying
	 */
	 icmp_send(skb, ICMP_DEST_UNREACH, ICMP_SR_FAILED, 0);
	 goto drop;

too_many_hops:
	/* Tell the sender its packet died... */
	IP_INC_STATS_BH(dev_net(skb_dst(skb)->dev), IPSTATS_MIB_INHDRERRORS);
	icmp_send(skb, ICMP_TIME_EXCEEDED, ICMP_EXC_TTL, 0);
drop:
	kfree_skb(skb);
	return NET_RX_DROP;
}
