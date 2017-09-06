/************** LOG ******************************/
#define SYSLOG_MSG_RESTART			"«·«¹«Æ«àî¢ÑÃÔÑ ( Version: %s )"
#define SYSLOG_MSG_ADMIN_RESTART		"Î·×âíºª¬«·«¹«Æ«àªòî¢ÑÃÔÑª¹ªë"
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"Î·×âíºª¬«Õ«¡?«à«¦«§«¢?ªò«¢«Ã«×«Ç?«Èª¹ªë"
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"Î·×âíºª¬«í«°«¤«ó«Ñ«¹«ï?«Éªò?ÌÚª¹ªë"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"Î·×âíºª¬?Ý» IPªò?ÌÚª¹ªë"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"Î·×âíºª¬ DHCP «µ?«Ð?ªò?ú¼ª¹ªë"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"Î·×âíºª¬ DHCP «µ?«Ð?ªòñéò­ª¹ªë"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"Î·×âíºª¬«¤«ó«¿?«Í«Ã«ÈàâïÒªò?ÌÚª¹ªë"

#ifndef USE_JUST_AP
#define SYSLOG_MSG_DHCPC_RCV_IP			"DHCP Client(WAN)ª¬ IPªòáôãá"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"DHCP Server(WAN)?ÓÍªÊª·"
#else
#define SYSLOG_MSG_DHCPC_RCV_IP                 "DHCP Clientª¬ IPªòáôãá"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT         "DHCP Server ?ÓÍªÊª·"
#endif

#define SYSLOG_MSG_PPP_CONNECTED		"PPPª¬ïÈ?ªµªìªÆ IPªòáôãá"
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"PPP«¢«««¦«ó«ÈÐàªÓ«Ñ«¹«ï?«Éª¬ïáª·ª¯ªÊª¤"
#define SYSLOG_MSG_PPP_DISCONNECTED		"PPPïÈ?ª¬ï·?"
#define SYSLOG_MSG_PPP_NO_REPONSE		"PPPoE «µ?«Ð?ªÎ?ÓÍª¬ªÊª¤"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"DHCP «µ?«Ð?ª¬ IP ùÜ?ª¹ªë"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"Î·×âíºª¬«ê«ó«¯àâïÒªò?ÌÚ"

#define SYSLOG_MSG_DDNS_SUCCESS			"DDNS Ôô?à÷Íí"
#define SYSLOG_MSG_DDNS_FAILED			"DDNS Ôô?ã÷ø¨"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "SMTP «µ?«ÐªòÌ¸ªÄª«ªéªÊª¯ªÆ E-mailáêãáã÷ø¨" 
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "SYSLOG ?Ö§ÜÃÍ±ßöªòÎ·×âíº E-mail ªËáêãá"
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          	"NETDETECT ?Ö§ÜÃÍ±ßöªòÎ·×âíº E-mail ªËáêãá"
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"SMTP «¢«««¦«ó«Èìã?ã÷ø¨ - ìã?Û°Ûö:"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "Î·×âíº E-mail àâïÒª¬ÊàêÞªÃªÆª¤ªë"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "«á?«ë«µ?«Ð?ªòÌ¸ªÄª«ªéªÊª¯ªÆ«á?«ëáêãáã÷ø¨"
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "«á?«ë«µ?«Ð?ªËïÈ?ªÇª­ªÊª¯ªÆ«á?«ëáêãáã÷ø¨"

#define SYSLOG_STATIC_IP                         "Í³ïÒ IP"
#define SYSLOG_DYN_IP                            "ÔÑîÜ IP"
#define SYSLOG_PPPOE                             "PPPoE Û°ãÒ"
#define SYSLOG_PPTP                	         "PPTP IP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "àâïÒÜÖêªà÷Íí - «Õ«¡«¤«ëÙ£ : "
#define SYSLOG_CONFIG_RESTORE_FAILED		 "àâïÒ«Õ«¡«¤«ëª¬ïáª·ª¯ªÊª¯ªÆàâïÒÜÖêªã÷ø¨ - «Õ«¡«¤«ëÙ£ : "
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "àâïÒÜÖêªã÷ø¨ - «Õ«¡«¤«ëÙ£ : ìýÕôªµªìªÆªÊª¤"

