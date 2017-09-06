<script>

//natrouterconf_porttrigger

function addTrigger()
{
	var F = document.ptrigger_setup_fm;
	F.act.value = "add";
	F.submit();
}

function deleteTrigger()
{
	var F = document.ptrigger_list_fm;
	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		F.act.value = "del";
		F.submit();
	}
}

//natrouterconf_twinipdmz

function submit_twinipdmz(wid, cur_mode, is_twinip)     
{ 
	var F = document.ipclone;       
	var obj, mode_obj;

	mode_obj = document.getElementsByName('w'+wid+'mode');
	mode =  GetRadioValue(mode_obj);
	if (mode == DMZTWINIP_MODE_DMZ )
	{
		var ip = 'w'+wid+'ip';
		if (obj=CheckIP(ip))
		{
			alert(MSG_INVALID_IP);
			obj.focus(); obj.select();
			return; 
		}
	}
	else if (mode == DMZTWINIP_MODE_TWINIP)
	{ 
		var hw = 'w'+wid+'hw';   
		var leasetime = 'w'+wid+'leasetime';   
		if (obj=CheckHW(hw))
		{
			alert(MSG_INVALID_HWADDR);
			obj.focus(); obj.select();
			return; 
		}
		if (document.getElementById(leasetime).value < 60)
		{
			alert(NATCONF_TWINIPDMZ_UPDATE_TIME);
			return; 
		}
	} 

	if (cur_mode == DMZTWINIP_MODE_TWINIP && is_twinip && !confirm(NATCONF_TWINIPDMZ_WARNING))
	{
		//F.w1mode[DMZTWINIP_MODE_TWINIP].checked = true;
		mode_obj[DMZTWINIP_MODE_TWINIP].checked = true;
		select_twinipdmz(DMZTWINIP_MODE_TWINIP, wid);
		return;
	}	

	F.wanid.value = wid;    
	F.act.value = 'w'+wid+'dmztwiip';       
	F.submit();     
} 

function get_hwaddr(obj,wid, hw_addr)        
{ 
        if (obj.checked == false)
                ResetHW('w'+wid+'hw');
        else
                SetHW('w'+wid+'hw', hw_addr);

} 

function select_twinipdmz(mode, wid)
{ 
        if (mode == 1)
        { 
                HideIt('w'+wid+'hwaddr'); 
                HideIt('w'+wid+'lease_time'); 
               // HideIt('twinip_info'); 
                ShowIt('w'+wid+'ipaddr'); 
        } 
        else if (mode == 2) 
        { 
                ShowIt('w'+wid+'hwaddr'); 
                ShowIt('w'+wid+'lease_time'); 
                //HideIt('twinip_info'); 
                HideIt('w'+wid+'ipaddr'); 
        } 
        else    
        { 
                HideIt('w'+wid+'hwaddr'); 
                HideIt('w'+wid+'lease_time'); 
               // HideIt('twinip_info'); 
                HideIt('w'+wid+'ipaddr'); 
        } 
} 

//natrouterconf_misc

function addFtpPort(max_port)   
{ 
        var F = document.natrouterconf_misc_fm; 
        if (F.ftp_port_count.value >= max_port) 
                alert(NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT) 
        else if (F.ftp_port.value == '') 
                alert(NATCONF_INTAPPS_FTP_PORT_EMPTY) 
        else if (F.ftp_port.value > 65535) 
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else 
        { 
                F.act.value = 'addftpport';     
                F.submit();     
        } 
}  

function delFtpPort()   
{ 
        var F = document.natrouterconf_misc_fm; 
        F.act.value = 'delftpport';     
        F.submit();     
} 

function setMulticast() 
{ 
        var F = document.natrouterconf_misc_fm; 
        F.act.value = 'mc'; 
        F.submit();     
} 

//natrouterconf_router

function AddSubmit()   
{ 
        var F = document.router_setup_fm;
        var obj;
        if (obj=CheckIP('targetip'))    
        { 
                alert(MSG_INVALID_IP);
                obj.focus();    
                obj.select();   
                return  
        } 
        else if (F.rtselect.value == 'net' && checkRange(F.netmask.value,1,32)) 
        { 
                F.netmask.focus();      
                F.netmask.select();     
                return  
        } 
        else if (obj=CheckIP('gw'))     
        { 
                alert(MSG_INVALID_IP);
                obj.focus();    
                obj.select();   
                return  
        } 
        F.act.value = 'add';    
        F.submit();     
} 


function rttypeOnchange()       
{ 
        var F = document.router_setup_fm;
        if (F.rtselect.value == 'host') 
                DisableObj(F.netmask);  
        else 
                EnableObj(F.netmask);   
} 


