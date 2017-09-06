#ifndef __ACCESSLIST_H_
#define __ACCESSLIST_H_


#define MAX_TEXT             32

#ifdef USE_NEW_LIB
#define MAX_ACCESSLIST_COUNT 10
typedef struct accesslist_s
{
        char external_mode[MAX_TEXT];
        int  external_count;
        char internal_mode[MAX_TEXT];
        int  internal_count;
} accesslist;

#define EXTERNAL_PERMIT		1
#define INTERNAL_PERMIT         2
#define EXTERNAL_REJECT         3
#define INTERNAL_REJECT         4
#define CON_SEC_NOTRUN          5

extern int accesslist_iptables_cmd(int flag);
extern void accesslist_set_write_config(accesslist *set);
extern void accesslist_set_read_config(accesslist *set);
extern void accesslist_add_ip(char *status, char *ip, char *desc, accesslist *set);
extern int accesslist_remove_ip(char *status, char *ip, accesslist *set);
extern int accesslist_get_ip(char *status, int idx, char *ip, char *desc);
extern int accesslist_already_regist(char *status, char *ipaddr);
extern int accesslist_init(void);
#else
#define MAX_ACCESSLIST_COUNT 20

typedef struct accesslist_s
{
	char opmode[MAX_TEXT];
	char wanconn[MAX_TEXT];
	int  count;
} accesslist;

#define ANY_PERMIT               1
#define LOCAL_PERMIT             2
#define ANY_CHANGE_LOCAL         3
#define LOCAL_CHANGE_ANY         4
#define CON_SEC_NOTRUN           5

extern int accesslist_iptables_cmd(int flag);
extern void accesslist_set_write_config(accesslist *set);
extern void accesslist_set_read_config(accesslist *set);
extern void accesslist_add_ip(char *ip, char *desc, accesslist *set);
extern int accesslist_remove_ip(char *ip, accesslist *set);
extern int accesslist_get_ip(int idx, char *ip, char *desc);
extern int accesslist_already_regist(char *ipaddr);
extern int accesslist_init(void);
#endif

#endif

