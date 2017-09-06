"use strict";
//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var result_submit_func = [];
var confirm_before_submit = [];
var has_error_input_text = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var printData = "";
var listIndex = "";
var confirm_menu = "";
var highlight, isDefaultValue, popup;
//local-global variables end

//local utility functions

$(document).on("panelclose", "#right_panel", function() {
	iux_update("C");
	$('#list_div >div').css("z-index", "0");
});

function hasInputError(value, type)
{
        if(check_input_error(value, regExp_onlynum))
        {
                        return true;
        }

        value = Number(value);
        if(type == "INTERNET_SPEED")
        {
                if( value <= 0 )
                {
                        return true;
                }
        }

        return false;
}

function change_new_rule_button_color()
{
	if($('#list_div >div').length % 2 == 1)
		$("#maincontent .lc_addrule_div").css("background-color", "#FFFFFF");
	else
		$("#maincontent .lc_addrule_div").css("background-color", "#F9FAF5");

}

function qosrule_button_onoff()
{
//	if($('#right_header [sid = "S_QOSRULE_TITLE"]').text() == M_lang["S_QOSRULE_TITLE"])
	if( listIndex > 0 )
	{
		$("#panel_qosrule button[sid = 'S_MODIFY_BUTTON'], #panel_qosrule button[sid = 'S_DELETE_BUTTON']").css("display", "");
		$("#panel_qosrule button[sid = 'S_BUTTON_SUBMIT_BUTTON']").css("display", "none");
		lock_object("#panel_qosrule button[sid = 'S_MODIFY_BUTTON']", "disabled");
		unlock_object("#panel_qosrule button[sid = 'S_QOSRULE_NEWRULE_BUTTON']", "disabled");
	}
	else
	{
		$("#panel_qosrule button[sid = 'S_MODIFY_BUTTON'], #panel_qosrule button[sid = 'S_DELETE_BUTTON']").css("display", "none");
		$("#panel_qosrule button[sid = 'S_BUTTON_SUBMIT_BUTTON']").css("display", "");
		lock_object("#panel_qosrule button[sid = 'S_QOSRULE_NEWRULE_BUTTON']", "disabled");
	}
	lock_object("#panel_qosrule button[sid = 'S_CANCEL_BUTTON']", "disabled");
}

has_error_input_text['updown'] = function()
{
	if($('[sid="QOSRULE_UPINPUT"]').val() == "" && $('[sid="QOSRULE_DOWNINPUT"]').val() == "")
	{
		alert(M_lang['S_QOSRULE_ALERT1']);
		return true;
	}
	if(($('[sid="QOSRULE_UPINPUT"]').val() != "" && parseInt($('[sid="QOSRULE_UPINPUT"]').val()) > parseInt(config_data.internettype.w1up))
		|| ($('[sid="QOSRULE_DOWNINPUT"]').val() != "" && parseInt($('[sid="QOSRULE_DOWNINPUT"]').val()) > parseInt(config_data.internettype.w1down)))
	{
		alert(M_lang['S_QOSRULE_ALERT7']);
		return true;
	}
	return false;
}

has_error_input_text['iprange'] = function()
{
	if(
		($('input[sid = "VALUE3"]').val() == "" 
			&& ($('select[sid="S_QOSRULE_IPSELECTWAY"]').val() != M_lang["S_QOSRULE_IPSELECTWAY"][2].value 
				&& $('select[sid="S_QOSRULE_IPSELECTWAY"]').val() != M_lang["S_QOSRULE_IPSELECTWAY"][3].value ))
		|| ($('select[sid="S_QOSRULE_IPSELECTWAY"]').val() == M_lang["S_QOSRULE_IPSELECTWAY"][1].value && $('input[sid = "VALUE4"]').val() == ""))
	{
		alert(M_lang['S_QOSRULE_ALERT2']);
		return true;
	}
	if(($('select[sid="S_QOSRULE_IPSELECTWAY"]').val() != M_lang["S_QOSRULE_IPSELECTWAY"][2].value 
		&& (parseInt($('input[sid = "VALUE3"]').val()) < 1 || $('input[sid = "VALUE3"]').val() > 254))
	|| ($('select[sid="S_QOSRULE_IPSELECTWAY"]').val() == M_lang["S_QOSRULE_IPSELECTWAY"][1].value 
		&& (parseInt($('input[sid = "VALUE4"]').val()) < 1 || $('input[sid = "VALUE4"]').val() > 254)))
	{
		alert(M_lang['S_INVALID_IP_STRING']);
		return true;
	}
		 
	if($('select[sid="S_QOSRULE_IPSELECTWAY"]').val() == M_lang["S_QOSRULE_IPSELECTWAY"][1].value 
		&& parseInt($('input[sid = "VALUE3"]').val()) >= parseInt($('input[sid = "VALUE4"]').val()))
	{
		alert(M_lang['S_QOSRULE_ALERT3']);
		return true;
	}
	return false;
}

has_error_input_text['priority'] = function()
{
	if($('input[sid="QOSRULE_PRIORITYORDER"]').val() != "" && check_input_error($('input[sid="QOSRULE_PRIORITYORDER"]').val(), regExp_onlynum))
		return true;
	return false;	
}

