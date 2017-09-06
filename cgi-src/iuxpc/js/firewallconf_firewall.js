<script language="javascript" type="text/javascript">

function DisableObj_For_FW(obj)
{
	if(obj){
		obj.disabled = true;
		obj.style.backgroundColor = '#EEEEEE';
	}
}

function EnableObj_For_FW(obj)
{
	if(obj){
		obj.disabled = false;
		obj.style.backgroundColor = '';
	}
}

function All_Enable_FWForm(doc)
{
	var F = document.firewall_fm;
	var ifr = document.macsearch_iframe || document.getElementsByName('macsearch_iframe')[0];

	if(doc){
		F = doc.firewall_fm;
		ifr = doc.macsearch_iframe || doc.getElementsByName('macsearch_iframe')[0];
	}
	var idoc = ifr.document || ifr.contentWindow.document;
	var F2 = idoc.firewall_maclist_fm;

	EnableObj_For_FW(F.direction);		EnableObj_For_FW(F.protocol);		EnableObj_For_FW(F.sport);	EnableObj_For_FW(F.eport);
	EnableObj_For_FW(F.wireless);		EnableObj_For_FW(F.internal_type);	EnableObj_For_FW(F.external_type);
	{
		EnableObj_For_FW(F.ipaddr1);	EnableObj_For_FW(F.ipaddr2);	EnableObj_For_FW(F.ipaddr3);
		EnableObj_For_FW(F.ipaddr4);	EnableObj_For_FW(F.ipaddr5);
	}
	{
		EnableObj_For_FW(F.macaddr1);	EnableObj_For_FW(F.macaddr2);	EnableObj_For_FW(F.macaddr3);
		EnableObj_For_FW(F.macaddr4);	EnableObj_For_FW(F.macaddr5);	EnableObj_For_FW(F.macaddr6);
	}
	if(F2 && F2.macselect){
		EnableObj_For_FW(F2.macselect);
	}
	{
		EnableObj_For_FW(F.extaddr1);	EnableObj_For_FW(F.extaddr2);	EnableObj_For_FW(F.extaddr3);
		EnableObj_For_FW(F.extaddr4);	EnableObj_For_FW(F.extaddr5);
	}
	EnableObj_For_FW(F.sites);	EnableObj_For_FW(F.policy);
	{
		EnableObj_For_FW(F.Mon);	EnableObj_For_FW(F.Tue);	EnableObj_For_FW(F.Wed);
		EnableObj_For_FW(F.Thu);	EnableObj_For_FW(F.Fri);	EnableObj_For_FW(F.Sat);
		EnableObj_For_FW(F.Sun);	EnableObj_For_FW(F.Every);
	}
	EnableObj_For_FW(F.start_time);	EnableObj_For_FW(F.end_time);
}

function All_Disable_FWForm(doc)
{
	var F = document.firewall_fm;
	var ifr = document.macsearch_iframe || document.getElementsByName('macsearch_iframe')[0];

	if(doc){
		F = doc.firewall_fm;
		ifr = doc.macsearch_iframe || doc.getElementsByName('macsearch_iframe')[0];
	}
	var idoc = ifr.document || ifr.contentWindow.document;
	var F2 = idoc.firewall_maclist_fm;

	DisableObj_For_FW(F.direction);	DisableObj_For_FW(F.protocol);		DisableObj_For_FW(F.sport);	DisableObj_For_FW(F.eport);
	DisableObj_For_FW(F.wireless);		DisableObj_For_FW(F.internal_type);	DisableObj_For_FW(F.external_type);
	{
		DisableObj_For_FW(F.ipaddr1);	DisableObj_For_FW(F.ipaddr2);	DisableObj_For_FW(F.ipaddr3);
		DisableObj_For_FW(F.ipaddr4);	DisableObj_For_FW(F.ipaddr5);
	}
	{
		DisableObj_For_FW(F.macaddr1);	DisableObj_For_FW(F.macaddr2);	DisableObj_For_FW(F.macaddr3);
		DisableObj_For_FW(F.macaddr4);	DisableObj_For_FW(F.macaddr5);	DisableObj_For_FW(F.macaddr6);
	}
	if(F2 && F2.macselect){
		DisableObj_For_FW(F2.macselect);
	}
	{
		DisableObj_For_FW(F.extaddr1);	DisableObj_For_FW(F.extaddr2);	DisableObj_For_FW(F.extaddr3);
		DisableObj_For_FW(F.extaddr4);	DisableObj_For_FW(F.extaddr5);
	}
	DisableObj_For_FW(F.sites);	DisableObj_For_FW(F.policy);
	{
		DisableObj_For_FW(F.Mon);	DisableObj_For_FW(F.Tue);	DisableObj_For_FW(F.Wed);
		DisableObj_For_FW(F.Thu);	DisableObj_For_FW(F.Fri);	DisableObj_For_FW(F.Sat);
		DisableObj_For_FW(F.Sun);	DisableObj_For_FW(F.Every);
	}
	DisableObj_For_FW(F.start_time);	DisableObj_For_FW(F.end_time);
}

