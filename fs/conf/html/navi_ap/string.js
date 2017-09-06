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


var MSG_RESTART_CONFIRM_DEFAULT='AP의 설정을 초기화하면, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_UPNP='UPNP설정을 변경하면, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_REBOOT='AP가 재시작됩니다. 계속하시겠습니까?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='내부 IP주소를 변경하면, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_RESTORE='설정이 복구된 후 AP가 재시작됩니다.\n 계속하시겠습니까?';
var MSG_RESTART_CONFIRM_NAT='인터넷 AP능 설정을 변경하면, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS='무선 동작 모드 변경시에는, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_KAID_MODE_CHANGE_WARNING='카이 동작 모드 변경시에는, AP를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='랜카드 모드에서는 AP모드에서의 무선 접속 기능을 사용할 수 없습니다.\n모드 변경을 위해서는 AP가 재시작됩니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='무선 WAN모드는 광랜,FTTH,ADSL,VDSL,케이블모뎀등의 대부분 인터넷 방식에서는 사용할 수 없습니다.\n모드 변경을 위해서는 AP가 재시작됩니다.\n계속하시겠습니까?';

// common
var MODIFY_OP='수정'
var ADD_OP='추가'
var CANCEL_OP='취소'
var MSG_INVALID_HWADDR="MAC 주소가 잘못되었습니다" 
var MSG_INVALID_ESSID="ESSID가 잘못되었습니다" 
var MSG_INVALID_WDSKEY="WDS 키가 잘못되었습니다" 
var MSG_DELETE_RULE_CONFIRM="규칙을 삭제하시겠습니까?" 
var MSG_SELECT_RULE_TO_DEL="삭제할 규칙을 선택해 주세요."
var MSG_ALL_STOP_RULE="모든 동작을 멈추시겠습니까?"

var MSG_OPENER_PAGE_MOVED="설정 페이지가 이동되었습니다."


// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="글자 입력시에는 16진수값을 입력하여야 합니다."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="두개의 네트워크 키가 일치하지 않습니다.\n같은 키를 두번 입력해야 합니다."

// sysconf_configmgmt
var MSG_RESTOREFILE_BLANK="복구할 설정파일을 선택하십시요."

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="규칙이름이 없습니다!"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="WDS 설정을 삭제하시겠습니까?" 
var MSG_APADD_REQUEST_APPLY="'추가' 버튼을 클릭하면, WDS설정이 완료됩니다."   
var WDS_CYPHER_NO=0;
var WDS_CYPHER_64=1;
var WDS_CYPHER_128=2;

// wirelessconf_basicsetup
var MSG_BLANK_SSID="네크워크이름(SSID)을 입력해야 합니다."
var MSG_INVALID_WEP_KEY_LENGTH="네트워크 키의 길이가 잘못되었습니다."
var MSG_INVALID_WEP_KEY_HEXVALUE="네트워크 키값에 16진수값을 입력하여야 합니다."
var MSG_INVALID_WPAPSK_KEY_LENGTH="네트워크 키를 8글자이상 입력하십시요."
var MSG_INVALID_5_KEY_LENGTH="정확히 5글자의 키를 입력하십시요."
var MSG_INVALID_13_KEY_LENGTH="정확히 13글자의 키를 입력하십시요."
var SAVE_CONFIGURATION_STRING="설정을 저장하시겠습니까?"

var MSG_BLANK_REQUEST_SSID="네크워크이름(SSID)을 입력한 후 '적용' 버튼을 클릭합니다."
var MSG_INVALID_REQUEST_KEY="네트워크 키를 입력한 후 '적용' 버튼을 클릭합니다."
var MSG_INVALID_REQUEST_APPLY="'적용' 버튼을 클릭하면, 선택된 AP로 접속됩니다."
var MSG_APPLY_REQUEST_KEY="'적용' 버튼을 클릭하면 선택한 채널이 적용됩니다."
var MSG_BEST_CHANNEL_PRE="검색된 최적의 채널은 " 
var MSG_BEST_CHANNEL_POST="번 입니다."
var MSG_KEY_LENGTH_DESC="키 길이 = "

