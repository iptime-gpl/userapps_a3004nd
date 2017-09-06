//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_hex = /[0-9a-fA-F]{64}/

var WPS_STOP = 0;
var WPS_START = 1;
var WPS_CONFIGURED = 2;

var tmp_config_data = null;
var current_mode = null;
var confirm_mode = null;
var confirm_data = null;
var control_channel_arr = null;
var central_channel_arr = null;
var error_code_local = null;
var wps_mode2g = WPS_STOP;
var wps_mode5g = WPS_STOP;
var is_loading_panel = false;
var current_selected_mode = '2g';
var opened = false;
//local-global variables end

//local utility functions
function get_parameter(key)
{
        var _tempUrl = window.location.search.substring(1);
        if(_tempUrl == '')      return null;
        var _tempArray = _tempUrl.split('&');

        for(var i = 0; _tempArray.length; i++) {
                var _keyValuePair = _tempArray[i].split('=');

                if(_keyValuePair[0] == key){
                        return _keyValuePair[1];
                }
        }
        return null;
}

function ByteLenUTF8CharCode(charCode)
{
    if (charCode <= 0x00007F) {
          return 1;
        } else if (charCode <= 0x0007FF) {
          return 2;
        } else if (charCode <= 0x00FFFF) {
          return 3;
        } else {
          return 4;
        }
}

function toggleImage( img )
{
        if( !opened ) {
                img.attr( "src", "images/menu_list_opened.png" ); opened = true;
        } else {
                img.attr( "src", "images/menu_list_closed.png" ); opened = false;
        }

}

function StrLenUTF8CharCode(val)
{
        var len=0, i=0;

        for(i=0;val.charCodeAt(i);i++)
                len+=ByteLenUTF8CharCode(val.charCodeAt(i));
        return len;
}

