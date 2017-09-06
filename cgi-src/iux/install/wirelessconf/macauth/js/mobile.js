//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var clicked_mac = null;
var clicked_bg = null;
var clicked_desc = null;
var confirm_mode = null;
var confirm_data = null;
var error_code_local = null;
var selected_bssobj = null
var old_status_data = null;
var delmac_data = null;

var ended_actname;
//local-global variables end

//local utility functions
function make_macstr()
{
	var retstr = '';
	for(var i = 0; i < 5; i ++){
		retstr += $('[sid=\"L_MACAUTH_MACADDR\"] [sid=\"VALUE'+i+'\"]').val();
		if(retstr != '')
			retstr += ':';
	}
	retstr += $('[sid=\"L_MACAUTH_MACADDR\"] [sid=\"VALUE5\"]').val();
	
	return retstr;
}

function make_local_postdata(acttype, val)
{
	localdata = [];

	if(!acttype || !selected_bssobj)	return null;
	localdata.push({'name':'mode', 'value':acttype});
	localdata.push({'name':'wlmode', 'value':selected_bssobj.wlmode});
	localdata.push({'name':'idx', 'value':selected_bssobj.idx});
	switch(acttype){
		case 'policy':
			localdata.push({'name':'policy', 'value':val});
			break;
		case 'register':
			localdata.push({'name':'mac', 'value':make_macstr()});
			localdata.push({'name':'desc', 'value':$('[sid=\"L_MACAUTH_DESCRIPTION\"]').val()});
			break;	
		case 'unregister':
			$('[sid=\"L_DELMAC_CHECK\"]').each(function(){
				if($(this).is(':checked'))
					localdata.push({'name':'delmaccheck', 'value':$(this).val()});
			});
			break;
	}

	return localdata;
}

function validate_string(str, regExp, type)
{
	if(type == 'unpermitted'){if(str.match(regExp))	return false;}
	else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
	return true;
}

function addmac_validate()
{
	var val = '';
	
	val = make_macstr();
	if(!validate_string(val, regExp_mac, 'match')){
		alert(M_lang['S_MAC_INVALID']);	return false;
	}
	val = $('[sid=\"L_MACAUTH_DESCRIPTION\"]').val();
	if(!validate_string(val, regExp_spchar, 'unpermitted')){
		alert(M_lang['S_DESC_INVALID']);	return false;
	}
	return true;
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	else {
		if(flag){
			if(confirm_mode == 'policy'){
				submit_local('macauth', make_local_postdata('policy',confirm_data));
			}
			else if(confirm_mode == 'delmac'){
				submit_local('delmac', make_local_postdata('unregister'));
			}
			else if(confirm_mode == 'addmac'){
				submit_local('addmac', make_local_postdata('register'));
			}
		}else{
			if(confirm_mode == 'policy'){
				iux_update_local();
			}
		}
	}
	confirm_data = null;	confirm_mode = null;
}

function loadLocalPage()
{
	get_status_local();
}

function result_config(result)
{
	if(result){
                error_code_local = parseInt(config_data.errcode);
		iux_update_local();
        }
}

function result_submit(service_name, result)
{
	if(service_name == 'macauth'){
		if(result){
			$('#right_panel').panel('close');
			//iux_update_local();
		}
	}
}

function get_macdb_data()
{
	$.ajaxSetup({async : true, timeout:30000});
        var _data = [];
        _data.push({name : "tmenu", value : window.tmenu});
        _data.push({name : "smenu", value : window.smenu});
        _data.push({name : "act", value : "data"});
        _data.push({name : "wlmode", value : selected_bssobj.wlmode});
        _data.push({name : "idx", value : selected_bssobj.idx});
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data){
		if(json_validate(data, '') == true){
			delmac_data = data;
			load_rightpanel('delmac');
		}
	});
}

function convert_guestnet_str(cobj)
{
	var retstr = '';
	if(cobj.wlmode == '2g')	retstr += '2.4GHz';
	else			retstr += '5GHz';

	retstr += ' ';	

	if(cobj.ismain == '1')	retstr += M_lang['S_DEFAULTNET_STRING'];
	else{
		retstr += M_lang['S_GUESTNET_STRING'];
		retstr += cobj.idx;
	}

	return retstr;
}

