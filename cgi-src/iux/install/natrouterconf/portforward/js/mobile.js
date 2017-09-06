//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;

var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var IP_NOT_CORRECT = -1;
var IP_BROADCAST = -2;
var IP_GATEWAY = -3;
var IP_NOT_SUBNETWORK = -4;
var IP_BLANKED = -5;

var tmp_config_data = null;

var current_rule_count = null;
var confirm_mode = null;
var confirm_data = null;

var highlight;
var loc = '';
//local-global variables end

//local utility functions
function get_parameter(key)
{
	var _tempUrl = window.location.search.substring(1);
	if(_tempUrl == '')	return null;
	var _tempArray = _tempUrl.split('&');
	
	for(var i = 0; _tempArray.length; i++) {
		var _keyValuePair = _tempArray[i].split('=');
		
		if(_keyValuePair[0] == key){
			return _keyValuePair[1];
		}
	}
	return null;
}

function submit_button_event_add(rule_type)
{
	if(rule_type == 'setup'){
		$('[sid="S_MODIFY_BTN"]').click(function(){
			var localdata = [];
			localdata.push({'name':'act', 'value':'add'});
			localdata.push({'name':'ip', 'value':make_ip_string()});
			submit_local(rule_type, localdata, true);
		});
	}
	else{
		$('[sid="S_MODIFY_BTN"]').click(function(){
			var localdata = [];
			localdata.push({'name':'act', 'value':'modify'});
			localdata.push({'name':'ip', 'value':make_ip_string()});
			submit_local(rule_type, localdata, true);
		});
	}
	$('[sid="S_DELETE_BTN"]').click(function(){
		confirm_mode = 'del'; confirm_data = rule_type;
		confirm(M_lang['S_DELETE_CONFIRMMSG']);
	});
}

function locking_obj(sid, proptype ,defval)
{
	if(defval || defval == ''){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, true);
		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, true);
		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}
}

function unlocking_obj(sid, proptype ,defval)
{
	if(defval || defval == ''){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, false);
		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, false);
		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}
}

function make_ip_string()
{
	var retstr = '';
	retstr += $('[sid="VALUE0"]').val();	retstr += '.';
	retstr += $('[sid="VALUE1"]').val();	retstr += '.';
	retstr += $('[sid="VALUE2"]').val();	retstr += '.';
	retstr += $('[sid="VALUE3"]').val();

	return retstr;
}

function check_iprange()
{
	var gwstr = tmp_config_data.gateway;
	var maskstr = tmp_config_data.netmask;
	var ipstr = make_ip_string();

	if(ipstr == '...'){
		return IP_BLANKED;
	}

	if(!validate_string(ipstr, regExp_ip, 'match')){
		return IP_NOT_CORRECT;
	}
	
	gwstr = gwstr.split('.');
	maskstr = maskstr.split('.');
	ipstr = ipstr.split('.');

	for(var i = 0; i < 4; i++){
		if((parseInt(gwstr[i]) & parseInt(maskstr[i])) != (parseInt(ipstr[i]) & parseInt(maskstr[i]))){
			return IP_NOT_SUBNETWORK;
		}
	}
	
	var invertSubnet = [~parseInt(maskstr[0]),~parseInt(maskstr[1]),~parseInt(maskstr[2]),~parseInt(maskstr[3])];
	if((((invertSubnet[0] | ipstr[0]) & 0xFF) == ipstr[0]) &&
		(((invertSubnet[1] | ipstr[1]) & 0xFF) == ipstr[1]) &&
		(((invertSubnet[2] | ipstr[2]) & 0xFF) == ipstr[2]) &&
		(((invertSubnet[3] | ipstr[3]) & 0xFF) == ipstr[3])){
		return IP_BROADCAST;
	}

	if((parseInt(gwstr[0]) == ipstr[0]) &&
		(parseInt(gwstr[1]) == ipstr[1]) &&
		(parseInt(gwstr[2]) == ipstr[2]) &&
		(parseInt(gwstr[3]) == ipstr[3])){
		return IP_GATEWAY;
	}

	return 0;
}

function check_trigger_forwardport(triggerstr)
{
	var arr = triggerstr.split(' ');
	
	if(!arr || arr.length == 0 || arr.length > 10)	return false;
	for(var i = 0; i < arr.length; i++){
		if(isNaN(arr[i]) || parseInt(arr[i]) <= 0 || parseInt(arr[i]) > 65535){
			return false;
		}
	}
	return true;
}

