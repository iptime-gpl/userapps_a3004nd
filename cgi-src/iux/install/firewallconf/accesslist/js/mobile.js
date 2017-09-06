// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var init_func = [];
var result_submit_func = [];
var listener_local_func=[];
var localpostdata = [];
var data_local = [];
var submit_local_func=[];
var submittype; // 0 or 1 or 2 0:use 1:add 2:del 
/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "firewallconf"; window.smenu = "accesslist";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu, null, 600000);
	events.on('load_header_ended_local', function(menuname){
		init(menuname);
		listener_local(menuname);
	});
});

function loadLocalPage()
{
	iux_set_onclick_local('extmgr');
	iux_set_onclick_local('intmgr');
	iux_set_onclick_local('csrf');
	iux_set_onclick_local('arpvirus');
	iux_set_onclick_local('etc');
	
	init();
	listener_local();
}

function result_config()
{
}

// function call  //
function init(actname) { actname ? init_func[actname].call() : init_func['remote'].call(); }
function listener_local(actname) { actname ? listener_local_func[actname].call() : listener_local_func['remote'].call(); }
function submit_local(actname) { submit_local_func[actname].call(); }
function result_submit(act, result) { result_submit_func[act].call(this, result); }
function confirm_result_local(flag)
{
	if(flag)
	{
		if(confirmactname == "")
			return;
		if(confirmactname == 'remote')
			$(location).attr('href','/sysconf/login/iux.cgi');

		else if(confirmactname == 'add_currentip_int')
		{
			localpostdata.push({name : 'add_current_ip', value : 1 });
			submit_local('intmgr');
		}
		else if(confirmactname == 'add_currentip_ext')
		{
			localpostdata.push({name : 'add_current_ip', value : 1 });
			submit_local('extmgr');
		}
		else if(confirmactname == 'romote_disconnect')
		{
			$("#loading").popup("open");
			iux_submit('remote');
		}
	}
	else
	{
		if(confirmactname == "")
			return;
		if(confirmactname == 'remote')
			$(location).attr('href','/sysconf/login/iux.cgi');

		else if(confirmactname == 'add_currentip_int')
		{
			init_func['intmgr'].call();
		}
		else if(confirmactname == 'add_currentip_ext')
		{
			init_func['extmgr'].call();
		}
		else if(confirmactname == 'romote_disconnect')
		{
			init_func['remote'].call();
		}

	}
	
}

init_func['remote'] = function()
{
	iux_update("C");

	ctr_enable('REMOTE_SUBMIT', check_change_value());

	var remoteflag = $('[sid="C_REMOTE_REMOTEFLAG"]:checked').val()?1:0;
	ctr_enable('C_REMOTE_REMOTEPORT',remoteflag);

	var ext_status = config_data.extmgr.run;
	if( ext_status == '1')
		$('[sid="EXTMGR_STATUS"] p').attr('sid', 'S_MAIN_STATUS_USE');
	else
		$('[sid="EXTMGR_STATUS"] p').attr('sid', 'S_MAIN_STATUS_DISUSE');

	var int_status = config_data.intmgr.run;
	if( int_status == '1')
		$('[sid="INTMGR_STATUS"] p').attr('sid', 'S_MAIN_STATUS_USE');
	else
		$('[sid="INTMGR_STATUS"] p').attr('sid', 'S_MAIN_STATUS_DISUSE');

	//arpvirus
	var arp_valid = config_data.arpvirus.valid;
	if(arp_valid == '1')
	{
		$('[sid="MAIN_ARPVIRUS"]').show();
		var arp_run = config_data.arpvirus.run;
		if( arp_run == '1')
			$('[sid="ARP_STATUS"] p').attr('sid', 'S_MAIN_STATUS_USE');
		else
			$('[sid="ARP_STATUS"] p').attr('sid', 'S_MAIN_STATUS_DISUSE');
	}
	else
	{
		$('[sid="MAIN_ARPVIRUS"]').hide();
	}
	var arp_period = config_data.arpvirus.period;
	var arp_ifname = config_data.arpvirus.ifname;
	var arp_network;
	arp_ifname == "0" ? arp_network = "유선네트워크" : arp_network = "유,무선네트워크" 	
	$('[sid="ARP_DESC_STATUS"]').text("초당 "+arp_period+'개의 ARP를 '+arp_network+'로 전송');


	//csrf
	var csrf_valid = config_data.csrf.valid;
	if(csrf_valid == '1')
	{
		$('[sid="MAIN_CSRF"]').show();
		var csrf_status = config_data.csrf.run;
			if( csrf_status == '1')
			$('[sid="CSRF_STATUS"] p').attr('sid', 'S_MAIN_STATUS_USE');
		else
			$('[sid="CSRF_STATUS"] p').attr('sid', 'S_MAIN_STATUS_DISUSE');
		var wd0 = config_data.csrf.whitedomain0;
		var wd1 = config_data.csrf.whitedomain1;
		var wd2 = config_data.csrf.whitedomain2;
		if(wd0 != "" ||wd1 != "" ||wd2 != "" )
			$('[sid="CSRF_WHITELIST_STATUS"] p').attr('sid', 'S_MAIN_CSRF_USE_WHITELIST');
		else
			$('[sid="CSRF_WHITELIST_STATUS"] p').attr('sid', 'S_MAIN_CSRF_EMPTY_WHITELIST');
	}
	else
		$('[sid="MAIN_CSRF"]').hide();

	iux_update("S");
};	




