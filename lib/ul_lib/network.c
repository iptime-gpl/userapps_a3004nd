#include <linosconfig.h>

#ifdef L_eth2wan
int eth2wan( char *eth, char *wan)
{
	int ifidx = 0;

	if(!strcmp(eth,IF_WAN))
		strcpy(wan,"wan1");
	else
		strcpy(wan,"wan2");
	return 0;
}
#endif

#ifdef L_get_wan_type
/* return value : info = "static" or "dynamic" or "pppoe" */
int get_wan_type(char *wanname, char *info) 
{
    char buf[64], filename[64];
    FILE *fp;

    char tag[64],value[512];

#ifdef USE_USB_TETHERING
        if(get_usb_tethering_status())
	{
        	strcpy(info, "dynamic");
		return 0;
	}
#endif

    if(wanname &&  strcmp(wanname,""))
    	snprintf(tag,64,"wantype.%s",wanname);
    else
    {
	    // It can stop the dhcpd ... 
            //printf("WANRING (%d): get_wan_type --> wanname is missing..", getpid());
    }

    if(iconfig_get_value_direct(tag,info)==-1)
    {
        strcpy(info, "dynamic");
    }
    return 0;
}
#endif

#ifdef L_get_local_ifname
int get_local_ifname(char *ifname)
{
	strcpy(ifname, IF_LOCAL);
	return 0;
}
#endif

#ifdef L_get_wan_ifname
/* get wan's logical interface name */
int get_wan_ifname(char *wanname, char *ifname)
{
	char waninfo[16];
	int wanidx = -1;

	if (!strcmp(wanname, "")) 
		strcpy(wanname, WAN1_NAME);
	get_wan_type(wanname, waninfo);

	sscanf( wanname, "wan%d", &wanidx ); 
	if(wanidx == -1)
	{
		strcpy(ifname,"");
		printf("get_wan_ifname: Error #1\n");
		return -1;
	}

	if(
	    !strcmp(waninfo,"pppoe")
#ifdef USE_PPTP_CONNECT
	    || !strcmp(waninfo,"pptp")
#endif
	    )
		sprintf(ifname,"ppp%d",wanidx);
	else
		get_wan_hw_ifname(wanname, ifname);
	return 0;
}
#endif


#ifdef L_get_wan_hw_ifname
/* get wan's physical interface name */
int get_wan_hw_ifname(char *wanname, char *ifname)
{

#ifdef USE_USB_TETHERING
	if(get_usb_tethering_status())
	{
		strcpy(ifname,IF_USB);
		return 0;
	}
#endif

#ifdef USE_DUAL_WAN

#ifdef USE_WL_WAN_MB
#error "USE_WL_WAN_MB for USE_DUAL_WAN doesn't support"
#endif
        if(!strcmp(wanname,WAN2_NAME))
                strcpy(ifname,IF_WAN2);
        else
                strcpy(ifname,IF_WAN);
#else

#ifdef USE_WL_WAN_MB
		if(iconfig_get_value_direct("wan_ifname",ifname) == -1)
			strcpy(ifname,IF_WAN);
		/* for the reason of invalid iconfig.cfg's wan_ifname configuration */
#ifndef USE_5G_WL
		if(strcmp(ifname,IF_WAN) && strcmp(ifname,IF_WWAN)
#ifdef USE_RTL8196B
		   && strcmp(ifname,IF_WIRELESS)
#endif
				)
			strcpy(ifname,IF_WAN);
#endif
#else
                strcpy(ifname, IF_WAN);
#endif

#endif
        return 0;
}
#endif


#ifdef L_get_wan_name
static char static_wan_ifname[16];
char *get_wan_name(char *ifname, int type)
{

#if	0
	int ifidx;

	if(!strncmp( ifname, "eth", 3 ))
		sscanf(ifname, "eth%d", &ifidx ); 
	else if(!strncmp( ifname, "ppp", 3 ))
		sscanf(ifname, "ppp%d", &ifidx ); 
#ifndef USE_JUST_AP
	if(type)
		sprintf(static_wan_ifname,"WAN%d", ifidx );  
	else
		sprintf(static_wan_ifname,"wan%d", ifidx );  
#else
	sprintf(static_wan_ifname,"br%d", ifidx );  
#endif
	return static_wan_ifname;
#else
	if(!strcmp(ifname,IF_WAN))
		strcpy(static_wan_ifname, WAN1_NAME);
	else
		strcpy(static_wan_ifname, WAN2_NAME);
	return static_wan_ifname;
#endif
}
#endif

