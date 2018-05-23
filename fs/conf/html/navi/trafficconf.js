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

function AddVLAN(numlan)
{
	var F=document.vlanform;
	var i;

	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('chk_port'+i);
		if (!obj) 
			continue;
		if (obj[0].checked == true)
			break;
	}

	if (i > numlan)
		alert(SELECT_VLAN_PORT_WARNING);
	else
	{
		F.act.value = 'addvlan';
		F.submit();
	}
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

	if(!obj[0]) return;

	if(obj[0].value == 'auto')
	{
		DisableObjNames('speed'+port); 
		DisableObjNames('duplex'+port); 
	}
	else
	{
		
		EnableObjNames('speed'+port);

		var obj = document.getElementsByName('speed'+port);
		if(obj && obj[0])
		{
			var val=GetValue(obj[0]);
			if(val == '1000')
				DisableObjNames('duplex'+port);
			else
				EnableObjNames('duplex'+port); 
		}
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
				setServiceRate(wan, '100',1,'100',1);
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

		if(F.bcm_ctf)
		{
			ApplyReboot(F,'qos');
		}
		else
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

function listQosType(type)
{
	var mode;
	if (type == 'gr_type')
	{
	        mode = document.getElementById('gr_type');
		if (navigator.appName.indexOf("Microsoft") != -1)
			mode.style.display = 'block';
		else
			mode.style.display = 'table-row';
	        mode = document.getElementById('lr_type');
	        mode.style.display = 'none'; 
	}
	if (type == 'lr_type')
	{
	        mode = document.getElementById('lr_type');
		if (navigator.appName.indexOf("Microsoft") != -1)
			mode.style.display = 'block';
		else
			mode.style.display = 'table-row';
	        mode = document.getElementById('gr_type');
	        mode.style.display = 'none';
	}
}


function check_bpi_range()
{
	var F = document.qosrule_fm;
	var count;

	if (F.bpi_chk.checked)
	{
		count = parseInt(F.eip4.value) - parseInt(F.sip4.value) + 1;
		if ((count > 31) || (count < 2))
			return 1;
	}
	return 0;
}

function disable_ip_Form(flag)
{
	var F = document.qosrule_fm;

	if (flag == 'ip')
	{
		EnableIP('sip');
		if (F.eip1) EnableIP('eip');
		EnableCheckBox(F.bpi_chk);
	}
	else
	{
		DisableIP('sip');
		if (F.eip2) DisableIP('eip');
		DisableCheckBox(F.bpi_chk);
	}
}

function setupIpType(maxdn,maxup, cur_ippool, max_ippool)
{
	var F = document.qosrule_fm;
	var port_err, obj;

	if (F.sel_addr[0].checked != true) 
		;
	else if (F.app_port0.value != '' && F.sip4.value == '' &&  F.eip4.value == '')
		;
	else if (F.sip4.value != '' && (obj=CheckIP('sip')))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (F.eip4 && F.eip4.value != '' && (obj = CheckIP('eip')))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (obj=CheckIPNetwork('sip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (F.eip4 && F.eip4.value != '' && (obj=CheckIPNetwork('eip')))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (check_bpi_range())
	{
		alert(QOS_BPI_RANGE);
		F.eip4.focus();
		F.eip4.select();
		return;
	}
	else if ((F.bpi_chk.checked == false) && (F.sip4.value != "") && (F.eip4.value != "") && (cur_ippool >= max_ippool))
        {
                alert(MSG_IPPOOL_MAX_WARNING);
                return;
        }

	if ((F.protocol[0].selected != true) && (F.app_port0.value == ''))
	{
		alert(QOS_PORT_PORTRANGE);
		F.app_port0.focus();
		return;
	}
	if ((F.protocol[0].selected == true) && ((F.app_port0.value != '') || (F.app_port1.value != '')))
	{
		alert(QOS_PROTOCOL_SELECT);
		F.protocol.focus();
		return;
	}
	if ((F.app_port0.value != '') && checkRange(F.app_port0.value, 1, 65535))
	{
		if (!F.sel_addr[2] || F.sel_addr[2].checked == false)
		{
			alert(QOS_PORT_PORTRANGE);
			F.app_port0.focus();
			return;
		}
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
	if ((F.dn.value!='0' && F.dnu.value=='0' && checkRange(F.dn.value, 32, maxdn)) ||
	    (F.dn.value!='0' && F.dnu.value=='1' && checkRange(F.dn.value*1000, 1000, maxdn)))
	{
		alert(QOS_RATE_RANGE);
		F.dn.focus();
		return;
	}
	if ((F.up.value!='0' && F.upu.value=='0' && checkRange(F.up.value, 32, maxup)) ||
	    (F.up.value!='0' && F.upu.value=='1' && checkRange(F.up.value*1000, 1000, maxup)))
	{
		alert(QOS_RATE_RANGE);
		F.up.focus();
		return;
	}
	F.act.value = 'add_user_type';
	F.submit();
}

function deleteIpType(chk_name)
{
	var F = document.userqos_list_fm;
	var chkobj = document.getElementsByName(chk_name);
	var chkchk = false;

	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
                if(chkobj.length)
                {
                        for (i=0; i < chkobj.length; i++)
                                if ((chkobj[i].type == 'checkbox') && (chkobj[i].checked))
                                                chkchk = true;
                }
                else
                {
                        if (chkobj.checked)
                                chkchk = true;
                }

		if (chkchk == true)
		{
			if(GetRadioValue(F.listrule) == 'lr_type')
				F.pty.value = QOS_SHARING_BOUNDED;
			else
				F.pty.value = QOS_SHARING_BORROW;

			F.act.value = 'del';
			F.submit();
		}
		else
			alert(MSG_SELECT_RULE_TO_DEL);
	}
}

function setupAppType(maxdn, maxup,cur_ippool, max_ippool)
{
	var F = document.qosrule_fm;
	var obj;

	if (F.sel_addr[0].checked != true)
		;
	else if (F.sip4.value == '' &&  F.eip4.value == '')
		;
	else if (obj=CheckIP('sip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (F.eip4 &&  F.eip4.value != '' && (obj=CheckIP('eip')))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (obj=CheckIPNetwork('sip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (F.eip4 &&  F.eip4.value != '' && (obj=CheckIPNetwork('eip')))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if (check_bpi_range())
	{
		alert(QOS_BPI_RANGE);
		F.eip4.focus();
		F.eip4.select();
		return;
	}
	else if ((F.bpi_chk.checked == false) && (F.sip4.value != "") && (F.eip4.value != "") && (cur_ippool >= max_ippool))
        {
                alert(MSG_IPPOOL_MAX_WARNING);
                return;
        }

	if (F.dn.value=='0' && F.up.value=='0')
	{
		alert(QOS_BADNWIDTH_EMPTY);
		F.dn.focus();
		return;
	}
	if ((F.dn.value!='0' && F.dnu.value=='0' && checkRange(F.dn.value, 32, maxdn)) ||
	    (F.dn.value!='0' && F.dnu.value=='1' && checkRange(F.dn.value*1000, 1000, maxdn)))
	{
		alert(QOS_RATE_RANGE);
		F.dn.focus();
		return;
	}
	if ((F.up.value!='0' && F.upu.value=='0' && checkRange(F.up.value, 32, maxup)) ||
	    (F.up.value!='0' && F.upu.value=='1' && checkRange(F.up.value*1000, 1000, maxup)))
	{
		alert(QOS_RATE_RANGE);
		F.up.focus();
		return;
	}
	F.act.value = 'add_apps_type';
	F.submit();
}

function onoff_SmartQos()
{
	var F = document.smartqos_fm;

	if (F.smartqos_chk.checked)
	{
		HideIt('qos_row1');	
		HideIt('qos_row2');	
		HideIt('qos_row3');	
		HideIt('qos_rulelist');	
	}
	else
	{
		ShowIt('qos_row1');	
		ShowIt('qos_row2');	
		ShowIt('qos_row3');	
		ShowIt('qos_rulelist');	
	}
}


/*loadshare*/ 

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

function checkForm(cur_ippool, max_ippool)
{
	var F = document.loadshare_user_fm;
	var obj;

	if (!checkRange(F.rule_count.value, 60))
		alert(NATCONF_PORTFORWARD_NO_MORE_RULE);
	else if (F.name.value == "")
	{
		alert(NATCONF_PORTFORWARD_RULE_NAME_IS_BLANK);
		F.name.focus();
		F.name.select();
	}
	else if (obj=CheckOptionalIP('sip'))
	{
                alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}
	else if (obj=CheckOptionalIP('eip'))
	{
                alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}
	else if (obj=CheckOptionalIP('dst_sip'))
	{
                alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}
	else if (obj=CheckOptionalIP('dst_eip'))
	{
                alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}
	else if ((F.sip4.value != "") && (F.eip4.value != "") && (cur_ippool >= max_ippool))
        {
                alert(MSG_IPPOOL_MAX_WARNING);
                return;
        }
	else if ((F.dst_sip4.value != "") && (F.dst_eip4.value != "") && (cur_ippool >= max_ippool))
        {
                alert(MSG_IPPOOL_MAX_WARNING);
                return;
        }
	else if (F.prio.value != "" && checkOptionalRange(F.prio.value, 1,F.rule_count.value))
	{
		alert(FIREWALLCONF_FIREWALL_INVALID_PRIORITY);
		F.prio.focus();
		F.prio.select();
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
			if (F.act.value == '') F.act.value = "add";
	                F.submit();
		}
	}
	else
	{
		if (F.act.value == '') F.act.value = "add";
		F.submit();
	}
	 
}

function getLoadShare(idx, name, ssip, seip, dsip, deip, proto, ssport, seport, dsport, deport, wan, prio)
{
	var F = document.loadshare_user_fm;

	for( i=0; ; i++)
	{
		obj = document.getElementById('rule_'+i);
		if(!obj) break;
		obj.className = 'item_text';
	}
	obj = document.getElementById('rule_'+idx);
	obj.className = 'warning_string';

	F.name.value = name;
	F.name.readOnly = true;

	ResetIP('sip');
	ResetIP('eip');
	if (ssip != '') SetIP('sip', ssip);
	if (seip != '') SetIP('eip', seip);

	ResetIP('dst_sip');
	ResetIP('dst_eip');
	if (dsip != '') SetIP('dst_sip', dsip);
	if (deip != '') SetIP('dst_eip', deip);

	F.protocol.value = proto;
	
	if (proto == 'any')
	{
		F.s_port1.value = '';
		F.s_port2.value = ''; 
		F.d_port1.value = '';
		F.d_port2.value = ''; 
		DisableObj(F.s_port1);
		DisableObj(F.s_port2);
		DisableObj(F.d_port1);
		DisableObj(F.d_port2);
	}
	else
	{
		if (ssport != '0') F.s_port1.value = ssport;
		if (seport != '0') F.s_port2.value = seport; 
		if (dsport != '0') F.d_port1.value = dsport;
		if (deport != '0') F.d_port2.value = deport; 
		EnableObj(F.s_port1);
		EnableObj(F.s_port2);
		EnableObj(F.d_port1);
		EnableObj(F.d_port2);
	}

	SetRadioValue(F.wan_name, wan);

	F.prio.value = prio;

	EnableObj(F.cancel);

	F.add.value = MODIFY_OP;
	F.act.value = 'modify';
}

function cancelLoadShare()
{
        var F = document.loadshare_user_fm;
        F.act.value = '';
        F.submit();
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

function runLoadShare()
{
	var F = document.loadshare_user_fm;
        var chkchk=false;
        var len = F.lsrun.length;

        if(len)
        {
                for (i=0; i < len; i++)
                {
                        if (F.lsrun[i].type == 'checkbox')
                                if (F.lsrun[i].checked)
                                        chkchk = true;
                }
        }
        else
        {
                if (F.lsrun.checked)
                        chkchk = true;
        }
        if (chkchk == true)
        {
                if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
                {
                        F.act.value = 'run';
                        F.submit();
                }
        } else
        {
                if (confirm(MSG_ALL_STOP_RULE))
                {
                        F.act.value = 'run';
                        F.submit();
                }
        }
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

	if ((F.arpchk.checked == 0) && (F.pingchk.checked == 0) && (F.dnschk.checked == 0))
	{
		alert(MSG_BACKUP_METHOD_AT_LEAST_ONE);
		return;
	}
	if (F.dnschk.checked && (F.domain.value == ''))
	{
		alert(MSG_BACKUP_METHOD_DOMAIN);
		F.domain.focus();
		return;
	}

	F.act.value='lnbk_submit';
	F.submit();
}

function AddLsSr()
{
	var F=document.lsrule_sr_fm;
	F.act.value='sr_add';
	F.submit();
}

function DelLsSr()
{
	var F=document.sr_list_fm;
        var chkchk=false;
        var len = F.srdel.length

        if (confirm(MSG_DELETE_RULE_CONFIRM))
        {
                if(len)
                {
                        for (i=0; i < len; i++)
                        {
                                if (F.srdel[i].type == 'checkbox')
                                        if (F.srdel[i].checked)
                                                chkchk = true;
                        }
                }
                else
                {
                        if (F.srdel.checked)
                                chkchk = true;
                }
                if (chkchk == true)
                {
                        F.act.value = 'sr_del';
                        F.submit();
                } else
                        alert(MSG_SELECT_RULE_TO_DEL);
        }
}

function RunLsSr()
{
        var F = document.sr_list_fm;
        var chkchk=false;
        var len = F.srrun.length;

        if(len)
        {
                for (i=0; i < len; i++)
                {
                        if (F.srrun[i].type == 'checkbox')
                                if (F.srrun[i].checked)
                                        chkchk = true;
                }
        }
        else
        {
                if (F.srrun.checked)
                        chkchk = true;
        }
        if (chkchk == true)
        {
                if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
                {
                        F.act.value = 'sr_run';
                        F.submit();
                }
        } else
        {
                if (confirm(MSG_ALL_STOP_RULE))
                {
                        F.act.value = 'sr_run';
                        F.submit();
                }
        }
}

function DisableSrMethod(type)
{
	var F=document.lsrule_sr_fm;

	if (type == 'usertype')
		EnableObj(F.user_ipfile);
	else
		DisableObj(F.user_ipfile);
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

	if(all!=0 && all < 512)
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



function ApplyConnTimeout()
{
	var F=document.conntimeout_fm;
	var val,i;

	for(i=0; i<F.elements.length; i++)
	{
		if(F.elements[i].type == 'text')
		{
			val=parseInt(F.elements[i].value);
			if(val <= 0)
			{
				alert('Invalid Timeout Value');
				F.elements[i].focus();
				F.elements[i].select();
				return;
			}

		}

	}

	F.act.value="apply_timeout";
	F.submit();

	return;
}


function DefaultConnTimeout()
{
	var F=document.conntimeout_fm;

	F.tcp_timeout_syn_sent.value = F.default_tcp_timeout_syn_sent.value;
	F.tcp_timeout_syn_recv.value = F.default_tcp_timeout_syn_recv.value;
	F.tcp_timeout_eastablished.value = F.default_tcp_timeout_eastablished.value;
	F.tcp_timeout_fin_wait.value = F.default_tcp_timeout_fin_wait.value;
	F.tcp_timeout_close_wait.value = F.default_tcp_timeout_close_wait.value;
	F.tcp_timeout_last_ack.value = F.default_tcp_timeout_last_ack.value;
	F.tcp_timeout_time_wait.value = F.default_tcp_timeout_time_wait.value;
	F.tcp_timeout_close.value = F.default_tcp_timeout_close.value;
	F.udp_timeout.value = F.default_udp_timeout.value;
	F.udp_timeout_stream.value = F.default_udp_timeout_stream.value;
	F.icmp_timeout.value = F.default_icmp_timeout.value;
	F.generic_timeout.value = F.default_generic_timeout.value;
}


// Advanced Port Mirroring
function ChangePortMirror()
{
        var F = document.portmirror_fm;

        if( F.enable.checked == true)
        {
                EnableObj(F.mirror_port);
                EnableObj(F.mirrored_port);
        }
        else
        {
                DisableObj(F.mirror_port);
                DisableObj(F.mirrored_port);
        }
}

function ApplyAdvancedPortMirror()
{
        var F = document.portmirror_fm;
        var checked = 0;

        if( F.enable.checked == false)
        {
                F.act.value = 'apply';
                F.submit();
                return;
        }

        if(F.mirror_port.value == F.mirrored_port.value)
        {
                alert(MSG_SAME_PORT_MIRROR);
                return;
        }

        F.act.value = 'apply';
        F.submit();
}



// Port QoS


function CheckPortQoSRate(name,srange,erange)
{
	var objs = document.getElementsByName(name);

	if(!objs) return true;

	for(i = 0 ; i < objs.length; i++)
	{
		val=parseInt(objs[i].value);
		if( !isInteger(objs[i].value) || val > erange || val < srange) 
		{
			if (name.substr(0,3) == 'wan')
				alert("WAN "+MSG_PORTQOS_INVALID_VALUE+"0 ~ "+erange+" Mbps)");
			else
				alert("Port "+ (i+1)+MSG_PORTQOS_INVALID_VALUE+"0 ~ "+erange+" Mbps)");
			objs[i].focus();
			objs[i].select();
			return false;
		}
	}
	return true;
}

function CheckZeroQoSRate(mname,kname)
{
	var mobjs = document.getElementsByName(mname);
	var kobjs = document.getElementsByName(kname);

	if(!mobjs) return true;

	for(i = 0 ; i < mobjs.length; i++)
	{
		if((parseInt(mobjs[i].value)==0) && (parseInt(kobjs[i].value)==0))
		{
			if (mname.substr(0,3) == 'wan')
				alert("WAN "+MSG_PORTQOS_BOTH_ZERO);
			else
				alert("Port "+ (i+1)+MSG_PORTQOS_BOTH_ZERO);
			mobjs[i].focus();
			mobjs[i].select();
			return false;
		}
	}
	return true;
}

function CheckMaxQoSRate(mname,kname)
{
	var mobjs = document.getElementsByName(mname);
	var kobjs = document.getElementsByName(kname);

	if(!mobjs) return true;

	for(i = 0 ; i < mobjs.length; i++)
	{
		if((parseInt(mobjs[i].value)==100) && (parseInt(kobjs[i].value)!=0))
		{
			if (mname.substr(0,3) == 'wan')
				alert("WAN "+MSG_PORTQOS_MAX_ERROR);
			else
				alert("Port "+ (i+1)+MSG_PORTQOS_MAX_ERROR);
			kobjs[i].focus();
			kobjs[i].select();
			return false;
		}
	}
	return true;
}




function ApplyLANPortQoS(mvalue_low, mvalue_high)
{
	if(CheckPortQoSRate("port_tx_mbps", 0, parseInt(mvalue_high)) == false)
		return;
	if(CheckPortQoSRate("port_tx_kbps", 0, 999 ) == false)
		return;
	if(CheckPortQoSRate("port_rx_mbps", 0, parseInt(mvalue_high)) == false)
		return;
	if(CheckPortQoSRate("port_rx_kbps", 0, 999 ) == false)
		return;
	if (parseInt(mvalue_low) >= 0)
	{
		if(CheckZeroQoSRate("port_tx_mbps","port_tx_kbps") == false)
			return;
		if(CheckZeroQoSRate("port_rx_mbps","port_rx_kbps") == false)
			return;
	}
	if(CheckMaxQoSRate("port_tx_mbps","port_tx_kbps", 100) == false)
		return;
	if(CheckMaxQoSRate("port_rx_mbps","port_rx_kbps", 100) == false)
		return;

	document.portqos_fm.act.value = "lan";
	document.portqos_fm.submit();
}

function ApplyWANPortQoS(mvalue_low, mvalue_high)
{
	if(CheckPortQoSRate("wan_port_tx_mbps", 0, parseInt(mvalue_high)) == false)
		return;
	if(CheckPortQoSRate("wan_port_tx_kbps", 0, 999 ) == false)
		return;
	if(CheckPortQoSRate("wan_port_rx_mbps", 0, parseInt(mvalue_high)) == false)
		return;
	if(CheckPortQoSRate("wan_port_rx_kbps", 0, 999 ) == false)
		return;
	if (parseInt(mvalue_low) >= 0)
	{
		if(CheckZeroQoSRate("wan_port_tx_mbps","wan_port_tx_kbps") == false)
			return;
		if(CheckZeroQoSRate("wan_port_rx_mbps","wan_port_rx_kbps") == false)
			return;
	}
	if(CheckMaxQoSRate("wan_port_tx_mbps","wan_port_tx_kbps", 100) == false)
		return;
	if(CheckMaxQoSRate("wan_port_rx_mbps","wan_port_rx_kbps", 100) == false)
		return;

	document.portqos_fm.act.value = "wan";
	document.portqos_fm.submit();
}

function SetLanPortQosDefault(mvalue)
{
	var mobjs = document.getElementsByName("port_tx_mbps");
	var kobjs = document.getElementsByName("port_tx_kbps");

	for( i = 0 ; i < mobjs.length; i++ )
	{
		mobjs[i].value =  mvalue;
		kobjs[i].value = '0';
	}

	mobjs = document.getElementsByName("port_rx_mbps");
	kobjs = document.getElementsByName("port_rx_kbps");

	if(mobjs)
	{
		for( i = 0 ; i < mobjs.length; i++ )
		{
			mobjs[i].value = mvalue;
			kobjs[i].value = '0';
		}
	}
}

function SetWanPortQosDefault(mvalue)
{
	var mobjs = document.getElementsByName("wan_port_tx_mbps");
	var kobjs = document.getElementsByName("wan_port_tx_kbps");

	for( i = 0 ; i < mobjs.length; i++ )
	{
		mobjs[i].value = mvalue;
		kobjs[i].value = '0';
	}

	mobjs = document.getElementsByName("wan_port_rx_mbps");
	kobjs = document.getElementsByName("wan_port_rx_kbps");

	if(mobjs)
	{
		for( i = 0 ; i < mobjs.length; i++ )
		{
			mobjs[i].value = mvalue;
			kobjs[i].value = '0';
		}
	}
}



function ApplyHubMode()
{
	var F=document.switch_fm;

	if(GetRadioValue(F.router_mode) == 'hub')
	{
		if(confirm(MSG_HUBMODE_WARNING))
		{
			if(confirm(MSG_HUBMODE_CONFIRM))
			{
				F.act.value = 'apply_routermode';
				F.submit();
				return;
			}
		}
		return;
	}

	F.act.value = 'apply_routermode';
	F.submit();

}

function ApplyAddressLearning()
{
	var F=document.switch_fm;

	F.act.value = 'apply_addresslearning';
	F.submit();
}



// trafficconf_connadv
function ShowConnStatOption()
{
	var F=document.ctl_stat_fm;
	
	if(F.option_enable.checked == false)
	{
		if(!confirm(TRAFFICCONF_ALL_OPTIONS_CLEAR))
		{
			F.option_enable.checked = true;
			return;
		}
	}

	F.act.value = "changeoption";
	F.submit();
}

function ClearConnStatOption()
{
	var F=document.ctl_stat_fm;
	
	F.act.value = "clearoption";
	F.submit();
}



function SearchConnAdvanced()
{
	var F=document.ctl_stat_fm;
	var obj, protocol;

	if( !F.option_enable || F.option_enable.checked == false )
	{
		F.act.value = "search";
		F.submit();
		return;
	}

        if(obj=CheckOptionalIP('local_ip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return 0;
        }

        if(obj=CheckOptionalIP('remote_ip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return 0;
        }

	if (checkOptionalRange(F.protonum.value, 0, 255))
	{
                alert(MSG_INVALID_PROTONUM);
                obj.focus();
                obj.select();
                return 0;
	}

	protocol = GetValue(F.protocol);
	if( protocol == 'tcp' || protocol == 'udp' )
	{
		if (checkOptionalRange(F.dst_port.value, 1, 65535))
		{
			alert(SYSINFO_HOST_PORTRANGE);
			F.dst_port.focus();
			F.dst_port.select();
			return;
		}
	}

	F.act.value = "search";
	F.submit();
}

function ChangeConnAdvanced()
{
	var F=document.ctl_stat_fm;
	var select_stat=GetValue(F.select_stat);

	if(F.option_enable.checked == false)
		return;

	if(select_stat == 'connstatus')
	{

		EnableIP('local_ip');
		EnableIP('remote_ip');
		EnableObj(F.direction);

		EnableObj(F.protocol);
		protocol=GetValue(F.protocol);

		if( protocol == 'unknown' )
			EnableObj(F.protonum);
		else
			DisableObj(F.protonum);
		if( protocol == '6' || protocol == '17')
			EnableObj(F.dst_port);
		else
			DisableObj(F.dst_port);

		EnableObj(F.alltcp);
		EnableObj(F.viewdetail);
		EnableObj(F.viewstat);
		DisableObj(F.pathdetail);

	}
	else if(select_stat == 'ipstat' )
	{
		EnableIP('local_ip');
		DisableIP('remote_ip');
		DisableObj(F.protocol);
		DisableObj(F.protonum);
		DisableObj(F.dst_port);
		DisableObj(F.direction);

		DisableObj(F.alltcp);
		DisableObj(F.viewdetail);
		DisableObj(F.viewstat);
		DisableObj(F.pathdetail);
	}
	else if(select_stat == 'portstat')
	{

		DisableIP('local_ip');
		DisableIP('remote_ip');
		DisableObj(F.direction);

		EnableObj(F.protocol);

		protocol=GetValue(F.protocol);
		if( protocol == 'unknown' )
			EnableObj(F.protonum);
		else
			DisableObj(F.protonum);
		if( protocol == '6' || protocol == '17')
			EnableObj(F.dst_port);
		else
			DisableObj(F.dst_port);

		DisableObj(F.alltcp);
		DisableObj(F.viewdetail);
		DisableObj(F.viewstat);
		DisableObj(F.pathdetail);

	}
	else if(select_stat == 'dirstat')
	{
		DisableIP('local_ip');
		DisableIP('remote_ip');
		DisableObj(F.protocol);
		DisableObj(F.protonum);
		DisableObj(F.dst_port);
		DisableObj(F.direction);
		DisableObj(F.alltcp);
		DisableObj(F.viewdetail);
		DisableObj(F.viewstat);
		EnableObj(F.pathdetail);
	}

}

function addTRUNK(numlan, max_member)
{
        var F=document.trunk_fm;
        var trunkmap;
        var i, member_count;
	var msg;

        if (F.tname.value == '')
        {
                alert(MSG_RULE_NAME_IS_BLANK);
                F.tname.focus();
                F.tname.select();
                return;
        }

        trunkmap = 0;
        member_count = 0;
        for (i=1; i<= numlan; i++)
        {
                obj = document.getElementsByName('p'+i);
                if (obj && (obj[0].checked == true))
		{
                        trunkmap |= (1 << (i-1));
			member_count++;
		}
        }

        if ((trunkmap == 0) || (member_count == 1))
                alert(SELECT_TRUNK_PORT_WARNING);
        else if (member_count > max_member)
        {
                msg = sprintf(MAX_MEMBER_TRUNK_WARNING, max_member);
                alert(msg);
        }
        else
        {
                F.act.value = 'addtrunk';
                F.submit();
        }
}

function removeTRUNK(tname)
{
        var F=document.trunk_fm;

        if (confirm(MSG_DELETE_RULE_CONFIRM))
        {
    	    F.delname.value = tname;
       	    F.act.value = 'removetrunk';
            F.submit();
        }

}


</script>
