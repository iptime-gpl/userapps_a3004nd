<script>

var TAB_CODE=9
var DEL_CODE=46 
var BS_CODE=8
var SP_CODE=32
var DOT_CODE=190
var DOT2_CODE=110

var IDX_ON=0
var IDX_OFF=1

var IDX_AP_MODE=0
var IDX_CBRIDGE_MODE=1
var IDX_WWAN_MODE=2
var IDX_KAI_MODE=3
var IDX_MBRIDGE_MODE=4


var WIRELESS_AP_MODE=0;
var WIRELESS_CBRIDGE_MODE=1;
var WIRELESS_CWAN_MODE=2;
var WIRELESS_KAI_MODE=3;
var WIRELESS_MBRIDGE_MODE=4;

var KAID_MODE_INIT=0  // ap mode
var KAID_MODE_PSP=0 // psp kai
var KAID_MODE_NORMAL=0 // xbox kai

var AUTH_OPEN=1
var AUTH_KEY=2
var AUTH_AUTO=3
var AUTH_WPA=4
var AUTH_WPAPSK=5
var AUTH_OPEN8021X=6
var AUTH_WPANONE=7
var AUTH_WPA2=8
var AUTH_WPA2PSK=9
var AUTH_WPAPSKWPA2PSK=10
var AUTH_NOCHANGE=100

var IDX_NOENC=0
var IDX_WEP64=1
var IDX_WEP128=2
var IDX_TKIP=3
var IDX_AES=4
var IDX_TKIPAES=5

var ENCRYPT_OFF=0
var ENCRYPT_64=1
var ENCRYPT_128=2
var ENCRYPT_TKIP=3
var ENCRYPT_AES=4
var ENCRYPT_TKIPAES=5

var KEY_STRING=0;
var KEY_HEX=1;

var IDX_KEY_STRING=0;
var IDX_KEY_HEX=1;

var REGION_USA=1;
var REGION_JAPAN=2;

var DMZTWINIP_MODE_DMZ=1;
var DMZTWINIP_MODE_TWINIP=2;

var QOS_SHARING_BOUNDED=2;
var QOS_SHARING_BORROW=3;


var MSG_RESTART_CONFIRM_DEFAULT='Система будет сброшена на заводские настройки.\nВы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_UPNP='Система изменит UPNP настройки.\nВы уверены что хотите продолжить? ';
var MSG_RESTART_CONFIRM_REBOOT='Система будет перезагружена.\nВы уверены что хотите продолжить?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP='Система будет перезагружена для изменения LAN IP адресов.\nВы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP='Система будет перезагружена для изменения LAN IP адресов.\nВы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_RESTORE='Система будет перезагружена для  восстановления настроекn\n Вы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_NAT='Система будет перезагружена для  изменения настроек NAT.\nВы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_WIRELESS='Система будет перезагружена для применения режима Беспроводной сети.\nВы уверены что хотите продолжить ?';
var MSG_KAID_MODE_CHANGE_WARNING='Система будет перезагружена для  применения KAI режима.\nВы уверены что хотите продолжить ?';
var MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE='Система будет перезагружена для изменения режима Беспроводной сети.\nВы уверены что хотите продолжить?';
var MSG_RESTART_CONFIRM_WIRELESS_WWAN='Система будет перезагружена для  режима Беспроводной сети.\nВы уверены что хотите продолжить?';
var MSG_TWINIP_CONFIRM_WARNING='Система будет перезагружена для  применения настроек Twin IP .\nВы уверены что хотите продолжить? ';
var MSG_WAN_FOR_LAN_WARNING='Система будет перезагружена для изменения функций  WAN порта\nПродолжить?';



// common
var MODIFY_OP='Изменить'
var MSG_INVALID_HWADDR="Неправильный MAC адрес." 
var MSG_DELETE_RULE_CONFIRM="Роль будет удалена.\nПродолжить?" 
var MSG_SELECT_RULE_TO_DEL="Выбрать роль для удаления."
var MSG_ALL_STOP_RULE="Вы хотите отключить все роли?"

var MSG_OPENER_PAGE_MOVED="Страница переместилась."
var MSG_INVALID_VALUE="Неверное значение."



// wireless_config_wizard
var MSG_INVALID_WEP_KEY_HEXVALUE2="Сетевой ключ должен быть шестнадцатеричным числом."
var MSG_INVALID_WPAPSK_KEY_MISMATCH="Сетевой ключ отличается.\nНужен одинаковый ключ."


