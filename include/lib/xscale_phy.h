extern int xscale_phy_get_status(int port, link_status_t *lnk);
extern int xscale_phy_set_config(int port, link_status_t *lnk);
extern int xscale_port_statistics(int port, port_stat_t *stt);
extern int xscale_port_statistics_clear(void);
extern int xscale_port_enable(int port, int status);
