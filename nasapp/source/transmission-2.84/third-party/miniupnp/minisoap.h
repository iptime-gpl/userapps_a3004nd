/* $Id: minisoap.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $ */
/* Project : miniupnp
 * Author : Thomas Bernard
 * Copyright (c) 2005 Thomas Bernard
 * This software is subject to the conditions detailed in the
 * LICENCE file provided in this distribution. */
#ifndef MINISOAP_H_INCLUDED
#define MINISOAP_H_INCLUDED

/*int httpWrite(int, const char *, int, const char *);*/
int soapPostSubmit(int, const char *, const char *, unsigned short,
		   const char *, const char *, const char *);

#endif

