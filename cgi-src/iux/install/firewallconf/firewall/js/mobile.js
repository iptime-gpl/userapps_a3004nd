//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var tmp_config_data = null;
var mac_data = null;
var current_rule_count = null;
var confirm_mode = null;
var confirm_data = null;

var highlight;
var _typeval = null;
//local-global variables end

//local utility functions
function submit_button_event_add(rule_type)
{
	if(rule_type == 'setup'){
		$('[sid="S_MODIFY_BTN"]').click(function(){
			var localdata = [];
			localdata.push({'name':'act', 'value':'add'});
			submit_local(rule_type, localdata, true);
		});
	}
	else{
		$('[sid="S_MODIFY_BTN"]').click(function(){
			var localdata = [];
			localdata.push({'name':'act', 'value':'modify'});
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
		$('[sid="'+sid+'"]').val(defval).prop(proptype, true);	$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, true);		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}
}

function unlocking_obj(sid, proptype ,defval)
{
	if(defval || defval == ''){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, false);		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, false);			$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}
}

function validate_string(str, regExp, type)
{
	if(type == 'unpermitted'){if(str.match(regExp))	return false;}
	else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
	return true;
}

function make_day_intvalue(ruletype)
{
	var dayval = 0;
	if(!$('[sid=\"L_'+ruletype.toUpperCase()+'_EVERY\"]').is(':checked')){
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY6\"]').is(':checked')?(0x1 << 0):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY0\"]').is(':checked')?(0x1 << 1):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY1\"]').is(':checked')?(0x1 << 2):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY2\"]').is(':checked')?(0x1 << 3):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY3\"]').is(':checked')?(0x1 << 4):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY4\"]').is(':checked')?(0x1 << 5):0;
		dayval += $('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid=\"L_'+ruletype.toUpperCase()+'_DAY5\"]').is(':checked')?(0x1 << 6):0;
	}
	return dayval;
}

function make_ip_value(ruletype, selectorstr)
{
	var result = [];
	var basestr = '';
	basestr += $('[sid=\"L_'+ruletype.toUpperCase()+'_'+selectorstr+'\"] [sid=\"VALUE0\"]').val();	basestr += '.';
	basestr += $('[sid=\"L_'+ruletype.toUpperCase()+'_'+selectorstr+'\"] [sid=\"VALUE1\"]').val();	basestr += '.';
	basestr += $('[sid=\"L_'+ruletype.toUpperCase()+'_'+selectorstr+'\"] [sid=\"VALUE2\"]').val();	basestr += '.';
	result[0] = basestr + $('[sid=\"L_'+ruletype.toUpperCase()+'_'+selectorstr+'\"] [sid=\"VALUE3\"]').val();
	result[1] = basestr + $('[sid=\"L_'+ruletype.toUpperCase()+'_'+selectorstr+'\"] [sid=\"VALUE4\"]').val();
	if(!validate_string(result[0], regExp_ip, 'match')){result[0] = '';}
	if(!validate_string(result[1], regExp_ip, 'match')){result[1] = '';}
	return result;
}

function make_mac_value(ruletype)
{
	var macstr = '';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE0\"]').val();	macstr += ':';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE1\"]').val();	macstr += ':';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE2\"]').val();	macstr += ':';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE3\"]').val();	macstr += ':';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE4\"]').val();	macstr += ':';
	macstr += $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE5\"]').val();
	if(!validate_string(macstr, regExp_mac, 'match')){macstr = '';}
	return macstr;
}

function make_localpost_data(ruletype)
{
	var localdata = [];
	localdata.push({'name':'days', 'value':make_day_intvalue(ruletype)});
	if(ruletype != 'wifi'){
		var mode = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
		if(mode == 'internet' || mode == 'site'){
			if($('[sid="C_'+ruletype.toUpperCase()+'_SRCADDRTYPE"]').val() == 'ip'){
				var tmpresult = make_ip_value(ruletype, 'SRCIP');
				localdata.push({'name':'srcsip', 'value':tmpresult[0]});
				localdata.push({'name':'srceip', 'value':tmpresult[1]});
			}
			else if($('[sid="C_'+ruletype.toUpperCase()+'_SRCADDRTYPE"]').val() == 'mac'){
				var macstr = make_mac_value(ruletype);
				localdata.push({'name':'srcmac', 'value':macstr});
			}
		}
		if(mode == 'internet'){
			if($('[sid="C_'+ruletype.toUpperCase()+'_DSTADDRTYPE"]').val() == 'ip'){
				var tmpresult = make_ip_value(ruletype, 'DSTIP');
				localdata.push({'name':'dstsip', 'value':tmpresult[0]});
				localdata.push({'name':'dsteip', 'value':tmpresult[1]});
			}
		}
	}
	return localdata;
}

function check_change_value_local()
{
	var ruletype = $('#right_main').parent().parent().attr('id');
	if(!ruletype)	return false;

	var day = '';
	if(ruletype == 'firewallrule')	day = config_data.firewallrule.day;
	else if(ruletype == 'wifirule')	day = config_data.wifirule.day;
	else				day = config_data.setup.day;

	day = parseInt(day);
	if(make_day_intvalue(ruletype) != day)	return true;
	
	var ipval = [];
	if(ruletype == 'firewallrule'){
		var cip = make_ip_value(ruletype, 'SRCIP');
		ipval[0] = config_data.firewallrule.srcsip;	ipval[1] = config_data.firewallrule.srceip;
		if(cip[0] != ipval[0] || cip[1] != ipval[1])	return true;
		cip = make_ip_value(ruletype, 'DSTIP');
		ipval[0] = config_data.firewallrule.dstsip;	ipval[1] = config_data.firewallrule.dsteip;
		if(cip[0] != ipval[0] || cip[1] != ipval[1])	return true;
		var macstr = make_mac_value(ruletype);
		if(macstr != config_data.firewallrule.srcmac)	return true;
	}
	else if(ruletype == 'setup'){
		var cip = make_ip_value(ruletype, 'SRCIP');
		ipval[0] = config_data.setup.srcsip;		ipval[1] = config_data.setup.srceip;
		if(cip[0] != ipval[0] || cip[1] != ipval[1])	return true;
		cip = make_ip_value(ruletype, 'DSTIP');
		ipval[0] = config_data.setup.dstsip;		ipval[1] = config_data.setup.dsteip;
		if(cip[0] != ipval[0] || cip[1] != ipval[1])	return true;
		var macstr = make_mac_value(ruletype);
		if(macstr != config_data.setup.srcmac)		return true;
	}

	return false;
}

function check_iprange(ipstring)
{
	var gwstr = tmp_config_data.gateway;
        var maskstr = tmp_config_data.netmask;

        gwstr = gwstr.split('.');
        maskstr = maskstr.split('.');
        var ipstr = ipstring.split('.');

        for(var i = 0; i < 4; i++){if((parseInt(gwstr[i]) & parseInt(maskstr[i])) != (parseInt(ipstr[i]) & parseInt(maskstr[i]))){return 1;}}
	return 0;
}

function footerbtn_view_control()
{
	if(check_change_value()){unlocking_obj('S_MODIFY_BTN', 'disabled'); unlocking_obj('S_CANCEL_BTN', 'disabled');}
	else{	locking_obj('S_MODIFY_BTN', 'disabled');	locking_obj('S_CANCEL_BTN', 'disabled');}
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
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').val();
	if(val == 'gre' || val == 'none' || val == 'icmp'){
		locking_obj('C_'+ruletype.toUpperCase()+'_DSTSPORT', 'readonly', '');
		locking_obj('C_'+ruletype.toUpperCase()+'_DSTEPORT', 'readonly', '');
	}
	else{
		unlocking_obj('C_'+ruletype.toUpperCase()+'_DSTSPORT', 'readonly');
		unlocking_obj('C_'+ruletype.toUpperCase()+'_DSTEPORT', 'readonly');
	}
}

