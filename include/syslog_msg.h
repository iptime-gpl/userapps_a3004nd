#ifndef __SYSLOG_MSG_H
#define  __SYSLOG_MSG_H

#define SYSMSG_LOG_INFO       0x1
#define SYSMSG_LOG_WANRING    0x2
#define SYSMSG_LOG_ERROR      0x3
#define SYSMSG_LOG_DEBUG      0x4
#define SYSMSG_LOG_HIDDEN	10

#define MAX_SYSLOG_MSG		400
int syslog_msg(int level, char *fmt, ...);

#ifdef USE_MULTI_LANG
#include "syslog_lang.h"

#else

#ifdef KOREAN_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_kr.utf8.h"
#else
#include "syslog_msg_kr.h"
#endif
#endif

#ifdef JAPAN_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_jp.utf8.h"
#else
#include "syslog_msg_jp.h"
#endif
#endif

#ifdef ENGLISH_SUPPORT
#include "syslog_msg_en.h"
#endif

#ifdef CHINESE_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_ch.utf8.h"
#else
#include "syslog_msg_ch.h"
#endif
#endif

#ifdef CHINEXE_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_cx.utf8.h"
#else
#include "syslog_msg_cx.h"
#endif
#endif

#ifdef FRENCH_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_fr.utf8.h"
#else
#include "syslog_msg_fr.h"
#endif
#endif

#ifdef PORTUGUESE_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_pt.utf8.h"
#else
#include "syslog_msg_pt.h"
#endif
#endif

#ifdef RUSSIAN_SUPPORT
#ifdef USE_UTF8
#include "syslog_msg_ru.utf8.h"
#else
#include "syslog_msg_ru.h"
#endif
#endif

#endif

#endif
