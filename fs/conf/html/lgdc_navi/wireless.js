<script>

// wirelessconf_advancedsetup
function SetToDefault()
{
        var F=document.wireless_params_fm;
        F.mode.value = 1;
        F.tx_power.value = 100;
        F.dtim.value = 1;
        F.beacon.value = 100;
        F.rts.value = 2347;
        F.bg_protect[0].checked = true;
        F.preamble[0].checked = true;
        F.wds_mode[1].checked = true;
}

function InitWirelessAdvancedMenu(F, mode)
{
        if(mode != WIRELESS_AP_MODE)
        {
                DisableObj(F.tx_power);
                DisableObj(F.beacon);
                DisableObjNames('bg_protect');
        }
}

function ApplyWirelessParams()
{
        var F=document.wireless_params_fm;

        if((F.tx_power.value > 100 ) || (F.tx_power.value < 0 ))
        {
                alert(DESC_INVALID_TX_POWER);
                F.tx_power.focus();
                return;
        }
        else if((F.rts.value > 2347 ) || (F.rts.value < 1 ))
        {
                alert(DESC_INVALID_RTS_THRESHOLD);
                F.rts.focus();
                return;
        }
        else if((F.beacon.value > 1024 ) || (F.beacon.value < 50 ))
        {
                alert(DESC_INVALID_BEACON_INTERVAL);
                F.beacon.focus();
                return;
        }
	else if((F.dtim.value > 255 ) || (F.dtim.value < 1 ))
        {
                alert(DESC_INVALID_DTIM);
                F.dtim.focus();
                return;
        }

        F.paramsact.value ="1";
        F.submit();
}

// wirelessconf_wdssetup
function WDSRun()
{
        var F = document.wdssetup_fm;
        F.act.value = "run";
        F.submit();
}

function WDSDelete() 
{
	var F = document.wdssetup_fm; 
	if (confirm(MSG_WDS_DEL_WARNING))
	{
		F.act.value = "del";
	       	F.submit();
	}
}

function AddWDS() 
{
	var F = document.wdssetup_fm;
	var obj;
	if(obj=CheckHW('wdshw'))
	{
                alert(MSG_INVALID_HWADDR);
		obj.focus();
		obj.select();
		return;
	}
        F.act.value = 'add';
        F.submit();
}

var WDS_OFF=0
var WDS_MASTER_MODE=1
var WDS_SLAVE_MODE=2

function Add_MSWDS()
{
	var F = document.wdssetup_fm;
	var obj;

	if(F.wds_name == '')
	{
                alert(MSG_BLANK_SSID);
		F.wds_name.focus();
		F.wds_name.select();
		return;
	}
        F.act.value = 'apply';
        F.submit();
}


function ChangeWdsMode()
{
	var F = document.wdssetup_fm;
        var mode = GetRadioValue(F.wds_mode);

	if( (mode == WDS_OFF) || (mode == WDS_MASTER_MODE))
	{
		DisableObj(F.wds_name);
		DisableObj(F.search_ap_bt);
		DisableRadio(F.prefer_mode);
	}
	else if(mode == WDS_SLAVE_MODE)
	{
		EnableObj(F.wds_name);
		EnableObj(F.search_ap_bt);
		EnableRadio(F.prefer_mode);
	}

}

// wirelessconf_macauth
// actval - policy, delmac, 
function ApplyMacAuth(actval)
{
        var F;
        if(actval=='policy')
                F=document.macauth_fm;
        else
	{
		document.macauth_fm.del_allchk.checked = false;
                F= macauth_dblist.document.macauth_dblist_fm;
	}

        F.act.value=actval;
        F.submit();
}

function AddMacAuth()
{
        var F= macauth_pcinfo.document.macauth_pcinfo_fm;
        var ifrname=macauth_pcinfo;

        if(F.manual_check.checked == true)
        {
                if(obj=CheckHWObj(ifrname,'hw'))
                {
                        alert(MSG_INVALID_HWADDR);
                        obj.focus();
                        obj.select();
                        return;
                }
        }

	document.macauth_fm.add_allchk.checked = false;
        F.act.value = 'addmac';
        F.submit();
}

