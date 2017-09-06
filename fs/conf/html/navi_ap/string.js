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

var ENCRYPT_OFF=0
var ENCRYPT_64=1
var ENCRYPT_128=2
var ENCRYPT_TKIP=3
var ENCRYPT_AES=4

var KEY_STRING=0;
var KEY_HEX=1;

var IDX_KEY_STRING=0;
var IDX_KEY_HEX=1;

var REGION_USA=1;
var REGION_JAPAN=2;

var DMZTWINIP_MODE_DMZ=1;
var DMZTWINIP_MODE_TWINIP=2;


var MSG_RESTART_CONFIRM_DEFAULT='AP�� ������ �ʱ�ȭ�ϸ�, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_UPNP='UPNP������ �����ϸ�, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_REBOOT='AP�� ����۵˴ϴ�. ����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='���� IP�ּҸ� �����ϸ�, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_RESTORE='������ ������ �� AP�� ����۵˴ϴ�.\n ����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_NAT='���ͳ� AP�� ������ �����ϸ�, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_WIRELESS='���� ���� ��� ����ÿ���, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_KAID_MODE_CHANGE_WARNING='ī�� ���� ��� ����ÿ���, AP�� ����� �Ͽ����մϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='��ī�� ��忡���� AP��忡���� ���� ���� ����� ����� �� �����ϴ�.\n��� ������ ���ؼ��� AP�� ����۵˴ϴ�.\n����Ͻðڽ��ϱ�?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='���� WAN���� ����,FTTH,ADSL,VDSL,���̺�𵩵��� ��κ� ���ͳ� ��Ŀ����� ����� �� �����ϴ�.\n��� ������ ���ؼ��� AP�� ����۵˴ϴ�.\n����Ͻðڽ��ϱ�?';

// common
var MODIFY_OP='����'
var ADD_OP='�߰�'
var CANCEL_OP='���'
var MSG_INVALID_HWADDR="MAC �ּҰ� �߸��Ǿ����ϴ�" 
var MSG_INVALID_ESSID="ESSID�� �߸��Ǿ����ϴ�" 
var MSG_INVALID_WDSKEY="WDS Ű�� �߸��Ǿ����ϴ�" 
var MSG_DELETE_RULE_CONFIRM="��Ģ�� �����Ͻðڽ��ϱ�?" 
var MSG_SELECT_RULE_TO_DEL="������ ��Ģ�� ������ �ּ���."
var MSG_ALL_STOP_RULE="��� ������ ���߽ðڽ��ϱ�?"

var MSG_OPENER_PAGE_MOVED="���� �������� �̵��Ǿ����ϴ�."


// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="���� �Է½ÿ��� 16�������� �Է��Ͽ��� �մϴ�."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="�ΰ��� ��Ʈ��ũ Ű�� ��ġ���� �ʽ��ϴ�.\n���� Ű�� �ι� �Է��ؾ� �մϴ�."

// sysconf_configmgmt
var MSG_RESTOREFILE_BLANK="������ ���������� �����Ͻʽÿ�."

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="��Ģ�̸��� �����ϴ�!"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="WDS ������ �����Ͻðڽ��ϱ�?" 
var MSG_APADD_REQUEST_APPLY="'�߰�' ��ư�� Ŭ���ϸ�, WDS������ �Ϸ�˴ϴ�."   
var WDS_CYPHER_NO=0;
var WDS_CYPHER_64=1;
var WDS_CYPHER_128=2;

