#include <linosconfig.h>
#include <lib/portforward_v2_api.h>

#define RULE_NAME 	"PHILTEC_DVR"

unsigned char philtec_oui[3] = {0x00, 0x02, 0x69};

struct philtec_rule_t {
	char 	protocol[4];
	int	sport, eport;
} philtec_rule[2] =
	{
		{"tcp", 5445, 5447},
		{"tcp", 80, 80},
	};

static portforward_rule_t *make_pf_rule(unsigned int in_ip, int idx)
{
	portforward_rule_t *rt;
	portforward_nf_t *nt;
	struct in_addr in;

	in.s_addr = in_ip;

	rt = (portforward_rule_t *)malloc(sizeof(portforward_rule_t));
	init_pf_rule(rt);
	
	nt = (portforward_nf_t *)malloc(sizeof(portforward_nf_t));
	init_pf_netfilter(nt);	insert_nf_to_rule(rt, nt);
	rt->trigger = __FORWARD_RULE;

	/*RULE_NAME*/
	//sf_strncpy(rt->name, RULE_NAME, __MAX_PF_RULE_NAME_LENGTH);
	snprintf(rt->name, __MAX_PF_RULE_NAME_LENGTH-1, "%s_%d", RULE_NAME, idx+1);
	/*INTERNAL IP*/
	sf_strncpy(nt->local_ip, inet_ntoa(in), __MAX_PF_IP_LENGTH);
	/*SPORT*/
	nt->ext_sport = philtec_rule[idx].sport;
	/*EPORT*/
	nt->ext_eport = philtec_rule[idx].eport;
	/*PROTOCOL*/
	sf_strncpy(nt->protocol, philtec_rule[idx].protocol, __MAX_PF_PROTOCOL_LENGTH);
	
	return rt;
}

void do_philtec_option(unsigned char *chaddr, unsigned int yiaddr)
{
	struct in_addr in;
	char hwaddr[20];
	char ipaddr[__MAX_PF_IP_LENGTH];
	int idx, count;
	portforward_rule_t *rt;

	if ((chaddr[0] != philtec_oui[0]) ||
	    (chaddr[1] != philtec_oui[1]) ||
	    (chaddr[2] != philtec_oui[2]))
		return;

	// Add Port Forwarding
	count = sizeof(philtec_rule)/sizeof(struct philtec_rule_t);
	for(idx = count-1; idx >= 0; idx--){
		rt = make_pf_rule(yiaddr, idx);
		portforward_remove_rule("user_pf", rt->name);	/* this func will be remove old rule if exist */
		portforward_add_rule("user_pf", rt, 0);
		delete_pf_rule(NULL, rt);	rt = NULL;
	}

	// Add a Designated IP in DHCP IP pool
	in.s_addr = yiaddr;
	sprintf(hwaddr,"%02x:%02x:%02x:%02x:%02x:%02x",
		chaddr[0], chaddr[1], chaddr[2], chaddr[3], chaddr[4], chaddr[5]);
	sf_strncpy(ipaddr, inet_ntoa(in), __MAX_PF_IP_LENGTH);
	dhcpd_add_static_lease(ipaddr, hwaddr);

	// Set Remote Mangement Port
	set_remote_mgmt_port(8888);
	set_remote_mgmt_flag(1);

	SIGNAL_UPDATE
	SIGNAL_SAVE
}

