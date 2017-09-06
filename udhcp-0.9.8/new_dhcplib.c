
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

/* iconfig.cfg dhcp config */
/*

dhcpd={1|0}
dhcpd_conf={ifname},{sip},{eip},{gw},{mask}
dhcpd_dns={dns1},{dns2} 
dhcpd_opt={leasetime},{autotime},{dns_suffix} 

*/

#ifdef L_dhcpd_set_op
int dhcpd_set_op(int flag)
{
	iconfig_set_intvalue_direct("dhcpd",flag);
}
#endif

#ifdef L_dhcpd_get_op
int dhcpd_get_op(void)
{
	int op;
	if( (op=iconfig_get_intvalue_direct("dhcpd")) == -1) return 1;
	return op;
}
#endif


#ifdef L_init_dhcpd
int init_dhcpd(void)
{
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
	update_udhcpd_config(&config);

#ifdef USE_REAL_IPCLONE
	if(dhcpd_get_op() || check_twinip_enable())
#else
	if(dhcpd_get_op())
#endif
		dhcpd_start();
}
#endif

#ifdef L_dhcpd_read_config
int dhcpd_read_config(dhcpd_conf_t *config)
{
	char value[1024], *ptr;

	if(iconfig_get_value_direct("dhcpd_conf", value) == -1 )
	{
	       	strcpy(config->ifname,IF_LOCAL);
		strcpy(config->sip,"192.168.0.2");
		strcpy(config->eip,"192.168.0.254");
		strcpy(config->gw,"192.168.0.1");
		strcpy(config->mask,"255.255.255.0");
	}
	else
	{
		ptr=strtok(value,",\n");
		if(ptr) strcpy(config->ifname,ptr);

		ptr=strtok(NULL,",\n");
		if(ptr) strcpy(config->sip,ptr);

		ptr=strtok(NULL,",\n");
		if(ptr) strcpy(config->eip,ptr);

		ptr=strtok(NULL,",\n");
		if(ptr) strcpy(config->gw,ptr);

		ptr=strtok(NULL,",\n");
		if(ptr) strcpy(config->mask,ptr);
	}

	if(iconfig_get_value_direct("dhcpd_dns", value) == -1 )
	{
		strcpy(config->dns1,"192.168.0.1");
		strcpy(config->dns2,"");
	}
	else
	{
		ptr=strtok(value,",\n");
		if(ptr) strcpy(config->dns1,ptr);

		ptr=strtok(NULL,",\n");
		if(ptr) strcpy(config->dns2,ptr);
	}

	if(iconfig_get_value_direct("dhcpd_opt", value) == -1 )
	{
		config->leasetime = DEFAULT_LEASETIME;
		strcpy(config->dns_suffix,"");
		config->autotime = 30;
		config->max_static_lease = UDHCPD_STATIC_LEASE_MAX;
	}
	else
	{
		ptr = strtok(value,",\n");
		if(ptr) config->leasetime = atoi(ptr); 

		ptr = strtok(NULL,",\n");
		if(ptr) config->autotime = atoi(ptr);

		ptr = strtok(NULL,",\n");
		if(ptr) config->max_static_lease = atoi(ptr);

		ptr = strtok(NULL,", \n");
		if(ptr) strcpy(config->dns_suffix,ptr);
		else strcpy(config->dns_suffix,"");
	}

	if(iconfig_get_value_direct("dhcpd_lease_file", config->lease_file) == -1 ) strcpy(config->lease_file,UDHCPD_LEASE_FILE);
	if(iconfig_get_value_direct("dhcpd_static_lease_file", config->static_lease_file) == -1 ) strcpy(config->static_lease_file,UDHCPD_STATIC_LEASE_FILE);
	if(iconfig_get_value_direct("dhcpd_configfile", config->config_file) == -1 ) strcpy(config->config_file,UDHCPD_CONF_FILE);
	return 0;
}
#endif

