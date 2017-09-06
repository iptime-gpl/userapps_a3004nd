#ifndef _TC_H_
#define _TC_H_

#define CLASS_NAME_LEN	30
#define FILTER_NAME_LEN	CLASS_NAME_LEN

#ifdef USE_NAVI_IPTIME_UI
#ifdef QOS_EXTENDED_CLASS
#define MAX_CLASS_ID_POOL       8
#else
#define MAX_CLASS_ID_POOL       2
#endif
#define MAX_SUB_CLASS_ID      32
#define MAX_CLASS_NUM   (MAX_CLASS_ID_POOL * MAX_SUB_CLASS_ID - 2)
#else
#ifdef QOS_EXTENDED_CLASS
#define MAX_CLASS	300
#else
#define MAX_CLASS	30
#endif
#endif

#define MAX_ID_POOL	(MAX_CLASS/30)

#ifdef USE_NAVI_IPTIME_UI
#define MAX_FILTER	2
#else
#define MAX_FILTER	10
#define MAX_FILTER_TEMPLET	31
#endif

#define KBIT	0
#define MBIT	1

#define TC_DISABLE	0
#define TC_ENABLE	1

//#define TC_ALL_CONFIG   	0
//#define TC_ONLY_FILTER_CONFIG	1
//#define TC_PAUSE_CONFIG   	2

#define TC_FALSE	0
#define TC_TRUE	 	1

#define TC_OK           	0
#define TC_ERROR        	1
#define TC_CLASS_FULL   	2
#define TC_OVERLIMIT    	3
#define TC_ISOLATED_OVERLIMIT	4
#define TC_CLASS_DIR_NOT_CHANGE	5
#define TC_FILTER_TEMPLET_FULL	6
#define TC_DIGIT_ERROR       	7
#define TC_BASSIC_SETUP_ERR	8

typedef struct _Class_	Class;
typedef struct _Filter_	Filter;

typedef struct
{
	unsigned int	id;     	
#define IF_EXT1_ID	1
#define IF_EXT2_ID	2
#define NUM_OF_IF_EXT	3
	char        	service[32];	/* internet service type */
	unsigned int	up;     	/* upload max bandwidth */	
	unsigned char	up_unit;	/* 1 - Mbit, 0-Kbit */
	unsigned int	down;     	/* upload max bandwidth */	
	unsigned char	down_unit;	/* 1 - Mbit, 0-Kbit */
} Max_Bandwidth;

struct _Filter_
{
	char       	name[FILTER_NAME_LEN];	/* filter name */
	int        	myclass_id;  	/* class id */
	int     	protocol;	/* TCP or UDP */
	char    	in_ip[16];   	/* internal ip address */
	unsigned int	option;   	/* BPI, IP Pool index or internal subnet mask */
#define BPI_OPTION	0x80000000 	/* BPI : Bandwidth alloction Per each IP */
#ifndef IP_RANGE_BASE_MASK
#define IP_RANGE_BASE_MASK 0x20
#endif
	unsigned short	in_port[2];	/* internal port range */
	char    	bpi_eip[16];   	/* BPI ip address */
	unsigned int	reserve;   	/* reserve */
	unsigned short	ex_port[2];	/* external port range */
	Filter      	*next;     	/* Link for Filter Templet */	
	Filter      	*prev;     	/* Link for Filter Templet */	

};
#define FILTER_PRIO_1	1
#define FILTER_PRIO_2	2
#define FILTER_PRIO_3	3
#define FILTER_PRIO_4	4
#define FILTER_PRIO_5	5
#define FILTER_PRIO_6	6	/* predefined APPLICATION or PORT TYPE */
#define FILTER_PRIO_7	7	/* predefined IP TYPE */
#define FILTER_PRIO_8	8 	/* default class */

#define CLASS_PRIO_1	1
#define CLASS_PRIO_2	2
#define CLASS_PRIO_3	3
#define CLASS_PRIO_4	4
#define CLASS_PRIO_5	5
#define CLASS_PRIO_6	6	
#define CLASS_PRIO_7	7
#define CLASS_PRIO_8	8

#define CLASS_ID_OFFSET	 MAX_CLASS

#define CLASS_QDISK_BASE	0x2000	
#define DUAL_WAN_DN_DEFAULT_QDISC_ID	9

#ifdef USE_MSSID_QOS
#define MSSID_QOS_UP_BASE_ID	30
#endif

