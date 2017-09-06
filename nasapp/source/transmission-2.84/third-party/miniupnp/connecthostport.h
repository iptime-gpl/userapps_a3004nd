/* $Id: connecthostport.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $ */
/* Project: miniupnp
 * http://miniupnp.free.fr/
 * Author: Thomas Bernard
 * Copyright (c) 2010-2012 Thomas Bernard
 * This software is subjects to the conditions detailed
 * in the LICENCE file provided within this distribution */
#ifndef CONNECTHOSTPORT_H_INCLUDED
#define CONNECTHOSTPORT_H_INCLUDED

/* connecthostport()
 * return a socket connected (TCP) to the host and port
 * or -1 in case of error */
int connecthostport(const char * host, unsigned short port,
                    unsigned int scope_id);

#endif

