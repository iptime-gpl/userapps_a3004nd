// JavaScript Document
var iux_update_local_func = [];
var submit_local_func = [];
var ctr_init_func = [];
var data_local=[];
var localpostdata = [];
var waninfo = ["dynamic","static","pppoe"];
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mtu =  /^[0-9]{1,4}$/;
var regExp_lcp =  /^[0-9]{1,3}$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
var regExp_kor = /^([가-힣]|[0-9a-zA-Z]|[_]){1,32}$/;
var regExp_text = /^([0-9a-zA-Z]|[_]){1,32}$/;

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "netinfo"; window.smenu = "laninfo";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	ctr_init();
	add_listener_local();
}

function result_config( result )
{
	$(".lc_row:visible:even .ui-checkbox label").css("background-color","#FFFFFF");
	$(".lc_row:visible:even .ui-radio label").css("background-color","#FFFFFF");
	$(".lc_row:visible:even").css("background-color","#FFFFFF");
	$(".lc_row:visible:odd .ui-checkbox label").css("background-color","#F9FAF5");
	$(".lc_row:visible:odd .ui-radio label").css("background-color","#F9FAF5");
	$(".lc_row:visible:odd").css("background-color","#F9FAF5");

	if( result && $('#loading_reboot').parent().hasClass("ui-popup-hidden"))
	{
		iux_update("C");
		ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
	}
}

function iux_update_local(id) 
{
	
	if(id == "D") {
			var statusmsg = status_data.dhcp.status;
			$('[sid="DHCP_STATUS"]').text(M_lang[statusmsg]);
	}
}

function ctr_init(actname)
{
	if(!actname)
	{
		//dhcp leasetime
		var leasetime = config_data.dhcpconf.leasetime;
		$("[sid='N_DHCPCONF_LEASETIME']").val(leasetime).selectmenu("refresh");
		if( $("[sid='N_DHCPCONF_LEASETIME']").prop("selectedIndex") === -1 )
			$("[sid='N_DHCPCONF_LEASETIME']").val('-').selectmenu("refresh");
		//ip range
		var iprange = config_data.dhcpconf.miprange;
		ctr_enable("C_DHCPCONF_SIP", iprange, true);
		ctr_enable("C_DHCPCONF_EIP", iprange, true);
		ctr_enable("S_BUTTON_SUBMIT", false);

		iux_set_onclick_local("addsearch");
		iux_set_onclick_local("addmanual");
		iux_set_onclick_local("dellease");
		iux_update("C");
	}
	switch (actname)
	{
	case "addsearch":
		get_mgraddrlist(actname);
		break;
	case "addmanual":
		var ip = config_data.lanconf.ip;
		var subnet = config_data.lanconf.netmask;
		var ipsubnet = config_data.lanconf.ipsubnet;
		$('[sid="N_ADDMANUAL_DESC"]').attr('placeholder',M_lang["S_ADDSEARCH_INPUT_DESC"]);
		
		//addmanual_insert_ipaddr("N_ADDMANUAL_IP",ipsubnet);
		insert_ipaddr("N_ADDMANUAL_IP",ip, subnet);

		get_mgraddrlist(actname);
		break;
	case "dellease":
		get_mgraddrlist(actname);
		break;
	}
}

