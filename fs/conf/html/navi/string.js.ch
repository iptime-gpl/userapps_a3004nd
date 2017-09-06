<script>

var TAB_CODE=9
var DEL_CODE=46 
var BS_CODE=8
var SP_CODE=32
var DOT_CODE=190
var DOT2_CODE=110

var IDX_ON=0
var IDX_OFF=1

var IDX_AP_MODE=0
var IDX_CBRIDGE_MODE=1
var IDX_WWAN_MODE=2
var IDX_KAI_MODE=3
var IDX_MBRIDGE_MODE=4


var WIRELESS_AP_MODE=0;
var WIRELESS_CBRIDGE_MODE=1;
var WIRELESS_CWAN_MODE=2;
var WIRELESS_KAI_MODE=3;
var WIRELESS_MBRIDGE_MODE=4;

var KAID_MODE_INIT=0  // ap mode
var KAID_MODE_PSP=0 // psp kai
var KAID_MODE_NORMAL=0 // xbox kai

var AUTH_OPEN=1
var AUTH_KEY=2
var AUTH_AUTO=3
var AUTH_WPA=4
var AUTH_WPAPSK=5
var AUTH_OPEN8021X=6
var AUTH_WPANONE=7
var AUTH_WPA2=8
var AUTH_WPA2PSK=9
var AUTH_WPAPSKWPA2PSK=10
var AUTH_NOCHANGE=100

var IDX_NOENC=0
var IDX_WEP64=1
var IDX_WEP128=2
var IDX_TKIP=3
var IDX_AES=4
var IDX_TKIPAES=5

var ENCRYPT_OFF=0
var ENCRYPT_64=1
var ENCRYPT_128=2
var ENCRYPT_TKIP=3
var ENCRYPT_AES=4
var ENCRYPT_TKIPAES=5

var KEY_STRING=0;
var KEY_HEX=1;

var IDX_KEY_STRING=0;
var IDX_KEY_HEX=1;

var REGION_USA=1;
var REGION_JAPAN=2;

var DMZTWINIP_MODE_DMZ=1;
var DMZTWINIP_MODE_TWINIP=2;

var QOS_SHARING_BOUNDED=2;
var QOS_SHARING_BORROW=3;


var MSG_RESTART_CONFIRM_DEFAULT="ϵͳ���ָ�������Ĭ��ֵ����ȷ��������?";
var MSG_RESTART_CONFIRM_UPNP="����UPNP����ϵͳ������������ȷ������������"
var MSG_RESTART_CONFIRM_REBOOT="ϵͳ����������ȷ��������";
var MSG_RESTART_CONFIRM_CHANGE_LANIP="���ľ�����IP��ַϵͳ����������ȷ��������"
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP="���ľ�����IP��ַϵͳ����������ȷ��������"

var MSG_RESTART_CONFIRM_RESTORE="�ָ�����ϵͳ����������ȷ��������";
var MSG_RESTART_CONFIRM_NAT="����NAT����ϵͳ����������ȷ��������"
var MSG_RESTART_CONFIRM_WIRELESS='��������ģʽϵͳ���������㳋��������';                   
var MSG_KAID_MODE_CHANGE_WARNING='����KAIģʽϵͳ���������㳋��������';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='��������ģʽϵͳ���������㳋��������';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='��������ģʽϵͳ���������㳋��������';
var MSG_TWINIP_CONFIRM_WARNING='System will restart to apply Twin IP configuration.\nAre you sure to continue ? ';

// common
var MODIFY_OP='����'
var MSG_INVALID_HWADDR="����MAC��ַ"
var MSG_DELETE_RULE_CONFIRM="���򽫻ᱻ�Ƴ�,��ȷ��������?"
var MSG_SELECT_RULE_TO_DEL="ѡ��ɾ���Ĺ���"
var MSG_ALL_STOP_RULE="��ϣ��ֹͣȫ���Ĺ�����"

var MSG_OPENER_PAGE_MOVED="ҳ�����Ƴ�"
var MSG_INVALID_VALUE="Invalid value."



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="������ԿӦ����ʮ��λ���ַ���"
var MSG_INVALID_WPAPSK_KEY_MISMATCH="������Կ��ͬ��������ͬ�Ĺؼ���"


