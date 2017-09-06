<script>

// netconf_lansetup
function CheckLanIPChange(F)
{
	var obj;
	
	if(obj=CheckIP('ip'))
	{
	        alert(MSG_INVALID_IP);
	        obj.focus();
	        obj.select();
	        return 0;
	}

	if(obj=CheckMask('sm'))
	{
		alert(MSG_INVALID_NETMASK);
	        obj.focus();
	        obj.select();
		return 0;
	}

	nwaddr = GetNetworkAddress('ip', 'sm');
	braddr  = GetLocalBroadcastAddress('ip', 'sm');
	ipaddr  = GetIP('ip');

	if(nwaddr == ipaddr )
	{
		alert(MSG_ERROR_NETWORK_LANIP);
		return 0;
	}

	if(braddr == ipaddr )
	{
		alert(MSG_ERROR_BROAD_LANIP);
		return 0;
	}

	if (nwaddr)
	{
		if (CheckSameSubnet(nwaddr, F.wan1subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
		if (F.wan2subnet && F.wan2subnet.value != '' && CheckSameSubnet(nwaddr, F.wan2subnet.value))
		{
			alert(NETCONF_INTERNAL_INVALID_NETWORK);
			return 0;
		}
	}

	if( document.netconf_lansetup1 && document.netconf_lansetup1.use_local_gateway && document.netconf_lansetup1.use_local_gateway.checked == true )
	{
		if(obj=CheckIP('gw'))
		{
			alert(MSG_INVALID_GATEWAY);
			obj.focus();
			obj.select();
			return 0;
		}

		if(obj=CheckIP('fdns'))
		{
			alert(MSG_INVALID_FDNS);
			obj.focus();
			obj.select();
			return 0;
		}

		if(obj=CheckOptionalIP('sdns'))
		{
			alert(MSG_INVALID_SDNS);
			obj.focus();
			obj.select();
			return 0;
		}
	}

	ApplyReboot(F, 'lanip_chg');
	return 1;
}


function toggleDNS()
{
    var F = document.forms[1];
    if (F.manual_dns.checked == true )
    {
            EnableIP('fdns');
            EnableIP('sdns');
    }
    else if (F.manual_dns.checked == false )
    {
            DisableIP('fdns');
            DisableIP('sdns');
    }
}

function  ChangeDHCPServerOp()
{
    var F = document.forms[1];
    if (F.dhcp_enable[0].checked == true)
    {
            EnableIP('spool_conf');
            EnableIP('epool_conf');
            EnableObj(F.domain);
//          F.manual_dns.disabled = false;
            if(F.leasetime) F.leasetime.disabled = false;

            if(F.dhcp_auto_detect)
                    F.dhcp_auto_detect.disabled = false;
            if(F.dhcp_access_policy)
                    F.dhcp_access_policy.disabled = false;

    }
    else
    {
            DisableIP('spool_conf');
            DisableIP('epool_conf');
            DisableObj(F.domain);
//           F.manual_dns.disabled = true;
            if(F.leasetime) F.leasetime.disabled = true;
             if(F.dhcp_auto_detect)
                    F.dhcp_auto_detect.disabled = true;
            if(F.dhcp_access_policy)
                    F.dhcp_access_policy.disabled = true;

    }
   // toggleDNS();
}

function applyLansetupDhcp()
{
    var obj;
    var F = document.forms[1];
    if (F.dhcp_enable[0].checked == true)
    {
            if(obj=CheckIP('spool_conf'))
            {
                    obj.focus();
                    obj.select();
                    alert(NETCONF_INTERNAL_INVALID_DHCP_S_ADDR);
            }
            else if(obj=CheckIP('epool_conf'))
            {
                    obj.focus();
                    obj.select();
                    alert(NETCONF_INTERNAL_INVALID_DHCP_E_ADDR);
            }
            else if(obj=CheckIPNetwork('spool_conf'))
            {
                    alert(NETCONF_INTERNAL_INVALID_DHCP_S_ADDR);
                    obj.focus();
                    obj.select();
            }
            else if(obj=CheckIPNetwork('epool_conf'))
            {
                    alert(NETCONF_INTERNAL_INVALID_DHCP_E_ADDR);
                    obj.focus();
                    obj.select();
            }
            else if (parseInt(F.spool_conf4.value) > parseInt(F.epool_conf4.value))
                    alert(NETCONF_INTERNAL_INVALID_DHCP_ADDR);


            /*
            else if (F.manual_dns.checked == true
                    && (obj=CheckIP('fdns')))
            {
                    {
                            obj.focus();
                            obj.select();
                            alert(MSG_INVALID_FDNS);
                    }
            }
            else if (F.manual_dns.checked == true
                    && (obj=CheckOptionalIP('sdns')))
            {
                    {
                            obj.focus();
                            obj.select();
                            alert(MSG_INVALID_SDNS);
                    }
            }
            */
	    else if(isInteger(F.leasetime.value) == false )
	    {
                    alert(NETCONF_INTERNAL_INVALID_LEASETIME);
		    F.leasetime.focus();
		    F.leasetime.select();
	    }
            else if (parseInt(F.leasetime.value) < 10 )
	    {
                    alert(NETCONF_INTERNAL_TOO_SMALL_LEASETIME);
		    F.leasetime.focus();
		    F.leasetime.select();
	    }
            else if (parseInt(F.leasetime.value) > 2147483647 )
	    {
                    alert(NETCONF_INTERNAL_TOO_BIG_LEASETIME);
		    F.leasetime.focus();
		    F.leasetime.select();
	    }
            else
            {
                    F.act.value = "dhcp_conf";
                    F.submit();
            }
    }
    else
    {
            F.act.value = "dhcp_conf";
            F.submit();
    }
}


function CheckManualRegister()
{
        var F= document.lan_pcinfo_fm;
        if(F.lan_pcinfo_fm.checked == true)
	{
                EnableHW('manual_hw');
                EnableIP('manual_ip');
	}
        else
	{
                DisableHW('manual_hw');
                DisableIP('manual_ip');
	}
}

function InitMacAuthObj()
{
        DisableHW('hw');
}

function AddStaticLease()
{
	var obj;


	if(lan_pcinfo.document.lan_pcinfo_fm.manual_check.checked == true)
	{
		if(obj=CheckIPObj( lan_pcinfo, 'manual_ip'))
		{
	        	alert(MSG_INVALID_IP);
			obj.focus();
			obj.select();
			return;
		}
		if(obj=CheckIPNetworkObj( lan_pcinfo, 'manual_ip'))
		{
	        	alert(MSG_INVALID_IP);
			obj.focus();
			obj.select();
			return;
		}
		else if(obj=CheckHWObj( lan_pcinfo, 'manual_hw'))
		{
	        	alert(MSG_INVALID_HWADDR);
			obj.focus();
			obj.select();
			return;
		}

	}
	document.staticlease_fm.add_allchk.checked = false;
	lan_pcinfo.document.lan_pcinfo_fm.act.value = 'add';
	lan_pcinfo.document.lan_pcinfo_fm.submit();
}

function RemoveStaticLease()
{
	document.staticlease_fm.del_allchk.checked = false;
	static_lease.document.static_lease_fm.act.value = 'remove';
	static_lease.document.static_lease_fm.submit();
}


function getHostInfo(hwaddr,ip4)
{
    var F = document.netconf_lansetup3;
    if (F.get_host.checked == false)
    {
            ResetHW('hw')
            return
    }
    if(hwaddr!='')
            SetHW('hw',hwaddr)
    if(F.get_host.checked==true)
    {
            F.rsv_ip4.value = ip4;
    }
    else
    {
            F.rsv_ip4.value = '';
    }
}

function registIP()
{
    var F = document.netconf_lansetup3;
    F.act.value = "regist_ip";
    F.submit();
}

function movePage(num)
{
    self.location.href = "timepro.cgi?tmenu=netconf&smenu=lansetup&page=" + num;
}

function deleteRsvIP(index)
{
    var F = document.netconf_lansetup3;
    if (confirm(NETCONF_INTERNAL_DELETE_IP))
    {
            F.act.value = "delete_ip";
            F.submit();
    }
}

function OnCheckEnableMTU(obj,name)
{
        if(obj.checked == true)
                EnableObjNames(name)
        else
                DisableObjNames(name);
}

function ApplyIPMACBind()
{
	document.staticlease_fm.act.value = 'ipbind';
	document.staticlease_fm.submit();
}

// netconf_wansetup
function enableMaxIdle()
{
    var F=document.netconf_wansetup
    if(F.idle_flag.checked == true)
    {
            EnableObj(F.timeout);
            F.cod[0].disabled = false;
            F.cod[1].disabled = false;
            if(F.timeout.value == "")
                    F.timeout.value = "10";
    }
    else
    {
            DisableObj(F.timeout);
            F.cod[0].disabled = true;
            F.cod[1].disabled = true;
    }
}

function popupWindow(flag)
{
    winurl = "/cgi-bin/timepro.cgi?tmenu=popup&smenu="+flag;
    wintop = (screen.height / 2) - 60;
    winleft = (screen.width / 2) - 150;

    win=window.open(winurl,"","toolbar=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=400,height=100,top=" + wintop + ",left=" + winleft);
    win.opener=self;
}

function ShowWansetup(ifname,wan_type)
{
    var mode;
    var F=document.netconf_wansetup;

    if (wan_type == "static")
    {
            ShowIt('static');
            HideIt('pppoe');
            HideIt('dynamic');
            HideIt('pptp');
            HideIt('pppoe_sched');
    }
    else if (wan_type == "dynamic")
    {
            HideIt('static');
            HideIt('pppoe');
            ShowIt('dynamic');
            HideIt('pptp');
            HideIt('pppoe_sched');
    }
    else if (wan_type == "pppoe")
    {
            HideIt('static');
            ShowIt('pppoe');
            HideIt('dynamic');
            HideIt('pptp');
            ShowIt('pppoe_sched');
    }
    else if (wan_type == "pptp")
    {
            HideIt('static');
            HideIt('pppoe');
            HideIt('dynamic');
            ShowIt('pptp');
            HideIt('pppoe_sched');
    }

    obj=document.getElementsByName('mtu.'+wan_type+'.'+ifname+'.'+'check');
    obj2=document.getElementsByName('mtu.'+wan_type+'.'+ifname);
    if(obj[0].checked == false)
	    DisableObj(obj2[0]);
    else
	    EnableObj(obj2[0]);

}
function check_dns()
{
    check_dns_dynamic();
    check_dns_pppoe();
    check_dns_pptp();
}

function check_dns_dynamic()
{
    var F=document.netconf_wansetup
    if (!F.dns_dynamic_chk) return;

    if (F.dns_dynamic_chk.checked == false )
    {
            DisableIP('fdns_dynamic');
            DisableIP('sdns_dynamic');
    }
    else
    {
            EnableIP('fdns_dynamic');
            EnableIP('sdns_dynamic');
    }
}

function check_dns_pppoe()
{
    var F=document.netconf_wansetup
    if (!F.dns_pppoe_chk) return;

    if (F.dns_pppoe_chk.checked == false )
    {
            DisableIP('fdns_pppoe');
            DisableIP('sdns_pppoe');
    }
    else
    {
            EnableIP('fdns_pppoe');
            EnableIP('sdns_pppoe');
    }
}

function check_dns_pptp()
{
    var F=document.netconf_wansetup
    if (!F.dns_pptp_chk) return;

    if (F.dns_pptp_chk.checked == false )
    {
            DisableIP('fdns_pptp');
            DisableIP('sdns_pptp');
    }
    else
    {
            EnableIP('fdns_pptp');
            EnableIP('sdns_pptp');
    }
}


function CheckMTU(wan_type,ifname,maxmtu)
{
	var chkobj,mtuobj;

	chkobj=document.getElementsByName('mtu.'+wan_type+'.'+ifname+'.'+'check');
	if(chkobj[0].check == false)
		return 0;
    	mtuobj=document.getElementsByName('mtu.'+wan_type+'.'+ifname);
	if(mtuobj[0].value > maxmtu)
		return mtuobj[0];
	return 0;
}

function dynamic_apply(ifname)
{
    var F=document.netconf_wansetup
    var obj;
    if (F.hw_conf_dynamic.checked == true)
    {
            if(obj=CheckHW('hw_dynamic'))
            {
                    alert(MSG_INVALID_HWADDR);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }

    if (obj=CheckMTU('dynamic',ifname,1500))
    {
            alert(NETCONF_INTERNET_DHCP_MTU_INVALID);
            obj.focus();
            obj.select();
            return 0;
    }


    if (F.dns_dynamic_chk && F.dns_dynamic_chk.checked == true )
    {

        if(CheckNoPassword(F)) return;

            if(obj=CheckIP('fdns_dynamic'))
            {
	            alert(MSG_INVALID_FDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }

	    if(obj=CheckIPNetwork('fdns_dynamic'))
	    {
	            alert(MSG_INVALID_FDNS);
		    obj.focus();
                    obj.select();
                    return 0;
	    }

            if(obj=CheckOptionalIP('sdns_dynamic'))
            {
                    alert(MSG_INVALID_SDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }

	    if(obj=CheckIPNetwork('sdns_dynamic'))
	    {
                    alert(MSG_INVALID_SDNS);
		    obj.focus();
                    obj.select();
                    return 0;
	    }
    }
    return 1;
}

function pppoe_apply(ifname)
{
    var F=document.netconf_wansetup
    	var obj;

	if (F.userid.value == "")
	{
		F.userid.focus();
		F.userid.select();
                alert(MSG_BLANK_ACCOUNT);
	}
        else if (F.passwd.value == "")
	{
		F.passwd.focus();
		F.passwd.select();
                alert(MSG_BLANK_PASSWORD);
	}
        else if (F.idle_flag && F.timeout && (F.idle_flag.checked == true) && checkRange(F.timeout.value, 0,1000))
	{
		F.timeout.focus();
		F.timeout.select();
                alert(NETCONF_INTERNET_KEEP_ALIVE_MSG);
	}
        else
        {
		if (F.dns_pppoe_chk && F.dns_pppoe_chk.checked == true )
		{

 			if(CheckNoPassword(F)) return; 

			if(obj=CheckIP('fdns_pppoe'))
			{
				alert(MSG_INVALID_FDNS);
				obj.focus();
				obj.select();
				return 0;
			}

	                if(obj=CheckIPNetwork('fdns_pppoe'))
	                {
				alert(MSG_INVALID_FDNS);
	                        obj.focus();
                                obj.select();
                                return 0;
	                }

			if(obj=CheckOptionalIP('sdns_pppoe'))
			{
				alert(MSG_INVALID_SDNS);
				obj.focus();
				obj.select();
				return 0;
			}

	                if(obj=CheckIPNetwork('sdns_pppoe'))
	                {
				alert(MSG_INVALID_SDNS);
	                        obj.focus();
                                obj.select();
                                return 0;
	                }
		}

                if (obj=CheckMTU('pppoe',ifname,1492))
                {
                        alert(NETCONF_INTERNET_PPP_MTU_INVALID);
                        obj.focus();
                        obj.select();
                        return 0;
                }

	        return 1;
        }
	return 0;
}


function static_apply(ifname)
{
    var F=document.netconf_wansetup
    var obj;


    if(obj=CheckIP('ip'))
    {
            alert(MSG_INVALID_IP);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('ip'))
    {
            alert(MSG_INVALID_IP);
	    obj.focus();
	    obj.select();
	    return 0;
    }

    if(obj=CheckIP('sm'))
    {
            alert(MSG_INVALID_NETMASK);
            obj.focus();
            obj.select();
            return 0;
    }
    if(obj=CheckIP('gw'))
    {
            alert(MSG_INVALID_GATEWAY);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('gw'))
    {
            alert(MSG_INVALID_GATEWAY);
	    obj.focus();
	    obj.select();
	    return 0;
    }

    if(obj=CheckIP('fdns_static'))
    {
            alert(MSG_INVALID_FDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('fdns_static'))
    {
            alert(MSG_INVALID_FDNS);
	    obj.focus();
	    obj.select();
	    return 0;
    }

    if(obj=CheckOptionalIP('sdns_static'))
    {
            alert(MSG_INVALID_SDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('sdns_static'))
    {
            alert(MSG_INVALID_SDNS);
	    obj.focus();
	    obj.select();
	    return 0;
    }

    if (obj=CheckMTU('static',ifname,1500))
    {
            alert(NETCONF_INTERNET_DHCP_MTU_INVALID);
            obj.focus();
            obj.select();
            return 0;
    }




    if (F.hw_conf_static.checked == true)
    {
            if(obj=CheckHW('hw_static'))
            {
                    alert(MSG_INVALID_HWADDR);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }
    return 1;
}

function pptp_apply(ifname)
{
	var F=document.netconf_wansetup;
	var obj;

	if (F.pptp_userid.value == "")
	{
		F.pptp_userid.focus();
		F.pptp_userid.select();
                alert(MSG_BLANK_ACCOUNT);
		return 0;
	}

        if (F.pptp_passwd.value == "")
	{
		F.pptp_passwd.focus();
		F.pptp_passwd.select();
                alert(MSG_BLANK_PASSWORD);
		return 0;
	}


	if(obj=CheckIP('pptp_server_ip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckIP('pptp_ip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckIPNetwork('pptp_ip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckIP('pptp_sm'))
	{
		alert(MSG_INVALID_NETMASK);
		obj.focus();
		obj.select();
		return 0;
	}

	if(obj=CheckOptionalIP('pptp_gw'))
	{
		alert(MSG_INVALID_GATEWAY);
		obj.focus();
		obj.select();
		return 0;
	}

        if (F.dns_pptp_chk && F.dns_pptp_chk.checked == true )
	{
		if(obj=CheckIP('fdns_pptp'))
		{
			alert(MSG_INVALID_FDNS);
			obj.focus();
			obj.select();
			return 0;
		}

	        if(obj=CheckIPNetwork('fdns_pptp'))
	        {
			alert(MSG_INVALID_FDNS);
	                obj.focus();
                        obj.select();
                        return 0;
	        }

		if(obj=CheckOptionalIP('sdns_pptp'))
		{
			alert(MSG_INVALID_SDNS);
			obj.focus();
			obj.select();
			return 0;
		}

	        if(obj=CheckIPNetwork('sdns_pptp'))
	        {
			alert(MSG_INVALID_SDNS);
	                obj.focus();
                        obj.select();
                        return 0;
	        }
	}

	if (obj=CheckMTU('pptp',ifname,1492))
	{
		alert(NETCONF_INTERNET_PPP_MTU_INVALID);
		obj.focus();
		obj.select();
		return 0;
	}

	if (F.hw_conf_pptp.checked == true)
	{
		if(obj=CheckHW('hw_pptp'))
		{
			alert(MSG_INVALID_HWADDR);
			obj.focus();
			obj.select();
			return 0;
		}
	}

	return 1;
}




function apply_wansetup(wanname,ifname)
{
    var F=document.netconf_wansetup;
    var obj;
    var wan_type = GetValue(F.wan_type);

    if (wan_type == 'static')
    {
            if(static_apply(ifname))
            {
                    if(CheckNetworkConfig())
                    {
                            F.act.value = "save";
                            F.submit();
                    }
            }
    }
    else if (wan_type == 'dynamic')
    {
            if(dynamic_apply(ifname))
            {
                    F.act.value = "save";
                    F.submit();
            }
    }
    else if (wan_type == 'pppoe')
    {
            if(pppoe_apply(ifname))
            {
                    F.act.value = "save";
                    F.submit();
            }
    }
    else if (wan_type == 'pptp')
    {
            if(pptp_apply(ifname))
            {
                    F.act.value = "save";
                    F.submit();
            }
    }
    else
            F.act.value = "";
}


function OnCheckEnableLCP()
{
	var F = document.netconf_wansetup; 

	if(!F.lcp_flag)
		return;

        if(F.lcp_flag.checked == true)
	{
		EnableObj(F.lcp_echo_interval);
		EnableObj(F.lcp_echo_failure);
                
	}
        else
	{
		DisableObj(F.lcp_echo_interval);
		DisableObj(F.lcp_echo_failure);
	}
               
}


function ChangeLanIPSetupForm(F, flag)
{
        if(F.use_local_gateway &&  (F.use_local_gateway.checked == false))
        {
                DisableIP('gw');
                DisableIP('fdns');
                DisableIP('sdns');
        }
        else
        {
                if(flag || confirm(LAN_GATEWAY_WARNING_MSG))
                {
                        EnableIP('gw');
                        EnableIP('fdns');
                        EnableIP('sdns');
                }
                else
                {
                        if(F.use_local_gateway) F.use_local_gateway.checked = false;
                        DisableIP('gw');
                        DisableIP('fdns');
                        DisableIP('sdns');
                }
        }
}

</script>
