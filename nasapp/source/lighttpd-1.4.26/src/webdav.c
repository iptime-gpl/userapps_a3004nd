#include <efmlog.h>
#include <usershare_mgmt.h>

int check_webdav_folder(connection *con)
{
	int n;

	n=strlen(con->physical.doc_root->ptr);
	if(!strncmp(&con->physical.path->ptr[n],"/webdav/",strlen("/webdav/")))
	{
		//syslog(LOG_DEBUG,"---------> %s", &con->physical.path->ptr[n]);
		return 1;
	}

	return 0;

}

int webdav_efmlog(connection *con, int is_dir, int isok, char *optstr)
{
	char log_userid[128];
	char *fileptr,*dirpath;

	sprintf(log_userid,"%s(%s)",con->authed_user->ptr, inet_ntoa(con->dst_addr.ipv4.sin_addr));

	fileptr=strchr(&con->uri.path->ptr[1],'/');
	if(!fileptr) return 0;

	dirpath=strdup(fileptr);

	// syslog(LOG_DEBUG,"dirpath --------->is_dir:%d %s", is_dir, dirpath);
	switch(con->request.http_method)
	{
		case HTTP_METHOD_PROPFIND:
			efmlog_simple(
				isok?EFMLOG_WEBDAV_FOLDER_ACCESS_ACCEPT:EFMLOG_WEBDAV_FOLDER_ACCESS_DENY,
				log_userid,
				isok?"WEBDAV_FOLDER_ACCESS_ACCEPT":"EFMLOG_WEBDAV_FOLDER_ACCESS_DENY",
				fileptr); 
			break;
		case HTTP_METHOD_MKCOL:
			efmlog_simple(
				isok?EFMLOG_WEBDAV_MKDIR:EFMLOG_WEBDAV_FILE_WRITE_DENY,
				log_userid,
				isok?"WEBDAV_MKDIR":"WEBDAV_FILE_WRITE_DENY",
				dirpath); 

			break;
		case HTTP_METHOD_PUT:
			efmlog_simple(
				isok?EFMLOG_WEBDAV_FILE_PUT:EFMLOG_WEBDAV_FILE_WRITE_DENY,
				log_userid,
				isok?"WEBDAV_FILE_PUT":"WEBDAV_FILE_WRITE_DENY",
				dirpath);
			break;
		case HTTP_METHOD_DELETE:
			if(is_dir)
			{
				efmlog_simple(
					isok?EFMLOG_WEBDAV_RMDIR:EFMLOG_WEBDAV_FILE_WRITE_DENY,
					log_userid,
					isok?"WEBDAV_RMDIR":"WEBDAV_FILE_WRITE_DENY",
					dirpath); 
			}
			else
			{
				efmlog_simple(
					isok?EFMLOG_WEBDAV_FILE_DELETE:EFMLOG_WEBDAV_FILE_WRITE_DENY,
					log_userid,
					isok?"WEBDAV_FILE_DELETE":"WEBDAV_FILE_WRITE_DENY",
					dirpath);
			}
			break;
		case HTTP_METHOD_MOVE:
			if(optstr) 
			{
				int i;
				char *ptr;

				ptr = optstr;
				for( i = 0 ; i < 5 ; i++ )
				{
					ptr=strchr(ptr,'/');
					if(!ptr) break;
					ptr++;
				}

				if(ptr)
				{
					ptr--;
					if(is_dir)
					{
						efmlog_simple(
							isok?EFMLOG_WEBDAV_RENAME_FOLDER:EFMLOG_WEBDAV_FILE_WRITE_DENY,
							log_userid,
							isok?"WEBDAV_RENAME_FOLDER":"WEBDAV_FILE_WRITE_DENY",
							fileptr, ptr); 
					}
					else
					{
						efmlog_simple(
							isok?EFMLOG_WEBDAV_RENAME_FILE:EFMLOG_WEBDAV_FILE_WRITE_DENY,
							log_userid,
							isok?"WEBDAV_RENAME_FILE":"WEBDAV_FILE_WRITE_DENY",
							fileptr, ptr); 
					}
				}
			}
			break;

			break;
		case HTTP_METHOD_COPY:
			break;
		case HTTP_METHOD_PROPPATCH:
			break;
		default:
			break;
	}
	free(dirpath);
	return 0;
}