// sysconf_configmgmt
var MSG_RESTOREFILE_BLANK="Выберите файл настроек."

//natrouterconf
var MSG_RULE_NAME_IS_BLANK="Имя роли не заполнено."
var MSG_NO_DEL_ROUTING_TABLE="Таблица маршрутизации удалена!"


// wirelessconf_wdssetup
var MSG_WDS_DEL_WARNING="Вы уверены что хотите удалить WDS?" 
var MSG_APADD_REQUEST_APPLY="Если нажмете кнопку 'Добавить', настройки WDS будут сохранены."
var MSG_NO_DEL_WDS="Выберите WDS для удаления!"


// wirelessconf_basicsetup
var MSG_BLANK_SSID="Выберите SSID."
var MSG_INVALID_WEP_KEY_LENGTH="Неверная длинна ключа."
var MSG_INVALID_WEP_KEY_HEXVALUE="Ключ должен быть в шеснадцатиричной кодировке."
var MSG_INVALID_WPAPSK_KEY_LENGTH="Ключ сети должен быть больше 8 символов."
var MSG_INVALID_5_KEY_LENGTH="ключ сети должен быть 5 символов."
var MSG_INVALID_13_KEY_LENGTH="Ключ сети должен быть 13 символов."
var SAVE_CONFIGURATION_STRING="Сохранить все настройки?"

var MSG_BLANK_REQUEST_SSID="Выберите SSID, и нажмите кнопку 'Применить' ."
var MSG_INVALID_REQUEST_KEY="Введите ключ сети и нажмите кнопку 'Применить'."
var MSG_INVALID_REQUEST_APPLY="Нажмите кнопку 'Применить' для подключения к точке доступа AP."
var MSG_APPLY_REQUEST_KEY="Нажмите кнопку 'Применить' для выбора канала"
var MSG_BEST_CHANNEL_PRE="Лучший канал " 
var MSG_BEST_CHANNEL_POST="канал"
var MSG_KEY_LENGTH_DESC="Длинна ключа = "

// config_wizard
var MSG_BLANK_ACCOUNT="Введите Имя ID."
var MSG_BLANK_PASSWORD="Введите пароль."

var MSG_INVALID_IP="Неправильно указан IP адрес."
var MSG_INVALID_NETMASK="Неправильно указана маска сети."
var MSG_INVALID_GATEWAY="Неправильно указан основной шлюз."
var MSG_INVALID_FDNS="Неправильно указан основной DNS"
var MSG_INVALID_SDNS="Неправильно указан вторичный DNS"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_NETWORK="Адрес в локальной сети такой же как во внешнем соединении."
var STATIC_LEASE_ALREADY_EXIST_IPADDRESS="Этот IP адрес был уже добавлен."
var STATIC_LEASE_ALREADY_EXIST_HWADDRESS="Этот MAC адрес был уже добавлен."

var NETCONF_INTERNAL_TOO_SMALL_LEASETIME="Время аренды должно быть более 10 секунд."
var NETCONF_INTERNAL_TOO_BIG_LEASETIME="Время аренды должно быть до 2147483647 секунд."
var NETCONF_INTERNAL_INVALID_LEASETIME="Время аренды должен быть числовым."


var MSG_ERROR_NETWORK_LANIP="LAN IP адрес не может быть такой же как адресе сети"
var MSG_ERROR_BROAD_LANIP="LAN IP адрес не может быть такой же как Local Broadcast Address"


//netconf_wansetup
var NETCONF_INTERNET_DHCP_MTU_INVALID="MTU не может быть больше 1500."
var NETCONF_INTERNET_PPP_MTU_INVALID="MTU не может быть больше 1492."
var NETCONF_INTERNET_KEEP_ALIVE_MSG="Неверное максимальное время ожидания."
var NETCONF_INTERNET_GW_INVALID_NETWORK="Основной шлюз такой же как в другой сети."
var NETCONF_WANSETUP_CONFIRM_WANINFO="Вы хотите подтвердить информацию о WAN соединении?"


//netconf_lansetup
var NETCONF_INTERNAL_INVALID_DHCP_S_ADDR="Неправильный начальный адрес диапазона DHCP"
var NETCONF_INTERNAL_INVALID_DHCP_E_ADDR="Неправильный конечный адрес диапазона DHCP"
var NETCONF_INTERNAL_INVALID_DHCP_ADDR="Неправильный диапазон DHCP"
var NETCONF_INTERNAL_DELETE_IP="Вы хотите удалить зарезервированный IP адрес?"

