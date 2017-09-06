
TARGET_LIST:=prepare profile
ifeq ($(USE_OEM_PROFILE),y)
TARGET_LIST+=oem_profile
endif
TARGET_LIST+=basic_binary

ifneq ($(USE_EXTENDER_ONLY),y)
TARGET_LIST+=router_app
endif

# SBIN LIST Start
SBIN_LIST := $(USERAPPS_ROOT)/boa-0.94.13/src/httpd $(USERAPPS_ROOT)/init/inittime
SBIN_LIST+=$(USERAPPS_ROOT)/rc/install/sbin/*
SBIN_LIST+=$(LOCAL_SBIN_LIST)
SBIN_LIST+=$(USERAPPS_ROOT)/udhcp-0.9.8/dhcpd


ifeq ($(USE_VCONFIG),y)
SBIN_LIST+=$(USERAPPS_ROOT)/vlanconfig/vconfig
endif

ifneq ($(USE_MERGE_ISYSD_INIT),y)
SBIN_LIST += $(USERAPPS_ROOT)/isysd/sysd
endif

ifneq ($(USE_MERGE_TO_INIT),y)
ifeq ($(USE_APCPD_SUPPORT),y)
SBIN_LIST += $(USERAPPS_ROOT)/apcpd/apcpd
endif
SBIN_LIST += $(USERAPPS_ROOT)/iptables-q/iptables-q
endif

ifeq ($(USE_PPTP_CONNECT),y)
SBIN_LIST += $(USERAPPS_ROOT)/pptp-1.7.0/pptp
endif

ifeq ($(USE_KAID_SUPPORT),y)
SBIN_LIST += $(USERAPPS_ROOT)/http-tiny-1.2/http
endif

ifeq ($(USE_DDNS_CLIENT),y)
SBIN_LIST += $(USERAPPS_ROOT)/ddns_client/ddns_client
endif

ifeq ($(USE_FAKE_DNS),y)
SBIN_LIST += $(USERAPPS_ROOT)/fakedns/fakedns
endif

ifeq ($(USE_FTP_DEBUG_SUPPORT),y)
SBIN_LIST += $(USERAPPS_ROOT)/ftpd/ftpd
endif

ifeq ($(USE_PPTPVPN),y)
SBIN_LIST += $(USERAPPS_ROOT)/poptop-1.1.4/pptpd $(USERAPPS_ROOT)/poptop-1.1.4/bcrelay $(USERAPPS_ROOT)/poptop-1.1.4/pptpctrl
endif

ifeq ($(USE_TELNETD),y)
SBIN_LIST += $(USERAPPS_ROOT)/utelnetd-0.1.9/utelnetd
endif

ifeq ($(USE_BRIDGE),y)
ifeq ($(BRCTL_BIN_PATH),)
ifeq ($(USE_KERNEL_3_X),y)
SBIN_LIST += $(USERAPPS_ROOT)/bridge-utils-1.1/brctl/brctl
else
SBIN_LIST += $(USERAPPS_ROOT)/bridge-utils/brctl/brctl
endif
else
SBIN_LIST += $(BRCTL_BIN_PATH)/brctl
endif
endif

ifeq ($(USE_ADMIN_EMAIL),y)
SBIN_LIST += $(USERAPPS_ROOT)/smtpclient/smtpclient
endif

ifeq ($(USE_CAPTCHA_CODE),y)
SBIN_LIST += $(USERAPPS_ROOT)/captcha/captcha
endif

ifeq ($(USE_UPNP_RELAY),y)
SBIN_LIST += $(USERAPPS_ROOT)/miniupnpc-1.6/upnpc
endif

ifeq ($(USE_KT_SPEED_TEST),y)
SBIN_LIST += $(USERAPPS_ROOT)/kt_speedtest/speedtest
SBIN_LIST += $(USERAPPS_ROOT)/utelnetd-0.1.9/utelnetd
endif

ifeq ($(USE_IPERF),y)
SBIN_LIST+=$(USERAPPS_ROOT)/nasapp/source/iperf-2.0.5/src/iperf
endif

ifeq ($(USE_ORAY_DDNS),y)
SBIN_LIST += $(USERAPPS_ROOT)/phddns/src/c/phddns
endif

ifeq ($(USE_WIRELESS_TOOLS),y)
ifneq ($(WIRELESS_TOOLS_DIR),)
SBIN_LIST += $(USERAPPS_ROOT)/$(WIRELESS_TOOLS_DIR)/iwpriv
SBIN_LIST += $(USERAPPS_ROOT)/$(WIRELESS_TOOLS_DIR)/iwconfig
ifeq ($(WIRELESS_TOOLS_DIR),wireless_tools.29)
LIB_LIST += $(USERAPPS_ROOT)/$(WIRELESS_TOOLS_DIR)/libiw.so.29
endif
else
SBIN_LIST += $(USERAPPS_ROOT)/wireless_tools/iwpriv
SBIN_LIST += $(USERAPPS_ROOT)/wireless_tools/iwconfig
endif
endif

ifeq ($(USE_MINISSDP),y)
ifeq ($(MINISSDP_BIN_PATH),)
SBIN_LIST += $(USERAPPS_ROOT)/minissdpd-1.2.20140906/minissdpd
else
SBIN_LIST += $(MINISSDP_BIN_PATH)/minissdpd
endif
endif

ifeq ($(USE_WAN_ENABLE),y)
ifeq ($(USE_MV6281),y)
BIN_LIST += \
	$(USERAPPS_ROOT)/mv6281_app/mv_reg/mv_reg \
	$(USERAPPS_ROOT)/mv6281_app/resetd/resetd \
	$(USERAPPS_ROOT)/mv6281_app/mtd/mtd_write
SBIN_LIST += $(USERAPPS_ROOT)/udhcp-0.9.8/dumpleases
SBIN_LIST += $(USERAPPS_ROOT)/iptables-1.3.8/iptables $(USERAPPS_ROOT)/iptables-1.3.8/ippool/ippool
endif
endif

ifeq ($(USE_WOL_SERVER),y)
SBIN_LIST += $(USERAPPS_ROOT)/wol_server/wol_server
endif

# SBIN LIST End
#


#
# BIN LIST Start
#
ifeq ($(USE_DUAL_WAN),y)
BIN_LIST += $(USERAPPS_ROOT)/iproute2-3.14.0/ip/ip
endif

ifeq ($(USE_HOST_SCAN),y)
BIN_LIST += $(USERAPPS_ROOT)/hostscan/hostscan
endif
# BIN LIST End

# LIB LIST Start
LIB_LIST+=$(USERAPPS_ROOT)/lib/libcgi.so $(USERAPPS_ROOT)/lib/ul_lib/libuserland.so
# LIB LIST End


CONF_DIR := ../conf

prepare:
	@echo "--->Making root filesystem for $(TARGET)..." 
	@rm -f mk.log
ifneq ($(ROOT_DIR),)
	@rm -rf $(ROOT_DIR)
endif
	@mkdir -p $(ROOT_DIR)

	@cp -ra root_base/* $(ROOT_DIR)/
	@ln -s /tmp/var $(ROOT_DIR)/var
	@ln -s /tmp/etc $(ROOT_DIR)/etc


ifeq ($(LANG_DEFAULT_PROFILE),y)

ifeq ($(USE_EGYPT_CONFIG),y)
PROFILE_PATH:=clones/$(TARGET)/default.eg
else
PROFILE_PATH:=clones/$(TARGET)/default.$(LANGUAGE_POSTFIX)
endif

else
PROFILE_PATH:=clones/$(TARGET)/default
endif

profile:
# Default Config Section START 
	@echo -e "\t--->Install Profile"
	@mkdir -p $(ROOT_DIR)/default
	@cp -ra $(PROFILE_PATH)/* $(ROOT_DIR)/default/
#	@chmod 777 $(ROOT_DIR)/default/etc/init.d/rcS
	@echo "language=$(LANGUAGE_POSTFIX)" >> $(ROOT_DIR)/default/var/run/hwinfo
	@echo "product_alias=$(PRODUCT_ID)" >> $(ROOT_DIR)/default/var/run/hwinfo
ifeq ($(USE_EFM_DEFAULT_SESSION_LOGIN),y)
	@echo "http_auth=session" >> $(ROOT_DIR)/default/etc/iconfig.cfg
	@echo "login=admin" >> $(ROOT_DIR)/default/etc/iconfig.cfg
	@echo "password=admin" >> $(ROOT_DIR)/default/etc/iconfig.cfg
endif
ifeq ($(USE_BULK_FIRMWARE),y)
	echo "bulkfirm=1" >> $(ROOT_DIR)/default/var/run/hwinfo
endif
ifeq ($(USE_UTF8),y)
	@echo "lang=utf-8" >> $(ROOT_DIR)/default/etc/iconfig.cfg
endif
ifeq ($(USE_SYSINFO),y)
	@cp -ra clones/$(TARGET)/si $(ROOT_DIR)/default/var/run/
ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print "ux_lang["cnt+0"]="$$0;cnt++}' >> $(ROOT_DIR)/default/var/run/si/sw
endif
endif
ifneq ($(CLASS_ID),ownmac)
	@cp -ra $(CONF_DIR)/product_db.$(CLASS_ID) $(ROOT_DIR)/default/var/run/product_db
endif
ifeq ($(USE_DSTMATCH_MATCH_RULE),y)
	@cp -ra $(CONF_DIR)/dstmatch_$(LANGUAGE_POSTFIX)/* $(ROOT_DIR)/default/etc/dstmatch
endif
ifeq ($(USE_UPNP),y)
	@cp -ra $(CONF_DIR)/upnp/upnpd.conf $(ROOT_DIR)/default/etc
	@mkdir $(ROOT_DIR)/default/etc/linuxigd
	@cp -ra $(CONF_DIR)/upnp/*.xml $(ROOT_DIR)/default/etc/linuxigd
endif
ifeq ($(USE_MINIUPNP),y)
	@cp -ra $(CONF_DIR)/upnp/miniupnpd.conf $(ROOT_DIR)/default/etc
endif
ifeq ($(USE_APPS_TEMPLATE),y)
	@cp -ra $(CONF_DIR)/firewall_rule_$(LANGUAGE_POSTFIX)_nv $(ROOT_DIR)/default/var/firewall_rule 
	@cp -ra $(CONF_DIR)/virtsvr_rule.nvtime $(ROOT_DIR)/default/var/virtsvr_rule
ifneq ($(LANGUAGE_POSTFIX),kr)
	@cp -ra $(CONF_DIR)/virtsvr_rule_$(LANGUAGE_POSTFIX).nvtime $(ROOT_DIR)/default/var/virtsvr_rule 
else
ifeq ($(USE_UTF8),y)
	@iconv -f euckr -t utf8 -o $(ROOT_DIR)/default/var/virtsvr_rule $(ROOT_DIR)/default/var/virtsvr_rule
endif
endif
endif


ifeq ($(USE_OEM_PROFILE),y)
OEM_DEFAULT_DIR:=default.$(OEM_PROFILE_NAME)

oem_profile:
# Default Config Section START 
	@echo -e "\t--->Install Profile : OEM - $(OEM_PROFILE_NAME)"
	@mkdir -p $(ROOT_DIR)/$(OEM_DEFAULT_DIR)
	@cp -ra root_base/default/* $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/
	@cp -ra clones/$(TARGET)/oem/$(OEM_DEFAULT_DIR)/* $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/
	@echo "language=$(LANGUAGE_POSTFIX)" >> $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/hwinfo
	@echo "product_alias=$(PRODUCT_ID)" >> $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/hwinfo
ifeq ($(USE_SYSINFO),y)
	@mkdir -p $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/si/
	@cp -ra clones/$(TARGET)/oem/si.$(OEM_PROFILE_NAME)/* $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/si/
ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print "ux_lang["cnt+0"] = "$$0RT;cnt++}' >> $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/si/sw
endif
endif
ifneq ($(CLASS_ID),ownmac)
	@cp -ra $(CONF_DIR)/product_db.$(CLASS_ID) $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/run/product_db
endif
ifeq ($(USE_DSTMATCH_MATCH_RULE),y)
	@cp -ra $(CONF_DIR)/dstmatch_$(LANGUAGE_POSTFIX)/* $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/etc/dstmatch
endif
ifeq ($(USE_UPNP),y)
	@cp -ra $(CONF_DIR)/upnp/upnpd.conf $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/etc
	@mkdir $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/etc/linuxigd
	@cp -ra $(CONF_DIR)/upnp/*.xml $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/etc/linuxigd
endif
ifeq ($(USE_MINIUPNP),y)
	@cp -ra $(CONF_DIR)/upnp/miniupnpd.conf $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/etc
endif
ifeq ($(USE_APPS_TEMPLATE),y)
	@cp -ra $(CONF_DIR)/firewall_rule_$(LANGUAGE_POSTFIX)_nv $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/firewall_rule 
	@cp -ra $(CONF_DIR)/virtsvr_rule.nvtime $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/virtsvr_rule
ifneq ($(LANGUAGE_POSTFIX),kr)
	@cp -ra $(CONF_DIR)/virtsvr_rule_$(LANGUAGE_POSTFIX).nvtime $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/virtsvr_rule 
else
ifeq ($(USE_UTF8),y)
	@iconv -f euckr -t utf8 -o $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/virtsvr_rule $(ROOT_DIR)/$(OEM_DEFAULT_DIR)/var/virtsvr_rule
endif
endif
endif

endif # OEM PROFILE



# Default Config Section End 




# Start MODULE
ifneq ($(MODULE_SRC_DIR),)
module:
	@echo -e "\t--->Install Kernel Module($(MODULE_SRC_DIR),$(KMODULE_SRC_DIR))"
	@mkdir -p $(MODULE_DEST_DIR)
	@cp -ra $(MODULE_SRC_DIR)/* $(MODULE_DEST_DIR)
ifneq ($(KMODULE_SRC_DIR),)
	@cp -ra $(KMODULE_SRC_DIR)/* $(MODULE_DEST_DIR)
endif

TARGET_LIST+=module
endif
# End MODULE

# START busybox
busybox:
	@echo -e "\t--->Install BusyBox ($(BUSYBOX_DIR))"
	@ln -s bin/busybox $(ROOT_DIR)/linuxrc
	@cp -ra $(USERAPPS_ROOT)/$(BUSYBOX_DIR)/_install/* $(ROOT_DIR)/
TARGET_LIST+=busybox
# END busybox

# START iptables
iptables:
	@echo -e "\t--->Install iptables ($(IPTABLES_BIN_PATH))"
	@for i in $(IPTABLES_BINS); do  \
		cp -rPa $(IPTABLES_BIN_PATH)/$$i $(ROOT_DIR)/sbin/; \
        done
	@for i in $(IPTABLES_LIBS); do  \
		cp -rPa $(IPTABLES_LIB_PATH)/$$i* $(ROOT_DIR)/lib/; \
        done
	@for i in $(IPTABLES_LIBS2); do  \
		cp -rPa $(IPTABLES_LIB_PATH2)/$$i* $(ROOT_DIR)/lib/; \
        done

TARGET_LIST+=iptables
# END iptables

# START USE_IGMP_PROXY
ifeq ($(USE_IGMP_PROXY),y)
igmpproxy:
	@echo -e "\t--->Install IGMP Proxy ($(IGMP_BINARY_PATH))"
ifeq ($(IGMP_BINARY_PATH),)
	@cp $(USERAPPS_ROOT)/igmpproxy/src/igmpproxy $(ROOT_DIR)/bin
	@cp -ra $(USERAPPS_ROOT)/igmpproxy/src/igmpproxy.conf $(ROOT_DIR)/default/etc
else
	@cp $(USERAPPS_ROOT)/$(IGMP_BINARY_PATH) $(ROOT_DIR)/bin
endif
TARGET_LIST+=igmpproxy
endif 
#END USE_IGMP_PROXY


# START USE_SNMPD
ifeq ($(USE_SNMPD),y)
snmpd:
	@echo -e "\t--->Install NET-SNMP"
	@cp -rP $(PLUGIN_DIR)/net-snmp/lib/* $(ROOT_DIR)/lib/
	@cp -rP $(PLUGIN_DIR)/net-snmp/sbin/snmpd $(ROOT_DIR)/sbin/
ifeq ($(USE_SNMP_IPTIME_PRIVATE_MIB),y)
	cp $(PLUGIN_DIR)/net-snmp/sbin/snmptrap $(ROOT_DIR)/sbin
	cp -ra $(PLUGIN_DIR)/net-snmp/mibs $(ROOT_DIR)/lib
endif
TARGET_LIST+=snmpd
endif

#END USE_SNMPD

# START Basic Binary
basic_binary:
	@echo -e "\t--->Install Basic Binary"
	@cp -rP $(SBIN_LIST) $(ROOT_DIR)/sbin
ifneq ($(BIN_LIST),)
	@cp -rP $(BIN_LIST) $(ROOT_DIR)/bin
endif
	@cp -rP $(LIB_LIST) $(ROOT_DIR)/lib
ifneq ($(CHIPSET_APP_INSTALL_DIR),)
	@cp -rP $(USERAPPS_ROOT)/$(CHIPSET_APP_INSTALL_DIR)/install/* $(ROOT_DIR)/
endif
ifneq ($(CLIB_DIR),)
	@cp -rP $(USERAPPS_ROOT)/$(CLIB_DIR)/* $(ROOT_DIR)/lib
endif
	@ln -s dhcpd $(ROOT_DIR)/sbin/dhclient
	@ln -s dhcpd $(ROOT_DIR)/sbin/dhclientchk
	@ln -s /sbin/dhcpd $(ROOT_DIR)/sbin/dhcpd.helper
ifeq ($(USE_FAKE_DNS),y)
	@ln -s /sbin/fakedns $(ROOT_DIR)/sbin/fakedns.helper
endif
# END Basic Binary


# Router APP Section Start
ROUTER_SBIN_LIST += $(USERAPPS_ROOT)/ppp-2.4.2/pppd/pppd
PPPD_SO := $(USERAPPS_ROOT)/ppp-2.4.2/pppd/plugins/rp-pppoe/rp-pppoe.so
ifeq ($(USE_PPPOE_RELAY),y)
ROUTER_SBIN_LIST += $(USERAPPS_ROOT)/rp-pppoe-3.10/src/pppoe-relay
endif
ifeq ($(USE_FIREWALL_V2),y)
ROUTER_SBIN_LIST += $(USERAPPS_ROOT)/fwsched/fwsched
ROUTER_SBIN_LIST += $(USERAPPS_ROOT)/fwsched/fwconv
endif
ifeq ($(USE_DUAL_WAN),y)
ROUTER_SBIN_LIST += $(USERAPPS_ROOT)/linkmon/linkmon
endif
ifeq ($(USE_QOS),y)
ROUTER_BIN_LIST += $(USERAPPS_ROOT)/iproute2/tc/tc
endif
#ifeq ($(USE_UPNP),y)
#ROUTER_BIN_LIST+=$(USERAPPS_ROOT)/upnp/igd/upnpd
#endif
ifeq ($(USE_MINIUPNP),y)
ifeq ($(UPNPD_BIN_PATH),)
ifneq ($(MINIUPNPD_DIR),)
ROUTER_BIN_LIST+=$(USERAPPS_ROOT)/$(MINIUPNPD_DIR)/upnpd
else
ROUTER_BIN_LIST+=$(USERAPPS_ROOT)/miniupnpd-20090605/upnpd
endif
else
ROUTER_BIN_LIST+=$(UPNPD_BIN_PATH)/upnpd
endif
endif

router_app:
	@echo -e "\t--->Install Router App"
	@cp -rP $(ROUTER_SBIN_LIST) $(ROOT_DIR)/sbin
	@cp -rP $(ROUTER_BIN_LIST) $(ROOT_DIR)/bin
	@cp -rP $(PPPD_SO) $(ROOT_DIR)/usr/lib/pppd
ifeq ($(USE_MTK_TXBF_CAL_UI),y)
	@mkdir -p $(ROOT_DIR)/cgibin
	@cp $(USERAPPS_ROOT)/cgi-src/mtk_txbf_cal/txbf.cgi $(ROOT_DIR)/cgibin
	@ln -s /cgibin/txbf.cgi $(ROOT_DIR)/cgibin/txbf_act.cgi
endif

include $(USERAPPS_ROOT)/mkscripts/ui.mk

# END Router APP Section Start

strip:
	@echo -e "\t--->Strip All binaries"
ifneq ($(ROOT_DIR),)
	@rm -rf `find ./$(ROOT_DIR) -name 'CVS'` 
	@find ./$(ROOT_DIR) -type f -name '.#*' | xargs rm -f
endif
#	@$(STRIP) $(SBIN_LIST)&>mk.log
#	@$(STRIP) $(BIN_LIST)&>>mk.log

ifneq ($(DONT_STRIP),y)
	du -sb $(ROOT_DIR)/cgibin >>mk.log;$(STRIP) $(ROOT_DIR)/cgibin/* 2>>mk.log;du -sb $(ROOT_DIR)/cgibin>>mk.log
	du -sb $(ROOT_DIR)/bin>>mk.log;$(STRIP) $(STRIP_OPTION) $(ROOT_DIR)/bin/* 2>>mk.log;du -sb $(ROOT_DIR)/bin>>mk.log
	du -sb $(ROOT_DIR)/sbin>>mk.log;$(STRIP) $(STRIP_OPTION) $(ROOT_DIR)/sbin/* 2>>mk.log;du -sb $(ROOT_DIR)/sbin>>mk.log
	du -sb $(ROOT_DIR)/lib>>mk.log;$(STRIP) $(STRIP_OPTION) $(ROOT_DIR)/lib/* 2>>mk.log;du -sb $(ROOT_DIR)/lib>>mk.log
	du -sb $(ROOT_DIR)/usr/lib>>mk.log;$(STRIP) $(STRIP_OPTION) $(ROOT_DIR)/usr/lib/* 2>>mk.log;du -sb $(ROOT_DIR)/usr/lib>>mk.log
endif


ifeq ($(USE_ROUTER_NAS),y)
include $(USERAPPS_ROOT)/mkscripts/nas.mk
endif



TARGET_LIST+=strip post_targetfs

target.fs: $(TARGET_LIST)
	@echo "--->Making target.fs - $(TARGET)"
	@sync; sync; sync;
ifneq ($(LDCONFIG_CMD),)
	@$(LDCONFIG_CMD)
endif
ifneq ($(ROOTFS_IMG),)
	@rm -rf ./$(ROOTFS_IMG)
endif
ifneq ($(MAKE_FS_BIANRY_CMD),)
	@$(MAKE_FS_BIANRY_CMD) >> mk.log
endif


