#include <linosconfig.h>
#include <sys/types.h>
#include <errno.h>

#ifdef USE_SKT_SEMO_OPTION
#ifdef L_set_skt_semo_option
int set_skt_semo_option(int flag)
{
	return iconfig_set_intvalue_direct("skt_semo", flag);
}
#endif

#ifdef L_get_skt_semo_option
int get_skt_semo_option(void)
{
	int flag;

	flag = iconfig_get_intvalue_direct("skt_semo");
	if(flag == -1) flag = 1;
	return flag;
}
#endif
#endif
