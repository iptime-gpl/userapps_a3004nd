#ifndef _DMZTWINIP_H_
#define _DMZTWINIP_H_

typedef struct {
        int opmode;
#define DMZTWINIP_MODE_OFF  0
#define DMZTWINIP_MODE_DMZ      1
#define DMZTWINIP_MODE_TWINIP   2
        char hwaddr[20];
        char ipaddr[16];
        int leasetime;
#if defined(USE_IP3210) || defined(USE_TWINIP_FAKEIP)
#define MAX_FAKEIP_LEN 16 
        char fakeip[MAX_FAKEIP_LEN];
#endif
} dmztwinip;

extern int dmztwinip_write_config(char *wanname, dmztwinip *config);
extern int dmztwinip_read_config(char *wanname, dmztwinip *config);
extern int setup_dmz(char *wanname);
extern int check_twinip_enable(void);
extern void dmztwinip_apply_off(int wanid, dmztwinip *config);
extern void dmztwinip_apply_twinip(int wanid, char *hwaddr, int leasetime, dmztwinip *config);
extern void dmztwinip_apply_dmz(int wanid, char *ip_addr, dmztwinip *config);
#if defined(USE_IP3210) || defined(USE_TWINIP_FAKEIP)
extern int dmztwinip_set_twinip_fakeip(char *fakeip);
extern int dmztwinip_get_twinip_fakeip(char *fakeip);
#endif
extern void dmztwinip_init_twinip(char *srv_net, char *wan_name);


#endif