function onclick_sellist(idx)
{
	if(config_data.bsslist[idx]){selected_bssobj = config_data.bsslist[idx];}
	status_data = null;	old_status_data = null;	
	if(clicked_mac){onclick_maclist(clicked_mac);}
	$('[sid=\"L_SELMACLIST\"]').find('li').remove();
	iux_update_local();
	$('#right_panel').panel('close');
}

function onclick_maclist(macval, desc)
{
	if(clicked_mac){
		$('#'+clicked_mac).css('background-color',clicked_bg);
	}
	if(clicked_mac == macval){
		clicked_mac = null;	clicked_bg = null;	clicked_desc = null;
		$('[sid=\"L_MACAUTH_ADDMAC\"]').text(M_lang['S_MACAUTH_ADDMAC']);
	}else{
		clicked_mac = macval;
		clicked_desc = desc;
		clicked_bg = $('#'+macval).css('background-color');
		$('#'+macval).css('background-color','#C7DF87');
		$('[sid=\"L_MACAUTH_ADDMAC\"]').text(M_lang['S_MACAUTH_ADDMAC'] + ' (' + macval + ')');
	}
}

function onclick_delmac(idval)
{
	if($('#'+idval).is(':checked')){
		$('#'+idval).removeAttr('checked').checkboxradio('refresh');
	}else{
		$('#'+idval).prop('checked','checked').checkboxradio('refresh');
	}
}

function find_olddata_from_new(olditem)
{
	for(var i = 0; i < status_data.stalist.length; i++){
		if(status_data.stalist[i].mac == olditem){
			return true;
		}
	}
	return false;
}

function find_newdata_from_old(newitem)
{
	for(var i = 0; i < old_status_data.stalist.length; i++){
		if(old_status_data.stalist[i].mac == newitem){
			return true;
		}
	}
	return false;
}

function make_blank_macline()
{
	var HTMLStr = '';

	HTMLStr += ('<li sid=\"BLANK_MACLINE\" class=\"lc_selmac_li\"><div class=\"lc_selmac\" style=\"padding-left:.5em;\">');
	HTMLStr += ('<p class=\"lc_disabled_text\">'+M_lang['S_BLANKMAC_STRING']+'</p></div></li>');

	return HTMLStr;
}

function make_connected_macline(cobj)
{
	var HTMLStr = '';

	HTMLStr += ('<li id=\"'+cobj.mac+'\" onclick=\"onclick_maclist(\''+cobj.mac+'\', \''+cobj.pcname+'\')\" class=\"lc_selmac_li\">');
	HTMLStr += ('<div class=\"lc_selmac\"><div class=\"lc_selmac_left\">');
	HTMLStr += ('<div class=\"lc_subline_top\">');
	HTMLStr += ('<p sid=\"MAC\"></p></div><div class=\"lc_subline_bottom\">');
	HTMLStr += ('<p class=\"lc_disabled_text\" sid=\"STATUS\"></p></div></div>');
	HTMLStr += ('<div class=\"lc_selmac_right\"><div class=\"lc_subline_top\">');
	HTMLStr += ('<p class=\"lc_disabled_text\" sid=\"IPADDR\"></p></div>');
	HTMLStr += ('<div class=\"lc_subline_bottom\"><p class=\"lc_disabled_text\" sid=\"PCNAME\"></p>');
	HTMLStr += ('</div></div>');
	HTMLStr += ('</div></li>');

	return HTMLStr;
}

