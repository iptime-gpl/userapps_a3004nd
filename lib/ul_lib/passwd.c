#include <linosconfig.h>

#ifdef L_check_password
/* 0 : ok , 1 : not ok */
int check_password(char *id, char *passwd)
{
	char s_id[64], s_passwd[64];


	if(!get_id_password(s_id,s_passwd))
		return 0;

	if(strcmp(id,s_id)) return 1; 

	if(!strcmp(s_passwd,"") && !strcmp(passwd,""))  
		return 0;

	//syslog_msg(1, "passwd -> <%s>, s_passwd -> <%s>", passwd, s_passwd);
#if	1
	if(!strcmp(passwd,s_passwd))
		return 0;
#else
	if(!strcmp(crypt(passwd,s_passwd), s_passwd ))
		return 0;

#endif
	return 1;
}
#endif

#ifdef L_get_id_password
int get_id_password(char *id, char *passwd) 
{
	
#if	1
	strcpy(id, "");
       	strcpy(passwd, "");
#ifdef USE_FTM
	if(is_factory_test_mode())
		return 0;
#endif


	iconfig_get_value_direct("login",id);
	iconfig_get_value_direct("password",passwd);
	if(!strcmp(id,"") && !strcmp(passwd,""))
		return 0;
	return 1;
#else
	char buffer[128], *ptr, *passptr;
       	FILE *fp; 

	strcpy(id, "");
       	strcpy(passwd, "");

	if ((fp = fopen(HTTPD_PASSWORD_FILE, "r")) != NULL) 
	{
		fgets(buffer, 64, fp);

		ptr = strchr(buffer,':');
		if(!ptr) 
		{
			fclose(fp);
			return 0; /* corrupt */
		}
		*ptr = 0;
		strcpy(id,buffer);
		ptr++;
		passptr = ptr;
		ptr = strchr(passptr,':');
		if(!ptr)
		{
			fclose(fp);
			return 0; /* corrupt */
		}
		*ptr = 0;
		strcpy(passwd,passptr);
		fclose(fp); 

		if(!strcmp(id,"") && !strcmp(passwd,""))
			return 0; 
		return 1;
	} 
	return 0;
#endif
}

int get_default_id_password(char *id, char *passwd) 
{
	strcpy(id, "");
       	strcpy(passwd, "");
	iconfig_get_default_value_direct("login",id);
	iconfig_get_default_value_direct("password",passwd);
	if(!strcmp(id,"") && !strcmp(passwd,""))
		return 0;
	return 1;
}

int check_default_pass(void)
{
	char id[64],passwd[64];	
	char default_id[64],default_passwd[64];	

	if(!get_id_password(id,passwd))
		return 0;
	get_default_id_password(default_id,default_passwd);
	if(!strcmp(id,default_id) && !strcmp(passwd,default_passwd))
		return 1;
	return 0;
}


int check_valid_account(void)
{
	char id[64],passwd[64];	
	char default_id[64],default_passwd[64];	

	if(!get_id_password(id,passwd))
		return 0;
	get_default_id_password(default_id,default_passwd);
	if(!strcmp(id,default_id) && !strcmp(passwd,default_passwd))
		return 0;
	return 1;
}

#endif

#ifdef L_exist_passwd
int exist_passwd(void)
{
	char id[128],pass[128];
	return get_id_password(id,pass);
}
#endif

