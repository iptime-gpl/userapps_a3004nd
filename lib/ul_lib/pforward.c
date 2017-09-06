#include <stdio.h>
#include <time.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <ctype.h>
#include <signal.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/file.h>
#include <sys/stat.h>
#include <dirent.h>
#include <syslog.h>
#include <linosconfig.h>
#include <lib/pforward.h>

static int parse_pforward(char *value, pforward_t *pforward)
{
	char *ptr;

	ptr=strtok(value,":");
	if(!ptr) return 0;
	sf_strncpy(pforward->name, ptr, 32);

	ptr=strtok(NULL,":");
	if(!ptr) return 0;
	sf_strncpy(pforward->chain,ptr, 32);

	ptr=strtok(NULL,":");
	if(!ptr) return 0;
	sf_strncpy(pforward->protocol,ptr, 8);

	ptr=strtok(NULL,":\n");
	if(!ptr) return 0;
	pforward->eport=atoi(ptr);

	ptr=strtok(NULL,":");
	if(!ptr) return 0;
	sf_strncpy(pforward->ipaddr,ptr, 16);

	ptr=strtok(NULL,":\n");
	if(!ptr) return 0;
	pforward->iport=atoi(ptr);

	return 1;
}

static void run_pforward(char cmd, pforward_t *pforward)
{
	char command[512];
	char ipaddr[20], netmask[20];
	struct in_addr in;

	/* iptables -t nat -A chain -p tcp --dport 1234 -j DNAT --to-destination 10.10.10.10:1234 */
	snprintf(command,512, "/sbin/iptables -t nat -%c %s -p %s --dport %d -j DNAT --to-destination %s:%d",
		cmd, pforward->chain, pforward->protocol, pforward->eport, pforward->ipaddr, pforward->iport);
	system(command);

	/* START - from local clinet to local sever by wanip */
	get_ifconfig(IF_LOCAL, ipaddr, netmask);
	in.s_addr = inet_addr(ipaddr) & inet_addr(netmask);

	snprintf(command,512, "/sbin/iptables -t nat -%c app_postroute -p %s -s %s/%d -d %s --dport %d -j SNAT --to-source %s",
		cmd, pforward->protocol, inet_ntoa(in), get_netmask_bit_count(netmask), pforward->ipaddr, pforward->iport, ipaddr);
	system(command);
	/* END - from local clinet to local sever by wanip */
}

static int make_pforward_value (pforward_t *pforward, char *value, int buflen)
{
	return snprintf(value,buflen,"%s:%s:%s:%d:%s:%d",
		pforward->name, pforward->chain, pforward->protocol, pforward->eport, pforward->ipaddr, pforward->iport);
}


int set_pforward(char *chain, char *name, pforward_t *pforward)
{
        int fd;
        genconfig_ll_t gen_ll;
	char value[512], command[512];
	char fn[256];

	snprintf(fn,256,"%s/%s",PFORWARD_CONFIG_DIR,chain);

	sf_strncpy(pforward->name, name, 32);
	make_pforward_value(pforward, value,512);

        gen_ll.head = NULL;
        gen_ll.tail = NULL;

        fd = lock_file(fn);

        if (genconfig_read_file(fn, &gen_ll) == -1)
	{
		snprintf(command,512, "/sbin/iptables -t nat -N %s", pforward->chain);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -A pforward -j %s", pforward->chain);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -A in_public_preroute -j %s", pforward->chain);
		system(command);
	}
        genconfig_set_value(&gen_ll, pforward->name, value );
        genconfig_write_file(fn, &gen_ll);
        genconfig_free_ll(&gen_ll);

        unlock_file(fd);

	run_pforward('A', pforward);

        return 1;
}

int get_pforward(char *chain, char *name, pforward_t *pforward)
{
        int ret=0;
        genconfig_ll_t gen_ll;
        int fd;
	char value[512];
	char fn[256];

	snprintf(fn,256,"%s/%s",PFORWARD_CONFIG_DIR,chain);

        gen_ll.head = NULL;
        gen_ll.tail = NULL;

        fd = lock_file(fn);

        genconfig_read_file(fn, &gen_ll);
        ret=genconfig_get_value( &gen_ll, name, value );
        genconfig_free_ll(&gen_ll);

        unlock_file(fd);

	if(ret)
	{
		memset(pforward, 0x0, sizeof(pforward_t));
		return parse_pforward(value, pforward);
	}

        return ret;
}

