// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var init_func = [];
var result_submit_func = [];
var listener_local_func=[];
var localpostdata = [];
var data_local = [];
var submit_local_func=[];
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "sysconf"; window.smenu = "login";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 600000);
});

function loadLocalPage()
{
	iux_set_onclick_local('account');
	iux_set_onclick_local('auth');
	iux_set_onclick_local('email');
	
}

function result_config()
{
	init();
	listener_local();
}

// function call  //
function init(actname) { actname ? init_func[actname].call() : init_func['init'].call(); }
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['init'].call(); }
function submit_local(actname) { submit_local_func[actname].call(); }
function result_submit(act, result) { result_submit_func[act].call(this, result); }
function confirm_result_local(flag)
{

}

init_func['init'] = function()
{
	var logininfo = config_data.login;
	
	if(logininfo.validemail != "1")
		$('[sid="MAIN_EMAIL"]').hide();

	$(".lc_line_content:visible:even").css("background-color","#FFFFFF");
	$(".lc_line_content:visible:odd").css("background-color","#F9FAF5");

	var currentpasswd;
	logininfo.password == '' ? currentpasswd = "S_SYSCONF_LOGIN_NOTSET" : currentpasswd = "S_SYSCONF_LOGIN_SET";
	$('[sid="LOGIN_ACCOUNT_STATUS"]').text(M_lang['S_LOGIN_ADMIN_ACCOUNT'] + ' : '+logininfo.id +'　'+ M_lang['S_LOGIN_ADMIN_PW'] + ' : '+M_lang[currentpasswd] );


	var currenthttpauth;
	if(logininfo.httpauth == '1')
	{
		currenthttpauth = "S_LOGIN_SESSION_HTTPAUTH";
		$('[sid="LOGIN_AUTH_STATUS"]').text(M_lang[currenthttpauth]+' : '+logininfo.timeout + M_lang['S_LOGIN_TIMEOUTDESC']);
		if( logininfo.usecaptcha  == "1" )
			$('[sid="LOGIN_AUTH_STATUS"]').text( $('[sid="LOGIN_AUTH_STATUS"]').text() + ' / ' + M_lang['S_LOGIN_USE_CAPTCHA']);
		else if( logininfo.usecaptcha  == "2" )
			$('[sid="LOGIN_AUTH_STATUS"]').text( $('[sid="LOGIN_AUTH_STATUS"]').text() + ' / ' + M_lang['S_LOGIN_USE_CAPTCHA2']);
	}
	else
	{
		currenthttpauth = "S_LOGIN_BASIC_HTTPAUTH"
		$('[sid="LOGIN_AUTH_STATUS"]').text(M_lang[currenthttpauth]);
	}
	
	var currentemail;
	if(logininfo.adminemail != "")
	{
		$('[sid="LOGIN_EMAIL_STATUS"]').text(logininfo.adminemail + '' + (logininfo.smtpauth =='1'? ' / '+M_lang['S_SYSCONF_LOGIN_SMTP_USE_AUTH']:' / '+M_lang['S_SYSCONF_LOGIN_SMTP_DISUSE_AUTH']) );
	}
	else
		$('[sid="LOGIN_EMAIL_STATUS"]').text(M_lang['S_LOGIN_ENAIL_DISUSE']);
			
};	

listener_local_func['init'] = function()
{
};

init_func['account'] = function()
{
	var logininfo = config_data.login;
	logininfo.password == '' ? currentpasswd = "S_SYSCONF_LOGIN_NOTSET" : currentpasswd = "S_SYSCONF_LOGIN_SET";
	$('[sid="LOGIN_SUBTITLE"]').text(M_lang['S_LOGIN_CURRENT_ADMIN'] + '　' + M_lang['S_LOGIN_ACCOUNT_STRING'] + ' : ' + logininfo.id + '　' + M_lang['S_LOGIN_ADMIN_PW'] + ' : ' + M_lang[currentpasswd] );
 
	if(logininfo.validcaptcha == "1")
	{
		$('[sid="INPUT_CAPTCHA"]').val("");
		get_captcha_img();
		$('[sid="INPUT_CAPTCHA"]').attr('placeholder',M_lang["S_PLEASE_INPUT_CAPTCHA_CODE"]);
		$('[sid="CAPTCHA_FIELD"]').show();
	}
	else
		$('[sid="CAPTCHA_FIELD"]').hide();

	iux_update("S");
};

