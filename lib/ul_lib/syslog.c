#include <linosconfig.h>

#ifdef L_syslog_msg
#include <stdarg.h>

int append_file_line( FILE *fp, char *file, int line)
{
	FILE *rfp;
	char buf[256];
	int i;

	if( (rfp=fopen( file, "r")) == NULL )
		return 0;

	for( i = 0 ; i < line; i++ ) 
	{
		if(fgets( buf, 256, rfp) == NULL)
			break;
		fprintf(fp, "%s", buf); 
	}
	fclose(rfp);

	return 0;
}

int syslog_get_hidden_log(void)
{
	char value[32];
	return get_file_string("/var/run/debuglog", value,32);
}


#define TEMP_LOG_FILE "/var/log/messages_temp"

#ifdef USE_LOG_TO_CATCH_HACKER
int syslog_msg2(int level, char *fmt, ...)
{
	FILE *fp;
	va_list args;
	time_t now;
	char cur_time[64];
	char syslog_file[128];
	int fd, last_id;

	strcpy(syslog_file,"/etc/syslog.hack");

	fd =lock_file(syslog_file);
	last_id = get_last_log_id(syslog_file);

	/* write temp file */
	if((fp = fopen( TEMP_LOG_FILE, "w+")) == NULL )
	{
		unlock_file(fd);
		return -1;
	}

	if(get_timed_status())
	{
		time(&now);
		conv_time(now, cur_time, 1);
	}
	else
		strcpy(cur_time, "*****" );
	fprintf(fp, "%d %d#%s#",level, last_id + 1, cur_time);

	va_start(args,fmt);
	vfprintf(fp, fmt, args);
	va_end(args);
	fprintf(fp, "\n");

	/* appened temp file */
	append_file_line(fp, syslog_file, (syslog_max_count()-1) );
	fclose(fp);

	/* cp temp file to org file */
	copy_file(TEMP_LOG_FILE , syslog_file );
	unlink(TEMP_LOG_FILE);

	unlock_file(fd);

	return 0;
}

void log_to_catch_hacker(char *post)
{
        char *remote_ip=getenv("REMOTE_ADDR");
        char *query;
        char local_ip[32],mask[32];

        get_ifconfig(IF_LOCAL,local_ip,mask);
        if(check_same_network(remote_ip,local_ip,mask))
                return;

        query=getenv("QUERY_STRING");
        syslog_msg2(1,"REMOTE IP:%s QUERY STRING:%s, POST DATA:%s", remote_ip,query?query:"none", post?post:"none");
}
#endif

#define LOG_ID_DEFAULT 1
int get_last_log_id(char* file_name)
{
        int logid = LOG_ID_DEFAULT;
        char buffer[256], *deli, *space_index;
        FILE *fp;

        if( (fp=fopen( file_name, "r")) == NULL )
                return logid;

        while(!feof(fp))
        {
                if(!fgets(buffer,256, fp))
			continue;
		deli = strchr(buffer, '#');
		if(!deli)
			continue;
		if( (space_index = strchr(buffer, ' ')) && space_index < deli )
			logid = atoi(space_index + 1);
		break;
        }
        fclose(fp);
	return logid;
}

#ifdef USE_MULTI_LANG
static int is_plain_text(char *message)
{
        int i;
        char a[] = {'@','{', '}'};
        for(i = 0; i < 3; ++i)
        {
                message = strchr(message, a[i]);
                if(!message)
                        return 1;
        }
        return 0;
}

static int is_alphabet(char ch)
{
        if((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122))
                return 1;
        return 0;
}

static int get_index_from_message(char *message)
{
        char *ptr;
        char _tmp[128];

        ptr = _tmp;
        strcpy(ptr, message);
        *strchr(ptr, '}') = 0;
        ptr = strchr(ptr, '{') + 1;
        return atoi(ptr);
}

