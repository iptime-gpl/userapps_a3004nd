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


var MSG_RESTART_CONFIRM_UPNP='系統將重啟以改變UPNP設定。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_REBOOT='系統將重新啟動。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='系統將重啟以改變LAN IP位址設定。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP='系統將重啟以改變LAN IP位址設定。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_WIRELESS='系統將重啟以改變無線模式。\n確定要繼續嗎？';
var MSG_KAID_MODE_CHANGE_WARNING='系統將重啟以改變KAI模式。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='系統將重啟以改變無線模式。\n確定要繼續嗎？';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='系統將重啟以改變無線模式。\n確定要繼續嗎？';
var MSG_TWINIP_CONFIRM_WARNING='系統將重啟以套用Twin IP設定。\n確定要繼續嗎？';
var MSG_WAN_FOR_LAN_WARNING='系統將重啟以改變WAN通訊埠功能。\n確定要繼續嗎？';



// common
var MODIFY_OP='修改'
var MSG_INVALID_HWADDR="MAC位址錯誤"
var MSG_DELETE_RULE_CONFIRM="規則將移除。\n確定要繼續嗎？" 
var MSG_SELECT_RULE_TO_DEL="請選取要刪除的規則"
var MSG_ALL_STOP_RULE="確定要停用所有規則嗎？"

var MSG_OPENER_PAGE_MOVED="頁面已遷移"
var MSG_INVALID_VALUE="數值錯誤"



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="網路金鑰必需為十六進制字串"
var MSG_INVALID_WPAPSK_KEY_MISMATCH="網路金鑰不符。\n請輸入正確金鑰"


//natrouterconf
var MSG_RULE_NAME_IS_BLANK="請輸入規則名稱"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="是否確認刪除WDS？" 
var MSG_APADD_REQUEST_APPLY="按下新增按鈕以完成WDS設定"
var MSG_NO_DEL_WDS="請選取要刪除的WDS"


// wirelessconf_basicsetup
var MSG_BLANK_SSID="請輸入SSID"
var MSG_INVALID_WEP_KEY_LENGTH="網路金鑰長度錯誤"
var MSG_INVALID_WEP_KEY_HEXVALUE="網路金鑰必需為十六進制"
var MSG_INVALID_WPAPSK_KEY_LENGTH="網路金鑰需至少8碼"
var MSG_INVALID_5_KEY_LENGTH="網路金鑰應為5碼"
var MSG_INVALID_13_KEY_LENGTH="網路金鑰應為13碼"
var SAVE_CONFIGURATION_STRING="確認儲存所有設定？"

var MSG_BLANK_REQUEST_SSID="請輸入SSID並按下'套用'按鈕"
var MSG_INVALID_REQUEST_KEY="請輸入網路金鑰並按下'套用'按鈕"
var MSG_INVALID_REQUEST_APPLY="請按下'套用'按鈕連線指定AP"
var MSG_APPLY_REQUEST_KEY="請按下'套用'按鈕套用頻道設定"
var MSG_BEST_CHANNEL_PRE="最佳頻道為" 
var MSG_BEST_CHANNEL_POST="頻道"
var MSG_KEY_LENGTH_DESC="金鑰長度 ="

// config_wizard
var MSG_BLANK_ACCOUNT="請輸入使用者名稱"
var MSG_BLANK_PASSWORD="請輸入密碼"

var MSG_INVALID_IP="IP位址錯誤"
var MSG_INVALID_NETMASK="子網路遮罩錯誤"
var MSG_INVALID_GATEWAY="預設閘道錯誤"
var MSG_INVALID_FDNS="主要DNS錯誤"
var MSG_INVALID_SDNS="次要DNS錯誤"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="LAN位址與WAN位址相同"
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="此IP位址已新增"
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="此MAC位址已新增"



var MSG_ERROR_NETWORK_LANIP="LAN IP位址不可與網路位址相同"
var MSG_ERROR_BROAD_LANIP="LAN IP位址不可與本地廣播位址相同"


