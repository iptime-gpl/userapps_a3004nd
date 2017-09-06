// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var listener_local_func=[];
var localpostdata = [];
var data_local = [];

var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_kor = /^([가-힣]|[0-9a-zA-Z]|[_]){1,32}$/;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,32}$/;
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "pptpvpn";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);

});

function loadLocalPage()
{
	ctr_init();
	add_listener_local();

	iux_set_onclick_local("add");
	iux_set_onclick_local("modify");
}

function result_config()
{
}

//init
ctr_init_func['init'] = function()
{
	$(".lc_row .ui-radio label").css("background-color","#EEF1E6");
	$(".lc_row").css("background-color","#EEF1E6");
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	var accountlist = config_data.accountlist;
	if(accountlist.length <= 1)
		$('[sid="ACCOUNTLIST_TITLEBAR"]').hide();
	else
		$('[sid="ACCOUNTLIST_TITLEBAR"]').show();


};
listener_local_func['init'] = function()
{
        sliderButtonEvent( { sid : 'C_VPNSERVER_OPERATION', runFunc : sliderButtonChangeEvent } );
        sliderButtonEvent( { sid : 'C_VPNSERVER_MPPE', runFunc : sliderButtonChangeEvent } );
};

function sliderButtonChangeEvent()
{
	if( check_change_value() )
	{
		$("#loading").popup("open");
		//iux_submit("apply");
		var operationvalue;
		$('[name="operation"]:selected').val() == 1 ? operationvalue = true : operationvalue = false;
		if( operationvalue == false)
		{
			var connect = 0;
			var accountstatus = status_data.accountstatus;
			if(accountstatus && accountstatus.length > 1)
			{
				for(var i=0; i < accountstatus.length-1; i++)
				{
					if( accountstatus[i].status == "S_CONNECT")
					{
						connect =1 ;
						break;
					}
				}
			}
			if(connect == 1)
				iux_submit('apply' , null, null, null, null, 5000);
			else
				iux_submit('apply');
		}
		else
			iux_submit('apply');

	}
}

//add
ctr_init_func['add'] = function()
{
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	$('[sid="SHOW_PASSWD"] label').css("background-color","#F6F6F6");
	var vpninfo = config_data.vpnserver;
	if(vpninfo.ipaddr && vpninfo.subnet);
		insert_ipaddr('ACCOUNTLIST_IPADDR', vpninfo.ipaddr, vpninfo.subnet); 
	if(vpninfo.defaultadmin == "1")
	{
		$('[sid="ADD_CAPTCHA_CODE"]').val("");
		get_captcha_img();
		$('[sid="ADD_CAPTCHA_CODE"]').attr('placeholder',M_lang["S_PLEASE_INPUT_CAPTCHA_CODE"]);
		$('[sid="CAPTCHA_FIELD"]').show();
	}
	else
		$('[sid="CAPTCHA_FIELD"]').hide();
};

listener_local_func['add'] = function()
{
	$('[sid="PW_CHECK"]').change(function()
	{
		var pw_check = $('[sid="PW_CHECK"]:checked').val()?1:0;
		if(pw_check)
			$('[sid="ADD_PASSWORD"]').attr("type","text");
		else
			$('[sid="ADD_PASSWORD"]').attr("type","password");
	});

	$('[sid="CAPTCHA_REFRESH"]').click(function() 
	{
		get_captcha_img();
		$('[sid="ADD_CAPTCHA_CODE"]').val("");
		//$('[sid="ADD_CAPTCHA_CODE"]').focus();	
	});
	$('[sid="ADD_SUBMIT"]').click(function() 
	{
		var input_ip = convert_textfield_to_string('ACCOUNTLIST_IPADDR');
		var input_id = $('[sid="ADD_ACCOUNT_ID"]').val();
		var input_pw = $('[sid="ADD_PASSWORD"]').val();
		var input_captcha_code = $('[sid="ADD_CAPTCHA_CODE"]').val();
		var filename;
		var accountlist = config_data.accountlist;
		
		/////
		if(accountlist.length == 6)
		{
			$("#right_panel").panel("close");
			alert(M_lang["S_ADD_SUBMIT_ERROR_FULLUSER"]);
			ctr_init_func['add'].call();
			return;
		}
		/////
		if( input_id == "" || check_input_error(input_id, regExp_text) )
		{
			$('[sid="ADD_ACCOUNT_ID"]').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_ID"]);
			ctr_init_func['add'].call();
			return;
		}
		if( input_pw == "")
		{
			
			$('[sid="ADD_PASSWORD"]').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_PW"]);
			ctr_init_func['add'].call();
			return;
		}
		if( input_ip == "..." || check_input_error(input_ip, regExp_ip) )
		{
			$('[sid="ACCOUNTLIST_IPADDR"] input:enabled').val("");
			alert(M_lang["S_ADD_SUBMIT_ERROR_IP"]);
			ctr_init_func['add'].call();
			return;
		}
		if( config_data.vpnserver.defaultadmin == "1")
		{
			
			filename = data_local.captcha.filename;
			if( filename == "" || input_captcha_code == "" )
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL_CAPTCHA"]);
				ctr_init_func['add'].call();
				return;
			}
		}

		var accountlist = config_data.accountlist;
		if(accountlist.length > 1)
		{
			for(var i=0; i < accountlist.length-1; i++)
			{
				if( accountlist[i].account == input_id)
				{
					$('[sid="ADD_ACCOUNT_ID"]').val("");
					$('[sid="ADD_PASSWORD"]').val("");
					$('[sid="ACCOUNTLIST_IPADDR"] input:enabled').val("");
					alert(M_lang["S_ADD_SUBMIT_ERROR_SAMEID"]);
					ctr_init_func['add'].call();
					return;
				}
					
			}
		}

		localpostdata = [];
		localpostdata.push({name : 'captcha_file', value : filename });
		localpostdata.push({name : 'ip', value : input_ip });

		$("#loading").popup("open");
		iux_submit('add' , localpostdata, true, null, 'local_add_form');
	});
};

