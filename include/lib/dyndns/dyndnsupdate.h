#ifndef _DYNDNS_H_
#define _DYNDNS_H_
/* dyndnsupdate --- dyndnsupdate.h --- Mar 27 2002
 * Copyright (c) 2002 Fredrik "xzabite" Haglund (xzabite@xzabite.org)
 * http://xzabite.org
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

#define VERSION "0.6.14"
#define PORT 80
#define MAXDATASIZE 4091
#define MAXLEN 256
#define SYSLOG_FACILITY LOG_DAEMON

#define DYNDNSSERVER "members.dyndns.org"
#define CHECKIPSERVER "checkip.dyndns.org"
#define IPTIMEDNSSERVER "members.iptime.org"

int sockfd,i;
int log = 0, quiet = 0, debug = 0, force = 0;
struct hostent *he;
struct sockaddr_in address;
static char *exec_name;

int init_socket(char server[MAXLEN]);
int connect_socket();
void close_socket();

void send_func(const char *send_msg_to_server);
int update_dyndns(char *user, char *ip, char *wildcard, char *mxhost, char *hostname, char *backmx, char *offline, char *systemt);
void show_help();
int check_error(char *http_response);
void ipcheck(char *ipaddress);
int check4options(char *str);
void print_error(char *message, char *option);
int strcomp(char *str1, char *str2);
void print_msg(int level, const char *fmt,...);
void *xmalloc (size_t size);

#endif
