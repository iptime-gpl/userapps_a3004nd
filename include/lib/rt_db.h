#ifndef __RT_DB_H
#define __RT_DB_H

#ifndef USE_INMI
	#define MAX_RT_ENTRY 100 
#else
	#define MAX_RT_ENTRY 200 
#endif
#define RT_DB_FILE "/etc/rt_db.set"
#define RT_DB_VERSION 1
typedef struct rt_entry_s {
	int flag;
#define REMOVE_SCHEDULE_FLAG 0x2
#define ADD_SCHEDULE_FLAG    0x4
#define DISABLE_SCHEDULE_FLAG 0x8
#define MAX_RT_ENTRY_TYPE_LEN 8
	char type[MAX_RT_ENTRY_TYPE_LEN];
	char target[20];
	char netmask[20];
	char gateway[20];
	int reserved[8];
} rt_entry_t;

typedef struct rt_db_s {
	int version;
	int count;
	rt_entry_t rt_entry[MAX_RT_ENTRY];
} rt_db_t;

int read_rt_db(rt_db_t *rt_db);
int write_rt_db(rt_db_t *rt_db);
int add_rt_entry(rt_db_t *rt_db, rt_entry_t *rt_entry, int idx);

#endif
