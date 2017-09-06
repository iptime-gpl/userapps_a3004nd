
IUXPC_PATH:=$(USERAPPS_ROOT)/cgi-src/iuxpc
IUXPC_CGI_PATH:=$(USERAPPS_ROOT)/cgi-src/iuxpc/cgi

iuxpc_html:
# HTML CSS JS Section start
	@echo -e "\t\t--->Install HTML CSS JS GIFs"
	@cp -ra clones/$(TARGET)/home $(ROOT_DIR)/
	@ln -s /home/httpd/index.html $(ROOT_DIR)/home/httpd/192.168.0.1/index.html
	@rm -rf $(ROOT_DIR)/home/httpd/192.168.255.1/index*.html


ifeq ($(USE_NETDETECT),y)
	@ln -s /home/httpd/mypage.html $(ROOT_DIR)/home/httpd/192.168.255.250/index.html
	@ln -s /home/httpd/mypage.html $(ROOT_DIR)/home/httpd/192.168.0.1/mypage.html
	@rm -rf $(ROOT_DIR)/home/httpd/mypage_menu.html
endif
ifeq ($(USE_NOLOGIN_PAGE_CONNECT),y)
	@cp $(ROOT_DIR)/home/httpd/index.html $(ROOT_DIR)/home/httpd/index_org.html
	@cp $(CONF_DIR)/html/index_nologin.html $(ROOT_DIR)/home/httpd/
endif


