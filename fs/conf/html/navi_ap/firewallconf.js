<script>

//firewallconf_internet
function rp_submit()
{
	var F = document.rp_form;;
	if ((F.rp_count.value < 1) || (F.rp_count.value > 253))
	{
		alert(FIREWALLCONF_INTERNET_RESTRICTIVE_WARNING );
		return;
	}
	F.act.value = "rp_apply";
	F.submit();
}

function rp_clear_submit()
{
	var F = document.rp_form;
	if (confirm(FIREWALLCONF_INTERNET_RESTRICTIVE_CLEARANCE) == false)
		return;
	F.act.value = "rp_clear";
	F.submit();
}

// firewallconf_firewall
function check_timerange_firewall()
{
	var F = document.firewall_setup_fm;
	if (F.fullhours.checked)
		return 0;
	if ((parseInt(F.start_time.value) >= parseInt(F.end_time.value)) && (parseInt(F.end_time.value)))
		return 1;
	return 0;
}

function check_date_firewall()
{
	var F = document.firewall_setup_fm;
	if ((F.Every.checked == 0) && (F.Sun.checked == 0) && (F.Mon.checked == 0) &&
	    (F.Tue.checked == 0) && (F.Wed.checked == 0) && (F.Thu.checked == 0) &&
	    (F.Fri.checked == 0) && (F.Sat.checked == 0))
		return 1;
	return 0;
}

function check_ip_firewall()
{
	var F = document.firewall_setup_fm;
	var obj;
	if (F.allip.checked)
		return 1;
	else if (obj=CheckIP('ssip'))
	{
	    obj.focus();
	    obj.select();
	    return 0;
	}
	else if (obj=CheckOptionalIP('seip'))
	{
	    obj.focus();
	    obj.select();
	    return 0;
	}
	else if((parseInt(F.ssip4.value) +  parseInt(F.ssip3.value) * 256 +  
	    parseInt(F.ssip2.value) * 65536 +  parseInt(F.ssip1.value) * 16777216 ) >= 
	   (parseInt(F.seip4.value) +  parseInt(F.seip3.value) * 256 +  
	    parseInt(F.seip2.value) * 65536 +  parseInt(F.seip1.value) * 16777216 )) 
	{
		F.seip4.focus();
		F.seip4.select();
 		return 0; 
	}
	else if (obj=CheckOptionalIP('dsip'))
	{
	    obj.focus();
	    obj.select();
	    return 0;
	}
	else if (obj=CheckOptionalIP('deip'))
	{
	    obj.focus();
	    obj.select();
	    return 0;
	}
	else if((parseInt(F.dsip4.value) +  parseInt(F.dsip3.value) * 256 +  
	    parseInt(F.dsip2.value) * 65536 +  parseInt(F.dsip1.value) * 16777216 ) >= 
	   (parseInt(F.deip4.value) +  parseInt(F.deip3.value) * 256 +  
	    parseInt(F.deip2.value) * 65536 +  parseInt(F.deip1.value) * 16777216 )) 
	{
		F.deip4.focus();
		F.deip4.select();
 		return 0; 
	}
	else
		return 1;
}


function print_firewall_ip_form(F, disable)
{
        if (disable)
        {
                DisableIP('ssip');
                if (F.seip1) DisableIP('seip');
                DisableObj(F.allip);
        }
        else
        {
                EnableIP('ssip');
                if (F.seip1) EnableIP('seip');
                EnableObj(F.allip);
        }
        F.ssip4.value = '';
        if (F.seip4) F.seip4.value = '';
        F.allip.checked = 0
}

function print_firewall_mac_form(F, disable)
{
        if (disable)
        {
                DisableHW('hw');
                DisableObj(F.macbutton);
        }
        else
        {
                EnableHW('hw');
                EnableObj(F.macbutton);
        }
}

function print_js_one_ip_form(F, disable)
{
        if (disable)
        {
                DisableIP('ssip');
                if (F.seip1) DisableIP('seip');
        }
        else
        {
                EnableIP('ssip');
                if (F.seip1) EnableIP('seip');
        }
        F.ssip4.value = '';
        if (F.seip4) F.seip4.value = '';
}