function update_connected_macline(cobj)
{
	var idval = cobj.mac;

	$('#'+idval+' [sid=\"MAC\"]').text(cobj.mac);
	var timestr = '';
	if(cobj.day != '0')	timestr += (cobj.day + M_lang['S_DAY_CHARACTER']);
	if(cobj.hour != '0')	timestr += (cobj.hour + M_lang['S_HOUR_CHARACTER']);
	if(cobj.min != '0')	timestr += (cobj.min + M_lang['S_MIN_CHARACTER']);
	if(cobj.sec != '0')	timestr += (cobj.sec + M_lang['S_SEC_CHARACTER']);
	//$('#'+idval+' [sid=\"STATUS\"]').text(cobj.rssi + '% (' + cobj.realrssi + ' dBm)/' + timestr);
	if(cobj.statstr != '')
		$('#'+idval+' [sid=\"STATUS\"]').text(cobj.statstr + '/' + timestr);
	else
		$('#'+idval+' [sid=\"STATUS\"]').text(timestr);
	$('#'+idval+' [sid=\"IPADDR\"]').text(cobj.ipaddr);
	$('#'+idval+' [sid=\"PCNAME\"]').text(cobj.pcname);
}
//local utility functions end

//local functions start
iux_update_local_func['macauth'] = function(identifier)
{
	if(!identifier){
		if(!selected_bssobj)	return;
		$('[sid=\"MAINTITLE_SSID\"]').text(selected_bssobj.ssid);
		$('[sid=\"L_MACAUTH_POLICY\"]').find('option').remove();
		clicked_mac = null;	clicked_bg = null;	clicked_desc = null;
		var listObjs = M_lang['S_MACAUTH_POLICY'];
	
		for(var idx = 0; (listObjs && idx < listObjs.length); idx++){
			var nm = listObjs[idx];
			$('[sid=\"L_MACAUTH_POLICY\"]')
				.append("<option value='"+nm.value+((selected_bssobj.policy==nm.value)?"' selected>":"' >")+nm.text + "</option>");
		}
		$('[sid=\"L_MACAUTH_POLICY\"]').val(selected_bssobj.policy).selectmenu('refresh','true');
		$('[sid=\"L_MACAUTH_ADDMAC\"]').text(M_lang['S_MACAUTH_ADDMAC']);
		mainclick_event_add();
	}else{
		if(identifier == 'D'){
			if(status_data && !old_status_data){
				if(status_data.stalist.length == 1){
					$('[sid=\"L_SELMACLIST\"]').append(make_blank_macline());
				}else{
					for(var i = 0; i < status_data.stalist.length; i++){
						if(!status_data.stalist[i].mac){break;}
						$('[sid=\"L_SELMACLIST\"]').append(make_connected_macline(status_data.stalist[i]));
						update_connected_macline(status_data.stalist[i]);
					}
				}
			}
			else if(status_data && old_status_data){
				//remove old-data
				if(old_status_data.stalist.length == 1 && status_data.stalist.length > 1){
					$('[sid=\"BLANK_MACLINE\"]').remove();
				}else{
					for(var i = 0; i < old_status_data.stalist.length; i++){
						if(!old_status_data.stalist[i].mac){break;}
						if(!find_olddata_from_new(old_status_data.stalist[i].mac)){
							if(clicked_mac == old_status_data.stalist[i].mac){
								clicked_mac = null;	clicked_bg = null;	clicked_desc = null;
								$('[sid=\"L_MACAUTH_ADDMAC\"]').text(M_lang['S_MACAUTH_ADDMAC']);
							}
							$('#'+old_status_data.stalist[i].mac).remove();
						}
					}
				}
				//insert new-data
				if(old_status_data.stalist.length > 1 && status_data.stalist.length == 1){
					$('[sid=\"L_SELMACLIST\"]').append(make_blank_macline());
				}else{
					for(var i = 0; i < status_data.stalist.length; i++){
						if(!status_data.stalist[i].mac){break;}
						if(!find_newdata_from_old(status_data.stalist[i].mac)){
							if(i == 0){
								$('[sid=\"L_SELMACLIST\"]').prepend(make_connected_macline(status_data.stalist[i]));
							}else{
								$('#'+status_data.stalist[i-1].mac)
									.insertAfter(make_connected_macline(status_data.stalist[i]));
							}
						}
						update_connected_macline(status_data.stalist[i]);
					}
				}
			}
			$("[sid=\"L_SELMACLIST\"] li:even").each(function(){
				if(!clicked_mac || (clicked_mac != $(this).attr('id')))
					$(this).css("background-color","#FFFFFF");
			});
			$("[sid=\"L_SELMACLIST\"] li:odd").each(function(){
				if(!clicked_mac || (clicked_mac != $(this).attr('id')))
					$(this).css("background-color","#F9FAF5");
			});
			$('[sid=\"L_SELMACLIST\"]').listview('refresh');
		}
	}
}

