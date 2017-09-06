#include <linosconfig.h>

#ifdef L_set_sw_upgrade_status
int set_sw_upgrade_status(int status)
{
	FILE *fp;

	if ((fp = fopen(SW_UPGRADE_STATUS_FILE, "w+")) == NULL)
	{
		return 1;
	}

	fprintf(fp, "%d", status);
	fclose(fp);

#ifdef USE_ONLINE_UPGRADE
	{
		char buf[3];
		sprintf(buf, "%d", status);
		write_file("/home/httpd/checkup", buf);
	}
#endif
	return 0;
}
#endif

#ifdef L_set_upgrade_mode

#ifdef USE_FIRMARCH_V1
int set_upgrade_mode(int flag)
{
	if(flag) 
	{
		system("echo 1 >> /var/run/upgrade_mode");
		kill_daemons();
	}
	else unlink("/var/run/upgrade_mode");
}
#else

#ifdef USE_FIRMUP2
#error "ERROR ->  Define USE_FIRMARCH_V1"
#endif
int set_upgrade_mode(int flag)
{
	if( flag ) 
	{

	system("echo 1 >> /var/run/upgrade_mode");
	kill_daemons();
#ifdef USE_CONFIG_SAVE_RESTORE
	system("rm /var/run/savefs.gz");
#endif

#if defined USE_CRAMFS_RAM2_FOR_UPGRADE || defined USE_LGDACOM
#ifndef USE_LGDACOM
        system("umount /dev/ram1");
#endif
        system("umount /dev/ram2");
        system("zcat /var/temp.fs.gz >> /dev/ram2");
        system("mount -t ext2 /dev/ram2 /tmp");
#else
		system("echo 1 >> /var/run/upgrade_mode");
        	system("rm /usr/local/lib/iptables/*");
	        system("rm /sbin/iptables");
	        system("rm /sbin/pppd");
	        system("rm /sbin/dhclient");
	        system("rm /sbin/dhcpd");
	        system("rm /bin/tc");
	        system("rm /sbin/kdebug");

#ifdef USE_ISL3890
		/* only for timewave */
		system("rm /sbin/isl3890.arm");
		system("rm -rf /lib/modules/pcmcia");
#endif

	        system("umount /save");
	        system("rm -rf /sbin");
	        system("rm -rf /etc");
	        system("rm -rf /save");
	        system("rm -rf /lost+found");
	        system("rm -rf /usr/lib");
	        system("rm -rf /lib/modules");
	        system("rm -rf /var/lib");
#ifndef USE_JUST_AP
		system("rm -rf /bin/timepro.cgi");
#else
		system("rm -rf /bin/timeap.cgi");
#endif
#ifdef USE_VAHA_APPS
		system("rm -rf /sbin/vaha");
#endif
#ifdef USE_ORAN_APPS
		system("rm -rf /sbin/zigb");
#endif
#ifdef USE_KAID_SUPPORT
		system("rm -rf /sbin/kaid");
#endif

#ifdef ARCH_TIMEPROV 
		system("rm -rf /home/httpd/images/smenu_blank.gif");
		system("rm -rf /home/httpd/images/srmenu_blank.gif");
		system("rm -rf /home/httpd/images/srmenu_left.gif");
		system("rm -rf /home/httpd/images/srmenu_right.gif");
		system("rm -rf /home/httpd/images/ssmenu_bblank.gif");
		system("rm -rf /home/httpd/images/ssmenu_blank.gif");
		system("rm -rf /home/httpd/images/ssmenu_leftside.gif");
		system("rm -rf /home/httpd/images/ssmenu_rightside.gif");
		system("rm -rf /home/httpd/images/subtitle_bg.gif");
		system("rm -rf /home/httpd/images/subtitle_rightbar.gif");
		system("rm -rf /home/httpd/images/subtitle_roundend.gif");
		system("rm -rf /home/httpd/images/tm_bblank.gif");
		system("rm -rf /home/httpd/images/tm_blank.gif");
		system("rm -rf /home/httpd/images/tm_bleft.gif");
		system("rm -rf /home/httpd/images/tm_bright.gif");
		system("rm -rf /home/httpd/images/tm_fblank.gif");
		system("rm -rf /home/httpd/images/tm_fleft.gif");
		system("rm -rf /home/httpd/images/tm_fright.gif");
		system("rm -rf /home/httpd/images/tm_leftside.gif");
		system("rm -rf /home/httpd/images/tm_rightside.gif");
#endif
		system("rm -rf /bin/login");
		system("rm -rf /lib/arm-linux-uclibc/lib/libdl.so.0");
#endif
	}
	else
		unlink("/var/run/upgrade_mode");
	return 0;
}
#endif
#endif
