//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var KILOBYTE = 1024;
var MEGABYTE = 1048576;
var GIGABYTE = 1073741824;
//local-global variables end

//local utility functions


function lock_object(selector, proptype)
{
	$(selector).prop(proptype, true);
	$(selector).parent().addClass('ui-state-disabled');
}

function unlock_object(selector, proptype)
{
	$(selector).prop(proptype, false);
	$(selector).parent().removeClass('ui-state-disabled');
}

function has_changed_default_value(name)
{
	var value = "config_data." + name,
		default_value = "config_data." + name + "default.";
	var c_data = eval(value);
	value += ".";
        for(var articleName in c_data){
		if(eval(value + articleName) != eval(default_value + articleName))
			return true;
        }
	return false;
}

function check_local_change_value(object_range, target_object)
{
		if(check_change_value(object_range))
		{
			unlock_object(target_object, 'disabled');
		}
		else
		{
			lock_object(target_object, 'disabled');
		}
}

function add_check_change__value_event()
{
	$("input[sid^='C_CTRL_']").keyup(function()
	{
		check_local_change_value(".lc_ctrl_div", "#submit_connection_button");
	});
	$("input[sid^='C_TIMEOUT_']").keyup(function()
	{
		check_local_change_value(".lc_timeout_div", "#submit_timeout_button");
	});
}

function check_input_range(value, type)
{
	if(check_input_error(value, regExp_onlynum))
	{
			alert(M_lang['S_ERROR_MSG6']);
			return false;
	}

	value = Number(value);
        if(type == "MAX_CONNECTION")
        {

		if(value > 0 && value < 512)
		{
			alert(M_lang['S_ERROR_MSG1']);
			return false;
		}
	} 
	else if(type == "MAX_UDP")
	{
		if((value > 0 && value < 10) || value < 0 || value > $('[sid = "C_CTRL_ALL"]').val())
		{
			alert(M_lang['S_ERROR_MSG2']);
			return false;
		}
	}
	else if(type == "MAX_ICMP")
	{
		if((value > 0 && value < 10) || value < 0 || value > $('[sid = "C_CTRL_ALL"]').val())
		{
			alert(M_lang['S_ERROR_MSG3']);
			return false;
		}
	}
	else if(type == "MAX_PC_RATE")
	{
		if(value < 0 || value > 100)
		{
			alert(M_lang['S_ERROR_MSG4']);
			return false;
		}
	}
	else if(type == "TIMEOUT_VALUE")
	{
		if(value <= 0)
		{
			alert(M_lang['S_ERROR_MSG5']);
			return false;
		}
	}

        return true;
}

function check_input_error(string, regExp)
{
        if(!string || !string.match(regExp))
                return true;
        return false;
}

function restore_button_event_add()
{
	$('[sid="S_BUTTON_RESTORE"]').click(function() {
		if($(this).attr('id') == 'restore_connection_button')
		{
			$('[sid="C_CTRL_ALL"]').val(config_data.ctrldefault.all);
			$('[sid="C_CTRL_UDPMAX"]').val(config_data.ctrldefault.udpmax);
			$('[sid="C_CTRL_ICMPMAX"]').val(config_data.ctrldefault.icmpmax);
			$('[sid="C_CTRL_RATE"]').val(config_data.ctrldefault.rate);

			check_local_change_value(".lc_ctrl_div", "#submit_connection_button");
		}
		else if($(this).attr('id') == 'restore_timeout_button')
		{
			$('[sid="C_TIMEOUT_TCPSYNSENT"]').val(config_data.timeoutdefault.tcpsynsent);
			$('[sid="C_TIMEOUT_TCPSYNRECV"]').val(config_data.timeoutdefault.tcpsynrecv);
			$('[sid="C_TIMEOUT_TCPESTABLISHED"]').val(config_data.timeoutdefault.tcpestablished);
			$('[sid="C_TIMEOUT_TCPFINWAIT"]').val(config_data.timeoutdefault.tcpfinwait);
			$('[sid="C_TIMEOUT_TCPCLOSEWAIT"]').val(config_data.timeoutdefault.tcpclosewait);
			$('[sid="C_TIMEOUT_TCPLASTACK"]').val(config_data.timeoutdefault.tcplastack);
			$('[sid="C_TIMEOUT_TCPTIMEWAIT"]').val(config_data.timeoutdefault.tcptimewait);
			$('[sid="C_TIMEOUT_TCPCLOSE"]').val(config_data.timeoutdefault.tcpclose);
			$('[sid="C_TIMEOUT_UDP"]').val(config_data.timeoutdefault.udp);
			$('[sid="C_TIMEOUT_UDPSTREAM"]').val(config_data.timeoutdefault.udpstream);
			$('[sid="C_TIMEOUT_ICMP"]').val(config_data.timeoutdefault.icmp);
			$('[sid="C_TIMEOUT_GENERIC"]').val(config_data.timeoutdefault.generic);

			check_local_change_value(".lc_timeout_div", "#submit_timeout_button");
		}
	});
}

function submit_button_event_add()
{
        $('#submit_connection_button').click(function() {
		submit_local('ctrl');
        });
        $('#submit_timeout_button').click(function() {
		submit_local('timeout');
        });
}

//local utility functions end

