#include <stdio.h>
#include <linosconfig.h>

#ifdef L_get_active_wl
/* wireless_ifmode={ifname},{wlmode} */
int get_active_wl(int idx, char *ifname, int *wireless_mode)
{
        char value[256], *ptr;

#ifdef USE_5G_WL
	if( idx == WL_MODE_24G )
	{
		if(ifname) strcpy(ifname,IF_WIRELESS);
                if(wireless_mode) *wireless_mode = WIRELESS_AP_MODE;
	}
	else if( idx == WL_MODE_5G )
	{
		if(ifname) strcpy(ifname,IF_WIRELESS_5G);
                if(wireless_mode) *wireless_mode = WIRELESS_AP_MODE;
	}
#else
        if(iconfig_get_index_value_direct("wireless_ifmode",idx,value) == -1)
        {
                if(idx == 0) /* default */
                {
			if(ifname) strcpy(ifname,IF_WIRELESS);
                        if(wireless_mode) *wireless_mode = WIRELESS_AP_MODE;
                        return 1;
                }
                return 0;
        }
        ptr=strtok(value,",\n");
        if(!ptr) return 0;
        if(ifname) strcpy(ifname,ptr);

        ptr=strtok(NULL,",\n");
        if(!ptr) return 0;
        if(wireless_mode) *wireless_mode = atoi(ptr);
#endif
        return 1;
}
#endif

#ifdef L_get_wireless_wan_enable
int get_wireless_wan_enable(void)
{
        int wireless_mode;
        char ifname[8];

        get_active_wl(0,ifname,&wireless_mode);
        return (wireless_mode == WIRELESS_CLIENT_WAN_MODE)?1:0;
}
#endif

