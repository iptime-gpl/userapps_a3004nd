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

	if (nwaddr)
	{
		if (CheckSameSubnet(nwaddr, F.wan1subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
		if (F.wan2subnet && F.wan2subnet.value != '' && CheckSameSubnet(nwaddr, F.wan2subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
	}

	if( document.netconf_lansetup1 && document.netconf_lansetup1.use_local_gateway && document.netconf_lansetup1.use_local_gateway.checked == true )
	{
		if(obj=CheckIP('gw'))
		{
			alert(MSG_INVALID_GATEWAY);
			obj.focus();
			obj.select();
			return 0;
		}

		if(obj=CheckIP('fdns'))
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
	}

	var rc;
	if (F.faketwinip)
		rc = confirm(MSG_RESTART_CONFIRM_CHANGE_LANIP_FAKE_TWINIP);
	else
		rc = confirm(MSG_RESTART_CONFIRM_CHANGE_LANIP);
	if (!rc) return 1;

	F.submit();
	return 1;
}

function movePage(num)
{
    self.location.href = "timepro.cgi?tmenu=netconf&smenu=lansetup&page=" + num;
}

</script>
