
/* 
*
* following api is called by other programs 
*
*  CGI, ppp daemon, dhcp client
*  added by scchoi
*  2002. 11. 11
*
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <signal.h>
#include <sys/stat.h>
#include <netinet/in.h>

#include "dhcpd.h"
#include "leases.h"
#include <linosconfig.h>

#if 0
#define UDHCPD_CONF_FILE "/etc/udhcpd.conf"
#define UDHCPD_LEASE_FILE "/var/lib/dhcp/udhcpd.leases"
#define UDHCPD_PID_FILE "/var/run/dhcpd.pid"
#define UDHCPD_STATIC_LEASE_FILE "/var/lib/dhcp/udhcpd.static"
#define UDHCPD_STATIC_LEASE_MAX  200
#endif

#ifdef L_dhcplib_set_dns_server
int dhcplib_set_dns_server( char *dns1, char *dns2 )
{
	char buffer[512];
#ifdef USE_FS_OPTIMIZED_XXX
	char start[20], end[20], mask[20], router[20];
#else
	FILE *fp, *wfp;
	int found = 0;
#endif

	if(!dns1  && !dns2)  return 0;

#ifdef USE_FS_OPTIMIZED_XXX
	dhcplib_get_range_and_gateway(start,end,mask,router);
	sprintf(buffer,"%s,%s,%s,%s,%s,%s",
		start, end, 
		(!dns1 || (!strcmp(dns1,"")))?"0.0.0.0":dns1, 
		(!dns2 || (!strcmp(dns2,"")))?"0.0.0.0":dns2, 
		mask, router);
	if (iconfig_set_value_direct("dhcpd", buffer) == -1)
		return 1;
#else
	copy_file( UDHCPD_CONF_FILE, "/var/run/t1");
	if((fp = fopen("/var/run/t1", "r")) == NULL)
	{
	        fprintf(stderr, "Can't open %s\n", UDHCPD_CONF_FILE);
	        return 1;
	}

	if((wfp = fopen(UDHCPD_CONF_FILE, "w+")) == NULL)
	{
	        fprintf(stderr, "Can't open %s\n", UDHCPD_CONF_FILE);
	        return 1;
	}

	while(fgets(buffer,512,fp))
	{
		if(buffer[0] == '\n') continue;

		if(!strncmp(buffer,"option dns",10))
		{
			fprintf(wfp,"option dns ");
			if(dns1)
				fprintf(wfp,"%s ",dns1);
			if(dns2)
				fprintf(wfp,"%s ",dns2);
			fprintf(wfp,"\n");
			found = 1;
		}
		else
			fprintf(wfp,"%s",buffer);
	}

	if(!found)
	{

		fprintf(wfp,"option dns ");
		if(dns1) fprintf(wfp,"%s ", dns1);
		if(dns2) fprintf(wfp,"%s", dns2);
		fprintf(wfp,"\n");
	}

	fclose(fp);
	fclose(wfp);
	unlink("/var/run/t1");
#endif
	return 0;
}
#endif
#ifdef L_dhcplib_get_dns_server
int dhcplib_get_dns_server( char *dns1, char *dns2 )
{
	char buf[128], *space;
#ifdef USE_FS_OPTIMIZED_XXX
	char value[256], *ptr;
#else
	FILE *fp;
#endif

	if(dns1) strcpy(dns1, "");
	if(dns2) strcpy(dns2, "");

#ifdef USE_FS_OPTIMIZED_XXX
	if (iconfig_get_value_direct("dhcpd", value) == -1)
	{
		char ipstr[20], maskstr[20];
		get_ifconfig(IF_LOCAL, ipstr, maskstr);
		if (dns1) strcpy(dns1, ipstr);
	}
	else
	{
		strtok(value,","); // skip start
		strtok(NULL,","); // skip end
		if ((ptr=strtok(NULL,",")) && dns1) strcpy(dns1, ptr);
		if ((ptr=strtok(NULL,",")) && dns2) strcpy(dns2, ptr);
	}
#else
    if ((fp = fopen(UDHCPD_CONF_FILE, "r")) == NULL)
    {
        fprintf(stderr, "Can't open %s\n", UDHCPD_CONF_FILE);
        return 1;
    }

    while (!feof(fp))
    {
        if (fgets(buf, 128, fp) == NULL)
            break;

	if(!strncmp( buf, "option dns", strlen("option dns")))
	{
		space = strchr(buf + strlen("option dns") + 1,' ');
		if(space)
		    *space = 0x0;
		if(dns1)
			strcpy( dns1, buf + strlen("option dns")+1 );
		if(space)
		{
			if(dns2)
			{
				strncpy(dns2,space+1,20);
				if( (space = strchr(dns2, '\n' )))
					*space=0x0;
				if( (space = strchr(dns2, ' ' )))
					*space=0x0;
			}
		}
	}
    }

    fclose(fp);
#endif
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
    {
#if 0
        fprintf(stderr, "Can't open %s\n", RESOLV_CONF_FILE);
#endif
        return 1;
    }

    fprintf(fp, "search\n");
    if (dns1 && strcmp(dns1, "") && inet_addr(dns1))
        fprintf(fp, "nameserver %s\n", dns1);
    if (dns2 && strcmp(dns2, "") && inet_addr(dns2))
        fprintf(fp, "nameserver %s\n", dns2);
#ifdef USE_LGDACOM
        fprintf(fp, "nameserver 164.124.101.2\n");
#endif

    fclose(fp);

    return 0;
}
#endif

#ifdef L_dhcplib_set_range_and_gateway
int dhcplib_set_range_and_gateway( char *start, char *end, char *mask, char *router)
{
	char dns1[20], dns2[20];
#ifdef USE_FS_OPTIMIZED_XXX
	char value[512];
#else
	FILE *fp;
#endif

        dhcplib_get_dns_server(dns1, dns2);

#ifdef USE_FS_OPTIMIZED_XXX
	sprintf(value,"%s,%s,%s,%s,%s,%s",
		start, end, dns1, dns2, mask, router);
	if (iconfig_set_value_direct("dhcpd", value) == -1)
		return 1;
#else
	if ((fp = fopen(UDHCPD_CONF_FILE, "w+")) == NULL)
	{
        	fprintf(stderr,"Can't open %s\n", UDHCPD_CONF_FILE);
    		return 1;
	}

	fprintf(fp, "start %s\n", start);
	fprintf(fp, "end %s\n", end);
	fprintf(fp, "interface "IF_LOCAL"\n");
	fprintf(fp, "auto_time 30\n");
	fprintf(fp, "lease_file "UDHCPD_LEASE_FILE"\n");
	fprintf(fp, "pidfile "UDHCPD_PID_FILE"\n");

	if (strcmp(dns1, ""))
	{
    		fprintf(fp, "option dns %s", dns1);

    		if (strcmp(dns2, ""))
        		fprintf(fp, " %s\n", dns2);
    		else
        		fprintf(fp, "\n");
	}
	fprintf(fp, "option subnet %s\n", mask);
	fprintf(fp, "option router %s\n", router);
	fprintf(fp, "option domain %s\n", "local");
	fprintf(fp, "option lease 864000\n");

	fclose(fp);
#endif

	return 0;
}
#endif
#ifdef L_dhcplib_get_range_and_gateway
int dhcplib_get_range_and_gateway( char *start, char *end, char *mask, char *router)
{
	char buf[128];
#ifdef USE_FS_OPTIMIZED_XXX
	char value[512], *ptr;
#else
	FILE *fp;
#endif

	if(start) strcpy(start, "");
	if(end) strcpy(end, "");
	if(mask) strcpy(mask, "");
	if(router) strcpy(router, "");

#ifdef USE_FS_OPTIMIZED_XXX
	if (iconfig_get_value_direct("dhcpd", value) == -1)
	{
		char ipstr[20], maskstr[20];
		struct in_addr ip, netmask, startip, endip;

		get_ifconfig(IF_LOCAL, ipstr, maskstr);
		inet_aton(ipstr, &ip);
		inet_aton(maskstr, &netmask);
		startip.s_addr = htonl(ntohl(ip.s_addr & netmask.s_addr)+2);
		endip.s_addr = htonl(ntohl(ip.s_addr & netmask.s_addr)+254);
		if (start) strcpy(start, inet_ntoa(startip));	
		if (end) strcpy(end, inet_ntoa(endip));	
		if (mask) strcpy(mask, maskstr);
		if (router) strcpy(router, ipstr);
	}
	else
	{
		if ((ptr=strtok(value,",")) && start) strcpy(start, ptr);
		if ((ptr=strtok(NULL,",")) && end) strcpy(end, ptr);
		strtok(NULL,","); // skip dns1
		strtok(NULL,","); // skip dns2
		if ((ptr=strtok(NULL,",")) && mask) strcpy(mask, ptr);
		if ((ptr=strtok(NULL,",")) && router) strcpy(router, ptr);
	}
#else
    if ((fp = fopen(UDHCPD_CONF_FILE, "r")) == NULL)
    {
        fprintf(stderr, "Can't open %s\n", UDHCPD_CONF_FILE);
        return 1;
    }

    while (!feof(fp))
    {
        if (fgets(buf, 128, fp) == NULL)
            break;

	if(!strncmp( buf, "start", strlen("start")))
	{
		if(start)
			strcpy( start, buf + strlen("start")+1 );
	}
	else if(!strncmp( buf, "end", strlen("end")))
	{
		if(end)
			strcpy( end, buf + strlen("end")+1 );
	}
	else if(!strncmp( buf, "option subnet", strlen("option subnet")))
	{
		if(mask)
			strcpy( mask, buf + strlen("option subnet")+1 );
	}
	else if(!strncmp( buf, "option router", strlen("option router")))
	{
		if(router)
			strcpy( router, buf + strlen("option router")+1 );
	}
    }

    fclose(fp);
#endif
    return 0;
}
#endif


#ifdef L_dhcplib_get_active_lease_count
int get_active_lease_count(char *file)
{
	int length,n;
	struct stat statbuf;

	if (stat(file, &statbuf) == -1)
		return 0;

	length = statbuf.st_size;

	n = length / sizeof(struct dhcpOfferedAddr);
	if((length%sizeof(struct dhcpOfferedAddr)) != 0 )
		fprintf(stderr, "Invalid dhcpd lease size\n");

	return n;
}

int dhcplib_get_active_lease_count(void)    
{
	return get_active_lease_count(UDHCPD_LEASE_FILE);
}
#endif

#ifdef L_dhcplib_get_active_static_lease_count
int get_static_lease_count(char *file)
{
	int length,n;
	struct stat statbuf;

	if (stat(file, &statbuf) == -1)
		return 0;

	length = statbuf.st_size;

	n = length / sizeof(struct dhcpOfferedStaticAddr);
	if((length%sizeof(struct dhcpOfferedStaticAddr)) != 0 )
		fprintf(stderr, "Invalid dhcpd lease size\n");

	return n;
}

int dhcplib_get_active_static_lease_count(void)    
{
	return get_static_lease_count(UDHCPD_STATIC_LEASE_FILE);
}
#endif

#ifdef L_get_lease_info
int get_lease_info( char *file, int idx, char *ip, char *mac, int  *lease_time, char *hostname )
{
	FILE *fp;
	struct dhcpOfferedAddr lease;
	struct in_addr in;
	char *ip_str;
	int ret;

	if((fp=fopen( file, "r")) == NULL)
	{
		fprintf(stderr, "No lease file %s\n", file );
		return -1;
	}

	memset( &lease, 0x0, sizeof(struct dhcpOfferedAddr));
	fseek( fp, sizeof(struct dhcpOfferedAddr) * idx, SEEK_SET );   
	if( fread( &lease, sizeof(struct dhcpOfferedAddr), 1, fp ) == 1 )
	{
		in.s_addr = lease.yiaddr;
		ip_str = inet_ntoa(in);
		if(ip_str)
			strcpy( ip, ip_str );

		sprintf( mac, "%02x-%02x-%02x-%02x-%02x-%02x",
				lease.chaddr[0],
				lease.chaddr[1],
				lease.chaddr[2],
				lease.chaddr[3],
				lease.chaddr[4],
				lease.chaddr[5] );
		*lease_time = lease.expires;
		strcpy(hostname, lease.hostname);
		ret = 0;
	}
	else
	{
		if(ip)
			strcpy(ip,"");
		if(mac)
			strcpy(mac,"");
		ret = -1;
	}

	fclose(fp);

	return ret;
}
#endif

#ifdef L_dhcplib_get_lease_info
int dhcplib_get_lease_info( int idx, char *ip, char *mac, int  *lease_time, char *hostname )
{
	return get_lease_info(UDHCPD_LEASE_FILE, idx, ip, mac, lease_time, hostname);
}
#endif

#ifdef L_dhcplib_get_static_lease_info
int dhcplib_get_static_lease_info( int idx, char *ip, char *mac, int  *lease_time )
{
        FILE *fp;
        struct dhcpOfferedStaticAddr lease;
        struct in_addr in;
        char *ip_str;
        int ret;

        if((fp=fopen(UDHCPD_STATIC_LEASE_FILE, "r")) == NULL)
        {
                fprintf(stderr, "No lease file %s\n", UDHCPD_STATIC_LEASE_FILE );
                return -1;
        }

        memset( &lease, 0x0, sizeof(struct dhcpOfferedStaticAddr));
        fseek( fp, sizeof(struct dhcpOfferedStaticAddr) * idx, SEEK_SET );   
        if( fread( &lease, sizeof(struct dhcpOfferedStaticAddr), 1, fp ) == 1 )
        {
                in.s_addr = lease.yiaddr;
                ip_str = inet_ntoa(in);
                if(ip_str)
                        strcpy( ip, ip_str );

                sprintf( mac, "%02x-%02x-%02x-%02x-%02x-%02x",
                                lease.chaddr[0],
                                lease.chaddr[1],
                                lease.chaddr[2],
                                lease.chaddr[3],
                                lease.chaddr[4],
                                lease.chaddr[5] );
                *lease_time = lease.expires;
                ret = 0;
        }
        else
        {
                if(ip)
                        strcpy(ip,"");
                if(mac)
                        strcpy(mac,"");
                ret = -1;
        }

        fclose(fp);

        return ret;
}
#endif

#ifdef L_dhcpd_start
int dhcpd_start(void)
{
    char command[128];
    FILE *fp;
    char info[10];

    get_internal_network_info(info);
    if(!strcmp(info,"static")) return -1;

    sprintf(command, "%s &", DHCPD_PROGRAM);
    if (system(command) < 0)
    {
        fprintf(stderr, "dhcpd_start : system command error\n");
        return 1;
    }

    return 0;
}
#endif

#ifdef L_dhcpd_stop
int dhcpd_stop(void)
{
#ifdef USE_NEW_LIB
	kill_process("dhcpd",1);
#else
    char buf[16];
    pid_t pid;
    FILE *fp;

    if ((fp = fopen(UDHCPD_PID_FILE, "r")) == NULL)
    {
        fprintf(stderr, "Can't open %s\n", UDHCPD_PID_FILE);
        return 1;
    }

    fgets(buf, 16, fp);
    fclose(fp);

    pid = atoi(buf);
    if(pid)
    	kill(pid, SIGTERM);
    unlink(UDHCPD_PID_FILE);
#endif

    return 0;
}
#endif

#ifdef L_dhcplib_flush_dhcpd_leases
int dhcplib_flush_dhcpd_leases(void)
{
	FILE *fp;

	if ((fp = fopen(UDHCPD_LEASE_FILE, "w+")) == NULL)
	{
		fprintf(stderr, "Can't open %s\n", UDHCPD_LEASE_FILE);
		return 1;
    	}
	fprintf(fp, " ");
	fclose(fp);	 
	return 0;
}
#endif



#ifdef L_dhcplib_static_leases
/* ysyoo. 2003-5-29, static leases */
static void remove_already_lease_ip(u_int8_t *chaddr, u_int32_t yiaddr)
{
	FILE *fp;
	struct dhcpOfferedAddr already_leases[255];
	u_int8_t count, i ;

	if ((fp = fopen(UDHCPD_LEASE_FILE, "r")) == NULL)
	{
		fprintf(stderr, "No lease file %s\n", UDHCPD_LEASE_FILE);
		return;
	}

	count = 0;
	while (fread(&already_leases[count], sizeof(struct dhcpOfferedAddr) , 1, fp) == 1)
		count++;
	
	fclose(fp);
	
	if (!(fp = fopen(UDHCPD_LEASE_FILE, "w"))) {
		printf("Unable to open %s for reading", UDHCPD_LEASE_FILE);
		return;
	}

	for (i = 0; i < count; i++) 
	{
		if (!memcmp(already_leases[i].chaddr, chaddr, 16) &&
		    already_leases[i].yiaddr != yiaddr)
			continue;

		if (already_leases[i].yiaddr != 0) {
			fwrite(already_leases[i].chaddr, 16, 1, fp);
			fwrite(&(already_leases[i].yiaddr), 4, 1, fp);
			fwrite(&(already_leases[i].expires), 4, 1, fp);
		}
	}
	fclose(fp);
}

