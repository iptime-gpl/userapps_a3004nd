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
var AUTH_WPAWPA2=11
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


var MSG_RESTART_CONFIRM_UPNP='UPNP설정을 변경하면, 공유기를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_REBOOT='공유기가 재시작됩니다. 계속하시겠습니까?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='내부 IP주소 와 DHCP서버의 동적 IP 주소범위를 변경 후,  공유기가 재시작 됩니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP='TwinIP가 설정된 경우에는 TwinIP 설정이 해지되고\n내부 IP주소 와 DHCP서버의 동적 IP 주소범위를 변경 후, 공유기가 재시작 됩니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS='무선 동작 모드 변경시에는, 공유기를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_KAID_MODE_CHANGE_WARNING='카이 동작 모드 변경시에는, 공유기를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='랜카드 모드에서는 AP모드에서의 무선 접속 기능을 사용할 수 없습니다.\n모드 변경을 위해서는 유무선공유기 또는 AP가 재시작됩니다.\n계속하시겠습니까?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='무선 WAN모드는 광랜,FTTH,ADSL,VDSL,케이블모뎀등의 대부분 인터넷 방식에서는 사용할 수 없습니다.\n모드 변경을 위해서는 유무선공유기 또는 AP가 재시작됩니다.\n계속하시겠습니까?';
var MSG_TWINIP_CONFIRM_WARNING='Twin IP 설정/해제 시에는, 공유기를 재시작 하여야합니다.\n계속하시겠습니까?';
var MSG_WAN_FOR_LAN_WARNING='WAN포트의 기능을 변경하기 위해서는 공유기를 재시작 하여야합니다.\n계속하시겠습니까?';

// common
var MODIFY_OP='수정'
var MSG_INVALID_HWADDR="MAC 주소가 잘못되었습니다." 
var MSG_DELETE_RULE_CONFIRM="규칙을 삭제하시겠습니까?" 
var MSG_SELECT_RULE_TO_DEL="삭제할 규칙을 선택해야 합니다." 
var MSG_ALL_STOP_RULE="모든 동작을 멈추시겠습니까?"

var MSG_HWADDR_NO_INPUT="MAC 주소를 입력하셔야 합니다."
var MSG_SELECT_MAC_REMOVED="삭제할 MAC주소를 선택해 주십시오."

var MSG_OPENER_PAGE_MOVED="설정 페이지가 이동되었습니다."
var MSG_INVALID_VALUE="입력값이 잘못 되었습니다."


// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="글자 입력시에는 16진수값을 입력하여야 합니다."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="두개의 네트워크 암호가 일치하지 않습니다.\n같은 암호를 두번 입력해야 합니다."

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="규칙이름이 없습니다!"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="WDS 설정을 삭제하시겠습니까?" 
var MSG_APADD_REQUEST_APPLY="'추가' 버튼을 클릭하면, WDS설정이 완료됩니다."   

// wirelessconf_basicsetup
var MSG_BLANK_SSID="네크워크이름(SSID)을 입력해야 합니다."
var MSG_TOO_LONG_SSID="네트워크이름(SSID)의 길이가 32바이트를 초과하였습니다.\n한글을 사용할 경우, 한 글자당 3바이트로 계산됩니다.\n현재 설정된 네트워크이름의 길이: "

var MSG_INVALID_WEP_KEY_LENGTH="네트워크 암호의 길이가 잘못되었습니다."
var MSG_INVALID_WEP_KEY_HEXVALUE="네트워크 암호 값에 16진수값을 입력하여야 합니다."
var MSG_INVALID_WPAPSK_KEY_LENGTH="네트워크 암호를 8글자이상 입력하십시오."
var MSG_INVALID_5_KEY_LENGTH="정확히 5글자의 암호를 입력하십시오."
var MSG_INVALID_13_KEY_LENGTH="정확히 13글자의 암호를 입력하십시오."
var SAVE_CONFIGURATION_STRING="설정을 저장하시겠습니까?"

var MSG_BLANK_REQUEST_SSID="네크워크이름(SSID)을 입력한 후 '적용' 버튼을 클릭합니다."
var MSG_INVALID_REQUEST_KEY="네트워크 암호를 입력한 후 '적용' 버튼을 클릭합니다."
var MSG_INVALID_REQUEST_APPLY="'적용' 버튼을 클릭하면, 선택된 AP로 접속됩니다."
var MSG_APPLY_REQUEST_KEY="'적용' 버튼을 클릭하면 선택한 채널이 적용됩니다."
var MSG_BEST_CHANNEL_PRE="검색된 최적의 채널은 " 
var MSG_BEST_CHANNEL_POST="번 입니다."
var MSG_KEY_LENGTH_DESC="암호 길이 = "