iux_update_local_func['main'] = function(identifier)
{
	lock_object("#submit_connection_button", "disabled");
	lock_object("#submit_timeout_button", "disabled");

	if(!has_changed_default_value("ctrl"))
		lock_object("#restore_connection_button", "disabled");
	if(!has_changed_default_value("timeout"))
		lock_object("#restore_timeout_button", "disabled");
}

add_listener_local_func['main'] = function()
{
	restore_button_event_add();
	submit_button_event_add();	
	add_check_change__value_event();
}

submit_local_func['ctrl'] = function()
{
	var localdata = [];

	var all = $('[sid = "C_CTRL_ALL"]').val(),
	udpmax = $('[sid = "C_CTRL_UDPMAX"]').val(),
	icmpmax = $('[sid = "C_CTRL_ICMPMAX"]').val(),
	rate = $('[sid = "C_CTRL_RATE"]').val();

	if(!(check_input_range(all, "MAX_CONNECTION") && check_input_range(udpmax, "MAX_UDP") && check_input_range(icmpmax, "MAX_ICMP") 
		&& check_input_range(rate, "MAX_PC_RATE")))
		return;

	localdata.push({name : "all", value : all});
	localdata.push({name : "udpmax", value : udpmax});
	localdata.push({name : "icmpmax", value : icmpmax});
	localdata.push({name : "rate", value : rate});
	
        $('#loading').popup('open');
	return iux_submit('ctrl', localdata);
}

submit_local_func['timeout'] = function()
{
	var localdata = [];

	var tcpsynsent = $('[sid = "C_TIMEOUT_TCPSYNSENT"]').val(),
	tcpsynrecv = $('[sid = "C_TIMEOUT_TCPSYNRECV"]').val(),
	tcpestablished = $('[sid = "C_TIMEOUT_TCPESTABLISHED"]').val(),
	tcpfinwait = $('[sid = "C_TIMEOUT_TCPFINWAIT"]').val(),
	tcpclosewait = $('[sid = "C_TIMEOUT_TCPCLOSEWAIT"]').val(),
	tcplastack = $('[sid = "C_TIMEOUT_TCPLASTACK"]').val();
	tcptimewait = $('[sid = "C_TIMEOUT_TCPTIMEWAIT"]').val();
	tcpclose = $('[sid = "C_TIMEOUT_TCPCLOSE"]').val();
	udp = $('[sid = "C_TIMEOUT_UDP"]').val();
	udpstream = $('[sid = "C_TIMEOUT_UDPSTREAM"]').val();
	icmp = $('[sid = "C_TIMEOUT_ICMP"]').val();
	generic = $('[sid = "C_TIMEOUT_GENERIC"]').val();

	if(!(check_input_range(tcpsynsent, "TIMEOUT_VALUE") && check_input_range(tcpsynrecv, "TIMEOUT_VALUE") && check_input_range(tcpestablished, "TIMEOUT_VALUE") 
		&& check_input_range(tcpfinwait, "TIMEOUT_VALUE") && check_input_range(tcpclosewait, "TIMEOUT_VALUE") && check_input_range(tcplastack, "TIMEOUT_VALUE") 
		&& check_input_range(tcptimewait, "TIMEOUT_VALUE") && check_input_range(tcpclose, "TIMEOUT_VALUE") && check_input_range(udp, "TIMEOUT_VALUE") 
		&& check_input_range(udpstream, "TIMEOUT_VALUE") && check_input_range(icmp, "TIMEOUT_VALUE") && check_input_range(generic, "TIMEOUT_VALUE")))
		return;

	localdata.push({name : "tcpsynsent", value : tcpsynsent});
	localdata.push({name : "tcpsynrecv", value : tcpsynrecv});
	localdata.push({name : "tcpestablished", value : tcpestablished});
	localdata.push({name : "tcpfinwait", value : tcpfinwait});
	localdata.push({name : "tcpclosewait", value : tcpclosewait});
	localdata.push({name : "tcplastack", value : tcplastack});
	localdata.push({name : "tcptimewait", value : tcptimewait});
	localdata.push({name : "tcpclosetime", value : tcpclose});
	localdata.push({name : "udp", value : udp});
	localdata.push({name : "udpstream", value : udpstream});
	localdata.push({name : "icmp", value : icmp});
	localdata.push({name : "generic", value : generic});
	
        $('#loading').popup('open');
	return iux_submit('timeout', localdata);
}

$(document).ready(function() {
	window.tmenu = "trafficconf";
	window.smenu = "connctrl";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();

	iux_update("C");
}

function result_config()
{
	iux_update('C');	
	iux_update_local();
}

function result_submit( service_name, result )
{
	if(has_changed_default_value("ctrl"))
		unlock_object("#restore_connection_button", "disabled");
	if(has_changed_default_value("timeout"))
		unlock_object("#restore_timeout_button", "disabled");
}

function iux_set_onclick_local()
{
	add_listener_local_func['main'].call();
}

function iux_update_local(identifier)
{
	if(identifier == 'D')
		return;
	var caller_func;
	if(!identifier) 
		caller_func = iux_update_local_func["main"];
	else
		caller_func = iux_update_local_func[$("#right_content :first-child").attr('id')];
	if(caller_func) 
		caller_func.call(this, identifier);
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, localdata)
{
	if(submit_local_func[service_name].call(this, localdata)){
		return true;
	}
	return false;
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


