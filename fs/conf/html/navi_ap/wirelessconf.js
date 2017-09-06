<script>

// wirelessconf_advancedsetup
function SetToDefault()
{
        var F=document.wireless_params_fm;
        F.tx_power.value = 100;
        F.beacon.value = 100;
        F.rts.value = 2347;
        F.frag.value = 2346;
        F.bg_protect[0].checked = true;
        F.preamble[0].checked = true;
        F.short_slot[0].checked = true;
        F.tx_burst[0].checked = true;
        F.aggregation[0].checked = true;
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

        if((F.tx_power.value > 100 ) || (F.tx_power.value < 1 ))
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
        else if((F.frag.value > 2346 ) || (F.frag.value < 256 ))
        {
                alert(DESC_INVALID_FRAG_THRESHOLD);
                F.frag.focus();
                return;
        }
        else if((F.beacon.value > 1024 ) || (F.beacon.value < 50 ))
        {
                alert(DESC_INVALID_BEACON_INTERVAL);
                F.beacon.focus();
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

function ChangeWirelessOp(mode)
{
	var F=document.basicsetup_fm;
	var obj;

	if(mode == 0)
	{
		DisableAllObj(F);
		obj=document.getElementsByName('tmenu');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('smenu');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('act');
		if(obj[0]) EnableObj(obj[0]);
		obj=document.getElementsByName('run');
		if(obj[0]) EnableObj(obj[0]);
		if(obj[1]) EnableObj(obj[1]);

		obj=document.getElementsByName('apply_bt');
		if(obj[0]) EnableObj(obj[0]);
	}
	else
		EnableAllObj(F);
	ChangeWirelessMode();
	ChangeWirelessAuth(F);
}



function ChangeWirelessMode()
{
        var F=document.basicsetup_fm;
        var run = GetRadioValue(F.run);
        var obj;

        obj = document.getElementById('mbridge_opt0');
        if(obj) obj.style.display = "none";
        obj = document.getElementById('mbridge_opt1');
        if(obj) obj.style.display = "none";
        obj = document.getElementById('mbridge_opt2');
        if(obj) obj.style.display = "none";
        obj = document.getElementById('cbridge_opt0');
        if(obj) obj.style.display = "none";
        obj = document.getElementById('wwan_opt0');
        if(obj) obj.style.display = "none";
        obj = document.getElementById('ap_opt0');
        if(obj) obj.style.display = "none";

        var wireless_mode = GetRadioValue(F.wireless_mode);
        if(wireless_mode == WIRELESS_AP_MODE)
        {
                if(run!=0) 
		{
			EnableObjNames('broadcast_ssid'); 
			EnableObjNames('channel'); 
			EnableObjNames('search_channel_bt');
		}
                DisableObj(F.wmac_chk);
                DisableHW('hw');
        }
        else if(wireless_mode == WIRELESS_CBRIDGE_MODE)
        {
                if(run!=0) 
		{
			EnableObj(F.wmac_chk);
                	EnableObjNames('search_ap_bt');
		}
                if(F.wmac_chk.checked == false)
                        DisableHW('hw');
                else if(run!=0)
                        EnableHW('hw');
                DisableObjNames('broadcast_ssid');
                DisableObjNames('channel');
                DisableObjNames('search_channel_bt');
        }
	 else if(wireless_mode == WIRELESS_CWAN_MODE)
        {
		 if(run!=0) 
                	EnableObjNames('search_ap_bt');

                DisableObj(F.wmac_chk);
                DisableHW('hw');
                DisableObjNames('broadcast_ssid');
                DisableObjNames('channel');
                DisableObjNames('search_channel_bt');

        }
        else if(wireless_mode == WIRELESS_MBRIDGE_MODE)
        {
		if (navigator.appName.indexOf("Microsoft") != -1)
		{
			obj = document.getElementById('ap_opt0');
                        if(obj) obj.style.display = "block";
                        obj = document.getElementById('mbridge_opt0');
                        if(obj) obj.style.display = "block";
                        obj = document.getElementById('mbridge_opt1');
                        if(obj) obj.style.display = "block";
                        obj = document.getElementById('mbridge_opt2');
                        if(obj) obj.style.display = "block";
		}
		else
		{
			obj = document.getElementById('ap_opt0');
                        if(obj) obj.style.display = "table-row";
                        obj = document.getElementById('mbridge_opt0');
                        if(obj) obj.style.display = "table-row";
                        obj = document.getElementById('mbridge_opt1');
                        if(obj) obj.style.display = "table-row";
                        obj = document.getElementById('mbridge_opt2');
                        if(obj) obj.style.display = "table-row";
		}
					

                obj = document.getElementById('cbridge_opt0');
                if(obj) obj.style.display = "none";

                ChangeMBridgeAP();
        }
       
}

function ChangeWirelessAuth(F)
{
        var obj;
        var auth_type=F.auth_type.value;
        var run = GetRadioValue(F.run);
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

                if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
                        document.getElementById('wep_key').style.display = "block";
                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES)
                        document.getElementById('wpapsk_key').style.display = "block";
                ChangeWirelessKeyInput(F,0);
        }
}

function SetWEPKeySize(F,size, reset)
{
        F.wep_key1.size = size;
        F.wep_key1.maxLength = size;
        if(reset) F.wep_key1.value='';
        F.wep_key2.size = size;
        F.wep_key2.maxLength = size;
        if(reset) F.wep_key2.value='';
        F.wep_key3.size = size;
        F.wep_key3.maxLength = size;
        if(reset) F.wep_key3.value='';
        F.wep_key4.size = size;
        F.wep_key4.maxLength = size;
        if(reset) F.wep_key4.value='';

	if( F.wep_key1.value.length != size ) F.wep_key1.value='';
	if( F.wep_key2.value.length != size ) F.wep_key2.value='';
	if( F.wep_key3.value.length != size ) F.wep_key3.value='';
	if( F.wep_key4.value.length != size ) F.wep_key4.value='';

}