/* path is /webdav/HDD1/12345/xxxxx */
#if	0
static int dir_filter( const struct dirent *dir)
{
        if(dir->d_type !=  DT_DIR)
                return 0;
        if(dir->d_type ==  DT_LNK)
                return 0;
        if(!strcmp(dir->d_name,"."))
                return 0;
        if(!strcmp(dir->d_name,".."))
                return 0;
        if(!strcmp(dir->d_name,"lost+found"))
                return 0;
        if(!strcmp(dir->d_name,"nfs"))
                return 0;
        return 1;
}

int get_mntdir_count(void)
{
        struct dirent **namelist;
        int n, i;

        /* TBD : performance tuning scchoi */
        n = scandir("/mnt", &namelist, dir_filter, alphasort);
        for( i = 0 ; i < n ; i++ ) free(namelist[i]);
	free(namelist);
	return n;
}
#endif

int get_folder_id_from_path(char *path, char *folder_id)
{
	/* 
	   if dirn == 1 ->    path is  /webdav/12345/1111.mp3
	   if dirn > 1 ->    path is  /webdav/HDD1/12345/1111.mp3 or /webdav/12345/1111.mp3 */

	char *tmpbuf, *ptr;

	ptr=strchr(path,'/');
	if(!ptr) return 0;
	ptr++;

	ptr=strchr(path,'/');
	if(!ptr) return 0;
	ptr++;



	ptr=strchr(ptr,'/');
	if(!ptr) return 0;
	ptr++;
	tmpbuf=strdup(ptr);
	//syslog(LOG_DEBUG,"tmpbuf -> %s", tmpbuf);
	ptr=strchr(tmpbuf,'/');
	if(!ptr)
	{
		free(tmpbuf);
		return 0;
	}
	*ptr=':';
	ptr=strchr(tmpbuf,'/');
	if(ptr) *ptr=0;
	strcpy(folder_id,tmpbuf);
	free(tmpbuf);
	return 1;
}

int check_path_can_modified(char *path)
{
	/* 
	   if dirn == 1 ->    path is  /webdav/12345/ -> return 0
	   if dirn > 1 ->    path is  /webdav/HDD1/12345/ --> return 0
	   if not  , return 1;
	 */
	char *ptr;
	int i;

	// syslog(LOG_DEBUG,"check_path_can_modified path: %s", path);

	for(i=0,ptr=path;ptr;ptr=strchr(ptr,'/'),i++)
		ptr++;

	if(i<=3) return 0;
	if((i==4) && (path[strlen(path)-1] =='/')) 
	{
	// 	syslog(LOG_DEBUG,"Not OK");
		return 0;
	}
	// syslog(LOG_DEBUG,"OK");

	return 1;
}



int webdav_check_auth(char *rw,char *user,char *path)
{
	folderinfo_t fi;
	char folder_id[512];
        authinfo_t *auth;
	int auth_ret=0;

	//syslog(LOG_DEBUG,"check auth: %s,%s,%s",rw,user,path);
	if(!get_folder_id_from_path(path,folder_id))
	{
		syslog(LOG_DEBUG,"Can't get folder id");
		return 0;
	}

	//syslog(LOG_DEBUG,"folder_id --------> %s", folder_id );

	if(!get_folder_config(folder_id,&fi))
	{
		syslog(LOG_DEBUG,"DAV: No folder config for Folder(%s).", path);
		return 0;
	}

	if(!(fi.service & WEBDAV_SUPPORT))
	{
		syslog(LOG_DEBUG,"DAV: Folder(%s) is not WebDAV folder.",path);
		return 0;
	}

	/* Check this folder is opened by WebDAV */
	/* TBD */
	if(user && strlen(user) > 0)
	{
		userinfo_t ui;

		if(!get_user_config(user,&ui) || !ui.use)
			return 0;
		if(ui.auth_level == ADMIN_AUTH)
		{
			//syslog(LOG_DEBUG,"admin auth is OK");
			return 1;
		}
	}

        for(auth=fi.authlist.head;auth;auth=auth->next)
        {
		if(strcmp(auth->permission,rw))
			continue;
		if(!strcmp(auth->id,"everybody"))
		{
			//syslog(LOG_DEBUG,"------> everybody auth_ret 1");
			auth_ret=1;
			break;
		}

		if(!user) continue;

                if(!strcmp(auth->id_type,"user") && !strcmp(auth->id,user))
		{
			//syslog(LOG_DEBUG,"------> found user auth_ret 1");
			auth_ret=1;
			break;
		}
                else if(!strcmp(auth->id_type,"group"))
                {
			int i;
			groupinfo_t gi;
			if(!get_group_config(auth->id,&gi))
				continue;
			for(i=0 ; i < gi.user_count ; i++)
			{
				if(!gi.user_list[i])
					break;
				if(!strcmp(gi.user_list[i],user))
				{
					//syslog(LOG_DEBUG,"-------> found in group :%s", gi.group_id );
					auth_ret=1;
					break;
				}
			}

			free_group_userlist(&gi);
			if(auth_ret) break;
                }
        }

        free_folder_authlist(&fi);

	syslog(LOG_DEBUG,"check auth: %s,%s,%s ----> %d",rw,user,path, auth_ret);
	return auth_ret;
}

