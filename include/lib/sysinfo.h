#ifndef __SYSINFO__H
#define __SYSINFO__H

#define MAX_BOARD_USB_NUM 2
#define MAX_BOARD_SATA_NUM 4
#define MAX_BOARD_FAN_NUM 2

typedef struct product_s {
#define MAX_PRODUCT_NAME_LEN 128
	char name[MAX_PRODUCT_NAME_LEN]; 
#define MAX_PRODUCT_COMPANY_LEN 128
	char company[MAX_PRODUCT_COMPANY_LEN]; 
#define MAX_PRODUCT_URL_LEN 128
	char url[MAX_PRODUCT_URL_LEN]; 
#define MAX_PRODUCT_TYPE_LEN 32
	char type[MAX_PRODUCT_TYPE_LEN]; /* wired_router|wireless_router|extender|ap */
#define MAX_PRODUCT_VENDOR_LEN 32 
	char vendor[MAX_PRODUCT_VENDOR_LEN]; /* efm|totolink|oem... */
} product_t;


/* chipset structure start */
#define MAX_CHIPSET_NAME_LEN 64
typedef struct soc_s {
	char name[MAX_CHIPSET_NAME_LEN]; 
#define MAX_SOC_CORE_LEN 32
	char core[MAX_SOC_CORE_LEN]; 
	unsigned int clock_mhz;
#define MAX_SOC_VENDOR_LEN 32
	char vendor[MAX_SOC_VENDOR_LEN]; 
} soc_t;

typedef struct wifi_chipset_s {
	char name[MAX_CHIPSET_NAME_LEN]; 
#define MAX_WIFI_CHIPSET_TYPE_LEN 8
	char type[MAX_WIFI_CHIPSET_TYPE_LEN];
	int  num_of_streams;
} wifi_chipset_t;



typedef struct eport_stat_s {
        unsigned long long rx_pkts;
        unsigned long long rx_bytes;
        unsigned long long rx_bcast;
        unsigned long long rx_mcast;

        unsigned long long rx_error;
        unsigned long long rx_drop;
        unsigned long long rx_crc;
        unsigned long long rx_frag;

        unsigned long long rx_pause;
        unsigned long long tx_pkts;
        unsigned long long tx_bytes;
        unsigned long long tx_bcast;

        unsigned long long tx_mcast;
        unsigned long long tx_coll;
        unsigned long long tx_pause;
} eport_stat_t;

int get_eport_stat(int ux_port, eport_stat_t *s);


typedef struct eswitch_s {  
	char name[MAX_CHIPSET_NAME_LEN];
	int max_speed;
	int port_stat_mask;
#define FLAG_NETCONF_LINK_RX_PACKETS            0x1
#define FLAG_NETCONF_LINK_RX_BYTES              0x2
#define FLAG_NETCONF_LINK_RX_BROADCAST          0x4
#define FLAG_NETCONF_LINK_RX_MULTICAST          0x8
#define FLAG_NETCONF_LINK_RX_ERROR              0x10
#define FLAG_NETCONF_LINK_RX_DROP               0x20
#define FLAG_NETCONF_LINK_RX_CRC                0x40
#define FLAG_NETCONF_LINK_RX_FRAG               0x80
#define FLAG_NETCONF_LINK_RX_PAUSE              0x100
#define FLAG_NETCONF_LINK_TX_PACKETS            0x200
#define FLAG_NETCONF_LINK_TX_BYTES              0x400
#define FLAG_NETCONF_LINK_TX_BROADCAST          0x800
#define FLAG_NETCONF_LINK_TX_MULTICAST          0x1000
#define FLAG_NETCONF_LINK_TX_COLLISION          0x2000
#define FLAG_NETCONF_LINK_TX_PAUSE              0x4000
#define FLAG_PORT_STAT_CLEAR		        0x80000000
} eswitch_t;

typedef struct chipset_s {
	soc_t soc;
	eswitch_t eswitch;
	wifi_chipset_t wl2g;
	wifi_chipset_t wl5g;
} chipset_t;
/* chipset structure end */


/* board structure start */

typedef struct dram_s {
#define MAX_DRAM_TYPE_LEN 16
	char type[MAX_DRAM_TYPE_LEN]; /* sdram|ddr1|ddr2|ddr3|ddr4 */
	int size; /* DRAM size by Mbytes */
	int clock_mhz; 
	int bus_width;  /* 8|16|32 */
} dram_t;


