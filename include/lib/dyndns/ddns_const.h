#define MAX_HOSTNAME_NUM        5

#ifdef ARCH_TIME_UCARM
#define CHECK_INTERVAL   	7
#define CHECK_TIME      	28800 /* 28800 seconds = 8 hours */
#else
#define CHECK_INTERVAL   	5
#define CHECK_TIME      	144000 /* 144000 seconds = 40 hours */
#endif

/* connection status */
#define GOOD_STATUS     	0
#define BAD_AUTHORIZATION	1
#define PARAMETER_INVALID 	2
#define ACCESS_BLOCKED   	3
#define NOT_QUALIFIED_DOMAIN	4
#define HOSTNAME_UNREGISTER	5
#define NOT_DONATOR         	6
#define HOSTNAME_NOT_YOURS     	7
#define NOT_ACTIVE        	8
#define HOSTNAME_ABUSE        	9
#define HOSTNAME_COUNT_ERR  	10
#define DNS_ERR             	11
#define SERVER_SHUTDOWN    	12
#define UNKNOWN_ERR           	13
#define CONNECTION_FAIL 	14
#define ONLY_ONE_DOMAIN 	15
#define TRY_CONNECTING     	0xFF	

#define DYNDNS_SERVER_ID        1
#define IPTIMEDNS_SERVER_ID     2

#define IPTIME_DDNS_DOMAIN	"iptime.org"

#define DYNDNS_CONFIG   "/etc/dyndns.conf"
#define DYNDNS_HOST     "/etc/dyndns.host"
#define DYNDNS_SERVER   "/etc/dyndns.server"
#define DYNDNS_STATUS   "/var/run/dyndns.status"
#define DYNDNS_WAN      "/etc/dyndns.wan"