#ifdef L_get_wan_ip
int get_wan_ip(char *wan_name, char *ip_addr)
{
	char ifname[16],mask[20];

#if	0
	char ext[16];
	strcpy(ip_addr,"");
	get_wan_type(wan_name, ext);

	if(!strcmp(ext,"pppoe"))
	{
		if (!strcmp(wan_name, "") || !strcmp(wan_name, WAN1_NAME))
			strcpy(ifname, "ppp1");
		else
			strcpy(ifname, "ppp2");
	}
	else
	{
		if (!strcmp(wan_name, "") || !strcmp(wan_name, WAN1_NAME))
			strcpy(ifname, IF_WAN);
		else
			strcpy(ifname, IF_WAN2);
	}
#else
	get_wan_ifname(wan_name,ifname); 
#endif
	get_ifconfig(ifname, ip_addr, mask );

	if(!strcmp(ip_addr, "")) 
		return 0;

	return 1;
}
#endif

#ifdef L_wan_is_alive
int wan_is_alive(char *wan_name)
{
        FILE *fp;
        int wan1, wan2;

        wan1 = wan2 = 0;
        fp = fopen(RTMARK_STATUS, "r");
        if (fp)
        {
                fscanf(fp, "%d %d", &wan1, &wan2);
                fclose(fp);
        }

        return (!strcmp(wan_name, WAN1_NAME) ? wan1 : wan2);
}
#endif

#ifdef L_get_autodns
int get_autodns(void)
{
	char buffer[16];
	if(iconfig_get_value_direct("auto_dns2", buffer) == -1)
		return 1;
	return atoi(buffer);
}
#endif

#ifdef L_set_autodns
int set_autodns(int status)
{
        iconfig_set_intvalue_direct("auto_dns2", status);
        return 0;
}
#endif


#ifdef L_get_manual_dns_flag
int get_manual_dns_flag(char *ifname,char *info)
{
	int flag;
	char tag[TAGLEN];

	snprintf(tag,TAGLEN,"dns_check2.%s.%s",ifname,info);
	flag = iconfig_get_intvalue_direct(tag);
	if(flag == -1) flag = 0;
	return flag;
}
#endif

#ifdef L_set_dns_shadow
int set_dns_shadow(char *ifname,char *info, char *fdns, char *sdns)
{
	char tag[TAGLEN],value[256];

	snprintf(tag,TAGLEN,"dns.%s.%s",ifname,info);
	strcpy(value,"");
	snprintf(value,256, "%s %s", (fdns)?fdns:"", (sdns)?sdns:"");
	
	iconfig_set_value_direct(tag,value);
	return 0;
}
#endif

#ifdef L_get_dns_shadow
int get_dns_shadow(char *ifname,char *info, char *fdns, char *sdns)
{
	char tag[TAGLEN],value[256];

	fdns[0]=0; 
	sdns[0]=0;
	snprintf(tag,TAGLEN,"dns.%s.%s",ifname,info);
	if(iconfig_get_value_direct(tag,value) != -1)
		sscanf(value, "%s %s", fdns, sdns);
	return 0;
}
#endif

#ifdef L_set_domain_name_server
int set_domain_name_server(char *dns1, char *dns2, char *ifname)
{
    FILE *fp;

#ifdef USE_PROXY_DNS
    char old_dns1[20], old_dns2[20];

        get_domain_name_server(old_dns1, old_dns2);
        set_proxy_dns(old_dns1, dns1, ifname);
#endif

    if ((fp = fopen(RESOLV_CONF_FILE, "w+")) == NULL)
        return 1;

    fprintf(fp, "search\n");
    if (dns1 && strcmp(dns1, "") && inet_addr(dns1))
        fprintf(fp, "nameserver %s\n", dns1);
    if (dns2 && strcmp(dns2, "") && inet_addr(dns2))
        fprintf(fp, "nameserver %s\n", dns2);
#ifdef USE_LGDACOM
    fprintf(fp, "nameserver 164.124.101.2\n");
#endif

    fclose(fp);


    unlink("/etc/hosts");

    return 0;
}
#endif

