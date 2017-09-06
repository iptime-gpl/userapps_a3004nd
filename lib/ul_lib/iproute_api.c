#include <stdio.h>
#include <netinet/in.h>
#include <linosconfig.h>

#define DEFAUTL_GATEWAY_DELETE     "/bin/ip route del default table %d"
/*                                                                  tid */
#define DEFAUTL_GATEWAY_ADD        "/bin/ip route add default dev %s via %s table %d"
/*                                                              ifname   gw       tid */
#define DEFAUTL_GATEWAY_PPP_ADD    "/bin/ip route add default dev %s table %d"
/*                                                              ifname    tid */
#define DEFAULT_GATEWAY_SUBNET_ADD "/bin/ip route %s %s/%d dev %s"
/*                                               cmd net/mask ifname  */
#define ROUTING_TABLE_GET          "/bin/ip route list table %d"
/*                                                           tid */

int iproute_get_routing_table_id(char *ifname);

int iproute_set_default_gw(char *ifname, char *gw, int table)
{
	char command[256];

	if (!table)
		table = iproute_get_routing_table_id(ifname);

	snprintf(command,256, DEFAUTL_GATEWAY_DELETE, table);
	system(command);

	if (gw == NULL)
		return 0;

	if (!strncmp(ifname, "ppp", 3))
	{
		snprintf(command,256, DEFAUTL_GATEWAY_PPP_ADD, ifname, table);
	}
	else
	{
		/* BEGIN - add default gateway subnet to routing table */
		char ipaddr[16], netmask[16];
		unsigned int ip, mask, gateway;
		unsigned int subnet=0,netbit=0x80000000;
		struct in_addr in;

		get_ifconfig(ifname, ipaddr, netmask);
		ip = inet_addr(ipaddr);
		mask = inet_addr(netmask);
		gateway = inet_addr(gw);

		if((ip==-1) || (gateway==-1)) 
		{
			//printf("iproute_set_default_gw: can't set gateway: ip:%08x gateway:%08x\n", ip, gateway);
			return 0;
		}

		if ((ip & mask) != (gateway & mask))
		{
			in.s_addr = gateway & mask;
			while ((netbit >> subnet) & ntohl(mask)) 
			{
				subnet++;
				if(subnet > 32) break;
			}

			snprintf(command,256, DEFAULT_GATEWAY_SUBNET_ADD, 
				"add", inet_ntoa(in), subnet ,ifname); 
			system(command);
		}
		/* END - add default gateway subnet to routing table */

		snprintf(command,256, DEFAUTL_GATEWAY_ADD, ifname, gw, table);
	}
	system(command);

	return 0;
}


int iproute_get_default_gw(char *ifname, char *gw, int table)
{
	char command[256], buf[1024], tmp[32];
	int rc;
	FILE *fp;

	if (!table)
		table = iproute_get_routing_table_id(ifname);

	snprintf(command,256, ROUTING_TABLE_GET" > /tmp/rtable", table);
	system(command);

	strcpy(gw, "");
	rc = 0; 

	fp = fopen("/tmp/rtable", "r");
	if (fp)
	{
		while(!feof(fp))
		{
			if (fgets(buf, 1024, fp) == NULL)
				break;
			if (!strncmp(buf, "default", 7))
			{
				sscanf(buf, "%s %s %s %s %s", tmp, tmp, gw, tmp, tmp);
				rc = 1;
				break;
			}
		}	
		fclose(fp);
	}

	return rc;
}


int iproute_get_routing_table_id(char *ifname)
{
	int table;

	if (!strcmp(ifname, IF_WAN) || !strcmp(ifname, "ppp1"))
		table = WAN1_RTID;
	else if (!strcmp(ifname, IF_WAN2) || !strcmp(ifname, "ppp2"))
		table =  WAN2_RTID;
	else
		table =  MAIN_RTID; /* Main Routing Table */

	return table;
}

int iproute_set_default_routing_table(char *wan_name)
{
	char command[256], old_wan[20];

	if (iproute_get_default_routing_table(old_wan))
	{
	snprintf(command,256, "/sbin/iptables -t "RTMARK_TABLE" -D default -j RTMARK --set-mark %d",
		(strcmp(old_wan, WAN2_NAME) ? (WAN1_RTID+DEFAULT_RTID_TAG) : (WAN2_RTID+DEFAULT_RTID_TAG)));
	system(command);
	}

	snprintf(command,256, "/sbin/iptables -t "RTMARK_TABLE" -I default -j RTMARK --set-mark %d",
		(strcmp(wan_name, WAN2_NAME) ? (WAN1_RTID+DEFAULT_RTID_TAG) : (WAN2_RTID+DEFAULT_RTID_TAG)));
	system(command);
	write_file("/etc/rtable.main", wan_name);

#ifdef USE_SYSTEM_LOG
	{
	char buf[256];
	snprintf(buf,256,"%s (%s)", SYSLOG_MSG_CHANGED_PRIMARY_WAN, strcmp(wan_name, WAN2_NAME)?"WAN1":"WAN2");
	syslog_msg( SYSMSG_LOG_INFO, buf);
	}
#endif

	return 0;
}

int iproute_get_default_routing_table(char *wan_name)
{
	FILE *fp;
	int rc;

	strcpy(wan_name, "");

	fp = fopen("/etc/rtable.main", "r");
	if (fp != NULL)
	{
		fscanf(fp, "%s", wan_name);
		fclose(fp);
		rc = 1;
	}
	else
	{
		strcpy(wan_name, WAN1_NAME);
		rc = 0;
	}

	return rc;
}
