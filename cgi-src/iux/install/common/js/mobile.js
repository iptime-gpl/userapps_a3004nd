"use strict";
// JavaScript Document
// ================================Define===============================
var MAIN_HEADER = 0;
var SUBMAIN_HEADER = 1;
var LEFT_HEADER = 2;
var RIGHT_HEADER = 3;

var VAL_ID = 0;
var VAL_ARTICLE = 1;
var VAL_TAGNAME = 2;

//======================================================================
var article = [];
var config_data = null;
var status_data = null;
var firmware_sysinfo = null;

var regExp_kor = /^([가-힣]|[0-9a-zA-Z]|[_# \[\]]){1,32}$/;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,32}$/;
var regExp_map =  /^[0-9]{1,3}$/;
var regExp_arptime =  /^[0-9]{1,3}$/;
var regExp_time =  /^[0-9]{1,2}$/;
var regExp_port =  /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/;
var regExp_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var confirm_popup = false;
var rightpanelclose = true; 
var errorcode = 0;
var confirmactname;

var stopstatus = false;
var pagefirstload = true;

var connectfailalert = true;
var historyEvents;

var panelsync_opened = false;
//panel
var PanelEvent = (function()
{	
	var $panel, $dismissDiv, $leftPanel;
	function _init() {
		_cache();
		_bindEvents();
	}
	function _cache() {
		$panel = $("#right_panel");
		$dismissDiv = $("#right_panel_dismiss");
		$leftPanel = $("#left_panel");
	}
	function _bindEvents() {
		$panel.on( "swiperight", _tryClosePanel );
		$dismissDiv.on("click", _tryClosePanel );
		$(document).on("panelbeforeopen", "#right_panel", _show );
		$(document).on("panelbeforeclose", "#right_panel", _hide );
		$("#page").parent().on("swiperight", _openLeftPanelBySwipe );
	}
	function _tryClosePanel() {
		if( _shouldConfirmBeforeClose() )
			_confirmBeforeClose();
		else {
			if( history.state && history.state.page === 2 )
				history.go(-1);
			else
				$panel.panel("close");
		}
	}
	function _shouldConfirmBeforeClose() {
		return check_change_value( "#right_panel" ) && !confirm_popup;
	}
	function _confirmBeforeClose() {
		confirmactname = "";
		events.confirm({ msg: M_lang['S_POPUP_CLOSED_CONENT'], title: M_lang['S_POPUP_CLOSED_TITLE']});
	}
	function _hide()	{
		$("#right_panel_dismiss").hide();
	}
	function _show() {
		var maxSize = Math.max( window.innerWidth, document.body.clientWidth, window.innerHeight, document.body.clientHeight )
		$("#right_panel_dismiss").show().height( maxSize ).width( maxSize );
	}
	function _openLeftPanelBySwipe( event ) {
		if( event.swipestart.coords[0] > _getPageWidth() / 2 || $leftPanel.hasClass("ui-panel-open") || $panel.hasClass("ui-panel-open") || $(".ui-page-active .ui-popup-active").length > 0 )
			return;
		$leftPanel.panel("open");
	}
	function _getPageWidth() {
		return window.innerWidth || document.body.clientWidth;
	}
	return {
		init : _init,
		tryClose : _tryClosePanel
	}
})();

$(document).on("panelbeforeopen", "#left_panel", function () {
//	$('.ui-page').scrollTop(currentscroll);
	$('.ui-page').css("overflow","hidden");
	$('.ui-page').css("position","fixed");
	$('#left_panel').css("overflow","auto");
	$('#left_panel').css("position","fixed");
	$('#left_panel').scrollTop(0);
});
$(document).on("panelbeforeclose", "#left_panel", function () {
	$('.ui-page').css("overflow","auto");
	$('.ui-page').css("position","relative");
});

$(document).on("panelbeforeopen", "#right_panel", function () {
	events.emit("panelbeforeopen");
	panelsync_opened = true;
});

$(document).on("panelbeforeclose", "#right_panel", function () {
	$('.ui-page').css("overflow","auto").off('touchmove');
	panelsync_opened = false;
});

$(document).on("panelopen", "#right_panel", function() {
	makeFocusEvent();
});

$(document).on("panelclose", "#right_panel", function() {
	if(!panelsync_opened){
		$("#right_content").children().remove();
		$("#right_header p").text("");
	}
});

//$(document).on( "pagecreate", function() {
//	loadMenuHTML();
//});

function loadMenuHTML()
{
        var $header, $page, $body, $footer, $misc, $menu;
	$page = $("#page");
	loadHeader();
	loadBody();
	loadFooter();
	loadMisc();
	loadMenu();
	
	bindEvents();

	function bindEvents() {
		events.on("menu.load.header", getHeader );
	}
        function loadHeader() {
                $.get( "/common/html/header.html", function( responseTxt, statusTxt, xhr ) {
			if( statusTxt === "success" )
				$header = $( responseTxt );
			_loadComplete();
		});
        }
        function loadBody() {
                $.get( "html/main.html", function( responseTxt, statusTxt, xhr ) {
			if( statusTxt === "success" )
				$body = $( responseTxt );
			_loadComplete();
		});
        }
        function loadFooter() {
                $.get( "/common/html/footer.html", function( responseTxt, statusTxt, xhr ) {
			if( statusTxt === "success" )
				$footer = $( responseTxt );
			_loadComplete();
		});
        }
	function loadMisc()
	{
                $.get( "/common/html/misc.html", function( responseTxt, statusTxt, xhr ) {
			if( statusTxt === "success" )
				$misc = $( responseTxt );
			_loadComplete();
		});
	}
	function loadMenu()
	{
                $.get( "/common/html/menu.html", function( responseTxt, statusTxt, xhr ) {
			if( statusTxt === "success" )
				$menu = $( responseTxt );
			_loadComplete();
		});
	}
	function getHeader( data )
	{
		switch( data.theme ) {
		case MAIN_HEADER:
			$("#header").html( _headerFilter( MAIN_HEADER ) );
		break;
		case SUBMAIN_HEADER:
			$("#header").html( _headerFilter( SUBMAIN_HEADER ) );
		break;
		case LEFT_HEADER:
			$("#left_header").html( _headerFilter( LEFT_HEADER ) );
			$("#left_title_exit").click( function() {
				$("#left_panel").panel("close");
			});
		break;
		case RIGHT_HEADER:
			$("#right_header").html( _headerFilter( RIGHT_HEADER ) );
			$("#header_content_theme3 .SUBTITLE p").attr('sid',"S_" + data.article.toUpperCase() + "_TITLE");
			
			$("#right_title_exit").click(function() {
				PanelEvent.tryClose();
			});
			iux_update('S');
			events.emit('load_header_ended_local', data.article);
			historyEvents.go( "right_panel" );
		break;
		default:
		break;
		}
	}
	function _headerFilter( headerID )
	{
		return $header.filter(function(){ return $(this).attr("id") === "header_content_theme" + headerID;});
	}
	function getFooter( footerID )
	{
		return $footer.filter( function() { return $(this).attr("id") === footerID; } );
	}
	function get_menu_list()
	{
		$.ajaxSetup({async : true, timeout : 10000});
		var _data = [];
		_data.push({name : "tmenu", value : 'iux'});
		_data.push({name : "smenu", value : 'menulist'});
		$.getJSON('/cgi/iux_get.cgi',_data)
			.done( deleteInvalidMenu )
			.fail( deleteMenu );
	}
	function deleteInvalidMenu( data ) {
		for( var key in data )
			if( data[key] != "enabled" )
				delete data[key];
		for( var key in data )
			$("li[sid=" +  key + "]").val( "1" );
		var menuList = $("#menu li").filter( function( index) {
			return $(this).val() != "1";
		});
		$( menuList ).remove();
		$("#menu_content ul").filter( function() { return $(this).children("li").length === 0; }).remove();
	}
	function deleteMenu( jqxhr, textStatus, error ) {
		$("#menu li").remove();
	}
	function load_icon_clickevent()
	{
		$('[sid="SYSCONF_INFO"]').click(function(){location.href="/sysconf/info/iux.cgi";});

		$('[sid="NETINFO_WANINFO"]').click(function(){location.href="/netinfo/waninfo/iux.cgi";});
		$('[sid="NETINFO_LANINFO"]').click(function(){location.href="/netinfo/laninfo/iux.cgi";});

		$('[sid="WIRELESSCONF_BASICSETUP"]').click(function(){location.href="/wirelessconf/basicsetup/iux.cgi";});
		$('[sid="WIRELESSCONF_ADVANCESETUP"]').click(function(){location.href="/wirelessconf/advancesetup/iux.cgi";});
		$('[sid="WIRELESSCONF_MACAUTH"]').click(function(){location.href="/wirelessconf/macauth/iux.cgi";});

		$('[sid="NATROUTERCONF_PORTFORWARD"]').click(function(){location.href="/natrouterconf/portforward/iux.cgi";});
		$('[sid="NATROUTERCONF_MISC"]').click(function(){location.href="/natrouterconf/misc/iux.cgi";});
		$('[sid="NATROUTERCONF_ROUTER"]').click(function(){location.href="/natrouterconf/router/iux.cgi";});

		$('[sid="FIREWALLCONF_FIREWALL"]').click(function(){location.href="/firewallconf/firewall/iux.cgi";});
		$('[sid="FIREWALLCONF_ACCESSLIST"]').click(function(){location.href="/firewallconf/accesslist/iux.cgi";});

		$('[sid="EXPERTCONF_PPTPVPN"]').click(function(){location.href="/expertconf/pptpvpn/iux.cgi";});
		$('[sid="EXPERTCONF_DDNS"]').click(function(){location.href="/expertconf/ddns/iux.cgi";});
		$('[sid="EXPERTCONF_HOSTSCAN"]').click(function(){location.href="/expertconf/hostscan/iux.cgi";});
		$('[sid="EXPERTCONF_WOL"]').click(function(){location.href="/expertconf/wol/iux.cgi";});
		$('[sid="EXPERTCONF_ADVERTISE"]').click(function(){location.href="/expertconf/advertise/iux.cgi";});
		$('[sid="EXPERTCONF_IPTV"]').click(function(){location.href="/expertconf/iptv/iux.cgi";});

		$('[sid="TRAFFICCONF_CONNINFO"]').click(function(){location.href="/trafficconf/conninfo/iux.cgi";});
		$('[sid="TRAFFICCONF_CONNCTRL"]').click(function(){location.href="/trafficconf/connctrl/iux.cgi";});
		$('[sid="TRAFFICCONF_QOS"]').click(function(){location.href="/trafficconf/qos/iux.cgi";});
		$('[sid="TRAFFICCONF_LINKSETUP"]').click(function(){location.href="/trafficconf/linksetup/iux.cgi";});
		$('[sid="TRAFFICCONF_SWITCH"]').click(function(){location.href="/trafficconf/switch/iux.cgi";});

		$('[sid="SYSCONF_LOGIN"]').click(function(){location.href="/sysconf/login/iux.cgi";});
		$('[sid="SYSCONF_MISC"]').click(function(){location.href="/sysconf/misc/iux.cgi";});
		$('[sid="SYSCONF_SWUPGRADE"]').click(function(){location.href="/sysconf/swupgrade/iux.cgi";});
		$('[sid="SYSCONF_SYSLOG"]').click(function(){location.href="/sysconf/syslog/iux.cgi";});

		$('[sid="NASCONF_BASIC"]').click(function(){location.href="/nasconf/basic/iux.cgi";});
		$('[sid="BASICAPP_SERVICE"]').click(function(){location.href="/basicapp/service/iux.cgi";});


		$('[sid="LOGOUT"]').click(function(){location.href="/m_login.cgi?logout=1";});
		$('[sid="IUXPC"]').click(function(){window.open("/login/login.cgi?pclogin=1");});

		$("#menu_content, #footer_left_panel").on("mousedown touchstart", "li", function() {
			$(this).find("dl").addClass("animation_blink")
			.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
				$(this).removeClass("animation_blink");
			});
		});
	}
	function _loadComplete()
	{
		if( !$header || !$body || !$footer || !$misc || !$menu )
			return;

		$page.hide().html( $body ).append( $misc ).enhanceWithin();
		getHeader({theme: SUBMAIN_HEADER });
		$("#footer").html( getFooter( "footer_content" ) ).enhanceWithin();
		$("#left_footer").html( getFooter( "footer_left_panel" ) ).enhanceWithin();
		$("#menu").html( $menu );

		load_icon_clickevent();
		get_menu_list();
		events.emit("menu.load.complete");
	}
}