// wirelessconf_advanced
var DESC_INVALID_TX_POWER="Tx питание должно быть от 1 до 100.";
var DESC_INVALID_RTS_THRESHOLD="RTS порог должен быть от 1 до 2347.";
var DESC_INVALID_FRAG_THRESHOLD="Порог фрагментации должен быть от 256 до 2346.";
var DESC_INVALID_BEACON_INTERVAL="Beacon период должен быть от 50 до 1024.";

// expertconf_kai
var KAID_MODE_CHANGE_WARNING="Перезагрузка системы. Продолжить ?"
var KAID_MUST_SELECT_OBT_SERVER="По крайней мере, один сервер должен быть выбран."
var KAID_RESTART_KAI_UI="Перезагрузите KAI UI."

//natrouterconf_portforward
var MAX_PORT_FORWARD=60
var NATCONF_PORTFORWARD_NO_MORE_RULE="Нет портов для переадресации."
var NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS="Неправильный исходный IP адрес."
var NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK="Внешний порт не заполнен"
var NATCONF_PORTFORWARD_INVALID_EXT_PORT="Неправильный конечный IP адрес."
var NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE="Неверный диапазон внешних портов."
var NATCONF_PORTFORWARD_INVALID_INT_PORT="Неправильный внутренний порт."
var NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE="Неверный диапазон внешних портов"
var NATCONF_PORTFORWARD_RUN_RULE="Вы хотите применить роль?"


//natrouterconf_misc
var NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT="Нельзя добавлять больше FTP портов."
var NATCONF_INTAPPS_FTP_PORT_EMPTY="Номер порта пуст."
var NATCONF_INTAPPS_FTP_PORT_INVALID= "Неправильный номер порта."

//natrouterconf_router
var NETCONF_ROUTE_ENTRY_DELETE="Вы хотите удалить таблицу маршрутизации?"
var NETCONF_ROUTE_ENTRY_SELECT="Выбранная таблица маршрутизации удалена."

//natrouterconf_twinzipdmz
var NATCONF_TWINIPDMZ_UPDATE_TIME="IP Время обновления должна быть больше, чем 60 секунд."
var NATCONF_TWINIPDMZ_WARNING="Этот ПК использует IP Twin. Если IP-номер не используется, конфигурация IP этого компьютера должна быть настроена.\nПродолжить ?"


//firewallconf_firewall
var USER_FWSCHED_TYPE=1
var APP_FWSCHED_TYPE=2
var URL_FWSCHED_TYPE=4
var MAX_FWSCHED_COUNT=200 
var FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK="Неверное время блокировки."
var FIREWALLCONF_FIREWALL_DATE_WARNING="Выберите дату блокировки."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP="Неверный исходный IP адрес."
var FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW="Неверный исходный  MAC адрес."
var FIREWALLCONF_FIREWALL_INVALID_DEST_IP="Неверное место назначения IP адреса."
var FIREWALLCONF_FIREWALL_INVALID_DEST_PORT="Неверный порт назначения."
var FIREWALLCONF_FIREWALL_RUN_RULE="Вы хотите применить роль?"
var FIREWALLCONF_FIREWALL_NO_MORE_RULE="Нельзя добавлять больше аккаунтов."
var FIREWALLCONF_FIREWALL_INVALID_PRIORITY="Неверный приоритет."

//firewallconf_netdetect
var NETCONF_NETDETECT_WARNING1="Минимальное количество соединений 10."
var NETCONF_NETDETECT_WARNING2="0 ~ 23 диапазон значений"


//firewallconf_internet
var FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING="Номер компьютера должен быть от 1 до 253."
var FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE="Вы хотите очистить настройки для всех компьютеров?"

//expertconf_ddns
var EXPERTCONF_DDNS_HOSTNAME_IS_BLANK = "Имя хоста пустое."
var EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG = "Имя хоста должно заканчиваться на iptime.org."
var EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1 ="Нет больше хостов ipTIME DDNS."
var EXPERTCONF_IPTIMEDDNS_INVALID_USERID= "Только адрес E-mail доступен."
var EXPERTCONF_DYNDNS_NOMORE_WANRING1="Нет больше хостов Dyndns."
var INVALID_EMAIL_ADDRESS_STR="Неправильный E-mail адрес."
var EXPERTCONF_IPTIMEDDNS_INVALID_HOSTNAME = "'_' or '.' не могут быть использованы в имени хоста"

