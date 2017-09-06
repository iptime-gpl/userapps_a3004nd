# Makefile for time cgi 

include $(USERAPPS_ROOT)/mkdefs

CAPTCHA_OBJS = main.o libcaptcha.o
			
captcha:$(CAPTCHA_OBJS)
	$(CC) $(LDFLAGS) -o captcha $(CAPTCHA_OBJS) $(CGI_LIB)
	$(STRIP) -s --remove-section=.note --remove-section=.comment captcha
#	ftp 192.168.100.36

copy:
#	cp $(PROG).cgi /home/sjkim/work
#	cp $(PROG1).cgi /home/sjkim/work/login


clean:
	rm -f $(PROG) $(PROG1)  *.elf *.o *.bak *.map *.cgi core *.a version.h
	rm -f bin/* in_public
	for i in $(SUBDIRS) ; do \
		echo -e "\033[31m$$i\033[0m";\
		make -C $$i clean;\
	done