typedef struct flash_s {
#define MAX_FLASH_TYPE_LEN 16
	char type[MAX_FLASH_TYPE_LEN]; /* snor|pnand|pnor|snand */
	int size; /* Size by Mbytes */
} flash_t;

#ifdef USE_WIFI_EXTENDER
#define MAX_EXT_SIG_LED 4
typedef struct ext_gpio_s {
	int led;
	int button;
	int sig[MAX_EXT_SIG_LED];
} ext_gpio_t;
#endif

typedef struct gpio_s {
	int cpu_led;	
	int reset_bt;	
	int wps_bt;	
	int wl2g_led;
#define MAX_LED_TYPE_LEN 16 /* gpio , wlgpio */
	char wl2g_led_type[MAX_LED_TYPE_LEN];
	int wl5g_led;
	char wl5g_led_type[MAX_LED_TYPE_LEN];
	int usb_led[MAX_BOARD_USB_NUM];	
	int sata_led[MAX_BOARD_SATA_NUM];	
	int fan_sense[MAX_BOARD_FAN_NUM];
	int fan_control1[MAX_BOARD_FAN_NUM];
	int fan_control2[MAX_BOARD_FAN_NUM];
	int wifi_switch;
	int wifi_switch_radio_off;
	int led_switch;
	int ap_status_led;

#ifdef USE_WIFI_EXTENDER
	/* For Extender Platform */
	int ext_lan_led;
	ext_gpio_t ext2g;
	ext_gpio_t ext5g;
#endif

	int mode_reg_set;
	int mode_reg;

} gpio_t;


#define MAX_NUMBER_OF_LAN 32
#define MAX_NUMBER_OF_WAN 2

#define UX_WAN_PORT_BASE 0x10000
#define UX_WAN_PORT(i)  (UX_WAN_PORT_BASE+i)
#define UX_WAN_IDX(ux_port)  (ux_port-UX_WAN_PORT_BASE)
#define WAN_PORT_SHIFT 	16

#define EXTERNAL_SWITCH_PORT_FLAG (0x1 << 31)
#define INTERNAL_SWITCH_PORT_FLAG (0)
typedef struct eport_s {
	int nolan;	
	int nowan;	
	int pub_iptv_ux_port;
	int mirror_ux_port;
	int lan[MAX_NUMBER_OF_LAN]; /* (index+1): UI or Housing PORT , value: Dev Port */
	int wan[MAX_NUMBER_OF_WAN];
	int lan_speed[MAX_NUMBER_OF_LAN];
	int wan_speed[MAX_NUMBER_OF_WAN];
	int trunkmap;
	int cpu;	
	char lan_switch[8];
	char wan_switch[8];
} eport_t;

typedef struct usb_s {
	int mode; /* 2 or 3 */
} usb_t;

typedef struct board_s {
#define MAX_BOARD_NAME_LEN 32
	char name[MAX_BOARD_NAME_LEN];
	int nousb;
#define MAX_BOARD_USB 2
	usb_t usb[MAX_BOARD_USB]; 
	int nosata;
	int noflash;
	int nowireless;
	int nofan;
	dram_t dram; 
#define MAX_BOARD_FLASH 3
	flash_t flash[MAX_BOARD_FLASH]; 	
	gpio_t gpio;
	eport_t eport;
} board_t;

/* board structure end */


typedef struct hw_s {
	chipset_t chipset;
	board_t board;
} hw_t;


typedef struct sdk_s {
#define MAX_SDK_VERSION_LEN 128
	char version[MAX_SDK_VERSION_LEN];
} sdk_t;



#ifdef USE_WL_IPTIME_HELPER
typedef struct wl_helper_s {
	int enable;
#define WLHELPER_SSID_BUFLEN 64
	char ssid[WLHELPER_SSID_BUFLEN];
#define WLHELPER_PASS_BUFLEN 128
	int use_encryption;
	char password[WLHELPER_PASS_BUFLEN];
#define WLHELPER_IFNAME_BUFLEN 16
	char ifname[WLHELPER_IFNAME_BUFLEN];
#define WLHELPER_IP_BUFLEN 32
	char ip[WLHELPER_IP_BUFLEN];
#define WLHELPER_URL_BUFLEN 128
	char url[WLHELPER_URL_BUFLEN];
	int hidden;
	int redirect;
} wl_helper_t;
#endif

