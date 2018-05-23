#include <linosconfig.h>


#ifdef L_get_file_value
/* type : 1 -> int 2 : hex */
int get_file_value(char *file, int type)
{
	FILE *fp;
	int value;

	if((fp=fopen(file,"r")) == NULL )
		return 0;

	if(type == 1)
		fscanf(fp, "%d", &value);
	else if(type == 2)
		fscanf(fp, "%x", &value);
	else
		value = 0;

	fclose(fp);
	return value;
}

/* type : 1 -> int 2 : hex */
int get_file_string(char *file, char *value, int max)
{
	FILE *fp;
	int len, n;

	strcpy(value,"");
	if((fp=fopen(file,"r")) == NULL )
		return 0;
	fgets( value, max, fp );
	fclose(fp);

	len = strlen(value);
	for (n = len; n >= 0; n--)
	{
		if (value[n] == '\n' || value[n] == '\r')
			value[n] = '\0';
	}

	return 1;
}
#endif

#ifdef L_conv_time
static int convert_month(char *month)
{
        if (!strcmp(month, "Jan")) return 1;
        if (!strcmp(month, "Feb")) return 2;
        if (!strcmp(month, "Mar")) return 3;
        if (!strcmp(month, "Apr")) return 4;
        if (!strcmp(month, "May")) return 5;
        if (!strcmp(month, "Jun")) return 6;
        if (!strcmp(month, "Jul")) return 7;
        if (!strcmp(month, "Aug")) return 8;
        if (!strcmp(month, "Sep")) return 9;
        if (!strcmp(month, "Oct")) return 10;
        if (!strcmp(month, "Nov")) return 11;
        if (!strcmp(month, "Dec")) return 12;
        return 1;
}

int conv_time(time_t ti, char *tstr , int flag) 
{
        int year, date, hour, min, second;
        char day[8], month[8];
	char buffer[128];
		
#ifdef USE_NEW_REALTIME
        char tz_str[32];

        get_timezone_abbr_from_config(tz_str);
        setenv("TZ", tz_str, 1);
#endif
	snprintf(buffer,128, "%s", ctime(&ti));
        sscanf(buffer,"%s %s %d %d:%d:%d %d\n", day, month, &date, &hour, &min, &second, &year);
        snprintf(buffer,128, "%04d/%02d/%02d %02d:%02d:%02d", year, convert_month(month), date, hour, min, second);
	strcpy(tstr, buffer);

	return 0;
}
#endif

#ifdef L_copy_file
int copy_file( char *f1, char *f2)
{
	FILE *rfp, *wfp;
	int buf, n;

	if( (rfp=fopen( f1, "r")) == NULL )
	{
		fprintf(stderr,"copy_file:%s not found\n", f1 );
		return -1;
	}

	if( (wfp=fopen( f2, "w+")) == NULL )
	{
		fprintf(stderr,"copy_file:%s not found\n", f2 );
		fclose(rfp);
		return -1;
	}

	while ((buf = fgetc(rfp)) != EOF)
	{
		fputc(buf, wfp);
	}

	fclose(rfp);
	fclose(wfp);
	return 1;
}
#endif

#ifdef L_write_file
int write_file(char *filename, char *string)
{
	FILE *fp;

	if((fp=fopen(filename, "w+")) == NULL )
		return -1;

	fprintf(fp, "%s", string );
	fclose(fp);

	return 0;
}
#endif

#ifdef L_write_file_intval
int write_file_intval(char *filename, int value)
{
	FILE *fp;

	if((fp=fopen(filename, "w+")) == NULL )
		return -1;

	fprintf(fp, "%d", value );
	fclose(fp);

	return 0;
}
#endif




