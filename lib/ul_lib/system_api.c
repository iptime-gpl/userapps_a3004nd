#include <linosconfig.h>
#include <stdarg.h>


#ifdef L_create_pid
int create_pid( char *process_name )
{
	if(!strcmp(process_name,"")) return -1;
	return pid_db_set_value(process_name,getpid());
}
#endif

#ifdef L_delete_pid
int delete_pid( char *process_name )
{
	if(!strcmp(process_name,"")) return -1;
	return pid_db_remove_value(process_name);
}
#endif

#ifdef L_kill_process
int kill_process( char *process_name, int flag)
{
	char pid_filename[256];
	int pid;

//	printf("kill process -> %s\n", process_name);
	pid = pid_db_get_value(process_name);
	if(pid != -1)
	{
		if(flag & KILL_PROCESS_SIGTERM_FLAG)
		{
		//	printf("SIG TERM pid -> %d\n", pid);
			kill(pid, SIGTERM);

			usleep(10000);
        		if(kill(pid,0)==0)
			{
		//		printf("SIG KILL pid -> %d\n", pid);
				kill(pid, SIGKILL);
			}
		}
		else
			kill(pid, SIGKILL);
	}
	if(flag & KILL_PROCESS_REMOVE_PID_FLAG) pid_db_remove_value(process_name);
	return 0;
}
#endif

#ifdef L_kill_upnp
int kill_upnp(void)
{
        FILE *fp;
        int pid;

        kill_process("upnpd",1);
        sleep(1);
        unlink("/var/run/miniserver.pid");
        unlink("/var/run/minihandle.pid");
        unlink("/var/run/upnp_pmlist");

        return 0;
}
#endif

#ifdef L_kill_daemons
void kill_daemons(void)	
{
	FILE *fp;
	int pid;


	/* system("killall dhcpd"); */
	/* when dhcp lease time is too short */

#ifdef USE_SNMPD
	system("killall snmpd");
#endif
	system("killall apcpd");
	system("killall upnpd");
	system("killall timed");
	system("killall iptables-q");
#ifdef USE_PORT_TRIGGER
	system("iptables -t nat -F trigger");
#endif

#ifdef USE_IGMP_PROXY
	system("killall igmpproxy");
#endif

#ifdef USE_RTL8196B
	system("killall wscd");
	system("killall iwcontrol");
	system("killall auth");
#endif

#ifdef USE_BCM5354
	system("killall upnpd");
	system("killall eapd");
	system("killall nas");
	system("killall wps_monitor");
#ifdef USE_WIFI_EXTENDER
	system("killall wps_monitor_ext");
#endif
	system("killall pptpd");
//	system("killall iptables-q");
	system("killall apcpd");
	system("killall dhclient");
	/* system("killall dhcpd"); */
#ifdef USE_WIFI_EXTENDER
	system("killall wl_restartd");
#endif
#endif

#ifdef USE_IP3210
	system("killall upnpd");
	system("killall apcpd");
	system("killall dhclient");
	system("killall dhcpd");
#endif

#ifdef USE_LEDD
	system("killall ledd");
#endif
#ifdef USE_WIFI_EXTENDER_DAEMON
	system("killall extenderd");
#ifdef USE_EXTENDER_GPIOCTL_DAEMON
	system("killall gpiod");
#endif
#endif

#ifdef USE_ROUTER_NAS
	system("killall smbd");
	system("killall nmbd");
	system("killall lighttpd");
	system("killall lighttpd_ipdisk");
	system("killall proftpd");
#ifdef USE_CLOUD_BACKUP
        system("killall rsync");
#endif
#endif

#ifndef USE_ENABLE_REMOTE_UPGRADE
#ifdef USE_DUAL_WAN
	char file[128];

	pid = get_file_value( LINKMON_PID_FILE, 1);
	if(pid) 
		kill(pid,SIGTERM);

	kill_process( "dhclient."IF_WAN, 1);
	kill_process( "dhclient."IF_WAN2, 1);

	kill_process( "ppp1", 1);
	kill_process( "ppp2", 1);
	kill_process( "ppp3", 1);
	kill_process( "ppp4", 1);
	kill_process( "ppp5", 1);

#else
	kill_process( "dhclient."IF_WAN, 1);
#if	0
#ifdef USE_WL_WAN_MB
	kill_process( "dhclient."IF_WWAN, 1);
#ifdef USE_5G_WL
	kill_process( "dhclient."IF_WWAN_5G, 1);
#endif
#endif
#endif
#ifndef USE_FIRMARCH_V1
	kill_process( "ppp1", 1);
#endif
#endif
#endif

	kill_process("iptableq", 1);
	kill_process("sysd", 1);
#ifdef USE_SAVED
	kill_process("saved", 1);
#endif

#ifdef USE_UPNP
	kill_upnp();
#endif



}
#endif

