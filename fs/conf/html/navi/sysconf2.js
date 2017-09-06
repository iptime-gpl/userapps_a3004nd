<script>

function clickSysconf(obj)
{
        var prev_id = document.main_form.click_id.value;
        var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = obj.id;

        if(prev_id == click_id) return;
	
        if(prev_id)
        {
                document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
                parent.document.getElementById(prev_id+"_table").style.display = "none";
        }
	
        parent.document.getElementById(click_id+"_table").style.display = "block";
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;
        SetCursor_2(obj);
        parent.document.sysconf_fm.act.value = obj.id;
	
	if(obj.id == 'restart')
	{
		parent.document.sysconf_fm.params_bt.value = SYSCONF_APPLY_BUTTON_NAME;
		if(parent.document.sysconf_fm.fanReset_name)
			parent.document.sysconf_fm.fanReset_name.style.display = "none";
	}
	else if(obj.id == 'fan')
	{
		if(parent.document.sysconf_fm.fanReset_name)
			parent.document.sysconf_fm.fanReset_name.style.display = "block";
	}
	else
	{
		parent.document.sysconf_fm.params_bt.value =SYSCONF_APPLY_ORIGINAL_VALUE;
		if(parent.document.sysconf_fm.fanReset_name)
			parent.document.sysconf_fm.fanReset_name.style.display = "none";
                ShowItDoc(parent.document,'apply_bt');
	}
}

function SetCursor_2(obj)
{
        if(obj)
        {
                obj.style.backgroundColor='#C9D5E9';
                obj.style.color='#000000';
        }
}

