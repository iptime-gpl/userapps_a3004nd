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


var MSG_RESTART_CONFIRM_UPNP='改变UPNP配置后系统将重新启动.\n您是否确定更改 ? ';
var MSG_RESTART_CONFIRM_REBOOT='系统即将重启.\n您是否确定更改?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='更改局域网IP地址后系统将重启.\n您是否确定更改 ?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP='更改局域网IP地址后系统将重启.\n您是否确定更改 ?';
var MSG_RESTART_CONFIRM_WIRELESS='更改无线模式后系统将重启.\n您是否确定更改 ?';
var MSG_KAID_MODE_CHANGE_WARNING='修改KAI模式后系统将重启.\n您是否确定更改 ?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='更改无线模式后系统将重启.\n您是否确定更改?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='更改无线模式后系统将重启.\n您是否确定更改?';
var MSG_TWINIP_CONFIRM_WARNING='应用Twin IP后系统将重启.\n您是否确定更改 ? ';
var MSG_WAN_FOR_LAN_WARNING='更改广域网配置后系统将重启\n确定?';



// common
var MODIFY_OP='Modify'
var MSG_INVALID_HWADDR="无效的MAC地址." 
var MSG_DELETE_RULE_CONFIRM="规则将被删除.\n您是否确定更改?" 
var MSG_SELECT_RULE_TO_DEL="选择要删除的规则."
var MSG_ALL_STOP_RULE="您想清除所有规则吗?"

var MSG_OPENER_PAGE_MOVED="页面变更."
var MSG_INVALID_VALUE="无效值."



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="网络密钥应该是十六进制的字符串."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="不同的网络密钥.\n填写相同的密钥."


//NAT路由 MSG_RULE_NAME_IS_BLANK="规则名称是空白的."


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="您确定要删除WDS吗?" 
var MSG_APADD_REQUEST_APPLY="如果按 '增加' 按钮, WDS配置将完成."
var MSG_NO_DEL_WDS="选择要删除的WDS!"


// wirelessconf_basicsetup
var MSG_BLANK_SSID="输入SSID."
var MSG_INVALID_WEP_KEY_LENGTH="无效的网络密钥长度."
var MSG_INVALID_WEP_KEY_HEXVALUE="网络密钥应为十六进制."
var MSG_INVALID_WPAPSK_KEY_LENGTH="网络密钥应超过8个字符."
var MSG_INVALID_5_KEY_LENGTH="网络密钥应为5个字符."
var MSG_INVALID_13_KEY_LENGTH="网络密钥应为13个字符."
var SAVE_CONFIGURATION_STRING="保存所有配置?"

var MSG_BLANK_REQUEST_SSID="输入SSID，并按“应用”按钮."
var MSG_INVALID_REQUEST_KEY="输入网络密钥并按“应用”按钮."
var MSG_INVALID_REQUEST_APPLY="按“应用”按钮连接指定的AP."
var MSG_APPLY_REQUEST_KEY="按“应用”按钮应用1信道"
var MSG_BEST_CHANNEL_PRE="最好的信道是 " 
var MSG_BEST_CHANNEL_POST="1信道"
var MSG_KEY_LENGTH_DESC="密钥长度 = "

// 配置向导 MSG_BLANK_ACCOUNT="输入用户名."
var MSG_BLANK_PASSWORD="输入密码."

var MSG_INVALID_IP="无效的IP地址."
var MSG_INVALID_NETMASK="无效的子网掩码."
var MSG_INVALID_GATEWAY="无效的网关地址."
var MSG_INVALID_FDNS="无效的首选DNS"
var MSG_INVALID_SDNS="无效的次级DNS"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="局域网IP地址和广域网IP地址相同."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="此IP地址已被添加."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="此MAC地址已被添加."



var MSG_ERROR_NETWORK_LANIP="局域网IP地址不能和广域网IP地址相同"
var MSG_ERROR_BROAD_LANIP="局域网IP地址不能和本地广播地址相同"


