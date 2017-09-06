//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var result_submit_func = [];
var status2_data = null;

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var printData = '';
//local-global variables end

//local utility functions
function get_trunk_port_string()
{
	var str = "";
	for(var key in config_data.trunk)
	{
		if(key == "" || !(key.substr(0, 4) == "port"))
			continue;

		str += eval("config_data.trunk." + key) + ", ";
	}
	return str.substr(0, str.length - 2);
}

//local utility functions end
iux_update_local_func['portmirror'] = function(identifier)
{
	if(identifier == 'D' || identifier == "S")
		return;

	$("#C_PORTMIRROR_DISPLAYPORTNUMBER").text(config_data.portmirror.displayportnumber);

        var value = config_data.portmirror.run == "0" ? 0: 1;
        $('[sid="LC_PORTMIRROR"]').val(value);

};

add_listener_local_func['portmirror'] = function()
{
  
        sliderButtonEvent( { object: $('[sid="LC_PORTMIRROR"]'), runFunc: function() {
		submit_local("portmirror");
        }});
};

submit_local_func['portmirror'] = function()
{
	if( config_data.trunk && config_data.trunk.run == 1 && config_data.portmirror.run == 0)
	{
		alert(M_lang["S_SWITCH_ALERT1"] + config_data.portmirror.displayportnumber + M_lang["S_SWITCH_ALERT2"]);
		iux_update_local();
		return;
	}
	$('#loading').popup('open');

	var value = $('[sid="LC_PORTMIRROR"] option:selected').val();
	if(value != 0)
		value = config_data.portmirror.portnumber;

	var localdata = [];
	localdata.push({name : "run", value : value});
	return iux_submit('portmirror', localdata);
}

iux_update_local_func['jumboframe'] = function(identifier)
{
	if(identifier == 'D' || identifier == "S")
		return;

        var value = config_data.jumboframe.run == "0" ? 0: 1;
        $flipSwitch = $('[sid="LC_JUMBOFRAME"]').val(value);
};

add_listener_local_func['jumboframe'] = function()
{
        sliderButtonEvent( { object: $('[sid="LC_JUMBOFRAME"]'), runFunc: function() {
		submit_local("jumboframe");
        }});
};

submit_local_func['jumboframe'] = function()
{
	$('#loading').popup('open');

	var value = $('[sid="LC_JUMBOFRAME"] option:selected').val();

	var localdata = [];
	localdata.push({name : "run", value : value});
	return iux_submit('jumboframe', localdata);
}

iux_update_local_func['trunk'] = function(identifier)
{
	if(identifier == 'D' || identifier == "S")
		return;

	$("#C_TRUNK_PORTNUMBER").text(get_trunk_port_string());

        var value = config_data.trunk.run == "0" ? 0: 1;
        $flipSwitch = $('[sid="LC_TRUNK"]').val(value);
};

add_listener_local_func['trunk'] = function()
{
        sliderButtonEvent( { object: $('[sid="LC_TRUNK"]'), runFunc: function() {
		submit_local("trunk");
        }});
};

submit_local_func['trunk'] = function()
{
	if( config_data.portmirror && config_data.portmirror.run > 0 && config_data.trunk.run == 0)
	{
		alert(M_lang["S_SWITCH_ALERT3"] + config_data.portmirror.displayportnumber + M_lang["S_SWITCH_ALERT4"]);
		iux_update_local();
		return;
	}
	$('#loading').popup('open');

	var value = $('[sid="LC_TRUNK"] option:selected').val();
	var localdata = [];
	localdata.push({name : "run", value : value});
	return iux_submit('trunk', localdata);
}

$(document).ready(function() {
	window.tmenu = "trafficconf";
	window.smenu = "switch";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, null, true);
});

function loadLocalPage()
{
	iux_update_local();
	listener_add_local();
}

function result_config()
{
}

function iux_update_local(identifier)
{
        for(var articleName in config_data){
                if(!config_data.hasOwnProperty(articleName) || articleName == "")
			continue;

		var caller_func = iux_update_local_func[articleName];
		if(caller_func) caller_func.call(this, identifier);
        }
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
	if(submit_local_func[service_name].call(this, localdata)){
	}
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
