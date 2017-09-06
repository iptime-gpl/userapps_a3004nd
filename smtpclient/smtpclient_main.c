/*   ____  __  _ _____ ____     _ _            _   
**  / ___||  \/ |_   _|  _ \___| (_) ___ _ __ | |_ 
**  \___ \| |\/| || | | |_)/ __| | |/ _ \ '_ \| __|
**   ___) | |  | || | |  _| (__| | |  __/ | | | |_ 
**  |____/|_|  |_||_| |_|  \___|_|_|\___|_| |_|\__|
**   
**  SMTPclient -- simple SMTP client
**
**  This program is a minimal SMTP client that takes an email
**  message body and passes it on to a SMTP server (default is the
**  MTA on the local host). Since it is completely self-supporting,
**  it is especially suitable for use in restricted environments.
**
**  ======================================================================
**
**  Copyright (c) 1997 Ralf S. Engelschall, All rights reserved.
**
**  This program is free software; it may be redistributed and/or modified
**  only under the terms of either the Artistic License or the GNU General
**  Public License, which may be found in the SMTP source distribution.
**  Look at the file COPYING. 
**
**  This program is distributed in the hope that it will be useful, but
**  WITHOUT ANY WARRANTY; without even the implied warranty of
**  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
**  GNU General Public License for more details.
**
**  ======================================================================
**
**  smtpclient_main.c -- program source
**
**  Based on smtp.c as of August 11, 1995 from
**      W.Z. Venema,
**      Eindhoven University of Technology,
**      Department of Mathematics and Computer Science,
**      Den Dolech 2, P.O. Box 513, 5600 MB Eindhoven, The Netherlands.
*/

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <errno.h>
#include <signal.h>

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <syslog.h>
#include <stdio.h>
#include <netdb.h>
#include <string.h>
#include <ctype.h>
#include <pwd.h>

#include "smtpclient_getopt.h"
#include "smtpclient_errno.h"
#include "smtpclient_vers.h"

#include <linosconfig.h>

static char *cc_addr    = 0;
static char *err_addr   = 0;
static char *from_addr  = NULL;
static char *mailhost   = NULL;
static int   mailport   = 25;
static char *reply_addr = 0;
static char *subject    = 0;
static int   mime_style = 0;
static int   verbose    = 0;
static int   usesyslog  = 0;

static char *charset    = 0;

static FILE *sfp;
static FILE *rfp;

#define dprintf  if (verbose) printf
#define dvprintf if (verbose) vprintf

/* hack for Ultrix */
#ifndef LOG_DAEMON
#define LOG_DAEMON 0
#endif
#ifdef USE_SYSTEM_LOG
#include <syslog_msg.h>
#endif

char *auth_user, *auth_pass;
/*
**  logging support
*/
void log(char *str1, ...)
{
    va_list ap;
    char buf[1024];

    va_start(ap, str1);
    vsprintf(buf, str1, ap);
    if (usesyslog)
        syslog(LOG_ERR, "SMTPclient: %s", buf);
    else
        fprintf(stderr, "SMTPclient: %s\n", buf);
    va_end(ap);
    return;
}

/*
**  usage page
*/
void usage(void)
{
    fprintf(stderr, "Usage: smtp [options] recipients ...\n");
    fprintf(stderr, "\n");
    fprintf(stderr, "Message Header Options:\n");
    fprintf(stderr, "  -s STR      subject line of message\n");
    fprintf(stderr, "  -f ADDR        address of the sender\n");
    fprintf(stderr, "  -r ADDR    address of the sender for replies\n");
    fprintf(stderr, "  -e ADDR   address to send delivery errors to\n");
    fprintf(stderr, "  -c ADDR address to send copy of message to\n");
    fprintf(stderr, "\n");
    fprintf(stderr, "Processing Options:\n");
    fprintf(stderr, "  -S HOST   host where MTA can be contacted via SMTP\n");
    fprintf(stderr, "  -P NUM    port where MTA can be contacted via SMTP\n");
    fprintf(stderr, "  -M use MIME-style translation to quoted-printable\n");
    fprintf(stderr, "  -L --use-syslog       log errors to syslog facility instead of stderr\n");
    fprintf(stderr, "\n");
    fprintf(stderr, "Giving Feedback:\n");
    fprintf(stderr, "  -v --verbose          enable verbose logging messages\n");
    fprintf(stderr, "  -h --help             display this page\n");
    fprintf(stderr, "\n");

    return;
}
/*
**  examine message from server 
*/