#ifdef L_update_udhcpd_config
int update_udhcpd_config(dhcpd_conf_t *config)
{
        FILE *fp;

        if ((fp = fopen(config->config_file, "w+")) == NULL)
                return -1;

        fprintf(fp, "start %s\n", config->sip);
        fprintf(fp, "end %s\n", config->eip);
        fprintf(fp, "interface %s\n", config->ifname); 
        fprintf(fp, "auto_time %d\n", config->autotime);

        if (strcmp(config->dns1, "")) 
		fprintf(fp, "option dns %s %s\n", config->dns1, config->dns2);
        fprintf(fp, "option subnet %s\n", config->mask);
        fprintf(fp, "option router %s\n", config->gw);
	if(strcmp(config->dns_suffix,""))
        	fprintf(fp, "option domain %s\n", config->dns_suffix);
        fprintf(fp, "option lease %d\n", config->leasetime);

        fprintf(fp, "lease_file %s\n", config->lease_file );
        fprintf(fp, "static_file %s\n", config->static_lease_file );
        fprintf(fp, "max_static %d\n", config->max_static_lease );

        fclose(fp);
	return 0;
}
#endif

#ifdef L_dhcpd_commit_config
/*
dhcpd_op={1|0}
dhcpd_conf={ifname},{sip},{eip},{gw},{mask}
dhcpd_dns={dns1},{dns2} 
dhcpd_opt={leasetime},{autotime},{max_static},{dns_suffix} 
*/

int dhcpd_commit_config(dhcpd_conf_t *config)
{
	char value[1024];

	sprintf(value,"%s,%s,%s,%s,%s", config->ifname,config->sip,config->eip,config->gw,config->mask);
	iconfig_set_value_direct("dhcpd_conf", value);

	sprintf(value,"%s,%s", config->dns1,config->dns2);
	iconfig_set_value_direct("dhcpd_dns", value);

	sprintf(value,"%d,%d,%d,%s ", config->leasetime,config->autotime,config->max_static_lease,config->dns_suffix);
	iconfig_set_value_direct("dhcpd_opt", value);

	iconfig_set_value_direct("dhcpd_configfile", config->config_file);
	iconfig_set_value_direct("dhcpd_lease_file", config->lease_file);
	iconfig_set_value_direct("dhcpd_static_lease_file", config->static_lease_file);

	update_udhcpd_config(config);
	return 0;
}
#endif


#ifdef L_dhcpd_set_dns
int dhcpd_set_dns(char *dns1, char *dns2)
{
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
	if( (dns1 && strcmp(config.dns1, dns1)) || (dns2 && strcmp(config.dns2,dns2)))
	{
		if(dns1) strcpy(config.dns1,dns1);
		if(dns2) strcpy(config.dns2,dns2);
		dhcpd_commit_config(&config);
		dhcpd_stop();
		dhcpd_start();
		return 1;
	}
	return 0;
}
#endif

#ifdef L_dhcpd_start
int dhcpd_start(void)
{
    char command[128];

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
        kill_process("dhcpd",1);
	return 0;
}
#endif

#ifdef L_dhcpd_get_all_static_lease
int dhcpd_get_all_static_lease( dhcpd_lease_info_t *lease_arr, int max )
{
        FILE *fp;
        struct dhcpOfferedStaticAddr lease;
        struct in_addr in;
        char *ip_str;
        int i;
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
        if((fp=fopen(config.static_lease_file, "r")) == NULL)
                return 0;

        memset( &lease, 0x0, sizeof(struct dhcpOfferedStaticAddr));
        i = 0;
        while( fread( &lease, sizeof(struct dhcpOfferedStaticAddr), 1, fp ) == 1 )
        {
		if(!lease_arr)
		{
			i++;
			continue;
		}

                in.s_addr = lease.yiaddr;
                ip_str = inet_ntoa(in);
                if(ip_str) strcpy( lease_arr[i].ip_addr, ip_str );
                else
                        continue;

                sprintf( lease_arr[i].hw_addr, "%02X:%02X:%02X:%02X:%02X:%02X",
                                lease.chaddr[0],
                                lease.chaddr[1],
                                lease.chaddr[2],
                                lease.chaddr[3],
                                lease.chaddr[4],
                                lease.chaddr[5] );
                lease_arr[i].expires = lease.expires;
                i++;
                if(i == max)
                        break;
        }
        fclose(fp);

        return i;
}
#endif

