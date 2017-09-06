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
function get_port_number(port_index)
{
	return Object.keys(config_data.linksetup)[port_index].substr(3, Object.keys(config_data.linksetup)[port_index].length);
}

function submit_button_event_add(service_name)
{
        $('[sid = "S_BUTTON_SUBMIT"]').click(function() {submit_local(service_name);});

}

function isAutoMode_local(port_index)
{
	if($(".lc_table1_div .lc_tablerow_div:nth-child(" + (parseInt(port_index) + 1) + ") select").eq(2).val() == "auto")
		return true;
	return false;
}

function isOn(port_index)
{
	if(!status_data)
		return false;

	if(eval("status_data.linksetup." + Object.keys(status_data.linksetup)[port_index]).onoff == "On")
		return true;

	return false;
}

function convertWanName(str)
{
	var temp_str = str.substr(0, 3).toUpperCase();
	if(temp_str == "WAN")
		return temp_str;
	return str;
}

function isWan(str)
{
	if(str.substr(0, 3) == "wan")
		return true;
	return false;
}

function lock_object2(object, proptype)
{
        object.prop(proptype, true);
        object.parent().addClass('ui-state-disabled');
}

function unlock_object2(object, proptype)
{
        object.prop(proptype, false);
        object.parent().removeClass('ui-state-disabled');
}

function lock_object(object, proptype, text)
{
	object.parent().css("display", "none");
        object.prop(proptype, true);
	object.closest(".lc_cell_div").find("p").text(text);
	object.closest(".lc_cell_div").find(">div:last-child").css("display", "");
	if(text == M_lang["S_LINKSETUP_MODE"][0].text)
		object.closest(".lc_tablerow_div").find(">div:not(:first-child) >div:last-child").css("padding-top", "0.6em");
}

function unlock_object(object, proptype)
{
	object.closest(".lc_cell_div").find(">div:last-child").css("display", "none");
	object.parent().css("display", "");
        object.prop(proptype, false);
}

function has_changed_port(port_index)
{
	var target =  $("#lc_status_div >.lc_tablerow_div:nth-child(" + (port_index + 1) + ") select"),
	data = eval("config_data.linksetup." + Object.keys(config_data.linksetup)[port_index]);

	if((data.mode == "fixed" || data.mode == "auto") && target.eq(2).val() == "auto")
		return false;
	else if(target.eq(2).val() != data.mode)
		return true;
	else if(data.speed != target.eq(1).val())
		return true;
	else if(data.duplex != target.eq(0).val())
		return true;

	return false;
}

function has_changed()
{
	var port_size = get_port_size();
	for(var i = 0; i < port_size; ++i)
		if(has_changed_port(i))
			return true;
	return false;
}

function add_change_event()
{
	$(".lc_table1_div select").change(function(event)
	{
		if(has_changed())
			unlock_object2($('[sid = "S_BUTTON_SUBMIT"]'), "disabled");
		else
			lock_object2($('[sid = "S_BUTTON_SUBMIT"]'), "disabled");
	});
}

function add_mode_change_event()
{
	$("#lc_status_div >.lc_tablerow_div >.lc_cell_div:nth-child(3) select").change(function(event) 
	{
		if($(this).val() == "1000")
		{
			lock_object($(this).closest(".lc_tablerow_div").find(">.lc_cell_div:nth-child(2) select"), "disabled", M_lang["S_LINKSETUP_DUPLEX"][0].text);
		}
		else
		{
			unlock_object($(this).closest(".lc_tablerow_div").find(">.lc_cell_div:nth-child(2) select"), "disabled");
		}
	});
	$("#lc_status_div >.lc_tablerow_div >.lc_cell_div:nth-child(4) select").change(function(event) 
	{
		if($(this).val() == "auto")
		{
			lock_object($(this).closest(".lc_tablerow_div").find(">.lc_cell_div:lt(3) select"), "disabled");
			update_linkstatus_p_with_statusdata($(this).closest(".lc_tablerow_div").index());
		}
		else
		{
			unlock_object($(this).closest(".lc_tablerow_div").find(">.lc_cell_div:lt(3) select"), "disabled");
			update_linkstatus_select_with_configdata($(this).closest(".lc_tablerow_div").index());
			$(this).closest(".lc_tablerow_div").find(">.lc_cell_div:nth-child(3) select").trigger("change");
		}
	});
}

function get_stat_size()
{
	if(!status2_data)
		return 0;
	return Object.keys(status2_data.portstat).length - 1;
}
function get_port_size()
{
	var linksetup = config_data && config_data.linksetup || status_data && status_data.linksetup;
	return Object.keys(linksetup).length - 1;
}