void get_response(void)
{
    char buf[BUFSIZ];

    while (fgets(buf, sizeof(buf), rfp)) {
        buf[strlen(buf)-1] = 0;
        dprintf("%s --> %s\n", mailhost, buf);


        if (!isdigit(buf[0]) || buf[0] > '3') {
            log("unexpected reply: %s", buf);
#ifdef USE_SYSTEM_LOG
            syslog_msg( SYSMSG_LOG_DEBUG, "%s: %s", SMTP_MESSAGE_STRING, buf ); 
#endif
            exit(1);
        }

        if (buf[3] != '-')
            break;
    }
    return;
}

/*
**  say something to server and check the response
*/
void chat(char *fmt, ...)
{
    va_list ap;

    va_start(ap, fmt);
    vfprintf(sfp, fmt, ap);
    va_end(ap);
  
    va_start(ap, fmt);
    dprintf("%s <-- ", mailhost);
    dvprintf(fmt, ap);
    va_end(ap);

    fflush(sfp);
    get_response();
}



char auth_method[128];

void auth_get_response(char *response)
{
    char buf[BUFSIZ];

    strcpy(response,"");
    while (fgets(buf, sizeof(buf), rfp)) {
        buf[strlen(buf)-1] = 0;
        dprintf("%s --> %s\n", mailhost, buf );
        if (!isdigit(buf[0]) || buf[0] > '3') {
            log("unexpected reply: %s", buf);
#ifdef USE_SYSTEM_LOG
	/* Remvoe by Security in syslog */
	    if(!strncmp( "500 5.7.0", buf, strlen("500 5.7.0")))
            	syslog_msg( SYSMSG_LOG_ERROR, SYSLOG_MSG_EMAIL_AUTH_FAILED);
#endif


            exit(1);
        }
	if(!strncmp( buf, "334", 3 ))
		//base64_decode( response, &buf[4], strlen(buf) - 5 ); 
		Base64decode( response, &buf[4] );

	if(!strncmp( buf, "250", 3 ))
	{
		char *start, *s1, *s2;

		start = &buf[4];

		s1 = strtok( start, " =");
		if(!strcmp(s1, "AUTH"))
		{
			s2 = strtok( NULL, " \r\n");
			strcpy( auth_method, s2 );
		}
	}

        if (buf[3] != '-')
            break;
    }
    return;
}



/*
** Translation Table as described in RFC1113
*/
static const char cb64[]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/*
** Translation Table to decode (created by author)
*/
static const char cd64[]="|$$$}rstuvwxyz{$$$$$$$>?@ABCDEFGHIJKLMNOPQRSTUVW$$$$$$XYZ[\\]^_`abcdefghijklmnopq";

/*
** encodeblock
**
** encode 3 8-bit binary bytes as 4 '6-bit' characters
*/
void encodeblock( unsigned char in[3], unsigned char out[4], int len )
{
    out[0] = cb64[ in[0] >> 2 ];
    out[1] = cb64[ ((in[0] & 0x03) << 4) | ((in[1] & 0xf0) >> 4) ];
    out[2] = (unsigned char) (len > 1 ? cb64[ ((in[1] & 0x0f) << 2) | ((in[2] & 0xc0) >> 6) ] : '=');
    out[3] = (unsigned char) (len > 2 ? cb64[ in[2] & 0x3f ] : '=');
}

/*
** encode
**
** base64 encode a stream adding padding and line breaks as per spec.
*/
void b64_encode( char *indata, char *outdata)
{
    unsigned char in[3], out[4];
    int i, len, iidx, oidx, last = 0;

    iidx=0; oidx=0;
    while(indata[iidx] != 0) {

        len = 0;
        for( i = 0; i < 3; i++, iidx++ ) {
            in[i] = (unsigned char) indata[iidx];
            if( indata[iidx] != 0 ) {
                len++;
            }
            else {
                in[i] = 0;
		last=1;
            }
        }
        if( len ) {
            encodeblock( in, out, len );
            for( i = 0; i < 4; i++, oidx++ )
		    outdata[oidx] = out[i];
        }
	if(last) break;
    }
}


