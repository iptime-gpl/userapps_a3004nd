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

function check_srcip_firewall()
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
	    parseInt(F.ssip2.value) * 65536 +  parseInt(F.ssip1.value) * 16777216 ) >
	   (parseInt(F.seip4.value) +  parseInt(F.seip3.value) * 256 +  
	    parseInt(F.seip2.value) * 65536 +  parseInt(F.seip1.value) * 16777216 )) 
	{
		F.seip4.focus();
		F.seip4.select();
 		return 0; 
	}
	else
		return 1;
}

function check_dstip_firewall()
{
	var F = document.firewall_setup_fm;
	var obj;
	if (obj=CheckOptionalIP('dsip'))
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
	    parseInt(F.dsip2.value) * 65536 +  parseInt(F.dsip1.value) * 16777216 ) >
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


function AddFWSched(cur_ippool, max_ippool)
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
	if (F.sel_addr[0].checked == true)
	{
		if (!check_srcip_firewall())
		{
			alert(FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP);
			return;
		}
		if ((F.ssip4.value != "") && (F.seip4.value != "") && (cur_ippool >= max_ippool))
		{
			alert(MSG_IPPOOL_MAX_WARNING);
			return;
		}
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
	if (!check_dstip_firewall())
	{
		alert(FIREWALLCONF_FIREWALL_INVALID_DEST_IP);
		return;
	}
	if ((F.dsip4.value != "") && (F.deip4.value != "") && (cur_ippool >= max_ippool))
	{
		alert(MSG_IPPOOL_MAX_WARNING);
		return;
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
		if ((F.protocol[1].selected == true || F.protocol[2].selected == true ) && (F.port.value == ''))
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

	if (F.act.value == '')
		F.act.value = 'add_fw'
	else if (F.act.value == 'modify_fw')
		F.sel_template.disabled = false;

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

function CancelFWSched()
{
	var F = document.firewall_setup_fm;
	F.act.value = '';
	F.submit();
}

function SelModiSched(F,days,stime,etime)
{
	var day_arr;

	if (days == 'everyday' && stime == '0' && etime == '0')
	{
		F.Sun.checked = false;
		F.Mon.checked = false;
		F.Tue.checked = false;
		F.Wed.checked = false;
		F.Thu.checked = false;
		F.Fri.checked = false;
		F.Sat.checked = false;
		F.Every.checked = false;
		F.user_sched.checked = false;
		F.start_time.options[0].selected = true;
		F.end_time.options[0].selected = true;
		F.fullhours.checked = false;
		displaySchedTable();
	}
	else
	{
		F.user_sched.checked = true;
		displaySchedTable();
		if (days == 'everyday')
		{
			F.Every.checked = true;
			disable_Day_Form();
		}
		else
		{
			F.Every.checked = false;
			disable_Day_Form();
			day_arr = days.split(".");
			F.Sun.checked = parseInt(day_arr[0]);
			F.Mon.checked = parseInt(day_arr[1]);
			F.Tue.checked = parseInt(day_arr[2]);
			F.Wed.checked = parseInt(day_arr[3]);
			F.Thu.checked = parseInt(day_arr[4]);
			F.Fri.checked = parseInt(day_arr[5]);
			F.Sat.checked = parseInt(day_arr[6]);
		}

		if (stime == '0' && etime == '0')
		{
			F.fullhours.checked = true;
			disable_Time_Form();
		}
		else
		{
			F.fullhours.checked = false;
			disable_Time_Form();
			F.start_time.value = stime;
			F.end_time.value = etime;
		}
	}
}

function SelModiAPPrule(type,name,sip1,sip2,allip,smac,policy,priority,days,stime,etime)
{
	var F = document.firewall_setup_fm;
	var iparr;
	var macarr;
	var obj;
	var idx;

	for( i=1; ; i++)
	{
		obj = document.getElementById('rule_'+i);
		if(!obj) break;
		obj.className = 'item_text';
	}
	obj = document.getElementById('rule_'+priority);
	obj.className = 'warning_string';

	direction.style.display = "none";
	dest_ip.style.display = "none";
	protocol.style.display = "none";
	url_string.style.display = "none";

	F.sel_template.value = type; 
	F.sel_template.disabled = true;
	F.name.value = name;
	F.name.readOnly = true;
	F.dir.value = "in_ex";
	ResetIP('ssip');
	ResetIP('seip');
	ResetHW('hw');
	ResetIP('dsip');
	ResetIP('deip');
	F.allip.checked = false;;

	if (allip == '1')
	{
		disable_Address_Form('ip','');
		F.allip.checked = true;;
		disable_OneIP_Form();
	}
	else if (sip1 != '') 
	{
		SetRadioValue(F.sel_addr, 'ipaddr');
		disable_Address_Form('ip','');
		SetIP('ssip', sip1);
		if (sip2 != '') SetIP('seip', sip2);
	}
	else if (smac != '') 
	{
		SetRadioValue(F.sel_addr, 'hwaddr');
		disable_Address_Form('mac','');
		SetHW('hw', smac);
	}


	if (policy == '2')
		F.access.options[0].selected = true;
	else
		F.access.options[1].selected = true;
//	DisableObj(F.access);
	F.prio.value = priority;

	SelModiSched(F,days,stime,etime);

	obj = document.getElementsByName('rdi');
	if (obj)
	{
		idx = parseInt(priority) - 1;
		if(obj[idx].checked == true)
			F.rule_op.value = 1;
		else
			F.rule_op.value = 0;
	}

	EnableObj(F.cancel)
	F.save.value = MODIFY_OP;
	F.act.value = 'modify_fw';
}

function SelModiURLrule(type,name,sip1,sip2,allip,smac,site,policy,priority,days,stime,etime)
{
	var F = document.firewall_setup_fm;

	for( i=1; ; i++)
	{
		obj = document.getElementById('rule_'+i);
		if(!obj) break;
		obj.className = 'item_text';
	}
	obj = document.getElementById('rule_'+priority);
	obj.className = 'warning_string';


	direction.style.display = "none";
	dest_ip.style.display = "none";
	protocol.style.display = "none";
	if(navigator.appName.indexOf("Microsoft") != -1)
		url_string.style.display = "block";
	else
		url_string.style.display = "table-row";

	F.sel_template.value = type; 
	F.sel_template.disabled = true;
	F.name.value = name;
	F.name.readOnly = true;
	F.dir.value = "in_ex";
	ResetIP('ssip');
	ResetIP('seip');
	ResetHW('hw');
	ResetIP('dsip');
	ResetIP('deip');
	F.allip.checked = false;;

	if (allip == '1')
	{
		disable_Address_Form('ip','');
		F.allip.checked = true;;
		disable_OneIP_Form();
	}
	else if (sip1 != '') 
	{
		SetRadioValue(F.sel_addr, 'ipaddr');
		disable_Address_Form('ip','');
		SetIP('ssip', sip1);
		if (sip2 != '') SetIP('seip', sip2);
	}
	else if (smac != '') 
	{
		SetRadioValue(F.sel_addr, 'hwaddr');
		disable_Address_Form('mac','');
		SetHW('hw', smac);
	}

	F.filter_string.value = site;

	if (policy == '2')
		F.access.options[0].selected = true;
	else
		F.access.options[1].selected = true;
//	DisableObj(F.access);
	F.prio.value = priority;

	SelModiSched(F,days,stime,etime);
	
	obj = document.getElementsByName('rdi');
	if (obj)
	{
		idx = parseInt(priority) - 1;
		if(obj[idx].checked == true)
			F.rule_op.value = 1;
		else
			F.rule_op.value = 0;
	}

	EnableObj(F.cancel)
	F.save.value = MODIFY_OP;
	F.act.value = 'modify_fw';
}

function SelModiNFrule(type,name,dir,sip1,sip2,allip,smac,dip1,dip2,proto,dport1,dport2,policy,priority,days,stime,etime)
{
	var F = document.firewall_setup_fm;
	var idx;

	for( i=1; ; i++)
	{
		obj = document.getElementById('rule_'+i);
		if(!obj) break;
		obj.className = 'tem_text';
	}
	obj = document.getElementById('rule_'+priority);
	obj.className = 'warning_string';

	if(navigator.appName.indexOf("Microsoft") != -1)
	{
		direction.style.display = "block";
		dest_ip.style.display = "block";
		protocol.style.display = "block";
	}
	else
	{
		direction.style.display = "table-row";
		dest_ip.style.display = "table-row";
		protocol.style.display = "table-row";
	}
	url_string.style.display = "none";

	F.sel_template.value = type; 
	F.sel_template.disabled = true;
	F.name.value = name;
	F.name.readOnly = true;
	F.dir.value = dir;
	ResetIP('ssip');
	ResetIP('seip');
	ResetHW('hw');
	ResetIP('dsip');
	ResetIP('deip');
	F.allip.checked = false;;

	if (allip == '1')
	{
		disable_Address_Form('ip','');
		F.allip.checked = true;;
		disable_OneIP_Form();
	}
	else if (sip1 != '') 
	{
		SetRadioValue(F.sel_addr, 'ipaddr');
		disable_Address_Form('ip','');
		SetIP('ssip', sip1);
		if (sip2 != '') SetIP('seip', sip2);
	}
	else if (smac != '') 
	{
		SetRadioValue(F.sel_addr, 'hwaddr');
		disable_Address_Form('mac','');
		SetHW('hw', smac);
	}

	if (dip1 != '') SetIP('dsip', dip1);
	if (dip2 != '') SetIP('deip', dip2);

	EnableObj(F.port);
	EnableObj(F.port2);
	if (proto == 'tcp')
		F.protocol.options[1].selected = true;
	else if (proto == 'udp')
		F.protocol.options[2].selected = true;
	else
	{
		if (proto == 'icmp')
			F.protocol.options[3].selected = true;
		else
			F.protocol.options[0].selected = true;
		DisableObj(F.port);
		DisableObj(F.port2);
	}
	F.port.value = '';
	if (dport1 != '0') F.port.value = dport1;
	F.port2.value = '';
	if (dport2 != '0') F.port2.value = dport2;

	if (policy == '2')
		F.access.options[0].selected = true;
	else
		F.access.options[1].selected = true;
	EnableObj(F.access);
	F.prio.value = priority;

	SelModiSched(F,days,stime,etime);
	
	obj = document.getElementsByName('rdi');
	if (obj)
	{
		idx = parseInt(priority) - 1;
		if(obj[idx].checked == true)
			F.rule_op.value = 1;
		else
			F.rule_op.value= 0;
	}

	EnableObj(F.cancel)
	F.save.value = MODIFY_OP;
	F.act.value = 'modify_fw';
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

function ApplyPlantynet()
{
        var F = document.plantynet_fm;
        F.act.value='apply';
        F.submit();
}

function AddPlantynetFreeDevice()
{
        var F=document.freedevice_fm;
        var obj;
	var i;

	for( i=1;i<= 6 ;i++)
	{
		obj=document.getElementsByName('hw'+i);
		if(!obj[0])
                {
                        alert("Bug:Invalid Obj"+" hw"+i);
                        break;
                }

		if (obj[0].value.length !=2)
		{
                	alert(MSG_HWADDR_NO_INPUT);
			obj.focus();
			obj.select();
			return;
		}
	}

        if(F.dev_desc.value=='')
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.dev_desc.focus();
                return;
        }
        else if(obj=CheckHW('hw'))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
        }
        else
        {
                F.act.value='add';
                F.submit();
        }
}


function DeletePlantynetFreeDevice(index)
{
        var F=document.freedevice_fm;
	var chkchk=false;
	var i;

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

	if (chkchk == false)
	{
		alert(MSG_SELECT_MAC_REMOVED);
	}
	else if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		F.act.value='del';
		F.submit();
	}
}

     
</script>