function get_lan_size()
{
	var linksetup = config_data && config_data.linksetup || status_data && status_data.linksetup;
	var count = 0;
	for(var key in Object.keys(linksetup))
		if(!isWan(key))
			++count;
	return count;
}

function append_linkstatus_row()
{
        var htmlStr = '' +
	'	<div class = "lc_tablerow_div">' +
	'		<div class = "lc_column1_div lc_cell_div">' +
	'			<img>' +
	'			<p></p><p class = "lc_grayfont_text"></p>' +
	'		</div>' +
	'		<div class = "lc_column4_div lc_cell_div ui-alt-icon ui-nodisc-icon">' +
	'			<div class = "lc_select_div">' +
	'				<select type = "select"></select>' +
	'			</div>' +
	'			<div><p></p></div>' +
	'		</div>' +
	'		<div class = "lc_column3_div lc_cell_div ui-alt-icon ui-nodisc-icon">' +
	'			<div class = "lc_select_div">' +
	'				<select type = "select"></select>' +
	'			</div>' +
	'			<div><p></p></div>' +
	'		</div>' +
	'		<div class = "lc_column2_div lc_cell_div ui-alt-icon ui-nodisc-icon">' +
	'			<div class = "lc_select_div">' +
	'				<select type = "select"></select>' +
	'			</div>' +
	'			<div><p></p></div>' +
	'		</div>' +
	'	</div>' +
        '';

        $('#lc_status_div').append(htmlStr).enhanceWithin();
}

function make_option(selector, lang_array)
{
	$(selector).find("option").remove();
	for(var object in lang_array)
	{
		$(selector).append("<option value='" + lang_array[object].value + "'>" + lang_array[object].text + "</option>");
	}
}

function make_select_option()
{
	var size = get_port_size();
	for(var i = 1; i <= size; ++i)
	{
		make_option("#lc_status_div >.lc_tablerow_div:nth-child(" + i + ") >.lc_cell_div:nth-child(4) select", M_lang["S_LINKSETUP_MODE"]);
		make_option("#lc_status_div >.lc_tablerow_div:nth-child(" + i + ") >.lc_cell_div:nth-child(3) select", M_lang["S_LINKSETUP_SPEED"]);
		make_option("#lc_status_div >.lc_tablerow_div:nth-child(" + i + ") >.lc_cell_div:nth-child(2) select", M_lang["S_LINKSETUP_DUPLEX"]);
	}
}

function make_linkstatus_table()
{
        $('#lc_status_div >div').remove();

	var size = get_port_size();
	for(var i = 0; i < size; ++i)
		append_linkstatus_row();
	make_select_option();
}

function update_linkstatus_img()
{
	var port_size = get_port_size(), img_list = $('.lc_table1_div img');
	if(img_list.length == 0)
		return;
	for(var i = 0; i < port_size; ++i)
	{
		if(!status_data)
		{
			img_list.eq(i).attr("src", "images/WAN_LAN_OFF.png");
			continue;
		}

		var data = eval("status_data.linksetup." + Object.keys(config_data.linksetup)[i]);
		if(data.onoff == "On")
		{
			if(isWan(Object.keys(config_data.linksetup)[i]))
				img_list.eq(i).attr("src", "images/WAN_ON.png");
			else
				img_list.eq(i).attr("src", "images/LAN_ON.png");
		}
		else
			img_list.eq(i).attr("src", "images/WAN_LAN_OFF.png");
	}
}

function update_linkstatus_p(target, data)
{
	var speed = data.speed, duplex = data.duplex;
	if(speed == "1G" || speed == "1000")
		speed = "1Gbps";
	else if(speed == "--")
		speed = "-----";
	if(duplex == "--")
		duplex = "-----";
	else if(duplex == "full")
		duplex = "Full";
	target.eq(3).text(speed);
	target.eq(2).text(duplex);
}

function update_linkstatus_select(target, data)
{
	target.eq(1).val(data.speed).selectmenu("refresh");
	target.eq(0).val(data.duplex.toLowerCase()).selectmenu("refresh");
}

function update_linkstatus_p_with_configdata(index)
{
	var target =  $("#lc_status_div >.lc_tablerow_div:nth-child(" + (index + 1) + ") p"),
	data = eval("config_data.linksetup." + Object.keys(config_data.linksetup)[index]);

	update_linkstatus_p(target, data);
}

