// JavaScript Document
var submit_local_func = [];
var init_func = [];
var result_submit_func = [];
var listener_local_func=[];
var localpostdata = [];
var submit_local_func=[];
var current_status_data = [];
var data_local = [];

var regExp_kor32 = /^([ㄱ-ㅎ]|[ㅏ-ㅣ]|[가-힣]|[0-9a-zA-Z]|[@#()_-]){1,32}$/;

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "wol";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 60000);
});

function loadLocalPage()
{
	init();
	listener_local();
}

function result_config()
{
}

// function call  //
function init(actname) { actname ? init_func[actname].call() : init_func['main'].call(); }
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
	$.ajaxSetup({ async : true, timeout : 20000 });
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
