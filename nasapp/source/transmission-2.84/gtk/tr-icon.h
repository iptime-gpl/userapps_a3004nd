/*
 * This file Copyright (C) 2007-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: tr-icon.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */

#ifndef GTR_ICON_H
#define GTR_ICON_H

#include <gtk/gtk.h>
#include "tr-core.h"

gpointer  gtr_icon_new    (TrCore * core);
void      gtr_icon_refresh (gpointer);

#endif /* GTR_ICON_H */
