var FIRMUP_CHK_NOACTION = 0;
var FIRMUP_CHK_TRYING = 1;
var FIRMUP_CHK_FOUND_NEW_VERSION = 3;
var FIRMUP_CHK_NO_NEED_UPDATE = 4;
var FIRMUP_CHK_FAILED = 5;
var FIRMUP_CANT_CHK_BY_INTERNET = 6;
var	FIRMUP_CANT_CHK_BY_INTERNET2 = 7;
var FIRMUP_CHK_VERSION_FILE = "/tmp/firmup_ver";
var FIRMUP_COMP_FAILED = -1;
var FIRMUP_COMP_NONEED = -2;

//auto;
var FIRMUP_STATUS_NOACTION =  0;
var FIRMUP_STATUS_START_UPGRADE = 1;
var FIRMUP_STATUS_CHECKING_VERSION = 2;
var FIRMUP_STATUS_DOWNLOADING_FIRMWARE = 3;
var FIRMUP_STATUS_CHECKING_FIRMWARE = 4;
var FIRMUP_STATUS_WRITING_FIRMWARE = 5;
var FIRMUP_STATUS_DONE = 6;
var FIRMUP_STATUS_DOWNLOAD_FIRMWARE_FAILED  = 10;
var FIRMUP_STATUS_CHECKING_FIRMWARE_FAILED = 11;
var FIRMUP_STATUS_CHECKING_VERSION_FAILED = 12;
var FIRMUP_STATUS_WRITING_FAILED  = 13;
var FIRMUP_STATUS_DOWNLOAD_CANCEL_FAILED = 14;
var FIRMUP_STATUS_WRITE_COMMAND = 100;

var DOWNLOAD_TEMP_FIRMWARE = "/tmp/firmware";

var REBOOT_TIME = 30;

//manual;
var UPGRADE_NORMAL = 0
var UPGRADE_STARTED = 1;
var UPGRADE_FILE_WRITE_END = 2;
var UPGRADE_CHECKING_FILE = 3;
var UPGRADE_INVALID_FILE = 4;
var UPGRADE_FILE_IS_GOOD = 5;
var UPGRADE_FLASH_WRITE_START = 6;
var UPGRADE_FLASH_WRITING = 7;
var UPGRADE_FLASH_WRITE_END = 8;
var UPGRADE_REBOOTING = 9;
var UPGRADE_SMALL_FILE = 10;

// JavaScript Document
var stopstatus_iux = false;
var local_change_value;
var init_func = [];
var listener_local_func=[];
var submit_local_func = [];
var result_submit_func = [];
var localpostdata = [];

var newversionvalue = "";
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "sysconf"; window.smenu = "swupgrade";
	make_M_lang(S_lang, D_lang);

	iux_init(window.tmenu, window.smenu, null, 3000 , true);
});

function loadLocalPage()
{
	init();
	listener_local();
}

function result_config()
{
}

function init(actname) { actname ? init_func[actname].call() : init_func['main'].call(); }
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['main'].call(); }
function submit_local(actname) { submit_local_func[actname].call(); }
function result_submit(act, result) {}

init_func['main'] = function()
{
	iux_update("C");
	var cversion = config_data.routerinfo.cversion;
	var cbuilddate = config_data.routerinfo.cbuilddate;
	$('[sid="CVERSION"]').html('<p>'+cversion+'</p>');
	$('[sid="CBUILDDATE"]').html('<p>'+cbuilddate+'</p>');
	
	ctr_enable('SUBMIT_BUTTON', false);
	var firmuptype = config_data.routerinfo.firmuptype == "1" ? 1:0;
	get_init_status_field_msg(firmuptype);
	if(firmuptype)
	{
		$('[sid="FIRMUPTYPE_FIELD"]').show();
		findfirm();
	}
	else
		$('[sid="FIRMUPTYPE_FIELD"]').hide();
	

	var devicetype = config_data.routerinfo.devicetype == "0"? 0:1;
	var restoreurl = config_data.routerinfo.restoreurl + "";
	if(devicetype == 0)
		$('[sid="ROUTER_RESTORE"]').html('<a href="'+restoreurl+'"><p sid="S_MAIN_CAUTION_DESC4" style="margin-left: 0.6em; color: #6799FF; text-decoration: none ! important;""></p></a>');
	else
		$('[sid="ROUTER_RESTORE"]').html('<p sid="S_MAIN_CAUTION_DESC4" style="margin-left: 0.6em; color: #6799FF;"></p>');
	

	iux_update("S");
};	

