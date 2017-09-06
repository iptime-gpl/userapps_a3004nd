#include <linosconfig.h>

#ifdef L_lock_file
int lock_file(char *lockfile)
{
        int fd;
        char filename[256];
        char *fname;

        fname=strrchr(lockfile,'/');
        if(fname)
        {
                fname++;
                snprintf(filename,256,"/var/run/%s.lock", fname);
        }
        else
                snprintf(filename,256,"/var/run/%s.lock", lockfile);

        fd = open(filename,O_RDWR|O_CREAT|O_NOCTTY);
        if(fd < 0)
        {
                fprintf(stderr,"lock file error");
                return -1;
        }
        flock(fd,LOCK_EX);
        return fd;
}
#endif

#ifdef L_unlock_file
int unlock_file(int fd)
{
        if(fd != -1)
        {
                flock(fd,LOCK_UN);
                close(fd);
        }
}
#endif

#ifdef L_unlock_filename
int unlock_filename(char *lockfile)
{
        int fd;
        char filename[256];
        char *fname;

        fname=strrchr(lockfile,'/');
        if(fname)
        {
                fname++;
                snprintf(filename,256,"/var/run/%s.lock", fname);
        }
        else
                snprintf(filename,256,"/var/run/%s.lock", lockfile);

        fd = open(filename,O_RDWR|O_CREAT|O_NOCTTY);
        if(fd < 0)
        {
                fprintf(stderr,"unlock file error");
                return -1;
        }
        flock(fd,LOCK_UN);
	close(fd);
        return 0;
}
#endif




#ifdef L_genconfig_free_item
int genconfig_free_item(genconfig_item_t *item)
{
	if(item->long_value)
		free(item->long_value);
	free(item);
	return 0;
}
#endif

#ifdef L_genconfig_read_file
int additem_ll(genconfig_ll_t *gen_ll, char *tag, char *value)
{
	char *pa;
	genconfig_item_t *citem;

	/* new added */
	citem = (genconfig_item_t *)malloc(sizeof(genconfig_item_t));
	memset(citem, 0x0, sizeof(genconfig_item_t));
	strcpy(citem->tag,tag);
	if(value)
	{
		if(strlen(value) > (GENCONFIG_MAX_VALUE_LEN-1))
		{
			citem->long_value=malloc(strlen(value)+1);
			strcpy(citem->long_value, value);
		}
		else
		{
			strcpy(citem->value,value);
			citem->long_value = NULL;
		}
	}
	else
	{
		strcpy(citem->value,"");
		citem->long_value = NULL;
	}

	if(!gen_ll->head)
		gen_ll->head = gen_ll->tail = citem;
	else
	{
		citem->prev = gen_ll->tail;
		citem->next = NULL;
		gen_ll->tail->next = citem;
		gen_ll->tail = citem;
	}
	return 1;
}

int genconfig_read_file(char *filename, genconfig_ll_t *gen_ll) 
{
	FILE *fp;
	char buffer[4096], *pa;
	int item_count = 0;
	char tag[GENCONFIG_MAX_ITEM_LEN], *value;

	if((fp=fopen(filename,"r")) == NULL)
	{
		gen_ll->head=NULL;
		gen_ll->tail=NULL;
		return -1;
	}

	while(fgets(buffer,4096,fp))
	{
		if(buffer[0]=='#') continue;
		if(pa=strtok(buffer, "=\n"))
		{
			strcpy(tag, pa);
			value=strtok(NULL, "\n");
			if(additem_ll(gen_ll,tag,value))
				item_count++;
		}
	}

	fclose(fp);


	return item_count;
}
#endif

#ifdef L_genconfig_write_file
int genconfig_write_file(char *filename, genconfig_ll_t *gen_ll)
{
	genconfig_item_t *citem;
	FILE *fp;

	if((fp=fopen(filename,"w+"))==NULL)
	{
		return -1;
	}

	for(citem=gen_ll->head; citem; citem=citem->next)
	{
		if(citem->long_value)
			fprintf(fp,"%s=%s\n", citem->tag, citem->long_value);
		else
			fprintf(fp,"%s=%s\n", citem->tag, citem->value);
	}

	fclose(fp);

	return 0;
}
#endif

