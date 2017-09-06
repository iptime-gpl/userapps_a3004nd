/* $Id: receivedata.h,v 1.1.1.1 2011/10/12 01:12:48 ysnas Exp $ */
/* Project: miniupnp
 * http://miniupnp.free.fr/ or http://miniupnp.tuxfamily.org/
 * Author: Thomas Bernard
 * Copyright (c) 2011 Thomas Bernard
 * This software is subjects to the conditions detailed
 * in the LICENCE file provided within this distribution */
#ifndef __RECEIVEDATA_H__
#define __RECEIVEDATA_H__

/* Reads data from the specified socket. 
 * Returns the number of bytes read if successful, zero if no bytes were 
 * read or if we timed out. Returns negative if there was an error. */
int receivedata(int socket, char * data, int length, int timeout);

#endif

