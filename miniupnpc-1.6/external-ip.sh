#!/bin/sh
# $Id: external-ip.sh,v 1.1.1.1 2011/10/12 01:12:48 ysnas Exp $
# (c) 2010 Reuben Hawkins
upnpc -s | grep ExternalIPAddress | sed 's/[^0-9\.]//g'