#ifdef L_genconfig_free_ll
int genconfig_free_ll(genconfig_ll_t *gen_ll)
{
	genconfig_item_t *citem, *cnext;

	for(citem=gen_ll->head; citem; citem=cnext)
	{
		cnext = citem->next;
		genconfig_free_item(citem);
	}
	return 0;
}
#endif

#ifdef L_genconfig_set_value
int genconfig_set_value(genconfig_ll_t *gen_ll, char *tag, char *value)
{
	genconfig_item_t *citem;
	char *ptr;

	if(!value) return -1;

	if(ptr=strchr(value,0xd)) *ptr=0;	
	if(ptr=strchr(value,0xa)) *ptr=0;	


	for(citem=gen_ll->head; citem; citem=citem->next)
	{
		if(!strcmp(citem->tag, tag))
		{
			if(strlen(value)>(GENCONFIG_MAX_VALUE_LEN-1))
			{
				citem->long_value=malloc(strlen(value)+1);
				strcpy(citem->long_value, value);
			}
			else
			{
				strcpy(citem->value,value);
				if(citem->long_value)
				{
					free(citem->long_value);
					citem->long_value = NULL;
				}
			}
			return 1;
		}
	}

	/* new item */
	additem_ll(gen_ll, tag,value);

	return 0;
}
#endif

#ifdef L_genconfig_set_intvalue
int genconfig_set_intvalue(genconfig_ll_t *gen_ll, char *tag, int value)
{
	genconfig_item_t *citem;
	char buf[GENCONFIG_MAX_VALUE_LEN];

	for(citem=gen_ll->head; citem; citem=citem->next)
	{
		if(!strcmp(citem->tag, tag))
		{
			sprintf(citem->value,"%d", value );
			return 1;
		}
	}

	/* new item */
	snprintf(buf,GENCONFIG_MAX_VALUE_LEN, "%d", value);
	additem_ll(gen_ll, tag,buf);

	return 0;
}
#endif


#ifdef L_genconfig_get_value
int genconfig_get_value(genconfig_ll_t *gen_ll, char *tag, char *value)
{
	genconfig_item_t *citem;

	for(citem=gen_ll->head; citem; citem=citem->next)
	{
		if(!strcmp(citem->tag, tag))
		{
			if(citem->long_value)
				strcpy(value,citem->long_value);
			else
				strcpy(value,citem->value);
			return 1;
		}
	}

	strcpy(value,"");
	return 0;
}
#endif


#ifdef L_genconfig_get_pvalue
char *genconfig_get_pvalue(genconfig_ll_t *gen_ll, char *tag)
{
	genconfig_item_t *citem;

	for(citem=gen_ll->head; citem; citem=citem->next)
	{
		if(!strcmp(citem->tag, tag)) return citem->long_value?citem->long_value:citem->value;
	}

	return NULL;
}
#endif


#ifdef L_genconfig_set_value_direct
int genconfig_set_value_direct(char *filename, char *tag, char *value)
{
	int fd;
	genconfig_ll_t gen_ll;

        fd = lock_file(filename);

	gen_ll.head = NULL;
	gen_ll.tail = NULL;
	genconfig_read_file(filename, &gen_ll);
	genconfig_set_value( &gen_ll, tag, value );
	genconfig_write_file(filename, &gen_ll);

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return 0;
}
#endif

#ifdef L_genconfig_set_intvalue_direct
int genconfig_set_intvalue_direct(char *filename, char *tag, int value)
{
	char str_value[128];

	sprintf(str_value,"%d", value);
	genconfig_set_value_direct(filename,tag,str_value);
	return 0;
}
#endif


#ifdef L_genconfig_get_value_direct
int genconfig_get_value_direct(char *filename, char *tag, char *value)
{
	int ret=0, fd;
	genconfig_ll_t gen_ll;

        fd = lock_file(filename);

	gen_ll.head = NULL;
	gen_ll.tail = NULL;
	genconfig_read_file(filename, &gen_ll);
	ret = genconfig_get_value( &gen_ll, tag, value );

	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);
