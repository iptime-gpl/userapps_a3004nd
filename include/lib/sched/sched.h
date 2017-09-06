#ifndef _SCHED_H_
#define _SCHED_H_

#define SCHED_SUNDAY_SHIFT_VALUE    0
#define SCHED_MONDAY_SHIFT_VALUE    1
#define SCHED_TUESDAY_SHIFT_VALUE   2
#define SCHED_WEDNESDAY_SHIFT_VALUE 3
#define SCHED_THURSDAY_SHIFT_VALUE  4
#define SCHED_FRIDAY_SHIFT_VALUE    5
#define SCHED_SATDAY_SHIFT_VALUE    6
#define SCHED_DAY_COUNT             7

#define SCHED_EVERY_DAY 0x7F

#define MAX_SCHED  20
#define SCHED_TABLE_FULL 0xFF

struct sched_cfg 
{
	int days;
	int s_hour;
	int s_min;
	int e_hour;
	int e_min;
	char ipstr[16];
	char mask[16];
	char macstr[20];
};

void sched_init(void);
int sched_operation(int flag);
int sched_cfg_set(struct sched_cfg *cfg);
struct sched_cfg *sched_cfg_get(int idx);
int sched_cfg_delete(int idx);

#endif