void dhcplib_static_leases(char *hwaddr, u_int32_t yiaddr, int add)
{
	FILE *fp;
	struct dhcpOfferedStaticAddr s_leases[UDHCPD_STATIC_LEASE_MAX];
	int hw1, hw2, hw3, hw4, hw5, hw6;
	u_int8_t chaddr[16], i ;
	int count;

	memset(chaddr, 0, sizeof(chaddr));
	sscanf(hwaddr, "%02x-%02x-%02x-%02x-%02x-%02x", &hw1, &hw2, &hw3, &hw4, &hw5, &hw6);
	chaddr[0] = (u_int8_t)(hw1 & 0377);
	chaddr[1] = (u_int8_t)(hw2 & 0377);
	chaddr[2] = (u_int8_t)(hw3 & 0377);
	chaddr[3] = (u_int8_t)(hw4 & 0377);
	chaddr[4] = (u_int8_t)(hw5 & 0377);
	chaddr[5] = (u_int8_t)(hw6 & 0377);

	count = 0;
	if ( (fp = fopen(UDHCPD_STATIC_LEASE_FILE, "r"))) {
		while (fread(&s_leases[count], sizeof(struct dhcpOfferedStaticAddr) , 1, fp) == 1)
			count++;
		fclose(fp);
	}

	if (add)
	{
		if (count >= UDHCPD_STATIC_LEASE_MAX) 
			return;
		memcpy(s_leases[count].chaddr, chaddr, 16);
		s_leases[count].yiaddr = yiaddr;
		s_leases[count].expires = 0;
		remove_already_lease_ip(chaddr, yiaddr);
		count++;
	}
	else
	{
		/* remove dynamic lease */
		dhcplib_flush_dhcpd_leases();
	}

	if (!(fp = fopen(UDHCPD_STATIC_LEASE_FILE, "w"))) {
		printf("Unable to open %s for reading", UDHCPD_STATIC_LEASE_FILE);
		return;
	}

	for (i = 0; i < count; i++)
	{
		if (!add &&
		    !memcmp(s_leases[i].chaddr, chaddr, 16) &&
		    s_leases[i].yiaddr == yiaddr)
			continue;

		if (s_leases[i].yiaddr != 0) {
			fwrite(s_leases[i].chaddr, 16, 1, fp);
			fwrite(&(s_leases[i].yiaddr), 4, 1, fp);
			fwrite(&(s_leases[i].expires), 4, 1, fp);
		}
	}
	fclose(fp);
}
#endif

