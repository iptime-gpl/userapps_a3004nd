/*
 *  Boa, an http server
 *  Copyright (C) 1995 Paul Phillips <paulp@go2net.com>
 *  Some changes Copyright (C) 1996,97 Larry Doolittle <ldoolitt@boa.org>
 *  Some changes Copyright (C) 1996 Charles F. Randall <crandall@goldsys.com>
 *  Some changes Copyright (C) 1996-99 Jon Nelson <jnelson@boa.org>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 1, or (at your option)
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 */

/* $Id: util.c,v 1.11 2017/10/26 06:28:11 mt7623 Exp $ */

#include "boa.h"

#define HEX_TO_DECIMAL(char1, char2)	\
    (((char1 >= 'A') ? (((char1 & 0xdf) - 'A') + 10) : (char1 - '0')) * 16) + \
    (((char2 >= 'A') ? (((char2 & 0xdf) - 'A') + 10) : (char2 - '0')))

const char month_tab[48] =
    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec ";
const char day_tab[] = "Sun,Mon,Tue,Wed,Thu,Fri,Sat,";

/*
 * Name: clean_pathname
 *
 * Description: Replaces unsafe/incorrect instances of:
 *  //[...] with /
 *  /./ with /
 *  /../ with / (technically not what we want, but browsers should deal
 *   with this, not servers)
 */

void clean_pathname(char *pathname)
{
    char *cleanpath, c;

    cleanpath = pathname;
    while ((c = *pathname++)) {
        if (c == '/') {
            while (1) {
                if (*pathname == '/')
                    pathname++;
                else if (*pathname == '.' && *(pathname + 1) == '/')
                    pathname += 2;
                else if (*pathname == '.' && *(pathname + 1) == '.' &&
                         *(pathname + 2) == '/') {
                    pathname += 3;
                } else
                    break;
            }
            c = '/';
        }
        *cleanpath++ = c;
    }

    *cleanpath = '\0';
}

/*
 * Name: get_commonlog_time
 *
 * Description: Returns the current time in common log format in a static
 * char buffer.
 *
 * commonlog time is exactly 25 characters long
 * because this is only used in logging, we add " [" before and "] " after
 * making 29 characters
 * "[27/Feb/1998:20:20:04 +0000] "
 *
 * Constrast with rfc822 time:
 * "Sun, 06 Nov 1994 08:49:37 GMT"
 *
 * Altered 10 Jan 2000 by Jon Nelson ala Drew Streib for non UTC logging
 *
 */

char *get_commonlog_time(void)
{
    struct tm *t;
    char *p;
    unsigned int a;
    static char buf[30];
    int time_offset;

    if (use_localtime) {
        t = localtime(&current_time);
        time_offset = TIMEZONE_OFFSET(t);
    } else {
        t = gmtime(&current_time);
        time_offset = 0;
    }

    p = buf + 29;
    *p-- = '\0';
    *p-- = ' ';
    *p-- = ']';
    a = abs(time_offset / 60);
    *p-- = '0' + a % 10;
    a /= 10;
    *p-- = '0' + a % 6;
    a /= 6;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = (time_offset >= 0) ? '+' : '-';
    *p-- = ' ';

    a = t->tm_sec;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ':';
    a = t->tm_min;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ':';
    a = t->tm_hour;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ':';
    a = 1900 + t->tm_year;
    while (a) {
        *p-- = '0' + a % 10;
        a /= 10;
    }
    /* p points to an unused spot */
    *p-- = '/';
    p -= 2;
    memcpy(p--, month_tab + 4 * (t->tm_mon), 3);
    *p-- = '/';
    a = t->tm_mday;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p = '[';
    return p;                   /* should be same as returning buf */
}

/*
 * Name: month2int
 *
 * Description: Turns a three letter month into a 0-11 int
 *
 * Note: This function is from wn-v1.07 -- it's clever and fast
 */

