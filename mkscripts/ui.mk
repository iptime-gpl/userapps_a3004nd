JS_ROOT:=$(ROOT_DIR)/home/httpd/js
ifeq ($(USE_UTF8),y)
ifeq ($(LANGUAGE_POSTFIX),en)
LANG_FIX:=$(LANGUAGE_POSTFIX)
else
LANG_FIX:=utf8.$(LANGUAGE_POSTFIX)
endif
else
LANG_FIX:=$(LANGUAGE_POSTFIX)
endif

#ifeq ($(USE_PLANTYNET),y)
#LOGIN_MAIN:=login_main2
#else
LOGIN_MAIN:=login_main
#endif
ifeq ($(USE_WIRELESS_CGI),y)
MAIN_TYPE:=wireless
else
MAIN_TYPE:=wired
endif
LOGIN_MAIN_GIF:=$(LOGIN_MAIN).$(MAIN_TYPE).$(LANGUAGE_POSTFIX).gif


ifeq ($(USE_IUXPC),y)
include $(USERAPPS_ROOT)/mkscripts/ui_iuxpc.mk
else

ifeq ($(USE_MULTI_PLATFORM),y)
include $(USERAPPS_ROOT)/mkscripts/ui_nv.mk
include $(USERAPPS_ROOT)/mkscripts/ui_nvext.mk
else

ifeq ($(USE_WIFI_EXTENDER),y)
ifeq ($(USE_EXTENDER_UX),y)
include $(USERAPPS_ROOT)/mkscripts/ui_ext.mk
else
include $(USERAPPS_ROOT)/mkscripts/ui_nvext.mk
endif
else
ifeq ($(USE_UI2),n)
include $(USERAPPS_ROOT)/mkscripts/ui_nv_ui1.mk
else
include $(USERAPPS_ROOT)/mkscripts/ui_nv.mk
endif
endif

endif

endif #USE_IUXPC


ifeq ($(USE_EASY_ROUTER_SETUP_UI),y)
include $(USERAPPS_ROOT)/mkscripts/ui_routersetup.mk
else
ifeq ($(USE_1PORT_AP),y)
include $(USERAPPS_ROOT)/mkscripts/ui_apsetup.mk
endif
endif

ifeq ($(USE_IUX),y)
include $(USERAPPS_ROOT)/mkscripts/ui_iux.mk
endif

ifeq ($(USE_WIFI_EXTENDER_MOBILE_UI),y)
include $(USERAPPS_ROOT)/mkscripts/ui_extsetup.mk
endif