function set_srcipdisable_by_select(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').val();
	if(val == 'all'){locking_obj('L_'+ruletype.toUpperCase()+'_SRCIP"] [sid^="VALUE','readonly');}
	else{unlocking_obj('L_'+ruletype.toUpperCase()+'_SRCIP"] [sid^="VALUE','readonly');}
}

function set_dstipdisable_by_select(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_DSTADDRTYPE\"]').val();
	if(val == 'all'){locking_obj('L_'+ruletype.toUpperCase()+'_DSTIP"] [sid^="VALUE','readonly');}
	else{unlocking_obj('L_'+ruletype.toUpperCase()+'_DSTIP"] [sid^="VALUE','readonly');}
}

function set_daydisable_by_every(ruletype)
{
	var val = $('[sid=\"L_'+ruletype.toUpperCase()+'_EVERY\"]').is(':checked');
	if(val){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_DAY\"] [sid^=\"L_\"]').removeAttr('checked').checkboxradio('refresh');
		locking_obj('C_'+ruletype.toUpperCase()+'_DAY"] [sid^="L_','disabled');
	}
	else{unlocking_obj('C_'+ruletype.toUpperCase()+'_DAY"] [sid^="L_','disabled');}
}

function set_timedisable_by_stime(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').val();
	if(val == 'all'){locking_obj('C_'+ruletype.toUpperCase()+'_ETIME','readonly');}
	else{unlocking_obj('C_'+ruletype.toUpperCase()+'_ETIME','readonly');}
}

function set_policydisable_by_type(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
	if(val == 'wifi'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_POLICY\"]').val('drop').selectmenu('refresh',true);
		locking_obj('C_'+ruletype.toUpperCase()+'_POLICY','readonly');
	}
	else{unlocking_obj('C_'+ruletype.toUpperCase()+'_POLICY','readonly');}
}

function set_typedata_by_usewifi(ruletype)
{
	if(!tmp_config_data.use_wifi || tmp_config_data.use_wifi == '0'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').find('option:eq(2)').remove();
	}
}

function set_macaddr_by_macsearch(ruletype)
{
	var val = $('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').val();
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').val('mac').selectmenu('refresh').trigger('change');
	val = val.split(':');
	for(var i = 0; i < val.length; i++){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"VALUE'+i+'\"]').val(val[i]);
	}
}

function set_formview_by_type(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
	switch(val){
		case 'internet':	internetmode_update_local();	break;
		case 'site':		sitemode_update_local();	break;
		case 'wifi':		wifimode_update_local();	break;
	}
}

function set_srcview_by_srcaddrtype(ruletype, val)
{
	switch(val){
		case 'mac':
			$('[sid=\"L_'+ruletype.toUpperCase()+'_SRCIP\"]').css('display','none');
			$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"]').css('display','');
			$('[sid=\"L_'+ruletype.toUpperCase()+'_MACSEARCH\"]').css('display','none');	break;
		case 'search':
			$('[sid=\"L_'+ruletype.toUpperCase()+'_SRCIP\"]').css('display','none');
			$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"]').css('display','none');
			$('[sid=\"L_'+ruletype.toUpperCase()+'_MACSEARCH\"]').css('display','');	
			fill_macsearch_value(ruletype);		break;
		default:
			$('[sid=\"L_'+ruletype.toUpperCase()+'_SRCIP\"]').css('display','');
			$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"]').css('display','none');
			$('[sid=\"L_'+ruletype.toUpperCase()+'_MACSEARCH\"]').css('display','none');
			set_srcipdisable_by_select(ruletype);	break;
	}
}

function all_disable_control(ruletype)
{
	var rtype = ruletype.toUpperCase();
	locking_obj('C_'+rtype+'_DIRECTION','readonly');		locking_obj('C_'+rtype+'_PROTOCOL','readonly');
	locking_obj('C_'+rtype+'_DSTSPORT','readonly');			locking_obj('C_'+rtype+'_DSTEPORT','readonly');
	locking_obj('C_'+rtype+'_BAND','readonly');			locking_obj('C_'+rtype+'_SRCADDRTYPE','readonly');
	locking_obj('C_'+rtype+'_URL','readonly');			locking_obj('C_'+rtype+'_DSTADDRTYPE','readonly');
	locking_obj('C_'+rtype+'_STIME','readonly');			locking_obj('C_'+rtype+'_ETIME','readonly');
	locking_obj('L_'+rtype+'_DSTIP"] [sid^="VALUE','readonly');	locking_obj('L_'+rtype+'_SRCIP"] [sid^="VALUE','readonly'); 
	locking_obj('C_'+rtype+'_SRCMAC"] [sid^="VALUE','readonly');	locking_obj('C_'+rtype+'_DAY"] [sid^="L_','readonly');
	locking_obj(rtype+'_MACSEARCH','readonly');			locking_obj('L_'+rtype+'_EVERY','readonly');
	locking_obj('C_'+rtype+'_POLICY','readonly');			locking_obj('C_'+rtype+'_TYPE','readonly');
	if(ruletype == 'setup'){locking_obj('C_'+rtype+'_NAME','readonly');}
}

function all_enable_control(ruletype)
{
	var rtype = ruletype.toUpperCase();
	unlocking_obj('C_'+rtype+'_DIRECTION','readonly');		unlocking_obj('C_'+rtype+'_PROTOCOL','readonly');
	unlocking_obj('C_'+rtype+'_DSTSPORT','readonly');		unlocking_obj('C_'+rtype+'_DSTEPORT','readonly');
	unlocking_obj('C_'+rtype+'_BAND','readonly');			unlocking_obj('C_'+rtype+'_SRCADDRTYPE','readonly');
	unlocking_obj('C_'+rtype+'_URL','readonly');			unlocking_obj('C_'+rtype+'_DSTADDRTYPE','readonly');
	unlocking_obj('C_'+rtype+'_STIME','readonly');			unlocking_obj('C_'+rtype+'_ETIME','readonly');
	unlocking_obj('L_'+rtype+'_DSTIP"] [sid^="VALUE','readonly');	unlocking_obj('L_'+rtype+'_SRCIP"] [sid^="VALUE','readonly'); 
	unlocking_obj('C_'+rtype+'_SRCMAC"] [sid^="VALUE','readonly');	unlocking_obj('C_'+rtype+'_DAY"] [sid^="L_','readonly');
	unlocking_obj(rtype+'_MACSEARCH','readonly');			unlocking_obj('L_'+rtype+'_EVERY','readonly');
	unlocking_obj('C_'+rtype+'_POLICY','readonly');			unlocking_obj('C_'+rtype+'_TYPE','readonly');
	if(ruletype == 'setup'){unlocking_obj('C_'+rtype+'_NAME','readonly');}
	set_portdisable_by_protocol(ruletype);	set_srcipdisable_by_select(ruletype);	set_dstipdisable_by_select(ruletype);
	set_daydisable_by_every(ruletype);	set_timedisable_by_stime(ruletype);	set_policydisable_by_type(ruletype);
}

function rule_validate(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
	if(val == 'wifi')	return wifirule_validate(ruletype);
	else			return firewallrule_validate(ruletype);
}

function common_validate(ruletype)
{
	if($('[sid=\"C_'+ruletype.toUpperCase()+'_NAME\"]').val() == ''){
		alert(M_lang['S_RULENAME_BLANK']);	return false;
	}
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_NAME"]').val(), regExp_spchar, 'unpermitted')){
                alert(M_lang['S_RULENAME_INVALID']);    return false;
        }
	if($('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').val() == $('[sid=\"C_'+ruletype.toUpperCase()+'_ETIME\"]').val()){
		alert(M_lang['S_TIME_INVALID']);	return false;
	}

	return true;
}

