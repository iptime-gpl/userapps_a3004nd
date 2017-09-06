#include <linosconfig.h>

#ifdef L_iconfig_set_value_direct
int iconfig_set_value_direct(char *tag, char *value)
{
	int fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);
	genconfig_set_value(&gen_ll, tag, value );
	genconfig_write_file(INTEGRATED_CONFIG_FILE, &gen_ll);
 	genconfig_free_ll(&gen_ll);

	unlock_file(fd);

	return 0;
}
#endif

#ifdef L_iconfig_set_intvalue_direct
int iconfig_set_intvalue_direct(char *tag, int value)
{
	char str_value[32];

	sprintf(str_value,"%d",value);
	iconfig_set_value_direct(tag,str_value);

	return 0;
}
#endif

#ifdef L_iconfig_get_value_direct
int iconfig_get_value_direct(char *tag, char *value)
{
	int ret=0;
	genconfig_ll_t gen_ll;
	int fd;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);
	if(!genconfig_get_value( &gen_ll, tag, value ))
	{
		unlock_file(fd);
 		genconfig_free_ll(&gen_ll);
		return -1;

#if	0
	       	gen_ll.head = NULL;
       		gen_ll.tail = NULL;
		genconfig_read_file(INTEGRATED_DEFAULT_FILE, &gen_ll);
		if(!genconfig_get_value( &gen_ll, tag, value ))
		{
			strcpy(value,"");
			unlock_file(fd);

 			genconfig_free_ll(&gen_ll);
			return -1;
		}
#endif
	}

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif


#ifdef L_iconfig_get_default_value_direct
int iconfig_get_default_value_direct(char *tag, char *value)
{
	int ret = 0;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;
	genconfig_read_file(INTEGRATED_DEFAULT_FILE, &gen_ll);
	if(!genconfig_get_value( &gen_ll, tag, value ))
		ret = -1;
 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif




#ifdef L_iconfig_get_intvalue_direct
int iconfig_get_intvalue_direct(char *tag)
{
	char value[32];
	if(iconfig_get_value_direct(tag,value) == -1)
		return -1;
	return atoi(value);
}
#endif

#ifdef L_iconfig_make_default
int iconfig_make_default(char *tag)
{
	int ret=0, fd;
	genconfig_ll_t gen_ll;
	genconfig_item_t *citem, *pitem, *nitem;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);

        for(citem=gen_ll.head; citem; citem=citem->next)
                if(!strcmp(citem->tag, tag)) 
			break;
	if(!citem)
	{
 		genconfig_free_ll(&gen_ll);
		unlock_file(fd);
		return 0;
	}
	ret = 1;

	pitem = citem->prev;
	nitem = citem->next;
	if(pitem) pitem->next = citem->next;
	else gen_ll.head = citem->next;

	if(nitem) nitem->prev = citem->prev;
	else gen_ll.tail = citem->prev;

	genconfig_free_item(citem);

	genconfig_write_file(INTEGRATED_CONFIG_FILE, &gen_ll);

	unlock_file(fd);
 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif

#ifdef L_iconfig_is_changed
int iconfig_is_changed(char *tag)
{
	char def_value[512], value[512];

	iconfig_get_default_value_direct(tag,def_value);
	iconfig_get_value_direct(tag,value);
	if(strcmp(value,def_value))
		return 1;
	return 0;
}
#endif

#ifdef L_iconfig_remove_config_tag
int iconfig_remove_config_tag(char *tag)
{
	return genconfig_remove_item(INTEGRATED_CONFIG_FILE, tag);
}
#endif

#ifdef L_iconfig_remove_tag_prefix
int iconfig_remove_tag_prefix(char *tag_prefix)
{
        int ret=0, fd;
        genconfig_ll_t gen_ll;
        genconfig_item_t *citem, *pitem, *nitem;

        gen_ll.head = NULL;
        gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_CONFIG_FILE);

        genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);

        for(citem=gen_ll.head; citem; )
	{
                if(!strncmp(citem->tag, tag_prefix,strlen(tag_prefix)))
		{
                        pitem = citem->prev;
                        nitem = citem->next;
                        if(pitem) pitem->next = citem->next;
                        else gen_ll.head = citem->next;
  
                        if(nitem) nitem->prev = citem->prev;
                        else gen_ll.tail = citem->prev;

        		genconfig_free_item(citem);
			citem = nitem;
		}
		else
			citem=citem->next;
	}

        genconfig_write_file(INTEGRATED_CONFIG_FILE, &gen_ll);

	unlock_file(fd);

        genconfig_free_ll(&gen_ll);

        return ret;
}
#endif

