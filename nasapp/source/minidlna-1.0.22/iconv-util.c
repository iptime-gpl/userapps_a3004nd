//=========================================================================
// FILENAME	: tagutils-misc.c
// DESCRIPTION	: Misc routines for supporting tagutils
//=========================================================================
// Copyright (c) 2008- NETGEAR, Inc. All Rights Reserved.
//=========================================================================

/* This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

/**************************************************************************
* Language
**************************************************************************/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/syslog.h>

#include "config.h"
#include "log.h"

#ifdef HAVE_ICONV_H
#include <iconv.h>
#endif


#define MAX_ICONV_BUF 1024

typedef enum {
	ICONV_OK,
	ICONV_TRYNEXT,
	ICONV_FATAL
} iconv_result;

static iconv_result
do_iconv(const char* to_ces, const char* from_ces,
	 const char *inbuf,  size_t inbytesleft,
	 char *outbuf_orig, size_t outbytesleft_orig)
{
#ifdef HAVE_ICONV_H
	size_t rc;
	iconv_result ret = ICONV_OK;

	size_t outbytesleft = outbytesleft_orig - 1;
	char* outbuf = outbuf_orig;

	iconv_t cd  = iconv_open(to_ces, from_ces);

	if(cd == (iconv_t)-1)
	{
		return ICONV_FATAL;
	}
	rc = iconv(cd, &inbuf, &inbytesleft, &outbuf, &outbytesleft);
	if(rc == (size_t)-1)
	{
		if(errno == E2BIG)
		{
			ret = ICONV_FATAL;
		}
		else
		{
			ret = ICONV_TRYNEXT;
			memset(outbuf_orig, '\0', outbytesleft_orig);
		}
	}
	iconv_close(cd);

	return ret;
#else // HAVE_ICONV_H
	return ICONV_FATAL;
#endif // HAVE_ICONV_H
}

#define N_LANG_ALT 8
static struct {
	char *lang;
	char *cpnames[N_LANG_ALT];
} iconv_map[] = {
	{ "ko_KR",  { "EUC-KR", "ISO-8859-1", 0 } },
	{ "ja_JP",  { "CP932", "CP950", "CP936", "ISO-8859-1", 0 } },
	{ "zh_CN",  { "CP936", "CP950", "CP932", "ISO-8859-1", 0 } },
	{ "zh_TW",  { "CP950", "CP936", "CP932", "ISO-8859-1", 0 } },
	{ 0,        { 0 } }
};
//static int lang_index = -1;
static int lang_index = 0;  // ysyoo, EFM

char iconv_buf[MAX_ICONV_BUF];;

char* name_iconv(char* native_text)
{
	char *utf8_text = NULL;
	iconv_result rc;
	int i, n;

	char buf[1024];


	memset(iconv_buf, 0x0, MAX_ICONV_BUF);

	i = lang_index;

#if 0
	// (1) try utf8 -> default
	rc = do_iconv(iconv_map[i].cpnames[0], "UTF-8", native_text, strlen(native_text), iconv_buf, MAX_ICONV_BUF);
	if(rc == ICONV_OK)
	{
		utf8_text = (unsigned char*)iconv_buf;
	}
	else if(rc == ICONV_TRYNEXT)
#endif
	{
		// (2) try default -> utf8
		rc = do_iconv("UTF-8", iconv_map[i].cpnames[0], native_text, strlen(native_text), iconv_buf, MAX_ICONV_BUF);
		if(rc == ICONV_OK)
		{
			utf8_text = (unsigned char*)iconv_buf;
		}
		else if(rc == ICONV_TRYNEXT)
		{
#if 0
			// (3) try other encodes
			for(n = 1; n < N_LANG_ALT && iconv_map[i].cpnames[n]; n++)
			{
				rc = do_iconv("UTF-8", iconv_map[i].cpnames[n], native_text, strlen(native_text), iconv_buf, MAX_ICONV_BUF);
				if(rc == ICONV_OK)
				{
					sprintf(buf, "echo other %s >> /tmp/name_iconv", native_text);
					system(buf);
					utf8_text = (unsigned char*)iconv_buf;
					break;
				}
			}
#endif
			if(!utf8_text)
			{
				// cannot iconv
				strcpy(iconv_buf, native_text);
				utf8_text = (unsigned char*)iconv_buf;
			}
		}
	}

#if 0
 out:
	if(!utf8_text)
	{
		utf8_text = (unsigned char*)strdup(native_text);
	}
#endif

	return utf8_text;
}