// config_wizard
var MSG_BLANK_ACCOUNT="사용자 계정을 입력해야 합니다."
var MSG_BLANK_PASSWORD="사용자 암호를 입력해야 합니다."

var MSG_INVALID_IP="IP주소가 잘못되었습니다."
var MSG_INVALID_NETMASK="서브넷 마스크가 잘못되었습니다."
var MSG_INVALID_GATEWAY="기본 게이트웨이가 잘못되었습니다."
var MSG_INVALID_FDNS="기본 DNS서버주소가 잘못되었습니다"
var MSG_INVALID_SDNS="보조 DNS서버주소가 잘못되었습니다"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="IP 주소가 외부 네트워크와 같습니다."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="이미 등록된 IP주소 입니다."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="이미 등록된 MAC주소 입니다."


//netconf_wansetup


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

//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="설정한 시간범위가 잘못 되었습니다."
var FIREWALLCONF_FIREWALL_DATE_WARNING="제한할 요일을 선택하셔야 합니다"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="시작지 IP 주소가 잘못되었습니다!"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="시작지 MAC 주소가 잘못되었습니다!"
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="목적지 IP 주소가 잘못되었습니다!"
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


//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="VLAN 포트를 선택하십시오"
var SELECT_VLAN_PORT_TRUNK_WARNING ="구성할려는 VLAN에 TRUNK(%s)의 모든 포트가 포함되어야 합니다."
var SELECT_TRUNK_PORT_WARNING ="TRUNK 포트를 선택하십시오"
var SELECT_TRUNK_PORT_VLAN_WARNING ="구성할려는 TRUNK의 모든 포트들이 \nVLAN(%s) 또는 다른 단일 VLAN에 포함되어야 합니다."
var MAX_MEMBER_TRUNK_WARNING="TRUNK 구성 가능한 최대 포트수는 %d개 입니다."
var ALREADY_OTHER_GROUP_MEMBER="다른 그룹에 이미 포함되어 있는 포트가 있습니다."

//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="더이상 포트 포워드 설정을 추가할 수 없습니다"
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="규칙 이름이 없습니다"
var NATCONF_INTSERVER_INVALID_EXT_PORT="포트가 잘못되었습니다"
var NATCONF_LOADSHARE_KEEP_WRR="자동 분산 기능 동작중에는 '자동 인터넷 라인 백업' 기능을 중지할 수 없습니다." 
var NATCONF_LOADSHARE_ON_LINE_BACKUP="'자동 인터넷 라인 백업' 기능 또한 자동으로 설정됩니다. 계속 하시겠습니까 ?"
var NATCONF_LOADSHARE_DELETE_RULE="규칙을 삭제하시겠습니까?"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="삭제할 규칙을 선택해야 합니다." 

//sysconf_login


//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="내부 IP주소가 변경되어 다시 로그인하셔야 합니다."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="변경된 IP주소로 다시 접속하셔야 합니다."

// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="선택된 무선 네트워크가 삭제 됩니다. 계속 진행 하시겠습니까?"
var MSG_MBSSID_QOS_WARNING="최소 100 Kbps 값 이상 설정하셔야 합니다."

// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="무선WAN을 사용할 경우, 유선 WAN포트의 기능이 중단되며,\n무선을 WAN포트(인터넷포트)로 사용하게 됩니다\n계속하시겠습니까?"


//sysconf_misc
var MSG_WBM_POPUP="관리도구를 을 닫고 로그인 화면을 재접속하여야 설정이 적용됩니다."

// trafficconf_switch
var MSG_SAME_PORT_MIRROR="같은 포트로 미러링을 할 수 없습니다."

var MSG_HUBMODE_WARNING="!!! 주의사항 !!!\n허브모드 사용 시 모든 인터넷 공유기의 기능이 중단되며,\n관리자 페이지로 접속할 수 없습니다.\n\n\
허브모드를 해제하기 위해서는\nCPU(PWR/RUN) LED가 주기적으로 점멸될때까지, Reset(초기화)버튼을 누릅니다.\n\n\
계속하시겠습니까?"
var MSG_HUBMODE_CONFIRM="확인 버튼을 누르면 허브모드로 설정되며,\n더이상 관리자 페이지를 볼수 없습니다.\n\n계속하시겠습니까?"

// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": 0 Mbps로 설정할 수 없습니다."
var MSG_PORTQOS_MAX_ERROR=": 100 Mbps 이상의 값으로 설정할 수 없습니다."
var MSG_PORTQOS_INVALID_VALUE=": 속도 설정 값이 잘못되었습니다. ("


// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="시간 설정은 0 과 23 사이의 숫자를 입력합니다."
var MSG_INVALID_MIN_VALUE="분 설정은 0 과 59 사이의 숫자를 입력합니다."
var MSG_PPPOE_SCHEDULE_SAME_RULE="같은 스케줄 설정이 존재합니다."

// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="하나 이상의 방법을 선택하셔야 합니다."
var MSG_BACKUP_METHOD_DOMAIN="도메인 이름을 입력하셔야 합니다."

var MSG_INVALID_PROTONUM="잘못된 프로토콜 번호입니다."


var MSG_MBRIDGE_AUTO_CHANNEL_STRING ='[자동 채널 검색] 기능은 브리지를 통해 연결하려는 AP의 채널이 변경되었을 경우,\n\
자동으로 채널을 검색하여 다시 연결을 해주는 기능입니다.\n\
따라서,  [자동 채널 검색] 설정 시 브리지의 연결이 끊어진 경우,\n\
본 장치의 AP기능이 정상적으로 동작하지 않을 수 있습니다.\n\
계속 하시겠습니까?';

var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "모든 옵션설정이 해제됩니다.\n계속하시겠습니까?"
var MSG_SELECT_DEL_MBSS = "삭제할 무선 네트워크를 선택하십시오."

var AUTO_STRING = "자동"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "자동 채널 검색"


var UPPER_CHANNEL_TXT =  "하위"
var LOWER_CHANNEL_TXT = "상위"

var LAN_GATEWAY_WARNING_MSG = "공유기를 AP 또는 허브 전용으로 사용 시, 공유기 자체의 인터넷 연결을 위한 설정입니다.\n계속하시겠습니까? ";
var MSG_IPPOOL_MAX_WARNING = "IP주소범위조건의 최대 갯수를 초과했습니다." 



var MSG_DFS_WARNING="This channel is DFS channel.\nAP may be activated only unless radar signal is found during 1 ~ 10 minutes."


var SYSCONF_LOGIN_BLANK_ID    = "관리자 계정을 입력해야 합니다."
var SYSCONF_LOGIN_BLANK_PASS  = "새 암호를 입력해야합니다."
var SYSCONF_LOGIN_REMOVE_WARNING  = "설정된 계정/암호를 삭제합니다. 계속하시겠습니까?"



var MSG_PPTPVPN_REBOOT = "VPN 설정을 변경하기위해 시스템을 재시작합니다. 계속하시겠습니까?"

var MSG_NO_DEL_WDS="삭제할 WDS를 선택하세요."
var MSG_QOS_REBOOT="QOS 설정을 변경하기위해서는 시스템을 재시작해야합니다. 계속하시겠습니까?"




var DESC_INVALID_DCS_PERIOD="채널 검색 주기는 1 ~ 100 시간 사이로 입력해야 합니다."

var INVALID_HOUR_TEXT="[시간] 입력란은 0 ~ 23 사이의 숫자로 입력가능합니다."
var INVALID_MIN_TEXT="[분] 입력란은 은 0 ~ 59 사이의 숫자로 입력가능합니다."
var SELECT_DAY_DESC="[매일] 또는 [적용될 요일] 을 선택하세요."

var SNMP_INVALID_PORT= "포트번호는 1 - 65535 사이의 값을 입력해야합니다."
var SNMP_COMMUNITY_ALERT= "Community를 입력하십시오."