// config_wizard
var MSG_BLANK_ACCOUNT="사용자 계정을 입력해야 합니다."
var MSG_BLANK_PASSWORD="사용자 암호를 입력해야 합니다."

var MSG_INVALID_IP="IP주소가 잘못되었습니다."
var MSG_INVALID_NETMASK="서브넷 마스크가 잘못되었습니다."
var MSG_INVALID_GATEWAY="기본 게이트에이가 잘못되었습니다."
var MSG_INVALID_FDNS="기본 DNS서버주소가 잘못되었습니다"
var MSG_INVALID_SDNS="보조 DNS서버주소가 잘못되었습니다"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="IP 주소가 외부 네트워크와 같습니다."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="이미 등록된 IP주소 입니다."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="이미 등록된 MAC주소 입니다."
var NETCONF_IPCHANGE_CLOSEANDRECONNECT="IP 주소가 변경되었습니다. 현재 창을 닫은 후 변경된 IP로 다시 접속 하시기 바랍니다."
var NETCONF_NOIP_WARNING="IP주소를 설정하지 않으면, 더 이상 웹브라우저를 통한 관리화면에 접속할 수 없습니다.\n계속하시겠습니까?" 


//netconf_wansetup
var NETCONF_INTERNET_DHCP_MTU_INVALID="MTU 값은 1500을 초과할수 없습니다."
var NETCONF_INTERNET_PPP_MTU_INVALID="MTU 값은 1492을 초과할수 없습니다."
var NETCONF_INTERNET_KEEP_ALIVE_MSG="시간을 입력하십시요"
var NETCONF_INTERNET_GW_INVALID_NETWORK="게이트웨이가 내부 네트워크와 같습니다!"
var NETCONF_WANSETUP_CONFIRM_WANINFO="인터넷 연결 정보를 확인 하시겠습니까?"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="동적 IP 주소 할당 범위가 잘못되었습니다!"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="동적 IP 주소 할당 범위가 잘못되었습니다!"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="동적 IP 주소 할당 범위가 잘못되었습니다!"
var NETCONF_INTERNAL_DELETE_IP="지정된 IP주소를 삭제하시겠습니까?"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="송신 파워의 값은 1 ~ 100 사이의 값이어야 합니다.";
var DESC_INVALID_RTS_THRESHOLD="RTS Threshold의 값은  1 ~ 2347 사이의 값이어야 합니다.";
var DESC_INVALID_FRAG_THRESHOLD="Fragmentation Threshold의 값은  256 ~ 2346 사이의 값이어야 합니다.";
var DESC_INVALID_BEACON_INTERVAL="Beacon 주기의 값은  50 ~ 1024 사이의 값이어야 합니다.";
var DESC_INVALID_BEACON_INTERVAL="Beacon 주기의 값은  50 ~ 1024 사이의 값이어야 합니다.";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="시스템이 재시작됩니다. 계속하시겠습니까?"
var KAID_MUST_SELECT_OBT_SERVER="카이서버를 선택해야 합니다."
var KAID_RESTART_KAI_UI="카이 UI를 다시 실행 해야합니다."

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="더이상 포트 포워드 설정을 추가할 수 없습니다!"
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="내부 IP 주소가 잘못되었습니다!"
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="외부 사용 포트가 지정되지 않았습니다!"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="외부 사용 포트가 잘못되었습니다!"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="외부 사용 포트 범위가 잘못되었습니다!"
var NATCONF_PORTFORWARD_INVALID_INT_PORT="내부 사용 포트가 잘못되었습니다!"
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="내부 사용 포트 범위가 잘못되었습니다!"
var NATCONF_PORTFORWARD_RUN_RULE="규칙을 동작하시겠습니까?"


//natrouterconf_misc
var NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT="설정할 수 있는 포트의 갯수를 초과했습니다 !"
var NATCONF_INTAPPS_FTP_PORT_EMPTY="포트가 지정되지 않았습니다!"
var NATCONF_INTAPPS_FTP_PORT_INVALID= "포트가 잘못되었습니다!"