//expertconf_remotepc
var EXPERTCONF_WOL_PC_NAME_IS_BLANK="Имя ПК пустое."
var EXPERTCONF_WOL_DEL_PC="Вы хотите удалить ПК?"
var EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC ="Вы хотите, чтобы разбудить этот компьютер?"

//expertconf_hostscan
var ICMP_PING=0
var ARP_PING=1
var PING_SCAN=0
var TCP_PORT_SCAN=1
var SYSINFO_HOST_INVALID_TIMEOUT =   "Значение Time out пустое."
var SYSINFO_HOST_TIMERANGE   =       "Значение Time out должно быть больше 1 сек."
var SYSINFO_HOST_INVALID_DATASIZE =  "Значение Размера данных пустое."
var SYSINFO_HOST_DATARANGE    =      "Значение Диапазона данных должно быть от 0 до 65,000."
var SYSINFO_HOST_INVALID_START  =    "Значение Начального порта пустое"
var SYSINFO_HOST_PORTRANGE      =    "Значение диапазона портов должно быть от 0 до 65,535."

//trafficconf_conninfo
var TRAFFICCONF_CONNINFO_DELETE_CONN="Вы хотите удалить соединение с назначенным IP-адресом?"

//trafficconf_switch
var SELECT_VLAN_PORT_WARNING ="Выберите VLAN порт."
var SELECT_VLAN_PORT_TRUNK_WARNING ="Все порты  TRUNK(%s) должны быть в VLAN."
var SELECT_TRUNK_PORT_WARNING ="Выберите TRUNK порт."
var SELECT_TRUNK_PORT_VLAN_WARNING ="Все порты TRUNK должны быть в VLAN(%s) или другой VLAN."
var MAX_MEMBER_TRUNK_WARNING="Максимальное количество портов %d."
var ALREADY_OTHER_GROUP_MEMBER="Порты не могут быть включены в несколько групп."


//trafficconf_loadshare
var NATCONF_PORTFORWARD_NO_MORE_RULE="Нельзя больше добавлять Порты переадресации."
var NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK="Имя Роли пустое."
var NATCONF_INTSERVER_INVALID_EXT_PORT="Неправильный порт."
var NATCONF_LOADSHARE_KEEP_WRR="Вы можете деактивировать Auto Line Backup пока WRR LS активно." 
var NATCONF_LOADSHARE_ON_LINE_BACKUP="Auto Line Backup активно. Продолжить?"
var NATCONF_LOADSHARE_DELETE_RULE="Вы хотите удалить Роль?"
var NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL="Выберите роль."
//sysconf_syslog
var SYSCONF_SYSLOG_WANRING = "Неправильное значение час."
var SYSCONF_SYSLOG_EMAIL_CONFIRM= "Отправить системный лог на e-mail администратора."
var SYSCONF_SYSLOG_CLEAR_CONFIRM= "Все системные журналы очищены."

//sysconf_login
var SYSCONF_LOGIN_INVALID_NEW_PASS=     "Пароли не совпадают."
var SYSCONF_LOGIN_INVALID_NEW_ID  =     "Неправильный ввод Имени пользователя: возможно использовать только буквы алфавита и цифры."
var SYSCONF_LOGIN_RELOGIN         =     "Войдите повторно в систему после изменения пароля."

//expertconf_pptpvpn
var EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK="VPN аккаунт пуст"
var EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK="VPN пароль пуст"
var EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID="IP адрес пуст"
var EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE="Вы хотите удалить аккаунт?"

//accesslist

var ACCESSLIST_NOIPLISTMSG_1="Не настроен IP адрес. Вы хотите добавить адрес ПК"
var ACCESSLIST_NOIPLISTMSG_2=") подключить?"
var ACCESSLIST_WRONG_INPUT_IP="Неправильный  IP адрес."
var ACCESSLIST_WRITE_EXPLAIN="Значение описание пустое."
var ACCESSLIST_DEL_WANT="Вы хотите удалить значения поля?"

//reboot
var REBOOT_CHANGEIP_RETRY_LOGIN="Переподключитесь, локальный IP был изменен."
var REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS="Перезагрузите страницу настроек."
var SYSCONF_RESTORE_RETRY_CONNET="Перезагрузите страницу восстановления настроек."