// wirelessconf_basicsetup
var MSG_BLANK_SSID="��ũ��ũ�̸�(SSID)�� �Է��ؾ� �մϴ�."
var MSG_INVALID_WEP_KEY_LENGTH="��Ʈ��ũ Ű�� ���̰� �߸��Ǿ����ϴ�."
var MSG_INVALID_WEP_KEY_HEXVALUE="��Ʈ��ũ Ű���� 16�������� �Է��Ͽ��� �մϴ�."
var MSG_INVALID_WPAPSK_KEY_LENGTH="��Ʈ��ũ Ű�� 8�����̻� �Է��Ͻʽÿ�."
var MSG_INVALID_5_KEY_LENGTH="��Ȯ�� 5������ Ű�� �Է��Ͻʽÿ�."
var MSG_INVALID_13_KEY_LENGTH="��Ȯ�� 13������ Ű�� �Է��Ͻʽÿ�."
var SAVE_CONFIGURATION_STRING="������ �����Ͻðڽ��ϱ�?"

var MSG_BLANK_REQUEST_SSID="��ũ��ũ�̸�(SSID)�� �Է��� �� '����' ��ư�� Ŭ���մϴ�."
var MSG_INVALID_REQUEST_KEY="��Ʈ��ũ Ű�� �Է��� �� '����' ��ư�� Ŭ���մϴ�."
var MSG_INVALID_REQUEST_APPLY="'����' ��ư�� Ŭ���ϸ�, ���õ� AP�� ���ӵ˴ϴ�."
var MSG_APPLY_REQUEST_KEY="'����' ��ư�� Ŭ���ϸ� ������ ä���� ����˴ϴ�."
var MSG_BEST_CHANNEL_PRE="�˻��� ������ ä���� " 
var MSG_BEST_CHANNEL_POST="�� �Դϴ�."
var MSG_KEY_LENGTH_DESC="Ű ���� = "

// config_wizard
var MSG_BLANK_ACCOUNT="����� ������ �Է��ؾ� �մϴ�."
var MSG_BLANK_PASSWORD="����� ��ȣ�� �Է��ؾ� �մϴ�."

var MSG_INVALID_IP="IP�ּҰ� �߸��Ǿ����ϴ�."
var MSG_INVALID_NETMASK="����� ����ũ�� �߸��Ǿ����ϴ�."
var MSG_INVALID_GATEWAY="�⺻ ����Ʈ���̰� �߸��Ǿ����ϴ�."
var MSG_INVALID_FDNS="�⺻ DNS�����ּҰ� �߸��Ǿ����ϴ�"
var MSG_INVALID_SDNS="���� DNS�����ּҰ� �߸��Ǿ����ϴ�"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="IP �ּҰ� �ܺ� ��Ʈ��ũ�� �����ϴ�."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="�̹� ��ϵ� IP�ּ� �Դϴ�."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="�̹� ��ϵ� MAC�ּ� �Դϴ�."
var NETCONF_IPCHANGE_CLOSEANDRECONNECT="IP �ּҰ� ����Ǿ����ϴ�. ���� â�� ���� �� ����� IP�� �ٽ� ���� �Ͻñ� �ٶ��ϴ�."
var NETCONF_NOIP_WARNING="IP�ּҸ� �������� ������, �� �̻� ���������� ���� ����ȭ�鿡 ������ �� �����ϴ�.\n����Ͻðڽ��ϱ�?" 


