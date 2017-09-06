<script>

//natrouterconf_porttrigger

function addTrigger()
{
	var F = document.ptrigger_setup_fm;
	F.act.value = "add";
	F.submit();
}

function deleteTrigger()
{
	var F = document.ptrigger_list_fm;
	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		F.act.value = "del";
		F.submit();
	}
}


//natrouterconf_portforward

function addPortForward(max_count)
{
        var F = document.portforward_setup_fm; 
        var obj; 


        if (F.rule.value > max_count)
        { 
                alert(NATCONF_PORTFORWARD_NO_MORE_RULE); 
                return;
        }
        else if (F.name.value == '')
        { 
                alert(MSG_RULE_NAME_IS_BLANK);
                F.name.focus();
                F.name.select();
                return;
        }
        else if (obj=CheckIPAllowLocalBroadcast('os_ip'))
        {
                alert(NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS);
                obj.focus();
                obj.select();
                return;
        }
/*
        else if (obj=CheckIPNetwork('os_ip'))
        {
                alert(NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS);
                obj.focus();
                obj.select();
                return;
        }

*/

        else if (F.protocol.disabled == false)
        {
                if (F.i_port1.value == '')
                {
                        alert(NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkRange(F.i_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkOptionalRange(F.i_port2.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if ((F.i_port2.value != '') && 
				(parseInt(F.i_port1.value) > parseInt(F.i_port2.value)))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if (checkOptionalRange(F.o_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.o_port1.focus();
                        F.o_port1.select();
                        return;
                }
                else if (checkOptionalRange(F.o_port2.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.o_port2.focus();
                        F.o_port2.select();
                        return;
                }
                else if ((F.o_port2.value != '') && 
				(parseInt(F.o_port1.value) > parseInt(F.o_port2.value)))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_INT_PORT_RANGE);
                        F.o_port2.focus();
                        F.o_port2.select();
                        return;
                }
        }
	if (F.act.value == '')
        	F.act.value = 'add_pf';

        F.submit();
}

function cancelmodiPortForward()
{
	var F = document.portforward_setup_fm;
	F.act.value = '';
	F.submit();
}

function deletePortForward()
{
	var F = document.portforward_list_fm;
	var chkchk=false;
	var len = F.fdel.length
	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		if(len)
		{
			for (i=0; i < len; i++)
			{
				if (F.fdel[i].type == 'checkbox')
					if (F.fdel[i].checked)
						chkchk = true;
			}
		}
		else
		{
			if (F.fdel.checked)
				chkchk = true;
		}
		if (chkchk == true)
		{
			F.act.value = 'del';
			F.submit();
		} else 
			alert(MSG_SELECT_RULE_TO_DEL);
	}
}

function RunPortForward()
{
	var F = document.portforward_list_fm;
	var chkchk=false;
	var len = F.rdi.length;
	if(len)
	{
		for (i=0; i < len; i++)
		{
			if (F.rdi[i].type == 'checkbox')
				if (F.rdi[i].checked)
					chkchk = true;
		}
	}
	else 
	{
		if (F.rdi.checked)
			chkchk = true;
	}	
	if (chkchk == true)
	{
		if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
		{
			F.act.value = 'rule_disable';
			F.submit();
		}
	} else 
	{
		if (confirm(MSG_ALL_STOP_RULE))
		{
			F.act.value = 'rule_disable';
			F.submit();
		}
	}
}

function rule_get(idx,name,proto,wan,iport1,iport2,ip1,ip2,ip3,ip4,oport1,oport2)
{
	var F = document.portforward_setup_fm;
	var F2 = document.portforward_list_fm;

        for( i=0; ; i++)
        {
                obj = document.getElementById('rule_'+i);
                if(!obj) break;
                obj.className = 'item_text';
        }
        obj = document.getElementById('rule_'+idx);
        obj.className = 'warning_string';

	F.name.value = name;
	F.name.readOnly = true;
	if (proto == 'tcp')
	{
		EnableObj(F.protocol);
		F.protocol.options[0].selected = true;
	}
	else if (proto == 'udp')
	{
		EnableObj(F.protocol); 
		F.protocol.options[1].selected = true;
	}
	else if (proto == 'all')
	{
		EnableObj(F.protocol); 
		F.protocol.options[2].selected = true;
	}


	if (F.wan_name)
	{
		if (wan == '1')
			F.wan_name.options[0].selected = true;
		else
			F.wan_name.options[1].selected = true;
	}

	if (iport1 != '0') 
	{
		F.i_port1.value = iport1; 
	}
	else {
		F.i_port1.value = '';
	}
	if (iport1 != '0' && iport2 == '0') 
	{
		F.i_port2.value = ''; 
	}
	else if (iport2 != '0') 
	{
		F.i_port2.value = iport2; 
	}
	else {
		F.i_port2.value = '';
	}
	F.os_ip1.value = ip1; F.os_ip2.value = ip2;
	F.os_ip3.value = ip3; F.os_ip4.value = ip4;
	if (oport1 != '0') 
	{
		F.o_port1.value = oport1; 
	}
	else 
	{
		F.o_port1.value = '';
	}
	if (oport1 != '0' && oport2 == '0') 
	{
		F.o_port2.value = ''; 
	}
	else if (oport2 != '0') 
	{
		F.o_port2.value = oport2; 
	}
	else 
	{
		F.o_port2.value = '';
	}
	F.rule_index.value = idx;
	EnableObj(F.modify_cancel);
	DisableObj(F2.button_run);
	DisableObj(F2.button_del);

	F.forward_submit.value = MODIFY_OP;
	F.act.value = 'modify';
}

function ApplyHWNAT()
{
	document.natrouterconf_misc_fm.act.value = 'hwnat';
	document.natrouterconf_misc_fm.submit();
}




function ChangeNatMiscForm()
{
	var F = document.natrouterconf_misc_fm;

	if(F.mc_run)
	{
		if(GetRadioValue(F.mc_run) == 0)
		{
			if (F.mc_wl) DisableObj(F.mc_wl);
			if (F.mcgroup_bt) DisableObj(F.mcgroup_bt);
		}
		else if(GetRadioValue(F.mc_run) == 1)
		{
			if (F.mc_wl) EnableObj(F.mc_wl);
			if (F.mcgroup_bt) DisableObj(F.mcgroup_bt);
		}
		else 
		{
			if (F.mc_wl) DisableObj(F.mc_wl);
			if (F.mcgroup_bt) EnableObj(F.mcgroup_bt);
		}
	}


}

</script>
