// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var data_local=[];
var waninfo = ["dynamic","static","pppoe"];

var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mtu =  /^[0-9]{1,4}$/;
var regExp_lcp =  /^[0-9]{1,3}$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "netinfo"; window.smenu = "waninfo";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
	events.on('load_header_ended_local', function(menuname){
		iux_update("S");
		$("#right_panel").panel("open")
	});
});

$( document ).on("returnMacAddress", macsearch_select );

function loadLocalPage()
{
	var confing_info = config_data.waninfo.info;
	get_waninfo(confing_info);
	add_listener_local();
}

function result_config()
{
	ctr_init();
}

function result_submit()
{
	setTimeout(function() {
		iux_update("C");
		update_wanstatus_line();
	}, 1000);
}

function ctr_addrfield(flag)
{
	control_enable('D_EXTIP_STATUS',flag);
	control_enable('D_NETMASK_STATUS',flag);
	control_enable('D_GATEWAY_STATUS',flag);
}

function ctr_init()
{
	$(".lc_row:visible:even .ui-checkbox label").css("background-color","#FFFFFF");
	$(".lc_row:visible:even").css("background-color","#FFFFFF");
	$(".lc_row:visible:odd .ui-checkbox label").css("background-color","#F9FAF5");
	$(".lc_row:visible:odd").css("background-color","#F9FAF5");
}

function ctr_visible(info)
{
	var Info = info.toUpperCase();
	$('[sid^="L_FIELD_"]').each(function()
	{
		var csid = $(this).attr('sid');
		var s_csid = csid.split('_');
		if(s_csid[2] == Info)
		{
			$(this).show();
			$(this).find('input').removeAttr('disabled');
		}
		else
		{
			$(this).hide();
			$(this).find('input').attr('disabled',true);
		}
	});
}

function update_wanstatus_line()
{
	var currentinfo = $('[sid="C_WANINFO_INFO"]:checked').val();
	if(currentinfo != config_data.waninfo.info){
		$('[sid=\"STATUS_MSG\"]').css('display', 'none');
		$('[sid=\"S_TITLE_STATUS\"]').css('display', 'none');
		$('[sid=\"S_BUTTON_SUBMIT\"]').parent().css('float', 'right');
	}else{
		$('[sid=\"STATUS_MSG\"]').css('display', '');
		$('[sid=\"S_TITLE_STATUS\"]').css('display', '');
		$('[sid=\"S_BUTTON_SUBMIT\"]').parent().css('float', 'right');
	}
}

iux_update_local_func['dynamic'] = function(id) 
{	
	switch(id)
	{
		case "S":
			break;
		case "C":
			var dns_check = $('[sid="C_DYNAMIC_MDNS"]:checked').val()?1:0;
			control_enable('DNS1',dns_check);
			control_enable('DNS2',dns_check);
			var mtu_check = $('[sid="C_DYNAMIC_MMTU"]:checked').val()?1:0;
			control_enable('MTU_FIELD',mtu_check);
			var mac_check = $('[sid="C_WANINFO_MMAC"]:checked').val()?1:0;
			control_enable("C_WANINFO_MAC", mac_check);
			change_submit_button();
			break;
		case "D":
			$('[sid="STATUS_MSG"]').empty();
			var status_status = status_data.status.status;
			var statusmsg = status_status.split(".");
			if(statusmsg.length > 0)
			{
				if(statusmsg[0] == "D_WWAN_DESC")
				{
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[0] ] + M_lang[ statusmsg[1] ] + "</p>");
					for (var i=0; i<statusmsg.length-1;i++)
						if(i > 1)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[2] ] + "</p>");
				}
				else
					for (var i=0; i<statusmsg.length-1;i++)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[i] ] + "</p>");
			}
			break;
	}
};
function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