list_head_t webdav_put_list;
/* uri is    /{WebDAV TAG}/HDD1/.... */
/* real path is /mnt/HDD1/... */ 

buffer *get_dav_real_path(char *uri)
{
	char *ptr,*path;
	buffer *pathbuffer;

	ptr=strchr(&uri[1],'/');
	if(!ptr) return NULL;

	path=malloc( strlen(ptr)+ 16); /* /mnt --> 16 */
	sprintf(path,"/mnt%s",ptr);

	pathbuffer=buffer_init_string(path);
	buffer_urldecode_path(pathbuffer);
	free(path);
	return pathbuffer;
}


webdav_handle_t *get_webdav_handle(connection *con)
{
        webdav_handle_t *davh;

	/* auth check.. ?? */
        for( davh=webdav_put_list.head;davh;davh=davh->next)
        {
                if(!strcmp(con->request.uri->ptr,davh->uri) && !strcmp(inet_ntoa(con->dst_addr.ipv4.sin_addr), davh->ip))
                        return davh;
        }
        return NULL;
}


static int cleanup_davh(webdav_handle_t *davh)
{
        if(davh->uri) free(davh->uri);
        if(davh->fd != -1) close(davh->fd);
#ifdef EFM_CHUNK_PATCH
	if(davh->chunk_data) free(davh->chunk_data);
#endif
        free(davh);
        return 0;
}


static int extract_username(char *ptr,char *username)
{
	char *auth=strdup(ptr);
	char *p,*p2;

	p=strstr(auth,"username=");
	if(!p) 
	{
		free(auth);
		return 0;
	}

	p=&p[strlen("username=")];
	if(p[0] != '"')
	{
		free(auth);
		return 0;
	}

	p++;
	p2=strchr(p,'"');
	if(!p2)
	{
		free(auth);
		return 0;
	}
	*p2=0;
	strncpy(username,p,128);
	free(auth);
	return 1;
}

static int webdav_auth_simple(connection *con, char *uri)
{
	data_string *ds;
	char *http_authorization = NULL;
	char username[256];

        if (NULL != (ds = (data_string *)array_get_element(con->request.headers, "Authorization"))) {
                http_authorization = ds->value->ptr;
        }
	else if(webdav_check_auth("rw",NULL,uri)) /* for public folder */ 
		return 1;
	else
		return 0;

        if (ds && ds->value && ds->value->used) {
		if(!extract_username(ds->value->ptr,username))
			return 0;
		if(!webdav_check_auth("rw",username,uri))
			return 0;
		//syslog(LOG_DEBUG,"Username %s RW is OK ----> %s", username, uri);
		return 1;
        }

	return 0;
}

