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
//      if( oldmode != KAID_MODE_INIT )
//     {
              ApplyReboot(F,'kai');
              return;
//      }
        F.act.value = 'changemode';
        F.submit();
}

function RestartKai()
{
        var F = document.kai_fm;
        alert(KAID_RESTART_KAI_UI);
        F.act.value = 'kaid_restart';
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


function ChangeKAIMac()
{
        var F = document.kai_fm;
        F.act.value = 'mac_clone';
        F.submit();
}



 // expertconf_pptpvpn
function AddPPTPServerUser()
{
        var F=document.pptpvpn_account_fm;


        if(CheckNoPassword(F)) return;

        if(F.captcha_code)
        {
                if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
                {
                        alert(SYSCONF_LOGIN_NEED_CAPTCHA_CODE);
                        F.captcha_code.focus();
                        return;
                }
                F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
        }

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
        else if(obj=CheckIPNetwork('ip'))
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

        if(CheckNoPassword(F)) return;

        if (confirm(EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE))
        {
                F.act.value = 'del';
                F.submit();
        }
}

function DisconnectPPTPUser()
{
        var F = document.pptpvpn_account_fm;

        if(CheckNoPassword(F)) return;

        F.act.value = 'disconnect';
        F.submit();
}

function ApplyPPTP()
{
        var F = document.pptpvpn_conf_fm;

        if(CheckNoPassword(F)) return;

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

        if(CheckNoPassword(F)) return;

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

        if(CheckNoPassword(F)) return;

        if(F.captcha_code)
        {
                if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
                {
                        alert(SYSCONF_LOGIN_NEED_CAPTCHA_CODE);
                        F.captcha_code.focus();
                        return;
                }
                F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
        }


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
                F.userid.focus(); 
                F.userid.select(); 
                return; 
        }

        if((selectval != 'iptime_null') && F.passwd && F.passwd.value.length == 0 ) 
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

        if(CheckNoPassword(F)) return;

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

	if(v == 'iptime_null')
		HideIt('passwd_row');
	else
		ShowIt('passwd_row');

} 

function InitDDNS()
{
        var F = document.dyndns_conf; 

	if(GetValue(F.select_ddns) == 'iptime_null')
		HideIt('passwd_row');
}

function send_EMAIL()
{
	F = document.forget_email;

        if(CheckNoPassword(F)) return;

	if( (F.email.value.indexOf('@') == -1) )
	{
		F.email.focus();
		F.email.select();
		alert(INVALID_EMAIL_ADDRESS_STR);
		return;
	}
	F.submit();
}


function ApplyAdvertise(act)
{
        var F=document.advertise_fm;

        F.act.value=act;
        F.submit();
}

function AutoConfirmAdvertise(on)
{
        var F=document.advertise_fm;

	if (on)
	{
		HideIt('confirm_msg');
		HideIt('confirm_btn');
		HideIt('allow_msg');
		HideIt('confirm_desc');
	}
	else
	{
		ShowIt('confirm_msg');
		ShowIt('confirm_btn');
		ShowIt('allow_msg');
		ShowIt('confirm_desc');
	}
}

function AddAdvertiseFreeDevice()
{
        var F=document.advertisefreedevice_fm;

	if (F.dev_desc.value=='')
	{
		alert(ACCESSLIST_WRITE_EXPLAIN);
		F.dev_desc.focus();
		return;
	}
	else if (obj=CheckIP('free_sip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus(); obj.select();
		return;
	}
	else if (obj=CheckIP('free_eip'))
	{
		alert(MSG_INVALID_IP);
		obj.focus(); obj.select();
		return;
	}
        else if((parseInt(F.free_sip4.value) +  parseInt(F.free_sip3.value) * 256 +
            parseInt(F.free_sip2.value) * 65536 +  parseInt(F.free_sip1.value) * 16777216 ) >
           (parseInt(F.free_eip4.value) +  parseInt(F.free_eip3.value) * 256 +
            parseInt(F.free_eip2.value) * 65536 +  parseInt(F.free_eip1.value) * 16777216 ))
        {
                F.free_eip4.focus();
                F.free_eip4.select();
                return 0;
        }

	else
	{
		F.act.value='add';
		F.submit();
	}
}

function DeleteAdvertiseFreeDevice(index)
{
        var F=document.advertisefreedevice_fm;

        if (confirm(MSG_DELETE_RULE_CONFIRM))
        {
                F.act.value='del';
                F.submit();
        }
}


function CheckIPTVForm()
{
        var F = document.iptv_fm;

        if (F.mc_run)
        {
                if (GetRadioValue(F.mc_run) == 0)
                {
                        if (F.mcgroup_bt) DisableObj(F.mcgroup_bt);
                }
                else if (GetRadioValue(F.mc_run) == 1)
                {
                        if (F.mcgroup_bt) DisableObj(F.mcgroup_bt);
                }
                else
                {
                        if (F.mcgroup_bt) EnableObj(F.mcgroup_bt);
                }
        }


}


function setIPTV()
{
	var F = document.iptv_fm;

	if ((F.cur_op.value == 1) || (GetRadioValue(F.mc_run) == 1))
	{
		ApplyReboot(F, 'igmp');
	}
	else
	{
		F.act.value = 'mc';
		F.submit();
	}
}


</script>
