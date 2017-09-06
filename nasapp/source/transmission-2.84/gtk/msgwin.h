/*
 * This file Copyright (C) 2008-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: msgwin.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */


#ifndef GTR_MSGWIN_H
#define GTR_MSGWIN_H

#include "tr-core.h"

GtkWidget * gtr_message_log_window_new (GtkWindow * parent, TrCore * core);

#endif
