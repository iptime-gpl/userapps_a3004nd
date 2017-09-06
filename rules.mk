DEP_DIR:= $(USERAPPS_ROOT)
LANG_CONFIG:=$(USERAPPS_ROOT)/lang_config
MENU_CONFIG:=$(USERAPPS_ROOT)/menu_config
CUSTOM_CONFIG:=$(USERAPPS_ROOT)/custom_config
LOGIN_CONFIG:=$(USERAPPS_ROOT)/login_config
APPS_CONFIG:=$(USERAPPS_ROOT)/apps_config
WIRELESS_CONFIG:=$(USERAPPS_ROOT)/wireless_config
PYTHON?=python3.5

clean_compile:
	@for i in $(DEP_DIR) ; do \
	echo -e "\033[31m$$i\033[0m"; \
	$(MAKE) -C $$i clean; \
	done

compile_all:
	@for i in $(DEP_DIR) ; do \
	echo "========================================================================";\
	echo -e "\033[32m$$i\033[0m"; \
	echo "------------------------------------------------------------------------";\
	$(MAKE) -C $$i; \
	done

