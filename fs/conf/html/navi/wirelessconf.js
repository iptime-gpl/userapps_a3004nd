<script>

// wirelessconf_advancedsetup
function SetToDefault()
{
        var F=document.wireless_params_fm;
        if(F.tx_power) F.tx_power.value = 100;
        if(F.beacon) F.beacon.value = 100;
        if(F.rts) F.rts.value = 2347;
        if(F.frag) F.frag.value = 2346;
        if(F.bg_protect) F.bg_protect[0].checked = true;
        if(F.preamble) F.preamble[0].checked = true;
        if(F.short_slot) F.short_slot[0].checked = true;
        if(F.tx_burst) F.tx_burst[0].checked = true;
        if(F.aggregation) F.aggregation[0].checked = true;
        if(F.afterburner) F.afterburner[0].checked = true;
        if(F.rdg) F.rdg[0].checked = true;
        if(F.channel_width) F.channel_width[0].checked = true;
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

	if(CheckAtleastOneCheck('delchk') == false) 
	{
		alert(MSG_NO_DEL_WDS);
		return;
	}

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
	{
                EnableHW('hw');
		EnableObj(F.info);
	}
        else
	{
                DisableHW('hw');
		DisableObj(F.info);
	}
}

function InitMacAuthObj()
{
        var F= document.macauth_pcinfo_fm;

        DisableHW('hw');
	DisableObj(F.info);
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

		obj=document.getElementsByName('wl_mode');
		if(obj[0]) EnableObj(obj[0]);

		obj=document.getElementsByName('apply_bt');
		if(obj[0]) EnableObj(obj[0]);
	}
	else
	{
		EnableAllObj(F);

		if(F.other_wwan_enable && (F.other_wwan_enable.value == 1))
		{
			obj=document.getElementsByName('wwan_enable');
			if(obj[0].value == '1')
				DisableObj(obj[0]);
			else if(obj[1].value == '1')
				DisableObj(obj[1]);
		}
	}


	ChangeWirelessMode();
	ChangeWirelessAuth(F);
}

function ChangeWirelessMode()
{
        var F=document.basicsetup_fm;
        var run = GetRadioValue(F.run);
        var obj;
	var wireless_mode;

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

	if(F.wireless_mode)
		wireless_mode = GetRadioValue(F.wireless_mode);
	else
		wireless_mode = WIRELESS_AP_MODE;

        if(wireless_mode == WIRELESS_AP_MODE)
        {
                if(run!=0) 
		{
			EnableObjNames('broadcast_ssid'); 
			EnableObjNames('channel'); 
			EnableObjNames('search_channel_bt');
			if( F.wmm ) EnableObjNames('wmm');
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
		if( F.wmm ) DisableObjNames('wmm');
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
		if( F.wmm ) DisableObjNames('wmm');

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
        var run = GetValue(F.run);
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

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type == ENCRYPT_TKIPAES )
                        F.encrypt_type[IDX_NOENC].checked = true;
        }
        else if(auth_type == AUTH_KEY)
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_WEP64]);
                        EnableObj(F.encrypt_type[IDX_WEP128]);
                }

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type == ENCRYPT_TKIPAES || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_WEP64].checked = true;
        }
        else if((auth_type == AUTH_WPAPSK) || (auth_type == AUTH_WPA2PSK)
                        || (auth_type == AUTH_WPAPSKWPA2PSK) || (auth_type == AUTH_WPANONE))
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_TKIPAES]);
                        EnableObj(F.encrypt_type[IDX_TKIP]);
                        EnableObj(F.encrypt_type[IDX_AES]);
                }

                if(encrypt_type == ENCRYPT_64 || encrypt_type == ENCRYPT_128 || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_AES].checked = true;
        }
        ChangeWirelessEnc(F);
}

