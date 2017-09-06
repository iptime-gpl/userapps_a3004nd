#ifdef EFM_UPLOAD
#include <iconfig.h>
#include <exp.h>

typedef struct exp_handle_s {
	struct exp_handle_s *next;
	char session[128]; 
	char exp_id[16]; 
	int fd;
	in_port_t src_port;
	char *curdir;
	char *filename;
	unsigned long long filesize;
	unsigned long long writesize;
	unsigned long long prev_writesize;
	int w_offset; 
} exp_handle_t;

list_head_t exp_upload_list;



char *get_multipart_boundary(connection *con)
{
        char *ptr;

	if(!con->request.http_content_type) return NULL;

	ptr=strstr(con->request.http_content_type,"boundary=");
	if(!ptr) return NULL;

	ptr+=strlen("boundary=");
        return strdup(ptr);
}




int parse_upload_mulipart_header(connection *con, char *post, int *w_offset, char **filename, unsigned long long  *len)
{
        char *ptr;
        unsigned long long ctlen;
	char *boundary;

        ptr=strtok(post,"\n");
        if(!ptr) return 0;

        ctlen=con->request.content_length;

        ptr=strtok(NULL,"\n");
        if(!ptr) return 0;

        /* Content-Disposition */
        ptr=strstr(ptr,"filename=\"");
        if(!ptr) return 0;

        *filename=strdup(&ptr[strlen("filename=\"")]);

        ptr=strchr(*filename,'\"');
        if(!ptr)
        {
                free(*filename);
                return 0;
        }
        *ptr=0;

        //syslog(LOG_DEBUG,"*filename -> %s", *filename );
        /* For IE6.0 patch , IE6.0 will pass full path */
        if((ptr=strrchr(*filename,'\\')))
        {
                char *tempptr;

                tempptr=*filename;
                *filename=strdup(&ptr[1]);
                free(tempptr);
        }


        ptr=strtok(NULL,"\n");
        if(!ptr)
        {
                free(*filename);
                return 0;
        }

        ptr=strtok(NULL,"\n");
        if(!ptr)
        {
                free(*filename);
                return 0;
        }

        ptr+=2;

        *w_offset=ptr-post;

	boundary=get_multipart_boundary(con);

        *len = ctlen-(*w_offset)-4-4-strlen(boundary); /* 4=(0xd,0xa)*2, 4=boundary added */
	free(boundary);

        return 1;
}
                            

int update_exp_upload_status(exp_handle_t *exph)
{
	exp_status_t exps;
	char sizestr[128];

	/*
	if((exph->writesize!=exph->filesize) && ((exph->writesize-exph->prev_writesize) < 0x100000))
		return 0;
	*/

	// syslog(LOG_DEBUG,"update_exp_upload_status: %llu, %llu, %llu", exph->filesize, exph->writesize, exph->prev_writesize);
	exps.pid=getpid();
	strcpy(exps.useraction,"noact");
	if(exph->filesize>exph->writesize)
	{
		strcpy(exps.status,"uploading");
		sprintf(sizestr,"%llu-%llu",exph->filesize,exph->writesize);
		exps.msg=strdup(sizestr);
	}
	else
	{
		strcpy(exps.status,"done");
		sprintf(sizestr,"%llu-%llu",exph->filesize,exph->writesize);
		exps.msg=strdup(sizestr);
	}

	exph->prev_writesize=exph->writesize;
	//exp_set_status(exph->session,exph->exp_id,&exps);
	exp_set_file_status(exph->filename, exph->session,exph->exp_id,&exps);
	exp_free_status(&exps);
	return 0;
}

int extract_session_exp_id(connection *con, char *session_id, char *exp_id)
{
	data_string *ds;


	ds = (data_string *)array_get_element(con->request.headers, "Cookie");
	if(ds && ds->value->ptr)
	{
		char *ptr;

		ptr=strstr(ds->value->ptr,"efm_session_id");
		if(ptr)
		{
			char uri[256],*p;

			strncpy(session_id,&ptr[strlen("efm_session_id=")],64);
			ptr=strchr(session_id,';');
			if(ptr) *ptr=0;

			/* upload uri is   exp_upload.{exp_id}.cgi */
			strncpy(uri,con->request.uri->ptr,255);
			p=strrchr(uri,'.');
			if(p)
			{
				*p=0;
				p=strrchr(uri,'.');
				if(p)
				{
					p++;
					strncpy(exp_id,p,32);
					return 1;
				}
			}
		}
	}
	return 0;
}

