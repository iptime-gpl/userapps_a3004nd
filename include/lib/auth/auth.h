#define AUTH_SERVER	"auth.efm-net.com"
#define AUTH_PORT	50505
#define AUTH_DURATION	6	/* 6 Hours */
#define AUTH_SLOT_SIZE	10	/* 10 sec */

#define AUTH_ENCRYPT_FILE 	"/var/run/efmauth.enc"
#define AUTH_ORG_FILE 		"/var/run/efmauth.org"

#define IP_FORWARD_OFF_CMD	0x01

#define HASH_KEY	0xab

struct auth_data_s {
        unsigned char   cmd;
#define KILL_THE_ROUTER_FLAG 0x1
#define DONOT_SEND_AGAIN_FLAG 0x2
        char    mac[20];
};

