#include "base.h"
#include "log.h"
#include "buffer.h"

#include "plugin.h"

#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

/* plugin config for all request/connections */
typedef struct {
	array *alias;
} plugin_config;

typedef struct {
	PLUGIN_DATA;

	plugin_config **config_storage;

	plugin_config conf;
} plugin_data;

#ifdef EFM_PATCH
#include <server_mgmt.h>
httpd_conf_t hc;
#endif
/* init the plugin data */
INIT_FUNC(mod_alias_init) {
	plugin_data *p;

	p = calloc(1, sizeof(*p));

#ifdef EFM_PATCH
	get_httpd_config(&hc);
#endif


	return p;
}

/* detroy the plugin data */
FREE_FUNC(mod_alias_free) {
	plugin_data *p = p_d;

	if (!p) return HANDLER_GO_ON;

	if (p->config_storage) {
		size_t i;

		for (i = 0; i < srv->config_context->used; i++) {
			plugin_config *s = p->config_storage[i];

			if(!s) continue;

			array_free(s->alias);

			free(s);
		}
		free(p->config_storage);
	}

	free(p);

	return HANDLER_GO_ON;
}

/* handle plugin config and check values */

SETDEFAULTS_FUNC(mod_alias_set_defaults) {
	plugin_data *p = p_d;
	size_t i = 0;

	config_values_t cv[] = {
		{ "alias.url",                  NULL, T_CONFIG_ARRAY, T_CONFIG_SCOPE_CONNECTION },       /* 0 */
		{ NULL,                         NULL, T_CONFIG_UNSET,  T_CONFIG_SCOPE_UNSET }
	};

	if (!p) return HANDLER_ERROR;

	p->config_storage = calloc(1, srv->config_context->used * sizeof(specific_config *));

	for (i = 0; i < srv->config_context->used; i++) {
		plugin_config *s;

		s = calloc(1, sizeof(plugin_config));
		s->alias = array_init();
		cv[0].destination = s->alias;

		p->config_storage[i] = s;

		if (0 != config_insert_values_global(srv, ((data_config *)srv->config_context->data[i])->value, cv)) {
			return HANDLER_ERROR;
		}
		if (s->alias->used >= 2) {
			const array *a = s->alias;
			size_t j, k;

			for (j = 0; j < a->used; j ++) {
				const buffer *prefix = a->data[a->sorted[j]]->key;
				for (k = j + 1; k < a->used; k ++) {
					const buffer *key = a->data[a->sorted[k]]->key;

					if (key->used < prefix->used) {
						break;
					}
					if (memcmp(key->ptr, prefix->ptr, prefix->used - 1) != 0) {
						break;
					}
					/* ok, they have same prefix. check position */
					if (a->sorted[j] < a->sorted[k]) {
						log_error_write(srv, __FILE__, __LINE__, "SBSBS",
							"url.alias: `", key, "' will never match as `", prefix, "' matched first");
						return HANDLER_ERROR;
					}
				}
			}
		}
	}

	return HANDLER_GO_ON;
}

#define PATCH(x) \
	p->conf.x = s->x;
static int mod_alias_patch_connection(server *srv, connection *con, plugin_data *p) {
	size_t i, j;
	plugin_config *s = p->config_storage[0];

	PATCH(alias);

	/* skip the first, the global context */
	for (i = 1; i < srv->config_context->used; i++) {
		data_config *dc = (data_config *)srv->config_context->data[i];
		s = p->config_storage[i];

		/* condition didn't match */
		if (!config_check_cond(srv, con, dc)) continue;

		/* merge config */
		for (j = 0; j < dc->value->used; j++) {
			data_unset *du = dc->value->data[j];

			if (buffer_is_equal_string(du->key, CONST_STR_LEN("alias.url"))) {
				PATCH(alias);
			}
		}
	}

	return 0;
}
#undef PATCH

#include <sys/syslog.h>



