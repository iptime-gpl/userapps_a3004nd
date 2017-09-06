$(info include $(notdir $(lastword $(MAKEFILE_LIST))))

include clone_info.mk
-include kernel_info.mk

MAKE_KERNEL:= __kernel__ __install__
.PHONY : kernel $(MAKE_KERNEL)
kernel: $(MAKE_KERNEL)

__kernel__:
	yes "" | $(MAKE) -C $(KERNEL_PATH) oldconfig
	[ $(shell sed -n 's/^VERSION\s*=\s*\([0-9]\).*/\1/p' $(KERNEL_PATH)/Makefile) -ge 3 ] || $(MAKE) dep -C $(KERNEL_PATH) 
	$(MAKE) -C $(KERNEL_PATH)

__install__:
	@mkdir -p prebuilt/kernel
	@cp $(KERNEL_PATH)/vmlinux prebuilt/kernel/$(KERNEL_FILENAME)
