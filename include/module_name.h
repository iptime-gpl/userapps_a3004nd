#ifdef USE_KERNEL_2_6

#define CT_MOD_BNET      	"nf_conntrack_bnet.ko"
#define CT_MOD_FTP        	"nf_conntrack_ftp.ko"
#define CT_MOD_IRC      	"nf_conntrack_irc.ko"
#define CT_MOD_PPTP     	"nf_conntrack_pptp.ko"
#define CT_MOD_PROTO_GRE	"nf_conntrack_proto_gre.ko"
#define CT_MOD_TFTP         	"nf_conntrack_tftp.ko"
#define CT_MOD_H323     	"nf_conntrack_h323.ko"
#define CT_MOD_IPSEC     	"nf_conntrack_proto_esp.ko"
#define CT_MOD_ISPFAKE          "nf_conntrack_ispfake.ko"

#define NAT_MOD_BNET         	"nf_nat_bnet.ko"
#define NAT_MOD_FTP     	"nf_nat_ftp.ko"
#define NAT_MOD_IRC        	"nf_nat_irc.ko"
#define NAT_MOD_PPTP         	"nf_nat_pptp.ko"
#define NAT_MOD_PROTO_GRE    	"nf_nat_proto_gre.ko"
#define NAT_MOD_TFTP    	"nf_nat_tftp.ko"
#define NAT_MOD_H323           	"nf_nat_h323.ko"
#define NAT_MOD_IPSEC          	"nf_nat_proto_esp.ko"
#define NAT_MOD_ISPFAKE         "nf_nat_ispfake.ko"

#define NETDETECT_MOD     	"xt_NETDETECT.ko"
#define NETDETECT_HANDLE_MOD  	"xt_NETDETECT_handle.ko"

#define H323RAS_MOD         	"xt_H323RAS.ko"

#else

#define CT_MOD_BNET      	"ip_conntrack_bnet.o"
#define CT_MOD_FTP        	"ip_conntrack_ftp.o"
#define CT_MOD_IRC      	"ip_conntrack_irc.o"
#define CT_MOD_PPTP     	"ip_conntrack_pptp.o"
#define CT_MOD_PROTO_GRE	"ip_conntrack_proto_gre.o"
#define CT_MOD_TFTP         	"ip_conntrack_tftp.o"
#define CT_MOD_H323     	"ip_conntrack_h323.o"
#define CT_MOD_IPSEC     	"ip_conntrack_ipsec.o"

#define NAT_MOD_BNET         	"ip_nat_bnet.o"
#define NAT_MOD_FTP     	"ip_nat_ftp.o"
#define NAT_MOD_IRC        	"ip_nat_irc.o"
#define NAT_MOD_PPTP         	"ip_nat_pptp.o"
#define NAT_MOD_PROTO_GRE    	"ip_nat_proto_gre.o"
#define NAT_MOD_TFTP    	"ip_nat_tftp.o"
#define NAT_MOD_H323           	"ip_nat_h323.o"
#define NAT_MOD_IPSEC          	"ip_nat_ipsec.o"
#define NAT_MOD_ISPFAKE         "ip_nat_ispfake.o"

#define NETDETECT_MOD     	"ipt_NETDETECT.o"
#define NETDETECT_HANDLE_MOD  	"ipt_NETDETECT_handle.o"

#define H323RAS_MOD         	"ipt_H323RAS.o"

#define DSTMATCH_MOD          	"ipt_dstmatch.o"

#endif