function update_linkstatus_p_with_statusdata(index)
{
	if(!status_data)
		return;
	var target =  $("#lc_status_div >.lc_tablerow_div:nth-child(" + (index + 1) + ") p"),
	data = eval("status_data.linksetup." + Object.keys(status_data.linksetup)[index]);

	update_linkstatus_p(target, data);
}

function update_linkstatus_select_with_configdata(index)
{
	var target =  $("#lc_status_div >.lc_tablerow_div:nth-child(" + (index + 1) + ") select"),
	data = eval("config_data.linksetup." + Object.keys(config_data.linksetup)[index]);

	update_linkstatus_select(target, data);
}

function update_linkstatus_table_status()
{
	var port_size = get_port_size();
	for(var i = 0; i < port_size; ++i)
	{
		if(isAutoMode_local(i))
			update_linkstatus_p_with_statusdata(i);
	}
}

function update_linkstatus_row_config(index)
{
	var target =  $("#lc_status_div >.lc_tablerow_div:nth-child(" + (index + 1) + ")"),
	port_number = get_port_number(index),
	data = eval("config_data.linksetup." + Object.keys(config_data.linksetup)[index]);

	target.find("select").eq(2).attr("name", "mode" + port_number);
	target.find("select").eq(1).attr("name", "speed" + port_number);
	target.find("select").eq(0).attr("name", "duplex" + port_number);

	target.find("p").eq(0).text(convertWanName(Object.keys(config_data.linksetup)[index].toUpperCase()));

	if(data.mode == "fixed")
		target.find("p").eq(1).text(M_lang["S_TABLE_TEXT5"]);
	
	if(data.mode == "fixed")
	{
		lock_object(target.find("select"), "disabled", M_lang["S_LINKSETUP_MODE"][0].text);
	}
	else if(data.mode == "auto")
	{
		lock_object(target.find("select").eq(1).val("auto"), "disabled");
		lock_object(target.find("select").eq(0).val("auto"), "disabled");
	}
	else
	{
		target.find("select").eq(2).val(data.mode);
		update_linkstatus_select_with_configdata(index);
		target.find("select").eq(1).trigger("change");
	}

	if(data.maxspeed < "1000")
		target.find("select").eq(1).find('option[value="1000"]').remove();

	target.find("select").selectmenu("refresh").trigger("change");
}

function update_linkstatus_table()
{
	var port_size = get_port_size();
	for(var i = 0; i < port_size; ++i)
		update_linkstatus_row_config(i);
}

function make_linkstat_title()
{
	var size = get_stat_size();
        var htmlStr = '' +
	'	<div class = "lc_tablecolumn_div">' +
	'';
	var portCellHtml = '' +
	'		<div class = "lc_portdata_div lc_cell_div">' +
	'			<div class = "lc_line_div">' +
	'				<p class = "lc_portstat_title">&nbsp;</p>' +
	'			</div>' +
	'		</div>' +
	'';

	for(var i = 0; i < size; ++i)
		htmlStr += portCellHtml;

	htmlStr += '' +
	'	</div>' +
	'	<div class="lc_tablecolumn_div">' +
	'';
	for(var i = 0; i < size; ++i)
		htmlStr += portCellHtml;

	htmlStr += '' +
	'	</div>' +
	'';
        $('#lc_stat_div').append(htmlStr).enhanceWithin();
}

function append_linkstat_column()
{
	var size = get_stat_size();
        var htmlStr = '' +
	'	<div class = "lc_tablecolumn_div">' +
	'';
	var portCellHtml = '' +
	'		<div class = "lc_portdata_div lc_cell_div">' +
	'			<div class = "lc_line_div">' +
	'				<p class = "lc_portstat_data"></p>' +
	'			</div>' +
	'		</div>' +
	'';

	for(var i = 0; i < size; ++i)
		htmlStr += portCellHtml;

	htmlStr += '' +
	'	</div>' +
	'';
        $('#lc_stat_div').append(htmlStr).enhanceWithin();
}

function make_linkstat_table()
{
        if(!status2_data || $('#lc_stat_div >div').length > 0)
		return;

	var size = get_port_size();

	make_linkstat_title();
	for(var i = 0; i < size; ++i)
		append_linkstat_column();
}

function update_linkstat_title()
{
	var count = 0, size = get_port_size();
	
	$("#lc_stat_div .lc_tablecolumn_div .lc_portdata_div:first-child p.lc_portstat_title").eq(0).text(M_lang["S_TABLE2_COLUMN1"]);
	$("#lc_stat_div .lc_tablecolumn_div .lc_portdata_div:first-child p.lc_portstat_data").each(function() {
		if(isWan(Object.keys(config_data.linksetup)[count]))
			$(this).text(convertWanName(Object.keys(config_data.linksetup)[count].toUpperCase()));
		else if(count != size)
			$(this).text(count);
		++count;
	});
}

