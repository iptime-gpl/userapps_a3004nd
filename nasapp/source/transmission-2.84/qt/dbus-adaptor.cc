/*
 * This file Copyright (C) 2012-2014 Mnemosyne LLC
 *
 * It may be used under the GNU Public License v2 or v3 licenses,
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: dbus-adaptor.cc,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */

#include "add-data.h"
#include "app.h"
#include "dbus-adaptor.h"

TrDBusAdaptor :: TrDBusAdaptor (MyApp* app):
  QDBusAbstractAdaptor (app),
  myApp (app)
{
}

bool
TrDBusAdaptor :: PresentWindow ()
{
  myApp->raise ();
  return true;
}

bool
TrDBusAdaptor :: AddMetainfo (const QString& key)
{
  AddData addme (key);

  if (addme.type != addme.NONE)
    myApp->addTorrent (addme);

  return true;
}