function submit_button_event_add(rule_type)
{
	$('[sid="S_MODIFY_BTN"]').click(function(){
		submit_local(rule_type, null);
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

function footerbtn_view_control()
{
	if(check_change_value()){unlocking_obj('S_MODIFY_BTN', 'disabled');}
	else{	locking_obj('S_MODIFY_BTN', 'disabled');}
}

function get_category_val()
{
	//var category_val = '2g';
	//if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
	//return category_val;
	return current_selected_mode;
}

function get_category_text()
{
	//var category_val = '2.4GHz';
	//if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"] :selected').text();}
	//return category_val;
	return (current_selected_mode == '2g')?'2.4GHz':'5GHz';
}

function btncontrol_event_add(sid, type)
{
	switch(type){
		case "click":	$('[sid="'+sid+'"]').click(function(){footerbtn_view_control();});break;
		case "keyup":	$('[sid="'+sid+'"]').keyup(function(){footerbtn_view_control();});break;
		case "change":	$('[sid="'+sid+'"]').change(function(){footerbtn_view_control();});break;
	}
}

function check_current_connmode()
{
	var menuval = get_category_val();
	var connmode = get_current_connmode();

	if(menuval == '2g')		menuval = 2;
	else if(menuval == '5g')	menuval = 5;
	else	return 0;

	if(menuval == connmode)		return 1;

	return 0;
}

function get_current_connmode()
{
	if(tmp_config_data){
		if(tmp_config_data.connmode && tmp_config_data.connmode != '0'){return parseInt(tmp_config_data.connmode);}
	}
	else{
		if(config_data.connmode && config_data.connmode != '0'){return parseInt(config_data.connmode);}
	}
	return 0;
}

function make_ip_string()
{
	var result = '';

	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE0\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE1\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE2\"]').val();	result += '.';
	result += $('[sid=\"C_WLRULE_RADIUSSERVER\"] [sid=\"VALUE3\"]').val();

	return result;
}

function make_local_postdata(ruletype)
{
	localdata = [];
	switch(ruletype){
		case 'wlrule':
			localdata.push({'name':'ismain', 'value':config_data.wlrule.ismain});
			localdata.push({'name':'wlmode', 'value':get_category_val()});
			localdata.push({'name':'sidx', 'value':config_data.wlrule.sidx});
			localdata.push({'name':'uiidx', 'value':config_data.wlrule.uiidx});
			localdata.push({'name':'radiusserver', 'value':make_ip_string()});
			break;
		case 'extendsetup':
			localdata.push({'name':'wlmode', 'value':get_category_val()});
			break;
	}
	return localdata;
}

function extendsetup_validate()
{
	var val = '';
	val = $('[sid=\"C_EXTENDSETUP_TXPOWER\"]').val();
	if(val == ''){alert(M_lang['S_TXPOWER_BLANKED']);	return false;}
	if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_TXPOWER_INVALID']);	return false;}
	if(parseInt(val)<0 || parseInt(val)>100){alert(M_lang['S_TXPOWER_INVALID']);	return false;}
	val = $('[sid=\"C_EXTENDSETUP_BEACON\"]').val();
	if(val == ''){alert(M_lang['S_BEACON_BLANKED']);	return false;}
	if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_BEACON_INVALID']);	return false;}
	if(parseInt(val)<50 || parseInt(val)>1024){alert(M_lang['S_BEACON_INVALID']);	return false;}
	val = $('[sid=\"C_EXTENDSETUP_RTS\"]').val();
	if(val == ''){alert(M_lang['S_RTS_BLANKED']);	return false;}
	if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_RTS_INVALID']);	return false;}
	if(parseInt(val)<0 || parseInt(val)>2347){alert(M_lang['S_RTS_INVALID']);	return false;}
	val = $('[sid=\"C_EXTENDSETUP_FRAG\"]').val();
	if(val == ''){alert(M_lang['S_FRAG_BLANKED']);	return false;}
	if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_FRAG_INVALID']);	return false;}
	if(parseInt(val)<256 || parseInt(val)>2346){alert(M_lang['S_FRAG_INVALID']);	return false;}
	val = $('[sid=\"C_EXTENDSETUP_DCSPERIODHOUR\"]').val();
	if(val == ''){alert(M_lang['S_DCSPERIOD_BLANKED']);	return false;}
	if(!validate_string(val, regExp_onlynum, 'match')){alert(M_lang['S_DCSPERIOD_INVALID']);	return false;}
	if(parseInt(val)<1 || parseInt(val)>100){alert(M_lang['S_DCSPERIOD_INVALID']);	return false;}
	return true;
}

function wlrule_validate()
{
	var val = '';
	var slen;
	val = $('[sid=\"C_WLRULE_SSID\"]').val();
	if(val == ''){
		alert(M_lang['S_SSID_BLANKED']);	return false;
	}
	if((slen = StrLenUTF8CharCode(val)) > 32){
		alert(M_lang['S_SSID_OVERFLOW'] + slen + 'bytes');	return false;
	}
	val = $('[sid=\"C_WLRULE_USEENTERPRISE\"]').is(':checked');
	if(val){
		if(!validate_string(make_ip_string(), regExp_ip, 'match')){
			alert(M_lang['S_RADIUSSERVER_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_RADIUSPORT\"]').val();
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_RADIUSPORT_INVALID']);	return false;
		}
		if(parseInt(val) < 0 || parseInt(val) > 65535){
			alert(M_lang['S_RADIUSPORT_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_RADIUSSECRET\"]').val();
		if(val == ''){
			alert(M_lang['S_RADIUSSECRET_BLANKED']);	return false;
		}
	}
	else{
		val = $('[sid=\"C_WLRULE_PERSONALLIST\"]').val();
		if(val == 'auto_wep' || val == 'open_wep' || val == 'key_wep'){
			alert(M_lang['S_WEP_NOTSUPPORTED_ALERT']);	return false;
		}
		if(val != 'nouse'){
			val = $('[sid=\"C_WLRULE_WPAPSK\"]').val();
			if(val == ''){
				alert(M_lang['S_WPAPSK_BLANKED']);	return false;
			}
			if(val.length < 8){
				alert(M_lang['S_WPAPSK_INVALID']);	return false;
			}
			if(val.length >= 64){
				if(!validate_string(val, regExp_hex, 'match')){
					alert(M_lang['S_WPAPSK_HEX_INVALID']);	return false;
				}
			}
		}
	}	

	val = $('[sid=\"C_WLRULE_QOSENABLE\"]').is(':checked');
	if(val){
		val = $('[sid=\"C_WLRULE_RXRATE\"]').val();
		if(val != '' && !validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_RXRATE_INVALID']);	return false;
		}
		val = $('[sid=\"C_WLRULE_TXRATE\"]').val();
		if(val != '' && !validate_string(val, regExp_onlynum, 'match')){
			alert(M_lang['S_TXRATE_INVALID']);	return false;
		}
	}
	return true;
}

function set_authview_by_personallist(ruletype, val)
{
	switch(val){
		case 'nouse':
			$('[sid=\"PERSONAL_BOX\"]').css('display','none');
			$('[sid=\"WEP_BOX\"]').css('display','none');
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
		case 'auto_wep':
		case 'open_wep':
		case 'key_wep':
			$('[sid=\"PERSONAL_BOX\"]').css('display','none');
			$('[sid=\"WEP_BOX\"]').css('display','');
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
		default:
			$('[sid=\"PERSONAL_BOX\"]').css('display','');
			$('[sid=\"WEP_BOX\"]').css('display','none');
			$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
			break;
	}
	$('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').val(val).selectmenu('refresh', true);
}

function set_authview_by_useenterprise(ruletype)
{
	var val = $('[sid=\"C_'+ruletype.toUpperCase()+'_USEENTERPRISE\"]').is(':checked');
	if(val){
		$('[sid=\"AUTH_BOX\"]').css('display','none');
		$('[sid=\"PERSONAL_BOX\"]').css('display','none');
		$('[sid=\"ENTERPRISE_BOX\"]').css('display','');
	}
	else{
		$('[sid=\"AUTH_BOX\"]').css('display','');
		$('[sid=\"ENTERPRISE_BOX\"]').css('display','none');
		set_authview_by_personallist(ruletype, $('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').val());
	}
}

function set_initcheck_passview(ruletype)
{
	$('[sid=\"L_'+ruletype.toUpperCase()+'_WPAPSKCHECK\"]').removeAttr('checked').checkboxradio('refresh');
	$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSSECRETCHECK\"]').removeAttr('checked').checkboxradio('refresh');
}

function set_password_process(ruletype, ctlname, checked)
{
	if(checked){$('[sid=\"C_'+ruletype.toUpperCase()+'_'+ctlname+'\"]').attr('type','text');}
	else{$('[sid=\"C_'+ruletype.toUpperCase()+'_'+ctlname+'\"]').attr('type','password');}
}

function set_radiusport_by_check(ruletype, checked)
{
	if(checked){unlocking_obj('C_'+ruletype.toUpperCase()+'_RADIUSPORT','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_RADIUSPORT','readonly');}
}

function set_qosinput_by_check(ruletype, checked)
{
	if(checked){unlocking_obj('C_'+ruletype.toUpperCase()+'_RXRATE','readonly'); unlocking_obj('C_'+ruletype.toUpperCase()+'_TXRATE','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_RXRATE','readonly'); locking_obj('C_'+ruletype.toUpperCase()+'_TXRATE','readonly');}
}

function set_dyninput_by_slider(ruletype, val)
{
	if(val == 'on'){unlocking_obj('C_'+ruletype.toUpperCase()+'_DCSPERIODHOUR','readonly');}
	else{locking_obj('C_'+ruletype.toUpperCase()+'_DCSPERIODHOUR','readonly');}
}

function set_wpstext_by_status()
{
	if(wps_mode2g == WPS_START){
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('2.4GHz ' + M_lang['S_WPSCANCEL_STRING']);
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpscancel.png');
		$('[sid=\"2GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSDESC_STRING']);
	}
	else if(wps_mode2g == WPS_CONFIGURED){
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('2.4GHz ' +M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
		$('[sid=\"2GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSCONFIGURED_STRING']);
	}
	else{
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('2.4GHz ' +M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
		$('[sid=\"2GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
	}
	if(wps_mode5g == WPS_START){
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('5GHz ' +M_lang['S_WPSCANCEL_STRING']);
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpscancel.png');
		$('[sid=\"5GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSDESC_STRING']);
	}
	else if(wps_mode5g == WPS_CONFIGURED){
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('5GHz ' +M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
		$('[sid=\"5GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text(M_lang['S_WPSCONFIGURED_STRING']);
	}
	else{
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('5GHz ' +M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNIMG_CONTENT\"]').attr('src','images/wpsconnect.png');
		$('[sid=\"5GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
	}
}

function basic_control_event_add(ruletype, idval)
{
	$('[sid^="C_"]').each(function(){
		var type=$(this).attr('type');
		if(!type)	return;
		var sid=$(this).attr('sid');
		var etype;

		switch(type){
			case 'radio':
			case 'checkbox':
			case 'slider':
			case 'select':	etype='change';	break;
			case 'text':
			case 'number':	etype='keyup';	break;
			default:	return;
		}
		btncontrol_event_add(sid,etype);
	});

	if(ruletype == 'wlrule'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PERSONALLIST\"]').unbind('change').change(function(){
			set_authview_by_personallist(ruletype, $(this).val());
			footerbtn_view_control();
		});
		
		$('[sid=\"C_'+ruletype.toUpperCase()+'_USEENTERPRISE\"]').unbind('change').change(function(){
			set_authview_by_useenterprise(ruletype);
			footerbtn_view_control();
		});
		
		$('[sid=\"C_'+ruletype.toUpperCase()+'_QOSENABLE\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_qosinput_by_check(ruletype, val);
			footerbtn_view_control();
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_WPAPSKCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_password_process(ruletype, 'WPAPSK', val);
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSSECRETCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_password_process(ruletype, 'RADIUSSECRET', val);
		}).trigger('change');

		$('[sid=\"L_'+ruletype.toUpperCase()+'_RADIUSPORTCHECK\"]').unbind('change').change(function(){
			var val = $(this).is(':checked');
			set_radiusport_by_check(ruletype, val);
		}).trigger('change');
		
		$('[sid=\"L_CHANSEARCH_BTN\"]').unbind('click').click(function(){
			$('[sid=\"L_CUSTOM_MSG1\"]').text(M_lang['S_NOW_SEARCH1']);
			$('[sid=\"L_CUSTOM_MSG2\"]').text(M_lang['S_NOW_SEARCH2']);
			$('#loading_msg').popup('open');
			get_search_data();
		});
	}
	else if(ruletype == 'extendsetup'){
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MODE\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_COUNTRY\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_CHANNELWIDTH\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_LDPC\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
				//view_flip_switch( $(this) );
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WMM\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WPSMODE\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_PHYWATCHDOG\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_WPSNOTI\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_DFS\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_STBC\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
					extendsetup_part_submit($myObj.attr('name'), $myObj.val());
				}
			}});
			//view_flip_switch( $(this) );
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_DYNCHANNEL\"]').unbind('change').each(function(){
			sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
				var val = $myObj.val();
				set_dyninput_by_slider(ruletype, val);
				//view_flip_switch( $(this) );
				if(val == 'off'){
					if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
						extendsetup_part_submit($myObj.attr('name'), $myObj.val());
					}else{
						footerbtn_view_control();
					}
				}else{
					footerbtn_view_control();
				}
			}});
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_TXBFMUMODE\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MUFLAG\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
		$('[sid=\"C_'+ruletype.toUpperCase()+'_MIMOANT\"]').unbind('change').change(function(){
			if($('[sid=\"S_MODIFY_BTN\"]').prop('disabled')){
				extendsetup_part_submit($(this).attr('name'), $(this).val());
			}
			$(this).selectmenu('refresh', true);
		});
	}
	submit_button_event_add(ruletype);
}