submit_local_func['dynamic'] = function()
{
	var dns_check = $('[sid="C_DYNAMIC_MDNS"]:visible:checked').val()?1:0;
	var mac_check = $('[sid="C_WANINFO_MMAC"]:visible:checked').val()?1:0;
	var mtu_check = $('[sid="C_DYNAMIC_MMTU"]:visible:checked').val()?1:0;
	var localpostdata = [];
	if(dns_check)
	{
		var dns1 = convert_textfield_to_string('C_DYNAMIC_DNS1');
		var dns2 = convert_textfield_to_string('C_DYNAMIC_DNS2');
		if( (dns1 != "..." && !check_input_error(dns1,regExp_ip)) &&
			(dns2 == "..." || !check_input_error(dns2,regExp_ip)) ) //정상
		{
			localpostdata.push({name : 'dns1', value : dns1});
			localpostdata.push({name : 'dns2', value : dns2});
		}
		else
		{
			alert(M_lang["S_INVALID_DNS_STRING"]);
			return;
		}
			
	}
	if(mac_check)
	{
		var mac = convert_textfield_to_string('C_WANINFO_MAC');
		if( mac != "" && !check_input_error(mac, regExp_mac) )
			localpostdata.push({name : 'mac', value : mac});
		else
		{
			alert(M_lang["S_INVALID_HWADDRESS_STRING"]);
			return;
		}
	}
	if(mtu_check)
	{
		var mtu = $('[sid="C_DYNAMIC_MTU"]').val();
		if( mtu != "" && !check_input_error(mtu,regExp_mtu) && mtu>=500 && mtu<=1500)
			localpostdata.push({name : 'mtu', value : mtu});
		else
		{
			alert(M_lang["S_INVALID_MTU_STRING"]);
			return;
		}
			
	}
	submit_local(localpostdata);
};

ctr_init_func['dynamic'] = function()
{
	ctr_visible('dynamic');
	ctr_addrfield(false);
	ctr_init();
	iux_update("C");
};

iux_update_local_func['pppoe'] = function(id) 
{	
	switch(id)
	{
		case "S":
			break;
		case "C":
			var dns_check = $('[sid="C_PPPOE_MDNS"]:checked').val()?1:0;
			control_enable('DNS1',dns_check);
			control_enable('DNS2',dns_check);
			var mtu_check = $('[sid="C_PPPOE_MMTU"]:checked').val()?1:0;
			control_enable('MTU_FIELD',mtu_check);
			var mac_check = $('[sid="C_WANINFO_MMAC"]:checked').val()?1:0;
			control_enable("C_WANINFO_MAC", mac_check);
			var lcp_check = $('[sid="C_PPPOE_MLCP"]:checked').val()?1:0;
			control_enable("LCP_FIELD", lcp_check);
			change_submit_button();
			break;
		case "D":
			$('[sid="STATUS_MSG"]').empty();
			var status_status = status_data.status.status;
			var statusmsg = status_status.split(".");
			if(statusmsg.length > 0)
			{
				if(statusmsg[0] == "D_WWAN_DESC")
				{
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[0] ] + M_lang[ statusmsg[1] ] + "</p>");
					for (var i=0; i<statusmsg.length-1;i++)
						if(i > 1)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[2] ] + "</p>");
				}
				else
					for (var i=0; i<statusmsg.length-1;i++)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[i] ] + "</p>");
			}
			break;
	}
};