submit_local_func['macauth'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('macauth',localdata, false);
}

iux_update_local_func['selbsslist'] = function()
{
	$('[sid=\"S_TEMP_TITLE\"]').text(M_lang['S_MACAUTH_SELECTNETWORK']);
	$('[sid=\"L_SELBSSLIST\"]').find('li').remove();
	
	for(var i = 0; i < config_data.bsslist.length; i++){
		if(typeof config_data.bsslist[i].ssid != 'undefined'){
			$('[sid=\"L_SELBSSLIST\"]').append(
				'<li class=\"lc_panel_li\" onclick=\"onclick_sellist('+i+')\"><div class=\"lc_panelline\">' +
				'<div class=\"lc_panelline_left\">' + 
				'<img src=\"images/wifi_100.png\">' +
				'</div><div class=\"lc_panelline_right\">' +
				'<div class=\"lc_subline_top\"><p>'+config_data.bsslist[i].ssid+'</p></div>' +
				'<div class=\"lc_subline_bottom\"><p class=\"lc_disabled_text\">'+
				convert_guestnet_str(config_data.bsslist[i]) +
				'</p></div></div>' +
				'</div></li>'
			);
		}
	}

	$("[sid=\"L_SELBSSLIST\"] li:even").css("background-color","#FFFFFF");
	$("[sid=\"L_SELBSSLIST\"] li:odd").css("background-color","#F9FAF5");
	$('[sid=\"L_SELBSSLIST\"]').listview('refresh');
}

iux_update_local_func['addmac'] = function()
{
	$('[sid=\"S_TEMP_TITLE\"]').text(M_lang['S_MACAUTH_ADDMAC']);

	$('[sid=\"L_MACAUTH_DESCRIPTION\"]').attr('placeholder',M_lang['S_DESCNEED_STRING']).val(clicked_desc?clicked_desc:'');
	if(clicked_mac){
		var splitted = clicked_mac.split('-');
		for(var i = 0; i < splitted.length; i++){
			$('[sid=\"L_MACAUTH_MACADDR\"] [sid=\"VALUE'+i+'\"]').val(splitted[i]);
		}
	}

	add_listener_local_func['addmac'].call();
}

add_listener_local_func['addmac'] = function()
{
	$('[sid="S_ADD_BTN"]').unbind('click').click(function(){
		var macaddr = make_macstr();
		macaddr = macaddr.replace(/:/gi,"-");
		if(macaddr == selected_bssobj.macaddr && is_connected_mymac()){
			if(selected_bssobj.policy == 'accept'){
				confirm_mode = 'addmac';	confirm_data = '';
				confirm(M_lang['S_DISCONNECT_CONFIRM']);	return;
			}
		}
		submit_local('addmac', make_local_postdata('register'));
	});

	$('[sid="S_REMOVE_BTN"]').unbind('click').click(function(){
		$('[sid=\"L_MACAUTH_DESCRIPTION\"]').val('');
		for(var i = 0; i < 6; i++){
			$('[sid=\"L_MACAUTH_MACADDR\"] [sid=\"VALUE'+i+'\"]').val('');
		}
	});
}

submit_local_func['addmac'] = function(localdata)
{
	if(!addmac_validate())	return;
	$('#loading').popup('open');
	iux_submit('macauth',localdata, false);
}

