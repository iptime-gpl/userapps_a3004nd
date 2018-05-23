include $(USERAPPS_ROOT)/config
-include $(USERAPPS_ROOT)/reg_config
include $(USERAPPS_ROOT)/rootfs/clone_info.mk
include $(USERAPPS_ROOT)/mkdefs
ifeq ($(USE_CUSTOM_VERSION),y)
include $(USERAPPS_ROOT)/rootfs/clones/$(TARGET)/version.mk
else
include $(USERAPPS_ROOT)/rootfs/version.mk
endif
include $(USERAPPS_ROOT)/lang_profile

ROOT_DIR:=root
PLUGIN_DIR:=./plugin

KERNEL_NAME:=./prebuilt/kernel/$(KERNEL_FILENAME)
ifneq ($(MODULE_DIR),)
MODULE_SRC_DIR:=./prebuilt/modules/$(MODULE_DIR)
MODULE_DEST_DIR:=$(ROOT_DIR)/lib/modules
endif

$(TARGET): target.fs image


mkdevs:
	@mkdir $(ROOT_DIR)/dev/mtd
	@sudo mknod -m664 $(ROOT_DIR)/dev/hwnat0 c 220 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/ram b 1 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/ram0 b 1 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/ram1 b 1 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/ram2 b 1 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/ram3 b 1 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtr0 c 250 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/0 c 90 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/0ro c 90 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/1 c 90 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/1ro c 90 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/2 c 90 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/2ro c 90 5
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/3 c 90 6
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/3ro c 90 7
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/4 c 90 8
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/4ro c 90 9
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/5 c 90 10
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/5ro c 90 11
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/6 c 90 12
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtd/6ro c 90 13

	@sudo mknod -m664 $(ROOT_DIR)/dev/flash0 c 200 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/ppp c 108 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/rdm0 c 253 0

	@mkdir $(ROOT_DIR)/dev/cua
	@sudo mknod -m664 $(ROOT_DIR)/dev/cua/0 c 5 64
	@sudo mknod -m664 $(ROOT_DIR)/dev/cua/1 c 5 65

	@mkdir $(ROOT_DIR)/dev/tts
	@sudo mknod -m664 $(ROOT_DIR)/dev/tts/0 c 4 64
	@sudo mknod -m664 $(ROOT_DIR)/dev/tts/1 c 4 65

	@sudo mknod -m664 $(ROOT_DIR)/dev/gpio c 252 0

	@mkdir $(ROOT_DIR)/dev/pts
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/0 c 136 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/1 c 136 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/2 c 136 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/3 c 136 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/4 c 136 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/5 c 136 5
	@sudo mknod -m664 $(ROOT_DIR)/dev/pts/6 c 136 6

	@mkdir $(ROOT_DIR)/dev/pty
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m0 c 2 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m1 c 2 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m2 c 2 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m3 c 2 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m4 c 2 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m5 c 2 5
	@sudo mknod -m664 $(ROOT_DIR)/dev/pty/m6 c 2 6

	@sudo mknod -m664 $(ROOT_DIR)/dev/ptmx c 5 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/console c 5 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/tty c 5 0

	@sudo mknod -m664 $(ROOT_DIR)/dev/urandom c 1 9
	@sudo mknod -m664 $(ROOT_DIR)/dev/random c 1 8
	@sudo mknod -m664 $(ROOT_DIR)/dev/full c 1 7
	@sudo mknod -m664 $(ROOT_DIR)/dev/zero c 1 5
	@sudo mknod -m664 $(ROOT_DIR)/dev/port c 1 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/null c 1 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/kmem c 1 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/mem c 1 1

	@mkdir $(ROOT_DIR)/dev/mtdblock
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/0 c 31 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/1 c 31 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/2 c 31 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/3 c 31 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/4 c 31 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/mtdblock/5 c 31 5

	@sudo mknod -m664 $(ROOT_DIR)/dev/ptyp0 c 2 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/ptyp1 c 2 1

	@sudo mknod -m664 $(ROOT_DIR)/dev/ttyS0 c 4 64
	@sudo mknod -m664 $(ROOT_DIR)/dev/ttyS1 c 4 65
	@sudo mknod -m664 $(ROOT_DIR)/dev/ttyp0 c 3 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/ttyp1 c 3 1

	@sudo mknod -m664 $(ROOT_DIR)/dev/fuse c 10 229
	@sudo mknod -m664 $(ROOT_DIR)/dev/misc/fuse c 10 229

	@sudo mknod -m664 $(ROOT_DIR)/dev/sda b 8 0
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda1 b 8 1
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda2 b 8 2
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda3 b 8 3
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda4 b 8 4
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda5 b 8 5
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda6 b 8 6
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda7 b 8 7
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda8 b 8 8
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda9 b 8 9
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda10 b 8 10
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda11 b 8 11
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda12 b 8 12
	@sudo mknod -m664 $(ROOT_DIR)/dev/sda13 b 8 13