//netconf_wansetup


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="无效的DHCP地址池开始"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="无效的DHCP地址池结束"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="无效的DHCP池范围"
var NETCONF_INTERNAL_DELETE_IP="是否要删除此保留的IP地址?"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="TX功率应该是从1到100.";
var DESC_INVALID_RTS_THRESHOLD="RTS门限应该从1到2347.";
var DESC_INVALID_FRAG_THRESHOLD="碎片化门槛应从256到2346.";
var DESC_INVALID_BEACON_INTERVAL="Beacon 周期应为50至1024.";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="重新启动系统。你确定要继续吗 ?"
var KAID_MUST_SELECT_OBT_SERVER="至少，一个服务器应该被选择."
var KAID_RESTART_KAI_UI="请重新启动用户界面."

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="不能再添加更多的端口."
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="无效的内部IP地址."
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="外部端口是空白的"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="无效的外部端口."
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="无效的外部端口范围."
var NATCONF_PORTFORWARD_INVALID_INT_PORT="无效的内部端口."
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="无效的内部端口范围"
var NATCONF_PORTFORWARD_RUN_RULE="你想应用规则吗?"

//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="无效的时间范围."
var FIREWALLCONF_FIREWALL_DATE_WARNING="选择时间范围."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="无效的源IP地址."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="无效的源IP地址."
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="无效目的地址."
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="无效的目的端口."
var FIREWALLCONF_FIREWALL_RUN_RULE="您想应用规则吗?"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="没有更多的帐户."
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="无效的优先."

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="最小连接值为10."
var NETCONF_NETDETECT_WARNING2="0 ~ 23 范围值"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="PC的数量应从1~253."
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="您想清除所有的PC配置信息?"


//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="选择端口."
var SELECT_VLAN_PORT_TRUNK_WARNING ="所有的端口(%s) 必须在VLAN内."
var SELECT_TRUNK_PORT_WARNING ="选择中继端口."
var SELECT_TRUNK_PORT_VLAN_WARNING ="所有端口必须在VLAN(%s) 或者其他的VLAN."
var MAX_MEMBER_TRUNK_WARNING="最大端口数 %d."
var ALREADY_OTHER_GROUP_MEMBER="端口不能包含在多个组中."


//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="没有更多的添加端口."
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="规则名称空白."
var NATCONF_INTSERVER_INVALID_EXT_PORT="无效的端口."
var NATCONF_LOADSHARE_KEEP_WRR="当WRR LS激活您可以关闭自动备份功能." 
var NATCONF_LOADSHARE_ON_LINE_BACKUP="自动备份也将被激活。您想继续吗?"
var NATCONF_LOADSHARE_DELETE_RULE="是否要删除规则?"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="选择要检测的规则."

//sysconf_login


//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="由于本地IP地址的更改，请重新连接."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="重新连接到配置页."


// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="无线网络将被删除。你确定要继续吗 ?"
var MSG_MBSSID_QOS_WARNING="最小值为 100 Kbps."


//sysconf_misc
var MSG_WBM_POPUP="重新连接."


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="同样的端口不能被镜像."

var MSG_HUBMODE_WARNING="!!! 警告 !!\nHUB模式，NAT路由功能将停止并设置无法连接配置页面。\n \n\n继续? "
var MSG_HUBMODE_CONFIRM="按“确定”按钮继续."


// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": 0 Mbps 不能被配置."
var MSG_PORTQOS_MAX_ERROR=": 大于100 Mbps 不能被配置."
var MSG_PORTQOS_INVALID_VALUE=": 无效(应该为 "



// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="有线广域网端口(广域网端口) 将被关闭. 您是否想继续?"


// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="小时范围为 0 ~ 23."
var MSG_INVALID_MIN_VALUE="分钟范围为0 ~ 59."
var MSG_PPPOE_SCHEDULE_SAME_RULE="相同的时间表已经存在."

// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="至少选择一个程序"
var MSG_BACKUP_METHOD_DOMAIN="应指定域名"


var MSG_INVALID_PROTONUM="Invalid Proto Num"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="[自动搜索信道] 此功能在搜索其他的AP源信号的信道.\n\当网桥功能丢失那么这个AP将保持连接上级AP，这个功能可以保持AP功能有效.\n\所以，我们不建议使用网桥功能和AP功能，只有当 [自动搜索信道] 未开启.\n\继续?";

var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "所有的选项将清除.\n继续?"
var MSG_SELECT_DEL_MBSS = "选择要删除的无线网络."