listener_local_func['remote'] = function()
{
	$('[sid="REMOTE_SUBMIT"]').click(function() 
	{ 
		var defaultadmin = config_data.remote.defaultadmin;
		if(defaultadmin == '1')
		{
			confirm(M_lang["S_EXTMGR_ERROR_DEFAULTADMIN"]);
			confirmactname = 'remote';
		}
		else
			submit_local('remote');
	});

	$('[sid="C_REMOTE_REMOTEFLAG"]').click(function() 
	{ 
		ctr_enable('REMOTE_SUBMIT', check_change_value());
		var remoteflag = $('[sid="C_REMOTE_REMOTEFLAG"]:checked').val()?1:0;
		ctr_enable('C_REMOTE_REMOTEPORT',remoteflag);
	});
	
	$('[sid="C_REMOTE_REMOTEPORT"]').keyup(function() {
		ctr_enable("REMOTE_SUBMIT", check_change_value() );
	});
};

submit_local_func['remote'] = function()
{
	if(!check_textfield_value('C_REMOTE_REMOTEPORT',regExp_port) )
		return;

	var sameband = config_data.ipinfo.sameband;
	var remoteflag = $('[sid="C_REMOTE_REMOTEFLAG"]:checked').val()?1:0;
	if(sameband == "0" && remoteflag == 0)
	{
		confirm(M_lang["S_REMOTE_DISCONNECT_EXTERNAL_PORT"],null,false);
		confirmactname = 'romote_disconnect';
		return;
	}
	$("#loading").popup("open");
	iux_submit('remote');
};

result_submit_func['remote'] = function(result)
{
	init_func['remote'].call();
};

init_func['extmgr'] = function()
{
	iux_update("C");
	
	get_accountlist('ACCESSLIST', 'extmgr');
	
	var extmgr_run = $('[sid="C_EXTMGR_RUN"]').val();
	ctr_enable('ADD_ACCESSIP',extmgr_run, true);
	ctr_enable('ADD_ACCESSDESC',extmgr_run);
	ctr_enable('ADD_SUBMIT',extmgr_run);

	$('[sid="CHECKALL"]').removeAttr('checked').checkboxradio("refresh");
	var extmgrlist = config_data.extmgr.list;
	if(extmgrlist.length <= 1)
		$('[sid="BUTTON_DEL_FEILD"]').hide();
	else
		$('[sid="BUTTON_DEL_FEILD"]').show();
	

	insert_ipaddr('ADD_ACCESSIP', null, null, true);
	$('[sid="ADD_ACCESSDESC"]').val("");

	iux_update("S");
};

