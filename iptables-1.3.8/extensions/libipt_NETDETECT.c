#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <getopt.h>

#include <iptables.h>
#include <linux/netfilter_ipv4/ip_tables.h>
#include <linux/netfilter_ipv4/ipt_NETDETECT.h>

/* Function which prints out usage message. */
static void help(void)
{
	printf(
"NETDETECT target option:\n"
"   --limit value         The maximum number of packets to match\n"
"\n");
}

static struct option opts[] = {
	{ "limit", 1, 0, '1' },
	{ 0 }
};

/* Initialize the target. */
static void init(struct ipt_entry_target *t, unsigned int *nfcache)
{
}

/* Function which parses command options; returns true if it
   ate an option */
static int parse(int c, char **argv, int invert, unsigned int *flags,
      const struct ipt_entry *entry,
      struct ipt_entry_target **target)
{
	struct ipt_net_detect_target_info *netdetect_info
		= (struct ipt_net_detect_target_info *)(*target)->data;
	unsigned int value;

	if (string_to_number(optarg, 0, 255, &value) == -1)
		exit_error(PARAMETER_PROBLEM, "Bad NETDETECT value `%s'", optarg);
	if (*flags)
		exit_error(PARAMETER_PROBLEM, "NETDETECT target: Can't specify --limit twice");

        switch (c) {
        case '1':
                *flags = 1;
                break;
        default:
                return 0;
        }

	netdetect_info->limit = value;

	return 1;
}

static void final_check(unsigned int flags)
{
        if (!flags)
                exit_error(PARAMETER_PROBLEM,
                           "NETDETECT target: Parameter --limit is required");
}

/* Prints out the targinfo. */
static void print(const struct ipt_ip *ip,
      const struct ipt_entry_target *target,
      int numeric)
{
        const struct ipt_net_detect_target_info *netdetect_info =
                (const struct ipt_net_detect_target_info *)target->data;
        printf("NETDETECT set ");
        printf("0x%x ",netdetect_info->limit);
}

/* Saves the union ipt_targinfo in parsable form to stdout. */
static void save(const struct ipt_ip *ip, const struct ipt_entry_target *target)
{
        const struct ipt_net_detect_target_info *netdetect_info =
                (const struct ipt_net_detect_target_info *)target->data;

        printf("--limit 0x%x ",netdetect_info->limit);
}

static struct iptables_target netdetect
= { 
	.next		= NULL,
	.name		= "NETDETECT",
	.version	= IPTABLES_VERSION,
	.revision       = 0,
	.size		= IPT_ALIGN(sizeof(struct ipt_net_detect_target_info)),
	.userspacesize	= IPT_ALIGN(sizeof(struct ipt_net_detect_target_info)),
	.help		= &help,
	.init		= &init,
	.parse		= &parse,
	.final_check	= &final_check,
	.print		= &print,
	.save		= &save,
	.extra_opts	= opts
};

void _init(void)
{
	register_target(&netdetect);
}
