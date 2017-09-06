/************** LOG ******************************/
#define SYSLOG_MSG_RESTART			"�����ƫ������ ( Version: %s )"
#define SYSLOG_MSG_ADMIN_RESTART		"η���������ƫ������Ѫ���"
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"η�����ի�?�૦����?�򫢫ë׫�?�Ȫ���"
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"η����������ѫ���?�ɪ�?�ڪ���"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"η����?ݻ IP��?�ڪ���"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"η���� DHCP ��?��?��?������"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"η���� DHCP ��?��?����򭪹��"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"η��������?�ͫë����Ҫ�?�ڪ���"

#ifndef USE_JUST_AP
#define SYSLOG_MSG_DHCPC_RCV_IP			"DHCP Client(WAN)�� IP������"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"DHCP Server(WAN)?�ͪʪ�"
#else
#define SYSLOG_MSG_DHCPC_RCV_IP                 "DHCP Client�� IP������"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT         "DHCP Server ?�ͪʪ�"
#endif

#define SYSLOG_MSG_PPP_CONNECTED		"PPP����?����� IP������"
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"PPP�����������ӫѫ���?�ɪ��᪷���ʪ�"
#define SYSLOG_MSG_PPP_DISCONNECTED		"PPP��?���?"
#define SYSLOG_MSG_PPP_NO_REPONSE		"PPPoE ��?��?��?�ͪ��ʪ�"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"DHCP ��?��?�� IP ��?����"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"η����������Ҫ�?��"

#define SYSLOG_MSG_DDNS_SUCCESS			"DDNS ��?����"
#define SYSLOG_MSG_DDNS_FAILED			"DDNS ��?����"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "SMTP ��?�Ъ�̸�Ī���ʪ��� E-mail��������" 
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "SYSLOG ?֧��ͱ����η��� E-mail ������"
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          	"NETDETECT ?֧��ͱ����η��� E-mail ������"
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"SMTP �����������?���� - ��?۰��:"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "η��� E-mail ���Ҫ����ުêƪ���"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "��?�뫵?��?��̸�Ī���ʪ��ƫ�?����������"
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "��?�뫵?��?����?�Ǫ��ʪ��ƫ�?����������"

#define SYSLOG_STATIC_IP                         "ͳ�� IP"
#define SYSLOG_DYN_IP                            "���� IP"
#define SYSLOG_PPPOE                             "PPPoE ۰��"
#define SYSLOG_PPTP                	         "PPTP IP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "����������� - �ի�����٣ : "
#define SYSLOG_CONFIG_RESTORE_FAILED		 "���ҫի����몬�᪷���ʪ�������������� - �ի�����٣ : "
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "����������� - �ի�����٣ : ��������ƪʪ�"

#define SYSLOG_PPTP_CONNECTED			 "PPTP VPN ��?���� - ��������� :  %s / %s" 
#define SYSLOG_PPTP_DISCONNECTED		 "PPTP VPN ��?�? - ��������� : " 


#define SYSLOG_MSG_UPNP_START 	"η���� UPNP�򫹫�?�Ȫ���(�����ƫ������)"
#define SYSLOG_MSG_UPNP_STOP 	"η���� UPNP����򭪹��"
#define SYSLOG_MSG_SAVECONF 	"��ƪ����Ҫ�������� "

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "η��������?�ͫëȪ���𶪹��"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "η��������?�ͫëȪ���?����"

#define SYSLOG_MSG_FAKEDNS_START 	"η���� '����?���������?' Ѧ�������Ҫ���"
#define SYSLOG_MSG_FAKEDNS_STOP 	"η���� '����?���������?' Ѧ������𶪹��"

#define SYSLOG_EMAIL_SEND_TIMEOUT       "η��� E-mail ����������(��?������Φ) "

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 ����?�ͫë���?�?�� WAN2�˫Ыë����ë�"
#define SYSLOG_MSG_WAN1_OK	"WAN1 ����?�ͫë���?���"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 ����?�ͫë���?�?�� WAN1�˫Ыë����ë�"
#define SYSLOG_MSG_WAN2_OK	"WAN2 ����?�ͫë���?���"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "������ߤ?�ت�?�ڪ���"
#define SYSLOG_MSG_CHANGE_WAN_REBOOT "η�������� WAN ���Ҫ�?�ڪ���"