int update_exp_status(connection *con, char *status, char *msg)
{
	exp_status_t exps;
	char session[128],exp_id[32];

	if(!strstr(con->request.uri->ptr,"exp_upload"))
                return 0;

	if(!extract_session_exp_id(con,session,exp_id))
	{
		return 0;
	}

	exps.pid=getpid();
	strcpy(exps.useraction,"noact");
	strcpy(exps.status,status);
	if(msg && strlen(msg)) exps.msg=strdup(msg);
	else exps.msg=strdup("nomsg");
	exp_set_status(session,exp_id,&exps);
	exp_free_status(&exps);

	return 1;
}




static int cleanup_exph(exp_handle_t *exph)
{
	if(exph->filename) free(exph->filename);
	if(exph->curdir) free(exph->curdir);
	if(exph->fd != -1) close(exph->fd);
	free(exph);
	return 0;
}

int remove_exphandle_from_list(char *session, char *exp_id, in_port_t src_port)
{
	exp_handle_t *exph, *pexph;

	if (exp_upload_list.count == 0)
		return 0;

	for( pexph=NULL,exph=exp_upload_list.head;exph;exph=exph->next)
	{
		if(!strcmp(session,exph->session) && !strcmp(exp_id,exph->exp_id) && exph->src_port == src_port)
		{
			syslog(LOG_DEBUG,"remove session from exp_upload_list ---> %s , %s, %d", session,exp_id, exph->src_port);
			if(pexph) pexph->next=exph->next;
			else exp_upload_list.head = exph->next; 

			if(!exph->next) exp_upload_list.tail = pexph;

			//syslog(LOG_DEBUG,"list->head:%08x tail:%08x\n", exp_upload_list.head, exp_upload_list.head);

			cleanup_exph(exph);
			exp_upload_list.count--;
			syslog(LOG_DEBUG,"exp_upload_list count: %d", exp_upload_list.count);
			break;
		}
		else
			pexph=exph;
	}
	return 0;
}

exp_handle_t *get_exp_handle(connection *con)
{
	exp_handle_t *exph;
	char session[128],exp_id[32];

	if(con->request.uri->ptr && !strstr(con->request.uri->ptr,"exp_upload"))
		return NULL;

	if(!extract_session_exp_id(con,session,exp_id))
		return NULL;

	if (exp_upload_list.count == 0)
		return NULL;

	for( exph=exp_upload_list.head;exph;exph=exph->next)
	{
		if(!strcmp(session,exph->session) && !strcmp(exp_id,exph->exp_id) && 
			exph->src_port == ntohs(con->dst_addr.ipv4.sin_port))
			return exph;
	}
	return NULL;
}