#define SYSLOG_PPTP_CONNECTED			 "PPTP VPN ïÈ?à÷Íí - «¢«««¦«ó«È :  %s / %s" 
#define SYSLOG_PPTP_DISCONNECTED		 "PPTP VPN ïÈ?ï·? - «¢«««¦«ó«È : " 


#define SYSLOG_MSG_UPNP_START 	"Î·×âíºª¬ UPNPªò«¹«¿?«Èª¹ªë(«·«¹«Æ«àî¢ÑÃÔÑ)"
#define SYSLOG_MSG_UPNP_STOP 	"Î·×âíºª¬ UPNPªòñéò­ª¹ªë"
#define SYSLOG_MSG_SAVECONF 	"îïªÆªÎàâïÒª¬ÜÁðíªµªìªë "

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "Î·×âíºª¬«¤«ó«¿?«Í«Ã«Èªòú°ð¶ª¹ªë"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "Î·×âíºª¬«¤«ó«¿?«Í«Ã«ÈªòïÈ?ª¹ªë"

#define SYSLOG_MSG_FAKEDNS_START 	"Î·×âíºª¬ 'àâïÒ?ØüªËí»ÔÑïÈ?' Ñ¦ÒöªòàâïÒª¹ªë"
#define SYSLOG_MSG_FAKEDNS_STOP 	"Î·×âíºª¬ 'àâïÒ?ØüªËí»ÔÑïÈ?' Ñ¦Òöªòú°ð¶ª¹ªë"

#define SYSLOG_EMAIL_SEND_TIMEOUT       "Î·×âíº E-mail ªòáêãáã÷ø¨(ïÈ?ãÁÊàõ±Î¦) "

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 «¤«ó«¿?«Í«Ã«ÈïÈ?ï·?¡£ WAN2ªË«Ð«Ã«¯«¢«Ã«×"
#define SYSLOG_MSG_WAN1_OK	"WAN1 «¤«ó«¿?«Í«Ã«ÈïÈ?ÜÖêª"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 «¤«ó«¿?«Í«Ã«ÈïÈ?ï·?¡£ WAN1ªË«Ð«Ã«¯«¢«Ã«×"
#define SYSLOG_MSG_WAN2_OK	"WAN2 «¤«ó«¿?«Í«Ã«ÈïÈ?ÜÖêª"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "ÐñÜâÝÂß¤?ÖØªò?ÌÚª¹ªë"
#define SYSLOG_MSG_CHANGE_WAN_REBOOT "Î·×âíºª¬ÙíàÊ WAN àâïÒªò?ÌÚª¹ªë"

#define SYSLOG_MSG_NAT_ON	"Î·×âíºª¬ NATÑ¦ÒöªòONªËª¹ªë"
#define SYSLOG_MSG_NAT_OFF	"Î·×âíºª¬ NATÑ¦ÒöªòOFFªËª¹ªë"

#define SYSLOG_MSG_DHCPC_LEASE "èâÝ» IP «ì«ó«¿«ëãÁÊàõ±Î¦: «¤«ó«¿?«Í«Ã«ÈïÈ?ï·?" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "?Ý»«Í«Ã«È«ï?«¯ª«ªéöâªÎ DHCP «µ?«Ð?ª¬?ßãªµªìªÆ«ë?«¿ªÎ DHCP«µ?«Ð?Ñ¦Òöªòñé?ª¹ªë¡£"
#define SYSLOG_MSG_DHCP_SERVER_RESUME "?Ý»«Í«Ã«È«ï?«¯ª«ªé DHCP«µ?«Ð?ª¬Ì¸ªÄª«ªéªÊª«ªÃª¿ª¿ªá¡¢«ë?«¿ªÎ DHCP«µ?«Ð?Ñ¦Òöªòî¢?ú¼ª¹ªë¡£"


#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI download error(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI auth error(1)"
#define SYSLOG_MSG_KAID_RESTARTED "KAI «¨«ó«¸«óªòî¢ÑÃÔÑª·ªÞª¹¡£"