int month2int(char *monthname)
{
    switch (*monthname) {
    case 'A':
        return (*++monthname == 'p' ? 3 : 7);
    case 'D':
        return (11);
    case 'F':
        return (1);
    case 'J':
        if (*++monthname == 'a')
            return (0);
        return (*++monthname == 'n' ? 5 : 6);
    case 'M':
        return (*(monthname + 2) == 'r' ? 2 : 4);
    case 'N':
        return (10);
    case 'O':
        return (9);
    case 'S':
        return (8);
    default:
        return (-1);
    }
}

/*
 * Name: modified_since
 * Description: Decides whether a file's mtime is newer than the
 * If-Modified-Since header of a request.
 *

 Sun, 06 Nov 1994 08:49:37 GMT    ; RFC 822, updated by RFC 1123
 Sunday, 06-Nov-94 08:49:37 GMT   ; RFC 850, obsoleted by RFC 1036
 Sun Nov  6 08:49:37 1994         ; ANSI C's asctime() format
 31 September 2000 23:59:59 GMT   ; non-standard

 * RETURN VALUES:
 *  0: File has not been modified since specified time.
 *  1: File has been.
 * -1: Error!
 */

int modified_since(time_t * mtime, char *if_modified_since)
{
    struct tm *file_gmt;
    char *ims_info;
    char monthname[10 + 1];
    int day, month, year, hour, minute, second;
    int comp;

    ims_info = if_modified_since;
    while (*ims_info != ' ' && *ims_info != '\0')
        ++ims_info;
    if (*ims_info != ' ')
        return -1;

    /* the pre-space in the third scanf skips whitespace for the string */
    if (sscanf(ims_info, "%d %3s %d %d:%d:%d GMT", /* RFC 1123 */
               &day, monthname, &year, &hour, &minute, &second) == 6);
    else if (sscanf(ims_info, "%d-%3s-%d %d:%d:%d GMT", /* RFC 1036 */
                    &day, monthname, &year, &hour, &minute, &second) == 6)
        year += 1900;
    else if (sscanf(ims_info, " %3s %d %d:%d:%d %d", /* asctime() format */
                    monthname, &day, &hour, &minute, &second, &year) == 6);
    /*  allow this non-standard date format: 31 September 2000 23:59:59 GMT */
    /* NOTE: Use if_modified_since here, because the date *starts*
     *       with the day, versus a throwaway item
     */
    else if (sscanf(if_modified_since, "%d %10s %d %d:%d:%d GMT",
                    &day, monthname, &year, &hour, &minute, &second) == 6);
    else {
        log_error_time();
#ifndef SIZE_OPTI_L3
        fprintf(stderr, "Error in %s, line %d: Unable to sscanf \"%s\"\n",
                __FILE__, __LINE__, ims_info);
#endif
        return -1;              /* error */
    }

    file_gmt = gmtime(mtime);
    month = month2int(monthname);

    /* Go through from years to seconds -- if they are ever unequal,
     we know which one is newer and can return */

    if ((comp = 1900 + file_gmt->tm_year - year))
        return (comp > 0);
    if ((comp = file_gmt->tm_mon - month))
        return (comp > 0);
    if ((comp = file_gmt->tm_mday - day))
        return (comp > 0);
    if ((comp = file_gmt->tm_hour - hour))
        return (comp > 0);
    if ((comp = file_gmt->tm_min - minute))
        return (comp > 0);
    if ((comp = file_gmt->tm_sec - second))
        return (comp > 0);

    return 0;                   /* this person must really be into the latest/greatest */
}


/*
 * Name: to_upper
 *
 * Description: Turns a string into all upper case (for HTTP_ header forming)
 * AND changes - into _
 */

char *to_upper(char *str1)
{
    char *start = str1;

    while (*str1) {
        if (*str1 == '-')
            *str1 = '_';
        else
            *str1 = toupper(*str1);

        str1++;
    }

    return start;
}

/*
 * Name: unescape_uri
 *
 * Description: Decodes a uri, changing %xx encodings with the actual
 * character.  The query_string should already be gone.
 *
 * Return values:
 *  1: success
 *  0: illegal string
 */