function All_Clear_FWForm(mode,frm_doc)
{
	var F = document.firewall_fm;
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.firewall_fm;
	}

	{
		if(F.old_priority.value != '' && F.clicked_name.value != '_-new_line'){
			var ifr = doc.firewall_iframe || doc.getElementsByName('firewall_iframe')[0];
			ifr = ifr.document || ifr.contentWindow.document;
			moveRowCustom(parseInt(F.old_priority.value), F, ifr);
			F.old_priority.value = '';
		}
		F.cur_priority.value = '';
		F.act.value = '';
		All_Enable_FWForm(frm_doc);
		EnableObj_For_FW(F.formselect);
		EnableObj_For_FW(F.rule_name);
		F.rule_name.value = '';
		F.disable.checked = false;

		EnableObj_For_FW(F.priority);
		EnableObj_For_FW(F.pri_up);
		EnableObj_For_FW(F.pri_down);
	}

	if(mode == 'internet')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = '';
		doc.getElementById('form_line_wifi').style.display = 'none';
		doc.getElementById('form_line_3').style.display = '';
		doc.getElementById('form_line_4').style.display = '';
		doc.getElementById('form_blank_line').style.display = 'none';

		F.direction.value = 'inout';
		onChangeDirection(frm_doc);
		onChangeProtocol(frm_doc);

		F.protocol.value = 'none';

		F.sport.value = '';
		F.eport.value = '';
		
		F.internal_type.value = 'ip';

		doc.getElementById('IPBOXTD').style.display = '';
		Clear_InternalIPBox(frm_doc);
		doc.getElementById('MACBOXTD').style.display = 'none';
		Clear_MacBox(frm_doc);
		doc.getElementById('MACSEARCHBOXTD').style.display = 'none';
		
		doc.getElementById('RIGHTIPBOX').style.display = '';
		Clear_ExternalIPBox(frm_doc);
		doc.getElementById('RIGHTSITEBOX').style.display = 'none';
		
		F.external_type.value = 'all';
		onChangeExternalType(frm_doc);

		F.policy.value = 'drop';
		F.policy.disabled = false;
		Clear_SchedBox(frm_doc);
	}
	else if(mode == 'site')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = 'none';
		doc.getElementById('form_line_wifi').style.display = 'none';
		doc.getElementById('form_line_3').style.display = '';
		doc.getElementById('form_line_4').style.display = '';
		doc.getElementById('form_blank_line').style.display = '';

		F.direction.value = 'inout';
		onChangeDirection(frm_doc);
		F.internal_type.value = 'ip';
		F.sites.value = '';
		
		doc.getElementById('DIRSPAN_RIGHT').style.display = '';
		doc.getElementById('DIRSPAN_LEFT').style.display = 'none';
		doc.getElementById('DIRSPAN_BOTH').style.display = 'none';
	
		doc.getElementById('IPBOXTD').style.display = '';
		Clear_InternalIPBox(frm_doc);
		doc.getElementById('MACBOXTD').style.display = 'none';
		Clear_MacBox(frm_doc);
		doc.getElementById('MACSEARCHBOXTD').style.display = 'none';
		
		doc.getElementById('RIGHTIPBOX').style.display = 'none';
		doc.getElementById('RIGHTSITEBOX').style.display = '';

		F.policy.value = 'drop';
		F.policy.disabled = false;
		Clear_SchedBox(frm_doc);
	}
	else if(mode == 'wifi')
	{
		doc.getElementById('form_line_1').style.display = '';
		doc.getElementById('form_line_2').style.display = 'none';
		doc.getElementById('form_line_wifi').style.display = '';
		doc.getElementById('form_line_3').style.display = 'none';
		doc.getElementById('form_line_4').style.display = '';
		doc.getElementById('form_blank_line').style.display = '';
		
		DisableObj_For_FW(F.priority);
		DisableObj_For_FW(F.pri_up);
		DisableObj_For_FW(F.pri_down);
		
		F.formselect.value = mode;
		F.policy.value = 'drop';
		F.policy.disabled = true;
		Clear_SchedBox(frm_doc);
	}
}

function Clear_InternalIPBox(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;

	EnableObj_For_FW(F.ipaddr1);
	EnableObj_For_FW(F.ipaddr2);
	EnableObj_For_FW(F.ipaddr3);
	EnableObj_For_FW(F.ipaddr4);
	EnableObj_For_FW(F.ipaddr5);

	F.ipaddr4.value = '';	F.ipaddr5.value = '';
}

function Clear_ExternalIPBox(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;

	EnableObj_For_FW(F.extaddr1);
	EnableObj_For_FW(F.extaddr2);
	EnableObj_For_FW(F.extaddr3);
	EnableObj_For_FW(F.extaddr4);
	EnableObj_For_FW(F.extaddr5);

	F.extaddr1.value = '';	F.extaddr2.value = '';
	F.extaddr3.value = '';	F.extaddr4.value = '';
	F.extaddr5.value = '';
}

function Clear_MacBox(doc)
{
	var F = document.firewall_fm;
	var ifr = document.macsearch_iframe || document.getElementsByName('macsearch_iframe')[0];

	if(doc){
		F = doc.firewall_fm;
		ifr = doc.macsearch_iframe || doc.getElementsByName('macsearch_iframe')[0];
	}
	var idoc = ifr.document || ifr.contentWindow.document;
	var F2 = idoc.firewall_maclist_fm;

	EnableObj_For_FW(F.macaddr1);	EnableObj_For_FW(F.macaddr2);	EnableObj_For_FW(F.macaddr3);
	EnableObj_For_FW(F.macaddr4);	EnableObj_For_FW(F.macaddr5);	EnableObj_For_FW(F.macaddr6);

	F.macaddr1.value = '';	F.macaddr2.value = '';	F.macaddr3.value = '';
	F.macaddr4.value = '';	F.macaddr5.value = '';	F.macaddr6.value = '';

	if(F2 && F2.macselect){
		F2.macselect.value = 'none';
	}
}

function Clear_SchedBox(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;
	
	F.Mon.checked = false;	F.Tue.checked = false;
	F.Wed.checked = false;	F.Thu.checked = false;
	F.Fri.checked = false;	F.Sat.checked = false;
	F.Sun.checked = false;	F.Every.checked = false;

	F.start_time.value = 'all';
	F.end_time.value = '0000';	DisableObj_For_FW(F.end_time);
}

function onChangeDirection(frm_doc)
{
	var F = document.firewall_fm;
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.firewall_fm;
	}
	ButtonViewControl('modify', frm_doc);

	if(F.direction.value == 'inout'){
		for(var i = 0; i < FIREWALL_PROTOCOL_STRING.length; i++){
			F.protocol.options[i].text = FIREWALL_EXTERNAL_STRING + FIREWALL_PROTOCOL_STRING[i];
		}
		doc.getElementById('DIRSPAN_RIGHT').style.display = '';
		doc.getElementById('DIRSPAN_LEFT').style.display = 'none';
		doc.getElementById('DIRSPAN_BOTH').style.display = 'none';
		if(doc.internaltype_value && doc.internaltype_text){
			F.internal_type.options[2] = new Option(doc.internaltype_text[0], doc.internaltype_value[0]);
			F.internal_type.options[3] = new Option(doc.internaltype_text[1], doc.internaltype_value[1]);
			doc.internaltype_value = null;	doc.internaltype_text = null;
		}
	}
	else if(F.direction.value == 'outin'){
		for(var i = 0; i < FIREWALL_PROTOCOL_STRING.length; i++){
			F.protocol.options[i].text = FIREWALL_INTERNAL_STRING + FIREWALL_PROTOCOL_STRING[i];
		}
		doc.getElementById('DIRSPAN_RIGHT').style.display = 'none';
		doc.getElementById('DIRSPAN_LEFT').style.display = '';
		doc.getElementById('DIRSPAN_BOTH').style.display = 'none';
		if(F.internal_type.value == 'mac' || F.internal_type.value == 'search'){
			F.internal_type.value = 'ip';
			onChangeInternalType(doc);
		}

		if(!doc.internaltype_value && !doc.internaltype_text){
			doc.internaltype_value = [];
			doc.internaltype_text = [];
			doc.internaltype_value[0] = 'mac';
			doc.internaltype_value[1] = 'search';
			doc.internaltype_text[0] = F.internal_type[2].text;
			doc.internaltype_text[1] = F.internal_type[3].text;
			F.internal_type[3] = null;	F.internal_type[2] = null;
		}
	}
	else if(F.direction.value == 'both'){
		for(var i = 0; i < FIREWALL_PROTOCOL_STRING.length; i++){
			F.protocol.options[i].text = FIREWALL_BOTH_STRING + FIREWALL_PROTOCOL_STRING[i];
		}
		doc.getElementById('DIRSPAN_RIGHT').style.display = 'none';
		doc.getElementById('DIRSPAN_LEFT').style.display = 'none';
		doc.getElementById('DIRSPAN_BOTH').style.display = '';
		if(!doc.internaltype_value && !doc.internaltype_text){
			doc.internaltype_value = [];
			doc.internaltype_text = [];
			doc.internaltype_value[0] = 'mac';
			doc.internaltype_value[1] = 'search';
			doc.internaltype_text[0] = F.internal_type[2].text;
			doc.internaltype_text[1] = F.internal_type[3].text;
			F.internal_type[3] = null;	F.internal_type[2] = null;
		}
	}
}

