<script>


//expertconf_remotepc
function AddPC()
{
        var F=document.remotepc_fm;
        var obj;
        if(F.pcname.value=='')
        {
                alert(EXPERTCONF_WOL_PC_NAME_IS_BLANK);
                F.pcname.focus();
                return;
        }
        else if(obj=CheckHW('hw'))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
        }
        else
        {
                F.act.value='add';
                F.submit();
        }
}
function DeleteRemotePC(index)
{
        var F=document.remotepc_fm;
        if (confirm(EXPERTCONF_WOL_DEL_PC))
        {
                F.act.value='del';
                F.submit();
        }
}

function WakeUp(index)
{
        var F=document.remotepc_fm;
        if (confirm(EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC))
        {
                F.act.value = 'wake';
                F.submit();
        }
}

//expertconf_hostscan
function hostscanSel_disableForm()
{
	var F=document.hostscan_fm;
	if (F.ping_type.value == ICMP_PING )
	{
		EnableObj(F.datasize);
	}
	else if(F.ping_type.value ==ARP_PING)  
	{
		DisableObj(F.datasize);
	}
}


function hostscanRadio_disableForm(flag)
{
	var F=document.hostscan_fm;
	if ( flag == 0)
	{
		F.sel.value =  PING_SCAN;
		EnableIP('ip');
		EnableObj(F.count);
		EnableObj(F.timeout);
		EnableObj(F.datasize);
		EnableObj(F.ping_type);
		DisableIP('pip');
		DisableObj(F.start);
		DisableObj(F.end);
		if(F.ping_type.value == ARP_PING)
			DisableObj(F.datasize);
	}
	else if(flag == 1)
	{
		F.sel.value = TCP_PORT_SCAN;
		DisableIP('ip');
		DisableObj(F.count);
		DisableObj(F.timeout);
		DisableObj(F.datasize);
		DisableObj(F.ping_type);
		EnableIP('pip');
		EnableObj(F.start);
		EnableObj(F.end);
	}
}


function hostscanStart()
{
        var F=document.hostscan_fm;
        var obj;

        if(F.sel[0].checked == true)
        {
                if(obj=CheckIP('ip'))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
                        obj.select();
                        return;
                }
                else if(F.timeout.value=='')
                {
                        alert(SYSINFO_HOST_INVALID_TIMEOUT);
                        F.timeout.focus();
                        F.timeout.select();
                        return;
                }
                else if(checkRange(F.timeout.value, 1, 99))
                {
                        alert(SYSINFO_HOST_TIMERANGE);
                        F.timeout.focus();
                        F.timeout.select();
                        return 0;
                }

                if(F.ping_type.value == 'icmp')
                {
                        if(F.datasize.value=='')
                        {
                                alert(SYSINFO_HOST_INVALID_DATASIZE);
                                F.datasize.focus();
                                F.datasize.select();
                                return 0;
                        }
                        else if(checkRange(F.datasize.value, 0, 65535))
                        {
                                alert(SYSINFO_HOST_DATARANGE);
                                F.datasize.focus();
                                F.datasize.select();
                                return 0;
                        }
                }
        }
	else if(F.sel[1].checked == true)
        {
                if(obj=CheckIP('pip'))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
                        obj.select();
                        return;
                }
                if(F.start.value=='')
                {
                        alert(SYSINFO_HOST_INVALID_START);
                        F.start.focus();
                        F.start.select();
                        return;
                }
                else if(checkRange(F.start.value, 0, 65535))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.start.focus();
                        F.start.select();
                        return;
                }

                if( F.end.value == '' )
                        F.end.value = F.start.value;
                else if(checkRange(F.end.value, 0, 65535))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.end.focus();
                        F.end.select();
                        return;
                }

                if(parseInt(F.start.value) > parseInt(F.end.value))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.end.focus();
                        F.end.select();
                        return;
                }
        }
        F.act.value = 'start';
        F.submit();
}

function hostscanStop()
{
	var F=document.hostscan_fm;
	F.act.value = 'stop';
	F.submit();
}

function hostscanClear()
{
	var F=document.hostscan_fm;
	F.act.value = 'clear';
	F.submit();
}

// expertconf_kai
function EnableStaticHw(obj)
{
      if(obj.checked == true) EnableHW('static_hw');
      else DisableHW('static_hw');
}


function ApplyKAIConfig()
{
        var F = document.kai_basicconf_fm;
      var mode, oldmode;

      oldmode = F.cmode.value;
      mode = GetRadioValue(F.mode);
      if( mode == oldmode )
              return;
      if( oldmode != KAID_MODE_INIT )
      {
              ApplyReboot(F,'kai');
              return;
      }
        F.act.value = 'changemode';
        F.submit();
}

function RestartKai()
{
        var F = document.kai_fm;
        alert(KAID_RESTART_KAI_UI);
        F.act.value = kaid_restart;
        F.submit();
}

function ScanPSP()
{
        var F = document.kai_fm;
        var obj;
        if(F.psphw_chk && F.psphw_chk.checked == true)
        {
                obj=CheckHW('static_hw');
                if(obj)
                {
                        obj.focus();
                        obj.select();
                        return;
                }
        }
        F.act.value = "scanpsp";
        F.submit();
}

