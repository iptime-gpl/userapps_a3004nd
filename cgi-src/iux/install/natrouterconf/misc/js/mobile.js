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

var printData = '';
var rebootlocaldata = null;
var confirm_mode = null;
var confirm_data = null;
var prevIGMP;
//local-global variables end

//local utility functions

function macsearch_runfunc()
{
        $.ajaxSetup({ async : false });
        $.getJSON('/cgi/iux_get.cgi', {
                tmenu : window.tmenu,
                smenu : window.smenu,
                act : "data"
        })
        .done(function(data) {
                if(json_validate(data, '') == true)
                        data_local = data;
        })
        .fail(function(jqxhr, textStatus, error) {
                alert(M_lang['S_SELECTMAC_NO_MAC']);
        });
        if(data_local.maclist.length != 0)
        {
                $('[sid="C_WANINFO_MACLIST"]').find('li').remove();
                for(var i=0; i < data_local.maclist.length-1; i++)
                {
                        $('[sid="C_WANINFO_MACLIST"]').append("<li><a onClick='macsearch_select(\""+data_local.maclist[i].hwaddr+"\");'><p>" 
				+ data_local.maclist[i].ipaddr + " ("  + data_local.maclist[i].hwaddr + ")</p></a></li>");
                }
        }
        $('[sid="C_WANINFO_MACLIST"]').listview( "refresh" );
        $("li>a").removeClass("ui-btn-icon-right");

        $("li>a:even").css("background-color","#FFFFFF");
        $("li>a:odd").css("background-color","#F9FAF5");

        $("#list_popup").popup("open");
}

function macsearch_select(macaddr)
{
        var convert_mac;
        $("#select_mac_popup").popup("close");
        convert_mac = convert_macaddr(macaddr);
        for(var i=0;i<convert_mac.length;i++)
                $('#mac_field [sid="VALUE'+i+'"] ').val(convert_mac[i]);
	
        $("#list_popup").popup("close");
	unlock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
}



function check_input_range(type, sid)
{
	switch( type ) {
	case "IP" :
		var ipaddr = convert_textfield_to_string(sid);
		if(ipaddr == "...")
		{
			alert(M_lang['S_IP_BLANKED']);
			return false;
		}
		if(check_input_error(ipaddr, regExp_ip))
		{
			alert(M_lang['S_IP_NOTEXIST']);
			return false;	
		}
		break;
	case "MAC" :
		var macaddr = convert_textfield_to_string(sid);
		if(macaddr == ":::::")
		{
			alert(M_lang['S_MAC_BLANKED']);
			return false;	
		}
		if(check_input_error(macaddr, regExp_mac))
		{
			alert(M_lang['S_MAC_NOTEXIST']);
			return false;	
		}
		break;
	case "LEASETIME" :
		var ip_update = $(sid).val();
		if(check_input_error(ip_update,regExp_onlynum))
		{
			alert(M_lang['S_INVALID_NUMBER']);
			return false;	
		}
		break;
	case "PORT" :
		var value = $("[sid =" + sid + "]").val();
		if(check_input_error(value, regExp_onlynum))
		{
			alert(M_lang['S_INVALID_NUMBER']);
			return false;	
		}
		if(parseInt(value) < 1 || parseInt(value) > 65535)
		{
			alert(M_lang['S_FTP_ERROR2']);
			return false;	
		}
		if($("#ftp_port_5").val() != "")
		{
			alert(M_lang['S_FTP_ERROR1']);
			return false;	
		}
		break;
	}
	return true;
}


function lock_obj(selector, proptype)
{
	$(selector).prop(proptype, true);
	$(selector).parent().addClass('ui-state-disabled');
}

function unlock_obj(selector, proptype)
{
	$(selector).prop(proptype, false);
	$(selector).parent().removeClass('ui-state-disabled');
}

function background_color(selector)
{
	$(selector + ":even").each(function() {
		$(this).css("background-color","#FFFFFF");
	});
	$(selector + ":odd").each(function() {
		$(this).css("background-color","#F9FAF5");
	});
}

