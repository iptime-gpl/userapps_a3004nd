#define MAX_IPMAC_BIND_NUM	100

extern int add_static_ipmac_bind(char *ip, char *hw);
extern int remove_static_ipmac_bind(char *ip);
extern int get_static_ipmac_bind(int idx, char *ip, char *hw);
extern int get_static_ipmac_bind_config(int *op, int *count);
extern int set_static_ipmac_bind_config(int op, int count);
extern int init_static_ipmac_bind(void);