#define SYSLOG_IP_CONFLICT "IPªË«È«é«Ö«ëªòÊïò±ªµªìªÞª·ª¿"
#define SYSLOG_RECEIVE_PRIVATE_IP "Þçàâ IP ó´?Ñ¦ÒöªËªèªÃªÆÞçàâ IPª¬èâÝ» IPªËàâïÒªµªìªÊª¤"
#define SYSLOG_RECEIVE_INTERNAL_IP "?Ý» IP ªÈÔÒìéªÊèâÝ»IPª¬ùÜ?ªµªìªÆ«¤«ó«¿?«Í«Ã«ÈïÈ?ÜôÊ¦"

#define SYSLOG_MSG_MAKE_SCHED_1 "«¤«ó«¿?«Í«Ã«Èªòª·ªèª¦ª¹ªëª¿ªáªËªÏ«ë?«¿Î·×âíºªËªªÙýùêªïª»ù»ªµª¤¡£"
#define SYSLOG_MSG_MAKE_SCHED_2 "ÐÑªÏ«¤«ó«¿?«Í«Ã«ÈªòÞÅéÄªÇª­ªÊª¤ãÁÊàªÇª¹¡£"

#define SYSLOG_MSG_IPCONFLICT  "IP «È«é«Ö«ëÊïò± :" 

#define LOGIN_LOG_WRITE_TRUE "IP : %s LOGIN à÷Íí"
#define LOGIN_LOG_WRITE_FAIL "IP : %s LOGIN ã÷ø¨"

#define SYSLOG_MSG_MASTER_AP_FOUND "«Þ«¹«¿? AP ?ßãà÷Íí"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "«Þ«¹«¿? AP ?ßãã÷ø¨"
#define SYSLOG_MSG_NO_MASTER_BEACON "«Þ«¹«¿? APªÇªÎ WDSïÈ?ª¬ï·ªìªë"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] «Þ«¹«¿? APªÎ«Á«ã«ó«Í«ëª¬?ÌÚªµªìªÞª·ª¿¡£"


#define SYSLOG_MSG_WPS_OK	"WPS ÙíàÊ?öÇªËïÈ?à÷Íí"
#define SYSLOG_MSG_WPS_FAIL	"WPS ÙíàÊ?öÇªËïÈ?ã÷ø¨ [Error Code:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "WAN «Ý?«ÈªËÞçàâIP(%s) ùÜ?ãËú¼"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "WAN «Ý?«ÈªË?Ý»«Í«Ã«È«ï?«¯ªÈÔÒª¸?æ´ªÎ IP(%s) ùÜ?ãËú¼"

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "DHCPÌÚãæãÁ«²?«È«¦«§«¤«¢«É«ì«¹?ÌÚ [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "DHCP ÌÚãæãÁ IP«¢«É«ì«¹?ÌÚ [ %s(%s) -> %s(%s) ]"

#define SMTP_MESSAGE_STRING "SMTP Message"


#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "PPPoE «¹«±«¸«å?«éªËªèªÃªÆïÈ?ª¬ÜÖ?ªµªìªë: %s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "PPPoE «¹«±«¸«å?«éªËªèªÃªÆïÈ?ª¬ñéò­ªµªìªë: %s"

#define SYSLOG_SMART_QOS_NEW	"Smart QoS : %s õÚÊ¥"
#define SYSLOG_SMART_QOS_DEL	"Smart QoS : %s Þûð¶"

#define SYSLOG_DDNS_SERVER_CONNECTED "DDNS «µ?«Ð?ªËïÈ?ª¹ªë" 
#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "WAN%d «Ý?«ÈªÎÚª×âîÜ«ê«ó«¯ª¬î¢ïÈ?ªµªìªÆ DHCPÑ¦Òöªòî¢ÑÃÔÑª¹ªë¡£"


#define SYSLOG_SAVE_FAILED "ÜÁðí«¹«Ú?«¹ª¬ðëªêªÊª¯ªÆª³ªìì¤ß¾ªÎàâïÒªòÜÁðíªÇª­ªÞª»ªó¡£"


#define DCS_CHANNEL_CHANGED_MSG "Channel is changed from %d to %d by Dynamic Channel Searching."
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Wireless Scheduler] %s wireless is resumed."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[[Wireless Scheduler] %s wireless is stopped."
#endif