iux_update_local_func['delmac'] = function()
{
	$('[sid=\"S_TEMP_TITLE\"]').text(M_lang['S_MACAUTH_DELMAC']);

	$('[sid=\"L_DELMACLIST\"]').find('li').remove();
	if(delmac_data.reglist.length == 1){
		$('[sid=\"L_DELMACLIST\"]').append(
			'<li class=\"lc_delmac_li\">' +
			'<div class=\"lc_delmacline\">' + 
			'<p>'+M_lang['S_NOREGISTERED_STRING']+'</p>' +
			'</div></li>'
		).trigger('create');
		$('[sid=\"DELMAC_BUTTONLINE\"]').remove();
	}else{
	for(var i = 0; i < delmac_data.reglist.length; i++){
		if(typeof delmac_data.reglist[i].mac != 'undefined'){
			$('[sid=\"L_DELMACLIST\"]').append(
				'<li class=\"lc_delmac_li\" sid=\"L_DELMAC_LI'+i+'\" onclick=\"onclick_delmac(\'check_'+i+'\')\">' +
				'<div class=\"lc_delmacline\"><div class=\"lc_delmacline_left\">' + 
				'<p>'+delmac_data.reglist[i].mac+'</p>' +
				'<p class=\"lc_disabled_text\">'+delmac_data.reglist[i].info+'</p>' +
				'</div><div class=\"lc_delmacline_right ui-alt-icon\">' +
				'<label for=\"check_'+i+'\"><p>&nbsp;</p></label>' +
				'<input id=\"check_'+i+'\" type=\"checkbox\" sid=\"L_DELMAC_CHECK\" value=\"'+delmac_data.reglist[i].mac+'\">' +
				'</div></div></li>'
			).trigger('create');
		}
	}
		$('[sid=\"L_DELMACLIST\"] li').on('click',function(e){
			if(!e)	e = window.event;
			e.stopPropagation();	e.preventDefault();
		});
		$("[sid=\"L_DELMACLIST\"] li:even").addClass('lc_whitebox');
		$("[sid=\"L_DELMACLIST\"] li:odd").addClass('lc_greenbox');
		$('[sid=\"L_DELMACLIST\"]').listview('refresh');
	}

	add_listener_local_func['delmac'].call();
}

add_listener_local_func['delmac'] = function()
{
	$('[sid="S_DEL_BTN"]').unbind('click').click(function(){
		var count = 0;
		var confirm_flag = false;
		$('[sid=\"L_DELMAC_CHECK\"]').each(function(){
			if($(this).is(':checked')){
				if($(this).val() == selected_bssobj.macaddr){
					confirm_flag = true;
				}
				count+=1;
			}
		});
		if(confirm_flag){
			if(selected_bssobj.policy == 'deny' && is_connected_mymac()){
				confirm_mode = 'delmac';	confirm_data = '';
				confirm(M_lang['S_DISCONNECT_CONFIRM']);	return;
			}
		}
		if(count == 0){
			alert(M_lang['S_NOCHECKED_ALERT']);	return;
		}
		submit_local('delmac', make_local_postdata('unregister'));
	});

	$('[sid=\"L_DELMAC_ALLCHECK\"]').unbind('change').change(function(){
		if($(this).is(':checked'))
			$('[sid=\"L_DELMAC_CHECK\"]').prop('checked','checked').checkboxradio('refresh');
		else
			$('[sid=\"L_DELMAC_CHECK\"]').removeAttr('checked').checkboxradio('refresh');
        });
}

submit_local_func['delmac'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('macauth',localdata, false);
}
//local functions end
$(document).ready(function() {
	window.tmenu = "wirelessconf";
	window.smenu = "macauth";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null , 60000 ,true);
	events.off("panelbeforeopen");
	events.off("load_header_ended_local");
	events.on('load_header_ended_local', function(menuname){
		iux_update_local_func[ended_actname].call(this);
 		setTimeout(function(){$('#loading').popup('close');},500);
	});
	//error_code_local = parseInt(config_data.errcode);
	//iux_update_local();
	//get_status_local();
	//$(document).off('panelbeforeclose', '#right_panel');
	$(document).on("panelbeforeopen", "#right_panel", function () {
		$('.ui-page').css("overflow","hidden");
//        	$('.ui-page').css("position","fixed");
        	$('#right_panel').css("overflow","hidden");
        	$('#right_panel').css("position","fixed");
	});

	$(document).on("panelbeforeclose", "#right_panel", function () {
		$('.ui-page').css("overflow","auto");
        	$('.ui-page').css("position","relative");
	});
	$(document).on("panelclose", "#right_panel", function () {
		$('#right_content').children().remove();
		$('#right_header').children().remove();
	});
	events.on( "rightPanel.load", makeFocusEvent );
});