//modify
ctr_init_func['modify'] = function()
{
	get_accountlist('ACCOUNTLIST');
	iux_update("C");
	iux_update("S");

	get_accountlist('MODIFY_ACCOUNTLIST','modify');
	$('[sid="MODIFY_ACCOUNTLIST"] li:even').css("background-color","#FFFFFF");
	$('[sid="MODIFY_ACCOUNTLIST"] li:odd').css("background-color","#F9FAF5");
	$('[sid="MODIFY_ACCOUNTLIST"] .ui-checkbox:even label').css("background-color","#FFFFFF");
	$('[sid="MODIFY_ACCOUNTLIST"] .ui-checkbox:odd label').css("background-color","#F9FAF5");



	var accountlist = config_data.accountlist;
	if(accountlist.length <= 1)
		$('[sid="BUTTON_DEL_FEILD"]').hide();
	else
		$('[sid="BUTTON_DEL_FEILD"]').show();

	iux_update("S");
	

};
listener_local_func['modify'] = function()
{
	$('[sid="CHECKALL"]').change(function() {
	var m_checkall = $('[sid="CHECKALL"]:checked').val();
	if(m_checkall)
		$('[sid="MODIFY_ACCOUNTLIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="MODIFY_ACCOUNTLIST"] input').removeAttr('checked').checkboxradio("refresh");
	});
	$('[sid="BUTTON_DISCONNECT"]').click(function() 
	{
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count > 0)
		{
			localpostdata = [];
			localpostdata.push({name : 'mode', value : "disconnect" });
			$("#loading").popup("open");
			iux_submit('modify' , localpostdata, true, null, 'local_modify_form', 5000);
		}
		else
		{
			alert(M_lang["S_SUBMIT_NO_ITEM"]);
			return;
		}
	});
	$('[sid="BUTTON_DELETE"]').click(function() 
	{
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count > 0)
		{
			localpostdata = [];
			localpostdata.push({name : 'mode', value : "delete" });
			$("#loading").popup("open");
			iux_submit('modify' , localpostdata, true, null, 'local_modify_form');
		}
		else
		{
			alert(M_lang["S_SUBMIT_NO_ITEM"]);
			return;
		}
	});
};
function iux_update_local(id)
{ 
	if(id == "D")
	{
		var accountstatus = status_data.accountstatus;
		if(accountstatus.length > 1)
		{
			for(var i=0; i < accountstatus.length-1; i++)
			{
				$('[sid="ACCOUNT_'+accountstatus[i].account+'"] p').text(M_lang[accountstatus[i].status])
			}
		}
	}
}
function ctr_init(actname)
{
	actname ? ctr_init_func[actname].call() : ctr_init_func['init'].call();	
}
function add_listener_local(actname)
{
	actname ? listener_local_func[actname].call() : listener_local_func['init'].call()
}