function ChangeManualCheck()
{
        var F= document.macauth_pcinfo_fm;
        if(F.manual_check.checked == true)
                EnableHW('hw');
        else
                DisableHW('hw');
}

function InitMacAuthObj()
{
        DisableHW('hw');
}
function SubmitOtherIframe(act)
{
        var F;
        if(act=='addmac')
	{
                F= parent.macauth_dblist.document.macauth_dblist_fm;
		F.submit();
	}
        else if(act=='delmac')
	{
                F= parent.macauth_pcinfo.document.macauth_pcinfo_fm;
		F.submit();
	}

}

// wirelessconf_basicconf
function ChangeMBridgeAP()
{
	var F=document.basicsetup_fm;

	if(F.mbridge_apuse[1].checked == true ) // stop 
	{
		DisableObj(F.ssid);
		DisableObj(F.broadcast_ssid[0]);
		DisableObj(F.broadcast_ssid[1]);
	}
	else
	{
		EnableObj(F.ssid);
		EnableObj(F.broadcast_ssid[0]);
		EnableObj(F.broadcast_ssid[1]);
	}
}

function ChangeSecurityOp(mode)
{
	var F=document.security_setup_fm;
	var obj;

	if(mode == 0)
	{
		DisableAllObj(F);
		obj=document.getElementsByName('m1');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('m2');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('act');
		if(obj[0]) EnableObj(obj[0]);

		obj=document.getElementsByName('run');
		if(obj[0]) EnableObj(obj[0]);
		if(obj[1]) EnableObj(obj[1]);

		obj=document.getElementsByName('apply_bt');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('cancel_bt');
		if(obj[0]) EnableObj(obj[0]);
	}
	else
		EnableAllObj(F);
	ChangeWirelessEnc(F);
}


function InitSecurityOp(mode)
{
	var F=document.security_setup_fm;
	var obj;

	if(mode == 0)
	{
		DisableAllObj(F);
		obj=document.getElementsByName('m1');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('m2');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('act');
		if(obj[0]) EnableObj(obj[0]);

		obj=document.getElementsByName('run');
		if(obj[0]) EnableObj(obj[0]);
		if(obj[1]) EnableObj(obj[1]);

		obj=document.getElementsByName('apply_bt');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('cancel_bt');
		if(obj[0]) EnableObj(obj[0]);

		SetRadioValue( F.encrypt_type, "tkip");  
	}
	else
		EnableAllObj(F);
	ChangeWirelessEnc(F);
}



function InitGenKey(auth_type, wep_length, passphrase, default_key)
{
	var F=document.security_setup_fm;

	F.passphrase.value = passphrase;
	SetRadioValue(F.encrypt_type, "wep");
	SetRadioValue(F.auth_type, auth_type);
	SetRadioValue(F.wep_length, wep_length);
	SetRadioValue(F.run, 1);
	SetRadioValue(F.key_input_auto, 1);
	SetRadioValue(F.default_key, default_key);
	EnableAllObj(F);
//	DisableObj(F.key_input_auto[1]);
	DisableObj(F.key_input_type);
	ChangeWirelessEnc(F);
}


function ChangeWirelessAuth(F)
{
        var obj;
        var auth_type=F.auth_type.value;
       // var run = GetRadioValue(F.run);
        var run = 1;
        var encrypt_type = GetRadioValue(F.encrypt_type);

        DisableRadio(F.encrypt_type);
        if((auth_type == AUTH_OPEN) || (auth_type == AUTH_AUTO))
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_NOENC]);
                        EnableObj(F.encrypt_type[IDX_WEP64]);
                        EnableObj(F.encrypt_type[IDX_WEP128]);
                }

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES )
                        F.encrypt_type[IDX_NOENC].checked = true;
        }
        else if(auth_type == AUTH_KEY)
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_WEP64]);
                        EnableObj(F.encrypt_type[IDX_WEP128]);
                }

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_WEP64].checked = true;
        }
        else if((auth_type == AUTH_WPAPSK) || (auth_type == AUTH_WPA2PSK)
                        || (auth_type == AUTH_WPAPSKWPA2PSK) || (auth_type == AUTH_WPANONE))
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_TKIP]);
                        EnableObj(F.encrypt_type[IDX_AES]);
                }
                if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128 || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_TKIP].checked = true;
        }
        ChangeWirelessEnc(F);
}