function load_header(_themenumber, _article_name){
	events.emit("menu.load.header", { theme: _themenumber, article: _article_name });
}

function make_M_lang(page_S_lang, page_D_lang)
{
	M_lang = [];
	M_lang = $.extend(CS_lang, CD_lang, T_lang, page_S_lang, page_D_lang);
}	

function makeBackButtonEvents()
{
	var direction;

	history.pushState({ page: 1 }, '');
	window.onpopstate = _historyHasChanged;

        function _historyHasChanged( event ) {
		var state = event.state;
		if( !state || !state.page ) {
			switch( direction ) {
			case undefined :
			case "needCheck" :
				direction = "needCheck";
				history.go(1);
				break;
			case "right_panel" :
				direction = "";
				history.go(1);
				break;
			case "" :
			case "backward" :
				direction = "backward";
				history.go(-1);
				break;
			}
			return;
		}
		if( state.page === 1 )
		{
			switch( direction ) {
			case "backward" :
				direction = "";
				if( !check_change_value() ) {
					history.go(-2);
					return;
				}
				setTimeout( function() {
					events.confirm({ msg: M_lang["S_ALERT_BEFOREMOVE"], runFunc: function( flag ) {
						if( flag )
							history.go( -2 );
					}});
				}, 0);
				break;
			case "right_panel" :
				direction = "backward";
				history.go(1);
				break;
			case "needCheck" :
				if( !check_change_value() ) {
					direction = "backward";
					history.go(-2);
					return;
				}
				setTimeout( function() {
					events.confirm({ msg: M_lang["S_ALERT_BEFOREMOVE"], runFunc: function( flag ) {
						if( flag ) {
							direction = "backward";
							history.go( -2 );
						}
					}});
				}, 0);
				break;
			default:
				$("#right_panel").panel("close");
				break;
			}
		} else if( state.page === 2 ) {
			if( direction !== "backward" )
				return;
			if( !check_change_value() ) {
				direction = "";
				history.go(-1);
				$("#right_panel").panel("close");
				return;
			}
			else
				direction = "right_panel";
			setTimeout( function() {
				events.confirm({ msg: M_lang["S_POPUP_CLOSED_CONENT"], runFunc: function( flag ) {
					if( flag )
						history.go( -2 );
				}});
			}, 0);
		}
        }
	function _go( menu ) {
		if( menu === "right_panel" && history.state.page !== 2 ) 
		{
			setTimeout( function() {
				direction = "right_panel";
				history.pushState({ page: 2 }, '');
			}, 0);
		}
	}
	return {
		go : _go

	}
}

