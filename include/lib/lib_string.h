
#ifdef USE_MULTI_LANG
#include "lib_string_lang.h"
#else

#ifdef KOREAN_SUPPORT
#ifdef USE_UTF8
#include "lib_string_kr.utf8.h"
#else
#include "lib_string_kr.h"
#endif
#endif

#ifdef JAPAN_SUPPORT
#ifdef USE_UTF8
#include "lib_string_jp.utf8.h"
#else
#include "lib_string_jp.h"
#endif
#endif

#ifdef ENGLISH_SUPPORT
#include "lib_string_en.h"
#endif

#ifdef CHINESE_SUPPORT
#ifdef USE_UTF8
#include "lib_string_ch.utf8.h"
#else
#include "lib_string_ch.h"
#endif
#endif

#ifdef CHINEXE_SUPPORT
#ifdef USE_UTF8
#include "lib_string_cx.utf8.h"
#else
#include "lib_string_cx.h"
#endif
#endif

#ifdef FRENCH_SUPPORT
#ifdef USE_UTF8
#include "lib_string_fr.utf8.h"
#else
#include "lib_string_fr.h"
#endif
#endif

#ifdef PORTUGUESE_SUPPORT
#ifdef USE_UTF8
#include "lib_string_pt.utf8.h"
#else
#include "lib_string_pt.h"
#endif
#endif

#ifdef VIETNAMESE_SUPPORT
#ifdef USE_UTF8
#include "lib_string_vi.utf8.h"
#endif
#endif

#endif