webdav_handle_t *open_webdav_handle(connection *con)
{
        webdav_handle_t *davh,*tdavh;
        buffer *pathbuf;
	data_string *ds_range;

	davh=get_webdav_handle(con);
	if(davh)
		return davh;

        davh=malloc(sizeof(webdav_handle_t));
        memset(davh,0x0,sizeof(webdav_handle_t));


        davh->writesize=0;
	strncpy(davh->ip,inet_ntoa(con->dst_addr.ipv4.sin_addr),20);


#ifdef EFM_CHUNK_PATCH
	if(con->request.chunk_encoding)
        	davh->filesize=con->request.expected_entity_length;
	else
        	davh->filesize=con->request.content_length;
#else
        davh->filesize=con->request.content_length;
#endif

	davh->uri=strdup(con->request.uri->ptr);
	pathbuf=get_dav_real_path(davh->uri);
	if(!pathbuf) 
		return NULL;
	//syslog(LOG_DEBUG,"WebDAV open path: (%s) %s", davh->ip, pathbuf->ptr);

	if(!webdav_auth_simple(con,pathbuf->ptr))
		return NULL;

        if (NULL != (ds_range = (data_string *)array_get_element(con->request.headers, "Content-Range")))
	{
                const char *num = ds_range->value->ptr;
                off_t offset;
                char *err = NULL;

                syslog(LOG_DEBUG,"Content-Range is %s",ds_range->value->ptr );

                if (0 != strncmp(num, "bytes ", 6)) {
                        con->http_status = 501; /* not implemented */
                        return NULL;
                }

                /* we only support <num>- ... */

                num += 6;

                /* skip WS */
                while (*num == ' ' || *num == '\t') num++;

                if (*num == '\0') {
                        con->http_status = 501; /* not implemented */
                        return NULL;
                }

                offset = strtoll(num, &err, 10);

                if (*err != '-' || offset < 0) {
                        con->http_status = 501; /* not implemented */
                        return NULL;
                }

                if (-1 == (davh->fd = open(pathbuf->ptr, O_WRONLY, WEBDAV_FILE_MODE))) {
                        switch (errno) {
                        case ENOENT:
                                con->http_status = 404; /* not found */
                                break;
                        default:
                                con->http_status = 403; /* not found */
                                break;
                        }
                        return NULL;
                }

                if (-1 == lseek(davh->fd, offset, SEEK_SET)) {
                        con->http_status = 501; /* not implemented */

                        close(davh->fd);
                        return NULL;
                }
                con->http_status = 200; /* modified */
        }
	else
	{
		davh->fd=open(pathbuf->ptr, O_WRONLY|O_CREAT|O_TRUNC|O_EXCL, WEBDAV_FILE_MODE);
		if (-1 == (davh->fd = open(pathbuf->ptr, O_WRONLY|O_TRUNC, WEBDAV_FILE_MODE))) 
		{
			if (errno == ENOENT && -1 == (davh->fd = open(pathbuf->ptr, O_WRONLY|O_CREAT|O_TRUNC|O_EXCL, WEBDAV_FILE_MODE))) 
				con->http_status = 409;
			else 
				con->http_status = 201; /* created */
		}
	}

	if(davh->fd == -1)
	{
		syslog(LOG_DEBUG,"Can't open the file:%s", pathbuf->ptr);
		buffer_free(pathbuf);
		cleanup_davh(davh);
		return NULL;
	}
	buffer_free(pathbuf);

        davh->next = NULL;
        if(!webdav_put_list.head)
                webdav_put_list.head = webdav_put_list.tail = davh;
        else
        {
                tdavh = (webdav_handle_t *)webdav_put_list.tail;
                tdavh->next=davh;
                webdav_put_list.tail = davh;
        }
        webdav_put_list.count++;

        return davh;
}


int close_webdav_handle(webdav_handle_t *c_davh)
{
        webdav_handle_t *davh, *pdavh;

        for( pdavh=NULL,davh=webdav_put_list.head;davh;davh=davh->next)
        {
                if(c_davh==davh)
                {
        		//syslog(LOG_DEBUG,"close_webdav_handle...(%s, %s)", davh->uri,davh->ip);

                        if(pdavh) pdavh->next=davh->next;
                        else webdav_put_list.head = davh->next;

                        if(!davh->next) webdav_put_list.tail = pdavh;

                        //syslog(LOG_DEBUG,"list->head:%08x tail:%08x\n", exp_upload_list.head, exp_upload_list.head);

                        cleanup_davh(davh);
                        webdav_put_list.count--;
                        break;
                }
                else
                        pdavh=davh;
        }
        return 1;
}

off_t webdav_write_direct(connection *con,webdav_handle_t *davh,char *ptr,off_t toRead)
{
        int r;

	if(davh->fd == -1)
		return 0;

        if ((r = write(davh->fd, ptr, toRead)) < 0)
        {
                switch(errno) {
                        case ENOSPC:
                                con->http_status = 507;
				return 0;
                        default:
                                con->http_status = 403;
				return 0;
                }
        }

        davh->writesize += toRead;
	//syslog(LOG_DEBUG,"filesize : %llu   writesize: %llu", davh->filesize, davh->writesize);

        return toRead;
}


#ifdef EFM_CHUNK_PATCH
static int is_crlf(unsigned char *ptr)
{
	if( (ptr[0] == 0x0d) && (ptr[1] == 0x0a))
		return 1;
	return 0;
}