#ifdef L_compare_domain_name_server
int compare_domain_name_server(char *new_dns1, char *new_dns2)
{
    char old_dns1[20], old_dns2[20];

    dhcplib_get_dns_server(old_dns1, old_dns2);
    if ( (new_dns1 && !strcmp(old_dns1, new_dns1)) && 
	(new_dns2 && !strcmp(old_dns2, new_dns2))
	)
        return 0;
    else
        return 1;
}
#endif

#ifdef L_determine_dhcpd_restart
int determine_dhcpd_restart(char *dns1, char *dns2)
{
    char info[10];

    get_internal_network_info(info);

    if(compare_domain_name_server(dns1, dns2))
    {
        if(!dhcplib_set_dns_server(dns1, dns2))
        {
		if(!strcmp(info,"dynamic"))
		{		
                        dhcpd_stop();
                        dhcpd_start();
		}	
        }
    }
    return 0;
}
#endif

#ifdef L_dhcplib_search_lease_by_ip
int dhcplib_search_lease_by_ip( char *ip, char *hostname )
{
	int lease_count, idx;
	char l_ip[20], l_mac[32];
	int lease_time;

	if (hostname) 
		hostname[0] = '\0';
	lease_count = dhcplib_get_active_lease_count();
	for( idx = 0 ; idx < lease_count ; idx++ )
	{
	       	dhcplib_get_lease_info( idx, l_ip, l_mac, &lease_time, hostname );
		if( !strcmp(ip, l_ip) ) 
			return 1;
		if (hostname) 
			hostname[0] = '\0';
	}
	return 0;
}
#endif


