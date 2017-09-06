<script>

function AddVLAN(numlan)
{
	var F=document.vlanform;
	var i;

	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('chk_port'+i);
		if (!obj) 
			continue;
		if (obj[0].checked == true)
			break;
	}

	if (i > numlan)
		alert(SELECT_VLAN_PORT_WARNING);
	else
	{
		F.act.value = 'addvlan';
		F.submit();
	}
}

function RemoveVLAN()
{
    var F=document.vlanform;
    F.act.value = 'removevlan';
    F.submit();
}

function ApplyUnicast()
{
    var F=document.vlanform;
    F.act.value = 'unicast';
    F.submit();
}

function ApplyHwCRC() 
{ 
	var F=document.hwcrc_fm;
	F.act.value='apply_hwcrc';
	F.submit();
}

function refreshPortmirror( mainDoc )
{
	mainDoc.getElementsByName('trafficconf_switch_portmirror')[0].contentWindow.document.getElementsByName('trafficconf_switch_portmirror_status')[0].contentWindow.location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_switch_portmirror_status";
}

function refreshJumboFrame( mainDoc )
{
	mainDoc.getElementsByName('trafficconf_switch_jumboframe')[0].contentWindow.document.getElementsByName('trafficconf_switch_jumboframe_status')[0].contentWindow.location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_switch_jumboframe_status";
}

function refreshPortTrunk( mainDoc )
{
	mainDoc.getElementsByName('trafficconf_switch_trunk')[0].contentWindow.document.getElementsByName('trafficconf_switch_trunk_status')[0].contentWindow.location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_switch_trunk_status";
}



function ApplyPortMirror( runTrunk )
{
        var F = document.portmirror_fm,
		F2 = document.getElementsByName('trafficconf_switch_portmirror_status')[0].contentWindow.document.portmirror_fm;

	if( runTrunk )
	{
		alert(TRAFFICCONF_SWITCH_WARNING_TURNOFF_TRUNK);
		return;
	}

	F2.mirror_chk.checked = F.mirror_chk.checked;

	MaskIt(parent.document, 'apply_mask');
        F2.act.value='apply_mirror';
        F2.submit();
}

function ApplyJumboFrame()
{
        var F=document.jumboframe_fm,
		F2 = document.getElementsByName('trafficconf_switch_jumboframe_status')[0].contentWindow.document.jumboframe_fm;

	F2.enable.checked = F.enable.checked;

	MaskIt(parent.document, 'apply_mask');
        F2.act.value='jumbo';
        F2.submit();
}

function ApplyTrunk( runMirror )
{
        var F=document.trunk_fm,
		F2 = document.getElementsByName('trafficconf_switch_trunk_status')[0].contentWindow.document.trunk_fm;

	if( runMirror )
	{
		alert(TRAFFICCONF_SWITCH_WARNING_TURNOFF_PORTMIRROR);
		return;
	}

	F2.trunk_chk.checked = F.trunk_chk.checked;
	
	MaskIt(parent.document, 'apply_mask');
        F2.act.value='apply_trunk';
        F2.submit();
}

function ChangePortMirror()
{
        if( document.getElementsByName("enable")[0].checked == true)
        {
                EnableObj(document.getElementsByName("mirror_port")[0]);
                EnableObj(document.getElementsByName("mirrored_port")[0]);
        }
        else
        {
                DisableObj(document.getElementsByName("mirror_port")[0]);
                DisableObj(document.getElementsByName("mirrored_port")[0]);
        }
}

function ApplyAdvancedPortMirror()
{
        var F = document.portmirror_fm;
        var checked = 0;

        if( document.getElementsByName("enable")[0].checked == false)
        {
                F.act.value = 'apply';
                F.submit();
                return;
        }

        if(document.getElementsByName("mirror_port")[0].value == document.getElementsByName("mirrored_port")[0].value)
        {
                alert(MSG_SAME_PORT_MIRROR);
                return;
        }

        F.act.value = 'apply';
        F.submit();
}



</script>