function ClickWirelessAuth(F, toto)
{
        var obj;
        var auth_type=F.auth_type.value;
        var run = GetValue(F.run);
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

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type == ENCRYPT_TKIPAES )
                        F.encrypt_type[IDX_NOENC].checked = true;
        }
        else if(auth_type == AUTH_KEY)
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_WEP64]);
                        EnableObj(F.encrypt_type[IDX_WEP128]);
                }

                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type == ENCRYPT_TKIPAES || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_WEP64].checked = true;
        }
        else if((auth_type == AUTH_WPAPSK) || (auth_type == AUTH_WPA2PSK)
                        || (auth_type == AUTH_WPAPSKWPA2PSK) || (auth_type == AUTH_WPANONE))
        {
                if(run != 0)
                {
                        EnableObj(F.encrypt_type[IDX_TKIPAES]);
                        EnableObj(F.encrypt_type[IDX_TKIP]);
                        EnableObj(F.encrypt_type[IDX_AES]);
                }

                if(encrypt_type == ENCRYPT_64 || encrypt_type == ENCRYPT_128 || encrypt_type == ENCRYPT_OFF )
                        F.encrypt_type[IDX_AES].checked = true;

		if(run)
		{
			if(auth_type == AUTH_WPAPSK)
			{
				if(toto)
					F.encrypt_type[IDX_TKIP].checked = true;
				else
					F.encrypt_type[IDX_AES].checked = true;
			}
			else if(auth_type == AUTH_WPA2PSK)
				F.encrypt_type[IDX_AES].checked = true;
			else if(auth_type == AUTH_WPAPSKWPA2PSK)
			{
				if(F.encrypt_type[IDX_TKIPAES]) 
				{	
					if(toto)
						F.encrypt_type[IDX_TKIPAES].checked = true;
					else
						F.encrypt_type[IDX_AES].checked = true;
				}
			}
			else
				F.encrypt_type[IDX_AES].checked = true;
		}

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
		{
                	if (navigator.appName.indexOf("Microsoft") != -1)
                        	document.getElementById('wep_key').style.display = "block";
			else
                       		document.getElementById('wep_key').style.display = "table-row";
		}
                if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES )
		{
                	if (navigator.appName.indexOf("Microsoft") != -1)
                       		document.getElementById('wpapsk_key').style.display = "block";
			else
                       		document.getElementById('wpapsk_key').style.display = "table-row";
		}

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
	var run=GetRadioValue(F.run);

        if( (run==1) && F.ssid.value == '')
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
        else if(encrypt_type  == ENCRYPT_TKIP || encrypt_type == ENCRYPT_AES || encrypt_type == ENCRYPT_TKIPAES)
        {
                if(F.wpapsk_key.value.length < 8)
                {
                        alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        F.wpapsk_key.focus();
                        F.wpapsk_key.select();
                        return;
                }
        }

	if(F.modechange)
	{
                if(o_wmode != wireless_mode)
                {
                        F.modechange.value = 1; 
 
 	       	if((wireless_mode == WIRELESS_AP_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS)) return;
                        else if((wireless_mode == WIRELESS_CBRIDGE_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS_CBRIDGE)) return;
                        if((wireless_mode == WIRELESS_CWAN_MODE) && !confirm(MSG_RESTART_CONFIRM_WIRELESS_WWAN)) return;
                }
                else
                        F.modechange.value = 0;
	}


	if(F.smenu.value == 'multibridge' && F.wwan_enable)
	{
		run=GetRadioValue(F.run);
		wwan=GetRadioValue(F.wwan_enable);

		if(run == 1  && wwan == 1)
		{
			if(!confirm(MSG_DEL_WWAN_WANRING))
				return;
		}
	}

	if(F.channel)
	{
		channel=parseInt(GetValue(F.channel));
		if(channel > 50  && channel < 140 )
		{
			if(!confirm(MSG_DFS_WARNING))
				return;
		}
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

      if(doc.scan_fm.scan_type.value == 'wds')
      {
	      obj=doc.getElementsByName('ssid');

	      if(!parent.opener.document.wdssetup_fm)
	      {
		      alert( MSG_OPENER_PAGE_MOVED );
		      parent.close();
		      return;
	      }
	      parent.opener.document.wdssetup_fm.wds_name.value = obj[idx].value;
	      if(parent.opener.document.wdssetup_fm.wds_ssid)
		      parent.opener.document.wdssetup_fm.wds_ssid.value = obj[idx].value;
	      obj=doc.getElementsByName('bssid');
	      SetHWDoc( parent.opener.document, 'wdshw', obj[idx].value ); 

              alert(MSG_APADD_REQUEST_APPLY);
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
      if(obj[idx].value == AUTH_AUTO)
	      obj[idx].value = AUTH_OPEN;
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
	      if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES)
		      parent.opener.document.getElementById('wpapsk_key').style.display = "block";
      }
      else
      {
	      if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
		      parent.opener.document.getElementById('wep_key').style.display = "table-row";
	      if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES)
		      parent.opener.document.getElementById('wpapsk_key').style.display = "table-row";
      }

      if(parent.opener.document.basicsetup_fm.channel)
      {
	      var channelobj;

            obj = doc.getElementsByName('channel');

            channelobj=parent.opener.document.basicsetup_fm.channel;
	    for( i = 0 ; i < channelobj.length;  i++ )
	    {
		    if( channelobj.options[i].value == obj[idx].value )
		    {
			    channelobj.value = obj[idx].value;
			    break;
		    }
	    }

	    if( i == channelobj.length )
	    {
		    /* Not found in select */
		    /* Match the control channel only */
		    var charr=obj[idx].value.split(".");
		    for( i = 0 ; i < channelobj.length;  i++ )
		    {
			    charr2=channelobj.options[i].value.split(".");
			    if(charr2[0] == charr[0])
			    {
				    channelobj.value = channelobj.options[i].value;
				    break;
			    }
		    }
	    }
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
	      SetRadioValue(parent.opener.document.basicsetup_fm.default_key, '1' );

      }
      else if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES)
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