function AddFWSched()
{
	var F = document.firewall_setup_fm;
	var obj;

        if (F.rule_count.value > MAX_FWSCHED_COUNT)
        { 
                alert(FIREWALLCONF_FIREWALL_NO_MORE_RULE); 
                return;
        }
	else if (F.name.value == '')
	{
		alert(MSG_RULE_NAME_IS_BLANK);
		F.name.focus();
		F.name.select();
		return;
	}
	else if(F.user_sched.checked == true)
	{
		if (check_timerange_firewall())
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_TIME_TO_BLOCK);
			return;
		}
		if(check_date_firewall())
		{
			alert(FIREWALLCONF_FIREWALL_DATE_WARNING);
			return;
		}
	}
	if (F.sel_addr[0].checked == true && !check_ip_firewall())
	{
		alert(FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP);
		return;
	}
	if (F.sel_addr[1].checked == true)
	{
		if(obj=CheckHW('hw'))
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW);
			obj.focus();
			obj.select();
			return;
		}
	}
	if (checkOptionalRange(F.prio.value, 0,F.rule_count.value))
	{
		alert(FIREWALLCONF_FIREWALL_INVALID_PRIORITY);
		F.prio.focus();
		F.prio.select();
		return;
	}
	if(F.sel_template.value == '1')
	{
		if ((F.protocol[0].selected != true) && (F.port.value == ''))
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_DEST_PORT);
			F.port.focus();
			F.port.select();
			return;
		}
		if (checkOptionalRange(F.port.value, 1, 65535))
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_DEST_PORT);
			F.port.focus();
			F.port.select();
			return;
		}
		if (checkOptionalRange(F.port2.value, 1, 65535))
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_DEST_PORT);
			F.port2.focus();
			F.port2.select();
			return;
		}
	}
	if(F.sel_template.value == '0' || F.sel_template.value == '1')
		F.rule_type.value = USER_FWSCHED_TYPE
	else if(F.sel_template.value == '2')
		F.rule_type.value = URL_FWSCHED_TYPE
	else
		F.rule_type.value = APP_FWSCHED_TYPE

	F.act.value = 'add_fw'
	F.submit();
}

function DelFWSched()
{
	var F = document.firewall_list_fm;
	var chkchk=false;
	var len = F.fdel.length;
	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		if(len)
		{
			for (i=0; i < len; i++)
			{
				if (F.fdel[i].type == 'checkbox')
					if (F.fdel[i].checked)
						chkchk = true;
			}
		}
		else if (F.fdel.checked)
				chkchk = true;

		if (chkchk == true)
		{
			F.act.value = 'del_fw';
			F.submit();
		} else 
			alert(MSG_SELECT_RULE_TO_DEL);
	}
}

function RunFWSched()
{
	var F = document.firewall_list_fm;
	var chkchk=false;
	var len = F.rdi.length;
	if(len)
	{
		for (i=0; i < len; i++)
		{
			if (F.rdi[i].type == 'checkbox')
				if (F.rdi[i].checked)
					chkchk = true;
		}
	}
	else if (F.rdi.checked)
			chkchk = true;
	if (chkchk == true)
	{
		if (confirm(FIREWALLCONF_FIREWALL_RUN_RULE))
		{
			F.act.value = 'disable_fw';
			F.submit();
		}
	} else {
		if (confirm(MSG_ALL_STOP_RULE))
		{
			F.act.value = 'disable_fw';
			F.submit();
		}
	}
}

var old_filter = '';
function ShowFilter(filter)
{
	if( old_filter != filter ) {
		if( old_filter !='' ) 
			old_filter.style.display = 'none';
		if (navigator.appName.indexOf("Microsoft") != -1)
			filter.style.display = 'block';
		else
			filter.style.display = 'table-row';
					
		old_filter = filter;
	} else {
		filter.style.display = 'none';
		old_filter = '';
	}
}

function displaySchedTable()
{
	var F = document.firewall_setup_fm;
	if(F.user_sched.checked == true)
	{
		if (navigator.appName.indexOf("Microsoft") != -1)
		{
			block_day.style.display = 'block';
			block_time.style.display = 'block';
		}
		else
		{
			block_day.style.display = 'table-row';
			block_time.style.display = 'table-row';
		}
	}
	else
	{
		block_day.style.display = 'none';
		block_time.style.display = 'none';
	}
}

