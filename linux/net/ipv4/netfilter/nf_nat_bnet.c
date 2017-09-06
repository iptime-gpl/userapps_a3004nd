/* BNET extension for TCP NAT alteration. */
#include <linux/module.h>
#include <linux/skbuff.h>
#include <linux/netfilter_ipv4.h>
#include <linux/if.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <net/tcp.h>
#include <net/udp.h>
#include <net/checksum.h>
#include <linux/rculist.h>

#include <net/netfilter/nf_conntrack.h>
#include <net/netfilter/nf_conntrack_core.h>
#include <net/netfilter/nf_conntrack_tuple.h>
#include <net/netfilter/nf_nat_helper.h>
#include <net/netfilter/nf_conntrack_zones.h>
#include <linux/netfilter/nf_conntrack_bnet.h>

MODULE_AUTHOR("EFM>");
MODULE_DESCRIPTION("Starcraft Bnet NAT helper");
MODULE_LICENSE("GPL");
MODULE_ALIAS("ip_nat_bnet");

#if 1
#define DEBUGP printk
#else
#define DEBUGP(format, args...)
#endif

#define CLIENT_INFO_OFFSET 16
#define CLIENT_INFO_PACKET_MIN_SIZE 80

#define CLIENT_INFO_OFFSET2 4

/*** BNET Starcraft 1.09 & 1.10 ***/
static u8 host_info_head[CLIENT_INFO_OFFSET] = {
        0xff, 0x50, 0x32, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x38,
        0x58, 0x49, 0x50, 0x58, 0x45, 0x53
}; // host_info_head[2] : 0x32 == windows language dependancy value -> should be skipped

/*** BNET Free BNET Starcraft 1.08 ***/
static u8 host_info_head2[CLIENT_INFO_OFFSET2] = {
        0xff, 0x1E, 0x1A, 0x00
};

static unsigned int help(struct sk_buff *skb, 
		         struct nf_conn *ct,
			 enum ip_conntrack_info ctinfo,
			 struct iphdr   *iph,
			 char *bnet_data)
{
        char *pdata = NULL;
        u32  addrpos = 0, addrlen = 0;
        u32  offset, i;
        struct nf_conntrack_tuple ct_tuple, udp_tuple;
        struct nf_conntrack_tuple_mask udp_tuple_mask;
        struct nf_conntrack_tuple_hash *tuple_hash;
	struct nf_conn *ctrack;
	struct net *net = nf_ct_net(ct);
	u16 zone = nf_ct_zone(ct);


        if (skb->len < CLIENT_INFO_PACKET_MIN_SIZE)
                return NF_ACCEPT;
	if (iph->saddr != ct->tuplehash[IP_CT_DIR_REPLY].tuple.dst.u3.ip)
	{
		//printk("bnet: sadddr : %08x \n", ntohl(iph->saddr));
                return NF_ACCEPT;
	}

	memset(&ct_tuple, 0x0, sizeof(struct nf_conntrack_tuple));
	memset(&udp_tuple, 0x0, sizeof(struct nf_conntrack_tuple));
	memset(&udp_tuple_mask, 0x0, sizeof(struct nf_conntrack_tuple_mask));

	pdata =  bnet_data;

        offset = 0;
        while ( (offset != CLIENT_INFO_OFFSET) &&
		((host_info_head[offset] == (u8)(*pdata++)) || (offset == 2)) && ++offset);

        if (offset!= CLIENT_INFO_OFFSET)
        {
                pdata = bnet_data;

                offset = 0;
                while ( (offset != CLIENT_INFO_OFFSET2) &&
                        (host_info_head2[offset++] == (u8)(*pdata++)));
                if( offset != CLIENT_INFO_OFFSET2 )
                        return NF_ACCEPT;
        }

        addrpos = (pdata + 8) - bnet_data;
        addrlen = sizeof(unsigned int);

        nf_nat_mangle_tcp_packet(skb, ct, ctinfo, addrpos, addrlen,
                        (char *) &ct->tuplehash[IP_CT_DIR_REPLY].tuple.dst.u3.ip, addrlen);

        ct_tuple.src.u3.ip = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip;
        ct_tuple.src.u.udp.port = htons(BNET_PORT);
        ct_tuple.dst.u3.ip = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.u3.ip;
        ct_tuple.dst.u.udp.port = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.u.udp.port;
        ct_tuple.dst.protonum = IPPROTO_UDP;

	//NF_CT_DUMP_TUPLE(&ct_tuple);

        tuple_hash = nf_conntrack_find_get(net, zone, &ct_tuple);

        if( tuple_hash )
        {
		ctrack = nf_ct_tuplehash_to_ctrack(tuple_hash);
                if(del_timer( &ctrack->timeout ))
                        ctrack->timeout.function((unsigned long)ctrack);
        }


        udp_tuple.src.u3.ip = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.dst.u3.ip;
        udp_tuple.src.u.udp.port = 0;
        udp_tuple.dst.u3.ip = ct->tuplehash[IP_CT_DIR_REPLY].tuple.dst.u3.ip;
        udp_tuple.dst.u.udp.port = htons(BNET_PORT);
        udp_tuple.dst.protonum = IPPROTO_UDP;

        udp_tuple_mask.src.u3.ip = 0xffffffff;
        udp_tuple_mask.src.u.udp.port = 0;
#if 0
        udp_tuple_mask.dst.u3.ip = 0xffffffff;
        udp_tuple_mask.dst.u.udp.port = 0xffff;
        udp_tuple_mask.dst.protonum = 0xff;
#endif

        for (i=0; !tuple_hash && i < net->ct.htable_size; i++)
        {
		struct nf_conntrack_tuple_hash *h;
		struct hlist_nulls_node *n;

		hlist_nulls_for_each_entry_rcu(h, n, &net->ct.hash[i], hnnode)
		{
			//NF_CT_DUMP_TUPLE(&h->tuple);
			if (nf_ct_tuple_mask_cmp(&h->tuple, &udp_tuple, &udp_tuple_mask))
			{
				tuple_hash = h;
				break;
			}
		}

        }

        if( tuple_hash )
        {
		//NF_CT_DUMP_TUPLE(&udp_tuple);
		//NF_CT_DUMP_TUPLE(&tuple_hash->tuple);

		ctrack = nf_ct_tuplehash_to_ctrack(tuple_hash);
                if(del_timer( &ctrack->timeout ))
                        ctrack->timeout.function((unsigned long)ctrack);
        }

        skb->mark = ct->tuplehash[IP_CT_DIR_ORIGINAL].tuple.src.u3.ip;

        return NF_QUEUE;
}

/* Not __exit: called from init() */
static void fini(void)
{
	printk("ip_nat_bnet: unregistering port %d\n", BNET_PORT);
	rcu_assign_pointer(nf_nat_bnet_hook, NULL);
	synchronize_rcu();
}

static int __init init(void)
{
	printk("ip_nat_bnet: Trying to register for port %d\n", BNET_PORT);
	BUG_ON(rcu_dereference(nf_nat_bnet_hook));
	rcu_assign_pointer(nf_nat_bnet_hook, help);
	return 0;

}


module_init(init);
module_exit(fini);