submit_local_func['pppoe'] = function()
{
	var dns_check = $('[sid="C_PPPOE_MDNS"]:visible:checked').val()?1:0;
	var mac_check = $('[sid="C_WANINFO_MMAC"]:visible:checked').val()?1:0;
	var mtu_check = $('[sid="C_PPPOE_MMTU"]:visible:checked').val()?1:0;
	var lcp_check = $('[sid="LCP_CHECK"]:visible:checked').val()?1:0;
	var localpostdata = [];
	var userid = $('[sid="C_PPPOE_USERID"]').val();
	var userpw = $('[sid="C_PPPOE_USERPW"]').val();
	if(userid != "" && !check_input_error(userid, regExp_text) )
		localpostdata.push({name : 'userid', value : userid});
	else
	{
		alert(M_lang["S_INVALID_USERID_STRING"]);
		return;
	}
	if(userpw != "")
		localpostdata.push({name : 'userpw', value : userpw});
	else
	{
		alert(M_lang["S_INVALID_USERPW_STRING"]);
		return;
	}
	if(dns_check)
	{
		var dns1 = convert_textfield_to_string('C_PPPOE_DNS1');
		var dns2 = convert_textfield_to_string('C_PPPOE_DNS2');

		if( (dns1 != "..." && !check_input_error(dns1,regExp_ip)) &&
			(dns2 == "..." || !check_input_error(dns2,regExp_ip)) ) //정상
		{
			localpostdata.push({name : 'dns1', value : dns1});
			localpostdata.push({name : 'dns2', value : dns2});
		}
		else
		{
			alert(M_lang["S_INVALID_DNS_STRING"]);
			return;
		}
	}
	if(mac_check)
	{
		var mac = convert_textfield_to_string('C_WANINFO_MAC');
		if( mac != "" && !check_input_error(mac, regExp_mac) )
			localpostdata.push({name : 'mac', value : mac});
		else
		{
			alert(M_lang["S_INVALID_HWADDRESS_STRING"]);
			return;
		}
	}
	if(mtu_check)
	{
		var mtu = $('[sid="C_PPPOE_MTU"]').val();
		if( mtu != "" && !check_input_error(mtu,regExp_mtu) && mtu>=500 && mtu<=1454)
			localpostdata.push({name : 'mtu', value : mtu});
		else
		{
			alert(M_lang["S_INVALID_MTUPPPOE_STRING"]);
			return;
		}
	}
	if(lcp_check)
	{
		
		var interval = $('[sid="C_PPPOE_INTERVAL"]').val();
		var failure = $('[sid="C_PPPOE_FAILURE"]').val();
		
		if( interval != "" && !check_input_error(interval,regExp_lcp) && interval>=1 && interval<=999)
			localpostdata.push({name : 'interval', value : interval});
		else
		{
			alert(M_lang["S_INVALID_LCPINTERVAL_STRING"]);
			return;
		}
		if( failure != "" && !check_input_error(failure,regExp_lcp) && failure>=1 && failure<=999)
			localpostdata.push({name : 'failure', failure : failure});
		else
		{
			alert(M_lang["S_INVALID_LCPFAILURE_STRING"]);
			return;
		}
	}
	submit_local(localpostdata);
};

ctr_init_func['pppoe'] = function()
{
	ctr_visible('pppoe');
	ctr_addrfield(false);
	ctr_init();
	iux_update("C");
};

iux_update_local_func['static'] = function(id) 
{	
	switch(id)
	{
		case "S":
			break;
		case "C":
			control_enable('DNS1',true);
			control_enable('DNS2',true);
			var mtu_check = $('[sid="C_STATIC_MMTU"]:checked').val()?1:0;
			control_enable('MTU_FIELD',mtu_check);
			var mac_check = $('[sid="C_WANINFO_MMAC"]:checked').val()?1:0;
			control_enable("C_WANINFO_MAC", mac_check);
			break;
		case "D":
			$('[sid="STATUS_MSG"]').empty();
			var status_status = status_data.status.status;
			var statusmsg = status_status.split(".");
			if(statusmsg.length > 0)
			{
				if(statusmsg[0] == "D_WWAN_DESC")
				{
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[0] ] + M_lang[ statusmsg[1] ] + "</p>");
					for (var i=0; i<statusmsg.length-1;i++)
						if(i > 1)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[2] ] + "</p>");
				}
				else
					for (var i=0; i<statusmsg.length-1;i++)
						$('[sid="STATUS_MSG"]').append("<p>" + M_lang[ statusmsg[i] ] + "</p>");
			}
			break;
	}
};