/*
**  say something to server and check the response
*/
void auth_chat(void)
{
    char auth_response[512];
    char send_data[512];

    fprintf(sfp,"EHLO router\r\n" );
    fflush(sfp);
    auth_get_response(auth_response);

    dprintf("Received Auth method = %s\n", auth_method );

    if(!strcmp(auth_method,""))
    {
	    /* if there is no AUTH METHOD .. no auth */
	    return;
    }

/* 
*  for plain auth test
    strcpy(auth_method, "PLAIN");
*/

    fprintf(sfp, "AUTH %s\r\n", auth_method);

    dprintf("%s <-- AUTH %s\n", mailhost, auth_method );

    fflush(sfp);

    auth_get_response(auth_response);

    dprintf("\t\tAUTH RESPONSE = %s\n", auth_response );
    	
    if(!strcmp(auth_method,"PLAIN")) 
    {
	    char auth_data[256];
	    int len, len2;
	    char *ptr;

	    ptr = auth_data;

	    memset(ptr,256, 0x0);

	    len = strlen(auth_user);
	    strcpy(ptr, auth_user);
	    ptr += len;
	    ptr++;
	    strcpy(ptr, auth_user);
	    ptr += len;
	    ptr++;
	    strcpy(ptr, auth_pass);
	    len2 = strlen(auth_pass);
	    ptr += len2;

	    /* base64_encode api has critical bug so replace to b64_encode */
    //	    base64_encode(auth_data, send_data, ptr - auth_data + 2);
	    memset(send_data,0x0,512 );
    	    b64_encode(auth_data, send_data);
    }
    else
    {
	    /* base64_encode api has critical bug so replace to b64_encode */
	    //	base64_encode(auth_user, send_data, strlen(auth_user) + 2);
	    memset(send_data,0x0,512 );
	    b64_encode(auth_user, send_data);
    }

    dprintf("%s <-- %s\n", mailhost, send_data);
    fprintf(sfp, "%s\r\n", send_data );
    fflush(sfp);

    /* Username Request :base 64 */ 
    auth_get_response(auth_response);
    dprintf("\t\tAUTH RESPONSE = %s\n", auth_response );

    if(!strcmp(auth_method, "LOGIN"))
    {

	    /* base64_encode api has critical bug so replace to b64_encode */
	    // base64_encode(auth_pass, send_data, strlen(auth_pass));
	    memset(send_data,0x0,512 );
	    b64_encode(auth_pass, send_data);
 
        dprintf("%s <-- %s\n", mailhost, send_data);
        fprintf(sfp, "%s\r\n", send_data );

        fflush(sfp);
 
        auth_get_response(auth_response);
        dprintf("\t\tAUTH RESPONSE = %s\n", auth_response );
    }
}



/*
**  transform to MIME-style quoted printable
**
**  Extracted from the METAMAIL version 2.7 source code (codes.c)
**  and modified to emit \r\n at line boundaries.
*/

static char basis_hex[] = "0123456789ABCDEF";

void toqp(FILE *infile, FILE *outfile)
{
    int c;
    int ct = 0;
    int prevc = 255;

    while ((c = getc(infile)) != EOF) {
        if (   (c < 32 && (c != '\n' && c != '\t'))
            || (c == '=')
            || (c >= 127)
            || (ct == 0 && c == '.')               ) {
        putc('=', outfile);
        putc(basis_hex[c >> 4], outfile);
        putc(basis_hex[c & 0xF], outfile);
        ct += 3;
        prevc = 'A'; /* close enough */
    }
    else if (c == '\n') {
        if (prevc == ' ' || prevc == '\t') {
	    putc('=', outfile);  /* soft & hard lines */
	    putc(c, outfile);
        }
        putc(c, outfile);
        ct = 0;
        prevc = c;
    } 
    else {
        if (c == 'F' && prevc == '\n') {
        /*
         * HORRIBLE but clever hack suggested by MTR for
         * sendmail-avoidance
         */
        c = getc(infile);
        if (c == 'r') {
            c = getc(infile);
            if (c == 'o') {
            c = getc(infile);
            if (c == 'm') {
                c = getc(infile);
                if (c == ' ') {
                /* This is the case we are looking for */
                fputs("=46rom", outfile);
                ct += 6;
                } else {
                fputs("From", outfile);
                ct += 4;
                }
            } else {
                fputs("Fro", outfile);
                ct += 3;
            }
            } 
            else {
            fputs("Fr", outfile);
            ct += 2;
            }
        }
        else {
            putc('F', outfile);
            ++ct;
        }
        ungetc(c, infile);
        prevc = 'x'; /* close enough -- printable */
        } 
        else { 
        putc(c, outfile);
        ++ct;
        prevc = c;
        }
    }
    if (ct > 72) {
        putc('=', outfile);
        putc('\r', outfile); 
        putc('\n', outfile);
        ct = 0;
        prevc = '\n';
    }
    }
    if (ct) {
    putc('=', outfile);
    putc('\r', outfile); 
    putc('\n', outfile);
    }
    return;
}