listener_local_func['main'] = function()
{
	$('[sid="C_ROUTERINFO_FIRMUPTYPE"]').unbind('change').change(function() {
		var firmuptype =  $("[sid='C_ROUTERINFO_FIRMUPTYPE']:checked").val();
		get_init_status_field_msg(firmuptype);
	});
	//FIRMWAREFILE_SELECT
	$('[sid="FIRMWAREFILE_SELECT"]').unbind('change').change(function() {
                if( this.files && this.files[0] && this.files[0].size > config_data.routerinfo.maxfirmsize )
                {
                        alert(M_lang["S_INVALID_FILE_ALERT"]);
                        this.value = "";
                }
		var filename = $(this).val()+"";
		if(filename){filename = filename.substr(filename.lastIndexOf("\\")+1, filename.length);}
		$('[sid="FIRMWAREFILE_NAME"]').val($(this).val()?filename:M_lang['S_SELECT_FIRMFILE']);
		//console.log('filename : '+filename);

	});
	$('[sid="SUBMIT_BUTTON"]').unbind('click').click(function()
	{
		var firmuptype =  $("[sid='C_ROUTERINFO_FIRMUPTYPE']:checked").val();
		if( firmuptype == "1")
			submit_local('auto_startfirmup');
		else
			submit_local('manual_apply');
	});
};

submit_local_func['auto_startfirmup'] = function()
{
	localpostdata = [];
	localpostdata.push({name : '', value : '' });
	stopstatus_iux = false;
	get_status_iux(window.tmenu, window.smenu, {name : 'type', value : 'auto_startfirmup' }); 
	all_ctr_enable(false);
	$("#loading").popup("open");
	iux_submit('auto_startfirmup' , localpostdata, true);
};

submit_local_func['manual_apply'] = function()
{
	var filename =$('[sid="FIRMWAREFILE_SELECT"]').val()+"";
	if(!filename || filename == "")	{
		alert(M_lang["S_MANUAL_FIRMUP_NO_SELECT_FIREWAREFILE"]);
		stopstatus_iux = true;
		return;
	}
	stopstatus_iux = false;
	all_ctr_enable(false);
	$("#loading").popup("open");
	local_fileform_submit();
	get_start_manualfirmup_status( UPGRADE_STARTED );
	setTimeout( function() {
		get_status_iux(window.tmenu, window.smenu, {name : 'type', value : 'manual' }); 
	}, 500 );
};

function get_init_status_field_msg(flag)
{
	if( parseInt(flag) )
	{	
		if( stopstatus_iux == true)
			findfirm();

		$('[sid="RESTOREFILE_FIELD"]').hide();
		$('[sid="SUBMIT_BUTTON"]').html('<p>'+M_lang["S_BUTTON_AUTO"]+'</p>');
	
		if(status_data)	{
			var readyfirmup  = status_data.upgradeinfo.readyfirmup;
			get_ready_firmup_status(readyfirmup);
		}
	}
	else
	{	
		
		stopstatus_iux = true

		$('[sid="FIRMWAREFILE_SELECT"]').val();
		ctr_enable('SUBMIT_BUTTON', true);

		$('[sid="RESTOREFILE_FIELD"]').show();
		$('[sid="SUBMIT_BUTTON"]').html('<p>'+M_lang["S_BUTTON_MANUAL"]+'</p>');
		
		$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_MANUAL_DESC1']+'</p>'
		+ '<p>'+M_lang['S_FIRMUP_MANUAL_DESC2']+'</p>'
		+ '<p>'+M_lang['S_FIRMUP_MANUAL_DESC3']+'</p>'
		+ '<p>'+M_lang['S_FIRMUP_MANUAL_DESC4']+'</p>');
		$('[sid="FIRMWAREFILE_NAME"]').val(M_lang['S_SELECT_FIRMFILE']);
		
	}
}