submit_local_func['static'] = function()
{
	var mac_check = $('[sid="C_WANINFO_MMAC"]:visible:checked').val()?1:0;
	var mtu_check = $('[sid="C_STATIC_MMTU"]:visible:checked').val()?1:0;
	var localpostdata = [];
	var extip = convert_textfield_to_string('C_STATIC_EXTIP');
	var netmask = convert_textfield_to_string('C_STATIC_NETMASK');
	var gateway = convert_textfield_to_string('C_STATIC_GATEWAY');
	if( extip != "..." && !check_input_error(extip,regExp_ip) )
			localpostdata.push({name : 'extip', value : extip});
	else
	{
		alert(M_lang["S_INVALID_IP_STRING"]);
		return;
	}
	if( netmask != "..." && !check_input_error(netmask,regExp_ip) )
			localpostdata.push({name : 'netmask', value : netmask});
	else
	{
		alert(M_lang["S_INVALID_NETMASK_STRING"]);
		return;
	}
	if( gateway != "..." && !check_input_error(gateway,regExp_ip) )
			localpostdata.push({name : 'gateway', value : gateway});
	else
	{
		alert(M_lang["S_INVALID_GATEWAY_STRING"]);
		return;
	}

	var dns1 = convert_textfield_to_string('C_STATIC_DNS1');
	var dns2 = convert_textfield_to_string('C_STATIC_DNS2');
	if( (dns1 != "..." && !check_input_error(dns1,regExp_ip)) &&
		(dns2 == "..." || !check_input_error(dns2,regExp_ip)) ) //정상
	{
		localpostdata.push({name : 'dns1', value : dns1});
		localpostdata.push({name : 'dns2', value : dns2});
	}
	else
	{
		alert(M_lang["S_INVALID_DNS_STRING"]);
		return;
	}
	if(mac_check)
	{
		var mac = convert_textfield_to_string('C_WANINFO_MAC');
		if( mac != "" && !check_input_error(mac, regExp_mac) )
			localpostdata.push({name : 'mac', value : mac});
		else
		{
			alert(M_lang["S_INVALID_HWADDRESS_STRING"]);
			return;
		}
	}
	if(mtu_check)
	{
		var mtu = $('[sid="C_STATIC_MTU"]').val();
		if( mtu != "" && !check_input_error(mtu,regExp_mtu) && mtu>=500 && mtu<=1500)
			localpostdata.push({name : 'mtu', value : mtu});
		else
		{
			alert(M_lang["S_INVALID_MTU_STRING"]);
			return;
		}
	}
	submit_local(localpostdata);
};
ctr_init_func['static'] = function()
{
	ctr_visible('static');
	ctr_init();
	iux_update("C");
};

function iux_update_local(id)
{
	if( !config_data )
		return;
	if(!id)
		iux_update_local_func['init'].call();
	else
	{
		var currentinfo = $('[sid="C_WANINFO_INFO"]:checked').val();
		if (!currentinfo) currentinfo = config_data.waninfo.info;
		iux_update_local_func[currentinfo].call(this, id);
	}
	if(id =="D")
		change_submit_button();
}

function get_waninfo(confing_info)
{
	for(var i = 0; i < waninfo.length ; i++)
	{
		if( confing_info == waninfo[i] )
			$("#"+waninfo[i]).prop('checked', true).checkboxradio("refresh");
		else
			$("#"+waninfo[i]).removeAttr('checked').checkboxradio("refresh"); 
	}
	ctr_init_func[confing_info].call();
}