function onChangeMode(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;

	ButtonViewControl('modify', doc);

	var value = F.formselect.value;

	All_Clear_FWForm(value,doc);
	F.act.value = 'add';
}

function onChangeInternalType(frm_doc)
{
	var F = document.firewall_fm;
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.firewall_fm;
	}
	ButtonViewControl('modify', frm_doc);

	if(F.internal_type.value == 'ip'){
		doc.getElementById('IPBOXTD').style.display = '';
		doc.getElementById('MACBOXTD').style.display = 'none';
		doc.getElementById('MACSEARCHBOXTD').style.display = 'none';
		
		EnableObj_For_FW(F.ipaddr1);	EnableObj_For_FW(F.ipaddr2);
		EnableObj_For_FW(F.ipaddr3);	EnableObj_For_FW(F.ipaddr4);
		EnableObj_For_FW(F.ipaddr5);
	}
	else if(F.internal_type.value == 'all'){
		doc.getElementById('IPBOXTD').style.display = '';
		doc.getElementById('MACBOXTD').style.display = 'none';
		doc.getElementById('MACSEARCHBOXTD').style.display = 'none';
		
		F.ipaddr1.value = '';	F.ipaddr2.value = '';	F.ipaddr3.value = '';
		F.ipaddr4.value = '';	F.ipaddr5.value = '';
		DisableObj_For_FW(F.ipaddr1);	DisableObj_For_FW(F.ipaddr2);
		DisableObj_For_FW(F.ipaddr3);	DisableObj_For_FW(F.ipaddr4);
		DisableObj_For_FW(F.ipaddr5);
	}
	else if(F.internal_type.value == 'mac'){
		doc.getElementById('IPBOXTD').style.display = 'none';
		doc.getElementById('MACBOXTD').style.display = '';
		doc.getElementById('MACSEARCHBOXTD').style.display = 'none';
	}else if(F.internal_type.value == 'search'){
		doc.getElementById('IPBOXTD').style.display = 'none';
		doc.getElementById('MACBOXTD').style.display = 'none';
		doc.getElementById('MACSEARCHBOXTD').style.display = '';
	}
}

function onChangeExternalType(frm_doc)
{
	var F = document.firewall_fm;
	var doc = document;

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.firewall_fm;
	}
	ButtonViewControl('modify', frm_doc);
	
	if(F.external_type.value == 'ip'){
		EnableObj_For_FW(F.extaddr1);	EnableObj_For_FW(F.extaddr2);
		EnableObj_For_FW(F.extaddr3);	EnableObj_For_FW(F.extaddr4);
		EnableObj_For_FW(F.extaddr5);
	}
	else if(F.external_type.value == 'all'){
		F.extaddr1.value = '';	F.extaddr2.value = '';
		F.extaddr3.value = '';	F.extaddr4.value = '';
		F.extaddr5.value = '';
		DisableObj_For_FW(F.extaddr1);	DisableObj_For_FW(F.extaddr2);
		DisableObj_For_FW(F.extaddr3);	DisableObj_For_FW(F.extaddr4);
		DisableObj_For_FW(F.extaddr5);
	}
}

function onCheckedDisable(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;
	
	ButtonViewControl('modify', doc);
	if(F.disable.checked)
	{
		All_Disable_FWForm(doc);
	}
	else
	{
		All_Enable_FWForm(doc);
		onChangeInternalType(doc);
		onChangeExternalType(doc);
		onCheckedEvery(doc);
		onChangeStartTime(doc);
		onChangeProtocol(doc);
		if(F.formselect.value == 'wifi')
			DisableObj_For_FW(F.policy);
	}
}

function onCheckedEvery(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;
	
	ButtonViewControl('modify', doc);
	if(F.Every.checked)
	{
		DisableObj_For_FW(F.Mon);
		DisableObj_For_FW(F.Tue);
		DisableObj_For_FW(F.Wed);
		DisableObj_For_FW(F.Thu);
		DisableObj_For_FW(F.Fri);
		DisableObj_For_FW(F.Sat);
		DisableObj_For_FW(F.Sun);
	}
	else
	{
		EnableObj_For_FW(F.Mon);
		EnableObj_For_FW(F.Tue);
		EnableObj_For_FW(F.Wed);
		EnableObj_For_FW(F.Thu);
		EnableObj_For_FW(F.Fri);
		EnableObj_For_FW(F.Sat);
		EnableObj_For_FW(F.Sun);
	}
}

function onChangeStartTime(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;
	
	ButtonViewControl('modify', doc);
	if(F.start_time.value == 'all')
	{
		DisableObj_For_FW(F.end_time);
	}
	else
	{
		EnableObj_For_FW(F.end_time);
	}
}

function onChangeProtocol(doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;

	ButtonViewControl('modify', doc);
	var value = F.protocol.value;
	
	if(value == 'none' || value == 'icmp' || value == 'gre')
	{
		F.sport.value = '';		F.eport.value = '';
		DisableObj_For_FW(F.sport);	DisableObj_For_FW(F.eport);
	}
	else
	{
		EnableObj_For_FW(F.sport);	EnableObj_For_FW(F.eport);
	}
}