listener_local_func['extmgr'] = function()
{
        sliderButtonEvent( { object : $('[sid="C_EXTMGR_RUN"]'), runFunc: function() 
	{ 
		submittype = 'run';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });


		var extmgr_run = $('[sid="C_EXTMGR_RUN"]').val();
		var extmgrlist = config_data.extmgr.list;
		var sameband = config_data.ipinfo.sameband;
		if(sameband == "0")
		{
			if(extmgr_run && extmgrlist.length <= 1)
			{
				confirm(M_lang["S_RIGHT_ERROR_NEED_ADD_CURRENTIP"],null,false);
				confirmactname = 'add_currentip_ext';
				return;
			}
		}
		submit_local('extmgr');
	}});

	$('[sid="ADD_SUBMIT"]').click(function() 
	{ 
		submittype = 'add';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });
		submit_local('extmgr');
		
	});
	//모두선택 버튼
	$('[sid="CHECKALL"]').change(function() {
	var m_checkall = $('[sid="CHECKALL"]:checked').val();
	if(m_checkall)
		$('[sid="ACCESSLIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="ACCESSLIST"] input').removeAttr('checked').checkboxradio("refresh");
	});

	$('[sid="DEL_SUBMIT"]').click(function() 
	{
		submittype = 'del';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count == 0)
		{
			alert(M_lang['S_RIGHT_ERROR_NO_ITEM']);
			return;
		}
		submit_local('extmgr');
	});
};

submit_local_func['extmgr'] = function()
{
	switch(submittype)
	{
		case 'run':
			var extmgr_run = $('[sid="C_EXTMGR_RUN"]').val();
			localpostdata.push({name : 'run', value : extmgr_run });
			$("#loading").popup("open");
			iux_submit('extmgr' , localpostdata); 
			break;
		case 'add':
			var inputip = convert_textfield_to_string('ADD_ACCESSIP');
			localpostdata.push({name : 'ip', value : inputip });

			//ip가 올바른지 조사
			if(!check_textfield_value('ADD_ACCESSIP',regExp_ip, inputip) )
				return;
			//설명이 올바른지 조사
			if(!check_textfield_value('ADD_ACCESSDESC',regExp_kor) )
				return;
			var extmgrlist = config_data.extmgr.list;
			//10개를 초과하였는지 조사
			if( (extmgrlist.length-1) == 10)
			{
				alert(M_lang['S_EXTMGR_ERROR_MAX_ACCESSIP']);
				return;
			}
			//아이피가 중복되었는지 조사
			if(extmgrlist.length > 1)
			{
				for(var i=0; i < extmgrlist.length-1; i++)
				{
					if( inputip == extmgrlist[i].ip)
					{
						alert(M_lang['S_EXTMGR_ERROR_SAME_ACCESSIP']);
						return;
					}
				}
			}		
			$("#loading").popup("open");
			iux_submit('extmgr' , localpostdata,true,null,'local_extmgr_form');
			break;
		case 'del':
			$("#loading").popup("open");
			iux_submit('extmgr' , localpostdata,true,null,'local_extmgr_form');
			break;
	}
};

result_submit_func['extmgr'] = function(result)
{
	if(!result)
	{
		switch(errorcode)
		{
			case 1:
				alert(M_lang['S_RIGHT_ERROR_CONNECTION_FAIL']);
				break;
			case 12:
				alert(M_lang['S_RIGHT_ERROR_NO_DEL_CURRENTIP_EXT']);
				break;
		}
	}
	init_func['remote'].call();
	init_func['extmgr'].call();
};

init_func['intmgr'] = function()
{ 
	iux_update("C");
	
	get_accountlist('ACCESSLIST', 'intmgr');
	
	var intmgr_run = $('[sid="C_INTMGR_RUN"]').val();
	ctr_enable('ADD_ACCESSIP',intmgr_run, true);
	ctr_enable('ADD_ACCESSDESC',intmgr_run);
	ctr_enable('ADD_SUBMIT',intmgr_run);

	$('[sid="CHECKALL"]').removeAttr('checked').checkboxradio("refresh");
	var intmgrlist = config_data.intmgr.list;
	if(intmgrlist.length <= 1)
		$('[sid="BUTTON_DEL_FEILD"]').hide();
	else
		$('[sid="BUTTON_DEL_FEILD"]').show();
	
	var netmask = config_data.ipinfo.netmask;
	var gateway = config_data.ipinfo.gateway;
	insert_ipaddr('ADD_ACCESSIP', gateway, netmask);
	$('[sid="ADD_ACCESSDESC"]').val("");	
	iux_update("S");
};

