<script>
// netconf_lansetup
function  ChangeDHCPServerOp()
{
    var F = document.basic_lan_setup_fm;

    var dhcp_op = GetRadioValue(F.dhcp_enable);

    if (dhcp_op == 'on')
    {
            EnableIP('spool_conf');
            EnableIP('epool_conf');
            EnableObj(F.domain);
            if(F.dhcp_auto_detect) F.dhcp_auto_detect.disabled = false;
            if(F.dhcp_access_policy) F.dhcp_access_policy.disabled = false;

    }
    else
    {
            DisableIP('spool_conf');
            DisableIP('epool_conf');
            DisableObj(F.domain);
             if(F.dhcp_auto_detect) F.dhcp_auto_detect.disabled = true;
            if(F.dhcp_access_policy) F.dhcp_access_policy.disabled = true;
    }
}

function ApplyLansetupDhcp()
{
	var obj;
	var F = document.basic_lan_setup_fm;
	var dhcp_op = GetRadioValue(F.dhcp_enable);
	var sm = new Array();
	var maskvalue = new Array();
	var lansubnet, i, j;
	var obj;
	var newip, newsm;
	
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

	if(GetNetworkAddress('ip','sm') == F.wan1subnet.value )
	{
		alert(NETCONF_INTERNAL_INVALID_NETWORK);
		return 0;
	}

	if (dhcp_op == 'on')
	{
		if(obj=CheckIP('spool_conf'))
		{
			obj.focus();
			obj.select();
			alert(NETCONF_INTERNAL_INVALID_DHCP_S_ADDR);
			return 0;
	       	}
		else if(obj=CheckIP('epool_conf'))
		{
			obj.focus(); 
			obj.select(); 
			alert(NETCONF_INTERNAL_INVALID_DHCP_E_ADDR); 
			return 0;
		} 
		else if (parseInt(F.spool_conf4.value) > parseInt(F.epool_conf4.value))
		{
		       	alert(NETCONF_INTERNAL_INVALID_DHCP_ADDR);
			return 0;
		}
		else if (!CheckSameSubnet('ip','spool_conf', 'sm'))
		{
		       	alert("내부 IP주소와 DHCP 시작 주소는 같은 네트워크 주소를 가져야 합니다.");
			return 0;
		}
		else if (!CheckSameSubnet('ip','epool_conf', 'sm'))
		{
		       	alert("내부 IP주소와 DHCP 끝 주소는 같은 네트워크 주소를 가져야 합니다.");
			return 0;
		}
	}

	newip = F.ip1.value+'.'+F.ip2.value+'.'+F.ip3.value+'.'+F.ip4.value;
	newsm = F.sm1.value+'.'+F.sm2.value+'.'+F.sm3.value+'.'+F.sm4.value;

	if( F.old_ip.value != newip  || F.old_sm.value != newsm )
	{
		F.act.value = 'dhcp_conf';
		ApplyReboot(F, 'lanip_chg');
	}
	else
	{
		F.act.value = 'dhcp_conf';
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

var DhcpStaticData = new Array(20);
for (var i=0; i<20; i++)
	DhcpStaticData[i] = {op:"", mac:"", ip:""};
var ModifyIndex;

function DrawStaticLease(tbodyID)
{
	var F = static_lease.document.static_lease_fm;
	var tr, td, doc;

	document.static_lease_fm.allchk.checked = false;

	doc = static_lease.document;
	tbody = doc.getElementById(tbodyID);

	// clear child nodes
	while (tbody.childNodes.length > 0) 
	        tbody.removeChild(tbody.firstChild);

	// create holder for accumulated tbody elements and text nodes
	var frag = doc.createDocumentFragment();

	for (var i=0; i< DhcpStaticData.length; i++)
	{
		if (DhcpStaticData[i].op == "")
			continue;

		tr = createElementTR(doc);
		td = createElementTD(doc, tr, "", "<input type='checkbox' name='chkopt'>","center","46","");
		td = createElementTD(doc, tr, i+1, "","center","60","");
		td = createElementTD(doc, tr, DhcpStaticData[i].op, "","center","60","");
		td = createElementTD(doc, tr, DhcpStaticData[i].mac, "","center","257","");
		td = createElementTD(doc, tr, DhcpStaticData[i].ip, "","center","257","");

		frag.appendChild(tr);
	}
	if (!tbody.appendChild(frag)) {
	    	alert("This browser doesn't support dynamic tables.");
	}
}

function MakeStaticLease(idx, op, mac, ip)
{
	DhcpStaticData[idx].op = op;
	DhcpStaticData[idx].mac = mac;
	DhcpStaticData[idx].ip = ip;
}

function add_static_lease_row(F)
{
	var i;

	for (i=0; i < DhcpStaticData.length; i++) {
		if (DhcpStaticData[i].op == "")
			break;
	}

	if (i >= DhcpStaticData.length) {
		alert(MSG_ADD_NOMORE);
		return;
	}

	DhcpStaticData[i].op = "ON";
	DhcpStaticData[i].mac = F.manual_hw1.value+":"+F.manual_hw2.value+":"+F.manual_hw3.value+":"+F.manual_hw4.value+":"+F.manual_hw5.value+":"+F.manual_hw6.value;
	DhcpStaticData[i].ip =  F.manual_ip1.value+"."+F.manual_ip2.value+"."+F.manual_ip3.value+"."+F.manual_ip4.value;

	F.addbt.value = "추가";
}

function modify_static_lease_row(F)
{
	DhcpStaticData[ModifyIndex].mac = F.manual_hw1.value+":"+F.manual_hw2.value+":"+F.manual_hw3.value+":"+F.manual_hw4.value+":"+F.manual_hw5.value+":"+F.manual_hw6.value;
	DhcpStaticData[ModifyIndex].ip =  F.manual_ip1.value+"."+F.manual_ip2.value+"."+F.manual_ip3.value+"."+F.manual_ip4.value;
	F.addbt.value = "추가";
}

function AddStaticLease()
{
	var F = document.static_lease_fm;
	var obj;

	if(obj=CheckIP('manual_ip'))
	{
        	alert(MSG_INVALID_IP);
		obj.focus();
		obj.select();
		return;
	}
	else if(obj=CheckHW('manual_hw'))
	{
        	alert(MSG_INVALID_HWADDR);
		obj.focus();
		obj.select();
		return;
	}

	if (F.addbt.value == "변경")
		modify_static_lease_row(F);
	else                      
		add_static_lease_row(F);

	F.manual_hw1.value = "";
	F.manual_hw2.value = "";
	F.manual_hw3.value = "";
	F.manual_hw4.value = "";
	F.manual_hw5.value = "";
	F.manual_hw6.value = "";

	F.manual_ip1.value = "0";
	F.manual_ip2.value = "0";
	F.manual_ip3.value = "0";
	F.manual_ip4.value = "0";

	DrawStaticLease('static_leaseTable')
}

function StaticLeaseOnOff()
{
	var chk;

	chk = static_lease.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				if (DhcpStaticData[i].op == "ON")
					DhcpStaticData[i].op = "OFF";
				else
					DhcpStaticData[i].op = "ON";
			}
		}
	}

	DrawStaticLease('static_leaseTable')
}