listener_local_func['account'] = function()
{
	$('[sid="CAPTCHA_REFRESH"]').click(function() 
	{
		get_captcha_img();
		$('[sid="INPUT_CAPTCHA"]').val("");
		$('[sid="INPUT_CAPTCHA"]').focus();	
	});
	
	$('[sid="PW_CHECK"]').change(function()
	{
		var pw_check = $('[sid="PW_CHECK"]:checked').val()?1:0;
		if(pw_check)
			$('[sid="LOGIN_PASSWORD"]').attr("type","text");
		else
			$('[sid="LOGIN_PASSWORD"]').attr("type","password");
	});

	$('[sid="LOGIN_SUBMIT"]').click(function() 
	{ 
		submit_local('account');
	});

};
submit_local_func['account'] = function()
{
	var logininfo = config_data.login;
	var ddnsinfo = config_data.ddnsinfo;
	var filename = data_local.captcha.filename;

	if(!check_textfield_value('LOGIN_ACCOUNT',regExp_text) )
		return;
	if(logininfo.validcaptcha == "1")
	{
		if(!check_textfield_value('INPUT_CAPTCHA',regExp_text) )
			return;
		var captcha_code = $('[sid="INPUT_CAPTCHA"]').val();
		if( !(captcha_code.length > 0 || captcha_code.length <= 5) )
		{
			alert(M_lang['S_LOGIN_ERROR_INPUT_CAPTCHA']);
			get_captcha_img();
			$('[sid="INPUT_CAPTCHA"]').val("");
			$('[sid="INPUT_CAPTCHA"]').focus();
			return;
		}
	}
	localpostdata = [];
	localpostdata.push({name : 'captcha_file', value : filename });
	events.confirm({ msg: M_lang["S_LOGIN_MOVE_TO_LOGINPAGE"], panelFlag: false, runFunc: function( flag ) {
		if(flag)
		{
			$("#loading").popup("open");
			iux_submit('account' , localpostdata, true, null, 'local_account_form',5000);
		}
	}});
};

result_submit_func['account'] = function(result)
{
	if(errorcode == 11)
	{
		alert(M_lang["S_SUBMIT_FAIL_CAPTCHA"]);
		get_captcha_img();
		$('[sid="INPUT_CAPTCHA"]').val("");
		$('[sid="INPUT_CAPTCHA"]').focus();	
		return;
	}
	else
	{
		var logininfo = config_data.login;
		if(logininfo.httpauth == '1')
			$(location).attr('href','/m_login.cgi?logout=1');
		else
			$(location).attr('href','/m_login.cgi');
	}
};

init_func['auth'] = function()
{
	iux_update("C");
	iux_update("S");
	
	ctr_enable('LOGIN_SUBMIT', check_change_value() );

	var logininfo = config_data.login;
	var httpauth = $('[sid="C_LOGIN_HTTPAUTH"]:checked').val();
	
	ctr_enable("C_LOGIN_USECAPTCHA", httpauth );
	ctr_enable("C_LOGIN_TIMEOUT", httpauth );
	httpauth == '1'? $('[sid="S_LOGIN_TIMEOUTDESC"], #right_content p[sid=S_CAPTCHA_DESC2], #right_content p[sid=S_CAPTCHA_DESC]').css('opacity','').css('opacity','') :
			 $('[sid="S_LOGIN_TIMEOUTDESC"], #right_content p[sid=S_CAPTCHA_DESC2], #right_content p[sid=S_CAPTCHA_DESC]').css('opacity','').css('opacity','0.4'); 
	httpauth == '0'? $('[sid="S_LOGIN_BASICDESC"]').css('opacity','') : $('[sid="S_LOGIN_BASICDESC"]').css('opacity','0.4'); 
};