function get_mgraddrlist(actname)
{
	$.ajaxSetup({ timeout: 5000  });
	$.getJSON('/cgi/iux_get.cgi', {
		tmenu : window.tmenu,
		smenu : window.smenu,
		act : "data"
	})
	.done(function(data)
	{
		if(json_validate(data, '') == true)
		{
			data_local = data;
			var targetlistname;
			var noitemmsg;
			
			if(actname == "addmanual")
				return;

			if(actname == "addsearch")
			{
				targetlistname = data_local.addlist;
				noitemmsg = M_lang["S_ADDSEARCH_NO_ITEM"];
			}
			else if(actname == "dellease")
			{
				targetlistname = data_local.dellease;
				noitemmsg = M_lang["S_REGADDR_NO_ITEM"];
			}

			$('[sid="N_ADDMGRLIST"]').find('li').remove();
			if(targetlistname.length > 1)
			{
				for(var i=0; i < targetlistname.length-1; i++)
				{
					var m_dynamic, m_connect_type, m_hostname;
					
					if(actname == "addsearch")
						if(targetlistname[i].dynamic == 1)
							m_dynamic = ":"+M_lang["S_DYNAMIC_ALLOC"]
						else
							m_dynamic = ":"+M_lang["S_STATIC_ALLOC"];
					else if(actname == "dellease")
						m_dynamic = "";
			

					m_connect_type = M_lang[targetlistname[i].connect_type];
					if(!targetlistname[i].hostname && targetlistname[i].hostname == "")
						m_hostname = '';		
					else
						m_hostname = ' / '+targetlistname[i].hostname;
					
					var checkid = 'check_'+i;
					$('[sid="N_ADDMGRLIST"]').append('<li sid="idx_'+i+'" class="addrmgr"><a href="#" onclick="checktest(\''+checkid+'\'); return false;" data-icon="false">'
					+ '<div class="title_row"><div class="title"><p>'+targetlistname[i].ipaddr+' ('+targetlistname[i].hwaddr+')</p></div>'
					+ '<div class="subtitle"><p>'+m_connect_type+m_dynamic+m_hostname+'</p></div></div>'
					+ '<div class="check_row ui-alt-icon"><input name="lease" sid="check_'+i+'" id="check_'+i+'" type="checkbox" value="'+targetlistname[i].ipaddr+'/'+targetlistname[i].hwaddr+ '/' + ((targetlistname[i].hostname)?targetlistname[i].hostname:'') + '">'
					+ '<label for="check_'+i+'"></label></div></a></li>');
				}
			}
			else
			{
				$('[sid="N_ADDMGRLIST"]').append('<li sid="idx_'+i+'" class="addrmgr"><a href="#aaa" data-icon="false">'
				+ '<div class="title_row"><div class="title"><p style="line-height: 3em;">'+noitemmsg+'</p></div>'
				+ '</div></a></li>');
			}
			$('[sid="N_ADDMGRLIST"]').listview( "refresh" );
			$('[sid="N_ADDMGRLIST"]').trigger('create');
			$('[sid=\"N_ADDMGRLIST\"] li').on('click',function(e){
				if(!e)	e = window.event;
				e.stopPropagation();	e.preventDefault();
			});
			$('[sid="N_ADDMGRLIST"] li>a').removeClass("ui-btn-icon-right");
			$('[sid="N_ADDMGRLIST"] li>a:even').css("background-color","#FFFFFF");
			$('[sid="N_ADDMGRLIST"] li>a:odd').css("background-color","#F9FAF5");
			$('[sid="N_ADDMGRLIST"] .ui-checkbox:even label').css("background-color","#FFFFFF");
			$('[sid="N_ADDMGRLIST"] .ui-checkbox:odd label').css("background-color","#F9FAF5");
		}
	})
}

function checktest(id)
{
	var checked = $('#'+id).is(':checked');

	if(checked)
		$('#'+id).removeAttr('checked').checkboxradio("refresh");
	else
		$('#'+id).prop('checked', 'checked').checkboxradio("refresh");	
}

function check_change_value_local()
{
	if( $("#right_panel").hasClass("ui-panel-open") )
		return false;

	if($('[sid="N_DHCPCONF_LEASETIME"]').val() != config_data.dhcpconf.leasetime)	
		return true;

	return false;
}