has_error_input_text['portrange'] = function()
{
	if($('select[sid="S_QOSRULE_PROTOCOL"]').val() == M_lang["S_QOSRULE_PROTOCOL"][0].value)
		return false;
	if($('input[sid="QOSRULE_PORTFROM"]').val() == "")
	{
		alert(M_lang["S_QOSRULE_ALERT9"]);
		return true;
	}
	if(check_input_error($('input[sid="QOSRULE_PORTFROM"]').val(), regExp_onlynum)
		|| parseInt($('input[sid="QOSRULE_PORTFROM"]').val()) <= 0
		|| parseInt($('input[sid="QOSRULE_PORTFROM"]').val()) > 65535
		|| ($('input[sid="QOSRULE_PORTTO"]').val() != "" 
			&& (check_input_error($('input[sid="QOSRULE_PORTTO"]').val(), regExp_onlynum))
				|| parseInt($('input[sid="QOSRULE_PORTTO"]').val()) <= 0
				|| parseInt($('input[sid="QOSRULE_PORTTO"]').val()) > 65535
				|| parseInt($('input[sid="QOSRULE_PORTFROM"]').val()) >= parseInt($('input[sid="QOSRULE_PORTTO"]').val())))
	{
		alert(M_lang["S_QOSRULE_ALERT8"]);
		return true;
	}
	return false;
}

function has_error_input()
{
	for(var index in has_error_input_text)
	{
		if(has_error_input_text[index].call())
			return true;
	}
	return false;
}

function can_submit_newrule( identifier )
{
	if( identifier == "delete" )
		return true;
	if(has_error_input())
		return false;
	return true;
}

function check_input_error(string, regExp)
{
        if(!string || !string.match(regExp))
                return true;
        return false;
}

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

function findPos(obj)
{
	var curTop = 0;
	if(!obj)	return 0;
	curTop = Math.max(0, (obj.offsetTop - (document.body.clientHeight/2)));
	return curTop;
}

function move_line(priority)
{
	priority = Number(priority);
	var object = $('#qosrule_' + listIndex);
	if(priority <= 0)
		priority = 1;
	else if(priority > Object.keys(config_data.userrule).length)
		priority = Object.keys(config_data.userrule).length - 1;

	if(priority == 1)
		object.insertBefore($('#list_div >div:nth-child(1)'));
	else
		object.insertAfter($('#list_div >div:nth-child(' + priority + ')'));

	window.scroll(0, findPos(object[0]));
}

function check_priority_range(ruletype, prio)
{
	if(ruletype == 'setup')	return true;
	if(ruletype == 'firewallrule'){if(prio < 1 || prio > (tmp_config_data.firewall_rules.length -1))	return false;}
	return true;
}

function get_sharingborrow_size()
{
	var size = 0, length = Object.keys(config_data.userrule).length - 1;
	for(var i = 0; i < length; i++)
	{
		if(eval("config_data.userrule.list" + i + ".property") == 3)
			size++;
	}
	return size;
}

function add_popup_modify_button_event()
{
	$('#taphold_popup .popup_list_div:nth-child(2)').on('click', function() {
		$("#taphold_popup").popup("close");
		load_rightpanel('qosrule_' + listIndex);
		$("#right_panel").panel("open");
	});
}

function add_popup_delete_button_event()
{
	$('#taphold_popup .popup_list_div:nth-child(3)').on('click', function() {
		$("#taphold_popup").popup("close");
		confirm_menu = "popup_delete";
		confirm(M_lang["S_QOSCONFIRM_MSG2"], M_lang["S_QOSCONFIRM_MSG1"]);
	});
}

function add_popup_cancel_button_event()
{
	$('#taphold_popup .popup_list_div:nth-child(4)').on('click', function() {
		$("#taphold_popup").popup("close");
	});
}

function add_newrule_button_event()
{
	$('[sid = "S_QOSRULE_NEWRULE_BUTTON"]').on("click", function(){
		$('input[type="text"], input[type="number"]').val('');	
		$('#right_header [sid = "S_QOSRULE_TITLE"]').text(M_lang["S_QOSRULE_TITLE"]);
		$('select[sid^="S_"]').each(function(){
			$(this)[0].selectedIndex = 0;
		});
		refresh_qosrule_panel();
		listIndex = "";
		unlock_object('.lc_ipaddr2_div .lc_right [sid="VALUE3"]', "readonly");
		highlight();
	});
}

function add_submit_button_event()
{
	$('[sid="S_BUTTON_SUBMIT_BUTTON"]').click(function() {submit_local("qosrule", "add");});
}

function add_modify_button_event()
{
	$('[sid="S_MODIFY_BUTTON"]').click(function() {submit_local("qosrule", "modify");});
}

function add_cancel_button_event()
{
	$('[sid="S_CANCEL_BUTTON"]').on("click", function(){
//		iux_update("C");
		load_qoslist_data();
	});
}

function add_delete_button_event()
{
	$('[sid="S_DELETE_BUTTON"]').click(function() {submit_local("qosrule", "delete");});
}

function refresh_qosrule_panel()
{
	$('.lc_ipaddr2_div .lc_right [sid="VALUE0"]').val(config_data.qosrule.ipaddress.split(".")[0]);
	$('.lc_ipaddr2_div .lc_right [sid="VALUE1"]').val(config_data.qosrule.ipaddress.split(".")[1]);
	$('.lc_ipaddr2_div .lc_right [sid="VALUE2"]').val(config_data.qosrule.ipaddress.split(".")[2]);

	if($('[sid="S_QOSRULE_IPSELECTWAY"]')[0].selectedIndex == "1")
	{
		$('.lc_ipaddress_div .lastiprange, .lc_bpi_div label').css('display', '');
	}
	else
	{
		$('.lc_ipaddress_div .lastiprange, .lc_bpi_div label').css('display', 'none');
	}	

	if($('[sid = "S_QOSRULE_PROPERTY"]')[0].selectedIndex == -1)
		$('[sid = "S_QOSRULE_PROPERTY"]').val("2");
	if($('[sid = "S_QOSRULE_IPSELECTWAY"]')[0].selectedIndex == -1)
		$('[sid = "S_QOSRULE_IPSELECTWAY"]').val("manual");
	if($('[sid = "S_QOSRULE_TYPINGWAYLIST"]')[0].selectedIndex == -1)
		$('[sid = "S_QOSRULE_TYPINGWAYLIST"]').val("manual");
	if($('[sid = "S_QOSRULE_PROTOCOL"]')[0].selectedIndex == -1)
		$('[sid = "S_QOSRULE_PROTOCOL"]').val("ALL");

	$("select[sid^='S_']").selectmenu("refresh");
	
	qosrule_button_onoff();
}