// sysconf_configmgmt
var MSG_RESTOREFILE_BLANK="ѡ��һ�����������ļ�"

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="��������Ϊ��"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="�㳋��Ҫɾ��WDS��"
var MSG_APADD_REQUEST_APPLY="������'����'��ť�������WDS���á�"

// wirelessconf_basicsetup
var MSG_BLANK_SSID="����SSID"
var MSG_INVALID_WEP_KEY_LENGTH="�����������Կ����"
var MSG_INVALID_WEP_KEY_HEXVALUE="������ԿӦ����ʮ�����Ƶ�"
var MSG_INVALID_WPAPSK_KEY_LENGTH="������ԿҪ����8���ַ�"
var MSG_INVALID_5_KEY_LENGTH="������ԿҪ5���ַ�"
var MSG_INVALID_13_KEY_LENGTH="������ԿҪ13����"
var SAVE_CONFIGURATION_STRING="����ȫ��������"

var MSG_BLANK_REQUEST_SSID="����SSID�����'Ӧ��'��ť��"   
var MSG_INVALID_REQUEST_KEY="����������Կ�����'Ӧ��'��ť"
var MSG_INVALID_REQUEST_APPLY="���'Ӧ��'��ť����ָ��AP"
var MSG_APPLY_REQUEST_KEY="���'Ӧ��'��ťӦ���ŵ�"
var MSG_BEST_CHANNEL_PRE="��õ��ŵ���"
var MSG_BEST_CHANNEL_POST="�ŵ�"
var MSG_KEY_LENGTH_DESC="��Կ���� = "

// config_wizard
var MSG_BLANK_ACCOUNT="�����û���"
var MSG_BLANK_PASSWORD="��������"

var MSG_INVALID_IP="IP��ַ����"
var MSG_INVALID_NETMASK="�����������"
var MSG_INVALID_GATEWAY="Ĭ�����ش���"
var MSG_INVALID_FDNS="����DNS����"
var MSG_INVALID_SDNS="����DNS����"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="��������ַ���������ַ��ͬ"
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="���IP��ַ�ѱ�����"
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="���MAC��ַ�ѱ�����"

//netconf_wansetup
var NETCONF_INTERNET_DHCP_MTU_INVALID="MTU���ܳ���1500"
var NETCONF_INTERNET_PPP_MTU_INVALID="MTU���ܳ���1492"
var NETCONF_INTERNET_KEEP_ALIVE_MSG="������ʱ�����"
var NETCONF_INTERNET_GW_INVALID_NETWORK="Ĭ������Ҫ���������ͬ"
var NETCONF_WANSETUP_CONFIRM_WANINFO="��ȷ�����Ĺ�������Ϣ��"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="DHCP��ַ�ؿ�ʼ����"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="DHCP��ַ�ؽ�������"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="DHCP��ַ�ط�Χ����"
var NETCONF_INTERNAL_DELETE_IP="��ϣ��ɾ��������IP��ַ��"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="���书��Ӧ��1~100"
var DESC_INVALID_RTS_THRESHOLD="RTS��ֵӦ��1~2347"
var DESC_INVALID_FRAG_THRESHOLD="��Ƭ��ֵӦ��256~2346"
var DESC_INVALID_BEACON_INTERVAL="�ű�����Ӧ��50~1024"

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="����ϵͳ���㳋��������"
var KAID_MUST_SELECT_OBT_SERVER="����Ӧ��ѡ��һ��������"
var KAID_RESTART_KAI_UI="�����´�KAIҳ��"

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="�������Ӹ���Ķ˿ڴ���"
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="������IP��ַ����"
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="�ⲿ�˿�Ϊ��"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="�ⲿ�˿ڴ���"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="�ⲿ�˿ڷ�Χ����"
var NATCONF_PORTFORWARD_INVALID_INT_PORT="�ڲ��˿ڴ���"
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="�ڲ��˿ڷ�Χ����"
var NATCONF_PORTFORWARD_RUN_RULE="��ϣ��Ӧ�ù�����"


//natrouterconf_misc
var NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT="�������Ӹ����FTP�˿�"
var NATCONF_INTAPPS_FTP_PORT_EMPTY="�˿ں�Ϊ��"
var NATCONF_INTAPPS_FTP_PORT_INVALID="�˿ںŴ���"

