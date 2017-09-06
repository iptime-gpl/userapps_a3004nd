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


var MSG_RESTART_CONFIRM_DEFAULT="系统将恢复到工厂默认值，你确定继续吗?";
var MSG_RESTART_CONFIRM_UPNP="更改UPNP设置系统将会重启，您确定更改设置吗"
var MSG_RESTART_CONFIRM_REBOOT="系统将重启，你确定继续吗";
var MSG_RESTART_CONFIRM_CHANGE_LANIP="更改局域网IP地址系统将重启，你确定继续吗？"
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP="更改局域网IP地址系统将重启，你确定继续吗？"

var MSG_RESTART_CONFIRM_RESTORE="恢复配置系统将重启，你确定继续吗";
var MSG_RESTART_CONFIRM_NAT="更改NAT设置系统将重启，你确定继续吗？"
var MSG_RESTART_CONFIRM_WIRELESS='更改无线模式系统将重启。你硧定继续吗？';                   
var MSG_KAID_MODE_CHANGE_WARNING='更改KAI模式系统将重启。你硧定继续吗？';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='更改无线模式系统将重启。你硧定继续吗？';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='更改无线模式系统将重启。你硧定继续吗？';
var MSG_TWINIP_CONFIRM_WARNING='System will restart to apply Twin IP configuration.\nAre you sure to continue ? ';

// common
var MODIFY_OP='更改'
var MSG_INVALID_HWADDR="错误MAC地址"
var MSG_DELETE_RULE_CONFIRM="规则将会被移除,你确定继续吗?"
var MSG_SELECT_RULE_TO_DEL="选择被删除的规则"
var MSG_ALL_STOP_RULE="你希望停止全部的规则吗？"

var MSG_OPENER_PAGE_MOVED="页面已移除"
var MSG_INVALID_VALUE="Invalid value."



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="网络密钥应该是十六位的字符串"
var MSG_INVALID_WPAPSK_KEY_MISMATCH="网络密钥不同，输入相同的关键字"


// sysconf_configmgmt
var MSG_RESTOREFILE_BLANK="选择一个备份配置文件"

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="规则名称为空"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="你硧定要删除WDS吗？"
var MSG_APADD_REQUEST_APPLY="假如点击'增加'按钮，将完成WDS配置。"

// wirelessconf_basicsetup
var MSG_BLANK_SSID="输入SSID"
var MSG_INVALID_WEP_KEY_LENGTH="错误的网络密钥长度"
var MSG_INVALID_WEP_KEY_HEXVALUE="网络密钥应该是十六进制的"
var MSG_INVALID_WPAPSK_KEY_LENGTH="网络密钥要超过8个字符"
var MSG_INVALID_5_KEY_LENGTH="网络密钥要5个字符"
var MSG_INVALID_13_KEY_LENGTH="网络密钥要13个符"
var SAVE_CONFIGURATION_STRING="保存全部配置吗？"

var MSG_BLANK_REQUEST_SSID="输入SSID，点击'应用'按钮。"   
var MSG_INVALID_REQUEST_KEY="输入网络密钥并点击'应用'按钮"
var MSG_INVALID_REQUEST_APPLY="点击'应用'按钮连接指定AP"
var MSG_APPLY_REQUEST_KEY="点击'应用'按钮应用信道"
var MSG_BEST_CHANNEL_PRE="最好的信道是"
var MSG_BEST_CHANNEL_POST="信道"
var MSG_KEY_LENGTH_DESC="密钥长度 = "

// config_wizard
var MSG_BLANK_ACCOUNT="输入用户名"
var MSG_BLANK_PASSWORD="输入密码"

var MSG_INVALID_IP="IP地址错误"
var MSG_INVALID_NETMASK="子网掩码错误"
var MSG_INVALID_GATEWAY="默认网关错误"
var MSG_INVALID_FDNS="首先DNS错误"
var MSG_INVALID_SDNS="备用DNS错误"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="局域网地址与广域网地址相同"
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="这个IP地址已被增加"
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="这个MAC地址已被增加"