function LoadingEvents() 
{
	events.on("panelbeforeopen", _loadingStart );
	events.on("config.update.first", _loadingEnd );
	events.on("config.update.fail", _loadingEnd );
	events.on("submit.always", _loadingEnd );
	events.on("load_header_ended_local", _loadingEndAfter );
	function _loadingStart() {
		$("#loading").popup("open");
	}
	function _loadingEnd() {
		$("#loading").popup("close");
	}
	function _loadingEndAfter() {
		setTimeout( function() {
			_loadingEnd();
		}, 500 );
	}
}
function iux_init(_tmenu, _smenu, _args, _retime, _use_local_status)
{
	historyEvents = makeBackButtonEvents();
	LoadingEvents();

	events.on( "menu.load.complete", function() {
		$('#page').trigger('resize');
		PanelEvent.init();
		makeFocusEvent();
		get_firminfo();
		get_config(_tmenu, _smenu, _args);
		get_status(_tmenu, _smenu, _args, _retime, _use_local_status);
	});
	loadMenuHTML();
}

function common_getconfig_result()
{
	if(pagefirstload){
		valid_update();
		default_setup();
		iux_update("S");

		if( window.loadLocalPage )
			loadLocalPage();
		pagefirstload = false;
		events.emit("config.update.first");
	}
}

