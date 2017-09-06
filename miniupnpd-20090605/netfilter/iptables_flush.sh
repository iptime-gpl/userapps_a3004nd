#! /bin/sh
# $Id: iptables_flush.sh,v 1.1 2009/06/19 02:34:11 ysrt305x Exp $
IPTABLES=iptables

#flush all rules owned by miniupnpd
$IPTABLES -t nat -F MINIUPNPD
$IPTABLES -t filter -F MINIUPNPD

