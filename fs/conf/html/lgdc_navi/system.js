<script>

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

function ChangeLoginInfo(passwd)
{
        var F = document.login_fm;

        if (F.new_passwd.value != F.confirm_passwd.value)
                alert(SYSCONF_LOGIN_INVALID_NEW_PASS);
        else if(F.hidden_passwd.value != passwd)
                alert(SYSCONF_LOGIN_INVALID_CUR_PASS);
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



</script>
