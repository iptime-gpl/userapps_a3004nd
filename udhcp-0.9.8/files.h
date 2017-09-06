/* files.h */
#ifndef _FILES_H
#define _FILES_H

struct config_keyword {
	char keyword[14];
	int (*handler)(char *line, void *var);
	void *var;
	char def[30];
};


int read_config(char *file);
void write_leases(void);
void read_leases(char *file);

/* ysyoo. 2003.5.29, static leases */
void read_static_leases(char *file);
void write_static_leases(u_int8_t *chaddr, u_int32_t yiaddr, int add);

#endif
