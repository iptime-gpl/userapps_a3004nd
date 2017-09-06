//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var result_submit_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var logLength = 0;
var htmlArray = [];
var logid = 0;
//local-global variables end

//local utility functions
function getLogLength()
{
//	return $("#syslog >div").length;
	return logLength;
}

function removeLog()
{
	$("#syslog >div").remove();
	logid = 0;
	logLength = 0;
}

function isEqual( lineDiv, data )
{
	return lineDiv.find(".lc_log_timestamp p").text() == data.timestamp
		&& lineDiv.find(".lc_log_msg p").text() == data.message;
}

function getValidLineRange()
{
	var i = 0, j = 0, length = Object.keys( status_data.history ).length - 1,
		list = $("#syslog >div:lt(" + length + ")");
	while( i < length && j < length )
	{
		if( isEqual( list.eq(j), status_data.history["row" + (i + 1)] ))
			++j;
		else if( j > 0 )
		{
//			while( ++i < length)
//			{
//				if( isEqual( list.eq(j), status_data.history["row" + (i + 1)] )) 
//				
//			}
			return length;
		}
		++i;
	}
	return i - j;
}

function isFirstMaking()
{
	if(getLogLength() == 0)
		return true;
	return false;
}

function decode_message(message)
{
	if(!M_lang["SYSLOG_MSG"] || !message.match(/@{[0-9]+/))
		return message;

	var index = 0;
	message = message.replace(/@{([0-9]+)}/g, function(text, match) { return M_lang["SYSLOG_MSG"][match]?M_lang["SYSLOG_MSG"][match]:"";}).split("++");
	return message[0].replace(/@{code}/g, function() { return message[++index]; });
}

function add_history_row(index, action)
{
	var object, timestamp, message, timeStampFont = "", messageFont = "";
	object = status_data.history[index];
	timestamp = object.timestamp;
	message = decode_message(object.message);

	if(object.level == "2")
	{
		timeStampFont = "lc_bluefont_text";
		messageFont = "lc_bluefont_text";
	}
	else if(object.level == "3")
	{
		timeStampFont = "lc_redfont_text";
		messageFont = "lc_redfont_text";
	}
	else
	{
		messageFont = "lc_grayfont_text";
	}

	var htmlStr = $("<div>").attr("class", "lc_log_row");
	htmlStr.html([
	"		<div class = 'lc_log_timestamp'>",
	"			<p class = '", timeStampFont, "'>", timestamp, "</p>",
	"		</div>",
	"		<div class = 'lc_log_msg'>",
	"			<p class = '", messageFont, "'>", message, "</p>",
	"		</div>"].join(""));

	++logLength;
	if(action == "append")
		htmlArray.push(htmlStr);
	else 
		$(htmlStr).insertBefore($("#syslog >div:nth-child(" + action + ")"));
}

function makeNewSyslog()
{
	for(var index in status_data.history)
		if(index != "")
			add_history_row(index, "append");
	if(htmlArray.length > 0)
	{
		$("#syslog").append(htmlArray);
		htmlArray = [];
	}
}

function updateSyslog()
{
	var count = 1, length = getValidLineRange();
	for( var i = 1; i <= length; ++i )
	{
		add_history_row( "row" + i, count++);
	}
}

function printSyslog()
{
	if(isFirstMaking())
		makeNewSyslog();
	else
		updateSyslog();
}

function get_hour_string(number)
{
	if(number.length == 1)
		number = "0" + number;
	return number;
}

function make_sysloghour_option()
{
	$("#syslog_hour").find("option").remove();
	for(var i = 0; i < 24; i++)
		$("#syslog_hour").append(
	"<option value = '" + i + "'>" + get_hour_string(i) + "</option>");
	$("#syslog_hour").val("0").selectmenu("refresh");
}

function printLogSize()
{
//	$("#lc_syslog_size").text(config_data.sysloginfo.size + "(" + config_data.sysloginfo.maxsize + ")");
	$("#lc_syslog_size").text(getLogLength() + "(" + config_data.sysloginfo.maxsize + ")");

}

function refreshFlipSwitch()
{
	$('#button_onoff').val( ~~( config_data.sysloginfo.run == "1" ) );
}
//local utility functions end
iux_update_local_func['sysloginfo'] = function(identifier)
{
	if(identifier == "S" || identifier == "D")
		return;
	make_sysloghour_option();
	refreshFlipSwitch();
//	printLogSize();
};

iux_update_local_func['email'] = function(identifier)
{
	if(identifier == "S" || identifier == "D")
		return;
	if(!config_data.email)
	{
		$(".syslog_email").remove();
		return;
	}
	if(config_data.email.send)
	{
		$(".lc_email_notenrolled").css("display", "none");
		$(".lc_available_email").css("display", "");
	}
	else
	{
		$(".lc_email_notenrolled").css("display", "");
		$(".lc_available_email").css("display", "none");
	}

	$(".email_setting_div input").prop("checked", config_data.email.send == "1"? true: false).checkboxradio("refresh");
	$(".email_setting_div select").val(config_data.email.hour).selectmenu("refresh");
	$(".remove_email_div input").prop("checked", config_data.email.remove == "1"? true: false).checkboxradio("refresh");
}

iux_update_local_func['history'] = function(identifier)
{
	if(identifier != "D")
		return;
	logid = status_data.history.row1 && status_data.history.row1.logid || logid;
	printSyslog();
	printLogSize();
};

add_listener_local_func['sysloginfo'] = function()
{
	$("#delete_log").click(function()
	{
                events.confirm({ msg: M_lang['S_SYSLOG_ALERT1'], runFunc: function(flag) {
			if(flag)
			{
				submit_local('remove');
			}
		}});
	});
        sliderButtonEvent( { object: $('#button_onoff'), runFunc: function()
	{
                submit_local("onoff");
	}});
}

add_listener_local_func['email'] = function()
{
	$("#sendemail").click(function()
	{
		submit_local("sendmail");
	});
	$(".email_setting_div input, .email_setting_div select, .remove_email_div input").change(function()
	{
		submit_local("mailoption");
	});
	$("#sysconf_login_link").click(function()
	{
		location.href="/sysconf/login/iux.cgi";
	});
}

submit_local_func['onoff'] = function()
{
        $('#loading').popup('open');
	
	var localdata = [];
	localdata.push({name : "run", value : $('#button_onoff option:selected').val()});
        return iux_submit('onoff', localdata);
}

submit_local_func['remove'] = function()
{
        $('#loading').popup('open');

	removeLog();

        return iux_submit('remove');
}

submit_local_func['sendmail'] = function()
{
        $('#loading').popup('open');
        return iux_submit('sendmail');
}

submit_local_func['mailoption'] = function()
{
        $('#loading').popup('open');

	var localdata = [];
	localdata.push({name : "send", value : $('.email_setting_div input[type="checkbox"]').prop("checked")? "1": "0"});
	localdata.push({name : "hour", value : $('.email_setting_div select').val()});
	localdata.push({name : "remove", value : $('.remove_email_div input[type="checkbox"]').prop("checked")? "1": "0"});

        return iux_submit('mailoption', localdata);
}

function confirm_result_local(flag)
{
        if(!flag)
                return;

}

$(document).ready(function() {
	window.tmenu = "sysconf";
	window.smenu = "syslog";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, null, true);

});

