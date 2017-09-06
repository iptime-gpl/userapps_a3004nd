<script>

function maskRebootMsg( seconds, prefix, doc )
{
        function refresh( seconds )
        {
                if( seconds < 0 )
                {
                        doc.getElementById( prefix + '_seconds').innerHTML = "";
                        parent.location.reload();
                        return;
                }
                doc.getElementById( prefix + '_seconds').innerHTML = MSG_REBOOT_SECONDS_REMAINS1 + seconds + MSG_REBOOT_SECONDS_REMAINS2;
                setTimeout(function() {
                        refresh( --seconds );
                }, 1000);
        }
	doc = doc || document;
	prefix = prefix || "reboot";
        MaskIt(doc, prefix + '_mask');
        refresh( seconds );
}

function ApplyBackup( msg )
{
	if( msg )
	{
		alert(msg);
		return;
	}
	location.href = "download.cgi";
}

function RestoreDefaultConfig( seconds )
{
	var iframe = document.getElementsByName("sysconf_misc_configmgmt_submit")[0];
	var F2 = iframe.contentWindow.document.default_fm;
	
        if(!confirm(MSG_RESTART_CONFIRM_DEFAULT))
		return;

	maskRebootMsg(seconds);

	iframe.style.display = "none";
	document.getElementsByName("restore_config_file")[0].style.display = ""
	F2.submit();
}

function validateCFGFile( input )
{
	if(!input.files || !input.files[0])
		return;

	if( input.files[0].size > 1048576 )
	{
		alert(MSG_INVALID_FILE_STR);
		input.value = "";
	}
}

function RestoreConfig()
{
	var F2 = document.getElementsByName("sysconf_misc_configmgmt_submit")[0].contentWindow.document.restore_fm;
	if(F2.restore_config_file.value.length == 0 )
       	{
		alert(MSG_RESTOREFILE_BLANK);
                return;
       	}
	if(!confirm(MSG_RESTART_CONFIRM_RESTORE))
		return;

	MaskIt(document, "apply_mask");
	F2.submit();
}