function ClickedRule(obj,name,bgcolor)
{
	var F = parent.document.firewall_fm;

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

function GetIpMacNumber(type, ipstr, idx){
	if(type == 'ip'){
		var iparr = ipstr.split('.');
	}
	else if(type == 'mac'){
		var iparr = ipstr.split(':');
	}
	else{
		return 0;
	}
	
	return iparr[idx];
}

function onClickedFWRule(mode, name, src_addr_type, src_start, src_end, dest_addr_type, dest_start, dest_end, 
			sport, eport, direction, protocol, policy, days, stime, etime, disabled, priority, wireless)
{
	var F = parent.document.firewall_fm;
	var frm_doc = parent.document;
	var oObj, tObj;
		
	if(name == ''){
		name = '_-new_line';
	}

	if(mode == 'internet'){
		F.formselect.value = mode;
		onChangeMode(frm_doc);
		F.priority.value = priority;
		F.old_priority.value = priority;
	
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			onChangeDirection(frm_doc);
			onChangeProtocol(frm_doc);
			onChangeInternalType(frm_doc);
			onChangeExternalType(frm_doc);
			onChangeStartTime(frm_doc);
			ButtonViewControl('add', frm_doc);
			return;
		}
		F.act.value = 'modify';
		F.rule_name.value = name;
		DisableObj_For_FW(F.rule_name);
		DisableObj_For_FW(F.formselect);
		F.direction.value = direction;
		onChangeDirection(frm_doc);

		F.protocol.value = protocol;
		onChangeProtocol(frm_doc);

		if(sport)
			F.sport.value = sport;
		if(eport)
			F.eport.value = eport;

		F.internal_type.value = src_addr_type;
		onChangeInternalType(frm_doc);
		if(src_addr_type == 'ip'){
			F.ipaddr1.value = GetIpMacNumber('ip',src_start, 0);
			F.ipaddr2.value = GetIpMacNumber('ip',src_start, 1);
			F.ipaddr3.value = GetIpMacNumber('ip',src_start, 2);
			F.ipaddr4.value = GetIpMacNumber('ip',src_start, 3);

			if(src_end != ''){
				F.ipaddr5.value = GetIpMacNumber('ip',src_end, 3);
			}
		}
		else if(src_addr_type == 'all'){
			;
		}
		else if(src_addr_type == 'mac'){
			F.macaddr1.value = GetIpMacNumber('mac',src_start, 0);
			F.macaddr2.value = GetIpMacNumber('mac',src_start, 1);
			F.macaddr3.value = GetIpMacNumber('mac',src_start, 2);
			F.macaddr4.value = GetIpMacNumber('mac',src_start, 3);
			F.macaddr5.value = GetIpMacNumber('mac',src_start, 4);
			F.macaddr6.value = GetIpMacNumber('mac',src_start, 5);
		}
		
		F.external_type.value = dest_addr_type;
		onChangeExternalType(frm_doc);
		if(dest_addr_type == 'ip'){
			F.extaddr1.value = GetIpMacNumber('ip',dest_start, 0);
			F.extaddr2.value = GetIpMacNumber('ip',dest_start, 1);
			F.extaddr3.value = GetIpMacNumber('ip',dest_start, 2);
			F.extaddr4.value = GetIpMacNumber('ip',dest_start, 3);

			if(dest_end != ''){
				F.extaddr5.value = GetIpMacNumber('ip',dest_end, 3);
			}
		}
		else if(dest_addr_type == 'all'){
			;
		}

		F.policy.value = policy;
		
		if(days == 0){
			F.Every.checked = true;
			onCheckedEvery(frm_doc);
		}
		if((0x1) & days){
			F.Sun.checked = true;
		}
		if((0x1 << 1) & days){
			F.Mon.checked = true;
		}
		if((0x1 << 2) & days){
			F.Tue.checked = true;
		}
		if((0x1 << 3) & days){
			F.Wed.checked = true;
		}
		if((0x1 << 4) & days){
			F.Thu.checked = true;
		}
		if((0x1 << 5) & days){
			F.Fri.checked = true;
		}
		if((0x1 << 6) & days){
			F.Sat.checked = true;
		}
		
		F.start_time.value = stime;
		F.end_time.value = etime;
		if(stime == 0 && etime == 0){
			F.start_time.value = 'all';
		}
		onChangeStartTime(frm_doc);

		if(disabled){
			F.disable.checked = true;
			onCheckedDisable(frm_doc);
		}
		ButtonViewControl('clicked', frm_doc);
	}
	else if(mode == 'site'){
		F.formselect.value = mode;
		onChangeMode(frm_doc);
		F.priority.value = priority;
		F.old_priority.value = priority;
		
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			onChangeStartTime(frm_doc);
			onChangeInternalType(frm_doc);
			ButtonViewControl('add', frm_doc);
			return;
		}

		F.act.value = 'modify';
		F.rule_name.value = name;
		DisableObj_For_FW(F.rule_name);
		DisableObj_For_FW(F.formselect);

		F.internal_type.value = src_addr_type;
		onChangeInternalType(frm_doc);
		if(src_addr_type == 'ip'){
			F.ipaddr1.value = GetIpMacNumber('ip',src_start, 0);
			F.ipaddr2.value = GetIpMacNumber('ip',src_start, 1);
			F.ipaddr3.value = GetIpMacNumber('ip',src_start, 2);
			F.ipaddr4.value = GetIpMacNumber('ip',src_start, 3);

			if(src_end != ''){
				F.ipaddr5.value = GetIpMacNumber('ip',src_end, 3);
			}
		}
		else if(src_addr_type == 'all'){
			;
		}
		else if(src_addr_type == 'mac'){
			F.macaddr1.value = GetIpMacNumber('mac',src_start, 0);
			F.macaddr2.value = GetIpMacNumber('mac',src_start, 1);
			F.macaddr3.value = GetIpMacNumber('mac',src_start, 2);
			F.macaddr4.value = GetIpMacNumber('mac',src_start, 3);
			F.macaddr5.value = GetIpMacNumber('mac',src_start, 4);
			F.macaddr6.value = GetIpMacNumber('mac',src_start, 5);
		}

		F.sites.value = dest_start;
		
		F.policy.value = policy;
		
		if(days == 0){
			F.Every.checked = true;
			onCheckedEvery(frm_doc);
		}
		if((0x1 << 0) & days){
			F.Sun.checked = true;
		}
		if((0x1 << 1) & days){
			F.Mon.checked = true;
		}
		if((0x1 << 2) & days){
			F.Tue.checked = true;
		}
		if((0x1 << 3) & days){
			F.Wed.checked = true;
		}
		if((0x1 << 4) & days){
			F.Thu.checked = true;
		}
		if((0x1 << 5) & days){
			F.Fri.checked = true;
		}
		if((0x1 << 6) & days){
			F.Sat.checked = true;
		}
		
		F.start_time.value = stime;
		F.end_time.value = etime;
		if(stime == 0 && etime == 0){
			F.start_time.value = 'all';
		}
		onChangeStartTime(frm_doc);

		if(disabled){
			F.disable.checked = true;
			onCheckedDisable(frm_doc);
		}
		ButtonViewControl('clicked', frm_doc);
	}
	else if(mode == 'wifi'){
		F.formselect.value = mode;
		onChangeMode(frm_doc);
		F.priority.value = '';
		F.old_priority.value = '';
		
		if(F.clicked_bg.value != '' && F.clicked_name.value != ''){
			oObj = document.getElementById(F.clicked_name.value);
			if(oObj)
				oObj.style.backgroundColor = F.clicked_bg.value;
			
		}
		
		oObj = document.getElementById(name);
		if(oObj)
			ClickedRule(oObj, name, oObj.style.backgroundColor);

		if(name == '_-new_line' && protocol == ''){
			onChangeStartTime(frm_doc);
			onChangeInternalType(frm_doc);
			ButtonViewControl('add', frm_doc);
			return;
		}
		
		F.act.value = 'modify';
		F.rule_name.value = name;
		DisableObj_For_FW(F.rule_name);
		DisableObj_For_FW(F.formselect);
		DisableObj_For_FW(F.wireless);

		F.policy.value = policy;

		if(wireless && wireless != '')
			F.wireless.value = wireless;
		
		if(days == 0){
			F.Every.checked = true;
			onCheckedEvery(frm_doc);
		}
		if((0x1 << 0) & days){
			F.Sun.checked = true;
		}
		if((0x1 << 1) & days){
			F.Mon.checked = true;
		}
		if((0x1 << 2) & days){
			F.Tue.checked = true;
		}
		if((0x1 << 3) & days){
			F.Wed.checked = true;
		}
		if((0x1 << 4) & days){
			F.Thu.checked = true;
		}
		if((0x1 << 5) & days){
			F.Fri.checked = true;
		}
		if((0x1 << 6) & days){
			F.Sat.checked = true;
		}
		
		F.start_time.value = stime;
		F.end_time.value = etime;
		if(stime == 0 && etime == 0){
			F.start_time.value = 'all';
		}
		onChangeStartTime(frm_doc);

		if(disabled){
			F.disable.checked = true;
			onCheckedDisable(frm_doc);
		}
		ButtonViewControl('clicked', frm_doc);
	}
	else{
		return;
	}
}

