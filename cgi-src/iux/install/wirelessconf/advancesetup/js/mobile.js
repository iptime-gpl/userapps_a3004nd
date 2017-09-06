//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_hex = /[0-9a-fA-F]{64}/

var current_mode = null;
var confirm_mode = null;
var confirm_data = null;
var error_code_local = null;
var data_local = null;
var local_panelclose = true;
var status_control = true;
//local-global variables end

//local utility functions
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

function StrLenUTF8CharCode(val)
{
        var len=0, i=0;

        for(i=0;val.charCodeAt(i);i++)
                len+=ByteLenUTF8CharCode(val.charCodeAt(i));
        return len;
}

function make_macstr()
{
	var retstr = '';
	for(var i = 0; i < 5; i ++){
		retstr += $('[sid=\"C_ADVANCESETUP_MAC\"] [sid=\"VALUE'+i+'\"]').val();
		if(retstr != '')
			retstr += '-';
	}
	retstr += $('[sid=\"C_ADVANCESETUP_MAC\"] [sid=\"VALUE5\"]').val();
	
	return retstr;
}

function submit_button_event_add(rule_type)
{
	$('[sid="S_MODIFY_BTN"]').unbind('click').click(function(){
		submit_local(rule_type, make_local_postdata());
	});
}

function make_local_postdata()
{
	localdata = [];
	localdata.push({'name':'wlmode', 'value' : get_category_val()});
	if($('[sid=\"C_ADVANCESETUP_MODE\"]').val() == 'wds'){
		localdata.push({'name':'mac', 'value' : make_macstr()});
	}
	return localdata;
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
	var category_val = '2g';
	if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"]').val();}
	return category_val;
}

function get_other_category_text()
{
	var category_val = '2.4GHz';
	if($('[sid="PAGE_MENU"]').val()){category_val = $('[sid="PAGE_MENU"] :selected').text();}
	if(category_val == '2.4GHz')	category_val = '5GHz';
	else				category_val = '2.4GHz';
	return category_val;
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
	//var menuval = get_category_val();
	var connmode = get_current_connmode();

	//if(menuval == '2g')		menuval = 2;
	//else if(menuval == '5g')	menuval = 5;
	//else	return 0;

	//if(menuval == connmode)		return 1;
	if(connmode != 0)	return 1;

	return 0;
}

function get_current_connmode()
{
	if(config_data.connmode && config_data.connmode != '0'){return parseInt(config_data.connmode);}
	return 0;
}

