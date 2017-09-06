/************** LOG ******************************/
#define SYSLOG_MSG_RESTART			"システム再起動 ( Version: %s )"
#define SYSLOG_MSG_ADMIN_RESTART		"管理者がシステムを再起動する"
#define SYSLOG_MSG_FIRMWARE_UPGRADE		"管理者がファームウェアーをアップデートする"
#define SYSLOG_MSG_ADMIN_CHANGE_PASS		"管理者がログインパスワードを変更する"
#define SYSLOG_MSG_ADMIN_CHANGE_INTERNAL_IP	"管理者が内部 IPを変更する"
#define SYSLOG_MSG_ADMIN_RUN_DHCPD		"管理者が DHCP サーバーを実行する"
#define SYSLOG_MSG_ADMIN_STOP_DHCPD		"管理者が DHCP サーバーを中止する"
#define SYSLOG_MSG_ADMIN_CHANGE_WANCONF		"管理者がインターネット設定を変更する"

#ifndef USE_JUST_AP
#define SYSLOG_MSG_DHCPC_RCV_IP			"DHCP Client(WAN)が IPを受信"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT		"DHCP Server(WAN)応答なし"
#else
#define SYSLOG_MSG_DHCPC_RCV_IP                 "DHCP Clientが IPを受信"
#define SYSLOG_MSG_DHCPC_SERVER_TIMEOUT         "DHCP Server 応答なし"
#endif

#define SYSLOG_MSG_PPP_CONNECTED		"PPPが接続されて IPを受信"
#define SYSLOG_MSG_INVALID_PPP_ACCOUNT		"PPPアカウント及びパスワードが正しくない"
#define SYSLOG_MSG_PPP_DISCONNECTED		"PPP接続が切断"
#define SYSLOG_MSG_PPP_NO_REPONSE		"PPPoE サーバーの応答がない"

#define SYSLOG_MSG_DHCPD_OFFER_IP		"DHCP サーバーが IP 割当する"
#define SYSLOG_MSG_ADMIN_CHANGE_PORTLINK	"管理者がリンク設定を変更"

#define SYSLOG_MSG_DDNS_SUCCESS			"DDNS 登録成功"
#define SYSLOG_MSG_DDNS_FAILED			"DDNS 登録失敗"

#define SYSLOG_MSG_EMAIL_REPORT_UNKNOWN_SMTP_SERVER "SMTP サーバを見つからなくて E-mail送信失敗" 
#define SYSLOG_MSG_EMAIL_SYSLOG_SUCCESS          "SYSLOG 関連報告書を管理者 E-mail に送信"
#define SYSLOG_MSG_EMAIL_ND_SUCCESS          	"NETDETECT 関連報告書を管理者 E-mail に送信"
#define SYSLOG_MSG_EMAIL_AUTH_FAILED		"SMTP アカウント認証失敗 - 認証方法:"

#define SYSLOG_INVALID_ADMIN_EMAIL_CONFIG       "管理者 E-mail 設定が間違っている"
#define SYSLOG_MSG_MAIL_UNKNOWN_MAIL_SERVER     "メールサーバーを見つからなくてメール送信失敗"
#define SYSLOG_MSG_MAIL_CONNECT_ERROR           "メールサーバーに接続できなくてメール送信失敗"

#define SYSLOG_STATIC_IP                         "固定 IP"
#define SYSLOG_DYN_IP                            "動的 IP"
#define SYSLOG_PPPOE                             "PPPoE 方式"
#define SYSLOG_PPTP                	         "PPTP IP"

#define SYSLOG_CONFIG_RESTORE_SUCCESS		 "設定復元成功 - ファイル名 : "
#define SYSLOG_CONFIG_RESTORE_FAILED		 "設定ファイルが正しくなくて設定復元失敗 - ファイル名 : "
#define SYSLOG_CONFIG_RESTORE_FAILED_NOFILE	 "設定復元失敗 - ファイル名 : 入力されてない"

#define SYSLOG_PPTP_CONNECTED			 "PPTP VPN 接続成功 - アカウント :  %s / %s" 
#define SYSLOG_PPTP_DISCONNECTED		 "PPTP VPN 接続切断 - アカウント : " 


#define SYSLOG_MSG_UPNP_START 	"管理者が UPNPをスタートする(システム再起動)"
#define SYSLOG_MSG_UPNP_STOP 	"管理者が UPNPを中止する"
#define SYSLOG_MSG_SAVECONF 	"全ての設定が保存される "

#define SYSLOG_MSG_ADMIN_INTERNET_DISCONN "管理者がインターネットを解除する"
#define SYSLOG_MSG_ADMIN_INTERNET_CONN "管理者がインターネットを接続する"

#define SYSLOG_MSG_FAKEDNS_START 	"管理者が '設定画面に自動接続' 機能を設定する"
#define SYSLOG_MSG_FAKEDNS_STOP 	"管理者が '設定画面に自動接続' 機能を解除する"

#define SYSLOG_EMAIL_SEND_TIMEOUT       "管理者 E-mail を送信失敗(接続時間超過) "

#define SYSLOG_MSG_WAN1_FAIL	"WAN1 インターネット接続切断。 WAN2にバックアップ"
#define SYSLOG_MSG_WAN1_OK	"WAN1 インターネット接続復元"
#define SYSLOG_MSG_WAN2_FAIL	"WAN2 インターネット接続切断。 WAN1にバックアップ"
#define SYSLOG_MSG_WAN2_OK	"WAN2 インターネット接続復元"