//natrouterconf_router
var NETCONF_ROUTE_ENTRY_DELETE="선택된 라우팅 테이블을 삭제하시겠습니까?"
var NETCONF_ROUTE_ENTRY_SELECT="삭제할 라우팅테이블을 선택해 주세요 !"

//natrouterconf_twinzipdmz
var NATCONF_TWINIPDMZ_UPDATE_TIME="IP 갱신 시간은 60초 이상이어야 합니다."
var NATCONF_TWINIPDMZ_WARNING="현재 접속한 PC는 Twin IP를 사용하고 있습니다. Twin IP를 해제 하시면 해당 PC는 IP 주소를 재설정 해야 정상적으로 사용할 수 있습니다.  (설정 해제 직 후 부터는 ipTIME 웹 설정 페이지 접속을 포함한 모든 통신이 이루어 지지 않습니다.)  계속 진행 하시겠습니까 ?"


//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="설정한 시간범위가 잘못 되었습니다."
var FIREWALLCONF_FIREWALL_DATE_WARNING="제한할 요일을 선택하셔야 합니다"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="시작지 IP 주소가 잘못되었습니다!"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="시작지 MAC 주소가 잘못되었습니다!"
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="목적지 포트가 잘못되었습니다!"
var FIREWALLCONF_FIREWALL_RUN_RULE="규칙을 동작하시겠습니까?"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="더이상 설정을 추가할 수 없습니다!"
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="우선순위 값이 잘못 되었습니다."

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="최소 연결수는 10 입니다."
var NETCONF_NETDETECT_WARNING2="유효 시간 범위는 0시 ~ 23시 입니다."


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="제한할 PC의 갯수는 최소 1개 이상이거나 최대 253개 이하입니다."
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="등록된 모든 PC정보를 초기화 하시겠습니까 ?"

//expertconf_ddns
var EXPERTCONF_DDNS_HOSTNAME_IS_BLANK = "호스트 이름이 없습니다."
var EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG = "호스트이름은  iptime.org 로 끝나야 합니다."
var EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1 ="더 이상 ipTIME DDNS 호스트를 추가할 수 없습니다."
var EXPERTCONF_IPTIMEDDNS_INVALID_USERID= "정확한 E-mail 주소를 입력하세요."
var EXPERTCONF_DYNDNS_NOMORE_WANRING1="더 이상 dyndns.org의 DDNS 호스트를 추가할 수 없습니다."
var INVALID_EMAIL_ADDRESS_STR="E-mail 주소형식이 잘못되었습니다."

//expertconf_remotepc
var EXPERTCONF_WOL_PC_NAME_IS_BLANK="PC 설명이 비어있습니다!"
var EXPERTCONF_WOL_DEL_PC="PC를 삭제 하시겠습니까 ?"
var EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC ="PC 를 켜시겠습니까 ?"

//expertconf_hostscan
var ICMP_PING=0
var ARP_PING=1
var PING_SCAN=0
var TCP_PORT_SCAN=1
var SYSINFO_HOST_INVALID_TIMEOUT =   "시간제한을 입력하십시요"
var SYSINFO_HOST_TIMERANGE   =       "시간은 1초이상 입력해주세요."
var SYSINFO_HOST_INVALID_DATASIZE =  "크기를 입력하십시요"
var SYSINFO_HOST_DATARANGE    =      "0~65,500까지의 범위로 입력해주세요"
var SYSINFO_HOST_INVALID_START  =    "시작 포트를 입력하십시요"
var SYSINFO_HOST_PORTRANGE      =    "0~65,535까지의 범위로 입력해주세요"

//trafficconf_conninfo
var TRAFFICCONF_CONNINFO_DELETE_CONN="지정된 IP주소의 커넥션을 삭제하시겠습니까?"

//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="VLAN 포트를 선택하십시요"

//sysconf_syslog
var SYSCONF_SYSLOG_WANRING = "시간 범위가 잘못되었습니다."
var SYSCONF_SYSLOG_EMAIL_CONFIRM= "E-mail 리포트를 보내시겠습니까?"
var SYSCONF_SYSLOG_CLEAR_CONFIRM= "모든 시스템 로그가 지워집니다"

