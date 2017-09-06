<script>
// netconf_lansetup
function static_apply_basic(F)
{
	var obj;
    	if(obj=CheckIP('ip'))
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
        if(obj=CheckOptionalIP('gw'))
        //if(obj=CheckIP('gw'))
        {
                alert(MSG_INVALID_GATEWAY);
                obj.focus();
                obj.select();
                return 0;
        }
        if(obj=CheckOptionalIP('fdns'))
        //if(obj=CheckIP('fdns'))
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

        return 1;
}

function CheckLanIPChange(F)
{
	if (F.sel[0].checked == true)
    	{
    		if(!static_apply_basic(F))
			return 0;
		alert(NETCONF_IPCHANGE_CLOSEANDRECONNECT);
    	}
    	else if (F.sel[2].checked == true)
	{
		if(!confirm(NETCONF_NOIP_WARNING))
			return 0;
	}
	else
		alert(NETCONF_IPCHANGE_CLOSEANDRECONNECT);
	F.submit();

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
    //var F = document.forms[0];
    var F = document.netconf_lansetup2;
    if (F.dhcp_enable[0].checked == true)
    {
            EnableIP('spool_conf');
            EnableIP('epool_conf');
            EnableObj(F.domain);
            EnableIP('sm');
            EnableIP('gw');
            EnableIP('fdns');
            EnableIP('sdns');
    }
    else
    {
            DisableIP('spool_conf');
            DisableIP('epool_conf');
            DisableObj(F.domain);
            DisableIP('sm');
            DisableIP('gw');
            DisableIP('fdns');
            DisableIP('sdns');
    }
   // toggleDNS();
}

function applyLansetupDhcp()
{
    var obj;
    //var F = document.forms[1];
    var F = document.netconf_lansetup2;
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

// netconf_wansetup
function enableMaxIdle()
{
    var F=document.netconf_lanipsetup
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
function disableFormlanipsetup(flag)
{
    var mode;
    var F=document.netconf_lanipsetup

    ShowIt(flag);
    if (flag == "static")
    {
            HideIt('dynamic');
            HideIt('noip');
    }
    else if (flag == "dynamic")
    {
            HideIt('static');
            HideIt('noip');
    }
    else if (flag == "noip")
    {
            HideIt('static');
            HideIt('dynamic');
    }
}


function reloadPage()
{
	var F=document.forms[0];
	location.href( "/cgi-bin/timepro.cgi?tmenu=netconf&smenu=waninfo");
	//self.close();
}
		

</script>