#ifdef L_get_domain_name_server
int get_domain_name_server(char *dns1, char *dns2)
{
    int len, count = 1;
    char buf[64], *space;
    FILE *fp;

    if ((fp = fopen(RESOLV_CONF_FILE, "r")) == NULL)
    {
        fprintf(stderr, "Can't open %s\n", RESOLV_CONF_FILE);
        return 1;
    }

    while (!feof(fp))
    {
        if (fgets(buf, 64, fp) == NULL)
            break;

        len = strlen("nameserver");

        if (!strncmp(buf, "nameserver", len))
        {
            if ((count == 1) && dns1)
            {
                strcpy(dns1, buf + len + 1);
                dns1[strlen(dns1) - 1] = '\0';
                count++;
            }
            else if ((count == 2) && dns2)
            {
                strncpy(dns2, buf + len + 1, 20);
                if((space = strchr(dns2, ' ')))
                        *space=0;
                dns2[strlen(dns2) - 1] = '\0';
                count++;
            }
        }
    }

    if (count == 1)
    {
        strcpy(dns1, "");
        strcpy(dns2, "");
    }

    if (count == 2)
        strcpy(dns2, "");

    fclose(fp);

    return 0;
}
#endif

#ifdef L_set_proxy_dns
int set_proxy_dns( char *old_dns1, char *dns1, char *ifname) 
{
	char int_ip[20], mask[20];
	char buffer[128], olddns[32], oldifname[20];
	char *chkptr;

	if(!strcmp(dns1,""))
		return 0;

	/* security check patch */
	chkptr=strchr(dns1,' ');
	if(chkptr) *chkptr=0;
	if(inet_addr(dns1) == -1)
		return 0;
	if(dns1 && !check_ip_str(dns1))
		return 0;	

	get_ifconfig( IF_LOCAL,  int_ip, mask );
	if(strcmp(dns1, int_ip) && strcmp(dns1,""))
	{
		if((iconfig_get_value_direct("proxydns",buffer))!=-1)
		{
			sscanf( buffer, "%s %s", olddns, oldifname);

			snprintf( buffer,128, "/sbin/iptables -t nat -D PREROUTING -i %s -d %s -p udp --dport 53 -j DNAT --to-destination %s", IF_LOCAL, int_ip, olddns );
			system( buffer );

#ifdef USE_DUAL_WAN
			snprintf( buffer,128, "/sbin/iptables -t nat -D PREROUTING -i %s -d %s -p udp --dport 53 -j MARK --set-mark %d", IF_LOCAL, int_ip,!strcmp(oldifname,IF_WAN)?WAN1_RTID:WAN2_RTID);
			system( buffer );
#endif
		}

		snprintf(buffer,128,"%s %s", dns1,ifname);
		iconfig_set_value_direct("proxydns",buffer);

#ifdef USE_DUAL_WAN
		snprintf( buffer,128, "/sbin/iptables -t nat -A PREROUTING -i %s -d %s -p udp --dport 53 -j MARK --set-mark %d", IF_LOCAL, int_ip,!strcmp(ifname,IF_WAN)?WAN1_RTID:WAN2_RTID);
		system( buffer );
#endif
		snprintf( buffer,128, "/sbin/iptables -t nat -A PREROUTING -i %s -d %s -p udp --dport 53 -j DNAT --to-destination %s", IF_LOCAL,int_ip, dns1 );
		system( buffer );
	}

	return 0;

}
#endif