#ifdef L_istatus_set_intvalue_direct
int istatus_set_intvalue_direct(char *tag,int value)
{
	char str_value[32];

	sprintf(str_value,"%d",value);
	istatus_set_value_direct(tag,str_value);
	return 0;
}
#endif

#ifdef L_istatus_get_intvalue_direct
int istatus_get_intvalue_direct(char *tag)
{
	char value[32];
	if(istatus_get_value_direct(tag,value) == -1)
		return -1;
	return atoi(value);
}
#endif

#ifdef L_istatus_set_value_direct
int istatus_set_value_direct(char *tag, char *value)
{
	genconfig_ll_t gen_ll;
	int fd;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_STATUS_FILE);

	genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);
	genconfig_set_value(&gen_ll, tag, value );
	genconfig_write_file(INTEGRATED_STATUS_FILE, &gen_ll);

        unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return 0;
}
#endif

#ifdef L_istatus_get_value_direct
int istatus_get_value_direct(char *tag, char *value)
{
	int ret=0,fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_STATUS_FILE);

	genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);
	if(!genconfig_get_value( &gen_ll, tag, value ))
	{
		strcpy(value,"");
		ret = -1;
	}

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif

#ifdef L_istatus_remove_status_tag
int istatus_remove_status_tag(char *tag)
{
	return genconfig_remove_item(INTEGRATED_STATUS_FILE, tag);
}
#endif

#ifdef L_istatus_remove_tag_prefix
int istatus_remove_tag_prefix(char *tag_prefix)
{
        int ret=0, fd;
        genconfig_ll_t gen_ll;
        genconfig_item_t *citem, *pitem, *nitem;

        gen_ll.head = NULL;
        gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_STATUS_FILE);

        genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);

        for(citem=gen_ll.head; citem; )
	{
                if(!strncmp(citem->tag, tag_prefix,strlen(tag_prefix)))
		{
                        pitem = citem->prev;
                        nitem = citem->next;
                        if(pitem) pitem->next = citem->next;
                        else gen_ll.head = citem->next;
  
                        if(nitem) nitem->prev = citem->prev;
                        else gen_ll.tail = citem->prev;

        		genconfig_free_item(citem);
			citem = nitem;
		}
		else
			citem=citem->next;
	}

        genconfig_write_file(INTEGRATED_STATUS_FILE, &gen_ll);

	unlock_file(fd);

        genconfig_free_ll(&gen_ll);

        return ret;
}
#endif



#ifdef L_pid_db_set_value
int pid_db_set_value(char *tag, int value )
{
	int fd;
	char strval[64];
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_PID_FILE);

	genconfig_read_file(INTEGRATED_PID_FILE, &gen_ll);
	sprintf(strval,"%d", value);
	genconfig_set_value(&gen_ll, tag, strval);
	genconfig_write_file(INTEGRATED_PID_FILE, &gen_ll);

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);


	return 0;
}
#endif