exp_handle_t *open_exp_handle(connection *con, char *ptr)
{
	exp_handle_t *exph,*texph;
	exp_data_t exp;
	char *path;

	if(!strstr(con->request.uri->ptr,"exp_upload"))
		return NULL;

	exph=malloc(sizeof(exp_handle_t));
	memset(exph,0x0,sizeof(exp_handle_t));

	if(!extract_session_exp_id(con,exph->session,exph->exp_id))
	{
		free(exph);
		return NULL;
	}
	syslog(LOG_DEBUG,"session id: %s-%s",exph->session,exph->exp_id);

	if(!parse_upload_mulipart_header(con, ptr, &exph->w_offset, &exph->filename, &exph->filesize))
	{
		if(exph->filename) free(exph);
		free(exph);
		return NULL;
	}
	syslog(LOG_DEBUG,"w_offset:%d, filename:%s filesize:%llu", exph->w_offset,exph->filename, exph->filesize);

	exph->writesize=0;
	exp_get_data(exph->session,exph->exp_id,&exp,0);
	if(!strcmp(exp.curdir,"/mnt"))
	{
		exp_free_data(&exp);
		return NULL;
	}

	exph->curdir=strdup(exp.curdir);
	exp_free_data(&exp);
	syslog(LOG_DEBUG,"curdir: %s", exph->curdir);

	exph->src_port = ntohs(con->dst_addr.ipv4.sin_port);
	syslog(LOG_DEBUG,"========== exph->src_port: %d", exph->src_port);

	path=malloc(strlen(exph->curdir)+strlen(exph->filename)+16);

	sprintf(path,"%s/%s",exph->curdir,exph->filename);

	syslog(LOG_DEBUG,"filepath:%s", path);

	//exph->fd=open(path,O_CREAT|O_RDWR);
	exph->fd=open(path, O_WRONLY|O_CREAT|O_TRUNC|O_EXCL, WEBDAV_FILE_MODE);
	if (exph->fd == -1)
	{
		if (-1 == (exph->fd = open(path, O_WRONLY|O_TRUNC, WEBDAV_FILE_MODE)))
		{
			free(path);
			free(exph);
			return NULL;
		}
	}

	//syslog(LOG_DEBUG,"exph->fd : %d", exph->fd);
	free(path);

#if	0
	{
		syslog(LOG_DEBUG,"filename -> %s len -> %llu %d", filename, len, toRead);

		writelen -= (file_start-ptr);
		syslog(LOG_DEBUG,"toRead -> %d", toRead);
		exp_file_size=len;
		exp_write_size=0;
	}
#endif

	exph->next = NULL;
	if(!exp_upload_list.head)
		exp_upload_list.head = exp_upload_list.tail = exph;
	else
	{
		texph = (exp_handle_t *)exp_upload_list.tail;
		texph->next=exph;
		exp_upload_list.tail = exph;
       	}
	exp_upload_list.count++;

	syslog(LOG_DEBUG,"exp_upload_list count: %d", exp_upload_list.count);

	return exph;
}

int close_exp_handle(exp_handle_t *exph)
{
	syslog(LOG_DEBUG,"close_exp_handle...");
	remove_exphandle_from_list(exph->session,exph->exp_id,exph->src_port);
	return 1;
}

int exp_write_upload(exp_handle_t *exph,char *ptr,int toRead)
{
	int writelen;

	//syslog(LOG_DEBUG,"exp_write_upload---> %d", exph->fd );
	if(exph->fd == -1) return 0;
	if(exph->filesize <= exph->writesize)
		return 0;

	writelen=toRead;
	writelen-=exph->w_offset;

	if((unsigned long long)writelen > (exph->filesize-exph->writesize))
	{
		writelen=exph->filesize-exph->writesize;
		syslog(LOG_DEBUG,"Last one write: %d", writelen);
		write(exph->fd, ptr+exph->w_offset,writelen);
		exph->writesize += writelen;
		update_exp_upload_status(exph);
	        efmlog_simple( EFMLOG_EXP_UPLOAD_FILE, get_http_ipuser(),"EXP_UPLOAD_FILE", exph->filename, &exph->curdir[strlen("/mnt")]);
		close_exp_handle(exph);

	}
	else
	{
		write(exph->fd, ptr+exph->w_offset,writelen);
		exph->writesize += writelen;
		exph->w_offset=0; /* reset */
		update_exp_upload_status(exph);
	}

	// syslog(LOG_DEBUG,"realwrite end--- > %d", writelen);

	return toRead;
}

int connection_set_state(server *srv, connection *con, connection_state_t state) {
	UNUSED(srv);

	con->state = state;

	if (state == CON_STATE_ERROR)
	{
		exp_handle_t *exph;
		exph=get_exp_handle(con);
		if(exph) 
		{
	        	efmlog_simple( EFMLOG_EXP_UPLOAD_FILE_FAIL, get_http_ipuser(),"EXP_UPLOAD_FILE_FAIL", &exph->filename[strlen("/mnt")], &exph->curdir[strlen("/mnt")]);
			close_exp_handle(exph);
		}
	}

	return 0;
}

#endif
