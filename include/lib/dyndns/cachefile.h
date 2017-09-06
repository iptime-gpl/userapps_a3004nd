/* dyndnsupdate --- cachefile.h --- Mar 27 2002
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

#define MAXLENG 80
void save_ipcache(char *ipaddr);
int check_ipcache(char *newip);
int read_dyndns_config(int *flag, char *user, char *passwd);
int write_dyndns_config(int flag, char *user, char *passwd);
int check_dyndns_status(char *hostname);
void save_dyndns_status(char *hostname, int status);
int read_dyndns_hostname(char *hostlist[]);
int add_dyndns_hostname(char *hostname);
int del_dyndns_hostname(int hostid);