#ifdef L_pid_db_get_value
int pid_db_get_value(char *tag )
{
	int ret,fd;
	char value[64];
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

        fd = lock_file(INTEGRATED_PID_FILE);

	genconfig_read_file(INTEGRATED_PID_FILE, &gen_ll);
	if(!genconfig_get_value( &gen_ll, tag, value ))
	{
		strcpy(value,"");
		ret = -1;
	}
	else
		ret = atoi(value);

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif

#ifdef L_pid_db_remove_value
int pid_db_remove_value(char *tag)
{
	return genconfig_remove_item(INTEGRATED_PID_FILE, tag);
}
#endif


#ifdef L_hwinfo_get_intvalue_direct
int hwinfo_get_intvalue_direct(char *tag)
{
	char value[32];
	if(hwinfo_get_value_direct(tag,value) == -1)
		return -1;
	return atoi(value);
}
#endif

#ifdef L_hwinfo_get_hexvalue_direct
int hwinfo_get_hexvalue_direct(char *tag)
{
	unsigned int val;
	char value[32];
	if(hwinfo_get_value_direct(tag,value) == -1)
		return -1;
	sscanf(value, "0x%X", &val);
	return val;
}
#endif


#ifdef L_hwinfo_get_value_direct
int hwinfo_get_value_direct(char *tag, char *value)
{
	int ret=0;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	genconfig_read_file(HARDWAREINFO_FILENAME, &gen_ll);
	if(!genconfig_get_value( &gen_ll, tag, value ))
	{
		strcpy(value,"");
		ret = -1;
	}
 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif


#ifdef L_iconfig_get_index_info_direct
/* idx : from 0 */
int iconfig_get_index_info_direct(char *tag, int idx, genconfig_item_t *info)
{
	int ret=0, i,fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);
	if(!genconfig_get_index_info( &gen_ll,tag,idx, info))
		ret = -1;

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);
	return ret;
}
#endif

#ifdef L_iconfig_get_index_value_direct
/* idx : from 0 */
int iconfig_get_index_value_direct(char *tag, int idx, char *value)
{
	int ret=0, i,fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);
	if(!genconfig_get_index_value( &gen_ll,tag,idx, value ))
		ret = -1;

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);
	return ret;
}
#endif


#ifdef L_iconfig_set_index_value_direct
/* idx : from 0 */
int iconfig_set_index_value_direct(char *tag, int idx, char *value)
{
	int fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_CONFIG_FILE);

	genconfig_read_file(INTEGRATED_CONFIG_FILE, &gen_ll);
	genconfig_set_index_value(&gen_ll, tag, idx, value );
	genconfig_write_file(INTEGRATED_CONFIG_FILE, &gen_ll);

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);
	return 0;
}
#endif

#ifdef L_iconfig_remove_index_tag
/* idx : from 0 */
int iconfig_remove_index_tag(char *tag, int idx)
{
	return genconfig_remove_index_item(INTEGRATED_CONFIG_FILE, idx,tag);
}
#endif

#ifdef L_iconfig_remove_index_alltag
int iconfig_remove_index_alltag(char *tag)
{
	return genconfig_remove_index_allitem(INTEGRATED_CONFIG_FILE,tag);
}
#endif




#ifdef L_istatus_get_index_info_direct
/* idx : from 0 */
int istatus_get_index_info_direct(char *tag, int idx, genconfig_item_t *info)
{
	int ret=0, i, fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_STATUS_FILE);

	genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);
	if(!genconfig_get_index_info( &gen_ll, tag, idx, info))
		ret = -1;

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif

#ifdef L_istatus_get_index_value_direct
/* idx : from 0 */
int istatus_get_index_value_direct(char *tag, int idx, char *value)
{
	int ret=0, i, fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_STATUS_FILE);

	genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);
	if(!genconfig_get_index_value( &gen_ll,tag,idx, value ))
		ret = -1;

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif


#ifdef L_istatus_set_index_value_direct
/* idx : from 0 */
int istatus_set_index_value_direct(char *tag, int idx, char *value)
{
	int fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(INTEGRATED_STATUS_FILE);

	genconfig_read_file(INTEGRATED_STATUS_FILE, &gen_ll);
	genconfig_set_index_value(&gen_ll, tag, idx, value );
	genconfig_write_file(INTEGRATED_STATUS_FILE, &gen_ll);

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);
	return 0;
}
#endif

#ifdef L_istatus_remove_index_tag
/* idx : from 0 */
int istatus_remove_index_tag(char *tag, int idx)
{
	return genconfig_remove_index_item(INTEGRATED_STATUS_FILE, idx,tag);
}
#endif

#ifdef L_istatus_remove_index_alltag
int istatus_remove_index_alltag(char *tag)
{
	return genconfig_remove_index_allitem(INTEGRATED_STATUS_FILE,tag);
}
#endif