//trafficconf_qos
var QOS_BASIC_WARNING="Все настройки QoS будут перезагружены. Продолжить процесс?"
var QOS_COMMON_EXCCED_MAX_CLASS="Превышено максимальное число классов."
var QOS_COMMON_EXCCED_MAX_SPEED="Превышено максимальное число Диапазона скорости интернет."
var QOS_COMMON_ISOLATED_EXCEED="Общая сумма пропускной способности классов, не может быть больше Диапазона скорости интернет"
var QOS_COMMON_NO_CHANGE_DIRECTION="Невозможно изменить направление класса."
var QOS_COMMON_ONLY_DIGIT="Доступно только цифровое значение."
var QOS_COMMON_BASIC_SETUP_FIRST="Первоначальные настройки QoS."
var QOS_PROTOCOL_SELECT="Выберите тип протокола."
var QOS_PORT_PORTRANGE="Диапазон портов должен быть от 1 до 65,535"
var QOS_PORT_INVALID_EXT_PORT_RANGE="Неверное значение диапазона внешних портов."
var QOS_BADNWIDTH_EMPTY="Поле Ширины полосы пустое."
var QOS_RATE_RANGE="Rate range : 32 Kbps ~ 50 Mbps"
var QOS_BPI_RANGE="Неправильный диапазон IP адресов для BPI. (Доступные значения: 2 ~ 31)"


// wirelessconf_multibssid
var MSG_DEL_MBSSID_WARNING="Беспроводная сеть будет удалена. Продолжить ?"
var MSG_MBSSID_QOS_WARNING="Минимальное значение 100 Kbps."


//trafficconf_connctrl
var MSG_CONNECTION_MAX_WARNING="Продолжить"
var MSG_CONNECTION_MAX_TOO_SMALL="Слишком маленькое значение максимального количества соединений. Установите больше 512."
var MSG_UDP_CONNECTION_MAX_TOO_BIG="Максимальное значение UDP соединений должно быть между 10 и максимальным количеством соединений."
var MSG_ICMP_CONNECTION_MAX_TOO_BIG="Максимальное значение ICMP соединений должно быть меньше максимального количества соединений."
var MSG_INVALID_RATE_PER_MAX="Недопустимая скорость соединения на 1 ПК."

//sysconf_misc
var MSG_WBM_POPUP="Переподключитесь."


// trafficconf_switch
var MSG_SAME_PORT_MIRROR="Тот же порт не может быть зеркальным."

var MSG_HUBMODE_WARNING="!!! Внимание !!\nВ режиме Hub, все NAT функции маршрутизации будет остановлены и веб-страница настройки будет не доступна.\n\n\
Продолжить? "
var MSG_HUBMODE_CONFIRM="Нажмите OK для продолжения."


// trafficconf_portqos
var MSG_PORTQOS_BOTH_ZERO=": Значение 0 Mbps не может быть применено ."
var MSG_PORTQOS_MAX_ERROR=": Значение больше 100 Mbps cне может быть применено."
var MSG_PORTQOS_INVALID_VALUE=": Неправильный диапазон (Значение должно быть "


//firewallconf_etc
var DESC_INVALID_ARP_PERIOD="Значение ARP пакетов/сек должно быть в диапазоне 1 ~ 100."

// wirelessconf_multibridge
var MSG_DEL_WWAN_WANRING="Беспроводной WAN порт(Интернет порт) будет отключен. Продолжить?"


// iframe_pppoe_sched
var MSG_INVALID_HOUR_VALUE="Значение часа должно быть в диапазоне 0 ~ 23."
var MSG_INVALID_MIN_VALUE="Значение минуты должно быть в диапазоне 0 ~ 59."
var MSG_PPPOE_SCHEDULE_SAME_RULE="Тот же график уже существует."

// trafficconf_lspolicy
var MSG_BACKUP_METHOD_AT_LEAST_ONE="Выберите по крайней мере один способ"
var MSG_BACKUP_METHOD_DOMAIN="Имя домена должно быть назначено"


var MSG_INVALID_PROTONUM="Неправильное число Proto"

var MSG_MBRIDGE_AUTO_CHANNEL_STRING="Функция [Автопоиск каналов] выполнит поиск точки доступа AP если точка доступа AP с более высоким значением изменится.\n\
.\n\
Продолжить?";

