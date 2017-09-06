#include <linosconfig.h>

#ifdef L_open_mgmt_port
int open_mgmt_port(char *wanname, char *port)
{
	char cmd[128], ifname[16];


#ifndef USE_NO_LAN_GATEWAY
        if(local_gateway_is_default_gateway())
	{
		snprintf(cmd,128,"/sbin/iptables -I INPUT -i %s -p tcp --sport %s -j ACCEPT", IF_LOCAL, port );
		system(cmd);
	}
	else
#endif

	if(get_wan_ifname( wanname, ifname ) != -1)
	{
		snprintf(cmd,128,"/sbin/iptables -I INPUT -i %s -p tcp --sport %s -j ACCEPT", ifname, port );
		system(cmd);
	}
}
#endif

#ifdef L_close_mgmt_port
int close_mgmt_port(char *wanname, char *port)
{
	char cmd[128], ifname[16];


#ifndef USE_NO_LAN_GATEWAY
        if(local_gateway_is_default_gateway())
	{
		snprintf(cmd,128,"/sbin/iptables -D INPUT -i %s -p tcp --sport %s -j ACCEPT", IF_LOCAL, port );
		system(cmd);
	}
	else
#endif
	if(get_wan_ifname( wanname, ifname ) != -1)
	{
		snprintf(cmd,128,"/sbin/iptables -D INPUT -i %s -p tcp --sport %s -j ACCEPT", ifname, port );
		system(cmd);
	}
}
#endif
