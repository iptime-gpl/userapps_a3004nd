<script>

// netconf_lansetup
function CheckLanIPChange(F)
{
	var obj;
	
	if(obj=CheckIP('ip'))
	{
	        alert(MSG_INVALID_IP);
	        obj.focus();
	        obj.select();
	        return 0;
	}

	if(obj=CheckMask('sm'))
	{
		alert(MSG_INVALID_NETMASK);
	        obj.focus();
	        obj.select();
		return 0;
	}

	nwaddr = GetNetworkAddress('ip', 'sm');
	braddr  = GetLocalBroadcastAddress('ip', 'sm');
	ipaddr  = GetIP('ip');

	if(nwaddr == ipaddr )
	{
		alert(MSG_ERROR_NETWORK_LANIP);
		return 0;
	}

	if(braddr == ipaddr )
	{
		alert(MSG_ERROR_BROAD_LANIP);
		return 0;
	}

	if(obj=CheckOptionalIP('gw'))
	{
		alert(MSG_INVALID_GATEWAY);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckOptionalIP('fdns'))
	{
		alert(MSG_INVALID_FDNS);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckOptionalIP('sdns'))
	{
		alert(MSG_INVALID_SDNS);
		obj.focus();
		obj.select();
		return 0;
	}

	if(F.old_ip.value != ipaddr)
		ApplyReboot(F, 'lanip_chg');
	else
	{
		F.act.value='apply';
		F.submit();
	}
		
	return 1;
}

</script>