var MSG_INVALID_RADIUS_SERVER="RADIUS 서버 주소가 잘못되었습니다."
var MSG_INVALID_RADIUS_SECRET="RADIUS 서버 암호가 잘못되었습니다."
var MSG_INVALID_RADIUS_PORT="RADIUS 서버 포트값이 잘못되었습니다."
var MSG_WEP_WARNING="WEP 또는 TKIP 암호화 설정 시에는 최대 속도 54Mbps인 11g모드로만 동작합니다.\n계속하시겠습니까?"
var MSG_WEP_SEC_WARNING="WEP 암호화 설정은 매우 취약한 보안설정으로, 사용하는 것을 권장하지 않습니다.\n그래도 계속하시겠습니까?"
var MSG_WIRELESS_WAN_WARNING="이미 다른 무선 네트워크에서 무선WAN기능을 사용하고 잇습니다.\n다른 무선 네트워크의 무선WAN기능을 끄고 설정하십시오."

var MSG_WDS_CHANNEL_WARNING="연결하려는 AP의 채널과 나의 설정된 채널이 다릅니다. \nWDS설정 후, [무선 설정/보안] 메뉴에서 채널을 동일하게 구성하여야 합니다.\n계속하시겠습니까?"

var MSG_NEW_BSS="새 무선 네트워크 추가" 

var MSG_ADD_MAC_WARNING="추가될 MAC주소를 체크하여 주십시오."
var MSG_REMOVE_MAC_WARNING="삭제될 MAC주소를 체크하여 주십시오."



var MSG_NEED_REBOOT_FOR_WWAN="현재 구성에서 무선WAN을 설정하려면 시스템을 재부팅해야합니다.\n계속하시겠습니까?"


var PASSWORD_NEEDED_TO_SET_THIS="해당 기능은 관리자 계정 및 암호를 설정 후 사용가능 합니다.\n관리자 계정 및 암호를 설정하겠습니까?"

var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="보안코드를 입력해야합니다."



var MSG_SELECT_ITUNES_FOLDER_ERR="iTunes 폴더를 선택하여 주십시오."
var MSG_USB_MODE_WARNING="USB모드를 변경하기 위해서는 시스템을 재시작하여야 합니다.\n계속하시겠습니까?"



var MSG_REMOVE_PLUGIN_APP="선택한 App을 삭제하시겠습니까?"
var MSG_INSTALL_FINISH_MOVE_PAGE="App의 설치가 완료되었습니다.\n[Plug-in APP설정] 페이지에서 설치된 App을 실행할 수 있습니다.\n[Plug-in APP설정 화면으로 이동하시겠습니까?"

var MSG_APACHE_RUN_WARNING="Apache웹서버가 중단된 상태에서 접속할 수 없습니다.\n[기본 내장 App관리]->[서비스설정]에서 Apache서버를 구동하십시오."

var MSG_PLUGIN_NO_USB_HDD="USB에 저장장치를 연결해야 Plug-in APP의 설치가 가능합니다."




// NASCONF
var MSG_NASCONF_SAME_AS_MGMT_PORT="공유기 관리포트와 동일한 포트를 지정하였습니다.\n공유기 관리포트 변경 후, 해당 포트를 사용할 수 있습니다.\n[시스템]->[기타설정]에서 공유기 관리포트를 변경하겠습니까?"

// WIRELESSCONF
var MSG_5G_LOW_CHANNEL_WARNING="[채널36-채널48]은 전파법상 저출력 채널로 규정되어 있습니다.\n원거리 접속 시에는  [채널149-채널161] 사용을 추천합니다.\n계속하시겠습니까?"


var MSG_INVALID_SSID_STRING="는 네트워크이름(SSID)에 사용할 수 없습니다."


var MSG_DYNAMIC_CHANNEL_WARNING="자동채널 해제시 [동적채널변경] 기능도 동시에 해제 됩니다.\n계속하시겠습니까?" 

var PLUGIN_INSTALL_BT_TXT="설치"
var PLUGIN_UPDATE_BT_TXT="업데이트"
var PLUGIN_CANCEL_BT_TXT="취소"
var PLUGIN_REMOVE_BT_TXT="삭제"

var MSG_INVALID_FILE_STR		= "잘못된 파일입니다";
var SYSCONF_LOGIN_INVALID_NEW_ID  =     "새 계정은 영문자와 숫자의 조합만 가능 합니다."

var NATCONF_INTAPPS_FTP_PORT_INVALID		= "포트가 잘못되었습니다"
var NATCONF_INTAPPS_FTP_PORT_EMPTY		= "포트가 지정되지 않았습니다"

var MSG_REBOOT_SECONDS_REMAINS1                  = '';
var MSG_REBOOT_SECONDS_REMAINS2                  = '초 남음';





</script>