function StopPSP()
{
        var F = document.kai_fm;
        F.act.value = "stoppsp";
        F.submit();
}

function SelectObtServer()
{
        var F = document.kai_fm;
        var chkstat=false;
        for(i=0;i<F.obtchk.length;i++)
        {
                if(F.obtchk[i].checked)
                {
                        chkstat=true;
                        break;
                }
        }
        if(chkstat==false)
        {
                alert(KAID_MUST_SELECT_OBT_SERVER);
        }
        else
        {
                F.act.value = "selectobt";
                F.submit();
        }
}

function ChangeObtServer()
{
        var F = document.kai_fm;
        alert(KAID_RESTART_KAI_UI);
        F.act.value = "changeobt";
        F.submit();
}

 // expertconf_pptpvpn
function AddPPTPServerUser()
{
        var F=document.pptpvpn_account_fm;
        if(F.account.value == '')
        {
                alert(EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK);
                F.account.focus();
                return;
        }
        else if(F.password.value == '')
        {
                alert(EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK);
                F.password.focus();
                return;
        }
        else if(obj=CheckIP('ip'))
        {
                alert(EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID);
                obj.focus();
                obj.select();
        }
        else
        {
                F.act.value = 'add';
                F.submit();
        }
}

function RemovePPTPUser()
{
        var F = document.pptpvpn_account_fm;
        if (confirm(EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE))
        {
                F.act.value = 'del';
                F.submit();
        }
}

function DisconnectPPTPUser()
{
        var F = document.pptpvpn_account_fm;
        F.act.value = 'disconnect';
        F.submit();
}

function ApplyPPTP()
{
        var F = document.pptpvpn_conf_fm;
        F.act.value='apply';
        F.submit();
}

// expertconf_ddns
function RefreshInfo() 
{ 
        var F = document.dyndns_conf; 
        F.act.value = ""; 
        F.submit(); 
} 
function RefreshHost() 
{ 
        var F = document.dyndns_conf; 
        F.act.value = "refreshhost"; 
        F.submit(); 
} 

function CheckipTIMEorg(value)
{
        if(value.indexOf('iptime.org')==-1)
                return 0;
        else
        {
                org_str=value.substring(value.lastIndexOf('.')+1);
                if(org_str!='org')
                        return 0;
                else
                {
                        org_str=value.substring(0,value.lastIndexOf('.'));
                        iptime_str=org_str.substring(org_str.lastIndexOf('.')+1);
                        if(iptime_str=='iptime')
                                return 1;
                }
        }
}

function AddHost() 
{ 
        var F = document.dyndns_conf; 

        var selectval = F.select_ddns.options[F.select_ddns.selectedIndex].value; 
        if( F.hostname.value.length == 0) 
        { 
                alert( EXPERTCONF_DDNS_HOSTNAME_IS_BLANK); 
                F.hostname.focus(); 
                F.hostname.select(); 
                return; 
        } 

        if( (selectval == 'iptime_null') ) 
        { 
                if( (F.iptimecnt.value == 1) ) 
                { 
                        alert( EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1); 
                        return; 
                } 
		if(!CheckipTIMEorg(F.hostname.value))
		{
			alert( EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG); 
			F.hostname.focus(); 
			F.hostname.select(); 
			return; 
		}
                if( (F.userid.value.indexOf('@') == -1) ) 
                { 
                        alert( EXPERTCONF_IPTIMEDDNS_INVALID_USERID); 
                        F.userid.focus();
                        F.userid.select();
                        return; 
                } 
        } 
        else if( (selectval == 'dyndns_null') && ( F.dyndnscnt.value == 5 )) 
        { 
                alert( EXPERTCONF_DYNDNS_NOMORE_WANRING1); 
                return; 
        } 
	
        if( F.userid.value.length == 0 ) 
        { 
                alert(MSG_BLANK_ACCOUNT); 
                F.passwd.focus(); 
                F.passwd.select(); 
                return; 
        }

        if( F.passwd.value.length == 0 ) 
        { 
                alert(MSG_BLANK_PASSWORD); 
                F.passwd.focus(); 
                F.passwd.select(); 
                return; 
        }


        F.act.value = "addhost"; 
        F.submit(); 
} 

function DelHost() 
{ 
        var F = document.dyndns_conf; 
        F.act.value = "delhost"; 
        F.submit(); 
} 

var previous_select_val = "iptime_null"; 
function DisplayDesc(v) 
{ 
        var F = document.dyndns_conf; 

	if (navigator.appName.indexOf("Microsoft") != -1)
		document.getElementById(v).style.display = "block";
	else
		document.getElementById(v).style.display = "table-row";
				
        if( previous_select_val != "" ) 
                document.getElementById( previous_select_val ).style.display = "none"; 
        previous_select_val = v; 
} 

function send_EMAIL()
{
	F = document.forget_email
	if( (F.email.value.indexOf('@') == -1) )
	{
		F.email.focus();
		F.email.select();
		alert(INVALID_EMAIL_ADDRESS_STR);
		return;
	}
	F.submit();
}


</script>