function Get40MHzChannel(obj, channel)
{
	for( i = 0 ; i < obj.length; i++ )
	{
		charr=obj.options[i].value.split(".");
		if(channel == charr[0])
			return obj.options[i].value;
	}
	return obj.options[0].value;
}

function OnDBLClickChannelScanNoWizard(chan)
{
      if(!parent.opener.self.document.basicsetup_fm)
      {
	      alert( MSG_OPENER_PAGE_MOVED );
	      parent.close();
	      return;
      }

        if(chan == -1) chan = parent.iframe_scan.document.channellist_fm.channel.value;
        alert(MSG_APPLY_REQUEST_KEY);

	if( parent.opener.self.document.basicsetup_fm.channel )
	{
                parent.opener.self.document.basicsetup_fm.channel.value = chan;
                parent.opener.self.document.basicsetup_fm.channel.focus();
	}

        parent.opener.focus();
        parent.close();
}


// wirelessconf_multibssid
function ApplyMultiBssid()
{
        var F=document.mbssid_fm;
        var obj;

        if(F.ssid.value == '')
        {
                alert(MSG_BLANK_SSID);
                F.ssid.focus();
                return;
        }
        if(F.rx_rate && (parseInt(F.rx_rate.value) > 1) && (parseInt(F.rx_rate.value) < 100))
	{
                alert(MSG_MBSSID_QOS_WARNING);
                F.rx_rate.focus();
                return;
	}
        if(F.tx_rate && (parseInt(F.tx_rate.value) > 1) && (parseInt(F.tx_rate.value) < 100))
	{
                alert(MSG_MBSSID_QOS_WARNING);
                F.tx_rate.focus();
                return;
	}


        var encrypt_type = GetRadioValue(F.encrypt_type);
        var auth_type = GetRadioValue(F.auth_type);

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
        else if(encrypt_type  == ENCRYPT_TKIP || encrypt_type == ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES)
        {
                if(F.wpapsk_key.value.length < 8)
                {
                        alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        F.wpapsk_key.focus();
                        F.wpapsk_key.select();
                        return;
                }
        }

        F.act.value = "add";
        F.submit();
}

var CheckStatus = 0;
function SetCheckStatus()
{
	CheckStatus = 1;
}