function makeFocusEvent()
{
	function focusFilter()
	{
		return !$(this).prop("readonly") && !$(this).prop("disabled") && $(this).is(":visible");
	}

	function isDot( event )
	{
		var keyCode = event.keyCode || event.which;
		return keyCode == 110 || keyCode == 190;
	}
	function getValueIndex( object )
	{
		return object && object.attr("sid") && Number( object.attr("sid").replace(/[^0-9]/g,'') );
	}
	$('.ip [sid^=VALUE]').keydown(function(event) {
		if( isDot( event )) {
			event.preventDefault();
			var $input = $( focusTarget ).filter( focusFilter ),
				$next = $input.eq( $input.index(this) + 1);
			if( getValueIndex( $next ) > getValueIndex( $(this) ) )
			{
				$next.focus();
			}
		}
	}).keyup( function( event ) {
		var keyCode = event.keyCode || event.which;
		if( keyCode < 48 )
			return;
		if( $(this).val() === "" )
			$(this).val("");
		else {
			$(this).val( Number( $(this).val().replace(/[^0-9]/g, "").substr(0, $(this).val().length ) ));
		}
	});
	var focusTarget = ".ip input[sid^=VALUE], .mac input[sid^=VALUE]";
	$( focusTarget ).keyup( function( event ) {
		var keyCode = event.keyCode || event.which;
		if( ( keyCode > 46 || keyCode == 0 ) && !isDot( event ) && $(this).val().length >= $(this).attr('maxlength') )
		{
			$(this).val( $(this).val().substr(0, $(this).attr("maxlength")) );
			var $input = $( focusTarget ).filter( focusFilter ),
				$next = $input.eq( $input.index(this) + 1);
			if( getValueIndex( $next ) > getValueIndex( $(this) ) )
			{
				if( $(this).val() == "" )
					$(this).val("");
				$next.focus();
			}
		}
	}).keydown( function( event ) {
		var keyCode = event.keyCode || event.which;
		if( keyCode == 8 && $(this).val().length == 0 )
		{
			event.preventDefault();
			var $input = $( focusTarget ).filter( focusFilter ),
				$prev = $input.eq( $input.index(this) - 1 );
			if( getValueIndex( $prev ) < getValueIndex( $(this) ) )
				$prev.focus();
		}
	});
}

