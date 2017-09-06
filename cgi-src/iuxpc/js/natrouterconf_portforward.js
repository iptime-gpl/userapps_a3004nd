<script language="javascript" type="text/javascript">

function DisableObj_For_PF(obj)
{
	if(obj){
		obj.disabled = true;
		obj.style.backgroundColor = '#EEEEEE';
	}
}

function EnableObj_For_PF(obj)
{
	if(obj){
		obj.disabled = false;
		obj.style.backgroundColor = '';
	}
}

function All_Enable_PFForm(doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;

	EnableObj_For_PF(F.re_ip);	EnableObj_For_PF(F.ext_sport);	EnableObj_For_PF(F.ext_eport);
	EnableObj_For_PF(F.int_sport);		EnableObj_For_PF(F.int_eport);
	{
		EnableObj_For_PF(F.internal_ip1);	EnableObj_For_PF(F.internal_ip2);
		EnableObj_For_PF(F.internal_ip3);	EnableObj_For_PF(F.internal_ip4);
	}
	EnableObj_For_PF(F.trigger_sport);	EnableObj_For_PF(F.trigger_eport);	EnableObj_For_PF(F.forward_ports);
	EnableObj_For_PF(F.wan_name);		EnableObj_For_PF(F.protocol);
	EnableObj_For_PF(F.trigger_protocol);	EnableObj_For_PF(F.forward_protocol);
}

function All_Disable_PFForm(doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;

	DisableObj_For_PF(F.re_ip);	DisableObj_For_PF(F.ext_sport);	DisableObj_For_PF(F.ext_eport);
	DisableObj_For_PF(F.int_sport);		DisableObj_For_PF(F.int_eport);
	{
		DisableObj_For_PF(F.internal_ip1);	DisableObj_For_PF(F.internal_ip2);
		DisableObj_For_PF(F.internal_ip3);	DisableObj_For_PF(F.internal_ip4);
	}
	DisableObj_For_PF(F.trigger_sport);	DisableObj_For_PF(F.trigger_eport);	DisableObj_For_PF(F.forward_ports);
	DisableObj_For_PF(F.wan_name);		DisableObj_For_PF(F.protocol);
	DisableObj_For_PF(F.trigger_protocol);	DisableObj_For_PF(F.forward_protocol);
}

function ChangeInputForm(mode, frm_doc)
{
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
	}
	if(mode == 'user' || mode == 'all')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = '';
		doc.getElementById('form_line_3').style.display = '';
		doc.getElementById('form_line_trigger1').style.display = 'none';
		doc.getElementById('form_line_trigger2').style.display = 'none';
		doc.getElementById('form_line_5').style.display = '';
		doc.getElementById('form_line_blank').style.display = 'none';

		doc.getElementById('SELMENUBOXTD').style.display = '';
		doc.getElementById('DISABLEBOXTD').style.display = '';
		doc.getElementById('CURCONNBOXTD').style.display = '';
		doc.getElementById('INTPORTBOX').style.display = '';
		doc.getElementById('PRIORITYBOX').style.display = '';
	}
	else if(mode == 'upnp')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = '';
		doc.getElementById('form_line_3').style.display = '';
		doc.getElementById('form_line_trigger1').style.display = 'none';
		doc.getElementById('form_line_trigger2').style.display = 'none';
		doc.getElementById('form_line_5').style.display = 'none';
		doc.getElementById('form_line_blank').style.display = '';

		doc.getElementById('SELMENUBOXTD').style.display = 'none';
		doc.getElementById('DISABLEBOXTD').style.display = 'none';
		doc.getElementById('CURCONNBOXTD').style.display = 'none';
		doc.getElementById('INTPORTBOX').style.display = 'none';
		doc.getElementById('PRIORITYBOX').style.display = 'none';
	}
	else if(mode == 'trigger')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = 'none';
		doc.getElementById('form_line_3').style.display = 'none';
		doc.getElementById('form_line_trigger1').style.display = '';
		doc.getElementById('form_line_trigger2').style.display = '';
		doc.getElementById('form_line_5').style.display = '';
		doc.getElementById('form_line_blank').style.display = 'none';

		doc.getElementById('SELMENUBOXTD').style.display = '';
		doc.getElementById('DISABLEBOXTD').style.display = '';
		doc.getElementById('CURCONNBOXTD').style.display = 'none';
		doc.getElementById('INTPORTBOX').style.display = 'none';
		doc.getElementById('PRIORITYBOX').style.display = '';
	}
	else if(mode == 'trigger_status'){
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = 'none';
		doc.getElementById('form_line_3').style.display = 'none';
		doc.getElementById('form_line_trigger1').style.display = '';
		doc.getElementById('form_line_trigger2').style.display = '';
		doc.getElementById('form_line_5').style.display = 'none';
		doc.getElementById('form_line_blank').style.display = '';

		doc.getElementById('SELMENUBOXTD').style.display = 'none';
		doc.getElementById('DISABLEBOXTD').style.display = 'none';
		doc.getElementById('CURCONNBOXTD').style.display = 'none';
		doc.getElementById('INTPORTBOX').style.display = 'none';
		doc.getElementById('PRIORITYBOX').style.display = 'none';
	}
}

