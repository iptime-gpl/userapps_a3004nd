#ifndef _FWSCHED_H_
#define _FWSCHED_H_

#define FWSCHED_SUNDAY_SHIFT_VALUE    0
#define FWSCHED_MONDAY_SHIFT_VALUE    1
#define FWSCHED_TUESDAY_SHIFT_VALUE   2
#define FWSCHED_WEDNESDAY_SHIFT_VALUE 3
#define FWSCHED_THURSDAY_SHIFT_VALUE  4
#define FWSCHED_FRIDAY_SHIFT_VALUE    5
#define FWSCHED_SATDAY_SHIFT_VALUE    6
#define FWSCHED_DAY_COUNT             7

#define FWSCHED_EVERY_DAY 0x7F

#define MAX_FWSCHED  200
#define FWSCHED_TABLE_FULL 0xFF

#define FWSCEHD_DB_FILE          	"/etc/fwsched.set"
#define FWSCHED_NETFILTER_DB_FILE	"/etc/fwsched_netfilter.set"
#define FWSCHED_URLFILTER_DB_FILE	"/etc/fwsched_urlfilter.set"

#define FWSCHED_RULE_NAME_SIZE	16

#define FWSCHED_OFF	0
#define FWSCHED_ON	1

#define FWSCHED_HOST_MASK	"32"

typedef struct fwsched_rule_s
{
	char name[FWSCHED_RULE_NAME_SIZE];
	int days;
	int s_hour;
	int s_min;
	int e_hour;
	int e_min;
	int flag;
/*
 The Followings are defined in filter_rule.h

#define FILTER_RULE_DISABLE       0x40
#define FILTER_RULE_OUTOF_SCHED   0x80
*/
#define FILTER_RULE_ON_SCHED	0x100	
	int rule_type;
#define USER_FWSCHED_TYPE  	0x1
#define APP_FWSCHED_TYPE  	0x2
#define URL_FWSCHED_TYPE  	0x4
	int rule_index;
	app_template_t *rule;
} fwsched_rule_t; 

typedef struct fwsched_db_s
{
	int count;	
	fwsched_rule_t fwsched_rule[MAX_FWSCHED];		
} fwsched_db_t;


extern fwsched_db_t *fwsched_open_ruledb(void);
extern int fwsched_close_ruledb(fwsched_db_t *fwsched_db);
extern int fwsched_read_ruledb(fwsched_db_t *fwsched_db);
extern int fwsched_write_ruledb(fwsched_db_t *fwsched_db);
extern int fwsched_add_ruledb(fwsched_db_t *fwsched_db, fwsched_rule_t *fwsched_rule, app_template_t *f_rule);
extern int fwsched_remove_ruledb(fwsched_db_t *fwsched_db, char *rule_name_list, int count);
extern int fwsched_disable_ruledb(fwsched_db_t *fwsched_db, int *idxlist, int count);
extern int fwsched_schedule_ruledb(fwsched_db_t *fwsched_db, int idx, int on_sched);
extern int fwsched_get_rule_type(fwsched_rule_t *fws_rule);
#endif
