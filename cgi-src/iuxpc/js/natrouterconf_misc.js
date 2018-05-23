<script>

function addFtpPort(max_port)
{
        var F = document.natrouterconf_fm;
        if (F.ftp_port_count.value >= max_port)
                alert(NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT)
        else if( F.ftp_port.value == '' )
                alert(NATCONF_INTAPPS_FTP_PORT_EMPTY)
        else if( isNaN(F.ftp_port.value) || (F.ftp_port.value > 65535) || (F.ftp_port.value == 80) || (F.ftp_port.value == 21) )
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
	else
        {
		MaskIt(document, 'apply_mask');

		var F2 = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document.natrouterconf_misc_ftp_fm;
                F2.act.value = 'addftpport';
                F2.ftp_port.value = F.ftp_port.value;
                F2.submit();
        }
}

function delFtpPort()
{
        var F = document.natrouterconf_fm;
	var F2 = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document.natrouterconf_misc_ftp_fm;

	MaskIt(document, 'apply_mask');

	for( var i = 0; i < 5; ++i)
		if( F['port' + i + '_ch'].checked )
			F2['port' + i + '_ch'].value = "checked";
		else
			F2['port' + i + '_ch'].value = "";

	F2.act.value = 'delftpport';
	F2.submit();
}

function ApplyPPPoE()
{
	var F = document.natrouterconf_fm, F2 = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document.natrouterconf_misc_pppoe_fm;

	MaskIt(document, 'apply_mask');
	
	for(var i = 0; i < F.pppoe_relay.length; ++i)
		if(F.pppoe_relay[i].checked)
			F2.pppoe_relay.value = F.pppoe_relay[i].value;
	F2.submit();
}

function Apply_UPNP_RELAY()
{
	var F = document.natrouterconf_fm, F2 = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document.natrouterconf_misc_upnp_relay_fm;

	MaskIt(document, 'apply_mask');
	
	for(var i = 0; i < F.upnp_relay.length; ++i)
		if(F.upnp_relay[i].checked)
			F2.upnp_relay.value = F.upnp_relay[i].value;
	F2.submit();
}

var prevTrId, prevTrColor, prevSubmitBt;

function clickNatrouterconfMiscTr( tr )
{
	if( !tr )
	{
		var id = parent.document.getElementById('menu_id').value || 'dmztwinip1';
		tr = document.getElementById(id);
	}
	var table = parent.document.getElementById( tr.id + "_table" );
	var submitButton = parent.document.getElementById( "apply_bt_" + tr.id );
	if( !table )
	{
		return;
	}
	if( prevTrId)
	{
		document.getElementById(prevTrId).style.backgroundColor = prevTrColor;
		parent.document.getElementById(prevTrId + "_table").style.display = "none";
		if( prevSubmitBt )
			prevSubmitBt.style.display = "none";
	}
	prevTrId = tr.id;
	prevTrColor = tr.style.backgroundColor;
	prevSubmitBt = submitButton;

	SetCursor( tr );
	table.style.display = "block";
	if( submitButton )
	{
		submitButton.style.display = "block";
	}
	parent.document.natrouterconf_fm.menu_id.value = tr.id;
}

function select_twinipdmz(mode, wid)
{ 
        if (mode == 1)
        { 
                HideIt('w'+wid+'hwaddr'); 
                HideIt('w'+wid+'lease_time'); 
                HideIt('twinip_info'); 
		HideIt('fake_ip'); 
                ShowIt('w'+wid+'ipaddr'); 
        } 
        else if (mode == 2) 
        { 
                ShowIt('w'+wid+'hwaddr'); 
                ShowIt('w'+wid+'lease_time'); 
                ShowIt('twinip_info'); 
		ShowIt('fake_ip'); 
                HideIt('w'+wid+'ipaddr'); 
        } 
        else    
        { 
                HideIt('w'+wid+'hwaddr'); 
                HideIt('w'+wid+'lease_time'); 
                HideIt('twinip_info'); 
		HideIt('fake_ip'); 
                HideIt('w'+wid+'ipaddr'); 
        } 
} 

function get_hwaddr(obj,wid, hw_addr)        
{ 
        if (obj.checked == false)
                ResetHW('w'+wid+'hw');
        else
                SetHW('w'+wid+'hw', hw_addr);

} 