function disable_DPort_Form()
{
	var F = document.firewall_setup_fm;
	if ((F.protocol.value != 'any') && (F.protocol.value != 'icmp'))
	{
		EnableObj(F.port);
		EnableObj(F.port2);
	}
	else
	{
		DisableObj(F.port);
		DisableObj(F.port2);
	}
}

function disable_Time_Form()
{
	var F = document.firewall_setup_fm;
	if (F.fullhours.checked)
	{
		DisableObj(F.start_time);
		DisableObj(F.end_time);
	}
	else
	{
		EnableObj(F.start_time);
		EnableObj(F.end_time);
	}
}

function disable_Day_Form()
{
	var F = document.firewall_setup_fm;
	if (F.Every.checked)
	{
		DisableObj(F.Sun);
		DisableObj(F.Mon);
		DisableObj(F.Tue);
		DisableObj(F.Wed);
		DisableObj(F.Thu);
		DisableObj(F.Fri);
		DisableObj(F.Sat);
	}
	else
	{
		EnableObj(F.Sun);
		EnableObj(F.Mon);
		EnableObj(F.Tue);
		EnableObj(F.Wed);
		EnableObj(F.Thu);
		EnableObj(F.Fri);
		EnableObj(F.Sat);
	}
	F.Sun.checked = 0;
	F.Mon.checked = 0;
	F.Tue.checked = 0;
	F.Wed.checked = 0;
	F.Thu.checked = 0;
	F.Fri.checked = 0;
	F.Sat.checked = 0;
}

function disable_Address_Form(flag, hw_addr)
{
	var F = document.firewall_setup_fm;
	if (flag == 'ip')
	{
		print_firewall_ip_form(F,0);
		print_firewall_mac_form(F,1);
	}
	if (flag == 'mac')
	{
		print_firewall_ip_form(F,1);
		print_firewall_mac_form(F,0);
	}
}

function disable_OneIP_Form()
{
	var F = document.firewall_setup_fm;
	if (F.allip.checked)
		print_js_one_ip_form(F,1);
	else
		print_js_one_ip_form(F,0);
}


// firewallconf_netdetect
function ApplyNetDetect(flag)
{
	var F;
	F = document.netdetect_fm; 
	if (flag == 1)
		F.netdetect_op.value = "on"; 
	else
		F.netdetect_op.value = "off"; 
	F.act.value = "apply";
	F.submit();
}

function ConfNetDetect()
{
	var F;
	F = document.netdetect_fm;
	if ((F.sel_level[1].checked == true) && (parseInt(F.user_level.value) < 10))
	{
		alert(NETCONF_NETDETECT_WARNING1);
		F.user_level.focus();
		F.user_level.select();
		return;
	}

	if(F.rp_time && (parseInt(F.rp_time.value) > 23 ))
	{
		alert(NETCONF_NETDETECT_WARNING2);
		F.rp_time.focus();
		F.rp_time.select();
		return;
	}

        F.act.value = "conf";
        F.submit();
}


function checkEmailOption()
{
	var F;
	F = document.netdetect_fm;
	if(F.rp_mail && F.rp_mail.checked == false )
	{
		DisableObj(F.rp_time);
		DisableObj(F.rp_clear);
		F.rp_clear.checked = false;
	}
	else
	{
		if(F.rp_time) EnableObj(F.rp_time);
		if(F.rp_clear) EnableObj(F.rp_clear);
	}
}

function SendEmail()
{
	var F;
	F = document.netdetect_fm;
	F.act.value = "sendemail";
	F.submit();
}


function ClearHistory()
{
	F = document.netdetect_fm;
	F.act.value = "clear";
	F.submit();
}

function disable_sel_level(flag)
{
	F = document.netdetect_fm;
	if (flag == "predefine")
	{
		F.level_type.disabled = false;
		F.user_level.disabled = true;
	}
	else
	{
		F.level_type.disabled = true;
		F.user_level.disabled = false;
	}
}