function ModifyMBSS(F,idx)
{
        var i, trobj;
        var obj;

	if(CheckStatus == 1) 
	{
		CheckStatus = 0;
		return;
	}

        for( i=0; ; i++)
        {
                trobj = document.getElementById('tr_'+i);
                if(!trobj) break;
                trobj.className = 'big_td';

                textobj = document.getElementById('ssid_text_'+i);
                if(!textobj) break;
                else textobj.className = 'item_text';

                textobj = document.getElementById('desc_text_'+i);
                if(!textobj) break;
                else textobj.className = 'gray_text';

                textobj = document.getElementById('run_text_'+i);
                if(!textobj) break;
                else textobj.className = 'gray_text';
        }

        trobj = document.getElementById('tr_'+idx);
        trobj.className = 'big_selected_td';

        textobj = document.getElementById('ssid_text_'+idx);
        textobj.className = 'white_text';
        textobj = document.getElementById('desc_text_'+idx);
        textobj.className = 'white_text';
        textobj = document.getElementById('run_text_'+idx);
        textobj.className = 'white_text';

        obj = document.getElementsByName('m_ssid');
	F.ssid.value = obj[idx].value;
	F.old_ssid.value = obj[idx].value;

        obj = document.getElementsByName('m_mbss_policy');
	SetRadioValue( F.mbss_policy, obj[idx].value );

        obj = document.getElementsByName('m_broadcast_ssid');
	SetRadioValue( F.broadcast_ssid, obj[idx].value );

        obj = document.getElementsByName('m_auth_type');
	F.auth_type.value = obj[idx].value;

        obj = document.getElementsByName('m_enc_type');
	SetRadioValue( F.encrypt_type, obj[idx].value );

        obj = document.getElementsByName('m_wmm');
	if(obj) SetRadioValue( F.wmm, obj[idx].value );

        obj = document.getElementsByName('m_tx_rate');
	if(obj[idx]) F.tx_rate.value = obj[idx].value;

        obj = document.getElementsByName('m_rx_rate');
	if(obj[idx]) F.rx_rate.value = obj[idx].value;

	ChangeWirelessAuth(F);
	ChangeWirelessKeyInput(F,1);
	document.getElementById('wpapsk_key').style.display = "none";
	document.getElementById('wep_key').style.display = "none";
	encrypt_type = GetValue(F.encrypt_type);
	if (navigator.appName.indexOf("Microsoft") != -1)
		display = "block";
	else
		display = "table-row";

        if(encrypt_type == ENCRYPT_64 || encrypt_type== ENCRYPT_128)
                document.getElementById('wep_key').style.display = display;
        if(encrypt_type == ENCRYPT_TKIP || encrypt_type== ENCRYPT_AES || encrypt_type== ENCRYPT_TKIPAES)
                document.getElementById('wpapsk_key').style.display = display;

        obj = document.getElementsByName('m_wepkey1');
	F.wep_key1.value = obj[idx].value;
        obj = document.getElementsByName('m_wepkey2');
	F.wep_key2.value = obj[idx].value;
        obj = document.getElementsByName('m_wepkey3');
	F.wep_key3.value = obj[idx].value;
        obj = document.getElementsByName('m_wepkey4');
	F.wep_key4.value = obj[idx].value;

        obj = document.getElementsByName('m_default_key');
	SetRadioValue(F.default_key, obj[idx].value )

        obj = document.getElementsByName('m_key_type');
	SetRadioValue( F.key_input, obj[idx].value );

        obj = document.getElementsByName('m_wpapsk');
	F.wpapsk_key.value = obj[idx].value;



	F.add_bt.value = MODIFY_OP; 
	F.add_bt.disabled = false; 
	F.cancel_bt.disabled = false; 
}

function CancelMBSS(F)
{
	F.act.value = '';
	F.submit();
}


function DelMBSS(F)
{

        var chkchk=false;

	if(!F.delchk)
		return;

        if(F.delchk.length)
        {
                for (i=0; i < F.delchk.length; i++)
                {
                        if (F.delchk[i].type == 'checkbox')
                                if (F.delchk[i].checked)
                                        chkchk = true;
                }
        }
        else if (F.delchk.checked) 
		chkchk = true;

        if (chkchk == true)
        {
		if(confirm(MSG_DEL_MBSSID_WARNING))
		{
			F.act.value = 'del';
			F.submit();
		}
        } else
                alert(MSG_SELECT_DEL_MBSS);

}

function RunMBSS(F)
{
	F.act.value = 'run';
	F.submit();
}


function ChangeWps()
{
        var f = document.wps_basic_setup_fm;

        if(GetRadioValue(f.wps_mode) == 0)
        {
		if(f.wps_auto_connect) DisableObj(f.wps_auto_connect);
		if(f.accept_pin) DisableObj(f.accept_pin);
                DisableObj(f.wps_keep_wlconf);
                if(f.wps_noti) DisableObj(f.wps_noti);
                if(f.wps_wait_time) DisableObj(f.wps_wait_time);
        }
        else
        {
		if(f.wps_auto_connect)
		{
                        EnableObj(f.wps_auto_connect);
                        if(GetRadioValue(f.wps_auto_connect) == 1)
                                EnableObj(f.accept_pin);
                        else
                                DisableObj(f.accept_pin);
		}

                EnableObj(f.wps_keep_wlconf);
		if(f.wps_noti) EnableObj(f.wps_noti);
                if(f.wps_wait_time) EnableObj(f.wps_wait_time);
        }
}


