<script>
var regExp_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,120}$/;
var regExp_url = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

function validate_string(str, regExp, type)
{
        if(type == 'unpermitted'){if(str.match(regExp)) return false;}
        else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
        return true;
}

function isIE6()
{
	var retv = -1;
	if (window.navigator && navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			retv = parseFloat( RegExp.$1 );
	}
	return ((retv==6.0)?true:false);
}

function add_hiddeninput(F, elem, idoc)
{
        if(!F || !elem) return;

        var crelm = document.createElement('input');
	if(idoc)	crelm = idoc.createElement('input');
        crelm.type = 'hidden';
        /*IE 5*/
        if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');

        if(elem.type == 'checkbox'){
                crelm.value = elem.checked?'on':'off';
                crelm.setAttribute('value', elem.checked?'on':'off');
        }
        else if(elem[0] && elem[0].type == 'radio'){
                crelm.value = GetValue(elem);
                crelm.setAttribute('value', GetValue(elem));
        }
        else{
                crelm.value = elem.value;
                crelm.setAttribute('value', elem.value);
        }

        if(elem[0] && elem[0].type == 'radio'){
                crelm.name = elem[0].name;
                crelm.setAttribute('name', elem[0].name);
        }else{
                crelm.name = elem.name;
                crelm.setAttribute('name', elem.name);
        }

        F.appendChild(crelm);
        /*IE 5*/
        if(!F[elem.name])
                F[elem.name] = crelm;

}

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
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

function ApplyLogin()
{
        var F = document.login_fm;
	var ifr = document.hiddenloginsetup_iframe || document.getElementsByName('hiddenloginsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.sysconf_hiddenloginsetup;
        if(!iform)      return;

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
			document.getElementById('login_div_msg').innerHTML = SYSCONF_LOGIN_APPLYSTR;
        		MaskIt(document, 'apply_mask');

                        F.act.value = 'save';
			F.tmenu.value = 'iframe';
			F.smenu.value = 'hiddenloginsetup';
if(isIE6()){
			add_hiddeninput(iform, F.act, idoc);
			add_hiddeninput(iform, F.tmenu, idoc);
			add_hiddeninput(iform, F.smenu, idoc);
			add_hiddeninput(iform, F.captcha_file, idoc);
			add_hiddeninput(iform, F.captcha_code, idoc);
			add_hiddeninput(iform, F.new_passwd, idoc);
			add_hiddeninput(iform, F.new_login, idoc);
}else{
			add_hiddeninput(iform, F.act);
			add_hiddeninput(iform, F.tmenu);
			add_hiddeninput(iform, F.smenu);
			add_hiddeninput(iform, F.captcha_file);
			add_hiddeninput(iform, F.captcha_code);
			add_hiddeninput(iform, F.new_passwd);
			add_hiddeninput(iform, F.new_login);
}

                        iform.submit();
                }
        }
}