static int get_arguments_length(char *text)
{
        int length = 0;

        if(!is_plain_text(text))
                text = get_ux_text_syslog(get_index_from_message(text));
        while(*text)
        {
                if(*text == '%' && is_alphabet(*(text + 1)))
                        ++length;
                ++text;
        }
        return length;
}

static char *get_arguments_address(char *text)
{
        while(text && *text)
        {
                if(*text == '%' && is_alphabet(*(text + 1)))
                        return text;
                ++text;
        }
        return NULL;
}

static void get_arg_type(char *text, char *type_array)
{
        int i, argc;
        if(!is_plain_text(text))
                text = get_ux_text_syslog(get_index_from_message(text));

        argc = get_arguments_length(text);
        for(i = 1; i <= argc; ++i)
        {
                text = get_arguments_address(text);
                if(text)
                {
                        type_array[i] = *(text + 1);
                        ++text;
                }
                else
                {
                        type_array[i] = 0;
                }
        }
}
#endif

int syslog_msg(int level, char *fmt, ...)
{
	FILE *fp;
	va_list args;
	time_t now;
	char cur_time[64];
	char syslog_file[128];
	int fd, last_id;
#ifdef USE_MULTI_LANG
        int arg_length, arg_idx;
        char type[16];
#endif

#ifdef USE_LOG_TO_CATCH_HACKER
	syslog_msg2(level,fmt);
#endif
	syslog_get_filename(syslog_file);

	if(!syslog_get_status()) return 0;

	if((level == SYSMSG_LOG_HIDDEN) && !syslog_get_hidden_log()) 
		return 0;
	fd =lock_file(syslog_file);

	last_id = get_last_log_id(syslog_file);

	/* write temp file */
	if((fp = fopen( TEMP_LOG_FILE, "w+")) == NULL )
	{
		unlock_file(fd);
		return -1;
	}

	if(get_timed_status())
	{
		time(&now);
		conv_time(now, cur_time, 1);
	}
	else
		strcpy(cur_time, "*****" );
	fprintf(fp, "%d %d#%s#", level, last_id + 1, cur_time);

	va_start(args,fmt);
#ifndef USE_MULTI_LANG
	vfprintf(fp, fmt, args);
#else
	if(is_plain_text(fmt))
		vfprintf(fp, fmt, args);
	else
	{
		fprintf(fp, "%s", fmt);
		memset(type, 0x0, sizeof(char) * 16);
		get_arg_type(fmt, type);
		arg_length = get_arguments_length(fmt);
		arg_idx = 0;
		while(++arg_idx <= arg_length)
		{
			switch(type[arg_idx])
			{
				case 'd' :
					fprintf(fp, "++%d", va_arg(args, int));
				break;
				case 'f' :
					fprintf(fp, "++%f", va_arg(args, double));
				break;
				case 's' :
					fprintf(fp, "++%s", va_arg(args, char*));
				break;
				default:
				break;
			}
		}
	}
#endif
	va_end(args);
	fprintf(fp, "\n");

	/* appened temp file */
	append_file_line(fp, syslog_file, (syslog_max_count()-1) );
	fclose(fp);

	/* cp temp file to org file */
	copy_file(TEMP_LOG_FILE , syslog_file );
	unlink(TEMP_LOG_FILE);

	unlock_file(fd);

	return 0;
}
#endif

#ifdef L_syslog_read_syslog_msg
void malloc_syslog_msg_structure(syslog_msg_input *input, syslog_msg_data *data, int id)
{
	char logfile[64];

	memset(input, 0x0, sizeof(syslog_msg_input));
	memset(data, 0x0, sizeof(syslog_msg_data));

	input->buffer_length = sizeof(char) * 256;
	input->buffer = (char*)malloc(input->buffer_length);

	syslog_get_filename(logfile);
	input->fp = fopen(logfile, "r");
	input->id = id;

        data->message_length = sizeof(char) * 256;
        data->message = (char*)malloc(data->message_length);
}