//netconf_wansetup
var NETCONF_INTERNET_DHCP_MTU_INVALID="MTU不能超过1500"
var NETCONF_INTERNET_PPP_MTU_INVALID="MTU不能超过1492"
var NETCONF_INTERNET_KEEP_ALIVE_MSG="最大空闲时间错误"
var NETCONF_INTERNET_GW_INVALID_NETWORK="默认网关要与局域网相同"
var NETCONF_WANSETUP_CONFIRM_WANINFO="您确定更改广域网信息吗？"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="DHCP地址池开始错误"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="DHCP地址池结束错误"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="DHCP地址池范围错误"
var NETCONF_INTERNAL_DELETE_IP="你希望删除保留的IP地址吗？"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="发射功率应是1~100"
var DESC_INVALID_RTS_THRESHOLD="RTS阀值应是1~2347"
var DESC_INVALID_FRAG_THRESHOLD="分片阀值应是256~2346"
var DESC_INVALID_BEACON_INTERVAL="信标周期应是50~1024"

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="重启系统。你硧定继续吗？"
var KAID_MUST_SELECT_OBT_SERVER="至少应该选中一个服务器"
var KAID_RESTART_KAI_UI="请重新打开KAI页面"

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="不能增加更多的端口传发"
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="因特网IP地址错误"
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="外部端口为空"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="外部端口错误"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="外部端口范围错误"
var NATCONF_PORTFORWARD_INVALID_INT_PORT="内部端口错误"
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="内部端口范围错误"
var NATCONF_PORTFORWARD_RUN_RULE="您希望应用规则吗？"


//natrouterconf_misc
var NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT="不能增加更多的FTP端口"
var NATCONF_INTAPPS_FTP_PORT_EMPTY="端口号为空"
var NATCONF_INTAPPS_FTP_PORT_INVALID="端口号错误"

//natrouterconf_router
var NETCONF_ROUTE_ENTRY_DELETE="你希望删除路由表吗？"
var NETCONF_ROUTE_ENTRY_SELECT="选择要删除的路由表"

//natrouterconf_twinzipdmz
var NATCONF_TWINIPDMZ_UPDATE_TIME="IP更新周期应是60秒"
var NATCONF_TWINIPDMZ_WARNING="这台电脑使用双IP。如果没有使用双IP，这台电脑的IP应该被重新配置。你确认继续吗？"


//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="阻隔的无效时间"
var FIREWALLCONF_FIREWALL_DATE_WARNING="选择过滤日期和时间"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="源IP地址错误"
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="源MAC地址错误"
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="目地IP地址错误"
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="目地端口错误"
var FIREWALLCONF_FIREWALL_RUN_RULE="你希望应用规则吗？"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="不能增加更多的条目"
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="优先权错误"

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="最小的连接是10"
var NETCONF_NETDETECT_WARNING2="范围值是0~23"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="电脑数量应从1~253"
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="你要删除全部电脑的信息配置吗？"

//expertconf_ddns
var EXPERTCONF_DDNS_HOSTNAME_IS_BLANK ="主机名称为空"
var EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG ="主机名称必须是以iptime.org结尾"
var EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1 ="没有更多的IPTIME DDNS主机"
var EXPERTCONF_IPTIMEDDNS_INVALID_USERID="仅仅E-mail地址有用"
var EXPERTCONF_DYNDNS_NOMORE_WANRING1="没有更多的DDNS主机"
var INVALID_EMAIL_ADDRESS_STR="E-mail地址错误"
var EXPERTCONF_IPTIMEDDNS_INVALID_HOSTNAME="地址错误"

//expertconf_remotepc
var EXPERTCONF_WOL_PC_NAME_IS_BLANK="电脑名称为空"
var EXPERTCONF_WOL_DEL_PC="你希望删除电脑吗？"
var EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC ="你希望唤醒这台电脑吗？"

//expertconf_hostscan
var ICMP_PING=0
var ARP_PING=1
var PING_SCAN=0
var TCP_PORT_SCAN=1
var SYSINFO_HOST_INVALID_TIMEOUT ="超时为空"
var SYSINFO_HOST_TIMERANGE   ="超时应超过1秒"
var SYSINFO_HOST_INVALID_DATASIZE ="数据大小为空"
var SYSINFO_HOST_DATARANGE    ="数据范围应是0~65000"
var SYSINFO_HOST_INVALID_START  ="开始端口为空"
var SYSINFO_HOST_PORTRANGE      ="端口范围应是0~65535"