#ifdef L_convert_mac
int convert_mac( char *hwaddr)
{
        int mac[6];
	int n;

	if(!strchr(hwaddr,':'))
		return 0;
        n = sscanf( hwaddr, "%02X:%02X:%02X:%02X:%02X:%02X",
                        &mac[0],
                        &mac[1],
                        &mac[2],
                        &mac[3],
                        &mac[4],
                        &mac[5] );
 	if(n != 6) printf("convert_mac:Invalid MAC: %d %s", n ,hwaddr);
 
        sprintf( hwaddr, "%02X-%02X-%02X-%02X-%02X-%02X",
                        mac[0],
                        mac[1],
                        mac[2],
                        mac[3],
                        mac[4],
                        mac[5] );
        return 0;
}

/* "001122334455" -> [00][11][22][33][44][55] */
int mac_rawstring_to_hexa(char *string, unsigned char *hexa)
{
    int i, j;
    char *sp = string, *bp;

    bp = (char *)hexa;

    for (i = 0, j = 0; i < strlen(string); i++, j++)
    {
        *sp = toupper(*sp);

        if ((*sp >= 'A') && (*sp <= 'F'))
            bp[j] = (int) (*sp - 'A') + 10;
        else if ((*sp >= 'a') && (*sp <= 'f'))
            bp[j] = (int) (*sp - 'a') + 10;
        else if ((*sp >= '0') && (*sp <= '9'))
            bp[j] = (int) (*sp - '0');
        else
        {
            return 0;
        }

        bp[j] <<= 4;
        i++;
        sp++;
        *sp = toupper(*sp);

        if ((*sp >= 'A') && (*sp <= 'F'))
            bp[j] |= (int) (*sp - 'A') + 10;
        else if ((*sp >= 'a') && (*sp <= 'f'))
            bp[j] |= (int) (*sp - 'a') + 10;
        else if ((*sp >= '0') && (*sp <= '9'))
            bp[j] |= (int) (*sp - '0');
        else
        {
            return 0;
        }

        sp++;
    }

    return 1;
}
#endif

#ifdef L_make_virtual_host_page
int make_virtual_host_page( char *ip )
{
	char tag[64],value[512],cmd[256];
	strcpy(tag,"prev_ip");
	if(istatus_get_value_direct(tag,value)!=-1)
	{
       		snprintf(cmd,256,"/home/httpd/%s", value);
		unlink(cmd);
	}
	istatus_set_value_direct(tag,ip);
        snprintf(cmd,256,"ln -s /home/httpd/192.168.0.1 /home/httpd/%s", ip );
        system(cmd);
        return 0;
}
#endif

#ifdef L_base64_encode
/*
 *  * Name: base64encode()
 *   *
 *    * Description: Encodes a buffer using BASE64.
 *     */
static const char basis_64[] =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

int Base64encode(char *encoded, const char *string, int len)
{
    int i;
    char *p;

    p = encoded;
    for (i = 0; i < len - 2; i += 3) {
    *p++ = basis_64[(string[i] >> 2) & 0x3F];
    *p++ = basis_64[((string[i] & 0x3) << 4) |
                    ((int) (string[i + 1] & 0xF0) >> 4)];
    *p++ = basis_64[((string[i + 1] & 0xF) << 2) |
                    ((int) (string[i + 2] & 0xC0) >> 6)];
    *p++ = basis_64[string[i + 2] & 0x3F];
    }
    if (i < len) {
    *p++ = basis_64[(string[i] >> 2) & 0x3F];
    if (i == (len - 1)) {
        *p++ = basis_64[((string[i] & 0x3) << 4)];
        *p++ = '=';
    }
    else {
        *p++ = basis_64[((string[i] & 0x3) << 4) |
                        ((int) (string[i + 1] & 0xF0) >> 4)];
        *p++ = basis_64[((string[i + 1] & 0xF) << 2)];
    }
    *p++ = '=';
    }

    *p++ = '\0';
    return p - encoded;
}

static const unsigned char pr2six[256] =
{
    /* ASCII table */
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 62, 64, 64, 64, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 64, 64, 64, 64, 64, 64,
    64,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 64, 64, 64, 64, 64,
    64, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64
};