function load_qoslist_data()
{
	if($("#right_content >div").attr('id') != "panel_qosrule")
		return;
	lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE0"]', "readonly");
	lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE1"]', "readonly");
	lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE2"]', "readonly");

	if(!listIndex)
	{
		unlock_object('.lc_ipaddr2_div .lc_right [sid="VALUE3"]', "readonly");
		$('input[type="text"]:not([readonly]), input[type="number"]:not([readonly])').val("");
		$('#right_panel select:visible').each(function() {
			$(this)[0].selectedIndex = 0;
		});
		refresh_qosrule_panel();
		return;
	}

	var rule_data = eval("config_data.userrule.list" + (listIndex - 1));

	var ip_name = M_lang["S_QOSRULE_VIEWRULE"] + "(" + rule_data.ipfrom;
	if(rule_data.ipto != "")
		ip_name += " ~ " + rule_data.ipto;
	ip_name += ")";
	$('#right_header [sid = "S_QOSRULE_TITLE"]').text(ip_name);
	
	$('[sid = "QOSRULE_PRIORITYORDER"]').val($('#qosrule_' + listIndex + ' .rulelist_index').text());
	$('[sid = "S_QOSRULE_PROPERTY"]').val(rule_data.property);
	$('[sid = "QOSRULE_DOWNINPUT"]').val(rule_data.down);
	$('[sid = "QOSRULE_UPINPUT"]').val(rule_data.up);

	if(rule_data.ipfrom == "Twin IP" )
	{
		$('select[sid = "S_QOSRULE_IPSELECTWAY"]').val("twinip");
		$('[sid = "VALUE0"]').val(config_data.qosrule.ipaddress.split(".")[0]);
		$('[sid = "VALUE1"]').val(config_data.qosrule.ipaddress.split(".")[1]);
		$('[sid = "VALUE2"]').val(config_data.qosrule.ipaddress.split(".")[2]);
		lock_object('input[sid = "VALUE3"]', "readonly");
	}
	else if(rule_data.ipfrom == "")
	{
		$('select[sid = "S_QOSRULE_IPSELECTWAY"]').val("allip");
		$('[sid = "VALUE0"]').val(config_data.qosrule.ipaddress.split(".")[0]);
		$('[sid = "VALUE1"]').val(config_data.qosrule.ipaddress.split(".")[1]);
		$('[sid = "VALUE2"]').val(config_data.qosrule.ipaddress.split(".")[2]);
		lock_object('input[sid = "VALUE3"]', "readonly");
	}
	else
	{
		var iparray = rule_data.ipfrom.split(".");
		$('[sid = "VALUE0"]').val(iparray[0]);
		$('[sid = "VALUE1"]').val(iparray[1]);
		$('[sid = "VALUE2"]').val(iparray[2]);
		$('[sid = "VALUE3"]').val(iparray[3]);

		if(rule_data.ipto != "")
		{
			$('select[sid = "S_QOSRULE_IPSELECTWAY"]').val("range");
			$('[sid = "VALUE4"]').val(rule_data.ipto.split(".")[3]);
		}
		else
		{
			$('select[sid = "S_QOSRULE_IPSELECTWAY"]').val("manual");
		}
	}

	if(rule_data.bpicheck == "1")
		$('[sid = "S_QOSRULE_BPI"]').prop('checked', true).checkboxradio("refresh");
	else
		$('[sid = "S_QOSRULE_BPI"]').prop('checked', false).checkboxradio("refresh");

	$('[sid = "S_QOSRULE_PROTOCOL"]').val(rule_data.protocol);
	if(rule_data.portfrom == "0")
		$('[sid = "QOSRULE_PORTFROM"]').val("");
	else 
		$('[sid = "QOSRULE_PORTFROM"]').val(rule_data.portfrom);
	if(rule_data.portto == "0")
		$('[sid = "QOSRULE_PORTTO"]').val("");
	else 
		$('[sid = "QOSRULE_PORTTO"]').val(rule_data.portto);

	refresh_qosrule_panel();
}

function change_internet_speed()
{
	$('#panel_internettype select').change(function() {
		var selectIndex = $('#panel_internettype select')[0].selectedIndex;
		if(selectIndex > 0)
			$('#panel_internettype input[type="text"], #panel_internettype input[type="number"]')
				.val(M_lang['S_INTERNETTYPE_TYPE'][$('#panel_internettype select')[0].selectedIndex].speed);
		else
			$('#panel_internettype input[type="text"], #panel_internettype input[type="number"]').val("");
	});
}