function get_hwaddripaddr(obj,wid, hw_addr, ip_addr)        
{
	get_hwaddr(obj, wid, hw_addr);
	OnCheckEnableIP(obj, 'fake_ip', ip_addr);
}

function submit_dmztwinip( wc, needReboot, rebootCondition, rebootSeconds )
{
	function copyArrayHiddenValue( name, length )
	{
		if(!F2[name + "1"] || !F[name + "1"])
			return;

		for( var i = 1; i <= length; ++i)
			F2[name + i].value = F[name + i].value;
	}
	function copyDmzTwinipHiddenValue( wc )
	{
		for( var i = 0; i < F['w' + wc + 'mode'].length; ++i)
			if(F['w' + wc + 'mode'][i].checked)
				F2['w' + wc + 'mode'].value = F['w' + wc + 'mode'][i].value;
		F2['w' + wc + 'leasetime'].value = F['w' + wc + 'leasetime'].value;
		F2['get_w' + wc + 'hosthw'].value = F['get_w' + wc + 'hosthw'].value;
		copyArrayHiddenValue( "fake_ip", 4)
		copyArrayHiddenValue( "w" + wc + "ip", 4)
		copyArrayHiddenValue( "w" + wc + "hw", 6)
	}
	var F = document.natrouterconf_fm, F2 = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document['natrouterconf_misc_dmztwinip' + wc + '_fm'];
	var obj, opmode = 'w' + wc + 'mode', opmode_value;
	for( var i = 0; i < F[opmode].length; ++i)
		if(F[opmode][i].checked)
			opmode_value = F[opmode][i].value;
	if( opmode_value == 1 )
	{
                var ip = 'w' + wc + 'ip';
                if(obj=CheckIP(ip))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
			obj.select();
                        return;
                }
                if(obj=CheckIPNetwork(ip))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
			obj.select();
                        return;
                }
	}
	else if( opmode_value == 2 )
	{
                var hw = 'w' + wc + 'hw';
                var leasetime = 'w' + wc + 'leasetime';

                if(obj=CheckHW(hw))
                {
                        alert(MSG_INVALID_HWADDR);
                        obj.focus();
			obj.select();
                        return;
                }
		obj = document.getElementById(leasetime);
		if(isNaN(Number(obj.value)))
		{
			alert(MSG_INPUT_TYPE_ERROR_LEASETIME_NUMBER);
                        obj.focus();
			obj.select();
			return;
		}
                if(obj.value < 60)
                {
                        alert(NATCONF_TWINIPDMZ_UPDATE_TIME);
                        obj.focus();
			obj.select();
                        return;
                }
                if((obj = document.getElementById('fake_ip')) && (obj=CheckIP('fakeip')))
                {
                        alert(MSG_INVALID_IP);
			if( obj) {
				obj.focus();
				obj.select();
			}
                        return;
                }
	}
	if( needReboot && rebootCondition == F['w' + wc + 'mode'].value )
	{
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT))
			return;
		maskRebootMsg( rebootSeconds );
	}
	else
		MaskIt(document, 'apply_mask');

	copyDmzTwinipHiddenValue( wc );
	F2.submit();
}

function popup_search_mac( href )
{
	document.getElementsByName("mac_list")[0].contentWindow.location.href = href;
	MaskIt(document, 'search_popup');
}

function applyNatOnOff( reboot_seconds )
{
	if(!confirm(MSG_RESTART_CONFIRM_NAT))
		return;
	maskRebootMsg( reboot_seconds );

	var F = document.getElementsByName('natrouterconf_misc_submit')[0].contentWindow.document.natrouterconf_misc_natonoff_fm;
	if(document.getElementById("nat_on").checked)
		F.nat_run.value = "1";
	else
		F.nat_run.value = "0";
	F.submit();
}

function maskRebootMsg( second )
{
	function refresh( second )
	{
		if( second < 0 )
		{
			document.getElementById('reboot_seconds').innerHTML = "";
			location.reload();
			return;
		}
		document.getElementById('reboot_seconds').innerHTML = MSG_REBOOT_SECONDS_REMAINS1 + second + MSG_REBOOT_SECONDS_REMAINS2;
		setTimeout(function() {
			refresh( --second );
		}, 1000);
	}

	MaskIt(document, 'reboot_mask');
	refresh( second );
}

function trMouseOverEvent( tr )
{
	tr.className += " selected";
}

function trMouseOutEvent( tr )
{
	tr.className = tr.className.replace("selected", "");
}

</script>
