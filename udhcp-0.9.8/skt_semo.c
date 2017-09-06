#include <linosconfig.h>

#define RULE_NAME 	"SKT_SEMO"

struct skt_semo_rule_t {
	unsigned char oui[3];
	char 	protocol[4];
	int	sport;
} skt_semo_rule[] =
	{
		{{0x00,0x1b,0xa6}, "all", 20406}, 	//EX-DVR
		{{0x00,0x1b,0xa6}, "all", 20407}, 	//EX-DVR
		{{0x00,0x1b,0xa6}, "all", 20408}, 	//EX-DVR
		{{0x00,0x1b,0xa6}, "all", 20409}, 	//EX-DVR
		{{0x00,0x1b,0xa6}, "all", 20410},  	//EX-DVR
		{{0x00,0x17,0xbd}, "all", 8000},  	//SKT-D-DVR
		{{0x00,0x17,0xbd}, "all", 9091},  	//SKT-D-DVR
		{{0x00,0x17,0xbd}, "all", 9092},  	//SKT-D-DVR
		{{0x00,0x25,0xc2}, "all", 65500},	// Main Device
		{{0x00,0x19,0x19}, "all", 7000},  	// HD DVR

		{{0x00,0x1c,0x46}, "all", 8000},  	// SKY-H
		{{0x00,0x1c,0x46}, "all", 9091},  	// SKY-H
		{{0x8c,0xe7,0x48}, "all", 554},  	// SKY-H
		{{0x8c,0xe7,0x48}, "all", 8000},  	// SKY-H
		{{0x8c,0xe7,0x48}, "all", 9091},  	// SKY-H

		{{0x00,0x14,0x1f}, "all", 554},  	// SKY-H
		{{0x00,0x14,0x1f}, "all", 8000},  	// SKY-H
		{{0x00,0x14,0x1f}, "all", 9091},  	// SKY-H
		{{0x00,0x14,0x1f}, "all", 11001},  	// SKY-H

		{{0x00,0x00,0x00}, "", 0},
	};

static void file_forward_rule(int idx, unsigned int ipaddr, netfilter_rule_t *nf_rule)
{
	strcpy(nf_rule->protocol, skt_semo_rule[idx].protocol);
	nf_rule->dst_port_start = skt_semo_rule[idx].sport;
	nf_rule->dst_port_end = 0;
	nf_rule->u.nat.ip_start = ntohl(ipaddr);

	strcpy(nf_rule->table_name, "nat" );
	strcpy(nf_rule->chain_name, "app_portforward" );
	strcpy(nf_rule->iifname, IF_LOCAL );
	nf_rule->not_flag = INPUT_INTERFACE_NOT;
	nf_rule->target_type = DNAT_TARGET;
	nf_rule->flag = INTERNAL_FORWARD_RULE;
}


void do_skt_semo_option(unsigned char *chaddr, unsigned int yiaddr)
{
	app_rule_db_t *app_rule_db;
	app_template_t templ;
	netfilter_rule_t *nf_rule;
	int idx;

	syslog_msg( SYSMSG_LOG_INFO, "chaddr %02x %02x %02x %02x %02x %02x",
		chaddr[0],
		chaddr[1],
		chaddr[2],
		chaddr[3],
		chaddr[4],
		chaddr[5]);

	for (idx = 0; ; idx++)
	{
		if ((0x0 == skt_semo_rule[idx].oui[0]) &&
		    (0x0 == skt_semo_rule[idx].oui[1]) &&
		    (0x0 == skt_semo_rule[idx].oui[2]))
		{	
			//syslog_msg( SYSMSG_LOG_INFO, "NO skt semo mac");
			return;
		}

		if ((chaddr[0] == skt_semo_rule[idx].oui[0]) &&
		    (chaddr[1] == skt_semo_rule[idx].oui[1]) &&
		    (chaddr[2] == skt_semo_rule[idx].oui[2]))
		{	
			//syslog_msg( SYSMSG_LOG_INFO, "OK skt semo mac");
			break;
		}
	}

	// Add Porf Forwarding
	app_rule_db = malloc( sizeof(app_rule_db_t));
	memset(app_rule_db, 0x0, sizeof(app_rule_db_t));
	netfilter_read_app_ruledb( app_rule_db, APP_VIRTUALSERVER_DB_FILE, APP_VIRTUALSERVER_TEMPLATE );

	for (idx = 0; ; idx++) 
	{
		if ((0x0 == skt_semo_rule[idx].oui[0]) &&
		    (0x0 == skt_semo_rule[idx].oui[1]) &&
		    (0x0 == skt_semo_rule[idx].oui[2]))
			break;

		if ((chaddr[0] == skt_semo_rule[idx].oui[0]) &&
		    (chaddr[1] == skt_semo_rule[idx].oui[1]) &&
		    (chaddr[2] == skt_semo_rule[idx].oui[2]))
		{
			memset( &templ, 0x0, sizeof(app_template_t));
			sprintf(templ.rulename, "%02x%02x%02x_%d", 
				chaddr[3], chaddr[4], chaddr[5], skt_semo_rule[idx].sport);

			netfilter_remove_app_rulelist(app_rule_db, templ.rulename, 1); // remove a old rule

			//syslog_msg( SYSMSG_LOG_INFO, "skt rule %s", templ.rulename);

			templ.rule_count = 1;
			templ.flag |= USER_DEFINED_FLAG;
			templ.rule_list = malloc( sizeof(netfilter_rule_t) * templ.rule_count);
			memset(templ.rule_list, 0x0 , sizeof(netfilter_rule_t) * templ.rule_count);
			nf_rule = templ.rule_list;
			strcpy(nf_rule->rule_name, templ.rulename);
			file_forward_rule(idx, yiaddr, nf_rule);
			netfilter_add_app_rule(app_rule_db, &templ);
		}
	}

	netfilter_write_app_ruledb(app_rule_db);
	netfilter_close_app_ruledb(app_rule_db);
	free(app_rule_db);

	SIGNAL_SAVE
}