listener_local_func['auth'] = function()
{
	$('[sid="C_LOGIN_HTTPAUTH"]').change(function()
	{
		var httpauth = $('[sid="C_LOGIN_HTTPAUTH"]:checked').val(); 
		ctr_enable('LOGIN_SUBMIT', check_change_value() );
		ctr_enable("C_LOGIN_USECAPTCHA", httpauth );
		ctr_enable("C_LOGIN_ATTEMPT", httpauth );
		ctr_enable("C_LOGIN_TIMEOUT", httpauth );
		httpauth == '1' ? $('[sid="S_LOGIN_TIMEOUTDESC"], #right_content p[sid=S_CAPTCHA_DESC2], #right_content p[sid=S_CAPTCHA_DESC]').css('opacity','') 
				: $('[sid="S_LOGIN_TIMEOUTDESC"], #right_content p[sid=S_CAPTCHA_DESC2], #right_content p[sid=S_CAPTCHA_DESC]').css('opacity','0.4'); 
		httpauth == '0' ? $('[sid="S_LOGIN_BASICDESC"]').css('opacity','') : $('[sid="S_LOGIN_BASICDESC"]').css('opacity','0.4'); 
	});
	$('[sid="C_LOGIN_TIMEOUT"]').keyup(function() {
		ctr_enable("LOGIN_SUBMIT", check_change_value() );
	});

	$('[sid="LOGIN_SUBMIT"]').unbind();
	$('[sid="LOGIN_SUBMIT"]').click(function() 
	{ 
		submit_local('auth');
		//confirm(M_lang["S_LOGIN_MOVE_TO_LOGINPAGE"]);
	});
	$('[sid="C_LOGIN_USECAPTCHA"]').change(function() 
	{
		if($(this).val() == "2")
		{
			$("#captcha_manual_option").show();
			if(config_data.login.isdefaultpw)
				$("#captcha_option_warning").show();
			else
				$("#captcha_option_warning").hide();
		}
		else
		{
			$("#captcha_manual_option").hide();
			$("#captcha_option_warning").hide();
		}
		ctr_enable("LOGIN_SUBMIT", check_change_value() );
	}).trigger("change");
	$('[sid="C_LOGIN_ATTEMPT"]').change(function()
	{
		ctr_enable("LOGIN_SUBMIT", check_change_value() );
	});
};

submit_local_func['auth'] = function()
{
	connectfailalert = false;
	var httpauth = $('[sid="C_LOGIN_HTTPAUTH"]:checked').val();
	
	if(httpauth == "1")
	{
		if(!check_textfield_value('C_LOGIN_TIMEOUT',regExp_time) )
			return;

		var input_timeout = $('[sid="C_LOGIN_TIMEOUT"]').val();
		if( !( parseInt(input_timeout) > 0 && parseInt(input_timeout) <= 60) )
		{
			alert(M_lang['S_LOGIN_ERROR_C_LOGIN_TIMEOUT']);
			$('[sid="C_LOGIN_TIMEOUT"]').val("");
			$('[sid="C_LOGIN_TIMEOUT"]').focus();	
			return;
		}
		var max_attempt = $("input[sid=C_LOGIN_ATTEMPT").val();
		if( max_attempt < 0 || max_attempt > 99 )
		{
			alert(M_lang["S_ERROR_LOGIN_ATTEMPT_RANGE"]);
			$("input[sid=C_LOGIN_ATTEMPT").focus();	
			return;
		}
	}
	events.confirm({ msg: M_lang["S_LOGIN_MOVE_TO_LOGINPAGE"], panelFlag: false, runFunc: function( flag ) {
		if( flag ) {
			$("#loading").popup("open");
			iux_submit('auth' , null, null, null, 'local_auth_form',5000);
		}
	}});
};

