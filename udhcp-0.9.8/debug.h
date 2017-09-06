#ifndef _DEBUG_H
#define _DEBUG_H

#include "libbb_udhcp.h"

#include <stdio.h>
#ifdef SYSLOG
#include <syslog.h>
#endif


#ifdef SYSLOG
#if 0
# define LOG(level, str, args...) do { printf(str, ## args); \
				printf("\n"); \
				syslog(level, str, ## args); } while(0)
#else
#if 0
# define LOG(level, str, args...) do { fprintf(stderr, str, ## args); \
				fprintf(stderr,"\n"); \
				 } while(0)
#else
#include <syslog_msg.h>
#ifdef USE_SYSTEM_LOG
# define LOG(level, str, args...) syslog_msg(SYSMSG_LOG_HIDDEN,str,## args)
#else
# define LOG(level, str, args...)
#endif
#endif
#endif
# define OPEN_LOG(name) openlog(name, 0, 0)
#define CLOSE_LOG() closelog()
#else
# define LOG_EMERG	"EMERGENCY!"
# define LOG_ALERT	"ALERT!"
# define LOG_CRIT	"critical!"
# define LOG_WARNING	"warning"
# define LOG_ERR	"error"
# define LOG_INFO	"info"
# define LOG_DEBUG	"debug"
#if 0
# define LOG(level, str, args...) do { printf("%s, ", level); \
				printf(str, ## args); \
				printf("\n"); } while(0)
#else
# define LOG(level, str, args...) 
#endif
# define OPEN_LOG(name) do {;} while(0)
#define CLOSE_LOG() do {;} while(0)
#endif

#ifdef DEBUG
# undef DEBUG
# define DEBUG(level, str, args...) LOG(level, str, ## args)
# define DEBUGGING
#else
# define DEBUG(level, str, args...) do {;} while(0)
#endif

#endif
