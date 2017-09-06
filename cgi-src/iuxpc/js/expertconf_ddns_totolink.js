<script>


function CheckHostNameValue(obj)
{
        var chr = obj.value;
        var objname = obj.name;
        for (i=0; i<chr.length; i++)
        {
                var ch = chr.charAt(i);
                if (( ch < "a" || ch > "z") && (ch < "A" || ch > "Z") && (ch < "0" || ch > "9" ) && ( ch != ".")  && (ch != "-"))
                {
                        alert(DDNS_HOSTNAME_RULE_TXT);
                        obj.value = chr.replace(ch, "");
                        obj.blur();
                }
        }
}

function RefreshHost()
{
        var F = document.dyndns_conf;

        if(CheckNoPassword(F)) return;

        F.act.value = "refreshhost";
        F.submit();
}

function AddHost()
{
        var F = document.dyndns_conf;

        if(CheckNoPassword(F)) return;

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


        var selectval = F.select_ddns.options[F.select_ddns.selectedIndex].value;
        if( F.hostname.value.length == 0)
        {
                alert( EXPERTCONF_DDNS_HOSTNAME_IS_BLANK);
                F.hostname.focus();
                F.hostname.select();
                return;
        }

        if( (selectval == 'iptime_null') )
        {
                if( (F.iptimecnt.value == 1) )
                {
                        alert( EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1);
                        return;
                }
                if(!CheckipTIMEorg(F.hostname.value))
                {
                        alert( EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG);
                        F.hostname.focus();
                        F.hostname.select();
                        return;
                }
                if( (F.userid.value.indexOf('@') == -1) )
                {
                        alert( EXPERTCONF_IPTIMEDDNS_INVALID_USERID);
                        F.userid.focus();
                        F.userid.select();
                        return;
                }
        }
        else if( (selectval == 'dyndns_null') && ( F.dyndnscnt.value == 5 ))
        {
                alert( EXPERTCONF_DYNDNS_NOMORE_WANRING1);
                return;
        }

        if( F.userid.value.length == 0 )
        {
                alert(MSG_BLANK_ACCOUNT);
                F.userid.focus();
                F.userid.select();
                return;
        }

        if((selectval != 'iptime_null') && F.passwd && F.passwd.value.length == 0 )
        {
                alert(MSG_BLANK_PASSWORD);
                F.passwd.focus();
                F.passwd.select();
                return;
        }


        F.act.value = "addhost";
        F.submit();
}

function DelHost()
{
        var F = document.dyndns_conf;

        if(CheckNoPassword(F)) return;

        F.act.value = "delhost";
        F.submit();
}

function InitDDNS()
{
        var F = document.dyndns_conf;

        if(GetValue(F.select_ddns) == 'iptime_null')
                HideIt('passwd_row');
}


</script>