function RestoreClose()
{
        alert(SYSCONF_RESTORE_RETRY_CONNET);
        top.close();
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

function UpdateMinDesc_2()
{
        var F=document.sysconf_fm;
        var min_start_obj=document.getElementById('fan_min_start');
        var min_end_obj=document.getElementById('fan_min_end');

        min_start_obj.innerHTML = parseInt(F.mintemper.value) + 1;
        min_end_obj.innerHTML = parseInt(F.maxtemper.value) - 1;
}

function ShowUSBMessage_2()
{
        var F=document.sysconf_fm;

        if(GetRadioValue(F.usb_mode) == 3 )
                ShowIt('usb30_desc');
        else
                HideIt('usb30_desc');
}

function ChangeLanIPSetupForm(F)
{
        if(GetRadioValue(F.use_local_gateway) == '0')
        {
                DisableIP('gw');
                DisableIP('fdns');
                DisableIP('sdns');
        }
        else
        {
		EnableIP('gw');
		EnableIP('fdns');
		EnableIP('sdns');
        }
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

function clickSysconf(obj)
{
	function getElements( tagName, className )
	{
		var list = document.getElementsByTagName(tagName);
		for(var i = 0; i < list.length; ++i)
			if( list[i].className.indexOf(className) >= 0 )
				return list[i];
		return null;
	}
	var prevTr = getElements("tr", "selected");

        if(prevTr)
        {
		prevTr.className = prevTr.className.replace("selected", "");
                parent.document.getElementById( prevTr.id +"_table").style.display = "none";
        }
	
        parent.document.getElementById( obj.id +"_table").style.display = "block";
	obj.className = obj.className + " selected";

        parent.document.sysconf_fm.act.value = obj.id;
	
	if(obj.id == 'restart')
		parent.document.sysconf_fm.params_bt.value = SYSCONF_APPLY_BUTTON_NAME;
	else
		parent.document.sysconf_fm.params_bt.value = SYSCONF_APPLY_ORIGINAL_VALUE;
	if(parent.document.sysconf_fm.fanReset_name)
	{
		if(obj.id == 'fan')
			parent.document.sysconf_fm.fanReset_name.style.display = "block";
		else
			parent.document.sysconf_fm.fanReset_name.style.display = "none";
	}
	if(obj.id == 'configmgmt')
		parent.document.getElementById('apply_bt').style.display = "none";
	else
                ShowItDoc(parent.document,'apply_bt');
}

function ApplySysconfig( rebootDuration )
{
	var F = document.sysconf_fm;
	var F2 = document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.main_form;
	var service = F.act.value;
	var i;

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
		var start = document.getElementsByName("ledstart")[0].value;
		var end = document.getElementsByName("ledend")[0].value;
		var run = GetRadioValue(document.getElementsByName("led"));
		
		if(run == '0' || run == '1' || run == '2')
			document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.getElementsByName("ledh")[0].value = run;

		if(run == '2')
		{
			document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.getElementsByName("ledstart")[0].value 
				= document.getElementsByName("ledstart")[0].value;
			document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.getElementsByName("ledend")[0].value 
				= document.getElementsByName("ledend")[0].value;
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
	}
	else if(service == "upnp")
	{
		var run = GetRadioValue(F.upnp);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.upnph.value = run;
	}
	else if(service == "wan_for_lan")
	{
		var run = GetRadioValue(F.wanforlan);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.wanforlanh.value= run;
	}
	else if(service == "port_role")
	{
		var port_role=GetRadioValue(F.port_role);	
		if(port_role == F2.port_role.value)
			return;
		if(!confirm(MSG_RESTART_PORT_ROLE)) return;
		F.params_bt.disabled=true;
		F2.port_role.value= GetRadioValue(F.port_role);
	}

	else if(service == "macclone_giga")
	{
		var run = GetRadioValue(F.macclone_giga);
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
		F.params_bt.disabled=true;
		F2.macclone_giga.value= run;
	}
	else if(service == "ispfake")
	{
		var run = GetRadioValue(document.getElementsByName("ispfake")); 

		if(run && document.getElementsByName("ispfake_path")[0].value == '')
		{
			alert(SYSCONF_SET_URL_TAG);
			document.getElementsByName("ispfake_path")[0].focus();
			return;	
		}
		document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.getElementsByName("ispfake")[0].value = run;
		document.getElementsByName("sysconf_misc_iframe")[0].contentWindow.document.getElementsByName("ispfake_path")[0].value
			= document.getElementsByName("ispfake_path")[0].value;
	}
	else if(service == 'hubapmode')
	{
		var chk = GetRadioValue(F.use_local_gateway);

		if(chk == '1')
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
		if(!confirm(MSG_RESTART_CONFIRM_REBOOT)) return;

		F2.use_local_gateway.value = chk;
		F2.gw1.value = F.gw1.value;
		F2.gw2.value = F.gw2.value;
		F2.gw3.value = F.gw3.value;
		F2.gw4.value = F.gw4.value;
		F2.fdns1.value = F.fdns1.value;
		F2.fdns2.value = F.fdns2.value;
		F2.fdns3.value = F.fdns3.value;
		F2.fdns4.value = F.fdns4.value;
		F2.sdns1.value = F.sdns1.value;
		F2.sdns2.value = F.sdns2.value;
		F2.sdns3.value = F.sdns3.value;
		F2.sdns4.value = F.sdns4.value;
	}
	else if(service == 'realtime')
	{
		F2.server_list.value = F.server_list.value;
		F2.server_edit.value = F.server_edit.value;
		F2.gmtidx.value = F.gmtidx.value;
		F2.summer_flag.value = ~~(F.summer_flag.checked);
	}
	else if(service === "snmp")
	{
		if ((F.snmp_service_port.value =="") || checkRange(F.snmp_service_port.value,1, 65535))
		{
			alert(SNMP_INVALID_PORT);
			F.snmp_service_port.focus();
			F.snmp_service_port.select();
			return;
		}
		if ((F.snmp_community.value ==""))
		{
			alert(SNMP_COMMUNITY_ALERT);
			F.snmp_community.focus();
			F.snmp_community.select();
			return;
		}
		F2.snmp_run.value = F.snmp_run.value;
		F2.snmp_service_port.value = F.snmp_service_port.value;
		F2.snmp_community.value = F.snmp_community.value;
		F2.snmp_sysname.value = F.snmp_sysname.value;
		F2.snmp_location.value = F.snmp_location.value;
		F2.snmp_contact.value = F.snmp_contact.value;
		F2.snmp_descr.value = F.snmp_descr.value;
	}
	else if(service === "multilang")
	{
		if(!confirm(SYSCONF_MISC_MULTILANG_WARNING))
			return;
		F2.multilang_lang.value = F.multilang_lang.value;
	}
	else if(service === "dhcp_restart")
	{
		F2.dhcp_auto_restart_1.value = GetRadioValue(document.getElementsByName("dhcp_auto_restart_1")); 
		if(F.dhcp_auto_restart_2)
			F2.dhcp_auto_restart_2.value = GetRadioValue(document.getElementsByName("dhcp_auto_restart_2")); 
	}


	F2.submit();
	MaskIt(document, 'apply_mask');
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

function Stop_refresh(val)
{
	if(val == 0)
		document.getElementById("refresh_bt").disabled=true;
	else
		document.getElementById("refresh_bt").disabled=false;;
}

function OnClickSilentLED()
{
	var F = document.misc_fm;

	if(GetValue(F.led_flag) == 2)
	{
		EnableObj(F.led_start);
		EnableObj(F.led_end);
	}
	else
	{
		DisableObj(F.led_start);
		DisableObj(F.led_end);
	}
}

function ShowUSBMessage()
{
	var F=document.usb_fm;

	if(GetRadioValue(F.usb_mode) == 3 ) 
		ShowIt('usb30_desc');
	else
		HideIt('usb30_desc');
}

function ClickEveryDay(F)
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

function ClickAutoReboot(F)
{
	var run=GetRadioValue(F.autoreboot_run);

	if(run == '1')
	{
	        EnableObj(F.everyday);
	        EnableObj(F.mon);
                EnableObj(F.tue);
                EnableObj(F.wed);
                EnableObj(F.thu);
                EnableObj(F.fri);
                EnableObj(F.sat);
                EnableObj(F.sun);
                EnableObj(F.autoreboot_hour);
                EnableObj(F.autoreboot_min);
		ClickEveryDay(F);
	}
	else
	{
		DisableObj(F.everyday);
		DisableObj(F.mon);
                DisableObj(F.tue);
                DisableObj(F.wed);
                DisableObj(F.thu);
                DisableObj(F.fri);
                DisableObj(F.sat);
                DisableObj(F.sun);
                DisableObj(F.autoreboot_hour);
                DisableObj(F.autoreboot_min);

	}


}

function UpdateMinDesc()
{
	var F=document.misc_fm;	
	var min_start_obj=document.getElementById('fan_min_start');
	var min_end_obj=document.getElementById('fan_min_end');

	min_start_obj.innerHTML = parseInt(F.mintemper.value) + 1; 
	min_end_obj.innerHTML = parseInt(F.maxtemper.value) - 1; 
}

function ClickFanMethod()
{
	var F=document.misc_fm;	

	fan_method=GetValue(F.fan_method);
	if(fan_method == "auto")
	{
		DisableObj(F.manual_op);
		EnableObj(F.mintemper);
		EnableObj(F.maxtemper);

	}
	else if(fan_method == "manual")
	{
		EnableObj(F.manual_op);
		DisableObj(F.mintemper);
		DisableObj(F.maxtemper);
	}
	
}

function SelectTimeServer()
{
      var serverList = document.getElementsByName("server_list")[0],
		serverEdit = document.getElementsByName("server_edit")[0];
      if(serverList.value == 'null')
              EnableObj(serverEdit);
      else
              DisableObj(serverEdit);
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

function OnClickSilentLED_2()
{
        var F = document.sysconf_fm;

        if(GetValue(document.getElementsByName("led")) == 2)
        {
                EnableObj(document.getElementsByName("ledstart")[0]);
                EnableObj(document.getElementsByName("ledend")[0]);
        }
        else
        {
                DisableObj(document.getElementsByName("ledstart")[0]);
                DisableObj(document.getElementsByName("ledend")[0]);
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

function ChangeSNMP()
{
	var F = document.sysconf_fm;

	if(GetValue(F.snmp_run) == "on")
	{
		EnableObj(F.snmp_service_port);
		EnableObj(F.snmp_community);
		EnableObj(F.snmp_sysname);
		EnableObj(F.snmp_location);
		EnableObj(F.snmp_contact);
		EnableObj(F.snmp_descr);
	}
	else
	{
		DisableObj(F.snmp_service_port);
		DisableObj(F.snmp_community);
		DisableObj(F.snmp_sysname);
		DisableObj(F.snmp_location);
		DisableObj(F.snmp_contact);
		DisableObj(F.snmp_descr);
	}


}

</script>
