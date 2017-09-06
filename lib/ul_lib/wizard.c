#include <linosconfig.h>

#ifdef L_wizard_api_set_status
int wizard_api_set_status(char *ifname,char *status)
{
        char tag[TAGLEN];

        snprintf(tag,TAGLEN,"wizard_status.%s", ifname);
        return istatus_set_value_direct(tag, status );
}
#endif