function control_enable(sid, flag)
{
	$('[sid="'+sid+'"] input').each(function() {
		if( $(this).attr("type") == "text" || $(this).attr("type") == "button" || $(this).attr("type") == "number" )
		{
			if(flag == true)
			{
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

function add_listener_local()
{
	$('[sid="PW_CHECK"]').change(function()
	{
		var pw_check = $('[sid="PW_CHECK"]:visible:checked').val()?1:0;
		if(pw_check)
			$('[sid="C_PPPOE_USERPW"]').attr("type","text");
		else
			$('[sid="C_PPPOE_USERPW"]').attr("type","password");
	});
	
	/*DNS Manual check button*/
	$('input[name=check_dns]').change(function()
	{
		var dns_check = $('input[name=check_dns]:visible:checked').val()?1:0;
		control_enable('DNS1', dns_check);
		control_enable('DNS2', dns_check);
	});
	/*Mac Manual check button*/
	$('[sid="C_WANINFO_MMAC"]').change(function()
	{
		var convert_mac;
		var mac_check = $('[sid="C_WANINFO_MMAC"]:visible:checked').val()?1:0;
		if(mac_check)
			convert_mac = convert_macaddr(config_data.waninfo.rmac);
		else
			convert_mac = convert_macaddr(config_data.waninfo.mac);
		for(var i=0;i<convert_mac.length;i++)
			$('#mac_field [sid="VALUE'+i+'"] ').val(convert_mac[i]);

		control_enable("C_WANINFO_MAC", mac_check);
	});
	/*MTU Manual check button*/
	$('input[name=check_mtu]').change(function()
	{
		var mtu_check = $('input[name=check_mtu]:visible:checked').val();
		control_enable("MTU_FIELD", mtu_check);
	});
	/*Waninfo Manual check button*/
	$('[sid="C_WANINFO_INFO"]').change(function()
	{
		var currentinfo = $('[sid="C_WANINFO_INFO"]:visible:checked').val();
		if(!currentinfo) info = config_data.waninfo.info;
		ctr_init_func[currentinfo].call();
		update_wanstatus_line();
		//get_config(window.tmenu, window.smenu);
	});
	/*LCP Manual check button*/
	$('[sid="C_PPPOE_MLCP"]').change(function()
	{
		var lcp_check = $('[sid="C_PPPOE_MLCP"]:visible:checked').val()?1:0;
		control_enable("LCP_FIELD", lcp_check);
	});
	$("[sid^='VALUE']").each(function()
	{
		$(this).keyup(function() { change_submit_button() });
	});

	/*Submit button*/
	$('[sid="S_BUTTON_SUBMIT"]').click(function()
	{
		var submit = $('[sid="STATUS"] input').attr('submit');
		if( submit == "connect" || submit == "disconnect" )
		{
			var localpostdata = [];
			localpostdata.push({name : 'submit', value : submit});
			submit_local(localpostdata);
		}
		else
		{
			var currentinfo = $('[sid="C_WANINFO_INFO"]:visible:checked').val();
			submit_local_func[currentinfo].call();
		}
	});

	$("[sid='MAC_SEARCH_CHECK']").click( LoadMacListPanel );
}

function check_change_value_local()
{
	var result = false;
	if( $("#right_panel").hasClass("ui-panel-open") )
		return false;
	$("[sid^='C_'], [sid^='N_']").each(function()
	{
		var sid = $(this).attr("sid");	
		var s_sid = sid.split("_");
		var aObj = eval("config_data." + s_sid[VAL_ARTICLE].toLowerCase());
		if(aObj)
		{
			var value = eval("aObj." + s_sid[VAL_TAGNAME].toLowerCase());
			if( $(this).attr("disabled") != true &&
				$(this).attr("disabled") != "disabled" &&
				!( $(this).attr("readonly") ) &&
				$(this).attr("display") != "none" )
			{
				if($(this).hasClass('mac'))
				{
					var macarr = value.split('-');
					if(value == ''){macarr = ['','','','','',''];}
					$('[sid=\"'+$(this).attr('sid')+'\"] [sid^=VALUE]').each(function(){
						var indexnum = $(this).attr('sid').replace(/[^0-9]/g,'');
						if(macarr[indexnum] != $(this).val())
							result = true;
					});
				}
			}
		}
	});

	return result;
}

function change_submit_button()
{
	var currentinfo = $('[sid="C_WANINFO_INFO"]:visible:checked').val();
	if(check_change_value())
	{
		$('[sid="STATUS"] input').attr('value', M_lang['S_BUTTON_SUBMIT']);
		$('[sid="STATUS"] input').removeAttr('submit');
		control_enable('STATUS', true);
	}	
	else
	{
		if(currentinfo == 'static')
			control_enable('STATUS', false);
		else
		{
			control_enable('STATUS', true);
			var conn;
			if(!status_data) conn = 'connect';
			else
				conn = status_data.conn.status;
			if(conn == 'connect')
			{
				if(currentinfo == 'pppoe')
					$('[sid="STATUS"] input').attr('value',M_lang['S_SYSINFO_INTERNET_DISCONNECT']);
				else
					$('[sid="STATUS"] input').attr('value',M_lang['S_NETCONF_INTERNET_DISCONNECT_BT']);
				$('[sid="STATUS"] input').attr('submit',"disconnect");

			}
			else
			{
				if(currentinfo == 'pppoe')
					$('[sid="STATUS"] input').attr('value',M_lang['S_SYSINFO_INTERNET_RECONNECT']);
				else
					$('[sid="STATUS"] input').attr('value',M_lang['S_NETCONF_INTERNET_CONNECT_BT']);
				$('[sid="STATUS"] input').attr('submit',"connect");
			}
		}
	}
}

function convert_macaddr(mac)
{
	mac = mac.toUpperCase();
	var idstr = mac.substr(2,1);
	var convert_mac = mac.split(idstr);
	if(convert_mac.length != 6)
		convert_mac = ["00","00","00","00","00","00"];
	return convert_mac;
}

function macsearch_select( event, macaddr )
{
	var convert_mac;

	$('[sid="C_WANINFO_MMAC"]').prop('checked', true).checkboxradio("refresh");
	control_enable("C_WANINFO_MAC", true);
	convert_mac = convert_macaddr(macaddr);
	for(var i=0;i<convert_mac.length;i++)
		$('#mac_field [sid="VALUE'+i+'"] ').val(convert_mac[i]);
}

function submit_local(localpostdata)
{
	localpostdata.push({name : 'wanname', value : "wan1"});
	$("#loading").popup("open");
	iux_submit("apply", localpostdata, true);
	//setTimeout(function() {
	//	get_config(window.tmenu, window.smenu);
	//	iux_update("C");
	//}, 1000);
}

function LoadMacListPanel () 
{
	var maclist, $list, $refreshButton;
	loadPanel();
	function loadPanel()
	{
		remove();
		getMaclist();
		getPage();
	}
	function getPage() {
		$("#right_content").load('html/maclist.html', function(responseTxt, statusTxt, xhr) {
			if (statusTxt == "success")
			{
				$(this).trigger('create');
				//events.off('load_header_ended_local');
				//events.on('load_header_ended_local', function(menuname){
				//	iux_update("S");
				//	$("#right_panel").panel("open")
				//});
				load_header(RIGHT_HEADER, 'maclist');
				init();
				if( maclist )
					update();
			}
		});
	}
	function getMaclist()
	{
		$("#loading").popup("open");
		$.getJSON('/cgi/iux_get.cgi', {
			tmenu : window.tmenu,
			smenu : window.smenu,
			act : "data"
		})
		.done(function(data)
		{
			if(json_validate(data, '') == true)
			{
				maclist = data.maclist;
				if ( $list && $refreshButton )
					update();
			}
		})
		.always(function()
		{
			setTimeout( function() {
				$("#loading").popup("close");
			}, 300);
		});
	}
	function init() {
		cache();
		bindEvents();
	}
	function cache() {
		$list = $("#maclist").children("ul[sid='RIGHT_MACLIST']");
		$refreshButton = $("#maclist").find("button[sid='REFRESH_BUTTON']");
	}
	function bindEvents() {
		$list.on( "click", "li", returnMacAddress );
		$refreshButton.on( "click", getMaclist );
	}
	function getMacListLength() {
		return maclist.length - 1;
	}
	function getListLength() {
		return $list.children("li").length;
	}
	function update() {
		makeRow();
		updateRows();
	}
	function makeRow() {
		var maclistLength = getMacListLength(),
			listLength = getListLength();
		
		if( maclistLength < listLength ) {
			$list.children("li").filter( function( index ) { return index >= listLength - maclistLength; }).remove();
		} else if( maclistLength > listLength ) {
			appendRow( maclistLength - listLength );
		}
	}
	function appendRow( length ) {
		var tmpArray = [];
		for ( var i = 0; i < length; ++i )
		{
			tmpArray.push( $([
			'<li sid="MACADDRIDX_'+i+'" class="lc_content_remotepc maclist_li">',
				'<div class="lc_left maclist_left">',
					'<p id="mac"></p>',
					'<p id="ip" style="color: rgb(170, 170, 170);"></p>',
				'</div>',
				'<div class="lc_middle maclist_right">',
					'<p id="name" style="color: rgb(170, 170, 170);"></p>',
				'</div>',
			'</li>'].join("")) );
		}
		$list.append( tmpArray );
	}
	function updateRows() {
		var length = getListLength(), $rows = $list.children("li");
		for( var i = 0; i < length; ++i) {
			updateRow( $rows[i], maclist[i] );
		}
	}
	function updateRow( row, data ) {
		$( row ).find("#ip").text( data.ipaddr );
		$( row ).find("#mac").text( data.hwaddr );
		$( row ).find("#name").text( data.hostname );
	}
	function returnMacAddress() {
		var mac = $( this ).find("#mac").text();
		$( document ).trigger("returnMacAddress", mac );
		$("#right_panel").panel("close");
	}
	function remove() {
		if( $list )
			$list.unbind( "click" );
		if( $refreshButton )
			$refreshButton.unbind( "click" );

		maclist = null;
		$list = null;
		$refreshButton = null;
	}
}