//netconf_wansetup
var NETCONF_INTERNET_DHCP_MTU_INVALID="MTU ���� 1500�� �ʰ��Ҽ� �����ϴ�."
var NETCONF_INTERNET_PPP_MTU_INVALID="MTU ���� 1492�� �ʰ��Ҽ� �����ϴ�."
var NETCONF_INTERNET_KEEP_ALIVE_MSG="�ð��� �Է��Ͻʽÿ�"
var NETCONF_INTERNET_GW_INVALID_NETWORK="����Ʈ���̰� ���� ��Ʈ��ũ�� �����ϴ�!"
var NETCONF_WANSETUP_CONFIRM_WANINFO="���ͳ� ���� ������ Ȯ�� �Ͻðڽ��ϱ�?"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="���� IP �ּ� �Ҵ� ������ �߸��Ǿ����ϴ�!"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="���� IP �ּ� �Ҵ� ������ �߸��Ǿ����ϴ�!"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="���� IP �ּ� �Ҵ� ������ �߸��Ǿ����ϴ�!"
var NETCONF_INTERNAL_DELETE_IP="������ IP�ּҸ� �����Ͻðڽ��ϱ�?"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="�۽� �Ŀ��� ���� 1 ~ 100 ������ ���̾�� �մϴ�.";
var DESC_INVALID_RTS_THRESHOLD="RTS Threshold�� ����  1 ~ 2347 ������ ���̾�� �մϴ�.";
var DESC_INVALID_FRAG_THRESHOLD="Fragmentation Threshold�� ����  256 ~ 2346 ������ ���̾�� �մϴ�.";
var DESC_INVALID_BEACON_INTERVAL="Beacon �ֱ��� ����  50 ~ 1024 ������ ���̾�� �մϴ�.";
var DESC_INVALID_BEACON_INTERVAL="Beacon �ֱ��� ����  50 ~ 1024 ������ ���̾�� �մϴ�.";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="�ý����� ����۵˴ϴ�. ����Ͻðڽ��ϱ�?"
var KAID_MUST_SELECT_OBT_SERVER="ī�̼����� �����ؾ� �մϴ�."
var KAID_RESTART_KAI_UI="ī�� UI�� �ٽ� ���� �ؾ��մϴ�."

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="���̻� ��Ʈ ������ ������ �߰��� �� �����ϴ�!"
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="���� IP �ּҰ� �߸��Ǿ����ϴ�!"
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="�ܺ� ��� ��Ʈ�� �������� �ʾҽ��ϴ�!"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="�ܺ� ��� ��Ʈ�� �߸��Ǿ����ϴ�!"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="�ܺ� ��� ��Ʈ ������ �߸��Ǿ����ϴ�!"
var NATCONF_PORTFORWARD_INVALID_INT_PORT="���� ��� ��Ʈ�� �߸��Ǿ����ϴ�!"
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="���� ��� ��Ʈ ������ �߸��Ǿ����ϴ�!"
var NATCONF_PORTFORWARD_RUN_RULE="��Ģ�� �����Ͻðڽ��ϱ�?"


//natrouterconf_misc
var NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT="������ �� �ִ� ��Ʈ�� ������ �ʰ��߽��ϴ� !"
var NATCONF_INTAPPS_FTP_PORT_EMPTY="��Ʈ�� �������� �ʾҽ��ϴ�!"
var NATCONF_INTAPPS_FTP_PORT_INVALID= "��Ʈ�� �߸��Ǿ����ϴ�!"

//natrouterconf_router
var NETCONF_ROUTE_ENTRY_DELETE="���õ� ����� ���̺��� �����Ͻðڽ��ϱ�?"
var NETCONF_ROUTE_ENTRY_SELECT="������ ��������̺��� ������ �ּ��� !"

//natrouterconf_twinzipdmz
var NATCONF_TWINIPDMZ_UPDATE_TIME="IP ���� �ð��� 60�� �̻��̾�� �մϴ�."
var NATCONF_TWINIPDMZ_WARNING="���� ������ PC�� Twin IP�� ����ϰ� �ֽ��ϴ�. Twin IP�� ���� �Ͻø� �ش� PC�� IP �ּҸ� �缳�� �ؾ� ���������� ����� �� �ֽ��ϴ�.  (���� ���� �� �� ���ʹ� ipTIME �� ���� ������ ������ ������ ��� ����� �̷�� ���� �ʽ��ϴ�.)  ��� ���� �Ͻðڽ��ϱ� ?"


