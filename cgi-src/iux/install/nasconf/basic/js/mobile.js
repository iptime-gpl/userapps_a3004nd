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
//local-global variables end
function getMountSize(portIndex)
{
	var count = 0;
	for(var key in status_data["device" + portIndex])
		if(key.indexOf("storage") >= 0)
			count++;
	return count;
}

function hasStorageInfo(object)
{
	if(!object.storage0)
		return false;
	return true;
}

function getDeviceSize()
{
	var count = 0;
	for(var index in status_data)
		if(index != "")
			++count;
	return count;
}

var dinfo = {
	service : {
		UNKNOWN		: 0x00,
		MASS_STORAGE	: 0x10,
		TETHERING	: 0x20,
		PRINTER		: 0x30
	},
	state : {
		UNKNOWN_MSG	: 0,
		CONNECTED_MSG	: 1,
		REMOVED_MSG	: 2,
		TETHERING_USE	: 3,
		TETHERING_NOTUSE_WANLINK : 4,
	}
}

function getDeviceType(device)
{
	return device.statusindex & 0xf0;
}

function getDeviceTypeString(index)
{
	switch(index)
	{
		case dinfo.service.UNKNOWN_DEVICE	: return M_lang["S_DEVICE_TEXT4"];
		case dinfo.service.MASS_STORAGE 	: return M_lang["S_DEVICE_TEXT1"];
		case dinfo.service.TETHERING		: return M_lang["S_DEVICE_TEXT2"];
		case dinfo.service.PRINTER		: return M_lang["S_DEVICE_TEXT3"];
		default					: return M_lang["S_DEVICE_TEXT4"];
	}
}

function getStatusString(object)
{
	switch(object.statusindex & 0xf)
	{
		case dinfo.state.CONNECTED_MSG		: return M_lang["S_USB_CONNECTED"];
		case dinfo.state.REMOVED_MSG		: return M_lang["S_USB_REMOVED"];
		case dinfo.state.TETHERING_USE		: return M_lang["S_USB_TETHERING"];
		case dinfo.state.TETHERING_NOTUSE_WANLINK : return M_lang["S_USB_WANLINK"];
		default :
			if(object.manufacturer)
				return object.manufacturer;
			else
				return M_lang["S_USB_UNKNOWN"];
	}
}

function getSizeDesc(object, index)
{
	return object["storage" + index].totalsize + M_lang["S_SIZE_TEXT1"] + object["storage" + index].freesize + M_lang["S_SIZE_TEXT2"];
}

function getMountName(object, index)
{
	var fileSysName = object["storage" + index].filesystem;
	if(fileSysName === "MOUNTING")
		fileSysName = M_lang["S_FILESYSTEM_STATE1"];
	return "/" + object["storage" + index].mountname + "(" + fileSysName + ")";
}

function getMountInfoDivSize(portIndex)
{
	var object = $("#device" + portIndex);
	if(!object)
		return 0;
	return object.children("div").length - 1;
}

function removeMountInfoDiv(portIndex)
{
	$("#device" + portIndex).children("div:not(:first-child)").remove();
}

function appendMountInfoDiv(portIndex, i)
{
	var htmlStr = $("<div>").attr("class", "lc_line_div"), index = portIndex + "" + i;
	htmlStr.html([
	'<div class = "lc_left_div class_hide" id = "storage_info_div', index, '">',
	'	<div>',
	'		<p class = "lc_grayfont_text" sid = "S_DEVICE_TEXT6"></p>',
	'		<p class = "lc_grayfont_text" id = "mountName', index, '"></p>',
	'	</div>',
	'</div>',
	'<div class = "lc_right_div">',
	'	<div>',
	'		<p class = "lc_grayfont_text" id = "sizeDesc', index, '"></p>',
	'	</div>',
	'</div>'].join(''));
	htmlStr.appendTo($("#device" + portIndex));
}

function appendSpoolInfoDiv(portIndex)
{
	var htmlStr = $("<div>").attr("class", "lc_line_div line2_left_p");
	htmlStr.html([
	'<div class = "lc_left_div">',
	'		<p class = "lc_grayfont_text" id = "row', portIndex, '_line2_left_p"></p>',
	'</div>',
	'<div class = "lc_right_div">',
	'	<div>',
	'	</div>',
	'</div>'].join(''));
	htmlStr.appendTo($("#device" + portIndex));
}

function makeDiv(portIndex)
{
	var type = getDeviceType(status_data["device" + portIndex]);
	removeMountInfoDiv(portIndex);
	if(type === dinfo.service.MASS_STORAGE)
	{
		var mountSize = getMountSize(portIndex), i = 0;
		while(i < mountSize)
			appendMountInfoDiv(portIndex, i++);
	}
	else if(type === dinfo.service.PRINTER)
	{
		appendSpoolInfoDiv(portIndex);
	}
}