PHYSICALPATH_FUNC(mod_alias_physical_handler) {
	plugin_data *p = p_d;
	int uri_len, basedir_len;
	char *uri_ptr;
	size_t k;

#ifdef EFM_PATCH
	char useridstr[256];
#endif


	if (con->physical.path->used == 0) return HANDLER_GO_ON;

	mod_alias_patch_connection(srv, con, p);

	/* not to include the tailing slash */
	basedir_len = (con->physical.basedir->used - 1) - 1;
	uri_len = con->physical.path->used - 1 - basedir_len;
	uri_ptr = con->physical.path->ptr + basedir_len;


#ifdef EFM_PATCH
	// syslog(LOG_DEBUG,"---> con->authed_user : %08x", con->authed_user->ptr);
	if(!strncmp(&uri_ptr[1],hc.webdav_tag,strlen(hc.webdav_tag)))
	{
		if(con->authed_user->ptr && strcmp(con->authed_user->ptr,""))
			sprintf(useridstr,"/%s", con->authed_user->ptr);
		else
			strcpy(useridstr,"");
	}
	else if(!strncmp(&uri_ptr[1],hc.dirlist_tag,strlen(hc.dirlist_tag)))
	{
		char user_id[128],*cookie;
		data_string *ds;
		char session_id[128];
		char *ptr;

                ds = (data_string *)array_get_element(con->request.headers, "Cookie");
                if(!ds)
                        return HANDLER_GO_ON;

                cookie = ds->value->ptr;
                ptr=strstr(cookie,"efm_session_id");
                if(!ptr)
                        return HANDLER_GO_ON;

                //syslog(LOG_DEBUG,"---------> my cookie:%s,remoteip:%s", ptr, remoteip);
                strncpy(session_id,&ptr[strlen("efm_session_id=")],128);
                ptr=strchr(session_id,';');
                if(ptr) *ptr=0;

		strcpy(user_id,"");
		if(get_user_by_session("DirList", session_id ,user_id ) && strcmp(user_id,""))
			sprintf(useridstr,"/%s",user_id);
		else
                        return HANDLER_GO_ON;
	}
#endif

	for (k = 0; k < p->conf.alias->used; k++) {
		data_string *ds = (data_string *)p->conf.alias->data[k];
		int alias_len = ds->key->used - 1;

		if (alias_len > uri_len) continue;
		if (ds->key->used == 0) continue;

		if (0 == (con->conf.force_lowercase_filenames ?
					strncasecmp(uri_ptr, ds->key->ptr, alias_len) :
					strncmp(uri_ptr, ds->key->ptr, alias_len))) {
			/* matched */

			buffer_copy_string_buffer(con->physical.basedir, ds->value);
#ifdef EFM_WEBDAV
			if(!strncmp(&uri_ptr[1],hc.webdav_tag,strlen(hc.webdav_tag)) || !strncmp(&uri_ptr[1],hc.dirlist_tag,strlen(hc.dirlist_tag)))
			{
				buffer_append_string(con->physical.basedir,useridstr);
			}
#endif

			buffer_copy_string_buffer(srv->tmp_buf, ds->value);

#ifdef EFM_WEBDAV
			//if(!strncmp(uri_ptr,"/webdav",7) || !strncmp(uri_ptr,"/dirlist",8))
			if(!strncmp(&uri_ptr[1],hc.webdav_tag,strlen(hc.webdav_tag)) || !strncmp(&uri_ptr[1],hc.dirlist_tag,strlen(hc.dirlist_tag)))
			{
				buffer_append_string(srv->tmp_buf,useridstr);
			}
#endif

			buffer_append_string(srv->tmp_buf, uri_ptr + alias_len);
			buffer_copy_string_buffer(con->physical.path, srv->tmp_buf);

#if	0
			syslog(LOG_DEBUG,"mod_alias_physical_handler--> %s %s\n", 
					con->physical.path->ptr,
					con->physical.basedir->ptr );
#endif

			return HANDLER_GO_ON;
		}
	}

	/* not found */
	return HANDLER_GO_ON;
}

/* this function is called at dlopen() time and inits the callbacks */

int mod_alias_plugin_init(plugin *p);
int mod_alias_plugin_init(plugin *p) {
	p->version     = LIGHTTPD_VERSION_ID;
	p->name        = buffer_init_string("alias");

	p->init           = mod_alias_init;
	p->handle_physical= mod_alias_physical_handler;
	p->set_defaults   = mod_alias_set_defaults;
	p->cleanup        = mod_alias_free;

	p->data        = NULL;

	return 0;
}