//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="������ �ð������� �߸� �Ǿ����ϴ�."
var FIREWALLCONF_FIREWALL_DATE_WARNING="������ ������ �����ϼž� �մϴ�"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="������ IP �ּҰ� �߸��Ǿ����ϴ�!"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="������ MAC �ּҰ� �߸��Ǿ����ϴ�!"
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="������ ��Ʈ�� �߸��Ǿ����ϴ�!"
var FIREWALLCONF_FIREWALL_RUN_RULE="��Ģ�� �����Ͻðڽ��ϱ�?"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="���̻� ������ �߰��� �� �����ϴ�!"
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="�켱���� ���� �߸� �Ǿ����ϴ�."

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="�ּ� ������� 10 �Դϴ�."
var NETCONF_NETDETECT_WARNING2="��ȿ �ð� ������ 0�� ~ 23�� �Դϴ�."


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="������ PC�� ������ �ּ� 1�� �̻��̰ų� �ִ� 253�� �����Դϴ�."
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="��ϵ� ��� PC������ �ʱ�ȭ �Ͻðڽ��ϱ� ?"

//expertconf_ddns
var EXPERTCONF_DDNS_HOSTNAME_IS_BLANK = "ȣ��Ʈ �̸��� �����ϴ�."
var EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG = "ȣ��Ʈ�̸���  iptime.org �� ������ �մϴ�."
var EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1 ="�� �̻� ipTIME DDNS ȣ��Ʈ�� �߰��� �� �����ϴ�."
var EXPERTCONF_IPTIMEDDNS_INVALID_USERID= "��Ȯ�� E-mail �ּҸ� �Է��ϼ���."
var EXPERTCONF_DYNDNS_NOMORE_WANRING1="�� �̻� dyndns.org�� DDNS ȣ��Ʈ�� �߰��� �� �����ϴ�."
var INVALID_EMAIL_ADDRESS_STR="E-mail �ּ������� �߸��Ǿ����ϴ�."

//expertconf_remotepc
var EXPERTCONF_WOL_PC_NAME_IS_BLANK="PC ������ ����ֽ��ϴ�!"
var EXPERTCONF_WOL_DEL_PC="PC�� ���� �Ͻðڽ��ϱ� ?"
var EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC ="PC �� �ѽðڽ��ϱ� ?"

//expertconf_hostscan
var ICMP_PING=0
var ARP_PING=1
var PING_SCAN=0
var TCP_PORT_SCAN=1
var SYSINFO_HOST_INVALID_TIMEOUT =   "�ð������� �Է��Ͻʽÿ�"
var SYSINFO_HOST_TIMERANGE   =       "�ð��� 1���̻� �Է����ּ���."
var SYSINFO_HOST_INVALID_DATASIZE =  "ũ�⸦ �Է��Ͻʽÿ�"
var SYSINFO_HOST_DATARANGE    =      "0~65,500������ ������ �Է����ּ���"
var SYSINFO_HOST_INVALID_START  =    "���� ��Ʈ�� �Է��Ͻʽÿ�"
var SYSINFO_HOST_PORTRANGE      =    "0~65,535������ ������ �Է����ּ���"

//trafficconf_conninfo
var TRAFFICCONF_CONNINFO_DELETE_CONN="������ IP�ּ��� Ŀ�ؼ��� �����Ͻðڽ��ϱ�?"

//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="VLAN ��Ʈ�� �����Ͻʽÿ�"

//sysconf_syslog
var SYSCONF_SYSLOG_WANRING = "�ð� ������ �߸��Ǿ����ϴ�."
var SYSCONF_SYSLOG_EMAIL_CONFIRM= "E-mail ����Ʈ�� �����ðڽ��ϱ�?"
var SYSCONF_SYSLOG_CLEAR_CONFIRM= "��� �ý��� �αװ� �������ϴ�"

//sysconf_login
var SYSCONF_LOGIN_INVALID_NEW_PASS=     "�� ��ȣ�� ��ġ���� �ʽ��ϴ�!"
var SYSCONF_LOGIN_INVALID_NEW_ID  =     "�� ������ �����ڿ� ������ ���ո� ���� �մϴ�."
var SYSCONF_LOGIN_RELOGIN         =     "��ȣ�� �����ϸ�, �� ��ȣ�� �ٽ� �α����ϼž� �մϴ�!"