function StaticLeaseModify()
{
	var chk, cnt = 0, idx;
        var F = document.static_lease_fm;
	var mac, ip;

	chk = static_lease.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				ModifyIndex = i; 
				cnt++;
			}
		}
		if (cnt == 0)
		{
			alert(MSG_MODIFY_NOSEL);
			return;
		}
		if (cnt > 1)
		{
			alert(MSG_MODIFY_ONE);
			return;
		}

		mac = DhcpStaticData[ModifyIndex].mac.split(":");
		ip = DhcpStaticData[ModifyIndex].ip.split(".");

		F.manual_hw1.value = mac[0];
		F.manual_hw2.value = mac[1];
		F.manual_hw3.value = mac[2];
		F.manual_hw4.value = mac[3];
		F.manual_hw5.value = mac[4];
		F.manual_hw6.value = mac[5];

		F.manual_ip1.value = ip[0];
		F.manual_ip2.value = ip[1];
		F.manual_ip3.value = ip[2];
		F.manual_ip4.value = ip[3];

		F.addbt.value = "변경";
	}
}

function StaticLeaseDel()
{
	var chk;
	var cnt = 0;

	chk = static_lease.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				DhcpStaticData[i].op = "";
				cnt++;
			}
		}

		for (var i=1; i<=cnt; i++)
		{
			for (var j=0; j<DhcpStaticData.length; j++)
			{
				if (DhcpStaticData[j].op == "")
				{
					if (j != DhcpStaticData.length-1)
					{
						for (var k=j; k<DhcpStaticData.length-1; k++)
						{
							DhcpStaticData[k].op = DhcpStaticData[k+1].op; 
							DhcpStaticData[k].mac = DhcpStaticData[k+1].mac; 
							DhcpStaticData[k].ip = DhcpStaticData[k+1].ip; 
						}
						DhcpStaticData[k].op = "";
					}
					else
						DhcpStaticData[j].op == "";
				}
			}
		}
	}

	DrawStaticLease('static_leaseTable')
}

