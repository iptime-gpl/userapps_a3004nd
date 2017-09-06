#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/skbuff.h>
#include <linux/netfilter_ipv4.h>
#include <linux/if.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <net/checksum.h>

#include <net/netfilter/nf_conntrack.h>
#include <net/netfilter/nf_conntrack_core.h>
#include <net/netfilter/nf_conntrack_tuple.h>
#include <net/netfilter/nf_nat_helper.h>

#undef printk

extern unsigned int (*nf_nat_ispfake_hook)(struct sk_buff *skb,
	struct nf_conn *ct,
	enum ip_conntrack_info ctinfo,
	struct iphdr   *iph,
	char *bnet_data);

static char new_path[32]="/?index";

/* Return 1 for match, 0 for accept, -1 for partial. */
static int find_pattern(const char *data, size_t dlen,
        const char *pattern, size_t plen,
        char term,
        unsigned int *numoff,
        unsigned int *numlen)
{
    size_t i, j, k;
    int state = 0;
    *numoff = *numlen = 0;

    if (dlen == 0)
        return 0;

    if (dlen <= plen) { /* Short packet: try for partial? */
        if (strnicmp(data, pattern, dlen) == 0)
            return -1;
        else
            return 0;
    }
    for (i = 0; i <= (dlen - plen); i++) {
        /* DFA : \r\n\r\n :: 1234 */
        if (*(data + i) == '\r') {
            if (!(state % 2)) state++;  /* forwarding move */
            else state = 0;             /* reset */
        }
        else if (*(data + i) == '\n') {
            if (state % 2) state++;
            else state = 0;
        }
        else state = 0;

        if (state >= 4)
            break;

        /* pattern compare */
        if (memcmp(data + i, pattern, plen ) != 0)
            continue;

        /* Here, it means patten match!! */
        *numoff=i + plen;
        for (j = *numoff, k = 0; data[j] != term; j++, k++)
            if (j > dlen) return -1 ;   /* no terminal char */

        *numlen = k;
        return 1;
    }
    return 0;
}

static unsigned int help(struct sk_buff *skb,
                         struct nf_conn *ct,
                         enum ip_conntrack_info ctinfo,
                         struct iphdr   *iph,
                         char *data)
{
	struct tcphdr *tcph = (void *)iph + iph->ihl*4;
	unsigned int datalen = skb->len - (iph->ihl*4) - (tcph->doff*4);
	int found, offset, pathlen;
	char cur_url[2048];

	if (memcmp(data, "GET ", sizeof("GET ") - 1) != 0 &&
	    memcmp(data, "POST ", sizeof("POST ") - 1) != 0)
		return NF_ACCEPT;

	found = find_pattern(data, datalen, "GET ", sizeof("GET ") - 1, '\r', &offset, &pathlen);
	if (!found)
		found = find_pattern(data, datalen, "POST ", sizeof("POST ") - 1, '\r', &offset, &pathlen);

	if (!found || (pathlen -= (sizeof(" HTTP/x.x") - 1)) <= 0)
		return NF_ACCEPT;

	memset(cur_url, 0, sizeof(cur_url));
	strncpy(cur_url, data + offset, pathlen);

	if (!strcmp(cur_url,"/"))
	{
		nf_nat_mangle_tcp_packet(skb, ct, ctinfo, offset, pathlen, new_path, strlen(new_path));
		//printk("url:[%s][%s], len=%d \n", new_path, cur_url, pathlen);
	}

	return NF_ACCEPT;
}

static int proc_write_path(struct file *file, const char *buffer, u_long count, void *data)
{
	new_path[0] = '/';
	new_path[1] = '?';
	memcpy(&new_path[2], buffer, count);
	new_path[count+2]=0x0;

	return count;
}

static void fini(void)
{
	remove_proc_entry("driver/ispfake_path", NULL);
	rcu_assign_pointer(nf_nat_ispfake_hook, NULL);
	synchronize_rcu();
}

static int __init init(void)
{
	struct proc_dir_entry *proc_entry;

	BUG_ON(rcu_dereference(nf_nat_ispfake_hook));
	rcu_assign_pointer(nf_nat_ispfake_hook, help);

	proc_entry = create_proc_entry("driver/ispfake_path", 0, 0);
	if( proc_entry != NULL ) proc_entry->write_proc = &proc_write_path;

	return 0;
}


module_init(init);
module_exit(fini);