function deleteRT()     
{ 
        var F = document.router_list_fm;        
        if (confirm(NETCONF_ROUTE_ENTRY_DELETE))    
        { 
                F.act.value ='del';     
                F.submit();     
        } 
        else 
                alert(NETCONF_ROUTE_ENTRY_SELECT);
} 

//natrouterconf_portforward
function addPortForward()
{
        var F = document.portforward_setup_fm; 
        var obj; 
        if (F.rule.value > MAX_PORT_FORWARD)
        { 
                alert(NATCONF_PORTFORWARD_NO_MORE_RULE); 
                return;
        }
        else if (F.name.value == '')
        { 
                alert(MSG_RULE_NAME_IS_BLANK);
                F.name.focus();
                F.name.select();
                return;
        }
        else if (obj=CheckIP('os_ip'))
        {
                alert(NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS);
                obj.focus();
                obj.select();
                return;
        }
        else if (F.protocol.disabled == false)
        {
                if (F.i_port1.value == '')
                {
                        alert(NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkRange(F.i_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkOptionalRange(F.i_port2.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if ((F.i_port2.value != '') && 
				(parseInt(F.i_port1.value) > parseInt(F.i_port2.value)))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if (checkOptionalRange(F.o_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.o_port1.focus();
                        F.o_port1.select();
                        return;
                }
                else if (checkOptionalRange(F.o_port2.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.o_port2.focus();
                        F.o_port2.select();
                        return;
                }
                else if ((F.o_port2.value != '') && 
				(parseInt(F.o_port1.value) > parseInt(F.o_port2.value)))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE);
                        F.o_port2.focus();
                        F.o_port2.select();
                        return;
                }
        }
	if (F.act.value == '')
        	F.act.value = 'add_pf';

        F.submit();
}

function cancelmodiPortForward()
{
	var F = document.portforward_setup_fm;
	F.act.value = '';
	F.submit();
}

function deletePortForward()
{
	var F = document.portforward_list_fm;
	var chkchk=false;
	var len = F.fdel.length
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
		} else 
			alert(MSG_SELECT_RULE_TO_DEL);
	}
}

function RunPortForward()
{
	var F = document.portforward_list_fm;
	var chkchk=false;
	var len = F.rdi.length;
	if(len)
	{
		for (i=0; i < len; i++)
		{
			if (F.rdi[i].type == 'checkbox')
				if (F.rdi[i].checked)
					chkchk = true;
		}
	}
	else 
	{
		if (F.rdi.checked)
			chkchk = true;
	}	
	if (chkchk == true)
	{
		if (confirm(NATCONF_PORTFORWARD_RUN_RULE))
		{
			F.act.value = 'rule_disable';
			F.submit();
		}
	} else 
	{
		if (confirm(MSG_ALL_STOP_RULE))
		{
			F.act.value = 'rule_disable';
			F.submit();
		}
	}
}

function rule_get(idx,name,proto,wan,iport1,iport2,ip1,ip2,ip3,ip4,oport1,oport2)
{
	var F = document.portforward_setup_fm;
	var F2 = document.portforward_list_fm;
	F.name.value = name;
	F.name.readOnly = true;
	if (proto == 'tcp')
	{
		EnableObj(F.protocol);
		F.protocol.options[0].selected = true;
	}
	else if (proto == 'udp')
	{
		EnableObj(F.protocol); 
		F.protocol.options[1].selected = true;
	}
	else
		DisableObj(F.protocol);

	if (F.wan_name)
	{
		if (wan == '1')
			F.wan_name.options[0].selected = true;
		else
			F.wan_name.options[1].selected = true;
	}

	if (iport1 != '0') 
	{
		F.i_port1.value = iport1; 
	}
	else {
		F.i_port1.value = '';
	}
	if (iport1 != '0' && iport2 == '0') 
	{
		F.i_port2.value = ''; 
	}
	else if (iport2 != '0') 
	{
		F.i_port2.value = iport2; 
	}
	else {
		F.i_port2.value = '';
	}
	F.os_ip1.value = ip1; F.os_ip2.value = ip2;
	F.os_ip3.value = ip3; F.os_ip4.value = ip4;
	if (oport1 != '0') 
	{
		F.o_port1.value = oport1; 
	}
	else 
	{
		F.o_port1.value = '';
	}
	if (oport1 != '0' && oport2 == '0') 
	{
		F.o_port2.value = ''; 
	}
	else if (oport2 != '0') 
	{
		F.o_port2.value = oport2; 
	}
	else 
	{
		F.o_port2.value = '';
	}
	F.rule_index.value = idx;
	EnableObj(F.modify_cancel);
	DisableObj(F2.button_run);
	DisableObj(F2.button_del);

	F.forward_submit.value = MODIFY_OP;
	F.act.value = 'modify';
}
</script>