function get_status_local()
{
	if(!selected_bssobj){	
 		setTimeout(function(){get_status_local();},1500);
		return;
	}

        $.ajaxSetup({async : true, timeout : 4000});
        var _data = [];
        _data.push({name : "tmenu", value : window.tmenu});
        _data.push({name : "smenu", value : window.smenu});
        _data.push({name : "act", value : "status"});
        _data.push({name : "wlmode", value : selected_bssobj.wlmode});
        _data.push({name : "ssid", value : selected_bssobj.ssid});
        _data.push({name : "bssidx", value : selected_bssobj.bssidx});
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data) {
                if(json_validate(data, '') == true){
			old_status_data = status_data;
                        status_data = data;
                	iux_update("D");
		}
        })
        .fail(function(jqxhr, textStatus, error) {
        }).always(function(){
 		setTimeout(function(){get_status_local();},1500);
	});
}

function iux_update_local(identifier)
{
	if(!identifier)
	{
		if(!selected_bssobj){
			if(!config_data.bsslist[0])	return;
			selected_bssobj = config_data.bsslist[0];
		}else{
			for(var i = 0; i < config_data.bsslist.length; i++){
				if(typeof config_data.bsslist[i].ssid == 'undefined')	continue;
				if(selected_bssobj.wlmode == config_data.bsslist[i].wlmode &&
					selected_bssobj.idx == config_data.bsslist[i].idx)
					selected_bssobj = config_data.bsslist[i];
			}
		}
	}
	iux_update_local_func['macauth'].call(this, identifier);
}

function is_connected_mymac()
{
	if(!selected_bssobj)	return false;
	var tmp_status_data = status_data;
	if(tmp_status_data && tmp_status_data.stalist){
		for(var i = 0; i < tmp_status_data.stalist.length; i++){
			if(tmp_status_data.stalist[i].mac == selected_bssobj.macaddr){
				return true;
			}
		}
	}
	return false;
}

function mainclick_event_add()
{
	$('[sid=\"SELBSSLIST\"]').unbind().on('click',function(){
		$('#loading').popup('open');
		setTimeout(function(){load_rightpanel('selbsslist');},500);
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('[sid=\"ADDMAC\"]').unbind().on('click',function(){
		$('#loading').popup('open');
		setTimeout(function(){load_rightpanel('addmac');},500);
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('[sid=\"DELMAC\"]').unbind().on('click',function(){
		$('#loading').popup('open');
		setTimeout(function(){get_macdb_data();},500);
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('[sid=\"L_MACAUTH_POLICY\"]').unbind('change').on('change',function(){
		var val = $(this).val();
		$(this).val(val).selectmenu('refresh', 'true');
		if(selected_bssobj.registered == '1' && is_connected_mymac()){
			if(val == 'accept'){
				confirm_mode = 'policy';	confirm_data = val;
				confirm(M_lang['S_DISCONNECT_CONFIRM']);	return;
			}
		}else if(val == 'deny'){
			if(is_connected_mymac()){
				confirm_mode = 'policy';	confirm_data = val;
				confirm(M_lang['S_DISCONNECT_CONFIRM']);	return;
			}
		}
		submit_local('macauth', make_local_postdata('policy',val));
	});
}

function submit_local(rule_type, localdata)
{
	submit_local_func[rule_type].call(this, localdata);
}

function load_rightpanel(actname)
{
	$.ajaxSetup({ async : true, timeout:20000});
	$("#right_content").load(
		'html/'+actname+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');
				ended_actname = actname;
				load_header(RIGHT_HEADER, 'TEMP');
				iux_update('S');
				events.emit("rightPanel.load");
			}
		}
	);
}

