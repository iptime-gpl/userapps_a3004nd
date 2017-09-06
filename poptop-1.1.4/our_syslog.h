/*
 * our_syslog.h
 *
 * Syslog replacement functions
 *
 * $Id: our_syslog.h,v 1.2 2009/12/29 02:13:03 bcmnew Exp $
 */

#ifndef _PPTPD_SYSLOG_H
#define _PPTPD_SYSLOG_H

/*
 *	only enable this if you are debugging and running by hand
 *	If init runs us you may not have an fd-2,  and thus your write all over
 *	someones FD and the die :-(
 */
#undef USE_STDERR

#ifdef USE_STDERR

/*
 *	Send all errors to stderr
 */

#define openlog(a,b,c) ({})
#define syslog(a,b,c...) ({fprintf(stderr, "pptpd syslog: " b "\n" , ## c);})
#define closelog() ({})

#define syslog_perror	perror

#else

/*
 * Send all errors to syslog
 */

#include <errno.h>
#include <syslog.h>

#define syslog_perror(s)	syslog(LOG_ERR, "%s: %s", s, strerror(errno))
#ifdef SIZE_OPTI_L3
#define syslog(a,b,c...) 
#endif

#endif

#endif	/* !_PPTPD_SYSLOG_H */
