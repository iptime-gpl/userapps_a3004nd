// JavaScript Document
/*
var submit_local_func = [];
var init_func = [];
var result_submit_func = [];
var listener_local_func=[];
var localpostdata = [];
var submit_local_func=[];
var current_status_data = [];
var data_local = [];

var regExp_kor32 = /^([ㄱ-ㅎ]|[ㅏ-ㅣ]|[가-힣]|[0-9a-zA-Z]|[@#()_-]){1,32}$/;+
var regExp_http = ^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$
*/

var local_change_value;
var init_func = [];
var listener_local_func=[];
var submit_local_func = [];
var result_submit_func = [];
var localpostdata = [];
var regExp_string = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;

var regExp_http = /[\{\}\[\];|*~`!^+<>@$%\\\'\"]/g;

//var regExp_http = /^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$/;
var regExp_cycle =  /^[0-9]{1,3}$/;
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "advertise";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 60000);
	
});

function loadLocalPage()
{
	init();
	/*
	listener_local();
	*/
}

function result_config()
{
}

function init(actname) { actname ? init_func[actname].call() : init_func['main'].call(); }
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['main'].call(); }
function submit_local(actname) { submit_local_func[actname].call(); }
function result_submit(act, result) { result_submit_func[act].call(this, result); }
function confirm_result_local(flag)
{
	if(flag)
	{

	}
}
init_func['main'] = function()
{
	iux_update("C");

	var freedevicelist = config_data.freedevicelist;
	var cfreedevicelist = freedevicelist.length > 0 ? freedevicelist.length-1:0;
	
	$('[sid="FREEDEVICE_LIST"]').find('li').remove();
	if(cfreedevicelist != 0)
	{	
		for (var i=0;i<cfreedevicelist;i++)
		{
			var ip = config_data.freedevicelist[i].ip.split('-');
			var endip = ip[1].split('.');
			var count = i+1;
			$('[sid="FREEDEVICE_TITLE"]').show();
			
			if( ip[0] != ip[1] )
			{
				$('[sid="FREEDEVICE_LIST"]').append('<li><div class="idx"><p>'+count+'</p></div>' 
				+ '<div class="ip"><div style="width: 8em;"><p>'+ip[0]+'</p></div><div style="width: 1em;"><p>~</p></div><div style="width: 2em;"><p>'+endip[3]+'</p></div></div>'
				+ '<div class="desc"><p>'+freedevicelist[i].desc+'</p></div></li>');
			}
			else
			{
				$('[sid="FREEDEVICE_LIST"]').append('<li><div class="idx"><p>'+count+'</p></div>' 
				+ '<div class="ip"><div style="width: 8em;"><p>'+ip[0]+'</p></div><div style="width: 1em;"><p></p></div><div style="width: 2em;"><p></p></div></div>'
				+ '<div class="desc"><p>'+freedevicelist[i].desc+'</p></div></li>');
											 
			}


		}
		$('[sid="FREEDEVICE_LIST"] li:even').css("background-color","#FFFFFF");
		$('[sid="FREEDEVICE_LIST"] li:odd').css("background-color","#F9FAF5");
	}
	else
	{
		$('[sid="FREEDEVICE_TITLE"]').hide();
	}

	$('[sid="M_ADVERTISE_REDIRURL"]').val(config_data.advertise.redirurl);
	
	var status = config_data.advertise.redir == 1? 1:0;
	if(status)
		$('[sid="S_ADVERISE_STATUS"]').html('<p sid="S_STARTED_STATUS"></p>');
	else
		$('[sid="S_ADVERISE_STATUS"]').html('<p sid="S_STOPPED_STATUS"></p>');

	iux_set_onclick_local("apply");
	iux_set_onclick_local("add");
	iux_set_onclick_local("del");
	iux_update("S");
	
};	
init_func['apply'] = function()
{
	iux_update("C");

	$('[sid="C_ADVERTISE_CYCLE"]').attr('placeholder',"");
	$('[sid="C_ADVERTISE_REDIRURL"]').attr('placeholder',M_lang["S_ADVERTISE_REDIRURL"]);
	$('[sid="C_ADVERTISE_BTNMSG"]').attr('placeholder',M_lang["S_ADVERTISE_BTNMSG"]);
	$('[sid="C_ADVERTISE_USERMSG"]').attr('placeholder',M_lang["S_ADVERTISE_USERMSG"]);
	$('[sid="C_ADVERTISE_USERMSG2"]').attr('placeholder',M_lang["S_ADVERTISE_USERMSG2"]);
	$('[sid="C_ADVERTISE_WHITELIST"]').attr('placeholder',M_lang["S_ADVERTISE_WHITELIST"]);

	var redir = config_data.advertise.redir == "1" ? "on": "off";
	$("#redir_" + redir).prop("checked", "true").checkboxradio("refresh");

	var autoconfirm = config_data.advertise.autoconfirm == "1" ? "on": "off";
	$("#autoconfirm_" + autoconfirm).prop("checked", "true").checkboxradio("refresh");
	
	if( autoconfirm == "on" )
		$('[sid="AUTOCONFIRM_ITEM"]').hide();
	else
		$('[sid="AUTOCONFIRM_ITEM"]').show();

	ctr_enable('SUBMIT_BUTTON', check_change_value());
	iux_update("S");
};

listener_local_func['apply'] = function()
{
	$('[sid="LC_REDIR"]').change(function() {
		ctr_submit_button();
	});

	$('[sid="C_ADVERTISE_REDIRURL"]').keyup(function() { ctr_submit_button(); });
	$('[sid="LC_AUTOCONFIRM"]').change(function() {
		var autoconfirm = $('[sid="LC_AUTOCONFIRM"]:checked').val();

		if(parseInt(autoconfirm) == 1) {
			$('[sid="AUTOCONFIRM_ITEM"]').hide();
			ctr_enable('AUTOCONFIRM_ITEM', false, true);
		}
		else {
			$('[sid="AUTOCONFIRM_ITEM"]').show();
			ctr_enable('AUTOCONFIRM_ITEM', true, true);
		}
		ctr_submit_button();
	});
	$('[sid="C_ADVERTISE_CYCLE"]').keyup(function() { ctr_submit_button(); 	});
	$('[sid="C_ADVERTISE_BTNMSG"]').keyup(function() { ctr_submit_button(); });
	$('[sid="C_ADVERTISE_USERMSG"]').keyup(function() { ctr_submit_button(); });
	$('[sid="C_ADVERTISE_USERMSG2"]').keyup(function() { ctr_submit_button(); });
	$('[sid="C_ADVERTISE_WHITELIST"]').keyup(function() { ctr_submit_button(); });
	$('[sid="WHITELIST_DESC"]').click(function() { $("#whitelist_desc").popup("open"); });
	$('[sid="SUBMIT_BUTTON"]').click(function() { submit_local('apply'); });
};

submit_local_func['apply'] = function()
{
	//check_textfield_value(sid, regExp, regExptype, nullcheckflag, insertaddrflag, directstringvalue)
	if(!check_textfield_value('C_ADVERTISE_REDIRURL', regExp_http, 'unpermitted', true))
		return;
	
	var cyclevalue = $('[sid="C_ADVERTISE_CYCLE"]').val();
	
	if(!cyclevalue && cyclevalue == "" )
	{
		//localpostdata = [];
		//localpostdata.push({name : 'cycle', value : "0" });
		$('[sid="C_ADVERTISE_CYCLE"]').val("0");
	}
	else
	{	
		if(!check_textfield_value('C_ADVERTISE_CYCLE', regExp_cycle, 'match'))
		return;
	}
	
	
	if(!check_textfield_value('C_ADVERTISE_BTNMSG', regExp_string, 'unpermitted'))
		return;
	if(!check_textfield_value('C_ADVERTISE_USERMSG', regExp_string, 'unpermitted'))
		return;
	if(!check_textfield_value('C_ADVERTISE_USERMSG2', regExp_string, 'unpermitted'))
		return;
	if(!check_textfield_value('C_ADVERTISE_WHITELIST', regExp_http, 'unpermitted'))
		return;

	$("#loading").popup("open");
	iux_submit('apply', null, null, null,'local_apply_form');
};

result_submit_func['apply'] = function(result)
{
	init_func['main'].call();
	init_func['apply'].call();
};








init_func['add'] = function()
{
	iux_update("C");
	
	
	$('[sid="ADD_DESC"]').attr('placeholder',M_lang["S_ADD_DESC"]);

	var netmask = config_data.advertise.netmask;
	var gateway = config_data.advertise.gateway;
	insert_ipaddr('ADD_SIP', gateway, netmask);
	insert_ipaddr('ADD_EIP', gateway, netmask);

	$('[sid="ADD_DESC"]').val("");

	iux_update("S");
};


listener_local_func['add'] = function()
{
	$('[sid="SUBMIT_BUTTON"]').click(function() { submit_local('add'); });
};

submit_local_func['add'] = function()
{
	var sip = convert_textfield_to_string('ADD_SIP');
	var eip = convert_textfield_to_string('ADD_EIP');
	var gateway = config_data.advertise.gateway;
	var netmask = config_data.advertise.netmask;

	if( !check_textfield_value('ADD_SIP', regExp_ip, 'match', false, sip) )
		return;
	
	if( check_input_error(eip, regExp_ip, 'match') )
		eip = sip;

	//if(sip != eip && !check_textfield_value('ADD_EIP', regExp_ip, 'match', false, eip) )
	//	return;
		
	if( !check_ip_range(sip, eip, netmask) )
	{
		alert(M_lang['S_ERROR_IPRANGE'], M_lang['S_POPUP_TITLE_ERROR']);
		insert_ipaddr('ADD_SIP', gateway, netmask);
		insert_ipaddr('ADD_EIP', gateway, netmask);
		return;
	}


	var ipadding = sip + '-' + eip;


	var freedevicelist = config_data.freedevicelist;
	var cfreedevicelist = freedevicelist.length > 0 ? freedevicelist.length-1:0;
	if(cfreedevicelist != 0)
	{	
		for (var i=0;i<cfreedevicelist;i++)
		{
			if( ipadding == freedevicelist[i].ip )
			{
				alert(M_lang['S_ERROR_REGIST_IP'], M_lang['S_POPUP_TITLE_ERROR']);
				insert_ipaddr('ADD_SIP', gateway, netmask);
				insert_ipaddr('ADD_EIP', gateway, netmask);
				return;
			}
		}
	}
	if(!check_textfield_value('ADD_DESC', regExp_string, 'unpermitted', true))
		return;

	localpostdata = [];
	localpostdata.push({name : 'sip', value : sip });
	localpostdata.push({name : 'eip', value : eip });

	$("#loading").popup("open");
	iux_submit('add', localpostdata, true, null,'local_add_form');
};

result_submit_func['add'] = function(result)
{
	init_func['main'].call();
	init_func['add'].call();
};

function check_ip_range(sip, eip, subnet)
{
	if(sip == eip)
		return true;

	var s_sip = sip.split(".");
	var s_eip = eip.split(".");
	var s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(s_subnet[i] != "255" && s_sip[i] > s_eip[i] )
		{
			return false;
		}
	}
	return true;
}

init_func['del'] = function()
{
	iux_update("C");

	var freedevicelist = config_data.freedevicelist;
	var cfreedevicelist = freedevicelist.length > 0 ? freedevicelist.length-1:0;
	
	$('[sid="RIGHT_FREEDEVICE_LIST"]').find('li').remove();
	if(cfreedevicelist != 0)
	{	
		for (var i=0;i<cfreedevicelist;i++)
		{
			var ip = config_data.freedevicelist[i].ip.split('-');
			var endip = ip[1].split('.');
			var count = i+1;
			$('[sid="RIGHT_FREEDEVICE_ITEM"]').show();
			if( ip[0] != ip[1] )
			{
				$('[sid="RIGHT_FREEDEVICE_LIST"]').append('<li><div sid="RLIST_'+i+'" style="width: 90%;"><div class="idx"><p>'+count+'</p></div>'
				+ '<div class="ip"><div style="width: 8em;"><p>'+ip[0]+'</p></div><div style="width: 1em;"><p>~</p></div><div style="width: 2em;"><p>'+endip[3]+'</p></div></div>'
				+ '<div class="desc"><p>'+freedevicelist[i].desc+'</p></div></div>'
				+ '<div class="ui-alt-icon check"><input name="deviceip" sid="CHECK_'+i+'" id="check_'+i+'" type="checkbox" value="'+freedevicelist[i].ip+'">'
				+ '<label for="check_'+i+'"></label></div></li></div></li>');
			}
			else
			{
				$('[sid="RIGHT_FREEDEVICE_LIST"]').append('<li><div sid="RLIST_'+i+'" style="width: 90%;"><div class="idx"><p>'+count+'</p></div>'
				+ '<div class="ip"><div style="width: 8em;"><p>'+ip[0]+'</p></div><div style="width: 1em;"><p></p></div><div style="width: 2em;"><p></p></div></div>'
				+ '<div class="desc"><p>'+freedevicelist[i].desc+'</p></div></div>'
				+ '<div class="ui-alt-icon check"><input name="deviceip" sid="CHECK_'+i+'" id="check_'+i+'" type="checkbox" value="'+freedevicelist[i].ip+'">'
				+ '<label for="check_'+i+'"></label></div></li></div></li>');
			}




			rlist_listener(i);
		}
		$('[sid="RIGHT_FREEDEVICE_LIST"]').trigger('create');
		$('[sid="RIGHT_FREEDEVICE_LIST"] li:even').css("background-color","#FFFFFF");
		$('[sid="RIGHT_FREEDEVICE_LIST"] li:odd').css("background-color","#F9FAF5");
		$('[sid="RIGHT_FREEDEVICE_LIST"] .ui-checkbox:even label').css("background-color","#FFFFFF");
		$('[sid="RIGHT_FREEDEVICE_LIST"] .ui-checkbox:odd label').css("background-color","#F9FAF5");
	}
	else
	{
		$('[sid="RIGHT_FREEDEVICE_ITEM"]').hide();
	}
	$('[sid="ALL_CHECK"]').removeAttr('checked').checkboxradio("refresh");
	iux_update("S");
};

function rlist_listener(i)
{
	$('[sid="RLIST_'+i+'"]').unbind();
	$('[sid="RLIST_'+i+'"]').click(function() 
	{
		var m_check = $('[sid="CHECK_'+i+'"]:checked').val();
		if(!m_check)
			$('[sid="RIGHT_FREEDEVICE_LIST"] [sid="CHECK_'+i+'"]').prop('checked', 'checked').checkboxradio("refresh");
		else
			$('[sid="RIGHT_FREEDEVICE_LIST"] [sid="CHECK_'+i+'"]').removeAttr('checked').checkboxradio("refresh");
	});	
	
}

listener_local_func['del'] = function()
{
	$('[sid="ALL_CHECK"]').change(function() {
	var m_checkall = $('[sid="ALL_CHECK"]:checked').val();
	if(m_checkall)
		$('[sid="RIGHT_FREEDEVICE_LIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="RIGHT_FREEDEVICE_LIST"] input').removeAttr('checked').checkboxradio("refresh");
	});
	$('[sid="SUBMIT_BUTTON"]').click(function() { submit_local('del'); });
};

submit_local_func['del'] = function()
{
	events.confirm({ msg: M_lang["S_CONFIRM_POPUP_DEL"], panelFlag: false, runFunc: function( flag ) {
		if( flag ) {
			$("#loading").popup("open");
			iux_submit('del', null, null, null,'local_del_form');
		}
	}});
	//$("#loading").popup("open");
	//iux_submit('del', null, null, null,'local_del_form');
};

result_submit_func['del'] = function(result)
{
	init_func['main'].call();
	init_func['del'].call();
};


function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	$('[sid="'+Uactname+'"]').unbind();
	$('[sid="'+Uactname+'"]').on('click', function() {
		load_rightpanel(actname); 
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
}

function load_rightpanel(actname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load('html/'+actname+'.html', function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success")
		{
			$(this).trigger('create');	
			load_header(RIGHT_HEADER, actname);
			init(actname);
			listener_local(actname);
		}
	});
}

function local_change_value()
{ 
	var result = 0;
	$("[sid^='LC_']").each(function()
	{
		var s_cid = $(this).attr('sid').toLowerCase().split('_');
		var config_val = eval('config_data.advertise.'+s_cid[1]);
		var current_val = $('option:selected' ,this).val();
		if( parseInt(config_val) != parseInt(current_val) )
			result = 1;
	});

	return result;
}

function iux_update_local(id)
{ 
}

function ctr_enable(sid, flag, textboxgroupflag)
{
	var option;
	if(textboxgroupflag)
		option = "input";
	else
		option = "";

	$('[sid="'+sid+'"] '+ option).each(function()
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

function ctr_submit_button()
{
	if( check_change_value() || local_change_value() )
		ctr_enable('SUBMIT_BUTTON', true);
	else
		ctr_enable('SUBMIT_BUTTON', false);
}

function whitelist_popup()
{
	$("#whitelist_desc").popup("close");
}

function insert_ipaddr(sid, ip, subnet)
{
	var s_ip;
	var s_subnet;
	if(ip)
		s_ip = ip.split(".");
	if(subnet) 
		s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(s_subnet[i] == "255")
		{
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
		}
		else
		{
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val("");
		}
			
	}	
}

function check_textfield_value(sid, regExp, regExptype, nullcheckflag, ipaddrvalue)
{
	if(!ipaddrvalue)
	var value =  $('[sid="'+sid+'"]').val();
	else
		value = ipaddrvalue;

	var Usid = sid.toUpperCase();
	if(nullcheckflag  && (!value || value == "" || value == "..." || value == ":::::") )
	{
		alert(M_lang['S_EMPTY_'+Usid], M_lang['S_POPUP_TITLE_ERROR']);
		return false;
	}

	if(regExp != "" && check_input_error(value, regExp, regExptype) )
	{
		alert(M_lang['S_ERROR_'+Usid], M_lang['S_POPUP_TITLE_ERROR']);
	
		if(ipaddrvalue)
		{
			var gateway = config_data.advertise.gateway;
			var netmask = config_data.advertise.netmask;
			insert_ipaddr(sid, gateway, netmask);
		}
		else
			$('[sid="'+sid+'"]').val("");
		
		return false;
	}
	return true;
}

function check_input_error(str, regExp, type)
{
	if(type == 'unpermitted'){if(str.match(regExp))	return true;}				//정규식과 다를때.
	else if(!type || type == 'match'){if(!str.match(regExp)) return true;}		//정규식이 맞았을대.
	return false;
}

function convert_textfield_to_string(sid)
{
	var type;
	if( $('[sid="'+sid+'"]').hasClass("ip") )
		type = "ip";
	else if( $('[sid="'+sid+'"]').hasClass("mac") )
		type = "mac";

	if(type == "ip")
	{
		var data = "";
		for(var i=0;i<4;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 3 ? data += "." : "";
		}
	}
	else
	{
		var data = "";
		for(var i=0;i<6;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 5 ? data += ":" : "";
		}
	}
	return data;
}

// function call  //

/*
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['main'].call(); }
function submit_local(actname,i) { submit_local_func[actname].call(this,i); }
function result_submit(act, result) { result_submit_func[act].call(this, result); }

init_func['main'] = function()
{
	iux_update("C");
	
	$('[sid="REMOTEPC_NAME"]').attr('placeholder',M_lang["S_MAIN_PLEASE_INPUT_DESC"]);

	var remotelist = config_data.wol.remotelist;
	var cremotelist = remotelist.length > 0 ? remotelist.length-1:0;
	
	if(cremotelist != 0)
	{
		$('[sid="REMOTELIST_ITEM"]').show();
		$('[sid="REMOTEPC_LIST"]').find('li').remove();
		for (var i=0;i<cremotelist;i++)
		{
			var count = i+1;
			$('[sid="REMOTEPC_LIST"]').append('<li class="lc_content_remotepc">'
			+ '<div class="lc_left">'
			+ '<div class="idx"><p>'+count+'</p></div>'
			+ '<div sid="LISTITEM_'+i+'" class="remotepc">'
			+ '<p>'+remotelist[i].name+'</p>'
			+ '<p class="mac">'+remotelist[i].macaddr+'</p>'
			+ '</div></div>'
		    + '<div class="lc_middle" sid="ON_'+i+'">'
			+ '<div class="lc_text"><p sid="S_MAIN_REMOTE_ON"></p></div>'
			+ '<div class="lc_icon"><img id="turn_on" src="/common/images/on.png"><img id="turn_loading" src="/common/images/loading.gif"></div></div>'
			+ '<div class="ui-alt-icon lc_right">'
			+ '<input name="sel_remotepc" sid="CHECK_'+i+'" id="check_'+i+'" type="checkbox" value="'+remotelist[i].macaddr+'">'
			+ '<label for="check_'+i+'"></label></div></li>');
			remote_listener(i, remotelist[i].macaddr);
			$('[sid="ON_'+i+'"] #turn_on').show();
			$('[sid="ON_'+i+'"] #turn_loading').hide();
		}
		$('[sid="REMOTEPC_LIST"]').trigger('create');
		$('[sid="REMOTEPC_LIST"] li:even').css("background-color","#FFFFFF");
		$('[sid="REMOTEPC_LIST"] li:odd').css("background-color","#F9FAF5");
		$('[sid="REMOTEPC_LIST"] .ui-checkbox:even label').css("background-color","#FFFFFF");
		$('[sid="REMOTEPC_LIST"] .ui-checkbox:odd label').css("background-color","#F9FAF5");
	}
	else
	{
		$('[sid="REMOTELIST_ITEM"]').hide();
		$('[sid="REMOTEPC_LIST"]').find('li').remove();
	}

	$('[sid="ALL_CHECK"]').removeAttr('checked').checkboxradio("refresh");
	$('[sid="CURRENTPC_CHECK"]').removeAttr('checked').checkboxradio("refresh");
	
	var band = config_data.wol.currentband;
	ctr_enable('CURRENTPC_CHECK', band);
	iux_set_onclick_local("maclist");
	iux_update("S");
	
};	

function remote_listener(i, macaddr)
{
	$('[sid="ON_'+i+'"]').unbind();
	$('[sid="ON_'+i+'"]').click(function() 
	{
		localpostdata = [];
		localpostdata.push({name : 'macaddr', value : macaddr });
		submit_local("wake",i);
	});
	
	$('[sid="LISTITEM_'+i+'"]').unbind();
	$('[sid="LISTITEM_'+i+'"]').click(function() 
	{
		var m_checkall = $('[sid="CHECK_'+i+'"]:checked').val();
		if(!m_checkall)
			$('[sid="REMOTEPC_LIST"] [sid="CHECK_'+i+'"]').prop('checked', 'checked').checkboxradio("refresh");
		else
			$('[sid="REMOTEPC_LIST"] [sid="CHECK_'+i+'"]').removeAttr('checked').checkboxradio("refresh");
	});	
}

listener_local_func['main'] = function()
{
	$('[sid="ALL_CHECK"]').change(function() {
	var m_checkall = $('[sid="ALL_CHECK"]:checked').val();
	if(m_checkall)
		$('[sid="REMOTEPC_LIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="REMOTEPC_LIST"] input').removeAttr('checked').checkboxradio("refresh");
	});
	//추가버튼
	$('[sid="ADD_BUTTON"]').click(function() 
	{
		 submit_local("add");
	});
	//삭제버튼
	$('[sid="DEL_BUTTON"]').click(function() 
	{
		 submit_local("del");
	});
	//서치버튼
	//현재피시
	$('[sid="CURRENTPC_CHECK"]').click(function() 
	{
		insert_addr('REMOTEPC_MAC', "", true);
		$('[sid="REMOTEPC_NAME"]').val("");

		var check_value = $('[sid="CURRENTPC_CHECK"]:checked').val();
		if(check_value)
		{
			var name = config_data.wol.currentname;
			var mac  = config_data.wol.currentmac;
			mac = mac.toUpperCase();
			
			insert_addr('REMOTEPC_MAC', mac, true);
			$('[sid="REMOTEPC_NAME"]').val(name);
		}
	});
//$('[sid="REMOTEPC_NAME"]').maxlength();
};
submit_local_func['add'] = function()
{
	var input_macaddr =  convert_textfield_to_string('REMOTEPC_MAC');
	
	if(!check_textfield_value('REMOTEPC_NAME', regExp_kor32))
		return;
	if(!check_textfield_value('REMOTEPC_MAC', regExp_mac, input_macaddr ,true))
		return;
	var localpostdata = [];
	localpostdata.push({name : 'macaddr', value : input_macaddr });
	$("#loading").popup("open");
	iux_submit('add' , localpostdata, true);
};
result_submit_func['add'] = function(result)
{
	if(result)
	{
		insert_addr('REMOTEPC_MAC', "", true);
		$('[sid="REMOTEPC_NAME"]').val("");
		init_func['main'].call();
	}
};
submit_local_func['del'] = function()
{
	$("#loading").popup("open");
	iux_submit('del');
};
result_submit_func['del'] = function(result)
{
	if(result)
		init_func['main'].call();
};
submit_local_func['wake'] = function(i)
{
	$('[sid="ON_'+i+'"] #turn_on').hide();
	$('[sid="ON_'+i+'"] #turn_loading').show();
	iux_submit('wake', localpostdata);
};
result_submit_func['wake'] = function(result)
{
	$('[sid^="ON_"] #turn_on').show();
	$('[sid^="ON_"] #turn_loading').hide();
};


init_func['maclist'] = function()
{
	iux_update("C");

	var maclist = data_local.maclist;
	var cmaclist = maclist.length > 0 ? maclist.length-1:0;

	if(cmaclist != 0)
	{
		$('[sid="RIGHT_MACLIST"]').find('li').remove();
		for (var i=0;i<cmaclist;i++)
		{
			$('[sid="RIGHT_MACLIST"]').append('<li sid="MACADDRIDX_'+i+'" class="lc_content_remotepc maclist_li">'
			+ '<div class="lc_left maclist_left">'
			+ '<p id="mac">'+maclist[i].hwaddr.toUpperCase()+'</p>'
			+ '<p id="ip" style="color: rgb(170, 170, 170);">'+maclist[i].ipaddr+'</p></div>'
			+ '<div class="lc_middle maclist_right">'
			+ '<p id="name" style="color: rgb(170, 170, 170);">'+maclist[i].hostname+'</p>'
			+ '</div></li>');
		}

		$('[sid="RIGHT_MACLIST"]').trigger('create');
		$('[sid="RIGHT_MACLIST"] li:even').css("background-color","#FFFFFF");
		$('[sid="RIGHT_MACLIST"] li:odd').css("background-color","#F9FAF5");
	}
	iux_update("S");
	
};	

listener_local_func['maclist'] = function()
{
	$("[sid^='MACADDRIDX_']").each(function()
	{
		$(this).unbind();
		$(this).click(function() {
			maddr_value_send_main($(this).attr('sid'));
		});
	});
	
	$('[sid="REFRESH_BUTTON"]').unbind();
	$('[sid="REFRESH_BUTTON"]').click(function() 
	{
		$("#loading").popup("open");
		get_maclist();
	});

};


function maddr_value_send_main(sid)
{ 
	var mac = $('[sid="'+sid+'"] #mac').text();
	var ip = $('[sid="'+sid+'"] #ip').text();
	var name = $('[sid="'+sid+'"] #name').text();
	insert_addr('REMOTEPC_MAC', mac, true);
	$('[sid="REMOTEPC_NAME"]').val(name);
	$("#right_panel").panel("close");
	$('[sid="ALL_CHECK"]').removeAttr('checked').checkboxradio("refresh");
	$('[sid="CURRENTPC_CHECK"]').removeAttr('checked').checkboxradio("refresh");
}
function iux_update_local(id)
{ 
}

function insert_addr(sid, value, flag)
{
	var count;
	var s_value;
	if(flag == true)
		count = 6;
	else
		count = 4;

	
	if(value && value != "")
	{	
		if(flag == true) // mac\
			s_value = value.split(":");
		else
			s_value = value.split(".");
	}
	else
	{
		if(flag == true) // mac\
			s_value = ["","","","","",""];
		else
			s_value = ["","","",""];
	}
	for(var i=0;i<count;i++)
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_value[i]);
}

function convert_textfield_to_string(sid)
{
	var type;
	if( $('[sid="'+sid+'"]').hasClass("ip") )
		type = "ip";
	else if( $('[sid="'+sid+'"]').hasClass("mac") )
		type = "mac";

	if(type == "ip")
	{
		var data = "";
		for(var i=0;i<4;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 3 ? data += "." : "";
		}
	}
	else
	{
		var data = "";
		for(var i=0;i<6;i++)
		{
			data += $('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val();
			i != 5 ? data += ":" : "";
		}
	}
	return data;
}
function ctr_enable(sid, flag, textboxgroupflag)
{
	var option;
	if(textboxgroupflag)
		option = "input";
	else
		option = "";

	$('[sid="'+sid+'"] '+ option).each(function()
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

function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}


function check_textfield_value(sid, regExp, directstringvalue ,flag)
{
	if(!directstringvalue)
	var value =  $('[sid="'+sid+'"]').val();
	else
		value = directstringvalue;

	var Usid = sid.toUpperCase();
	if(!value || value == "" || value == "..." || value == ":::::")
	{
		alert(M_lang['S_EMPTY_'+Usid], M_lang['S_POPUP_TITLE_ERROR']);
		return false;
	}

	if( check_input_error(value, regExp) )
	{
		alert(M_lang['S_ERROR_'+Usid], M_lang['S_POPUP_TITLE_ERROR']);
	
		if(directstringvalue)
			insert_addr(sid, "", flag);
		else
			$('[sid="'+sid+'"]').val("");
		
		return false;
	}
	return true
}

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	$('[sid="'+Uactname+'"]').on('click', function() {
		load_rightpanel(actname); 
	});
}

function load_rightpanel(actname) 
{
	$.ajaxSetup({ async : false });
	$("#right_content").load('html/'+actname+'.html', function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success")
		{
			$(this).trigger('create');	
			load_header(RIGHT_HEADER, actname);
			get_maclist(true);
					
		}
	});
}

function get_maclist(initflag)
{
	$.ajaxSetup({ timeout: 5000  });
	$.getJSON('/cgi/iux_get.cgi', {
		tmenu : window.tmenu,
		smenu : window.smenu,
		act : "data"
	})
	.done(function(data)
	{
		if(json_validate(data, '') == true)
			data_local = data;
			if(initflag)
			{
				init_func['maclist'].call();
				listener_local_func['maclist'].call();
			}
	})
	.always(function()
	{	
		setTimeout(function() {
			$("#loading").popup("close");
			init_func['maclist'].call();
			listener_local_func['maclist'].call();
		}, 3000);
	});
}
*/
