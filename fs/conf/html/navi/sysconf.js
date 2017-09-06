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

function ApplyLogin()
{
        var F = document.login_fm;

        //if (F.new_passwd.value != F.confirm_passwd.value)
        //       alert(SYSCONF_LOGIN_INVALID_NEW_PASS);
        
        if(F.new_login && check_login_id(F.new_login.value) == false)
                alert(SYSCONF_LOGIN_INVALID_NEW_ID);
        else
        {

		var F2=document.session_fm;


		if(F.password_view && F.password_view.checked == true )
			F.new_passwd.value = F.new_passwd_text.value;

		if(F2 && (GetValue(F2.prev_auth_method) == 'session'))
		{
			if(F.new_login)
			{	
                		if (F.new_login.value == '' || F.new_passwd.value == '')   
				{
                			alert(SYSCONF_LOGIN_CANT_REMOVE_ID);
					if(F.password_view && F.password_view.checked == true )
						F.new_passwd_text.focus();
					else
						F.new_passwd.focus();
					return 0;
				}
			}
		}

                if (F.new_login && F.new_login.value == '' && F.new_passwd.value == '')   
		{
                	alert(SYSCONF_LOGIN_CANT_REMOVE_WARNING);
			return 0;

/*
                	if (confirm(SYSCONF_LOGIN_REMOVE_WARNING))
			{
				if(F.captcha_code)
				{
					if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
					{
						alert(SYSCONF_LOGIN_NEED_CAPTCHA_CODE);
						F.captcha_code.focus();
						return;
					}
					F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
				}

                        	F.act.value = 'save';
                        	F.submit();
				return 0;
			}
			else
				return 0;

*/
		}

		if(F.default_id && (F.default_id.value == F.new_login.value) && (F.default_pass.value == F.new_passwd.value))
		{
			alert(CANT_SET_DEFAULT_ID_PASS);
			return 0;
		}

                if(F.captcha_code)
 		{
			if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
			{
				alert(SYSCONF_LOGIN_NEED_CAPTCHA_CODE);
				F.captcha_code.focus();
				return;
			}
			F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
		}

                if (confirm(SYSCONF_LOGIN_RELOGIN))
                {
                        F.act.value = 'save';
                        F.submit();
                }
        }
}

function ApplySession()
{
        var F = document.session_fm;

	if(!F.http_auth)
		return;

	if(GetValue(F.http_auth) == 'session' && F.noid.value == '1')
	{
        	alert(SYSCONF_LOGIN_SHOULD_HAVE_IDPASS);
		return 0;
	}

	if(GetValue(F.http_auth) == 'session')
	{
		session_timeout=parseInt(F.http_session_timeout.value);
		if((session_timeout <=0) || (session_timeout >= 61))
		{
			alert(SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT);
			F.http_session_timeout.focus();
			return 0;
		}
	}

        if (confirm(SYSCONF_LOGIN_RELOGIN_SESSION))
        {
                F.act.value = 'session_save';
                F.submit();
        }
}

function InitLogin()
{
        var F = document.session_fm;

	if(F.http_auth) 
	{
		if(GetValue(F.http_auth) == 'basic')
		{
			F.http_session_timeout.disabled = true;
			F.use_captcha.disabled = true;
		}
		else
		{
			F.http_session_timeout.disabled = false;
			F.use_captcha.disabled = false;
		}
		return 0;
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

function OnClickSilentLED()
{
	var F = document.misc_fm;

	if(GetValue(F.led_flag) == 2)
	{
		EnableObj(F.led_start);
		EnableObj(F.led_end);
	}
	else
	{
		DisableObj(F.led_start);
		DisableObj(F.led_end);
	}
}

function ShowUSBMessage()
{
	var F=document.usb_fm;

	if(GetRadioValue(F.usb_mode) == 3 ) 
		ShowIt('usb30_desc');
	else
		HideIt('usb30_desc');
}


function FirmUpView()
{
	var F=document.view_fm;
	
	if(GetRadioValue(F.firmup) == 'online')
	{
		ShowIt('online');
		HideIt('auto');
		HideIt('manual');
	}
	else if(GetRadioValue(F.firmup) == 'auto')
	{
		HideIt('online');
		ShowIt('auto');
		HideIt('manual');

	}
	else if(GetRadioValue(F.firmup) == 'manual')
	{
		HideIt('online');
		HideIt('auto');
		ShowIt('manual');
	}
}

function StartFirmUp()
{
	var F=iframe_status.firmup_fm;

	if(confirm(SYSCONF_ONLINE_UPGRADE_CONFIRM))
	{
		F.act.value = 'update';	
		F.submit();
	}
}

function CancelFirmUp()
{
	var F=iframe_status.firmup_fm;

	F.act.value = 'cancel';	
	F.submit();
}


function ClickEveryDay(F)
{
        if(F.everyday.checked == true)
        {
                DisableObj(F.mon);
                DisableObj(F.tue);
                DisableObj(F.wed);
                DisableObj(F.thu);
                DisableObj(F.fri);
                DisableObj(F.sat);
                DisableObj(F.sun);
        }
        else
        {
                EnableObj(F.mon);
                EnableObj(F.tue);
                EnableObj(F.wed);
                EnableObj(F.thu);
                EnableObj(F.fri);
                EnableObj(F.sat);
                EnableObj(F.sun);
        }

}

function ClickAutoReboot(F)
{
	var run=GetRadioValue(F.autoreboot_run);

	if(run == '1')
	{
	        EnableObj(F.everyday);
	        EnableObj(F.mon);
                EnableObj(F.tue);
                EnableObj(F.wed);
                EnableObj(F.thu);
                EnableObj(F.fri);
                EnableObj(F.sat);
                EnableObj(F.sun);
                EnableObj(F.autoreboot_hour);
                EnableObj(F.autoreboot_min);
		ClickEveryDay(F);
	}
	else
	{
		DisableObj(F.everyday);
		DisableObj(F.mon);
                DisableObj(F.tue);
                DisableObj(F.wed);
                DisableObj(F.thu);
                DisableObj(F.fri);
                DisableObj(F.sat);
                DisableObj(F.sun);
                DisableObj(F.autoreboot_hour);
                DisableObj(F.autoreboot_min);

	}


}

function UpdateMinDesc()
{
	var F=document.misc_fm;	
	var min_start_obj=document.getElementById('fan_min_start');
	var min_end_obj=document.getElementById('fan_min_end');

	min_start_obj.innerHTML = parseInt(F.mintemper.value) + 1; 
	min_end_obj.innerHTML = parseInt(F.maxtemper.value) - 1; 
}

function ClickFanMethod()
{
	var F=document.misc_fm;	

	fan_method=GetValue(F.fan_method);
	if(fan_method == "auto")
	{
		DisableObj(F.manual_op);
		EnableObj(F.mintemper);
		EnableObj(F.maxtemper);

	}
	else if(fan_method == "manual")
	{
		EnableObj(F.manual_op);
		DisableObj(F.mintemper);
		DisableObj(F.maxtemper);
	}
	
}




</script>