int unescape_uri(char *uri, char ** query_string)
{
    char c, d;
    char *uri_old;

    uri_old = uri;

    while ((c = *uri_old)) {

	    /* 2010 04 05 added : scchoi : just for GET  ' ' will be '+'. So, recover it here */
	    if( c == '+' ) c = ' ';

	    if (c == '%') {
            uri_old++;
            if ((c = *uri_old++) && (d = *uri_old++))
                *uri++ = HEX_TO_DECIMAL(c, d);
            else
                return 0;       /* NULL in chars to be decoded */
        } else if (c == '?') { /* query string */
            if (query_string)
                *query_string = ++uri_old;
            /* stop here */
            *uri = '\0';
            return(1);
            break;
        } else if (c == '#') { /* fragment */
            /* legal part of URL, but we do *not* care.
             * However, we still have to look for the query string */
            if (query_string) {
                ++uri_old;
                while((c = *uri_old)) {
                    if (c == '?') {
                        *query_string = ++uri_old;
                        break;
                    }
                    ++uri_old;
                }
            }
            break;
        } else {
            *uri++ = c;
            uri_old++;
        }
    }

    *uri = '\0';
    return 1;
}

/* rfc822 (1123) time is exactly 29 characters long
 * "Sun, 06 Nov 1994 08:49:37 GMT"
 */

void rfc822_time_buf(char *buf, time_t s)
{
    struct tm *t;
    char *p;
    unsigned int a;

    if (!s) {
        t = gmtime(&current_time);
    } else
        t = gmtime(&s);

    p = buf + 28;
    /* p points to the last char in the buf */

    p -= 3;
    /* p points to where the ' ' will go */
    memcpy(p--, " GMT", 4);

    a = t->tm_sec;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ':';
    a = t->tm_min;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ':';
    a = t->tm_hour;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ' ';
    a = 1900 + t->tm_year;
    while (a) {
        *p-- = '0' + a % 10;
        a /= 10;
    }
    /* p points to an unused spot to where the space will go */
    p -= 3;
    /* p points to where the first char of the month will go */
    memcpy(p--, month_tab + 4 * (t->tm_mon), 4);
    *p-- = ' ';
    a = t->tm_mday;
    *p-- = '0' + a % 10;
    *p-- = '0' + a / 10;
    *p-- = ' ';
    p -= 3;
    memcpy(p, day_tab + t->tm_wday * 4, 4);
}

char *simple_itoa(unsigned int i)
{
    /* 21 digits plus null terminator, good for 64-bit or smaller ints
     * for bigger ints, use a bigger buffer!
     *
     * 4294967295 is, incidentally, MAX_UINT (on 32bit systems at this time)
     * and is 10 bytes long
     */
    static char local[22];
    char *p = &local[21];
    *p-- = '\0';
    do {
        *p-- = '0' + i % 10;
        i /= 10;
    } while (i > 0);
    return p + 1;
}

/* I don't "do" negative conversions
 * Therefore, -1 indicates error
 */

int boa_atoi(char *s)
{
    int retval;
    char *reconv;

    if (!isdigit(*s))
        return -1;

    retval = atoi(s);
    if (retval < 0)
        return -1;

    reconv = simple_itoa(retval);
    if (memcmp(s,reconv,strlen(s)) != 0) {
        return -1;
    }
    return retval;
}

int create_temporary_file(short want_unlink, char *storage, int size)
{
    static char boa_tempfile[MAX_PATH_LENGTH + 1];
    int fd;

    snprintf(boa_tempfile, MAX_PATH_LENGTH,
             "%s/boa-temp.XXXXXX", tempdir);

    /* open temp file */
    fd = mkstemp(boa_tempfile);
    if (fd == -1) {
        log_error_time();
        perror("mkstemp");
        return 0;
    }

    if (storage != NULL) {
        int len = strlen(boa_tempfile);

        if (len < size) {
            memcpy(storage, boa_tempfile, len + 1);
        } else {
            close(fd);
            fd = 0;
            log_error_time();
#ifndef SIZE_OPTI_L3
            fprintf(stderr, "not enough memory for memcpy in storage\n");
#endif
            want_unlink = 1;
        }
    }

    if (want_unlink) {
        if (unlink(boa_tempfile) == -1) {
            close(fd);
            fd = 0;
            log_error_time();
#ifndef SIZE_OPTI_L3
            fprintf(stderr, "unlink temp file\n");
#endif
        }
    }

    return (fd);
}

