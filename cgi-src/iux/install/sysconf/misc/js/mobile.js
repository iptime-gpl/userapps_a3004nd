//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var printData = '';
var confirm_data = null;
var confirm_mode = null;
var rebootlocaldata = null;
//local-global variables end

//local utility functions
function immediately_submit_event_add(service_name, sid)
{
	$('[sid="'+sid+'"]').unbind('change').change( function() {
		if(check_change_value()){submit_local(service_name);}
	});
}

function immediatelySubmitEvent( service_name ) 
{
	if(check_change_value()){submit_local(service_name);}
}

function submit_button_event_add(service_name)
{
	$('[sid="S_BUTTON_SUBMIT"]').unbind('click').click(function(){submit_local(service_name);});
}

function locking_obj(sid, proptype ,defval)
{
	if(defval){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, true);
		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, true);
		$('[sid="'+sid+'"]').parent().addClass('ui-state-disabled');
	}
}

function unlocking_obj(sid, proptype ,defval)
{
	if(defval){
		$('[sid="'+sid+'"]').val(defval).prop(proptype, false);
		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}else{
		$('[sid="'+sid+'"]').prop(proptype, false);
		$('[sid="'+sid+'"]').parent().removeClass('ui-state-disabled');
	}
}

function make_submit_data(putData)
{
	var data = [];
	data.push(putData);
	return data;
}

function submit_button_control_event_add(sid, type)
{
	switch(type){
		case "click":
		$('[sid="'+sid+'"]').click(function(){
			if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
			else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}});break;
		case "keyup":
		$('[sid="'+sid+'"]').keyup(function(){
			if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
			else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}});break;
		case "change":
		$('[sid="'+sid+'"]').change(function(){
			if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
			else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}});break;
	}
}

function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		location.reload();
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function local_fileform_submit(service_name, localPostdata)
{
	var postData = new FormData($('#iux_file_form')[0]);
	postData.append("tmenu",window.tmenu);
	postData.append("smenu",window.smenu);
	postData.append("service_name",service_name);

	postData.append('mode',localPostdata);

	$.ajax({
		url: '/cgi/iux_set.cgi',
		processData: false,
		contentType: false,
		data: postData,
		type: 'POST',
		success: function(data){
			setTimeout(function() {
				if(data === "ok")
				{
					$('#loading').popup('close');
					alert(M_lang["S_INVALID_FILE_ALERT"]);
				}
				else if(data === "reboot")
				{
					$('#loading').popup('close');
					var remaining = parseInt(config_data.configmgmt.rebootsec);
					reboot_timer(remaining);
					$('#loading_reboot').popup('open');
				}
				else if(data == 'fail'){
					alert(M_lang['S_SUBMIT_FAIL_MSG']);
				}
			}, 1000);
		}
	});
}

function reboot_submit(service_name, localdata)
{
	if(!service_name.match(regExp_spchar)){
		var remaining = parseInt(eval('config_data.'+service_name+'.rebootsec'));
		iux_submit(service_name, localdata);
		reboot_timer(remaining);
		stopstatus = true;
		$('#loading_reboot').popup('open');
	}
}

function confirm_result_local(flag)
{
	if(!confirm_mode)	return;
	if(flag){	
		if(confirm_mode == 'configmgmt'){
			submit_local('configmgmt', confirm_data);
		}
		else if(confirm_mode == 'reboot'){
			reboot_submit(confirm_data, rebootlocaldata);
		}
	}
	else{
		if(confirm_mode == 'reboot' && rebootlocaldata == null){
			iux_update('C');	iux_update_local();
		}else if(confirm_data == 'macclonegiga' || confirm_data == 'upnp'){
			iux_update('C');
		}
		else if(confirm_data == 'hubapmode'){iux_update('C');}
	}
	confirm_data = null;	confirm_mode = null;	rebootlocaldata = null;
}
//local utility functions end