function json_validate(jsonObj,querystr)
{
	if(!jsonObj)	return true;

	for(var key in jsonObj){
		if(!key.match(/^[A-Za-z0-9_\-]{0,16}$/g))
			return false;
		if(json_validate(eval('jsonObj.'+querystr?querystr:key), querystr+'.'+key) == false)
			return false;
	}
	return true;
}

function get_firminfo() 
{
	$.ajaxSetup({async : true, timeout : 10000});
	var _data = [];
	_data.push({name : "tmenu", value : 'firmware'});
	_data.push({name : "smenu", value : 'sysinfo'});
	$.getJSON('/cgi/iux_get.cgi',_data)
	.done(function(data) {
		if(json_validate(data, '') == true)
		{
			firmware_sysinfo = data;
			if( firmware_sysinfo.canlogout !== "1" )
			{
				$("#logout").remove();
				$("#iuxpc dl").css({"width": "99%", "border-right": "0"});
			}
		}
	})
	.fail(function(jqxhr, textStatus, error) {
	})
	.always(function(){
		if(firmware_sysinfo != null){
			$('[sid=\"FOOTER_FIRMWARE_VERSION\"]').text('Ver '+firmware_sysinfo.firmversion);
			var iptext = '';
			//for(var idx = 0; idx < firmware_sysinfo.connectinfo.length; idx++){
				//var _tmp = firmware_sysinfo.connectinfo[idx];
				var _tmp = firmware_sysinfo.connectinfo[0];
				iptext += M_lang['S_STATUS_'+_tmp.wantype.toUpperCase()+'_IP']
				iptext += ' - ';
				iptext += M_lang['S_STATUS_'+_tmp.wantype.toUpperCase()+'_'+_tmp.wanstatus];
				iptext += ' - ';
				iptext += _tmp.ipaddr;
				$('[sid=\"FOOTER_IP_INFO\"]').text(iptext);
			//}
			var proname = firmware_sysinfo.productname;
			//if(proname && proname != '')
			//	proname = proname.toUpperCase();
			//else	proname = '';
			$('[sid=\"S_PRODUCT_CODE\"]').text(proname);
		}else{
			$('[sid=\"FOOTER_FIRMWARE_VERSION\"]').text('Ver');
		}
	});
}

function get_config(_tmenu, _smenu, _args) 
{
	if(window.result_config)
		$.ajaxSetup({async : true, timeout : 10000});	
	else
		$.ajaxSetup({ async : false });

	//$.ajaxSetup({ async : false });
	var _data = [];
	_data.push({name : "tmenu", value : eval("_tmenu")});
	_data.push({name : "smenu", value : eval("_smenu")});
	_data.push({name : "act", value : "config"});
	if(_args){
		_data.push(_args);
	}
	$.getJSON('/cgi/iux_get.cgi',_data)
	.done(function(data) {
		if(json_validate(data, '') == true)
			config_data = data;
		common_getconfig_result();
		$('#page').show();
		if(window.result_config)
			result_config(true);
		events.emit("config.update.done");
	})
	.fail(function(jqxhr, textStatus, error) {
		events.emit("config.update.fail");
		if(connectfailalert)
			alert(M_lang['S_DISCONNECTED_STRING']);
		//alert("get_config : " + textStatus);
	}).always(function(){
	});
}	

function get_status(_tmenu, _smenu, _args, _retime, _use_local_status)
{
	//stopstatus = false;
	if(_use_local_status)	return;
	$.ajaxSetup({async : true, timeout : 10000});
	var _data = [];
	_data.push({name : "tmenu", value : eval("_tmenu")});
	_data.push({name : "smenu", value : eval("_smenu")});
	_data.push({name : "act", value : "status"});
	if(_args){
		_data.push(_args);
	}
	$.getJSON('/cgi/iux_get.cgi', _data)
	.done(function(data) {
		if(json_validate(data, '') == true)
		{
			status_data = data;

			if(pagefirstload)
				valid_update();

			iux_update("D");
			events.emit("status.update.done");
		}
	})

	.fail(function(jqxhr, textStatus, error) {
		//console.log("get_status : " + textStatus);
	})
	.always(function()
	{
		if(stopstatus)
			return;
		//setTimeout("get_status('"+_tmenu+"', '"+_smenu+"')", 2000);
		setTimeout(function(_tm, _sm, _ar,_rt){
			get_status(_tm, _sm, _ar,_rt);
		},(_retime?_retime:1000), _tmenu, _smenu, _args,_retime);
	});
}