/*
**  main procedure
*/
void *
signal_set (int signo, void (*func)(int))
{
  int ret;
  struct sigaction sig;
  struct sigaction osig;

  sig.sa_handler = func;
  sigemptyset (&sig.sa_mask);
  sig.sa_flags = 0; 
#ifdef SA_RESTART
  sig.sa_flags |= SA_RESTART;
#endif /* SA_RESTART */ 

  ret = sigaction (signo, &sig, &osig); 

  if (ret < 0)
    return (SIG_ERR);
  else
    return (osig.sa_handler);
}

static void sigalrm(int sig)
{
	dprintf("Abnormal alarm termination.");
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_ERROR, SYSLOG_EMAIL_SEND_TIMEOUT);
#endif
	exit(0);
}

int main(int argc, char **argv)
{
    char buf[BUFSIZ];
    char my_name[BUFSIZ];
    struct sockaddr_in s_in;
    struct hostent *hp;
    int c;
    int s;
    int r;
    int i;
    char *cp;
    char *report_type = NULL;
    int use_auth = 0;	

    /* 
     *  Go away when something gets stuck.
     */

    signal_set (SIGALRM, sigalrm);
    alarm(60);


    /*
     *  Parse options
     */
    while ((c = getopt(argc, argv, ":s:b:f:r:e:c:S:P:t:u:p:aMLvh")) != EOF) {
        switch (c) {
            case 'b':
                charset = optarg;
                break;
            case 's':
                subject = optarg;
                break;
            case 'f':
                from_addr = optarg;
                break;
            case 'r':
                reply_addr = optarg;
                break;
            case 'e':
                err_addr = optarg;
                break;
            case 'c':
                cc_addr = optarg;
                break;
            case 'S':
                mailhost = optarg;
                break;
	    case 't':
                report_type = optarg;
                break;
	    case 'u':
                auth_user = optarg;
                break;
	    case 'p':
                auth_pass = optarg;
                break;
            case 'a':
		use_auth = 1;
                break;
            case 'P':
                mailport = atoi(optarg);
                break;
            case 'M':
                mime_style = 1;
                break;
            case 'L':
                usesyslog = 1;
                break;
            case 'v':
                verbose = 1;
                break;
            case 'h':
                usage();
                exit(0);
            default:
                fprintf(stderr, "SMTP: invalid option `%c'\n", optopt);
                fprintf(stderr, "Try `%s --help' for more information.\n", argv[0]);
                exit(1);
        }
    }
    if (argc == optind) {
        fprintf(stderr, "SMTP: wrong number of arguments\n");
        fprintf(stderr, "Try `%s --help' for more information.\n", argv[0]);
        exit(1);
    }

    /*  
     *  Open Syslog facility
     */
    if (usesyslog)
        openlog(argv[0], LOG_PID, LOG_DAEMON);

    /*
     *  Determine SMTP server
     */
    if (mailhost == NULL) {
        if ((cp = getenv("SMTPSERVER")) != NULL)
            mailhost = cp;
        else
            mailhost = "localhost";
    }

    /*
     *  Find out my own host name for HELO; 
     *  if possible, get the FQDN.
     */

    if(from_addr == NULL )
    {
#ifdef USE_SYSTEM_LOG
	    syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: From address should be defined" ); 
#endif
    	    email_clear_report( 0, report_type );
	    exit(1);
    }

    /*
     *  Connect to smtp daemon on mailhost.
     */
    if ((hp = gethostbyname(mailhost)) == NULL) {

#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_ERROR, "%s: %s", SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER, mailhost ); 
#else
        log("%s: unknown host\n", mailhost);
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    if (hp->h_addrtype != AF_INET) {

#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: Unkown address family");
#else
        log("unknown address family: %d", hp->h_addrtype);
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    memset((char *)&s_in, 0, sizeof(s_in));
    memcpy((char *)&s_in.sin_addr, hp->h_addr, hp->h_length);
    s_in.sin_family = hp->h_addrtype;
    s_in.sin_port = htons(mailport);
    if ((s = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: Socket open error");
#else
        log("socket: %s", errorstr(errno));
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    if (connect(s, (struct sockaddr *)&s_in, sizeof(s_in)) < 0) {
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_ERROR, "%s: %s", SYSLOG_MSG_MAIL_CONNECT_ERROR, mailhost );
#else
        log("connect: %s", errorstr(errno));
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    if ((r = dup(s)) < 0) {
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: Dup Error");
#else
        log("dup: %s", errorstr(errno));
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    if ((sfp = fdopen(s, "w")) == 0) {
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: fdopen : sfp" );
#else
        log("fdopen: %s", errorstr(errno));
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }
    if ((rfp = fdopen(r, "r")) == 0) {
#ifdef USE_SYSTEM_LOG
	syslog_msg( SYSMSG_LOG_DEBUG, "SMTP Client: fdopen : rfp" );
#else
        log("fdopen: %s", errorstr(errno));
#endif
    	email_clear_report( 0, report_type );
        exit(1);
    }

    /* 
     *  Give out SMTP headers.
     */
    strcpy(my_name,"router");

    get_response(); /* banner */

    if(use_auth)
    {
    	auth_chat();
    }
    else
    	chat("HELO %s\r\n", my_name);

    chat("MAIL FROM: <%s>\r\n", from_addr);

    for (i = optind; i < argc; i++)
        chat("RCPT TO: <%s>\r\n", argv[i]);
    if (cc_addr)
        chat("RCPT TO: <%s>\r\n", cc_addr);
    chat("DATA\r\n");

    /* 
     *  Give out Message header. 
     */
    fprintf(sfp, "From: %s\r\n", from_addr);
    if (subject)
        fprintf(sfp, "Subject: %s\r\n", subject);

    if (reply_addr)
        fprintf(sfp, "Reply-To: %s\r\n", reply_addr);
    if (err_addr)
        fprintf(sfp, "Errors-To: %s\r\n", err_addr);
#if 0
    if ((pwd = getpwuid(getuid())) == 0) {
        fprintf(sfp, "Sender: userid-%d@%s\r\n", getuid(), my_name);
    } else {
        fprintf(sfp, "Sender: %s@%s\r\n", pwd->pw_name, my_name);
    }
#endif

    fprintf(sfp, "To: %s", argv[optind]);
    for (i = optind + 1; i < argc; i++)
        fprintf(sfp, ",%s", argv[i]);
    fprintf(sfp, "\r\n");
    if (cc_addr)
        fprintf(sfp, "Cc: %s\r\n", cc_addr);


    if (mime_style) 
    {
        fprintf(sfp, "MIME-Version: 1.0\r\n");
        fprintf(sfp, "Content-Type: text/html; charset=\"ks_c_5601-1987\"\r\n");
#if 0
        fprintf(sfp, "Content-Transfer-Encoding: quoted-printable\r\n");
#endif
        fprintf(sfp, "Content-Transfer-Encoding: base64\r\n");
    }
    else
    {
        fprintf(sfp, "MIME-Version: 1.0\r\n");
	if(charset)
		fprintf(sfp, "Content-Type: text/html; charset=%s\r\n",charset);
	else
		fprintf(sfp, "Content-Type: text/html; charset=euc_kr\r\n");
        fprintf(sfp, "Content-Transfer-Encoding: 8bit\r\n");
    }

    fprintf(sfp, "\r\n");

    /* 
     *  Give out Message body.
     */
    if (mime_style) {
        toqp(stdin, sfp);
    } 
    else 
    {
	    int len;

	    while (fgets(buf,sizeof(buf),stdin)) 
	    {
		    len = strlen(buf);

		    if(buf[0] == '.' ) fprintf(sfp, "." );

		    /* patch for SMTP Message: 451 See http://pobox.com/~djb/docs/smtplf.html. : scchoi */
		    /* all line should be ended by "\r\n" */ 
		    if((buf[len-1] == '\n') && (buf[len-2] != '\r'))
		    {
			    buf[len-1] = '\r';
			    buf[len] = '\n';
			    buf[len+1] = 0;
			    len++;
		    }

		    if(buf[len-1] != '\n')
		    	fprintf(sfp, "%s\r\n",buf);
		    else
		    	fprintf(sfp, "%s",buf);
	    }
    }

    /* 
     *  Give out SMTP end.
     */
    chat(".\r\n");
    chat("QUIT\r\n");

   email_clear_report( 1, report_type );
#ifdef USE_SYSTEM_LOG
    if(!strcmp( report_type, "syslog"))
    	syslog_msg( SYSMSG_LOG_INFO,SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS );
    else if(!strncmp( report_type, "nd", 2))
    	syslog_msg( SYSMSG_LOG_INFO,SYSLOG_MSG_EMAIL_ND_SUCCESS );
#endif

    /* 
     *  Die gracefully ...
     */
    exit(0);
}

/*EOF*/
