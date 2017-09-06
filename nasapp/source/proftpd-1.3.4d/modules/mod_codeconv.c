/*
 * ProFTPD: mod_codeconv -- local <-> remote charset conversion
 *
 * Copyright (c) 2004 by TSUJIKAWA Tohru <tsujikawa@tsg.ne.jp> / All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
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
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307, USA.
 *
 */


#include	"conf.h"
#include	<iconv.h>


//
// directive
//
#define	DIRECTIVE_CHARSETLOCAL		"CharsetLocal"
#define	DIRECTIVE_CHARSETREMOTE		"CharsetRemote"


//
// initialization
//
static int codeconv_init(void)
{
	return 0;
}

static int codeconv_sess_init(void)
{
	return 0;
}


char* remote2local(struct pool* pool, char* remote)
{
	iconv_t	ic;
	char*	local;
	char*	in_ptr;
	char*	out_ptr;
	size_t	inbytesleft, outbytesleft;

	config_rec*	conf_l = NULL;
	config_rec*	conf_r = NULL;

	conf_l = find_config(main_server->conf, CONF_PARAM, DIRECTIVE_CHARSETLOCAL, FALSE);
	conf_r = find_config(main_server->conf, CONF_PARAM, DIRECTIVE_CHARSETREMOTE, FALSE);
	if (!conf_l || !conf_r) return NULL;

	ic = iconv_open(conf_l->argv[0], conf_r->argv[0]);
	if (ic == (iconv_t)(-1)) return NULL;

	iconv(ic, NULL, NULL, NULL, NULL);

	inbytesleft = strlen(remote);
	outbytesleft = inbytesleft*3;
	local = palloc(pool, outbytesleft+1);

	in_ptr = remote; out_ptr = local;
	while (inbytesleft) {
		if (iconv(ic, &in_ptr, &inbytesleft, &out_ptr, &outbytesleft) == -1) {
			*out_ptr = '?'; out_ptr++; outbytesleft--;
			in_ptr++; inbytesleft--;
			break;
		}
	}
	*out_ptr = 0;

	iconv_close(ic);

	return local;
}


char* local2remote(char* local)
{
	iconv_t	ic;
	char*	remote;
	char*	in_ptr;
	char*	out_ptr;
	size_t	inbytesleft, outbytesleft;

	config_rec*	conf_l = NULL;
	config_rec*	conf_r = NULL;

	conf_l = find_config(main_server->conf, CONF_PARAM, DIRECTIVE_CHARSETLOCAL, FALSE);
	conf_r = find_config(main_server->conf, CONF_PARAM, DIRECTIVE_CHARSETREMOTE, FALSE);
	
	//debug_Aaron
	 pr_log_debug(DEBUG3, "%s: conf_l=%d, conf_r=%d\r\n", __func__, conf_l, conf_r);

	if (!conf_l || !conf_r) return NULL;

	ic = iconv_open(conf_r->argv[0], conf_l->argv[0]);

	  //debug_Aaron
        pr_log_debug(DEBUG3, "%s: conf_r->argv[0]=%s, conf_l->argv[0]=%s, ic=0x%x\r\n", __func__, (char *)conf_r->argv[0], (char *)conf_l->argv[0], ic);


	if (ic == (iconv_t)(-1)) return NULL;

	iconv(ic, NULL, NULL, NULL, NULL);

	inbytesleft = strlen(local);
	outbytesleft = inbytesleft*3;
	remote = malloc(outbytesleft+1);

	in_ptr = local; out_ptr = remote;
	while (inbytesleft) {
		if (iconv(ic, &in_ptr, &inbytesleft, &out_ptr, &outbytesleft) == -1) {
			*out_ptr = '?'; out_ptr++; outbytesleft--;
			in_ptr++; inbytesleft--;
			break;
		}
	}
	*out_ptr = 0;

	iconv_close(ic);

	return remote;
}


//
// module handler
//
MODRET codeconv_pre_any(cmd_rec* cmd)
{
	char*	p;
	int		i;

	p = remote2local(cmd->pool, cmd->arg);
	if (p) cmd->arg = p;

	for (i = 0; i < cmd->argc; i++) {
		p = remote2local(cmd->pool, cmd->argv[i]);
		if (p) cmd->argv[i] = p;
	}

	return DECLINED(cmd);
}


//
// local charset directive "CharsetLocal"
//
MODRET set_charsetlocal(cmd_rec *cmd) {
  config_rec *c = NULL;

  /* Syntax: CharsetLocal iconv-charset-name */

  CHECK_ARGS(cmd, 1);
  CHECK_CONF(cmd, CONF_ROOT|CONF_VIRTUAL|CONF_GLOBAL);

  c = add_config_param_str(DIRECTIVE_CHARSETLOCAL, 1, cmd->argv[1]);

  return HANDLED(cmd);
}

//
// remote charset directive "CharsetRemote"
//
MODRET set_charsetremote(cmd_rec *cmd) {
  config_rec *c = NULL;

  /* Syntax: CharsetRemote iconv-charset-name */

  CHECK_ARGS(cmd, 1);
  CHECK_CONF(cmd, CONF_ROOT|CONF_VIRTUAL|CONF_GLOBAL);

  c = add_config_param_str(DIRECTIVE_CHARSETREMOTE, 1, cmd->argv[1]);

  return HANDLED(cmd);
}


//
// module 用 directive
//
static conftable codeconv_conftab[] = {
	{ DIRECTIVE_CHARSETLOCAL,		set_charsetlocal,		NULL },
	{ DIRECTIVE_CHARSETREMOTE,		set_charsetremote,		NULL },
	{ NULL, NULL, NULL }
};


//
// trap するコマンド一覧
//
static cmdtable codeconv_cmdtab[] = {
	{ PRE_CMD,		C_ANY,	G_NONE, codeconv_pre_any,	FALSE, FALSE },
	{ 0,			NULL }
};


//
// module 情報
//
module codeconv_module = {

	/* Always NULL */
	NULL, NULL,

	/* Module API version (2.0) */
	0x20,

	/* Module name */
	"codeconv",

	/* Module configuration directive handlers */
	codeconv_conftab,

	/* Module command handlers */
	codeconv_cmdtab,

	/* Module authentication handlers (none in this case) */
	NULL,

	/* Module initialization */
	codeconv_init,

	/* Session initialization */
	codeconv_sess_init

};
