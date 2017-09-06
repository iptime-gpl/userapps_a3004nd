#ifdef USE_NETDETECT

#define LATEST_TIME             "최근감지시간"
#define IPADDRESS               "IP 주소"
#define PROTOCOL                "프로토콜"
#define FREQUENCY               "감지횟수"
#define COMMENT                 "설명 [적색:사용자 경고설정 해제상태]"

#ifdef NETDETECT_NOT_REDIRECTION
#define VIRUS_COMMENT           "웜바이러스 감염 의심됨"
#define HTTP_COMMENT            VIRUS_COMMENT
#define OTHERS_COMMENT          VIRUS_COMMENT
#else
#define VIRUS_COMMENT           "해당포트 웜바이러스 감염 의심됨"
#define HTTP_COMMENT            "웹 과다 접속 감지 또는 웜바이러스 의심"
#define OTHERS_COMMENT          "알수없는 포트 사용감지. 주의요망"
#endif

#define EMAIL_COMMENT           "E-Mail 바이러스 감염 의심됨"
#define SORIBADA_COMMENT        "소리바다 사용감지"
#define EDONKEY_COMMENT         "e-Donkey계열 프로그램 사용감지"
#define VSHARE_COMMENT          "V-Share 사용감지"
#define WINMX_COMMENT           "WinMX 사용감지"
#define FILEGURI_COMMENT        "FileGuri 사용감지"
#define KAZAA_COMMENT           "KaZaA 사용감지"
#define BATTLENET_COMMENT       "Battle Net 사용감지"

#endif

#define LIB_NETCONF_WIRELESS_KOREA	"대한민국"
#define LIB_NETCONF_WIRELESS_CHINA	"중국"
#define LIB_NETCONF_WIRELESS_USA	"미국"
#define LIB_NETCONF_WIRELESS_JAPAN	"일본"
#define LIB_NETCONF_WIRELESS_OTHERS	"기타"
#define LIB_NETCONF_WIRELESS_EU     	"유럽"