function extendsetup_part_submit(name, value)
{
	var localdata = [];
	var mode = get_category_val();
	$('#loading').popup('open');
	localdata.push({'name':name, 'value':value});
	localdata.push({'name':'wlmode', 'value':mode});
	iux_submit('extendsetup',localdata, false, {'name':'category', 'value':mode});
}

function wpssetup_part_submit(val, mode)
{
	var localdata = [];
	$('#loading').popup('open');
	localdata.push({'name':'wpsstatus', 'value':((val==WPS_START)?'start':'stop')});
	localdata.push({'name':'wlmode', 'value':mode});
	iux_submit('wps',localdata, false, {'name':'category', 'value':mode});
}

function wps_button_event_add()
{
	$('[sid=\"S_WPS_BTN2G\"], [sid=\"S_WPS_BTN5G\"]').unbind('click').click(function(){
		var val = WPS_START;
		if($(this).attr('sid') == 'S_WPS_BTN2G'){
			if(wps_mode2g == WPS_START){val = WPS_STOP;}
			else if(wps_mode2g == WPS_STOP || wps_mode2g == WPS_CONFIGURED){val = WPS_START;}
			else {val = WPS_STOP;}
			wpssetup_part_submit(val, '2g');
		}else{
			if(wps_mode5g == WPS_START){val = WPS_STOP;}
			else if(wps_mode5g == WPS_STOP || wps_mode5g == WPS_CONFIGURED){val = WPS_START;}
			else {val = WPS_STOP;}
			wpssetup_part_submit(val, '5g');
		}
	});
}

function wlrule_onoff_event_add()
{
	$('[sid=\"LISTDATA\"] select').unbind('change').each(function(){
		sliderButtonEvent({object : $(this), arguments : [$(this)], runFunc : function($myObj){
			var mode = $myObj.attr('sid').split('_')[2];
			current_selected_mode = mode;
			var idx = $myObj.attr('sid').split('_')[0].replace(/[^0-9]/g, '');
			var localdata = [];
			var tmp = null;
			if(mode == '5g'){tmp = config_data.bsslist_5g[idx];}
			else{tmp = config_data.bsslist_2g[idx];}
		
			if($myObj.val() != tmp.run){
				for(var Name in tmp){
					if(tmp.hasOwnProperty(Name) && Name != ''){
						if(Name == 'run')	continue;
						localdata.push({'name':Name, 'value':eval('tmp.'+Name)});
					}
				}
				localdata.push({'name':'run', 'value':($myObj.val())});
				localdata.push({'name':'wlmode', 'value':mode});
				if(check_current_connmode() != 0){
					confirm_mode = 'wlrule_onoff';	confirm_data = localdata;
					confirm(M_lang[((tmp.ismain == '1')?'S_DISCONNECTCONFIRM_STRING':'S_DISCONNECTCONFIRM2_STRING')]);	return;
				}
				$('#loading').popup('open');
				iux_submit('wlrule',localdata, false, {'name':'category', 'value':mode});
			}
		}});
	});
}

function append_main_line(ruletype, ruleidx, run, unlocking, wlmode, bkidx)
{
	var HTMLStr = '';
	HTMLStr += ('<div sid=\"LISTDATA\" class=\"'+((ruleidx==0)?'':('contents_div '+((opened)?'show ':'hide ')))+((bkidx%2)?'lc_greenbox_div':'lc_whitebox_div')+'\">');

	HTMLStr += ('<a href=\"#right_panel\" id=\"'+ruletype+'_'+ruleidx+'_'+wlmode+'\" data-icon=\"false\">');
	HTMLStr += ('<div class=\"lc_left_click_div\">');
	HTMLStr += ('<div class=\"lc_line_div\"><div><span sid=\"WLRULE_TITLE\" class=\"'+((run == '0')?'lc_disabled_text':'lc_description_text')+'\">');
	HTMLStr += ((wlmode=='2g')?'2.4 GHz ':'5 GHz ');
	HTMLStr += ((ruleidx == 0?M_lang['S_DEFAULT_WIRELESS']:(M_lang['S_SUB_WIRELESS']) +' '+ ruleidx)+'</span>');
	HTMLStr += ('<img src=\"/common/images/loading.gif\" class=\"lc_description_img\" sid=\"WLRULE_IMG\"></div></div>');
	HTMLStr += ('<div class=\"lc_line_div\"><p class=\"'+((run == '0')?'lc_disabled_text':'')+'\" sid=\"WLRULE_VALUE\"></p>');
	HTMLStr += ('</div>');
	HTMLStr += ('</div>');
	HTMLStr += ('</a>');
	
	HTMLStr += ('<div class=\"lc_center_noclick_div\">');
	HTMLStr += ('<div class=\"lc_oneline_div\">');
	HTMLStr += ('<div class=\"ui-alt-icon lc_line_rightside lc_line_checkbox\">');
	HTMLStr += ('<label class=\"ui-hidden-accessible\" for=\"'+(ruletype + ruleidx)+'_run'+'_'+wlmode+'\"></label>');
	HTMLStr += ('<select sid=\"'+(ruletype.toUpperCase()+ruleidx)+'_RUN_'+wlmode+'\" id=\"'+(ruletype + ruleidx)+'_run_'+wlmode+'\" data-role=\"slider\">');
	HTMLStr += ('<option value=\"0\">Off</option><option value=\"1\">On</option>');
	HTMLStr += ('</select></div><div class=\"lc_line_rightside\" style=\"display:padding-right:.5em;\">');
	HTMLStr += ('<img src=\"images/'+(unlocking?'wifi_unlock.png':'wifi_lock.png')+'\" class=\"'+((run=='0')?'lc_opacity30':'')+'\"></div>');
	HTMLStr += ('</div></div>');

	HTMLStr += ('<a href=\"#right_panel\" id=\"'+ruletype+'_'+ruleidx+'_'+wlmode+'\" data-icon=\"false\">');
	HTMLStr += ('<div class=\"lc_right_click_div\">');
	HTMLStr += ('<div class=\"lc_oneline_div\"><p class=\"lc_line_centerside\">');
	HTMLStr += ('<img src=\"/common/images/icon_list_run.png\" class=\"'+((run=='0')?'lc_opacity30':'')+'\"></p></div>')
	HTMLStr += ('</div>');
	HTMLStr += ('</a>');

	HTMLStr += ('</div>');

	$('#wl_listbox').append(HTMLStr).trigger('create');
}