//natrouterconf_router
var NETCONF_ROUTE_ENTRY_DELETE="��ϣ��ɾ��·�ɱ���"
var NETCONF_ROUTE_ENTRY_SELECT="ѡ��Ҫɾ����·�ɱ�"

//natrouterconf_twinzipdmz
var NATCONF_TWINIPDMZ_UPDATE_TIME="IP��������Ӧ��60��"
var NATCONF_TWINIPDMZ_WARNING="��̨����ʹ��˫IP�����û��ʹ��˫IP����̨���Ե�IPӦ�ñ��������á���ȷ�ϼ�����"


//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="�������Чʱ��"
var FIREWALLCONF_FIREWALL_DATE_WARNING="ѡ��������ں�ʱ��"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="ԴIP��ַ����"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="ԴMAC��ַ����"
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="Ŀ��IP��ַ����"
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="Ŀ�ض˿ڴ���"
var FIREWALLCONF_FIREWALL_RUN_RULE="��ϣ��Ӧ�ù�����"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="�������Ӹ������Ŀ"
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="����Ȩ����"

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="��С��������10"
var NETCONF_NETDETECT_WARNING2="��Χֵ��0~23"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="��������Ӧ��1~253"
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="��Ҫɾ��ȫ�����Ե���Ϣ������"

//expertconf_ddns
var EXPERTCONF_DDNS_HOSTNAME_IS_BLANK ="��������Ϊ��"
var EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG ="�������Ʊ�������iptime.org��β"
var EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1 ="û�и����IPTIME DDNS����"
var EXPERTCONF_IPTIMEDDNS_INVALID_USERID="����E-mail��ַ����"
var EXPERTCONF_DYNDNS_NOMORE_WANRING1="û�и����DDNS����"
var INVALID_EMAIL_ADDRESS_STR="E-mail��ַ����"
var EXPERTCONF_IPTIMEDDNS_INVALID_HOSTNAME="��ַ����"

//expertconf_remotepc
var EXPERTCONF_WOL_PC_NAME_IS_BLANK="��������Ϊ��"
var EXPERTCONF_WOL_DEL_PC="��ϣ��ɾ��������"
var EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC ="��ϣ��������̨������"

//expertconf_hostscan
var ICMP_PING=0
var ARP_PING=1
var PING_SCAN=0
var TCP_PORT_SCAN=1
var SYSINFO_HOST_INVALID_TIMEOUT ="��ʱΪ��"
var SYSINFO_HOST_TIMERANGE   ="��ʱӦ����1��"
var SYSINFO_HOST_INVALID_DATASIZE ="���ݴ�СΪ��"
var SYSINFO_HOST_DATARANGE    ="���ݷ�ΧӦ��0~65000"
var SYSINFO_HOST_INVALID_START  ="��ʼ�˿�Ϊ��"
var SYSINFO_HOST_PORTRANGE      ="�˿ڷ�ΧӦ��0~65535"

//trafficconf_conninfo
var TRAFFICCONF_CONNINFO_DELETE_CONN="��ȷ��ɾ�����IP ��ַ��������Ϣ��"

//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="ѡ��VLAN�˿�"
var SELECT_VLAN_PORT_TRUNK_WARNING ="All port of TRUNK(%s) must be in VLAN."
var SELECT_TRUNK_PORT_WARNING ="ѡ��VLAN�˿�"
var SELECT_TRUNK_PORT_VLAN_WARNING ="All port of TRUNK must be in VLAN(%s) or another VLAN."
var MAX_MEMBER_TRUNK_WARNING="Maximum number of port is %d."
var ALREADY_OTHER_GROUP_MEMBER="Ports can not be included in multiple groups."