function get_ready_firmup_status(statusvalue)
{
	switch( parseInt(statusvalue) )
	{
		case FIRMUP_CHK_NOACTION:
		case FIRMUP_CHK_TRYING:
			var product_name = config_data.routerinfo.product_name;
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+product_name+M_lang['S_FIRMUP_CHK_TRYING']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			ctr_enable('SUBMIT_BUTTON', false);
			break;
		case FIRMUP_CHK_FOUND_NEW_VERSION:
			newversionvalue = status_data.upgradeinfo.newversion;
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_CHK_FOUND_NEW_VERSION1']+newversionvalue+M_lang['S_FIRMUP_CHK_FOUND_NEW_VERSION2']+'</p>');
			//+ '<p>'+M_lang['S_FIRMUP_CHK_FOUND_NEW_VERSION3']+'</p>'
			//+ '<p>'+M_lang['S_FIRMUP_CHK_FOUND_NEW_VERSION4']+'</p>');
			ctr_enable('SUBMIT_BUTTON', true);
			stopstatus_iux = true;
			status_data.upgradeinfo.readyfirmup = 0;
			break;
		case FIRMUP_CHK_NO_NEED_UPDATE:
			var cversion = config_data.routerinfo.cversion;
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_CHK_NO_NEED_UPDATE1']+cversion+M_lang['S_FIRMUP_CHK_NO_NEED_UPDATE2']+'</p>');
			ctr_enable('SUBMIT_BUTTON', false);
			stopstatus_iux = true;
			status_data.upgradeinfo.readyfirmup = 0;
			break;
		case FIRMUP_CHK_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_CHK_FAILED1']+'</p>'
			+ '<p>'+M_lang['S_FIRMUP_CHK_FAILED2']+'</p>');
			ctr_enable('SUBMIT_BUTTON', false);
			stopstatus_iux = true;
			status_data.upgradeinfo.readyfirmup = 0;
			break;
		case FIRMUP_CANT_CHK_BY_INTERNET:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_CANT_CHK_BY_INTERNET_D1']+'</p>'
			+ '<p>'+M_lang['S_FIRMUP_CANT_CHK_BY_INTERNET_D2']+'</p>');
			ctr_enable('SUBMIT_BUTTON', false);
			stopstatus_iux = true;
			status_data.upgradeinfo.readyfirmup = 0;
			break;
		case FIRMUP_CANT_CHK_BY_INTERNET2:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_CANT_CHK_BY_INTERNET2_d1']+'</p>'
			+ '<p>'+M_lang['S_FIRMUP_CANT_CHK_BY_INTERNET2_d2']+'</p>'
			+ '<p>'+M_lang['S_FIRMUP_CANT_CHK_BY_INTERNET2_d3']+'</p>');
			ctr_enable('SUBMIT_BUTTON', false);
			stopstatus_iux = true;
			status_data.upgradeinfo.readyfirmup = 0;
			break;
	}

}

function get_start_manualfirmup_status(_statusvalue)
{
	var statusvalue = parseInt(_statusvalue);
	if(statusvalue != 0);
		$("#loading").popup("close");

	switch( parseInt(statusvalue) )
	{
		case UPGRADE_STARTED:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_UPGRADE_STARTED']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case UPGRADE_FILE_WRITE_END:
		case UPGRADE_CHECKING_FILE:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_UPGRADE_CHECKING_FILE']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case UPGRADE_FILE_IS_GOOD:
		case UPGRADE_FLASH_WRITE_START:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
			+ '<div><p>'+M_lang['S_UPGRADE_FLASH_WRITE_START']+'</p></div>'
			+ '<div style="clear: both; margin-right: 0.5em;">'
			+ '<div sid="TIMEOUT"></div>'
			+ '<div><p>'+M_lang['S_MAIN_TIMELIMIT']+'</p></div></div>'
			+ '<div><img src="/common/images/loading.gif"></div></div>');
			var duration = config_data.routerinfo.firmup_duration;
			reboot_timer(duration);
			stopstatus_iux = true;
			break;
		case UPGRADE_INVALID_FILE:
			if( config_data.routerinfo.rebootForInvalidFile == "1" )
			{
				$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
				+ '<p>'+M_lang['S_UPGRADE_INVALID_FILE1']+'</p>'
				+ '<p>'+M_lang['S_UPGRADE_INVALID_FILE2']+'</p>'
				+ '<p>'+M_lang['S_UPGRADE_INVALID_FILE3']+'</p>'
				+ '<div style="clear: both; margin-right: 0.5em;">'
				+ '<div><p>'+M_lang['S_UPGRADE_INVALID_FILE4']+'(</p></div>'
				+ '<div sid="TIMEOUT"></div>'
				+ '<div><p>'+M_lang['S_MAIN_TIMELIMIT']+')</p></div></div>'
				+ '<div><img src="/common/images/loading.gif"></div></div>');
				reboot_timer( config_data.routerinfo.rebootsec, true);
				//all_ctr_enable(true);
				stopstatus_iux = true;
				break;
			}
		case UPGRADE_SMALL_FILE:
			$('[sid="STATUS_FIELD"]').html([
				'<div class="status_search_for_firmware">',
					'<p>', M_lang['S_UPGRADE_INVALID_FILE1'], '</p>',
					'<p>', M_lang['S_UPGRADE_INVALID_FILE2'], '</p>',
				'</div>'].join(""));
			all_ctr_enable(true);
			break;
	}
}

