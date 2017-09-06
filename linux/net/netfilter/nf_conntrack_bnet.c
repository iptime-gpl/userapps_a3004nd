/* (C) 2001-2002 Magnus Boden <mb@ozaba.mine.nu>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 */

#include <linux/module.h>
#include <linux/moduleparam.h>
#include <linux/in.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/netfilter.h>

#include <net/netfilter/nf_conntrack.h>
#include <net/netfilter/nf_conntrack_tuple.h>
#include <net/netfilter/nf_conntrack_expect.h>
#include <net/netfilter/nf_conntrack_ecache.h>
#include <net/netfilter/nf_conntrack_helper.h>
#include <linux/netfilter/nf_conntrack_bnet.h>

MODULE_AUTHOR("EFM");
MODULE_DESCRIPTION("BNET connection tracking helper");
MODULE_LICENSE("GPL");
MODULE_ALIAS("ip_conntrack_bnet");

#if 0
#define DEBUGP(format, args...) printk("%s:%s:" format, \
				       __FILE__, __FUNCTION__ , ## args)
#else
//#define DEBUGP(format, args...)
#define DEBUGP printk
#endif

unsigned int (*nf_nat_bnet_hook)(struct sk_buff *skb,
                                 struct nf_conn *ct,
                                 enum ip_conntrack_info ctinfo,
				 struct iphdr   *iph,
 			         char *bnet_data) __read_mostly; 

EXPORT_SYMBOL_GPL(nf_nat_bnet_hook);

static int bnet_help(struct sk_buff *skb,
		     unsigned int protoff,
		     struct nf_conn *ct,
		     enum ip_conntrack_info ctinfo)
{
	unsigned int ret = NF_ACCEPT;
	typeof(nf_nat_bnet_hook) nf_nat_bnet;

	struct iphdr   *iph = ip_hdr(skb);
	struct tcphdr  *th = (struct tcphdr *)((u8*)iph + (iph->ihl * 4));

#if defined(CONFIG_DRIVERLEVEL_REAL_IPCLONE) || defined(CONFIG_DRIVERLEVEL_REAL_IPCLONE_MODULE)
        if (ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip == htonl(0xc0a8ff02))
        {  /* 192.168.255.2 */
		DEBUGP("--> src : %08x, %08x \n", iph->saddr, htonl(0xc0a8ff02));
        }
        else
#endif
        if (th->rst)
	{
		skb->mark = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip;
                ret = NF_QUEUE;
		printk("bnet : tcp reset\n");
	}
        else if (th->fin && th->ack)
	{
		skb->mark = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip;
                ret = NF_QUEUE;
		printk("bnet : tcp fin & ack\n");
	}
        else
	{
		nf_nat_bnet = rcu_dereference(nf_nat_bnet_hook);
		if (nf_nat_bnet)
		{
			char *bnet_data;
			th = (struct tcphdr *)((u8*)iph + (iph->ihl * 4));
			bnet_data = (char*)th + (th->doff * 4);

			ret = nf_nat_bnet(skb, ct, ctinfo, iph, bnet_data);
		}
		else
			DEBUGP("--> bnet: do nothing\n");
	}

	return ret;
}

static struct nf_conntrack_helper bnet __read_mostly;
static char bnet_names[sizeof("bnet-65535")] __read_mostly;
static struct nf_conntrack_expect_policy bnet_exp_policy;

static void nf_conntrack_bnet_fini(void)
{
	nf_conntrack_helper_unregister(&bnet);
}

static int __init nf_conntrack_bnet_init(void)
{
	memset(&bnet, 0x0, sizeof(struct nf_conntrack_helper));

	bnet_exp_policy.max_expected = 0;
        bnet_exp_policy.timeout = 30;

	bnet.tuple.src.l3num = AF_INET;
	bnet.tuple.src.u.tcp.port = htons(BNET_PORT);
	bnet.tuple.dst.protonum = IPPROTO_TCP;
	bnet.me = THIS_MODULE;
	bnet.expect_policy = &bnet_exp_policy;
	bnet.help = bnet_help;
	strcpy(bnet_names, "BNET");
	bnet.name = &bnet_names[0];

	if (nf_conntrack_helper_register(&bnet))
	{
		printk("nf_ct_bnet: failed to register helper for pf: %u port: %u\n",
			bnet.tuple.src.l3num, BNET_PORT);
		nf_conntrack_bnet_fini();
		return 1;
	}

	return 0;
}

module_init(nf_conntrack_bnet_init);
module_exit(nf_conntrack_bnet_fini);