//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="û�и���Ķ˿�ת������"    
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="��������Ϊ��"
var NATCONF_INTSERVER_INVALID_EXT_PORT="�˿ڴ���"
var NATCONF_LOADSHARE_KEEP_WRR="������WRR LSʱ������Խ���Զ���������"
var NATCONF_LOADSHARE_ON_LINE_BACKUP="�Զ��������ӽ�������㳋��Ҫ������"
var NATCONF_LOADSHARE_DELETE_RULE="��ϣ��ɾ��������"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="Ϊ���ѡ��һ������"
//sysconf_syslog
var SYSCONF_SYSLOG_WANRING ="ʱ�����"
var SYSCONF_SYSLOG_EMAIL_CONFIRM="������e-mail����ϵͳ��־���������Ա"
var SYSCONF_SYSLOG_CLEAR_CONFIRM="ȫ��ϵͳ��־����ɾ��"

//sysconf_login
var SYSCONF_LOGIN_INVALID_NEW_PASS=    "����µ�¼���벻ƥ��"
var SYSCONF_LOGIN_INVALID_NEW_ID  =    "��Ч���ʻ��ַ��� ֻ������ĸ������"
var SYSCONF_LOGIN_RELOGIN         =    "�����ĳɹ���ֻ��ʹ�����û��������½"

//expertconf_pptpvpn
var EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK="VPN�˺�Ϊ��"
var EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK="VPN����Ϊ��"
var EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID="IP��ַΪ��"
var EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE="��ϣ��ɾ��һ���ʺ���"

//accesslist

var ACCESSLIST_NOIPLISTMSG_1="��������IP��ַ����Ҫ������ĵ���IP��ַ������"
var ACCESSLIST_NOIPLISTMSG_2=") connected?"
var ACCESSLIST_WRONG_INPUT_IP="IP��ַ����"
var ACCESSLIST_WRITE_EXPLAIN="����Ϊ��"
var ACCESSLIST_DEL_WANT="��ȷ��ɾ����������"

//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="��Ϊ��������ַ�Ѹı䣬���������ӣ�"
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="�ٴ���������ҳ��"
var SYSCONF_RESTORE_RETRY_CONNET="�ٴ����ӻָ�����ҳ��"

//trafficconf_qos
var QOS_BASIC_WARNING="QOS���ý��ᱻ�Ķ�,ȷ������������?"
var QOS_COMMON_EXCCED_MAX_CLASS="��������������"
var QOS_COMMON_EXCCED_MAX_SPEED="�������Ӣ�������ʷ�Χ"
var QOS_COMMON_ISOLATED_EXCEED="�С����������Եķ����ܴ�����������Ӣ�������ʷ�Χ"  
var QOS_COMMON_NO_CHANGE_DIRECTION="���ܸı�����ָ��"
var QOS_COMMON_ONLY_DIGIT="ֻ��������Ч"
var QOS_COMMON_BASIC_SETUP_FIRST="����QoS��������"
var QOS_PORT_PORTRANGE="�˿ڷ�ΧӦ��1~65535"
var QOS_PORT_INVALID_EXT_PORT_RANGE="�ⲿ�˿ڷ�Χ����"
var QOS_BADNWIDTH_EMPTY="������"
var QOS_RATE_RANGE="���ʷ�Χ��32 Kbps ~ 50 Mbps"

// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="�������罫�Ͽ�����ȷ��������?"


//trafficconf_connctrl
var MSG_CONNECTION_MAX_WARNING="������"
var MSG_CONNECTION_MAX_TOO_SMALL="̫�ٵ�������ӡ����ó���512."
var MSG_UDP_CONNECTION_MAX_TOO_BIG="Ӧ����10���������֮���������UDP����"
var MSG_ICMP_CONNECTION_MAX_TOO_BIG="���ICMP����Ӧ�������������"
var MSG_INVALID_RATE_PER_MAX="ÿһ̨�����������ʴ���"

//sysconf_misc
var MSG_WBM_POPUP="��������"


var MSG_NO_DEL_ROUTING_TABLE="ɾ��������·�ɱ�!"
var MSG_NO_DEL_WDS="ɾ��������WDS!"


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="ͬһ���˿ڲ��ܱ�ӳ��."

var MSG_HUBMODE_WARNING="!!! ���� !!\nIn Hubģʽ, ȫ��NAT·�ɹ��ܽ������ã���ȷ��������? "
var MSG_HUBMODE_CONFIRM="��ȷ��������."

// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": ��������0 Mbps."
var MSG_PORTQOS_MAX_ERROR=":�������ó���100 Mbpsֵ."
var MSG_PORTQOS_INVALID_VALUE=": ��Чֵ(��Χ "


