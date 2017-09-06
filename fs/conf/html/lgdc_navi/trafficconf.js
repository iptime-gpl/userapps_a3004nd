<script>

//trafficconf_conninfo
function ClearConntrack(ip)
{
        var F = document.conninfo_fm;
        if(confirm(TRAFFICCONF_CONNINFO_DELETE_CONN ))
        {
                F.ip.value=ip;
                F.act.value='clear';
                F.submit();
        }
}

//trafficconf_switch
function ApplyPortMirror()
{
        var F=document.portmirror_fm;
        F.act.value='apply_mirror';
        F.submit();
}

function AddVLAN()
{
    var F=document.vlanform;
    if( (F.port1.checked == false ) && 
            (F.port2.checked == false) && 
            (F.port3.checked == false) && 
            (F.port4.checked == false) ) 
    //        (F.port5.checked == false)) { 
    {
            alert(SELECT_VLAN_PORT_WARNING);
            return; 
            }
    F.act.value = 'addvlan';
    F.submit();
}

function RemoveVLAN()
{
    var F=document.vlanform;
    F.act.value = 'removevlan';
    F.submit();
}

function ApplyUnicast()
{
    var F=document.vlanform;
    F.act.value = 'unicast';
    F.submit();
}

function ApplyHwCRC() 
{ 
	var F=document.hwcrc_fm;
	F.act.value='apply_hwcrc';
	F.submit();
}

//trafficconf_linksetup
function ApplyLinkSetup(port)
{
	var F=document.linksetup_fm;
	F.act.value = "setport"; 
	F.port.value = port;
	F.submit(); 
}

function ClearLinkStat()
{
	var F=document.linkstat_fm; 
	F.act.value = "clear"; 
	F.submit();
}

function SelectLinkMode(port)
{
	var F=document.linksetup_fm;
	var obj = document.getElementsByName('mode'+port);

	if(obj[0].value == 'auto')
	{
		DisableObjNames('speed'+port); 
		DisableObjNames('duplex'+port); 
	}
	else
	{
		EnableObjNames('speed'+port); 
		EnableObjNames('duplex'+port); 
	}
}


//trafficconf_qos
function errorPopup(err)
{
	switch (err)
	{
	case 0 : 
		break;
	case -2 :
		alert(QOS_COMMON_EXCCED_MAX_CLASS);
		break;
	case -3 :
		alert(QOS_COMMON_EXCCED_MAX_SPEED);
		break;
	case -4 :
		alert(QOS_COMMON_ISOLATED_EXCEED);
		break;
	case -5 :
		alert(QOS_COMMON_NO_CHANGE_DIRECTION);
		break;
	case -7 :
		alert(QOS_COMMON_ONLY_DIGIT);
		break;
	case -8 :
		alert(QOS_COMMON_BASIC_SETUP_FIRST);
		break;
	default :
	}
}

function setServiceRate(wan, down, downunit, up, upunit)
{
	var F = document.basic_setup_fm;
	if (wan == 'wan1')
	{
		F.w1dn.value = down;
		F.w1dnu[downunit].selected = true;
		F.w1up.value = up;
		F.w1upu[upunit].selected = true;
		F.w1units.value = downunit + ';' + upunit;
	}
	else
	{
		F.w2dn.value = down;
		F.w2dnu[downunit].selected = true;
		F.w2up.value = up;
		F.w2upu[upunit].selected = true;
		F.w2units.value = downunit + ';' + upunit;
	}
}

function selectSERVICE(wan)
{
	var F = document.basic_setup_fm;
	var servic;

	if (wan == 'wan1')
		service = F.w1svc;
	else
		service = F.w2svc;

	for ( i = 0; i < service.length; i ++ ) {
		if ( service.options[i].selected == true ) {
			switch (service.options[i].value)
			{
			case 'vdslpro' :
				setServiceRate(wan, '13',1,'13',1);
				break;
			case 'vdsllite' :
				setServiceRate(wan, '4',1,'4',1);
				break;
			case 'adslpro' :
				setServiceRate(wan, '8',1,'512',0);
				break;
			case 'adslmid' :
				setServiceRate(wan, '4',1,'512',0);
				break;
			case 'adsllite' :
				setServiceRate(wan, '2',1,'512',0);
				break;
			case 'cablepro' :
				setServiceRate(wan, '8',1,'4',1);
				break;
			case 'cablelite' :
				setServiceRate(wan, '4',1,'2',1);
				break;
			case 'ntopia' :
				setServiceRate(wan, '30',1,'30',1);
				break;
			default :
				setServiceRate(wan, '',0,'',0);
			}
		}
	}
}

