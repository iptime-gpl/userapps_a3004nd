include $(USERAPPS_ROOT)/mkdefs

EXEC=igmpproxy
IGMP_PROXY_OBJ= igmpproxy.o config.o confread.o request.o udpsock.o mcgroup.o rttable.o \
		igmp.o ifvc.o callout.o kern.o syslog.o lib.o mroute-api.o mc_switch.o

CFLAGS += -I$(ROOTDIR)/$(LINUXDIR)/drivers/net/raeth -I$(USERAPPS_ROOT)/include

ifeq ($(USE_RTL_8309M),y)
IGMP_PROXY_OBJ+= rtl8309m.o
endif

ifeq ($(USE_NO_WIRED_IGMP_SNOOPING),y)
IGMP_PROXY_OBJ+= dummy.o
else

ifeq ($(USE_RT305X),y)
ifneq ($(USE_RTL8366S),y)
IGMP_PROXY_OBJ+= rt3052.o rt3052_reg.o
endif
endif

ifeq ($(USE_RTL8366S),y)
IGMP_PROXY_OBJ+= rtl8366s.o
CFLAGS += -I$(USERAPPS_ROOT)/rt288x_app/lib/rtl8366s
endif

ifeq ($(USE_IP3210),y)
IGMP_PROXY_OBJ+= ip3210.o
endif

ifeq ($(USE_QCA),y)
IGMP_PROXY_OBJ+= shiva.o
endif

ifeq ($(USE_BCM5354),y)
ifeq ($(USE_BCM5356),y)
IGMP_PROXY_OBJ+= bcm5354.o
CFLAGS += -I$(USERAPPS_ROOT)/bcmapp/include
else
IGMP_PROXY_OBJ+= dummy.o
endif
endif

ifeq ($(USE_RTL8306S),y)
IGMP_PROXY_OBJ+= dummy.o
endif

ifeq ($(USE_KS8695),y)
IGMP_PROXY_OBJ+= dummy.o
endif

ifeq ($(USE_RTL8370),y)
IGMP_PROXY_OBJ+= rtl8370.o
CFLAGS += -I$(USERAPPS_ROOT)/rt288x_app/lib/rtl8370
endif

ifeq ($(USE_RTL8367B),y)
IGMP_PROXY_OBJ+= rtl8370.o
CFLAGS += -I$(USERAPPS_ROOT)/rt288x_app/lib/rtl8367b
endif

ifeq ($(USE_MT7620),y)
IGMP_PROXY_OBJ+= rt3052_reg.o

ifeq ($(USE_MT7621),y)
IGMP_PROXY_OBJ+= mt7621.o
CFLAGS += -DCONFIG_RALINK_MT7621
SWITCH_OBJ:=1
#-DCONFIG_WAN_AT_P0
endif

ifeq ($(USE_MT7623),y)
IGMP_PROXY_OBJ+= mt7621.o
CFLAGS += -DCONFIG_RALINK_MT7621
SWITCH_OBJ:=1
endif

ifeq ($(USE_MT7628),y)
IGMP_PROXY_OBJ+= rt3052.o
SWITCH_OBJ:=1
endif


ifneq ($(SWITCH_OBJ),1)
IGMP_PROXY_OBJ+= mt7620.o
CFLAGS += -DCONFIG_RALINK_MT7620
endif

endif

ifeq ($(USE_MV6281),y)
IGMP_PROXY_OBJ+= salsa2.o
CFLAGS += -I$(USERAPPS_ROOT)/mv6281_app/lib/salsa2
endif


endif

all: $(EXEC)

igmpproxy: build.h $(IGMP_PROXY_OBJ)
	$(CC) $(LDFLAGS) -o $@ $(IGMP_PROXY_OBJ)  $(CGI_LIB)
	$(STRIP) igmpproxy


romfs:
	$(ROMFSINST) /bin/$(EXEC)
	$(ROMFSINST) /bin/igmpproxy.sh

clean:
	rm -f *.o *.asm build.h $(EXEC)  

build.h	:  
	echo '#define BUILD "' `date +%y%m%d` '"' >build.h