function default_setup()
{
	$("li>a").removeClass("ui-btn-icon-right");
	$(".icon").css("background-size","cover");
	$(".wrap_icon_content").css("cursor","pointer");
	$(".ui-page-header-fixed").css("padding-top","4.9em");
	$("li>a:even").css("background-color","#FFFFFF");
	$("li>a:odd").css("background-color","#F9FAF5");
	$("li:even").css("background-color","#FFFFFF");
	$("li:odd").css("background-color","#F9FAF5");
}


function valid_update() 
{
	$("li").each( function() 
	{
		var id = $(this).attr('id');
		if(!id)	return;
		var obj = config_data && config_data[id] || status_data && status_data[id];
		if ( id !="userlist" && !obj )
			$(this).remove();
	});
}

function iux_submit(service_name , localpostdata, flag, configOption, formid, retime) 
{
	if(window.result_submit)
		$.ajaxSetup({async : true, timeout : 30000});	
	else
		$.ajaxSetup({ async : false });
		
	
	var formidvalue;
	if(formid)
		formidvalue = formid;
	else
		formidvalue = 'iux_form';
	
	var PostData = [];
	var result = false;
	if(localpostdata && localpostdata[0].name == "updatedatadb") var update = true;
	if(flag)
		PostData = $("#"+formidvalue).serializeArray();
	if(localpostdata && localpostdata.length != 0 && !update)
    {
    	for(var i in localpostdata)
	   		PostData.push({name : localpostdata[i].name , value : localpostdata[i].value });
    }
	else
		PostData = $("#"+formidvalue).serializeArray();
	
	if(update)
		PostData.push({name : localpostdata[0].name , value : localpostdata[0].value });

	PostData.push({name : "tmenu", value : window.tmenu});
	PostData.push({name : "smenu", value : window.smenu});
	if(service_name)
		PostData.push({name : "service_name", value : service_name});

	$.post('/cgi/iux_set.cgi', PostData)
	.done(function(data)
	{
		result = true;
		if(connectfailalert)
			get_config(window.tmenu, window.smenu, configOption);
		
		errorcode = 0;
		var s_datavalue;
		var returnvalue = data.indexOf(':');
		if( returnvalue > 0 )
		{
			s_datavalue = data.split(':');
			if(s_datavalue[0] == 'fail')
			errorcode = Number(s_datavalue[1]);
			result = false;
		}
	
		if(data == 'fail')
		{
			alert(M_lang['S_SUBMIT_FAIL_MSG']);
			result = false; 
		}
	})
	.fail(function(jqxhr, textStatus, error)
	{
		result = false;
		alert("connection fail : " + service_name);	
	})
	.always(function()
	{	
		setTimeout(function() {
			events.emit("submit.always");
			if(window.result_submit)
				result_submit(service_name, result);
		}, (retime?retime:500));
	});
	return result;
}

function check_change_value(_prefix)
{
	var checkvalue, result;
	if( $("#right_panel").hasClass("ui-panel-open") )
		_prefix = "#right_panel";
	else
		_prefix = _prefix || "#content";
	$(_prefix + " [sid^='C_']," + _prefix + "[sid^='N_']").each(function()
	{
		var sid = $(this).attr("sid");	
		var s_sid = sid.split("_");
		var aObj = eval("config_data." + s_sid[VAL_ARTICLE].toLowerCase());
		if(aObj)
		{
			var value = eval("aObj." + s_sid[VAL_TAGNAME].toLowerCase());
	 			var type = $(this).attr("type");
			if( $(this).attr("disabled") != true &&
				$(this).attr("disabled") != "disabled" &&
				!( $(this).attr("readonly") ) &&
				$(this).attr("display") != "none" )
			{
				switch(type)
				{
				case "text":
				case "number" :
				case "password":
					if( $(this).val() != null && $(this).val() != value )
					{
						result = true;
						return false;
					}
					break;
				case "select":
				case "slider":
					if( $("option:selected", this).val() != value )
					{
						result = true;
						return false;
					}
					break;
				case "checkbox":
					checkvalue = $(this).is(":checked") ? checkvalue = 1 : checkvalue = 0 ;
					if(checkvalue != value )
					{
						result = true;
						return false;
					}
					break;
				case "radio":
					checkvalue = $('[name="' + $(this).attr('name') + '"]:checked').val();
					if(checkvalue != value ) 
					{
						result = true;
						return false;
					}
					break;
				}
				if($(this).hasClass('ip'))
				{
					var iparr = value.split('.');
					if(value == ''){iparr = ['','','',''];}
					$('[sid=\"'+$(this).attr('sid')+'\"] [sid^=VALUE]').each(function(){
						var indexnum = $(this).attr('sid').replace(/[^0-9]/g,'');
						if(iparr[indexnum] != $(this).val())
						{
							result = true;
							return false;
						}
					});
				}
			}
		}
	});
	if( !result && window.check_change_value_local )
		result = check_change_value_local();
	return result;
}
/*
$( document ).on("swipeleft swiperight", "#page", function( e ) {
  console.log('swiped!!')
    // We check if there is no open panel on the page because otherwise
    // a swipe to close the left panel would also open the right panel (and v.v.).
    // We do this by checking the data that the framework stores on the page element (panel: open).
    if ($.mobile.activePage.jqmData( "panel" ) !== "open") {
      if ( e.type === "swipeleft"  ) {
        $( "#right_panel" ).panel( "open" );
      } else if ( e.type === "swiperight" ) {
        $( "#left_panel" ).panel( "open" );
      }
    }
    else if ($.mobile.activePage.jqmData( "panel" ) == "open"){
      $( "#left_panel" ).panel( "close" );
      $( "#right_panel" ).panel( "close" );
    }
  });
*/

