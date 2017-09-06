// JavaScript Document
var submit_local_func = [];
var init_func = [];
var result_submit_func = [];
var listener_local_func=[];
var localpostdata = [];
var submit_local_func=[];

var	ftime = false;
var current_status_data = [];

//hostscan
var regExp_size =  /^[0-9]{1,5}$/;
var regExp_timeout =  /^[0-9]{1,2}$/;
var regExp_count =  /^[0-9]{1,3}$/;

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "expertconf"; window.smenu = "hostscan";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 3000);

});

function loadLocalPage()
{
	init();
	listener_local();
}

function result_config()
{
	init();
}

// function call  //
function init(actname) { actname ? init_func[actname].call() : init_func['init'].call(); }
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['init'].call(); }
function submit_local(actname, act) { submit_local_func[actname].call(this, act); }
function result_submit(act, result) { result_submit_func[act].call(this, result); }

init_func['init'] = function()
{
	iux_update("C");
	//field show or hide
	var scantype = config_data.hostscan.scantype;
	if(parseInt(scantype) == 0 )
	{
		$("[sid='PING_FIELD']").show();
		$("[sid='TCP_FIELD']").hide();		
	}
	else
	{
		$("[sid='PING_FIELD']").hide();
		$("[sid='TCP_FIELD']").show();
	}
	//select pingtype 
	var pingtype = config_data.hostscan.pingtype;
	$("[sid='PINGTYPE'] option").each(function() {
		var value = $(this).attr('value');
		if( value == pingtype)
			$(this).attr('selected','selected');
	});
	$("[sid='PINGTYPE']").selectmenu("refresh", true);


	if( parseInt(pingtype) == 0 )
		ctr_enable('C_HOSTSCAN_SIZE', true);
	else
		ctr_enable('C_HOSTSCAN_SIZE', false);

	//insert ip data 
	if(config_data.hostscan.pingaddr && config_data.hostscan.pingaddr != "")
	{
		var pingaddr = config_data.hostscan.pingaddr;
		insert_ipaddr('HOSTSCAN_PINGADDR', pingaddr);
	}
	if(config_data.hostscan.tcpaddr && config_data.hostscan.tcpaddr != "")
	{
		var tcpaddr = config_data.hostscan.tcpaddr;
		insert_ipaddr('HOSTSCAN_TCPADDR', tcpaddr);
	}

	var textcolor = config_data.hostscan.textcolor;
	if(textcolor =='start')
	{
		$('[sid="START_BUTTON"]').hide();
		$('[sid="STOP_BUTTON"]').show();
		$('[sid="HOSTSCAN_LOGFIELD"]').css('background-color','#FFFFFF');
	}
		
	else
	{
		$('[sid="START_BUTTON"]').show();
		$('[sid="STOP_BUTTON"]').hide();
		$('[sid="HOSTSCAN_LOGFIELD"]').css('background-color','rgb(230, 230, 230)');
	}
	iux_update("S");
};	

listener_local_func['init'] = function()
{
	$('[sid="C_HOSTSCAN_SCANTYPE"]').change(function() {
		var scantype = $('[sid="C_HOSTSCAN_SCANTYPE"]:checked').val();
		if(parseInt(scantype) == 0 )
		{
			$("[sid='PING_FIELD']").show();
			$("[sid='TCP_FIELD']").hide();		
		}
		else
		{
			$("[sid='PING_FIELD']").hide();
			$("[sid='TCP_FIELD']").show();
		}
	});
	
	$('[sid="PINGTYPE"]').change(function() {
		var pingtype = $('[sid="PINGTYPE"] option:selected').val();
		if( parseInt(pingtype) == 0 )
			ctr_enable('C_HOSTSCAN_SIZE', true);
		else
			ctr_enable('C_HOSTSCAN_SIZE', false);

	});

	$('[sid="START_BUTTON"]').click(function(){
		if(submit_local('apply', 'start')){
			$('[sid="START_BUTTON"]').hide();
			$('[sid="STOP_BUTTON"]').show();
			$('[sid="HOSTSCAN_LOGFIELD"]').css('background-color','#FFFFFF');
		}
	});

	$('[sid="STOP_BUTTON"]').click(function(){
		if(submit_local('apply', 'stop')){
			$('[sid="START_BUTTON"]').show();
			$('[sid="STOP_BUTTON"]').hide();
			$('[sid="HOSTSCAN_LOGFIELD"]').css('background-color','rgb(230, 230, 230)');
		}
	});

	$('[sid="DEL_BUTTON"]').click(function(){
		submit_local('apply', 'clear'); 
	});
};

