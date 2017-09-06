//local-global variables
var iux_update_local_func = [];
var result_submit_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

//local-global variables end

//local utility functions
function convertString( string )
{
	var str = "", tmpStr, strArray = string.split(".");
	for(var index in strArray) {
		if( !strArray[index] )
			continue;
		if( str.length > 0 )
			str += " - ";
		tmpStr = M_lang[strArray[index].toUpperCase()];
		if( tmpStr )
			str += tmpStr;
		else 
			str += index;
	}
	return str;
}

function convertTimeToString( time )
{
	var tmp, str = "";
	tmp = time / 86400;
	if( tmp > 1 )
	{
		str += Math.floor( tmp ) + M_lang["S_DD"] + " ";
	}
	tmp = ( time % 86400 ) / 3600;
	str += Math.floor( tmp ) + M_lang["S_hh"] + " ";
	tmp = ( time % 3600 ) / 60;
	str += Math.floor( tmp ) + M_lang["S_mm"] + " ";
	tmp = time % 60;
	str += Math.floor( tmp ) + M_lang["S_ss"];

	return str;
}

function toggleImage( img, state )
{
	if( state ) {
		img.attr( "src", "images/menu_list_opened.png" );
	} else {
		img.attr( "src", "images/menu_list_closed.png" );
	}
	
}

function convertPassword( str )
{
	var length = str.length;
	str = "";
	for(var i = 0; i < length; ++i)
		str += "*";
	return str;
}

//local utility functions end
iux_update_local_func['w1external'] = function( identifier )
{
	var $menu, $state, $info, $ip, $time, $lease, $port;
	_init();
	function _init() {
		_cache();
		_bindEvents();
	}
	function _cache() {
		$menu = $("#external").hide();
		$state = $menu.find("#external_state");
		$info = $menu.find("#external_info");
		$ip = $menu.find("#external_ip");
		$time = $menu.find("#external_time");
		$lease = $menu.find("#external_lease");
		$port = $menu.find("#external_portrole");
	}
	function _setLink( event ) {
		event.stopPropagation();
		location.href = "/netinfo/waninfo/iux.cgi";
	}
	function _bindEvents() {
		$menu.find(".title_icon_div img, .title_left_div .link_desc_div").click( _setLink );
	}
	function _update() {
		var data = status_data.w1external;
		$state.text( convertString( data.state ) );
		$info.text( convertString( "D_" + data.info ) );
		$ip.text( data.extip );
		$time.text( convertTimeToString( data.time ) );
		if( $lease ) {
			if( data.leasetime > -1) {
				$lease.text( M_lang["S_MENU1_TEXT7"] + data.leasetime + M_lang["S_ss"] );
			} else {
				$lease.closest(".row_div").remove();
				$lease = null;
			}
		}
		if( $port ) {
			if( data.portrole ) {
				$port.text( convertString( data.portrole ) + M_lang["S_MENU1_TEXT6"] );
			} else {
				$port.closest(".row_div").remove();
				$port = null;
			}
		}
		$menu.show();
	}
	return _update;
};

iux_update_local_func['internal'] = function( identifier )
{
	var $menu, $ip, $dhcp, $iprange;
	_init();
        function _init() {
                _cache();
                _bindEvents();
        }
	function _cache() {
		$menu = $("#internal").hide();
		$ip = $menu.find("#internal_ip");
		$dhcp = $menu.find("#internal_dhcp");
		$iprange = $menu.find("#internal_iprange");
	}
	function _setLink( event ) {
		event.stopPropagation();
		location.href = "/netinfo/laninfo/iux.cgi";
	}
        function _bindEvents() {
                $menu.find(".title_icon_div img, .title_left_div .link_desc_div").click( _setLink );
        }
	function _update() {
		var data = status_data.internal;
		$ip.text( data.ip + M_lang["S_MENU2_TEXT3"] );
		$dhcp.text( convertString (data.dhcp ) );
		$iprange.text( data.sip + " - " + data.eip );
		$menu.show();
	}
	return _update;
};

iux_update_local_func['iighz'] = function( identifier )
{
	var $menu, $ssid, $mode, $password, $pwLine, $checkbox;
	_init();
	function _init() {
		_cache();
		_bindEvents();
	}
	function _cache() {
		$menu = $("#iighz").hide();
		$ssid = $menu.find("#iighz_ssid");
		$mode = $menu.find("#iighz_mode");
		$password = $menu.find("#iighz_password");
		$pwLine = $password.closest(".row_div");
		$checkbox = $menu.find("#iighz_checkbox");
	}
        function _setLink( event ) {
		event.stopPropagation();
                location.href = "/wirelessconf/basicsetup/iux.cgi?mode=2g";
        }
	function _bindEvents() {
		$checkbox.click( _update );
                $menu.find(".title_icon_div img, .title_left_div .link_desc_div").click( _setLink );
	}
	function _getPassword( data ) {
		if( data.length == 0 )
			$checkbox.parent().hide();
		else
		{
			$checkbox.parent().show();
			if( $checkbox.prop("checked") )
				return data.wpapsk;
			else
				return convertPassword( data.wpapsk );
		}
	}
	function _setPassword( data ) {
		if( data.mode.indexOf("D_SYSTEM_INFO_WIRELESS_ENC_DISABLE") >= 0 )
			$password.closest(".row_div").hide();
		else {
			$password.closest(".row_div").show();
			$password.text( _getPassword( data ) );
			if($password.text().length > 0)
				$pwLine.show();
			else
				$pwLine.hide();
		}
	}
	function _update() {
		var data = status_data.iighz,
			ssidText = data.ssid + M_lang["S_MENU3_TEXT3"];
		if( data.mode.indexOf("D_STARTED_STATUS") < 0 )
			ssidText += "(OFF)";
		$ssid.text( ssidText );
		$mode.text( convertString( data.mode ) );
		_setPassword( data );
		$menu.show();
	}
	return _update;
};