//sysconf_login
var SYSCONF_LOGIN_INVALID_NEW_PASS=     "새 암호가 일치하지 않습니다!"
var SYSCONF_LOGIN_INVALID_NEW_ID  =     "새 계정은 영문자와 숫자의 조합만 가능 합니다."
var SYSCONF_LOGIN_RELOGIN         =     "암호를 변경하면, 새 암호로 다시 로그인하셔야 합니다!"

//expertconf_pptpvpn
var EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK="VPN접속 계정을 입력해야 합니다"
var EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK="VPN접속 암호를 입력해야 합니다"
var EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID="IP 주소를 입력해야 합니다"
var EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE="계정을 삭제하겠습니까?"

//accesslist

var ACCESSLIST_NOIPLISTMSG_1="설정된 IP가 없습니다. 현재 접속하신 PC("
var ACCESSLIST_NOIPLISTMSG_2=")를 접속 보안에 추가하시겠습니까?"
var ACCESSLIST_WRONG_INPUT_IP="아이피 주소가 잘못 입력 되었습니다."
var ACCESSLIST_WRITE_EXPLAIN="설명을 입력하셔야 합니다."
var ACCESSLIST_DEL_WANT="삭제하시겠습니까?"

//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="내부 IP주소가 변경되어 다시 로그인하셔야 합니다."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="변경된 IP주소로 다시 접속하셔야 합니다."
var SYSCONF_RESTORE_RETRY_CONNET="설정 복구된 내부 IP 주소로 다시 접속하셔야 합니다."

//trafficconf_qos
var QOS_BASIC_WARNING="IP주소/포트/어플리케이션별 설정이되어 있다면 모두 삭제 됩니다. 계속 진행 하시겠습니까 ?"
var QOS_COMMON_EXCCED_MAX_CLASS="클래스 최대 갯수를 초과했습니다."
var QOS_COMMON_EXCCED_MAX_SPEED="최대 인터넷 속도범위를 초과했습니다."
var QOS_COMMON_ISOLATED_EXCEED="'독점' 속성을 가진 클래스의 대역폭의 합은 최대 인터넷 속도를 초과할 수 없습니다."
var QOS_COMMON_NO_CHANGE_DIRECTION="클래스의 방향은 변경할 수 없습니다."
var QOS_COMMON_ONLY_DIGIT="정수만 입력할 수 있습니다 !"
var QOS_COMMON_BASIC_SETUP_FIRST="Qos 기본 설정 되어 있지 않습니다 !"
var QOS_PORT_PORTRANGE="1~65,535까지의 범위로 입력해주세요"
var QOS_PORT_INVALID_EXT_PORT_RANGE="외부 사용 포트 범위가 잘못되었습니다!"
var QOS_BADNWIDTH_EMPTY="속도설정을 입력해야 합니다."
var QOS_RATE_RANGE="32 Kbps ~ 50 Mbps 범위를 준수해야 합니다."

 //mulitbridge
var MULTIBRIDGE_START_OP = 1
var MULTIBRIDGE_STOP_OP = 0
var MULTIBRIDGE_USEAP = 1
var MULTIBRIDGE_NO_USEAP = 0
var MULTIBRIDGE_AUTH_OPEN = 0
var MULTIBRIDGE_AUTH_WPAPSK= 1


//wirelessconf_multibridge 
var CHANNEL_WANRING="선택된 AP로의 접속을 위해서는, 현재 사용하고 있는 채널을 변경해야 합니다.\n계속하시겠습니까?" 
var MSG_UNMATCHED_AUTH_TYPE="선택된 AP와 동일한 인증방법,암호화 방법,키를 설정하여야 정상적으로 멀티브리지 기능을 사용할 수 있습니다.\n이 AP를 선택하시겠습니까?" 



//sysconf_misc
var MSG_WBM_POPUP="관리도구를 을 닫고 로그인 화면을 재접속하여야 설정이 적용됩니다."



</script>

