<script>

// config wizard

function WizardGotoPage(step)
{
        var F = document.wizard;
        var wizardtype;


	if(!F.config)
	{
                F.step.value = step;
                F.submit();
		return;
	}

        wizardtype=GetRadioValue(F.config);
        if(wizardtype == '')
                wizardtype = F.config.value;
        if(wizardtype == '')
        {
                alert("Debug it");
                return;
        }


        if(wizardtype == 'auto')
        {
                if(step == 4)
                {
                        if(F.userid.value == '')
                        {
                                alert(MSG_BLANK_ACCOUNT);
                                F.userid.focus();
                                F.userid.select();
                                return;
                        }
                        else if(F.passwd.value == '')
                        {
                                alert(MSG_BLANK_PASSWORD);
                                F.passwd.focus();
                                F.passwd.select();
                                return;
                        }
                }

                F.step.value = step;
                F.submit();
        }
        else if(wizardtype == 'manual')
        {
                if(step == 3)
                {
                        var wan_type = F.wan_type.value;
                        if(wan_type == 'dynamic')
                        {
                                var hw_conf = GetRadioValue(F.hw_conf);
                                if(hw_conf == 'manual')
                                {
                                        var obj;
                                        if(obj=CheckHW('hw'))
                                        {
                                                obj.focus();
                                                obj.select();
                                                alert(MSG_INVALID_HWADDR);
                                                return;
                                        }
                                }
                        }
                        else if(wan_type == 'pppoe')
                        {
                                if(F.userid.value == '')
                                {
                                        F.userid.focus();
                                        F.userid.select();
                                        alert(MSG_BLANK_ACCOUNT);
                                        return;

                                }
                                else if(F.passwd.value == '')
                                {
                                        F.passwd.focus();
                                        F.passwd.select();
                                        alert(MSG_BLANK_PASSWORD);
                                        return;
                                }

                        }
                       else if(wan_type == 'static')
                        {
                                if(obj=CheckIP('ip'))
                                {
                                        obj.focus();
                                        obj.select();
                                        alert(MSG_INVALID_IP);
                                        return;
                                }
                                else if(obj=CheckMask('sm'))
                                {
                                        obj.focus();
                                        obj.select();
                                        alert(MSG_INVALID_NETMASK);
                                        return;
                                }
                                else if(obj=CheckIP('gw'))
                                {
                                        obj.focus();
                                        obj.select();
                                        alert(MSG_INVALID_GATEWAY);
                                        return;
                                }
                                else if(obj=CheckIP('fdns'))
                                {
                                        obj.focus();
                                        obj.select();
                                        alert(MSG_INVALID_FDNS);
                                        return;
                                }
                                else if(obj=CheckOptionalIP('sdns'))
                                {
                                        obj.focus();
                                        obj.select();
                                        alert(MSG_INVALID_SDNS);
                                        return;
                                }
                        }
                }

                if(step  == 'save')
                {
                        F.commit.value = "manual_config_wizard";
                        F.nextstep.value = "finish";
                }

                F.step.value = step;
                F.submit();
        }
}

</script>