function loadLocalPage()
{
	get_syslog_status(window.tmenu, window.smenu);
	iux_update_local();
	iux_set_onclick_local();
}

function result_config()
{
}

function iux_set_onclick_local()
{
	listener_add_local();
}

function iux_update_local(identifier)
{
	for(var articleName in iux_update_local_func)
		iux_update_local_func[articleName].call(this, identifier);
}

function listener_add_local()
{
        for(var articleName in config_data)
        {
                if(!config_data.hasOwnProperty(articleName) || articleName == "")
                        continue;

                var caller_func = add_listener_local_func[articleName];
                if(caller_func) caller_func.call();
        }
}

function submit_local(service_name, localdata)
{
	submit_local_func[service_name].call(this, localdata);
}

function get_syslog_status(_tmenu, _smenu)
{
	$.ajaxSetup({async : true, timeout : 4000});
	var _data = [];
	_data.push({name : "tmenu", value : _tmenu});
	_data.push({name : "smenu", value : _smenu});
	_data.push({name : "act", value : "status"});
	_data.push({name : "logid", value : logid });

	$.getJSON('/cgi/iux_get.cgi', _data)
	.done(function(data) {
		if(json_validate(data, '') == true)
		{
			status_data = data;
			iux_update("D");
		}
	})
	.fail(function(jqxhr, textStatus, error) {
		//console.log("get_status : " + textStatus);
	})
	.always(function()
	{
		setTimeout(function(_tm, _sm){
			get_syslog_status(_tm, _sm);
		}, 2000, _tmenu, _smenu);
	});
}

function result_submit(act, result)
{
        if(errorcode != "0")
        {
                alert(M_lang['S_UNKNOWN_ERROR_MSG'] + "(" + errorcode + ")");
        }
        if(result_submit_func[act])
                result_submit_func[act].call(this, result);
        iux_update('C');
        iux_update_local();
}