function update_bssid_line(idval, configObj, identifier)
{
	var mode = get_rulemode(idval);
	if(identifier && identifier == 'D'){
		set_wpstext_by_status();
		if(mode == '2g'){
			if(wps_mode2g == WPS_START){
				if(parseInt(status_data.remaintime2g) == 0 || parseInt(status_data.remaintime2g) >= 120){
					return;
				}
				$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','');
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_WPSCONNECTING1_STRING']+
				(120 - parseInt(status_data.remaintime2g))+M_lang['S_WPSCONNECTING2_STRING']);
			}
			else{
				$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','none'); 
				if(status_data.stopbyswitch2g && status_data.stopbyswitch2g == '1'){
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
						.text(((mode=='2g')?'2.4 GHz ':'5 GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSWITCH_STRING']);
				}
				else if(status_data.stopbyschedule2g && status_data.stopbyschedule2g == '1'){
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
						.text(((mode=='2g')?'2.4 GHz ':'5 GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSCHEDULER_STRING']);
				}
				else{
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(((mode=='2g')?'2.4 GHz ':'5 GHz ') + M_lang['S_DEFAULT_WIRELESS']);
				}
			}
		}else{
			if(wps_mode5g == WPS_START){
				if(parseInt(status_data.remaintime5g) == 0 || parseInt(status_data.remaintime5g) >= 120){
					return;
				}
				$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','');
				$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_WPSCONNECTING1_STRING']+
				(120 - parseInt(status_data.remaintime5g))+M_lang['S_WPSCONNECTING2_STRING']);
			}
			else{
				$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','none'); 
				if(status_data.stopbyswitch5g && status_data.stopbyswitch5g == '1'){
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
						.text(((mode=='2g')?'2.4 GHz ':'5 GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSWITCH_STRING']);
				}
				else if(status_data.stopbyschedule5g && status_data.stopbyschedule5g == '1'){
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]')
						.text(((mode=='2g')?'2.4 GHz ':'5 GHz ') +M_lang['S_DEFAULT_WIRELESS']+ M_lang['S_STOPBYSCHEDULER_STRING']);
				}
				else{
					$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(((mode=='2g')?'2.4 GHz ':'5 GHz ') + M_lang['S_DEFAULT_WIRELESS']);
				}
			}
		}
	}
	else{
		$('#'+idval+' [sid=\"WLRULE_IMG\"]').css('display','none');
		if(configObj.ismain == '1'){
			$('#'+idval+' [sid=\"WLRULE_TITLE\"]').text(M_lang['S_DEFAULT_WIRELESS']);
		}
		if(configObj.run == '0'){$('#'+idval+' [sid=\"WLRULE_VALUE\"]').text(M_lang['S_DISABLED_STRING']);}
		else{$('#'+idval+' [sid=\"WLRULE_VALUE\"]').text(configObj.ssid);}
		var $flipSwitch = $('[sid=\"LISTDATA\"] [sid=\"'+(get_ruletype(idval).toUpperCase() + get_ruleindex(idval))+'_RUN_'+mode+'\"]').val(configObj.run).slider('refresh');
	}
}

function make_localConfigObj(mode, configObj, idx)
{
	var localConfigObj = new Object();
	switch(mode){
		case 'wlrule':	localConfigObj.wlrule = configObj;
		if(localConfigObj.wlrule.radiusserver && localConfigObj.wlrule.radiusserver == ''){localConfigObj.wlrule.radiusserver = '...';}
		if(localConfigObj.wlrule.uiidx == '0'){localConfigObj.wlrule.uiidx = idx;}
		break;
		default:
		localConfigObj.extendsetup = configObj;
		break;
	}
	return localConfigObj;
}

function get_localConfigObj(_idstr)
{
	if(!_idstr)	return null;
	var arr = _idstr.split('_');
	var mode = arr[2];
	switch(arr[0]){
		case 'wlrule':		
			//var mode = $('[sid="PAGE_MENU"] option:selected').val();
			if(mode && mode == '5g'){
				return make_localConfigObj(arr[0], config_data.bsslist_5g[parseInt(arr[1])], arr[1]);
			}
			else{
				return make_localConfigObj(arr[0], config_data.bsslist_2g[parseInt(arr[1])], arr[1]);
			}
			break;
		default:
			if(mode && mode == '5g'){
				return make_localConfigObj(arr[0], config_data.extendsetup5g);
			}
			else{
				return make_localConfigObj(arr[0], config_data.extendsetup2g);
			}
			break;
	}
}

function get_ruletype(_idstr)
{
	if(!_idstr)	return 'wlrule';
	else	return _idstr.split('_')[0];
}
function get_ruleindex(_idstr)
{
	if(!_idstr)	return 0;
	else	return parseInt(_idstr.split('_')[1]);
}
function get_rulemode(_idstr)
{
	if(!_idstr)	return '2g';
	else	return _idstr.split('_')[2];
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	else {
		if(flag){
			if(confirm_mode == 'wlrule' || confirm_mode == 'wlrule_onoff'){
				$('#loading').popup('open');
				iux_submit('wlrule',confirm_data, true, {'name':'category', 'value':get_category_val()});
			}
		}
		else{
			if(confirm_mode == 'wlrule_onoff'){
				iux_update_local();
			}
		}
	}
	confirm_data = null;	confirm_mode = null;
}

function loadLocalPage()
{
	if(error_code_local == 1 || error_code_local == 2 || error_code_local == 5){
		alert(M_lang['S_ERRORMSG_STRING'+error_code_local]);	return;
	}
	//pageview_select_update(loc);
	get_status_local();
	$('[sid=\"C_WANINFO_MACLIST\"]').attr('sid', 'L_WIRELESS_SEARCHLIST');
	$('[sid=\"S_POPUP_MACSELECT_TITLE_TEXT\"]').attr('sid', 'L_WIRELESS_TITLE');
}

function result_config(result)
{
	if(result){
		error_code_local = parseInt(config_data.errcode);
		iux_update_local();
		$('#loading').popup('close');
	}
}

function result_submit(service_name, result)
{
	if(result){
		if(service_name == 'wlrule'){
			if(tmp_config_data)	tmp_config_data = null;
			$('#right_panel').panel('close');
		}
		else if(service_name == 'extendsetup'){
			if(tmp_config_data)	tmp_config_data = null;
		}
	}
	else{
		alert(M_lang['S_DISCONNECTED_MSG']);
	}
}

