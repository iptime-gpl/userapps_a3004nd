<script>

function AddLsSr()
{
	var F=document.lsrule_sr_fm;
	F.act.value='sr_add';
	F.submit();
}

function DelLsSr()
{
	var F=document.sr_list_fm;
        var chkchk=false;
        var len = F.srdel.length

        if (confirm(MSG_DELETE_RULE_CONFIRM))
        {
                if(len)
                {
                        for (i=0; i < len; i++)
                        {
                                if (F.srdel[i].type == 'checkbox')
                                        if (F.srdel[i].checked)
                                                chkchk = true;
                        }
                }
                else
                {
                        if (F.srdel.checked)
                                chkchk = true;
                }
                if (chkchk == true)
                {
                        F.act.value = 'sr_del';
                        F.submit();
                } else
                        alert(MSG_SELECT_RULE_TO_DEL);
        }
}

function RunLsSr()
{
        var F = document.sr_list_fm;
        var chkchk=false;
        var len = F.srrun.length;

        if(len)
        {
                for (i=0; i < len; i++)
                {
                        if (F.srrun[i].type == 'checkbox')
                                if (F.srrun[i].checked)
                                        chkchk = true;
                }
        }
        else
        {
                if (F.srrun.checked)
                        chkchk = true;
        }
        if (chkchk == true)
        {
                if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
                {
                        F.act.value = 'sr_run';
                        F.submit();
                }
        } else
        {
                if (confirm(MSG_ALL_STOP_RULE))
                {
                        F.act.value = 'sr_run';
                        F.submit();
                }
        }
}

function DisableSrMethod(type)
{
	var F=document.lsrule_sr_fm;

	if (type == 'usertype')
		EnableObj(F.user_ipfile);
	else
		DisableObj(F.user_ipfile);
}

function getLoadShare(idx, name, ssip, seip, dsip, deip, proto, ssport, seport, dsport, deport, wan, prio)
{
	var F = document.loadshare_user_fm;

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

	ResetIP('sip');
	ResetIP('eip');
	if (ssip != '') SetIP('sip', ssip);
	if (seip != '') SetIP('eip', seip);

	ResetIP('dst_sip');
	ResetIP('dst_eip');
	if (dsip != '') SetIP('dst_sip', dsip);
	if (deip != '') SetIP('dst_eip', deip);

	F.protocol.value = proto;
	
	if (proto == 'any')
	{
		F.s_port1.value = '';
		F.s_port2.value = ''; 
		F.d_port1.value = '';
		F.d_port2.value = ''; 
		DisableObj(F.s_port1);
		DisableObj(F.s_port2);
		DisableObj(F.d_port1);
		DisableObj(F.d_port2);
	}
	else
	{
		if (ssport != '0') F.s_port1.value = ssport;
		if (seport != '0') F.s_port2.value = seport; 
		if (dsport != '0') F.d_port1.value = dsport;
		if (deport != '0') F.d_port2.value = deport; 
		EnableObj(F.s_port1);
		EnableObj(F.s_port2);
		EnableObj(F.d_port1);
		EnableObj(F.d_port2);
	}

	SetRadioValue(F.wan_name, wan);

	F.prio.value = prio;

	EnableObj(F.cancel);

	F.add.value = MODIFY_OP;
	F.act.value = 'modify';
}

function cancelLoadShare()
{
        var F = document.loadshare_user_fm;
        F.act.value = '';
        F.submit();
}

function runLoadShare()
{
	var F = document.loadshare_user_fm;
        var chkchk=false;
        var len = F.lsrun.length;

        if(len)
        {
                for (i=0; i < len; i++)
                {
                        if (F.lsrun[i].type == 'checkbox')
                                if (F.lsrun[i].checked)
                                        chkchk = true;
                }
        }
        else
        {
                if (F.lsrun.checked)
                        chkchk = true;
        }
        if (chkchk == true)
        {
                if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
                {
                        F.act.value = 'run';
                        F.submit();
                }
        } else
        {
                if (confirm(MSG_ALL_STOP_RULE))
                {
                        F.act.value = 'run';
                        F.submit();
                }
        }
}

function deleteLoadShare()
{
	var F = document.loadshare_user_fm;
	var chkchk=false;
		
	if(confirm(NATCONF_LOADSHARE_DELETE_RULE))
	{
		for(i=0; i<F.elements.length; i++)
		{
			if(F.elements[i].type == 'checkbox')
			{
				if(F.elements[i].checked)
				{
					if(chkchk == false)
						chkchk = true;
				}
			}
		}
	}
	else
		return 0;
			
	if(chkchk == true)
	{
		F.act.value = 'del';
		F.submit();
	}
	else
		alert(NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL)
}

function setProtocol()
{
	var F=document.loadshare_user_fm;
	if(F.protocol.value != 'any')
	{
		EnableObj(F.s_port1);
		EnableObj(F.s_port2);
		
		EnableObj(F.d_port1);
		EnableObj(F.d_port2);
	}
	else
	{
		DisableObj(F.s_port1);
		DisableObj(F.s_port2);
		DisableObj(F.d_port1);
		DisableObj(F.d_port2);
	}
}

function showIPList(rule_index)
{
	document.getElementsByName('trafficconf_lsrule_iplist')[0].contentWindow.location.href = 'timepro.cgi?tmenu=popup&smenu=lsrule&index=' + rule_index;
	document.getElementById('popup_blind').style.height = document.getElementById("main_table").clientHeight;
        MaskIt(document, "iplist");
}

function hideIPList()
{
        UnMaskIt(document, "iplist");
}

</script>