//netconf_wansetup


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="DHCP起始位址錯誤"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="DHCP結束位址錯誤"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="DHCP範圍錯誤"
var NETCONF_INTERNAL_DELETE_IP="確認要刪除此保留IP位址嗎？"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="傳輸功率應為1~100";
var DESC_INVALID_RTS_THRESHOLD="RTS臨界值應為1~2347";
var DESC_INVALID_FRAG_THRESHOLD="Fragmentation臨界值應為256~2346";
var DESC_INVALID_BEACON_INTERVAL="Beacon間隔應為50~1024";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="重新啟動系統。確定要繼續嗎？"
var KAID_MUST_SELECT_OBT_SERVER="請至少選擇一個伺服器"
var KAID_RESTART_KAI_UI="請重新開啟KAI界面"

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="無法再新增通訊埠轉發規則"
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="內部IP位址錯誤"
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="請輸入外部通訊埠"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="外部通訊埠錯誤"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="外部通訊埠範圍錯誤"
var NATCONF_PORTFORWARD_INVALID_INT_PORT="外部通訊埠錯誤"
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="內部通訊埠範圍錯誤"
var NATCONF_PORTFORWARD_RUN_RULE="確認要套用規則嗎？"

//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="限制時間錯誤"
var FIREWALLCONF_FIREWALL_DATE_WARNING="請選擇限制日期"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="來源IP位址錯誤"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="來源MAC位址錯誤"
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="目的IP位址錯誤"
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="目的通訊埠錯誤"
var FIREWALLCONF_FIREWALL_RUN_RULE="確定要套用設定嗎？"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="已無法再新增規則"
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="優先權錯誤"

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="最小連線數為10。"
var NETCONF_NETDETECT_WARNING2="數值範圍0~23"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="電腦數量應為1~253"
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="是否請除所有電腦資訊設定？"


//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="請選擇虛擬區域網路通訊埠"
var SELECT_VLAN_PORT_TRUNK_WARNING ="TRUNK(%s)的所有通訊埠必需在虛擬區域網路中"
var SELECT_TRUNK_PORT_WARNING ="請選擇TRUNK通訊埠"
var SELECT_TRUNK_PORT_VLAN_WARNING ="TRUNK的所有通訊埠必需在虛擬區域網路(%s)或其他虛擬區域網路中"
var MAX_MEMBER_TRUNK_WARNING="通訊埠最大值為%d"
var ALREADY_OTHER_GROUP_MEMBER="通訊埠不可包含在多個群組中"


//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="無法再新增通訊埠轉發規則"
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="請輸入規則名稱"
var NATCONF_INTSERVER_INVALID_EXT_PORT="通訊埠錯誤"
var NATCONF_LOADSHARE_KEEP_WRR="當WRR LS啟用時可以停用自動線路備援" 
var NATCONF_LOADSHARE_ON_LINE_BACKUP="自動線路備援也將啟用。確定要繼續嗎？"
var NATCONF_LOADSHARE_DELETE_RULE="確定要刪除規則嗎？"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="請選擇要刪除的規則"

//sysconf_login


//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="因本地IP位址更改，請重新連線。"
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="重新連接設定頁面"


// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="無線網路將被移除。確定要繼續嗎？"
var MSG_MBSSID_QOS_WARNING="最小數值為100Kbps"


//sysconf_misc
var MSG_WBM_POPUP="請再次重新連接"


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="相同通訊埠無法鏡像"

var MSG_HUBMODE_WARNING="警告g !!\n在Hub模式下，所有NAT路由功能將停止且設定頁面將無法連線\n\n\
確定要繼續嗎? "  
var MSG_HUBMODE_CONFIRM="請按確定按鈕繼續"


// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": 無法設定為0Mbps"
var MSG_PORTQOS_MAX_ERROR=": 數值無法設定超過100Mbps"
var MSG_PORTQOS_INVALID_VALUE=": 速率錯誤(應該為 "



// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="有線WAN通訊埠(網際網路通訊埠)將停止。確定要繼續嗎？"


// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="小時的數值需為0~23"
var MSG_INVALID_MIN_VALUE="分鐘的數值需為0~59"
var MSG_PPPOE_SCHEDULE_SAME_RULE="The same schedule already exists."

// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="請至少選擇一個方式"
var MSG_BACKUP_METHOD_DOMAIN="請輸入網域名稱"


var MSG_INVALID_PROTONUM="通訊協定代號錯誤"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="如果前端AP頻道改變[自動頻道搜尋]功能將搜尋前端AP\n\
因每當連線遺失時此AP將持續搜尋前端AP，可能導致AP功能不正常。\n\
所以並不建議在[自動頻道搜尋]開啟情況下同時使用中繼功能。\n\
確定要繼續嗎？";

var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "所有選項將被清除。\n要繼續嗎？"
var MSG_SELECT_DEL_MBSS = "請選取要移除的無線網路"