#ifdef L_dhcplib_search_static_lease
/* return 1 -> exists return 0 -> not exists */ 
int dhcplib_search_static_lease( char *ip, char *mac )
{
	int idx;
	char l_ip[20], l_mac[32];
	int lease_time;
	int lease_count = dhcplib_get_active_static_lease_count();
	
	for( idx = 0 ; idx < lease_count ; idx++ )
	{
	       	dhcplib_get_static_lease_info( idx, l_ip, l_mac, &lease_time );
		strtoupper( l_mac );
		if((ip && !mac) && !strcmp(ip, l_ip)) 
			return 1;
		if((mac && !ip) && !strcmp(mac, l_mac)) 
		{
			return 1;
		}
		if((mac && ip) && !strcmp(mac, l_mac) && !strcmp(ip, l_ip)) 
			return 1;
	}
	return 0;
}

#endif

#ifdef L_dhcplib_get_mac_by_ip
int dhcplib_get_mac_by_ip( char *ip, char *mac )
{
	int idx;
	char l_ip[20], l_mac[32];
	int lease_time;
	int lease_count = dhcplib_get_active_static_lease_count();
	
	for( idx = 0 ; idx < lease_count ; idx++ )
	{
	       	dhcplib_get_static_lease_info( idx, l_ip, l_mac, &lease_time );
		strtoupper( l_mac );
		if(!strcmp(ip, l_ip)) 
		{
			strcpy(mac,l_mac);
			return 1;
		}
	}
	return 0;
}
#endif

