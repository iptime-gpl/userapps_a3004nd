#include <linosconfig.h>

#define RULE_NAME 	"PHILTEC_DVR"

unsigned char philtec_oui[3] = {0x00, 0x02, 0x69};

struct philtec_rule_t {
	char 	protocol[4];
	int	sport, eport;
} philtec_rule[2] =
	{
		{"tcp", 5445, 5455},
		{"tcp", 80, 80},
	};

static void file_forward_rule(int idx, unsigned int ipaddr, netfilter_rule_t *nf_rule)
{
	strcpy(nf_rule->rule_name, RULE_NAME);
	strcpy(nf_rule->protocol, philtec_rule[idx].protocol);
	nf_rule->dst_port_start = philtec_rule[idx].sport;
	nf_rule->dst_port_end = philtec_rule[idx].eport; 
	nf_rule->u.nat.ip_start = ipaddr;

	strcpy(nf_rule->table_name, "nat" );
	strcpy(nf_rule->chain_name, "app_portforward" );
	strcpy(nf_rule->iifname, IF_LOCAL );
	nf_rule->not_flag = INPUT_INTERFACE_NOT;
	nf_rule->target_type = DNAT_TARGET;
	nf_rule->flag = INTERNAL_FORWARD_RULE;
}

void do_philtec_option(unsigned char *chaddr, unsigned int yiaddr)
{
	app_rule_db_t *app_rule_db;
	app_template_t templ;
	netfilter_rule_t *nf_rule;
	int idx;
	

	if ((chaddr[0] != philtec_oui[0]) ||
	    (chaddr[1] != philtec_oui[1]) ||
	    (chaddr[2] != philtec_oui[2]))
		return;
	
	// Add Porf Forwarding
	app_rule_db = malloc( sizeof(app_rule_db_t));
	memset(app_rule_db, 0x0, sizeof(app_rule_db_t));
	netfilter_read_app_ruledb( app_rule_db, APP_VIRTUALSERVER_DB_FILE, APP_VIRTUALSERVER_TEMPLATE );

	memset( &templ, 0x0, sizeof(app_template_t));
	strcpy(templ.rulename, RULE_NAME);
	templ.rule_count = sizeof(philtec_rule)/sizeof(struct philtec_rule_t);
	templ.flag |= USER_DEFINED_FLAG;
	templ.rule_list = malloc( sizeof(netfilter_rule_t) * templ.rule_count);
	memset(templ.rule_list, 0x0 , sizeof(netfilter_rule_t) * templ.rule_count);

	for (idx = 0, nf_rule = templ.rule_list; 
	     idx < templ.rule_count; 
	     idx++, nf_rule++) 
	{
		file_forward_rule(idx, yiaddr, nf_rule);
	}

	if (netfilter_add_app_rule(app_rule_db, &templ) == 0)
	{
		struct in_addr in;
		char hwaddr[20];

		netfilter_write_app_ruledb(app_rule_db);

		// Add a Designated IP in DHCP IP pool
		in.s_addr = yiaddr;
		sprintf(hwaddr,"%02x:%02x:%02x:%02x:%02x:%02x",
			chaddr[0], chaddr[1], chaddr[2], chaddr[3], chaddr[4], chaddr[5]);
		dhcpd_add_static_lease(inet_ntoa(in), hwaddr);

		// Set Remote Mangement Port
		set_remote_mgmt_port(8888);
		set_remote_mgmt_flag(1);

		SIGNAL_UPDATE
		SIGNAL_SAVE
	}

	netfilter_close_app_ruledb(app_rule_db);
	free(templ.rule_list);
	free(app_rule_db);


}

