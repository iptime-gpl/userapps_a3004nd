// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var listener_local_func=[];
var localpostdata = [];
var data_local = [];

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "ddns";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);

});

function loadLocalPage()
{
	ctr_init();
	add_listener_local();

	iux_set_onclick_local("add");
	iux_set_onclick_local("info");
}

function result_config()
{
}

function result_submit( act, result )
{
	switch( act ) {
	case "add" :
		if( result )
		{
			$("#loading").popup("close");
			$("#right_panel").panel("close");
			alert(M_lang["S_DDNS_SUBMIT_SUCCESS"]);
			ctr_init_func['init'].call();
		}
		else
		{
			$("#loading").popup("close");
			if(errorcode == 11)
				alert(M_lang["S_DDNS_SUBMIT_FAIL_CAPTCHA"]);
			else
			{
				$('[sid="DDNS_INPUTHOSTNAME"]').val("");
				$('[sid="DDNS_INPUTID"]').val("");
				alert(M_lang["S_DDNS_SUBMIT_FAIL"]);
			}
		}
		ctr_init_func['add'].call();

		break;
	case "delete" :
		if( result )
		{
			$("#loading").popup("close");
			alert(M_lang["S_DDNS_SUBMIT_SUCCESS_DEL"]);
			ctr_init_func['init'].call();
		}
		else
		{
			$("#loading").popup("close");
			alert(M_lang["S_DDNS_SUBMIT_FAIL_DEL"]);
		}
		break;
	case "refresh" :
		if( result )
			ctr_init_func['init'].call();
		break;
	}
}

//init
ctr_init_func['init'] = function()
{
	var ddnsinfo = config_data.ddnsinfo;
	$(".lc_row").css("background-color","#EEF1E6");
	if(ddnsinfo.hostname && ddnsinfo.hostname != "")
	{
		$('.use_ddns').show();
		$('.disuse_ddns').hide();
		$('[sid="DDNS_HOSTNAME"]').text(ddnsinfo.hostname);
	}
	else
	{
		$('.use_ddns').hide();
		$('.disuse_ddns').show();
	}
	iux_update("S");
};

listener_local_func['init'] = function()
{
	
	$('[sid="BUTTON_REFRESH"]').click( function() 
	{
		$("#loading").popup("open");
		var ddnsinfo = config_data.ddnsinfo;
		
		localpostdata = [];
		localpostdata.push({name : 'hostname', value : ddnsinfo.hostname });

		iux_submit('refresh' , localpostdata, null, null, null, 4000);
	});
	$('[sid="BUTTON_DELETE"]').click(function() 
	{
		events.confirm({ msg: M_lang["S_DDNS_CONFIRM_DELETE"], runFunc: function( flag ) {
			if(flag)
			{
				var ddnsinfo = config_data.ddnsinfo;
				localpostdata = [];
				localpostdata.push({name : 'hostname', value : ddnsinfo.hostname });
				$("#loading").popup("open");
				iux_submit('delete' , localpostdata);
			}
		}});
	});
};
function confirm_result_local(flag)
{
}

//add
ctr_init_func['add'] = function()
{
	var ddnsinfo = config_data.ddnsinfo;
	if(ddnsinfo.defaultadmin == "1")
	{
		$('[sid="DDNS_INPUTCAPTCHA"]').val("");
		get_captcha_img();
		$('[sid="DDNS_INPUTCAPTCHA"]').attr('placeholder',M_lang["S_PLEASE_INPUT_CAPTCHA_CODE"]);
		$('[sid="CAPTCHA_FIELD"]').show();
	}
	else
		$('[sid="CAPTCHA_FIELD"]').hide();

	$('[sid="DDNS_SERVICETYPE"]').val(M_lang["S_DDNS_SERVICE_NAME"]);
	ctr_enable('DDNS_SERVICETYPE', false);

	
	iux_update("S");
};

listener_local_func['add'] = function()
{
	$('[sid="DDNS_ADDSUBMIT"]').click(function() 
	{
		var ddnsinfo = config_data.ddnsinfo;
		var hostname = $('[sid="DDNS_INPUTHOSTNAME"]').val();
		var userid = $('[sid="DDNS_INPUTID"]').val();
		var filename = "0";
		
		if( hostname == "" || check_input_error(hostname, regExp_text) )
		{
			alert(M_lang["S_ADD_SUBMIT_ERROR_HOSTNAME"]);
			ctr_init_func['add'].call();
			return;
		}
		if( userid == "" || check_input_error(userid, regExp_email) )
		{
			alert(M_lang["S_ADD_SUBMIT_ERROR_ID"]);
			ctr_init_func['add'].call();
			return;
		}

		if(ddnsinfo.defaultadmin == "1")
		{
			var captcha_code = $('[sid="DDNS_INPUTCAPTCHA"]').val();
			var filename = data_local.captcha.filename;
			if( captcha_code == "" || check_input_error(captcha_code, regExp_text) )
			{
				alert(M_lang["S_ADD_SUBMIT_ERROR_CAPTCHA"]);
				ctr_init_func['add'].call();
				return;
			}
		}
		localpostdata = [];
		localpostdata.push({name : 'captcha_file', value : filename });
		
		$("#loading").popup("open");
		iux_submit('add' , localpostdata, true, null, 'local_add_form');
	});

	$('[sid="CAPTCHA_REFRESH"]').click(function() 
	{
		get_captcha_img();
		$('[sid="DDNS_INPUTCAPTCHA"]').val("");
		$('[sid="DDNS_INPUTCAPTCHA"]').focus();	
	});

};

//modify
ctr_init_func['info'] = function()
{
	var ddnsinfo = config_data.ddnsinfo;
	var hostname = ddnsinfo.hostname ? ddnsinfo.hostname : "---";
	var id  = ddnsinfo.id ? ddnsinfo.id : "---";
	$('[sid="DDNS_HOSTNAME"]').text(hostname);
	$('[sid="DDNS_USERID"]').text(id);
	iux_update("S");		
};

listener_local_func['info'] = function()
{
	return;
};

function iux_update_local(id)
{ 
	if(id == "D")
	{
		var ddnsstatus = status_data.ddnsstatus;
		var ip = ddnsstatus.ip ? ddnsstatus.ip : "-";
		var timestamp = ddnsstatus.timestamp ? parse_timevalue(ddnsstatus.timestamp) : "-";
		var remaintime = ddnsstatus.remaintime ? parse_timevalue(ddnsstatus.remaintime) : "-";
		ddnsstatus.status ? $('[sid="DDNS_STATUS"]').text(M_lang[ddnsstatus.status]) : $('[sid="DDNS_STATUS"]').text('-');
		$('[sid="DDNS_IPADDR"]').text(ip);
		$('[sid="DDNS_LASTUPDATE"]').text(timestamp);
		$('[sid="DDNS_NEXTUPDATE"]').text(remaintime);	
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

function parse_timevalue(_value)
{
	_value *= 1000;
	var date = new Date(_value);
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' };
	return date.toLocaleDateString('ko-KR', options);
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

function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	var Uactname = "DDNS_"+Uactname;
	$('[sid="'+Uactname+'"]').on('click', function() {	load_rightpanel(actname); })
	.on("mousedown touchstart", function() {
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