int remove_pforward(char *chain, char *name)
{
	pforward_t pforward;
	char fn[256], command[512];
	genconfig_ll_t gen_ll;
        int fd;

	if (get_pforward(chain, name, &pforward) <= 0)
		return -1;

	run_pforward('D', &pforward);
	snprintf(fn,256,"%s/%s",PFORWARD_CONFIG_DIR,chain);
	genconfig_remove_item(fn, name);

        fd = lock_file(fn);
	if (genconfig_read_file(fn, &gen_ll) == 0)
	{
		snprintf(command,512, "/sbin/iptables -t nat -D in_public_preroute -j %s", pforward.chain);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -D pforward -j %s", pforward.chain);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -X %s", pforward.chain);
		system(command);
		unlink(fn);
	}
	else
        	genconfig_free_ll(&gen_ll);
       	unlock_file(fd);

	return 1;
}

int create_pforward(char *chain, char *name, char *protocol, int eport, char *ipaddr, int iport)
{
	pforward_t pforward;

	if (get_pforward(chain, name, &pforward))
		return -1;
	memset(&pforward, 0x0, sizeof(pforward_t));

	sf_strncpy(pforward.name, name, 32);
	sf_strncpy(pforward.chain, chain, 32);
	sf_strncpy(pforward.protocol, protocol, 8);
	sf_strncpy(pforward.ipaddr, ipaddr, 16);
	pforward.eport=eport;
	pforward.iport=iport;
	pforward.flag=0;
	set_pforward(chain, name, &pforward);

	return 1;
}

int get_pforward_list(char *chain, pflist_head_t *list)
{
	FILE *fp;
	char *ptr;
        pforward_t pforward,*pfwd;
	char buffer[512];
	int fd;
	char fn[256];

        list->head=list->tail=NULL;
        list->count=0;

	snprintf(fn,256,"%s/%s",PFORWARD_CONFIG_DIR,chain);
        if( (fp=fopen(fn,"r")) == NULL )
                return 0;

	fd = lock_file(fn);

        while(fgets(buffer,512,fp))
        {
		ptr=strchr(buffer,'=');
		if(!ptr) continue;
		if(!parse_pforward(&ptr[1],&pforward))
			continue;
		pfwd=malloc(sizeof(pforward_t));
		*pfwd=pforward;
		pfwd->next=NULL;
                if(!list->head)
                        list->head=list->tail=pfwd;
                else
                {
                        pfwd->next=list->head;
                        list->head = pfwd;
                }
                list->count++;
        }

        fclose(fp);

	unlock_file(fd);

        return list->count;
}

int set_pforward_list(char *chain, pflist_head_t *list)
{
	FILE *fp;
        pforward_t *pfwd;
	char buffer[512],fn[256];
	int fd;

	snprintf(fn,256,"%s/%s",PFORWARD_CONFIG_DIR,chain);

        if( (fp=fopen(fn,"w+")) == NULL )
                return 0;
	fd = lock_file(fn);
        for(pfwd=list->head;pfwd;pfwd=pfwd->next)
        {
                if(pfwd->flag & PFORWARD_REMOVE_FLAG)
			continue;
		make_pforward_value(pfwd,buffer,512);
		fprintf(fp,"%s=%s\n",pfwd->name,buffer);
        }

        fclose(fp);
        unlock_file(fd);
	return 1;
}

int free_pforward_list(pflist_head_t *list)
{
        pforward_t *pfwd,*npfwd;

        for(pfwd=list->head;pfwd;)
        {
                npfwd=pfwd->next;
                free(pfwd);
                pfwd=npfwd;
        }
        return 1;
}

int init_pforward_config(void)
{
	struct dirent **items; 
	struct stat fstat;
	pflist_head_t pforward_list;
	pforward_t *pfwd;
	int nitems, i; 
	char command[512];

	nitems = scandir(PFORWARD_CONFIG_DIR, &items, NULL, alphasort);	
	//printf("PFORWARD_ count : %d \n", nitems);
	for (i=0; i<nitems; i++)
	{
		if ((!strcmp(items[i]->d_name, ".")) || (!strcmp(items[i]->d_name, "..")))
			continue;
		lstat(items[i]->d_name, &fstat);
		if ((fstat.st_mode & S_IFDIR) == S_IFDIR)
			continue;	

		printf("new chain[%d]> %s \n", i, items[i]->d_name);

		snprintf(command,512, "/sbin/iptables -t nat -N %s", items[i]->d_name);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -A pforward -j %s", items[i]->d_name);
		system(command);
		snprintf(command,512, "/sbin/iptables -t nat -A in_public_preroute -j %s", items[i]->d_name);
		system(command);

		if (get_pforward_list(items[i]->d_name, &pforward_list) > 0)
		{
			for (pfwd=pforward_list.head; pfwd; pfwd=pfwd->next)
				run_pforward('A', pfwd);
			free_pforward_list(&pforward_list);
		}
	}
	return 1;
}