function setupTCBasic(tcmode, wc, svr, dn, dnu, up, upu)
{
	var F = document.basic_setup_fm;
	var mode_changed = 0;
	var svr_changed = 0;

	F.tcmode.value = GetRadioValue(F.set_tc_mode);

	if (F.tcmode.value != tcmode)
		mode_changed = 1;

	if (wc == 'w1')
	{
		if ((F.w1svc[F.w1svc.selectedIndex].value != svr) ||
		    (F.w1dn.value != dn) ||
		    (F.w1dnu[F.w1dnu.selectedIndex].value != dnu) ||
		    (F.w1up.value != up) || 
		    (F.w1upu[F.w1upu.selectedIndex].value != upu))
			svr_changed = 1;
	}
	else if (wc == 'w2')
	{
		if ((F.w2svc[F.w2svc.selectedIndex].value != svr) ||
		    (F.w2dn.value != dn) ||
		    (F.w2dnu[F.w2dnu.selectedIndex].value != dnu) ||
		    (F.w2up.value != up) || 
		    (F.w2upu[F.w2upu.selectedIndex].value != upu))
			svr_changed = 1;
	}

	if (svr_changed && !confirm(QOS_BASIC_WARNING))
		return;

	if (mode_changed || svr_changed)
	{
		if (wc == 'w1')
			F.act.value = 'setup_tc_wan1';
		else if (wc == 'w2')
			F.act.value = 'setup_tc_wan2';
		else
			F.act.value = 'setup_mode';
		F.submit();
	}
}

function selectQosType(type)
{
	var mode;
	if (type == 'userqos')
	{
	        mode = document.getElementById('userqos');
		if (navigator.appName.indexOf("Microsoft") != -1)
			mode.style.display = 'block';
		else
			mode.style.display = 'table-row';
	        mode = document.getElementById('appsqos');
	        mode.style.display = 'none'; 
	}
	if (type == 'appsqos')
	{
	        mode = document.getElementById('appsqos');
		if (navigator.appName.indexOf("Microsoft") != -1)
			mode.style.display = 'block';
		else
			mode.style.display = 'table-row';
	        mode = document.getElementById('userqos');
	        mode.style.display = 'none';
	}
}

function disable_ip_Form(flag)
{
	var F = document.qosrule_fm;

	if (flag == 'ip')
	{
		EnableIP('sip');
		if (F.eip1) EnableIP('eip');
	}
	else
	{
		DisableIP('sip');
		if (F.eip2) DisableIP('eip');
	}
}

function setupIpType(maxspeed)
{
	var F = document.qosrule_fm;

	if (F.sel_addr[0].checked == true) 
	{
		if ((F.app_port0.value=='' || F.sip4.value != '') && checkRange(F.sip4.value, 1, 254))
		{
			alert(MSG_INVALID_IP);
			F.sip4.focus();
			F.sip4.select();
			return;
		}
		if (F.eip4 && F.eip4.value != '' && checkRange(F.eip4.value, 1, 254))
		{
			alert(MSG_INVALID_IP);
			F.eip4.focus();
			F.eip4.select();
			return;
		}
	}
	if (((F.sip4.value=='' && F.sel_addr[1].checked == false) || F.app_port0.value!='') && 
	      checkRange(F.app_port0.value, 1, 65535))
	{
		alert(QOS_PORT_PORTRANGE);
		F.app_port0.focus();
		return;
	}

	if ((F.protocol[0].selected != true) && (F.app_port0.value == ''))
	{
		alert(QOS_PORT_PORTRANGE);
		F.app_port0.focus();
		return;
	}
	if (F.app_port1.value != '')
	{
		if (checkRange(F.app_port1.value, 1, 65535))
		{
			alert(QOS_PORT_PORTRANGE);
			F.app_port1.focus();
			return;
		}
		if ( parseInt(F.app_port1.value) < parseInt(F.app_port0.value))
		{
			alert(QOS_PORT_INVALID_EXT_PORT_RANGE);
			F.app_port0.focus();
			return;
		}
	}
	if (F.dn.value=='0' && F.up.value=='0')
	{
		alert(QOS_BADNWIDTH_EMPTY);
		F.dn.focus();
		return;
	}
	if ((F.dn.value!='0' && F.dnu.value=='0' && checkRange(F.dn.value, 32, maxspeed*1000)) ||
	    (F.dn.value!='0' && F.dnu.value=='1' && checkRange(F.dn.value, 1, maxspeed)))
	{
		alert(QOS_RATE_RANGE);
		F.dn.focus();
		return;
	}
	if ((F.up.value!='0' && F.upu.value=='0' && checkRange(F.up.value, 32, maxspeed*1000)) ||
	    (F.up.value!='0' && F.upu.value=='1' && checkRange(F.up.value, 1, maxspeed)))
	{
		alert(QOS_RATE_RANGE);
		F.up.focus();
		return;
	}
	F.act.value = 'add_user_type';
	F.submit();
}