void free_syslog_msg_structure(syslog_msg_input *input, syslog_msg_data *data)
{
	if(input->fp)
		fclose(input->fp);
	free(input->buffer);
	free(data->message);
}

int syslog_read_syslog_msg(syslog_msg_input *input, syslog_msg_data *result)
{
        int _level, _logid = 1;
        char *_timestamp, *_message, *deli, *id_index;

	if(!input->fp)
		return 0;

        while(fgets(input->buffer, 256, input->fp))
        {
                deli = strchr(input->buffer, '#');
                if(!deli)
                        continue;
                *deli = 0x0;
                if( (id_index = strchr(input->buffer, ' ')) && id_index < deli )
                {
                        *id_index = 0x0;
                        _logid = atoi(id_index + 1);
                }
                else
                {
                        _logid = 1;
                }

                _level = atoi(input->buffer);
                _timestamp = deli + 1;
                deli = strchr(_timestamp, '#');
                if(!deli)
                        continue;

                *deli = 0x0;
                _message = deli+1;
                *(_message + strlen(_message) - 1) = 0x0;

                if(_logid <= input->id)
                        break;
                result->level = _level;
                result->logid = _logid;
                result->timestamp = _timestamp;
		if(strlen(_message) > result->message_length)
		{
			if(result->message)
				free(result->message);
			result->message_length = strlen(_message) + 1;
			result->message = (char*)malloc(sizeof(char) * (result->message_length + 1));
		}
		strcpy(result->message, _message);
		memset(result->args, 0x0, sizeof(char*) * SYSLOG_MAX_ARGS_SUPPORT);

                return 1;
        }

        return 0;
}
#endif

#ifdef L_syslog_get_filename
#ifndef USE_ETC_SYSLOG 
#define SYSTEM_LOG_FILE "/var/log/messages"
#else
#define SYSTEM_LOG_FILE "/etc/messages"
#endif
int syslog_get_filename(char *name)
{
        strcpy(name, SYSTEM_LOG_FILE);
        return 0;
}
#endif

#ifdef L_syslog_get_status
int syslog_get_status(void)
{
	int value;

	if((value=iconfig_get_intvalue_direct("syslog")) == -1)
		return 1; /* default is on */
	return value;
}
#endif

#ifdef L_syslog_max_count
int syslog_max_count(void)
{
	return hwinfo_get_max_syslog();
}
#endif

#ifdef L_syslog_get_flag
int syslog_get_flag(char *name )
{
	int status;
	char tag[64];

	snprintf(tag,64,"syslog_flag_%s", name );
	status = istatus_get_intvalue_direct(tag);
	if(status == -1) status = 0;
	return status;
}
#endif

#ifdef L_syslog_set_flag
int syslog_set_flag(char *name , int flag)
{
	char tag[64];
	snprintf(tag,64,"syslog_flag_%s", name );
	if(flag != -1)
		istatus_set_intvalue_direct(tag, flag);
	else
		istatus_remove_status_tag(tag);
	return 0;
}
#endif

#ifdef L_syslog_get_email_status
int syslog_get_email_status( int *email_flag, int *hour, int *del_log ) 
{
	char buffer[128];
	
	if(iconfig_get_value_direct("syslog_email.set",buffer)==-1)
	{
		*email_flag = 0;
		*hour = 0;
		*del_log = 0;
		return 0;
	}
	sscanf(buffer,"%d %d %d",email_flag,hour,del_log);
	return *email_flag;
}
#endif


#ifdef L_syslog_save
int syslog_save(void)
{
	FILE *fp, *wfp;
	int buf, n;
	struct stat statz;
	char syslog_file[128];

	syslog_get_filename(syslog_file);

	copy_file(syslog_file, "/etc/messages");
	unlink("/etc/messages.gz");
	unlink("/save/etc/messages.gz");
	system("gzip /etc/messages");
	unlink("/etc/messages");
	unlink("/save/etc/messages");
	return 0;
}
#endif
