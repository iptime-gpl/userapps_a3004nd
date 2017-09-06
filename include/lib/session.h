#ifndef __SESSION_H
#define __SESSION_H

#define HTTP_SESSION_ID_LEN 16
#define EXP_ID_LEN 8
#define HTTP_SESSION_TIMEOUT 600


#if	0	
typedef struct list_head_s {
        int count;
        void *head;
        void *tail;
} list_head_t;
#endif


/* service -> WebDAV, Dirlist,Mgmt */
typedef struct session_s {
        struct session_s *next;
        int flag;
#define SESSION_REMOVE_FLAG 0x1
#define SESSION_RELEASECONTROL_FLAG 0x2
#define MAX_SESSION_ID_BUFLEN 32	
        char session_id[MAX_SESSION_ID_BUFLEN];
#define MAX_USER_ID_BUFLEN 64	
        char user_id[MAX_USER_ID_BUFLEN];
#define MAX_REMOTE_IP_BUFLEN 16
        char remote_ip[MAX_REMOTE_IP_BUFLEN];
        unsigned int timestamp;
} session_t;

int set_session(char *service, char *session_id, session_t *session);
int get_session(char *service, char *session_id, session_t *session);
int check_session(char *service,char *session_id, char *remoteip);
char *create_session(char *service, char *remoteip, char *username, int flag);
int update_session(char *service, char *session_id);


int get_session_list(char *service, list_head_t *slist);
int set_session_list(char *service, list_head_t *slist);
int free_session_list(list_head_t *slist);
int copy_session(char *from_service, char *to_service, char *session_id);


int remove_all_session_except_this(char *service,char *session);
int remove_all_sessions(void);
int release_control_all_session_except_this(char *service,char *session);

int get_http_session_timeout(void);
int set_http_session_timeout(int timeout);
int get_http_session_timeout_flag(void);
int set_http_session_timeout_flag(int flag);

int update_all_session(char *service,int timestamp);

int get_current_session_id(char *session_id);


int extract_session_id_from_cookie(char *cookie, char *session_id);
int http_auth_user(char *service, int update, int redirect );

int remove_http_session(char *service, char *remoteip);

int cleanup_session(char *service,char *session);
int get_user_by_session(char *service, char *session_id, char *user_id);



int httpcon_get_session_id(char *session_id);
char *httpcon_get_user(void);
int httpcon_auth(int update, int redirect );
int httpcon_get_session_timeout(void);

#ifdef USE_CAPTCHA_CODE
typedef struct captcha_s {
	char captcha[16];
	unsigned int timestamp; 
} captcha_t;

int get_captcha(char *name,captcha_t *cap);
int set_captcha(char *name,char *captcha);
int remove_captcha(char *name);
int remove_captcha_by_index(int idx);
int create_captcha(char *ret);
int captcha_garbage_collect(void);
#endif

int make_httpd_config(void);
int httpcon_get_session_timeout(void);
int httpcon_set_session_timeout(int timeout);
int httpcon_logout(void);
int httpcon_check_session_url(void);






#endif
