IUX_DIR:=$(USERAPPS_ROOT)/cgi-src/iux

IUX_DIRS:=basicapp cgi common expertconf firewallconf login nasconf natrouterconf netinfo sysconf tmenu topmenu trafficconf wirelessconf

IUX_AUTH_DIRS := cgi
IUX_AUTH_DIRS += netinfo/waninfo
IUX_AUTH_DIRS += netinfo/laninfo
IUX_AUTH_DIRS += natrouterconf/misc
IUX_AUTH_DIRS += basicapp/service
IUX_AUTH_DIRS += sysconf/misc
IUX_AUTH_DIRS += sysconf/login
IUX_AUTH_DIRS += sysconf/swupgrade
IUX_AUTH_DIRS += sysconf/syslog
IUX_AUTH_DIRS += sysconf/info
IUX_AUTH_DIRS += natrouterconf/portforward
IUX_AUTH_DIRS += natrouterconf/router
IUX_AUTH_DIRS += firewallconf/firewall
IUX_AUTH_DIRS += firewallconf/accesslist
IUX_AUTH_DIRS += trafficconf/qos
IUX_AUTH_DIRS += trafficconf/conninfo
IUX_AUTH_DIRS += trafficconf/connctrl
IUX_AUTH_DIRS += trafficconf/linksetup
IUX_AUTH_DIRS += trafficconf/switch
IUX_AUTH_DIRS += wirelessconf/basicsetup
IUX_AUTH_DIRS += wirelessconf/advancesetup
IUX_AUTH_DIRS += wirelessconf/macauth
IUX_AUTH_DIRS += expertconf/pptpvpn
IUX_AUTH_DIRS += expertconf/ddns
IUX_AUTH_DIRS += expertconf/hostscan
IUX_AUTH_DIRS += expertconf/wol
IUX_AUTH_DIRS += expertconf/advertise
IUX_AUTH_DIRS += expertconf/iptv
IUX_AUTH_DIRS += nasconf/basic

iux_install:
	@echo -e "\t\t--->Install IUX files"
ifneq ($(USE_IUX_PACKAGE),y)
	@cp -ra $(IUX_DIR)/install/* $(ROOT_DIR)/home/httpd/
endif
	@for i in $(IUX_DIRS) ; do\
		ln -s ../$$i $(ROOT_DIR)/home/httpd/192.168.0.1/$$i;\
	done
	@rm -rf $(ROOT_DIR)/default/var/run/iux_dirs
	@touch $(ROOT_DIR)/default/var/run/iux_dirs
	@for i in $(IUX_AUTH_DIRS) ; do\
		echo "$$i" >> $(ROOT_DIR)/default/var/run/iux_dirs;\
	done
	@ln -s ../m_handler.cgi $(ROOT_DIR)/home/httpd/192.168.0.1/m_handler.cgi;
	@ln -s ../m_login.cgi $(ROOT_DIR)/home/httpd/192.168.0.1/m_login.cgi;
	@ln -s ../captcha.cgi $(ROOT_DIR)/home/httpd/192.168.0.1/captcha.cgi;

#	mkdir -p $(ROOT_DIR)/home/httpd2
#	cp -ra $(IUX_DIR)/install/* $(ROOT_DIR)/home/httpd2
#	cp $(USERAPPS_ROOT)/mkscripts/boa_vh2.conf $(ROOT_DIR)/default/var
#	cp $(USERAPPS_ROOT)/boa-0.94.13_2/src/httpd $(ROOT_DIR)/sbin/httpd3
	
UI_TARGET_LIST+=iux_install

iux_msg:
	@echo -e "\t--->Install IUX"

iux_ui: iux_msg $(UI_TARGET_LIST)

TARGET_LIST+=iux_ui