/*
   HOW TO MAKE CLASS ID

   - Interface Default Class ID  = CLASS_QDISK_BASE + direction ID
   - User Class ID =  000x_xxxx_yyyy_yyyy(binary)
   	x : Bandwidth Per IP subindex (1 ~ 31)
        y : user class id (1 ~ 254)
 */

struct _Class_
{
	int     	id;      	/* class id */
	int          	option;		/* bpi count */
	char       	name[CLASS_NAME_LEN];	/* class name */
	unsigned char	direction;
#define TO_IN_FROM_EXT     	1	/* In<-Ext All */
#define TO_IN_FROM_SUB_EXT1	2	/* In<-Ext1 */
#define TO_IN_FROM_SUB_EXT2	3	/* In<-Ext2 */
#define FROM_IN_TO_SUB_EXT1	4	/* In->Ext1 */
#define FROM_IN_TO_SUB_EXT2	5	/* In->Ext2 */
#define BI_IN_AND_EXT   	100	/* In<->Ext All */
	int     	rate;     	/* class rate (bandwidth) */
	unsigned char	unit;   	/* 0 - Mbit, 1-Kbit */
	unsigned char  	property;
#define ISOLATED_BOUNDED	0
#define ISOLATED_BORROW  	1
#define SHARING_BOUNDED 	2
#define SHARING_BORROW  	3
	int     	filter_count;	/* number of filter */
	unsigned int	filter_id_list;	/* filter id list : 0 ~ 31 */
	Filter     	filterlist[MAX_FILTER];
	int       	couple;     	/* couple class - used only in a easy conf */
} ;

#define EXTERN_IF_ID(dir) \
	(((dir == TO_IN_FROM_SUB_EXT1) || (dir == FROM_IN_TO_SUB_EXT1)) ? IF_EXT1_ID : \
	 ((dir == TO_IN_FROM_SUB_EXT2) || (dir == FROM_IN_TO_SUB_EXT2)) ? IF_EXT2_ID : dir)
#define IS_DIR_TO_IN_FROM_EXT(dir) \
	((dir == TO_IN_FROM_SUB_EXT1) || (dir == TO_IN_FROM_SUB_EXT2))
#define IS_DIR_FROM_IN_TO_EXT(dir) \
	((dir == FROM_IN_TO_SUB_EXT1) || (dir == FROM_IN_TO_SUB_EXT2))

#ifdef USE_DUAL_WAN
#define WAN1_DOWN_FILTER        (CLASS_QDISK_BASE + TO_IN_FROM_SUB_EXT1)
#define WAN2_DOWN_FILTER        (CLASS_QDISK_BASE + TO_IN_FROM_SUB_EXT2)
#endif




int tc_open(void);
int tc_close(void);
int tc_mode_set(int mode);
int tc_mode_get(int *mode);
void tc_reconfig(char *wan_name);
int tc_rate_sum_of_class(int skip_id, int direction);
int max_bandwidth_set (unsigned int id, char *service, unsigned int down, unsigned char down_unit,
		unsigned int up, unsigned char up_unit);
int max_bandwidth_get (unsigned int id, char *service, unsigned int *down, unsigned char *down_unit,
		unsigned int *up, unsigned char *up_unit);
unsigned int *class_id_list_get(int type);
int class_create (char *name, int type, unsigned char direction, int rate,
		unsigned char unit, unsigned char property, int bpi_count);
int class_change (int class_id, char *name, unsigned char direction,
		int rate, unsigned char unit, unsigned char property);
int class_destroy(int class_id);
Class *class_get(int class_id);
Class *class_find(int class_id);
int class_make_couple(int c1, int c2);
int filter_add_to_class (int class_id, int protocol,
		char *in_ip, unsigned int in_subnet, unsigned short *in_port,
		char *bpi_eip, unsigned int reserve, unsigned short *ex_port);
int filter_remove_from_class (int class_id, int filter_id);
int filter_change (int class_id, int filter_id, int protocol,
		char *in_ip, unsigned int in_subnet, unsigned short *in_port,
		char *ex_ip, unsigned int ex_subnet, unsigned short *ex_port);
Filter *filter_get(int class_id, int filter_id);
int filter_templet_add (char *name, int protocol,
		char *in_ip, unsigned int in_subnet, unsigned short *in_port,
		char *ex_ip, unsigned int ex_subnet, unsigned short *ex_port);
int filter_templet_delete (int filter_id);
Filter *filter_templet_get(int filter_id);

extern int check_bandwidth_limitation(
	unsigned char direction, int rate, unsigned char unit, unsigned char property);

#endif