function confirm_result_local(flag)
{
	if(!flag)
	{
		confirm_menu = "";
                iux_update('C');
                iux_update_local();
		return;
	}


	if(confirm_menu == "confirm_qos_reset")
	{
		confirm_menu = "";
		submit_local('qosonoff');
	}
	else if(confirm_menu == "internettype")
	{
		confirm_menu = "";
		submit_local("internettype");
	}
	else if(confirm_menu == "smartqos")
	{
		confirm_menu = "";
		submit_local("smartqos");
	}
	else if(confirm_menu == "popup_delete")
	{
		confirm_menu = "";
		submit_local("qosrule", "delete");
	}
	else if(confirm_menu == "before_submit_priority_add")
	{
		confirm_menu = "";
		$('input[sid = "QOSRULE_PRIORITYORDER"]').val(
			convert_priority($('select[sid = "S_QOSRULE_PROPERTY"]').val(), "add", $('input[sid = "QOSRULE_PRIORITYORDER"]').val()));
		submit_local("qosrule", "add");
	}
	else if(confirm_menu == "before_submit_priority_modify")
	{
		confirm_menu = "";
		$('input[sid = "QOSRULE_PRIORITYORDER"]').val(
			convert_priority($('select[sid = "S_QOSRULE_PROPERTY"]').val(), "modify", $('input[sid = "QOSRULE_PRIORITYORDER"]').val()));
		submit_local("qosrule", "modify");
	}
}

function update_local_select_string(selector)
{
	var sid = $(selector).attr("sid");
	var l_sid = sid.toLowerCase().split("_");

	var predefined_str = ("S_"+l_sid[1]+"_"+l_sid[2]).toUpperCase();
	var listObjs = S_lang[predefined_str];

	if(!listObjs)
		return;

	$(selector).find('option').remove();

	var selected = "";
	for(var idx = 0; idx < listObjs.length; idx++)
	{
		selected = "";
		var nm = listObjs[idx];
		if($(selector).attr("name"))
		{ 
			var val = eval("config_data." + l_sid[1] + "." + $(selector).attr("name"));
			if(val == nm.value)
				selected = "selected";
		}

		$(selector).append("<option value='" + nm.value + "'" + selected + ">" + nm.text + "</option>").enhanceWithin();
	}

	if($(selector)[0].selectedIndex == -1)
		$(selector)[0].selectedIndex = 0;
	$(selector).selectmenu('refresh');
}

function immediately_submit_event_add(service_name, sid)
{
	$('[sid = "' + sid + '"]').change(function(){
		if(check_change_value())
		{
			submit_local(service_name);
		}
	});
}