#ifdef L_get_ifconfig
int get_ifconfig(char *ifname, char *ip, char *netmask)
{
	int s;
	struct ifreq ifr; 
	struct sockaddr_in *p; 

	if ((s = socket(AF_INET, SOCK_DGRAM, 0)) < 0) 
	{
		if(ip) strcpy(ip, "");
        	if(netmask) strcpy(netmask, "");
        	return 1; 
	} 

	if(ip) 
	{
		strcpy(ifr.ifr_name, ifname); 
		ifr.ifr_addr.sa_family = AF_INET; 
		if (ioctl(s, SIOCGIFADDR, &ifr) < 0) 
		{ 
			strcpy(ip, ""); 
			if(netmask) strcpy(netmask, ""); 
			close(s); 
			return 1; 
		} 
		p = (struct sockaddr_in *)&(ifr.ifr_addr); 
		strcpy(ip, (char *)inet_ntoa(p->sin_addr));
       	}

	if(netmask) 
	{
		if (ioctl(s, SIOCGIFNETMASK, &ifr) < 0) 
		{ 
			strcpy(netmask, ""); 
			close(s); 
			return 1;
		} 
		p = (struct sockaddr_in *)&(ifr.ifr_netmask); 
		strcpy(netmask, (char *)inet_ntoa(p->sin_addr));
	} 

	close(s); 

	return 0;
}
#endif

#ifdef L_set_ifconfig
#ifdef USE_DUAL_WAN
static void setup_dual_wan_iptable(char *ifname, char *newip, char *newmask)
{
	char nowip[20], nowmask[20];
	char command[256];	
	char iptag[20], masktag[20];

	if (strcmp(newip, "0.0.0.0") && strcmp(newip, "127.0.0.1"))
	{
		snprintf(iptag,20, "%s_ip", ifname);
		snprintf(masktag,20,"%s_mask", ifname);
		if (istatus_get_value_direct(iptag, nowip) != -1)
		{
			istatus_get_value_direct(masktag, nowmask);
			snprintf(command,256, "/sbin/iptables -t "RTMARK_TABLE" -D neighbor -d %s/%d -j MARK --set-mark %d",
				nowip, get_netmask_bit_count(nowmask), MAIN_RTID);
			system(command);
		}
		snprintf(command,256, "/sbin/iptables -t "RTMARK_TABLE" -A neighbor -d %s/%d -j MARK --set-mark %d",
			newip, get_netmask_bit_count(newmask), MAIN_RTID);
		system(command);

		istatus_set_value_direct(iptag, newip);
		istatus_set_value_direct(masktag, newmask);
	}
}
#endif

