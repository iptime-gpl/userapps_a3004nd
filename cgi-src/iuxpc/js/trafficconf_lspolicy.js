<script>

function submit_wrr()
{
	var F=document.loadshare_fm;
	F.act.value = 'wrr_submit';
	F.submit();
}

function submit_primary()
{
	var F=document.loadshare_fm;
	F.act.value='primary_submit';
	F.submit();
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

function showIPwrrList()
{
	document.getElementsByName('trafficconf_lspolicy_ipwrrlist')[0].contentWindow.location.href = 'timepro.cgi?tmenu=popup&smenu=lspolicy&ipwrrlist=1';
        MaskIt(document, "ipwrrlist");
}

function hideIPwrrList()
{
        UnMaskIt(document, "ipwrrlist");
}



</script>