function ChangeWirelessKeyInput(F,reset)
{
        var keysize;
        var encrypt_type = GetRadioValue(F.encrypt_type);
        var key_input = GetRadioValue(F.key_input);

        if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
        {
                if(encrypt_type== ENCRYPT_64)
                        keysize = 5;
                else if(encrypt_type== ENCRYPT_128)
                        keysize = 13;
                if(key_input == KEY_HEX)
                        keysize = keysize * 2;
		F.key_length_desc.value = "(" + MSG_KEY_LENGTH_DESC + keysize + ")";

                SetWEPKeySize(F,keysize, reset);
        }
}

function ChangeWirelessRegion()
{
	var F=document.basicsetup_fm;
	var chnum;

       	count = GetOptionCount(F.channel);
	if(F.region.value == REGION_USA)
		chnum=11;
	else if(F.region.value == REGION_JAPAN)
		chnum=14;
	else 
		chnum=13;

	if(chnum < count )
		RemoveOptionTail(F.channel,count,count-chnum);
	else if(chnum > count )
		AddOptionTail(F.channel,count,chnum-count);
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
        var wireless_mode = GetRadioValue(F.wireless_mode);
        var encrypt_type = GetRadioValue(F.encrypt_type);
        var auth_type = GetRadioValue(F.auth_type);

        if(wireless_mode == WIRELESS_CBRIDGE_MODE)
        {
                if(F.wmac_chk.checked == true && (obj=CheckHW('hw')))
                {
                        alert(MSG_INVALID_HWADDR);
                        obj.focus();
                        obj.select();
                        return;
                }
        }

        // in case of mbridge ... should be added
        // security check
        if(encrypt_type == ENCRYPT_64|| encrypt_type == ENCRYPT_128)
        {
                var key_length, i,obj;
                var key_input = GetRadioValue(F.key_input);

                (encrypt_type == ENCRYPT_64)?(key_length = 5):(key_length = 13);
                if(key_input == KEY_HEX) key_length = key_length * 2;

                if(obj=CheckWEPKeyLength("wep_key",key_length))
                {
                        alert(MSG_INVALID_WEP_KEY_LENGTH);
                        obj.focus();
                        obj.select();
                        return;
                }

                if(key_input == KEY_HEX)
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
        else if(encrypt_type  == ENCRYPT_TKIP || encrypt_type == ENCRYPT_AES )
        {
                if(F.wpapsk_key.value.length < 8)
                {
                        alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        F.wpapsk_key.focus();
                        F.wpapsk_key.select();
                        return;
                }
        }

        if(o_wmode != wireless_mode)
        {
                F.modechange.value = 1; 

		if((wireless_mode == WIRELESS_AP_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS)) return;
                else if((wireless_mode == WIRELESS_CBRIDGE_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE)) return;
                if((wireless_mode == WIRELESS_CWAN_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS_WWAN)) return;
        }
        else
                F.modechange.value = 0;

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
	      obj=doc.getElementsByName('ssid');

	      if(!parent.opener.document.wdssetup_fm)
	      {
		      alert( MSG_OPENER_PAGE_MOVED );
		      parent.close();
		      return;
	      }
	      parent.opener.document.wdssetup_fm.wds_name.value = obj[idx].value;

	      obj=doc.getElementsByName('bssid');
	      SetHWDoc( parent.opener.document, 'wdshw', obj[idx].value ); 

              alert(MSG_APADD_REQUEST_APPLY);
              parent.opener.focus();
	      parent.close();
	      return;
      }

      if(parent.opener.document.multibridge_fm)
      {
	      obj=doc.getElementsByName('channel');
	      if(parent.opener.document.multibridge_fm.channel.value != obj[idx].value )
	      {
		      if(!confirm(CHANNEL_WANRING))
			      return;
		      parent.opener.document.multibridge_fm.channel.value = obj[idx].value;
	      }

	      obj=doc.getElementsByName('ssid');
	      parent.opener.document.multibridge_fm.mbridge_ssid.value = obj[idx].value;
	      obj=doc.getElementsByName('bssid');
	      SetHWDoc( parent.opener.document, 'hw', obj[idx].value );
	      alert(MSG_INVALID_REQUEST_APPLY);
              parent.opener.focus();
	      parent.close();
	      return;
      }

      if(!parent.opener.document.basicsetup_fm)
      {
	      alert( MSG_OPENER_PAGE_MOVED);
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
function ChangeMbridgeOperation()
{
	var F=document.multibridge_fm;
	var mbridge_mode = GetRadioValue(F.mbridge_run);
	var obj;

	if(mbridge_mode == MULTIBRIDGE_START_OP)
	{
		EnableObjNames('mbridge_ssid');
		EnableObjNames('search_ap_bt');
		EnableHW('hw');
		EnableObjNames('channel');
		ReadOnlyHW('hw');
		ReadOnlyObjNames('channel');
		
	}
	else
	{
		DisableObjNames('mbridge_ssid');
		DisableObjNames('search_ap_bt');
		DisableHW('hw');
		DisableObjNames('channel');
	}
}

function ApplyWirelessMultibridgeConfig(o_wmode)
{
	
	var F=document.multibridge_fm;
	var mbridge_mode = GetRadioValue(F.mbridge_run);

	if(mbridge_mode == MULTIBRIDGE_STOP_OP)
		F.submit();
	F.act.value="apply";
	F.submit();
}
</script>
