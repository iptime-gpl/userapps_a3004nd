#include <linosconfig.h>

#ifdef L_set_pppoe_status
int set_pppoe_status(char *wan_name, int status)
{
        char tag[128];

        snprintf( tag,128, "pppoe_status_%s", wan_name );
        return istatus_set_intvalue_direct( tag, status );
}
#endif

