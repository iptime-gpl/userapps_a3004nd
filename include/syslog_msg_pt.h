/************** LOG ******************************/
#define SYSLOG_MSG_RESTART			"Sistema reiniciado ( Versão:%s )" 
#define SYSLOG_MSG_ADMIN_RESTART		"Administrador enviou comando de reinicio"
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"Administrador atualizou o sistema" 
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"Administrador alterou o usuário e senha"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"Administrador alterou o endereço IP da LAN (Rede Interna)"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"Administrador ativou o servidor DHCP"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"Administrador desativou o servidor DHCP"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"Administrador alterou a configuração WAN"

#ifndef USE_JUST_AP
#define SYSLOG_MSG_DHCPC_RCV_IP			"WAN conectada por cliente DHCP" 
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"Sem resposta do servidor DHCP na WAN"
#else
#define SYSLOG_MSG_DHCPC_RCV_IP                 "Obtendo endereço IP do servidor DHCP"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT         "Servidor DHCP não responde"
#endif

#define SYSLOG_MSG_PPP_CONNECTED		"WAN conectada por PPPoE"
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"Usuário e senha inválido durante a autenticação PPPoE"
#define SYSLOG_MSG_PPP_DISCONNECTED		"PPPoE desconectado" 
#define SYSLOG_MSG_PPP_NO_REPONSE		"Servidor PPPoE não responde"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"Endereço IP atribuído pelo Servidor DHCP:"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"Administrador alterou a porta (link) de configuração"

#define SYSLOG_MSG_DDNS_SUCCESS			"DDNS registrado com sucesso"
#define SYSLOG_MSG_DDNS_FAILED			"Falha no registro do DDNS"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "E-mail de relatório falhou: Não foi possível encontrar o servidor SMTP"
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "Log de sistema enviado com sucesso" 
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          "Detecção de rede enviado com sucesso" 
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"Falha na autenticação SMTP"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "E-mail do administrador inválido"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "Não encontrou um servidor de e-mail"
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "Não pode conectar no servidor de e-mail"


#define SYSLOG_STATIC_IP                         "Estático"
#define SYSLOG_DYN_IP                            "DHCP"
#define SYSLOG_PPPOE                             "PPPoE"
#define SYSLOG_PPTP                	         "IP PPTP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "Sucesso em restaurar a configuração do arquivo :"
#define SYSLOG_CONFIG_RESTORE_FAILED		 "Falha em restaurar a configuração do arquivo:"
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "Falha em restaurar a configuração - Sem Arquivo"


#define SYSLOG_PPTP_CONNECTED			 "Conexão VPN PPTP - Conta : %s / %s"
#define SYSLOG_PPTP_DISCONNECTED		 "Desconexão VPN PPTP - Conta : "

#define SYSLOG_MSG_UPNP_START 	"Administrador ativou o UPNP (Sistema Reiniciado)" 
#define SYSLOG_MSG_UPNP_STOP 	"Administrador desativou o UPNP"
#define SYSLOG_MSG_SAVECONF 	"Todas as configurações foram salvas"

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "Administrador desconectou a Internet"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "Administrador conectou a Internet"

#define SYSLOG_MSG_FAKEDNS_START 	"Administrador ativou  'Conexão no assistente WEB automático'"
#define SYSLOG_MSG_FAKEDNS_STOP 	"Administrador desativou 'Conexão no assistente WEB automático'"
#define SYSLOG_EMAIL_SEND_TIMEOUT       "Cliente SMTP: Alarme de tempo limite"

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 desconectado e redirecionado para a WAN2"
#define SYSLOG_MSG_WAN1_OK	"WAN1 conectado"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 desconectado e redirecionado para a WAN1"
#define SYSLOG_MSG_WAN2_OK	"WAN2 conectado"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "Alterado a WAN"

#define SYSLOG_MSG_CHANGE_WAN_REBOOT "Administrador alterou a porta de configuração WAN"

#define SYSLOG_MSG_NAT_ON	"Administrador ativou o NAT" 
#define SYSLOG_MSG_NAT_OFF	"Administrador desativou o NAT" 

#define SYSLOG_MSG_DHCPC_LEASE "Tempo limite de obtenção de IP WAN: Internet desconectada" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "Servidor DHCP foi desativado, pois foi detectado outro servidor DHCP na LAN"
#define SYSLOG_MSG_DHCP_SERVER_RESUME "O servidor de DHCP foi retomado"

#define SYSLOG_MSG_KAID_RESTARTED "KAI engine restarted"

#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI download error(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI auth error(1)"


#define SYSLOG_IP_CONFLICT "Conflito de IP"
#define SYSLOG_RECEIVE_PRIVATE_IP "Endereço IP privado da conexão de Internet é inibido"
#define SYSLOG_RECEIVE_INTERNAL_IP "Erro na conexão da Internet: A faixa de IP da WAN é a mesmo da rede interna LAN"

