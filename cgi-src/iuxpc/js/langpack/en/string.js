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


var MSG_RESTART_CONFIRM_UPNP='System will restart to change UPNP configuration.\nAre you sure to continue ? ';
var MSG_RESTART_CONFIRM_REBOOT='System will restart.\nAre you sure to continue?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='System will restart to change LAN IP address.\nAre you sure to continue ?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP='System will restart to change LAN IP address.\nAre you sure to continue ?';
var MSG_RESTART_CONFIRM_WIRELESS='System will restart to change wireless mode.\nAre you sure to continue ?';
var MSG_KAID_MODE_CHANGE_WARNING='System will restart to change KAI mode.\nAre you sure to continue ?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='System will restart to change wireless mode.\nAre you sure to continue?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='System will restart to change wireless mode.\nAre you sure to continue?';
var MSG_TWINIP_CONFIRM_WARNING='System will restart to apply Twin IP configuration.\nAre you sure to continue ? ';
var MSG_WAN_FOR_LAN_WARNING='System will restart to change WAN port function\nContinue?';



// common
var MODIFY_OP='Modify'
var MSG_INVALID_HWADDR="Invalid MAC Address." 
var MSG_DELETE_RULE_CONFIRM="Rule will be removed.\nAre you sure to continue?" 
var MSG_SELECT_RULE_TO_DEL="Select a rule to be deleted."
var MSG_ALL_STOP_RULE="Do you want to stop all rules?"

var MSG_OPENER_PAGE_MOVED="Page is Moved."
var MSG_INVALID_VALUE="Invalid value."



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="Network key should be hex decimal string."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="Network Key is different.\nPut the same key."


//natrouterconf
var MSG_RULE_NAME_IS_BLANK="Rule name is blank."


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="Are you sure to delete WDS?" 
var MSG_APADD_REQUEST_APPLY="If press 'Add' button, WDS configuration will be done."
var MSG_NO_DEL_WDS="Select WDS to delete!"


// wirelessconf_basicsetup
var MSG_BLANK_SSID="Put the SSID."
var MSG_INVALID_WEP_KEY_LENGTH="Invalid network key length."
var MSG_INVALID_WEP_KEY_HEXVALUE="Network key should be hex decimal."
var MSG_INVALID_WPAPSK_KEY_LENGTH="Network key should be more than 8 characters."
var MSG_INVALID_5_KEY_LENGTH="Network Key should be 5 characters."
var MSG_INVALID_13_KEY_LENGTH="Network Key should be 13 characters."
var SAVE_CONFIGURATION_STRING="Save all configuration?"

var MSG_BLANK_REQUEST_SSID="Put the SSID, and press 'Apply' button."
var MSG_INVALID_REQUEST_KEY="Put the Network key and press 'Apply' button."
var MSG_INVALID_REQUEST_APPLY="Press 'Apply' button to connect specified AP."
var MSG_APPLY_REQUEST_KEY="Press 'Apply' button to apply the channel"
var MSG_BEST_CHANNEL_PRE="Best channel is " 
var MSG_BEST_CHANNEL_POST="channel"
var MSG_KEY_LENGTH_DESC="Key length = "

// config_wizard
var MSG_BLANK_ACCOUNT="Put the User ID."
var MSG_BLANK_PASSWORD="Put the Password."

var MSG_INVALID_IP="Invalid IP Address."
var MSG_INVALID_NETMASK="Invalid subnet mask."
var MSG_INVALID_GATEWAY="Invalid default gateway."
var MSG_INVALID_FDNS="Invalid primary DNS"
var MSG_INVALID_SDNS="Invalid secondary DNS"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="Lan address is the same as WAN address."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="This IP Address has been already added."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="This MAC Address has been already added."



var MSG_ERROR_NETWORK_LANIP="LAN IP address can't be the same as Network Address"
var MSG_ERROR_BROAD_LANIP="LAN IP address can't be the same as Local Broadcast Address"