iux_update_local_func['vghz'] = function( identifier )
{
	var $menu, $ssid, $mode, $password, $pwLine, $checkbox;
	_init();
	function _init() {
		_cache();
		_bindEvents();
	}
	function _cache() {
		$menu = $("#vghz").hide();
		$ssid = $menu.find("#vghz_ssid");
		$mode = $menu.find("#vghz_mode");
		$password = $menu.find("#vghz_password");
		$pwLine = $password.closest(".row_div");
		$checkbox = $menu.find("#vghz_checkbox");
	}
        function _setLink( event ) {
		event.stopPropagation();
                location.href = "/wirelessconf/basicsetup/iux.cgi?mode=5g";
        }
	function _bindEvents() {
		$checkbox.click( _update );
                $menu.find(".title_icon_div img, .title_left_div .link_desc_div").click( _setLink );
	}
	function _getPassword( data ) {
		if( data.length == 0 )
			$checkbox.parent().hide();
		else
		{
			$checkbox.parent().show();
			if( $checkbox.prop("checked") )
				return data.wpapsk;
			else
				return convertPassword( data.wpapsk );
		}
	}
	function _setPassword( data ) {
		if( data.mode.indexOf("D_SYSTEM_INFO_WIRELESS_ENC_DISABLE") >= 0 )
			$password.closest(".row_div").hide();
		else {
			$password.closest(".row_div").show();
			$password.text( _getPassword( data ) );
			if($password.text().length > 0)
				$pwLine.show();
			else
				$pwLine.hide();
		}
	}
	function _update() {
		var data = status_data.vghz,
			ssidText = data.ssid + M_lang["S_MENU3_TEXT3"];
		if( data.mode.indexOf("D_STARTED_STATUS") < 0 )
			ssidText += "(OFF)";
		$ssid.text( ssidText );
		$mode.text( convertString( data.mode ) );
		_setPassword( data );
		$menu.show();
	}
	return _update;
};

iux_update_local_func['extra'] = function( identifier )
{
	var $menu, $version, $remote, $time, $remoteLinkRow;
	_init();
	function _init() {
		_cache();
		_bindEvents();
	}
	function _cache() {
		$menu = $("#extra").hide();
		$version = $menu.find("#extra_version");
		$remote = $menu.find("#extra_remote");
		$time = $menu.find("#extra_time");

		$remoteLinkRow = $menu.find("#remote_desc_row");
	}
	function _setRemoteRow() {
		var data = status_data.extra;
		if( data.remoteflag.indexOf( "D_REMOTEMGMT_STOP_COMMENT" ) >= 0 )
			$remote.text( convertString (data.remoteflag ) );
		else
			$remote.text( data.remoteport + convertString (data.remoteflag ) );
	}
	function _setFirmwareLink( event ) {
		location.href = "/sysconf/swupgrade/iux.cgi";
	}
	function _setFirewallLink( event ) {
		location.href = "/firewallconf/accesslist/iux.cgi";
	}
	function _bindEvents() {
		$menu.find("#extra_firmware_link").on("click", _setFirmwareLink );
		$remoteLinkRow.children(".right_div").on("click", _setFirewallLink );
	}
	function _update() {
		var data = status_data.extra;
		$version.text( data.version );
		$time.text( convertTimeToString( data.time ) );
		_setRemoteRow();
		$menu.show();
	}
	return _update;
};

$(document).ready(function() {
	$("#page").hide();
	window.tmenu = "sysconf";
	window.smenu = "info";
	
	make_M_lang(S_lang, D_lang);

	events.on( "status.update.done", initMenuInfo );
	events.on( "status.update.done", updateMenuInfo );
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
}

function result_config( )
{
}

function iux_set_onclick_local()
{
	$("#maincontent").on("click", ".title_div", function()
	{
		$(this).siblings().toggleClass( "hide" ).toggleClass( "show" );
		toggleImage( $(this).find("img[name='title_state']"), $(this).siblings().eq(0).hasClass("show") );
	});
}

function initMenuInfo()
{
	events.off( "status.update.done", initMenuInfo );
	for(var articleName in iux_update_local_func )
	{
		if( articleName )
			iux_update_local_func[articleName] = iux_update_local_func[articleName]();
	}
	iux_set_onclick_local();

	$("#page").show();
}

function updateMenuInfo()
{
	for(var articleName in status_data )
	{
		if( articleName )
			iux_update_local_func[articleName]();
	}
}

function iux_update_local(identifier)
{
}

function submit_local(service_name, localdata)
{
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