function get_start_autofirmup_status(_statusvalue)
{
	var statusvalue = parseInt(_statusvalue);
	if(statusvalue != 0);
		$("#loading").popup("close");

	switch( parseInt(statusvalue) )
	{
		case FIRMUP_STATUS_START_UPGRADE:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_FIRMUP_STATUS_START_UPGRADE']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case FIRMUP_STATUS_CHECKING_VERSION:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_FIRMUP_STATUS_CHECKING_VERSION']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case FIRMUP_STATUS_DOWNLOADING_FIRMWARE:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_FIRMUP_STATUS_DOWNLOADING_FIRMWARE']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case FIRMUP_STATUS_CHECKING_FIRMWARE:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_FIRMUP_STATUS_CHECKING_FIRMWARE']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');
			break;
		case FIRMUP_STATUS_WRITING_FIRMWARE:
		case FIRMUP_STATUS_WRITE_COMMAND:
			var newversion = status_data.upgradeinfo.newversion;
			
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
			+ '<div><p>'+M_lang['S_FIRMUP_STATUS_WRITING_FIRMWARE1']+newversionvalue+M_lang['S_FIRMUP_STATUS_WRITING_FIRMWARE2']+'</p></div>'
			+ '<div style="clear: both; margin-right: 0.5em;">'
			+ '<div sid="TIMEOUT"></div>'
			+ '<div><p>'+M_lang['S_MAIN_TIMELIMIT']+'</p></div></div>'
			+ '<div><img src="/common/images/loading.gif"></div></div>');
			var duration = config_data.routerinfo.firmup_duration;
			reboot_timer(duration);
			stopstatus_iux = true;
			break;
		case FIRMUP_STATUS_DONE:
			$('[sid="STATUS_FIELD"]').html('<div class="status_search_for_firmware">'
            + '<div><p>'+M_lang['S_UPGRADE_CHECKING_FILE']+'</p></div>'
            + '<div><img src="/common/images/loading.gif"></div></div>');

			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_STATUS_DONE']+'</p>');
			all_ctr_enable(true);
			stopstatus_iux = true;
			break;
		case FIRMUP_STATUS_DOWNLOAD_FIRMWARE_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_IRMUP_STATUS_DOWNLOAD_FIRMWARE_FAILED']+'</p>');
			all_ctr_enable(true);
			stopstatus_iux = true;
		case FIRMUP_STATUS_DOWNLOAD_CANCEL_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_STATUS_DOWNLOAD_CANCEL_FAILED']+'</p>');
			all_ctr_enable(true);
			stopstatus_iux = true;
			break;
		case FIRMUP_STATUS_CHECKING_FIRMWARE_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_STATUS_CHECKING_FIRMWARE_FAILED']+'</p>');
			all_ctr_enable(true);
			stopstatus_iux = true;
			break;
		case FIRMUP_STATUS_CHECKING_VERSION_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_STATUS_CHECKING_VERSION_FAILED']+'</p>');
			set_firmup_status(FIRMUP_STATUS_NOACTION);
			all_ctr_enable(true);
			stopstatus_iux = true;
			break;
		case FIRMUP_STATUS_WRITING_FAILED:
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_STATUS_WRITING_FAILED']+'</p>');
			set_firmup_status(FIRMUP_STATUS_NOACTION);
			all_ctr_enable(true);
			stopstatus_iux = true;
			break;
	}
}

function iux_update_local(id)
{	
	if(status_data)
	{
		var firmuptype =  $("[sid='C_ROUTERINFO_FIRMUPTYPE']:checked").val();
		if( parseInt(firmuptype) == 1 )
		{
				var readyfirmup  = status_data.upgradeinfo.readyfirmup;
				if(readyfirmup)
				{
					get_ready_firmup_status(readyfirmup);
					//console.log('readyfirmup : '+readyfirmup);
				}
				var startfirmup  = status_data.upgradeinfo.startfirmup;
				if(startfirmup)
				{	
					get_start_autofirmup_status(startfirmup);
					//console.log('startfirmup : '+startfirmup);
				}
		}
		else
		{
			var startfirmup  = status_data.upgradeinfo.startfirmup;
			get_start_manualfirmup_status(startfirmup);
			//console.log('startfirmup : '+startfirmup);
		}
	}
}