submit_local_func['apply'] = function(act)
{
	var error;
	var ipaddr;
	localpostdata = [];
	var scantype = $('[sid="C_HOSTSCAN_SCANTYPE"]:checked').val();
	var pingtype = $('[sid="PINGTYPE"] option:selected').val();
	switch(act)
	{
		case "start":
			status_data = [];
			current_status_data = [];
			$('[sid="HOSTSCAN_LOGFIELD"]').find('p').remove();

			localpostdata.push({name : 'act', value : 'start' });
			if(parseInt(scantype) == 0)
			{	
				ipaddr = convert_textfield_to_string("HOSTSCAN_PINGADDR");
				if(!ipaddr || ipaddr == "" || ipaddr == "...")
				{
					alert(M_lang['S_EMPTY_HOSTSCAN_PINGADDR']);
					insert_ipaddr('HOSTSCAN_PINGADDR');
					return false;
				}
				if( check_input_error(ipaddr, regExp_ip) )
				{
					alert(M_lang['S_ERROR_HOSTSCAN_PINGADDR']);
					insert_ipaddr('HOSTSCAN_PINGADDR');
					return false;
				}
				localpostdata.push({name : 'pingaddr', value : ipaddr });

				check_textfield_value('C_HOSTSCAN_COUNT', regExp_count);
				check_textfield_value('C_HOSTSCAN_TIMEOUT', regExp_timeout);
				
				//IP
				if(parseInt(pingtype) == 0) 
					check_textfield_value('C_HOSTSCAN_SIZE', regExp_size);

				var intSize = parseInt( $('[sid="C_HOSTSCAN_SIZE"]').val() );


			}
			else
			{
				//TCP
				ipaddr = convert_textfield_to_string("HOSTSCAN_TCPADDR");
				if(!ipaddr || ipaddr == "" || ipaddr == "...")
				{
					alert(M_lang['S_EMPTY_HOSTSCAN_PINGADDR']);
					insert_ipaddr('HOSTSCAN_TCPADDR');
					return false;
				}
				if( check_input_error(ipaddr, regExp_ip) )
				{
					alert(M_lang['S_ERROR_HOSTSCAN_PINGADDR']);
					insert_ipaddr('HOSTSCAN_TCPADDR');
					return false;
				}
				//sport
				var sport  = $('[sid="C_HOSTSCAN_SPORT"]').val();
				var eport  = $('[sid="C_HOSTSCAN_EPORT"]').val();
				check_textfield_value('C_HOSTSCAN_SPORT', regExp_port);
				
				//eport 예외사항있음
				if(!eport || eport == "" || eport == "0"  || check_input_error(eport, regExp_port) )
					$('[sid="C_HOSTSCAN_EPORT"]').val(sport);

				var intSport = parseInt( $('[sid="C_HOSTSCAN_SPORT"]').val() );
				var intEport = parseInt( $('[sid="C_HOSTSCAN_EPORT"]').val() );

				if( intSport > intEport )
				{
					alert(M_lang['S_ERROR_C_HOSTSCAN_PORT_RANGE']);
					return false;
				}
				localpostdata.push({name : 'tcpaddr', value : ipaddr });
			}
			break;
		case "stop": 
			localpostdata.push({name : 'act', value : 'stop' });
			break;
		case "clear":
			localpostdata.push({name : 'act', value : 'clear' });
			break;
	}
	$("#loading").popup("open");
	iux_submit('apply',localpostdata,true);
	return true;
};