function ChangeWirelessEnc(F)
{
        if(document.getElementById('wpapsk_key'))
        {
                var encrypt_type = GetRadioValue(F.encrypt_type);

                document.getElementById('wpapsk_key').style.display = "none";
                document.getElementById('wep_key').style.display = "none";

                if(encrypt_type == 'wep')
                        document.getElementById('wep_key').style.display = "block";
                if(encrypt_type == 'tkip' || encrypt_type== 'aes')
                        document.getElementById('wpapsk_key').style.display = "block";
                ChangeWirelessKeyInput(F,0);
        }
}

function SetWEPKeySize(F,size, reset)
{
       // F.wep_key1.size = size;
        F.wep_key1.maxLength = size;
        if(reset) F.wep_key1.value='';
       // F.wep_key2.size = size;
        F.wep_key2.maxLength = size;
        if(reset) F.wep_key2.value='';
       // F.wep_key3.size = size;
        F.wep_key3.maxLength = size;
        if(reset) F.wep_key3.value='';
       // F.wep_key4.size = size;
        F.wep_key4.maxLength = size;
        if(reset) F.wep_key4.value='';

//	if( F.wep_key1.value.length != size ) F.wep_key1.value='';
//	if( F.wep_key2.value.length != size ) F.wep_key2.value='';
//	if( F.wep_key3.value.length != size ) F.wep_key3.value='';
//	if( F.wep_key4.value.length != size ) F.wep_key4.value='';

}

function ChangeWirelessKeyInput(F,reset)
{
        var keysize;
        var encrypt_type = GetRadioValue(F.encrypt_type);
        var wep_length = GetRadioValue(F.wep_length);
        var key_input_auto = GetRadioValue(F.key_input_auto);
	var run = GetRadioValue(F.run);

        if(encrypt_type == 'wep')
        {
                if(wep_length== 64)
                        keysize = 5;
                else if(wep_length== 128)
                        keysize = 13;
		if(key_input_auto == 0 )
		{
                	if(F.key_input_type.checked == false)
                       	 	keysize = keysize * 2;
			DisableObj(F.passphrase);
			DisableObj(F.key_gen_bt);
                	if(run == 1)
				EnableObj(F.key_input_type);
		}
		else
		{
                	F.key_input_type.checked = false;
                       	keysize = keysize * 2;
			EnableObj(F.passphrase);
			EnableObj(F.key_gen_bt);
			DisableObj(F.key_input_type);
		}

                SetWEPKeySize(F,keysize, reset);
        }
}


function ChangeWirelessRegion(channel)
{
	var F=document.basicsetup_fm;
	var chnum;
        var oOption;

       	count = GetOptionCount(F.channel);

	if(F.region.value == REGION_USA) chnum=11;
	else if(F.region.value == REGION_JAPAN) chnum=14;
	else chnum=13;

	if(chnum == count) return;

	// remove all
	for( i = 0 ; i < count; i++ ) F.channel.remove(count-i-1);

	for( i = 1 ; i <= chnum; i++ )
	{
        	oOption = document.createElement("OPTION");
		oOption.text =  i + " [ 2." + (412+(i-1)*5) + " GHz ] ";
		oOption.value = i;
		F.channel.add(oOption,i-1);
	}

	if(channel)
	{
		if(channel > chnum) channel = 1;
		F.channel.value = channel;
	}

}

function SubmitGenKey()
{
	var F=document.security_setup_fm;

	if(F.passphrase.value == '')
	{
		alert("문자열을 입력하십시오.");
		F.passphrase.focus();
		return;
	}
	F.act.value = "genkey";
	F.submit();
}