#ifdef L_sysconf_nat_get
int sysconf_nat_get(int update)
{
	if(update)
	{
		if(get_file_value("/proc/sys/net/ipv4/nat_passthrough_flag", 1 ) == 0) return 1;
		else return 0;
	}
	else
	{
		int flag;
		flag = iconfig_get_intvalue_direct("nat_passthrough");
		if(flag == -1) flag = 0;
		if(flag == 0) return 1;
		return 0;
	}

}
#endif

#ifdef L_get_hwaddr_org
int get_hwaddr_org(char *ifname,char *hw_addr)
{
	char tag[64],value[512];
	if(ifname) snprintf(tag,64,"org_hwaddr.%s",ifname);
	else strcpy(tag,"org_hwaddr");
	if(iconfig_get_value_direct(tag,value)==-1)
	{
    		strcpy(hw_addr, "");
		return 0;
	}
    	strcpy(hw_addr, value);
    	return 1;
}
#endif

#ifdef L_get_timed_status
int get_timed_status(void)
{
	int status;
	status = istatus_get_intvalue_direct( "time_response" );
	if(status == -1) return 0;
	return status;
}
#endif

#ifdef L_dmztwinip_read_config
int dmztwinip_read_config(char *wanname, dmztwinip *config)
{
	char tag[20], value[256], *ptr;

	snprintf(tag,20,"dmztwinip_%s", wanname);
	memset((char *)config, 0, sizeof(dmztwinip));

	if (iconfig_get_value_direct(tag, value) != -1)
	{
		ptr=strtok(value,",");
		if(ptr) config->opmode = atoi(ptr);
		ptr=strtok(NULL,",");
		if(ptr) strcpy(config->hwaddr, ptr);
		ptr=strtok(NULL,",");
		if(ptr) strcpy(config->ipaddr, ptr);
		ptr=strtok(NULL,",");
		if(ptr) config->leasetime = atoi(ptr);

		return 1;
	}

	return 0;
}
#endif

#ifdef L_check_process
int check_process(char *process_name)
{
        int pid;

        pid = pid_db_get_value( process_name );
        if(pid == -1) 
		return 0;
        if(kill(pid,0)==0)
                return 1;
        return 0;
}
#endif

#ifdef L_file_exists
int file_exists(char *filename)
{
    struct stat statbuf;

    if( stat(filename, &statbuf))
            return 0;
    return 1;
}
#endif


#ifdef L_check_process2
int check_process2(char *pidfile)
{
        int pid;

	pid = get_file_value( pidfile , 1);
        if(pid && kill(pid,0)==0)
                return 1;
        return 0;
}
#endif

#ifdef L_kill_process2
int kill_process2(char *pidfile, int sig)
{
        int pid;

	pid = get_file_value( pidfile , 1);
	if(pid) kill(pid,sig);
        return 0;
}
#endif

#ifdef L_system2
int system2(char *format, ...)
{
    va_list args;
    char cmd[1024];

    va_start(args, format);
    vsnprintf(cmd, (sizeof(cmd)-sizeof(" >/dev/null 2>&1")), format , args);
    va_end(args);

    strcat(cmd, " >/dev/null 2>&1");
    return system(cmd);
}
#endif

