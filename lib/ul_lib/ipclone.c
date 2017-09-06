#include <linosconfig.h>

#ifdef L_check_ipclone_ipaddr
int check_ipclone_ipaddr(unsigned char *chaddr, char *wan_name)
{
	int cur_mac[6];
	unsigned int cur_ip[2];
	int rc = 0;

	if ((read_real_ipclone(WAN1_NAME, cur_mac, &cur_ip)) &&
	    (chaddr[0] == (unsigned char)(cur_mac[0] & 0377)) &&
	    (chaddr[1] == (unsigned char)(cur_mac[1] & 0377)) &&
	    (chaddr[2] == (unsigned char)(cur_mac[2] & 0377)) &&
	    (chaddr[3] == (unsigned char)(cur_mac[3] & 0377)) &&
	    (chaddr[4] == (unsigned char)(cur_mac[4] & 0377)) &&
	    (chaddr[5] == (unsigned char)(cur_mac[5] & 0377)) )
	{
		strcpy(wan_name, WAN1_NAME);
		rc = 1;
	}
	else if ((read_real_ipclone(WAN2_NAME, cur_mac, &cur_ip)) &&
	    (chaddr[0] == (unsigned char)(cur_mac[0] & 0377)) &&
	    (chaddr[1] == (unsigned char)(cur_mac[1] & 0377)) &&
	    (chaddr[2] == (unsigned char)(cur_mac[2] & 0377)) &&
	    (chaddr[3] == (unsigned char)(cur_mac[3] & 0377)) &&
	    (chaddr[4] == (unsigned char)(cur_mac[4] & 0377)) &&
	    (chaddr[5] == (unsigned char)(cur_mac[5] & 0377)) )
	{
		strcpy(wan_name, WAN2_NAME);
		rc = 1;
	}
	else
	{
		strcpy(wan_name, "");
		rc = 0;
	}

	return rc;
}
#endif

#ifdef L_read_real_ipclone_leasetime
int read_real_ipclone_leasetime(char *wan_name, int *leasetime)
{
	dmztwinip config;
	int rc = 0;

	if (dmztwinip_read_config(wan_name, &config))
	{
		*leasetime = config.leasetime;
		rc = 1;
	}
	
	return rc;
}
#endif

#ifdef L_read_real_ipclone
int read_real_ipclone(char *wan_name, int *mac, unsigned int *public_ip)
{
	dmztwinip config;


	dmztwinip_read_config(wan_name, &config);
	if (config.opmode == DMZTWINIP_MODE_TWINIP)
	{
		sscanf(config.hwaddr, "%02x-%02x-%02x-%02x-%02x-%02x",
			&mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5]);
		*public_ip = inet_addr(config.ipaddr);
	}

	return (config.opmode == DMZTWINIP_MODE_TWINIP);
}
#endif