function firewallrule_validate(ruletype)
{
	if(!common_validate(ruletype))	return false;
	if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_PRIORITY"]').val(), regExp_onlynum, 'match')){
                alert(M_lang['S_PRIORITY_INVALID']);    return false;
        }
	if($('[sid="C_'+ruletype.toUpperCase()+'_SRCADDRTYPE"]').val() == 'ip'){
		var tmpresult = make_ip_value(ruletype, 'SRCIP');
		if(!validate_string(tmpresult[0], regExp_ip, 'match')){alert(M_lang['S_IP_INVALID']);    return false;}
		if(check_iprange(tmpresult[0]) == 1){alert(M_lang['S_INTERNALIP_ALERT']);	return false;}
		if(tmpresult[1] != '' && !validate_string(tmpresult[1], regExp_ip, 'match')){alert(M_lang['S_IP_INVALID']);    return false;}
	}
	else if($('[sid="C_'+ruletype.toUpperCase()+'_SRCADDRTYPE"]').val() == 'mac'){
		var macstr = make_mac_value(ruletype);
		if(macstr == '' || !validate_string(macstr, regExp_mac, 'match')){alert(M_lang['S_MAC_INVALID']);    return false;}
	}
	else if($('[sid="C_'+ruletype.toUpperCase()+'_SRCADDRTYPE"]').val() == 'search'){
		alert(M_lang['S_SRCADDRTYPE_INVALID']);    return false;
	}
	var mode = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
	if(mode == 'internet'){
		if(($('[sid="C_'+ruletype.toUpperCase()+'_PROTOCOL"]').val() != 'none' 
			&& $('[sid="C_'+ruletype.toUpperCase()+'_PROTOCOL"]').val() != 'gre'
			&& $('[sid="C_'+ruletype.toUpperCase()+'_PROTOCOL"]').val() != 'icmp')){
			if($('[sid="C_'+ruletype.toUpperCase()+'_DSTSPORT"]').val() == ''){
                		alert(M_lang['S_PORT_BLANK']);        return false;
			}
			if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_DSTSPORT"]').val(), regExp_onlynum, 'match')
				|| !validate_string($('[sid="C_'+ruletype.toUpperCase()+'_DSTEPORT"]').val(), regExp_onlynum, 'match')){
				alert(M_lang['S_PORT_INVALID']);    return false;
			}
			var portval1 = $('[sid="C_'+ruletype.toUpperCase()+'_DSTSPORT"]').val();
			if(portval1 == '' || parseInt(portval1) < 0 || parseInt(portval1) > 65535){alert(M_lang['S_PORT_INVALID']);    return false;}
			var portval2 = $('[sid="C_'+ruletype.toUpperCase()+'_DSTEPORT"]').val();
			if(portval2 != '' && ((parseInt(portval2) < 0 || parseInt(portval2) > 65535) || (parseInt(portval1) > parseInt(portval2))))
				{alert(M_lang['S_PORT_INVALID']);    return false;}
		}
		if($('[sid="C_'+ruletype.toUpperCase()+'_DSTADDRTYPE"]').val() == 'ip'){
			var tmpresult = make_ip_value(ruletype, 'DSTIP');
			if(!validate_string(tmpresult[0], regExp_ip, 'match')){alert(M_lang['S_IP_INVALID']);    return false;}
			if(tmpresult[1] != '' && !validate_string(tmpresult[1], regExp_ip, 'match')){alert(M_lang['S_IP_INVALID']);    return false;}
		}
	}
	else if(mode == 'site'){
		if($('[sid=\"C_'+ruletype.toUpperCase()+'_URL\"]').val() == ''){
			alert(M_lang['S_URL_BLANK']);	return false;
		}
		if(!validate_string($('[sid="C_'+ruletype.toUpperCase()+'_URL"]').val(), regExp_spchar, 'unpermitted')){
			alert(M_lang['S_URL_INVALID']);    return false;
		}
	}
	else{return false;}
	return true;
}

function wifirule_validate(ruletype)
{
	if(!common_validate(ruletype))	return false;
	return true;
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

	if(ruletype == 'firewallrule'){
		if(converted_priority > 0 && converted_priority < tmp_config_data.firewall_rules.length){
			var insertidx = converted_priority - 1;
			if(converted_priority == 1)		$('#'+idvalue).insertAfter($('#firewall_listbox .lc_infobox_div'));
			else if(converted_priority <= get_ruleindex(idvalue)){
				$('#'+idvalue).insertAfter($('#firewallrule_'+(insertidx - 1)));
			}
			else					$('#'+idvalue).insertAfter($('#firewallrule_'+insertidx));
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

	if(ruletype == 'firewallrule'){original_priority = tmp_config_data.firewall_rules[ruleidx].priority;}
	else return;
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').val(parseInt(original_priority)).trigger('change');
}

function check_priority_range(ruletype, prio)
{
	if(ruletype == 'setup')	return true;
	if(ruletype == 'firewallrule'){if(prio < 1 || prio > (tmp_config_data.firewall_rules.length -1))	return false;}
	return true;
}

function change_protocol_text(ruletype, val)
{
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"] option').each(function(){
		var txtval = $(this).text();
		var retval = $(this).val();
		if(retval == 'none')	retval = 'all';
		var addtxt = '';
		switch(val){
			case 'inout':	addtxt = M_lang['S_INOUT_STRING'];	break;
			case 'outin':	addtxt = M_lang['S_OUTIN_STRING'];	break;
			default:	break;	
		}
		$(this).text(addtxt + ' ' + retval.toUpperCase());
	});
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').selectmenu('refresh',true);
}

function change_srcaddrtype_by_direction(ruletype,oval)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_DIRECTION\"]').val();
	var original_val = '';
	if(oval)	original_val = oval;
	else{original_val = $('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').val();}
	if(val == 'outin' && (original_val == 'mac' || original_val == 'search'))	original_val = 'ip';

	$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').find('option').remove();
	var listObjs = M_lang['S_SETUP_SRCADDRTYPE'];
	for(var idx = 0; (listObjs && idx < listObjs.length); idx++){
		var nm = listObjs[idx];
		if(val == 'outin' && idx >= 2)	break;
		$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').append('<option value=\"'+nm.value+'\">'+nm.text+'</option>');
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').val(original_val).selectmenu('refresh',true).trigger('change');
}

function internetmode_update_local(ruletype)
{
	$('[sid=\"PRIORITY_CONTENT\"]').css('display', '');
	$('[sid=\"INTERNET_CONTENT\"]').css('display', '');
	$('[sid=\"BOTH_CONTENT\"]').css('display', '');
	$('[sid=\"SITE_CONTENT\"]').css('display','none');
	$('[sid=\"WIFI_CONTENT\"]').css('display','none');
}

function sitemode_update_local(ruletype)
{
	$('[sid=\"PRIORITY_CONTENT\"]').css('display', '');
	$('[sid=\"INTERNET_CONTENT\"]').css('display', 'none');
	$('[sid=\"BOTH_CONTENT\"]').css('display', '');
	$('[sid=\"SITE_CONTENT\"]').css('display','');
	$('[sid=\"WIFI_CONTENT\"]').css('display','none');
}

function wifimode_update_local(ruletype)
{
	$('[sid=\"PRIORITY_CONTENT\"]').css('display', 'none');
	$('[sid=\"INTERNET_CONTENT\"]').css('display', 'none');
	$('[sid=\"BOTH_CONTENT\"]').css('display', 'none');
	$('[sid=\"SITE_CONTENT\"]').css('display','none');
	$('[sid=\"WIFI_CONTENT\"]').css('display','');
}

