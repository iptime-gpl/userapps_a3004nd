// JavaScript Set Language (kr)
var D_lang = {
}
var S_lang = {
	"S_PAGE_TITLE" : "인터넷/WiFi 사용제한",
	"S_PAGE_TITLE_NOWIFI" : "인터넷 사용제한",
	"S_ALLVIEW_STRING" : "인터넷/WiFi 사용제한 규칙",
	"S_FIREWALLVIEW_STRING" : "인터넷 사용제한 규칙",
	"S_WIFIVIEW_STRING" : "WiFi 사용제한 규칙",
	"S_PRIORITY_STRING" : "순위",
	"S_PRIUP_STRING" : "순위높임",
	"S_PRIDOWN_STRING" : "순위낮춤",

	"S_RULENAME_STRING":"규칙이름",
	"S_INTIPMAC_STRING":"내부IP/MAC",
	"S_EXTIPURL_STRING":"외부IP/URL",
	"S_TARGET_STRING":"목적지",
	"S_BAND_STRING":"BAND",

	"S_INOUT_STRING" : "외부목적지",
	"S_OUTIN_STRING" : "내부목적지",
	
	"S_RESTORE_STRING":"규칙복원",
	"S_BACKUP_STRING":"규칙저장",
	"S_FIREWALL_FILESELECT":"파일 선택",
	
	"S_DISABLED_STATUS":"(비활성화)",
	"S_ALLIP_STRING":"모든 IP",

	"S_MON_STRING" : "월",
	"S_TUE_STRING" : "화",
	"S_WED_STRING" : "수",
	"S_THU_STRING" : "목",
	"S_FRI_STRING" : "금",
	"S_SAT_STRING" : "토",
	"S_SUN_STRING" : "일",
	"S_EVERY_STRING" : "매일",
	"S_ALLHOUR_STRING" : "24시간",
	"S_ACCEPT_STRING" : "허용",
	"S_DENY_STRING" : "차단",

	"S_NEWRULE_STRING" : "새규칙 추가",
	"S_INPUTCANCEL" : "입력취소",
	"S_NEWRULEBTN_STRING" : "새규칙",

	"S_SETUP_NAME" : "규칙 이름을 입력하세요",
	"S_SETUP_URL" : "차단할 사이트를 입력하세요",
	"S_DISABLED_STRING":"비활성화",
	
	"S_SETUP_POLICY" : [
		{"value" : "drop", "text" : "차단"},
		{"value" : "accept", "text" : "허용"}
	],

	"S_FIREWALLRULE_POLICY" : [
		{"value" : "drop", "text" : "차단"},
		{"value" : "accept", "text" : "허용"}
	],
	
	"S_WIFIRULE_POLICY" : [
		{"value" : "drop", "text" : "차단"},
		{"value" : "accept", "text" : "허용"}
	],

	"S_SETUP_TYPE" : [
		{"value" : "internet", "text" : "인터넷사용제한"},
		{"value" : "site", "text" : "사이트접속차단"},
		{"value" : "wifi", "text" : "WiFi 사용제한"}
	],
	
	"S_FIREWALLRULE_TYPE" : [
		{"value" : "internet", "text" : "인터넷사용제한"},
		{"value" : "site", "text" : "사이트접속차단"},
	],
	
	"S_WIFIRULE_TYPE" : [
		{"value" : "wifi", "text" : "WiFi 사용제한"}
	],
	
	"S_SETUP_DIRECTION" : [
		{"value" : "inout", "text" : "내부->외부"},
		{"value" : "outin", "text" : "내부<-외부"},
		{"value" : "both", "text" : "내부<->외부"}
	],
	
	"S_FIREWALLRULE_DIRECTION" : [
		{"value" : "inout", "text" : "내부->외부"},
		{"value" : "outin", "text" : "내부<-외부"},
		{"value" : "both", "text" : "내부<->외부"}
	],
	
	"S_SETUP_SRCADDRTYPE" : [
		{"value" : "ip", "text" : "내부IP 주소"},
		{"value" : "all", "text" : "모든 내부IP"},
		{"value" : "mac", "text" : "MAC 주소"},
		{"value" : "search", "text" : "검색된 MAC주소"}
	],
	
	"S_FIREWALLRULE_SRCADDRTYPE" : [
		{"value" : "ip", "text" : "내부IP 주소"},
		{"value" : "all", "text" : "모든 내부IP"},
		{"value" : "mac", "text" : "MAC 주소"},
		{"value" : "search", "text" : "검색된 MAC주소"}
	],
	
	"S_SETUP_DSTADDRTYPE" : [
		{"value" : "ip", "text" : "외부IP 주소"},
		{"value" : "all", "text" : "모든 외부IP"},
	],

	"S_FIREWALLRULE_DSTADDRTYPE" : [
		{"value" : "ip", "text" : "외부IP 주소"},
		{"value" : "all", "text" : "모든 외부IP"},
	],

	"S_SETUP_PROTOCOL" : [
		{"value" : "none", "text" : "ALL"},
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"},
		{"value" : "icmp", "text" : "ICMP"},
		{"value" : "gre", "text" : "GRE"},
		{"value" : "tcpudp", "text" : "TCP/UDP"}
	],
	
	"S_FIREWALLRULE_PROTOCOL" : [
		{"value" : "none", "text" : "ALL"},
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"},
		{"value" : "icmp", "text" : "ICMP"},
		{"value" : "gre", "text" : "GRE"},
		{"value" : "tcpudp", "text" : "TCP/UDP"}
	],
	
	"S_STIME" : [
		{"value" : "all", "text" : "24시간"},
		{"value" : "0000", "text" : "00:00"},
		{"value" : "0030", "text" : "00:30"},
		{"value" : "0100", "text" : "01:00"},
		{"value" : "0130", "text" : "01:30"},
		{"value" : "0200", "text" : "02:00"},
		{"value" : "0230", "text" : "02:30"},
		{"value" : "0300", "text" : "03:00"},
		{"value" : "0330", "text" : "03:30"},
		{"value" : "0400", "text" : "04:00"},
		{"value" : "0430", "text" : "04:30"},
		{"value" : "0500", "text" : "05:00"},
		{"value" : "0530", "text" : "05:30"},
		{"value" : "0600", "text" : "06:00"},
		{"value" : "0630", "text" : "06:30"},
		{"value" : "0700", "text" : "07:00"},
		{"value" : "0730", "text" : "07:30"},
		{"value" : "0800", "text" : "08:00"},
		{"value" : "0830", "text" : "08:30"},
		{"value" : "0900", "text" : "09:00"},
		{"value" : "0930", "text" : "09:30"},
		{"value" : "1000", "text" : "10:00"},
		{"value" : "1030", "text" : "10:30"},
		{"value" : "1100", "text" : "11:00"},
		{"value" : "1130", "text" : "11:30"},
		{"value" : "1200", "text" : "12:00"},
		{"value" : "1230", "text" : "12:30"},
		{"value" : "1300", "text" : "13:00"},
		{"value" : "1330", "text" : "13:30"},
		{"value" : "1400", "text" : "14:00"},
		{"value" : "1430", "text" : "14:30"},
		{"value" : "1500", "text" : "15:00"},
		{"value" : "1530", "text" : "15:30"},
		{"value" : "1600", "text" : "16:00"},
		{"value" : "1630", "text" : "16:30"},
		{"value" : "1700", "text" : "17:00"},
		{"value" : "1730", "text" : "17:30"},
		{"value" : "1800", "text" : "18:00"},
		{"value" : "1830", "text" : "18:30"},
		{"value" : "1900", "text" : "19:00"},
		{"value" : "1930", "text" : "19:30"},
		{"value" : "2000", "text" : "20:00"},
		{"value" : "2030", "text" : "20:30"},
		{"value" : "2100", "text" : "21:00"},
		{"value" : "2130", "text" : "21:30"},
		{"value" : "2200", "text" : "22:00"},
		{"value" : "2230", "text" : "22:30"},
		{"value" : "2300", "text" : "23:00"},
		{"value" : "2330", "text" : "23:30"}
	],
	
	"S_ETIME" : [
		{"value" : "0000", "text" : "00:00"},
		{"value" : "0030", "text" : "00:30"},
		{"value" : "0100", "text" : "01:00"},
		{"value" : "0130", "text" : "01:30"},
		{"value" : "0200", "text" : "02:00"},
		{"value" : "0230", "text" : "02:30"},
		{"value" : "0300", "text" : "03:00"},
		{"value" : "0330", "text" : "03:30"},
		{"value" : "0400", "text" : "04:00"},
		{"value" : "0430", "text" : "04:30"},
		{"value" : "0500", "text" : "05:00"},
		{"value" : "0530", "text" : "05:30"},
		{"value" : "0600", "text" : "06:00"},
		{"value" : "0630", "text" : "06:30"},
		{"value" : "0700", "text" : "07:00"},
		{"value" : "0730", "text" : "07:30"},
		{"value" : "0800", "text" : "08:00"},
		{"value" : "0830", "text" : "08:30"},
		{"value" : "0900", "text" : "09:00"},
		{"value" : "0930", "text" : "09:30"},
		{"value" : "1000", "text" : "10:00"},
		{"value" : "1030", "text" : "10:30"},
		{"value" : "1100", "text" : "11:00"},
		{"value" : "1130", "text" : "11:30"},
		{"value" : "1200", "text" : "12:00"},
		{"value" : "1230", "text" : "12:30"},
		{"value" : "1300", "text" : "13:00"},
		{"value" : "1330", "text" : "13:30"},
		{"value" : "1400", "text" : "14:00"},
		{"value" : "1430", "text" : "14:30"},
		{"value" : "1500", "text" : "15:00"},
		{"value" : "1530", "text" : "15:30"},
		{"value" : "1600", "text" : "16:00"},
		{"value" : "1630", "text" : "16:30"},
		{"value" : "1700", "text" : "17:00"},
		{"value" : "1730", "text" : "17:30"},
		{"value" : "1800", "text" : "18:00"},
		{"value" : "1830", "text" : "18:30"},
		{"value" : "1900", "text" : "19:00"},
		{"value" : "1930", "text" : "19:30"},
		{"value" : "2000", "text" : "20:00"},
		{"value" : "2030", "text" : "20:30"},
		{"value" : "2100", "text" : "21:00"},
		{"value" : "2130", "text" : "21:30"},
		{"value" : "2200", "text" : "22:00"},
		{"value" : "2230", "text" : "22:30"},
		{"value" : "2300", "text" : "23:00"},
		{"value" : "2330", "text" : "23:30"}
	],

	"S_BAND" : [
		{"value" : "5g", "text" : "WiFi 5G"},
		{"value" : "2g", "text" : "WiFi 2.4G"},
		{"value" : "all", "text" : "WiFi ALL"},
	],

	"S_FIREWALL_MACSEARCHDEFAULT" : "MAC 주소 선택",
	"S_FIREWALL_MACRESEARCH" : "MAC 주소 재검색",

	"S_FIREWALL_RESTOREFAIL" : "규칙 복원에 실패하였습니다.",
	"S_FIREWALL_RESTORESUCCESS" : "규칙 복원에 성공하였습니다.",
	
	"S_FIREWALL_NOMORERULES" : "규칙을 더 추가할 수 없습니다.",
	"S_FIREWALL_FILENOTEXIST" : "파일이 선택되지 않았습니다.",
	"S_FIREWALL_RESTOREMSG" : "규칙을 복원하시겠습니까?",

	"S_DELETE_CONFIRMMSG" : "규칙을 삭제하시겠습니까?",
	
	"S_RULENAME_BLANK" : "규칙 이름을 입력해 주십시오.",
	"S_RULANAME_INVALID" : "규칙 이름에 허용되지 않는 특수 문자가 포함되어 있습니다.",
	"S_PRIORITY_INVALID" : "우선 순위를 정확히 입력하여 주십시오.",
	"S_IP_INVALID" : "IP 주소를 정확히 입력하여 주십시오.",
	"S_INTERNALIP_ALERT" : "내부 IP 주소의 범위가 잘못되었습니다.",
	"S_MAC_INVALID" : "MAC 주소를 정확히 입력하여 주십시오.",
	"S_SRCADDRTYPE_INVALID" : "MAC 주소를 선택하여 주십시오.",
	"S_PORT_BLANK" : "포트 번호를 입력하여 주십시오.",
	"S_PORT_INVALID" : "포트 번호를 정확히 입력하여 주십시오.",
	"S_URL_BLANK" : "차단할 사이트 주소를 입력하여 주십시오.",
	"S_URL_INVALID" : "차단할 사이트 목록에 허용되지 않는 특수 문자가 포함되어 있습니다.\n공백 혹은 콤마(,)로 구분하여 최대 10개까지 입력 가능합니다.",
	"S_TIME_INVALID" : "규칙 시작 시간과 종료 시간을 다르게 설정하여 주십시오.",
	
	"S_POPUPTITLE_FIREWALLRULE" : "선택한 인터넷 사용제한 규칙을",
	"S_POPUPTITLE_WIFIRULE" : "선택한 WiFi 사용제한 규칙을",
}