//firewallconf_etc
var DESC_INVALID_ARP_PERIOD="ARP��/�뷶Χ1 ~ 100."

// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="����WAN�˿�(�������˿�)��������.��ȷ��������?"

// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="ʱ������ֵ��Χ0 ~ 23."
var MSG_INVALID_MIN_VALUE="��������ֵ��Χ0 ~ 59."
var MSG_PPPOE_SCHEDULE_SAME_RULE="��ͬ�Ĺ����Ѿ�����."
var QOS_BPI_RANGE="BPI��IP��ַ��Χ��Ч. (��Χ: 2 ~ 31)"

// qosconf
var QOS_PROTOCOL_SELECT="ѡ��Э�������."


// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="����ѡ��һ������"
var MSG_BACKUP_METHOD_DOMAIN="��Ҫָ������"

var MSG_INVALID_PROTONUM="Invalid Proto Num"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="�����Զ������ŵ����ܺ�ϵͳ���Զ������м̷��������ŵ����м̷������˵��ŵ�����ı䣬ϵͳ���Զ�ƥ���ŵ��������û��ֶ����ģ�ȷ��������"


var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "������Ϣ������գ��Ƿ������"
var MSG_SELECT_DEL_MBSS = "Select wireless network to remove."

var AUTO_STRING = "�Զ�"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "�Զ������ŵ�"

var UPPER_CHANNEL_TXT = "��Ƶ"
var LOWER_CHANNEL_TXT = "��Ƶ"

var LAN_GATEWAY_WARNING_MSG = "��û�й�����Internet����ʱ,���ѡ������·�����Լ�����Internet.\n����?";

var MSG_IPPOOL_MAX_WARNING = "û�и����IP��Χʹ������."


var MSG_IGMP_REBOOT = "����·������IPTV���òŻ���Ч?"

var MSG_MBSSID_QOS_WARNING="��СֵΪ100Kbps"
var MSG_DFS_WARNING="���ŵ�ΪDFS�ŵ���AP���ܱ����������1~10���ӷ��ֵ��״��źš�" 
var SYSCONF_LOGIN_BLANK_ID =     "�˺�Ϊ��"    
var SYSCONF_LOGIN_BLANK_PASS  = "����Ϊ��"    
var SYSCONF_LOGIN_REMOVE_WARNING  = "ɾ���˺�/���룬������"   
var SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT  = "�Ự��ʱ1~60����"   
var SYSCONF_LOGIN_CANT_REMOVE_ID  = "���Ựʹ�����˺�/���벻�ܱ�ɾ��"  
var SYSCONF_LOGIN_SHOULD_HAVE_IDPASS  = "�������磬���������˺�����"  
var SYSCONF_LOGIN_RELOGIN_SESSION  = "���ú�ص���¼���棬����?"    
var MSG_PPTPVPN_REBOOT = "�����ı�PPTP VPN����������?"  
var MSG_QOS_REBOOT=" �����ı�QOS����"   
var UNALLOWED_ID_MSG  = "������ʹ�õ�ID"
var DESC_INVALID_DCS_PERIOD="��Χ 1~100"
var INVALID_HOUR_TEXT="��Χ0~23" 
var INVALID_MIN_TEXT="��Χ 0~59" 
var SELECT_DAY_DESC="����һ���ÿ����"

var SNMP_INVALID_PORT=    "�˿ڷ�Χ 1 - 65535"
var SNMP_COMMUNITY_ALERT=  "��Χ��ǿ���Ե�"


var MSG_INVALID_RADIUS_SERVER=  "��Ч��Radius ��������ַ"
var MSG_INVALID_RADIUS_SECRET=  "���ߵ�Radius ����"
var MSG_INVALID_RADIUS_PORT=  "��Ч��Radius �������˿�"
var MSG_WEP_WARNING= "��������ٶ�Ϊ54Mbps��11g����ʹ��WEP��TKIP�ļ���ģʽ\����?"
var MSG_WEP_SEC_WARNING="WEP����ģʽ�ǲ���ȫ�ļ������ã����ǲ��Ƽ�ʹ��WEP����ģʽ����ȷ��ʹ�û��ǲ�ʹ��)"
var MSG_WIRELESS_WAN_WARNING=      "���߹��������ܱ���һ������ռ�ã���رյ��������߹���������"
var MSG_WDS_CHANNEL_WARNING=   "�ŵ�ƥ��ʧ�ܣ���Ҫ�����ŵ���������\������"


