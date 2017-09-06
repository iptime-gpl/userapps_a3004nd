/*
 * ProFTPD: mod_df -- ?ǥ????????????????Υ⥸?塼??
 *
 * Copyright (c) 2002 by TSUJIKAWA Tohru <tsujikawa@tsg.ne.jp>
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

 /*
   **** for Linux only ****

   CWD/CDUP ???ޥ??ɤΥꥶ???Ȥ??����ǥ??쥯?ȥ??ǤΥǥ????????????̤????Τ????⥸?塼???Ǥ???

   statfs() ?λ??;塤64bit ?Ѥ˥????ѥ??뤷?ʤ??????? 2TB ?ʾ??Υǥ??????λ???
   ��?????ͤ??֤??ʤ????Ȥ????Ԥ????ޤ???

 */


#include	"conf.h"
#include	<sys/vfs.h>


//
// ??????
//
static int df_init(void)
{
	return 0;
}

static int df_sess_init(void)
{
	return 0;
}


//
// module handler
//
MODRET df_post_cwd(cmd_rec* cmd)
{
	char	buf[PATH_MAX+1];
	struct statfs	sfs;

	if (getcwd(buf, sizeof(buf)) && statfs(buf, &sfs) == 0) {
		long long	f = (long long)sfs.f_bavail * (long long)sfs.f_bsize;
		if (f >= ((long long)1 << 10)*1000000000L) {
			sprintf(buf, "Disk free space at this directory is %lld,%03lld,%03lld MB.",
					(f >> 20)/1000000, (f >> 20)/1000%1000, (f >> 20)%1000);
		} else if (f >= ((long long)1 << 10)*1000000) {
			sprintf(buf, "Disk free space at this directory is %lld,%03lld,%03lld KB.",
					(f >> 10)/1000000, (f >> 10)/1000%1000, (f >> 10)%1000);
		} else if (f >= ((long long)1 << 10)*1000) {
			sprintf(buf, "DISK FREE SPACE AT THIS DIRECTORY IS ONLY %lld,%03lld KB.", (f >> 10)/1000, (f >> 10)%1000);
		} else if (f >= 1000) {
			sprintf(buf, "DISK FREE SPACE AT THIS DIRECTORY IS ONLY %lld,%03lld Bytes.", f/1000, f%1000);
		} else {
			sprintf(buf, "DISK FREE SPACE AT THIS DIRECTORY IS ONLY %lld Bytes.", f);
		}
		pr_response_send_raw("250-%s", buf);
	}
	return HANDLED(cmd);
}

#if defined  EFM_PATCH || defined EFM_ROUTER_PATCH
MODRET df_post_cwd2(cmd_rec* cmd)
{
	return HANDLED(cmd);
}
#endif


//
// module ?? directive
//
static conftable df_conftab[] = {
	{ NULL }						// directive ?ϥ??ݡ??Ȥ??ʤ?
};


//
// trap ???륳?ޥ??ɰ???
//
static cmdtable df_cmdtab[] = {
#if defined  EFM_PATCH || defined EFM_ROUTER_PATCH
	{ POST_CMD,		C_CWD,	G_NONE, df_post_cwd2,	FALSE, FALSE },
#else
	{ POST_CMD,		C_CWD,	G_NONE, df_post_cwd,	FALSE, FALSE },
#endif
	{ POST_CMD,		C_CDUP,	G_NONE, df_post_cwd,	FALSE, FALSE },
	{ 0,			NULL }
};


//
// module ????
//
module df_module = {

	/* Always NULL */
	NULL, NULL,

	/* Module API version (2.0) */
	0x20,

	/* Module name */
	"df",

	/* Module configuration directive handlers */
	df_conftab,

	/* Module command handlers */
	df_cmdtab,

	/* Module authentication handlers (none in this case) */
	NULL,

	/* Module initialization */
	df_init,

	/* Session initialization */
	df_sess_init

};
