// JavaScript Set Language (kr)
var D_lang = {
}
var S_lang = {
	"S_PAGE_TITLE" : "포트포워드 설정",

	"S_RULENAME_STRING" : "규칙이름",
	"S_INPUTCANCEL" : "입력취소",
	"S_INTIP_STRING" : "내부 IP",
	"S_INTPORT_STRING" : "내부포트",
	"S_EXTPORT_STRING" : "외부포트",
	"S_UPNPRULE_STRING" : "UPNP 규칙",
	"S_TRIGGERRULE_STRING" : "트리거 규칙",
	"S_TRIGGERPORT_STRING" : "트리거 포트",
	"S_FORWARDPORT_STRING" : "포워드 포트",
	"S_NEWRULE_STRING" : "새규칙 추가",
	"S_DISABLED_STATUS" : "(비활성화)",

	"S_ALLVIEW_STRING" : "사용자 정의 + UPNP 규칙보기",
	"S_PORTFORWARDVIEW_STRING" : "사용자 정의 규칙보기",
	"S_UPNPVIEW_STRING" : "UPNP 규칙 보기",
	"S_PORTTRIGGERVIEW_STRING" : "포트트리거 상태보기",
	
	"S_TRIGGER_PREFIX" : "트리거",

	"S_PRIORITY_STRING" : "우선순위",
	"S_RULETYPE_STRING" : "규칙종류",
	"S_INTIPADDR_STRING" : "내부IP주소",
	"S_PROTOCOL_STRING" : "프로토콜",
	"S_CURCONIP_STRING" : "현재 접속된 IP주소",
	
	"S_PRIUP_STRING" : "순위높임",
	"S_PRIDOWN_STRING" : "순위낮춤",
	"S_DISABLED_STRING" : "규칙 비활성화",
	"S_NEWRULEBTN_STRING" : "새규칙",
	
	"S_TRIGGERACT_STRING" : "트리거조건",
	"S_PORTRANGE_STRING" : "포트범위",
	"S_FORWARDACT_STRING" : "포트포워드",
	"S_RESTORE_STRING" : "규칙복원",
	"S_BACKUP_STRING" : "규칙저장",
	
	"S_PORTFORWARD_FILESELECT" : "파일 선택",

	"S_FORWARDRULE_PROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"},
		{"value" : "tcpudp", "text" : "TCP/UDP"},
		{"value" : "gre", "text" : "GRE"}
	],
	
	"S_UPNPRULE_PROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"},
		{"value" : "tcpudp", "text" : "TCP/UDP"},
		{"value" : "gre", "text" : "GRE"}
	],

	"S_FORWARDRULE_WANNAME" : [
		{"value" : "wan1", "text" : "WAN1"},
		{"value" : "wan2", "text" : "WAN2"}
	],
	
	"S_FORWARDRULE_RULETYPE" : [
		{"value" : "0", "text" : "포트포워드 사용자정의"},
		{"value" : "http", "text" : "HTTP"},
		{"value" : "https", "text" : "HTTPS"},
		{"value" : "ftp", "text" : "FTP"},
		{"value" : "pop3", "text" : "POP3"},
		{"value" : "smtp", "text" : "SMTP"},
		{"value" : "dns", "text" : "DNS"},
		{"value" : "telnet", "text" : "TELNET"},
		{"value" : "ipsec", "text" : "IPSEC"},
		{"value" : "pptp", "text" : "PPTP"},
		{"value" : "원격데스크톱", "text" : "원격데스크톱"}
	],

	
	"S_TRIGGERRULE_RULETYPE" : [
		{"value" : "trigger", "text" : "포트트리거 사용자정의"}
	],

	"S_TRIGGERRULE_TRIGGERPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],
	
	"S_TRIGGERRULE_FORWARDPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],
	
	"S_TRIGGERSTATUS_TRIGGERPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],
	
	"S_TRIGGERSTATUS_FORWARDPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],

	"S_SETUP_RULETYPE" : [
		{"value" : "0", "text" : "포트포워드 사용자정의"},
		{"value" : "http", "text" : "HTTP"},
		{"value" : "https", "text" : "HTTPS"},
		{"value" : "ftp", "text" : "FTP"},
		{"value" : "pop3", "text" : "POP3"},
		{"value" : "smtp", "text" : "SMTP"},
		{"value" : "dns", "text" : "DNS"},
		{"value" : "telnet", "text" : "TELNET"},
		{"value" : "ipsec", "text" : "IPSEC"},
		{"value" : "pptp", "text" : "PPTP"},
		{"value" : "원격데스크톱", "text" : "원격데스크톱"},
		{"value" : "NULL", "text" : "----------------------"},
		{"value" : "trigger", "text" : "포트트리거 사용자정의"}
	],
	
	"S_SETUP_PROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"},
		{"value" : "tcpudp", "text" : "TCP/UDP"},
		{"value" : "gre", "text" : "GRE"}
	],

	"S_SETUP_WANNAME" : [
		{"value" : "wan1", "text" : "WAN1"},
		{"value" : "wan2", "text" : "WAN2"}
	],

	"S_SETUP_TRIGGERPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],
	
	"S_SETUP_FORWARDPROTOCOL" : [
		{"value" : "tcp", "text" : "TCP"},
		{"value" : "udp", "text" : "UDP"}
	],

	"S_RULENAME_BLANK" : "규칙 이름을 입력하여 주십시오.",
	"S_RULENAME_INVALID" : "규칙 이름에 허용되지 않는 특수 문자가 포함되어 있습니다.",
	"S_INTERNALPORT_INVALID" : "내부 포트 범위를 정확히 입력하여 주십시오.",
	"S_EXTERNALPORT_INVALID" : "외부 포트 범위를 정확히 입력하여 주십시오.",
	"S_TRIGGERPORT_INVALID" : "트리거 포트 범위를 정확히 입력하여 주십시오.",
	"S_FORWARDPORT_INVALID" : "포워드 포트 범위를 정확히 입력하여 주십시오.(공백으로 구분, 최대 10개까지 입력 가능)",
	"S_IP_BLANKED" : "IP 주소가 입력되지 않았습니다.",
	"S_IP_NOTEXIST" : "사용할 수 없는 IP 주소입니다.(IP 주소 값의 범위는 0~255 입니다.)",
	"S_IP_INTERNALREQUIRED" : "IP 주소는 내부 네트워크 주소만 사용 가능합니다.",
	"S_GATEWAYIP_NOT_PERMITTED" : "공유기 내부 IP 주소는 포트포워드 할 수 없습니다.",
	"S_BROADCASTIP_NOT_PERMITTED" : "브로드캐스트 IP주소는 포트포워드 할 수 없습니다.",
	"S_DELETE_CONFIRMMSG" : "규칙을 삭제하시겠습니까?",
	"S_PORTFORWARD_FILENOTEXIST" : "파일이 선택되지 않았습니다.",
	"S_PORTFORWARD_RESTOREMSG" : "규칙을 복원하시겠습니까?",
	"S_PORTFORWARD_RESTORESUCCESS" : "규칙 복원에 성공하였습니다.",
	"S_PORTFORWARD_RESTOREFAIL" : "규칙 복원에 실패하였습니다.",
	"S_PORTFORWARD_NOMORERULES" : "더 이상 규칙을 추가할 수 없습니다.",
	
	"S_POPUPTITLE_FORWARDRULE" : "선택한 포트포워드 규칙을",
	"S_POPUPTITLE_TRIGGERRULE" : "선택한 포트트리거 규칙을",
	"S_POPUPTITLE_UPNPRULE" : "선택한 UPNP 규칙을",
	"S_POPUPTITLE_TRIGGERSTATUS" : "선택한 포트트리거 상태를",
	"S_POPUPMENU_VIEW" : "보기",
	"S_NOCLICK_ALERT" : "이 규칙은 수정할 수 없습니다."
}