//popup func
function alert(msg, _title)
{
	var title;

	if(!_title)
		title = M_lang['S_POPUP_TITLE_NOTI'];
	else
		title = _title;
	$('[sid="ALERT_TITLE_TEXT"]').text(title);
	$('[sid="ALERT_CONTENT_TEXT"]').html(parsing_msg_to_code(msg));
	$('#alert_popup').popup('open');
}

function alert_close()
{
	$('#alert_popup').popup('close');
}

function parsing_msg_to_code(msg)
{
	if(!msg)	return '';

	var parsed_text = '';
	var arr = msg.split('\n');
	if(arr.length == 1)	return msg;
	for(var i = 0; i < arr.length; i++){
		parsed_text += ('<p>'+arr[i]+'</p>');
	}
	return parsed_text;
}

function confirm(msg, title, _rightpanelflag)
{	
	rightpanelclose = true;
	if(_rightpanelflag == false)
		rightpanelclose = _rightpanelflag;

	if(!title) $('[sid="CONFIRM_TITLE_TEXT"]').text(M_lang['S_POPUP_CLOSED_TITLE_DEFAULT']);
	else $('[sid="CONFIRM_TITLE_TEXT"]').text(title);
	$('[sid="CONFIRM_CONTENT_TEXT"]').html(parsing_msg_to_code(msg));
	$('#confirm_popup').popup('open');
}

function confirm_close(flag)
{
	$("#confirm_popup").popup("close");
	
	events.emit("confirm", flag );
	if(window.confirm_result_local)
		confirm_result_local(flag);
	if(flag)
	{
		confirm_popup = true;
		if(rightpanelclose)
		{
			$( "#right_panel" ).panel("close");
		}
	}
	
	confirm_popup = false;
}

function listpopup_close()
{
	$("#list_popup").popup("close");
}

function sliderButtonEvent( object )
{
        var eventTarget, value, $slider, $target, $body;

	_cache();
	_bindEvents();
	_refresh();

	function _cache() {
		$target = object.sid && $("[sid=" + object.sid + "]") || object.id && $("#" + object.id ) || object.object;
		$slider = $target.next();
		$body = $("body");
		value = $target.val();
	}
	function _bindEvents() {
		$slider.on( "touchstart mousedown", _sliderMouseDown ).on("touchend mouseup", _sliderMouseUp );
		$(document).on("touchend mouseup", _documentMouseUp );
		$target.change( _changeColor );
		events.on( "iux_update.C", _update );
	}
	function _update() {
		if( !$body[0].contains( $target[0] ) )
			return;
		value = $target.val();
		_refresh();
	}
        function _isInBoundary( $object ) {
                return $slider[0].contains( $object[0] );
        }
	function _clear( event ) {
		if( event )
			$(document).unbind( event );
		$target = null;
		$slider = null;
		events.off( "iux_update.C", _update );
	}
	function _sliderMouseDown( event ) {
                eventTarget = event.currentTarget;
	}
	function _sliderMouseUp( event ) {
                if( $slider[0] === eventTarget && $target.val() != value )
                {
                        object.runFunc.apply($target, object.arguments );
			value = $target.val();
			_refresh();
                }
                eventTarget = null;
	}
	function _documentMouseUp( event ) {
		if( !$target || !$body[0].contains( $target[0] ) )
		{
			_clear( event );
			return;
		}
                else if( $target.val() != value ) {
                        if( eventTarget && _isInBoundary( event.target ) )
			{
                                object.runFunc.apply($target, object.arguments );
				value = $target.val();
			}
                        else {
                                $target.val( value );
			}
			_refresh();
                }
                eventTarget = null;
	}
	function _refresh() {
		$target.slider("refresh");
		_changeColor();
	}
	function _changeColor() {
		var flag;
		if( $target.val() === "on" )
			flag = true;
		else if( $target.val() === "off" )
			flag = false;
		else{
			var $selobj = $target.find('option:selected');
			if(($selobj.val() == '0' && $selobj.text() == 'On') || ($selobj.val() == '1' && $selobj.text() == 'Off'))
				flag = !Number( $target.val() );
			else
				flag = !!Number( $target.val() );
		}
		if( flag )
		{
			$slider.children('div').children().css('background-color','#8DAF25', '!important');
			$slider.children('span').css('color','#000000', '!important');

		}
		else
		{	
			$slider.children('div').children().css('background-color','#DDDDDD', '!important');
			$slider.children('span').css('color','#DDDDDD', '!important');
		}
	}
        return object.sid || object.id || object.object;
}