function advancesetup_validate()
{
	var val = '';
	var slen;
	
	if(error_code_local == 1 || error_code_local == 2 || error_code_local == 3){
		alert(M_lang['S_APSTATUS_ERRORCODE'+error_code_local]);	return false;
	}
	val = $('[sid=\"C_ADVANCESETUP_MODE\"]').val();
	if(val == 'nouse'){
	}
	else if(val == 'wds'){
		if(error_code_local == 4 || error_code_local == 5){
			alert(M_lang['S_APSTATUS_ERRORCODE'+error_code_local]);	return false;
		}
		//val = $('[sid=\"C_ADVANCESETUP_WDSSSID\"]').val();
		//if(val == ''){
		//	alert(M_lang['S_SSID_BLANKED']);	return false;
		//}
		if((slen = StrLenUTF8CharCode(val)) > 32){
			alert(M_lang['S_SSID_OVERFLOW'] + slen + 'bytes');	return false;
		}
		val = make_macstr();
		if(!validate_string(val, regExp_mac, 'match')){
			alert(M_lang['S_MAC_INVALID']);	return false;
		}
	}
	else{
		if(val == 'wwan'){
			if(config_data.otherwwan == '1'){
				alert(get_other_category_text() + M_lang['S_OTHERWWAN_ALERT1'] + get_other_category_text() + M_lang['S_OTHERWWAN_ALERT2']);	
				return false;
			}
		}
		val = $('[sid=\"C_ADVANCESETUP_SSID\"]').val();
		if(val == ''){
			alert(M_lang['S_SSID_BLANKED']);	return false;
		}
		if((slen = StrLenUTF8CharCode(val)) > 32){
			alert(M_lang['S_SSID_OVERFLOW'] + slen + 'bytes');	return false;
		}
		val = $('[sid=\"C_ADVANCESETUP_PERSONALLIST\"]').val();
		if(val != 'nouse'){
			val = $('[sid=\"C_ADVANCESETUP_PASSWORD\"]').val();
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
	return true;
}

function set_passview_by_auth(val)
{
	if(val == 'nouse'){$('[sid=\"PASSWORD_FIELD\"]').css('display','none');}
	else{$('[sid=\"PASSWORD_FIELD\"]').css('display','');}
	$('[sid=\"C_ADVANCESETUP_PERSONALLIST\"]').val(val).selectmenu('refresh','true');
}

function set_formview_by_mode(val)
{
	if(val == 'nouse'){
		$('[sid=\"MBRIDGE_FIELD\"]').css('display','none');
		$('[sid=\"WDS_FIELD\"]').css('display','none');
		$('[sid=\"PASSWORD_FIELD\"]').css('display','none');
		locking_obj('C_ADVANCESETUP_SSID','disabled');
		locking_obj('C_ADVANCESETUP_WDSSSID','disabled');
		locking_obj('C_ADVANCESETUP_PERSONALLIST','disabled');
		locking_obj('C_ADVANCESETUP_PASSWORD','disabled');
		locking_obj('L_ADVANCESETUP_PASSVIEW','disabled');
		locking_obj('C_ADVANCESETUP_MAC\"] [sid^=\"VALUE','disabled');
	}
	else if(val == 'wds'){
		$('[sid=\"MBRIDGE_FIELD\"]').css('display','none');
		$('[sid=\"WDS_FIELD\"]').css('display','');
		$('[sid=\"PASSWORD_FIELD\"]').css('display','none');
		unlocking_obj('C_ADVANCESETUP_WDSSSID','disabled');
		locking_obj('C_ADVANCESETUP_SSID','disabled');
		locking_obj('C_ADVANCESETUP_PERSONALLIST','disabled');
		locking_obj('C_ADVANCESETUP_PASSWORD','disabled');
		locking_obj('L_ADVANCESETUP_PASSVIEW','disabled');
		unlocking_obj('C_ADVANCESETUP_MAC\"] [sid^=\"VALUE','disabled');
	}
	else{
		$('[sid=\"MBRIDGE_FIELD\"]').css('display','');
		$('[sid=\"WDS_FIELD\"]').css('display','none');
		$('[sid=\"PASSWORD_FIELD\"]').css('display','');
		locking_obj('C_ADVANCESETUP_WDSSSID','disabled');
		unlocking_obj('C_ADVANCESETUP_SSID','disabled');
		unlocking_obj('C_ADVANCESETUP_PERSONALLIST','disabled');
		unlocking_obj('C_ADVANCESETUP_PASSWORD','disabled');
		unlocking_obj('L_ADVANCESETUP_PASSVIEW','disabled');
		locking_obj('C_ADVANCESETUP_MAC\"] [sid^=\"VALUE','disabled');
		set_passview_by_auth($('[sid=\"C_ADVANCESETUP_PERSONALLIST\"]').val());
	}
	$('[sid=\"C_ADVANCESETUP_MODE\"]').val(val).selectmenu('refresh','true');
}

function set_passview_by_passview(checked)
{
	if(checked){$('[sid=\"C_ADVANCESETUP_PASSWORD\"]').attr('type','text');}
	else{$('[sid=\"C_ADVANCESETUP_PASSWORD\"]').attr('type','password');}
}

function check_change_value_local()
{
	if( $("#right_panel").hasClass("ui-panel-open") )
		return false;

	if(config_data.advancesetup.mac != make_macstr())	return true;
	else							return false;
	
	return false;
}

function basic_control_event_add(ruletype)
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

	$('[sid=\"C_ADVANCESETUP_MODE\"]').unbind('change').change(function(){
		var val = $(this).val();
		set_formview_by_mode(val);
		footerbtn_view_control();
	}).trigger('change');
	$('[sid=\"C_ADVANCESETUP_PERSONALLIST\"]').unbind('change').change(function(){
		var val = $(this).val();
		set_passview_by_auth(val);
		footerbtn_view_control();
	});
	$('[sid=\"C_ADVANCESETUP_MAC\"] [sid^=\"VALUE\"]').unbind('keyup').keyup(function(event){
		value_list = $('[sid=\"C_ADVANCESETUP_MAC\"] [sid^=\"VALUE\"]');
		if($(this).val().length == $(this).attr('maxlength') && event.keyCode > 46 && $(this).attr('maxlength') <= 3)
                {
                        if(value_list.length == value_list.index(this) + 1);
                        else	value_list.eq(value_list.index(this) + 1).focus().select();
                }
		footerbtn_view_control();
	});
	$('[sid=\"L_ADVANCESETUP_PASSVIEW\"]').unbind('change').change(function(){
		var val = $(this).is(':checked');
		set_passview_by_passview(val);
	}).trigger('change');
	$('[sid=\"L_SEARCH_BTN\"]').unbind('click').click(function(){
		if(error_code_local == 2 || error_code_local == 4){
			alert(M_lang['S_APSTATUS_ERRORCODE'+error_code_local]);	return;
		}
		$('[sid=\"L_CUSTOM_MSG1\"]').text(M_lang['S_NOW_SEARCH1']);
		$('[sid=\"L_CUSTOM_MSG2\"]').text(M_lang['S_NOW_SEARCH2']);
		$('#loading_msg').popup('open');
		get_apsearch_data();
	});
	submit_button_event_add(ruletype);
}

function pageview_select_update()
{
	if(config_data.use_5g != '0'){
		$('[sid="PAGE_MENU"]').remove();
		$('[sid="S_PAGE_TITLE"]').parent().prepend('<select sid=\"PAGE_MENU\"></select>');
		$('[sid="PAGE_MENU"]').append('<option value=\"5g\" selected>5GHz</option>');
		$('[sid="PAGE_MENU"]').append('<option value=\"2g\">2.4GHz</option>');
		$('[sid="PAGE_MENU"]').css('display','inline-block').css('float','left').css('margin-left','0.5em').css('width','7em');
		$('[sid="PAGE_MENU"]').change(function(){
			$('#loading').popup('open');
			get_config(window.tmenu, window.smenu, {name : 'category', value : $(this).val()});
			//error_code_local = parseInt(config_data.errcode);
			//iux_update('C');	listener_add_local('advancesetup');
			//$('#loading').popup('close');
		});
	}
	$('.cc_rightheader_div').remove();
	$('.cc_leftheader_div').css('width','100%');
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	else {
		if(flag){
			if(confirm_mode == 'wds_channelclick'){
			}
			else if(confirm_mode == 'advancesetup'){
			}
		}
	}
	confirm_data = null;	confirm_mode = null;
}

function loadLocalPage()
{
	pageview_select_update();
	get_status_local();
}

function result_config(result)
{
	if(result){
		error_code_local = parseInt(config_data.errcode);
                iux_update('C');
		listener_add_local('advancesetup');
                $('#loading').popup('close');
        }
}

function result_submit(service_name, result)
{
	if(service_name == 'advancesetup'){
		if(result){
			status_control = true;
			//iux_update('C');
		}
	}
}

function get_apsearch_data()
{
	data_local = null;
	$.ajaxSetup({async : true, timeout:30000});
	$.getJSON('/cgi/iux_get.cgi', { tmenu : window.tmenu,smenu : window.smenu, act : 'data', category : get_category_val(),
		mode : $('[sid=\"C_ADVANCESETUP_MODE\"]').val()})
        .done(function(data){
		if(json_validate(data, '') == true){
			data_local = data;
			//$('#loading_msg').popup('close');
			//$('#right_panel').panel('open');
			load_rightpanel();
		}
	}).fail(function(){
		$('#loading_msg').popup('close');
		alert(M_lang['S_WIRELESS_COMMONERROR']);	return;
	});
}

function onclick_searchlist(dataidx)
{
	if(data_local){
		var dataObj = data_local.aplist[dataidx];
		if(dataObj){
			if(dataObj.auth == 'WPA2-ENTERPRISE' || dataObj.auth == 'WPA-ENTERPRISE' || dataObj.auth == 'WEP' || dataObj.auth == 'UNKNOWN'){
				alert(M_lang['S_UNSUPPORTED_STRING']);	return;
			}
			if($('[sid=\"C_ADVANCESETUP_MODE\"]').val() == 'wds'){
				if(dataObj.channelcomp == '1'){
					confirm_mode = 'wds_channelclick';	confirm_data = dataObj;
					events.confirm({ msg: M_lang['S_WDS_CHANNELDIFF'], runFunc: function( flag) {
						if(confirm_mode == 'wds_channelclick' && flag){
						$('[sid=\"C_ADVANCESETUP_WDSSSID\"]').val(confirm_data.essid);
						var macaddr = confirm_data.mac.split('-');
						for(var i = 0; i < 6; i ++){
							$('[sid=\"C_ADVANCESETUP_MAC\"] [sid=\"VALUE'+i+'\"]').val(macaddr[i]);
						}
						//footerbtn_view_control();
						$('#right_panel').panel('close');
						}
					}});	return;
				}
				$('[sid=\"C_ADVANCESETUP_WDSSSID\"]').val(dataObj.essid);
				var macaddr = dataObj.mac.split('-');
				for(var i = 0; i < 6; i ++){
					$('[sid=\"C_ADVANCESETUP_MAC\"] [sid=\"VALUE'+i+'\"]').val(macaddr[i]);
				}
			}
			else{
				$('[sid=\"C_ADVANCESETUP_SSID\"]').val(dataObj.essid);
				var authval = 'nouse';
				if(dataObj.authencval){
					authval = dataObj.authencval;
				}
				$('[sid=\"C_ADVANCESETUP_PERSONALLIST\"]').val(authval).selectmenu('refresh','true').trigger('change');
				unlocking_obj('S_MODIFY_BTN', 'disabled');
			}
			//footerbtn_view_control();
		}
		$('#right_panel').panel('close');
	}
}
//local utility functions end

//local functions start
iux_update_local_func['advancesetup'] = function(identifier)
{
	var statusobj = null;

	if(identifier == 'C'){
		if(config_data.apstatus){statusobj = config_data.apstatus;}
		locking_obj('S_MODIFY_BTN', 'disabled');
	}
	else if(identifier == 'D'){
		if(status_data.apstatus){statusobj = status_data.apstatus;}
	}
	if(statusobj){
		var statusstr = M_lang['S_APSTATUS_'+statusobj.status];
		if(error_code_local == 1 || error_code_local == 2 || error_code_local == 3){
			statusstr = M_lang['S_APSTATUS_ERRORCODE'+error_code_local];
			$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr).addClass('lc_opacity30');
			$('[sid=\"ADVANCESETUP_IMG\"]').addClass('lc_opacity30');
			$('[sid=\"ADVANCESETUP_SSID\"]').addClass('lc_opacity30');
		}
		else{
			if(statusobj.status == 'WWAN' || statusobj.status == 'MBRIDGE'){
				if(statusobj.power != '-1'){
					statusstr = statusstr + '(' + M_lang['S_RECVPOWER_STRING'] + statusobj.power + '%)';
				}
				$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr).removeClass('lc_opacity30');
				$('[sid=\"ADVANCESETUP_IMG\"]').removeClass('lc_opacity30');
				$('[sid=\"ADVANCESETUP_SSID\"]').removeClass('lc_opacity30');
			}else if(statusobj.status == 'WDSCONFIGURED'){
				if(error_code_local == 4 || error_code_local == 5){
					statusstr = M_lang['S_APSTATUS_ERRORCODE'+error_code_local];
					$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr).addClass('lc_opacity30');
					$('[sid=\"ADVANCESETUP_IMG\"]').addClass('lc_opacity30');
					$('[sid=\"ADVANCESETUP_SSID\"]').addClass('lc_opacity30');
				}else{
					$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr).removeClass('lc_opacity30');
					$('[sid=\"ADVANCESETUP_IMG\"]').removeClass('lc_opacity30');
					$('[sid=\"ADVANCESETUP_SSID\"]').removeClass('lc_opacity30');
				}
			}else{
				$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr).removeClass('lc_opacity30');
				$('[sid=\"ADVANCESETUP_IMG\"]').removeClass('lc_opacity30');
				$('[sid=\"ADVANCESETUP_SSID\"]').removeClass('lc_opacity30');
			}
		}
		if(identifier == 'C'){
			$('select[sid="C_ADVANCESETUP_MODE"] option').each(function(index) {
				if($(this).val() === 'nouse')
					return;
				for(var i = 0; i < config_data.mode.length; ++i)
					if($(this).val() === config_data.mode[i])
						return;
				$(this).remove();
			});
			if(config_data.advancesetup.mode == 'nouse'){
				$('[sid=\"ADVANCESETUP_SSID\"]').text(M_lang['S_APSSID_STOPPED']);
				$('.lc_mainline_left').css('width','75%');
				$('.lc_mainline_right').css('width','25%');
				$('[sid=\"ADVANCESETUP_STATUS\"]').text('');
			}else{
				if(config_data.advancesetup.mode == 'wds'){
					if(config_data.advancesetup.wdsssid == ' ')
						$('[sid=\"ADVANCESETUP_SSID\"]').text(M_lang['S_BLANK_ESSID']);
					else
						$('[sid=\"ADVANCESETUP_SSID\"]').text(config_data.advancesetup.wdsssid);
				}else{
					$('[sid=\"ADVANCESETUP_SSID\"]').text(statusobj.ssid);
				}
				$('.lc_mainline_left').css('width','');
				$('.lc_mainline_right').css('width','');
				$('[sid=\"ADVANCESETUP_STATUS\"]').text(statusstr);
			}
		}
	}
}

