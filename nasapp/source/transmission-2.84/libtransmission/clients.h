/*
 * This file Copyright (C) 2008-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: clients.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */

#ifndef __TRANSMISSION__
 #error only libtransmission should #include this header.
#endif

#ifndef TR_CLIENTS_H
#define TR_CLIENTS_H

/**
 * @brief parse a peer-id into a human-readable client name and version number
 * @ingroup utils
 */
char* tr_clientForId (char * buf, size_t buflen, const void * peer_id);

#endif