function ChangeWPSOption()
{
        var F = document.wps_fm;

        if(F.wps_status.value == 'start' )
        {
                DisableObj(F.wps_bt);
		if (F.advanced_option)
                	F.advanced_option.disabled = true;
		if (F.wps_pin)
                	F.wps_pin.disabled = true;
		if (F.wps_pin_rb)
			DisableRadio(F.wps_pin_rb);
		if (F.wps_change_config)
                	F.wps_change_config.disabled = true;
                F.pincode.disabled = true;
                return;
        }

	if (F.advanced_option)
	{
                if(F.advanced_option.checked == true )
                {
                        F.wps_pin.disabled = false;
                        if(F.wps_pin.checked == true ) F.pincode.disabled = false;
                        else F.pincode.disabled = true;
                        F.wps_change_config.disabled = false;
                }
                else
                {
                        F.wps_pin.disabled = true;
                        F.wps_change_config.disabled = true;
                        F.pincode.disabled = true;
                }
	}
}

function WPSAddDev()
{
        document.wps_fm.wps_status.value= 'start';
        document.wps_fm.submit();
}

function WPSNotiOption()
{
	var F = document.wps_basic_setup_fm;

	if(!F.wps_noti)
		return;
	if (GetRadioValue(F.wps_noti) == 1)
		EnableObj(F.wps_noti_ssid);
	else
		DisableObj(F.wps_noti_ssid);
}

function WPSConnectOption()
{
	var F = document.wps_fm;

	if (GetRadioValue(F.wps_pin_rb) == 1)
		EnableObj(F.pincode);
	else
		DisableObj(F.pincode);
}


function WPSCancelDev()
{
	var F;

	F=parent.document.wps_fm;
	F.wps_status.value="stop";
	F.submit();
        //parent.document.location.href = "timepro.cgi?tmenu=wirelessconf&smenu=wps&wps_status=stop";
}


function ApplyWPS(act)
{
	var F;

	F=document.wps_basic_setup_fm;
	F.act.value=act;
	F.submit();
}


function ApplyWirelessRateControl()
{
        var F = document.wireless_rateset_fm;

        F.act.value='1';
        F.submit();
}

function ApplyWMMControl(val)
{
        var F = document.wireless_wmm_fm;

        F.act.value=val;
        F.submit();
}

function SearchDupSSID(F)
{
        if(F.ssid.value == '')
        {
                alert(MSG_BLANK_SSID);
                F.ssid.select();
                F.ssid.focus();
                return;
        }

        document.getElementById('ssidcheck_msg').style.display = "block";
        document.getElementById('maintable').style.display = "none";

        check_ssid.document.check_fm.ssid.value = F.ssid.value;
        check_ssid.document.check_fm.country.value = F.country.value;
       // check_ssid.document.check_fm.wl_mode.value = F.wl_mode.value;
        check_ssid.document.check_fm.submit();
}

function wireless_popup(F, url,name,opt)
{
	url += "&mode="+F.mode.value+"&country="+F.country.value+"&channel_width="+F.channel_width.value;
	win=window.open(url,name,opt);
	win.focus();
}


function ClearCursor(obj, c_color)
{
        if(obj)
        {
                obj.style.backgroundColor='';
                obj.style.color=c_color ? c_color : '#888888';
        }
}

function SetCursor(obj)
{
        if(obj)
        {
                obj.style.backgroundColor='#C9D5E9';
                obj.style.color='#000000';
        }
}

function ClickTr(obj)
{
        var prev_id = document.main_form.click_id.value;
	var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = obj.id;

        if(prev_id == click_id) return;

        if(prev_id)
        {
		document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
                parent.document.getElementById(prev_id+"_table").style.display = "none";
        }

        parent.document.getElementById(click_id+"_table").style.display = "block";
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;
        SetCursor(obj);
	parent.document.wireless_params_fm.act.value = obj.id;
}