#ifdef L_dhcpd_set_all_static_lease
int dhcpd_set_all_static_lease( dhcpd_lease_info_t *lease_arr, int count )
{
        FILE *fp;
        struct dhcpOfferedStaticAddr lease;
        struct in_addr in;
        char *ip_str;
        int i;
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
        if((fp=fopen(config.static_lease_file, "w+")) == NULL)
                return 0;
	for( i = 0 ; i < count ; i++ )
        {
        	memset( &lease, 0x0, sizeof(struct dhcpOfferedStaticAddr));
                lease.yiaddr = inet_addr( lease_arr[i].ip_addr );
		strtomac(lease_arr[i].hw_addr,lease.chaddr);
		lease.expires = lease_arr[i].expires;
		fwrite( &lease, 1, sizeof(lease), fp );
        }
        fclose(fp);
        return 1;
}
#endif


#ifdef L_dhcpd_search_static_lease
int dhcpd_search_static_lease(char *ip_addr, char *mac_addr)
{
	 dhcpd_lease_info_t *lease_arr;
	 int count, idx, ret = 0;
	 dhcpd_conf_t config;

	 dhcpd_read_config(&config);
	 lease_arr = (dhcpd_lease_info_t *)malloc(sizeof(dhcpd_lease_info_t)*config.max_static_lease);
	 memset(lease_arr, 0x0, sizeof(dhcpd_lease_info_t)*config.max_static_lease);
	 count = dhcpd_get_all_static_lease(lease_arr,config.max_static_lease);
	 for( idx = 0 ; idx < count; idx++ ) 
	 {
		 if(ip_addr && !mac_addr && !strcmp(ip_addr,lease_arr[idx].ip_addr)) ret = 1;
		 else if(!ip_addr && mac_addr && !strcmp(mac_addr,lease_arr[idx].hw_addr)) ret = 1;
		 else if(ip_addr && mac_addr && !strcmp(mac_addr,lease_arr[idx].hw_addr) && !strcmp(ip_addr,lease_arr[idx].ip_addr)) ret = 1;
	 }
	 free(lease_arr);
	 return ret;
}
#endif


#ifdef L_dhcpd_add_static_lease
int dhcpd_add_static_lease(char *ip_addr, char *hw_addr)
{
	dhcpd_lease_info_t *lease_arr;
	dhcpd_conf_t config;
       	int count, idx, ret = 0;

	dhcpd_read_config(&config);
	lease_arr = (dhcpd_lease_info_t *)malloc(sizeof(dhcpd_lease_info_t)*config.max_static_lease);
	memset(lease_arr, 0x0, sizeof(dhcpd_lease_info_t)*config.max_static_lease); 
	count = dhcpd_get_all_static_lease(lease_arr,config.max_static_lease);
       	
	for( idx = 0 ; idx < count; idx++ ) 
	{
		if( !strcmp(ip_addr,lease_arr[idx].ip_addr) || !strcmp(hw_addr,lease_arr[idx].hw_addr) )
		{
			if( !strcmp(ip_addr,lease_arr[idx].ip_addr))
			{
				free(lease_arr);
				return ERROR_MANUAL_IPALLOC_ALREADY_EXIST_IP;
			}
			else
			{
				free(lease_arr);
				return ERROR_MANUAL_IPALLOC_ALREADY_EXIST_MAC;
			}
		}
       	}
	
	strcpy( lease_arr[count].ip_addr, ip_addr ); 
	strcpy( lease_arr[count].hw_addr, hw_addr ); 
	lease_arr[count].expires = config.leasetime;
	count++; 
	dhcpd_set_all_static_lease(lease_arr,count);
	free(lease_arr);
	return 0;
}
#endif

