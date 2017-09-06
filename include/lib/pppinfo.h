#ifndef _PPPINFO_H_
#define _PPPINFO_H_

#define PPP_INTERFACE_INFO_FILE "/var/run/pppif_info"
#define MAX_PPP_CONNECTION 10

typedef struct pppif_info_s  {
        char account[64];
        char ifname[16];
        char pid[16];
} pppif_info_t;

typedef struct pppinfo_db_s {
        int count;
        pppif_info_t pppinfo[MAX_PPP_CONNECTION];
} pppinfo_db_t;

#endif