#define SYSLOG_MSG_MAKE_SCHED_1 "O serviço de Internet não está disponível porque está bloqueado."
#define SYSLOG_MSG_MAKE_SCHED_2 "Se desejar utilizar a Internet, solicite ao administrador de rede."

#define SYSLOG_MSG_IPCONFLICT  "Conflito de IP :"
#define LOGIN_LOG_WRITE_TRUE "IP : %s Acesso com sucesso"
#define LOGIN_LOG_WRITE_FAIL "IP : %s Acesso com falha"

#define SYSLOG_MSG_MASTER_AP_FOUND "Encontrado o AP principal com sucesso"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "Não pode encontrar o AP principal"
#define SYSLOG_MSG_NO_MASTER_BEACON "Desconectado do AP principal"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] Canal do AP principal alterado"

#define SYSLOG_MSG_WPS_OK	"Dispositivo WPS adicionado com sucesso."
#define SYSLOG_MSG_WPS_FAIL	"Falha em adicionar o dispositivo WPS. [Código Erro:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "IP (%s) privado associado pela WAN"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "IP da WAN é o mesmo IP da LAN."

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "Endereço do Gateway foi alterado no processo de renovação de IP via DHCP [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "Endereço IP foi alterado no processo de renovação de IP via DHCP [ %s(%s) -> %s(%s) ]"

#define SMTP_MESSAGE_STRING "Mensagem SMTP"


#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "Resumo da conexão PPPoE pelo agendador PPPoE:%s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "Parada da conexão PPPoE pelo agendador PPPoE: %s"

#define SYSLOG_SMART_QOS_NEW    "Smart QoS : %s Adicionar"
#define SYSLOG_SMART_QOS_DEL    "Smart QoS : %s Excluir"

#ifdef USE_SYNC_AP_CONFIG
#define SYSLOG_WIFI_EXT_APPLY_MACAUTH  "Wireless MAC Authentication Configuration is updated from connected AP."
#define SYSLOG_WIFI_EXT_APPLY_WIFISCHED  "Wireless Scheduler Configuration is updated from connected AP."
#endif

#define SYSLOG_DDNS_SERVER_CONNECTED "Conectado perfeitamente ao servidor DDNS."
#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "O cliente DHCP reiniciado pelo estado %d de WAN."
#define SYSLOG_SAVE_FAILED "Não há mais espaço para configurar. Não pode-se armazenar mais dados de configuração."
#define DCS_CHANNEL_CHANGED_MSG "O canal foi alterado de %d a %d pela pesquisa dinâmica de canais."
 
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Programador Wifi] %s o wifi foi iniciado."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[[Programador Wifi] %s o wifi foi finalizado."
#endif
 
#define SYSLOG_USB_STORAGE_DETECTED "Foi detectado um dispositivo de armazenamento USB.(USB%d)"
#define SYSLOG_USB_STORAGE_MOUNT "Foi ativado um dispositivo de armazenamento USB.(USB%d)"
#define SYSLOG_USB_STORAGE_UNMOUNT "O armazenamento USB foi desativado.(USB%d)"
#define SYSLOG_USB_STORAGE_REMOVED "O armazenamento USB foi desconectado.(USB%d)"
 
#define SYSLOG_NAS_SERVICE_STARTED      "%s iniciou."
#define SYSLOG_NAS_SERVICE_STOPPED "%s parado."
 
#define SYSLOG_NAS_SERVICE_UNINSTALLED_STOPPED "%s não está instalado."
#define SYSLOG_NAS_SERVICE_UPGRADE_PLUGIN "%s - a nova versão foi detectada e atualizada."
 

#define SYSLOG_USB_FIND_THERING_DEVICE  "Foi conectado um dispositivo USB de rede."
#define SYSLOG_USB_DISCONNECT_THERING_DEVICE  "O dispositivo USB de rede foi desconectado."
 
#define SYSLOG_MSG_AUTOREBOOT "Reiniciar Router mediante a função de [Auto Reinicio Periódico]"

#define SYSLOG_NAS_SERVICE_FOLDER_NOT_FOUND_STOPPED "The configured Folder is not found. %s service is stopped."

#define SYSLOG_MSG_PRINTER_RECOGNIZED "USB Printer is recognized."

#define SYSLOG_EMAIL_SUBJECT "RelatÃ³rio (Log de Sistema)"
#define SYSLOG_LOG_HISTORY "HistÃ³rico"
#define SYSLOG_LOG_TIME  "Intervalo"
#define SYSLOG_LOG_CONTENT  "ConteÃºdo do log de sistema"