int Base64decode(char *bufplain, unsigned int length, const char *bufcoded)
{
    int nbytesdecoded;
    register const unsigned char *bufin;
    register unsigned char *bufout;
    register int nprbytes;
    register unsigned int cnt;

    cnt = 0;
    bufin = (const unsigned char *) bufcoded;
    while (pr2six[*(bufin++)] <= 63);
    nprbytes = (bufin - (const unsigned char *) bufcoded) - 1;
    nbytesdecoded = ((nprbytes + 3) / 4) * 3;

    bufout = (unsigned char *) bufplain;
    bufin = (const unsigned char *) bufcoded;

    while (cnt + 3 < length && nprbytes > 4) {
    *(bufout++) =
        (unsigned char) (pr2six[*bufin] << 2 | pr2six[bufin[1]] >> 4);
    *(bufout++) =
        (unsigned char) (pr2six[bufin[1]] << 4 | pr2six[bufin[2]] >> 2);
    *(bufout++) =
        (unsigned char) (pr2six[bufin[2]] << 6 | pr2six[bufin[3]]);
    bufin += 4;
    nprbytes -= 4;
    cnt += 3;
    }

    if(cnt + 3 >= length && nprbytes > length - cnt)
        nprbytes = length - cnt;
    /* Note: (nprbytes == 1) would be an error, so just ingore that case */
    if (nprbytes > 1) {
    *(bufout++) =
        (unsigned char) (pr2six[*bufin] << 2 | pr2six[bufin[1]] >> 4);
    }
    if (nprbytes > 2) {
    *(bufout++) =
        (unsigned char) (pr2six[bufin[1]] << 4 | pr2six[bufin[2]] >> 2);
    }
    if (nprbytes > 3) {
    *(bufout++) =
        (unsigned char) (pr2six[bufin[2]] << 6 | pr2six[bufin[3]]);
    }

    *(bufout++) = '\0';
    nbytesdecoded -= (4 - nprbytes) & 3;
    return nbytesdecoded;
}

#endif

#ifdef L_email_clear_report
/* flag = 1 : success , flag = 0 : fail */
int email_clear_report( int flag, char *type )
{
	if(!type ) return -1;

#ifdef USE_SYSTEM_LOG
	if(!strcmp( type, "syslog"))
	{
		int syslog_eflag, syslog_hour, syslog_clear_flag;
		unlink("/var/run/syslog.html");

		if(flag)
		{
			syslog_get_email_status( &syslog_eflag, &syslog_hour, &syslog_clear_flag);
			if(syslog_clear_flag)
			{
				unlink("/var/log/messages");
				unlink("/var/log/syslog_cnt");
				syslog_save();
			}
		}
	}
#endif
	return 0;
}
#endif

#ifdef L_get_netmask_bit_count
int get_netmask_bit_count(char *netmask)
{
        unsigned int mask;
        unsigned int netbit=0x80000000, subnet=0;

        mask = inet_addr(netmask);
        while ((netbit >> subnet) & ntohl(mask)) subnet++;

        return subnet;
}
#endif


#ifdef L_itoa_with_comma
char* itoa_with_comma(unsigned long long value, int is_unsigned)
{
        int length = 0;
        unsigned long long j;
        char tmp[16];
	static char buffer[32];

        if(!is_unsigned && (signed long long)value < 0)
        {
                value = -(signed long long)value;
                strcpy(buffer, "-");
        }
        else
                strcpy(buffer, "");

        j = value;
        while((j /= 1000) > 0)
        ++length;

        while(length--)
        {
                j = 1;
                while(value / (j * 1000) > 0)
                        j *= 1000;
                if(strlen(buffer) > 0 && strcmp(buffer, "-"))
                        snprintf(tmp, 16, "%03llu,", value / j);
                else
                        snprintf(tmp, 16, "%llu,", value / j);
                strcat(buffer, tmp);
                value = value % j;
        }
        if(strlen(buffer) > 0 && strcmp(buffer, "-"))
                snprintf(tmp, 16, "%03llu", value % 1000);
        else
                snprintf(tmp, 16, "%llu", value % 1000);
        strcat(buffer, tmp);

	return buffer;
}
#endif