function ChangeAutoChannel(method)
{
	var F=document.basicsetup_fm;

	if(method == 'auto')
		DisableObj(F.channel);
	else if(method == 'manual')
		EnableObj(F.channel);

}

function CheckWEPKeyLength(prefix,length)
{
	var i, allblank = 1;

	for( i = 1 ; i <= 4; i++)
	{
		obj=document.getElementsByName(prefix+i);
		if(!obj)
		{
			alert("Debug: Invalid Key Obj "+prefix+i);
			return 0;
		}
		if(obj[0].value.length) allblank = 0;
		if(obj[0].value && obj[0].value.length != length)
			return obj[0];
	}

	if(allblank)
	{
		obj=document.getElementsByName(prefix+'1');
		return obj[0];
	}
	return 0; 
}



function CheckWEPKeyHex(prefix)
{
	var i, allblank = 1;

	for( i = 1 ; i <= 4; i++)
	{
		obj=document.getElementsByName(prefix+i);
		if(!obj)
		{
			alert("Debug: Invalid Key Obj "+prefix+i);
			return 0;
		}
		if(obj[0].value.length) allblank = 0;
		if(IsHex(obj[0].value)) return obj[0];
	}

	if(allblank)
	{
		obj=document.getElementsByName(prefix+'1');
		return obj[0];
	}
	return 0; 
}


function ApplyWirelessSecurity(o_wmode)
{
        var F=document.security_setup_fm;
        var encrypt_type = GetRadioValue(F.encrypt_type);
        var auth_type = GetRadioValue(F.auth_type);
        var run = GetRadioValue(F.run);

	if(run == 0)
	{
        	F.act.value = "apply";
        	F.submit();
		return;
	}

        if(encrypt_type == 'wep')
        {
                var key_length, i,obj;
                var wep_length = GetRadioValue(F.wep_length);

		if(wep_length == 64) key_length = 5;
		else key_length = 13;
		if(F.key_input_type.checked == false )
                	key_length = key_length * 2;

                if(obj=CheckWEPKeyLength("wep_key",key_length))
                {
                        alert(MSG_INVALID_WEP_KEY_LENGTH);
                        obj.focus();
                        obj.select();
                        return;
                }

		if(F.key_input_type.checked == false )
                {
                        if(obj=CheckWEPKeyHex("wep_key",key_length))
                        {
                                alert(MSG_INVALID_WEP_KEY_HEXVALUE);
                                obj.focus();
                                obj.select();
                                return;
                        }
                }
        }
        else if(encrypt_type  == 'tkip' || encrypt_type == 'aes' )
        {
                if(F.wpapsk_key.value.length < 8)
                {
                        alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        F.wpapsk_key.focus();
                        F.wpapsk_key.select();
                        return;
                }
        }

        F.act.value = "apply";
        F.submit();
}


function ApplyWirelessConfig(o_wmode)
{
        var F=document.basicsetup_fm;
        var obj;

        if(F.ssid.value == '')
        {
                alert(MSG_BLANK_SSID);
                F.ssid.focus();
                return;
        }
        F.act.value = "apply";
        F.submit();
}