/*
 * Name: normalize_path
 *
 * Description: Makes sure relative paths are made absolute
 *
 */

#define DIRBUF_SIZE MAX_PATH_LENGTH * 2 + 1
char * normalize_path(char *path)
{
    char dirbuf[DIRBUF_SIZE];
    int len1, len2;
    char *endpath;

    if (path[0] == '/') {
        endpath = strdup(path);
    } else {

#ifndef HAVE_GETCWD
        perror("boa: getcwd() not defined. Aborting.");
        exit(1);
#endif
        if (getcwd(dirbuf, DIRBUF_SIZE) == NULL) {
#ifndef SIZE_OPTI_L3
            if (errno == ERANGE)
                perror
                    ("boa: getcwd() failed - unable to get working directory. "
                     "Aborting.");
            else if (errno == EACCES)
                perror("boa: getcwd() failed - No read access in current "
                       "directory. Aborting.");
            else
                perror("boa: getcwd() failed - unknown error. Aborting.");
#endif
            exit(1);
        }

        /* OK, now the hard part. */
        len1 = strlen(dirbuf);
        len2 = strlen(path);
        if (len1 + len2 > MAX_PATH_LENGTH * 2) {
#ifndef SIZE_OPTI_L3
            perror("boa: eek. unable to normalize pathname");
#endif
            exit(1);
        }
        if (strcmp(path,".") != 0) {
            memcpy(dirbuf + len1, "/", 1);
            memcpy(dirbuf + len1 + 1, path, len2 + 1);
        }
        /* fprintf(stderr, "boa: normalize gets \"%s\"\n", dirbuf); */

        endpath = strdup(dirbuf);
    }

    if (endpath == NULL) {
#ifndef SIZE_OPTI_L3
        fprintf(stderr,
                "boa: Cannot strdup path. Aborting.\n");
#endif
        exit(1);
    }
    return endpath;
}

int real_set_block_fd(int fd)
{
    int flags;

    flags = fcntl(fd, F_GETFL);
    if (flags == -1)
        return -1;

    flags &= ~O_NONBLOCK;
    flags = fcntl(fd, F_SETFL, flags);
    return flags;
}

int real_set_nonblock_fd(int fd)
{
    int flags;

    flags = fcntl(fd, F_GETFL);
    if (flags == -1)
        return -1;

    flags |= O_NONBLOCK;
    flags = fcntl(fd, F_SETFL, flags);
    return flags;
}

#ifdef USE_AUTH
static const unsigned char pr2six[256] =
{
    /* ASCII table */
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 62, 64, 64, 64, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 64, 64, 64, 64, 64, 64,
    64,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 64, 64, 64, 64, 64,
    64, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64
};

int base64decode2(void *bufplain,char *bufcoded,int length)
{
    int nbytesdecoded;
    register const unsigned char *bufin;
    register unsigned char *bufout;
    register int nprbytes;
    register unsigned int cnt;

    cnt = 0;
    bufin = (const unsigned char *) bufcoded;
    while (pr2six[*(bufin++)] <= 63);
    nprbytes = (bufin - (const unsigned char *) bufcoded) - 1;
    nbytesdecoded = ((nprbytes + 3) / 4) * 3;

    bufout = (unsigned char *) bufplain;
    bufin = (const unsigned char *) bufcoded;

    while (cnt + 3 < length && nprbytes > 4) {
    *(bufout++) =
        (unsigned char) (pr2six[*bufin] << 2 | pr2six[bufin[1]] >> 4);
    *(bufout++) =
        (unsigned char) (pr2six[bufin[1]] << 4 | pr2six[bufin[2]] >> 2);
    *(bufout++) =
        (unsigned char) (pr2six[bufin[2]] << 6 | pr2six[bufin[3]]);
    bufin += 4;
    nprbytes -= 4;
    cnt += 3;
    }

    if(cnt + 3 >= length && nprbytes > length - cnt)
        nprbytes = length - cnt;
    /* Note: (nprbytes == 1) would be an error, so just ingore that case */
    if (nprbytes > 1) {
    *(bufout++) =
        (unsigned char) (pr2six[*bufin] << 2 | pr2six[bufin[1]] >> 4);
    }
    if (nprbytes > 2) {
    *(bufout++) =
        (unsigned char) (pr2six[bufin[1]] << 4 | pr2six[bufin[2]] >> 2);
    }
    if (nprbytes > 3) {
    *(bufout++) =
        (unsigned char) (pr2six[bufin[2]] << 6 | pr2six[bufin[3]]);
    }

    *(bufout++) = '\0';
    nbytesdecoded -= (4 - nprbytes) & 3;
    return nbytesdecoded;
}