function ctr_enable(sid, flag)
{
	$('[sid="'+sid+'"]').each(function()
	{
		if(flag == true) {
			$(this).removeAttr('readonly');
			$(this).parent().removeClass("ui-state-disabled");
			$(this).removeAttr('disabled');
		}
		else 
		{
			$(this).prop('readonly',true);
			$(this).parent().addClass("ui-state-disabled");
			$(this).attr('disabled',true);
		}
	});
}
function all_ctr_enable(flag)
{
	ctr_enable('C_ROUTERINFO_FIRMUPTYPE', flag);
	ctr_enable('FIRMWAREFILE_NAME', flag);
	ctr_enable('SEARCH_BUTTON', flag);
	ctr_enable('SUBMIT_BUTTON', flag);
	ctr_enable('TOPMENU_BUTTON', flag);
	ctr_enable('MENU_BUTTON', flag);
	if(flag == true){
		$('[sid=\"TOPMENU_BUTTON\"]').parent().removeAttr('style');
		$('[sid=\"MENU_BUTTON\"]').parent().removeAttr('style');
	}else{
		$('[sid=\"TOPMENU_BUTTON\"]').parent().attr('style', 'background-color:inherit !important;');
		$('[sid=\"MENU_BUTTON\"]').parent().attr('style', 'background-color:inherit !important;');
	}
}
	
function findfirm()
{
	$.ajaxSetup({ timeout: 3000  });
	$.getJSON('/cgi/iux_get.cgi', {
		tmenu : window.tmenu,
		smenu : window.smenu,
		act : "findfirm"
	})
	.always(function() {
		stopstatus_iux = false;
		get_status_iux(window.tmenu, window.smenu, {name : 'type', value : 'auto_readyfirmup' }); 
	});
}

function local_fileform_submit()
{
	var postData = new FormData($('#iux_file_form')[0]);
	postData.append("tmenu",window.tmenu);
	postData.append("smenu",window.smenu);
	postData.append("act",'manual_apply');
	$.ajax({
		url: '/cgi/iux_set.cgi',
		processData: false,
		contentType: false,
		data: postData,
		cache: false,
		type: 'POST',
		timeout: 300000,
		success: function(data){},
		error: function(jqXHR, testStatus, errorThrown){}
	});
}

function get_status_iux(_tmenu, _smenu, _args, _retime)
{
	$.ajaxSetup({async : true, timeout : 4000});
	var _data = [];
	_data.push({name : "tmenu", value : eval("_tmenu")});
	_data.push({name : "smenu", value : eval("_smenu")});
	_data.push({name : "act", value : "status"});
	if(_args){
		_data.push(_args);
	}
	$.getJSON('/cgi/iux_get.cgi', _data)
	.done(function(data) {
		if(json_validate(data, '') == true)
			status_data = data;
	})

	.fail(function(jqxhr, textStatus, error) {
	})
	.always(function()
	{
		if(stopstatus_iux)
			return;
		iux_update("D");
		setTimeout(function(_tm, _sm, _ar,_rt){
			get_status_iux(_tm, _sm, _ar,_rt);
		},(_retime?_retime:1000), _tmenu, _smenu, _args,_retime);
	});
}

function reboot_timer(_remaining, rebootflag)
{
	var remaining = parseInt(_remaining);
	if(remaining == 0)
	{	
		all_ctr_enable(true);
		if(rebootflag)
		{
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_REBOOT_COMPLETED']+'</p>');
			location.reload();
		}
		else
		{
			$('[sid="STATUS_FIELD"]').html('<p>'+M_lang['S_FIRMUP_COMPLETED']+'</p>');
			var httpauth = config_data.routerinfo.httpauth == '1'?1:0;
			if(httpauth == 1)
				$(location).attr('href','/m_login.cgi?logout=1');
			else
				$(location).attr('href','/login/login.cgi');
		}
		
		

	}
	else{
		$('[sid="TIMEOUT"]').html('<p>'+remaining+'</p>');
		remaining --;
		setTimeout("reboot_timer("+remaining+","+rebootflag+")",1000);
	}
}