function add_listener_local(actname)
{

	if(actname == "addsearch" || actname == "dellease")
	{
	
		$('[sid="N_CHECKALL"]').change(function() {
			var m_checkall = $('[sid="N_CHECKALL"]:checked').val();
			if(m_checkall)
				$('[sid="N_ADDMGRLIST"] input').prop('checked', 'checked').checkboxradio("refresh");
			else
				$('[sid="N_ADDMGRLIST"] input').removeAttr('checked').checkboxradio("refresh");
		});
	}

	if(actname == "addsearch")
	{
			$('[sid="S_BUTTON_ADDSEARCH_SUBMIT"]').click(function()
			{
				var count = 0;
				$("[sid^='check_']").each(function()
				{
					if( $(this).is(':checked') )
						++count;

				});
				if(count > 0)
				{
					$("#loading").popup("open");
					iux_lease_submit(actname);
				}
				else
				{
						alert(M_lang["S_SUBMIT_NO_ITEM"]);
						return;
				}

			});
	}
	else if(actname == "dellease")
	{
			$('[sid="S_BUTTON_DEL_SUBMIT"]').click(function()
			{
				var count = 0;
				$("[sid^='check_']").each(function()
				{
					if( $(this).is(':checked') )
						++count;

				});
				if(count > 0)
				{
					$("#loading").popup("open");
					iux_lease_submit(actname);
				}
				else
				{
					alert(M_lang["S_SUBMIT_NO_ITEM"]);
					return;
				}
			});
	}
	else if(actname == "addmanual")
	{
		$('[sid="S_BUTTON_ADDMANUAL_SUBMIT"]').click(function() 
		{
			var ipaddr = convert_textfield_to_string('N_ADDMANUAL_IP');
			var macaddr = convert_textfield_to_string('N_ADDMANUAL_MAC');
			var desc = $('[sid="N_ADDMANUAL_DESC"]').val();

			//1. 빈칸이나 오류처리
			//2. 현재 등록되어있는지 체크
			if( ipaddr == "..." || check_input_error(ipaddr, regExp_ip) )
			{
				alert(M_lang["S_INVALID_ADDMANUAL_IPADDR"]);
				return;
			}
			if( macaddr == "..." || check_input_error(macaddr, regExp_mac) )
			{
				alert(M_lang["S_INVALID_ADDMANUAL_MACADDR"]);
				return;
			}
			//if( desc == "..." || check_input_error(desc, regExp_kor) )
			//{
			//	alert(M_lang["S_INVALID_ADDMANUAL_DESC"]);
			//	return;
			//}
			var targetlistname = data_local.dellease;
			if(targetlistname.length > 1)
			{
				for(var i=0; i < targetlistname.length-1; i++)
				{
					if( targetlistname[i].hwaddr == macaddr ||  targetlistname[i].ipaddr == ipaddr)	{
						alert(M_lang["S_INVALID_ACCESSLIST_REG_IP"]);
						$('#addmanual input:text').val("");
						ctr_init(actname);
						return;
					}
				}
			}
			//3. 데이터 패키징
			localpostdata = [];
			localpostdata.push({name : 'ipaddr', value : ipaddr });
			localpostdata.push({name : 'macaddr', value : macaddr });
			localpostdata.push({name : 'desc', value : desc });
			
			//4. 서브밋
			$("#loading").popup("open");
			iux_submit(actname, localpostdata);
		});
	}
	else
	{
		$('[sid="C_DHCPCONF_DHCPRUN"]').change(function()
		{
			var m_dhcprun = $('[sid="C_DHCPCONF_DHCPRUN"]:checked').val();
			var m_iprange = $('[sid="C_DHCPCONF_MIPRANGE"]:checked').val();
			
			ctr_enable("C_DHCPCONF_SIP",m_dhcprun, true);
			ctr_enable("C_DHCPCONF_EIP",m_dhcprun, true);
			ctr_enable("C_DHCPCONF_MIPRANGE",m_dhcprun);
			ctr_enable("N_DHCPCONF_LEASETIME",m_dhcprun);
			ctr_enable("C_DHCPCONF_DNSSUFFIX",m_dhcprun);
			ctr_enable("C_DHCPCONF_DHCPAUTODETECT",m_dhcprun);
			
			if(m_dhcprun && !m_iprange) {
				ctr_enable("C_DHCPCONF_SIP",m_iprange, true);
				ctr_enable("C_DHCPCONF_EIP",m_iprange, true);
			}
			ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
		});	

		$('[sid="C_DHCPCONF_MIPRANGE"]').change(function() {
			var m_iprange = $('[sid="C_DHCPCONF_MIPRANGE"]:checked').val();
			ctr_enable("C_DHCPCONF_SIP",m_iprange, true);
			ctr_enable("C_DHCPCONF_EIP",m_iprange, true);
			ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
		});

		$('[sid="N_DHCPCONF_LEASETIME"]').change(function() {
			ctr_enable("S_BUTTON_SUBMIT", check_change_value() );				
		});
	
		$('[sid="C_DHCPCONF_DNSSUFFIX"]').keyup(function() {
			ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
		});

		$('[sid="C_DHCPCONF_DHCPAUTODETECT"]').change(function() {
			ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
		});

		$('[sid="S_BUTTON_SUBMIT"]').click(function() {
			submit_local();
		});	

		///////////////////////////////////////////////////////////
		$('[sid="C_DHCPCONF_DHCPAUTODETECT"]').click(function() {
			var m_dhcpautodetect = $('[sid="C_DHCPCONF_DHCPAUTODETECT"]:checked').val() ? 1:0;
			localpostdata = [];
			localpostdata.push({name : 'directsubmit', value : "1" });
			localpostdata.push({name : 'dhcpautodetect', value : m_dhcpautodetect });
			submit();
		});
		$('[sid="C_DHCPCONF_MACRESTRICT"]').click(function() {
			var m_macrestrict = $('[sid="C_DHCPCONF_MACRESTRICT"]:checked').val() ? 1:0;
			localpostdata = [];
			localpostdata.push({name : 'directsubmit', value : "1" });
			localpostdata.push({name : 'macrestrict', value : m_macrestrict });
			submit();
		});	
		$('[sid="C_DHCPCONF_DHCPACCESSPOLICY"]').click(function() {
			var m_dhcpaccesspolicy = $('[sid="C_DHCPCONF_DHCPACCESSPOLICY"]:checked').val() ? 1:0;
			localpostdata = [];
			localpostdata.push({name : 'directsubmit', value : "1" });
			localpostdata.push({name : 'dhcpaccesspolicy', value : m_dhcpaccesspolicy });
			submit();
		});
		///////////////////////////////////////////////////////////
		listener_textgroup("C_LANCONF_IP");
		listener_textgroup("C_LANCONF_NETMASK");
		listener_textgroup("C_DHCPCONF_SIP");
		listener_textgroup("C_DHCPCONF_EIP");
	}
}
function readyforsubmit_ip()
{
	var current_ip = convert_textfield_to_string('C_LANCONF_IP');
	if( current_ip == "..." || check_input_error(current_ip, regExp_ip) )
	{
		alert(M_lang["S_INVALID_IPADDRESS_STRING"]);
		return false;
	}
	//wan1 기준 외부내트워크과 같은 서브넷일경우. 팅팅.
	var wan1subnet =  config_data.lanconf.wan1subnet;
	var s_wan1subnet = wan1subnet.split(".");
	var s_current_ip = current_ip.split(".");
	var netmaskArray = config_data.lanconf.netmask.split(".");
	for (var i = 0; i < 4; ++i)
	{
		if( s_wan1subnet[i] != ( s_current_ip[i] & netmaskArray[i] ) )
			return true;
	}
	alert(M_lang["S_INVALID_SAME_EXT_INT_NETWORK"]);
	return false;
}