function ApplyWirelessParams2()
{
        var F=document.wireless_params_fm;

        if((F.act.value == 'tx_power') &&  ((F.tx_power.value > 100 ) || (F.tx_power.value < 1 )))
        {
                alert(DESC_INVALID_TX_POWER);
                F.tx_power.focus();
                return;
        }
        else if((F.act.value == 'rts') && ((F.rts.value > 2347 ) || (F.rts.value < 1 )))
        {
                alert(DESC_INVALID_RTS_THRESHOLD);
                F.rts.focus();
                return;
        }
        else if((F.act.value == 'frag') && ((F.frag.value > 2346 ) || (F.frag.value < 256 )))
        {
                alert(DESC_INVALID_FRAG_THRESHOLD);
                F.frag.focus();
                return;
        }
        else if((F.act.value =='beacon_interval') && ((F.beacon.value > 1024 ) || (F.beacon.value < 50 )))
        {
                alert(DESC_INVALID_BEACON_INTERVAL);
                F.beacon.focus();
                return;
        }
        else if((F.act.value =='dynamic_channel') && (GetValue(F.dynamic_channel) == 1) && ((F.dcs_period_hour.value < 1 ) || (F.dcs_period_hour.value > 100 )))
	{
                alert(DESC_INVALID_DCS_PERIOD);
                F.dcs_period_hour.select();
                F.dcs_period_hour.focus();
                return;
	}

        F.submit();
}

function ChangeWLParams2()
{
        var F=document.wireless_params_fm;

	if(F.dynamic_channel)
	{
		if(GetValue(F.dynamic_channel) == 1)
			EnableObj(F.dcs_period_hour);
		else
			DisableObj(F.dcs_period_hour);
	}
}


function ClickEveryDay(F)
{
	if(F.everyday.checked == true)
	{
		DisableObj(F.mon);
		DisableObj(F.tue);
		DisableObj(F.wed);
		DisableObj(F.thu);
		DisableObj(F.fri);
		DisableObj(F.sat);
		DisableObj(F.sun);
	}
	else
	{
		EnableObj(F.mon);
		EnableObj(F.tue);
		EnableObj(F.wed);
		EnableObj(F.thu);
		EnableObj(F.fri);
		EnableObj(F.sat);
		EnableObj(F.sun);
	}

}


function ClickAllTime(F)
{
	if(F.always24.checked == true)
	{
		DisableObj(F.shour);
		DisableObj(F.smin);
		DisableObj(F.ehour);
		DisableObj(F.emin);
	}
	else
	{
		EnableObj(F.shour);
		EnableObj(F.smin);
		EnableObj(F.ehour);
		EnableObj(F.emin);
	}

}

function ClickSchedFlag()
{
        var F=document.wireless_sched_fm;

	if(GetValue(F.wifi_sched_flag) == 'on')
		EnableObj(F.wifi_sched_policy);
	else
		DisableObj(F.wifi_sched_policy);
}

function WifiScheduleResetAll(F)
{
	F.everyday.checked=false;
	F.mon.checked=false;
	F.tue.checked=false;
	F.wed.checked=false;
	F.thu.checked=false;
	F.fri.checked=false;
	F.sat.checked=false;
	F.sun.checked=false;
	F.always24.checked=false;
	F.shour.value="";
	F.ehour.value="";
	F.smin.value="";
	F.emin.value="";

	F.add_bt.style.display = '';
	F.modify_bt.style.display = 'none';
	F.cancel_bt.style.display = 'none';

	EnableObj(F.mon);
	EnableObj(F.tue);
	EnableObj(F.wed);
	EnableObj(F.thu);
	EnableObj(F.fri);
	EnableObj(F.sat);
	EnableObj(F.sun);
	EnableObj(F.shour);
	EnableObj(F.smin);
	EnableObj(F.ehour);
	EnableObj(F.emin);
}