/*
플랫폼 구분하는 함수(일단보관)
testdevice(){
	var filter = "win16|win32|win64|mac|macintel";
	console.log(navigator.platform);
    if( navigator.platform  ){
        if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
            return true;
        }else{
            return false;
        }
    }
}
*/

/*
Swipe panel Code
$( document ).on( "pageinit", "body", function() {
    $( document ).on( "swipeleft swiperight", "body", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft"  ) {
				return;
                //$( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#left_panel" ).panel( "open" );
            }
        }
    });
});
*/

function HighlightObject()
{
	var $contents, $page, $header, $body, $target, $rightPanel, $dismissDiv;
	_cacheDOM();
	_init();

	function _cacheDOM() {
		$contents = $("<div>").attr("id", "blind_div").hide();
		$page = $("#page");
		$header = $("#header");
		$body = $("body");
		$rightPanel = $("#right_panel");
		$dismissDiv = $("#right_panel_dismiss");
	}
	function _init() {
		$body.append( $contents );

		$(document).on("panelbeforeclose", "#right_panel", _close );
	}
	function _resize() {
		var height = Math.max( $body.height(), $page.height() ) + $header.outerHeight(), width = Math.max( $body.width(), $page.width() );
		$contents.height( height ).width( width );
	}
	function _open(target) {
		(typeof target === "string")? $target = $("#" + target) : $target = target;
		_resize();
		_animate();
	}
	function _close() {
		if( $target )
			$contents.fadeOut("fast", _reset );
	}
	function _animate() {
		$rightPanel.css( "z-index", "1002" );
		$target.css({
			"position" : "relative",
			"z-index": "999"
		});
		$dismissDiv.css( "z-index", "1001" );
		$contents.fadeIn("fast");
	}
	function _reset() {
		$target.css( {
			"position" : "inherit",
			"z-index" : "inherit"
		});
		$target = null;
	}
	function _highlight( object ) {
		if( object )
			_open( object );
		else
			_close();
	}
	return _highlight;
}

var events = (function() {
	var eventsList = {};
	function _on( eventName, callbackFunc ) {
		eventsList[ eventName ] = eventsList[ eventName ] || [];
		if(callbackFunc)
			eventsList[ eventName ].push( callbackFunc );
		return this;
	}
	function _off( eventName, callbackFunc ) {
		var eventList = eventsList[ eventName ];
		if( !eventList )
			return;
		if( !callbackFunc )
			eventList.length =  0;
		for( var i = 0; i < eventList.length; ++i ) {
			if( eventList[i] === callbackFunc ) {
				eventList.splice(i, 1);
				break;
			}
		}
		return this;
	}
	function _emit( eventName, data ) {
		if( !eventsList[eventName]) 
			return;
		var tmp_array = [], length = eventsList[eventName].length, i;
		for( i = 0; i < length; ++i )
			tmp_array.push( eventsList[eventName][i] );
		for( i = 0; i < length; ++i )
			tmp_array[i]( data );
		return this;
	}
	function _confirm( object ) {
		if( !object.msg )
			return;
		eventsList[ "confirm" ] = [];
		_on( "confirm", object.runFunc );
		confirm( object.msg, object.title, object.panelFlag );
		return this;
	}
	return {
		on : _on,
		off : _off,
		emit : _emit,
		confirm : _confirm
	}
})();
