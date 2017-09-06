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

MODULE_AUTHOR("EFM");
MODULE_DESCRIPTION("URLCOOK connection tracking helper");
MODULE_LICENSE("GPL");
MODULE_ALIAS("ip_conntrack_ispfake");

unsigned int (*nf_nat_ispfake_hook)(struct sk_buff *skb,
                                 struct nf_conn *ct,
                                 enum ip_conntrack_info ctinfo,
				 struct iphdr   *iph,
 			         char *ispfake_data) __read_mostly; 
EXPORT_SYMBOL_GPL(nf_nat_ispfake_hook);

int sysctl_tcp_mss_ispfake = 0;

extern int check_internal_subnet(u32 ipaddr);

#undef printk
static int ispfake_help(struct sk_buff *skb,
		     unsigned int protoff,
		     struct nf_conn *ct,
		     enum ip_conntrack_info ctinfo)
{
	unsigned int ret = NF_ACCEPT;
	typeof(nf_nat_ispfake_hook) nf_nat_ispfake;

	struct iphdr   *iph = ip_hdr(skb);
	struct tcphdr  *tcph = (struct tcphdr *)((void*)iph + (iph->ihl * 4));
	unsigned char *data = (void *)tcph + tcph->doff*4;
	unsigned int datalen = skb->len - (iph->ihl*4) - (tcph->doff*4);

	if (!sysctl_tcp_mss_ispfake) return NF_ACCEPT;
	if (datalen < 10) return NF_ACCEPT;
	if (check_internal_subnet(ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip) == 0) return NF_ACCEPT;

	nf_nat_ispfake = rcu_dereference(nf_nat_ispfake_hook);
	if (nf_nat_ispfake)
		ret = nf_nat_ispfake(skb, ct, ctinfo, iph, data);
	else
		printk("--> ispfake: do nothing\n");

	return ret;
}

static struct nf_conntrack_helper ispfake __read_mostly;
static char ispfake_names[sizeof("ispfake-65535")] __read_mostly;
static struct nf_conntrack_expect_policy isp_exp_policy;

static void nf_conntrack_ispfake_fini(void)
{
	nf_conntrack_helper_unregister(&ispfake);
}

static int __init nf_conntrack_ispfake_init(void)
{
	memset(&ispfake, 0x0, sizeof(struct nf_conntrack_helper));

	isp_exp_policy.max_expected = 0;
	isp_exp_policy.timeout = 30; /* 30 sec */

	ispfake.tuple.src.l3num = AF_INET;
	ispfake.tuple.src.u.tcp.port = htons(80);
	ispfake.tuple.dst.protonum = IPPROTO_TCP;
	ispfake.me = THIS_MODULE;
	ispfake.expect_policy = &isp_exp_policy;
	ispfake.help = ispfake_help;
	strcpy(ispfake_names, "ISPFAKE");
	ispfake.name = &ispfake_names[0];

	if (nf_conntrack_helper_register(&ispfake))
	{
		printk("nf_ct_ispfake: failed to register helper for pf: %u port: %u\n",
			ispfake.tuple.src.l3num, 80);
		nf_conntrack_ispfake_fini();
		return 1;
	}

	return 0;
}

module_init(nf_conntrack_ispfake_init);
module_exit(nf_conntrack_ispfake_fini);