var AUTO_STRING = "自動"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "自動頻道搜尋"

var UPPER_CHANNEL_TXT = "Lower"
var LOWER_CHANNEL_TXT = "Upper"

var LAN_GATEWAY_WARNING_MSG = "當WAN無網路連線時，此選項可有效使路由器本身連線至網際網路。確定要繼續嗎？";
var MSG_IPPOOL_MAX_WARNING = "超出可用IP範圍"

var MSG_DFS_WARNING="此頻道為DFS頻道。\n只有直到載波訊號在1~10分鐘間找到AP才可能會啟動" 


var SYSCONF_LOGIN_BLANK_ID =     "請輸入使用者名稱"
var SYSCONF_LOGIN_BLANK_PASS  = "請輸入密碼"
var SYSCONF_LOGIN_REMOVE_WARNING  = "移除使用者名稱/密碼。要繼續嗎？"




var MSG_PPTPVPN_REBOOT = "要重新啟動以變更PPTPVPN伺服器設定嗎？"
var MSG_QOS_REBOOT="要重新啟動以變更QoS設定嗎"


var DESC_INVALID_DCS_PERIOD="範圍應為1~100"

var INVALID_HOUR_TEXT="範圍應為0~23"
var INVALID_MIN_TEXT="範圍應為0~59"
var SELECT_DAY_DESC="請選擇每天或全天"




var SNMP_INVALID_PORT= "通訊埠數值應為1-65535"
var SNMP_COMMUNITY_ALERT= "Community欄位是必須的"


var MSG_INVALID_RADIUS_SERVER="RADIUS伺服器位址錯誤"
var MSG_INVALID_RADIUS_SECRET="RADIUS密碼錯誤"
var MSG_INVALID_RADIUS_PORT="RADIUS伺服器通訊埠錯誤t"
var MSG_WEP_WARNING="使用WEP或是TKIP時，最大連線速率為54Mbps(11g)。\n確定要繼續嗎？"
var MSG_WEP_SEC_WARNING="WEP加密設定安全性較弱。不建議使用WEP。\n仍要使用嗎？"
var MSG_WIRELESS_WAN_WARNING="無線WAN功能已被其他無線界面使用。請先關閉其他使用無線WAN功能的無線界面。"
var MSG_WDS_CHANNEL_WARNING="頻道無法匹配。\n需要在套用後更改頻道設定。\n要繼續嗎？"


var MSG_NEW_BSS="新增無線網路"

var MSG_ADD_MAC_WARNING="請先選取要新增的MAC位址"
var MSG_REMOVE_MAC_WARNING="請先選取要移除的MAC位址"



var MSG_NEED_REBOOT_FOR_WWAN="系統將重新啟動。確定繼續嗎？"




var PASSWORD_NEEDED_TO_SET_THIS="啟用此功能需要更改使用者名稱及密碼。\n請至[系統工具]->[登入密碼]頁面設定。"


var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="請輸入密碼"

var MSG_SELECT_ITUNES_FOLDER_ERR="請選擇iTunes資料夾"
var MSG_USB_MODE_WARNING="更改USB模式，系統需要重啟。\n確定繼續嗎？"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL






// NASCONF
var MSG_NASCONF_SAME_AS_MGMT_PORT="此通訊埠已被作為路由器管理通訊埠。\n請先更改路由器管理通訊埠。"

// WIRELESSCONF
var MSG_5G_LOW_CHANNEL_WARNING="選擇了低傳輸功率頻道。建議使用[149-161]頻道以得到較好的訊號涵蓋範圍"
var MSG_5G_USA_CHANNEL="[USA,Canada]地區支援高傳輸高率。使用在其他國家可能依法規被禁止。"


var MSG_DYNAMIC_CHANNEL_WARNING="如果使用固定頻道，[動態頻道搜尋]功能將停用\n要繼續嗎？"




var PLUGIN_INSTALL_BT_TXT="安裝"
var PLUGIN_UPDATE_BT_TXT="更新"
var PLUGIN_CANCEL_BT_TXT="取消"
var PLUGIN_REMOVE_BT_TXT="移除"

var MSG_TOO_LONG_SSID="SSID長度過長"


var MSG_INVALID_FILE_STR		= "檔案錯誤";
var MSG_REBOOT_SECONDS_REMAINS1		= '剩餘時間';
var MSG_REBOOT_SECONDS_REMAINS2		= '秒';

</script>

