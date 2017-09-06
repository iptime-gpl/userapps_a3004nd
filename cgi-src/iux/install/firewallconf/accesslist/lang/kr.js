// JavaScript Set Language (kr)
var D_lang = {
}

var S_lang = {
	"S_PAGE_TITLE" : "공유기 접속 / 보안 관리",
	"S_MAIN_EXTERNAL" : "외부 접속 보안",
	"S_MAIN_EXTERNAL_MGR" : "외부 접속 보안 관리",
	"S_MAIN_EXTERNAL_MAX_ADDCOUNT_DESC" : "최대 10개의 허용할 IP주소 추가 가능",
	"S_MAIN_INTERNAL" : "내부 접속 보안",
	"S_MAIN_INTERNAL_MGR" : "내부 접속 보안 관리",
	"S_MAIN_INTERNAL_MAX_ADDCOUNT_DESC" : "최대 10개의 허용할 IP주소 추가 가능",
	"S_MAIN_HIGHLEVEL_SETUP" : "고급 보안 설정",
	"S_MAIN_MGMT_PORT" : "원격 관리 포트 사용",
	"S_MAIN_STATUS_USE" : "사용중",	
	"S_MAIN_STATUS_DISUSE" : "미사용",	
    "S_MAIN_CSRF" : "악성 스트립트 접근 방지(CSRF)",	
    //"S_MAIN_CSRF_WHITELIST" : "",		
	"S_MAIN_CSRF_EMPTY_WHITELIST" : "접근허용 도메인 미입력",	
	"S_MAIN_CSRF_USE_WHITELIST" : "접근허용 도메인 입력됨",	
	"S_MAIN_ARP_PROTECTION" : "ARP Virus 방어 기능",		
	"S_MAIN_ARP_PROTECTION_DESC1" : "초당",	
	"S_MAIN_ARP_PROTECTION_DESC2" : "개 의 ARP를 유선 네트워크로 전송",	
	"S_MAIN_ETC" : "기타 보안 설정",
	"S_REMOTE_DISCONNECT_EXTERNAL_PORT" : "원격 관리포트 사용을 해제할 경우\n공유기와의 연결이 끊어집니다.\n계속 하시겠습니까?",	


	//right
	//extmgr
	"S_EXTMGR_TITLE" : "외부 접속 보안 관리",
	"S_EXTMGR_USE" : "외부 접속 보안 사용",
	"S_EXTMGR_ERROR_DEFAULTADMIN" : "해당 기능은 관리자계정 및 암호를\n설정후 사용 가능합니다.\n관리자계정 및 암호를 설정하시겠습니까?",
	
	"S_EMPTY_C_REMOTE_REMOTEPORT" : "원격 관리 포트가 입력되지 않았습니다.",
	"S_ERROR_C_REMOTE_REMOTEPORT" : "원격 관리 포트가 잘못입력되었습니다.(1-65535)",
	
	"S_EMPTY_ADD_ACCESSIP" : "허용할 IP주소가 입력되지 않았습니다.",
	"S_ERROR_ADD_ACCESSIP" : "허용할 IP주소가 잘못입력되었습니다.",
	
	"S_EXTMGR_ERROR_SAME_ACCESSIP" : "등록할 주소가 이미 존재합니다.",
	"S_EXTMGR_ERROR_MAX_ACCESSIP" : "더이상 IP주소를 추가할 수 없습니다.\n(최대 10개 등록 가능)",
    
	"S_EMPTY_ADD_ACCESSDESC" : "설명이 입력되지 않았습니다.",
	"S_ERROR_ADD_ACCESSDESC" : "설명이 잘못 입력되었습니다.\n(한글,영문,숫자,특수문자(_, #, [, ])허용)",


	//intmgr
	"S_INTMGR_TITLE" : "내부 접속 보안 관리",
	"S_INTMGR_USE" : "내부 접속 보안 사용",
	"S_INTMGR_ERROR_DEFAULTADMIN" : "해당 기능은 관리자계정 및 암호를\n설정후 사용 가능합니다.\n관리자계정 및 암호를 설정하시겠습니까?",
	
	"S_EMPTY_C_REMOTE_REMOTEPORT" : "원격 관리 포트가 입력되지 않았습니다.",
	"S_ERROR_C_REMOTE_REMOTEPORT" : "원격 관리 포트가 잘못입력되었습니다.(1-65535)",
	
	"S_EMPTY_ADD_ACCESSIP" : "허용할 IP주소가 입력되지 않았습니다.",
	"S_ERROR_ADD_ACCESSIP" : "허용할 IP주소가 잘못입력되었습니다.",
	
	"S_INTMGR_ERROR_SAME_ACCESSIP" : "등록할 주소가 이미 존재합니다.",
	"S_INTMGR_ERROR_MAX_ACCESSIP" : "더이상 IP주소를 추가할 수 없습니다.\n(최대 10개 등록 가능)",
    
	"S_EMPTY_ADD_ACCESSDESC" : "설명이 입력되지 않았습니다.",
	"S_ERROR_ADD_ACCESSDESC" : "설명이 잘못 입력되었습니다.\n(한글,영문,숫자,특수문자(_, #, [, ])허용)",

	"S_RIGHT_ERROR_NEED_ADD_CURRENTIP" : "설정된 IP가 없습니다.\n현재 접속하신 PC를 접속보안에\n추가 하시겠습니까?",
	"S_RIGHT_ERROR_CONNECTION_FAIL" : "공유기와의 통신이 실패하였습니다.",
	
	"S_RIGHT_ERROR_NO_DEL_CURRENTIP_EXT" : "현재 PC의 항목을 삭제할 경우\n공유기에 접속할수 없습니다.\n삭제하려면,\n먼저 외부접속보안을 중지하십시오.",
	"S_RIGHT_ERROR_NO_DEL_CURRENTIP_INT" : "현재 PC의 항목을 삭제할 경우\n공유기에 접속할수 없습니다.\n삭제하려면,\n먼저 내부접속보안을 중지하십시오.",
	"S_RIGHT_ERROR_NO_ITEM" : "삭제할 항목이 선택되지 않았습니다.",
	
	//etc
	"S_ETC_TITLE" : "기타 보안 설정",
	"S_ETC_SYNFLOOD" : "SYN Flood",
	"S_ETC_SMURF" : "Smurf",
	"S_ETC_SOURCEROUTE" : "IP source routing",
	"S_ETC_IPSPOOF" : "IP Spoofing",
	"S_ETC_ICMPBLOCK" : "ping 막기(WAN)",
	"S_ETC_INTICMPBLOCK" : "ping 막기(LAN)",
	
	//csrf
	"S_CSRF_TITLE" : "악성 스크립트 접근 방지(CSRF)",
	"S_CSRF_RUN" : "동작 설정",
	"S_CSRF_DESC1" : "추가할 도메인을 입력합니다.(최대 3개 허용)",
	"S_CSRF_DESC2" : "http://와 같은 프로토콜은 제외하고 도메인만 입력",
	"S_CSRF_DESC3" : "예) white1.ipdisk.co.kr",
	"S_CSRF_DESC4" : "white2.domain2.com",
	"S_CSRF_DESC5" : "white3.domain3.com",
	"S_CSRF_DESC5" : "white3.domain3.com",

	"S_CSRF_WHITEDOMAIN" : "접근 허용 도메인 입력",
		

	//arpvirus
	"S_ARPVIRUS_TITLE" : "ARP Virus 방어 기능",
	"S_ARPVIRUS_RUN" : "동작 설정",
	"S_ARPVIRUS_DESC1" : "ARP Virus 방어 기능은 ARP를 통한 공격",
	"S_ARPVIRUS_DESC2" : "(ARP snoofing)을 방어하는 기능입니다.",
	
	
	"S_ERROR_C_ARPVIRUS_PERIOD" : "초당 ARP 개수를 잘못입력하였습니다.(1-100)",
	"S_EMPTY_C_ARPVIRUS_PERIOD" : "초당 ARP 개수가 입력되지 않았습니다.",


	
		
	"":""
}
