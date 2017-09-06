<script>

//trafficconf_qos
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
