


/************** LOG ******************************/
#define SYSLOG_MSG_RESTART			"Система перезагружена ( Версия: %s)"
#define SYSLOG_MSG_ADMIN_RESTART		"Администратор использовал команду перезагрузки"
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"Администратор обновил систему" 
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"Администратор изменил Имя пользователя или пароль"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"Администратор изменил IP адрес LAN(Внутренний)"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"Администратор включил DHCP сервер"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"Администратор выключил DHCP сервер"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"Администратор изменил настройки WAN"

#ifndef USE_WIFI_EXTENDER
#define SYSLOG_MSG_DHCPC_RCV_IP			"WAN подключено как DHCP клиент" 
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"Нет ответа от DHCP сервера в WAN"
#else
#define SYSLOG_MSG_DHCPC_RCV_IP                 "Получение IP адреса с DHCP сервера"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT         "Нет ответа от DHCP Сервера"
#endif

#define SYSLOG_MSG_PPP_CONNECTED		"WAN подключено через PPPoE"
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"Неправильное Имя или пароль PPPoE"
#define SYSLOG_MSG_PPP_DISCONNECTED		"PPPoE отключено" 
#define SYSLOG_MSG_PPP_NO_REPONSE		"Нет ответа от PPPoE сервера WAN"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"DHCP-сервер предоставляет IP"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"Администратор изменил настройки порта"

#define SYSLOG_MSG_DDNS_SUCCESS			"Регистрация DDNS успешно пройдена"
#define SYSLOG_MSG_DDNS_FAILED			"Регистрация DDNS не пройдена"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "Отчет по E-mail :Не найден SMTP сервер"
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "Сстемный журнал по E-mail успешно отправлен" 
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          "Журнал обнавружения сети по E-mail успешно отправлен" 
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"Не пройдена SMTP аутентификация"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "Не задан e-mail Администратора"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "Не найден почтовый сервер"
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "Не удается подключится к почтовому серверу"


#define SYSLOG_STATIC_IP                         "Статичный IP"
#define SYSLOG_DYN_IP                            "DHCP"
#define SYSLOG_PPPOE                             "PPPoE"
#define SYSLOG_PPTP                	         "PPTP IP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "Настройки успешно восстановлены - Имя файла :"
#define SYSLOG_CONFIG_RESTORE_FAILED		 "Настройки не восстановлены - Имя файла :"
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "Настройки не восстановлены - Нет Имя файла"


#define SYSLOG_PPTP_CONNECTED			 "PPTP VPN подключено - Аккаунт : %s / %s"
#define SYSLOG_PPTP_DISCONNECTED		 "PPTP VPN отключено - Аккаунт : "

#define SYSLOG_MSG_UPNP_START 	"Администратор включил UPNP(Система перезагружается)" 
#define SYSLOG_MSG_UPNP_STOP 	"Администратор выключил UPNP"
#define SYSLOG_MSG_SAVECONF 	"Все настройки сохранены"

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "Администратор отключил Интернет"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "Администратор переподключился к Интернет"

#define SYSLOG_MSG_FAKEDNS_START 	"Администратор включил 'Страница настройки автоматического соединения'"
#define SYSLOG_MSG_FAKEDNS_STOP 	"Администратор выключил'Страница настройки автоматического соединения'"
#define SYSLOG_EMAIL_SEND_TIMEOUT       "SMTP клиент:Время ожидания закончилось"

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 отключено, и переадресовано на WAN2"
#define SYSLOG_MSG_WAN1_OK	"WAN1 подключено"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 отключено, и переадресовано на WAN1"
#define SYSLOG_MSG_WAN2_OK	"WAN2 подключено"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "Основной WAN изменен"

#define SYSLOG_MSG_CHANGE_WAN_REBOOT "Администратор изменил настройки wan порта"

#define SYSLOG_MSG_NAT_ON	"Администратор включил NAT" 
#define SYSLOG_MSG_NAT_OFF	"Администратор выключил NAT" 

#define SYSLOG_MSG_DHCPC_LEASE "лизинг времени ожидания WAN IP: Интернет отключен" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "Сервер DHCP был приостановлен, потому что другой сервер DHCP был обнаружен в локальной сети"
#define SYSLOG_MSG_DHCP_SERVER_RESUME "Работа Сервера DHCP была возобновлена"

#define SYSLOG_MSG_KAID_RESTARTED "KAI движок перезагружен"

#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI ошибка скачивания(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI ошибка аутентификации(1)"