var TRAFFICCONF_ALL_OPTIONS_CLEAR =  "Все настройки будут очищены.\nПродолжить?"
var MSG_SELECT_DEL_MBSS = "Выберите беспроводную сеть для удаления."


var AUTO_STRING = "Авто"
var MBRIDGE_AUTO_CHANNEL_SEARCH = "Автопоиск каналов"

var UPPER_CHANNEL_TXT = "Низкий"
var LOWER_CHANNEL_TXT = "Верхний"

var LAN_GATEWAY_WARNING_MSG = "Когда нет подключения к Интернету, эта настройка будет доступна только при подключении к Интернету.\nПродолжить?";
var MSG_IPPOOL_MAX_WARNING = "Нельзя больше использовать условия IP-диапазона."

var MSG_DFS_WARNING="Этот канал для DFS.\nТочка доступа может быть активна только при хорошем уровне сигнала, скинируемая каждые 1 ~ 10 минут."


var SYSCONF_LOGIN_BLANK_ID =     "Имя пользователя пустое."
var SYSCONF_LOGIN_BLANK_PASS  = "Пароль пустой."
var SYSCONF_LOGIN_REMOVE_WARNING  = "Удаление Имя пользователя/Пароль. Продолжить?"
var SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT  = "Время сессии должно быть  1 ~ 60минут."



var SYSCONF_LOGIN_CANT_REMOVE_ID  = "Имя пользователя и пароль не может быть удалено, когда выбран метод сессий."
var SYSCONF_LOGIN_SHOULD_HAVE_IDPASS  = "Выбрана сессия, Имя пользователя и пароль должны быть установлены."
var SYSCONF_LOGIN_RELOGIN_SESSION  = "Перейти на страницу входа после настройки. Проддожить?"

var MSG_PPTPVPN_REBOOT = "Перезагрузиться для применения настроек PPTPVPN сервера?"
var MSG_QOS_REBOOT="Перезагрузиться для применения настроек QOS."
var MSG_IGMP_REBOOT = "Перезагрузиться для применения настроек IPTV(MOD)?"

var UNALLOWED_ID_MSG  = "Запрещенное Имя пользователя"


var DESC_INVALID_DCS_PERIOD="Значение диапазона должно быть  1 ~ 100."

var INVALID_HOUR_TEXT="Значение диапазона должно быть 0 ~ 23."
var INVALID_MIN_TEXT="Значение диапазона должно быть 0 ~ 59."
var SELECT_DAY_DESC="Проверять определенный день или каждый день."




var SNMP_INVALID_PORT= "Номер порта должен быть в диапазоне 1 - 65535."
var SNMP_COMMUNITY_ALERT= "поле Пользователи является обязательным."


var MSG_INVALID_RADIUS_SERVER="Неправильный адрес сервера RADIUS"
var MSG_INVALID_RADIUS_SECRET="Неправильный пароль RADIUS"
var MSG_INVALID_RADIUS_PORT="Неправильный порт сервера RADIUS"
var MSG_WEP_WARNING="Максимальная скорость 54Mbps(11g) когда используется WEP или TKIP.\nПродолжить?"
var MSG_WEP_SEC_WARNING="WEP очень слабая настройка шифрования.\nПродолжить?"
var MSG_WIRELESS_WAN_WARNING="Функция беспроводной глобальной сети уже используется другим беспроводным интерфейсом. Выключите функцию беспроводной WAN в другой беспроводной интерфейс."
var MSG_WDS_CHANNEL_WARNING="Канал несовместимый.\nНужно изменить канал после применения.\nПродолжить?"


var MSG_NEW_BSS="Новая беспроводная сеть"

var MSG_ADD_MAC_WARNING="Нет MAC адресов для добавления."
var MSG_REMOVE_MAC_WARNING="Нет MAC адресов для удаления."

var MSG_INVALID_AUTH_FOR_BRIDGE="Эта точка доступа не может быть использована в качестве моста."


var MSG_NEW_FOLDER_ERR="Заполните имя папки."
var MSG_SELECT_FOLDER_ERR="Выберите папку для восстановления"
var MSG_REMOVE_IPDISK_DDNS="Эта действие отключит ipDISK DDNS регистрацию.\nДальше вы сможете использовать это имя хоста.\nПродолжить?"

var MSG_NEED_REBOOT_FOR_WWAN="Система будет перезагружена. Продолжить?"


var MSG_ENABLE_ONE_SERVICE_ID="По крайней мере, один пользователь необходим для запуска."
var MSG_DUPLICATE_SERVICE_ID="Имя пользователя уже существует. Измените Имя пользователя."