//trafficconf_conninfo
var TRAFFICCONF_CONNINFO_DELETE_CONN="您确定删除这个IP 地址的连接信息吗？"

//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="选择VLAN端口"
var SELECT_VLAN_PORT_TRUNK_WARNING ="All port of TRUNK(%s) must be in VLAN."
var SELECT_TRUNK_PORT_WARNING ="选择VLAN端口"
var SELECT_TRUNK_PORT_VLAN_WARNING ="All port of TRUNK must be in VLAN(%s) or another VLAN."
var MAX_MEMBER_TRUNK_WARNING="Maximum number of port is %d."
var ALREADY_OTHER_GROUP_MEMBER="Ports can not be included in multiple groups."

//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="没有更多的端口转发增加"    
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="规则名称为空"
var NATCONF_INTSERVER_INVALID_EXT_PORT="端口错误"
var NATCONF_LOADSHARE_KEEP_WRR="当激活WRR LS时，你可以解除自动备份连接"
var NATCONF_LOADSHARE_ON_LINE_BACKUP="自动备份连接将被激活，你硧认要继续吗？"
var NATCONF_LOADSHARE_DELETE_RULE="你希望删除规则吗？"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="为检测选择一个规则"
//sysconf_syslog
var SYSCONF_SYSLOG_WANRING ="时间错误"
var SYSCONF_SYSLOG_EMAIL_CONFIRM="现在用e-mail发送系统日志报告给管理员"
var SYSCONF_SYSLOG_CLEAR_CONFIRM="全部系统日志将被删除"

//sysconf_login
var SYSCONF_LOGIN_INVALID_NEW_PASS=    "你的新登录密码不匹配"
var SYSCONF_LOGIN_INVALID_NEW_ID  =    "无效新帐户字符： 只允许字母与数字"
var SYSCONF_LOGIN_RELOGIN         =    "您更改成功后将只能使用新用户名密码登陆"

//expertconf_pptpvpn
var EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK="VPN账号为空"
var EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK="VPN密码为空"
var EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID="IP地址为空"
var EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE="你希望删除一个帐号吗？"

//accesslist

var ACCESSLIST_NOIPLISTMSG_1="不能配置IP地址，你要增加你的电脑IP地址连接吗？"
var ACCESSLIST_NOIPLISTMSG_2=") connected?"
var ACCESSLIST_WRONG_INPUT_IP="IP地址错误"
var ACCESSLIST_WRITE_EXPLAIN="描述为空"
var ACCESSLIST_DEL_WANT="你确定删除该设置吗？"

//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="因为局域网地址已改变，请重新连接？"
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="再次连接配置页面"
var SYSCONF_RESTORE_RETRY_CONNET="再次连接恢复配置页面"

//trafficconf_qos
var QOS_BASIC_WARNING="QOS设置将会被改动,确定更改设置吗?"
var QOS_COMMON_EXCCED_MAX_CLASS="超出最大分类数量"
var QOS_COMMON_EXCCED_MAX_SPEED="超出最大英特网速率范围"
var QOS_COMMON_ISOLATED_EXCEED="有“独立”特性的分类总带宽不超过最大的英特网速率范围"  
var QOS_COMMON_NO_CHANGE_DIRECTION="不能改变种类指令"
var QOS_COMMON_ONLY_DIGIT="只有数字有效"
var QOS_COMMON_BASIC_SETUP_FIRST="首先QoS基本设置"
var QOS_PORT_PORTRANGE="端口范围应是1~65535"
var QOS_PORT_INVALID_EXT_PORT_RANGE="外部端口范围错误"
var QOS_BADNWIDTH_EMPTY="带宽量"
var QOS_RATE_RANGE="速率范围：32 Kbps ~ 50 Mbps"

// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="无线网络将断开，你确定继续吗?"


//trafficconf_connctrl
var MSG_CONNECTION_MAX_WARNING="继续？"
var MSG_CONNECTION_MAX_TOO_SMALL="太少的最大连接。设置超过512."
var MSG_UDP_CONNECTION_MAX_TOO_BIG="应该在10和最大连接之间设置最大UDP连接"
var MSG_ICMP_CONNECTION_MAX_TOO_BIG="最大ICMP连接应该少于最大连接"
var MSG_INVALID_RATE_PER_MAX="每一台电脑连接速率错误"