var AUTO_STRING = "自动"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "自动搜索信道"

var UPPER_CHANNEL_TXT = "低级的"
var LOWER_CHANNEL_TXT = "高级的"

var LAN_GATEWAY_WARNING_MSG = "当没有广域网连接时，此选项对路由器本身连接互联网是有效的.\nContinue?";
var MSG_IPPOOL_MAX_WARNING = "没有使用IP地址的范围."

var MSG_DFS_WARNING="这个频道是DFS信道.\n只有在雷达信号被发现时才被激活 1 ~ 10 minutes."


var SYSCONF_LOGIN_BLANK_ID =     "账户是空的."
var SYSCONF_LOGIN_BLANK_PASS  = "密码是空的."
var SYSCONF_LOGIN_REMOVE_WARNING  = "删除帐户/密码。继续?"




var MSG_PPTPVPN_REBOOT = "改变PPTP VPN后重新启动服务器?"
var MSG_QOS_REBOOT="改变QoS配置后重新启动."


var DESC_INVALID_DCS_PERIOD="范围应  1 ~ 100."

var INVALID_HOUR_TEXT="范围应 0 ~ 23."
var INVALID_MIN_TEXT="范围应 0 ~ 59."
var SELECT_DAY_DESC="最少一天检查一次."




var SNMP_INVALID_PORT= "端口范围 1 - 65535."
var SNMP_COMMUNITY_ALERT= "域为强制性."


var MSG_INVALID_RADIUS_SERVER="无效的RADIUS服务器地址"
var MSG_INVALID_RADIUS_SECRET="无效的RADIUS服务器密码"
var MSG_INVALID_RADIUS_PORT="无效的RADIUS服务器端口"
var MSG_WEP_WARNING="最大连接数率 54Mbps(11g) 当选择WEP或者TKIP.\n继续?"
var MSG_WEP_SEC_WARNING="WEP是很弱的加密设置.我们不推荐使用WEP.\n使用WEP或者不使用?"
var MSG_WIRELESS_WAN_WARNING="无线广域网功能已经被另一个无线接口使用了。关闭其他无线接口中的无线广域网功能."
var MSG_WDS_CHANNEL_WARNING="信道匹配不对.\n更改信道后应用.\n继续?"


var MSG_NEW_BSS="新的无线网络"

var MSG_ADD_MAC_WARNING="没有检查添加的地址."
var MSG_REMOVE_MAC_WARNING="没有检查删除的地址."



var MSG_NEED_REBOOT_FOR_WWAN="系统将被重新启动。继续?"




var PASSWORD_NEEDED_TO_SET_THIS="应更改帐户和密码，以启用此功能.\n设置帐户和密码 [系统]->[账号配置]页面."


var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="填写安全码"

var MSG_SELECT_ITUNES_FOLDER_ERR="选择iTunes文件夹."
var MSG_USB_MODE_WARNING="改变USB模式，应该重新启动系统.\n继续?"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL






// NASCONF
var MSG_NASCONF_SAME_AS_MGMT_PORT="路由器管理端口使用的同一个端口.\n首先，更改路由器管理端口和使用此端口."

// WIRELESSCONF
var MSG_5G_LOW_CHANNEL_WARNING="低功率信道选择。推荐使用 [149-161] 长覆盖信道."
var MSG_5G_USA_CHANNEL="[美国,加拿大] 区域支持高功率。在其他国家使用可以禁止国家规定."


var MSG_DYNAMIC_CHANNEL_WARNING="如果信道被使用,  [动态信道搜索] 功能将被禁用\n继续?"




var PLUGIN_INSTALL_BT_TXT="安装"
var PLUGIN_UPDATE_BT_TXT="升级"
var PLUGIN_CANCEL_BT_TXT="清除"
var PLUGIN_REMOVE_BT_TXT="移动"

var MSG_TOO_LONG_SSID="SSID长度太长.\n非ASCII字符有3个字节.\nSSID的磁场电流的长度: "


var MSG_INVALID_FILE_STR		= "无效件.";
var MSG_REBOOT_SECONDS_REMAINS1			= '';
var MSG_REBOOT_SECONDS_REMAINS2			= '秒';

</script>