function basic_control_event_add(ruletype, idval)
{
	$('[sid^="C_"],[sid^="L_"]').each(function(){
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
	
	$('[sid=\"L_'+ruletype.toUpperCase()+'_SRCIP\"] [sid^=\"VALUE\"]').each(function(){
		btncontrol_event_add('L_'+ruletype.toUpperCase()+'_SRCIP\"] [sid=\"'+$(this).attr('sid'),'keyup');
		$(this).unbind('keypress').keypress(function(e){
			var input_list = $('[sid=\"L_'+ruletype.toUpperCase()+'_SRCIP\"] [sid^=\"VALUE\"]');
			if((e.charCode < 48 || e.charCode > 57) && (e.charCode == e.keyCode || e.keyCode == 0))	e.preventDefault();
			if(e.charCode == 46)	input_list.eq(input_list.index(this)+1).focus();
		});
	});
	$('[sid=\"L_'+ruletype.toUpperCase()+'_DSTIP\"] [sid^=\"VALUE\"]').each(function(){
		btncontrol_event_add('L_'+ruletype.toUpperCase()+'_DSTIP\"] [sid=\"'+$(this).attr('sid'),'keyup');
		$(this).unbind('keypress').keypress(function(e){
			var input_list = $('[sid=\"L_'+ruletype.toUpperCase()+'_DSTIP\"] [sid^=\"VALUE\"]');
			if((e.charCode < 48 || e.charCode > 57) && (e.charCode == e.keyCode || e.keyCode == 0))	e.preventDefault();
			if(e.charCode == 46)	input_list.eq(input_list.index(this)+1).focus();
		});
	});
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid^=\"VALUE\"]').each(function(){
		btncontrol_event_add('C_'+ruletype.toUpperCase()+'_SRCMAC\"] [sid=\"'+$(this).attr('sid'),'keyup');
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
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').unbind('change').change(function(){
		set_formview_by_type(ruletype);	set_policydisable_by_type(ruletype);
		$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid=\"C_'+ruletype.toUpperCase()+'_DIRECTION\"]').unbind('change').change(function(){
		change_srcaddrtype_by_direction(ruletype);
		change_protocol_text(ruletype, $(this).val());	$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PROTOCOL\"]').unbind('change').change(function(){
		set_portdisable_by_protocol(ruletype);	$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid=\"C_'+ruletype.toUpperCase()+'_SRCADDRTYPE\"]').unbind('change').change(function(){
		var val = $(this).val(); set_srcview_by_srcaddrtype(ruletype, val);
		$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid=\"C_'+ruletype.toUpperCase()+'_DSTADDRTYPE\"]').unbind('change').change(function(){
		set_dstipdisable_by_select(ruletype);	$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"L_'+ruletype.toUpperCase()+'_EVERY\"]').unbind('change').change(function(){
		set_daydisable_by_every(ruletype);
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').unbind('change').change(function(){
		set_timedisable_by_stime(ruletype);	$(this).selectmenu('refresh',true);
		if(ruletype != 'setup')footerbtn_view_control();
	});

	$('[sid=\"C_'+ruletype.toUpperCase()+'_DISABLED\"]').unbind('change').change(function(){
		if($(this).is(':checked')){all_disable_control(ruletype);}
		else{all_enable_control(ruletype);}
		if(ruletype != 'setup')footerbtn_view_control();
	});
	
	$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').unbind('change').change(function(){
		var val = $(this).val();
		if(val == 'research'){fill_macsearch_value(ruletype);}
		else if(val == 'none'){return;}
		else{set_macaddr_by_macsearch(ruletype);}
	});
	
	$('[sid="S_CANCEL_BTN"]').click(function(){
		iux_update('C');	$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').trigger('change');
	});
	
	$('[sid="S_NEWRULE_BTN"]').click(function(){
		if(current_rule_count >= parseInt(tmp_config_data.max_rule_count)){
			alert(M_lang['S_FIREWALL_NOMORERULES']);	return;
		}
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PRIORITY\"]').trigger('change');
		highlight();
		_typeval = $('[sid=\"C_'+ruletype.toUpperCase()+'_TYPE\"]').val();
		load_rightpanel('setup_0');
		//config_data.setup.type = typeval;
		//$('[sid=\"C_SETUP_TYPE\"]').val(typeval).selectmenu('refresh', true).trigger('change');
	});

	submit_button_event_add(ruletype);
}

function after_newrule_event()
{
	if(_typeval){
		config_data.setup.type = _typeval;
		$('[sid=\"C_SETUP_TYPE\"]').val(_typeval).selectmenu('refresh', true).trigger('change');
		_typeval = null;
	}
}

function fileform_listener_add()
{
	$('[sid="FIREWALL_RESTORE"]').unbind('click').click(function() {
		if($('[sid="C_FIREWALL_RESTOREFILE"]').val().length == 0){alert(M_lang['S_FIREWALL_FILENOTEXIST']);	return;}
		confirm_mode = 'restore';	confirm(M_lang['S_FIREWALL_RESTOREMSG']);
	});
	$('[sid="C_FIREWALL_RESTOREFILE"]').unbind('change').change(function() {
		var filename = $(this).val()+"";
		if(filename){filename = filename.substr(filename.lastIndexOf("\\")+1, filename.length);}
		$('[sid="S_FIREWALL_FILESELECT"]').val($(this).val()?filename:M_lang['S_FIREWALL_FILESELECT']);
	}).val('').trigger('change');
	$('[sid="FIREWALL_BACKUP"]').unbind('click').click(function(){self.location.href='/cgi/iux_download.cgi?act=firewall';});
}

function local_fileform_submit(rule_type)
{
	var postData = new FormData($('#iux_file_form')[0]);
	postData.append("tmenu",window.tmenu);	postData.append("smenu",window.smenu);	postData.append("act",'restore');

	window.scroll(0,0);
	$.ajax({
		url: '/cgi/iux_set.cgi',processData: false,contentType: false,	data: postData,	type: 'POST',
		success: function(data){
			$('#loading').popup('close');
			if(data == 'fail'){alert(M_lang['S_FIREWALL_RESTOREFAIL']);}
			else{alert(M_lang['S_FIREWALL_RESTORESUCCESS']);}
			var category_val = 'all';
			if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
			get_config(window.tmenu, window.smenu, {name : 'category', value : category_val});
			//iux_update_local();	
			$('[sid="C_FIREWALL_RESTOREFILE"]').val('').trigger('change');
		},
		error: function(){
			$('#loading').popup('close');	alert(M_lang['S_FIREWALL_RESTOREFAIL']);
			$('[sid="C_FIREWALL_RESTOREFILE"]').val('').trigger('change');
		}
	});
}

function pageview_select_update()
{
	if(config_data.use_wifi != '0'){
		$('[sid="PAGE_MENU"]').append('<option value=\"all\" selected>'+M_lang['S_ALLVIEW_STRING']+'</option>');
		$('[sid="PAGE_MENU"]').append('<option value=\"internet\">'+M_lang['S_FIREWALLVIEW_STRING']+'</option>');
		$('[sid="PAGE_MENU"]').append('<option value=\"wifi\">'+M_lang['S_WIFIVIEW_STRING']+'</option>');
	
		$('[sid="PAGE_MENU"]').css('display','inline-block');
		$('[sid="PAGE_MENU"]').css('direction','rtl');
		$('[sid="PAGE_MENU"]').change(function(){
			window.scroll(0,0);
			//$('#loading').popup('open');
			get_config(window.tmenu, window.smenu, {name : 'category', value : $(this).val()});
			//iux_update_local();	
		});
	}
}