function All_Clear_PFForm(mode,frm_doc)
{
	var F = document.portforward_fm;
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.portforward_fm;
	}

	{
		if(F.old_priority.value != '' && F.clicked_name.value != '_-new_line'){
			var ifr = doc.user_portforward || doc.getElementsByName('user_portforward')[0];
			ifr = ifr.document || ifr.contentWindow.document;
			moveRowCustom(parseInt(F.old_priority.value), F, ifr);
			F.old_priority.value = '';
		}
		F.cur_priority.value = '';
		F.act.value = '';
		All_Enable_PFForm(frm_doc);
		EnableObj_For_PF(F.rule_name);
		F.rule_name.value = '';
		F.disable.checked = false;
		if(F.re_ip) F.re_ip.checked = false;
		
		Clear_InternalIPBox(frm_doc);

		F.protocol.value = 'tcp';
		F.int_sport.value = '';	F.int_eport.value = '';
		F.ext_sport.value = '';	F.ext_eport.value = '';

		EnableObj_For_PF(F.priority);
		EnableObj_For_PF(F.pri_up);
		EnableObj_For_PF(F.pri_down);
	}

	ChangeInputForm(mode, frm_doc);

	if(mode == 'user' || mode == 'all')
	{
		F.sel_server.value = '0';
		EnableObj_For_PF(F.sel_server);
	}
	else if(mode == 'upnp')
	{
		DisableObj_For_PF(F.rule_name);
		All_Disable_PFForm(frm_doc);
	}
	else if(mode == 'trigger')
	{
		F.sel_server.value = 'trigger';
		EnableObj_For_PF(F.sel_server);
		
		F.trigger_sport.value = '';	F.trigger_eport.value = '';
		F.forward_ports.value = '';	F.trigger_protocol.value = 'tcp';
		F.forward_protocol.value = 'tcp';
	}
	else if(mode == 'trigger_status'){
		DisableObj_For_PF(F.rule_name);
		All_Disable_PFForm(frm_doc);
	}
}

function Clear_InternalIPBox(doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;

	EnableObj_For_PF(F.internal_ip1);
	EnableObj_For_PF(F.internal_ip2);
	EnableObj_For_PF(F.internal_ip3);
	EnableObj_For_PF(F.internal_ip4);

	F.internal_ip4.value = '';
}

function onCheckedDisable(doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;
	
	ButtonViewControl('modify', doc);
	if(F.disable.checked){
		All_Disable_PFForm(doc);
	}
	else{
		All_Enable_PFForm(doc);
		onChangeProtocol(doc);
	}
}

function onChangeProtocol(doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;

	ButtonViewControl('modify', doc);
	var value = F.protocol.value;
	
	if(value == 'gre')
	{
		F.int_sport.value = '';		F.int_eport.value = '';
		DisableObj_For_PF(F.int_sport);	DisableObj_For_PF(F.int_eport);
		F.ext_sport.value = '';		F.ext_eport.value = '';
		DisableObj_For_PF(F.ext_sport);	DisableObj_For_PF(F.ext_eport);
	}
	else
	{
		EnableObj_For_PF(F.int_sport);	EnableObj_For_PF(F.int_eport);
		EnableObj_For_PF(F.ext_sport);	EnableObj_For_PF(F.ext_eport);
	}
}

function onDeleteClicked(mode)
{
	var F = document.portforward_fm;
	var selmenu = parent.frames[3].document.getElementById('pf_select_menu');
	var ifr;
	var F2;
	if(mode == 'user'){
		ifr = user_portforward || document.getElementsByName('user_portforward')[0];
		F2 = ifr.user_portforward_fm;
	}
	else if(mode == 'upnp'){
		ifr = upnp_portforward || document.getElementsByName('upnp_portforward')[0];
		F2 = ifr.upnp_portforward_fm;
	}
	
	if(!F2.delcheck || F2.delcheck.length == 0){
		alert(PORTFORWARD_NOT_SELECTED_STRING);	return;
	}else{
		var checked_count = 0;
		if(F2.delcheck.length){
			for(var i = 0; i < F2.delcheck.length; i++){
				if(F2.delcheck[i].checked)	checked_count += 1;
			}
		}else{
			if(F2.delcheck.checked)	checked_count += 1;
		}
		if(checked_count == 0){
			alert(PORTFORWARD_NOT_SELECTED_STRING);	return;
		}
	}

	if(confirm(PORTFORWARD_RULE_DELETE)){
		if(mode == 'user'){
			var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
			var F2 = ifr.user_portforward_fm;
			F2.act.value = 'del';
			if(F.alldel_user){
				F.alldel_user.checked = false;
			}
			if(selmenu)
				F2.view_mode.value = selmenu.value;
			else
				F2.view_mode.value = 'user';
			MaskIt(document, 'apply_mask');
			F2.submit();
		}
		else if(mode == 'upnp'){
			var ifr = upnp_portforward || document.getElementsByName('upnp_portforward')[0];
			var F2 = ifr.upnp_portforward_fm;
			F2.act.value = 'del';
			if(F.alldel_upnp){
				F.alldel_upnp.checked = false;
			}
			if(selmenu)
				F2.view_mode.value = selmenu.value;
			else
				F2.view_mode.value = 'upnp';
			MaskIt(document, 'apply_mask');
			F2.submit();
		}
	}
}

