#ifndef __CM_STRUCT_H__
#define __CM_STRUCT_H__

typedef struct saveconf_header_s {
        char magic_str[16];
#ifdef USE_NEW_LIB
#define TIMEPRO_SAVE_TYPE "nvsave"
#else
#define TIMEPRO_SAVE_TYPE "tprosave"
#endif
#define SAVE_MAGIC_STRING TIMEPRO_SAVE_TYPE
        int zip_img_size;
        int crc;
        int max_size;
        int fsid;
	int flag;
#define WIRELESS_ATE_START_FLAG 0x1
#define AUTH_REORT_DONE_FLAG	0x2
#define USB30_ENABLE_FLAG	0x4
        int reserverd[3];
} saveconf_header_t;


#define EXTRA_SAVE_FILE_MAX 0x2000
typedef struct extra_save_header_s {
        char magic[8];
#define EXTRA_MAGIC_STRING "extra"
        char restore_file[128];
        unsigned int crc;
        unsigned int size;
        int reserverd[4];
} extra_save_header_t;


typedef struct dos_conf_s {
	char synflood;
	char smurf;
	char sourceroute;
	char ipspoof;
       	char icmpblock;
	char internal_icmpbk;
	char reserved[10];
} dos_conf_t;
#endif