function disable_sel_port(flag)
{
	F = document.netdetect_fm;
	if ((F.sel_port[0].checked == true) || (flag == "virus"))
	{
		F.virus_drop.disabled = true;
		F.virus_drop.checked = false;
	}
	else
	{
		if (F.burst_drop.value == '0')
			F.virus_drop.disabled = false;
		else 
		{
			F.virus_drop.disabled = true; 
			F.virus_drop.checked = false;
		}
	}
}

function movePage(num)
{
	self.location.href = "timepro.cgi?tmenu=netconf&smenu=netdetect&page="+num;
}
//firewallconf_accesslist
function ext_RemoteConn(count, ip)
{
	var F = document.ext_ipform;
	if(F.rmgmt_chk.checked == true)
	{
		if (checkOptionalRange(F.rmgmt_port.value, 1, 65535))
		{
			alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
			F.rmgmt_port.focus();
			F.rmgmt.select();
			return;
		}
	}
	
	if(F.ext_chk.checked == true)
		F.act.value='ext_run';
	else
		F.act.value='ext_stop';
	F.submit();
}

function int_RemoteConn(count, ip)
{
	var F = document.int_ipform;
	if(F.int_chk.checked == true)
	{
		if(count == 0)
		{
			ans = confirm(ACCESSLIST_NOIPLISTMSG_1+ip+ACCESSLIST_NOIPLISTMSG_2);
			if(ans==true)
				F.act.value = 'int_run';
		}
		else
			F.act.value = 'int_run';
	}
	else
		F.act.value = 'int_stop';
	
	F.submit();
}

function ext_IPadd()
{
        var obj;
        var F = document.ext_ipform;
        if(obj = CheckIP('ext_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
	}
	else if(F.ext_ipexplan.value=="")
	{
		alert(ACCESSLIST_WRITE_EXPLAIN);
		F.ext_ipexplan.focus();
	}
	else
	{
		F.act.value = 'ext_ipadd';
		F.submit();
	}
}
function int_IPadd()
{
	var obj;
	var F = document.int_ipform;
	
	if(obj = CheckIP('int_regip'))
	{
		alert(ACCESSLIST_WRONG_INPUT_IP);
		obj.focus();
		obj.select();
	}
	else if(F.int_ipexplan.value=="")
	{
		alert(ACCESSLIST_WRITE_EXPLAIN);
		F.int_ipexplan.focus();
	}
	else
	{
		F.act.value = 'int_ipadd';
		F.submit();
	}
}


function ext_IPdel()
{
	var F=document.ext_ipform_list;
		
	if(confirm(ACCESSLIST_DEL_WANT))
	{
		F.act.value = 'ext_del';
		F.submit();
	}
}

function int_IPdel()
{
	var F=document.int_ipform_list;
	
	if(confirm(ACCESSLIST_DEL_WANT))
	{
		F.act.value = 'int_del';
		F.submit();
	}
}

function disableFormAccessList()
{
	var F=document;
	
	if(F.ext_ipform.rmgmt_chk.checked == true)
	{
//              EnableObj(F.ext_ipform.rmgmt_port);
		EnableAllObj(F.ext_ipform);
		if(F.ext_ipform.ext_chk.checked == false)
		{
			DisableIP('ext_regip');
			DisableObj(F.ext_ipform.ext_ipexplan);
			DisableObj(F.ext_ipform.ext_ipadd);
		}
	}
	else
	{
		DisableObj(F.ext_ipform.rmgmt_port);
		DisableObj(F.ext_ipform.ext_chk);
		EnableObj(F.ext_ipform.ext_bt);
		DisableIP('ext_regip');
		DisableObj(F.ext_ipform.ext_ipexplan);
		DisableObj(F.ext_ipform.ext_ipadd);
	}
	
	if(F.int_ipform.int_chk.checked == true)
		EnableAllObj(F.int_ipform);
	else
	{
		DisableIP('int_regip');
		DisableObj(F.int_ipform.int_ipexplan);
		DisableObj(F.int_ipform.int_ipadd);
	}
}

//etc
function submitDoS()
{
	var F = document.firewallconfetc;
	F.act.value = "dos_submit";
	F.submit();
}
     
</script>