typedef struct sw_s {
	char firmware_alias[32];
#ifdef USE_MULTI_LANG
#define MAX_LANGUAGES 6
	char ux_lang[MAX_LANGUAGES][5];
#endif
#ifdef USE_WL_IPTIME_HELPER
	wl_helper_t wl_helper;
#ifdef USE_EASY_ROUTER_SETUP
	wl_helper_t wl_helper2;
#endif
#endif
	sdk_t sdk;

#define MAX_OEM_PROFILE_LENGTH 32
	char oem_profile[MAX_OEM_PROFILE_LENGTH];
#ifdef USE_CUPS
	int printer_spool_size;
#endif
} sw_t;


#define MAX_WIFI_REG_NUM 4
#ifdef USE_BCM5354
typedef struct bcm2g_povars_s {  
#define MAX_NVRAM_PREFIX_LEN 16
	char nvram_povar_prefix[MAX_NVRAM_PREFIX_LEN];
	int cck2gpo;
/*
	int ofdm2gpo;
	int mcs2gpo0;
	int mcs2gpo1;
	int mcs2gpo2;
	int mcs2gpo3;
	int mcs2gpo4;
	int mcs2gpo5;
	int mcs2gpo6;
	int mcs2gpo7;
*/
} bcm2g_povars_t;
#endif

#ifdef USE_MTK_EEPROM_CONTROL_FOR_REGULATION
#define MAX_EEPROM_ARRAY_SIZE 32
typedef struct eeprom_val_s {
	int valid;
	int offset;
	int value;
} eeprom_val_t;

#endif
#ifdef USE_BCM5354
typedef struct nvram_val_s {
	int valid;
#define MAX_NVRAM_TAG 128
#define MAX_NVRAM_VAL 128
	char tag[MAX_NVRAM_TAG];
	char val[MAX_NVRAM_VAL];
} nvram_val_t;
#define MAX_NVRAM_ARRAY_SIZE 10
#endif

typedef struct wifi_reg_s {  
#define MAX_WIFI_COUNTRY_LEN 8
	char country[MAX_WIFI_COUNTRY_LEN];  /* KR US CN ... */
	int pwr_percent_2g;
	int pwr_percent_2g_20MHz;
#ifdef USE_BCM5354
	bcm2g_povars_t bcm2g_povars;
	bcm2g_povars_t bcm2g_povars_20MHz;
	nvram_val_t nvram[MAX_NVRAM_ARRAY_SIZE];
	int phy_watchdog_2g;
	int phy_watchdog_5g;
#endif
	int pwr_percent_5gl;
	int pwr_percent_5gm;
	int pwr_percent_5gh;

	int regulation_channel_limit; /* for 44/48 channel */

#ifdef USE_MTK_EEPROM_CONTROL_FOR_REGULATION
	eeprom_val_t eeprom2g[MAX_EEPROM_ARRAY_SIZE];
	eeprom_val_t eeprom5gh[MAX_EEPROM_ARRAY_SIZE];
	eeprom_val_t eeprom5gm[MAX_EEPROM_ARRAY_SIZE];
	eeprom_val_t eeprom5gl[MAX_EEPROM_ARRAY_SIZE];
#endif

} wifi_reg_t;

typedef struct wifi_s { 
	int apply_regulation_on_ate;
	int txpwr_low_limit_2g;
	int txpwr_low_limit_5gl;
	int txpwr_low_limit_5gm;
	int txpwr_low_limit_5gh;
	wifi_reg_t wifi_reg[MAX_WIFI_REG_NUM];
} wifi_t;





typedef struct sysinfo_s {
	product_t pi;
	hw_t	  hw;
	sw_t	  sw; // Not Yet
	wifi_t    wifi;
} sysinfo_t;


int get_si(char *tag, void *ri);
int get_ux_port(hw_t *hw,int dev_port);
int get_dev_port(hw_t *hw,int ux_port);
int get_wifi_regulated_pwr(wifi_t *wifi,char *country, int channel, int bw);
int check_regulation_channel_limit(wifi_t *wifi,char *country, int bw, int channel);
int check_wifi_regulation(char *country);
int get_wifi_regulated_real_pwr(wifi_t *wifi,char *country, int channel, int bw, int tx_power);
int get_wifi_regulated_pwr_lower_limit(wifi_t *wifi,int channel);
wifi_reg_t *get_wifi_regulation(wifi_t *wifi,char *country);
#ifdef USE_MTK_EEPROM_CONTROL_FOR_REGULATION
eeprom_val_t *get_wifi_regulated_eeprom(wifi_t *wifi,char *country, int channel);
#endif

#ifdef USE_BCM5354
bcm2g_povars_t *get_wifi_reg_bcm2g_povars(wifi_t *wifi,char *country,int channel_width);
#endif


int si_dram_size_mb(void);








#endif
