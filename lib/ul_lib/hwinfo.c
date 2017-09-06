#include <linosconfig.h>

#ifdef L_hwinfo_get_max_firmware_size
int hwinfo_get_max_firmware_size(void)
{
	int size;
	if((size=hwinfo_get_hexvalue_direct("max_firmware_size")) == -1)
		return (0x1F0000);
	return size;
}
#endif

#ifdef L_hwinfo_get_max_syslog
int hwinfo_get_max_syslog(void)
{
        int max;
        if((max=hwinfo_get_intvalue_direct("max_syslog")) == -1)
                return (400);
        return max;
}
#endif

#ifdef L_hwinfo_get_wireless_ifname
int hwinfo_get_wireless_ifname(char *ifname)
{
        if(hwinfo_get_value_direct("wireless_ifname", ifname) == -1)
        {
                printf("default wireless ifname not found ..");
                strcpy(ifname,IF_WIRELESS);
        }
        return 0;
}
#endif


#ifdef L_hwinfo_get_product_code
int hwinfo_get_product_code(char *code)
{
       if(hwinfo_get_value_direct("product_alias",code) == -1)
               printf("product id not found .. debug it!\n");
       return 0;
}
#endif