#define SYSLOG_MSG_NAT_ON	"η���� NATѦ����ON�˪���"
#define SYSLOG_MSG_NAT_OFF	"η���� NATѦ����OFF�˪���"

#define SYSLOG_MSG_DHCPC_LEASE "��ݻ IP ��󫿫�������Φ: ����?�ͫë���?�?" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "?ݻ�ͫëȫ�?��������� DHCP ��?��?��?�㪵��ƫ�?���� DHCP��?��?Ѧ������?���롣"
#define SYSLOG_MSG_DHCP_SERVER_RESUME "?ݻ�ͫëȫ�?������ DHCP��?��?��̸�Ī���ʪ��ê����ᡢ��?���� DHCP��?��?Ѧ�����?�����롣"


#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI download error(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI auth error(1)"
#define SYSLOG_MSG_KAID_RESTARTED "KAI ���󫸫������Ѫ��ު���"

#define SYSLOG_IP_CONFLICT "IP�˫ȫ�֫����򱪵��ު���"
#define SYSLOG_RECEIVE_PRIVATE_IP "���� IP �?Ѧ���˪�ê����� IP����ݻ IP�����Ҫ���ʪ�"
#define SYSLOG_RECEIVE_INTERNAL_IP "?ݻ IP ���������ݻIP����?����ƫ���?�ͫë���?��ʦ"

#define SYSLOG_MSG_MAKE_SCHED_1 "����?�ͫëȪ򪷪誦���몿��˪ϫ�?��η���˪�����請��������"
#define SYSLOG_MSG_MAKE_SCHED_2 "�Ѫϫ���?�ͫëȪ����ĪǪ��ʪ�����Ǫ���"

#define SYSLOG_MSG_IPCONFLICT  "IP �ȫ�֫���� :" 

#define LOGIN_LOG_WRITE_TRUE "IP : %s LOGIN ����"
#define LOGIN_LOG_WRITE_FAIL "IP : %s LOGIN ����"

#define SYSLOG_MSG_MASTER_AP_FOUND "�ޫ���? AP ?������"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "�ޫ���? AP ?������"
#define SYSLOG_MSG_NO_MASTER_BEACON "�ޫ���? AP�Ǫ� WDS��?��﷪��"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] �ޫ���? AP�Ϋ����ͫ몬?�ڪ���ު�����"


#define SYSLOG_MSG_WPS_OK	"WPS ����?�Ǫ���?����"
#define SYSLOG_MSG_WPS_FAIL	"WPS ����?�Ǫ���?���� [Error Code:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "WAN ��?�Ȫ�����IP(%s) ��?����"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "WAN ��?�Ȫ�?ݻ�ͫëȫ�?�����Ҫ�?洪� IP(%s) ��?����"

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "DHCP��������?�ȫ��������ɫ쫹?�� [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "DHCP ������ IP���ɫ쫹?�� [ %s(%s) -> %s(%s) ]"

#define SMTP_MESSAGE_STRING "SMTP Message"


#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "PPPoE ��������?��˪�ê���?����?�����: %s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "PPPoE ��������?��˪�ê���?����򭪵���: %s"

#define SYSLOG_SMART_QOS_NEW	"Smart QoS : %s ��ʥ"
#define SYSLOG_SMART_QOS_DEL	"Smart QoS : %s ���"

#define SYSLOG_DDNS_SERVER_CONNECTED "DDNS ��?��?����?����" 
#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "WAN%d ��?�Ȫ�ڪ���ܫ�󫯪����?����� DHCPѦ��������Ѫ��롣"


#define SYSLOG_SAVE_FAILED "������?�������ʪ��ƪ����߾�����Ҫ�����Ǫ��ު���"


#define DCS_CHANNEL_CHANGED_MSG "Channel is changed from %d to %d by Dynamic Channel Searching."
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Wireless Scheduler] %s wireless is resumed."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[[Wireless Scheduler] %s wireless is stopped."
#endif

