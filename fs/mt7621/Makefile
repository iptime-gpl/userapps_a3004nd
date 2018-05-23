export USERAPPS_ROOT:=$(abspath $(dir $(lastword $(MAKEFILE_LIST)))/../..)
TARGET:=a3004nd

$(shell ln -sf clones/$(TARGET)/clone_info.mk clone_info.mk)
$(shell echo "$(TARGET)" > $(USERAPPS_ROOT)/.product_name)

all: compile_all image

include $(USERAPPS_ROOT)/mkdefs
include $(USERAPPS_ROOT)/rules.mk

image:
	rm -rf temp.fs.gz save.fs.gz
	$(MAKE) -f irules.mk TARGET=$(TARGET)

kernel:
	$(MAKE) -f kernel.mk

clean: 
	rm -rf cramfs.img initrd.gz initrd.img rom.cramfs pmon.img zImage.img
	rm -rf clone_info.mk temp.fs.gz
	sudo rm -rf ./root

clean_all: clean_compile clean
	rm -rf *.bin *.img *.gz *.cramfs
	sudo rm -rf ./root


