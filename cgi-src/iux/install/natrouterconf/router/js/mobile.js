//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var printData = '';
var highlight;
//local-global variables end

//local utility functions
function convertSubnet(mainSubnet)
{
	var i, j, result = 0, value, ip;
	var subnetArray = mainSubnet.split(".");
	for(j = 0; j < subnetArray.length; ++j)
	{
		ip = Number(subnetArray[j]);
		i = 8;
		do {
			value = 1 << --i;
		} while(i >= 0 && (ip & value) === value);
		result += 7 - i;
		if(i !== -1)
			break;
	}
	return result;
}

function check_input_range(type, sid)
{
        if(type == "IP")
        {
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
        }
        else if(type == "MASK")
        {
		if($('[sid="ROUTING_TYPE"] option:selected').val() == 'host')
			return true;
                var mask = $('[sid = ' + sid + '] input').val();
                if(check_input_error(mask,regExp_onlynum))
                {
                        alert(M_lang['S_INVALID_NUMBER']);
                        return false;
                }
                if(mask == '')
                {
                        alert(M_lang['S_BLANKED_MASK']);
                        return false;
                }
		if(mask < 0 || mask > 32)
		{
			alert(M_lang['S_INVALID_MASK']);
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

function append_rpanel_line(index)
{
	var backgroundClass = index % 2 == 1? 'lc_whitebox_div':'lc_greenbox_div',
	type = config_data.routinglist[index].type.toUpperCase(),
	target = config_data.routinglist[index].target,
	mask = config_data.routinglist[index].netmask,
	gateway = config_data.routinglist[index].gateway;

//	if(config_data.routinglist[index].type == "net")
//		target += "/" + config_data.routinglist[index].netmask;

	index = parseInt(index) + 1;

	var HTMLStr = '' +
		'<label for = "lc_checkbox' + index + '" data-iconpos = "right" class="' + backgroundClass + ' lc_list_label ui-alt-icon">' + 
			'<div class="rpanel_priority_div">' + 
				'<div class="lc_line_div">' + 
					'<p class="lc_boldfont_text">' + index + '.</p>' +
				'</div>' +
				'<div class="lc_line_div"></div>' +
			'</div>' +
			'<div class="rpanel_leftbox_div">' +
				'<div class="lc_line_div">' +
					'<p class="lc_boldfont_text">' + type + '</p>' +
				'</div>' +
				'<div class="lc_line_div lc_bg_leftcolor">' +
					'<p class="lc_disabled_text lc_boldfont_text rpanel_text">' + target + '</p>' +
//				'</div>' +
//				'<div class="lc_line_div lc_bg_leftcolor">' +
					'<p class="lc_disabled_text lc_boldfont_text rpanel_text">' + mask + '</p>' +
				'</div>' +
			'</div>' +
			'<div class="rpanel_direction_div">' +
				'<div class="lc_line_div"></div>' +
				'<div class="lc_line_div">' +
					'<img src="/common/images/right_arrow_deny.png">' +
				'</div>' +
			'</div>' +
			'<div class="rpanel_rightbox_div">' +
				'<div class="lc_line_div"></div>' +
				'<div class="lc_line_div lc_bg_rightcolor">' +
					'<p class="lc_disabled_text lc_boldfont_text rpanel_text">' + gateway + '</p>' +
				'</div>' +
			'</div>' +
		'</label>' +
		'<input type="checkbox" id = "lc_checkbox' + index + '" class = "routing_list_checkbox">' +
	'';
	$('#iux_form').append(HTMLStr).enhanceWithin();
}

function append_main_line(index)
{
	var cData = config_data.routinglist[index],
		type = cData.type.toUpperCase(),
		target = cData.target,
		gateway = cData.gateway,
		background = (index % 2 == 1) ? 'lc_whitebox_div' : 'lc_greenbox_div';

	if(cData.netmask != "")
		target += "/" + cData.netmask;
	var HTMLStr = '' +
	'<div class="'+ background +'" id="routinglist_'+ index +'" sid="LISTDATA">' +
		'<div class="lc_priority_div">' +
			'<div class="lc_line_div">' +
				'<p class="lc_boldfont_text">'+ (index + 1) +'</p>' +
			'</div>' +
			'<div class="lc_line_div"></div>' +
		'</div>' +
		'<div class="lc_leftbox_div">' +
			'<div class="lc_line_div">' +
				'<p sid="TYPE_FIELD" class="lc_boldfont_text">' + type + '</p>' +
			'</div>' +
			'<div class="lc_line_div lc_bg_leftcolor">' +
				'<p sid="TARGET_MASK_FIELD" class="lc_disabled_text">' + target + '</p>' +
			'</div>' +
		'</div>' +
		'<div class="lc_direction_div">' +
			'<div class="lc_line_div"></div>' +
			'<div class="lc_line_div">' +
				'<img src="/common/images/right_arrow_deny.png">' +
			'</div>' +
		'</div>' +
		'<div class="lc_rightbox_div">' +
			'<div class="lc_line_div"></div>' +
			'<div class="lc_line_div lc_bg_rightcolor">' +
				 '<p sid="GATEWAY_FIELD" class="lc_disabled_text">' + gateway + '</p>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'';
	$('#routingtable_listbox').append(HTMLStr);
}

function submit_button_event_add(service_name)
{
        $('#right_panel .lc_submit_button').click(function() {
		submit_local(service_name);
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

function onRuleClickEvent(obj)
{
}

//local utility functions end

iux_update_local_func['main'] = function(identifier)
{
        $('[sid="LISTDATA"]').remove();

	if(config_data.routinglist.length == 1)
	{
		$('#table_list').css('display', 'none');
		$('#deleteroute').css('display', 'none');
		return;
	}
	$('#table_list').css('display', '');
	$('#deleteroute').css('display', '');
	for(var i = 0; i < config_data.routinglist.length; i++){
		if(!config_data.routinglist[i].type)
			continue;
		append_main_line(i);
	}

	$('[sid = "LISTDATA"]').on( "taphold", function(event) {
		$( event.target ).addClass( "taphold" );
		config_data.deleteIndex = $(this).attr('id').split('_')[1];
		load_rightpanel('deleteroute');
		$('#right_panel').panel('open');
	});
};

add_listener_local_func['main'] = function()
{
}

iux_update_local_func['addroute'] = function(identifier)
{
	if(identifier == 'S')
	{
		$('[sid="ROUTING_TYPE"]').selectmenu('refresh',true);
	}
}

add_listener_local_func['addroute'] = function()
{
	submit_button_event_add('addroute');
	$('[sid = "ROUTING_TYPE"]').change(function() {
		if($('[sid="ROUTING_TYPE"] option:selected').val() == 'host')
		{
			$('[sid = "ROUTING_MASK"] input').prop('disabled', true);
			$('[sid = "ROUTING_MASK"]').addClass('ui-state-disabled');
		}
		else
		{
			$('[sid = "ROUTING_MASK"] input').prop('disabled', false);
			$('[sid = "ROUTING_MASK"]').removeClass('ui-state-disabled');
		}
	});
};

submit_local_func['addroute'] = function()
{
	var localdata = [];

	if(!check_input_range('IP', 'ROUTING_TARGET') || !check_input_range('IP', 'ROUTING_GATEWAY') || !check_input_range('MASK', 'ROUTING_MASK'))
		return false;

	var type = $('[sid="ROUTING_TYPE"] option:selected').val(),
	mask = $('[sid = "ROUTING_MASK"] input').val(),
	target = convert_textfield_to_string('ROUTING_TARGET'),
	gateway = convert_textfield_to_string('ROUTING_GATEWAY');


	localdata.push({name : "type", value : type});
	localdata.push({name : "target", value : target});
	localdata.push({name : "netmask", value : mask});
	localdata.push({name : "gateway", value : gateway});

	$('#loading').popup('open');
	iux_submit('addroute', localdata);

	return true;
}

iux_update_local_func['deleteroute'] = function(identifier)
{
	if(identifier != 'C' || config_data.routinglist.length == 1 || $("input[type=checkbox]").filter(function() { return $(this).prop("checked");}).length > 0)
		return;
	for(var i = 0; i < config_data.routinglist.length; i++){
		if(!config_data.routinglist[i].type)
			continue;
		append_rpanel_line(i);
	}
	if(config_data.deleteIndex != -1)
		$('.routing_list_checkbox').eq(config_data.deleteIndex).prop('checked', true).checkboxradio("refresh");
};

add_listener_local_func['deleteroute'] = function()
{
	submit_button_event_add('deleteroute');
	$('#select_all').change(function() {
		$('.routing_list_checkbox').prop('checked', $(this).prop('checked')).checkboxradio("refresh");
	});
};

submit_local_func['deleteroute'] = function()
{
	var localdata = [];

	$('.routing_list_checkbox').each(function() {
		if($(this).prop('checked')){
			localdata.push({name : "delchk", value : parseInt($(this).attr('id').replace('lc_checkbox', '')) - 1});
		}
	});
	if( localdata.length == 0 )
		return false;

	$('#loading').popup('open');
	iux_submit('deleteroute', localdata);

	return true;
}

iux_update_local_func['modifyroute'] = function(identifier)
{
	if(identifier !== "C")
		return;
	var index = config_data.modifyIndex;
	if(index === undefined)
		return;

	$("#right_main select[sid=ROUTING_TYPE]").val($("#routinglist_" + index + " p[sid=TYPE_FIELD]").text().toLowerCase()).selectmenu("refresh")

	var targetValue = $("#routinglist_" + index + " p[sid=TARGET_MASK_FIELD]").text().split("/")[0].split(".")
	var targetInput = $("#right_main div[sid=ROUTING_TARGET] input[sid^=VALUE]");
	var gateValue = $("#routinglist_" + index + " p[sid=GATEWAY_FIELD]").text().split(".")
	var gateInput = $("#right_main div[sid=ROUTING_GATEWAY] input[sid^=VALUE]")
	for(var i = 0; i < 4; ++i)
	{
		targetInput.eq(i).val(targetValue[i]);
		gateInput.eq(i).val(gateValue[i]);
	}

	$("#right_main div[sid=ROUTING_MASK] input[type=number]").val(convertSubnet($("#routinglist_" + index + " p[sid=TARGET_MASK_FIELD]").text().split("/")[1]));

	$('#right_panel button[sid ="S_CANCEL_BUTTON"]').prop('disabled', true);
	$('#right_panel button[sid ="S_MODIFY_BUTTON"]').prop('disabled', true);
};

add_listener_local_func['modifyroute'] = function()
{
	function hasChangedValue()
	{
		var index = config_data.modifyIndex;

		if($("#right_main select[sid=ROUTING_TYPE]").val() !== $("#routinglist_" + index + " p[sid=TYPE_FIELD]").text().toLowerCase())
			return true;

		var targetValue = $("#routinglist_" + index + " p[sid=TARGET_MASK_FIELD]").text().split("/")[0].split(".")
		var targetInput = $("#right_main div[sid=ROUTING_TARGET] input[sid^=VALUE]");
		var gateValue = $("#routinglist_" + index + " p[sid=GATEWAY_FIELD]").text().split(".")
		var gateInput = $("#right_main div[sid=ROUTING_GATEWAY] input[sid^=VALUE]")
		for(var i = 0; i < 4; ++i)
		{
			if(targetInput.eq(i).val() !== targetValue[i])
				return true;
			if(gateInput.eq(i).val() !== gateValue[i])
				return true;
		}
		if(Number($("#right_main div[sid=ROUTING_MASK] input[type=number]").val())
			!== convertSubnet($("#routinglist_" + index + " p[sid=TARGET_MASK_FIELD]").text().split("/")[1]))
			return true;
		return false;
	}

	submit_button_event_add('modifyroute');
	$('[sid = "ROUTING_TYPE"]').change(function() {
		if($('[sid="ROUTING_TYPE"] option:selected').val() == 'host')
		{
			$('[sid = "ROUTING_MASK"] input').prop('disabled', true);
			$('[sid = "ROUTING_MASK"]').addClass('ui-state-disabled');
		}
		else
		{
			$('[sid = "ROUTING_MASK"] input').prop('disabled', false);
			$('[sid = "ROUTING_MASK"]').removeClass('ui-state-disabled');
		}
	});
	$("#right_panel input, #right_panel select").on("change keyup", function() {
		if(hasChangedValue())
		{
			$('#right_panel button[sid ="S_CANCEL_BUTTON"]').prop('disabled', false);
			$('#right_panel button[sid ="S_MODIFY_BUTTON"]').prop('disabled', false);
		}
		else
		{
			$('#right_panel button[sid ="S_CANCEL_BUTTON"]').prop('disabled', true);
			$('#right_panel button[sid ="S_MODIFY_BUTTON"]').prop('disabled', true);
		}
	});
	$('[sid = "ROUTING_TYPE"]').trigger("change");
}

submit_local_func['modifyroute'] = function()
{
	var localdata = [];

	if(!check_input_range('IP', 'ROUTING_TARGET') || !check_input_range('IP', 'ROUTING_GATEWAY') || !check_input_range('MASK', 'ROUTING_MASK'))
		return false;

	var type = $('[sid="ROUTING_TYPE"] option:selected').val(),
	mask = $('[sid = "ROUTING_MASK"] input').val(),
	target = convert_textfield_to_string('ROUTING_TARGET'),
	gateway = convert_textfield_to_string('ROUTING_GATEWAY');


	localdata.push({name : "type", value : type});
	localdata.push({name : "target", value : target});
	localdata.push({name : "netmask", value : mask});
	localdata.push({name : "gateway", value : gateway});
	localdata.push({name : "delchk", value : config_data.modifyIndex});

	$('#loading').popup('open');
	iux_submit('modifyroute', localdata);

	return true;
}

$(document).ready(function() {
	window.tmenu = "natrouterconf";
	window.smenu = "router";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();

	add_listener_local_func['main'].call(this);

	highlight = HighlightObject();

	$(document).on("panelbeforeclose", "#right_panel", function() {
		config_data.deleteIndex = -1;
		config_data.modifyIndex = -1;
	});
}

function result_config()
{
	iux_update('C');	
	iux_update_local();
}

function iux_set_onclick_local()
{
	$('#addroute').unbind('click');
	$('#addroute').on('click', function() {
		load_rightpanel($(this).attr('id'));
		$('#right_panel').panel('open');
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});

	$('#deleteroute').unbind('click');
	$('#deleteroute').on('click', function() {
		config_data.deleteIndex = -1;
		load_rightpanel($(this).attr('id'));
		$('#right_panel').panel('open');
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
	$('#routingtable_listbox').on("click", " div[sid=LISTDATA]", function() {
		config_data.modifyIndex = $(this).attr("id").replace(/\D/g, "");
		load_rightpanel("modifyroute");
		$('#right_panel').panel('open');
	}).on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
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
	submit_local_func[service_name].call(this, localdata);
}

function result_submit(servicename, result)
{
	$("#right_panel").panel("close");
}

function load_rightpanel(_aname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });

	if(config_data.modifyIndex != -1)
		highlight( $("#routinglist_" + config_data.modifyIndex) );

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