function readyforsubmit_netmask()
{
	var current_netmask = convert_textfield_to_string('C_LANCONF_NETMASK');
	if( current_netmask == "..." || check_input_error(current_netmask, regExp_ip) )
	{
		alert(M_lang["S_INVALID_NETMASKADDRESS_STRING"]);
		return false;
	}
	return true;
}

function readyforsubmit_sip()
{
	var current_sip = convert_textfield_to_string('C_DHCPCONF_SIP');
	var m_iprange = $('[sid="C_DHCPCONF_MIPRANGE"]:checked').val();
	if( current_sip == "..." || check_input_error(current_sip, regExp_ip) )
	{
		if(m_iprange)
		{
			alert(M_lang["S_INVALID_IPRANGEADDRESS_STRING"]);
			return false;
		}
	}
	return true;
}

function readyforsubmit_eip()
{
	var current_eip = convert_textfield_to_string('C_DHCPCONF_EIP');
	var m_iprange = $('[sid="C_DHCPCONF_MIPRANGE"]:checked').val();
	if( current_eip == "..." || check_input_error(current_eip, regExp_ip) )
	{
		if(m_iprange)
		{
			alert(M_lang["S_INVALID_IPRANGEADDRESS_STRING"]);
			return false;
		}
	}
	return true;
}

