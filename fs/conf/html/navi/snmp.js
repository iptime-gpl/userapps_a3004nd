<script>
function ChangeSNMP()
{
	var F=document.snmp_fm;

	if(GetValue(F.run) == "on")
	{
		EnableObj(F.service_port);
		EnableObj(F.community);
		EnableObj(F.sysname);
		EnableObj(F.location);
		EnableObj(F.contact);
		EnableObj(F.descr);
	}
	else
	{
		DisableObj(F.service_port);
		DisableObj(F.community);
		DisableObj(F.sysname);
		DisableObj(F.location);
		DisableObj(F.contact);
		DisableObj(F.descr);
	}


}

function ApplySNMP()
{
	var F=document.snmp_fm;

	if ((F.service_port.value =="") || checkRange(F.service_port.value,1, 65535))
	{
		alert(SNMP_INVALID_PORT);
		F.service_port.focus();
		F.service_port.select();
		return;
	}

	if ((F.community.value ==""))
	{
		alert(SNMP_COMMUNITY_ALERT);
		F.community.focus();
		F.community.select();
		return;

	}

	F.act.value = "snmp";
	F.submit();
}
</script>