add_listener_local_func['advancesetup'] = function()
{
	basic_control_event_add('advancesetup');
}

submit_local_func['advancesetup'] = function(localdata)
{
	if(!advancesetup_validate())	return;
	if(check_current_connmode() != 0){
		confirm_mode = 'advancesetup';	confirm_data = localdata;
		events.confirm({ msg: M_lang['S_DISCONNECTCONFIRM_STRING'], runFunc: function(flag) {
			if(confirm_mode == 'advancesetup' && flag){
				$('#loading').popup('open');
				iux_submit('advancesetup',confirm_data, true,{'name':'category', 'value':get_category_val()});
			}
		}});	return;
	}
	$('#loading').popup('open');
	status_control = false;
	iux_submit('advancesetup',localdata, true,{'name':'category', 'value':get_category_val()});
}

iux_update_local_func['chanlist'] = function()
{
	if(data_local != null){
		$('[sid=\"S_TEMP_TITLE\"]').text(M_lang['S_APSEARCH_HEADER']);
		$('[sid=\"L_SEARCHLIST\"]').find('li').remove();
		
		var mode = $('[sid=\"C_ADVANCESETUP_MODE\"]').val();
		for(var i = 0; i < data_local.aplist.length; i++){
			if(typeof data_local.aplist[i].essid != 'undefined'){
			var postfix_val = parseInt(((data_local.aplist[i].power != '')?data_local.aplist[i].power:'0'));
			if(postfix_val >= 75)	postfix_val = 100;
			else if(postfix_val < 75 && postfix_val >= 50) postfix_val = 75;
			else if(postfix_val < 50 && postfix_val >= 25) postfix_val = 50;
			else	postfix_val = 0;
			//if(mode != 'wds' && data_local.aplist[i].essid == '')	continue;
			$('[sid=\"L_SEARCHLIST\"]').append(
				'<li>' + '<a class=\"lc_panel_a\" onclick=\"onclick_searchlist(\''+i+'\')\">' +
				'<div class=\"lc_panelline\">' + 
				'<div class=\"lc_panelline_left\">' + 
				'<img src=\"images/wifi_'+postfix_val+'.png\">' +
				'</div>' +
				'<div class=\"lc_panelline_right\">' + 
				'<div class=\"lc_panelsub_line\">' + 
				'<div class=\"lc_panelsub_left\">' + '<span>' +
				((data_local.aplist[i].essid!='')?data_local.aplist[i].essid:M_lang['S_BLANK_ESSID']) + 
				'</span></div>' +
				'<div class=\"lc_panelsub_right\"><span>' +
				((data_local.aplist[i].configured == '1')?M_lang['S_APSTATUS_'+data_local.aplist[i].status]:'') +
				((data_local.aplist[i].status == 'WDSCONFIGURED'&&data_local.aplist[i].channelcomp=='1')?M_lang['S_APSTATUS_WDSCHANERR']:'') + 
				'</span></div></div>' + 
				'<div class=\"lc_panelsub_line\">' + 
				'<div class=\"lc_panelsub_left\">' + '<span class=\"lc_disabled_text\">' + data_local.aplist[i].mac + '</span></div>' +
				'<div class=\"lc_panelsub_right\"><span class=\"lc_disabled_text\">'+
				((data_local.aplist[i].channel=='' && data_local.aplist[i].power=='')?(M_lang['S_NOSEARCHED_STRING']):
				(((data_local.aplist[i].auth == 'UNKNOWN')?M_lang['S_AUTHMISC_STRING']:data_local.aplist[i].auth) + '/' +  
				M_lang['S_CHANNEL_STRING'] + data_local.aplist[i].channel + '/' + data_local.aplist[i].power + '%')) +
				'</span></div>' +
				'</div></div></div>' + 
				'</a></li>'
			);
			}
		}

		$('li>a').on("mousedown touchstart", function() {
			$(this).addClass("animation_blink")
			.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
				$(this).removeClass("animation_blink");
			});
		});
                $("li>a:even").css("background-color","#FFFFFF");
                $("li>a:odd").css("background-color","#F9FAF5");
		$('[sid=\"L_SEARCHLIST\"]').listview('refresh');
		$("li>a").removeClass("ui-btn-icon-right");
		$('[sid=\"L_SEARCHLIST\"]').listview('refresh');
	}
}
//local functions end
$(document).on('panelclose', '#right_panel', function(){
	$('[sid=\"L_SEARCHLIST\"]').find('li').remove();
});