function readyforsubmit_dnssuffix()
{
	
	var current_dnssuffix = $('[sid="C_DHCPCONF_DNSSUFFIX"]').val();
	if( check_input_error(current_dnssuffix, regExp_text) )
	{
		if(current_dnssuffix == "")
			return true;
		else
		{
			alert(M_lang["S_INVALID_DNSSUFFIX_STRING"]);
			return false;
		}
	}
	return true;
}

function readyforsubmit_leasetime()
{
	var m_dhcprun = $('[sid="C_DHCPCONF_DHCPRUN"]:checked').val();
	var current_leasetime = $('[sid="N_DHCPCONF_LEASETIME"]').val();

	if(m_dhcprun == '1'){
		if(current_leasetime == '-'){
			alert(M_lang['S_INVALID_LEASETIME_ALERT']);	return false;
		}
	}
	return true;
}

function readyforsubmit_checksamesubnet()
{
	var current_ip = convert_textfield_to_string('C_LANCONF_IP');
	var current_netmask = convert_textfield_to_string('C_LANCONF_NETMASK');
	var current_sip = convert_textfield_to_string('C_DHCPCONF_SIP');
	var current_eip = convert_textfield_to_string('C_DHCPCONF_EIP');
	
	var ipstr = current_ip.split('.');
	var maskstr = current_netmask.split('.');
	var sipstr = current_sip.split('.');
	var eipstr = current_eip.split('.');

	for(var i = 0; i < 4; i++){
		if( (parseInt(ipstr[i]) & parseInt(maskstr[i])) != (parseInt(sipstr[i]) & parseInt(maskstr[i])) ||
			(parseInt(ipstr[i]) & parseInt(maskstr[i])) != (parseInt(eipstr[i]) & parseInt(maskstr[i])) )
		{
			alert(M_lang["S_INVALID_NOT_SAME_NETWORK"]);
			return false;
		}
	}
	return true;
}

function checkreboot(ip, netmask)
{
	var configip = config_data.lanconf.ip;
	var confignetmask = config_data.lanconf.netmask;
	if(	(ip != configip) || (netmask != confignetmask) )
	{
		events.confirm({ msg: M_lang['S_REBOOT_ALERT_MSG'], runFunc: function( flag ) {
			if(flag)
			{
				localpostdata.push({name : 'reboot', value : '1' });
				iux_submit("apply", localpostdata, true);
				var remaining = config_data.rebootsec?(parseInt(config_data.rebootsec)) : 60;
				//iux_update("C");
				ctr_enable("S_BUTTON_SUBMIT", check_change_value() );
				reboot_timer(remaining);
				stopstatus = true;
				$('#loading_reboot').popup('open');
			}
		}});
	}
	else
		submit(true);
}

function confirm_result_local(flag)
{
}

function submit(allflag)
{
	$("#loading").popup("open");
	iux_submit("apply", localpostdata, allflag);
}

function result_submit(act, result)
{
	switch( act ) {
	case "addmanual" :
		$("#loading").popup("close");
		if( result )
		{
			alert(M_lang["S_SUBMIT_ADDMANUAL_SUCCESS"]);
			$('#addmanual input:text').val("");
			ctr_init( "addmanual" );
		}
		else {
			alert(M_lang["S_SUBMIT_ADDMANUAL_FAIL"]);
		}
		break;
	}
}

function submit_local()
{
	if( readyforsubmit_ip() && readyforsubmit_netmask() && readyforsubmit_sip() && readyforsubmit_eip() && readyforsubmit_dnssuffix() && readyforsubmit_leasetime() )
	{
		var m_iprange = $('[sid="C_DHCPCONF_MIPRANGE"]:checked').val();
		if(m_iprange)
			readyforsubmit_checksamesubnet();
		localpostdata = [];
		localpostdata.push({name : 'ip', value : convert_textfield_to_string('C_LANCONF_IP') });
		localpostdata.push({name : 'netmask', value :  convert_textfield_to_string('C_LANCONF_NETMASK') });
		localpostdata.push({name : 'sip', value : convert_textfield_to_string('C_DHCPCONF_SIP') });
		localpostdata.push({name : 'eip', value : convert_textfield_to_string('C_DHCPCONF_EIP') });
		checkreboot( convert_textfield_to_string('C_LANCONF_IP'), convert_textfield_to_string('C_LANCONF_NETMASK'));
	}
}