function deleteIpType()
{
	var F = document.userqos_list_fm;
	var chkchk=false;
	var len = F.fdel.length;
	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
                if(len)
                {
                        for (i=0; i < len; i++)
                        {
                                if (F.fdel[i].type == 'checkbox')
                                        if (F.fdel[i].checked)
                                                chkchk = true;
                        }
                }
                else
                {
                        if (F.fdel.checked)
                                chkchk = true;
                }
		if (chkchk == true)
		{
			F.act.value = 'del';
			F.submit();
		}
		else
			alert(MSG_SELECT_RULE_TO_DEL);
	}
}

function setupAppType(maxspeed)
{
	var F = document.qosrule_fm;
	if (F.sip4.value != '' && checkRange(F.sip4.value, 1, 254))
	{
		alert(MSG_INVALID_IP);
		F.sip4.focus();
		F.sip4.select();
		return;
	}
	if (F.eip4.value != '' && checkRange(F.eip4.value, 1, 254))
	{
		alert(MSG_INVALID_IP);
		F.eip4.focus();
		F.eip4.select();
		return;
	}
	if (F.dn.value=='0' && F.up.value=='0')
	{
		alert(QOS_BADNWIDTH_EMPTY);
		F.dn.focus();
		return;
	}
	if ((F.dn.value!='0' && F.dnu.value=='0' && checkRange(F.dn.value, 32, maxspeed*1000)) ||
	    (F.dn.value!='0' && F.dnu.value=='1' && checkRange(F.dn.value, 1, maxspeed)))
	{
		alert(QOS_RATE_RANGE);
		F.dn.focus();
		return;
	}
	if ((F.up.value!='0' && F.upu.value=='0' && checkRange(F.up.value, 32, maxspeed*1000)) ||
	    (F.up.value!='0' && F.upu.value=='1' && checkRange(F.up.value, 1, maxspeed)))
	{
		alert(QOS_RATE_RANGE);
		F.up.focus();
		return;
	}
	F.act.value = 'add_apps_type';
	F.submit();
}
/*loadshare*/ 
function checkForm()
{
	var F = document.loadshare_user_fm;

	if (!checkRange(F.rule.value, 60))
		alert(NATCONF_PORTFORWARD_NO_MORE_RULE);
	else if (F.name.value == "")
	{
		alert(NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK);
		F.name.focus();
		F.name.select();
	}
	else if( F.protocol.value != "any")
	{
		if(F.s_port1.value == "" && F.d_port1.value== "" )
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.s_port1.focus();
			F.s_port1.select();
			return 0;
		}
				
		if (F.s_port1.value !="" && checkRange(F.s_port1.value,1, 65535) )
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.s_port1.focus();
			F.s_port1.select();
			return 0;
		}
		else if(F.s_port2.value !="" && checkRange(F.s_port2.value,1, 65535))
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.s_port2.focus();
			F.s_port2.select();
			return 0;
		}
		else if((F.s_port2.value < F.s_port1.value) && (F.s_port2.value !="" && F.s_port1.value !="")) 
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.s_port1.focus();
			F.s_port1.select();
			return 0;
		}
		else if (F.d_port1.value != "" && checkRange(F.d_port1.value,1, 65535))
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.d_port1.focus();
			F.d_port1.select();
			return 0;
		}
		else if (F.d_port2.value != "" && checkRange(F.d_port2.value,1, 65535))
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.d_port2.focus();
			F.d_port2.select();
			return 0;
		}
		else if((F.d_port2.value < F.d_port1.value) && (F.d_port2.value !="" && F.d_port1.value !="")) 
		{
			alert(NATCONF_INTSERVER_INVALID_EXT_PORT);
			F.d_port1.focus();
			F.d_port1.select();
			return 0;
		}
		else
		{
			F.act.value = "add";
	                F.submit();
		}
	}
	else
	{
		F.act.value = "add";
		F.submit();
	}
	 
}
function check_linebackup(flag)
{
	var F = document.loadshare_fm;
	if(flag==1)
	{
		if(F.wrr_op_radio[0].checked == true)
		{
			alert(NATCONF_LOADSHARE_KEEP_WRR);
			F.lnbk_radio[0].checked = true;
		}
	}
	else
	{
		if(F.wrr_op_radio[0].checked == true && F.lnbk_radio[0].checked == false)
		{
			if (confirm(NATCONF_LOADSHARE_ON_LINE_BACKUP))
				F.lnbk_radio[0].checked = true;
			else
				F.wrr_op_radio.checked = false;
		
		}
	}
}