#ifdef L_dhcpd_remove_static_lease
/* the same as search policy */
int dhcpd_remove_static_lease(char *ip_addr, char *hw_addr)
{
	dhcpd_lease_info_t *lease_arr;
	dhcpd_conf_t config;
       	int count, idx, ret = 0, foundit = 0;
	char mac_addr[20];


	if(hw_addr)
	{
		strcpy(mac_addr,hw_addr);
		if(strchr(mac_addr,'-')) convert_mac2(mac_addr);
	}

	dhcpd_read_config(&config);
	lease_arr = (dhcpd_lease_info_t *)malloc(sizeof(dhcpd_lease_info_t)*config.max_static_lease);
	memset(lease_arr, 0x0, sizeof(dhcpd_lease_info_t)*config.max_static_lease); 
	count = dhcpd_get_all_static_lease(lease_arr,config.max_static_lease);
       	
	for( idx = 0 ; idx < count; idx++ ) 
	{
		if(!foundit)
		{
			if(ip_addr && !hw_addr && !strcmp(ip_addr,lease_arr[idx].ip_addr)) foundit = 1;
			else if(!ip_addr && hw_addr && !strcmp(mac_addr,lease_arr[idx].hw_addr)) foundit = 1;
			else if(ip_addr && hw_addr && !strcmp(mac_addr,lease_arr[idx].hw_addr) && !strcmp(ip_addr,lease_arr[idx].ip_addr)) foundit = 1;
		}

		if(foundit && idx != count-1) lease_arr[idx] = lease_arr[idx+1];
       	}

	if(foundit) 
	{
		count--;
		dhcpd_set_all_static_lease(lease_arr,count);
	}

	free(lease_arr);

	return 0;
}
#endif


#ifdef L_dhcpd_flush_dynamic_lease
int dhcpd_flush_dynamic_lease( void )
{
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
	write_file(config.lease_file,"");
	return 0;
}
#endif

#ifdef L_dhcpd_flush_static_lease
int dhcpd_flush_static_lease( void )
{
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
	write_file(config.static_lease_file,"");
	return 0;
}
#endif


#ifdef L_dhcpd_get_all_dynamic_lease
int dhcpd_get_all_dynamic_lease( dhcpd_lease_info_t *lease_arr, int max )
{
        FILE *fp;
        struct dhcpOfferedAddr lease;
        struct in_addr in;
        char *ip_str;
        int i;
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
        if((fp=fopen(config.lease_file, "r")) == NULL)
                return 0;

        memset( &lease, 0x0, sizeof(struct dhcpOfferedAddr));
        i = 0;
        while( fread( &lease, sizeof(struct dhcpOfferedAddr), 1, fp ) == 1 )
        {
		if(!lease_arr)
		{
			i++;
			continue;
		}

                in.s_addr = lease.yiaddr;
                ip_str = inet_ntoa(in);
                if(ip_str) strcpy( lease_arr[i].ip_addr, ip_str );
                else
                        continue;

                sprintf( lease_arr[i].hw_addr, "%02X:%02X:%02X:%02X:%02X:%02X",
                                lease.chaddr[0],
                                lease.chaddr[1],
                                lease.chaddr[2],
                                lease.chaddr[3],
                                lease.chaddr[4],
                                lease.chaddr[5] );
                lease_arr[i].expires = lease.expires;
                strcpy(lease_arr[i].hostname,lease.hostname);
                i++;
                if(i == max)
                        break;
        }
        fclose(fp);

        return i;
}
#endif

#ifdef L_dhcpd_get_dynamic_lease
int dhcpd_get_dynamic_lease( char *ipaddr, dhcpd_lease_info_t *l_info )
{
        FILE *fp;
        struct dhcpOfferedAddr lease;
        struct in_addr in;
        char *ip_str;
        int foundit;
	dhcpd_conf_t config;

	dhcpd_read_config(&config);
        if((fp=fopen(config.lease_file, "r")) == NULL)
                return 0;

        memset( &lease, 0x0, sizeof(struct dhcpOfferedAddr));
        foundit = 0;
        while( fread( &lease, sizeof(struct dhcpOfferedAddr), 1, fp ) == 1 )
        {
                in.s_addr = lease.yiaddr;
                ip_str = inet_ntoa(in);
                if(ip_str && !strcmp(ip_str, ipaddr))
		{
			strcpy(l_info->ip_addr, ip_str);
			sprintf( l_info->hw_addr, "%02X:%02X:%02X:%02X:%02X:%02X",
                                lease.chaddr[0],
                                lease.chaddr[1],
                                lease.chaddr[2],
                                lease.chaddr[3],
                                lease.chaddr[4],
                                lease.chaddr[5] ); 
			l_info->expires = lease.expires; 
			strcpy(l_info->hostname,lease.hostname);
			foundit = 1;
			break;
		}
        }

        fclose(fp);
        return foundit;
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