function append_rules_div()
{
	var HTMLStr = '' +
	'	<div>' +
	'		<div class="lc_priority_div">' +
	'			<div class="lc_line_div">' +
	'				<p class = "rulelist_index"></p>' + 
	'			</div>' +
	'			<div class="lc_line_div">' +
	'			</div>' +
	'		</div>' +
	'		<div class="lc_rules_div">' +
		'		<div class="lc_rules2_div">' +
		'			<div class="lc_leftbox_div lc_line_div">' +
		'				<p class="lc_boldfont_text rulelist_name"></p>' +
		'			</div>' +
		'			<div class="lc_rightbox_div lc_line_div">' +
		'				<p class="lc_grayfont_text rulelist_protocol"></p>' +
		'			</div>' +
		'		</div>' +
		'		<div class="lc_rules2_div">' +
		'			<div class="lc_leftbox_div lc_line_div">' +
		'				<p class="lc_grayfont_text rulelist_speed"></p>' +
		'			</div>' +
		'			<div class="lc_rightbox_div lc_line_div">' +
		'				<p class="lc_grayfont_text rulelist_property"></p>' +
		'			</div>' +
		'		</div>' +
	'		</div>' +
	'	</div>' +
	'';
	$('#list_div').append(HTMLStr).enhanceWithin();
	$('#list_div >div').unbind("taphold").on( "taphold", function(event) {
                $( event.currentTarget).addClass( "taphold" );
		listIndex = $(event.currentTarget).attr('id').split("_")[1];
		var rule_object = eval("config_data.userrule.list" + (listIndex - 1)),
		ip_name = rule_object.ipfrom;
		if(rule_object.ipto != "")
			ip_name += " ~ " + rule_object.ipto;
//		$("#taphold_popup .popup_titlebar #taphold_popup_title").text(ip_name);
//		$("#taphold_popup").popup("open");
		popup( ip_name, 'qosrule_' + listIndex );
	});
	$('#list_div >div').unbind("click").on("click", function(){
		if( config_data.smartqos && config_data.smartqos.run == "1")
			return;
		load_rightpanel($(this).attr('id'));

		$("#right_panel").panel("open");
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	change_new_rule_button_color();
}

function update_sqrules_div()
{
	var ip_name, index, length = 0;

	var rulelist_name = $("#list_div >div .rulelist_name"),
	rulelist_index = $("#list_div >div .rulelist_index");
		
        for(var list_name in status_data.sqlist)
	{
                if(list_name == "")
			continue;
		ip_name = eval("status_data.sqlist." + list_name);
		rulelist_name.eq(length).text(ip_name);
		rulelist_index.eq(length).text(++length);
	}

	var speed_text = (config_data.internettype.w1down / length).toFixed(0) + "Mbps / " + (config_data.internettype.w1up / length).toFixed(0) + "Mbps",
	protocol_text = M_lang["S_QOSRULE_PROTOCOL"][0].value,
	property_text = M_lang["S_QOSRULE_PROPERTY"][0].text;
	$("#list_div >div .rulelist_speed").text(speed_text);
	$("#list_div >div .rulelist_protocol").text(protocol_text);
	$("#list_div >div .rulelist_property").text(property_text);
}

function update_qosrules_div()
{
	var rulelist_speed = $("#list_div >div .rulelist_speed"),
	rulelist_protocol = $("#list_div >div .rulelist_protocol"),
	rulelist_property = $("#list_div >div .rulelist_property"),
	rulelist_name = $("#list_div >div .rulelist_name"),
	rulelist_index = $("#list_div >div .rulelist_index"),
	rule_list = $("#list_div >div");

	var speed_text, protocol_text, property_text, ip_name, rule_object, index = 0;

	for(var list_name in config_data.userrule)
	{
		if(list_name == "")
			continue;
		rule_object = eval("config_data.userrule." + list_name);
		ip_name = rule_object.ipfrom;
		if(ip_name == "")
			ip_name = M_lang["S_QOSRULE_ALLIP"];
		if(rule_object.ipto != "")
			ip_name += " ~ " + rule_object.ipto;
			 
		speed_text = rule_object.down + "Mbps / " + rule_object.up + "Mbps";
		protocol_text = rule_object.protocol;
		if(protocol_text == "")
			protocol_text = "ALL";
		else
		{
			protocol_text += " " + rule_object.portfrom;
			if(rule_object.portto != "0")
				protocol_text += " - " + rule_object.portto;
		}
		property_text = M_lang["S_QOSRULE_PROPERTY"][parseInt(rule_object.property) - 2].text;
		if(rule_object.bpicheck == "0" && rule_object.ipto != "")
			property_text += M_lang["S_QOSRULE_BPIOFF"];
		
		rule_list.eq(index).attr("id", "qosrule_" + rule_object.priorityorder);
		rulelist_speed.eq(index).text(speed_text);
		rulelist_protocol.eq(index).text(protocol_text);
		rulelist_property.eq(index).text(property_text);
		rulelist_name.eq(index).text(ip_name);
		rulelist_index.eq(index).text(++index);
	}

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

function print_smartqos_list()
{
	var present_size = $("#list_div >div").length,
		need_size = Object.keys(status_data.sqlist).length - 1;
	if(present_size > need_size)
	{
		if(need_size == 0)
			$("#list_div >div").remove();
		else
			$("#list_div >div:gt(" + need_size + ")").remove();
	}
	else
	{
		while(present_size < need_size)
		{
			append_rules_div();
			present_size++;
		}
	}
	update_sqrules_div();
	change_new_rule_button_color();
}

function print_userqos_list()
{
	var present_size = $("#list_div >div").length,
		need_size = Object.keys(config_data.userrule).length -1;
	if(present_size > need_size)
	{
		if(need_size == 0)
			$("#list_div >div").remove();
		else
			$("#list_div >div:gt(" + --need_size + ")").remove();
	}
	else
	{
		while(present_size < need_size)
		{
			append_rules_div();
			present_size++;
		}
	}
	update_qosrules_div();
	change_new_rule_button_color();
}

//local utility functions end
iux_update_local_func['main'] = function(identifier)
{

	var temp_service_name, text_array = M_lang['S_INTERNETTYPE_TYPE'];
	for(var i in text_array)
	{
		if(text_array[i].value == config_data.internettype.w1service)
		{
			temp_service_name = text_array[i].text;
			break;
		}
	}
	if(!temp_service_name)
		temp_service_name = M_lang['S_INTERNETTYPE_TYPE'][0].text;
	printData = temp_service_name + M_lang['S_QOSRULE_TEXT1'];
	printData += M_lang['S_QOSRULE_TEXT2']+ config_data.internettype.w1down + M_lang["S_INTERNETTYPE_UNIT1"] + " ";
	printData += M_lang['S_QOSRULE_TEXT3']+ config_data.internettype.w1up + M_lang["S_INTERNETTYPE_UNIT1"];

	$('[sid="INTERNETTYPE_VALUE"]').text(printData);
	printData = "";

	if( !config_data.smartqos || config_data.smartqos.run != "1")
	{
		print_userqos_list();
		$("#qosrule").css("display", "");
	}
	else
	{
		$("#qosrule").css("display", "none");
	}
}

iux_update_local_func['smartqoslist'] = function(identifier)
{
	if(config_data && config_data.smartqos.run == "1")
		print_smartqos_list();
}

iux_update_local_func['qosonoff'] = function(identifier)
{
}

add_listener_local_func['qosonoff'] = function()
{
	sliderButtonEvent({ object: $('[sid="C_QOSONOFF_TCMODE"]'), runFunc: function() 
        {
		if(check_change_value())	submit_local('qosonoff');
        }});
}

submit_local_func['qosonoff'] = function()
{
	$("#loading").popup("open");
	var localpostdata = [];
        localpostdata.push({'name':'tcmode','value':$('[sid=\"C_QOSONOFF_TCMODE\"]').val()});
	return iux_submit('qosonoff', localpostdata, false);
}

iux_update_local_func['internettype'] = function(identifier) 
{
	if(identifier != 'C')
		return;
	update_local_select_string('[sid = "S_INTERNETTYPE_TYPE"]');
}

add_listener_local_func['internettype'] = function()
{
        $('[sid = "S_BUTTON_SUBMIT"]').click(function() {
		var down = $('[sid = "C_INTERNETTYPE_W1DOWN"]').val(),
			up = $('[sid = "C_INTERNETTYPE_W1UP"]').val();

		if( hasInputError( down, "INTERNET_SPEED" ) || hasInputError( up, "INTERNET_SPEED" ) )
		{
			alert(M_lang['S_QOSRULE_ALERT10']);
			return false;
		}

		confirm_menu = "internettype";
		confirm(M_lang['S_QOSRULE_ALERT4']);
	});
	change_internet_speed();
}

submit_local_func['internettype'] = function()
{
        $('#loading').popup('open');


        var internettype = $('[sid = "S_INTERNETTYPE_TYPE"]').val(),
        down = $('[sid = "C_INTERNETTYPE_W1DOWN"]').val(),
	up = $('[sid = "C_INTERNETTYPE_W1UP"]').val(), bpsUnit = "M";
	
	if( down.indexOf(".") >= 0 || up.indexOf(".") >= 0 )
	{
		down = ( down * 1024 ).toFixed(0);
		up = ( up * 1024 ).toFixed(0);
		bpsUnit = "K";
	}

	var localdata = [];
        localdata.push({name : "w1service", value : internettype });
        localdata.push({name : "w1down", value : down });
        localdata.push({name : "w1up", value : up });
        localdata.push({name : "bps", value : bpsUnit });
	
        return iux_submit('internettype', localdata);
}

iux_update_local_func['smartqos'] = function(identifier)
{
}

add_listener_local_func['smartqos'] = function()
{
	
	sliderButtonEvent({ object: $('[sid = "C_SMARTQOS_RUN"]'), runFunc: function(){
		if(config_data.smartqos.run == "0")
		{
			if( isDefaultValue )
			{
				alert( M_lang["S_QOSRULE_ALERT11"] );
				$(this).val( config_data.smartqos.run );
				return;
			}
			confirm_menu = "smartqos";
			confirm(M_lang['S_QOSRULE_ALERT4']);
		}
		else
		{
			submit_local("smartqos");
		}
	}});
}

submit_local_func['smartqos'] = function()
{
        $('#loading').popup('open');
	var localpostdata = [];
        localpostdata.push({'name':'run','value':$('[sid=\"C_SMARTQOS_RUN\"]').val()});
        return iux_submit('smartqos', localpostdata, false);
}

iux_update_local_func['qosrule'] = function(identifier)
{
	update_local_select_string('[sid = "S_QOSRULE_PROPERTY"]');
	update_local_select_string('[sid = "S_QOSRULE_IPSELECTWAY"]');
	update_local_select_string('[sid = "S_QOSRULE_TYPINGWAYLIST"]');
	update_local_select_string('[sid = "S_QOSRULE_PROTOCOL"]');
}

add_listener_local_func['qosrule'] = function()
{
	$('#panel_qosrule input[sid = "QOSRULE_PRIORITYORDER"]').change(function() {
		if( !listIndex )
			return;
		var priority = convert_priority($('select[sid="S_QOSRULE_PROPERTY"]').val(), "change", $('#panel_qosrule input[sid = "QOSRULE_PRIORITYORDER"]').val());
		if($('#qosrule_' + listIndex).index() + 1 > parseInt(priority))
		{
			$('#panel_qosrule input[sid = "QOSRULE_PRIORITYORDER"]').val(priority);
			move_line(priority - 1);
		}
		else
		{
			$('#panel_qosrule input[sid = "QOSRULE_PRIORITYORDER"]').val(priority);
			move_line(priority);
		}
	});
	$('#panel_qosrule button[sid = "PRIORITY_DOWN"]').click(function(){
		var index = Number($('[sid="QOSRULE_PRIORITYORDER"]').val());
		if(index >= Object.keys(config_data.userrule).length - 1 || 
			($('select[sid="S_QOSRULE_PROPERTY"]').val() == M_lang["S_QOSRULE_PROPERTY"][1].value && index == get_sharingborrow_size()))
			return;
		if(listIndex)
		{
			move_line(index + 1);
			unlock_object( '[sid="S_MODIFY_BUTTON"]', 'disabled' );
		}
		$('[sid="QOSRULE_PRIORITYORDER"]').val(index + 1).trigger('change');
	});
	$('#panel_qosrule button[sid = "PRIORITY_UP"]').click(function(){
		var index = $('[sid="QOSRULE_PRIORITYORDER"]').val();
		if(index <= 1 ||
			($('select[sid="S_QOSRULE_PROPERTY"]').val() == M_lang["S_QOSRULE_PROPERTY"][0].value && index == get_sharingborrow_size() + 1))
			return;
		if(listIndex)
		{
			move_line(index - 2);
			unlock_object( '[sid="S_MODIFY_BUTTON"]', 'disabled' );
		}
		$('[sid="QOSRULE_PRIORITYORDER"]').val(index - 1).trigger('change');
	});
	$('#panel_qosrule select[sid = "S_QOSRULE_TYPINGWAYLIST"]').change(function()
	{
		if($(this)[0].selectedIndex == 0)
		{
		}
		else if($(this)[0].selectedIndex == 1)
		{
			$('[sid = "QOSRULE_PORTFROM"]').val("80");
			$('[sid = "QOSRULE_PORTTO"]').val("");
			$('[sid="S_QOSRULE_PROTOCOL"]').val("TCP").selectmenu("refresh");
		} 
		else if($(this)[0].selectedIndex == 2)
		{
			$('[sid="S_QOSRULE_PROTOCOL"]').val("UDP").selectmenu("refresh");
			$('[sid = "QOSRULE_PORTFROM"]').val("1775");
			$('[sid = "QOSRULE_PORTTO"]').val("");
		} 
	});
	$('#panel_qosrule select[sid = "S_QOSRULE_IPSELECTWAY"]').change(function()
	{
		if($(this)[0].selectedIndex == 0)
		{
			unlock_object('.lc_ipaddr2_div .lc_right [sid="VALUE3"]', "readonly");
			$('.lc_ipaddress_div .lastiprange, .lc_bpi_div label').css('display', 'none');
			lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE4"]', "disabled");
		}
		else if($(this)[0].selectedIndex == 1)
		{
			unlock_object('.lc_ipaddr2_div .lc_right [sid="VALUE3"]', "readonly");
			$('.lc_ipaddress_div .lastiprange, .lc_bpi_div label').css('display', '');
			unlock_object('.lc_ipaddr2_div .lc_right [sid="VALUE4"]', "disabled");
		}
		else if($(this)[0].selectedIndex == 2 || $(this)[0].selectedIndex == 3)
		{
			lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE3"]', "readonly");
			$('.lc_ipaddress_div .lastiprange, .lc_bpi_div label').css('display', 'none');
			lock_object('.lc_ipaddr2_div .lc_right [sid="VALUE4"]', "disabled");
		}
	});
        $('#panel_qosrule input[type="text"], #panel_qosrule input[type="number"]').keyup(function()
        {
		unlock_object('#panel_qosrule button[sid = "S_MODIFY_BUTTON"]', 'disabled');
		if(listIndex != "")
			unlock_object('#panel_qosrule button[sid = "S_CANCEL_BUTTON"]', 'disabled');
	});
        $('#panel_qosrule select, #panel_qosrule input[type="checkbox"]').change(function()
        {
		unlock_object('#panel_qosrule button[sid = "S_MODIFY_BUTTON"]', 'disabled');
		if(listIndex != "")
			unlock_object('#panel_qosrule button[sid = "S_CANCEL_BUTTON"]', 'disabled');
	});

	add_newrule_button_event();
	add_submit_button_event();
	add_modify_button_event();
	add_cancel_button_event();
	add_delete_button_event();
}

function convert_priority(property, command, priority)
{
	var rule_size = Object.keys(config_data.userrule).length - 1,
		sharingborrow_size = get_sharingborrow_size();
	if(rule_size == 0)
		return 1;
	var offset = 0;
	if(command == "add")
		++offset;

	if(property == M_lang['S_QOSRULE_PROPERTY'][0].value)
	{
		if(priority > rule_size + offset || priority == "")
			priority = rule_size + offset;
		else if(priority < sharingborrow_size + 1)
			priority = sharingborrow_size + 1;
	}
	else
	{
		if(priority > sharingborrow_size + offset || priority == "")
			priority = sharingborrow_size + offset;
		else if(priority <= 0)
			priority = 1;
	}
	return priority;
}

confirm_before_submit['qosrule'] = function(identifier)
{
	if((identifier != "add" && identifier != "modify") || $('input[sid = "QOSRULE_PRIORITYORDER"]').val() == "")
		return false;

	if(convert_priority($('select[sid = "S_QOSRULE_PROPERTY"]').val(), identifier, $('input[sid = "QOSRULE_PRIORITYORDER"]').val()) 
		!= $('input[sid = "QOSRULE_PRIORITYORDER"]').val()
		&& Object.keys(config_data.userrule).length > 1 )
	{
		confirm_menu = "before_submit_priority_" + identifier;
		confirm(M_lang["S_QOSRULE_ALERT6"], undefined, false);
		return true;
	}
	return false;
}

submit_local_func['qosrule'] = function(identifier)
{
	if(!can_submit_newrule( identifier ))
	{
		return false;
	}

	var rule_data = eval("config_data.userrule.list" + (listIndex - 1)),localdata = [];
	if(identifier == "add" || identifier == "modify")
	{
		localdata.push({name : "priorityorder", value : 
			convert_priority($('select[sid = "S_QOSRULE_PROPERTY"]').val(), identifier, $('input[sid = "QOSRULE_PRIORITYORDER"]').val())});
		localdata.push({name : "property", 	value : $('select[sid = "S_QOSRULE_PROPERTY"]').val()});

		var bpsUnit = "M", down = $('[sid = "QOSRULE_DOWNINPUT"]').val(),
			up = $('[sid = "QOSRULE_UPINPUT"]').val();
		if( down.indexOf(".") >= 0 || up.indexOf(".") >= 0 )
		{
			down = ( down * 1024 ).toFixed(0);
			up = ( up * 1024 ).toFixed(0);
			bpsUnit = "K";
		}
		if(down == "") down = 0;
		if(up == "") up = 0;
		localdata.push({name : "down", 		value : down});
		localdata.push({name : "up", 		value : up});
		localdata.push({name : "bps", 		value : bpsUnit });

		var ipaddr = "", iptype = 0, ipto = "";
		ipaddr += $('.lc_ipaddress_div [sid="VALUE0"]').val() + ".";
		ipaddr += $('.lc_ipaddress_div [sid="VALUE1"]').val() + ".";
		ipaddr += $('.lc_ipaddress_div [sid="VALUE2"]').val() + ".";
		
		if($('[sid="S_QOSRULE_IPSELECTWAY"]').val() != "allip")
		{
			if($('[sid="S_QOSRULE_IPSELECTWAY"]').val() == "twinip")
				iptype = 1;
			else if($('[sid="S_QOSRULE_IPSELECTWAY"]').val() == "range")
				ipto = ipaddr + $('[sid = "VALUE4"]').val();

			localdata.push({name : "iptype", 	value : iptype});
			localdata.push({name : "ipfrom", 	value : ipaddr + $('[sid = "VALUE3"]').val()});
			localdata.push({name : "ipto", 		value : ipto});
		}
		else
		{
			localdata.push({name : "iptype", 	value : iptype});
			localdata.push({name : "ipfrom", 	value : ""});
			localdata.push({name : "ipto", 		value : ""});
		}
		localdata.push({name : "bpicheck", 	value : $('[sid = "S_QOSRULE_BPI"]').prop("checked")});
		localdata.push({name : "protocol", 	value : $('[sid = "S_QOSRULE_PROTOCOL"]').val()});
		if($('[sid = "S_QOSRULE_PROTOCOL"]').val() == M_lang["S_QOSRULE_PROTOCOL"][0].value)
		{
			localdata.push({name : "portfrom", 	value : ""});
			localdata.push({name : "portto", 	value : ""});
		}
		else
		{
			localdata.push({name : "portfrom", 	value : $('[sid = "QOSRULE_PORTFROM"]').val()});
			localdata.push({name : "portto", 	value : $('[sid = "QOSRULE_PORTTO"]').val()});
		}
	}

	if(identifier == "delete" || identifier == "modify")
	{
		localdata.push({name : "downclassid", value : rule_data.downclassid});
		localdata.push({name : "upclassid", value : rule_data.upclassid});
	}

        $('#loading').popup('open');
	$("#right_panel").panel("close");
        return iux_submit(identifier, localdata);
}

$(document).ready(function() {
	window.tmenu = "trafficconf";
	window.smenu = "qos";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update('C');
	iux_set_onclick_local();

	$("[sid=\"MAINLISTVIEW\"] .ui-last-child").removeClass('ui-last-child').css('border-bottom','1px #ccc solid');
	highlight = HighlightObject();
	popup = TapholdPopup();

	if( !config_data.smartqos )
		$("#main_content #smartqos").remove();
}

function result_config()
{
	if( config_data.internettype.w1service == "" && config_data.internettype.w1up == "0" && config_data.internettype.w1down == "0" )
		isDefaultValue = true;
	else
		isDefaultValue = false;
	if( config_data.internettype.w1unitdown == "0" )
		config_data.internettype.w1down >>= 10;
	if( config_data.internettype.w1unitup == "0" )
		config_data.internettype.w1up >>= 10;
	for( var index in config_data.userrule )
	{
		if( index == "" )
			continue;
		if( config_data.userrule[index].unitdown == "0" )
			config_data.userrule[index].down >>= 10;
		if( config_data.userrule[index].unitup == "0" )
			config_data.userrule[index].up >>= 10;
	}
	iux_update_local("C");
}

function iux_set_onclick_local()
{
	$("li.internettype").on('click', function(){
		load_rightpanel( "internettype" );
	}).on("mousedown touchstart", function() {
		$(this).find("a").addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$("#qosrule, #list_div >div").unbind('click').on('click', function(){
		if( isDefaultValue )
		{
			alert( M_lang["S_QOSRULE_ALERT11"] );
			return;
		}
		load_rightpanel(this.id);
		$("#right_panel").panel("open");
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
//	add_popup_modify_button_event();
//	add_popup_delete_button_event();
//	add_popup_cancel_button_event();
	listener_add_local('qosonoff');
	if( config_data.smartqos )
		listener_add_local('smartqos');
}

function TapholdPopup()
{
	var $popup, $title, $modifyMenu, $deleteMenu, $cancelMenu, $item, $popupScreen;
	cache();
	init();
	function cache()
	{
		$popup = $("#taphold_popup");
		$title = $popup.find("#taphold_popup_title");
		$modifyMenu = $popup.children().eq(1);
		$deleteMenu = $popup.children().eq(2);
		$cancelMenu = $popup.children().eq(3);
		$popupScreen = $("#" + $popup.attr("id") + "-screen");
	}
	function init()
	{
		$popup.on( "popupafteropen", bindMenuEvents );
		$popup.on( "popupafterclose", unbindMenuEvents );
	}
	function bindMenuEvents()
	{
		setTimeout( function() {
			$modifyMenu.on('click', modifyItem );
			$deleteMenu.on('click', deleteItem );
			$cancelMenu.on('click', closePopup );
			$popupScreen.off().on('click', clickOutside );
		}, 500);
	}
	function unbindMenuEvents()
	{
		$modifyMenu.unbind('click');
		$deleteMenu.unbind('click');
		$cancelMenu.unbind('click');
		$popupScreen.unbind('click');
	}
	function clickOutside( e )
	{
		e.stopPropagation();
		closePopup();
	}
	function modifyItem()
	{
		closePopup();
		load_rightpanel( $item );
		$("#right_panel").panel("open");
	}
	function deleteItem()
	{
		closePopup();
		confirm_menu = "popup_delete";
		confirm(M_lang["S_QOSCONFIRM_MSG2"], M_lang["S_QOSCONFIRM_MSG1"]);
	}
	function closePopup()
	{
		$popup.popup("close");
	}
	function openPopup( titleString, itemId )
	{
		$title.text( titleString );
		$item = itemId;
		$popup.popup("open");
	}
	return openPopup;
}

function iux_update_local(identifier)
{
	if(identifier == "D")
	{
		if( config_data && config_data.smartqos )
			iux_update_local_func['smartqoslist'].call(this, identifier);
	}
	else if(identifier == "C")
	{
		if($("#right_content :first-child").attr('id'))
			iux_update_local_func[$("#right_content :first-child").attr('id').split("_")[1]].call(this, identifier);
		iux_update_local_func['main'].call(this, identifier);
		iux_update_local_func['qosonoff'].call(this, identifier);
		if( config_data.smartqos )
			iux_update_local_func['smartqos'].call(this, identifier);
	}
}

function result_submit(act, result) 
{ 
	if(errorcode != "0")
	{
		if(errorcode == -402 || errorcode == -403)
			alert(M_lang['S_QOSRULE_ERROR1'] + "(" + errorcode + ")");
		else
			alert(M_lang['S_UNKNOWN_ERROR_MSG'] + "(" + errorcode + ")");
	}
	if(result_submit_func[act])
		result_submit_func[act].call(this, result); 
	iux_update('C');	
	iux_update_local();
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, localdata)
{
	if(confirm_before_submit[service_name] && confirm_before_submit[service_name].call(this, localdata))
			return false;
	if(submit_local_func[service_name].call(this, localdata)){
		return true;
	}
	return false;
}

function load_rightpanel(_aname) 
{
	listIndex = _aname.split('_')[1];
	_aname = _aname.split('_')[0];

	if(listIndex)
		highlight( $("#qosrule_" + listIndex) );

	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+_aname+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).enhanceWithin();
				load_header(RIGHT_HEADER, _aname);
				
				iux_update("C");
				iux_update("S");
				listener_add_local(_aname);

				load_qoslist_data();
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		});
}