ifeq ($(USE_CUPS),y)
	@mkdir $(ROOT_DIR)/dev/usb
	@chmod 777 $(ROOT_DIR)/dev/usb
	@sudo mknod -m666 $(ROOT_DIR)/dev/usb/lp0 c 180 0
endif


post_targetfs: mkdevs
	@echo -e "\t--->Post processing..." 
ifneq ($(USE_ROUTER_NAS),y)
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/net/phy
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/scsi
endif
ifneq ($(HW_NAT),y)
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/net/nat/hw_nat
endif
	@rm -rf $(ROOT_DIR)/lib/modules/net/wireless/lib80211.ko
	@rm -rf $(ROOT_DIR)/lib/modules/drivers/net/*.ko
	@rm -rf $(ROOT_DIR)/lib/modules/drivers/watchdog
	@rm -rf $(ROOT_DIR)/lib/modules/drivers/e1000

	@rm -rf $(ROOT_DIR)/lib/modules/kernel/net/wireless/lib80211.ko
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/net/*.ko
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/watchdog
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/e1000

	@rm -rf $(ROOT_DIR)/lib/modules/kernel/drivers/net/e1000/e1000.ko
	@rm -rf $(ROOT_DIR)/lib/modules/kernel/crypto/aes_generic.ko

	@rm -rf $(ROOT_DIR)/lib/modules/kernel/net/l2tp/*.ko
# Need to find out why etc_ro is needed 
#ifeq ($(LANG_DEFAULT_PROFILE),y)
#	@cp -ra clones/$(TARGET)/default.$(LANGUAGE_POSTFIX)/etc_ro $(ROOT_DIR)/
#else
#	@cp -ra clones/$(TARGET)/default/etc_ro $(ROOT_DIR)/
#endif
#	@rm -rf $(ROOT_DIR)/default/etc_ro
# End
ifeq ($(USE_FACTORY_SECTION),y)
	@cat clones/$(TARGET)/$(EEPROM_FILE) > $(ROOT_DIR)/default/Wireless/eeprom/EEPROM.all.bin
ifeq ($(USE_5G_WL),y)
	@cat clones/$(TARGET)/padding_eeprom >> $(ROOT_DIR)/default/Wireless/eeprom/EEPROM.all.bin
ifneq ($(EEPROM_FILE_5G),)
	@cat clones/$(TARGET)/$(EEPROM_FILE_5G) >> $(ROOT_DIR)/default/Wireless/eeprom/EEPROM.all.bin
else
	@cat clones/$(TARGET)/dummy_eeprom.bin >> $(ROOT_DIR)/default/Wireless/eeprom/EEPROM.all.bin
endif
	@cat clones/$(TARGET)/padding_eeprom >> $(ROOT_DIR)/default/Wireless/eeprom/EEPROM.all.bin
endif
endif
	@rm -rf `find ./$(ROOT_DIR) -name 'CVS'`
	@rm -rf $(ROOT_DIR)/sbin/iwconfig



ROOTFS_IMG=rootfs.lzma
CHIPSET_APP_INSTALL_DIR:=rt288x_app
ifeq ($(USE_KERNEL_3_X),y)
IPTABLES_BIN_PATH:=$(IPTABLES_PATH)
IPTABLES_LIB_PATH:=$(IPTABLES_PATH)/libiptc/.libs
IPTABLES_LIBS:=libip4tc.so.0
IPTABLES_LIB_PATH2:=$(IPTABLES_PATH)/.libs
IPTABLES_LIBS2:=libxtables.so
UPNPD_BIN_PATH:= $(USERAPPS_ROOT)/$(MINIUPNPD_DIR)
else
IPTABLES_BIN_PATH:=$(USERAPPS_ROOT)/iptables-1.3.8
IPTABLES_LIB_PATH:=
IPTABLES_LIBS:=
endif
IPTABLES_BINS:=iptables 

TNTFS_MODULE_PATH:=$(TNTFS_MODULE_NAME)
STRIP_OPTION:=-d
LDCONFIG_CMD:=
CLIB_DIR:=fs/mt7621/clib/gcc463
ifneq ($(SQUASHCMD),)
MAKE_FS_BIANRY_CMD:=./mksquashfs $(ROOT_DIR) $(ROOTFS_IMG) -comp $(SQUASHCMD_COMP) -all-root
else
MAKE_FS_BIANRY_CMD:=./mksquashfs_lzma-3.2 $(ROOT_DIR) $(ROOTFS_IMG) -all-root
endif

include $(USERAPPS_ROOT)/mkscripts/target.mk






# Image Section
FIRMWARE_NAME:=a3004nd_ml_10_022.bin
KERNELZ := zImage
COMP := lzma
FIRMWARE_TYPE:=kernel
CONFIG_MTD_KERNEL_PART_SIZ := $(KERNEL_SIZE)
BOOTIMG := ./prebuilt/boot/$(BOOT_FILENAME)

image:
	@echo "---------------------------------------------------------------------------------"
	@echo -n "1.Strip & Lzip kernel binary ..."
	$(OBJCOPY) -O binary -R .note -R .comment -S $(KERNEL_NAME) $(KERNELZ)
	@rm -f $(KERNELZ).*; $(COMP) -9 -f -S .$(COMP) $(KERNELZ)
	cp -ra $(KERNELZ).$(COMP) kernel.tmp
	@echo "Done"

	@echo "2. Add FS : $(FIRMWARE_NAME) ..."
ifeq    ($(findstring 0x, $(CONFIG_MTD_KERNEL_PART_SIZ)),0x)
	@SIZE=`wc -c $(KERNELZ).$(COMP) | awk '{ print $$1 }'` ; \
	MTD_KRN_PART_SIZE=`printf "%d" $(CONFIG_MTD_KERNEL_PART_SIZ)` ; \
	PAD=`expr $$MTD_KRN_PART_SIZE - 64 - $$SIZE` ; \
	dd if=/dev/zero count=1 bs=$$PAD 2> /dev/null | tr \\000 \\377 >> $(KERNELZ).$(COMP)
else
	@SIZE=`wc -c $(KERNELZ).$(COMP) | awk '{ print $$1 }'` ; \
	MTD_KRN_PART_SIZE=`printf "%d" 0x$(CONFIG_MTD_KERNEL_PART_SIZ)` ; \
	PAD=`expr $$MTD_KRN_PART_SIZE - 64 - $$SIZE` ; \
	dd if=/dev/zero count=1 bs=$$PAD 2> /dev/null | tr \\000 \\377 >> $(KERNELZ).$(COMP)
endif
	wc -c $(KERNELZ).$(COMP)
	# Original RootFs Size
	du -sb $(ROOT_DIR)
	# Compressed RootFs Size
	wc -c $(ROOTFS_IMG)
	# Padded Kernel Image + Compressed Rootfs Size
	cat $(ROOTFS_IMG) >> $(KERNELZ).$(COMP)
	wc -c $(KERNELZ).$(COMP)

	@echo "3. Making Firmware : $(FIRMWARE_NAME) ..."
ifeq    ($(NO_PADDING_FOR_ROOTFS),y)
	ISIZE=`wc -c $(KERNELZ).$(COMP) | awk '{print $$1}'` ; \
	RSIZE=`wc -c $(ROOTFS_IMG) | awk '{print $$1}'` ; \
	KRN_SIZE=`expr $$ISIZE - $$RSIZE + 64` ; \
	ENTRY=`readelf -h $(KERNEL_NAME) | grep "Entry" | awk '{print $$4}'` ; \
	./mkimage2 -A mips -O linux -T $(FIRMWARE_TYPE) -C $(COMP) -a $(LOAD_ADDRESS) -e $$ENTRY -k $$KRN_SIZE -n $(PRODUCT_ID) -d $(KERNELZ).$(COMP) $(FIRMWARE_NAME)
else
	# SPI flag -s option is added to indicate SPI flash support in this firmware 
	./mkimage -r -s -A mips -O linux -T $(FIRMWARE_TYPE) -C $(COMP) -a $(LOAD_ADDRESS) -e $(shell readelf -h $(KERNEL_NAME)  | grep "Entry" | awk '{print $$4}') -n $(PRODUCT_ID) -d $(KERNELZ).$(COMP) $(FIRMWARE_NAME)
endif
	@echo -n "4. Making Bootloader : $(PRODUCT_ID)_xboot.bin ..."
ifeq ($(USE_FACTORY_SECTION),y)
	./mkfirm -o clones/$(TARGET)/$(PRODUCT_ID)_xboot.bin -a $(PRODUCT_ID) -b $(BOOTIMG) -e clones/$(TARGET)/dummy.bin -m 0x20000 -f 1
else
	@cat clones/$(TARGET)/$(EEPROM_FILE) > clones/$(TARGET)/eeprom.bin 
	@cat clones/$(TARGET)/dummy_eeprom.bin >> clones/$(TARGET)/eeprom.bin 
	@cat clones/$(TARGET)/$(EEPROM_FILE_5G) >> clones/$(TARGET)/eeprom.bin
	@cat clones/$(TARGET)/dummy_eeprom.bin >> clones/$(TARGET)/eeprom.bin
	./mkfirm -o clones/$(TARGET)/$(PRODUCT_ID)_xboot.bin -a $(PRODUCT_ID) -b $(BOOTIMG) -e clones/$(TARGET)/eeprom.bin -m 0x20000 -f 1
endif
	@echo "Done"
	@echo -n "5. Making $(FIRMWARE_NAME).burn for Mass ... "
	@cp clones/$(TARGET)/$(PRODUCT_ID)_xboot.bin yboot.bin
	@./addpad yboot.bin 0x30000 0xff
	@cat yboot.bin > $(FIRMWARE_NAME).burn
ifeq ($(USE_FACTORY_SECTION),y)
	@cat clones/$(TARGET)/$(EEPROM_FILE) > clones/$(TARGET)/eeprom.bin 
	@cat clones/$(TARGET)/padding_eeprom >> clones/$(TARGET)/eeprom.bin 
ifneq ($(EEPROM_FILE_5G),)
	@cat clones/$(TARGET)/$(EEPROM_FILE_5G) >> clones/$(TARGET)/eeprom.bin
	@cat clones/$(TARGET)/padding_eeprom >> clones/$(TARGET)/eeprom.bin
else
	@cat clones/$(TARGET)/dummy_eeprom.bin >> clones/$(TARGET)/eeprom.bin
	@cat clones/$(TARGET)/padding_eeprom >> clones/$(TARGET)/eeprom.bin
endif
	@cat clones/$(TARGET)/eeprom.bin >> $(FIRMWARE_NAME).burn
endif
	@cat $(FIRMWARE_NAME) >> $(FIRMWARE_NAME).burn
	@rm -rf yboot.bin
	@./firmware_size_check.sh $(FIRMWARE_NAME) $(FLASH_SIZE)
	@echo "Done"
	@echo -n "6. Move $(FIRMWARE_NAME) to binary directory .. "

ifeq ($(USE_QA_TEST_FIRMWARE),y)
	@mv $(FIRMWARE_NAME).burn binary/$(FIRMWARE_NAME).qa.burn
	@mv $(FIRMWARE_NAME) binary/$(FIRMWARE_NAME).qa
else
	@mv $(FIRMWARE_NAME).burn binary/$(FIRMWARE_NAME).burn
	@mv $(FIRMWARE_NAME) binary/$(FIRMWARE_NAME)
endif
	@rm -rf tmp.bin


	@echo "Done"
	@echo "---------------------------------------------------------------------------------"

clean:
	rm -rf save.fs.gz initrd.gz
