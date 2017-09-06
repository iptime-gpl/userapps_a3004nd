#ifndef __PFORWARD_H_
#define __PFORWARD_H_

#define PFORWARD_CONFIG_DIR	"/etc/pforward"

typedef struct pflist_head_s {
        int count;
        void *head;
        void *tail;
} pflist_head_t;

typedef struct pforward_s {
        struct pforward_s *next;
        char name[32];
	char chain[32];
	char protocol[8];
	int  eport;
	char ipaddr[16];
	int  iport;
	int flag;
#define PFORWARD_REMOVE_FLAG 0x1
} pforward_t;

int set_pforward(char *chain, char *name, pforward_t *pforward);
int get_pforward(char *chain, char *name, pforward_t *pforward);
int remove_pforward(char *chain, char *name);
int create_pforward(char *chain, char *name, char *protocol, int eport, char *ipaddr, int iport);
int get_pforward_list(char *chain, pflist_head_t *list);
int set_pforward_list(char *chain, pflist_head_t *list);
int free_pforward_list(pflist_head_t *list);

#endif