$(document).ready(function() {
	window.tmenu = "wirelessconf";
	window.smenu = "advancesetup";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null , 60000 ,true);
	events.off("panelbeforeopen");
	events.off('load_header_ended_local');
	events.on('load_header_ended_local', function(menuname){
		iux_update_local_func['chanlist'].call();
		$('#right_panel').panel('open');
 		setTimeout(function(){$('#loading_msg').popup('close');},500);
	});
	/*error_code_local = parseInt(config_data.errcode);
	pageview_select_update();	iux_update('C');
	listener_add_local('advancesetup');
	get_status_local();*/
	//$(document).off('panelbeforeclose', '#right_panel');
	$(document).on("panelbeforeopen", "#right_panel", function () {
		$('.ui-page').css("overflow","hidden");
//        	$('.ui-page').css("position","fixed");
        	$('#right_panel').css("overflow","auto");
        	$('#right_panel').css("position","fixed");
	});

	$(document).on("panelbeforeclose", "#right_panel", function () {
		$('.ui-page').css("overflow","auto");
        	$('.ui-page').css("position","relative");
	});

});

function get_status_local()
{
        $.ajaxSetup({async : true, timeout : 4000});
        var _data = [];
        _data.push({name : "tmenu", value : window.tmenu});
        _data.push({name : "smenu", value : window.smenu});
        _data.push({name : "act", value : "status"});
        _data.push({name : "category", value : get_category_val()});
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data) {
                if(json_validate(data, '') == true){
                        status_data = data;
			if(status_control)
                		iux_update("D");
		}
        })
        .fail(function(jqxhr, textStatus, error) {
        }).always(function(){
 		setTimeout(function(){get_status_local();},3000);
	});
}

function iux_update_local(identifier)
{
	//if(identifier == 'C'){
	for(var articleName in config_data){
		if(config_data.hasOwnProperty(articleName) && articleName != ''){
			var caller_func = iux_update_local_func[articleName];
			if(caller_func){
				caller_func.call(this, identifier);
			}
		}
	}
	//}
}

function listener_add_local(ruletype)
{
	add_listener_local_func[ruletype].call(this);
}

function submit_local(rule_type, localdata)
{
	submit_local_func[rule_type].call(this, localdata);
}

function load_rightpanel()
{
	$.ajaxSetup({ async : true, timeout:20000});
	$("#right_content").load(
		'html/chanlist.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				load_header(RIGHT_HEADER, 'TEMP');
			}
		}
	);
}