listener_local_func['intmgr'] = function()
{
        sliderButtonEvent( { object : $('[sid="C_INTMGR_RUN"]'), runFunc: function() 
	{ 
		submittype = 'run';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });
		
		var intmgr_run = $('[sid="C_INTMGR_RUN"]').val();
		var intmgrlist = config_data.intmgr.list;
		var sameband = config_data.ipinfo.sameband;
		if(sameband == "1")
		{
			if(intmgr_run && intmgrlist.length <= 1)
			{
				confirm(M_lang["S_RIGHT_ERROR_NEED_ADD_CURRENTIP"],null,false);
				confirmactname = 'add_currentip_int';
				return;
			}
		}
		submit_local('intmgr');	
	}});

	$('[sid="ADD_SUBMIT"]').click(function() 
	{ 
		submittype = 'add';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });
		submit_local('intmgr');
		
	});
	//모두선택 버튼
	$('[sid="CHECKALL"]').change(function() {
	var m_checkall = $('[sid="CHECKALL"]:checked').val();
	if(m_checkall)
		$('[sid="ACCESSLIST"] input').prop('checked', 'checked').checkboxradio("refresh");
	else
		$('[sid="ACCESSLIST"] input').removeAttr('checked').checkboxradio("refresh");
	});

	$('[sid="DEL_SUBMIT"]').click(function() 
	{
		submittype = 'del';
		localpostdata = [];
		localpostdata.push({name : 'act', value : submittype });
		
		var count = 0;
		$("[sid^='check_']").each(function()
		{
			if( $(this).is(':checked') )
				++count;

		});
		if(count == 0)
		{
			alert(M_lang['S_RIGHT_ERROR_NO_ITEM']);
			return;
		}

		submit_local('intmgr');
	});
};

submit_local_func['intmgr'] = function()
{
	switch(submittype)
	{
		case 'run':
			var intmgr_run = $('[sid="C_INTMGR_RUN"]').val();
			localpostdata.push({name : 'run', value : intmgr_run });
			$("#loading").popup("open");
			iux_submit('intmgr' , localpostdata); 
			break;
		case 'add':
			var inputip = convert_textfield_to_string('ADD_ACCESSIP');
			localpostdata.push({name : 'ip', value : inputip });

			//ip가 올바른지 조사
			if(!check_textfield_value('ADD_ACCESSIP',regExp_ip, inputip) )
				return;
			//설명이 올바른지 조사
			if(!check_textfield_value('ADD_ACCESSDESC',regExp_kor) )
				return;
			var intmgrlist = config_data.intmgr.list;
			//10개를 초과하였는지 조사
			if( (intmgrlist.length-1) == 10)
			{
				alert(M_lang['S_INTMGR_ERROR_MAX_ACCESSIP']);
				return;
			}
			//아이피가 중복되었는지 조사
			if(intmgrlist.length > 1)
			{
				for(var i=0; i < intmgrlist.length-1; i++)
				{
					if( inputip == intmgrlist[i].ip)
					{
						alert(M_lang['S_INTMGR_ERROR_SAME_ACCESSIP']);
						return;
					}
				}
			}		
			$("#loading").popup("open");
			iux_submit('intmgr' , localpostdata,true,null,'local_intmgr_form');
			break;
		case 'del':
			$("#loading").popup("open");
			iux_submit('intmgr' , localpostdata,true,null,'local_intmgr_form');
			break;
	}
};

result_submit_func['intmgr'] = function(result)
{
	if(!result)
	{
		switch(errorcode)
		{
			case 1:
				alert(M_lang['S_RIGHT_ERROR_CONNECTION_FAIL']);
				break;
			case 12:
				alert(M_lang['S_RIGHT_ERROR_NO_DEL_CURRENTIP_INT']);
				break;
		}
	}
	init_func['remote'].call();
	init_func['intmgr'].call();
};