# GIF Section	
	@ln -s /home/httpd/images2 $(ROOT_DIR)/home/httpd/192.168.0.1/images2
	@cp $(IUXPC_PATH)/images/*.gif $(ROOT_DIR)/home/httpd/images2
	@cp $(IUXPC_PATH)/images/*.png $(ROOT_DIR)/home/httpd/images2
ifneq ($(USE_DYNAMIC_CONCURRENT_BAND),y)
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_wirelessband.gif
endif

ifeq ($(USE_OEM_UI),y)
	@cp $(CONF_DIR)/html/gifs/v1/login_back_info.gif $(ROOT_DIR)/home/httpd/images2/login_back_info.v1.gif
ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print $$1}' | while read -r lang; do \
		cp clones/$(TARGET)/images/login_back_$(PRODUCT_ID).$$lang.gif $(ROOT_DIR)/home/httpd/images2/; \
		cp clones/$(TARGET)/images/titlebar_$(PRODUCT_ID).$$lang.gif $(ROOT_DIR)/home/httpd/images2/; \
		cp clones/$(TARGET)/images2/login_str_id.$$lang.gif $(ROOT_DIR)/home/httpd/images2/; \
		cp clones/$(TARGET)/images2/login_str_passwd.$$lang.gif $(ROOT_DIR)/home/httpd/images2/; \
		cp clones/$(TARGET)/images2/login_bt.$$lang.gif $(ROOT_DIR)/home/httpd/images2/login_bt.$$lang.gif; \
		cp clones/$(TARGET)/images2/login_bt_refresh.gif $(ROOT_DIR)/home/httpd/images2/login_bt_refresh.$$lang.gif; \
		cp clones/$(TARGET)/images2/captcha_noborder.$$lang.gif $(ROOT_DIR)/home/httpd/images2/; \
	done
else
	@cp clones/$(TARGET)/images/login_back_$(PRODUCT_ID).$(LANGUAGE_POSTFIX).gif $(ROOT_DIR)/home/httpd/images2/
	@cp clones/$(TARGET)/images/titlebar_$(PRODUCT_ID).$(LANGUAGE_POSTFIX).gif $(ROOT_DIR)/home/httpd/images2/
	@cp clones/$(TARGET)/images2/login_bt.$(LANGUAGE_POSTFIX).gif $(ROOT_DIR)/home/httpd/images2/login_bt.$(LANGUAGE_POSTFIX).gif
	@cp clones/$(TARGET)/images2/login_bt_refresh.gif $(ROOT_DIR)/home/httpd/images2/login_bt_refresh.$(LANGUAGE_POSTFIX).gif
	@cp clones/$(TARGET)/images2/captcha_noborder.$(LANGUAGE_POSTFIX).gif $(ROOT_DIR)/home/httpd/images2/
endif
	@cp clones/$(TARGET)/images2/login_main_bg.gif $(ROOT_DIR)/home/httpd/images2/login_main_bg.gif
	@cp clones/$(TARGET)/images2/login_sess_back_info.gif $(ROOT_DIR)/home/httpd/images2/login_sess_back_info.gif
	@cp clones/$(TARGET)/images2/login_title.gif $(ROOT_DIR)/home/httpd/images2/login_title.$(PRODUCT_ID).gif
	@cp clones/$(TARGET)/images2/main_title.gif $(ROOT_DIR)/home/httpd/images2/main_title.$(PRODUCT_ID).gif

else

ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print $$1}' | while read -r lang; do \
		cp -ra $(IUXPC_PATH)/images/$$lang/* $(ROOT_DIR)/home/httpd/images2; \
	done
else
	@cp -ra $(IUXPC_PATH)/images/$(LANGUAGE_POSTFIX)/* $(ROOT_DIR)/home/httpd/images2
endif
	@cp clones/$(TARGET)/images2/main_title.gif $(ROOT_DIR)/home/httpd/images2/main_title.$(PRODUCT_ID).gif
	@cp clones/$(TARGET)/images2/login_title.gif $(ROOT_DIR)/home/httpd/images2/login_title.$(PRODUCT_ID).gif

endif

ifeq ($(USE_WIRELESS_CGI),y) 
	@rm -rf $(ROOT_DIR)/home/httpd/images2/login_main.wired.$(LANGUAGE_POSTFIX).gif
else
	@rm -rf $(ROOT_DIR)/home/httpd/images2/login_main.wireless.$(LANGUAGE_POSTFIX).gif
	@rm -rf $(ROOT_DIR)/home/httpd/images2/wifi*
endif
ifneq ($(USE_IUX),y) 
	@rm -rf $(ROOT_DIR)/home/httpd/images2/gomobile.gif
endif
ifneq ($(USE_ROUTER_NAS),y)
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_basicapp.gif
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_nasconf.gif
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_plugin.gif
	@rm -rf $(ROOT_DIR)/home/httpd/images2/usb20.png
	@rm -rf $(ROOT_DIR)/home/httpd/images2/usb30.png
	@rm -rf $(ROOT_DIR)/home/httpd/images2/iansim_login.gif
endif
ifneq ($(USE_QOS),y)
	@rm -rf $(JS_ROOT)/trafficconf_qos.*
endif
ifneq ($(USE_5G_WL),y)
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_wirelessconf5g.gif
endif
ifneq ($(USE_DYNAMIC_CONCURRENT_BAND),y)
	@rm -rf $(ROOT_DIR)/home/httpd/images2/navimenu_wirelessband.gif
endif

ifeq ($(USE_TOP_MENU_SWITCH_CONFIG),y)
	@cp clones/$(TARGET)/images2/navimenu_switchconf.gif $(ROOT_DIR)/home/httpd/images2/
endif

# GIF Section End


# CSS Section Start
	@cp -ra $(IUXPC_PATH)/css/*.css $(ROOT_DIR)/home/httpd/
	@ln -s /home/httpd/time.v2.css $(ROOT_DIR)/home/httpd/192.168.0.1/time.v2.css
# CSS Section End

# JS Section Start 	
	@mkdir -p $(JS_ROOT)
ifeq ($(USE_COMPRESSED_JS),y)
	@cp -ra $(IUXPC_PATH)/js/min/*.js $(JS_ROOT)
ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print $$1}' | while read -r lang; do \
		mkdir -p $(JS_ROOT)/$$lang; \
		cp -ra $(IUXPC_PATH)/js/langpack/$$lang/min/*.js $(JS_ROOT)/$$lang; \
	done
else
	@cp -ra $(IUXPC_PATH)/js/langpack/$(LANGUAGE_POSTFIX)/min/*.js $(JS_ROOT)
endif

else

	@cp -ra $(IUXPC_PATH)/js/*.js $(JS_ROOT)
ifeq ($(USE_MULTI_LANG),y)
	@echo "$(LANG_PACKS)" | awk -vRS=, '{print $$1}' | while read -r lang; do \
		mkdir -p $(JS_ROOT)/$$lang; \
		cp -ra $(IUXPC_PATH)/js/langpack/$$lang/*.js $(JS_ROOT)/$$lang; \
	done
else
	@cp -ra $(IUXPC_PATH)/js/langpack/$(LANGUAGE_POSTFIX)/*.js $(JS_ROOT)
endif

endif
ifeq ($(USE_5G_WL),y)
	@ln -s /home/httpd/js/wirelessconf.js $(JS_ROOT)/wirelessconf5g.js
endif
ifneq ($(USE_ROUTER_NAS),y)
	@rm -rf $(JS_ROOT)/plugin.js
	@rm -rf $(JS_ROOT)/basicapp_service.*
	@rm -rf $(JS_ROOT)/nasconf_basic.*
endif
ifneq ($(USE_TOTO_PRODUCT),y)
	@rm -f $(JS_ROOT)/expertconf_ddns_totolink.js
else
	@mv -f $(JS_ROOT)/expertconf_ddns_totolink.js $(JS_ROOT)/expertconf_ddns.js
endif
# JS Section End	

# ETC Start 	
ifeq ($(USE_ONLINE_UPGRADE),y)
	@echo "$(PRODUCT_ID)" >  $(ROOT_DIR)/default/var/checkup
	@ln -s /var/checkup $(ROOT_DIR)/home/httpd/checkup
	@ln -s /home/httpd/checkup $(ROOT_DIR)/home/httpd/192.168.0.1/checkup
endif

ifeq ($(USE_CAPTCHA_CODE),y)
	@ln -s /tmp/captcha $(ROOT_DIR)/home/httpd/captcha
	@ln -s /home/httpd/captcha $(ROOT_DIR)/home/httpd/192.168.0.1/captcha
endif
	@echo $(MAJOR_VER).$(MINOR_VER) >  $(ROOT_DIR)/home/httpd/version
	@ln -s /home/httpd/version $(ROOT_DIR)/home/httpd/192.168.0.1/version
	@$(DATE) >  $(ROOT_DIR)/home/httpd/build_date
	@ln -s /home/httpd/build_date $(ROOT_DIR)/home/httpd/192.168.0.1/build_date
# ETC End 	
# HTML CSS JS Section End
IUXPC_TARGET_LIST+=iuxpc_html

##################################################################################################
# iuxpc_cgi
##################################################################################################
IUXPC_CGIBIN_LIST := $(IUXPC_CGI_PATH)/timepro.cgi 
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/upgrade.cgi
ifeq ($(USE_MOBILE_CGI),y)
IUXPC_CGIBIN_LIST +=$(IUXPC_CGI_PATH)/m.cgi
endif
ifeq ($(USE_HTTP_SESSION),y)
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/login_session.cgi
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/login_handler.cgi
ifeq ($(USE_CAPTCHA_CODE),y)
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/captcha.cgi
endif
endif
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/download.cgi
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/download_portforward.cgi
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/download_firewall.cgi

ifeq ($(USE_IUX_PACKAGE),y)
IUXPC_CGIBIN_LIST += $(IUXPC_CGI_PATH)/iux_upload.cgi
endif

IUXPC_LOGIN_LIST := $(IUXPC_CGI_PATH)/login.cgi

iuxpc_cgi:
	@echo -e "\t\t--->Install CGI"
	@mkdir -p $(ROOT_DIR)/cgibin
	@mkdir -p $(ROOT_DIR)/cgibin/login-cgi
	@cp -ra $(IUXPC_LOGIN_LIST) $(ROOT_DIR)/cgibin/login-cgi/
	@cp -ra $(IUXPC_CGIBIN_LIST) $(ROOT_DIR)/cgibin
ifeq ($(USE_HTTP_SESSION),y)
	@ln -s /cgibin/login-cgi/login.cgi $(ROOT_DIR)/cgibin/login.cgi
endif
ifeq ($(USE_NETDETECT),y)
	@ln -s /cgibin/timepro.cgi $(ROOT_DIR)/ndbin/netdetect.cgi
endif
ifeq ($(USE_URL_REDIRECT),y)
	@ln -s /cgibin/timepro.cgi $(ROOT_DIR)/cgibin/login-cgi/urlredir.cgi
endif
	@ln -s /cgibin/timepro.cgi $(ROOT_DIR)/cgibin/d.cgi
ifeq ($(USE_MOBILE_CGI),y)
	@mkdir -p $(ROOT_DIR)/cgibin/ddns
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/info.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/sys_apply.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/net_apply.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/wol_apply.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/wireless_apply.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/ddns/ddns_apply.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/login-cgi/hostinfo.cgi
	@ln -s /cgibin/m.cgi $(ROOT_DIR)/cgibin/login-cgi/hostinfo2.cgi
endif
ifeq ($(USE_IUX_PACKAGE),y)
	@cd -P ../../cgi-src/iux/install && find . -mindepth 1 -maxdepth 1 \! -type l -exec ln -s /tmp/iux/{} ../../../rootfs/$(ROOT_DIR)/home/httpd/ \;
endif
IUXPC_TARGET_LIST+=iuxpc_cgi


# Help Section START 
ifeq ($(USE_EMBEDDED_HELP),y)
IUXPC_HELP_DIR:=$(IUXPC_PATH)/help/$(LANGUAGE_POSTFIX)/router
ifeq ($(USE_ROUTER_NAS),y)
IUXPC_NAS_HELP_DIR:=$(IUXPC_PATH)/help/$(LANGUAGE_POSTFIX)/nas
endif
iuxpc_help:
	@echo -e "\t\t--->Install HELP"
	@ln -s /home/httpd/help $(ROOT_DIR)/home/httpd/192.168.0.1/help
	@cp -ra $(IUXPC_HELP_DIR)/* $(ROOT_DIR)/home/httpd/help
ifeq ($(USE_ROUTER_NAS),y)
	@cp -ra $(IUXPC_NAS_HELP_DIR)/* $(ROOT_DIR)/home/httpd/help
endif
IUXPC_TARGET_LIST+=iuxpc_help

endif  #USE_EMBEDDED_HELP
# Help Section End 

iuxpc_msg:
	@echo -e "\t--->Install IUX PC"
iuxpc_ui: iuxpc_msg $(IUXPC_TARGET_LIST)

TARGET_LIST+=iuxpc_ui

