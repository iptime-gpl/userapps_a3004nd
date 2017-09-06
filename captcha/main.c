#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>        // write(), close()
#include <linosconfig.h>        // write(), close()
#include <lib/session.h>


extern const int gifsize;
void captcha(unsigned char im[70*200], unsigned char l[6]);
void makegif(unsigned char im[70*200], unsigned char gif[gifsize]);

int main(int argc,char *argv[]) {
        char l[8];
        unsigned char im[70*200];
        unsigned char gif[gifsize];

	if(argc < 2) return 0;

	memset(l,0x0,8);
        captcha(im,l);
        makegif(im,gif);

        write(1,gif,gifsize);
        //write(2,l,5);
	set_captcha(argv[1],l);

        return 0;
}