var MSG_NEW_BSS= "�µ���������"
var MSG_NEED_REBOOT_FOR_WWAN="System will be restarted. Continue?"


var MSG_ADD_MAC_WARNING=   "û������MAC���Ա����"
var MSG_REMOVE_MAC_WARNING="û������MAC���Ա�ɾ��"
var MSG_INVALID_AUTH_FOR_BRIDGE=  "��AP����ʹ���Ž�ģʽ"

var MSG_NEED_REBOOT_FOR_WWAN="·��������������������Ҫ������?"

var MSG_ENABLE_ONE_SERVICE_ID="������Ҫһ���û�����."
var MSG_DUPLICATE_SERVICE_ID="һЩID���ظ��ģ������û�ID."
 


var PASSWORD_NEEDED_TO_SET_THIS="�����û�����������Ҫ���øù��ܣ��ڡ�ϵͳ��---���������á��������û���������"

var CANT_SET_DEFAULT_ID_PASS="��Ϊ����Ĭ���û��������룬������û����Լ�����"
var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="����д��֤��"

var MSG_SELECT_TORRENT_FOLDER_ERR="��ѡ������Ŀ���ļ�"
var MSG_SELECT_MEDIA_FOLDER_ERR="��ѡ��ý���ļ�"
var MSG_MEDIA_NAME_ERR="����д����"

var MSG_SELECT_ITUNES_FOLDER_ERR="Select iTunes Folder."
var MSG_USB_MODE_WARNING="To change USB Mode, system should be restarted.\nContinue?"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL

var DDNS_HOSTNAME_RULE_TXT="��Ч��DDNS������"

var SYSCONF_LOGIN_CANT_REMOVE_WARNING="����д����Ա�û����Լ�����"



var SYSCONF_ONLINE_UPGRADE_CONFIRM="All router's functions will be stopped during firmware upgrade.\nContinue?"

var FIRMUP_DONE_TXT="Firmware upgrade is done.\nClick 'OK' button to continue."

// USE_SYSCONF_MISC2

var SYSCONF_HOSTNAME_WARNING="·����������������һ����ĸ"
var SYSCONF_HOSTNAME_SPECIAL_WARNING="·�������Ʋ������������ַ��Ϳո�"
var SYSCONF_LED_START_TIME_ALERT="��ʼʱ�䲻�����ڽ���ʱ��"
var SYSCONF_APPLY_BUTTON_NAME="����"
var SYSCONF_APPLY_ORIGINAL_VALUE="Ӧ��"
var SYSCONF_FAN_ALERT="�趨�¶ȷ�Χ�ǲ���ȷ��"



var MSG_INVALID_FOLDER_STR="��Ч���ַ���"
var MSG_INVALID_FOLDER_NON_ASCII_STR="ֻ����Ascii��ʽ����"
var MSG_INVALID_FOLDER_2DOTS_STR="..������"
var MSG_INVALID_FOLDER_DOT_STR="����ʹ�õ�����"
var MSG_CANT_BE_USED="������"


var MSG_DYNAMIC_CHANNEL_WARNING="���ʹ�ù̶����ŵ����Զ������ŵ����ܽ���رգ��Ƿ������"

var SYSCONF_INVALID_HOSTNAME="Invalid HostName"
var UNPERMITTED_STR_PREFIX="Unpermitted characters:"
var SYSCONF_INVALID_TEMPERATURE="Invalid Temperature.(Temperature <= 100)"


var PLUGIN_INSTALL_BT_TXT="Install"
var PLUGIN_UPDATE_BT_TXT="Update"
var PLUGIN_CANCEL_BT_TXT="Cancel"
var PLUGIN_REMOVE_BT_TXT="Remove"

var MSG_TOO_LONG_SSID="SSID length is too long.\nNon ascii character have 3 bytes.\nCurrent Length of SSID Field: "


	

</script>