function forwardrule_validate(ruletype)
{
	if($('[sid="C_'+ruletype.toUpperCase()+'_NAME"]').val() == ''){
		alert(M_lang['S_RULENAME_BLANK']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_NAME"]').val(), regExp_spchar, 'unpermitted')){
		alert(M_lang['S_RULENAME_INVALID']);	return false;
	}
	if($('[sid="C_'+ruletype.toUpperCase()+'_PROTOCOL"]').val() != 'gre' && $('[sid="C_'+ruletype.toUpperCase()+'_EXTSPORT"]').val() == ''){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_EXTSPORT"]').val(), regExp_onlynum, 'match')
		|| !validate_string($('[sid="C_'+ruletype.toUpperCase()+'_EXTEPORT"]').val(), regExp_onlynum, 'match')){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_INTSPORT"]').val(), regExp_onlynum, 'match')
		|| !validate_string($('[sid="C_'+ruletype.toUpperCase()+'_INTEPORT"]').val(), regExp_onlynum, 'match')){
		alert(M_lang['S_INTERNALPORT_INVALID']);	return false;
	}

	var port = $('[sid="C_'+ruletype.toUpperCase()+'_EXTSPORT"]').val();
	if(port != '' && (parseInt(port) <= 0 || parseInt(port) > 65535)){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	port = $('[sid="C_'+ruletype.toUpperCase()+'_EXTEPORT"]').val();
	if(port != '' && (parseInt(port) <= 0 || parseInt(port) > 65535)){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	port = $('[sid="C_'+ruletype.toUpperCase()+'_INTSPORT"]').val();
	if(port != '' && (parseInt(port) <= 0 || parseInt(port) > 65535)){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	port = $('[sid="C_'+ruletype.toUpperCase()+'_INTEPORT"]').val();
	if(port != '' && (parseInt(port) <= 0 || parseInt(port) > 65535)){
		alert(M_lang['S_EXTERNALPORT_INVALID']);	return false;
	}
	
	var result = check_iprange();
	var errorStr = null;

	switch(result){
		case IP_NOT_SUBNETWORK: errorStr = M_lang['S_IP_INTERNALREQUIRED'];		break;
		case IP_NOT_CORRECT:	errorStr = M_lang['S_IP_NOTEXIST'];			break;
		case IP_BROADCAST:	errorStr = M_lang['S_BROADCASTIP_NOT_PERMITTED'];	break;
		case IP_GATEWAY:	errorStr = M_lang['S_GATEWAYIP_NOT_PERMITTED'];		break;
		case IP_BLANKED:	errorStr = M_lang['S_IP_BLANKED'];			break;
	}

	if(errorStr){
		alert(errorStr);	return false;
	}
	return true;
}

function triggerrule_validate(ruletype)
{
	if($('[sid="C_'+ruletype.toUpperCase()+'_NAME"]').val() == ''){
		alert(M_lang['S_RULENAME_BLANK']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_NAME"]').val(), regExp_spchar, 'unpermitted')){
		alert(M_lang['S_RULENAME_INVALID']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_TRIGGERSPORT"]').val(), regExp_onlynum, 'match')
		|| !validate_string($('[sid="C_'+ruletype.toUpperCase()+'_TRIGGEREPORT"]').val(), regExp_onlynum, 'match')){
		alert(M_lang['S_TRIGGERPORT_INVALID']);	return false;
	}
	var port = $('[sid="C_'+ruletype.toUpperCase()+'_TRIGGERSPORT"]').val();
	if(port == '' || parseInt(port) <= 0 || parseInt(port) > 65535){
		alert(M_lang['S_TRIGGERPORT_INVALID']);	return false;
	}
	port = $('[sid="C_'+ruletype.toUpperCase()+'_TRIGGEREPORT"]').val();
	if(port != '' && (parseInt(port) <= 0 || parseInt(port) > 65535)){
		alert(M_lang['S_TRIGGERPORT_INVALID']);	return false;
	}
	if($('[sid="C_'+ruletype.toUpperCase()+'_FORWARDPORT"]').val() == ''){
		alert(M_lang['S_FORWARDPORT_INVALID']);	return false;
	}
	if(!check_trigger_forwardport($('[sid="C_'+ruletype.toUpperCase()+'_FORWARDPORT"]').val())){
		alert(M_lang['S_FORWARDPORT_INVALID']);	return false;
	}
	return true;
}

function validate_string(str, regExp, type)
{
	if(type == 'unpermitted'){if(str.match(regExp))	return false;}
	else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
	return true;
}

function footerbtn_view_control()
{
	if(check_change_value()){
		unlocking_obj('S_MODIFY_BTN', 'disabled');
		unlocking_obj('S_CANCEL_BTN', 'disabled');
	}else{
		locking_obj('S_MODIFY_BTN', 'disabled');
		locking_obj('S_CANCEL_BTN', 'disabled');
	}
}

function btncontrol_event_add(sid, type)
{
	switch(type){
		case "click":	$('[sid="'+sid+'"]').click(function(){footerbtn_view_control();});break;
		case "keyup":	$('[sid="'+sid+'"]').keyup(function(){footerbtn_view_control();});break;
		case "change":	$('[sid="'+sid+'"]').change(function(){footerbtn_view_control();});break;
	}
}

function set_portdisable_by_protocol(ruletype)
{
	if($('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').val() == 'gre'){
		locking_obj('C_'+ruletype.toUpperCase()+'_INTSPORT','readonly','');
		locking_obj('C_'+ruletype.toUpperCase()+'_INTEPORT','readonly','');
		locking_obj('C_'+ruletype.toUpperCase()+'_EXTSPORT','readonly','');
		locking_obj('C_'+ruletype.toUpperCase()+'_EXTEPORT','readonly','');
	}
	else{
		unlocking_obj('C_'+ruletype.toUpperCase()+'_INTSPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_INTEPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_EXTSPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_EXTEPORT','readonly');
	}
}

function all_disable_control(ruletype)
{
	if(ruletype == 'forwardrule' || ruletype == 'upnprule' || ruletype == 'setup'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_IP\"] .lc_inputbox_ip input').prop('readonly', true);
		$('[sid=\"C_'+ruletype.toUpperCase()+'_IP\"] .lc_inputbox_ip').addClass('ui-state-disabled');
		locking_obj('C_'+ruletype.toUpperCase()+'_RULETYPE','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_PROTOCOL','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_INTSPORT','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_INTEPORT','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_EXTSPORT','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_EXTEPORT','readonly');
		locking_obj('CURCON_IP','readonly');
	}
	else{
		locking_obj('C_'+ruletype.toUpperCase()+'_TRIGGERPROTOCOL','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_FORWARDPROTOCOL','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_TRIGGERSPORT','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_TRIGGEREPORT','readonly');
		locking_obj('C_'+ruletype.toUpperCase()+'_FORWARDPORT','readonly');
	}
}

function all_enable_control(ruletype)
{
	if(ruletype == 'forwardrule' || ruletype == 'upnprule' || ruletype == 'setup'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_IP\"] .lc_inputbox_ip input').prop('readonly', false);
		$('[sid=\"C_'+ruletype.toUpperCase()+'_IP\"] .lc_inputbox_ip').removeClass('ui-state-disabled');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_RULETYPE','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_PROTOCOL','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_INTSPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_INTEPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_EXTSPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_EXTEPORT','readonly');
		unlocking_obj('CURCON_IP','readonly');
		set_portdisable_by_protocol(ruletype);
	}
	else{
		unlocking_obj('C_'+ruletype.toUpperCase()+'_TRIGGERPROTOCOL','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_FORWARDPROTOCOL','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_TRIGGERSPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_TRIGGEREPORT','readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_FORWARDPORT','readonly');
	}
}

function change_forward_predefined(ruletype, protoval, portval)
{
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').val(protoval).selectmenu('refresh',true).trigger('change');
	$('[sid=\"C_'+ruletype.toUpperCase()+'_INTSPORT\"]').val(portval);
	$('[sid=\"C_'+ruletype.toUpperCase()+'_EXTSPORT\"]').val(portval);
}

function findPos(obj)
{
	var curTop = 0;
	if(!obj)	return 0;
	curTop = Math.max(0, (obj.offsetTop - (document.body.clientHeight/2)));
	return curTop;
}

function move_line(idvalue, priority)
{
	var ruletype = get_ruletype(idvalue);
	if(ruletype == 'setup'){return;}
	if(priority == '' || isNaN(priority)){return;}
	var converted_priority = parseInt(priority);

	if(ruletype == 'forwardrule'){
		if(converted_priority > 0 && converted_priority < tmp_config_data.pf_rules.length){
			var insertidx = converted_priority - 1;
			if(converted_priority == 1)		$('#'+idvalue).insertAfter($('#portforward_listbox .lc_infobox_div'));
			else if(converted_priority <= get_ruleindex(idvalue)){
				$('#'+idvalue).insertAfter($('#forwardrule_'+(insertidx - 1)));
			}
			else					$('#'+idvalue).insertAfter($('#forwardrule_'+insertidx));
			window.scroll(0, findPos($('#'+idvalue)[0]));
		}
	}else if(ruletype == 'triggerrule'){
		var pfrule_count = tmp_config_data.pf_rules.length - 1;
		if(converted_priority > pfrule_count && converted_priority < (pfrule_count + tmp_config_data.pt_rules.length)){
			var insertidx = (converted_priority - pfrule_count) - 1;
			if(converted_priority == 1)		$('#'+idvalue).insertAfter($('#portforward_listbox .lc_infobox_div'));
			else if(insertidx == 0){
				$('#'+idvalue).insertAfter($('#forwardrule_'+(pfrule_count - 1)));
			}
			else if(converted_priority <= (pfrule_count + get_ruleindex(idvalue))){
				$('#'+idvalue).insertAfter($('#triggerrule_'+(insertidx - 1)));
			}
			else					$('#'+idvalue).insertAfter($('#triggerrule_'+insertidx));
			window.scroll(0, findPos($('#'+idvalue)[0]));
		}
	}
}

function default_priority_restore(idval)
{
	var ruletype = get_ruletype(idval);
	var ruleidx = get_ruleindex(idval) - 1;
	var original_priority;
	if(ruletype == 'setup')	return;

	if(ruletype == 'forwardrule'){original_priority = tmp_config_data.pf_rules[ruleidx].priority;}
	else if(ruletype == 'triggerrule'){original_priority = tmp_config_data.pt_rules[ruleidx].priority;}
	else return;
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val(parseInt(original_priority)).trigger('change');
}

function check_priority_range(ruletype, prio)
{
	if(ruletype == 'setup')	return true;
	if(ruletype == 'forwardrule'){
		if(prio < 1 || prio > (tmp_config_data.pf_rules.length -1))
			return false;
	}
	else if(ruletype == 'triggerrule'){
		if(prio < (tmp_config_data.pf_rules.length) ||  prio > ((tmp_config_data.pf_rules.length + tmp_config_data.pt_rules.length) - 2))
			return false;
	}
	return true;
}

function basic_control_event_add(ruletype, idval)
{
	$('[sid^="C_"]').each(function(){
		var type=$(this).attr('type');
		if(!type)	return;
		var sid=$(this).attr('sid');
		var etype;

		switch(type){
			case 'checkbox':
			case 'select':	etype='change';	break;
			case 'text':
			case 'number':	etype='keyup';	break;
			default:	return;
		}
		btncontrol_event_add(sid,etype);
	});
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').unbind('change').change(function(){
		if($(this).val() == '' || isNaN($(this).val())){default_priority_restore(idval);}
		if(!check_priority_range(get_ruletype(idval), $(this).val())){default_priority_restore(idval);}
		move_line(idval,$(this).val());
	});

	$('[sid="PRIORITY_UP"]').click(function(){
		var prio = $('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val();
		if(prio != '' && !isNaN(prio)){
			if(parseInt(prio) > 1 && check_priority_range(ruletype, (parseInt(prio)-1)))
				$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val(parseInt(prio) - 1).trigger('change');
		}
		else{default_priority_restore(idval);}
		if(ruletype != 'setup')footerbtn_view_control();
	});
	$('[sid="PRIORITY_DOWN"]').click(function(){
		var prio = $('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val();
		if(prio != '' && !isNaN(prio)){
			if(parseInt(prio) < parseInt(tmp_config_data.max_rule_count) && check_priority_range(ruletype, (parseInt(prio)+1)))
				$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val(parseInt(prio) + 1).trigger('change');
		}
		else{default_priority_restore(idval);}
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').unbind('change').change(function(){
		set_portdisable_by_protocol(ruletype);
		$(this).selectmenu('refresh', true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid=\"C_'+ruletype.toUpperCase()+'_DISABLED\"]').unbind('change').change(function(){
		if($(this).is(':checked')){all_disable_control(ruletype);}
		else{all_enable_control(ruletype);}
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_RULETYPE\"]').unbind('change').change(function(){
		if($(this).val() == 'trigger'){
			$('[sid="PORTFORWARD_LINE"]').css('display','none');
			$('[sid="PORTTRIGGER_LINE"]').css('display','');
		}else{
			$('[sid="PORTFORWARD_LINE"]').css('display','');
			$('[sid="PORTTRIGGER_LINE"]').css('display','none');
		}
		switch($(this).val()){
			case '0':	change_forward_predefined(ruletype, 'tcp', '');		break;
			case 'http':	change_forward_predefined(ruletype, 'tcp', 80);		break;
			case 'https':	change_forward_predefined(ruletype, 'tcp', 443);	break;
			case 'ftp':	change_forward_predefined(ruletype, 'tcp', 21);		break;
			case 'pop3':	change_forward_predefined(ruletype, 'tcp', 110);	break;
			case 'smtp':	change_forward_predefined(ruletype, 'tcp', 25);		break;
			case 'dns':	change_forward_predefined(ruletype, 'udp', 53);		break;
			case 'telnet':	change_forward_predefined(ruletype, 'tcp', 23);		break;
			case 'ipsec':	change_forward_predefined(ruletype, 'udp', 500);	break;
			case 'pptp':	change_forward_predefined(ruletype, 'tcp', 1723);	break;
			case M_lang['S_SETUP_RULETYPE'][10].value:	change_forward_predefined(ruletype, 'tcp', 3389);	break;
		}
		$(this).selectmenu('refresh', true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid="S_CANCEL_BTN"]').click(function(){
		iux_update('C');
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').trigger('change');

	});
	
	$('[sid="S_NEWRULE_BTN"]').click(function(){
		if(current_rule_count >= parseInt(tmp_config_data.max_rule_count)){
			alert(M_lang['S_PORTFORWARD_NOMORERULES']);	return;
		}
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').trigger('change');
		highlight();
		load_rightpanel('setup_0');
	});

	$('[sid="CURCON_IP"]').change(function(){
		if($(this).is(':checked')){
			if(tmp_config_data.current_ip){
				var arr = tmp_config_data.current_ip.split('.');
				for(var i = 0; i < arr.length; i++){
					$('[sid=\"VALUE'+i+'\"]').val(arr[i]);
				}
			}
		}
		else{$('[sid=VALUE3]').val('');}
		if(ruletype != 'setup')footerbtn_view_control();
	});
	submit_button_event_add(ruletype);
}

function fileform_listener_add()
{
	$('[sid="PORTFORWARD_RESTORE"]').unbind('click').click(function() {
		if($('[sid="C_PORTFORWARD_RESTOREFILE"]').val().length == 0){alert(M_lang['S_PORTFORWARD_FILENOTEXIST']);	return;}
		confirm_mode = 'restore';
		confirm(M_lang['S_PORTFORWARD_RESTOREMSG']);
	});
	$('[sid="C_PORTFORWARD_RESTOREFILE"]').unbind('change').change(function() {
		var filename = $(this).val()+"";
		if(filename){filename = filename.substr(filename.lastIndexOf("\\")+1, filename.length);}
		$('[sid="S_PORTFORWARD_FILESELECT"]').val($(this).val()?filename:M_lang['S_PORTFORWARD_FILESELECT']);
	}).val('').trigger('change');
	$('[sid="PORTFORWARD_BACKUP"]').unbind('click').click(function(){self.location.href='/cgi/iux_download.cgi?act=portforward';});
}

function ip_control_event_add(ruletype)
{
	$('[sid=\"C_'+ruletype.toUpperCase()+'_IP\"] input').each(function(){
		btncontrol_event_add($(this).attr('sid'), 'keyup');
	});
}

function local_fileform_submit(rule_type)
{
	var postData = new FormData($('#iux_file_form')[0]);
	postData.append("tmenu",window.tmenu);
	postData.append("smenu",window.smenu);
	postData.append("act",'restore');

	window.scroll(0,0);
	$.ajax({
		url: '/cgi/iux_set.cgi',
		processData: false,
		contentType: false,
		data: postData,
		type: 'POST',
		success: function(data){
			$('#loading').popup('close');
			if(data == 'fail'){
				alert(M_lang['S_PORTFORWARD_RESTOREFAIL']);
			}
			else{
				alert(M_lang['S_PORTFORWARD_RESTORESUCCESS']);
			}
			get_config(window.tmenu, window.smenu, {name : 'category', value : $('[sid="PAGE_MENU"]').val()});
			//iux_update_local();
			$('[sid="C_PORTFORWARD_RESTOREFILE"]').val('').trigger('change');
		},
		error: function(){
			$('#loading').popup('close');
			alert(M_lang['S_PORTFORWARD_RESTOREFAIL']);
			$('[sid="C_PORTFORWARD_RESTOREFILE"]').val('').trigger('change');
		}
	});
}

function pageview_select_update(mode)
{
	$('[sid="PAGE_MENU"]').append('<option value=\"all\"'+((mode&&mode=='all')?' selected':'')+'>'+M_lang['S_ALLVIEW_STRING']+'</option>');
	$('[sid="PAGE_MENU"]').append('<option value=\"portforward\"'+((!mode||mode=='portforward')?' selected':'')+'>'+M_lang['S_PORTFORWARDVIEW_STRING']+'</option>');
	$('[sid="PAGE_MENU"]').append('<option value=\"upnp\"'+((mode&&mode=='upnp')?' selected':'')+'>'+M_lang['S_UPNPVIEW_STRING']+'</option>');
	if(config_data.use_trigger && config_data.use_trigger == '1'){
		$('[sid="PAGE_MENU"]').append('<option value=\"porttrigger\"'+((mode&&mode=='porttrigger')?' selected':'')+'>'+M_lang['S_PORTTRIGGERVIEW_STRING']+'</option>');
	}

	$('[sid="PAGE_MENU"]').css('display','inline-block');
	$('[sid="PAGE_MENU"]').css('direction','rtl');
	$('[sid="PAGE_MENU"]').change(function(){
		window.scroll(0,0);
		get_config(window.tmenu, window.smenu, {name : 'category', value : $(this).val()});
		//iux_update_local();
	});
}

function append_main_line(bgidx, ruletype, ruleidx, disabled, fixed)
{
	var HTMLStr = ('<div class=\"'+((bgidx % 2 == 1) ? 'lc_whitebox_div' : 'lc_greenbox_div')+'\" id=\"'+ruletype+'_'+ruleidx+'\" ');
	if(fixed && fixed=='1'){
		HTMLStr += 'sid=\"NOCLICKDATA\">';
	}else{
		HTMLStr += 'sid=\"LISTDATA\">';
	}
	HTMLStr += '<div class=\"lc_priority_div\"><div class=\"lc_line_div\">';
	HTMLStr += ('<p class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\">'+(bgidx)+'</p></div>');
	HTMLStr += '<div class=\"lc_line_div\"></div></div>';
	HTMLStr += '<div class=\"lc_leftbox_div\"><div class=\"lc_line_div\">';
	HTMLStr	+= ('<p sid=\"RULENAME_FIELD\" class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\"></p></div>');
	HTMLStr	+= ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_leftcolor')+'\">');
	HTMLStr += ('<p sid=\"EXTERNAL_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div></div>');
	HTMLStr += '<div class=\"lc_direction_div\"><div class=\"lc_line_div\"></div>';
	HTMLStr += ('<div class=\"lc_line_div\"><p class=\"'+((disabled == '1')?'lc_disabled_text':'lc_grayfont_text')+'\">');
	HTMLStr += ('<img src=\"'+(disabled == '1'?('/common/images/right_arrow.png'):('/common/images/right_arrow_accept.png'))+'\"></p></div></div>');
	HTMLStr	+= ('<div class=\"lc_rightbox_div\"><div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_rightcolor')+'\">');
	HTMLStr += ('<p sid=\"IP_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div>');
	HTMLStr	+= ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_rightcolor')+'\">');
	HTMLStr += ('<p sid=\"INTERNAL_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div></div></div>');
	if(ruletype == 'triggerstatus')	$('#porttrigger_listbox').append(HTMLStr).trigger('create');
	else				$('#portforward_listbox').append(HTMLStr).trigger('create');

	if(!fixed){
		$('#'+ruletype+'_'+ruleidx).unbind("taphold").on( "taphold", function(event) {
        	        $( event.currentTarget).addClass( "taphold" );
        	        listId = $(event.currentTarget).attr('id');
        	        popup( M_lang['S_POPUPTITLE_'+ruletype.toUpperCase()],  listId);
        	});
	}

}
function append_upnp_line(bgidx, ruletype, ruleidx)
{
	var HTMLStr = ('<div class=\"'+((bgidx % 2 == 1) ? 'lc_whitebox_div' : 'lc_greenbox_div')+'\" id=\"'+ruletype+'_'+ruleidx+'\" sid=\"LISTDATA\">');
	HTMLStr += '<div class=\"lc_priority_div\"><div class=\"lc_line_div\">';
	HTMLStr += ('<p class=\"lc_boldfont_text\">'+(bgidx)+'</p></div><div class=\"lc_line_div\"></div></div>');
	HTMLStr += '<div class=\"lc_leftbox_div\"><div class=\"lc_line_div\">';
	HTMLStr	+= '<p sid=\"RULENAME_FIELD\" class=\"lc_boldfont_text\"></p></div><div class=\"lc_line_div\">';
	HTMLStr += '<p sid=\"EXTERNAL_FIELD\" class=\"lc_grayfont_text\"></p></div></div>';
	HTMLStr += '<div class=\"lc_direction_div\"><div class=\"lc_line_div\"></div>';
	HTMLStr += '<div class=\"lc_line_div\"><p class=\"lc_grayfont_text\"></p></div></div>';
	HTMLStr	+= '<div class=\"lc_rightbox_div\"><div class=\"lc_line_div\"><p class=\"lc_grayfont_text\"></p></div>';
	HTMLStr	+= '<div class=\"lc_line_div\"><p sid=\"IP_FIELD\" class=\"lc_grayfont_text\"></p></div></div></div>';
	$('#upnp_listbox').append(HTMLStr).trigger('create');
	
	$('#'+ruletype+'_'+ruleidx).unbind("taphold").on( "taphold", function(event) {
                $( event.currentTarget).addClass( "taphold" );
                listId = $(event.currentTarget).attr('id');
                popup( M_lang['S_POPUPTITLE_'+ruletype.toUpperCase()],  listId);
        });
}
function append_newrule_line(idx)
{
	var HTMLStr = (((idx % 2) == 1)?('<div class=\"lc_whitebox_div\" id=\"setup_0\" sid=\"LISTDATA\">')
				:('<div class=\"lc_greenbox_div\" id=\"setup_0\" sid=\"LISTDATA\">'));
	HTMLStr += '<div class=\"lc_priority_div\"><div class=\"lc_newline_div\"><img src=\"/common/images/add_icon.png\"></div></div>';
	HTMLStr += '<div class=\"lc_leftbox_div\"><div class=\"lc_newline_div\"><p class=\"lc_boldfont_text\" sid=\"S_NEWRULE_STRING\">';
	HTMLStr += (M_lang['S_NEWRULE_STRING']);
	HTMLStr += '</p></div></div></div>';
	if(current_rule_count >= parseInt(config_data.max_rule_count)){return;}

	$('#portforward_listbox').append(HTMLStr).trigger('create');
}

function update_portforward_line(idval, configObj)
{
	var dual_wan_mode = '0';

	if(config_data.use_dual_wan)
		dual_wan_mode = config_data.use_dual_wan;

	var valtxt = configObj.name + ((configObj.disabled == '1')?M_lang['S_DISABLED_STATUS']:'');
	$('#'+idval+' [sid="RULENAME_FIELD"]').text(valtxt);

	valtxt = configObj.protocol.toUpperCase();
	valtxt	+= (dual_wan_mode == '1')?(configObj.wanname.toUpperCase() + '-'):'';
	valtxt	+= (configObj.protocol == 'gre')?'':'(';
	valtxt	+= (parseInt(configObj.extsport) > 0)?configObj.extsport:'';
	valtxt	+= (parseInt(configObj.exteport) > 0)?('~' + configObj.exteport):'';
	valtxt	+= (configObj.protocol == 'gre')?'':')';
	$('#'+idval+' [sid="EXTERNAL_FIELD"]').text(valtxt);

	valtxt = configObj.ip;
	$('#'+idval+' [sid="IP_FIELD"]').text(valtxt);

	valtxt	= configObj.protocol.toUpperCase();
	valtxt	+= (configObj.protocol == 'gre')?'':'(';
	if(configObj.intsport != ''){
		valtxt	+= (parseInt(configObj.intsport) > 0)?configObj.intsport:'';
		valtxt	+= (parseInt(configObj.inteport) > 0)?('~' + configObj.inteport):'';
	}else{
		valtxt	+= (parseInt(configObj.extsport) > 0)?configObj.extsport:'';
		valtxt	+= (parseInt(configObj.exteport) > 0)?('~' + configObj.exteport):'';
	}
	valtxt	+= (configObj.protocol == 'gre')?'':')';
	$('#'+idval+' [sid="INTERNAL_FIELD"]').text(valtxt);
}

function update_upnp_line(idval, configObj)
{
	var dual_wan_mode = '0';

	if(config_data.use_dual_wan)
		dual_wan_mode = config_data.use_dual_wan;

	var valtxt = configObj.name;
	$('#'+idval+' [sid="RULENAME_FIELD"]').text(valtxt);

	valtxt = configObj.protocol.toUpperCase();
	valtxt	+= (dual_wan_mode == '1')?(configObj.wanname.toUpperCase() + '-' + '('):'(';
	valtxt	+= (parseInt(configObj.extsport) > 0)?configObj.extsport:'';
	valtxt	+= (parseInt(configObj.exteport) > 0)?('~' + configObj.exteport + ')'):')';
	$('#'+idval+' [sid="EXTERNAL_FIELD"]').text(valtxt);

	valtxt = configObj.ip;
	$('#'+idval+' [sid="IP_FIELD"]').text(valtxt);
}

function update_porttrigger_line(idval, configObj)
{
	var valtxt = configObj.name + ((configObj.disabled == '1')?M_lang['S_DISABLED_STATUS']:'');
	$('#'+idval+' [sid="RULENAME_FIELD"]').text(valtxt);

	valtxt = configObj.forwardprotocol.toUpperCase() + '(' + configObj.forwardport + ')';
	$('#'+idval+' [sid="EXTERNAL_FIELD"]').text(valtxt);

	valtxt = M_lang['S_TRIGGER_PREFIX'] + '-' + configObj.triggerprotocol.toUpperCase() + '(' + configObj.triggersport;
	valtxt += (parseInt(configObj.triggereport) > 0)?('~' + configObj.triggereport +')'):')';
	$('#'+idval+' [sid="IP_FIELD"]').text(valtxt);

	valtxt = configObj.forwardprotocol.toUpperCase() + '(' + configObj.forwardport + ')';
	$('#'+idval+' [sid="INTERNAL_FIELD"]').text(valtxt);
}

function update_porttrigger_status_line(idval, configObj)
{
	var valtxt = configObj.name;
	$('#'+idval+' [sid="RULENAME_FIELD"]').text(valtxt);

	valtxt = configObj.triggerprotocol.toUpperCase() + '(' + configObj.triggersport;
	valtxt += (parseInt(configObj.triggereport) > 0)?('~' + configObj.triggereport +')'):')';
	$('#'+idval+' [sid="EXTERNAL_FIELD"]').text(valtxt);

	valtxt = configObj.forwardip;
	$('#'+idval+' [sid="IP_FIELD"]').text(valtxt);

	valtxt = configObj.forwardprotocol.toUpperCase() + '(' + configObj.forwardport + ')';
	$('#'+idval+' [sid="INTERNAL_FIELD"]').text(valtxt);
}

function make_localConfigObj(mode, configObj)
{
	var localConfigObj = new Object();

	switch(mode){
		case 'forwardrule':	
			localConfigObj.forwardrule = configObj;
			localConfigObj.forwardrule.ruletype = '0';
			break;
		case 'triggerrule':	
			localConfigObj.triggerrule = configObj;		
			localConfigObj.triggerrule.ruletype = 'trigger';
			break;
		case 'triggerstatus':	localConfigObj.triggerstatus = configObj;	break;
		case 'upnprule':	localConfigObj.upnprule = configObj;		break;
		case 'setup':
			localConfigObj.setup = new Object();
			localConfigObj.setup.priority = '';
			localConfigObj.setup.name = '';
			localConfigObj.setup.ip = '';
			localConfigObj.setup.intsport = '';
			localConfigObj.setup.inteport = '';
			localConfigObj.setup.extsport = '';
			localConfigObj.setup.exteport = '';
			localConfigObj.setup.wanname = 'wan1';
			localConfigObj.setup.disabled = '0';
			localConfigObj.setup.protocol = 'tcp';
			localConfigObj.setup.triggersport = '';
			localConfigObj.setup.triggereport = '';
			localConfigObj.setup.forwardport = '';
			localConfigObj.setup.forwardprotocol = 'tcp';
			localConfigObj.setup.triggerprotocol = 'tcp';
			localConfigObj.setup.ruletype = '0';
			break;
	}
	return localConfigObj;
}

function get_localConfigObj(_idstr)
{
	if(!_idstr)	return null;
	
	var arr = _idstr.split('_');

	switch(arr[0]){
		case 'forwardrule':	return make_localConfigObj(arr[0], config_data.pf_rules[parseInt(arr[1])]);
		case 'triggerrule':	return make_localConfigObj(arr[0], config_data.pt_rules[parseInt(arr[1])]);
		case 'triggerstatus':	return make_localConfigObj(arr[0], config_data.pt_status[parseInt(arr[1])]);
		case 'upnprule':	return make_localConfigObj(arr[0], config_data.upnp_rules[parseInt(arr[1])]);
		case 'setup':		return make_localConfigObj(arr[0], null);
	}
}

function get_ruletype(_idstr)
{
	if(!_idstr)	return 'setup';
	else	return _idstr.split('_')[0];
}
function get_ruleindex(_idstr)
{
	if(!_idstr)	return 0;
	else	return parseInt(_idstr.split('_')[1]) + 1;
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	else {
		if(flag){
			if(confirm_mode == 'del'){
				var localdata = [];
				localdata.push({'name':'act', 'value':'del'});
				submit_local(confirm_data, localdata, false);
			}
			else if(confirm_mode == 'restore'){
				submit_local('restore', 'restore');
			}
			else if(confirm_mode == 'del_popup'){
				var submit_data = get_localConfigObj(confirm_data);
				var rtype = get_ruletype(confirm_data);
				var localpostdata = [];
				localpostdata.push({'name':'act', 'value':'del'});
				switch(rtype){
					case 'forwardrule':
						localpostdata.push({'name':'name', 'value':submit_data.forwardrule.name});
						break;
					case 'triggerrule':
						localpostdata.push({'name':'name', 'value':submit_data.triggerrule.name});
						break;
					case 'upnprule':
						localpostdata.push({'name':'protocol', 'value':submit_data.upnprule.protocol});
						localpostdata.push({'name':'extsport', 'value':submit_data.upnprule.extsport});
						break;
				}
				$('#loading').popup('open');
				iux_submit(rtype,localpostdata, false, {'name':'category', 'value':$('[sid="PAGE_MENU"]').val()});
				//iux_update_local();
			}
		}
	}
	confirm_data = null;	confirm_mode = null;
}
//local utility functions end

//local functions start
iux_update_local_func['all'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	$('[sid="NOCLICKDATA"]').remove();
	var i = 1;

	$('#portforward_listbox').css('display','');
	for(var j = 0; j < config_data.pf_rules.length; i++, j++){
		if(!config_data.pf_rules[j].name)	break;
		append_main_line(i,'forwardrule',j,config_data.pf_rules[j].disabled, config_data.pf_rules[j].fixed);
		update_portforward_line('forwardrule_'+j, config_data.pf_rules[j]);
	}
	if(config_data.pt_rules){
		for(var j = 0; j < config_data.pt_rules.length; i++, j++){
			if(!config_data.pt_rules[j].name)	break;
			append_main_line(i,'triggerrule',j,config_data.pt_rules[j].disabled, config_data.pt_rules[j].fixed);
			update_porttrigger_line('triggerrule_'+j, config_data.pt_rules[j]);
		}
	}
	append_newrule_line(i);	i = 1;
	$('#upnp_listbox').css('display','');
	for(var j = 0; j < config_data.upnp_rules.length; i++, j++){
		if(!config_data.upnp_rules[j].name)	break;
		append_upnp_line(i,'upnprule',j);
		update_upnp_line('upnprule_'+j, config_data.upnp_rules[j]);
	}
	$('#porttrigger_listbox').css('display','none');
	$('#fileform_box').css('display','');
	if(config_data.pf_rules.length == 1 && config_data.pt_rules.length == 1){locking_obj('PORTFORWARD_BACKUP', 'disabled');}
	else{unlocking_obj('PORTFORWARD_BACKUP', 'disabled');}
	fileform_listener_add();
	//tmp_config_data = config_data;
};

iux_update_local_func['portforward'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	$('[sid="NOCLICKDATA"]').remove();
	var i = 1;
	
	$('#portforward_listbox').css('display','');
	for(var j = 0; j < config_data.pf_rules.length; i++, j++){
		if(!config_data.pf_rules[j].name)	break;
		append_main_line(i,'forwardrule',j,config_data.pf_rules[j].disabled, config_data.pf_rules[j].fixed);
		update_portforward_line('forwardrule_'+j, config_data.pf_rules[j]);
	}
	if(config_data.pt_rules){
		for(var j = 0; j < config_data.pt_rules.length; i++, j++){
			if(!config_data.pt_rules[j].name)	break;
			append_main_line(i,'triggerrule',j,config_data.pt_rules[j].disabled, config_data.pt_rules[j].fixed);
			update_porttrigger_line('triggerrule_'+j, config_data.pt_rules[j]);
		}
	}
	append_newrule_line(i);
	$('#upnp_listbox').css('display','none');
	$('#porttrigger_listbox').css('display','none');
	$('#fileform_box').css('display','');
	if(config_data.pf_rules.length == 1 && config_data.pt_rules.length == 1){locking_obj('PORTFORWARD_BACKUP', 'disabled');}
	else{unlocking_obj('PORTFORWARD_BACKUP', 'disabled');}
	fileform_listener_add();
	//tmp_config_data = config_data;
};

iux_update_local_func['upnp'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	$('[sid="NOCLICKDATA"]').remove();
	var i = 1;
		
	$('#portforward_listbox').css('display','none');
	$('#upnp_listbox').css('display','');
	for(var j = 0; j < config_data.upnp_rules.length; i++, j++){
		if(!config_data.upnp_rules[j].name)	break;
		append_upnp_line(i,'upnprule',j);
		update_upnp_line('upnprule_'+j, config_data.upnp_rules[j]);
	}
	$('#porttrigger_listbox').css('display','none');
	$('#fileform_box').css('display','none');
	$('[sid="C_PORTFORWARD_RESTOREFILE"]').unbind('change');
	$('[sid="PORTFORWARD_RESTORE"]').unbind('click');
	$('[sid="PORTFORWARD_BACKUP"]').unbind('click');
	//tmp_config_data = config_data;
};

iux_update_local_func['porttrigger'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	$('[sid="NOCLICKDATA"]').remove();
	var i = 1;
			
	$('#portforward_listbox').css('display','none');
	$('#upnp_listbox').css('display','none');
	$('#fileform_box').css('display','none');
	$('[sid="C_PORTFORWARD_RESTOREFILE"]').unbind('change');
	$('[sid="PORTFORWARD_RESTORE"]').unbind('click');
	$('[sid="PORTFORWARD_BACKUP"]').unbind('click');
	$('#porttrigger_listbox').css('display','');
	for(var j = 0; j < config_data.pt_status.length; i++, j++){
		if(!config_data.pt_status[j].name)	break;
		append_main_line(i,'triggerstatus',j,config_data.pt_status[j].disabled);
		update_porttrigger_status_line('triggerstatus_'+j, config_data.pt_status[j]);
	}
	//tmp_config_data = config_data;
};

iux_update_local_func['forwardrule'] = function(identifier)
{
	if(identifier == 'C')
	{
		$('[sid="S_TEMP_TITLE"]').text($('[sid="C_FORWARDRULE_NAME"]').val());
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		locking_obj('C_FORWARDRULE_NAME', 'readonly');

		if(!tmp_config_data.use_dual_wan || parseInt(tmp_config_data.use_dual_wan) == 0){
			locking_obj('C_FORWARDRULE_WANNAME', 'disabled');
			$('#dual_wan_select').css('display','none');
		}
		if(tmp_config_data.current_ip == make_ip_string()){
			$('[sid="CURCON_IP"]').prop('checked','checked').checkboxradio('refresh');
		}else{
			$('[sid="CURCON_IP"]').prop('checked','').checkboxradio('refresh');
		}
		if(tmp_config_data.is_twin_ip == '1'){	$('[sid="CURCON_IP"]').parent().css('display','none');}
		else{					$('[sid="CURCON_IP"]').parent().css('display','');}
		
		locking_obj('S_MODIFY_BTN', 'disabled');
		locking_obj('S_CANCEL_BTN', 'disabled');
		if(config_data.forwardrule.disabled == '1'){
			all_disable_control('forwardrule');
		}else{
			all_enable_control('forwardrule');
			set_portdisable_by_protocol('forwardrule');
		}
	}
}

add_listener_local_func['forwardrule'] = function(idval)
{
	basic_control_event_add('forwardrule',idval);
	ip_control_event_add('forwardrule');
}

submit_local_func['forwardrule'] = function(localdata, checking)
{
	if(checking && !forwardrule_validate('forwardrule'))	return;
	$('#loading').popup('open');
	iux_submit('forwardrule',localdata, true, {'name':'category', 'value':$('[sid="PAGE_MENU"]').val()});
}

iux_update_local_func['triggerrule'] = function(identifier)
{
	if(identifier == 'C')
	{
		$('[sid="S_TEMP_TITLE"]').text($('[sid="C_TRIGGERRULE_NAME"]').val());
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		locking_obj('C_TRIGGERRULE_NAME', 'readonly');
		locking_obj('C_TRIGGERRULE_RULETYPE', 'readonly');
		
		locking_obj('S_MODIFY_BTN', 'disabled');
		locking_obj('S_CANCEL_BTN', 'disabled');
		if(config_data.triggerrule.disabled == '1'){
			all_disable_control('triggerrule');
		}else{
			all_enable_control('triggerrule');
		}
	}
}

add_listener_local_func['triggerrule'] = function(idval)
{
	basic_control_event_add('triggerrule', idval);
}

submit_local_func['triggerrule'] = function(localdata, checking)
{
	if(checking && !triggerrule_validate('triggerrule'))	return;
	$('#loading').popup('open');
	iux_submit('triggerrule',localdata, true, {'name':'category', 'value':$('[sid="PAGE_MENU"]').val()});
}

iux_update_local_func['upnprule'] = function(identifier)
{
	if(identifier == 'C')
	{
		$('[sid="S_TEMP_TITLE"]').text($('[sid="C_UPNPRULE_NAME"]').val());
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		locking_obj('C_UPNPRULE_NAME', 'readonly');
		$('[sid="C_UPNPRULE_IP"] .lc_inputbox_ip input').prop('disabled', true);
		$('[sid="C_UPNPRULE_IP"] .lc_inputbox_ip').addClass('ui-state-disabled');
		all_disable_control('upnprule');
	}
}

add_listener_local_func['upnprule'] = function()
{
	submit_button_event_add('upnprule');
}

submit_local_func['upnprule'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('upnprule',localdata, true, {'name':'category', 'value':$('[sid="PAGE_MENU"]').val()});
}

iux_update_local_func['triggerstatus'] = function(identifier)
{
	if(identifier == 'C')
	{
		$('[sid="S_TEMP_TITLE"]').text($('[sid="C_TRIGGERSTATUS_NAME"]').val());
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		locking_obj('C_TRIGGERSTATUS_NAME', 'readonly');
		all_disable_control('triggerstatus');
	}
}
add_listener_local_func['triggerstatus'] = function()
{
}
submit_local_func['triggerstatus'] = function()
{
}
iux_update_local_func['setup'] = function(identifier)
{
	if(identifier == 'C')
	{
		$('[sid="S_TEMP_TITLE"]').text(M_lang['S_NEWRULE_STRING']);
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		locking_obj('S_NEWRULE_BTN', 'disabled');
		locking_obj('S_DELETE_BTN', 'disabled');
		locking_obj('C_SETUP_DISABLED', 'disabled');
		
		all_enable_control('setup');
		$('[sid="CURCON_IP"]').prop('checked','').checkboxradio('refresh');
		if(!tmp_config_data.use_dual_wan || parseInt(tmp_config_data.use_dual_wan) == 0){
			locking_obj('C_FORWARDRULE_WANNAME', 'disabled');
			$('#dual_wan_select').css('display','none');
		}
		if(tmp_config_data.is_twin_ip == '1'){	$('[sid="CURCON_IP"]').parent().css('display','none');}
		else{					$('[sid="CURCON_IP"]').parent().css('display','');}
		
		$('[sid="PORTFORWARD_LINE"]').css('display','');
		$('[sid="PORTTRIGGER_LINE"]').css('display','none');
	
		if(tmp_config_data.gateway){
			var ipaddr = tmp_config_data.gateway.split('.');
			for(var i = 0; i < 3; i ++){
				$('[sid=\"VALUE'+i+'\"]').val(ipaddr[i]);
			}
			config_data.setup.ip = ipaddr[0] + '.' + ipaddr[1] + '.' + ipaddr[2] + '..';
		}
	}
}

add_listener_local_func['setup'] = function()
{
	basic_control_event_add('setup');
	ip_control_event_add('setup');
}

submit_local_func['setup'] = function(localdata)
{
	if($('[sid="C_SETUP_RULETYPE"]').val() == 'trigger'){if(!triggerrule_validate('setup'))	return;}
	else{if(!forwardrule_validate('setup'))	return;}
	$('#loading').popup('open');
	iux_submit('setup',localdata, true, {'name':'category', 'value':$('[sid="PAGE_MENU"]').val()});
}

submit_local_func['restore'] = function()
{
	$('#loading').popup('open');
	local_fileform_submit('restore');
}

function loadLocalPage()
{
	pageview_select_update(loc);
	highlight = HighlightObject();
	popup = TapholdPopup();
}

function result_config(result)
{
	if(result){
		tmp_config_data = null;
                iux_update_local();
        }
}

function result_submit(service_name, result)
{
	if(result){
		if(service_name == 'setup' || service_name == 'upnprule' || service_name == 'triggerrule' || service_name == 'forwardrule'){
			tmp_config_data = null;	$('#right_panel').panel('close');
		}
	}
	iux_update_local();
}

//local functions end
$(document).on("panelbeforeclose", "#right_panel", function(){
	if(tmp_config_data){
		config_data = tmp_config_data;	tmp_config_data = null;
		iux_update_local();
	}
});

$(document).ready(function() {
	window.tmenu = "natrouterconf";
	window.smenu = "portforward";
	
	loc = get_parameter('mode');
	if(!loc)	loc = 'portforward';
	if(loc != 'portforward' && loc != 'upnp' && loc != 'porttrigger' && loc != 'all')	loc = 'portforward';

	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, {name : 'category', value : loc}, 120000);
	events.on('load_header_ended_local', function(menuname){
		iux_update("C");	iux_update("S");
	});
});

function TapholdPopup()
{
	var $popup, $title, $modifyMenu, $deleteMenu, $cancelMenu, $item, $popupScreen;
        cache();
	init();
        function cache()
        {
                $popup = $("#taphold_popup");
                $title = $popup.find("#taphold_popup_title");
                $modifyMenu = $popup.children().eq(1);
                $deleteMenu = $popup.children().eq(2);
                $cancelMenu = $popup.children().eq(3);
                $popupScreen = $("#" + $popup.attr("id") + "-screen");
        }
        function init()
        {
                $popup.on( "popupafteropen", bindMenuEvents );
                $popup.on( "popupafterclose", unbindMenuEvents );
        }
        function bindMenuEvents()
        {
		setTimeout(function() {
			$modifyMenu.on('click', modifyItem );
			$deleteMenu.on('click', deleteItem );
			$cancelMenu.on('click', closePopup );
                        $popupScreen.off().on('click', clickOutside );
		}, 500);
        }
        function unbindMenuEvents()
        {
                $modifyMenu.unbind('click');
                $deleteMenu.unbind('click');
                $cancelMenu.unbind('click');
                $popupScreen.unbind('click');
        }
        function clickOutside( e )
        {
                e.stopPropagation();
                closePopup();
        }
        function modifyItem()
        {
                closePopup();
                load_rightpanel( $item );
                $("#right_panel").panel("open");
        }
        function deleteItem()
        {
                closePopup();
		confirm_mode = 'del_popup'; confirm_data = $item;
		confirm(M_lang['S_DELETE_CONFIRMMSG']);
        }
        function closePopup()
        {
                $popup.popup("close");
        }
        function openPopup( titleString, itemId )
        {
                $title.text( titleString );
                $item = itemId;
		var rtype = get_ruletype( $item );
		if(rtype == 'triggerstatus')	$deleteMenu.css('display','none');
		else				$deleteMenu.css('display','');
		if(rtype == 'triggerstatus' || rtype == 'upnprule')	$modifyMenu.find('p').text(M_lang['S_POPUPMENU_VIEW']);
		else							$modifyMenu.find('p').text(M_lang['S_MODIFY']);
                $popup.popup("open");
        }
        return openPopup;
}

function iux_set_onclick_local()
{
	$('[sid=\"LISTDATA\"]').each(function(){
		var idval = $(this).attr('id');
		$(this).unbind('click');
		$(this).on('click', function(){
			if(tmp_config_data){return;}
			load_rightpanel(idval);
			$('#right_panel').panel('open');
		});
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});

	$('[sid=\"NOCLICKDATA\"]').each(function(){
		$(this).on('click', function(){
			alert(M_lang['S_NOCLICK_ALERT']);
		});
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
}

function iux_update_local(identifier)
{
	if(!identifier){
		if(config_data.pf_rules){current_rule_count = (config_data.pf_rules.length - 1);
		if(config_data.pt_rules){current_rule_count += (config_data.pt_rules.length - 1);}}
		var mode = $('[sid="PAGE_MENU"] option:selected').val();
		if(mode){
			iux_update_local_func[mode].call(this, identifier);	
			iux_set_onclick_local();
		}
	}
	else{
		for(var articleName in config_data){
			if(config_data.hasOwnProperty(articleName) && articleName != ''){
				var caller_func = iux_update_local_func[articleName];
				if(caller_func) caller_func.call(this, identifier);
			}
		}
	}
}

function listener_add_local(ruletype, idval)
{
	add_listener_local_func[ruletype].call(this, idval);
}

function submit_local(rule_type, localdata, checking)
{
	if(!localdata){
		localdata = [];
		switch(rule_type){
			case 'forwardrule':
			case 'triggerrule':
				localdata.push({'name':'act', 'value':'modify'}); localdata.push({'name':'ip', 'value':make_ip_string()});
				break;
			case 'setup':
				localdata.push({'name':'act', 'value':'add'}); localdata.push({'name':'ip', 'value':make_ip_string()});
				break;
		}
		checking = true;
	}
	submit_local_func[rule_type].call(this, localdata, checking);
}

function load_rightpanel(_idvalue)
{
	var ruletype = get_ruletype(_idvalue);
	if(ruletype.substr(ruletype.length - 4, 4) === "rule" || ruletype == 'triggerstatus')
		highlight( _idvalue );

	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+ruletype+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				if(ruletype == 'forwardrule' || ruletype == 'triggerrule' || ruletype == 'setup'
					|| ruletype == 'upnprule' || ruletype == 'triggerstatus'){
					if(!tmp_config_data)tmp_config_data = config_data;
				}
				config_data = get_localConfigObj(_idvalue);
				//iux_update("C");	iux_update("S");
				listener_add_local(ruletype, _idvalue);
				load_header(RIGHT_HEADER, 'TEMP');
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		}
	);
}