function StaticLeaseApply()
{
        var F = static_lease.document.static_lease_fm;

	F.list.value = "";

	for (var j=0; j<DhcpStaticData.length; j++)
	{
		if (DhcpStaticData[j].op == "") 
			continue;
		F.list.value += DhcpStaticData[j].op+","+DhcpStaticData[j].mac+","+DhcpStaticData[j].ip+"&";
	}

	F.submit();
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
    var F=document.netconf_wansetup
    if(F.idle_flag.checked == true)
    {
            EnableObj(F.timeout);
            if(F.timeout.value == "")
                    F.timeout.value = "10";
    }
    else
    {
            DisableObj(F.timeout);
    }
}

function popupWindow(flag)
{
    winurl = "/cgi-bin/timepro.cgi?m1=popup&m2="+flag;
    wintop = (screen.height / 2) - 60;
    winleft = (screen.width / 2) - 150;

    win=window.open(winurl,"","toolbar=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=400,height=100,top=" + wintop + ",left=" + winleft);
    win.opener=self;
}

function disableFormWansetup(flag)
{
    var mode;
    var F=document.netconf_wansetup
    if (flag == "static")
    {
            ShowIt('static');
            HideIt('pppoe');
            HideIt('dynamic');
    }
    else if (flag == "dynamic")
    {
            HideIt('static');
            HideIt('pppoe');
            ShowIt('dynamic');
    }
    else if (flag == "pppoe")
    {
            HideIt('static');
            ShowIt('pppoe');
            HideIt('dynamic');
    }

}
function check_dns()
{
    check_dns_dynamic();
    check_dns_pppoe();
}

function check_dns_dynamic()
{
    var obj;

    obj = document.getElementsByName('dns_dynamic_sel');
    mode = GetRadioValue(obj);

    if (mode == 1)
    {
            DisableIP('fdns_dynamic');
            DisableIP('sdns_dynamic');
            SetIP('fdns_dynamic', '0.0.0.0');
            SetIP('sdns_dynamic', '0.0.0.0')
    }
    else
    {
            EnableIP('fdns_dynamic');
            EnableIP('sdns_dynamic');
    }
}

function check_dns_pppoe()
{
    var obj;

    obj = document.getElementsByName('dns_pppoe_sel');
    mode = GetRadioValue(obj);

    if (mode == 1)
    {
            DisableIP('fdns_pppoe');
            DisableIP('sdns_pppoe');
            SetIP('fdns_pppoe', '0.0.0.0');
            SetIP('sdns_pppoe', '0.0.0.0')
    }
    else
    {
            EnableIP('fdns_pppoe');
            EnableIP('sdns_pppoe');
    }
}