function ButtonViewControl(act,doc)
{
	var F = document.firewall_fm;

	if(doc)
		F = doc.firewall_fm;

	if(act == 'add'){
		DisableObj_For_FW(F.new_rule_btn);
		F.apply_btn.innerHTML = FIREWALL_APPLY_STRING;
		EnableObj_For_FW(F.apply_btn);
		DisableObj_For_FW(F.cancel_btn);
		DisableObj_For_FW(F.disable);
	}
	else if(act == 'clicked'){
		EnableObj_For_FW(F.new_rule_btn);
		F.apply_btn.innerHTML = FIREWALL_MODIFY_STRING;
		DisableObj_For_FW(F.apply_btn);
		DisableObj_For_FW(F.cancel_btn);
		EnableObj_For_FW(F.disable);
	}
	else if(act == 'modify'){
		DisableObj_For_FW(F.new_rule_btn);
		EnableObj_For_FW(F.apply_btn);
		EnableObj_For_FW(F.cancel_btn);
	}
}

function onNewRuleBtnClicked()
{
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	
	if(ifr.firewall_iframe_fm.view_mode.value == '' || ifr.firewall_iframe_fm.view_mode.value == 'all')
		ifr.onNewLineClicked();
	else
		ifr.onNewLineClicked(ifr.firewall_iframe_fm.view_mode.value);
}

function onCancelBtnClicked()
{
	var F = document.firewall_fm;
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var doc = ifr.document;

	if(F.clicked_name.value == '_-new_line'){
		onNewRuleBtnClicked();	return;
	}
	doc.getElementById(F.clicked_name.value).onclick();
}

function check_FW_IPRange(gw_addr, netmask, frm_name)
{
	var element_list = new Array();
	var ipstrs = new Array();

	if(gw_addr != '' && netmask != ''){
       		var gwstrs = gw_addr.split('.');
       		var maskstrs = netmask.split('.');
	}
	var obj = null;

	for(var i = 1; (obj = eval('document.firewall_fm.'+frm_name+i)) ; i++){
		element_list[i-1] = obj;
	}
		
	for(var i = 0; i < element_list.length ; i++){
		if(element_list[i].value != ''){
			if(isNaN(element_list[i].value)){
                       		alert(FIREWALL_IPADDR_UNVALID);
				element_list[i].focus();	element_list[i].select();
                              		return false;
			}
			ipstrs[i] = parseInt(element_list[i].value);
		}
		else{
			ipstrs[i] = 0;
		}
	}

        for(var i = 0; i < element_list.length; i++){
		if(i > 3){
			if(element_list[i].value == '')	break;
			if(ipstrs[i] < ipstrs[3]){
                       		alert(FIREWALL_IPADDR_UNVALID);
				element_list[i].focus();	element_list[i].select();
                              		return false;
			}
		}
		if(ipstrs[i] < 0 || ipstrs[i] > 255){
                       	alert(FIREWALL_IPADDR_UNVALID);
			element_list[i].focus();	element_list[i].select();
                              	return false;
		}
		if(frm_name == 'ipaddr' && gw_addr != '' && netmask != ''){
               		if((parseInt(gwstrs[i]) & parseInt(maskstrs[i])) != (ipstrs[i] & parseInt(maskstrs[i]))){
                	       	alert(FIREWALL_INTIPADDR_UNVALID);
				element_list[i].focus();	element_list[i].select();
                	              	return false;
               		}
		}
        }

	return true;
}

function make_ipaddr(ip1,ip2,ip3,ip4)
{
	return ip1+'.'+ip2+'.'+ip3+'.'+ip4;
}

function make_macaddr(mac1,mac2,mac3,mac4,mac5,mac6)
{
	return mac1+':'+mac2+':'+mac3+':'+mac4+':'+mac5+':'+mac6;
}

function make_days_value()
{
	var F = document.firewall_fm;
	var days = 0;

	if(F.Every.checked)
		return 0;
	if(F.Sun.checked)
		days = days + (0x1);
	if(F.Mon.checked)
		days = days + (0x1 << 1);
	if(F.Tue.checked)
		days = days + (0x1 << 2);
	if(F.Wed.checked)
		days = days + (0x1 << 3);
	if(F.Thu.checked)
		days = days + (0x1 << 4);
	if(F.Fri.checked)
		days = days + (0x1 << 5);
	if(F.Sat.checked)
		days = days + (0x1 << 6);

	if(days == 127){
		return 0;
	}

	return days;
}