init_func['csrf'] = function()
{
	iux_update("C");
	$('[sid="C_CSRF_WHITEDOMAIN0"]').attr('placeholder',M_lang["S_CSRF_WHITEDOMAIN"]);
	$('[sid="C_CSRF_WHITEDOMAIN1"]').attr('placeholder',M_lang["S_CSRF_WHITEDOMAIN"]);
	$('[sid="C_CSRF_WHITEDOMAIN2"]').attr('placeholder',M_lang["S_CSRF_WHITEDOMAIN"]);
	ctr_enable("CSRF_SUBMIT", check_change_value() );
	
	var runvalue = $('[sid="C_CSRF_RUN"]:checked').val();
	ctr_enable("C_CSRF_WHITEDOMAIN0",runvalue);
	ctr_enable("C_CSRF_WHITEDOMAIN1",runvalue);
	ctr_enable("C_CSRF_WHITEDOMAIN2",runvalue);
	
	iux_update("S");
};

listener_local_func['csrf'] = function()
{
	$('[sid="C_CSRF_RUN"]').change(function() {
		ctr_enable("CSRF_SUBMIT", check_change_value() );
		var runvalue = $('[sid="C_CSRF_RUN"]:checked').val();
		ctr_enable("C_CSRF_WHITEDOMAIN0",runvalue);
		ctr_enable("C_CSRF_WHITEDOMAIN1",runvalue);
		ctr_enable("C_CSRF_WHITEDOMAIN2",runvalue);
		
	});
	$('[sid="C_CSRF_WHITEDOMAIN0"]').keyup(function() {
		ctr_enable("CSRF_SUBMIT", check_change_value() );
	});
	$('[sid="C_CSRF_WHITEDOMAIN1"]').keyup(function() {
		ctr_enable("CSRF_SUBMIT", check_change_value() );
	});
	$('[sid="C_CSRF_WHITEDOMAIN2"]').keyup(function() {
		ctr_enable("CSRF_SUBMIT", check_change_value() );
	});
	$('[sid="CSRF_SUBMIT"]').click(function() {
		submit_local('csrf');
	});
};



submit_local_func['csrf'] = function()
{
	var whitedomain0 = $('[sid="C_CSRF_WHITEDOMAIN0"]').val();
	var whitedomain1 = $('[sid="C_CSRF_WHITEDOMAIN1"]').val();
	var whitedomain2 = $('[sid="C_CSRF_WHITEDOMAIN2"]').val();
	var runvalue = $('[sid="C_CSRF_RUN"]:checked').val();
	//오류검증

	//합치기
	var sendwhitedomain = "";
	if(whitedomain0 != "")
		sendwhitedomain = sendwhitedomain + whitedomain0 + ',';
	if(whitedomain1 != "")
		sendwhitedomain = sendwhitedomain + whitedomain1 + ',';
	if(whitedomain2 != "")
		sendwhitedomain = sendwhitedomain + whitedomain2 + ',';
	sendwhitedomain = sendwhitedomain.substring(0, sendwhitedomain.length-1);

	
	localpostdata = [];
	localpostdata.push({name : 'run', value : runvalue });
	localpostdata.push({name : 'whitedomain', value : sendwhitedomain });
	$("#loading").popup("open");
	iux_submit('csrf' , localpostdata);
};

result_submit_func['csrf'] = function(result)
{
	if(!result)
	{
		switch(errorcode)
		{
			case 1:
				alert(M_lang['S_RIGHT_ERROR_CONNECTION_FAIL']);
				break; 
		}
	}
	init_func['csrf'].call();
	init_func['remote'].call();
};