var PASSWORD_NEEDED_TO_SET_THIS="Имя пользователя и пароля должны быть изменены для использования этой функции.\nУстановить Имя пользователя и пароля можно на странице [Система]->[Настройки администратора] ."


var CANT_SET_DEFAULT_ID_PASS="Это заводские Имя пользователя и пароль.\nИзмените."
var SYSCONF_LOGIN_NEED_CAPTCHA_CODE="Заполнить защитный код"
var MSG_SELECT_TORRENT_FOLDER_ERR="Выберите папку для скачивания"
var MSG_SELECT_MEDIA_FOLDER_ERR="Выберите папку Медиа"
var MSG_MEDIA_NAME_ERR="Заполните имя поля"

var MSG_SELECT_ITUNES_FOLDER_ERR="Выберите папку iTunes ."
var MSG_USB_MODE_WARNING="Для измения режима USB система будет перезагружена.\nПролоджить?"

var MSG_HWADDR_NO_INPUT=MSG_INVALID_HWADDR
var MSG_SELECT_MAC_REMOVED=NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL


var SYSCONF_ONLINE_UPGRADE_CONFIRM="Все функции роутера будут недоступны пока обновляется прошивка.\nПрожолжить?"

var FIRMUP_DONE_TXT="Прошивка успешно обновлена.\nНажмите'OK' для продолжения."


var DDNS_HOSTNAME_RULE_TXT="Неправильное Имя хоста DDNS"

var SYSCONF_LOGIN_CANT_REMOVE_WARNING="Заполните Имя пользователя и пароль"

var MSG_APACHE_INVALID_FS="Файловая система FAT32 or ExFAT\n, [Plug-in App] не может быть использовано.\nРекомендуем использовать NTFS or Ext2/3/4(Linux).\nПродолжить?"

// USE_SYSCONF_MISC2
var SYSCONF_HOSTNAME_WARNING="В имени маршрутизатор должна быть по крайней мере одна буква."
var SYSCONF_HOSTNAME_SPECIAL_WARNING="Имя маршрутизатора не может содержать специальные символы и пробелы."
var SYSCONF_LED_START_TIME_ALERT="Время начала не может быть позднее, чем время окончания."
var SYSCONF_APPLY_BUTTON_NAME="Перезагрузить"
var SYSCONF_APPLY_ORIGINAL_VALUE="Применить"
var SYSCONF_FAN_ALERT="Настройки диапазона температуры неверны."

// NASCONF
var MSG_NASCONF_SAME_AS_MGMT_PORT="Такой же порт используется как в Удаленной настройке маршрутизатора.\nДля начала измените порт настройки маршрутизатора."

// WIRELESSCONF
var MSG_5G_LOW_CHANNEL_WARNING="Выбрано Низкое питания канала Tx . Рекомендуем использовать [149-161]."
var MSG_5G_USA_CHANNEL="Регион [США] поддерживает высокое питание Tx power. Используйте другую страну."


var MSG_INVALID_FOLDER_STR="Неправильное Имя папки.";
var MSG_INVALID_FOLDER_NON_ASCII_STR="Возможно использовать только Ascii символы в Имени папки.";
var MSG_INVALID_FOLDER_2DOTS_STR=".. не может быть использован."
var MSG_INVALID_FOLDER_DOT_STR="Символ .  не может быть первым в Имени папки."
var MSG_CANT_BE_USED="не может быть использован."

var MSG_DYNAMIC_CHANNEL_WARNING="Если используется статичный канал,  Функция [Динамический поиск канала] будет недостуана\nПродолжить?"


var SYSCONF_INVALID_HOSTNAME="Неправильное Имя хоста"
var UNPERMITTED_STR_PREFIX="Запрещенные символы:"
var SYSCONF_INVALID_TEMPERATURE="Неверное значение температуры.(Температура <= 100)"

var SYSCONF_SET_URL_TAG="Для начала установите TAG."


var PLUGIN_INSTALL_BT_TXT="Установка"
var PLUGIN_UPDATE_BT_TXT="Обновление"
var PLUGIN_CANCEL_BT_TXT="Отменить"
var PLUGIN_REMOVE_BT_TXT="Удалить"

var MSG_TOO_LONG_SSID="Значение длинны SSID слишком длинное.\n.\nТекушая длинна поля SSID: "


</script>