function get_frequency_desc(ctl_ch, cent_ch)
{
	var desc = ctl_ch + ' [ ';
	var ghz = (get_category_val() == '5g')?5:2;

	if(ghz == 5)
		desc += '5.'+5*ctl_ch;
	else{
		if(ctl_ch == 14)	desc += '2.484';
		else			desc += '2.'+(407+5*ctl_ch);
	}
	desc += ' GHz';
	if(ctl_ch != cent_ch)	desc += ',' + ((ctl_ch < cent_ch)?M_lang['S_UPPERCHANNEL_STRING']:M_lang['S_LOWERCHANNEL_STRING']);
	desc += ' ]';
	return desc;
}

function update_channel_options(ruletype, country, bw, val, isauto)
{
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL\"]').find('option').remove();
	var ctl_arr = control_channel_arr[country + '_' + bw];
	var cent_arr = central_channel_arr[country + '_' + bw];
	var ctl_ch = parseInt(val.split('.')[0]);
	var cent_ch = parseInt(val.split('.')[1]);
	var optext = M_lang['S_AUTOCHANNEL_STRING'] + '(' + get_frequency_desc(ctl_ch, cent_ch) + ')';

	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL\"]').append('<option value=\"0\">'+optext+'</option>');
	
	for(var i in ctl_arr){
		optext = get_frequency_desc(ctl_arr[i], cent_arr[i]);
		$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL\"]').append('<option value=\"'+(ctl_arr[i] + '.' + cent_arr[i])+'\">'+optext+'</option>');
	}
	if(isauto == '1')	val = '0';
	$('[sid=\"C_'+ruletype.toUpperCase()+'_SELCHANNEL\"]').attr('value',val).val(val).selectmenu('refresh',true);
}

function onclick_searchlist(val)
{
	$('[sid=\"C_WLRULE_SELCHANNEL\"]').val(val).selectmenu('refresh').trigger('change');
	$('#list_popup').popup('close');
}

function get_search_data()
{
	$('[sid=\"L_WIRELESS_TITLE\"]').text(M_lang['S_CHANNELSEARCH_STRING']);
	$('[sid=\"L_WIRELESS_SEARCHLIST\"]').find('li').remove();
	$.ajaxSetup({async : true, timeout : 20000});	
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, category : get_category_val(),
			'act' : 'data', 'mode' : 'scan', 'bw' : config_data.wlrule.bandwidth, 'country':config_data.wlrule.country})
        .done(function(data){
		if(json_validate(data, '') == true){
			var resultList = data;
			var tmpList = resultList.channellist;
			var chanList = [];
			for(var i = 0; i < tmpList.length; i++){
				if(tmpList[i].isbestchan == '1'){chanList[0] = tmpList[i];}
			}
			for(var i = chanList.length, j = 0; j < tmpList.length; j++){
				if(tmpList[j].isbestchan != '1'){chanList[i] = tmpList[j]; i++;}
			}
			for(var i = 0; i < chanList.length; i++){
				$('[sid=\"L_WIRELESS_SEARCHLIST\"]').append(
					'<li class=\"lc_channel_li\"><a onclick=\"onclick_searchlist(\''+chanList[i].channel+'\');\">'+
					'<div class=\"lc_channelleft\"><div><p class=\"lc_channeltitle '+
					((chanList[i].isbestchan == '1')?'':'lc_grayfont_text')+'\">'+
					M_lang['S_CHANNEL_STRING'] + ' ' +chanList[i].idx +
					'</p></div></div><div class=\"lc_channelright\"><div class=\"lc_channelright_line\"><p'+
					((chanList[i].isbestchan == '1')?'':' class=\"lc_grayfont_text\"')+'>' +
					chanList[i].ghz + ((chanList[i].chanband != '')?(','+M_lang[chanList[i].chanband]):'') +
					((chanList[i].mhz != '')?(',' + chanList[i].mhz):'') +  
					((chanList[i].isbestchan == '1')?(' - ' + M_lang['S_BESTCHAN_STRING']):'') +
					'</p></div><div class=\"lc_channelright_line\">' + 
					'<p'+((chanList[i].isbestchan == '1')?'':' class=\"lc_grayfont_text\"')+'>' + 
					((chanList[i].ssidstr != '')?
					(M_lang['S_USINGAPLIST_STRING'] + '(' + chanList[i].numberofap + M_lang['S_USEAP_STRING'] + ') : ' + 
					chanList[i].ssidstr):M_lang['S_AVAILABLE_STRING']) + 
					'</p></div></div></a></li>'
				);
			}
		}
		$('#loading_msg').popup('close');
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').parent().css('width','30em').css('height','30em').css('overflow','auto')
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').listview('refresh');
		$("li>a").removeClass("ui-btn-icon-right");

		$("li>a:even").css("background-color","#FFFFFF");
		$("li>a:odd").css("background-color","#F9FAF5");
		$('[sid=\"L_WIRELESS_SEARCHLIST\"]').listview('refresh');

		$('[sid=\"L_WIRELESS_SEARCHLIST\"] a').each(function(){
			$(this).on("mousedown touchstart", function() {
                		$(this).addClass("animation_blink")
               		 	.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
        		                $(this).removeClass("animation_blink");
        		        });
	        	});
		});


		$('#list_popup').popup('open');
	})
	.fail(function(jqxhr, textStatus, error){
		$('#loading_msg').popup('close');
		alert(M_lang['S_SEARCHFAIL_STRING']);
	});
}

function get_channel_regulation_warning(regulation)
{
	if(regulation == '1'){
		var val = $('[sid=\"C_WLRULE_SELCHANNEL\"]').val();
		val = parseInt(val.split(',')[0]);
		if(val > 35 && val < 49){
			return true;
		}
	}
	return false;
}

function get_channel_data()
{
	//$('#loading').popup('open');
	$.ajaxSetup({async : true, timeout : 4000});
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, act : 'data', category : get_category_val(), mode : 'channel'})
        .done(function(data){
		if(json_validate(data, '') == true){
			control_channel_arr = new Array();	central_channel_arr = new Array();			
			var chanList = data.channellist;
			if(!chanList)	return;
			
			for(var i = 0; i < chanList.length; i++){
				for(var codeName in chanList[i]){
					var split_arr = codeName.split('_');
					if(split_arr[0] == 'control'){
						control_channel_arr[split_arr[1] + '_' + split_arr[2]] = new Array();
						for(var j = 0; j < (chanList[i])[codeName].length; j ++){
							control_channel_arr[split_arr[1] + '_' + split_arr[2]][j] 
								= parseInt((chanList[i])[codeName][j].value);
						}
					}
					else{
						central_channel_arr[split_arr[1] + '_' + split_arr[2]] = new Array();
						for(var j = 0; j < (chanList[i])[codeName].length; j ++){
							central_channel_arr[split_arr[1] + '_' + split_arr[2]][j]
							 	= parseInt((chanList[i])[codeName][j].value);
						}
					}
				}
			}
		}
		else{
			control_channel_arr = null;	central_channel_arr = null;
		}
		update_channel_options('wlrule', config_data.wlrule.country, config_data.wlrule.bandwidth
			, config_data.wlrule.channel, config_data.wlrule.autochannel);
		
 		setTimeout(function(){$('#loading').popup('close');},500);
	})
        .fail(function(jqxhr, textStatus, error) {
		$('#loading').popup('close');
		alert(M_lang['S_DISCONNECTED_MSG']);
        });
}

