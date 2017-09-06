// JavaScript Set Language (kr)
var D_lang = {
}
var S_lang = {
	"S_PAGE_TITLE"		: "QoS 기본설정",

	"S_QOSONOFF_TITLE"	: "QoS 동작설정",
	"S_INTERNETTYPE_TITLE"	: "인터넷 종류",
	"S_SMARTQOS_TITLE"	: "스마트 QoS",

	"S_QOSONOFF_OPTION1"	: "동작설정",

	"S_INTERNETTYPE_OPTION1": "인터넷종류",
	"S_INTERNETTYPE_OPTION2": "다운로드",
	"S_INTERNETTYPE_OPTION3": "업로드",
	"S_INTERNETTYPE_UNIT1"	: "Mbps",
	
	"S_INTERNETTYPE_TYPE"	: [
		{ "value" : "userdefine",	"text" : "사용자정의"},
		{ "value" : "xdsl", 		"text" : "xDSL",	"speed" : "20"},
		{ "value" : "optical", 		"text" : "광랜",	"speed" : "100"},
		{ "value" : "liteoptical",	"text" : "Giga-lite",	"speed" : "500"},
		{ "value" : "gigaoptical",	"text" : "Giga광랜",	"speed" : "1000"}
	],

	"S_SMARTQOS_OPTION1"	: "동작설정",
	"S_SMARTQOS_DESC1"	: "사용 중인 PC 수에 따라 동적으로 균등한 대역폭을 할당합니다. (확인주기:10분)",
	"S_SMARTQOS_VALUE"	: "사용 PC 수에 따라 동적으로 균등한 대역폭 할당",

	"S_QOSRULE_OPTION1"	: "다운로드/업로드",
	"S_QOSRULE_OPTION2"	: "프로토콜",
	"S_QOSRULE_OPTION3"	: "동작방식",

	"S_QOSRULE_PROTOCOL"	: [
		{ "value" : "ALL",	"text" : "----------"},
		{ "value" : "TCP",	"text" : "TCP"},
		{ "value" : "UDP",	"text" : "UDP"},
		{ "value" : "TCP/UDP",	"text" : "TCP/UDP"}
	],

	"S_QOSRULE_PROPERTY"	: [
		{ "value" : "2",	"text" : "최대속도제한"},
		{ "value" : "3",	"text" : "최소속도보장"}
	],

	"S_QOSRULE_VIEWRULE"	: "Qos규칙",
	"S_QOSRULE_TITLE"	: "새규칙 추가",
	"S_QOSRULE_PRIORITY"	: "우선순위",
	"S_QOSRULE_PRIORITYUP"	: "순위높임",
	"S_QOSRULE_PRIORITYDOWN": "순위낮춤",
	"S_QOSRULE_RULETYPE"	: "동작방식",
	"S_QOSRULE_DOWNLOAD"	: "Down",
	"S_QOSRULE_UPLOAD"	: "Up",
	"S_QOSRULE_IPADDRESS"	: "IP주소",
	"S_QOSRULE_IPSELECTWAY"	: [
		{ "value" : "manual",	"text" : "개별 IP주소"},
		{ "value" : "range",	"text" : "IP주소범위"},
		{ "value" : "twinip",	"text" : "TWIN IP"},
		{ "value" : "allip",	"text" : "모든 IP주소"},
	],

	"S_QOSRULE_BPITEXT"	: "IP주소별 개별할당",
	"S_QOSRULE_BPIOFF"	: "(대역폭통합할당)",

	"S_QOSRULE_TYPINGWAY"	: "입력방식",
	"S_QOSRULE_TYPINGWAYLIST":[
		{ "value" : "manual",	"text" : "수동입력"},
		{ "value" : "www",	"text" : "www(HTTP)"},
		{ "value" : "msstream",	"text" : "MS stream"},
	],
	"S_QOSRULE_NEWRULE"	: "새규칙",

	"S_QOSRULE_ALERT1"	: "다운로드/업로드 속도를 입력해야 합니다.",
	"S_QOSRULE_ALERT2"	: "QoS를 적용할 IP주소를 입력해야 합니다.",
	"S_QOSRULE_ALERT3"	: "IP주소 범위가 잘못되었습니다.",
	"S_QOSRULE_ALERT4"	: "사용자 규칙이  설정되어 있다면\n 모두 삭제 됩니다.\n계속 진행 하시겠습니까?",
	"S_QOSRULE_ALERT5"	: "규칙을 삭제하시겠습니까?",
	"S_QOSRULE_ALERT6"	: "'최소속도보장'이 '최대속도제한'보다\n 우선순위가 높아야 합니다.\n우선순위를 자동으로 재조정 하시겠습니까?",
	"S_QOSRULE_ALERT7"	: "규칙의 속도를 전체 인터넷 속도보다\n 높게 설정할 수 없습니다.",
	"S_QOSRULE_ALERT8"	: "포트 범위가 잘못되었습니다.",
	"S_QOSRULE_ALERT9"	: "포트 번호를 입력하여 주십시오.",
	"S_QOSRULE_ALERT10"	: "다운로드/업로드 속도가 잘못되었습니다",
	"S_QOSRULE_ALERT11"	: "전체 인터넷 속도를 설정하여 주십시오.",

	"S_QOSPOPUP_TITLE1"	: "선택한 규칙(",
	"S_QOSPOPUP_TITLE2"	: ")을",

	"S_QOSCONFIRM_MSG1"	: "규칙 삭제",
	"S_QOSCONFIRM_MSG2"	: "선택하신 규칙을 삭제 하시겠습니까?",
	
	"S_QOSRULE_ERROR1"	: "규칙을 더 이상 추가할 수 없습니다.",

	"S_QOSRULE_TEXT1"	: " 인터넷 : ",
	"S_QOSRULE_TEXT2"	: "다운로드 ",
	"S_QOSRULE_TEXT3"	: "업로드 ",

	"S_QOSRULE_ALLIP"	: "모든 IP 주소",
}