//realtime start
iux_update_local_func['realtime'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
                	if(config_data.realtime.serverlist == 'null'){$('#serveredit').show();}
			else{$('#serveredit').hide();}
		}
	}
	else if(identifier == 'D'){
		if(status_data.realtime.status == ''){
			printData = status_data.realtime.year + M_lang['S_YEAR_STRING'];
			printData += (status_data.realtime.mon + M_lang['S_MONTH_STRING']);
			printData += (status_data.realtime.date + M_lang['S_DATE_STRING'] + " ");
			printData += (M_lang['S_'+status_data.realtime.day.toUpperCase()+'_DAY_STRING'] + " ");
			printData += (status_data.realtime.hour + M_lang['S_HOUR_STRING'] + " ");
			printData += (status_data.realtime.min + M_lang['S_MINUTE_STRING'] + " ");
			printData += (status_data.realtime.sec + M_lang['S_SECOND_STRING']);
		}
		else{printData = M_lang["S_"+status_data.realtime.status];}
		if(viewing){$('[sid="D_REALTIME_CURTIME"]').text(printData);}
	}
	if(printData != ''){$("[sid='REALTIME_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['realtime'] = function()
{
	submit_button_event_add('realtime');
	submit_button_control_event_add('C_REALTIME_SERVEREDIT', 'keyup');
	submit_button_control_event_add('C_REALTIME_GMTIDX', 'change');
	submit_button_control_event_add('C_REALTIME_SUMMERFLAG', 'change');
	$('[sid="C_REALTIME_SERVEREDIT"]').keydown(function(key){if(key.keyCode == 13)	return false;});
	$('[sid="C_REALTIME_SERVERLIST"]').change(function() {
		if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
		else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}
		if($('[sid="C_REALTIME_SERVERLIST"] option:selected').val() == 'null'){
			$('#serveredit').show();
			$('[sid="C_REALTIME_SERVEREDIT"]').val('');
		}
		else{
			$('#serveredit').hide();
			$('[sid="C_REALTIME_SERVEREDIT"]').val($(this).val());
		}
	});
};

submit_local_func['realtime'] = function()
{
	if($('[sid="C_REALTIME_SERVERLIST"] option:selected').val() == 'null'){
		if($('[sid="C_REALTIME_SERVEREDIT"]').val() == ''){
			alert(M_lang["S_REALTIME_SERVEREDIT_ERROR"]);
			return false;
		}
		if($('[sid="C_REALTIME_SERVEREDIT"]').val().match(regExp_korspchar)){
			alert(M_lang["S_NOT_ALLOWED_CHARS_WITH_KOREAN"]);
			return false;
		}
	}
	$('#loading').popup('open');
	iux_submit('realtime');
};
//realtime end

//hostname start
iux_update_local_func['hostname'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing)	locking_obj('S_BUTTON_SUBMIT', 'disabled');
		printData = config_data.hostname.hostname;
		//if(printData == ''){$("[sid='HOSTNAME_VALUE']").text(printData);}
	}
	else if(identifier == 'D'){
		if(status_data.hostname.status == 'NOSETUP_TXT')
			printData = M_lang['D_NOSETUP_TXT'];
		else if(config_data && config_data.hostname){
			printData = config_data.hostname.hostname;
		}
	}
	else{printData = config_data.hostname.hostname;}
	if(printData != ''){$("[sid='HOSTNAME_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['hostname'] = function()
{
	submit_button_event_add('hostname');
	submit_button_control_event_add('C_HOSTNAME_HOSTNAME', 'keyup');
	$('[sid="C_HOSTNAME_HOSTNAME"]').keydown(function(key){if(key.keyCode == 13)	return false;});
};

submit_local_func['hostname'] = function()
{
	if($('[sid="C_HOSTNAME_HOSTNAME"]').val().match(regExp_spchar)){
		alert(M_lang["S_NOT_ALLOWED_CHARS"]);
		return false;
	}
	$('#loading').popup('open');
	iux_submit('hostname');
};
//hostname end

//configmgmt start
iux_update_local_func['configmgmt'] = function(identifier, viewing){};

add_listener_local_func['configmgmt'] = function()
{
	$('[sid="CONFIGMGMT_FACTORY"]').click(function() {
		confirm_mode = 'configmgmt';	confirm_data = '0';
		confirm(M_lang['S_REBOOT_ALERT_MSG']);
	});
	$('[sid="CONFIGMGMT_BACKUP"]').click(function() {self.location.href='/cgi/iux_download.cgi?act=configmgmt';});
	$('[sid="CONFIGMGMT_RESTORE"]').click(function() {
		if($('[sid="C_CONFIGMGMT_RESTOREFILE"]').val().length == 0){alert(M_lang['S_CONFIGMGMT_FILENOTEXIST']);	return;}
		confirm_mode = 'configmgmt';	confirm_data = '2';
		confirm(M_lang['S_REBOOT_ALERT_MSG']);
	});
	$('[sid="C_CONFIGMGMT_RESTOREFILE"]').change(function() {
                if( this.files && this.files[0] && this.files[0].size > 1048576 )
                {
                        alert(M_lang["S_INVALID_FILE_ALERT"]);
                        this.value = "";
                }

		var filename = $(this).val()+"";
		if(filename){filename = filename.substr(filename.lastIndexOf("\\")+1, filename.length);}
		$('[sid="S_CONFIGMGMT_FILESELECT"]').val($(this).val()?filename:M_lang['S_CONFIGMGMT_FILESELECT']);
	});
};

submit_local_func['configmgmt'] = function(localpostdata)
{
	local_fileform_submit('configmgmt', localpostdata);
	$('#loading').popup('open');
};
//configmgmt end

//autosaving start
iux_update_local_func['autosaving'] = function(identifier, viewing)
{
};

add_listener_local_func['autosaving'] = function()
{
//	immediately_submit_event_add('autosaving', 'C_AUTOSAVING_RUN');
        sliderButtonEvent( { sid : 'C_AUTOSAVING_RUN', arguments : ['autosaving'], runFunc : immediatelySubmitEvent } );
};

submit_local_func['autosaving'] = function()
{
	$('#loading').popup('open');
	localpostdata = [];
	localpostdata.push({'name':'run','value':$('[sid=\"C_AUTOSAVING_RUN\"]').val()});
	iux_submit('autosaving', localpostdata, false );
};
//autosaving end

//fakedns start
iux_update_local_func['fakedns'] = function(identifier, viewing)
{
};

add_listener_local_func['fakedns'] = function()
{
//	immediately_submit_event_add('fakedns', 'C_FAKEDNS_RUN');
        sliderButtonEvent( { sid : 'C_FAKEDNS_RUN', arguments : ['fakedns'], runFunc : immediatelySubmitEvent } );
};

submit_local_func['fakedns'] = function()
{
	$('#loading').popup('open');
	localpostdata = [];
	localpostdata.push({'name':'run','value':$('[sid=\"C_FAKEDNS_RUN\"]').val()});
	iux_submit('fakedns', localpostdata, false);
};
//fakedns end

//nologin start
iux_update_local_func['nologin'] = function(identifier, viewing)
{
	if(identifier == 'C'){}
	else if(identifier == 'D'){}
	else{
		if(config_data.nologin.nologin == '0')	printData = M_lang['S_NOLOGIN_FALSE'];
		else					printData = M_lang['S_NOLOGIN_TRUE'];
	}
	if(printData != ''){$("[sid='NOLOGIN_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['nologin'] = function()
{
	immediately_submit_event_add('nologin', 'C_NOLOGIN_NOLOGIN');
};

submit_local_func['nologin'] = function()
{
	$('#loading').popup('open');
	iux_submit('nologin');
};
//nologin end

//upnp start
iux_update_local_func['upnp'] = function(identifier, viewing)
{
};

add_listener_local_func['upnp'] = function()
{
	$('[sid=\"S_UPNP_LINK\"]').click(function(){
		location.href = '/natrouterconf/portforward/iux.cgi?mode=upnp';
	});
//	immediately_submit_event_add('upnp', 'C_UPNP_RUN');
        sliderButtonEvent( { sid : 'C_UPNP_RUN', arguments : ['upnp'], runFunc : immediatelySubmitEvent } );
};

submit_local_func['upnp'] = function()
{
	confirm_mode = 'reboot';	confirm_data = 'upnp';
	rebootlocaldata = [];
	rebootlocaldata.push({'name':'run','value':$('[sid=\"C_UPNP_RUN\"]').val()});
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//upnp end

//apcplan start
iux_update_local_func['apcplan'] = function(identifier, viewing)
{
};

add_listener_local_func['apcplan'] = function()
{
//	immediately_submit_event_add('apcplan', 'C_APCPLAN_RUN');
        sliderButtonEvent( { sid : 'C_APCPLAN_RUN', arguments : ['apcplan'], runFunc : immediatelySubmitEvent } );
};

submit_local_func['apcplan'] = function()
{
	$('#loading').popup('open');
	localpostdata = [];
	localpostdata.push({'name':'run','value':$('[sid=\"C_APCPLAN_RUN\"]').val()});
	iux_submit('apcplan', localpostdata, false);
};
//apcplan end

//usbmode start
iux_update_local_func['usbmode'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			if(config_data.usbmode.mode == '2'){
				$('#mode_20').prop('checked', true).checkboxradio('refresh');
				$('#mode_30').prop('checked', false).checkboxradio('refresh');
			}
			else{
				$('#mode_20').prop('checked', false).checkboxradio('refresh');
				$('#mode_30').prop('checked', true).checkboxradio('refresh');
			}
		}
	}
	else if(identifier == 'D'){}
	else{printData = M_lang['S_USBMODE_'+((config_data.usbmode.mode == 2)?'20':'30')];}
	if(printData != ''){$("[sid='USBMODE_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['usbmode'] = function()
{
	immediately_submit_event_add('usbmode', 'C_USBMODE_MODE');
};

submit_local_func['usbmode'] = function()
{
	confirm_mode = 'reboot';	confirm_data = 'usbmode';
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//usbmode end

//macclonegiga start
iux_update_local_func['macclonegiga'] = function(identifier, viewing)
{
};

add_listener_local_func['macclonegiga'] = function()
{
//	immediately_submit_event_add('macclonegiga', 'C_MACCLONEGIGA_RUN');
        sliderButtonEvent( { sid : 'C_MACCLONEGIGA_RUN', arguments : ['macclonegiga'], runFunc : immediatelySubmitEvent } );
};

submit_local_func['macclonegiga'] = function()
{
	confirm_mode = 'reboot';	confirm_data = 'macclonegiga';
	rebootlocaldata = [];
	rebootlocaldata.push({'name':'run','value':$('[sid=\"C_MACCLONEGIGA_RUN\"]').val()});
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//macclonegiga end

//hubapmode start
iux_update_local_func['hubapmode'] = function(identifier, viewing){
	if(identifier == 'C'){
		if(viewing){
			if(config_data.hubapmode.uselocalgw == '1'){
				unlocking_obj('C_HUBAPMODE_GATEWAY"] [sid^="VALUE','readonly');
				unlocking_obj('C_HUBAPMODE_BASICDNS"] [sid^="VALUE','readonly');
				unlocking_obj('C_HUBAPMODE_EXTENDDNS"] [sid^="VALUE','readonly');
				unlocking_obj('S_HUBAPMODE_BUTTON','disabled');
			}
			else{
				locking_obj('C_HUBAPMODE_GATEWAY"] [sid^="VALUE','readonly');
				locking_obj('C_HUBAPMODE_BASICDNS"] [sid^="VALUE','readonly');
				locking_obj('C_HUBAPMODE_EXTENDDNS"] [sid^="VALUE','readonly');
				locking_obj('S_HUBAPMODE_BUTTON','disabled');
			}
		}
	}
};

add_listener_local_func['hubapmode'] = function()
{
	$('[sid="C_HUBAPMODE_USELOCALGW"]').change(function(){
		if($(this).val() == '1'){
			unlocking_obj('C_HUBAPMODE_GATEWAY"] [sid^="VALUE','readonly');
			unlocking_obj('C_HUBAPMODE_BASICDNS"] [sid^="VALUE','readonly');
			unlocking_obj('C_HUBAPMODE_EXTENDDNS"] [sid^="VALUE','readonly');
			unlocking_obj('S_HUBAPMODE_BUTTON','disabled');
		}
		else{
			locking_obj('C_HUBAPMODE_GATEWAY"] [sid^="VALUE','readonly');
			locking_obj('C_HUBAPMODE_BASICDNS"] [sid^="VALUE','readonly');
			locking_obj('C_HUBAPMODE_EXTENDDNS"] [sid^="VALUE','readonly');
			locking_obj('S_HUBAPMODE_BUTTON','disabled');
			if(check_change_value()){submit_local('hubapmode', $(this).val());}
		}
	});
	
	$('[sid="S_HUBAPMODE_BUTTON"]').click(function() {submit_local('hubapmode');});
};

submit_local_func['hubapmode'] = function(localgwval)
{
	var gateway = '';
	var basdns = '';
	var extdns = '';
	
	//if($('[sid="C_HUBAPMODE_USELOCALGW"]').val() == '1'){
	if(!localgwval)	localgwval = $('[sid="C_HUBAPMODE_USELOCALGW"]').val();
	if(localgwval == '1'){
		gateway += $('[sid=\"C_HUBAPMODE_GATEWAY\"] [sid=\"VALUE0\"]').val();	gateway += '.';
		gateway += $('[sid=\"C_HUBAPMODE_GATEWAY\"] [sid=\"VALUE1\"]').val();	gateway += '.';
		gateway += $('[sid=\"C_HUBAPMODE_GATEWAY\"] [sid=\"VALUE2\"]').val();	gateway += '.';
		gateway += $('[sid=\"C_HUBAPMODE_GATEWAY\"] [sid=\"VALUE3\"]').val();
		if(!gateway.match(regExp_ip)){
			alert(M_lang['S_HUBAPMODE_GATEWAYINVALID']);	return false;
		}
		
		basdns += $('[sid=\"C_HUBAPMODE_BASICDNS\"] [sid=\"VALUE0\"]').val();	basdns += '.';
		basdns += $('[sid=\"C_HUBAPMODE_BASICDNS\"] [sid=\"VALUE1\"]').val();	basdns += '.';
		basdns += $('[sid=\"C_HUBAPMODE_BASICDNS\"] [sid=\"VALUE2\"]').val();	basdns += '.';
		basdns += $('[sid=\"C_HUBAPMODE_BASICDNS\"] [sid=\"VALUE3\"]').val();
		if(!basdns.match(regExp_ip)){
			alert(M_lang['S_HUBAPMODE_BASICDNSINVALID']);	return false;
		}
		
		extdns += $('[sid=\"C_HUBAPMODE_EXTENDDNS\"] [sid=\"VALUE0\"]').val();	extdns += '.';
		extdns += $('[sid=\"C_HUBAPMODE_EXTENDDNS\"] [sid=\"VALUE1\"]').val();	extdns += '.';
		extdns += $('[sid=\"C_HUBAPMODE_EXTENDDNS\"] [sid=\"VALUE2\"]').val();	extdns += '.';
		extdns += $('[sid=\"C_HUBAPMODE_EXTENDDNS\"] [sid=\"VALUE3\"]').val();
		if(extdns != '...'){
			if(!extdns.match(regExp_ip)){
				alert(M_lang['S_HUBAPMODE_EXTENDDNSINVALID']);	return false;
			}
		}
	}

	rebootlocaldata = [];
	rebootlocaldata.push({'name':'uselocalgw', 'value':(localgwval?localgwval:$('[sid=\"C_HUBAPMODE_USELOCALGW\"]').val())});
	rebootlocaldata.push({'name':'gateway', 'value':gateway});
	rebootlocaldata.push({'name':'basicdns', 'value':basdns});
	if(extdns != '...')	rebootlocaldata.push({'name':'extenddns', 'value':extdns});
	else			rebootlocaldata.push({'name':'extenddns', 'value':''});

	confirm_mode = 'reboot';	confirm_data = 'hubapmode';
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//hubapmode end

//restart start
iux_update_local_func['restart'] = function(identifier, viewing){};

add_listener_local_func['restart'] = function()
{
	$('[sid="S_RESTART_BUTTON"]').click(function() {submit_local('restart');});
};

submit_local_func['restart'] = function()
{
	confirm_mode = 'reboot';	confirm_data = 'restart';
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//restart end

//mgmtport start
iux_update_local_func['mgmtport'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
			if(config_data.mgmtport.port == 80){locking_obj('C_MGMTPORT_PORT', 'readonly');}
			else{unlocking_obj('C_MGMTPORT_PORT', 'readonly');}
		}
	}
	else if(identifier == 'D'){}
	else{printData = config_data.mgmtport.port + M_lang['S_MGMTPORT_USING'];}
	if(printData != ''){$("[sid='MGMTPORT_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['mgmtport'] = function()
{
	submit_button_event_add('mgmtport');
	submit_button_control_event_add('C_MGMTPORT_DEFAULTCHECK', 'change');
	submit_button_control_event_add('C_MGMTPORT_PORT', 'keyup');
	$('[sid="C_MGMTPORT_PORT"]').keydown(function(key){if(key.keyCode == 13)	return false;});
	$('[sid="C_MGMTPORT_DEFAULTCHECK"]').change(function(){
		if($(this).is(":checked")){
			locking_obj('C_MGMTPORT_PORT','readonly' ,80);
			if(!check_change_value())locking_obj('S_BUTTON_SUBMIT', 'disabled');
		}
		else{
			unlocking_obj('C_MGMTPORT_PORT','readonly' ,80);
			if(check_change_value())unlocking_obj('S_BUTTON_SUBMIT', 'disabled');
		}
	});
};

submit_local_func['mgmtport'] = function()
{
	if($('[sid="C_MGMTPORT_PORT"]').val() == ''
		|| !$('[sid="C_MGMTPORT_PORT"]').val().match(regExp_onlynum)
		|| ($('[sid="C_MGMTPORT_PORT"]').val() < 0 || $('[sid="C_MGMTPORT_PORT"]').val() > 65535)){
		alert(M_lang["S_MGMTPORT_INVALID"]);
		return false;
	}
	confirm_mode = 'reboot';	confirm_data = 'mgmtport';
	confirm(M_lang['S_REBOOT_ALERT_MSG']);
	return false;
};
//mgmtport end

//fan start
iux_update_local_func['fan'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
			unlocking_obj('S_FAN_DEFAULT', 'disabled');
			if(config_data.fan.automode == '1'){
				$('#fan_manualmode').css('display', 'none');
				$('#fan_automode').css('display', '');
			}
			else{
				$('#fan_manualmode').css('display', '');
				$('#fan_automode').css('display', 'none');
			}
			printData = config_data.fan.mintemper+M_lang['S_FAN_TEMPERCHAR'] + " ~ ";
			printData += (config_data.fan.maxtemper+M_lang['S_FAN_TEMPERCHAR']);
			printData += (M_lang['S_FAN_BETWEEN']);
			$('[sid="C_FAN_BETWEEN"]').text(printData);
			printData = '';
		}
	}
	else if(identifier == 'D'){
		if(viewing){
			printData = 'CPU-'+status_data.fan.temper+M_lang['S_FAN_TEMPERCHAR'];
			$('[sid="D_FAN_TEMPER"]').text(printData);
			printData = '';
		}
		printData = M_lang['S_FAN_SYSTEMPER'] + status_data.fan.temper + M_lang['S_FAN_TEMPERCHAR'];
		printData += (M_lang['S_FAN_SPEEDTXT'] + M_lang['S_FAN_'+status_data.fan.fanspeed.toUpperCase()]);
	}
	else{}
	if(printData != ''){$("[sid='FAN_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['fan'] = function()
{
	submit_button_event_add('fan');
	submit_button_control_event_add("C_FAN_MANUALOP", 'change');
	submit_button_control_event_add('C_FAN_MINTEMPER', 'keyup');
	submit_button_control_event_add('C_FAN_MAXTEMPER', 'keyup');
	$('[sid="C_FAN_AUTOMODE"]').change(function(){
		if($(this).val() == '1'){
			$('#fan_manualmode').css('display', 'none');
			$('#fan_automode').css('display', '');
		}
		else{
			$('#fan_manualmode').css('display', '');
			$('#fan_automode').css('display', 'none');
		}
		if(check_change_value())unlocking_obj('S_BUTTON_SUBMIT', 'disabled');
		else locking_obj('S_BUTTON_SUBMIT', 'disabled');
	});
	$('[sid="S_FAN_DEFAULT"]').click(function() {
		$('#automode_false').prop('checked',false).checkboxradio('refresh');
		$('#automode_true').prop('checked',true).checkboxradio('refresh');
		$('#fan_manualmode').css('display', 'none');
		$('#fan_automode').css('display', '');
		$('[sid="C_FAN_MINTEMPER"]').val(config_data.fan.defaultmin);
		$('[sid="C_FAN_MAXTEMPER"]').val(config_data.fan.defaultmax);
		if(check_change_value())unlocking_obj('S_BUTTON_SUBMIT', 'disabled');
		else locking_obj('S_BUTTON_SUBMIT', 'disabled');
	});
};

submit_local_func['fan'] = function()
{
	if($('[sid="C_FAN_MINTEMPER"]').val() == ''
		|| !$('[sid="C_FAN_MINTEMPER"]').val().match(regExp_onlynum)
		|| $('[sid="C_FAN_MAXTEMPER"]').val() == ''
		|| !$('[sid="C_FAN_MAXTEMPER"]').val().match(regExp_onlynum)
		|| (parseInt($('[sid="C_FAN_MAXTEMPER"]').val()) < parseInt($('[sid="C_FAN_MINTEMPER"]').val()))){
		alert(M_lang["S_FAN_ALERT_MSG"]);
		return false;
	}
	$('#loading').popup('open');
	iux_submit('fan');
};
//fan end

//led start
iux_update_local_func['led'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			for(var i = 0; i < 24; i++){
				$('[sid="C_LED_LEDSTART"]')
				.append('<option value="'+i+'"'+((config_data.led.ledstart==i)?" selected":"")+'>'+i+'</option>');
			}
			$('[sid="C_LED_LEDSTART"]').attr("value", config_data.led.ledstart).selectmenu('refresh',true);
			for(var i = 0; i < 24; i++){
				$('[sid="C_LED_LEDEND"]')
				.append('<option value="'+i+'"'+((config_data.led.ledend==i)?" selected":"")+'>'+i+'</option>');
			}
			$('[sid="C_LED_LEDEND"]').attr("value", config_data.led.ledend).selectmenu('refresh',true);
			if(config_data.led.mode == 0)$('#led_basic').prop('checked', true).checkboxradio('refresh');
			else if(config_data.led.mode == 1)$('#led_always').prop('checked', true).checkboxradio('refresh');
			else	$('#led_time').prop('checked', true).checkboxradio('refresh');

			if(config_data.led.mode == 2){
				unlocking_obj('C_LED_LEDSTART', 'readonly');
				unlocking_obj('C_LED_LEDEND', 'readonly');
			}
			else{
				locking_obj('C_LED_LEDSTART', 'readonly');
				locking_obj('C_LED_LEDEND', 'readonly');
			}
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
		}
	}
	else if(identifier == 'D'){}
	else{config_data.led.ledstat == 1?printData = M_lang['S_LED_ONSTR']:printData = M_lang['S_LED_OFFSTR'];}
	if(printData != ''){$("[sid='LED_VALUE']").text(printData);	printData = '';}
};

add_listener_local_func['led'] = function()
{
	submit_button_event_add('led');
	$('[sid="C_LED_MODE"]').change(function(){
		if($(this).val() == '2'){
			unlocking_obj('C_LED_LEDSTART', 'readonly');
			unlocking_obj('C_LED_LEDEND', 'readonly');
			if(check_change_value())
				unlocking_obj('S_BUTTON_SUBMIT', 'disabled');
		}
		else{
			locking_obj('C_LED_LEDSTART', 'readonly');
			locking_obj('C_LED_LEDEND', 'readonly');
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
			if(check_change_value()) 
				submit_local('led',make_submit_data({'name':$(this).prop('name'), 'value':$(this).val()}));
		}
	});
	$('[sid=\"C_LED_LEDSTART\"], [sid=\"C_LED_LEDEND\"]').change(function(){
		if(check_change_value())
			unlocking_obj('S_BUTTON_SUBMIT', 'disabled');
		else
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
	});
};

submit_local_func['led'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('led', localdata);
};
//led end

//autoreboot start
iux_update_local_func['autoreboot'] = function(identifier, viewing)
{
	if(identifier == 'C'){
		if(viewing){
			locking_obj('S_BUTTON_SUBMIT', 'disabled');
			for(var i = 0; i < 24; i++){
				$('[sid="C_AUTOREBOOT_HOUR"]')
				.append('<option value="'+i+'"'+((config_data.autoreboot.hour==i)?" selected":"")+'>'+i+'</option>');
			}
			$('[sid="C_AUTOREBOOT_HOUR"]').attr("value", config_data.autoreboot.hour).selectmenu('refresh',true);
			for(var i = 0; i < 60; i++){
				$('[sid="C_AUTOREBOOT_MIN"]')
				.append('<option value="'+i+'"'+((config_data.autoreboot.min==i)?" selected":"")+'>'+i+'</option>');
			}
			$('[sid="C_AUTOREBOOT_MIN"]').attr("value", config_data.autoreboot.hour).selectmenu('refresh',true);
			if(config_data.autoreboot.everyday == '1'){
				for(var i = 0; i < 7 ; i ++){locking_obj('C_AUTOREBOOT_DAYS'+i, 'disabled');}
			}
			if(config_data.autoreboot.run == '0'){
				locking_obj('C_AUTOREBOOT_EVERYDAY', 'disabled');
				for(var i = 0; i < 7 ; i ++){locking_obj('C_AUTOREBOOT_DAYS'+i, 'disabled');}
				locking_obj('C_AUTOREBOOT_HOUR', 'disabled');
				locking_obj('C_AUTOREBOOT_MIN', 'disabled');
			}
		}
	}
	else if(identifier == 'D'){}
	else{
	}
};

add_listener_local_func['autoreboot'] = function()
{
	submit_button_event_add('autoreboot');
	submit_button_control_event_add('C_AUTOREBOOT_HOUR', 'change');
	submit_button_control_event_add('C_AUTOREBOOT_MIN', 'change');
	$('[sid="C_AUTOREBOOT_EVERYDAY"]').click(function(){
		for(var i = 0; i < 7 ; i ++){
			if($(this).prop('checked')){locking_obj('C_AUTOREBOOT_DAYS'+i, 'disabled');}
			else{unlocking_obj('C_AUTOREBOOT_DAYS'+i, 'disabled');}
		}
		if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
		else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}
	});
	for(var i = 0; i < 7 ; i ++){
		submit_button_control_event_add('C_AUTOREBOOT_DAYS'+i, 'click');
	}
	$('[sid="C_AUTOREBOOT_RUN"]').change(function(){
		if($(this).val() == '0'){
			locking_obj('C_AUTOREBOOT_EVERYDAY', 'disabled');
			for(var i = 0; i < 7 ; i ++){locking_obj('C_AUTOREBOOT_DAYS'+i , 'disabled');}
			locking_obj('C_AUTOREBOOT_HOUR', 'disabled');
			locking_obj('C_AUTOREBOOT_MIN', 'disabled');
			if(check_change_value()){
				submit_local('autoreboot',make_submit_data({'name':$(this).prop('name'), 'value':$(this).val()}));
			}
		}
		else{
			unlocking_obj('C_AUTOREBOOT_EVERYDAY', 'disabled');
			if($('[sid="C_AUTOREBOOT_EVERYDAY"]').prop('checked') == false){
				for(var i = 0; i < 7 ; i ++){unlocking_obj('C_AUTOREBOOT_DAYS'+i , 'disabled');}
			}
			unlocking_obj('C_AUTOREBOOT_HOUR', 'disabled');
			unlocking_obj('C_AUTOREBOOT_MIN', 'disabled');
		}
		if(check_change_value()){unlocking_obj('S_BUTTON_SUBMIT', 'disabled');}
		else{locking_obj('S_BUTTON_SUBMIT', 'disabled');}
	});
};

submit_local_func['autoreboot'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('autoreboot', localdata);
};
//autoreboot end

//snmp start
iux_update_local_func['snmp'] = function(identifier, viewing)
{
        if(identifier == 'C'){
                if(viewing){
			if( config_data.snmp.run === "0" )
			{
				locking_obj('C_SNMP_PORT', 'disabled');
				locking_obj('C_SNMP_COMMUNITY', 'disabled');
				locking_obj('C_SNMP_NAME', 'disabled');
				locking_obj('C_SNMP_LOCATION', 'disabled');
				locking_obj('C_SNMP_CONTACT', 'disabled');
				locking_obj('C_SNMP_DESC', 'disabled');
			}
                }
        }
        else if(identifier == 'D')
	{
	}
        else
	{
        }
};

add_listener_local_func['snmp'] = function()
{
	submit_button_event_add('snmp');
	$("#right_content input[sid=C_SNMP_RUN]").change(function() {
		if( $(this).val() == 0)
		{
			locking_obj('C_SNMP_PORT', 'disabled');
			locking_obj('C_SNMP_COMMUNITY', 'disabled');
			locking_obj('C_SNMP_NAME', 'disabled');
			locking_obj('C_SNMP_LOCATION', 'disabled');
			locking_obj('C_SNMP_CONTACT', 'disabled');
			locking_obj('C_SNMP_DESC', 'disabled');
		}
		else
		{
			unlocking_obj('C_SNMP_PORT', 'disabled');
			unlocking_obj('C_SNMP_COMMUNITY', 'disabled');
			unlocking_obj('C_SNMP_NAME', 'disabled');
			unlocking_obj('C_SNMP_LOCATION', 'disabled');
			unlocking_obj('C_SNMP_CONTACT', 'disabled');
			unlocking_obj('C_SNMP_DESC', 'disabled');
		}
	});
};

submit_local_func['snmp'] = function(localdata)
{
	if($('[sid="C_SNMP_PORT"]').val().match(regExp_spchar)
		|| $('[sid="C_SNMP_COMMUNITY"]').val().match(regExp_spchar)
		|| $('[sid="C_SNMP_NAME"]').val().match(regExp_spchar)
		|| $('[sid="C_SNMP_LOCATION"]').val().match(regExp_spchar)
		|| $('[sid="C_SNMP_CONTACT"]').val().match(regExp_spchar)
		|| $('[sid="C_SNMP_DESC"]').val().match(regExp_spchar)
	) {
		alert(M_lang["S_NOT_ALLOWED_CHARS"]);
		return false;
	}
        $('#loading').popup('open');
        iux_submit('snmp');
};


//snmp end


//portrole start
iux_update_local_func['portrole'] = function(identifier, viewing)
{
	if(identifier == 'C') {
		if(!viewing)
			return;
		var radios = $("#right_main input[sid=C_PORTROLE_PORTROLE]");
		radios.filter("[value=" + config_data.portrole.portrole + "]").prop("checked", true);
		radios.checkboxradio("refresh");
	}
	else if(identifier == 'D') {}
	else
	{
		if( config_data.portrole.portrole == "lan" )
			printData = M_lang['S_PORTROLE_LAN'];
		else
			printData = M_lang['S_PORTROLE_WAN'];
	}
	if(printData != '')
	{
		$("[sid='PORTROLE_VALUE']").text(printData);	printData = '';
	}
};

add_listener_local_func['portrole'] = function()
{
	
	$("#right_main input[sid=C_PORTROLE_PORTROLE]").change(function(){
		if(check_change_value()) 
			events.confirm({ msg: M_lang['S_PORTROLE_WARNING1'], runFunc: function( flag ) {
				if( flag )
					reboot_submit('portrole', [{"name": "portrole", "value":$("#right_main input[sid=C_PORTROLE_PORTROLE]:checked").val()}]);
				else
					iux_update("C");
			}});

	});
};

submit_local_func['portrole'] = function(localdata)
{
	$('#loading').popup('open');
	iux_submit('portrole', localdata);
};
//portrole end

function loadLocalPage()
{
	iux_set_onclick_local();
}

function result_config(result)
{
	if(result){
		iux_update('C');	iux_update_local();
	}
}

function result_submit(service_name, result)
{
}

$(document).ready(function() {
	window.tmenu = "sysconf";
	window.smenu = "misc";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
	//iux_update('C');	iux_update_local();
});

function iux_set_onclick_local()
{
	for(var articleName in config_data){
		if(config_data.hasOwnProperty(articleName) && articleName != ""){
			if($('#'+articleName).find('select').length != 0)	continue;
			$("#"+articleName).unbind('click').on('click', function(){
				load_rightpanel(this.id);
			}).on("mousedown touchstart", function() {
				$(this).find('a').addClass("animation_blink")
				.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
					$(this).removeClass("animation_blink");
				});
			});
		}
	}
	listener_add_local('autosaving');
	listener_add_local('apcplan');
	listener_add_local('macclonegiga');
	listener_add_local('fakedns');
	listener_add_local('upnp');
}

function iux_update_local(identifier)
{
	var aname = $("#right_content :first-child").attr('id');
	for(var articleName in config_data){
		if(config_data.hasOwnProperty(articleName) && articleName != ""){
			var caller_func = iux_update_local_func[articleName];
			if(caller_func)	caller_func.call(this, identifier, (aname == articleName)?true:false);
		}
	}
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, localdata)
{
	//if(submit_local_func[service_name].call(this, localdata)){
	//	if(!localdata){iux_update('C');	iux_update_local();}
	//}
	submit_local_func[service_name].call(this, localdata);
}

function load_rightpanel(_aname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+_aname+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');	
				load_header(RIGHT_HEADER, _aname);
				iux_update("C");
				iux_update("S");
				listener_add_local(_aname);
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		});
}