function get_accountlist(sid,actname)
{
	var accountlist = config_data.accountlist;

	$('[sid="'+sid+'"]').find('li').remove();
	if(accountlist.length > 1)
	{
		for(var i=0; i < accountlist.length-1; i++)
		{
			if(actname == 'modify')
			{
				var checkid = 'check_'+i;
				$('[sid="'+sid+'"]').append('<li class="modifyaccount_item"><a href="#" onclick="checktest(\''+checkid+'\'); return false;" data-icon="false">'
				+ '<div class="title"><p>'+accountlist[i].account+'</p></div>'
				+ '<div class="ipaddr"><p>'+accountlist[i].ip+'</p></div>'
				+ '<div sid="ACCOUNT_'+accountlist[i].account+'" class="status"><p></p></div>'
				+ '<div class="check ui-alt-icon">'
				+ '<input name="account"  sid="check_'+i+'" id="check_'+i+'" type="checkbox" value="'+accountlist[i].account+'">'
				+ '<label for="check_'+i+'"></label></div></li>');
			}
			else
			{
				$('[sid="'+sid+'"]').append('<li class="pptpvpn_account_list_item">'
				 + '<div><p>'+accountlist[i].account+'</p></div>'
				 + '<div><p>'+accountlist[i].ip+'</p></div>'
				 + '<div sid="ACCOUNT_'+accountlist[i].account+'"><p class="colorgray"></p></div></li>');
			}
		}

		$('[sid="'+sid+'"] li:even').css("background-color","#FFFFFF");
		$('[sid="'+sid+'"] li:odd').css("background-color","#F9FAF5");
		$('[sid="'+sid+'"]').trigger('create');
	}	
}

function checktest(id)
{
	var checked = $('#'+id).is(':checked');

	if(checked)
		$('#'+id).removeAttr('checked').checkboxradio("refresh");
	else
		$('#'+id).prop('checked', 'checked').checkboxradio("refresh");	
}


function get_captcha_img()
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
		{
			data_local = data;
			var filename = data_local.captcha.filename;
			if(filename)
			{
				$('[sid="CAPTCHA_IMG"]').find('img').remove();
				$('[sid="CAPTCHA_IMG"]').append('<img style="width:100%; height:80%" src="/captcha/'+filename+'.gif">');
			}
		}
	})
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
		else {
			$(this).prop('readonly',true);
			$(this).parent().addClass("ui-state-disabled");
			$(this).attr('disabled',true);
		}
	});
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

function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	var Uactname = Uactname+"_ACCOUNT";
	$('[sid="'+Uactname+'"]').on('click', function()
	{
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
					ctr_init(actname);
					add_listener_local(actname);
				}
		});
}

function insert_ipaddr(sid, ip, subnet)
{
	var s_ip = ip.split(".");
	var s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(s_subnet[i] == "255")
		{
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
		}
	}
}

function result_submit( act, result )
{
	switch( act ) {
	case "add" :
		if( result )
		{
			$("#loading").popup("close");
			$("#right_panel").panel("close");
			//alert(M_lang["S_ADD_SUBMIT_SUCCESS"]);
			ctr_init_func['init'].call();
			ctr_init_func['add'].call();
		}
		else
		{
			$("#loading").popup("close");
			if(errorcode == 11)
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL_CAPTCHA"]);
				ctr_init_func['add'].call();
			}
			else
			{
				alert(M_lang["S_ADD_SUBMIT_FAIL"]);
				ctr_init_func['add'].call();
			}
		}
		break;
	case "modify" :
		if( localpostdata[0].value === "delete" )
		{
			if( result )
			{
				$("#loading").popup("close");
				$("#right_panel").panel("close");
			}
			else
			{
				$("#loading").popup("close");
				alert(M_lang["S_MODIFY_DELSUBMIT_FAIL"]);
			}
		}
		else if( localpostdata[0].value === "disconnect" )
		{
			if( !result )
			{
				$("#loading").popup("close");
				alert(M_lang["S_MODIFY_DISSUBMIT_FAIL"]);
			}
			var accountlist = config_data.accountlist;
			if(accountlist.length > 1)
			{
				for(var i=0; i < accountlist.length-1; i++)
				{
					$('[sid="STATUSMSG_'+i+'] p').attr('sid',accountlist[i].status);
				}
			}
		}
		ctr_init_func['init'].call();
		ctr_init_func['modify'].call();
		break;
	case "apply" :
		var accountlist = config_data.accountlist;
		if(accountlist.length > 1)
		{
			for(var i=0; i < accountlist.length-1; i++)
			{
				$('[sid="STATUSMSG_'+i+'] p').attr('sid',accountlist[i].status);
			}
		}
		ctr_init_func['init'].call();
		break;
	}
}