#ifdef L_dhcplib_flush_static_lease
int dhcplib_flush_static_lease(void)
{
	unlink(UDHCPD_STATIC_LEASE_FILE);
	unlink("/save/udhcpd.static");
	return 0;
}


#endif

#ifdef L_dhcplib_get_dhcp_server_mac
static int server_mac_found; 
static unsigned int server_mac[6];
#include "debug.h"
int dhcplib_get_dhcp_server_mac(int server, unsigned char *mac)
{
	char hwaddr[20]; 
	int i;
        struct in_addr in;

LOG(LOG_DEBUG, "Get server IP : %08x\n", server );
	if(server_mac_found)
	{
		for( i=0 ; i<6 ; i++)
			mac[i] = (unsigned char)server_mac[i];
		return 1;
	}

        strcpy(hwaddr,"");
        in.s_addr = server;
        get_internal_pc_hardware_address(inet_ntoa(in), hwaddr);
        if(strcmp(hwaddr,""))
        {
LOG(LOG_DEBUG, "Get Server MAC: %s\n", hwaddr );
                sscanf( hwaddr, "%02X:%02X:%02X:%02X:%02X:%02X",
                       &server_mac[0],
                       &server_mac[1],
                       &server_mac[2],
                       &server_mac[3],
                       &server_mac[4],
                       &server_mac[5] );
		server_mac_found = 1;
		for( i=0 ; i<6 ; i++)
			mac[i] = (unsigned char)server_mac[i];
		return 1;
        }
		
	return 0;
}
#endif




