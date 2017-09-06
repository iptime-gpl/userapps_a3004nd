<script>

function AddHost()
{
        var F = document.ipdisk_conf;

        if((F.hostname.value.indexOf('_') != -1) || (F.hostname.value.indexOf('.') != -1))
        {
                alert(EXPERTCONF_IPTIMEDDNS_INVALID_HOSTNAME);
                F.hostname.focus();
                F.hostname.select();
                return;
        }

        if ((F.email.value.indexOf('@') == -1))
        {
                alert(EXPERTCONF_IPTIMEDDNS_INVALID_USERID);
                F.email.focus();
                F.email.select();
                return;
        }

        F.act.value = "addhost";
        F.submit();
}

function check_login_id(s)
{
        for( i = 0 ; i < s.length; i++ )
        {
                if(((s.charAt(i) >= 'a') && (s.charAt(i) <= 'z')) ||
                        ((s.charAt(i) >= 'A' ) && (s.charAt(i) <= 'Z')) ||
                        ((s.charAt(i) >= '0' ) && (s.charAt(i) <= '9')) )
                                continue;
        else
                        return false;
       }
       return true;
}

function CheckUser(userid,passwdorg,passwd_text,passwd_view)
{
	var passwd;

        if( userid.value.length == 0 )
        {
                alert(MSG_BLANK_ACCOUNT);
                userid.focus();
                userid.select();
                return 1;
        }

	if(passwd_view.checked == true)
		passwd = passwd_text;
	else
		passwd = passwdorg;

        if( passwd.value.length == 0 )
        {
                alert(MSG_BLANK_PASSWORD);
                passwd.focus();
                passwd.select();
                return 1;
        }

	if (check_login_id(userid.value) == false)
	{
                alert(SYSCONF_LOGIN_INVALID_NEW_ID);
                userid.focus();
                userid.select();
                return 1;
	}
	return 0;
}

function ApplyNas(service)
{
        var F = document.nasmisc_fm;

	if(service == 'ftp')
	{
		if (GetRadioValue(F.ftp_run) == 0)
		{
        		F.act.value=service;
        		F.submit();
			return;
		}

		if (F.ftp_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.ftp_port.focus();
                        F.ftp_port.select();
                        return;
		}
        
		if (checkRange(F.ftp_port.value, 1, 65535) || (F.ftp_port.value == '80'))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.ftp_port.focus();
                        F.ftp_port.select();
                        return;
		}
	}
	else if(service == 'samba')
	{
		if (GetRadioValue(F.samba_run) == 0)
		{
        		F.act.value=service;
        		F.submit();
			return;
		}

		if (F.samba_name.value == '')
		{
                        alert(NASCONF_SAMBANAME_BLANK);
                        F.samba_name.focus();
                        F.samba_name.select();
                        return;
		}

		if (F.samba_group.value == '')
		{
                        alert(NASCONF_SAMBAGROUP_BLANK);
                        F.samba_group.focus();
                        F.samba_group.select();
                        return;
		}
	}
	else if(service == 'url')
	{
		if (GetRadioValue(F.url_run) == 0)
		{
        		F.act.value=service;
        		F.submit();
			return;
		}

		if (F.url_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.url_port.focus();
                        F.url_port.select();
                        return;
		}
        
		if (checkRange(F.url_port.value, 1, 65535) || (parseInt(F.url_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.url_port.focus();
                        F.url_port.select();
                        return;
		}

		if(GetRadioValue(F.url_login)==0)
		{
        		F.act.value=service;
        		F.submit();
			return;
		}
	}

	useridobj=document.getElementsByName(service+'_userid');
	passobj=document.getElementsByName(service+'_passwd');
	passobj=document.getElementsByName(service+'_passwd');
	passtextobj=document.getElementsByName(service+'_passwd_text');
	passviewobj=document.getElementsByName(service+'_password_view');
	
	if(CheckUser(useridobj[0],passobj[0],passtextobj[0],passviewobj[0]))
		return;

        F.act.value=service;
        F.submit();
}

function RemoveUSB(value)
{
        var F = document.usbmgmt_fm;

        F.act.value="remove";
        F.devname.value=value;
        F.submit();
}


function PasswordView(password,password_text,password_view)
{
        if(password_view.checked == true)
        {
                password.style.display = "none";
                password_text.style.display = "inline";
                password_text.value = password.value;
        }
        else
        {
                password_text.style.display = "none";
                password.value = password_text.value;
                password.style.display = "inline";
        }
}

function InitURL()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.url_run) == 0)
	{
		DisableObj(F.url_port);
		DisableObj(F.url_login);
		DisableObj(F.url_userid);
		DisableObj(F.url_passwd);
		DisableObj(F.url_passwd_text);
		DisableObj(F.url_password_view);
	}
	else
	{
		EnableObj(F.url_port);
		EnableObj(F.url_login);
		EnableObj(F.url_login);

		if(GetRadioValue(F.url_login) == 1)
		{
			EnableObj(F.url_userid);
			EnableObj(F.url_passwd);
			EnableObj(F.url_passwd_text);
			EnableObj(F.url_password_view);
		}
		else
		{
			DisableObj(F.url_userid);
			DisableObj(F.url_passwd);
			DisableObj(F.url_passwd_text);
			DisableObj(F.url_password_view);
		}
	}
}

function InitSamba()
{
        var F = document.nasmisc_fm;

	if(GetRadioValue(F.samba_run) == 0)
	{
		DisableObj(F.samba_name);
		DisableObj(F.samba_group);
		DisableObj(F.samba_userid);
		DisableObj(F.samba_passwd);
		DisableObj(F.samba_passwd_text);
		DisableObj(F.samba_password_view);
	}
	else
	{
		EnableObj(F.samba_name);
		EnableObj(F.samba_group);
		EnableObj(F.samba_userid);
		EnableObj(F.samba_passwd);
		EnableObj(F.samba_passwd_text);
		EnableObj(F.samba_password_view);

	}
}


function InitFTP()
{
        var F = document.nasmisc_fm;

	if(GetRadioValue(F.ftp_run) == 0)
	{
		DisableObj(F.ftp_port);
		DisableObj(F.ftp_encoding);
		DisableObj(F.ftp_userid);
		DisableObj(F.ftp_passwd);
		DisableObj(F.ftp_passwd_text);
		DisableObj(F.ftp_password_view);
	}
	else
	{
		EnableObj(F.ftp_port);
		EnableObj(F.ftp_encoding);
		EnableObj(F.ftp_userid);
		EnableObj(F.ftp_passwd);
		EnableObj(F.ftp_passwd_text);
		EnableObj(F.ftp_password_view);
	}
}




</script>
