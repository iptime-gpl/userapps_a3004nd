/*
 * "$Id: banners.h,v 1.1.1.1 2014/12/23 05:45:34 thki81 Exp $"
 *
 *   Banner definitions for the CUPS scheduler.
 *
 *   Copyright 2007-2010 by Apple Inc.
 *   Copyright 1997-2006 by Easy Software Products.
 *
 *   These coded instructions, statements, and computer programs are the
 *   property of Apple Inc. and are protected by Federal copyright
 *   law.  Distribution and use rights are outlined in the file "LICENSE.txt"
 *   which should have been included with this file.  If this file is
 *   file is missing or damaged, see the license at "http://www.cups.org/".
 */

/*
 * Banner information structure...
 */

typedef struct				/**** Banner file information ****/
{
  char		*name;			/* Name of banner */
  mime_type_t	*filetype;		/* Filetype for banner */
} cupsd_banner_t;


/*
 * Globals...
 */

VAR cups_array_t	*Banners	VALUE(NULL);
					/* Available banner files */


/*
 * Prototypes...
 */

extern cupsd_banner_t	*cupsdFindBanner(const char *name);
extern void		cupsdLoadBanners(const char *d);


/*
 * End of "$Id: banners.h,v 1.1.1.1 2014/12/23 05:45:34 thki81 Exp $".
 */