//sysconf_misc
var MSG_WBM_POPUP="重新连接"


var MSG_NO_DEL_ROUTING_TABLE="删除创建的路由表!"
var MSG_NO_DEL_WDS="删除创建的WDS!"


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="同一个端口不能被映射."

var MSG_HUBMODE_WARNING="!!! 警告 !!\nIn Hub模式, 全部NAT路由功能将被禁用，您确定继续吗? "
var MSG_HUBMODE_CONFIRM="按确定键继续."

// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": 不能设置0 Mbps."
var MSG_PORTQOS_MAX_ERROR=":不能设置超过100 Mbps值."
var MSG_PORTQOS_INVALID_VALUE=": 无效值(范围 "


//firewallconf_etc
var DESC_INVALID_ARP_PERIOD="ARP包/秒范围1 ~ 100."

// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="有线WAN端口(广域网端口)将被禁用.您确定继续吗?"

// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="时钟设置值范围0 ~ 23."
var MSG_INVALID_MIN_VALUE="分钟设置值范围0 ~ 59."
var MSG_PPPOE_SCHEDULE_SAME_RULE="相同的规则已经存在."
var QOS_BPI_RANGE="BPI的IP地址范围无效. (范围: 2 ~ 31)"

// qosconf
var QOS_PROTOCOL_SELECT="选择协议的类型."


// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="最终选择一个方法"
var MSG_BACKUP_METHOD_DOMAIN="需要指定域名"

var MSG_INVALID_PROTONUM="Invalid Proto Num"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="启用自动配置信道功能后，系统将自动搜索中继服务器的信道，中继服务器端的信道如果改变，系统会自动匹配信道，无需用户手动更改，确定继续吗？"


var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "所有信息将被清空，是否继续？"
var MSG_SELECT_DEL_MBSS = "Select wireless network to remove."

var AUTO_STRING = "自动"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "自动配置信道"

var UPPER_CHANNEL_TXT = "低频"
var LOWER_CHANNEL_TXT = "高频"

var LAN_GATEWAY_WARNING_MSG = "当没有广域网Internet连接时,这个选项允许路由器自己连接Internet.\n继续?";

var MSG_IPPOOL_MAX_WARNING = "没有更多的IP范围使用条件."


var MSG_IGMP_REBOOT = "重启路由器后，IPTV配置才会生效?"

var MSG_MBSSID_QOS_WARNING="最小值为100Kbps"
var MSG_DFS_WARNING="该信道为DFS信道，AP可能被激活，除非是1~10分钟发现的雷达信号。" 
var SYSCONF_LOGIN_BLANK_ID =     "账号为空"    
var SYSCONF_LOGIN_BLANK_PASS  = "密码为空"    
var SYSCONF_LOGIN_REMOVE_WARNING  = "删除账号/密码，继续？"   
var SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT  = "会话超时1~60分钟"   
var SYSCONF_LOGIN_CANT_REMOVE_ID  = "当会话使用中账号/密码不能被删除"  
var SYSCONF_LOGIN_SHOULD_HAVE_IDPASS  = "连接网络，必须设置账号密码"  
var SYSCONF_LOGIN_RELOGIN_SESSION  = "配置后回到登录界面，继续?"    
var MSG_PPTPVPN_REBOOT = "重启改变PPTP VPN服务器配置?"  
var MSG_QOS_REBOOT=" 重启改变QOS配置"   
var UNALLOWED_ID_MSG  = "不允许使用的ID"
var DESC_INVALID_DCS_PERIOD="范围 1~100"
var INVALID_HOUR_TEXT="范围0~23" 
var INVALID_MIN_TEXT="范围 0~59" 
var SELECT_DAY_DESC="至少一天或每天检查"

var SNMP_INVALID_PORT=    "端口范围 1 - 65535"
var SNMP_COMMUNITY_ALERT=  "范围是强制性的"