function listener_textgroup(sid)
{
	$('[sid="'+sid+'"] input').each(function()
	{
		$(this).attr('psid',sid);
		$(this).keyup(function() {
			var psid = $(this).attr('psid');
			var s_psid = psid.split("_");
			var config_ipvalue = eval("config_data."+s_psid[1].toLowerCase()+"."+s_psid[2].toLowerCase());
			var current_ipvalue = convert_textfield_to_string(psid);
			if(config_ipvalue == current_ipvalue)
			{
				if( check_change_value() )
					ctr_enable("S_BUTTON_SUBMIT", true );
				else
					ctr_enable("S_BUTTON_SUBMIT", false );
			}		
			else
			{
				if( check_change_value() )
					ctr_enable("S_BUTTON_SUBMIT", true );
				else
					ctr_enable("S_BUTTON_SUBMIT", true );
			}
		});
	});
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
function check_input_error(string, regExp)
{	
	if(!string || !string.match(regExp) )
		return true;
	return false;
}

function reboot_timer(remaining)
{
	if(remaining == 0){	
		$('#loading_reboot').popup('close');
		alert(M_lang["S_REBOOT_RESULT"]);
	}
	else{
		$('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
		remaining --;
		setTimeout("reboot_timer("+remaining+")",1000);
	}
}

function iux_set_onclick_local(actname)
{
	$('[sid="'+actname+'"]').on('click', function() {	load_rightpanel(actname); })
	.on("mousedown touchstart", function() {
		$(this).find("a").addClass("animation_blink")
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
					load_header(RIGHT_HEADER, actname);
					ctr_init(actname);
					iux_update("C");
					iux_update("S");
					add_listener_local(actname);
				}
		});
}


function insert_ipaddr(sid, ip, subnet)
{
	var s_ip = ip.split(".");
	var s_subnet = subnet.split(".");
	
	for(var i=0;i<4;i++)
	{
		if(s_subnet[i] == "255")
		{
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
			$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
		}
	}
}


function addmanual_insert_ipaddr(sid, ip)
{
	var s_ip = ip.split(".");
	for(var i=0;i<4;i++)
	{
		if(s_ip[i] == 0)
		{
			if(i != 3 )
			{
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
				$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
				break;
			}
			else
				break;
		}
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').val(s_ip[i]);
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').prop('readonly',true);
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').parent().addClass("ui-state-disabled");
		$('[sid="'+sid+'"] [sid="VALUE'+i+'"]').attr('disabled',true);
	}
}

function iux_lease_submit(service_name) 
{
	$.ajaxSetup({ async : false });
	var PostData = [];
	var result = false;
	PostData = $("#iux_lease_form").serializeArray();
	PostData.push({name : "tmenu", value : window.tmenu});
	PostData.push({name : "smenu", value : window.smenu});
	if(service_name)
		PostData.push({name : "service_name", value : service_name});

	$.post('/cgi/iux_set.cgi', PostData)
	.done(function(data)
	{
		if(data == 'fail'){ alert(M_lang['S_SUBMIT_FAIL_MSG']); result = false; }
		get_mgraddrlist(service_name);
		result = true;
	})
	.fail(function(jqxhr, textStatus, error)
	{
		alert("connection fail : " + service_name);	
		result = false;
	})
	.always(function()
	{	
		setTimeout(function() {
			$("#loading").popup("close");
			iux_lease_submit_result( service_name, result );
		}, 500);
	});
}

function iux_lease_submit_result( service_name, result )
{
	if( service_name === "addsearch")
	{
		if( result )
			alert(M_lang["S_SUBMIT_ADDSEARCH_SUCCESS"]);
		else
			alert(M_lang["S_SUBMIT_ADDSEARCH_FAIL"]);
	}
	else if( service_name === "dellease")
	{
		if( result )
			alert(M_lang["S_SUBMIT_DEL_SUCCESS"]);
		else 
			alert(M_lang["S_SUBMIT_DEL_FAIL"]);
	}
}