#define SYSLOG_MSG_CHANGED_PRIMARY_WAN "基本分散経路を変更する"
#define SYSLOG_MSG_CHANGE_WAN_REBOOT "管理者が無線 WAN 設定を変更する"

#define SYSLOG_MSG_NAT_ON	"管理者が NAT機能をONにする"
#define SYSLOG_MSG_NAT_OFF	"管理者が NAT機能をOFFにする"

#define SYSLOG_MSG_DHCPC_LEASE "外部 IP レンタル時間超過: インターネット接続切断" 

#define SYSLOG_MSG_DHCP_SERVER_SUSPENDED "内部ネットワークから他の DHCP サーバーが検索されてルータの DHCPサーバー機能を中断する。"
#define SYSLOG_MSG_DHCP_SERVER_RESUME "内部ネットワークから DHCPサーバーが見つからなかったため、ルータの DHCPサーバー機能を再実行する。"


#define SYSLOG_MSG_KAID_DOWNLOAD_ERROR "PSP-KAI download error(1)"
#define SYSLOG_MSG_KAID_AUTH_ERROR "PSP-KAI auth error(1)"
#define SYSLOG_MSG_KAID_RESTARTED "KAI エンジンを再起動します。"

#define SYSLOG_IP_CONFLICT "IPにトラブルを感知されました"
#define SYSLOG_RECEIVE_PRIVATE_IP "私設 IP 遮断機能によって私設 IPが外部 IPに設定されない"
#define SYSLOG_RECEIVE_INTERNAL_IP "内部 IP と同一な外部IPが割当されてインターネット接続不可"

#define SYSLOG_MSG_MAKE_SCHED_1 "インターネットをしようするためにはルータ管理者にお問合わせ下さい。"
#define SYSLOG_MSG_MAKE_SCHED_2 "今はインターネットを使用できない時間です。"

#define SYSLOG_MSG_IPCONFLICT  "IP トラブル感知 :" 

#define LOGIN_LOG_WRITE_TRUE "IP : %s LOGIN 成功"
#define LOGIN_LOG_WRITE_FAIL "IP : %s LOGIN 失敗"

#define SYSLOG_MSG_MASTER_AP_FOUND "マスター AP 検索成功"
#define SYSLOG_MSG_MASTER_AP_NOT_FOUND "マスター AP 検索失敗"
#define SYSLOG_MSG_NO_MASTER_BEACON "マスター APでの WDS接続が切れる"
#define SYSLOG_MSG_MASTER_AP_CHANNEL_CHANGED "[WDS] マスター APのチャンネルが変更されました。"


#define SYSLOG_MSG_WPS_OK	"WPS 無線装置に接続成功"
#define SYSLOG_MSG_WPS_FAIL	"WPS 無線装置に接続失敗 [Error Code:%d]"

#define SYSLOG_PRIVATE_IP_ASSIGN "WAN ポートに私設IP(%s) 割当試行"
#define SYSLOG_SAME_SUBNET_IP_ASSIGN "WAN ポートに内部ネットワークと同じ帯域の IP(%s) 割当試行"

#define SYSLOG_CHANGE_DHCP_GATEWAY_ADDR "DHCP更新時ゲートウェイアドレス変更 [ %s -> %s ]"
#define SYSLOG_CHANGE_DHCP_IP_CONFIG "DHCP 更新時 IPアドレス変更 [ %s(%s) -> %s(%s) ]"

#define SMTP_MESSAGE_STRING "SMTP Message"


#define SYSLOG_PPPOE_SCHED_RESUME_MESSAGE "PPPoE スケジューラによって接続が復旧される: %s"
#define SYSLOG_PPPOE_SCHED_STOP_MESSAGE "PPPoE スケジューラによって接続が中止される: %s"

#define SYSLOG_SMART_QOS_NEW	"Smart QoS : %s 追加"
#define SYSLOG_SMART_QOS_DEL	"Smart QoS : %s 削除"

#define SYSLOG_DDNS_SERVER_CONNECTED "DDNS サーバーに接続する" 
#define SYSLOG_DHCP_RESTART_BY_WAN_LINK_OFF "WAN%d ポートの物理的リンクが再接続されて DHCP機能を再起動する。"


#define SYSLOG_SAVE_FAILED "保存スペースが足りなくてこれ以上の設定を保存できません。"


#define DCS_CHANNEL_CHANGED_MSG "Channel is changed from %d to %d by Dynamic Channel Searching."
#ifdef USE_WIFI_SCHEDULER
#define SYSLOG_WIFI_SCHED_START_WIFI "[Wireless Scheduler] %s wireless is resumed."
#define SYSLOG_WIFI_SCHED_STOP_WIFI "[[Wireless Scheduler] %s wireless is stopped."
#endif


#ifdef USE_SYNC_AP_CONFIG
#define SYSLOG_WIFI_EXT_APPLY_MACAUTH  "Wireless MAC Authentication Configuration is updated from connected AP."
#define SYSLOG_WIFI_EXT_APPLY_WIFISCHED  "Wireless Scheduler Configuration is updated from connected AP."
#endif

#define SYSLOG_EMAIL_SUBJECT "SYSLOG Report"
#define SYSLOG_LOG_HISTORY "ã<82>·ã<82>¹ã<83><86>ã<83> ã<83>­ã<82>°å±¥æ­´"
#define SYSLOG_LOG_TIME  "ç<99>ºç<94><9f>æ<99><82>é<96><93>"
#define SYSLOG_LOG_CONTENT  "ã<83>­ã<82>°å<86><85>å®¹"