var MSG_INVALID_RADIUS_SERVER=  "无效的Radius 服务器地址"
var MSG_INVALID_RADIUS_SECRET=  "无线的Radius 密码"
var MSG_INVALID_RADIUS_PORT=  "无效的Radius 服务器端口"
var MSG_WEP_WARNING= "最大连接速度为54Mbps（11g）是使用WEP和TKIP的加密模式\继续?"
var MSG_WEP_SEC_WARNING="WEP加密模式是不安全的加密设置，我们不推荐使用WEP加密模式（请确认使用还是不使用)"
var MSG_WIRELESS_WAN_WARNING=      "无线广域网功能被另一个无线占用，请关闭掉其他无线广域网功能"
var MSG_WDS_CHANNEL_WARNING=   "信道匹配失败，需要更改信道后再配置\继续？"


var MSG_NEW_BSS= "新的无线网络"
var MSG_NEED_REBOOT_FOR_WWAN="System will be restarted. Continue?"


var MSG_ADD_MAC_WARNING=   "没有无线MAC可以被添加"
var MSG_REMOVE_MAC_WARNING="没有无线MAC可以被删除"
var MSG_INVALID_AUTH_FOR_BRIDGE=  "此AP不能使用桥接模式"

var MSG_NEED_REBOOT_FOR_WWAN="路由器将重新启动，请问要继续吗?"

var MSG_ENABLE_ONE_SERVICE_ID="最少需要一个用户运行."
var MSG_DUPLICATE_SERVICE_ID="一些ID是重复的，更改用户ID."
 


var PASSWORD_NEEDED_TO_SET_THIS="设置用户名及密码需要启用该功能，在【系统】---【管理设置】中设置用户名及密码"

var CANT_SET_DEFAULT_ID_PASS="此为出厂默认用户名及密码，请更改用户名以及密码"
var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="请填写验证码"

var MSG_SELECT_TORRENT_FOLDER_ERR="请选择下载目的文件"
var MSG_SELECT_MEDIA_FOLDER_ERR="请选择媒体文件"
var MSG_MEDIA_NAME_ERR="请填写名称"

var MSG_SELECT_ITUNES_FOLDER_ERR="Select iTunes Folder."
var MSG_USB_MODE_WARNING="To change USB Mode, system should be restarted.\nContinue?"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL

var DDNS_HOSTNAME_RULE_TXT="无效的DDNS主机名"

var SYSCONF_LOGIN_CANT_REMOVE_WARNING="请填写管理员用户名以及密码"



var SYSCONF_ONLINE_UPGRADE_CONFIRM="All router's functions will be stopped during firmware upgrade.\nContinue?"

var FIRMUP_DONE_TXT="Firmware upgrade is done.\nClick 'OK' button to continue."

// USE_SYSCONF_MISC2

var SYSCONF_HOSTNAME_WARNING="路由器的名称至少有一个字母"
var SYSCONF_HOSTNAME_SPECIAL_WARNING="路由器名称不能输入特殊字符和空格"
var SYSCONF_LED_START_TIME_ALERT="开始时间不能晚于结束时间"
var SYSCONF_APPLY_BUTTON_NAME="重启"
var SYSCONF_APPLY_ORIGINAL_VALUE="应用"
var SYSCONF_FAN_ALERT="设定温度范围是不正确的"



var MSG_INVALID_FOLDER_STR="无效的字符串"
var MSG_INVALID_FOLDER_NON_ASCII_STR="只允许Ascii格式名称"
var MSG_INVALID_FOLDER_2DOTS_STR="..不可用"
var MSG_INVALID_FOLDER_DOT_STR="不可使用的名称"
var MSG_CANT_BE_USED="不可用"


var MSG_DYNAMIC_CHANNEL_WARNING="如果使用固定的信道，自动搜索信道功能将会关闭，是否继续？"

var SYSCONF_INVALID_HOSTNAME="Invalid HostName"
var UNPERMITTED_STR_PREFIX="Unpermitted characters:"
var SYSCONF_INVALID_TEMPERATURE="Invalid Temperature.(Temperature <= 100)"


var PLUGIN_INSTALL_BT_TXT="Install"
var PLUGIN_UPDATE_BT_TXT="Update"
var PLUGIN_CANCEL_BT_TXT="Cancel"
var PLUGIN_REMOVE_BT_TXT="Remove"

var MSG_TOO_LONG_SSID="SSID length is too long.\nNon ascii character have 3 bytes.\nCurrent Length of SSID Field: "


	

</script>