function check_input_error(string, regExp)
{
	if(!string || !string.match(regExp))
		return true;
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

function submit_button_event_add(service_name)
{
	$('[sid = "S_BUTTON_SUBMIT"]').click(function() {submit_local(service_name);});

}

function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		location.reload();
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function immediately_submit_event_add(service_name, sid)
{
	$('[sid = "' + sid + '"]').unbind('change').change( function() {
		submit_local(service_name);
	});
}

function submitEvent( service_name ) {
	submit_local(service_name);
}

function reboot_submit(service_name, localdata)
{
	if(!service_name.match(regExp_spchar)){
		var remaining = parseInt(config_data[service_name].rebootsec);
		$('#loading_reboot').popup('open');
		iux_submit(service_name, localdata);

		reboot_timer(remaining);
		stopstatus = true;
	}
}

function convert_ipaddr(ip)
{
	return ip.split(".");
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

function confirm_result_local(flag)
{
        if(!confirm_mode)       return;
        confirm_data = null;    confirm_mode = null;    rebootlocaldata = null;
}
//local utility functions end
//
//dmztwinip start
iux_update_local_func['dmztwinip'] = function(identifier, viewing)
{
	if(identifier == 'C')
	{
		if(viewing)
		{
			lock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
			$('#ipaddr_text').text("(" + config_data.dmztwinip.ipaddr + ")");

			var ipaddr;
			if( config_data.dmztwinip.ipaddr.split(".").length != 4 )
			{
				$("#dmz_sub_label").hide();
				$("#current_mac_check").parent().hide();
				if( config_data.dmztwinip.fakeip && config_data.dmztwinip.fakeip.split(".").length === 4 )
					ipaddr = convert_ipaddr(config_data.dmztwinip.fakeip );
			}
			else
				ipaddr = convert_ipaddr(config_data.dmztwinip.ipaddr);
			if( ipaddr !== undefined )
			{
				for(var i = 0; i < 3; i++)
				{
					$('#lc_inner_ip [sid="VALUE'+i+'"] ').val(ipaddr[i]);
					lock_obj( '#lc_inner_ip [sid="VALUE'+i+'"] ', "readonly");
				}
			}
			if( config_data.dmztwinip.fakeip )
			{
				var fake_ip = convert_ipaddr(config_data.dmztwinip.fakeip);
				for(var i=0;i < 3; i++)
				{
					$('#lc_fake_ip [sid="VALUE'+i+'"] ').val(fake_ip[i]);
					lock_obj( '#lc_fake_ip [sid="VALUE'+i+'"] ', "readonly");
				}
			}
			if( !config_data.dmztwinip.fakeip )
				$('.fakeip_menu').css("display", "none");

			if(config_data.dmztwinip.w1mode == 0)
			{
				$('#not_use').prop('checked', true).checkboxradio('refresh');
				$('#dmz_selected').css('display', 'none');
				$('#twinip_selected').css('display', 'none');
			}
			else if(config_data.dmztwinip.w1mode == 1)
			{
				$('#run_dmz').prop('checked', true).checkboxradio('refresh');
				$('#dmz_selected').css('display', '');
				$('#twinip_selected').css('display', 'none');

				if( ipaddr !== undefined )
					$('#lc_inner_ip [sid="VALUE3"] ').val(ipaddr[3]);
			}
			else if(config_data.dmztwinip.w1mode == 2)
			{
				$('#run_twinip').prop('checked', true).checkboxradio('refresh');
				$('#dmz_selected').css('display', 'none');
				$('#twinip_selected').css('display', '');

				var hwaddr = convert_macaddr(config_data.dmztwinip.twiniphwaddr),
					inputList = $("#mac_field input");
				
				for( var i = 0; i < 6; ++i )
				{
					inputList.eq(i).val(hwaddr[i]);
				}
				if( config_data.dmztwinip.fakeip )
					$('#lc_fake_ip [sid="VALUE3"] ').val(fake_ip[3]);
			}
		}
	}
	else if(identifier == 'D')
	{

	}
	else
	{
	}
	if( config_data && config_data.dmztwinip.w1mode == 1)
	{
		printData = M_lang['S_DMZTWINIP_MENU'+ (parseInt(config_data.dmztwinip.w1mode) + 1)]
			+ "(" + config_data.dmztwinip.dmzipaddr + ")";
	} else if( config_data.dmztwinip.w1mode == 2 ) {
		printData = M_lang['S_DMZTWINIP_MENU'+ (parseInt(config_data.dmztwinip.w1mode) + 1)]
			+ "(" + config_data.dmztwinip.twiniphwaddr + ")";
	}
	$("[sid='DMZTWINIP_VALUE']").text(printData);
	printData = '';
};


add_listener_local_func['dmztwinip'] = function()
{
	submit_button_event_add("dmztwinip");
        $('[sid="C_DMZTWINIP_W1MODE"]').change(function(){
                if($(this).val() == '0')
		{
                        $('#dmz_selected').css('display', 'none');
                        $('#twinip_selected').css('display', 'none');

                }
                else if($(this).val() == '1')
		{
                        $('#dmz_selected').css('display', '');
                        $('#twinip_selected').css('display', 'none');

//			var ipaddr = convert_ipaddr(config_data.dmztwinip.ipaddr);
//			for(var i=0;i < 3;i++)
//			{
//				$('#lc_inner_ip [sid="VALUE'+i+'"] ').val(ipaddr[i]);
//				lock_obj( '#lc_inner_ip [sid="VALUE'+i+'"] ', "readonly");
//			}
//			if(config_data.dmztwinip.w1mode != 1)
//				$('#lc_inner_ip [sid="VALUE3"]').val("");

//			$('#current_ip_check').prop('checked', false).checkboxradio('refresh');
                }
                else if($(this).val() == '2'){
                        $('#dmz_selected').css('display', 'none');
                        $('#twinip_selected').css('display', '');

//			if( !config_data.dmztwinip.fakeip )
//			{
//				$('.fakeip_menu').css("display", "none");
//			}
//			else
//			{
//				var fake_ip = convert_ipaddr(config_data.dmztwinip.fakeip);
//				for(var i=0;i < 3;i++)
//				{
//					$('#lc_fake_ip [sid="VALUE'+i+'"] ').val(fake_ip[i]);
//					lock_obj( '#lc_fake_ip [sid="VALUE'+i+'"] ', "readonly" );
//				}
//			}
                }
		if(check_change_value())
			unlock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
		else
			lock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
        });
	$("#right_main").on( "keyup", "input[type=number], input[type=text]", function() {
		unlock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
	});
	$('#current_ip_check').change(function(){
		var convert_ip;
		convert_ip = convert_ipaddr(config_data.dmztwinip.ipaddr);
		if(!$(this).prop("checked"))
			convert_ip[3] = "";
		for(var i=0;i<convert_ip.length;i++)
			$('#lc_inner_ip [sid="VALUE'+i+'"] ').val(convert_ip[i]);
		unlock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
	});
	$('#current_mac_check').change(function() {
		var convert_mac, fake_ip;
		if($(this).prop("checked"))
			convert_mac = convert_macaddr(config_data.dmztwinip.hwaddr);
		else
			convert_mac = ["", "", "", "", "", ""];
		for(var i=0;i<convert_mac.length;i++)
			$('#mac_field [sid="VALUE'+i+'"] ').val(convert_mac[i]);
		if( config_data.dmztwinip.fakeip )
		{
			fake_ip = convert_ipaddr(config_data.dmztwinip.fakeip);
			if(!$(this).prop("checked"))
				fake_ip[3] = "";

			for(var i=0;i<fake_ip.length;i++)
				$('#lc_fake_ip [sid="VALUE'+i+'"] ').val(fake_ip[i]);
		}
		unlock_obj("[sid = S_BUTTON_SUBMIT]", "disabled");
	});

	$('#mac_search_button').click(function() {
		macsearch_runfunc()
	});

	$('[sid="DMZTWINIP_MACLIST"]').change(function()
	{
/*		var selectmac = $('[sid="DMZTWINIP_MACLIST"] option:selected').val();
		if(selectmac && selectmac != "")
		{
			var convert_mac = convert_macaddr(selectmac);
			for(var i=0;i<convert_mac.length;i++)
				$('#mac_field [sid="VALUE'+i+'"] ').val(convert_mac[i]);
			$('#maclist_field').hide();
			$('#mac_field').show();
		}*/
		$('#current_mac_check').prop('disabled', false);
	});


};
submit_local_func['dmztwinip'] = function()
{
	var localdata = [];

	localdata.push({name : 'wanid', value : "1"});
	localdata.push({name : 'w1mode', value : $('[sid="C_DMZTWINIP_W1MODE"]:checked').val()});

        if($('[sid="C_DMZTWINIP_W1MODE"]:checked').val() == 1)
	{
		if(!check_input_range("IP", "DMZTWINIP_IPADDR"))
			return;
		var ipaddr = convert_textfield_to_string('DMZTWINIP_IPADDR');
		localdata.push({name : 'ipaddr', value : ipaddr});
	}
	else if($('[sid="C_DMZTWINIP_W1MODE"]:checked').val() == 2)
	{
		if(!check_input_range("MAC", "DMZTWINIP_HWADDR") || !check_input_range("LEASETIME", "#w1leasetime"))
			return;

		var macaddr = convert_textfield_to_string('DMZTWINIP_HWADDR');
		localdata.push({name : 'hwaddr', value : macaddr});
		localdata.push({name : 'w1leasetime', value : $('#w1leasetime').val()});
		
		if( config_data.dmztwinip.fakeip )
		{
			if(!check_input_range("IP", "DMZTWINIP_FAKEIP"))
				return;
			var fakeip = convert_textfield_to_string('DMZTWINIP_FAKEIP');
			localdata.push({name : 'fakeip', value : fakeip});
		}
	}
	if( config_data.dmztwinip.fakeip && ( $('[sid="C_DMZTWINIP_W1MODE"]:checked').val() == 2 ) )
	{
		events.confirm({ msg: M_lang['S_REBOOT_ALERT_MSG'], runFunc: function( flag ) {
			if( flag )
				reboot_submit('dmztwinip', localdata);
		}});
	}
	else
	{
		$('#loading').popup('open');
		iux_submit('dmztwinip', localdata);
	}
};

result_submit_func['dmztwinip'] = function()
{
	$("#right_panel").panel("close");
}

//dmztwinip end


//
//ftp start
//
iux_update_local_func['ftp'] = function(identifier, viewing)
{
	if(identifier == 'C')
	{
		if(viewing)
		{
			background_color("#ftp_port_list li");
			$("label.delete_button_label").filter(function(index){return !!config_data.ftp["port" + index];}).show();
			$("label.delete_button_label").filter(function(index){return !config_data.ftp["port" + index];}).hide();
		}
	}
	else if(identifier == 'D')
	{

	}
	else
	{

	}

	var i = 0, port = [ config_data.ftp.port0, config_data.ftp.port1, config_data.ftp.port2, config_data.ftp.port3, config_data.ftp.port4]; 
	while(i < 5)
	{
		if(config_data.ftp["port" + i] <= 0)
			break;
		printData += config_data.ftp["port" + i++] + ", ";
	}
	printData = printData.slice(0, -2);
	$("[sid='FTP_VALUE']").text(printData);
	printData = '';
};

submit_local_func['ftp'] = function(button)
{
	var localdata = [];

	if(button.hasClass('custom_css_button'))
	{
		if(!check_input_range("PORT", "FTP_NEWPORT"))
			return;
		localdata.push({ name : "menu", value : "1"});
		localdata.push({ name : "newport", value : $('input[sid="FTP_NEWPORT"]').val() });
		$('input[sid="FTP_NEWPORT"]').val("").focus();
	}
	else if(button.hasClass('lc_ftp_deleteButton'))
	{
		var i = button.attr('id');
		i = parseInt(i.charAt(i.length - 1)) - 1;
		localdata.push({ name : "menu", value : "0"});
		localdata.push({ name : "deleteIndex", value : i});
	}
	
	$('#loading').popup('open');
	return iux_submit('ftp', localdata);
};

add_listener_local_func['ftp'] = function()
{

	$('.ftp_submit_button').click(function() {submit_local('ftp', $(this));});

};
//ftp end

//natonoff start
iux_update_local_func['natonoff'] = function(identifier, viewing)
{
};

add_listener_local_func['natonoff'] = function()
{
//	immediately_submit_event_add('natonoff', 'C_NATONOFF_RUN');
	sliderButtonEvent( { sid : 'C_NATONOFF_RUN', arguments : ['natonoff'], runFunc : submitEvent } );
};

submit_local_func['natonoff'] = function()
{
	events.confirm({msg: M_lang['S_REBOOT_ALERT_MSG'], runFunc: function( flag ) {
		if(flag){
			var localdata = [];
			localdata.push({'name':'run','value':$('[sid=\"C_NATONOFF_RUN\"]').val()});
			reboot_submit("natonoff", localdata);
		}
	}});
	return false;
}
//natonoff end



//pppoe start
iux_update_local_func['pppoe'] = function(identifier, viewing)
{
};

add_listener_local_func['pppoe'] = function()
{
//	immediately_submit_event_add('pppoe', 'C_PPPOE_RUN');
	sliderButtonEvent( { sid : 'C_PPPOE_RUN', arguments : ['pppoe'], runFunc : submitEvent } );
	
};

submit_local_func['pppoe'] = function()
{
	$('#loading').popup('open');
	localpostdata = [];
        localpostdata.push({'name':'run','value':$('[sid=\"C_PPPOE_RUN\"]').val()});
	return iux_submit('pppoe', localpostdata, false);
}

//
//pppoe end

//upnp_relay start
iux_update_local_func['upnprelay'] = function(identifier, viewing)
{
};

add_listener_local_func['upnprelay'] = function()
{
	sliderButtonEvent( { sid : 'C_UPNPRELAY_RUN', arguments : ['upnprelay'], runFunc : submitEvent } );
	
};

submit_local_func['upnprelay'] = function()
{
	$('#loading').popup('open');
	localpostdata = [];
        localpostdata.push({'name':'run','value':$('[sid="C_UPNPRELAY_RUN"]').val()});
	return iux_submit('upnprelay', localpostdata, false);
}

//
//upnp_relay end

$(document).ready(function() {
	window.tmenu = "natrouterconf";
	window.smenu = "misc";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);

});

function loadLocalPage()
{
	iux_update('C');	iux_update_local();
	iux_set_onclick_local();

        $("[sid=\"MAINLISTVIEW\"] .ui-last-child").removeClass('ui-last-child');
	background_color("div div li");
}

function result_config()
{
	iux_update('C');	
	iux_update_local();
}

function iux_set_onclick_local()
{
	$("#dmztwinip, #ftp").on('click', function(){
		load_rightpanel(this.id);
	});
	$("#dmztwinip, #ftp, #natonoff, #pppoe, #upnprelay").on("mousedown touchstart", function() {
		$(this).find("a").addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	listener_add_local('natonoff');
	listener_add_local('pppoe');
	listener_add_local('upnprelay');
}

function iux_update_local(identifier)
{
	var aname = $("#right_content :first-child").attr('id');
	for(var articleName in config_data){
		if(config_data.hasOwnProperty(articleName) && articleName != ""){
			var caller_func = iux_update_local_func[articleName];
			if(caller_func)	caller_func.call(this, identifier, (aname == articleName)?true:false);
		}
	}
	events.emit("iux_update_local");
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, localdata)
{
	submit_local_func[service_name].call(this, localdata);
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
				iux_update_local();
				listener_add_local(_aname);
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		});
}

function result_submit(act, result)
{
        if(result_submit_func[act])
                result_submit_func[act].call(this, result);
        iux_update('C');
        iux_update_local();
}