init_func['arpvirus'] = function()
{
	iux_update("C");
	
	var ifname = config_data.arpvirus.ifname;
	$("[sid='ARPVIRUS_IFNAME'] option").each(function() {
		var value = $(this).attr('value');
		if( value == ifname)
			$(this).attr('selected','selected');
	});
	$("[sid='ARPVIRUS_IFNAME']").selectmenu("refresh", true);
	
	var runvalue = config_data.arpvirus.run;
	ctr_enable('C_ARPVIRUS_PERIOD', runvalue);	
	ctr_enable('ARPVIRUS_IFNAME', runvalue);	
	ctr_enable("ARPVIRUS_SUBMIT", check_change_value() );
	
	iux_update("S");
};

listener_local_func['arpvirus'] = function()
{
	$('[sid="C_ARPVIRUS_RUN"]').change(function() {
		var runvalue = $('[sid="C_ARPVIRUS_RUN"]:checked').val();
		ctr_enable('C_ARPVIRUS_PERIOD', runvalue);	
		ctr_enable('ARPVIRUS_IFNAME', runvalue);	
		ctr_enable("ARPVIRUS_SUBMIT", check_change_value() );
	});
	$('[sid="ARPVIRUS_IFNAME"]').change(function() {
		var value = $("select[name=ifname]").val();
		if( check_change_value() || (value != config_data.arpvirus.ifname) )
			ctr_enable("ARPVIRUS_SUBMIT", true);
		else		
			ctr_enable("ARPVIRUS_SUBMIT", false);
	});
	$('[sid="C_ARPVIRUS_PERIOD"]').keyup(function() {
		ctr_enable("ARPVIRUS_SUBMIT", check_change_value() );
	});
	$('[sid="ARPVIRUS_SUBMIT"]').click(function() {
		submit_local('arpvirus');
	});
};

submit_local_func['arpvirus'] = function()
{
	var period = $('[sid="C_ARPVIRUS_PERIOD"]').val();

	if(!check_textfield_value('C_ARPVIRUS_PERIOD',regExp_arptime))
		return;

	$("#loading").popup("open");
	iux_submit('arpvirus' , null,null,null,'local_arpvirus_form');	
};

result_submit_func['arpvirus'] = function(result)
{
	if(!result)
	{
		switch(errorcode)
		{
			case 1:
				alert(M_lang['S_RIGHT_ERROR_CONNECTION_FAIL']);
				break; 
		}
	}
	init_func['etc'].call();
	init_func['remote'].call();
};


init_func['etc'] = function()
{
	iux_update("C");
	var $flipSwitch;
	var synfloodflag = config_data.etc.synflood;
	$flipSwitch = $('[sid="SYNFLOOD"]').val(synfloodflag);

	var smurfflag = config_data.etc.smurf;
	$flipSwitch = $('[sid="SMURF"]').val(smurfflag);

	var sourcerouteflag = config_data.etc.sourceroute;
	$flipSwitch = $('[sid="SOURCEROUTE"]').val(sourcerouteflag);

	var ipspoofflag = config_data.etc.ipspoof;
	$flipSwitch = $('[sid="IPSPOOF"]').val(ipspoofflag);

	var icmpblockflag = config_data.etc.icmpblock;
	$flipSwitch = $('[sid="ICMPBLOCK"]').val(icmpblockflag);

	var inticmpblockflag = config_data.etc.inticmpblock;
	$flipSwitch = $('[sid="INTICMPBLOCK"]').val(inticmpblockflag);
	iux_update("S");
};

