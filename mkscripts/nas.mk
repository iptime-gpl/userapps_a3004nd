ifneq ($(USE_MOBILE_AP_PRODUCT),y)
NAS_SBIN_LIST += $(USERAPPS_ROOT)/nasapp/efmsrc/utils/serviced/serviced
endif

NAS_SBIN_LIST += $(USERAPPS_ROOT)/nasapp/efmsrc/utils/hotplug/usbumount
NAS_SBIN_LIST += $(USERAPPS_ROOT)/nasapp/efmsrc/utils/hotplug/usbmount
NAS_SBIN_LIST += $(USERAPPS_ROOT)/nasapp/efmsrc/utils/htdigest/htdigest
ifneq ($(USE_UPNP_RELAY),y)
NAS_SBIN_LIST += $(USERAPPS_ROOT)/miniupnpc-1.6/upnpc
endif
NAS_SBIN_LIST += $(PLUGIN_DIR)/defaultapp/sbin/*

nas_sbin:
	@echo -e "\t--->Install NAS SBIN"
	@cp -ra $(NAS_SBIN_LIST) $(ROOT_DIR)/sbin
NAS_TARGET_LIST+=nas_sbin


NAS_LIB_BIN:=$(USERAPPS_ROOT)/nasapp/efmsrc/lib/libnas.so $(USERAPPS_ROOT)/nasapp/efmsrc/lib/libprocess.so
naslib:
	@echo -e "\t\t--->Install NAS lib"
	@cp -ra $(NAS_LIB_BIN) $(ROOT_DIR)/lib
	@cp -rP $(PLUGIN_DIR)/naslib/lib/* $(ROOT_DIR)/lib
NAS_TARGET_LIST+=naslib


samba:
	@echo -e "\t\t--->Install Samba"
ifeq ($(USE_APP_PLUGIN_SAMBA),y)
	@ln -s /tmp/hdd/plugin/sbin/smbd $(ROOT_DIR)/sbin/smbd
	@ln -s /tmp/hdd/plugin/sbin/nmbd $(ROOT_DIR)/sbin/nmbd 
	@ln -s /tmp/hdd/plugin/sbin/smbpasswd $(ROOT_DIR)/sbin/smbpasswd 
else
	@cp -rP $(PLUGIN_DIR)/samba/sbin/* $(ROOT_DIR)/sbin
	@cp -rP $(PLUGIN_DIR)/samba/lib $(ROOT_DIR)
endif
NAS_TARGET_LIST+=samba


proftpd:
	@echo -e "\t\t--->Install Proftpd"
	@cp -rP $(PLUGIN_DIR)/proftpd/sbin/* $(ROOT_DIR)/sbin
NAS_TARGET_LIST+=proftpd


url:
	@echo -e "\t\t--->Install lighttpd"
	@cp -rP $(PLUGIN_DIR)/lighttpd/sbin/* $(ROOT_DIR)/sbin
	@cp -rP $(PLUGIN_DIR)/lighttpd/usr/lib/* $(ROOT_DIR)/usr/lib
ifeq ($(USE_IPDISK_SERVICE),y)
	@ln -s /sbin/lighttpd $(ROOT_DIR)/sbin/lighttpd_ipdisk
endif
NAS_TARGET_LIST+=url


ifeq ($(USE_EXFAT),y)
exfat:
	@echo -e "\t\t--->Install ExFAT"
	@cp -rP $(PLUGIN_DIR)/exfat/sbin/* $(ROOT_DIR)/sbin
	@cp -rP $(PLUGIN_DIR)/exfat/lib/* $(ROOT_DIR)/lib
NAS_TARGET_LIST+=exfat
endif


ifeq ($(USE_APM),y)

APM_LIB_BASE:=$(PLUGIN_DIR)/apmlib/lib
APACHE_BASE:=$(PLUGIN_DIR)/apache/usr/local/apache2
MYSQL_BASE:=$(PLUGIN_DIR)/mysql/usr/local/mysql

apm:
	@echo -e "\t\t--->Install APM"
# Apache 
	@mkdir -p $(ROOT_DIR)/usr/local
	@mkdir -p $(ROOT_DIR)/usr/X11R6
ifeq ($(USE_APM_PLUGIN),y)
	@ln -s /tmp/hdd/plugin/usr/local/apache2 $(ROOT_DIR)/usr/local/apache2
	@ln -s /tmp/hdd/plugin/usr/local/mysql $(ROOT_DIR)/usr/local/mysql
	@ln -s /tmp/hdd/plugin/lib $(ROOT_DIR)/usr/X11R6/lib
else
	@mkdir -p $(ROOT_DIR)/usr/local/apache2
	@mkdir -p $(ROOT_DIR)/usr/local/mysql
	@mkdir -p $(ROOT_DIR)/usr/X11R6/lib
	@cp -raP $(APM_LIB_BASE)/* $(ROOT_DIR)/usr/X11R6/lib
	@cp -raP $(APACHE_BASE)/* $(ROOT_DIR)/usr/local/apache2/
	@cp -raP $(MYSQL_BASE)/* $(ROOT_DIR)/usr/local/mysql/
endif
NAS_TARGET_LIST+=apm
endif


ifeq ($(USE_AFP),y)
afp:
	@echo -e "\t\t--->Install AFP"
	@mkdir -p /tmp/usr/local/etc
	@mkdir -p $(ROOT_DIR)/usr/local
	@ln -s /tmp/usr/local/etc $(ROOT_DIR)/usr/local/etc
	@mkdir -p $(ROOT_DIR)/usr/local/lib
	@mkdir -p $(ROOT_DIR)/usr/local/sbin
	@cp -rP $(PLUGIN_DIR)/afp/usr/local/lib/* $(ROOT_DIR)/lib/
	@cp -rP $(PLUGIN_DIR)/afp/usr/local/sbin/* $(ROOT_DIR)/usr/local/sbin/

NAS_TARGET_LIST+=afp
endif

ifeq ($(USE_DLNA),y)
dlna:
	@echo -e "\t\t--->Install DLNA"
ifeq ($(USE_APP_PLUGIN),y)
	@ln -s /tmp/hdd/plugin/lib/libvorbis.so.0 $(ROOT_DIR)/lib/libvorbis.so.0
	@ln -s /tmp/hdd/plugin/lib/libogg.so.0 $(ROOT_DIR)/lib/libogg.so.0
	@ln -s /tmp/hdd/plugin/lib/libsqlite3.so.0 $(ROOT_DIR)/lib/libsqlite3.so.0
	@ln -s /tmp/hdd/plugin/lib/libexif.so.12 $(ROOT_DIR)/lib/libexif.so.12
	@ln -s /tmp/hdd/plugin/lib/libFLAC.so.8 $(ROOT_DIR)/lib/libFLAC.so.8
	@ln -s /tmp/hdd/plugin/lib/libid3tag.so.0 $(ROOT_DIR)/lib/libid3tag.so.0
	@ln -s /tmp/hdd/plugin/sbin/minidlna $(ROOT_DIR)/sbin/minidlna
else
	@cp -rP $(PLUGIN_DIR)/dlna/lib/* $(ROOT_DIR)/lib/
	@cp -rP $(PLUGIN_DIR)/dlna/sbin/minidlna $(ROOT_DIR)/sbin/
endif
ifeq ($(USE_MINISSDP),y)
ifeq ($(MINISSDP_BIN_PATH),)
	@cp -rP  $(USERAPPS_ROOT)/minissdpd-1.2.20140906/minissdpd $(ROOT_DIR)/sbin/
else
	@cp -rP  $(MINISSDP_BIN_PATH)/minissdpd $(ROOT_DIR)/sbin/
endif
endif

NAS_TARGET_LIST+=dlna
endif


ifeq ($(USE_TORRENT),y)
torrent:
	@echo -e "\t\t--->Install Torrent"
ifeq ($(USE_APP_PLUGIN),y)
	@ln -s /tmp/hdd/plugin/lib/libssl.so.1.0.0 $(ROOT_DIR)/lib/libssl.so.1.0.0
	@ln -s /tmp/hdd/plugin/lib/libcrypto.so.1.0.0 $(ROOT_DIR)/lib/libcrypto.so.1.0.0
	@ln -s /tmp/hdd/plugin/lib/libevent-2.0.so.5 $(ROOT_DIR)/lib/libevent-2.0.so.5
	@ln -s /tmp/hdd/plugin/lib/libcurl.so.4 $(ROOT_DIR)/lib/libcurl.so.4
#	@ln -s /tmp/hdd/plugin/lib/libz.so.1 $(ROOT_DIR)/lib/libz.so.1
	@ln -s /tmp/hdd/plugin/sbin/transmission-daemon $(ROOT_DIR)/sbin/transmission-daemon
	@mkdir -p $(ROOT_DIR)/usr/share/transmission
	@ln -s /tmp/hdd/plugin/usr/share/transmission/web $(ROOT_DIR)/usr/share/transmission/web
else
	@cp -rP $(PLUGIN_DIR)/transmission/lib/* $(ROOT_DIR)/lib/
	@cp -rP $(PLUGIN_DIR)/transmission/sbin/transmission-daemon $(ROOT_DIR)/sbin/
	@mkdir -p $(ROOT_DIR)/usr/share/
	@cp -rP $(PLUGIN_DIR)/transmission/usr/share/transmission $(ROOT_DIR)/usr/share/
endif
NAS_TARGET_LIST+=torrent
endif


ifeq ($(USE_ITUNES_SERVER),y)
itunes:
	@echo -e "\t\t--->Install iTunes"
ifeq ($(USE_APP_PLUGIN),y)
	@ln -s /tmp/hdd/plugin/lib/libgdbm.so.3 $(ROOT_DIR)/lib/libgdbm.so.3
	@ln -s /tmp/hdd/plugin/lib/libid3tag.so.0 $(ROOT_DIR)/lib/libid3tag.so.0
	@ln -s /tmp/hdd/plugin/sbin/mt-daapd $(ROOT_DIR)/sbin/mt-daapd
else
	@cp -rP $(PLUGIN_DIR)/mt-daapd/lib/* $(ROOT_DIR)/lib/
	@cp -rP $(PLUGIN_DIR)/mt-daapd/sbin/mt-daapd $(ROOT_DIR)/sbin/
endif
NAS_TARGET_LIST+=itunes
endif


ifeq ($(USE_CUPS),y)
cupsd:
	@echo -e "\t\t--->Install CUPSD"
	@cp -rP $(PLUGIN_DIR)/cups/lib/ $(ROOT_DIR)
	@cp -rP $(PLUGIN_DIR)/cups/bin/ $(ROOT_DIR)
	@cp -rP $(PLUGIN_DIR)/cups/etc/cups $(ROOT_DIR)/default/etc/cups
	@cp -rP $(PLUGIN_DIR)/cups/usr/lib/cups $(ROOT_DIR)/usr/lib/cups

NAS_TARGET_LIST+=cupsd
endif


ifeq ($(USE_CLOUD_BACKUP),y)
cloud:
	@echo -e "\t\t--->Install Rsync"
	@cp -rP $(PLUGIN_DIR)/rsync/sbin/* $(ROOT_DIR)/sbin/
#	@$(STRIP)  $(ROOT_DIR)/sbin/rsync
NAS_TARGET_LIST+=cloud
endif

ntfs:
ifeq ($(USE_TUXERA_NTFS),y)
	@echo -e "\t\t--->Install Tuxera NTFS"
	@cp -ra ./prebuilt/modules/$(TNTFS_MODULE_PATH) $(ROOT_DIR)/lib/modules/tntfs.ko
else
	@echo -e "\t\t--->Install NTFS-3G"
	@cp $(PLUGIN_DIR)/ntfs-3g/sbin/ntfs-3g $(ROOT_DIR)/sbin
endif
NAS_TARGET_LIST+=ntfs



PLUGIN_FS_SIZE:=131072
PLUGIN_FS:=plugin.fs

ifeq ($(USE_APP_PLUGIN),y)
plugin_app:
	@echo -e "\t\t--->Install Plugin FS"
	@rm -rf $(PLUGIN_FS)
	@rm -rf $(PLUGIN_FS).gz
	@dd if=/dev/zero of=$(PLUGIN_FS) bs=1k count=$(PLUGIN_FS_SIZE)&>>mk.log
	@/sbin/mke2fs -Fm0 $(PLUGIN_FS) $(PLUGIN_FS_SIZE)&>>mk.log
	@gzip -9 -n $(PLUGIN_FS)&>>mk.log
	@cp -ra plugin.fs.gz $(ROOT_DIR)/default/
	@cp -ra $(PLUGIN_DIR)/opkg/sbin/opkg-cl $(ROOT_DIR)/sbin

NAS_TARGET_LIST+=plugin_app
endif

ifeq ($(USE_PLUGIN_MENU),y)
plugin_menu:
	@echo -e "\t\t--->Install Plugin Arch"
	@rm -rf $(PLUGIN_FS)
	@rm -rf $(PLUGIN_FS).gz
	@dd if=/dev/zero of=$(PLUGIN_FS) bs=1k count=$(PLUGIN_FS_SIZE)&>>mk.log
	@/sbin/mke2fs -Fm0 $(PLUGIN_FS) $(PLUGIN_FS_SIZE)&>>mk.log
	@gzip -9 -n $(PLUGIN_FS)&>>mk.log
	@cp -ra plugin.fs.gz $(ROOT_DIR)/default/
	@cp -ra $(PLUGIN_DIR)/opkg/sbin/opkg-cl $(ROOT_DIR)/sbin
NAS_TARGET_LIST+=plugin_menu
endif


ifeq ($(USE_USB_TETHERING),y)
usb_tethering:
	@echo -e "\t\t--->Install USB Tethering"
	@ln -s /sbin/dhcpd $(ROOT_DIR)/sbin/usbdhclient
NAS_TARGET_LIST+=usb_tethering
endif


nas_app: $(NAS_TARGET_LIST)
	@ln -s /tmp/mnt $(ROOT_DIR)/mnt
	@cp -ra $(CONF_DIR)/html/gifs/nas/* $(ROOT_DIR)/home/httpd/images2/
ifeq ($(USE_DUAL_USB),y)
	@cp -ra $(CONF_DIR)/html/gifs/misc/usb*.png $(ROOT_DIR)/home/httpd/images2/
endif

TARGET_LIST+=nas_app



