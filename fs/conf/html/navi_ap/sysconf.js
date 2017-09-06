<script>
//sysconf_syslog

function ApplySyslog()
{
	var F=document.syslog_fm;
	F.act.value = 'apply';
	F.submit();
}

function ToggleEmailLog()
{
	var F=document.syslog_fm;;
	if(F.log_email_chk.checked == false )
	{
		F.email_hour.disabled = true;
		F.log_rmflag_chk.disabled = true;
	}
	else if(F.log_email_chk.checked == true )
	{
		F.email_hour.disabled = false;
		F.log_rmflag_chk.disabled = false;
	}
}

function Apply_Email()
{
	var F=document.syslog_fm;
	if((F.log_email_chk.checked == true) && checkRange(F.email_hour.value, 0, 23)) 
		alert(SYSCONF_SYSLOG_WANRING );
	else 
	{
		F.act.value = "apply";
		F.submit(); 
	}
}

function Send_Email()
{
	var F=document.syslog_fm;
	if(confirm(SYSCONF_SYSLOG_EMAIL_CONFIRM ))
	{
		F.act.value = "sendmail";
		F.submit(); 
	}
}

function RemoveLog()
{
	var F=document.syslog_fm;
	if(confirm(SYSCONF_SYSLOG_CLEAR_CONFIRM )) 
	{
		F.act.value = "remove";
		F.submit(); 
	}
}

//sysconf_login
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

function ChangeLoginInfo()
{
        var F = document.login_fm;
        if (F.new_passwd.value != F.confirm_passwd.value)
                alert(SYSCONF_LOGIN_INVALID_NEW_PASS);
        else if(check_login_id(F.new_login.value) == false)
                alert(SYSCONF_LOGIN_INVALID_NEW_ID);
        else
        {
                if (confirm(SYSCONF_LOGIN_RELOGIN))
                {
                        F.act.value = 'save';
                        F.submit();
                }
        }
}

function ChangeEmailConfig()
{
        var F = document.email_fm;
        F.act.value = 'apply_email';
        F.submit();
}

function ChangeAuth()
{
        var F = document.email_fm;
        if(F.smtp_auth[0].checked == true)
        {
                EnableObj(F.account);
                EnableObj(F.smtp_pass);
        }
        else
        {
                DisableObj(F.account);
                DisableObj(F.smtp_pass);
        }
}

//sysconf_realtime
function SelectTimeServer()
{
      var F = document.realtime_fm;
      if(F.server_list.value == 'null')
              EnableObj(F.server_edit);
      else
              DisableObj(F.server_edit);
}
function ApplyTimeServer()
{
      var F=document.realtime_fm;
      F.act.value='apply';
      F.submit();
}

// sysconf_configmgmt 
function RestoreConfig()
{
	var F = document.restore_fm; 
	if(F.restore_config_file.value.length == 0 )
       	{
		alert(MSG_RESTOREFILE_BLANK);
                return;
       	}
	ApplyReboot(document.restore_fm,'restore');
}

// sysconf_misc
function ApplyMisc(value)
{
        var F = document.misc_fm;

	if(value == 'wbm_popup')
		alert(MSG_WBM_POPUP);
        F.act.value=value;
        F.submit();
}



</script>