listener_local_func['etc'] = function()
{	
        sliderButtonEvent( { object : $('[sid="SYNFLOOD"]'), runFunc: function() {
		var synfloodflag = $('[sid="SYNFLOOD"] option:selected').val();
		submit_local('etc');
	}});
        sliderButtonEvent( { object : $('[sid="SMURF"]'), runFunc: function() {
		var smurfflag = $('[sid="SMURF"] option:selected').val();
		submit_local('etc');
	}});
        sliderButtonEvent( { object : $('[sid="SOURCEROUTE"]'), runFunc: function() {
		var sourcerouteflag = $('[sid="SOURCEROUTE"] option:selected').val();
		submit_local('etc');
	}});
        sliderButtonEvent( { object : $('[sid="IPSPOOF"]'), runFunc: function() {
		var ipspoofflag = $('[sid="IPSPOOF"] option:selected').val();
		submit_local('etc');
	}});
        sliderButtonEvent( { object : $('[sid="ICMPBLOCK"]'), runFunc: function() {
		var icmpblockflag = $('[sid="ICMPBLOCK"] option:selected').val();
		submit_local('etc');
	}});
        sliderButtonEvent( { object : $('[sid="INTICMPBLOCK"]'), runFunc: function() {
		var inticmpblockflag = $('[sid="INTICMPBLOCK"] option:selected').val();
		submit_local('etc');
	}});
	/*
	$('[sid="C_ETC_SYNFLOOD"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	});
	$('[sid="C_ETC_SMURF"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	});
	$('[sid="C_ETC_SOURCEROUTE"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	});
	$('[sid="C_ETC_IPSPOOF"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	});
	$('[sid="C_ETC_ICMPBLOCK"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	});
	$('[sid="C_ETC_INTICMPBLOCK"]').change(function() {
		var testflag = $('[sid="SYNFLOOD"] option:selected').val();
		test_flip_button(testflag);
		submit_local('etc');
	submit_local('etc');
	});
	*/

};

submit_local_func['etc'] = function()
{
	$("#loading").popup("open");
	iux_submit('etc' , null,null,null,'local_etc_form');

};

result_submit_func['etc'] = function(result)
{
	if(!result)
	{
		switch(errorcode)
		{
			case 1:
				alert(M_lang['S_RIGHT_ERROR_CONNECTION_FAIL']);
				break; 
		}
	}
	init_func['etc'].call();
};



function insert_ipaddr(sid, ip, subnet, delflag)
{	
	var s_ip;
	var s_subnet;
	if(ip)
		s_ip = ip.split(".");
	if(subnet) 
		s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(!delflag)
		{
			if(s_subnet[i] == "255")
			{
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
			}
			else
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val("");
		}
		else
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val("");
	}
}

function get_accountlist(sid, actname)
{
	var accesslist = eval('config_data.'+actname+'.list');
	$('[sid="'+sid+'"]').find('li').remove();
	if(accesslist.length > 1)
	{
		for(var i=0; i < accesslist.length-1; i++)
		{
			$('[sid="'+sid+'"]').append('<li class="r_bottom_list"><div class="title"><p>'+accesslist[i].ip+'</p></div>'
			+ '<div class="content"><div class="descfield"><p>'+accesslist[i].desc+'</p></div><div class="checkbutton ui-alt-icon">'
			+ '<input name="del_ip"  sid="check_'+i+'" id="check_'+i+'" type="checkbox" value="'+accesslist[i].ip+'">'
			+ '<label for="check_'+i+'"></label></div></div></li>');
		}
		$('[sid="'+sid+'"] li:even').css("background-color","#FFFFFF");
		$('[sid="'+sid+'"] li:odd').css("background-color","#F9FAF5");
		$('[sid="'+sid+'"] li:even label').css("background-color","#FFFFFF");
		$('[sid="'+sid+'"] li:odd label').css("background-color","#F9FAF5");
		$('[sid="'+sid+'"]').trigger('create');
	}
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
		else {
			$(this).prop('readonly',true);
			$(this).parent().addClass("ui-state-disabled");
			$(this).attr('disabled',true);
		}
	});
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

function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function iux_update_local(id)
{ 
	//iux_update_local_func['init'].call();
}

function iux_set_onclick_local(actname)
{
	var Uactname = actname.toUpperCase();
	var Uactname = "MAIN_"+Uactname;
	$('[sid="'+Uactname+'"]').on('click', function() {	load_rightpanel(actname); })
	.on("mousedown touchstart", function() {
		$(this).addClass("animation_blink")
		.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
			$(this).removeClass("animation_blink");
		});
	});
}

function load_rightpanel(actname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
		$("#right_content").load('html/'+actname+'.html', function(responseTxt, statusTxt, xhr) {
				if (statusTxt == "success")
				{
					$(this).trigger('create');	
					//events.off('load_header_ended_local');
					//events.on('load_header_ended_local', function(menuname){
					//	init(menuname);
					//	listener_local(menuname);
					//});
					load_header(RIGHT_HEADER, actname);
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