function onDeleteClicked()
{
	var F = document.firewall_fm;
	var selmenu = parent.frames[3].document.getElementById('fw_select_menu');
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var F2 = ifr.firewall_iframe_fm;
	if(!F2.delcheck || F2.delcheck.length == 0){
		alert(FIREWALL_NOT_SELECTED_STRING);	return;
	}
	else{
		var checked_count = 0;
		if(F2.delcheck.length){
			for(var i = 0; i < F2.delcheck.length; i++){
				if(F2.delcheck[i].checked)	checked_count += 1;
			}
		}else{
			if(F2.delcheck.checked)		checked_count += 1;
		}
		if(checked_count == 0){
			alert(FIREWALL_NOT_SELECTED_STRING);	return;
		}
	}

	if(confirm(FIREWALL_DEL_CONFIRM_STRING)){
		F2.act.value = 'del';
		if(F.alldel){
			F.alldel.checked = false;
		}
		if(selmenu){
			F2.view_mode.value = selmenu.value;
		}
		else{
			F2.view_mode.value = 'all';
		}
		MaskIt(document, 'apply_mask');
		F2.submit();
	}
}

function onAllDeleteChecked(frm_doc, checked)
{
	var delchecked;
	var doc;
	var ifr;
	var idoc;

	if(frm_doc){
		doc = frm_doc;
	}

	ifr = doc.firewall_iframe || doc.getElementsByName('firewall_iframe')[0];
	idoc = ifr.document || ifr.contentWindow.document;
	delchecked = idoc.getElementsByName('delcheck');
	if(checked == true){
		for(var i = 0; (delchecked && i < delchecked.length); i++){
			delchecked[i].checked = true;
		}
	}
	else{
		for(var i = 0; (delchecked && i < delchecked.length); i++){
			delchecked[i].checked = false;
		}
	}
}

