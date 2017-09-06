TCOBJ=tc.o tc_qdisc.o tc_class.o tc_filter.o tc_util.o 
#ifneq ($(SIZE_OPTI_L3),y)
TCOBJ += m_estimator.o m_police.o 
#endif

include ../Config

TCMODULES :=
# TCMODULES += q_fifo.o
TCMODULES += q_sfq.o
# TCMODULES += q_red.o
TCMODULES += q_prio.o
# TCMODULES += q_tbf.o
# TCMODULES += q_cbq.o
# TCMODULES += f_rsvp.o
# TCMODULES += f_u32.o
# TCMODULES += f_route.o
TCMODULES += f_fw.o
ifeq ($(TC_CONFIG_DIFFSERV),y)
#   TCMODULES += q_dsmark.o
#   TCMODULES += q_gred.o
#   TCMODULES += f_tcindex.o
#   TCMODULES += q_ingress.o
endif

#TCMODULES += q_csz.o
TCMODULES += q_htb.o
#TCMODULES += q_hpfq.o
#TCMODULES += q_hfsc.o

TCOBJ += $(TCMODULES)

TCLIB := tc_core.o
# TCLIB += tc_red.o
# TCLIB += tc_cbq.o
#ifneq ($(SIZE_OPTI_L3),y)
TCLIB += tc_estimator.o
#endif

#ifeq ($(SIZE_OPTI_L3),y)
#LDLIBS += -L. -ltc
#else
LDLIBS += -L. -ltc -lm 
#endif
# -ldl

LDFLAGS += -Wl,-export-dynamic

all: libtc.a tc strip

tc: $(TCOBJ) $(LIBNETLINK) $(LIBUTIL) $(TCLIB)

strip:
	$(STRIP) tc

libtc.a: $(TCLIB)
	$(AR) rcs $@ $(TCLIB)

clean:
	rm -f $(TCOBJ) $(TCLIB) libtc.a tc *.o