function update_linkstat_row(index)
{
	var size = get_port_size();

	$("#lc_stat_div >.lc_tablecolumn_div:first-child >.lc_portdata_div:nth-child(" + (index + 2) + ") :first-child p").text(
		M_lang["S_LINKSETUP_TITLE"][Object.keys(status2_data.portstat)[index]]);
	$("#lc_stat_div >.lc_tablecolumn_div:nth-child(2) >.lc_portdata_div:nth-child(" + (index + 2) + ") :first-child p").text(
		M_lang["S_LINKSETUP_TITLE"][Object.keys(status2_data.portstat)[index]]);
	for(var i = 0; i < size; ++i)
	{
		$("#lc_stat_div >.lc_tablecolumn_div:nth-child(" + (i + 3) + ") >.lc_portdata_div:nth-child(" + (index + 2) + ") :last-child p").text(
			status2_data.portstat[Object.keys(status2_data.portstat)[index]][i + 1]
		);
	}

}

function update_linkstat_data()
{
	var stat_size = get_stat_size(), port_size = get_port_size();
	for(var i = 0; i < stat_size; ++i)
		update_linkstat_row(i);
}

function update_linkstat_table()
{
	update_linkstat_title();
}

//local utility functions end
iux_update_local_func['main'] = function(identifier) 
{
	if( identifier == "C" )
		return;
	else if(identifier == "S" || identifier == "D")
	{
		make_linkstat_table();
		update_linkstat_table();

		update_linkstatus_img();
		update_linkstatus_table_status();
		update_linkstat_data();
		return;
	}

	make_linkstatus_table();
	
	add_mode_change_event();
	add_change_event();

	update_linkstatus_table();
	update_linkstatus_img();
}

add_listener_local_func['main'] = function()
{
        $('.lc_button_div input[sid = "S_BUTTON_SUBMIT"]').click(function() {
		submit_local('linksetup');
	});
        $('.lc_button_div input[sid="S_LINKSETUP_RESET"]').click(function() {
		submit_local('linkstat');
	});
};

submit_local_func['linksetup'] = function()
{
	if(!has_changed())
		return;
        $('#loading').popup('open');

	var localdata = [], port_size = get_port_size();

	for(var i = 0; i < port_size; ++i)
	{
		if(!has_changed_port(i))
			continue;
		var list =  $(".lc_table1_div .lc_tablerow_div:nth-child(" + (i + 1) + ") select");
		localdata.push({name : "port", value : get_port_number(i)});
		if(list.eq(2).val() == "auto")
		{
			localdata.push({name : list.eq(2).attr("name"), value : list.eq(2).val()});
		}
		else
		{
			list.each(function() {
				localdata.push({name : $(this).attr("name"), value : $(this).val()});
			});
		}
	}

        return iux_submit('linksetup', localdata);
}

submit_local_func['linkstat'] = function()
{
	$('#loading').popup('open');
	return iux_submit('linkstat');
}

$(document).ready(function() {
	window.tmenu = "trafficconf";
	window.smenu = "linksetup";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update_local();
	get_linkstat_data(window.tmenu, window.smenu);

	listener_add_local('main');
	lock_object2($('[sid = "S_BUTTON_SUBMIT"]'), "disabled");
}

function result_config()
{
}

function iux_update_local(identifier)
{
	iux_update_local_func["main"].call(this, identifier);
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
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
	lock_object2($('[sid = "S_BUTTON_SUBMIT"]'), "disabled");
        iux_update_local();
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

function get_linkstat_data(_tmenu, _smenu, _args, _retime, _use_local_status)
{
        if(_use_local_status)   return;
        $.ajaxSetup({async : true, timeout : 4000});
        var _data = [];
        _data.push({name : "tmenu", value : eval("_tmenu")});
        _data.push({name : "smenu", value : eval("_smenu")});
        _data.push({name : "act", value : "status2"});
        if(_args){
                _data.push(_args);
        }
        $.getJSON('/cgi/iux_get.cgi', _data)
        .done(function(data) {
                if(json_validate(data, '') == true)
                        status2_data = data;
                iux_update("D");
                setTimeout(function(_tm, _sm, _ar,_rt){
                        get_linkstat_data(_tm, _sm, _ar,_rt);
                },(_retime?_retime:3000), _tmenu, _smenu, _args,_retime);
        })
        .fail(function(jqxhr, textStatus, error) {
        });
}

