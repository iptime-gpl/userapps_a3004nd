#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <malloc.h>
#include <syslog.h>
#include <stdarg.h>
#include <unistd.h>

#include <linosconfig.h>

#ifdef L_ddnsapi_set_status2
int ddnsapi_set_status2( char *hostname, ezddns_status_t *ddns_status)
{
	char tag[TAGLEN];
	char value[1024];

	if(ddns_status->code == DDNS_SUCCESS_UPDATE) time((time_t*)&ddns_status->timestamp);
	else ddns_status->timestamp = 0;

	snprintf(tag,TAGLEN,"ddns+%s",hostname);
	snprintf( value, 1024, "%d,%u,%u,%s,%s", 
			ddns_status->code,
			ddns_status->timestamp,
			ddns_status->remaintime,
			ddns_status->ip,
			ddns_status->msg);
	return istatus_set_value_direct( tag, value );

}
#endif

#ifdef L_ddnsapi_set_status
int ddnsapi_set_refresh_flag(char *host, int flag)
{
        char tag[128];

        if(!host) return 0;
        snprintf(tag,128,"refresh_ddns_%s",host);
        istatus_set_intvalue_direct(tag,flag);

        return 1;
}

int ddnsapi_set_status(int code, char *hostname, char *updateip, char *msg)
{
	char tag[TAGLEN];
	char value[1024];
	unsigned int timestamp;
	int ret;


	if(code == DDNS_SUCCESS_UPDATE) time((time_t*)&timestamp);
	else timestamp = 0;

	snprintf(tag,TAGLEN,"ddns+%s",hostname);
	snprintf( value, 1024, "%d,%u,%u,%s,%s", 
			code,
			timestamp,
			FORCE_UPDATE_TIMEOUT,
			updateip?updateip:"noip",
			msg);
	ret=istatus_set_value_direct( tag, value );

	ddnsapi_set_refresh_flag(hostname,0);

	
	return ret;

}
#endif


#ifdef L_ddnsapi_update_remaintime
int ddnsapi_update_remaintime(char *hostname, int elapsed )
{
	ezddns_status_t ddns_status;
	char tag[TAGLEN];
	char value[1024];

	ddnsapi_get_status(hostname,&ddns_status);
	if(elapsed == -1) 
	{
		ddns_status.remaintime=0;
		ddns_status.code=DDNS_RETRY;
	}
	else ddns_status.remaintime -= elapsed;
	if(ddns_status.remaintime<0) 
		ddns_status.remaintime=0;

	snprintf(tag,TAGLEN,"ddns+%s",hostname);
	snprintf( value, 1024, "%d,%u,%u,%s,%s", 
			ddns_status.code,
			ddns_status.timestamp,
			ddns_status.remaintime,
			ddns_status.ip,
			ddns_status.msg);
	return istatus_set_value_direct( tag, value );

}
#endif