function deleteLoadShare()
{
	var F = document.loadshare_user_fm;
	var chkchk=false;
		
	if(confirm(NATCONF_LOADSHARE_DELETE_RULE))
	{
		for(i=0; i<F.elements.length; i++)
		{
			if(F.elements[i].type == 'checkbox')
			{
				if(F.elements[i].checked)
				{
					if(chkchk == false)
						chkchk = true;
				}
			}
		}
	}
	else
		return 0;
			
	if(chkchk == true)
	{
		F.act.value = 'del';
		F.submit();
	}
	else
		alert(NATCONF_PORTFORWARD_SELECT_RULE_TO_DEL)
}
function setProtocol()
{
	var F=document.loadshare_user_fm;
	if(F.protocol.value != 'any')
	{
		EnableObj(F.s_port1);
		EnableObj(F.s_port2);
		
		EnableObj(F.d_port1);
		EnableObj(F.d_port2);
	}
	else
	{
		DisableObj(F.s_port1);
		DisableObj(F.s_port2);
		DisableObj(F.d_port1);
		DisableObj(F.d_port2);
	}
}

function submit_wrr()
{
	var F=document.loadshare_fm;
	F.act.value = 'wrr_submit';
	F.submit();
}

function submit_primary()
{
	var F=document.loadshare_fm;
	F.act.value='primary_submit';
	F.submit();
}
function submit_lnbk()
{
	var F=document.loadshare_fm;
	F.act.value='lnbk_submit';
	F.submit();
}


//trafficconf_connctrl
function ApplyConnCtrl()
{
	var F=document.connctrl_fm;

	all=parseInt(F.all.value);
	def_all=parseInt(F.default_all.value);

	if(all == 0 || all > def_all ) 
	{
		if(!confirm(MSG_CONNECTION_MAX_WARNING))
		{
			F.all.focus();
			F.all.select();
			return;
		}
	}

	if(all < 512)
	{
		alert(MSG_CONNECTION_MAX_TOO_SMALL);
		F.all.focus();
		F.all.select();
		return;
	}

	udp_max=parseInt(F.udp_max.value);
	if(udp_max!=0 && (udp_max > all || udp_max < 10))
	{
		alert(MSG_UDP_CONNECTION_MAX_TOO_BIG);
		F.udp_max.focus();
		F.udp_max.select();
		return;
	}

	icmp_max=parseInt(F.icmp_max.value);
	if(icmp_max > all)
	{
		alert(MSG_ICMP_CONNECTION_MAX_TOO_BIG);
		F.icmp_max.focus();
		F.icmp_max.select();
		return;
	}

	rate_per_ip=parseInt(F.rate_per_ip.value);
	if(rate_per_ip < 0 || rate_per_ip > 100 )
	{
		alert(MSG_INVALID_RATE_PER_MAX);
		F.rate_per_ip.focus();
		F.rate_per_ip.select();
		return;
	}

	F.act.value="apply";
	F.submit();

	return;
}


function DefaultConnCtrl()
{
	var F=document.connctrl_fm;

	F.all.value = F.default_all.value;
	F.udp_max.value = F.default_udp_max.value;
	F.icmp_max.value = F.default_icmp_max.value;
	F.rate_per_ip.value = F.default_rate_per_ip.value;
}

</script>