int set_ifconfig(char *ifname, char *ip, char *netmask)
{
    int s;
    struct ifreq ifr;
    struct sockaddr_in *p;

#ifdef USE_DUAL_WAN
    setup_dual_wan_iptable(ifname, ip, netmask);
#endif

    strncpy(ifr.ifr_name, ifname, sizeof(ifr.ifr_name));

    if ((s = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
#ifdef CGI_DBG
        fprintf(stderr, "set_ifconfig : socket\n");
#endif
        return 1;
    }


    if (ioctl(s, SIOCGIFHWADDR, &ifr) < 0)
    {
#ifdef CGI_DBG
        fprintf(stderr, "[%s] set_ifconfig : ioctl SIOCGIFHWADDR\n", ifname);
#endif
        close(s);
        return 1;
    }
    if (ifr.ifr_hwaddr.sa_family != ARPHRD_ETHER)
    {
#ifdef CGI_DBG
        fprintf(stderr, "set_ifconfig : interface %s is not Ethernet\n", ifr.ifr_name);
#endif
        close(s);
        return 1;
    }

    /* configure interface */
    p = (struct sockaddr_in *)&(ifr.ifr_addr);
    p->sin_family = AF_INET;
    p->sin_addr.s_addr = inet_addr(ip);
    if (ioctl(s, SIOCSIFADDR, &ifr) < 0)
    {
#ifdef CGI_DBG
        fprintf(stderr, "set_ifconfig : ioctl SIOCSIFADDR\n");
#endif
        close(s);
        return 1;
    }

    if(inet_addr(ip)!= 0x0)
    {

    p = (struct sockaddr_in *)&(ifr.ifr_broadaddr);
    p->sin_family = AF_INET;
    p->sin_addr.s_addr = (inet_addr(ip) & inet_addr(netmask)) |
                         (inet_addr("255.255.255.255") & ~inet_addr(netmask));
    if (ioctl(s, SIOCSIFBRDADDR, &ifr) < 0)
    {
#ifdef CGI_DBG
        fprintf(stderr, "set_ifconfig : ioctl SIOCSIFBRDADDR\n");
#endif
        close(s);
        return 1;
    }
    p = (struct sockaddr_in *)&(ifr.ifr_netmask);
    p->sin_family = AF_INET;
    p->sin_addr.s_addr = inet_addr(netmask);
    if (ioctl(s, SIOCSIFNETMASK, &ifr) < 0)
    {
#ifdef CGI_DBG
        fprintf(stderr, "set_ifconfig : ioctl SIOCSIFNETMASK\n");
#endif
        close(s);
        return 1;
    }

    }

    ifr.ifr_flags = IFF_UP | IFF_BROADCAST | IFF_NOTRAILERS | IFF_RUNNING;

#ifdef USE_WAN_PROMISC_WORKAROUND 

#if	0
    if(!strcmp( ifname, IF_WAN)
#ifdef USE_WIRELESS_WAN_SELECTION
      && !get_wireless_wan_enable()
#endif
	)
#endif
    	ifr.ifr_flags |= IFF_PROMISC;
#endif

    if (ioctl(s, SIOCSIFFLAGS, &ifr) < 0)
    {
        printf("set_ifconfig : ioctl SIOCSIFFLAGS\n");
        close(s);
        return 1;
    }

    close(s);

    return 0;
}
#endif

#ifdef L_string_to_hexa
unsigned long string_to_hexa(char *string)
{
    int i, j;
    char *sp = string, *bp;
    unsigned long val;

    val = 0;
    bp = (char *)&val;

    for (i = 0, j = 0; i < strlen(string); i++, j++) 
    {
        *sp = toupper(*sp);

        if ((*sp >= 'A') && (*sp <= 'F'))
            bp[j] |= (int) (*sp - 'A') + 10;
        else if ((*sp >= '0') && (*sp <= '9'))
            bp[j] |= (int) (*sp - '0');
        else
        {
#ifdef CGI_DBG
            fprintf(stderr, "string_to_hexa : invalid character\n");
#endif
            return 0;
        }

        bp[j] <<= 4;
        i++;
        sp++;
        *sp = toupper(*sp);

        if ((*sp >= 'A') && (*sp <= 'F'))
            bp[j] |= (int) (*sp - 'A') + 10;
        else if ((*sp >= '0') && (*sp <= '9'))
            bp[j] |= (int) (*sp - '0');
        else
        {
#ifdef CGI_DBG
            fprintf(stderr, "string_to_hexa : invalid character\n");
#endif
            return 0;
        }

        sp++;
    }

    return htonl(val);
}
#endif

#ifndef USE_DUAL_WAN
#ifdef L_get_default_gateway
int get_default_gateway(char *ifname, char *gw)
{
    int count = 0, flag = 0;
    char buf[1024], name[20], dest[20], gateway[20];
    struct in_addr gw_addr;
    FILE *fp;

    if ((fp = fopen(PROC_ROUTE_TABLE_FILE, "r")) == NULL)
    {
#if 0
        fprintf(stderr, "Can't open %s\n", PROC_ROUTE_TABLE_FILE);
#endif
        if(gw) strcpy(gw, "");
        return 1;
    }

    while (!feof(fp))
    {
        if (fgets(buf, 1024, fp) == NULL)
            break;
        
        flag++;

        if (flag == 1)
            continue;

        sscanf(buf, "%s\t%s\t%s", name, dest, gateway);

        if (!strcmp(name, ifname) && (string_to_hexa(dest) == 0x0))
        {
            if (gw != NULL)
            {
                gw_addr.s_addr = string_to_hexa(gateway);
                strcpy(gw, (char *)inet_ntoa(gw_addr));
            }
            count++;
        }
    }

    fclose(fp);

    if ((count == 0) && (gw != NULL))
        strcpy(gw, "");

    return count;
}

#ifndef USE_NO_LAN_GATEWAY
int local_gateway_is_default_gateway(void)
{
	char l_gateway[16], d_gateway[16];

	strcpy(d_gateway,""),
	strcpy(l_gateway,""),
	get_default_gateway(IF_LOCAL, d_gateway);

	if(!strcmp(d_gateway,""))
		return 0;
	if(iconfig_get_value_direct("lan_gateway", l_gateway) == -1)
		return 0;

	return(strcmp(l_gateway, d_gateway) ? 0 : 1);
}
#endif
#endif

#ifdef L_set_default_gateway
int set_default_gateway(char *ifname, char *gw)
{
    int s, i, count;
    struct rtentry rtent;
    struct sockaddr_in *p;

    if ((s = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
#ifndef __SIZE_OPTI2__
        fprintf(stderr, "set_default_gateway : socket\n");
#endif
        return 1;
    }

    count = get_default_gateway(ifname, NULL);

    /* set route to the interface */
    bzero((char *)&rtent, sizeof(rtent));

    rtent.rt_dev = ifname;                      /* interface name */

    p = (struct sockaddr_in *)&rtent.rt_dst;
    p->sin_family = AF_INET;
    p->sin_addr.s_addr = htonl(0);              /* dest. net address */
    rtent.rt_flags = RTF_GATEWAY;

    for (i = 0; i < count; i++)
        ioctl(s, SIOCDELRT, &rtent);                /* delete default gateway */

    if (gw)
    {
        p = (struct sockaddr_in *)&rtent.rt_gateway;
        p->sin_family = AF_INET;
        p->sin_addr.s_addr = inet_addr(gw);         /* gateway address */

#if 0
        rtent.rt_metric  = 1;                       /* metric (see route.h) */
#endif
        rtent.rt_flags = (RTF_UP | RTF_GATEWAY);    /* net route */

        if (ioctl(s, SIOCADDRT, &rtent) < 0)        /* add default gateway */
        {
#ifndef __SIZE_OPTI2__
            fprintf(stderr, "set_default_gateway : ioctl SIOCADDRT\n");
#endif
            close(s);

            return 1;
        }
    }

    close(s);

    return 0;
}
#endif


#ifdef L_set_default_gateway2
int set_default_gateway2(char *ifname, char *ip, char *mask, char *gw)
{
    int s, i, count;
    struct rtentry rtent;
    struct sockaddr_in *p;

    if ((s = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
#ifndef __SIZE_OPTI2__
        fprintf(stderr, "set_default_gateway : socket\n");
#endif
        return 1;
    }

    count = get_default_gateway(ifname, NULL);

    /* set route to the interface */
    bzero((char *)&rtent, sizeof(rtent));

    rtent.rt_dev = ifname;                      /* interface name */

    p = (struct sockaddr_in *)&rtent.rt_dst;
    p->sin_family = AF_INET;
    p->sin_addr.s_addr = htonl(0);              /* dest. net address */
    rtent.rt_flags = RTF_GATEWAY;

    for (i = 0; i < count; i++)
        ioctl(s, SIOCDELRT, &rtent);                /* delete default gateway */

    if (gw)
    {

        bzero((char *)&rtent, sizeof(rtent));
        rtent.rt_dev = ifname;                      /* interface name */
    	rtent.rt_flags = RTF_UP;

	p = (struct sockaddr_in *)&rtent.rt_genmask;
	p->sin_family = AF_INET;
	p->sin_addr.s_addr = inet_addr(mask);              /* dest. net address */

        p = (struct sockaddr_in *)&rtent.rt_dst;
        p->sin_family = AF_INET;
        p->sin_addr.s_addr = inet_addr(gw) & inet_addr(mask);         /* gateway address */
	if ( ioctl(s, SIOCADDRT, &rtent) < 0 )	
	{
#ifndef __SIZE_OPTI2__
		fprintf(stderr, "add network SIOCADDRT failed (1)\n");
#endif
		close(s);
		return -1;
	}

        bzero((char *)&rtent, sizeof(rtent));
        rtent.rt_dev = ifname;                      /* interface name */
        rtent.rt_flags = (RTF_UP | RTF_GATEWAY);    /* net route */

        p = (struct sockaddr_in *)&rtent.rt_dst;
        p->sin_family = AF_INET;
	p->sin_addr.s_addr = htonl(0);

        p = (struct sockaddr_in *)&rtent.rt_gateway;
        p->sin_family = AF_INET;
	p->sin_addr.s_addr = inet_addr(gw);
        if (ioctl(s, SIOCADDRT, &rtent) < 0)        /* add default gateway */
        {
#ifndef __SIZE_OPTI2__
            fprintf(stderr, "set_default_gateway : ioctl SIOCADDRT\n");
#endif
            close(s);

            return 1;
        }
    }

    close(s);

    return 0;
}
#endif

#else

#ifdef L_set_wan_backup_status
int set_wan_backup_status(int wan1status, int wan2status)
{
	char command[512];

	snprintf(command,512,"echo \"%d %d\" > %s", wan1status, wan2status, RTMARK_STATUS);
	system(command);
}
#endif

#ifdef L_get_wan_backup_status
int get_wan_backup_status(int *wan1status, int *wan2status)
{
	FILE *fp;
	int count, delay;

	if (!check_linkmon_conf(&count, &delay))
	{
		*wan1status = *wan2status = 1;
		return 1; 
	}

	*wan1status = *wan2status = 0;

	fp = fopen(RTMARK_STATUS, "r");
	if (fp)
	{
		fscanf(fp, "%d %d", wan1status, wan2status);
		fclose(fp);
	}
	
	return 0;
}
#endif

#ifdef L_get_default_gateway
int get_default_gateway(char *ifname, char *gw)
{
	iproute_get_default_gw(ifname, gw, 0);
	return 0;
}
#endif

#ifdef L_set_default_gateway
int set_default_gateway(char *ifname, char *gw)
{
	char wan_name[20], tempif[20];
	int wan1status, wan2status, wan_status;

	if (gw && !strcmp(gw, "0.0.0.0") && strncmp(ifname, "ppp", 3))
 		return 0;

	iproute_set_default_gw(ifname, gw, 0);

	iproute_get_default_routing_table(wan_name);
	get_wan_ifname(wan_name, tempif);

	get_wan_backup_status(&wan1status, &wan2status);
	wan_status = (!strcmp(wan_name, WAN1_NAME)) ? wan1status : wan2status;

	if (!strcmp(ifname, tempif) && wan_status)
		iproute_set_default_gw(ifname, gw, MAIN_RTID);

	return 0;
}
#endif

#ifdef L_set_default_gateway2
int set_default_gateway2(char *ifname, char *ip, char *mask, char *gw)
{
	set_default_gateway(ifname, gw);
	return 0;
}
#endif

#endif // USE_DUAL_WAN


#ifdef L_read_rt_db
#ifdef USE_LGDACOM
static int read_rt_onoff_list(int *list)
{
        char tag[20], value[1024], *ptr;
        int idx=0;

        strcpy(tag, "route_onoff");

        if (iconfig_get_value_direct(tag, value) != -1)
        {
                if ((ptr = strtok(value, ",")) != NULL)
                {
                        do {
                                list[idx++] = atoi(ptr);
                        } while ((ptr = strtok(NULL, ",")) != NULL);
                }

        }

        return 0;
}
#endif
int read_rt_db(rt_db_t *rt_db)
{
	int n;
	rt_entry_t *rt_entry;
	char value[256], *ptr;
#ifdef USE_LGDACOM
	int onoff_list[10];
	read_rt_onoff_list(onoff_list);
#endif

	rt_db->count = 0;
	for (n = 0; n < MAX_RT_ENTRY; n++)
	{
		if (iconfig_get_index_value_direct( "rt_db", n, value ) == -1)
			break;
		rt_entry = &rt_db->rt_entry[rt_db->count];
		memset(rt_entry, 0x0, sizeof(rt_entry_t));

		ptr=strtok(value,",");
		if(ptr) strcpy(rt_entry->type,ptr);				
		ptr=strtok(NULL,",");
		if(ptr) strcpy(rt_entry->target,ptr);				
		ptr=strtok(NULL,",");
		if(ptr && strcmp(ptr,"0")) strcpy(rt_entry->netmask,ptr);				
		ptr=strtok(NULL,",");
		if(ptr) strcpy(rt_entry->gateway,ptr);				
#ifdef USE_LGDACOM
		if (!onoff_list[n]) rt_entry->flag |= DISABLE_SCHEDULE_FLAG;
#endif
		rt_db->count++;
	}

	return 0;

}
#endif

#ifdef L_write_rt_db
int write_rt_db(rt_db_t *rt_db)
{
	char tag[60], value[256];	
        int n;

	iconfig_remove_tag_prefix("rt_db+");
	for (n = 0; n < rt_db->count; n++)
	{
		if (rt_db->rt_entry[n].flag & REMOVE_SCHEDULE_FLAG)
			continue;

		snprintf(tag,60,"rt_db+%s_%s_%s", 
			rt_db->rt_entry[n].type, rt_db->rt_entry[n].target, 
			(strlen(rt_db->rt_entry[n].netmask))?rt_db->rt_entry[n].netmask:"0");
		snprintf(value,256, "%s,%s,%s,%s", 
			rt_db->rt_entry[n].type, rt_db->rt_entry[n].target, 
			(strlen(rt_db->rt_entry[n].netmask))?rt_db->rt_entry[n].netmask:"0",
			rt_db->rt_entry[n].gateway);

		iconfig_set_value_direct(tag,value);
	}

        return 0;

}
#endif

#ifdef L_sync_rt_db
/* for ppp connection */
int sync_rt_db( char *ip_address )  
{
	int n;
	rt_db_t *rt_db;

	if(!ip_address) return -1;

	rt_db = (rt_db_t *)malloc(sizeof(rt_db_t));

	read_rt_db(rt_db);
	for( n = 0 ; n < rt_db->count; n++ )
	{
		if(!strcmp(rt_db->rt_entry[n].gateway,ip_address))
		{
			kernel_route(&rt_db->rt_entry[n], 0 );
			kernel_route(&rt_db->rt_entry[n], 1 );
		}
	}
	free(rt_db);
	return 0;
}
#endif

#include <net/route.h>
#include <netinet/in.h>
#ifdef L_kernel_route
int kernel_route(rt_entry_t *rt_entry, char action)
{
	struct rtentry rt;
	int skfd;
	struct sockaddr_in *in;
	int ret = 0;

	memset((char *) &rt, 0, sizeof(struct rtentry));

	rt.rt_flags = RTF_UP;

	in = (struct sockaddr_in *)&rt.rt_dst;
	in->sin_family = AF_INET;
	in->sin_port = 0;
	in->sin_addr.s_addr =inet_addr(rt_entry->target);
 


	if(!strcmp( rt_entry->type, "host"))
	{
		rt.rt_flags |= RTF_HOST;

		in = (struct sockaddr_in*)&rt.rt_genmask;
		in->sin_family = AF_INET;
		in->sin_port = 0;
		in->sin_addr.s_addr = 0xffffffff;
	}
	else
	{
		in = (struct sockaddr_in*)&rt.rt_genmask;
		in->sin_family = AF_INET;
		in->sin_port = 0;
		in->sin_addr.s_addr = inet_addr(rt_entry->netmask);
	}

	in = (struct sockaddr_in*)&rt.rt_gateway;
	in->sin_family = AF_INET;
	in->sin_port = 0;
	in->sin_addr.s_addr = inet_addr(rt_entry->gateway);



	rt.rt_flags |= RTF_GATEWAY;

        /* Create a socket to the INET kernel. */
        if ((skfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
                perror("socket");
                return -1;
        }
        /* Tell the kernel to accept this route. */
        if (action == 0) {
                if ((ret=ioctl(skfd, SIOCDELRT, &rt)) < 0) {
                        close(skfd);
                        return ret;
                }
        } else {
                if ((ret=ioctl(skfd, SIOCADDRT, &rt)) < 0) {
                        close(skfd);
                        return ret;
                }
        }

        /* Close the socket. */
        (void) close(skfd);

	return 0;
}
#endif

#ifdef L_get_internal_pc_hardware_address
int get_internal_pc_hardware_address(char *ip_addr, char *hw_addr)
{
    int line = 0;
    char buffer[128], *ptr;
    FILE *fp;

    if ((fp = fopen("/proc/net/arp", "r")) == NULL)
        return -1;

    strcpy(hw_addr, "");

    while (fgets(buffer, 128, fp))
    {
        line++;

        if (line < 2)
            continue;

        if (!strcmp(ip_addr, strtok(buffer, " \t\n")))
        {
            strtok(NULL, " \t\n");
            strtok(NULL, " \t\n");
            ptr = strtok(NULL, " \t\n");
            strcpy(hw_addr, ptr);
        }
        else
            continue;
    }

    fclose(fp);

    return 0;
}
#endif

#ifdef L_get_wanidx_by_name
int get_wanidx_by_name(char *wan_name)
{
	int idx;

	sscanf(wan_name,"wan%d", &idx);
	return idx;
}
#endif
