#define SYSLOG_MSG_RESTART			"Syst�me red�marr� !"
#define SYSLOG_MSG_ADMIN_RESTART		"L'administrateur a lanc� la commande de red�marrage."
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"Mise � jour du firmware" 
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"Changement de l�identifiant et du mot de passe"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"Changement de l'adresse IP du routeur"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"Serveur DHCP activ� !"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"Serveur DHCP d�sactiv� !"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"Changement de la configuration WAN"

#define SYSLOG_MSG_DHCPC_RCV_IP			"Le port WAN est connect� en client DHCP." 
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"Aucune r�ponse du serveur DHCP au port WAN !"

#define SYSLOG_MSG_PPP_CONNECTED		"Le port WAN est connect� en client PPPoE."
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"Nom utilisateur ou mot de passe PPPoE incorrect !"
#define SYSLOG_MSG_PPP_DISCONNECTED		"La connexion PPPoE est d�connect�." 
#define SYSLOG_MSG_PPP_NO_REPONSE		"Aucune r�ponse du serveur PPPoE au port WAN !"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"Adresse IP assign�e au PC par le serveur DHCP !"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"Changement du port physique"

#define SYSLOG_MSG_DDNS_SUCCESS			"Enregistrement DDNS r�ussi !"
#define SYSLOG_MSG_DDNS_FAILED			"Enregistrement DDNS �chou� !"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "Echec du rapport d'e-mail : serveur SMTP introuvable !"
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "Le rapport Syslog a �t� envoy� avec succ�s." 
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          "Le rapport Netdetect a �t� envoy� avec succ�s." 
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"Echec de l'authentification SMTP !"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "Adresse e-mail administrateur incorrecte !"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "Le serveur e-mail est introuvable pour envoyer les messages."
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "Impossible de se connecter au serveur e-mail pour envoyer les messages !"


#define SYSLOG_STATIC_IP                         "IP statique"
#define SYSLOG_DYN_IP                            "DHCP"
#define SYSLOG_PPPOE                             "PPPoE"
#define SYSLOG_PPTP                              "PPTP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "Succ�s de la restauration - fichier :"
#define SYSLOG_CONFIG_RESTORE_FAILED		 "Echec de la restauration - fichier :"
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "Echec de la restauration - Aucun fichier"


#define SYSLOG_PPTP_CONNECTED			 "Serveur PPTP connect� - Nom d'utilisateur : %s / %s"
#define SYSLOG_PPTP_DISCONNECTED		 "Serveur PPTP d�connect� - Nom d'utilisateur : "

#define SYSLOG_MSG_UPNP_START 	"Activation du service UPnP (red�marrage du routeur)" 
#define SYSLOG_MSG_UPNP_STOP 	"D�sactivation du service UPnP"
#define SYSLOG_MSG_SAVECONF 	"Toutes les configurations sont sauvegard�es."

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "D�connexion de l'acc�s Internet par l'utilisateur !"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "Reconnexion de l'acc�s Internet par l'utilisateur !"

#define SYSLOG_MSG_FAKEDNS_START 	"Activation 'Connexion Auto'"
#define SYSLOG_MSG_FAKEDNS_STOP 	"D�sactivation 'Connexion Auto'"
#define SYSLOG_EMAIL_SEND_TIMEOUT       "Client SMTP : Timeout Alarm Termination"

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 d�connect� et d�tourn� vers WAN2"
#define SYSLOG_MSG_WAN1_OK	"WAN1 connect�"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 d�connect� et d�tourn� vers WAN1"
#define SYSLOG_MSG_WAN2_OK	"WAN2 connect�"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "WAN1 chang�"

#define SYSLOG_MSG_CHANGE_WAN_REBOOT "La configuration du port WAN a chang�."

#define SYSLOG_MSG_NAT_ON	"Activation du NAT" 
#define SYSLOG_MSG_NAT_OFF	"D�sactivation du NAT" 

#define SYSLOG_MSG_DHCPC_LEASE "WAN IP Lease Timeout : acc�s Internet d�connect� !" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "Le serveur DHCP a �t� suspendu parce qu'un autre serveur DHCP a �t� d�tect� sur le r�seau LAN."
#define SYSLOG_MSG_DHCP_SERVER_RESUME "Le serveur DHCP a �t� red�marr�."

#define SYSLOG_MSG_KAID_RESTARTED "KAI le moteur s'est remis en marche "

#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI download erreur(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI auth erreur(1)"


#define SYSLOG_IP_CONFLICT "Conflit d'IP"
#define SYSLOG_RECEIVE_PRIVATE_IP "Private IP for internet connection is inhibited"
#define SYSLOG_RECEIVE_INTERNAL_IP "Erreur de l'acc�s Internet : l'adresse IP WAN est identique � l'adresse IP du r�seau interne."

#define SYSLOG_MSG_MAKE_SCHED_1 "L'acc�s Internet n'est pas disponible maintenant. Une plage horaire a �t� programm�e et bloque son utilisation."
#define SYSLOG_MSG_MAKE_SCHED_2 "Si vous souhaitez utiliser l'acc�s Internet, demandez � votre administrateur r�seau."

#define SYSLOG_MSG_IPCONFLICT  "IP Confliction :"

#define LOGIN_LOG_WRITE_TRUE "IP : %s LOGIN Success"
#define LOGIN_LOG_WRITE_FAIL "IP : %s LOGIN Fail"

#define SYSLOG_MSG_MASTER_AP_FOUND "Found Master AP successfully"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "Can't find Master AP"
#define SYSLOG_MSG_NO_MASTER_BEACON "Disconnected with Master AP"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] Master AP's Channel is changed"

#define SYSLOG_MSG_WPS_OK	"Success in adding WPS device."
#define SYSLOG_MSG_WPS_FAIL	"Failed in adding WPS device. [Error Code:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "Isolate private IP(%s) assignment from WAN"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "WAN IP is the same as internal LAN's."

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "Gateway address was changed during DHCP renew process [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "IP address was changed during DHCP renew process [ %s(%s) -> %s(%s) ]"

#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "Resume PPPoE connection by PPPoE scheduler: %s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "Stop PPPoE connection by PPPoE scheduler: %s"

#define SYSLOG_SMART_QOS_NEW    "Smart QoS : %s Ajouter"
#define SYSLOG_SMART_QOS_DEL    "Smart QoS : %s Supprimer"

#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "DHCP client restarted by WAN%d link status."


#define DCS_CHANNEL_CHANGED_MSG "Channel is changed from %d to %d by Dynamic Channel Searching."
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Wireless Scheduler] %s wireless is resumed."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[[Wireless Scheduler] %s wireless is stopped."
#endif


#ifdef USE_SYNC_AP_CONFIG
#define SYSLOG_WIFI_EXT_APPLY_MACAUTH  "Wireless MAC Authentication Configuration is updated from connected AP."
#define SYSLOG_WIFI_EXT_APPLY_WIFISCHED  "Wireless Scheduler Configuration is updated from connected AP."
#endif

#define SYSLOG_EMAIL_SUBJECT "Rapport log syst�me par e-mail"
#define SYSLOG_LOG_HISTORY "Journal du log syst�me"
#define SYSLOG_LOG_TIME  "Date / Heure"
#define SYSLOG_LOG_CONTENT  "Contenu des logs"