//expertconf_pptpvpn
var EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK="VPN���� ������ �Է��ؾ� �մϴ�"
var EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK="VPN���� ��ȣ�� �Է��ؾ� �մϴ�"
var EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID="IP �ּҸ� �Է��ؾ� �մϴ�"
var EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE="������ �����ϰڽ��ϱ�?"

//accesslist

var ACCESSLIST_NOIPLISTMSG_1="������ IP�� �����ϴ�. ���� �����Ͻ� PC("
var ACCESSLIST_NOIPLISTMSG_2=")�� ���� ���ȿ� �߰��Ͻðڽ��ϱ�?"
var ACCESSLIST_WRONG_INPUT_IP="������ �ּҰ� �߸� �Է� �Ǿ����ϴ�."
var ACCESSLIST_WRITE_EXPLAIN="������ �Է��ϼž� �մϴ�."
var ACCESSLIST_DEL_WANT="�����Ͻðڽ��ϱ�?"

//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="���� IP�ּҰ� ����Ǿ� �ٽ� �α����ϼž� �մϴ�."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="����� IP�ּҷ� �ٽ� �����ϼž� �մϴ�."
var SYSCONF_RESTORE_RETRY_CONNET="���� ������ ���� IP �ּҷ� �ٽ� �����ϼž� �մϴ�."

//trafficconf_qos
var QOS_BASIC_WARNING="IP�ּ�/��Ʈ/���ø����̼Ǻ� �����̵Ǿ� �ִٸ� ��� ���� �˴ϴ�. ��� ���� �Ͻðڽ��ϱ� ?"
var QOS_COMMON_EXCCED_MAX_CLASS="Ŭ���� �ִ� ������ �ʰ��߽��ϴ�."
var QOS_COMMON_EXCCED_MAX_SPEED="�ִ� ���ͳ� �ӵ������� �ʰ��߽��ϴ�."
var QOS_COMMON_ISOLATED_EXCEED="'����' �Ӽ��� ���� Ŭ������ �뿪���� ���� �ִ� ���ͳ� �ӵ��� �ʰ��� �� �����ϴ�."
var QOS_COMMON_NO_CHANGE_DIRECTION="Ŭ������ ������ ������ �� �����ϴ�."
var QOS_COMMON_ONLY_DIGIT="������ �Է��� �� �ֽ��ϴ� !"
var QOS_COMMON_BASIC_SETUP_FIRST="Qos �⺻ ���� �Ǿ� ���� �ʽ��ϴ� !"
var QOS_PORT_PORTRANGE="1~65,535������ ������ �Է����ּ���"
var QOS_PORT_INVALID_EXT_PORT_RANGE="�ܺ� ��� ��Ʈ ������ �߸��Ǿ����ϴ�!"
var QOS_BADNWIDTH_EMPTY="�ӵ������� �Է��ؾ� �մϴ�."
var QOS_RATE_RANGE="32 Kbps ~ 50 Mbps ������ �ؼ��ؾ� �մϴ�."

 //mulitbridge
var MULTIBRIDGE_START_OP = 1
var MULTIBRIDGE_STOP_OP = 0
var MULTIBRIDGE_USEAP = 1
var MULTIBRIDGE_NO_USEAP = 0
var MULTIBRIDGE_AUTH_OPEN = 0
var MULTIBRIDGE_AUTH_WPAPSK= 1


//wirelessconf_multibridge 
var CHANNEL_WANRING="���õ� AP���� ������ ���ؼ���, ���� ����ϰ� �ִ� ä���� �����ؾ� �մϴ�.\n����Ͻðڽ��ϱ�?" 
var MSG_UNMATCHED_AUTH_TYPE="���õ� AP�� ������ �������,��ȣȭ ���,Ű�� �����Ͽ��� ���������� ��Ƽ�긮�� ����� ����� �� �ֽ��ϴ�.\n�� AP�� �����Ͻðڽ��ϱ�?" 



//sysconf_misc
var MSG_WBM_POPUP="���������� �� �ݰ� �α��� ȭ���� �������Ͽ��� ������ ����˴ϴ�."



</script>

