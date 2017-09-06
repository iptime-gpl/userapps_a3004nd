#ifndef _TC_FILE_H_
#define _TC_FILE_H_

#define TC_MODE_FILE        	"/etc/tc_mode"
#define TC_MAX_BANDWIDTH_FILE 	"/etc/tc_max_bandwidth"
#define TC_CLASS_ID_FILE  	"/etc/tc_class_id"
#define TC_CLASS_FILE   	"/etc/tc_class"
#define TC_IP_CLASS_FILE   	"/etc/tc_class.ip"
#define TC_PORT_CLASS_FILE   	"/etc/tc_class.port"
#define TC_APP_CLASS_FILE   	"/etc/tc_class.app"
#define TC_FILTER_TEMPLET_FILE	"/etc/tc_filte_templet"
#define TC_DEFAULT_CLASS_FILE	"/etc/tc_default_class"

int tc_mode_file_write(int mode);
int tc_mode_file_read(int *mode);
int tc_count_file_write(int count);
int tc_count_file_read(int *count);
int max_bandwidth_file_write(Max_Bandwidth *mbw);
int max_bandwidth_file_read(Max_Bandwidth *mbw);
#ifdef USE_NAVI_IPTIME_UI
int class_id_list_file_write(unsigned int *classid_list, int size);
int class_id_list_file_read(unsigned int *classid_list, int size);
int class_file_write(Class *class_list, int count);
int class_file_read(Class *class_list, int *count);
#else
int class_id_list_file_write(unsigned int *classid_list);
int class_id_list_file_read(unsigned int *classid_list);
int class_file_write(Class *class_list, int type);
int class_file_read(Class *class_list, int type);
int tc_filter_templet_file_write(Filter *filter_templet);	
int tc_filter_templet_file_read(Filter *filter_templet);
int tc_default_class_file_write(void *default_class);
int tc_default_class_file_read(void *default_class);
#endif

int class_priority_order_write(int down_id, int up_id, int prio);

#endif