//netconf_wansetup


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="Invalid DHCP start pool address"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="Invalid DHCP end pool address"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="Invalid DHCP pool range"
var NETCONF_INTERNAL_DELETE_IP="Do you want to delete this reserved IP address?"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="Tx Power should be from 1 to 100.";
var DESC_INVALID_RTS_THRESHOLD="RTS Threshold should be from 1 to 2347.";
var DESC_INVALID_FRAG_THRESHOLD="Fragmentation Threshold should be from 256 to 2346.";
var DESC_INVALID_BEACON_INTERVAL="Beacon Period should be from 50 to 1024.";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="Restart system. Are you sure to continue ?"
var KAID_MUST_SELECT_OBT_SERVER="At least, one server should be selected."
var KAID_RESTART_KAI_UI="Please restart KAI UI."

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="No more add Port Forward."
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="Invalid internal IP Address."
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="External Port is blank"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="Invalid External Port."
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="Invalid External Port Range."
var NATCONF_PORTFORWARD_INVALID_INT_PORT="Invalid Internal Port."
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="Invalid Internal Port Range"
var NATCONF_PORTFORWARD_RUN_RULE="Do you want to apply rule?"

//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="Invalid Time to Block."
var FIREWALLCONF_FIREWALL_DATE_WARNING="Select Date to Block."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="Invalid Source IP Address."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="Invalid Source MAC Address."
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="Invalid Destination IP Address."
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="Invalid Destination Port."
var FIREWALLCONF_FIREWALL_RUN_RULE="Do you want to apply rule?"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="No more add account."
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="Invalid priority."

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="Minimum connection is 10."
var NETCONF_NETDETECT_WARNING2="0 ~ 23 range value"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="Number of PC should be from 1 to 253."
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="Do you clear configuration to all PC infomation?"


//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="Select VLAN Port."
var SELECT_VLAN_PORT_TRUNK_WARNING ="All port of TRUNK(%s) must be in VLAN."
var SELECT_TRUNK_PORT_WARNING ="Select TRUNK Port."
var SELECT_TRUNK_PORT_VLAN_WARNING ="All port of TRUNK must be in VLAN(%s) or another VLAN."
var MAX_MEMBER_TRUNK_WARNING="Maximum number of port is %d."
var ALREADY_OTHER_GROUP_MEMBER="Ports can not be included in multiple groups."


//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="No more add Port Forward."
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="Rule name is blank."
var NATCONF_INTSERVER_INVALID_EXT_PORT="Invalid Port."
var NATCONF_LOADSHARE_KEEP_WRR="You can deactivate Auto Line Backup while WRR LS has being activated." 
var NATCONF_LOADSHARE_ON_LINE_BACKUP="Auto Line Backup will be activated also. Do you want to continue?"
var NATCONF_LOADSHARE_DELETE_RULE="Do you want to delete rule?"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="Select a rule to be detected."

//sysconf_login


//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="Because of local IP address change, Reconnect."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="Reconnect to the configuration page."


// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="Wireless network will be removed. Are you sure to continue ?"
var MSG_MBSSID_QOS_WARNING="Minimum value is 100 Kbps."


//sysconf_misc
var MSG_WBM_POPUP="Reconnect again."


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="The same port can't be mirrored."

var MSG_HUBMODE_WARNING="!!! Warning !!\nIn Hub Mode, all nat routing function would be stopped and Setup web page can't be connected.\n\n\
Continue? "
var MSG_HUBMODE_CONFIRM="Press OK button to continue."


// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": 0 Mbps can't be configured."
var MSG_PORTQOS_MAX_ERROR=": The value over 100 Mbps can't be configured."
var MSG_PORTQOS_INVALID_VALUE=": Invalid rate(it should be "



// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="Wired WAN Port(Internet Port) will be stopped. Do you want to continue?"


// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="Hour value should be in 0 ~ 23."
var MSG_INVALID_MIN_VALUE="Min value should be in 0 ~ 59."
var MSG_PPPOE_SCHEDULE_SAME_RULE="The same schedule already exists."

// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="Select at least one method"
var MSG_BACKUP_METHOD_DOMAIN="Domain name should be designated"


var MSG_INVALID_PROTONUM="Invalid Proto Num"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="[Auto Channel Search] function will search the upper AP if the upper AP channel is changed.\n\
Because this AP keep searching the upper AP whenever bridge connection is lost, this function can make AP function be abnormal.\n\
So, we don't recommend to use multi bridge function and AP function together only when [Auto Channel Search] is ON.\n\
Continue?";