//	printf("tag => %s\n", tag );

	return ret;
}
#endif

#ifdef L_genconfig_get_intvalue_direct
int genconfig_get_intvalue_direct(char *filename, char *tag)
{
	char value[1024];
	int ret;

	ret = genconfig_get_value_direct(filename,tag,value);
	if(!strcmp(value,"") || (ret == -1))
		return -1;
	return atoi(value);
}
#endif

#ifdef L_genconfig_remove_item
int genconfig_remove_item(char *filename, char *tag)
{
	int ret=0, fd;
	genconfig_ll_t gen_ll;
	genconfig_item_t *citem, *pitem, *nitem;

        fd = lock_file(filename);

	gen_ll.head = NULL;
	gen_ll.tail = NULL;
	genconfig_read_file(filename, &gen_ll);

        for(citem=gen_ll.head; citem; citem=citem->next)
                if(!strcmp(citem->tag, tag)) 
			break;
	if(!citem)
	{
		unlock_file(fd);
 		genconfig_free_ll(&gen_ll);
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

	genconfig_write_file(filename, &gen_ll);
	unlock_file(fd);

 	genconfig_free_ll(&gen_ll);

	return ret;
}
#endif

#ifdef L_genconfig_get_index_info
int genconfig_get_index_info(genconfig_ll_t *gen_ll, char *itag, int idx, genconfig_item_t *info)
{
	int i = 0;
	char *ptr, tag[GENCONFIG_MAX_ITEM_LEN], ctag[GENCONFIG_MAX_ITEM_LEN];
	genconfig_item_t *citem;
	
	if(idx < 0)
		return 0;

	strcpy(tag,itag);
	if((ptr = strchr(tag, '+')))
		*ptr = 0;

	for(citem = gen_ll->head; citem; citem = citem->next)
	{
		strcpy(ctag,citem->tag);
		if((ptr = strchr(ctag,'+')))
			*ptr = 0;

		if(strcmp(ctag, tag))
			continue;

		if(i++ >= idx)
		{ 
			if(info)
			{
				*info = *citem;
				info->next= NULL;
				info->prev= NULL;
			}
			return 1;
		}
	}
	if(info)
		memset(info, 0x0, sizeof(genconfig_item_t));

	return 0;
}
#endif

#ifdef L_genconfig_get_index_value
int genconfig_get_index_value(genconfig_ll_t *gen_ll, char *itag, int idx, char *value)
{
	int i;
	char *ptr;
	genconfig_item_t *citem;
	char tag[GENCONFIG_MAX_ITEM_LEN], ctag[GENCONFIG_MAX_ITEM_LEN];
	
	strcpy(tag,itag);
	ptr = strchr(tag,'+');
	if(ptr) *ptr = 0;

	for(i=0,citem=gen_ll->head; citem; citem=citem->next)
	{
		strcpy(ctag,citem->tag);
		ptr = strchr(ctag,'+');
		if(ptr) *ptr = 0;

		if(!strcmp(ctag, tag))
		{
			if(i == idx)
			{ 
				if(value)
				{
					if(citem->long_value) strcpy(value,citem->long_value); 
					else strcpy(value,citem->value); 
				}
				return 1;
			}
			i++;
			if(i > idx)
				break;
		}
	}

	if(value) strcpy(value,"");
	return 0;
}

char *genconfig_get_index_pvalue(genconfig_ll_t *gen_ll, char *itag, int idx)
{
	int i;
	char *ptr;
	genconfig_item_t *citem;
	char tag[GENCONFIG_MAX_ITEM_LEN], ctag[GENCONFIG_MAX_ITEM_LEN];
	
	strcpy(tag,itag);
	ptr = strchr(tag,'+');
	if(ptr) *ptr = 0;

	for(i=0,citem=gen_ll->head; citem; citem=citem->next)
	{
		strcpy(ctag,citem->tag);
		ptr = strchr(ctag,'+');
		if(ptr) *ptr = 0;

		if(!strcmp(ctag, tag))
		{
			if(i == idx)
				return (citem->long_value?citem->long_value:citem->value);
			i++;
			if(i > idx)
				break;
		}
	}
	return NULL;
}

#endif

#ifdef L_genconfig_set_index_value
int genconfig_set_index_value(genconfig_ll_t *gen_ll, char *itag, int idx, char *value)
{
	genconfig_item_t *citem;
	char tag[GENCONFIG_MAX_ITEM_LEN], ctag[GENCONFIG_MAX_ITEM_LEN];
	char *ptr;
	int i;

	if(!value) return -1;

	strcpy(tag,itag);
	ptr = strchr(tag,'+');
	if(ptr) *ptr = 0;

	for(i = 0,citem=gen_ll->head; citem; citem=citem->next)
	{
		strcpy(ctag,citem->tag);
		ptr = strchr(ctag,'+');
		if(ptr) *ptr = 0;

		if(!strcmp(ctag, tag))
		{
			if( i == idx )
			{
				if(strlen(value)>(GENCONFIG_MAX_VALUE_LEN-1))
				{
					citem->long_value=malloc(strlen(value)+1);
					strcpy(citem->long_value, value);
				}
				else
				{
					strcpy(citem->value,value);
					if(citem->long_value)
					{
						free(citem->long_value);
						citem->long_value = NULL;
					}
				}
				return 1;
			}
			i++;
			if(i > idx) break;
		}
	}

	/* new item */
	additem_ll(gen_ll, tag,value);

	return 0;
}
#endif


#ifdef L_genconfig_remove_index_item
int genconfig_remove_index_item(char *filename, int idx, char *itag)
{
	int ret=0, i, fd;
	char *ptr;
	genconfig_ll_t gen_ll;
	genconfig_item_t *citem, *pitem, *nitem;
	char tag[GENCONFIG_MAX_ITEM_LEN], ctag[GENCONFIG_MAX_ITEM_LEN];

        fd = lock_file(filename);

	gen_ll.head = NULL;
	gen_ll.tail = NULL;
	genconfig_read_file(filename, &gen_ll);

	strcpy(tag,itag);
	ptr = strchr(tag,'+');
	if(ptr) *ptr = 0;

        for(i = 0, citem=gen_ll.head; citem; citem=citem->next)
	{
		strcpy(ctag,citem->tag);
		ptr = strchr(ctag,'+');
		if(ptr) *ptr = 0;
                if(!strcmp(ctag, tag))
		{
			if( i == idx )
				break;
			i++;
		}
	}
	if(!citem)
	{
        	unlock_file(fd);
 		genconfig_free_ll(&gen_ll);
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

	genconfig_write_file(filename, &gen_ll);
        unlock_file(fd);

 	genconfig_free_ll(&gen_ll);


	return ret;
}
#endif

#ifdef L_genconfig_remove_index_allitem
int genconfig_remove_index_allitem(char *filename, char *tag)
{
	int rmcount=0, fd;
	char *ptr;
	genconfig_ll_t gen_ll;
	genconfig_item_t *citem, *pitem, *nitem;
	char ctag[GENCONFIG_MAX_ITEM_LEN];

	gen_ll.head = NULL;
	gen_ll.tail = NULL;

        fd = lock_file(filename);

	genconfig_read_file(filename, &gen_ll);

	while(1)
	{
               for(citem=gen_ll.head; citem; citem=citem->next)
 	       {
		       strcpy(ctag,citem->tag);
		       ptr = strchr(ctag,'+');
		       if(ptr) *ptr = 0;
		       if(!strcmp(ctag, tag))
			       break;
 	       }
 	       if(!citem) /* no more data to remove */ 
		       break;
 
 	       rmcount++;
 	       pitem = citem->prev;
 	       nitem = citem->next;
 	       if(pitem) pitem->next = citem->next;
 	       else gen_ll.head = citem->next;
 
 	       if(nitem) nitem->prev = citem->prev;
 	       else gen_ll.tail = citem->prev;
 	       genconfig_free_item(citem);
	}

	genconfig_write_file(filename, &gen_ll);
	unlock_file(fd);
 	genconfig_free_ll(&gen_ll);


	return rmcount;
}
#endif