function ApplySysconfig()
{
	var F = document.sysconf_fm;
	var F2 = sysconf_misc_iframe.main_form;
	var service = F.act.value;
	var i;
	var reboot_flag = 0;

	F2.service.value = service;

	if(service == 'hostname')
	{
		var hostName_len = F.hostname.value.length;

		if(CheckUnpermittedChars(F.hostname.value))
		{
			alert(SYSCONF_INVALID_HOSTNAME+'\n'+UNPERMITTED_STR_PREFIX+UNPERMITTED_CHARS);
			F.hostname.focus();
			return;
		}

		F2.hostnameh.value = F.hostname.value;
	}
	else if(service == 'autosaving')
	{
		var run = GetRadioValue(F.autosaving); 
		F2.autosavingh.value = run;
	}
	else if(service == 'mgmt_port')
	{
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;

		if(F.mgmt_port_method.checked == true)
			F2.mgmt_port.value = '80';
		else
			F2.mgmt_port.value = F.mgmt_port.value;

		reboot_flag=1;
	}
	else if(service == 'fakedns')
	{
		var run = GetRadioValue(F.fakedns);
		F2.fakednsh.value = run;
	}
	else if(service == 'nologin')
	{
		var run = GetRadioValue(F.nologin);
		F2.nologinh.value = run;
	}
	else if(service == 'wbmpopup')
	{
		var run = GetRadioValue(F.wbmpopup);
		F2.wbmpopuph.value = run;
	}
	else if(service == 'remotesupport')
	{
		var run = GetRadioValue(F.remotesupport);
		F2.remotesupporth.value = run;
	}
	else if(service == 'apcplan')
	{
		var run = GetRadioValue(F.apcplan);
		F2.apcplanh.value = run;
	}
	else if(service == 'usb_mode')
	{
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		var run = GetRadioValue(F.usb_mode);
		F2.usbmodeh.value = run;
		reboot_flag = 1;
	}
	else if(service == 'fan')
	{
		var run = GetRadioValue(F.fan);
		
		if(run == 'auto')
		{
			if((isInteger(F.mintemper.value)==false) || (Number(F.mintemper.value)<0 || Number(F.mintemper.value)>100))
			{
				alert(SYSCONF_INVALID_TEMPERATURE);
				F.mintemper.focus();
				F.mintemper.select();
				return;
			}

			if((isInteger(F.maxtemper.value)==false) || (Number(F.maxtemper.value)<0 || Number(F.maxtemper.value)>100))
			{
				alert(SYSCONF_INVALID_TEMPERATURE);
				F.maxtemper.focus();
				F.maxtemper.select();
				return;
			}

			if((Number(F.mintemper.value)+2) >= Number(F.maxtemper.value) )
			{
				alert(SYSCONF_FAN_ALERT);
				return;
			}

			F2.mintemper.value = F.mintemper.value;
			F2.maxtemper.value = F.maxtemper.value;	
		}
		else if(run == 'manual')
		{
			F2.manualop.value = F.manualop.value;
		}
		F2.fanh.value = run;
	}
	else if(service == 'led')
	{
		var start = F.ledstart.value;
		var end = F.ledend.value;
		var run = GetRadioValue(F.led);
		
		if(run == '0')
		{
			F2.ledh.value = run;
		}
		else if(run == '1')
		{
			F2.ledh.value = run;
		}
		else if(run == '2')
		{
			F2.ledh.value = run;
			F2.ledstart.value = F.ledstart.value;
			F2.ledend.value = F.ledend.value; 
		}

	}
	else if(service == 'autoreboot')
	{
		var run = GetRadioValue(F.autoreboot);
		if(run == '1')
		{
			F2.autorebooth.value = run;
			
			if(F.everyday.checked==true)
				F2.everyday.value = F.everyday.value;
			else 
			{
				if(F.sun.checked==true)
					F2.sun.value = F.sun.value;
				if(F.mon.checked==true)
					F2.mon.value=F.mon.value;
				if(F.tue.checked==true)
					F2.tue.value=F.tue.value;
				if(F.wed.checked==true)
					F2.wed.value=F.wed.value;
				if(F.thu.checked==true)
					F2.thu.value=F.thu.value;
				if(F.fri.checked==true)
					F2.fri.value=F.fri.value;
				if(F.sat.checked==true)
					F2.sat.value = F.sat.value;
			}
			F2.autorebootHour.value = F.autorebootHour.value;
			F2.autorebootMin.value = F.autorebootMin.value;
		}
		else if(run == '0')
		{
			F2.autorebooth.value = run;
		}
	}
	else if(service == "restart")
	{
	        if(service == 'restart' && !confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled = true;
		F2.restarth.value = 1;
		reboot_flag = 1;
	}
	else if(service == "upnp")
	{
		var run = GetRadioValue(F.upnp);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.upnph.value = run;
		reboot_flag = 1;
	}
	else if(service == "wan_for_lan")
	{
		var run = GetRadioValue(F.wanforlan);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.wanforlanh.value= run;
		reboot_flag = 1;
	}
	else if(service == "port_role")
	{
		var port_role=GetRadioValue(F.port_role);	
		if(port_role == F2.port_role.value)
			return;
		if(!confirm(MSG_RESTART_PORT_ROLE)) return;
		F.params_bt.disabled=true;
		F2.port_role.value= GetRadioValue(F.port_role);
		reboot_flag = 1;
	}

	else if(service == "macclone_giga")
	{
		var run = GetRadioValue(F.macclone_giga);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.macclone_giga.value= run;
		reboot_flag = 1;
	}
	else if(service == "ispfake")
	{
		var run = GetRadioValue(F.ispfake); 

		if(run && F.ispfake_path.value == '')
		{
			alert(SYSCONF_SET_URL_TAG);
			F.ispfake_path.focus();
			return;	
		}

		F2.ispfake.value = run;
		F2.ispfake_path.value= F.ispfake_path.value;
	}


	F2.submit();
	if(reboot_flag == 1)
	{
		MaskIt(document, 'apply_mask_sysconf_reboot');
		var check_time_rs = setInterval(restart_time_check,1000);
	}
	else
	{
		MaskIt(document, 'apply_mask_sysconf');
	}
}

function upnp_display(val)
{
	if(val ==1)
	{
		document.getElementById('iframe_upnp').style.display="block";
		document.getElementById('upnp_div').style.display="block";
		document.getElementById('upnp_desc').style.display="block";
	}
	else
	{
		document.getElementById('iframe_upnp').style.display="none";
		document.getElementById('upnp_div').style.display="none";
		document.getElementById('upnp_desc').style.display="none";
	}
}

function Stop_refresh(val)
{
	if(val == 0)
		document.getElementById("refresh_bt").disabled=true;
	else
		document.getElementById("refresh_bt").disabled=false;;
}

function restart_time_check()
{
	if(time > 0)
		time--;
	else if(time == 0)
	{
		var F = document.sysconf_fm;

		if(F.act.value == 'mgmt_port')
		{
			if(F.local_ip && F.local_ip.value)
				location.href='http://'+F.local_ip.value+':'+F.mgmt_port.value;
			else
				location.href='timepro.cgi?tmenu=sysconf&smenu=misc';
		}
		else
			location.href='timepro.cgi?tmenu=sysconf&smenu=misc';
		//location.href='http://192.168.0.1';
	}
	document.getElementById('apply_mask_time_check').innerHTML = time;
}


function OnClickSilentLED_2()
{
        var F = document.sysconf_fm;

        if(GetValue(F.led) == 2)
        {
                EnableObj(F.ledstart);
                EnableObj(F.ledend);
        }
        else
        {
                DisableObj(F.ledstart);
                DisableObj(F.ledend);
        }
}

function ClickAutoReboot_2(F)
{
        var run=GetRadioValue(F.autoreboot);
	if(run != 1)
        {
		DisableObj(F.everyday);
                DisableObj(F.mon);
                DisableObj(F.tue);
                DisableObj(F.wed);
                DisableObj(F.thu);
                DisableObj(F.fri);
                DisableObj(F.sat);
                DisableObj(F.sun);
                DisableObj(F.autorebootHour);
                DisableObj(F.autorebootMin);
        }
        else
        {
		EnableObj(F.everyday);
                EnableObj(F.mon);
                EnableObj(F.tue);
                EnableObj(F.wed);
                EnableObj(F.thu);
                EnableObj(F.fri);
                EnableObj(F.sat);
                EnableObj(F.sun);
                EnableObj(F.autorebootHour);
                EnableObj(F.autorebootMin);
                ClickEveryDay(F);
        }
}


function ClickEveryDay_2(F)
{
        if(F.everyday.checked == true)
        {
                DisableObj(F.mon);
                DisableObj(F.tue);
                DisableObj(F.wed);
                DisableObj(F.thu);
                DisableObj(F.fri);
                DisableObj(F.sat);
                DisableObj(F.sun);
        }
        else
        {
                EnableObj(F.mon);
                EnableObj(F.tue);
                EnableObj(F.wed);
                EnableObj(F.thu);
                EnableObj(F.fri);
                EnableObj(F.sat);
                EnableObj(F.sun);
        }

}

function UpdateMinDesc_2()
{
        var F=document.sysconf_fm;
        var min_start_obj=document.getElementById('fan_min_start');
        var min_end_obj=document.getElementById('fan_min_end');

        min_start_obj.innerHTML = parseInt(F.mintemper.value) + 1;
        min_end_obj.innerHTML = parseInt(F.maxtemper.value) - 1;
}

function ClickFanMethod_2()
{
        var F=document.sysconf_fm;

        fan=GetValue(F.fan);
        if(fan == "auto")
        {
		document.getElementById('fan_auto_div').style.display="block";
		document.getElementById('fan_manual_div').style.display="none";
                DisableObj(F.manualop);
                EnableObj(F.mintemper);
                EnableObj(F.maxtemper);

        }
        else if(fan == "manual")
        {
		document.getElementById('fan_manual_div').style.display="block";
                document.getElementById('fan_auto_div').style.display="none";
                EnableObj(F.manualop);
                DisableObj(F.mintemper);
                DisableObj(F.maxtemper);
        }
}

function ShowUSBMessage_2()
{
        var F=document.sysconf_fm;

        if(GetRadioValue(F.usb_mode) == 3 )
                ShowIt('usb30_desc');
        else
                HideIt('usb30_desc');
}


function fan_reset(min,max)
{
	var F=document.sysconf_fm;
	F.fan[0].checked =true;
	document.getElementById('fan_auto_div').style.display="block";
        document.getElementById('fan_manual_div').style.display="none";
	DisableObj(F.manualop);
        EnableObj(F.mintemper);
        EnableObj(F.maxtemper);
	F.mintemper.value = min;
	F.maxtemper.value = max;
	UpdateMinDesc_2();
}


function ClickMgmtPortMethod()
{
        var F = document.sysconf_fm;

        if(!F.mgmt_port_method)
                return;

        if(F.mgmt_port_method.checked == false)
                ReadOnlyObj(F.mgmt_port,0);
        else
        {
                F.mgmt_port.value=80;
                ReadOnlyObj(F.mgmt_port,1);
        }
}


</script>
