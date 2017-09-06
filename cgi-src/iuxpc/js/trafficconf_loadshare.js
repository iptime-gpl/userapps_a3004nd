<script>

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

function submit_primary()
{
	var F=document.loadshare_fm;
	F.act.value='primary_submit';
	F.submit();
}

function check_linebackup(flag)
{
	var F = document.loadshare_fm;
	if(flag==1)
	{
		if(F.wrr_op_radio[0].checked == true)
		{
			alert(NATCONF_LOADSHARE_KEEP_WRR);
			F.lnbk_radio[0].checked = true;
		}
	}
	else
	{
		if(F.wrr_op_radio[0].checked == true && F.lnbk_radio[0].checked == false)
		{
			if (confirm(NATCONF_LOADSHARE_ON_LINE_BACKUP))
				F.lnbk_radio[0].checked = true;
			else
				F.wrr_op_radio.checked = false;
		
		}
	}
}

function submit_lnbk()
{
	var F=document.loadshare_fm;

	if ((F.arpchk.checked == 0) && (F.pingchk.checked == 0) && (F.dnschk.checked == 0))
	{
		alert(MSG_BACKUP_METHOD_AT_LEAST_ONE);
		return;
	}
	if (F.dnschk.checked && (F.domain.value == ''))
	{
		alert(MSG_BACKUP_METHOD_DOMAIN);
		F.domain.focus();
		return;
	}

	F.act.value='lnbk_submit';
	F.submit();
}

function submit_wrr()
{
	var F=document.loadshare_fm;
	F.act.value = 'wrr_submit';
	F.submit();
}





</script>
