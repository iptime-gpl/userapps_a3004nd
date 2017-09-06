#ifndef PPTPVPN_RULES_H
#define PPTPVPN_RULES_H

#define PPTPVPN_RULE_DB_FILENAME "/etc/pptpvpn.db"

#define MAX_ACCOUNT_SIZE 32
#define MAX_PASSWORD_SIZE 32

#ifndef SYS_DRAM_SIZE
#define MAX_PPTP_VPN_RULE 5
#else
#if SYS_DRAM_SIZE >= 32
#define MAX_PPTP_VPN_RULE 10
#else
#define MAX_PPTP_VPN_RULE 5
#endif
#endif

typedef struct pptpvpn_rule_s {
	int flag;
#define REMOVE_SCHEDULE_FLAG  0x2
	char account[MAX_ACCOUNT_SIZE];
	char password[MAX_PASSWORD_SIZE];
	char ip[20];
} pptpvpn_rule_t;

typedef struct pptpvpn_db_s {
	int flag;
#define PPTP_OFF 0x0
#define PPTP_ON  0x1
#define PPTP_ENCRYPT_ON 0x2
	int rule_count;
	pptpvpn_rule_t rule[MAX_PPTP_VPN_RULE];
} pptpvpn_db_t;

#ifdef USE_NEW_LIB
typedef struct pptp_user_s { 
#define PPTP_MAX_ACCOUNT_SIZE 32
#define PPTP_MAX_PASSWORD_SIZE 32
	char account[PPTP_MAX_ACCOUNT_SIZE];
	char password[PPTP_MAX_PASSWORD_SIZE];
	char ip[20];
	char ifname[16];
	int  pid; /* 0: not connected, not 0: pid of ppp process */
} pptp_user_t;


int pptpserver_kill_bcrelay(char *ifname);
int parse_pptpserver_userinfo(char *value,pptp_user_t *user);
int pptpserver_get_pptpinfo(char *account, pptp_user_t *user);
int pptpserver_get_index_pptpinfo(int idx, pptp_user_t *user);
int pptpserver_add_user(pptp_user_t *user);
int pptpserver_remove_user(char *account);
int pptpserver_disconnect_user(char *account);
void update_pptp_configfiles(int encrypt);
void pptpserver_enable(void);
void pptpserver_disable(void);
int pptpserver_set_config(int on, int mppe_on);
int pptpserver_get_config(int *on, int *mppe_on);
int pptpserver_init(void);
int pptpserver_user_count(void);

#endif

#endif
