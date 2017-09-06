#ifndef QDSP5VIDDECMSGI_H
#define QDSP5VIDDECMSGI_H

/*====*====*====*====*====*====*====*====*====*====*====*====*====*====*====*

    V I D E O  D E C O D E R   I N T E R N A L  M E S S A G E S

GENERAL DESCRIPTION
  This file contains defintions of format blocks of messages
  that are sent by VIDDEC Task

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

$Header: /usr/kcvsrep/MT762X_SDK_4300/RT288x_SDK/source/linux-2.6.36.x/drivers/staging/dream/include/mach/qdsp5/qdsp5vdecmsg.h,v 1.1.1.1 2015/01/14 09:44:42 mt7620 Exp $ $DateTime: 2014/05/07 23:03:57 $ $Author: mt7620 $
Revision History:

when       who     what, where, why
--------   ---     ----------------------------------------------------------
05/10/08   ac      initial version
===========================================================================*/

/*
 * Message to inform ARM which VDEC_SUBFRAME_PKT_CMD processed by VIDDEC TASK
 */

#define	VIDDEC_MSG_SUBF_DONE	0x0000
#define	VIDDEC_MSG_SUBF_DONE_LEN	\
	sizeof(viddec_msg_subf_done)

typedef struct {
	unsigned short	packet_seq_number;
	unsigned short	codec_instance_id;
} __attribute__((packed)) viddec_msg_subf_done;


/*
 * Message to inform ARM one frame has been decoded
 */

#define	VIDDEC_MSG_FRAME_DONE	0x0001
#define	VIDDEC_MSG_FRAME_DONE_LEN	\
	sizeof(viddec_msg_frame_done)

typedef struct {
	unsigned short	packet_seq_number;
	unsigned short	codec_instance_id;
} __attribute__((packed)) viddec_msg_frame_done;


/*
 * Message to inform ARM that post processing frame has been decoded
 */

#define	VIDDEC_MSG_PP_ENABLE_CMD_DONE	0x0002
#define	VIDDEC_MSG_PP_ENABLE_CMD_DONE_LEN	\
	sizeof(viddec_msg_pp_enable_cmd_done)

typedef struct {
	unsigned short	packet_seq_number;
	unsigned short	codec_instance_id;
} __attribute__((packed)) viddec_msg_pp_enable_cmd_done;


/*
 * Message to inform ARM that one post processing frame has been decoded
 */


#define	VIDDEC_MSG_PP_FRAME_DONE		0x0003
#define	VIDDEC_MSG_PP_FRAME_DONE_LEN	\
	sizeof(viddec_msg_pp_frame_done)

#define	VIDDEC_MSG_DISP_WORTHY_DISP		0x0000
#define	VIDDEC_MSG_DISP_WORTHY_DISP_NONE	0xFFFF


typedef struct {
	unsigned short	packet_seq_number;
	unsigned short	codec_instance_id;
	unsigned short	display_worthy;
} __attribute__((packed)) viddec_msg_pp_frame_done;


#endif
