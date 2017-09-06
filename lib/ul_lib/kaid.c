#include <linosconfig.h>

#ifdef L_set_kaid_status
int set_kaid_status(int status)
{
        return istatus_set_intvalue_direct( "kaistatus",status);
}
#endif