function get_extendsetup_data()
{
	$.ajaxSetup({async : true, timeout : 4000});
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, act : 'data', category : get_category_val(), mode : 'extendsetup'})
        .done(function(data){
		if(json_validate(data, '') == true){
			var ccode = data.countrycode;
			var mlist = data.modelist;
			var chans = data.channelwidths;
			var txbfs = data.txbfmumode;
			var muflag = data.muflag;
			var mant = data.mimoant;
			for(var i = 0; i < ccode.length; i++){
				$('[sid=\"C_EXTENDSETUP_COUNTRY\"]').append('<option value=\"'+ccode[i].value+'\">'
					+M_lang['S_LANG'+ccode[i].value+'_STRING']+'</option>');
			}
			for(var i = 0; i < mlist.length; i++){
				$('[sid=\"C_EXTENDSETUP_MODE\"]').append('<option value=\"'+mlist[i].value+'\">'
					+mlist[i].text+'</option>');
			}
			for(var i = 0; i < chans.length; i++){
				$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').append('<option value=\"'+chans[i].value+'\">'
					+((chans[i].value == '0')?M_lang['S_EXTAUTO_STRING']:chans[i].text)+'</option>');
			}
			if(txbfs){
				for(var i = 0; i < txbfs.length; i++){
					$('[sid=\"C_EXTENDSETUP_TXBFMUMODE\"]').append('<option value=\"'+txbfs[i].value+'\">'
						+txbfs[i].text+'</option>');
				}
			}
			if(muflag){
				for(var i = 0; i < muflag.length; i++){
					$('[sid=\"C_EXTENDSETUP_MUFLAG\"]').append('<option value=\"'+muflag[i].value+'\">'
						+muflag[i].text+'</option>');
				}
				if(get_category_val() === "2g")
					locking_obj('C_EXTENDSETUP_MUFLAG', 'disabled');
			}
			if(mant){
				for(var i = 0; i < mant.length; i++){
					$('[sid=\"C_EXTENDSETUP_MIMOANT\"]').append('<option value=\"'+mant[i].value+'\">'
						+mant[i].text+'</option>');
				}
			}
			$('[sid=\"C_EXTENDSETUP_COUNTRY\"]')
				.val(config_data.extendsetup.country)
				.selectmenu('refresh',true);
			$('[sid=\"C_EXTENDSETUP_MODE\"]')
				.val(config_data.extendsetup.mode)
				.selectmenu('refresh',true);
			$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]')
				.val(config_data.extendsetup.channelwidth)
				.selectmenu('refresh',true);

			var val = config_data.extendsetup.mode;
			$('[sid=\"C_EXTENDSETUP_MODE\"]').attr('value',val).val(val).selectmenu('refresh',true);
			val = config_data.extendsetup.country;
			$('[sid=\"C_EXTENDSETUP_COUNTRY\"]').attr('value',val).val(val).selectmenu('refresh',true);
			val = config_data.extendsetup.channelwidth;
			$('[sid=\"C_EXTENDSETUP_CHANNELWIDTH\"]').attr('value',val).val(val).selectmenu('refresh',true);
			if(txbfs){
				val = config_data.extendsetup.txbfmumode;
				$('[sid=\"C_EXTENDSETUP_TXBFMUMODE\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}
			if(muflag){
				val = config_data.extendsetup.muflag;
				$('[sid=\"C_EXTENDSETUP_MUFLAG\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}
			if(mant){
				val = config_data.extendsetup.mimoant;
				$('[sid=\"C_EXTENDSETUP_MIMOANT\"]').attr('value',val).val(val).selectmenu('refresh',true);
			}else{
				$('[sid=\"MIMOANT_BOX\"]').remove();
			}
			init_rightpanel_after('extendsetup');

			$('[sid="S_TEMP_TITLE"]').text(M_lang['S_EXTENDSETUP_STRING']);
			$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
			$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
			locking_obj('S_MODIFY_BTN', 'disabled');
		}
 		setTimeout(function(){$('#loading').popup('close');},500);
	})
        .fail(function(jqxhr, textStatus, error) {
		$('#loading').popup('close');
		alert(M_lang['S_DISCONNECTED_MSG']);
        });
}

//delete unsupported controls
function init_rightpanel_before(ruletype)
{
	if(ruletype == 'wlrule'){
		if(config_data.use_radius == '0'){
			$('[sid=\"ENTERPRISE_BOX\"]').remove();
			$('[sid=\"ENTERPRISECHECK_BOX\"]').remove();
		}
		if(config_data.use_qos == '0'){$('[sid=\"QOS_BOX\"]').remove();}
	}
	else if(ruletype == 'extendsetup'){
		if(config_data.use_dynchannel == '0'){$('[sid=\"DYN_BOX\"]').remove();}
		if(config_data.use_ldpc == '0'){$('[sid=\"LDPC_BOX\"]').remove();}
		if(config_data.use_stbc == '0'){$('[sid=\"STBC_BOX\"]').remove();}
		if(config_data.use_dfs == '0'){$('[sid=\"DFS_BOX\"]').remove();}
		if(config_data.use_phy == '0'){$('[sid=\"PHY_BOX\"]').remove();}
		if(config_data.use_lgtv == '0'){$('[sid=\"WPSNOTI_BOX\"]').remove();}
		if(config_data.use_txbfmumode == '0'){$('[sid=\"TXBFMUMODE_BOX\"]').remove();}
		if(config_data.use_muflag == '0'){$('[sid=\"MUFLAG_BOX\"]').remove();}
		if(config_data.use_mimoant == '0'){$('[sid=\"MIMOANT_BOX\"]').remove();}
	}
}

//view updates
function init_rightpanel_after(ruletype)
{
	if(ruletype == 'wlrule'){
		set_authview_by_personallist(ruletype, config_data.wlrule.personallist);
		set_authview_by_useenterprise(ruletype);
		set_initcheck_passview(ruletype);
	}
	else if(ruletype == 'extendsetup'){
		set_dyninput_by_slider(ruletype, config_data.extendsetup.dynchannel);
		$("#extendsetup div .lc_row:even").css("background-color","#FFFFFF");
		$("#extendsetup div .lc_row:odd").css("background-color","#F9FAF5");
	}
}
function sort_bsslist(wl_mode)
{
	if(wl_mode == '5g'){
		for(var j = 0; j < config_data.bsslist_5g.length; j++){
			if(!config_data.bsslist_5g[j].run)	continue;
			if(config_data.bsslist_5g[j].ismain == '0'){
				if(config_data.bsslist_5g[j].uiidx != (''+j)){
					var tmpObj = config_data.bsslist_5g[j];
					config_data.bsslist_5g[j] = config_data.bsslist_5g[parseInt(tmpObj.uiidx)];
					config_data.bsslist_5g[parseInt(tmpObj.uiidx)] = tmpObj;	tmpObj = null;
				}
			}
		}
	}
	else{
		for(var j = 0; j < config_data.bsslist_2g.length; j++){
			if(!config_data.bsslist_2g[j].run)	continue;
			if(config_data.bsslist_2g[j].ismain == '0'){
				if(config_data.bsslist_2g[j].uiidx != (''+j)){
					var tmpObj = config_data.bsslist_2g[j];
					config_data.bsslist_2g[j] = config_data.bsslist_2g[parseInt(tmpObj.uiidx)];
					config_data.bsslist_2g[parseInt(tmpObj.uiidx)] = tmpObj;	tmpObj = null;
				}
			}
		}
	}
}

//local utility functions end

//local functions start
iux_update_local_func['wlmain'] = function(identifier)
{
	if(identifier == 'C'){
		$('[sid="LISTDATA"]').remove();
		if(config_data.use_5g == '0'){
			$('[sid="5GLINE"]').remove();
		}else{
			$('[sid="5GLINE"].lc_wpssetup_div').css('border-bottom','0');
			if(!opened)	$('[sid="5GLINE"].lc_extendsetup_div').css('border-top','0');
			else		$('[sid="5GLINE"].lc_extendsetup_div').css('border-top','1px #CCC solid');
		}
		var bkidx = 0;
		
		/*list up rules*/
		if(config_data.use_5g == '1'){
			sort_bsslist('5g');
			append_main_line('wlrule',0,config_data.bsslist_5g[0].run,
				(config_data.bsslist_5g[0].personallist=='nouse' && config_data.bsslist_5g[0].useenterprise=='0'), '5g', bkidx++);
			update_bssid_line('wlrule_'+0+'_5g', config_data.bsslist_5g[0]);
			if(config_data.bsslist_5g[0].run == '0')locking_obj('S_WPS_BTN5G', 'disabled');
			else{					
				if(config_data.extendsetup5g.wpsmode && config_data.extendsetup5g.wpsmode == 'off') 
					locking_obj('S_WPS_BTN5G', 'disabled');
				else unlocking_obj('S_WPS_BTN5G', 'disabled');
			}
		}
		sort_bsslist('2g');
		append_main_line('wlrule',0,config_data.bsslist_2g[0].run,
			(config_data.bsslist_2g[0].personallist=='nouse' && config_data.bsslist_2g[0].useenterprise=='0'), '2g', bkidx++);
		update_bssid_line('wlrule_'+0+'_2g', config_data.bsslist_2g[0]);
		if(config_data.bsslist_2g[0].run == '0')locking_obj('S_WPS_BTN2G', 'disabled');
		else{					
			if(config_data.extendsetup2g.wpsmode && config_data.extendsetup2g.wpsmode == 'off') 
				locking_obj('S_WPS_BTN2G', 'disabled');
			else unlocking_obj('S_WPS_BTN2G', 'disabled');
		}

		var HTMLStr = ('<div sid=\"LISTDATA\" class=\"title_div lc_oneline_div '+((bkidx++%2)?'lc_greenbox_div':'lc_whitebox_div')+'\">');
		HTMLStr += ('<div class=\"lc_click_div\"><p style=\"padding-left:.5em;\" sid=\"S_SELECT_GUESTNETWORK\">'+M_lang["S_SELECT_GUESTNETWORK"]+'</p></div>');
		HTMLStr += ('<div class=\"lc_right_click_div\" style=\"padding-left:.3em;\"><p class=\"lc_line_centerside\">');
		HTMLStr += ('<img src=\"images/menu_list_'+((opened)?'opened':'closed')+'.png\" name=\"title_state\"></p></div>');
		HTMLStr += ('</div');
		$('#wl_listbox').append(HTMLStr).trigger('create');

		if(config_data.use_5g == '1'){
			for(var j = 1; j < config_data.bsslist_5g.length; j++,bkidx++){
				if(!config_data.bsslist_5g[j].run){bkidx--;	continue;}
				append_main_line('wlrule',j,config_data.bsslist_5g[j].run,
					(config_data.bsslist_5g[j].personallist=='nouse' && config_data.bsslist_5g[j].useenterprise=='0'), '5g', bkidx);
				update_bssid_line('wlrule_'+j+'_5g', config_data.bsslist_5g[j]);
			}
		}
		for(var j = 1; j < config_data.bsslist_2g.length; j++,bkidx++){
			if(!config_data.bsslist_2g[j].run){bkidx--;	continue;}
			append_main_line('wlrule',j,config_data.bsslist_2g[j].run,
				(config_data.bsslist_2g[j].personallist=='nouse' && config_data.bsslist_2g[j].useenterprise=='0'), '2g', bkidx);
			update_bssid_line('wlrule_'+j+'_2g', config_data.bsslist_2g[j]);
		}

		$('[sid=\"2GLINE\"] [sid=\"EXTENDSETUP_STRING\"]').text('2.4GHz ' + M_lang['S_EXTENDSETUP_STRING']);
		$('[sid=\"2GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('2.4GHz ' + M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"2GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
		$('[sid=\"5GLINE\"] [sid=\"EXTENDSETUP_STRING\"]').text('5GHz ' + M_lang['S_EXTENDSETUP_STRING']);
		$('[sid=\"5GLINE\"] [sid=\"WPSBTNTEXT_CONTENT\"]').text('5GHz ' + M_lang['S_WPSCONNECT_STRING']);
		$('[sid=\"5GLINE\"] [sid=\"WPSTEXT_CONTENT\"]').text('');
	}
	else if(identifier == 'D'){
		if(status_data && status_data.wps2g){
			if(!status_data.remaintime2g)	return;
			if(status_data.wps2g.status == 'WPS_STOP'){wps_mode2g = WPS_STOP;}
			else if(status_data.wps2g.status == 'WPS_START' || status_data.wps2g.status == 'WPS_PROCESSING'){wps_mode2g = WPS_START;}
			else if(status_data.wps2g.status == 'WPS_CONFIGURED'){wps_mode2g = WPS_CONFIGURED;}
			else{wps_mode2g = WPS_STOP;}
			update_bssid_line('wlrule_0_2g', null, identifier);
		}
		if(status_data && status_data.wps5g){
			if(!status_data.remaintime5g)	return;
			if(status_data.wps5g.status == 'WPS_STOP'){wps_mode5g = WPS_STOP;}
			else if(status_data.wps5g.status == 'WPS_START' || status_data.wps5g.status == 'WPS_PROCESSING'){wps_mode5g = WPS_START;}
			else if(status_data.wps5g.status == 'WPS_CONFIGURED'){wps_mode5g = WPS_CONFIGURED;}
			else{wps_mode5g = WPS_STOP;}
			update_bssid_line('wlrule_0_5g', null, identifier);
		}
	}
};

add_listener_local_func['wlmain'] = function(idval)
{
	wlrule_onoff_event_add();
	wps_button_event_add();
}

iux_update_local_func['wlrule'] = function(identifier)
{
	if(identifier == 'C'){
		if(config_data.wlrule.ismain == '1'){
			get_channel_data();
			$('[sid="S_TEMP_TITLE"]').text(get_category_text() + ' ' + M_lang['S_DEFAULT_WIRELESS']);
			$('[sid=\"QOS_BOX\"]').css('display','none');
			locking_obj('C_WLRULE_QOSENABLE','disabled');
			$('[sid=\"POLICY_BOX\"]').css('display','none');
			locking_obj('C_WLRULE_MBSSPOLICY','disabled');
		}else{
			locking_obj('C_WLRULE_SELCHANNEL','disabled');
			$('[sid=\"CHANNEL_BOX\"]').css('display','none');
			$('[sid="S_TEMP_TITLE"]').text(get_category_text() + ' ' + M_lang['S_SUB_WIRELESS'] + ' ' + config_data.wlrule.uiidx);
			$('[sid=\"QOS_BOX\"]').css('display','');
			$('[sid=\"POLICY_BOX\"]').css('display','');
		}
		if(config_data.wlrule.radiusport == '1812')
			$('[sid=\"L_WLRULE_RADIUSPORTCHECK\"]').removeAttr('checked').checkboxradio('refresh');
		else
			$('[sid=\"L_WLRULE_RADIUSPORTCHECK\"]').prop('checked', 'checked').checkboxradio('refresh');
		$('[sid="S_TEMP_TITLE"]').parent().addClass('lc_title_block');
		$('[sid="S_TEMP_TITLE"]').addClass('lc_title_textellipsis');
		init_rightpanel_after('wlrule');

		locking_obj('S_MODIFY_BTN', 'disabled');
	}
}

add_listener_local_func['wlrule'] = function(idval)
{
	basic_control_event_add('wlrule',idval);
}

submit_local_func['wlrule'] = function(localdata)
{
	if(!wlrule_validate('wlrule'))	return;
	if(!localdata){
		localdata = make_local_postdata('wlrule');
	}
	if(check_current_connmode() != 0){
		confirm_mode = 'wlrule';	confirm_data = localdata;
		confirm(M_lang[((config_data.wlrule.ismain == '1')?'S_DISCONNECTCONFIRM_STRING':'S_DISCONNECTCONFIRM2_STRING')]);	return;
	}
	if(config_data.wlrule.ismain == '1' && get_channel_regulation_warning(config_data.wlrule.rwarning)){
		confirm_mode = 'wlrule';	confirm_data = localdata;
		confirm(M_lang['S_REGULATION_WARNING']);	return;
	}
	$('#loading').popup('open');
	iux_submit('wlrule',localdata, true, {'name':'category', 'value':get_category_val()});
}

iux_update_local_func['extendsetup'] = function(identifier)
{
	if(identifier == 'C'){
		get_extendsetup_data();
	}
}

add_listener_local_func['extendsetup'] = function(idval)
{
	basic_control_event_add('extendsetup',idval);
}

submit_local_func['extendsetup'] = function(localdata)
{
	if(!extendsetup_validate())	return;
	$('#loading').popup('open');
	if(!localdata){
		localdata = make_local_postdata('extendsetup');
	}
	iux_submit('extendsetup',localdata, true, {'name':'category', 'value':get_category_val()});
}
//local functions end
$(document).on("panelbeforeclose", "#right_panel", function(){
	if(tmp_config_data){config_data = tmp_config_data;	tmp_config_data = null;}	//iux_update_local();
});

$(document).ready(function() {
	window.tmenu = "wirelessconf";
	window.smenu = "basicsetup";
	
	/*loc = get_parameter('mode');
        if(!loc)        loc = '';
        if(loc != '2g' && loc != '5g')       loc = '';*/

	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null/*{name : 'category', value : loc}*/, 60000, true);
	events.off("panelbeforeopen");
	events.off('load_header_ended_local');
	events.on('load_header_ended_local', function(menuname){
		iux_update("C");	iux_update("S");
		if(!is_loading_panel)
 			setTimeout(function(){$('#loading').popup('close');},500);
	});
});

function get_status_local()
{
        $.ajaxSetup({async : true, timeout : 4000});
        var _data = [];
        _data.push({name : "tmenu", value : window.tmenu});
        _data.push({name : "smenu", value : window.smenu});
        _data.push({name : "act", value : "status"});
        //_data.push({name : "category", value : get_category_val()});
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data) {
                if(json_validate(data, '') == true)
                        status_data = data;
                iux_update("D");
        })
        .fail(function(jqxhr, textStatus, error) {
        }).always(function(){
 		setTimeout(function(){get_status_local();},1000);
	});
}

