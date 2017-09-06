#include <linosconfig.h>
#include <sys/types.h>
#include <errno.h>

char *sf_strncpy(char *dst,char *src, int n)
{
	int len;

	if(dst) memset(dst,0,n);
	if(!src) return dst;
	
	len=strlen(src);
	if(len >= n) n--;
	if(dst && src)
		return strncpy(dst,src,n);
	return dst;
}

char *sf_strcpy(char *dst,char *src)
{
	if(dst && src)
		return strcpy(dst,src);
	return dst;
}

void trim_crcf(char *str)
{
        int len = strlen(str);

        if (len)
        {
                while (str[len-1] == '\n' || str[len-1] == '\r')
                len--;
                str[len] = '\0';
        }
}