static int read_chunk_size(webdav_handle_t *davh,char *ptr,int n)
{
	char  found=0; 
	int prev_chunk_size;
	int i;

	for( i = 0 ; (i < n) && (i < MAX_CHUNK_SIZE_STR); i++ )
	{
		davh->chunksize_buf[davh->chunksize_offset]=ptr[i];
		if(davh->chunksize_offset >= 2 )
		{
			if(is_crlf(&davh->chunksize_buf[davh->chunksize_offset-1]))
			{
				found = 1;
				davh->chunksize_buf[davh->chunksize_offset-1]=0;
				i++;
				break;
			}
		}
		davh->chunksize_offset++;
	}

	if( i == MAX_CHUNK_SIZE_STR )
	{
		syslog(LOG_DEBUG,"No chunk size found .. ");
		return -1;
	}

	if(!found)
		return i;

	prev_chunk_size = davh->chunk_size; 
	sscanf((char *)davh->chunksize_buf,"%x",(unsigned int *)&davh->chunk_size);
	davh->chunk_size+=2; /* including cr/lf */

	if(davh->chunk_size != prev_chunk_size )
	{
		free(davh->chunk_data);
		davh->chunk_data=malloc(davh->chunk_size);
	}

	//syslog(LOG_DEBUG,"Chunk Size: %x", davh->chunk_size);
	davh->chunk_offset=0;
	davh->chunk_status = HTTP_CHUNK_STATUS_READ_DATA;

	davh->chunksize_offset=0;
	return i;
}

static int read_chunk_data(webdav_handle_t *davh,char *ptr,int n)
{
	int readn;

	if(!davh->chunk_data)
		return 0;

	//syslog(LOG_DEBUG,"----> read chunk data : %d,  %d, %d", n, davh->chunk_size ,davh->chunk_offset);
	if(n < (davh->chunk_size - davh->chunk_offset))
	{
		readn=n;
		memcpy(davh->chunk_data + davh->chunk_offset,ptr,readn);
		davh->chunk_offset += n;
	//syslog(LOG_DEBUG,"----> Read Chunk : offset : %d", davh->chunk_offset);
		return readn;
	}
	else
	{
		readn=davh->chunk_size - davh->chunk_offset;
		davh->chunk_status = HTTP_CHUNK_STATUS_DATA_COMPLETE;
		memcpy(davh->chunk_data + davh->chunk_offset,ptr,readn);
		davh->chunk_offset += readn;
	//syslog(LOG_DEBUG,"----> Chunk is full : %d %d", davh->chunk_size, davh->chunk_offset);
		return readn;
	}
}

static int write_chunk_data(webdav_handle_t *davh)
{
	int wn;

        if ((wn = write(davh->fd, davh->chunk_data, davh->chunk_size-2)) < 0) /* exclude the cr/lf */
		return -1;
	if(wn != (davh->chunk_size-2))
	{
		syslog(LOG_DEBUG,"write_chunk_data ERROR %d", wn);
		return -1;
	}

        davh->writesize += davh->chunk_size-2;
	//syslog(LOG_DEBUG,"Chunk Write Size: %llu", davh->writesize );
	davh->chunk_status = HTTP_CHUNK_STATUS_READ_SIZE;
	return davh->chunk_size;
}

off_t webdav_write_httpchunk(connection *con,webdav_handle_t *davh,char *ptr,off_t n) 
{
	int rn;
        int readn;

	if(davh->fd == -1)
		return 0;

	if(!con->request.chunk_encoding)
		return 0;

	//syslog(LOG_DEBUG,"----> webdav_write_httpchunk : %d, %d", n, davh->chunk_status );
	readn=(int)n;
	while(readn > 0)
	{
		if(davh->chunk_status == HTTP_CHUNK_STATUS_READ_SIZE)
		{
			rn=read_chunk_size(davh,ptr,readn);
			if(rn < 0 ) return 0;
			readn -= rn;
			ptr += rn;
			continue;
		}

		if(davh->chunk_status == HTTP_CHUNK_STATUS_READ_DATA)
		{
			rn=read_chunk_data(davh,ptr,readn);
			if(rn < 0 ) 
			{
				syslog(LOG_DEBUG,"Read Error??");
				return 0;
			}
			readn -= rn;
			ptr += rn;

			if(davh->chunk_status == HTTP_CHUNK_STATUS_DATA_COMPLETE)
			{
				if(write_chunk_data(davh) == -1)
				{
					syslog(LOG_DEBUG,"Write Error ?? ");
					return 0;
				}
			}
			continue;
		}

	}
	//syslog(LOG_DEBUG,"filesize : %llu   writesize: %llu", davh->filesize, davh->writesize);
        return n;
}
#endif