function onCheckedReip(obj, ipname, ipaddr)
{
	var tmp;
	ButtonViewControl('modify', document);
	if(obj.checked == true){
		var iparr = ipaddr.split('.');

		for(var i = 1; i <= 4; i ++){
			tmp = document.getElementsByName(ipname + i);
			if(tmp[0])
				tmp[0].value = iparr[i-1];
		}
	}
	else{
		tmp = document.getElementsByName(ipname+'4');
		if(tmp[0]){
			tmp[0].value = '';
		}
	}
}

function ClickedRule(obj,name,bgcolor)
{
	var F = parent.document.portforward_fm;

	if(obj)
	{
		F.clicked_name.value = name;
		F.clicked_bg.value = bgcolor;
		obj.style.backgroundColor='#C9D5E9';
	}
}

function special_char_validate(str)
{
	var regExp = /[\{\}\[\]\/?;:|*~`!^+<>@\$%&\\\=\'\"]/gi

        return regExp.test(str);
}

function ClickEventPropagater(e)
{
	if(!e) var e = window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
}

function GetIpStr(ipstr, idx)
{
	return ipstr.split('.')[idx];
}

function onClickedPFRule(mode, name, selserver, internal_ip, protocol, ext_sport, ext_eport, int_sport, int_eport
			, tsport, teport, tfprotocol, tfrange
			, disabled, priority, wan, fixed)
{
	var F = parent.document.portforward_fm;
	var frm_doc = parent.document;
	var oObj;

	if(fixed)
		MaskIt(frm_doc, 'fixed_mask');
	else
		UnMaskIt(frm_doc, 'fixed_mask');
		
	if(name == ''){
		name = '_-new_line';
	}

	if(mode == 'user' || mode == 'all'){
		All_Clear_PFForm(mode, frm_doc);
		F.priority.value = priority;
		F.cur_priority.value = priority;
		F.old_priority.value = priority;
	
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			else{
				var tmp = frm_doc.upnp_portforward || frm_doc.getElementsByName('upnp_portforward')[0];
				if(tmp){
					var tmpdoc = tmp.document || tmp.contentWindow.document;
					oObj = tmpdoc.getElementById(F.clicked_name.value);
					if(oObj) oObj.style.backgroundColor = F.clicked_bg.value;
				}
			}
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			onChangeProtocol(frm_doc);
			ButtonViewControl('add', frm_doc);
			F.act.value = 'add';
			return;
		}
		F.act.value = 'modify';
		F.rule_name.value = name;
		DisableObj_For_PF(F.rule_name);
		DisableObj_For_PF(F.sel_server);
		F.protocol.value = protocol;
		onChangeProtocol(frm_doc);

		if(ext_sport == '0')
			F.ext_sport.value = '';
		else
			F.ext_sport.value = ext_sport;
		if(ext_eport == '0')
			F.ext_eport.value = '';
		else
			F.ext_eport.value = ext_eport;
		if(int_sport == '0')
			F.int_sport.value = '';
		else
			F.int_sport.value = int_sport;
		if(int_eport == '0')
			F.int_eport.value = '';
		else
			F.int_eport.value = int_eport;

		F.internal_ip1.value = GetIpStr(internal_ip, 0);
		F.internal_ip2.value = GetIpStr(internal_ip, 1);
		F.internal_ip3.value = GetIpStr(internal_ip, 2);
		F.internal_ip4.value = GetIpStr(internal_ip, 3);

		if(wan){
			if(F.wan_name)
				F.wan_name.value = wan;
		}

		if(disabled){
			F.disable.checked = true;
			onCheckedDisable(frm_doc);
		}
		ButtonViewControl('clicked', frm_doc);
	}
	else if(mode == 'upnp'){
		All_Clear_PFForm(mode, frm_doc);
		F.old_priority.value = '';
	
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			else{
				var tmp = frm_doc.user_portforward || frm_doc.getElementsByName('user_portforward')[0];
				if(tmp){
					var tmpdoc = tmp.document || tmp.contentWindow.document;
					oObj = tmpdoc.getElementById(F.clicked_name.value);
					if(oObj) oObj.style.backgroundColor = F.clicked_bg.value;
				}
			}
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);
		
		if(name == '_-new_line' && protocol == ''){
			return;
		}
		F.act.value = 'del';
		F.rule_name.value = name;
		DisableObj_For_PF(F.rule_name);
		F.protocol.value = protocol;

		if(ext_sport == '0')
			F.ext_sport.value = '';
		else
			F.ext_sport.value = ext_sport;
		if(ext_eport == '0')
			F.ext_eport.value = '';
		else
			F.ext_eport.value = ext_eport;

		F.internal_ip1.value = GetIpStr(internal_ip, 0);
		F.internal_ip2.value = GetIpStr(internal_ip, 1);
		F.internal_ip3.value = GetIpStr(internal_ip, 2);
		F.internal_ip4.value = GetIpStr(internal_ip, 3);
	}
	else if(mode == 'trigger'){
		All_Clear_PFForm(mode, frm_doc);
		F.priority.value = priority;
		F.cur_priority.value = priority;
		F.old_priority.value = priority;
	
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			else{
				var tmp = frm_doc.upnp_portforward || frm_doc.getElementsByName('upnp_portforward')[0];
				if(tmp){
					oObj = tmp.document.getElementById(F.clicked_name.value);
					if(oObj) oObj.style.backgroundColor = F.clicked_bg.value;
				}
			}
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			ButtonViewControl('add', frm_doc);
			return;
		}
		F.act.value = 'modify';
		F.rule_name.value = name;
		DisableObj_For_PF(F.rule_name);
		DisableObj_For_PF(F.sel_server);
		F.trigger_protocol.value = protocol;

		F.trigger_sport.value = tsport;
		if(teport == '0')
			F.trigger_eport.value = '';
		else
			F.trigger_eport.value = teport;
		F.forward_ports.value = tfrange;
		F.forward_protocol.value = tfprotocol;

		if(disabled){
			F.disable.checked = true;
			onCheckedDisable(frm_doc);
		}
		ButtonViewControl('clicked', frm_doc);
	}
	else if(mode == 'trigger_status'){
		All_Clear_PFForm(mode, frm_doc);
		F.old_priority.value = '';
	
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			else{
				var tmp = frm_doc.trigger_portforward || frm_doc.getElementsByName('trigger_portforward')[0];
				if(tmp){
					oObj = tmp.document.getElementById(F.clicked_name.value);
					if(oObj) oObj.style.backgroundColor = F.clicked_bg.value;
				}
			}
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			ButtonViewControl('add', frm_doc);
			return;
		}
		F.act.value = '';
		F.rule_name.value = name;
		DisableObj_For_PF(F.rule_name);
		F.trigger_protocol.value = protocol;

		F.trigger_sport.value = tsport;
		if(teport == '0')
			F.trigger_eport.value = '';
		else
			F.trigger_eport.value = teport;
		F.forward_ports.value = tfrange;
		F.forward_protocol.value = tfprotocol;
	}
	else{
		return;
	}
}

function ButtonViewControl(act,doc)
{
	var F = document.portforward_fm;

	if(doc)
		F = doc.portforward_fm;

	if(act == 'add'){
		DisableObj_For_PF(F.new_rule_btn);
		F.apply_btn.innerHTML = PORTFORWARD_APPLY_STRING;
		EnableObj_For_PF(F.apply_btn);
		DisableObj_For_PF(F.cancel_btn);
		DisableObj_For_PF(F.disable);
	}
	else if(act == 'clicked'){
		EnableObj_For_PF(F.new_rule_btn);
		F.apply_btn.innerHTML = PORTFORWARD_MODIFY_STRING;
		DisableObj_For_PF(F.apply_btn);
		DisableObj_For_PF(F.cancel_btn);
		EnableObj_For_PF(F.disable);
	}
	else if(act == 'modify'){
		DisableObj_For_PF(F.new_rule_btn);
		EnableObj_For_PF(F.apply_btn);
		EnableObj_For_PF(F.cancel_btn);
	}
}

function onNewRuleBtnClicked()
{
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var F = document.portforward_fm;
	
	if(ifr.user_portforward_fm.view_mode.value == '' || ifr.user_portforward_fm.view_mode.value == 'all')
		ifr.onNewLineClicked();
	else
		ifr.onNewLineClicked(ifr.user_portforward_fm.view_mode.value);
	F.act.value = 'add';
}

function onCancelBtnClicked()
{
	var F = document.portforward_fm;
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var doc = ifr.document;

	if(F.clicked_name.value == '_-new_line'){
		F.act.value = 'add';
		onNewRuleBtnClicked();	return;
	}
	doc.getElementById(F.clicked_name.value).onclick();
}

function check_PF_IPRange(gw_addr, netmask)
{
	var F = document.portforward_fm

	if(gw_addr != '' && netmask != ''){
		var gwstrs = gw_addr.split('.');
		var maskstrs = netmask.split('.');
		var ipstrs = [parseInt(F.internal_ip1.value),parseInt(F.internal_ip2.value),parseInt(F.internal_ip3.value),parseInt(F.internal_ip4.value)];

		for(var i = 0; i < 4 ; i ++){
			if((parseInt(gwstrs[i]) & parseInt(maskstrs[i])) != (ipstrs[i] & parseInt(maskstrs[i]))){
				alert(PORTFORWARD_IPADDR_INVALID);
				switch(i){
					case 0:	F.internal_ip1.focus();	F.internal_ip1.select(); break;
					case 1:	F.internal_ip2.focus();	F.internal_ip2.select(); break;
					case 2:	F.internal_ip3.focus();	F.internal_ip3.select(); break;
					case 3:	F.internal_ip4.focus();	F.internal_ip4.select(); break;
					default:	break;
				}
				return false;
			}
		}

		var invertSubnet = [~parseInt(maskstrs[0]), ~parseInt(maskstrs[1]), ~parseInt(maskstrs[2]), ~parseInt(maskstrs[3])];
		
		if((((invertSubnet[0] | ipstrs[0]) & 0xFF) == ipstrs[0]) && (((invertSubnet[1] | ipstrs[1]) & 0xFF) == ipstrs[1]) && (((invertSubnet[2] | ipstrs[2]) & 0xFF) == ipstrs[2]) && (((invertSubnet[3] | ipstrs[3]) & 0xFF) == ipstrs[3])){
			alert(PORTFORWARD_BROD_IP_ALERT);
			F.internal_ip4.focus();	F.internal_ip4.select();
			return false;
		}
		if((parseInt(gwstrs[0]) == ipstrs[0]) && (parseInt(gwstrs[1]) == ipstrs[1]) && (parseInt(gwstrs[2]) == ipstrs[2]) && (parseInt(gwstrs[3]) == ipstrs[3]))
		{
			alert(PORTFORWARD_INT_IP_ALERT);
			F.internal_ip4.focus();	F.internal_ip4.select();
			return false;
		}
	}

	return true;
}

function make_internal_ip(ip1,ip2,ip3,ip4)
{
	return ip1+'.'+ip2+'.'+ip3+'.'+ip4;
}

function CheckTriggerPortRange(triggerstr)
{
	var arr = triggerstr.split(' ');

	if(!arr || arr.length == 0)	return false;

	for(var i = 0; i < arr.length; i ++){
		if(isNaN(arr[i]) || parseInt(arr[i]) <= 0 || parseInt(arr[i]) > 65535)
			return false;
	}

	return true;
}

function onApplyBtnClicked(gw_addr, netmask, max_count)
{
	var F = document.portforward_fm;
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var F2 = ifr.user_portforward_fm;

	var obj = ifr.document.getElementById('_-new_line');
	
	if(!obj && (F.apply_btn.innerHTML == PORTFORWARD_APPLY_STRING)){
		return;
	}

	if(max_count){
		if(F.act.value == 'add' && F.rule_count.value != ''){
			var rcount = parseInt(F.rule_count.value);
			if(rcount >= max_count){
				alert(PORTFORWARD_MAX_RULE_ALERT);	return;
			}
		}
	}

	if(F.rule_name.value == ''){
		alert(PORTFORWARD_RULE_NAME_BLANKED);
		F.rule_name.focus();	F.rule_name.select();	return;
	}
	if(special_char_validate(F.rule_name.value)){
		alert(PORTFORWARD_RULE_NAME_INVALID);
		F.rule_name.focus();	F.rule_name.select();	return;
	}
	
	obj = ifr.document.getElementById(F.rule_name.value);
	if(obj && (F.apply_btn.innerHTML == PORTFORWARD_APPLY_STRING)){
		alert(PORTFORWARD_RULE_NAME_EXIST);
		F.rule_name.focus();	F.rule_name.select();	return;
	}
		
	var selmenu = parent.frames[3].document.getElementById('pf_select_menu');
	if(selmenu)
		F2.view_mode.value = selmenu.value;
	else
		F2.view_mode.value = 'user';

	if(F.sel_server.value == 'trigger'){
		if(F.trigger_sport.value == ''){
			alert(PORTFORWARD_PORT_INVALID);
			F.trigger_sport.focus();	F.trigger_sport.select();	return;
		}
		if(isNaN(F.trigger_sport.value) || (parseInt(F.trigger_sport.value)<=0 || 
			parseInt(F.trigger_sport.value)>65535) || special_char_validate(F.trigger_sport.value)){
			alert(PORTFORWARD_PORT_INVALID);
			F.trigger_sport.focus();	F.trigger_sport.select();	return;
		}
		if(F.trigger_eport.value != ''){
			if(isNaN(F.trigger_eport.value) || (parseInt(F.trigger_eport.value)<=0 || 
				parseInt(F.trigger_eport.value)>65535) || special_char_validate(F.trigger_eport.value)){
				alert(PORTFORWARD_PORT_INVALID);
				F.trigger_eport.focus();	F.trigger_eport.select();	return;
			}
		}
		if(F.forward_ports.value == '' || special_char_validate(F.forward_ports.value)){
			alert(PORTFORWARD_PORT_INVALID);
			F.forward_ports.focus();	F.forward_ports.select();	return;
		}
		if(!CheckTriggerPortRange(F.forward_ports.value)){
			alert(PORTFORWARD_PORT_INVALID);
			F.forward_ports.focus();	F.forward_ports.select();	return;
		}
		F2.act.value = F.act.value;
		F2.mode.value = 'trigger';
		F2.trigger_protocol.value = F.trigger_protocol.value;
		F2.trigger_sport.value = F.trigger_sport.value;
		if(F.trigger_eport.value != '')
			F2.trigger_eport.value = F.trigger_eport.value;
		F2.forward_protocol.value = F.forward_protocol.value;
		F2.forward_ports.value = F.forward_ports.value;
	}
	else{
		if(F.sel_server.value == 'NULL'){
			return;
		}
		if(F.protocol.value != 'gre'){
			if(isNaN(F.int_sport.value) || (parseInt(F.int_sport.value)<=0 || 
				parseInt(F.int_sport.value)>65535) || special_char_validate(F.int_sport.value)){
				alert(PORTFORWARD_PORT_INVALID);
				F.int_sport.focus();	F.int_sport.select();	return;
			}
			if(isNaN(F.int_eport.value) || (parseInt(F.int_eport.value)<=0 || 
				parseInt(F.int_eport.value)>65535) || special_char_validate(F.int_eport.value)){
				alert(PORTFORWARD_PORT_INVALID);
				F.int_eport.focus();	F.int_eport.select();	return;
			}
			if(F.ext_sport.value == ''){
				alert(PORTFORWARD_PORT_INVALID);
				F.ext_sport.focus();	F.ext_sport.select();	return;
			}
			if(isNaN(F.ext_sport.value) || (parseInt(F.ext_sport.value)<=0 || 
				parseInt(F.ext_sport.value)>65535) || special_char_validate(F.ext_sport.value)){
				alert(PORTFORWARD_PORT_INVALID);
				F.ext_sport.focus();	F.ext_sport.select();	return;
			}
			if(isNaN(F.ext_eport.value) || (parseInt(F.ext_eport.value)<=0 || 
				parseInt(F.ext_eport.value)>65535) || special_char_validate(F.ext_eport.value)){
				alert(PORTFORWARD_PORT_INVALID);
				F.ext_eport.focus();	F.ext_eport.select();	return;
			}
		}
	
		if(F.internal_ip1.value == ''){
			alert(PORTFORWARD_IPADDR_INVALID);
			F.internal_ip1.focus();	F.internal_ip1.select();	return;
		}
		if(F.internal_ip2.value == ''){
			alert(PORTFORWARD_IPADDR_INVALID);
			F.internal_ip2.focus();	F.internal_ip2.select();	return;
		}
		if(F.internal_ip3.value == ''){
			alert(PORTFORWARD_IPADDR_INVALID);
			F.internal_ip3.focus();	F.internal_ip3.select();	return;
		}
		if(F.internal_ip4.value == ''){
			alert(PORTFORWARD_IPADDR_INVALID);
			F.internal_ip4.focus();	F.internal_ip4.select();	return;
		}
		if(!check_PF_IPRange(gw_addr,netmask))	return;
		F2.internal_ip.value = make_internal_ip(F.internal_ip1.value, F.internal_ip2.value, F.internal_ip3.value, F.internal_ip4.value);
		F2.act.value = F.act.value;
		F2.mode.value = 'user';
		F2.protocol.value = F.protocol.value;
		if(F.protocol.value != 'gre'){
			F2.ext_sport.value = F.ext_sport.value;
			F2.ext_eport.value = F.ext_eport.value;
			F2.int_sport.value = F.int_sport.value;
			F2.int_eport.value = F.int_eport.value;
		}
		else{
			F2.ext_sport.value = '';
			F2.ext_eport.value = '';
			F2.int_sport.value = '';
			F2.int_eport.value = '';
		}
	}
	F2.name.value = F.rule_name.value;
	F2.disabled.value = (F.disable.checked)?'1':'0';
	F2.priority.value = F.priority.value;
	F2.old_priority.value = F.old_priority.value;
	F.priority.value = '';
	F.old_priority.value = '';
	if(F.wan_name){
		F2.wan_name.value = F.wan_name.value;
	}
	MaskIt(document, 'apply_mask');

	F.clicked_name.value = '';
	F.clicked_bg.value = '';
	
	if(F.alldel_user){
		F.alldel_user.checked = false;
	}

	F2.submit();
}

function get_previous_Element(node)
{
	var retval = node;
	while(retval){
		retval = retval.previousSibling;
		if(retval && retval.tagName == 'TR')	break;
	}

	if(retval && retval.tagName == 'TR')
		return retval;
	else
		return null;
}

function findPos(ifr,obj)
{
	var curtop = 0;

	curtop = Math.max(0, (obj.offsetTop - (ifr.document.body.clientHeight/2)));

	return curtop;
}

function get_next_Element(node)
{
	var retval = node;
	while(retval){
		retval = retval.nextSibling;
		if(retval && retval.tagName == 'TR')	break;
	}

	if(retval && retval.tagName == 'TR')
		return retval;
	else
		return null;
}

function moveRowUp(row_name)
{
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var doc = ifr.document;
	var row = doc.getElementById(row_name);
	var sibling = get_previous_Element(row);
	var Parent = row.parentNode;
	var F = document.portforward_fm;

	if(sibling && sibling.id != '_-new_line' && sibling.id != '_-guard_line'){
		Parent.insertBefore(row,sibling);
		F.priority.value = parseInt(F.priority.value) - 1;
		if(F.cur_priority.value == ''){
			F.cur_priority.value = F.priority.value;
		}else{
			F.cur_priority.value = parseInt(F.cur_priority.value) - 1;
		}
	}
	ifr.window.scroll(0, findPos(ifr,row));
}

function moveRowDown(row_name)
{
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var doc = ifr.document;
	var row = doc.getElementById(row_name);
	var anchor = get_next_Element(row);
	var Parent = row.parentNode;
	var F = document.portforward_fm;

	if(anchor && anchor.id != '_-new_line' && anchor.id != '_-guard_line'){
		anchor = get_next_Element(anchor);
		if(anchor)
			Parent.insertBefore(row,anchor);
		else
			return;
		F.priority.value = parseInt(F.priority.value) + 1;
		if(F.cur_priority.value == ''){
			F.cur_priority.value = F.priority.value;
		}else{
			F.cur_priority.value = parseInt(F.cur_priority.value) + 1;
		}
	}
	ifr.window.scroll(0, findPos(ifr,row));
}

function onRowUpClicked()
{
	var F = document.portforward_fm;

	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;
	if(F.old_priority.value == '')	return;

	moveRowUp(F.clicked_name.value);
	ButtonViewControl('modify');
}

function onRowDownClicked()
{
	var F = document.portforward_fm;

	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;
	if(F.old_priority.value == '')	return;
	
	moveRowDown(F.clicked_name.value);
	ButtonViewControl('modify');
}

function get_special_line_idx(ifrm_doc)
{
	var doc = null;
	if(ifrm_doc){
		doc = ifrm_doc;
	}
	else{
		doc = user_portforward.document;
	}
	var guardLine = doc.getElementById('_-guard_line');
	var Parent = guardLine.parentNode;
	var refer = Parent.childNodes[0];
	
	if(!refer)	return 1;

	for(var i = 1; (refer && refer.id != '_-guard_line' && refer.id != '_-new_line') ;i++)
	{
		refer = get_next_Element(refer);
	}
	return i;
}

function get_line_idx_by_id(ifrm_doc, idstr)
{
	var doc = null;
	if(ifrm_doc){
		doc = ifrm_doc;
	}
	else{
		doc = user_portforward.document;
	}
	if(!idstr)	return -1;
	var elemLine = doc.getElementById(idstr);
	if(!elemLine)	return -1;
	var Parent = elemLine.parentNode;
	var refer = Parent.childNodes[0];
	
	if(!refer)	return 1;

	for(var i = 1; (refer && refer.id != idstr && refer.id != '_-new_line') ;i++)
	{
		refer = get_next_Element(refer);
	}
	return i;
}

function moveRowCustom(idx,frm_fm,ifrm_doc)
{
	var doc = null;
	var F = null;
	if(ifrm_doc)
		doc = ifrm_doc;
	else{
		doc = user_portforward.document;
	}
	if(frm_fm)
		F = frm_fm;
	else
		F = document.portforward_fm;

	if(F.clicked_name.value == '')	return;
	var element = doc.getElementById(F.clicked_name.value);
	if(!element)	return;
	var Parent = element.parentNode;
	var refer = Parent.childNodes[0];
	var old_priority = parseInt(F.old_priority.value);

	if(!refer)	return;

	var lineidx = get_line_idx_by_id(ifrm_doc,F.clicked_name.value);
	if(lineidx == -1)	return;
	var guardidx = get_special_line_idx(ifrm_doc);
	
	if(lineidx < guardidx){
		for(var i = 1; i < idx; i++){
			if(refer)
				refer = get_next_Element(refer);
			if(refer.id == '_-guard_line' || refer.id == '_-new_line'){
				if(F.priority.value == F.old_priority.value)	return;
				F.priority.value = F.old_priority.value;
				moveRowCustom(old_priority, frm_fm, ifrm_doc);	return;
			}
		}
	}
	else{
		for(var i = 1; i <= idx; i++){
			if(refer)
				refer = get_next_Element(refer);
			if(refer.id == '_-new_line'){
				if(F.priority.value == F.old_priority.value)	return;
				F.priority.value = F.old_priority.value;
				moveRowCustom(old_priority, frm_fm, ifrm_doc);	return;
			}
		}
	}

	if(F.cur_priority.value != ''){
		if(lineidx < guardidx){
			if(parseInt(F.cur_priority.value) < idx)
				if(refer)
					refer = get_next_Element(refer);
		}
		else{
			if(parseInt(F.cur_priority.value) <= idx)
				if(refer)
					refer = get_next_Element(refer);
		}
	}

	if(!refer){
		return;
	}

	Parent.insertBefore(element, refer);
	F.cur_priority.value = idx;
}

function onChangedPriority(max_count)
{
	var ifr = user_portforward || document.getElementsByName('user_portforward')[0];
	var F = document.portforward_fm;
	
	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;

	if(F.priority.value == '' || isNaN(F.priority.value)){
		F.priority.value = F.old_priority.value;
	}
	var priority = parseInt(F.priority.value);
	var guardidx = get_special_line_idx();
	var old_priority = parseInt(F.old_priority.value);
	
	if(old_priority < priority){
		if(guardidx > old_priority && priority > guardidx){
			F.priority.value = F.old_priority.value;
			priority = parseInt(F.priority.value);
		}
	}
	else if(old_priority > priority){
		if(guardidx < old_priority && priority < guardidx){
			F.priority.value = F.old_priority.value;
			priority = parseInt(F.priority.value);
		}
	}

	if(priority < 1 || priority > max_count){
		F.priority.value = F.old_priority.value;
		priority = parseInt(F.priority.value);
	}

	moveRowCustom(priority,F);
	ButtonViewControl('modify');
	ifr.window.scroll(0, findPos(ifr,ifr.document.getElementById(F.clicked_name.value)));
}

function Portforward_Restore()
{
	var F = restore_iframe.portforward_file_fm;

	if(F.pf_restore_file.value.length == 0){
		alert(PORTFORWARD_FILE_NOT_EXIST);
		return;
	}
	F.commit.value = 'pf_restore';
	MaskIt(document, 'restore_mask');
	F.submit();
}

function onChangedPFView(mode)
{
	var F = parent.document.portforward_fm || document.portforward_fm;

	if(mode == 'all'){
		F.mode.value = 'all';	F.submit();
	}
	else if(mode == 'user'){
		F.mode.value = 'user';	F.submit();
	}
	else if(mode == 'upnp'){
		F.mode.value = 'upnp';	F.submit();
	}
	else if(mode == 'trigger_status'){
		F.mode.value = 'trigger_status';	F.submit();
	}
}

function onLoadCompleted(doc)
{
	var ifr = doc.restore_iframe || doc.getElementsByName('restore_iframe')[0];

	if(ifr){
		var idoc = ifr.document || ifr.contentWindow.document;
		if(!idoc)	return;
		var ifrm = idoc.portforward_file_fm;
		if(!ifrm)	return;
		var target = ifrm.saverulebtn;
		if(!target)	return;
		var tmp = parseInt(doc.portforward_fm.rule_count.value);
	
		if(tmp == 0)
			DisableObj_For_PF(target);
		else
			EnableObj_For_PF(target);
	}
}

function onAllDeleteChecked(mode,frm_doc,checked)
{
	var delchecked;
	var doc;
	var ifr;
	var idoc;
	
	if(frm_doc){
		doc = frm_doc;
	}

	if(mode == 'user' || mode == 'trigger'){
		ifr = doc.user_portforward || doc.getElementsByName('user_portforward')[0];
		idoc = ifr.document || ifr.contentWindow.document;
		delchecked = idoc.getElementsByName('delcheck');
		if(checked == true){
			for(var i = 0; (delchecked && i < delchecked.length); i++){
				if(delchecked[i].disabled)	continue;
				delchecked[i].checked = true;
			}
		}
		else{
			for(var i = 0; (delchecked && i < delchecked.length); i++){
				if(delchecked[i].disabled)	continue;
				delchecked[i].checked = false;
			}
		}
	}
	else if(mode == 'upnp'){
		ifr = doc.upnp_portforward || doc.getElementsByName('upnp_portforward')[0];
		idoc = ifr.document || ifr.contentWindow.document;
		delchecked = idoc.getElementsByName('delcheck');
		if(checked == true){
			for(var i = 0; (delchecked && i < delchecked.length); i++){
				if(delchecked[i].disabled)	continue;
				delchecked[i].checked = true;
			}
		}
		else{
			for(var i = 0; (delchecked && i < delchecked.length); i++){
				if(delchecked[i].disabled)	continue;
				delchecked[i].checked = false;
			}
		}
	}
	else{
		return;
	}
}

</script>