function onApplyBtnClicked(gw_addr, netmask, max_count)
{
	var F = document.firewall_fm;
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var F2 = ifr.firewall_iframe_fm;

	var obj = ifr.document.getElementById('_-new_line');

	if(!obj && (F.apply_btn.innerHTML == FIREWALL_APPLY_STRING)){
		return;
	}

	if(max_count){
		if(F.act.value == 'add' && F.rule_count.value != ''){
			var rcount = parseInt(F.rule_count.value);
			if(rcount >= max_count){
				alert(FIREWALL_MAX_RULE_ALERT);	return;
			}
		}
	}

	if(F.formselect.value == 'internet')
	{
		if(F.rule_name.value == ''){
			alert(FIREWALL_RULENAME_BLANKED);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		if(special_char_validate(F.rule_name.value)){
			alert(FIREWALL_RULENAME_UNVALID);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		
		obj = ifr.document.getElementById(F.rule_name.value);
		if(obj && (F.apply_btn.innerHTML == FIREWALL_APPLY_STRING)){
			alert(FIREWALL_RULENAME_EXIST);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		
		if(F.protocol.value != 'none' && F.protocol.value != 'icmp' && F.protocol.value != 'gre'){
			if(F.sport.value == ''){
				alert(FIREWALL_PORT_BLANKED);
				F.sport.focus();	F.sport.select();	return;
			}
			if(isNaN(F.sport.value) || (parseInt(F.sport.value)<=0 || parseInt(F.sport.value)>65535) || special_char_validate(F.sport.value)){
				alert(FIREWALL_PORT_UNVALID);
				F.sport.focus();	F.sport.select();	return;
			}
			if(F.eport.value != ''){
				if(isNaN(F.eport.value) || (parseInt(F.eport.value)<=0 || parseInt(F.eport.value)>65535) || special_char_validate(F.eport.value)){
					alert(FIREWALL_PORT_UNVALID);
					F.eport.focus();	F.eport.select();	return;
				}
				if(parseInt(F.sport.value) > parseInt(F.eport.value)){
					alert(FIREWALL_PORT_INVALID_RANGE);
					F.eport.focus();	F.eport.select();	return;
				}
			}
		}

		if(F.internal_type.value == ''){
			alert(FIREWALL_INTERNALTYPE_REQUIRED);
			F.internal_type.focus();	return;
		}

		if(F.internal_type.value == 'ip'){
			if(F.ipaddr1.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr1.focus();	F.ipaddr1.select();	return;
			}
			if(F.ipaddr2.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr2.focus();	F.ipaddr2.select();	return;
			}
			if(F.ipaddr3.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr3.focus();	F.ipaddr3.select();	return;
			}
			if(F.ipaddr4.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr4.focus();	F.ipaddr4.select();	return;
			}
			if(!check_FW_IPRange(gw_addr,netmask,'ipaddr'))	return;
		}
		else if(F.internal_type.value == 'mac'){
			if(F.direction.value == 'outin' || F.direction.value == 'both'){
				alert(FIREWALL_INTERNALTYPE_REQUIRED);
				F.internal_type.focus();	return;
			}
			if(F.macaddr1.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr1.focus();	F.macaddr1.select();	return;
			}
			if(F.macaddr2.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr2.focus();	F.macaddr2.select();	return;
			}
			if(F.macaddr3.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr3.focus();	F.macaddr3.select();	return;
			}
			if(F.macaddr4.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr4.focus();	F.macaddr4.select();	return;
			}
			if(F.macaddr5.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr5.focus();	F.macaddr5.select();	return;
			}
			if(F.macaddr6.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr6.focus();	F.macaddr6.select();	return;
			}
		}
		else if(F.internal_type.value == 'search'){
			alert(FIREWALL_MACADDR_NOTSELECT);	return;
		}
		
		if(F.external_type.value == 'ip'){
			if(F.extaddr1.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.extaddr1.focus();	F.extaddr1.select();	return;
			}
			if(F.extaddr2.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.extaddr2.focus();	F.extaddr2.select();	return;
			}
			if(F.extaddr3.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.extaddr3.focus();	F.extaddr3.select();	return;
			}
			if(F.extaddr4.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.extaddr4.focus();	F.extaddr4.select();	return;
			}
			if(!check_FW_IPRange('','','extaddr'))	return;
		}

		F2.act.value = F.act.value;
		var selmenu = parent.frames[3].document.getElementById('fw_select_menu');
		if(selmenu)
			F2.view_mode.value = selmenu.value;
		else
			F2.view_mode.value = 'internet';
		F2.mode.value = F.formselect.value;
		F2.name.value = F.rule_name.value;
		F2.src_addr_type.value = F.internal_type.value;
		if(F.internal_type.value == 'ip'){
			F2.src_start.value = make_ipaddr(F.ipaddr1.value, F.ipaddr2.value, F.ipaddr3.value, F.ipaddr4.value);
			if(F.ipaddr5.value != '')
				F2.src_end.value = make_ipaddr(F.ipaddr1.value, F.ipaddr2.value, F.ipaddr3.value, F.ipaddr5.value);
			else
				F2.src_end.value = '';
		}
		else if(F.internal_type.value == 'mac'){
			F2.src_start.value = make_macaddr(F.macaddr1.value, F.macaddr2.value, F.macaddr3.value,
							F.macaddr4.value, F.macaddr5.value, F.macaddr6.value);
			F2.src_end.value = '';
		}
		else{
			F2.src_start.value = '';
			F2.src_end.value = '';
		}
		F2.dest_addr_type.value = F.external_type.value;
		if(F.external_type.value == 'ip'){
			F2.dest_start.value = make_ipaddr(F.extaddr1.value, F.extaddr2.value, F.extaddr3.value, F.extaddr4.value);
			if(F.extaddr5.value != '')
				F2.dest_end.value = make_ipaddr(F.extaddr1.value, F.extaddr2.value, F.extaddr3.value, F.extaddr5.value);
			else
				F2.dest_end.value = '';
		}
		else{
			F2.dest_start.value = '';
			F2.dest_end.value = '';
		}
		F2.protocol.value = F.protocol.value;
		if(F.protocol.value != 'none' && F.protocol.value != 'icmp' && F.protocol.value != 'gre'){
			F2.sport.value = F.sport.value;
			F2.eport.value = F.eport.value;
		}
		else{
			F2.sport.value = '';
			F2.eport.value = '';
		}
		F2.direction.value = F.direction.value;
		F2.policy.value = F.policy.value;
		F2.days.value = make_days_value();

		if(F.start_time.value == F.end_time.value){
			alert(FIREWALL_TIME_INVALID);
			return;
		}

		F2.stime.value = F.start_time.value;
		F2.etime.value = F.end_time.value;
		F2.disabled.value = (F.disable.checked)?'1':'0';
		F2.priority.value = F.priority.value;
		F2.old_priority.value = F.old_priority.value;
		F.priority.value = '';
		F.old_priority.value = '';
		MaskIt(document, 'apply_mask');

		F.clicked_name.value = '';
		F.clicked_bg.value = '';

		F2.submit();
	}
	else if(F.formselect.value == 'site')
	{
		if(F.rule_name.value == ''){
			alert(FIREWALL_RULENAME_BLANKED);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		if(special_char_validate(F.rule_name.value)){
			alert(FIREWALL_RULENAME_UNVALID);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		obj = ifr.document.getElementById(F.rule_name.value);
		if(obj && (F.apply_btn.innerHTML == FIREWALL_APPLY_STRING)){
			alert(FIREWALL_RULENAME_EXIST);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		if(F.internal_type.value == 'ip'){
			if(F.ipaddr1.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr1.focus();	F.ipaddr1.select();	return;
			}
			if(F.ipaddr2.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr2.focus();	F.ipaddr2.select();	return;
			}
			if(F.ipaddr3.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr3.focus();	F.ipaddr3.select();	return;
			}
			if(F.ipaddr4.value == ''){
				alert(FIREWALL_IPADDR_BLANKED);
				F.ipaddr4.focus();	F.ipaddr4.select();	return;
			}
			if(!check_FW_IPRange(gw_addr,netmask,'ipaddr'))	return;
		}
		else if(F.internal_type.value == 'mac'){
			if(F.macaddr1.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr1.focus();	F.macaddr1.select();	return;
			}
			if(F.macaddr2.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr2.focus();	F.macaddr2.select();	return;
			}
			if(F.macaddr3.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr3.focus();	F.macaddr3.select();	return;
			}
			if(F.macaddr4.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr4.focus();	F.macaddr4.select();	return;
			}
			if(F.macaddr5.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr5.focus();	F.macaddr5.select();	return;
			}
			if(F.macaddr6.value == ''){
				alert(FIREWALL_MACADDR_BLANKED);
				F.macaddr6.focus();	F.macaddr6.select();	return;
			}
		}
		else if(F.internal_type.value == 'search'){
			alert(FIREWALL_MACADDR_NOTSELECT);	return;
		}
		if(F.sites.value == ''){
			alert(FIREWALL_SITE_BLANKED);
			F.sites.focus();	F.sites.select();	return;
		}
		if(special_char_validate(F.sites.value)){
			alert(FIREWALL_SITE_UNVALID);
			F.sites.focus();	F.sites.select();	return;
		}
		
		F2.act.value = F.act.value;
		F2.mode.value = F.formselect.value;
		var selmenu = parent.frames[3].document.getElementById('fw_select_menu');
		if(selmenu)
			F2.view_mode.value = selmenu.value;
		else
			F2.view_mode.value = 'internet';
		F2.name.value = F.rule_name.value;
		F2.src_addr_type.value = F.internal_type.value;
		if(F.internal_type.value == 'ip'){
			F2.src_start.value = make_ipaddr(F.ipaddr1.value, F.ipaddr2.value, F.ipaddr3.value, F.ipaddr4.value);
			if(F.ipaddr5.value != '')
				F2.src_end.value = make_ipaddr(F.ipaddr1.value, F.ipaddr2.value, F.ipaddr3.value, F.ipaddr5.value);
			else
				F2.src_end.value = '';
		}
		else if(F.internal_type.value == 'mac'){
			F2.src_start.value = make_macaddr(F.macaddr1.value, F.macaddr2.value, F.macaddr3.value,
							F.macaddr4.value, F.macaddr5.value, F.macaddr6.value);
			F2.src_end.value = '';
		}
		else{
			F2.src_start.value = '';
			F2.src_end.value = '';
		}
		F2.dest_addr_type.value = 'url';
		F2.dest_start.value = F.sites.value;
		F2.dest_end.value = '';
		F2.protocol.value = '';
		F2.sport.value = '';
		F2.eport.value = '';
		F2.direction.value = 'inout';
		F2.policy.value = F.policy.value;
		F2.days.value = make_days_value();
		F2.stime.value = F.start_time.value;
		F2.etime.value = F.end_time.value;
		F2.disabled.value = (F.disable.checked)?'1':'0';
		F2.priority.value = F.priority.value;
		F2.old_priority.value = F.old_priority.value;
		F.priority.value = '';
		F.old_priority.value = '';
		MaskIt(document, 'apply_mask');

		F.clicked_name.value = '';
		F.clicked_bg.value = '';
		F2.submit();
	}
	else if(F.formselect.value == 'wifi')
	{
		if(F.rule_name.value == ''){
			alert(FIREWALL_RULENAME_BLANKED);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		if(special_char_validate(F.rule_name.value)){
			alert(FIREWALL_RULENAME_UNVALID);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		obj = ifr.document.getElementById(F.rule_name.value);
		if(obj && (F.apply_btn.innerHTML == FIREWALL_APPLY_STRING)){
			alert(FIREWALL_RULENAME_EXIST);
			F.rule_name.focus();	F.rule_name.select();	return;
		}
		F2.act.value = F.act.value;
		var selmenu = parent.frames[3].document.getElementById('fw_select_menu');
		if(selmenu)
			F2.view_mode.value = selmenu.value;
		else
			F2.view_mode.value = 'internet';
		F2.mode.value = F.formselect.value;
		F2.policy.value = F.policy.value;
		F2.days.value = make_days_value();
		F2.name.value = F.rule_name.value;
		F2.band.value = F.wireless.value;

		if(F.start_time.value == F.end_time.value){
			alert(FIREWALL_TIME_INVALID);
			return;
		}

		F2.stime.value = F.start_time.value;
		F2.etime.value = F.end_time.value;
		F2.disabled.value = (F.disable.checked)?'1':'0';
		F.priority.value = '';
		F.old_priority.value = '';
		MaskIt(document, 'apply_mask');

		F.clicked_name.value = '';
		F.clicked_bg.value = '';
		F2.submit();
	}
	else{
		return;
	}
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
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var doc = ifr.document;
	var row = doc.getElementById(row_name);
	var sibling = get_previous_Element(row);
	var Parent = row.parentNode;
	var F = document.firewall_fm;

	if(sibling){
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
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var doc = ifr.document;
	var row = doc.getElementById(row_name);
	var anchor = get_next_Element(row);
	var Parent = row.parentNode;
	var F = document.firewall_fm;

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
	var F = document.firewall_fm;

	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;
	if(F.old_priority.value == '')	return;

	moveRowUp(F.clicked_name.value);
	ButtonViewControl('modify');
}

function onRowDownClicked()
{
	var F = document.firewall_fm;

	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;
	if(F.old_priority.value == '')	return;
	
	moveRowDown(F.clicked_name.value);
	ButtonViewControl('modify');
}

function moveRowCustom(idx,frm_fm,ifrm_doc)
{
	var doc = null;
	var F = null;
	if(ifrm_doc)
		doc = ifrm_doc;
	else{
		doc = firewall_iframe.document;
	}
	if(frm_fm)
		F = frm_fm;
	else
		F = document.firewall_fm;

	if(F.clicked_name.value == '')	return;
	var element = doc.getElementById(F.clicked_name.value);
	if(!element){F.clicked_name.value = '';	F.clicked_bg.value = '';	return;}
	var Parent = element.parentNode;
	var refer = Parent.childNodes[0];
	var old_priority = parseInt(F.old_priority.value);

	if(!refer)	return;

	for(var i = 1; i < idx; i++){
		if(refer)
			refer = get_next_Element(refer);
		if(refer.id == '_-guard_line' || refer.id == '_-new_line'){
			if(F.priority.value == F.old_priority.value)	return;
			F.priority.value = F.old_priority.value;
			moveRowCustom(old_priority, frm_fm, ifrm_doc);	return;
		}
	}

	if(F.cur_priority.value != ''){
		if(parseInt(F.cur_priority.value) < idx)
			if(refer)
				refer = get_next_Element(refer);
	}

	if(!refer){
		return;
	}

	Parent.insertBefore(element, refer);
	F.cur_priority.value = idx;
}

function onChangedPriority(max_count)
{
	var ifr = firewall_iframe || document.getElementsByName('firewall_iframe')[0];
	var F = document.firewall_fm;
	
	if(F.clicked_name.value == '_-new_line' || F.clicked_name.value == '')	return;

	if(F.priority.value == '' || isNaN(F.priority.value)){
		F.priority.value = F.old_priority.value;
	}
	var priority = parseInt(F.priority.value);
	if(priority < 1 || priority > max_count){
		F.priority.value = F.old_priority.value;
		priority = parseInt(F.priority.value);
	}

	moveRowCustom(priority,F);
	ButtonViewControl('modify');
	ifr.window.scroll(0, findPos(ifr,ifr.document.getElementById(F.clicked_name.value)));
}

function Firewall_Restore()
{
	var F = restore_iframe.firewall_file_fm;

	if(F.fw_restore_file.value.length == 0){
		alert(FIREWALL_FILE_NOT_EXIST);
		return;
	}
	F.commit.value = 'fw_restore';
	MaskIt(document, 'restore_mask');
	F.submit();
}

function onChangedFWView(mode)
{
	var F = parent.document.firewall_fm || document.firewall_fm;

	if(mode == 'all'){
		F.mode.value = 'all';	F.submit();
	}
	else if(mode == 'internet'){
		F.mode.value = 'internet';	F.submit();
	}
	else if(mode == 'wifi'){
		F.mode.value = 'wifi';	F.submit();
	}
}

function onClickedMacSelect(frm_doc)
{
	var F = document.firewall_fm;
	var doc = document;
	var ifr = document.macsearch_iframe || document.getElementsByName('macsearch_iframe')[0];

	if(frm_doc){
		doc = frm_doc;
		F = frm_doc.firewall_fm;
		ifr = doc.macsearch_iframe || doc.getElementsByName('macsearch_iframe')[0];
	}
	var idoc = ifr.document || ifr.contentWindow.document;
	var F2 = idoc.firewall_maclist_fm;
	
	var obj = F2.macselect;
	if(obj.value == 'none')		return;
	if(obj.value == 'search'){F2.submit();	return;}

	var splitted = obj.value.split(':');

	F.macaddr1.value = splitted[0];
	F.macaddr2.value = splitted[1];
	F.macaddr3.value = splitted[2];
	F.macaddr4.value = splitted[3];
	F.macaddr5.value = splitted[4];
	F.macaddr6.value = splitted[5];

	F.internal_type.value = 'mac';
	onChangeInternalType(frm_doc);

	ButtonViewControl('modify');
}

function onLoadCompleted(doc){
	var ifr = doc.restore_iframe || doc.getElementsByName('restore_iframe')[0];

	if(ifr){
		var idoc = ifr.document || ifr.contentWindow.document;
		if(!idoc)	return;
		var ifrm = idoc.firewall_file_fm;
		if(!ifrm)	return;
		var target = ifrm.saverulebtn;
		if(!target)	return;
		var tmp = parseInt(doc.firewall_fm.rule_count.value);
	
		if(tmp == 0)
			DisableObj_For_FW(target);
		else
			EnableObj_For_FW(target);
	}
}

</script>