function updateMountUmountButton(portIndex)
{
	var deleteDiv = $("#delete_div" + portIndex);
	deleteDiv.removeClass("class_hide");
	if(getMountSize(portIndex) > 0)
	{
		deleteDiv.find("img").attr("src", "images/minus_icon.gif");
		deleteDiv.find("p").text(M_lang["S_DEVICE_TEXT5"]);
	}
	else
	{
		deleteDiv.find("img").attr("src", "images/plus_icon.jpg");
		deleteDiv.find("p").text(M_lang["S_DEVICE_TEXT8"]);
	}
}

function updateDeviceInfo(portIndex)
{
	var object = status_data["device" + portIndex];
	var device_type = getDeviceType(object);

	makeDiv(portIndex);
	updateMountUmountButton(portIndex);

	$("#deviceIndex" + portIndex).text(object.slotnumber);
	$("#deviceStatus" + portIndex).text("(" + getDeviceTypeString(device_type) + getStatusString(object) + ")");

	$("#device" + portIndex).children("div").removeClass("class_hide");
	if(device_type === dinfo.service.MASS_STORAGE)
	{
		var size = getMountSize(portIndex), i = 0;
		while(i < size)
		{
			var idx = portIndex + "" + i;
			if(hasStorageInfo(object))
			{
				$("#mountName" + idx).text(getMountName(object, i));
				$("#sizeDesc" + idx).text(getSizeDesc(object, i));
				$("#storage_info_div" + idx).removeClass("class_hide");
			}
			else
			{
				$("#storage_info_div" + idx).addClass("class_hide");
			}
			$("#delete_div" + portIndex).removeClass("class_hide");
			++i;
		}
	}
	else {
		$("#delete_div" + portIndex).addClass("class_hide");
	}

	if(device_type === dinfo.service.PRINTER)
	{
		if(status_data["device" + portIndex].spoolusedpercent >= 0)
			$("#row" + portIndex + "_line2_left_p").text(M_lang["S_CUPS_SPOOLSIZE"] + " " + status_data["device" + portIndex].maxspoolsize + M_lang["S_MB"]
				+ "(" + status_data["device" + portIndex].spoolusedpercent + "% " + M_lang["S_CUPS_SPOOLUSED"] + ")");
		else
			$("#row" + portIndex + "_line2_left_p").text(M_lang["S_CUPS_SPOOLSIZE"] + "(" + M_lang["S_CUPS_FAILED"] + ")");
	}
}


function removeDeviceInfo(portIndex)
{
	$("#deviceIndex" + portIndex).text(portIndex);
	$("#deviceStatus" + portIndex).text("(" + M_lang["S_DEVICE_TEXT7"] + ")");
	$("#mountName" + portIndex).text();
	$("#sizeDesc" + portIndex).text();
	$("#delete_div" + portIndex).addClass("class_hide");
//	$("#device" + portIndex).children("div").addClass("class_hide");

	removeMountInfoDiv(portIndex);
}

//local utility functions
iux_update_local_func['main'] = function(identifier)
{
	if( !config_data || !status_data || identifier != "D")
		return;
	for(var portIndex = 1; portIndex <= 2; ++portIndex)
	{
		if( status_data["device" + portIndex] )
			updateDeviceInfo(portIndex);
		else
			removeDeviceInfo(portIndex);
	}
}

add_listener_local_func['main'] = function()
{
	$("#delete_div1").on("click", function()
	{
		submit_local("main", "1");
	});	
	$("#delete_div2").on("click", function()
	{
		submit_local("main", "2");
	});	
}

submit_local_func['main'] = function(portIndex)
{
        $('#loading').popup('open');

	var localdata = [];
	localdata.push({name : "devicename", value : status_data["device" + portIndex].name});

	if(getMountSize(portIndex) > 0)
	        return iux_submit('remove', localdata);
	else
	        return iux_submit('mount', localdata);
}

function checkUSBNumber()
{
	if(config_data.usbport == "1")
		$("#device2").remove();
}
//local utility functions end


$(document).ready(function() {
	window.tmenu = "nasconf";
	window.smenu = "basic";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();

	checkUSBNumber();
}

function result_config()
{
	iux_update('C');	
	iux_update_local();
}

function iux_set_onclick_local()
{
	listener_add_local('main');
}

function iux_update_local(identifier)
{
        for(var articleName in iux_update_local_func)
                iux_update_local_func[articleName].call(this, identifier);
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
        iux_update_local();
}

