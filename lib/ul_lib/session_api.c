#include <linosconfig.h>

#define SESSION_STATUS_FILE "/var/run/session.status"
int session_set_value(char *tag, char *value)
{
	int fd;
	genconfig_ll_t gen_ll;

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

	fd = lock_file(SESSION_STATUS_FILE);

	genconfig_read_file(SESSION_STATUS_FILE, &gen_ll);
	genconfig_set_value(&gen_ll, tag, value );
	genconfig_write_file(SESSION_STATUS_FILE, &gen_ll);
 	genconfig_free_ll(&gen_ll);

	unlock_file(fd);

	return 0;
}

int iconfig_set_intvalue_direct(char *tag, int value)
{
	char str_value[32];

	snprintf(str_value,32,"%d",value);
	iconfig_set_value_direct(tag,str_value);

	return 0;
}

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
 		genconfig_free_ll(&gen_ll);

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
	}

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}


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


int iconfig_get_intvalue_direct(char *tag)
{
	char value[32];
	if(iconfig_get_value_direct(tag,value) == -1)
		return -1;
	return atoi(value);
}

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

int iconfig_is_changed(char *tag)
{
	char def_value[512], value[512];

	iconfig_get_default_value_direct(tag,def_value);
	iconfig_get_value_direct(tag,value);
	if(strcmp(value,def_value))
		return 1;
	return 0;
}

int iconfig_remove_config_tag(char *tag)
{
	return genconfig_remove_item(INTEGRATED_CONFIG_FILE, tag);
}

int istatus_set_intvalue_direct(char *tag,int value)
{
	char str_value[32];

	snprintf(str_value,32,"%d",value);
	istatus_set_value_direct(tag,str_value);
	return 0;
}

int istatus_get_intvalue_direct(char *tag)
{
	char value[32];
	if(istatus_get_value_direct(tag,value) == -1)
		return -1;
	return atoi(value);
}

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

int istatus_remove_status_tag(char *tag)
{
	return genconfig_remove_item(INTEGRATED_STATUS_FILE, tag);
}

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

int iconfig_remove_index_tag(char *tag, int idx)
{
	return genconfig_remove_index_item(INTEGRATED_CONFIG_FILE, idx,tag);
}

int iconfig_remove_index_alltag(char *tag)
{
	return genconfig_remove_index_allitem(INTEGRATED_CONFIG_FILE,tag);
}