#define SYSLOG_IP_CONFLICT "Конфликт IP"
#define SYSLOG_RECEIVE_PRIVATE_IP "Частный IP для подключения к Интернету запрещен"
#define SYSLOG_RECEIVE_INTERNAL_IP "Ошибка подключения к Интернету:Диапазон WAN IP такой же как во внутренней сети."

#define SYSLOG_MSG_MAKE_SCHED_1 "Интернет не доступен сейчас."
#define SYSLOG_MSG_MAKE_SCHED_2 "Если вы хотите использовтаь Интернет, обратитесь к Администратору."

#define SYSLOG_MSG_IPCONFLICT  "Конфликт IP:"
#define LOGIN_LOG_WRITE_TRUE "IP : %s Успешено"
#define LOGIN_LOG_WRITE_FAIL "IP : %s Ошибка входа"

#define SYSLOG_MSG_MASTER_AP_FOUND "Поиск мастера  AP успешен"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "Не найден мастер AP"
#define SYSLOG_MSG_NO_MASTER_BEACON "отключено с помощью мастера AP"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] мастер AP's изменил канал"

#define SYSLOG_MSG_WPS_OK	"WPS устройство успешно добавлено."
#define SYSLOG_MSG_WPS_FAIL	"Ошибка добавления WPS устройства. [Код ошибки:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "Изоляция приватного IP(%s) назначено из WAN"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "WAN IP такой же ка в LAN's."

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "адрес шлюза был изменен в процессе возобновления DHCP [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "IP-адрес был изменен в процессе возобновления DHCPs [ %s(%s) -> %s(%s) ]"

#define SMTP_MESSAGE_STRING "SMTP Сообщение"


#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "Продолжение подключение PPPoE по заданию PPPoE планировщика: %s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "Отключение PPPoE по заданию PPPoE планировщика: %s"

#define SYSLOG_SMART_QOS_NEW    "Smart QoS : %s добавлено"
#define SYSLOG_SMART_QOS_DEL    "Smart QoS : %s удалено"

#define SYSLOG_DDNS_SERVER_CONNECTED "Подключение к DDNS серверу успешно."

#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "DHCP клиент перезагружен  через WAN%d ."

#define SYSLOG_SAVE_FAILED "Нет больше пространства для конфигурации . Данные не могут быть сохранены." 


#define DCS_CHANNEL_CHANGED_MSG "Канал изменен с %d на %d С помощью Динамического поиска каналов."
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Планировщик беспроводной сети] %s продолжения соединения."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[Планировщик беспроводной сети] %s остановка соединения."
#endif


#ifdef USE_SYNC_AP_CONFIG
#define SYSLOG_WIFI_EXT_APPLY_MACAUTH  "Беспроводная настройка MAC аутентификации обновляется с подключенного AP."
#define SYSLOG_WIFI_EXT_APPLY_WIFISCHED  "Планировщик беспроводной сети обвновил настройки с подключенного AP."
#endif

#define SYSLOG_USB_STORAGE_DETECTED "Обнаружено USB устройство.(USB%d)"
#define SYSLOG_USB_STORAGE_MOUNT "USB устройство активно.(USB%d)"
#define SYSLOG_USB_STORAGE_UNMOUNT "USB устройство не активно.(USB%d)"
#define SYSLOG_USB_STORAGE_REMOVED "USB устройство отключено.(USB%d)"

#define SYSLOG_NAS_SERVICE_STARTED      "%s запущено." 
#define SYSLOG_NAS_SERVICE_STOPPED "%s остановлено."

#define SYSLOG_NAS_SERVICE_UNINSTALLED_STOPPED "%s не установлено."
#define SYSLOG_NAS_SERVICE_UPGRADE_PLUGIN "%s - обнавужена новая версия и обновлена."


#define SYSLOG_USB_FIND_THERING_DEVICE  "USB устройство в качестве модема подключено."
#define SYSLOG_USB_DISCONNECT_THERING_DEVICE  "USB устройство в качестве модема отключено."

#define SYSLOG_NAS_SERVICE_FOLDER_NOT_FOUND_STOPPED "Папка конфигурации не найдена. %s сервис остановлен."

#define SYSLOG_MSG_AUTOREBOOT "Перезапуск маршрутизатора с помощью функции [Автоматическая перезагрузка] "

#define SYSLOG_MSG_PRINTER_RECOGNIZED "USB принтер найден."

#define SYSLOG_MSG_DNS_APPLY "Админ (%s) установил DNS %s,%s."