result_submit_func['apply'] = function(result)
{
	$.ajaxSetup({async : true, timeout : 4000});
	var _data = [];
	_data.push({name : "tmenu", value : window.tmenu });
	_data.push({name : "smenu", value : window.smenu });
	_data.push({name : "act", value : "status"});
	$.getJSON('/cgi/iux_get.cgi', _data)
	.done(function(data) {
		if(json_validate(data, '') == true)
			status_data = data;
	});
};

function iux_update_local(id)
{ 

	if(status_data && config_data )
	{
		if( !current_status_data.log || (status_data.log.length != current_status_data.log.length) )
		{
			var statusmsg = status_data.log;
			current_status_data = status_data;

			if(!statusmsg)	return;

			$('[sid="HOSTSCAN_LOGFIELD"]').find('p').remove();

			for(var i = 0;i<statusmsg.length-1;i++)
				$('[sid="HOSTSCAN_LOGFIELD"]').append('<p>'+statusmsg[i].msg+'</p>');
			if(!ftime)
				$('[sid="HOSTSCAN_LOGFIELD"]').scrollTop($('[sid="HOSTSCAN_LOGFIELD"]')[0].scrollHeight);

			var hostscan = config_data.hostscan;
			var scantype = hostscan.scantype;
			var pingtype = hostscan.pingtype;
			$('[sid="HOSTSCAN_LOGFIELD"]').prepend('<p>　</p>');
			if(parseInt(scantype) == 0)
			{
				if(parseInt(pingtype) == 0)
					$('[sid="HOSTSCAN_LOGFIELD"]').prepend('<p>ICMP PING　'+M_lang['S_PING_IPADDR']
					+': '+hostscan.pingaddr+'　'+M_lang['S_PING_COUNT']+': '+hostscan.count+M_lang['S_PING_COUNTEND']
					+'　'+M_lang['S_PING_TIMEOUT']+': '+hostscan.timeout+M_lang['S_PING_TIMEOUT_SEC']+'　'+M_lang['S_PING_SIZE']+': '+hostscan.size+M_lang['S_PING_BYTES']+'</p>');
				else
					$('[sid="HOSTSCAN_LOGFIELD"]').prepend('<p>ARP PING　'+M_lang['S_PING_IPADDR']
					+': '+hostscan.pingaddr+'　'+M_lang['S_PING_COUNT']+': '+hostscan.count+M_lang['S_PING_COUNTEND']
					+'　'+M_lang['S_PING_TIMEOUT']+': '+hostscan.timeout+M_lang['S_PING_TIMEOUT_SEC']+'</p>');
			}
			else
				$('[sid="HOSTSCAN_LOGFIELD"]').prepend('<p>TCP포트스캔　'+M_lang['S_PING_IPADDR']+': '+hostscan.pingaddr+'　'+M_lang['S_TCP_PORT']+': '+hostscan.sport+' ~ '+hostscan.eport+'</p>');
		}
	}
}

function insert_ipaddr(sid, ip)
{	
	var s_ip;
	if(ip)
		s_ip = ip.split(".");
	else
		s_ip = ["","","",""];

	for(var i=0;i<4;i++)
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
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


function check_textfield_value(sid, regExp, directstringvalue)
{
	if(!directstringvalue)
	var value =  $('[sid="'+sid+'"]').val();
	else
		value = directstringvalue;

	var Usid = sid.toUpperCase();
	if(!value || value == "")
	{
		alert(M_lang['S_EMPTY_'+Usid]);
		$('[sid="'+sid+'"]').focus();
		return false;
	}

	if( check_input_error(value, regExp) )
	{
		alert(M_lang['S_ERROR_'+Usid]);
		$('[sid="'+sid+'"]').val("");
		$('[sid="'+sid+'"]').focus();	
		return false;
	}
	return true
}
