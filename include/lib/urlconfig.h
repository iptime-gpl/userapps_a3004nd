#ifndef __URLFILTER_CONFIG__
#define __URLFILTER_CONFIG__

#define URLFILTERING_CONFIG_FILE "/etc/urlstring"
#define APP_TEMPLATE_URLFILTERING_CONFIG_FILE "/etc/apptemplate_urlstring"

typedef struct filter_string_s {
	char ip_address[20];
#ifdef USE_NEW_IPTABLES_IPRANGE
#ifndef USE_CONVERT_IPPOOL
	char ip_address2[20];
#endif
#endif
	char hw_address[20];
#define APP_TEMPLATE_FLAG       	0x1
#define ACCEPT_FLAG            		0x8000
#define URLFILTER_FLAG_MASK     	0xFFFF
#define URLFILTER_FLAG_SHIFT_BIT 	16
        unsigned int string_count;  /* flag(MSB 16 bits) + number of string (LSB 16 bits) */
#define MAX_FILTERING_STRING_SIZE 64
#define MAX_FILTERING_RULE_STRING_SIZE 100
       char string[MAX_FILTERING_STRING_SIZE];
       char rule_string[MAX_FILTERING_RULE_STRING_SIZE];
} filter_string_t;

typedef struct urlfilter_config_s {
       unsigned char magic[4];
#define URLFILTER_MAGIC "urlf" 
       unsigned int flag;
       unsigned int count;
#define MAX_FILTERING_STRING_NUM  20
       filter_string_t array[MAX_FILTERING_STRING_NUM];
} urlfilter_config_t;

#endif