function OnDBLClickAPScanNoWizard(idx)
{
      var obj, encrypt_type, doc;

      if(idx == -1) 
      {
	      idx = parseInt(parent.iframe_scan.document.aplist_fm.apidx.value);
	      doc = parent.iframe_scan.document;
      }
      else
	      doc = document;

      if(doc.scan_fm.wds.value == 1)
      {
	      var remain, lastval;

	      obj=doc.getElementsByName('ssid');

	      if(!parent.opener.document.basic_router_fm)
	      {
		      alert( MSG_OPENER_PAGE_MOVED );
		      parent.close();
		      return;
	      }

	      if(parent.opener.document.basic_router_fm.wds_name)
	      	parent.opener.document.basic_router_fm.wds_name.value = obj[idx].value;

	      obj=doc.getElementsByName('bssid');

	      lastval = parseInt(obj[idx].value.charAt(16),16);
	      remain = lastval % 4;
	      if(remain)
	      {
		      lastval -= remain;
		      obj[idx].value = obj[idx].value.substr(0,16);
		      obj[idx].value +=  lastval.toString(16).toUpperCase();
	      }

	      SetHWDoc( parent.opener.document, 'wdshw', obj[idx].value ); 

              parent.opener.focus();
	      parent.close();
	      return;
      }


      if(!parent.opener.document.basicsetup_fm)
      {
	      alert( MSG_OPENER_PAGE_MOVED );
	      parent.close();
	      return;
      }

      obj=doc.getElementsByName('ssid');
      parent.opener.document.basicsetup_fm.ssid.value = obj[idx].value;
      obj=doc.getElementsByName('bssid');
      parent.opener.document.basicsetup_fm.bssid.value = obj[idx].value;
      obj=doc.getElementsByName('auth_type');
      if(obj[idx].value == AUTH_OPEN || obj[idx].value == AUTH_KEY )
              obj[idx].value = AUTH_AUTO;
      parent.opener.document.basicsetup_fm.auth_type.value = obj[idx].value;

      obj=doc.getElementsByName('encrypt_type');
      SetRadioValue(parent.opener.document.basicsetup_fm.encrypt_type, obj[idx].value );
      encrypt_type = obj[idx].value;

      ChangeWirelessAuth(parent.opener.document.basicsetup_fm);
      ChangeWirelessKeyInput(parent.opener.document.basicsetup_fm,1);
      parent.opener.document.getElementById('wpapsk_key').style.display = "none";
      parent.opener.document.getElementById('wep_key').style.display = "none";


      if (navigator.appName.indexOf("Microsoft") != -1)
      {
	      if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
		      parent.opener.document.getElementById('wep_key').style.display = "block";
	      if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES)
		      parent.opener.document.getElementById('wpapsk_key').style.display = "block";
      }
      else
      {
	      if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
		      parent.opener.document.getElementById('wep_key').style.display = "table-row";
	      if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES)
		      parent.opener.document.getElementById('wpapsk_key').style.display = "table-row";
      }


      if(parent.opener.document.basicsetup_fm.ssid.value == '')
      {
              alert(MSG_BLANK_REQUEST_SSID);
              parent.opener.focus();
              parent.opener.document.basicsetup_fm.ssid.focus();
      }
      else if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
      {
              alert(MSG_INVALID_REQUEST_KEY);
              parent.opener.focus();
              parent.opener.document.basicsetup_fm.wep_key1.focus();
              parent.opener.document.basicsetup_fm.wep_key1.select();
      }
      else if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES)
      {
              alert(MSG_INVALID_REQUEST_KEY);
              parent.opener.focus();
              parent.opener.document.basicsetup_fm.wpapsk_key.focus();
              parent.opener.document.basicsetup_fm.wpapsk_key.select();
      }
      else
      {
              alert(MSG_INVALID_REQUEST_APPLY);
              parent.opener.focus();
      }

      parent.close();
}

function OnDBLClickChannelScanNoWizard(idx)
{
      if(!parent.opener.self.document.basicsetup_fm)
      {
	      alert( MSG_OPENER_PAGE_MOVED );
	      parent.close();
	      return;
      }

        if(idx == -1) idx = parseInt(parent.iframe_scan.document.channellist_fm.channel_idx.value);
        alert(MSG_APPLY_REQUEST_KEY);

        parent.opener.self.document.basicsetup_fm.channel.value = idx+1;
        parent.opener.self.document.basicsetup_fm.channel.focus();
        parent.opener.focus();
        parent.close();
}


var CheckStatus = 0;
function SetCheckStatus()
{
	CheckStatus = 1;
}

function ClickWirelessAdvanced()
{
	var F=document.basicsetup_fm;

	if(F.advanced_flag.value == 0)
	{
		ShowIt('wireless_advanced');
		F.advanced_flag.value =1;
	}
	else
	{
		HideIt('wireless_advanced');
		F.advanced_flag.value =0;
	}
}

</script>