function iux_set_onclick_local()
{
	$('[sid="LISTDATA"] [href=\"#right_panel\"]').each(function(){
		var idval = $(this).attr('id');
		$(this).unbind('click').on('click', function(){
			if(tmp_config_data){return;}
			$('#loading').popup('open');
			load_rightpanel(idval);
		});
	});
	$('[sid="LISTDATA"]').on("mousedown touchstart", function() {
		current_selected_mode = get_rulemode($(this).attr('id'));
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('[sid="EXTENDSETUP"]').each(function(){
		var idval = $(this).attr('id');
		if(error_code_local != 0 && error_code_local != 6){$(this).attr('href','#');}
		else{$(this).attr('href','#right_panel');}
		$(this).unbind('click').on('click', function(){
			if(error_code_local != 0 && error_code_local != 6){	alert(M_lang['S_ERRORMSG_STRING'+error_code_local]);}
			else{
				$('#loading').popup('open');
				load_rightpanel(idval);
			}
		});
	}).on("mousedown touchstart", function() {
		current_selected_mode = get_rulemode($(this).attr('id'));
		$(this).children().addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});

	$(".title_div").unbind('click').on("click", function()
        {
                $('.hide, .show').toggleClass( "hide" ).toggleClass( "show" );
                toggleImage( $(this).find("img[name='title_state']"));
		if(config_data.use_5g == '1'){
			if(!opened)	$('[sid="5GLINE"].lc_extendsetup_div').css('border-top','0');
			else		$('[sid="5GLINE"].lc_extendsetup_div').css('border-top','1px #CCC solid');
		}else{
			if(!opened)	$('[sid="2GLINE"].lc_extendsetup_div').css('border-top','0');
			else		$('[sid="2GLINE"].lc_extendsetup_div').css('border-top','1px #CCC solid');
		}
        });
}

function iux_update_local(identifier)
{
	if(!identifier || identifier == 'D'){	//list update
		if(!identifier){
			iux_update_local_func['wlmain'].call(this, 'C');	listener_add_local('wlmain', null);
			iux_set_onclick_local();
		}else{
			iux_update_local_func['wlmain'].call(this, identifier);
		}
	}
	else{
		if(identifier == 'C'){
			for(var articleName in config_data){
				if(config_data.hasOwnProperty(articleName) && articleName != ''){
					var caller_func = iux_update_local_func[articleName];
					if(caller_func){
						caller_func.call(this, identifier);
					}
				}
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
	submit_local_func[rule_type].call(this, localdata);
}

function load_rightpanel(_idvalue)
{
	var ruletype = get_ruletype(_idvalue);
	current_selected_mode = get_rulemode(_idvalue);
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+ruletype+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				init_rightpanel_before(ruletype);
				//if(ruletype == 'wlrule'){
					tmp_config_data = config_data;
					config_data = get_localConfigObj(_idvalue);
				//}
				if(_idvalue == 'wlrule_0_2g' || _idvalue == 'wlrule_0_5g' || _idvalue == 'extendsetup_0_2g' || _idvalue == 'extendsetup_0_5g')
					is_loading_panel = true;
				else	is_loading_panel = false;
				load_header(RIGHT_HEADER, 'TEMP');
				listener_add_local(ruletype, _idvalue);
			}
		}
	);
}