var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "All options will be cleared.\nContinue?"
var MSG_SELECT_DEL_MBSS = "Select wireless network to remove."


var AUTO_STRING = "Auto"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "Auto Channel Search"

var UPPER_CHANNEL_TXT = "Lower"
var LOWER_CHANNEL_TXT = "Upper"

var LAN_GATEWAY_WARNING_MSG = "When no WAN internet connection, this option is valid for router itself to connect internet.\nContinue?";
var MSG_IPPOOL_MAX_WARNING = "No more use of the IP range condition."

var MSG_DFS_WARNING="This channel is DFS channel.\nAP may be activated only unless radar signal is found during 1 ~ 10 minutes."


var SYSCONF_LOGIN_BLANK_ID =     "Account is empty."
var SYSCONF_LOGIN_BLANK_PASS  = "Password is empty."
var SYSCONF_LOGIN_REMOVE_WARNING  = "Remove Account/Password. Continue?"




var MSG_PPTPVPN_REBOOT = "Reboot to change PPTPVPN server configuration?"
var MSG_QOS_REBOOT="Reboot to change QOS configuration."


var DESC_INVALID_DCS_PERIOD="The range should be  1 ~ 100."

var INVALID_HOUR_TEXT="The range should be 0 ~ 23."
var INVALID_MIN_TEXT="The range should be 0 ~ 59."
var SELECT_DAY_DESC="Check day or every day at least."




var SNMP_INVALID_PORT= "Port Number should be 1 - 65535."
var SNMP_COMMUNITY_ALERT= "Community field is mandatory."


var MSG_INVALID_RADIUS_SERVER="Invalid RADIUS server address"
var MSG_INVALID_RADIUS_SECRET="Invalid RADIUS password"
var MSG_INVALID_RADIUS_PORT="Invalid RADIUS server port"
var MSG_WEP_WARNING="Maximum link rate is 54Mbps(11g) when WEP or TKIP is used.\nContinue?"
var MSG_WEP_SEC_WARNING="WEP is very weak encryption setup. We don't recommend to use WEP.\nUse WEP or not?"
var MSG_WIRELESS_WAN_WARNING="Wireless WAN function is already used by another wireless interface. Turn off the wireless WAN function in the other wireless interface."
var MSG_WDS_CHANNEL_WARNING="Channel is mismatched.\nNeed to change the channel after apply.\nContinue?"


var MSG_NEW_BSS="New Wireless Network"

var MSG_ADD_MAC_WARNING="No MAC address is checked to add."
var MSG_REMOVE_MAC_WARNING="No MAC address is checked to remove."



var MSG_NEED_REBOOT_FOR_WWAN="System will be restarted. Continue?"




var PASSWORD_NEEDED_TO_SET_THIS="Account & Password should be changed to enable this function.\nSet the account & password in the [System]->[Admin Setup] page."


var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="Fill security code"

var MSG_SELECT_ITUNES_FOLDER_ERR="Select iTunes Folder."
var MSG_USB_MODE_WARNING="To change USB Mode, system should be restarted.\nContinue?"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL






// NASCONF
var MSG_NASCONF_SAME_AS_MGMT_PORT="Same Port is used by Router Management Port.\nFirst, change the router mgmt port and use this port."

// WIRELESSCONF
var MSG_5G_LOW_CHANNEL_WARNING="Low Tx Power Channel is selected. Recommend to use [149-161] Channel for long coverage."
var MSG_5G_USA_CHANNEL="[USA,Canada] region support High Tx power. Using in other country can prohibit country regulations."


var MSG_DYNAMIC_CHANNEL_WARNING="If static channel is used,  [Dynamic Channel Search] function will be disabled\nContinue?"




var PLUGIN_INSTALL_BT_TXT="Install"
var PLUGIN_UPDATE_BT_TXT="Update"
var PLUGIN_CANCEL_BT_TXT="Cancel"
var PLUGIN_REMOVE_BT_TXT="Remove"

var MSG_TOO_LONG_SSID="SSID length is too long.\nNon ascii character have 3 bytes.\nCurrent Length of SSID Field: "


var MSG_INVALID_FILE_STR		= "Invalid File.";
var MSG_REBOOT_SECONDS_REMAINS1			= '';
var MSG_REBOOT_SECONDS_REMAINS2			= 'seconds left';

</script>