function dynamic_apply()
{
    var F=document.netconf_wansetup
    var obj;

    obj = document.getElementsByName('hw_dynamic_clone_method');
    mode = GetRadioValue(obj);
    if (mode == 0)
    {
            if(obj=CheckHW('hw_dynamic'))
            {
                    alert(MSG_INVALID_HWADDR);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }
    if (F.dns_dynamic_chk && F.dns_dynamic_chk.checked == true )
    {
            if(obj=CheckIP('fdns_dynamic'))
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
    }
    return 1;
}

function pppoe_apply()
{
	var F=document.netconf_wansetup
	var obj;

	obj = document.getElementsByName('hw_pppoe_clone_method');
	mode = GetRadioValue(obj);
	if (mode == 0)
	{
		if(obj=CheckHW('hw_pppoe'))
		{
			alert(MSG_INVALID_HWADDR);
			obj.focus();
			obj.select();
			return 0;
		}
	}

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
//        else if ((F.idle_flag.checked == true) && checkRange(F.timeout.value, 0,1000))
//	{
//		F.userid.focus();
//		F.userid.select();
//              alert(NETCONF_INTERNET_KEEP_ALIVE_MSG);
//	}
//
        else
        {
		if (F.dns_pppoe_chk && F.dns_pppoe_chk.checked == true )
		{
			if(obj=CheckIP('fdns_pppoe'))
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
		}
                if(F.mtu.value >1492)
                {
                        alert(NETCONF_INTERNET_PPP_MTU_INVALID);
                        F.mtu.focus();
                        F.mtu.select();
                        return 0;
                }
	        return 1;
        }
	return 0;
}


function static_apply_basic()
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

    obj = document.getElementsByName('hw_static_clone_method');
    mode = GetRadioValue(obj);
    if (mode == 0)
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

function reloadPage()
{
	var F=document.forms[0];
	location.href( "/cgi-bin/timepro.cgi?m1=status&m2=internet");
	//self.close();
}
		
function apply_wansetup(wanname)
{
    var F=document.netconf_wansetup
    var obj;

    var wan_type=GetRadioValue(F.sel);

    if (wan_type == 'static')
    {
            if(static_apply_basic())
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
            if(dynamic_apply())
            {
                    F.act.value = "save";
		    //if(confirm(NETCONF_WANSETUP_CONFIRM_WANINFO))
		//	    reloadPage();
                    //popupWindow('dynamic&wan='+wanname);
                    F.submit();
            }
    }
    else if (wan_type == 'pppoe')
    {
            if(pppoe_apply())
            {
                    F.act.value = "save";
		  //  if(confirm(NETCONF_WANSETUP_CONFIRM_WANINFO))
		//	    reloadPage();
                    //popupWindow('pppoe&wan='+wanname);
                    F.submit();
            }
    }
    else
            F.act.value = "";
}

// basic_router
function ChangeRouterMode()
{
	var F = document.basic_router_fm;
	var wds_table=document.getElementById('wds_table');

	if(GetRadioValue(F.router_mode) == ROUTER_MODE_WDS_SLAVE)
		wds_table.style.display = 'block';
	else
		wds_table.style.display = 'none';
}

function ApplyRouterApMode()
{
	var F = document.basic_router_fm;

	if(GetRadioValue(F.router_mode) == ROUTER_MODE_WDS_SLAVE)
	{
		if(F.wds_name && F.wds_name.value == '')
		{
			alert(MSG_BLANK_SSID);
			F.wds_name.focus();
			return;
		}

		if(obj=CheckHW('wdshw'))
		{
        		alert(MSG_INVALID_BSSID);
			obj.focus();
			obj.select();
			return;
		}


		if(obj=CheckIP('ip'))
		{
		        alert(MSG_INVALID_IP);
		        obj.focus();
		        obj.select();
		        return 0;
		}
	}

	F.act.value = '1';
	F.submit();
}

</script>