function append_main_line(bgidx, ruletype, ruleidx, disabled)
{
	var HTMLStr = ('<div class=\"'+((bgidx % 2 == 1) ? 'lc_whitebox_div' : 'lc_greenbox_div')+'\" id=\"'+ruletype+'_'+ruleidx+'\" sid=\"LISTDATA\">');
	HTMLStr += '<div class=\"lc_priority_div\"><div class=\"lc_line_div\">';
	HTMLStr += ('<p class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\" sid=\"IDX_FIELD\">'+(bgidx)+'</p></div>');
	HTMLStr += '<div class=\"lc_line_div\"><div sid=\"STATUS_FIELD\" class=\"lc_status_div\"></div></div><div class=\"lc_line_div\"></div></div>';
	HTMLStr += '<div class=\"lc_leftbox_div\"><div class=\"lc_line_div\">';
	HTMLStr	+= ('<p sid=\"RULENAME_FIELD\" class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\"></p></div>');
	HTMLStr	+= ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_leftcolor')+'\">');
	HTMLStr += ('<p sid=\"INTIPMAC_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div>');
	HTMLStr	+= ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_leftcolor')+'\">');
	HTMLStr += ('<p sid=\"TARGETLEFT_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div></div>');
	HTMLStr += '<div class=\"lc_direction_div\"><div class=\"lc_line_div\"></div><div class=\"lc_line_div\">';
	HTMLStr += ('<p sid=\"DIRECTION_FIELD\" class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\"></p>');
	HTMLStr += ('</div><div class=\"lc_line_div\"><p><img sid=\"DIRECTIONIMAGE_FIELD\"></p>');
	HTMLStr += ('</div></div><div class=\"lc_rightbox_div\"><div class=\"lc_line_div\">');
	HTMLStr += ('<p sid=\"DAYS_FIELD\" class=\"lc_boldfont_text '+((disabled == '1')?'lc_disabled_text':'')+'\"></p></div>');
	HTMLStr += ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_rightcolor')+'\">');
	HTMLStr += ('<p sid=\"EXTIPURL_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div>');
	HTMLStr	+= ('<div class=\"lc_line_div '+((disabled == '1')?'lc_bg_disabledcolor':'lc_bg_rightcolor')+'\">');
	HTMLStr += ('<p sid=\"TARGETRIGHT_FIELD\" class=\"'+((disabled == '1')?'lc_disabled_text':'lc_bgfont_text')+'\"></p></div></div></div>');
	if(ruletype == 'firewallrule')
		$('#firewall_listbox').append(HTMLStr).trigger('create');
	else if(ruletype == 'wifirule')
		$('#wifi_listbox').append(HTMLStr).trigger('create');

	$('#'+ruletype+'_'+ruleidx).unbind("taphold").on( "taphold", function(event) {
                $( event.currentTarget).addClass( "taphold" );
                listId = $(event.currentTarget).attr('id');
                popup( M_lang['S_POPUPTITLE_'+ruletype.toUpperCase()],  listId);
        });
}

function append_newrule_line(idx, listid)
{
	var HTMLStr = (((idx % 2) == 1)?('<div class=\"lc_whitebox_div\" id=\"setup_0\" sid=\"LISTDATA\">')
				:('<div class=\"lc_greenbox_div\" id=\"setup_0\" sid=\"LISTDATA\">'));
	HTMLStr += '<div class=\"lc_priority_div\"><div class=\"lc_newline_div\"><img src=\"/common/images/add_icon.png\"></div></div>';
	HTMLStr += '<div class=\"lc_leftbox_div\"><div class=\"lc_newline_div\"><p class=\"lc_boldfont_text\" sid=\"S_NEWRULE_STRING\">';
	HTMLStr += (M_lang['S_NEWRULE_STRING']);
	HTMLStr += '</p></div></div></div>';
	if(current_rule_count >= parseInt(config_data.max_rule_count)){return;}

	$('#'+listid).append(HTMLStr).trigger('create');
}

function make_line_integer_string_fix(_val)
{
	if(_val < 10)	return '0'+parseInt(_val);
	else		return parseInt(_val);
}

function make_line_day_string(_day, _stime, _etime)
{
	var valtxt = '';
	if(_day == 0){valtxt = M_lang['S_EVERY_STRING'];}
	else{
		for(var i = 0; i < 7; i++){
			if(((0x1 << i) & _day)){
				switch(i){
					case 0:	valtxt += M_lang['S_SUN_STRING'];	break;
					case 1:	valtxt += M_lang['S_MON_STRING'];	break;
					case 2:	valtxt += M_lang['S_TUE_STRING'];	break;
					case 3:	valtxt += M_lang['S_WED_STRING'];	break;
					case 4:	valtxt += M_lang['S_THU_STRING'];	break;
					case 5:	valtxt += M_lang['S_FRI_STRING'];	break;
					case 6:	valtxt += M_lang['S_SAT_STRING'];	break;
				}
			}
		}
	}
	valtxt += ' ';
	if(_stime == 0 && _etime == 0){valtxt += M_lang['S_ALLHOUR_STRING'];}
	else{
		valtxt += ((_stime != 0)?make_line_integer_string_fix(_stime/100):'00');	valtxt += ':';
		valtxt += ((_stime != 0)?make_line_integer_string_fix(_stime%100):'00');	valtxt += '~';
		valtxt += ((_etime != 0)?make_line_integer_string_fix(_etime/100):'00');	valtxt += ':';
		valtxt += ((_etime != 0)?make_line_integer_string_fix(_etime%100):'00');
	}

	return valtxt;
}

function make_line_time_string(_dayval)
{
	if(!_dayval || _dayval == 'all')	return 'all';
	var retstr = '';
	var i = _dayval.length;
	for(; i < 4 ; i ++){retstr += '0';}
	retstr += _dayval;

	return retstr;
}

function make_protocol_string(_protocol, _sport, _eport)
{
	if(_protocol == 'none')	return M_lang['S_TARGET_STRING'] + ' ALL';
	if(_protocol == 'icmp' || _protocol == 'gre')	return _protocol.toUpperCase();

	var valtxt = '';

	if(_eport != 0)	valtxt = _sport + '~' + _eport;
	else		valtxt = _sport;

	valtxt += ('(' + _protocol.toUpperCase() + ')');
	return valtxt;
}

function find_running_rule(rulename)
{
	for(var i = 0; i < status_data.firewall_running.length; i++){
		if(status_data.firewall_running[i].name == rulename)	return true;
	}
	return false;
}

function update_day_check(ruletype, dayval)
{
	var val = parseInt(dayval);
	if(val == 0){$('[sid=\"L_'+ruletype.toUpperCase()+'_EVERY\"]').prop('checked','checked').checkboxradio('refresh');}
	else{$('[sid=\"L_'+ruletype.toUpperCase()+'_EVERY\"]').removeAttr('checked').checkboxradio('refresh');}
	if((0x1) & val){$('[sid=\"L_'+ruletype.toUpperCase()+'_DAY6\"]').prop('checked','checked').checkboxradio('refresh');}
	for(var i = 1; i < 7; i ++){
		if((0x1 << i) & val){$('[sid=\"L_'+ruletype.toUpperCase()+'_DAY'+(i-1)+'\"]').prop('checked','checked').checkboxradio('refresh');}
		else{$('[sid=\"L_'+ruletype.toUpperCase()+'_DAY'+(i-1)+'\"]').removeAttr('checked').checkboxradio('refresh');}
	}
}

function update_ip_field(sid, sip, eip)
{
	if(!sip || sip == '')	return;
	var siparr = sip.split('.');
	var eiparr = eip.split('.');

	for(var i = 0 ; i < 4; i ++){$('[sid=\"'+sid+'\"] [sid=\"VALUE'+i+'\"]').val(siparr[i]);}
	if(eiparr[3])	$('[sid=\"'+sid+'\"] [sid=\"VALUE'+4+'\"]').val(eiparr[3]);
}

function update_firewall_status()
{
	if(!status_data)	return;
	$('[sid="LISTDATA"]').each(function(){
		var _id = $(this).attr('id');
		var _rulename = $('#'+_id+' [sid=\"RULENAME_FIELD\"]').text();
		if($('#'+_id+' [sid=\"RULENAME_FIELD\"]').hasClass('lc_disabled_text')){
			$('#'+_id+' [sid=\"STATUS_FIELD\"]').html('<img src=\"images/stop.png\">');
		}else{
			if(find_running_rule(_rulename)){$('#'+_id+' [sid=\"STATUS_FIELD\"]').html('<img src=\"images/play.png\">');}
			else{$('#'+_id+' [sid=\"STATUS_FIELD\"]').html('<img src=\"images/pause.png\">');}
		}
	});
}