function ApplySession()
{
        var F = document.session_fm;
	var ifr = document.hiddenloginsetup_iframe || document.getElementsByName('hiddenloginsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.sysconf_hiddenloginsetup;
        if(!iform)      return;

        if(!F.http_auth)
                return;

        if(GetValue(F.http_auth) == 'session' && F.noid.value == '1')
        {
                alert(SYSCONF_LOGIN_SHOULD_HAVE_IDPASS);
                return 0;
        }

        if(GetValue(F.http_auth) == 'session')
        {
		if(isNaN(F.http_session_timeout.value)){
                        alert(SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT);
                        F.http_session_timeout.focus();
                        return 0;
		}
                session_timeout=parseInt(F.http_session_timeout.value);
                if((session_timeout <=0) || (session_timeout >= 61))
                {
                        alert(SYSCONF_LOGIN_INVALID_SESSION_TIMEOUT);
                        F.http_session_timeout.focus();
                        return 0;
                }
		if(F.captcha_attempt.value === "" || F.captcha_attempt.value < 0 || F.captcha_attempt.value > 99)
		{
                        alert(SYSCONF_CAPTCHA_ATTEMPT_RANGE_WARNING);
                        F.captcha_attempt.focus();
			return 0;
		}
        }

        if (confirm(SYSCONF_LOGIN_RELOGIN_SESSION))
        {
		document.getElementById('login_div_msg').innerHTML = SYSCONF_LOGIN_APPLYSTR;
		MaskIt(document, 'apply_mask');

                F.act.value = 'session_save';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'hiddenloginsetup';
if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
		add_hiddeninput(iform, F.http_auth, idoc);
		add_hiddeninput(iform, F.http_session_timeout, idoc);
		add_hiddeninput(iform, F.use_captcha, idoc);
		add_hiddeninput(iform, F.captcha_attempt, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
		add_hiddeninput(iform, F.http_auth);
		add_hiddeninput(iform, F.http_session_timeout);
		add_hiddeninput(iform, F.use_captcha);
		add_hiddeninput(iform, F.captcha_attempt);
}

                iform.submit();
        }
}

function onChangeCaptchaUsage()
{
	var F = document.session_fm;
	if(F.use_captcha.value === "manual")
	{
		F.captcha_attempt.style.display = "";
		document.getElementById('captcha_desc').style.display = "inline";
		CaptchaWarning(true);
	}
	else
	{
		F.captcha_attempt.style.display = "none";
		document.getElementById('captcha_desc').style.display = "none";
		CaptchaWarning(false);
	}
}

function CaptchaWarning(show)
{
        var captcha_warning = document.getElementById('captcha_warning');
        if(!captcha_warning)
                return;
        if(show)
                captcha_warning.style.display = "";
        else
                captcha_warning.style.display = "none";
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
                        F.captcha_attempt.disabled = true;
                        F.use_captcha.style.backgroundColor = "#ebebe4";
                }
                else
                {
                        F.http_session_timeout.disabled = false;
                        F.use_captcha.disabled = false;
                        F.captcha_attempt.disabled = false;
                        F.use_captcha.style.backgroundColor = "";
                }
		onChangeCaptchaUsage();
                return 0;
        }
}

function DeleteEmailConfig()
{
        var F = document.email_fm;
	var ifr = document.hiddenloginsetup_iframe || document.getElementsByName('hiddenloginsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.sysconf_hiddenloginsetup;
        if(!iform)      return;

	if(!confirm(SYSCONF_EMAIL_DEL_CONFIRM))	return;

	document.getElementById('login_div_msg').innerHTML = SYSCONF_LOGIN_DELETESTR;
	MaskIt(document, 'apply_mask');

	F.email.value = '';
	F.smtp.value = '';
	F.send_email.value = '';
	F.account.value = '';
	F.smtp_pass.value = '';

        F.act.value = 'delete_email';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenloginsetup';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
}
	iform.submit();
}

function ChangeEmailConfig()
{
        var F = document.email_fm;
	var ifr = document.hiddenloginsetup_iframe || document.getElementsByName('hiddenloginsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.sysconf_hiddenloginsetup;
        if(!iform)      return;

	if(F.email.value == '' || !validate_string(F.email.value,regExp_email, 'match')){
		alert(SYSCONF_EMAIL_INVALID);
		F.email.focus();
		return;
	}
	if(F.send_email.value == '' || !validate_string(F.send_email.value,regExp_email, 'match')){
		alert(SYSCONF_EMAIL_INVALID);
		F.send_email.focus();
		return;
	}
	if(F.smtp.value == '' || (!validate_string(F.smtp.value, regExp_url, 'match') && !validate_string(F.smtp.value, regExp_ip, 'match'))){
		alert(SYSCONF_EMAIL_SMTP_INVALID);
		F.smtp.focus();
		return;
	}
	if(GetValue(F.smtp_auth) == 'on'){
		if(F.account && (F.account.value == '')){
			alert(SYSCONF_EMAIL_ACCOUNT_INVALID);
			F.account.focus();
			return;
		}
	}

	document.getElementById('login_div_msg').innerHTML = SYSCONF_LOGIN_APPLYSTR;
	MaskIt(document, 'apply_mask');

        F.act.value = 'apply_email';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenloginsetup';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.email, idoc);
	add_hiddeninput(iform, F.smtp, idoc);
	add_hiddeninput(iform, F.send_email, idoc);
	add_hiddeninput(iform, F.smtp_auth, idoc);
	add_hiddeninput(iform, F.account, idoc);
	add_hiddeninput(iform, F.smtp_pass, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.email);
	add_hiddeninput(iform, F.smtp);
	add_hiddeninput(iform, F.send_email);
	add_hiddeninput(iform, F.smtp_auth);
	add_hiddeninput(iform, F.account);
	add_hiddeninput(iform, F.smtp_pass);
}

        iform.submit();
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

</script>