function UpdateWifiSched(act)
{
	var F=document.wireless_sched_fm;
	var F2=sched_frame.main_form;

	F2.act.value = act;
	F2.add_val.value = "1,"; /* flag */


	if(
	(F.everyday.checked == false) 
	&& (F.sun.checked == false) 
	&& (F.mon.checked == false) 
	&& (F.tue.checked == false) 
	&& (F.wed.checked == false) 
	&& (F.thu.checked == false) 
	&& (F.fri.checked == false) 
	&& (F.sat.checked == false) 
	)
	{
		alert(SELECT_DAY_DESC);
		return;
	}

	if(F.everyday.checked == true)
		F2.add_val.value += "1,0,0,0,0,0,0,0,";
	else
	{
		F2.add_val.value += "0,";
		F2.add_val.value += (F.sun.checked == true)?"1,":"0,";
		F2.add_val.value += (F.mon.checked == true)?"1,":"0,";
		F2.add_val.value += (F.tue.checked == true)?"1,":"0,";
		F2.add_val.value += (F.wed.checked == true)?"1,":"0,";
		F2.add_val.value += (F.thu.checked == true)?"1,":"0,";
		F2.add_val.value += (F.fri.checked == true)?"1,":"0,";
		F2.add_val.value += (F.sat.checked == true)?"1,":"0,";
	}

	if(F.always24.checked == true)
		F2.add_val.value += "1,0,0,0,0";
	else
	{
		F2.add_val.value += "0,";

		if(checkRange(F.shour.value,0,23))
		{
			F.shour.select();
			F.shour.focus();
			alert(INVALID_HOUR_TEXT);
			return;
		}

		if(checkRange(F.smin.value,0,59))
		{
			F.smin.select();
			F.smin.focus();
			alert(INVALID_MIN_TEXT);
			return;
		}

		if(checkRange(F.ehour.value,0,23))
		{
			F.ehour.select();
			F.ehour.focus();
			alert(INVALID_HOUR_TEXT);
			return;
		}

		if(checkRange(F.emin.value,0,59))
		{
			F.emin.select();
			F.emin.focus();
			alert(INVALID_MIN_TEXT);
			return;
		}

		F2.add_val.value += F.shour.value+","+F.smin.value+","+F.ehour.value+","+F.emin.value;

	}

	//alert(F2.add_val.value);
	WifiScheduleResetAll(F);

	F2.submit();
}

function ClickRmCheck()
{
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();    
}

function ClickWifiSchedule(obj)
{
        var prev_id = document.main_form.click_id.value;
	var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = obj.id;

        if(prev_id != click_id) 
	{
                if(prev_id)
 	       		document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
                document.main_form.click_id.value = click_id;
                document.main_form.click_bg.value = obj.style.backgroundColor;
                SetCursor(obj);
	}

	var F=parent.document.wireless_sched_fm;
	var valobj=document.getElementById(obj.id+'_v');

	var sched_arr = valobj.value.split(",");

	//alert(valobj.value);

	WifiScheduleResetAll(F);

	document.main_form.sched_id.value = obj.id;

	F.everyday.checked = (sched_arr[1]=='1')?true:false;
	F.sun.checked = (sched_arr[2]=='1')?true:false;
	F.mon.checked = (sched_arr[3]=='1')?true:false;
	F.tue.checked = (sched_arr[4]=='1')?true:false;
	F.wed.checked = (sched_arr[5]=='1')?true:false;
	F.thu.checked = (sched_arr[6]=='1')?true:false;
	F.fri.checked = (sched_arr[7]=='1')?true:false;
	F.sat.checked = (sched_arr[8]=='1')?true:false;
	F.always24.checked = (sched_arr[9]=='1')?true:false;
	if(F.always24.checked == false)
	{
		F.shour.value = sched_arr[10];
		F.smin.value = sched_arr[11];
		F.ehour.value = sched_arr[12];
		F.emin.value = sched_arr[13];
	}

	ClickEveryDay(F);
	ClickAllTime(F);

	F.add_bt.style.display = 'none';
	F.modify_bt.style.display = '';
	F.cancel_bt.style.display = '';

}

function CheckAllSchedule(F)
{
	objs=sched_frame.document.getElementsByName('rmcheck');
	for( i = 0 ; i < objs.length; i++)
		objs[i].checked=F.checkall.checked;

}

function InitWifiSchedule(id)
{
        var prev_id = document.main_form.click_id.value;
	var prev_bgcolor=document.main_form.click_bg.value;
	var obj = document.getElementById(id);
        var click_id = obj.id;

        if(prev_id == click_id) 
		return;
        if(prev_id)
		document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;
        SetCursor(obj);
}

function CancelWifiSchedule()
{
        var F = document.wireless_sched_fm;
        F.act.value = '';
        F.submit();
}

function RemoveWifiSchedule()
{
	var F=sched_frame.main_form;

        F.act.value = 'remove';
        F.submit();
}

</script>
