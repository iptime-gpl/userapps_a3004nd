#ifndef QDSP5LPMCMDI_H
#define QDSP5LPMCMDI_H

/*====*====*====*====*====*====*====*====*====*====*====*====*====*====*====*

    L P M   I N T E R N A L   C O M M A N D S

GENERAL DESCRIPTION
  This file contains defintions of format blocks of commands
  that are accepted by LPM Task

REFERENCES
  None

EXTERNALIZED FUNCTIONS
  None

Copyright(c) 1992 - 2008 by QUALCOMM, Incorporated.

This software is licensed under the terms of the GNU General Public
License version 2, as published by the Free Software Foundation, and
may be copied, distributed, and modified under those terms.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

*====*====*====*====*====*====*====*====*====*====*====*====*====*====*====*/
/*===========================================================================

                      EDIT HISTORY FOR FILE

This section contains comments describing changes made to this file.
Notice that changes are listed in reverse chronological order.


$Header: /usr/kcvsrep/MT762X_SDK_4300/RT288x_SDK/source/linux-2.6.36.x/drivers/staging/dream/include/mach/qdsp5/qdsp5lpmcmdi.h,v 1.1.1.1 2015/01/14 09:44:42 mt7620 Exp $ $DateTime: 2014/05/07 23:03:57 $ $Author: mt7620 $
Revision History:

when       who     what, where, why
--------   ---     ----------------------------------------------------------
06/12/08   sv      initial version
===========================================================================*/


/*
 * Command to start LPM processing based on the config params
 */

#define	LPM_CMD_START		0x0000
#define	LPM_CMD_START_LEN	sizeof(lpm_cmd_start)

#define	LPM_CMD_SPATIAL_FILTER_PART_OPMODE_0	0x00000000
#define	LPM_CMD_SPATIAL_FILTER_PART_OPMODE_1	0x00010000
typedef struct {
	unsigned int	cmd_id;
	unsigned int	ip_data_cfg_part1;
	unsigned int	ip_data_cfg_part2;
	unsigned int	ip_data_cfg_part3;
	unsigned int	ip_data_cfg_part4;
	unsigned int	op_data_cfg_part1;
	unsigned int	op_data_cfg_part2;
	unsigned int	op_data_cfg_part3;
	unsigned int	spatial_filter_part[32];
} __attribute__((packed)) lpm_cmd_start;



/*
 * Command to stop LPM processing
 */

#define	LPM_CMD_IDLE		0x0001
#define	LPM_CMD_IDLE_LEN	sizeof(lpm_cmd_idle)

typedef struct {
	unsigned int	cmd_id;
} __attribute__((packed)) lpm_cmd_idle;


#endif