#if	0
/*
 *  * Name: base64decode
 *   *
 *    * Description: Decodes BASE-64 encoded string
 *     */
int base64decode2(void *dst,char *src,int maxlen)
{
 int bitval,bits;
 int val;
 int len,x,y;

 len = strlen(src);
 bitval=0;
 bits=0;
 y=0;

 for(x=0;x<len;x++)
  {
   if ((src[x]>='A')&&(src[x]<='Z')) val=src[x]-'A'; else
   if ((src[x]>='a')&&(src[x]<='z')) val=src[x]-'a'+26; else
   if ((src[x]>='0')&&(src[x]<='9')) val=src[x]-'0'+52; else
   if (src[x]=='+') val=62; else
   if (src[x]=='-') val=63; else
    val=-1;
   if (val>=0)
    {
     bitval=bitval<<6;
     bitval+=val;
     bits+=6;
     while (bits>=8)
      {
       if (y<maxlen)
        ((char *)dst)[y++]=(bitval>>(bits-8))&0xFF;
       bits-=8;
       bitval &= (1<<bits)-1;
      }
    }
  }
 if (y<maxlen)
   ((char *)dst)[y++]=0;
 return y;
}
#endif

static char base64chars[64] = "abcdefghijklmnopqrstuvwxyz"
                              "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./";

/*
 *  * Name: base64encode()
 *   *
 *    * Description: Encodes a buffer using BASE64.
 *     */
void base64encode2(unsigned char *from, char *to, int len)
{
  while (len) {
    unsigned long k;
    int c;

    c = (len < 3) ? len : 3;
    k = 0;
    len -= c;
    while (c--)
      k = (k << 8) | *from++;
    *to++ = base64chars[ (k >> 18) & 0x3f ];
    *to++ = base64chars[ (k >> 12) & 0x3f ];
    *to++ = base64chars[ (k >> 6) & 0x3f ];
    *to++ = base64chars[ k & 0x3f ];
  }
  *to++ = 0;
}

#ifndef USE_NEW_LIB
#define  PASSWD_FILE "/etc/httpd.passwd"
int exist_passwd(void)
{
	FILE *fp;
	char tmp[200],*tmp1,*tmp2;
	char login[128],passwd[128];
	
	if( (fp=fopen( PASSWD_FILE,"r")) == NULL )  
		return 0;
	memset(login,0x0,128);
	memset(passwd,0x0,128);
	fgets(tmp, 200, fp );
	fclose(fp);

	tmp1 = strchr(tmp, ':');
	if(!tmp1) return 0;
	*tmp1 = 0x0;
	strcpy(login, tmp );
	tmp1++;
	tmp2 = strchr(tmp1, ':');
	if(!tmp2) return 0;
	*tmp2 = 0x0;
	strcpy(passwd, tmp1 );
	if((!strcmp(login,"") || !strcmp(login,"root") || !strcmp(login,"admin"))
			&& !strcmp(passwd,""))
		return 0;
#if 0
	if((tmp2 - tmp1 ) == 0 )
		return 0;
#endif

	return 1;
}
#endif

#endif