function update_firewall_line(idval, configObj)
{
	var valtxt = configObj.name + ((configObj.disabled == '1')?M_lang['S_DISABLED_STATUS']:'');
	$('#' + idval + ' [sid=\"RULENAME_FIELD\"]').text(valtxt);
	
	if(configObj.srcaddrtype == 'ip' || configObj.srcaddrtype == 'all'){
		if(configObj.srceip != '')		valtxt = (configObj.srcsip + '~' + configObj.srceip);
		else{
			if(configObj.srcsip != '')	valtxt = (configObj.srcsip);
			else				valtxt = M_lang['S_ALLIP_STRING'];
		}
	}
	else if(configObj.srcaddrtype == 'mac'){valtxt = configObj.srcmac;	valtxt = valtxt.replace(/:/g,'-');}
	$('#' + idval + ' [sid=\"INTIPMAC_FIELD\"]').text(valtxt);
	$('#' + idval + ' [sid=\"DAYS_FIELD\"]').text(make_line_day_string(parseInt(configObj.day), parseInt((configObj.stime != 'all')?configObj.stime:'0')
			, parseInt(configObj.etime)));
	
	if(configObj.url == ''){
		if(configObj.dsteip != '')		valtxt = (configObj.dstsip + '~' + configObj.dsteip);
		else{
			if(configObj.dstsip != '')	valtxt = (configObj.dstsip);
			else				valtxt = M_lang['S_ALLIP_STRING'];
		}
	}
	else{valtxt = configObj.url;}
	$('#' + idval + ' [sid=\"EXTIPURL_FIELD\"]').text(valtxt);

	if(configObj.policy == 'drop')	valtxt = M_lang['S_DENY_STRING'];
	else				valtxt = M_lang['S_ACCEPT_STRING'];
	$('#' + idval + ' [sid=\"DIRECTION_FIELD\"]').text(valtxt);

	if(configObj.direction == 'inout'){
		if(configObj.disabled == '1'){$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow.png');}
		else{
			if(configObj.policy == 'drop')	$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow_deny.png');
			else				$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow_accept.png');
		}
		if(configObj.type != 'site'){
			$('#' + idval + ' [sid=\"TARGETRIGHT_FIELD\"]').text(
				make_protocol_string(configObj.protocol, parseInt((configObj.dstsport != '')?configObj.dstsport:'0')
				, parseInt((configObj.dsteport != '')?configObj.dsteport:'0'))
			);
		}
	}
	else if(configObj.direction == 'outin'){
		if(configObj.disabled == '1'){$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/left_arrow.png');}
		else{
			if(configObj.policy == 'drop')	$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/left_arrow_deny.png');
			else				$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/left_arrow_accept.png');
		}
		if(configObj.type != 'site'){
			$('#' + idval + ' [sid=\"TARGETLEFT_FIELD\"]').text(
				make_protocol_string(configObj.protocol, parseInt((configObj.dstsport != '')?configObj.dstsport:'0')
				, parseInt((configObj.dsteport != '')?configObj.dsteport:'0'))
			);
		}
	}
	else{
		if(configObj.disabled == '1'){
			$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/both_arrow.png').css('width','2.5em');
		}
		else{
			if(configObj.policy == 'drop')	
				$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/both_arrow_deny.png').css('width','2.5em');
			else				
				$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/both_arrow_accept.png').css('width','2.5em');
		}
		if(configObj.type != 'site'){
			valtxt = make_protocol_string(configObj.protocol, parseInt((configObj.dstsport != '')?configObj.dstsport:'0')
				, parseInt((configObj.dsteport != '')?configObj.dsteport:'0'));
			$('#' + idval + ' [sid=\"TARGETLEFT_FIELD\"]').text(valtxt);
			$('#' + idval + ' [sid=\"TARGETRIGHT_FIELD\"]').text(valtxt);
		}
	}
	if(configObj.disabled != '1'){
		if(configObj.policy == 'drop')	$('#' + idval + ' [sid=\"DIRECTION_FIELD\"]').addClass('lc_deny_text');
		else				$('#' + idval + ' [sid=\"DIRECTION_FIELD\"]').addClass('lc_accept_text');
	}
}

function update_wifi_line(idval, configObj)
{
	$('#' + idval + ' [sid=\"IDX_FIELD\"]').text('');
	var valtxt = configObj.name + ((configObj.disabled == '1')?M_lang['S_DISABLED_STATUS']:'');
	$('#' + idval + ' [sid=\"RULENAME_FIELD\"]').text(valtxt);
	
	if(configObj.band == '2g')	valtxt = 'WiFi 2.4G';
	else				valtxt = ('WiFi ' + configObj.band.toUpperCase());
	$('#' + idval + ' [sid=\"INTIPMAC_FIELD\"]').text(valtxt);
	$('#' + idval + ' [sid=\"DAYS_FIELD\"]').text(make_line_day_string(parseInt(configObj.day), parseInt((configObj.stime != 'all')?configObj.stime:'0')
			, parseInt(configObj.etime)));
	$('#' + idval + ' [sid=\"EXTIPURL_FIELD\"]').text(M_lang['S_ALLIP_STRING']);
	$('#' + idval + ' [sid=\"TARGETRIGHT_FIELD\"]').text(M_lang['S_TARGET_STRING'] + ' ALL');
	$('#' + idval + ' [sid=\"DIRECTION_FIELD\"]').text(M_lang['S_DENY_STRING']);
	if(configObj.disabled == '1'){$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow.png');}
	else{
		if(configObj.policy == 'drop')	$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow_deny.png');
		else				$('#' + idval + ' [sid=\"DIRECTIONIMAGE_FIELD\"]').prop('src','/common/images/right_arrow_accept.png');
	}
	if(configObj.disabled != '1'){$('#' + idval + ' [sid=\"DIRECTION_FIELD\"]').addClass('lc_deny_text');}
}

function make_localConfigObj(mode, configObj)
{
	var localConfigObj = new Object();
	switch(mode){
		case 'firewallrule':	
			localConfigObj.firewallrule = configObj;	
			if(localConfigObj.firewallrule.dstsport == '0')	localConfigObj.firewallrule.dstsport = '';
			if(localConfigObj.firewallrule.dsteport == '0')	localConfigObj.firewallrule.dsteport = '';
			localConfigObj.firewallrule.dstaddrtype = ((localConfigObj.firewallrule.dstsip != '')?'ip':'all');
			var val1 = localConfigObj.firewallrule.stime;	var val2 = localConfigObj.firewallrule.etime;
			if(val1 == '0' && val2 == '0'){	localConfigObj.firewallrule.stime = 'all';	localConfigObj.firewallrule.etime = '0000';}
			else{localConfigObj.firewallrule.stime = make_line_time_string(val1); localConfigObj.firewallrule.etime=make_line_time_string(val2);}
			if(localConfigObj.firewallrule.srcsip == '' && localConfigObj.firewallrule.srcmac == ''){
				localConfigObj.firewallrule.srcaddrtype='all';
			}
			break;
		case 'wifirule':	
			localConfigObj.wifirule = configObj;		localConfigObj.wifirule.type = 'wifi';	
			var val1 = localConfigObj.wifirule.stime;	var val2 = localConfigObj.wifirule.etime;
			if(val1 == '0' && val2 == '0'){	localConfigObj.wifirule.stime = 'all';	localConfigObj.wifirule.etime = '0000';}
			else{localConfigObj.wifirule.stime = make_line_time_string(val1); localConfigObj.wifirule.etime=make_line_time_string(val2);}
			break;
		case 'setup':
			localConfigObj.setup = new Object();	localConfigObj.setup.dstaddrtype = 'all';
			localConfigObj.setup.priority = '';	localConfigObj.setup.dsteport = '';	localConfigObj.setup.srceip = '';
			localConfigObj.setup.dstsip = '';	localConfigObj.setup.dsteip = '';	localConfigObj.setup.srcmac = '';
			localConfigObj.setup.type = 'internet';	localConfigObj.setup.srcaddrtype = 'ip';	localConfigObj.setup.name = '';	
			localConfigObj.setup.direction = 'inout';	localConfigObj.setup.protocol = 'none';	localConfigObj.setup.dstsport = '';	
			localConfigObj.setup.policy = 'drop';	localConfigObj.setup.day = '0';		localConfigObj.setup.band = '2g';
			localConfigObj.setup.stime = 'all';	localConfigObj.setup.etime = '0000';	localConfigObj.setup.url = '';
			break;
	}
	return localConfigObj;
}

function get_localConfigObj(_idstr)
{
	if(!_idstr)	return null;
	var arr = _idstr.split('_');
	switch(arr[0]){
		case 'firewallrule':	return make_localConfigObj(arr[0], config_data.firewall_rules[parseInt(arr[1])]);
		case 'wifirule':	return make_localConfigObj(arr[0], config_data.wifi_rules[parseInt(arr[1])]);
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
                                        case 'firewallrule':
                                                localpostdata.push({'name':'name', 'value':submit_data.firewallrule.name});
                                                break;
                                        case 'wifirule':
                                                localpostdata.push({'name':'name', 'value':submit_data.wifirule.name});
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

function fill_band_value(ruletype)
{
	var val = '';
	if(ruletype == 'setup'){val = config_data.setup.band;}
	else if(ruletype == 'wifirule'){val = config_data.wifirule.band;}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_BAND\"]').find('option').remove();
	var listObjs = M_lang['S_BAND'];
	for(var idx = 0; (listObjs && idx < listObjs.length); idx++){
		var nm = listObjs[idx];
		if(!tmp_config_data.use_wifi || tmp_config_data.use_wifi == '0')	break;
		if(tmp_config_data.use_5g_band == '0' && nm.value != '2g')		continue;
		$('[sid=\"C_'+ruletype.toUpperCase()+'_BAND\"]').append('<option value=\"'+nm.value+'\">'+nm.text+'</option>');
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_BAND\"]').attr("value",val).val(val).selectmenu('refresh',true);
}

function fill_time_value(ruletype)
{
	var val1 = '';
	var val2 = '';
	if(ruletype == 'setup'){val1 = config_data.setup.stime; val2 = config_data.setup.etime;}
	else if(ruletype == 'wifirule'){val1 = config_data.wifirule.stime; val2 = config_data.wifirule.etime;}
	else if(ruletype == 'firewallrule'){val1 = config_data.firewallrule.stime; val2 = config_data.firewallrule.etime;}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').find('option').remove();
	$('[sid=\"C_'+ruletype.toUpperCase()+'_ETIME\"]').find('option').remove();
	var listObjs_stime = M_lang['S_STIME'];
	var listObjs_etime = M_lang['S_ETIME'];
	for(var idx = 0; (listObjs_stime && idx < listObjs_stime.length); idx++){
		var nm = listObjs_stime[idx];
		$('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').append('<option value=\"'+nm.value+'\">'+nm.text+'</option>');
	}
	for(var idx = 0; (listObjs_etime && idx < listObjs_etime.length); idx++){
		var nm = listObjs_etime[idx];
		$('[sid=\"C_'+ruletype.toUpperCase()+'_ETIME\"]').append('<option value=\"'+nm.value+'\">'+nm.text+'</option>');
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_STIME\"]').attr("value",val1).val(val1).selectmenu('refresh',true);
	$('[sid=\"C_'+ruletype.toUpperCase()+'_ETIME\"]').attr("value",val2).val(val2).selectmenu('refresh',true);
}

function fill_macsearch_value(ruletype)
{
	$.ajaxSetup({async : false});
	$.getJSON('/cgi/iux_get.cgi', {	tmenu : window.tmenu,smenu : window.smenu,act : 'data'})
	.done(function(data){if(json_validate(data, '') == true)	mac_data = data;	else	mac_data = null;});

	$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').find('option').remove();
	$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').append('<option value=\"none\">'+M_lang['S_FIREWALL_MACSEARCHDEFAULT']+'</option>');
	if(mac_data && mac_data.maclist){
		for(var i = 0 ; i < mac_data.maclist.length; i ++){
			if(mac_data.maclist[i].value != 'end')
			$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]')
				.append('<option value=\"'+mac_data.maclist[i].value+'\">'+mac_data.maclist[i].text+'</option>');
		}
	}
	$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').append('<option value=\"research\">'+M_lang['S_FIREWALL_MACRESEARCH']+'</option>');
	$('[sid=\"'+ruletype.toUpperCase()+'_MACSEARCH\"]').attr("value",'none').val('none').selectmenu('refresh',true);
}
//local utility functions end

//local functions start
iux_update_local_func['static'] = function()
{
	if((tmp_config_data && tmp_config_data.use_wifi == '0') || 
		(config_data && config_data.use_wifi == '0')){
		$('[sid=\"S_PAGE_TITLE\"]').text(M_lang['S_PAGE_TITLE_NOWIFI']);
	}
}

iux_update_local_func['all'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	var i = 1;

	for(var j = 0; j < config_data.firewall_rules.length; i++, j++){
		if(!config_data.firewall_rules[j].name)	break;
		append_main_line(i,'firewallrule',j,config_data.firewall_rules[j].disabled);
		update_firewall_line('firewallrule_'+j, config_data.firewall_rules[j]);
	}
	if(config_data.wifi_rules){
		for(var j = 0; j < config_data.wifi_rules.length; i++, j++){
			if(!config_data.wifi_rules[j].name)	break;
			append_main_line(i,'wifirule',j,config_data.wifi_rules[j].disabled);
			update_wifi_line('wifirule_'+j, config_data.wifi_rules[j]);
		}
	}
	if(config_data.wifi_rules && config_data.wifi_rules.length > 1){
		$('#wifi_listbox').css('display','');
		append_newrule_line(i, 'wifi_listbox');
	}
	else{
		$('#wifi_listbox').css('display','none');
		append_newrule_line(i, 'firewall_listbox');
	}
	$('#firewall_listbox').css('display','');
	$('#fileform_box').css('display','');
	if(current_rule_count == 0){locking_obj('FIREWALL_BACKUP', 'disabled');}
	else{unlocking_obj('FIREWALL_BACKUP', 'disabled');}
	fileform_listener_add();
	//tmp_config_data = config_data;
};

iux_update_local_func['internet'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	var i = 1;
	
	for(var j = 0; j < config_data.firewall_rules.length; i++, j++){
		if(!config_data.firewall_rules[j].name)	break;
		append_main_line(i,'firewallrule',j,config_data.firewall_rules[j].disabled);
		update_firewall_line('firewallrule_'+j, config_data.firewall_rules[j]);
	}
	append_newrule_line(i, 'firewall_listbox');
	$('#firewall_listbox').css('display','');
	$('#wifi_listbox').css('display','none');
	$('#fileform_box').css('display','');
	if(current_rule_count == 0){locking_obj('FIREWALL_BACKUP', 'disabled');}
	else{unlocking_obj('FIREWALL_BACKUP', 'disabled');}
	fileform_listener_add();
	//tmp_config_data = config_data;
};

iux_update_local_func['wifi'] = function(identifier)
{
	$('[sid="LISTDATA"]').remove();
	var i = 1;
		
	if(config_data.wifi_rules){
		for(var j = 0; j < config_data.wifi_rules.length; i++, j++){
			if(!config_data.wifi_rules[j].name)	break;
			append_main_line(i,'wifirule',j,config_data.wifi_rules[j].disabled);
			update_wifi_line('wifirule_'+j, config_data.wifi_rules[j]);
		}
	}
	append_newrule_line(i, 'wifi_listbox');
	$('#firewall_listbox').css('display','none');
	$('#wifi_listbox').css('display','');
	$('#fileform_box').css('display','');
	if(current_rule_count == 0){locking_obj('FIREWALL_BACKUP', 'disabled');}
	else{unlocking_obj('FIREWALL_BACKUP', 'disabled');}
	fileform_listener_add();
	//tmp_config_data = config_data;
};

iux_update_local_func['firewallrule'] = function(identifier)
{
	$('[sid="S_TEMP_TITLE"]').text($('[sid="C_FIREWALLRULE_NAME"]').val());
	$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
	$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');

	set_formview_by_type('firewallrule');
	update_day_check('firewallrule', config_data.firewallrule.day);
	update_ip_field('L_FIREWALLRULE_SRCIP',config_data.firewallrule.srcsip,config_data.firewallrule.srceip);
	update_ip_field('L_FIREWALLRULE_DSTIP',config_data.firewallrule.dstsip,config_data.firewallrule.dsteip);
	change_srcaddrtype_by_direction('firewallrule', config_data.firewallrule.srcaddrtype);
	change_protocol_text('firewallrule', config_data.firewallrule.direction);
	set_srcview_by_srcaddrtype('firewallrule', config_data.firewallrule.srcaddrtype);
	if(config_data.firewallrule.disabled == '1')	all_disable_control('firewallrule');
	else						all_enable_control('firewallrule');
	locking_obj('C_FIREWALLRULE_NAME', 'readonly');
	locking_obj('S_MODIFY_BTN', 'disabled');
	locking_obj('S_CANCEL_BTN', 'disabled');
}

add_listener_local_func['firewallrule'] = function(idval)
{
	basic_control_event_add('firewallrule',idval);
}

submit_local_func['firewallrule'] = function(localdata, checking)
{
	if(checking && !firewallrule_validate('firewallrule'))	return;
	$('#loading').popup('open');
	var category_val = 'all';
	if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
	if(localdata)	localdata = localdata.concat(make_localpost_data('firewallrule'));
	else		localdata = make_localpost_data('firewallrule');
	iux_submit('firewallrule',localdata, true, {'name':'category', 'value':category_val});
	//tmp_config_data = null;	$('#right_panel').panel('close');	iux_update_local();
}

iux_update_local_func['wifirule'] = function(identifier)
{
	$('[sid="S_TEMP_TITLE"]').text($('[sid="C_WIFIRULE_NAME"]').val());
	$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
	$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');

	set_typedata_by_usewifi('wifirule');
	set_formview_by_type('wifirule');
	wifimode_update_local('wifirule');
	update_day_check('wifirule', config_data.wifirule.day);
	if(config_data.wifirule.disabled == '1')	all_disable_control('wifirule');
	else						all_enable_control('wifirule');
	locking_obj('C_WIFIRULE_NAME', 'readonly');
	locking_obj('S_MODIFY_BTN', 'disabled');
	locking_obj('S_CANCEL_BTN', 'disabled');
}

add_listener_local_func['wifirule'] = function(idval)
{
	basic_control_event_add('wifirule',idval);
}

submit_local_func['wifirule'] = function(localdata, checking)
{
	if(checking && !wifirule_validate('wifirule'))	return;
	$('#loading').popup('open');
	var category_val = 'all';
	if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
	if(localdata)	localdata = localdata.concat(make_localpost_data('wifirule'));
	else		localdata = make_localpost_data('wifirule');
	iux_submit('firewallrule',localdata, true, {'name':'category', 'value':category_val});
	//tmp_config_data = null;	$('#right_panel').panel('close');	iux_update_local();
}

iux_update_local_func['setup'] = function(identifier)
{
	$('[sid="S_TEMP_TITLE"]').text(M_lang['S_NEWRULE_STRING']);
	$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
	$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
	var typeval = $('[sid=\"PAGE_MENU\"]').val();
	if(typeval == 'wifi'){
		config_data.setup.type = typeval;
		$('[sid=\"C_SETUP_TYPE\"]').val(typeval).selectmenu('refresh', true);
	}
	set_typedata_by_usewifi('setup');
	set_formview_by_type('setup');
	{var tmparr = tmp_config_data.gateway.split('.');	config_data.setup.srcsip = tmparr[0]+'.'+tmparr[1]+'.'+tmparr[2];}
	update_ip_field('L_SETUP_SRCIP',config_data.setup.srcsip,config_data.setup.srceip);
	config_data.setup.srcsip = '';
	change_srcaddrtype_by_direction('setup', config_data.setup.srcaddrtype);
	change_protocol_text('setup', config_data.setup.direction);
	set_srcview_by_srcaddrtype('setup', config_data.setup.srcaddrtype);
	all_enable_control('setup');
	locking_obj('C_SETUP_DISABLED','readonly');
	locking_obj('S_DELETE_BTN', 'disabled');
	locking_obj('S_NEWRULE_BTN', 'disabled');
}

add_listener_local_func['setup'] = function()
{
	basic_control_event_add('setup');
	$('[sid=\"C_SETUP_TYPE\"]').trigger('change');
}

submit_local_func['setup'] = function(localdata)
{
	var mode = $('[sid=\"C_SETUP_TYPE\"]').val();
	if(mode == 'internet' || mode == 'site'){
		if(!firewallrule_validate('setup'))	return;
	}else{
		if(!wifirule_validate('setup'))		return;
	}
	$('#loading').popup('open');
	var category_val = 'all';
	if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
	if(localdata)	localdata = localdata.concat(make_localpost_data('setup'));
	else		localdata = make_localpost_data('setup');
	iux_submit('setup',localdata, true, {'name':'category', 'value':category_val});
	//tmp_config_data = null;	$('#right_panel').panel('close');	iux_update_local();
}

submit_local_func['restore'] = function()
{
	$('#loading').popup('open');	local_fileform_submit('restore');
}

function loadLocalPage()
{
	pageview_select_update();
	highlight = HighlightObject();
	popup = TapholdPopup();
}

function result_config(result)
{
	setTimeout( function() {
		$('#loading').popup('close');
	}, 500);
        if(result){
                tmp_config_data = null;
                iux_update_local();
        }
}

function result_submit(service_name, result)
{
        if(result){
                if(service_name == 'setup' || service_name == 'firewallrule' || service_name == 'wifirule'){
                        tmp_config_data = null; $('#right_panel').panel('close');
                }
        }
}
//local functions end
$(document).on("panelbeforeclose", "#right_panel", function(){
	if(tmp_config_data){config_data = tmp_config_data;	tmp_config_data = null;	iux_update_local();}
});

$(document).ready(function() {
	window.tmenu = "firewallconf";
	window.smenu = "firewall";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, {name : 'category', value : 'all'}, 60000);
	events.on('load_header_ended_local', function(menuname){
		iux_update("C");	iux_update("S");
	});
	//pageview_select_update();	iux_update_local();

        //highlight = HighlightObject();
	//popup = new TapholdPopup();
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
                $popup.popup("open");
        }
        return openPopup;
}

function iux_set_onclick_local()
{
	$('[sid="LISTDATA"]').each(function(){
		var idval = $(this).attr('id');
		$(this).unbind('click').on('click', function(){
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
}

function iux_update_local(identifier)
{
	if(!identifier){	//list update
		if(config_data.firewall_rules){current_rule_count = (config_data.firewall_rules.length - 1);
		if(config_data.wifi_rules){current_rule_count += (config_data.wifi_rules.length - 1);}}
		var mode = $('[sid="PAGE_MENU"] option:selected').val();
		if(mode){
			iux_update_local_func[mode].call(this, identifier);	update_firewall_status();
			iux_set_onclick_local();
		}
		else{
			iux_update_local_func['all'].call(this, identifier);	update_firewall_status();
			iux_set_onclick_local();
		}
	}
	else{
		if(identifier == 'C'){
			for(var articleName in config_data){
                	        if(config_data.hasOwnProperty(articleName) && articleName != ''){
                	                var caller_func = iux_update_local_func[articleName];
                	                if(caller_func){
						fill_time_value(articleName);	fill_band_value(articleName);	caller_func.call(this, identifier);
					}
                	        }
                	}
		}
		else if(identifier == 'D'){update_firewall_status();}
		else if(identifier == 'S'){iux_update_local_func['static'].call();}
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
			case 'firewallrule':
			case 'wifirule':	localdata.push({'name':'act', 'value':'modify'});	break;
			case 'setup':		localdata.push({'name':'act', 'value':'add'});		break;
		}
		checking = true;
	}
	submit_local_func[rule_type].call(this, localdata, checking);
}

function load_rightpanel(_idvalue)
{
	var ruletype = get_ruletype(_idvalue);
        if(ruletype.substr(ruletype.length - 4, 4) === "rule")
                highlight( _idvalue );

	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+ruletype+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				if(ruletype == 'firewallrule' || ruletype == 'wifirule' || ruletype == 'setup'){
					if(!tmp_config_data)tmp_config_data = config_data;
				}
				config_data = get_localConfigObj(_idvalue);
				//iux_update("C");	iux_update("S");
				listener_add_local(ruletype, _idvalue);
				load_header(RIGHT_HEADER, 'TEMP');

				if(ruletype == 'setup'){
					after_newrule_event();
				}
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		}
	);
}