result_submit_func['auth'] = function(result)
{
	var logininfo = config_data.login;
	if(logininfo.httpauth == '1')
		$(location).attr('href','/m_login.cgi?logout=1');
	else
		$(location).attr('href','/m_login.cgi');
	//init_func['auth'].call();
	//init_func['init'].call();
};

init_func['email'] = function()
{
	iux_update("C");
	iux_update("S");

	ctr_enable('LOGIN_SUBMIT', check_change_value() );
	var smtpauth = $('[sid="C_LOGIN_SMTPAUTH"]:checked').val(); 
	ctr_enable("C_LOGIN_SMTPACCOUNT", smtpauth );
	ctr_enable("C_LOGIN_SMTPPASSWD", smtpauth );
};

listener_local_func['email'] = function()
{
	$('#email input:text, #email input:password').each(function()
	{
		$(this).keyup(function() {
			ctr_enable("LOGIN_SUBMIT", check_change_value() );
		});
	});

	$('[sid="C_LOGIN_SMTPAUTH"]').change(function(){
		var smtpauth = $('[sid="C_LOGIN_SMTPAUTH"]:checked').val(); 
		ctr_enable("LOGIN_SUBMIT", check_change_value() );
		ctr_enable("C_LOGIN_SMTPACCOUNT", smtpauth );
		ctr_enable("C_LOGIN_SMTPPASSWD", smtpauth );
	});

	$('[sid="LOGIN_SUBMIT"]').unbind();
	$('[sid="LOGIN_SUBMIT"]').click(function() { submit_local('email'); });
};

submit_local_func['email'] = function()
{
	if(!check_textfield_value('C_LOGIN_ADMINEMAIL',regExp_email) )
		return;
	/*if(!check_textfield_value('C_LOGIN_SMTPSERVER',regExp_time) )
		return;
	*/
	var input_smtpserver = $('[sid="C_LOGIN_SMTPSERVER"]').val();
	if( !input_smtpserver || input_smtpserver == "" )
	{
		alert(M_lang["S_LOGIN_EMPTY_C_LOGIN_SMTPSERVER"]);	
		return;
	}
	if(!check_textfield_value('C_LOGIN_SENDEMAIL',regExp_email) )
		return;
	var smtpauth = $('[sid="C_LOGIN_SMTPAUTH"]:checked').val(); 
	if( smtpauth == '1')
	{
		if(!check_textfield_value('C_LOGIN_SMTPACCOUNT',regExp_text) )
			return;
	}
	$("#loading").popup("open");
	iux_submit('email' , null, null, null, 'local_email_form');
};

result_submit_func['email'] = function(result)
{
	if(result)
	{
	}
	else
	{
		$("#loading").popup("close");
		alert(M_lang["S_ERROR_LOGIN_SUBMIT_EMAIL"]);	
	}
	init_func['email'].call();
	init_func['init'].call();
	
};

function check_textfield_value(sid, regExp)
{
	var value =  $('[sid="'+sid+'"]').val();
	var Usid = sid.toUpperCase();
	if(!value || value == "")
	{
		alert(M_lang['S_LOGIN_EMPTY_'+Usid]);
		$('[sid="'+sid+'"]').focus();
		return false;
	}

	if( check_input_error(value, regExp) )
	{
		alert(M_lang['S_LOGIN_ERROR_'+Usid]);
		$('[sid="'+sid+'"]').val("");
		$('[sid="'+sid+'"]').focus();	
		return false;
	}
	return true
}

function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function iux_update_local(id)
{ 
	//iux_update_local_func['init'].call();
}

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	var Uactname = "MAIN_"+Uactname;
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
					init(actname);
					listener_local(actname);
				}
		});
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
