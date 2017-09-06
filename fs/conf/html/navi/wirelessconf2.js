<script>

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


function SetWEPKeyInput(F)
{
        var keysize;
        var key_input = GetValue(F.key_input);

	keysize=GetValue(F.wepkey_length);
	if(key_input == KEY_HEX)
		keysize = keysize * 2;
        F.key_length_desc.value = "(" + MSG_KEY_LENGTH_DESC + keysize + ")";
        SetWEPKeySize(F,keysize, 0);
}

function ShowPersonalAuthEnc(doc,F)
{
	var pl_val;

	pl_val=GetValue(F.personal_list);

	//alert(pl_val.match('wpa'));
	if(pl_val == 'nouse')
	{
		HideItDoc(doc,'wpapsk_key');
		HideItDoc(doc,'wep_key');
		ShowItDoc(doc,'no_key');
	}
	else if(pl_val.match('wpa'))
	{
		ShowItDoc(doc,'wpapsk_key');
		HideItDoc(doc,'wep_key');
		HideItDoc(doc,'no_key');

		F.wpapsk_password_view.checked = false;
		PasswordView(F.wpapsk_key,F.wpapsk_key_text,F.wpapsk_password_view);
	}
	else /* wep key */
	{
		HideItDoc(doc,'wpapsk_key');
		ShowItDoc(doc,'wep_key');
		SetWEPKeyInput(F);
		HideItDoc(doc,'no_key');
	}
}

function SetEncryptForm(doc,F)
{
	var enterprise;
	
	if(F.use_enterprise && F.use_enterprise.checked == true)
		enterprise = 1;
	else
		enterprise = 0;

	if(!enterprise)
	{
		ShowObj(F.personal_list);
		HideObj(F.enterprise_list);

		if(F.radius_secret)
		{
			HideItDoc(doc,'radius_server');
			HideItDoc(doc,'radius_secret');
			HideItDoc(doc,'radius_port');
		}

		ShowPersonalAuthEnc(doc,F);

	}
	else
	{
		HideObj(F.personal_list);
		ShowObj(F.enterprise_list);
		HideItDoc(doc,'wpapsk_key');
		HideItDoc(doc,'wep_key');

		if(F.radius_secret)
		{
			ShowItDoc(doc,'radius_server');
			ShowItDoc(doc,'radius_secret');
			ShowItDoc(doc,'radius_port');
			ClickManualPortMethod(F.radius_port_method,F.radius_port,'1812');
			F.radius_password_view.checked = false;
			PasswordView(F.radius_secret,F.radius_secret_text,F.radius_password_view);
		}

	}


}

function SetWirelessForm(doc,F)
{
	/* Check the wireless ON/OFF */
        var obj,run;

	if(!doc || !F )
		return;

	run=GetValue(F.run);

        if(run == 0)
        {
                DisableAllObj(F);
                obj=doc.getElementsByName('tmenu');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('smenu');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('act');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('run');
                if(obj[0]) EnableObj(obj[0]);
                if(obj[1]) EnableObj(obj[1]);
                if(obj[2]) EnableObj(obj[2]);

                obj=doc.getElementsByName('wl_mode');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('old_ssid');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('apply_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('modify_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('cancel_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('remove_bt');
                if(obj[0]) EnableObj(obj[0]);
        }
        else
                EnableAllObj(F);
	SetEncryptForm(doc,F);
	if(F.qos_enable) EnableWirelessQos(F);
}


function CheckPersonalAuthEnc(F)
{
	var pl_val;

	pl_val=GetValue(F.personal_list);

	if(pl_val == 'nouse')
		return 1;

	if(pl_val.match('wep') || (pl_val.match('tkip') && !pl_val.match('tkipaes')))
	{
		if(pl_val.match('wep') && !confirm(MSG_WEP_SEC_WARNING))
			return 0;

		if(!confirm(MSG_WEP_WARNING))
			return 0;
	}

	if(pl_val.match('wpa'))
	{
		if(F.wpapsk_password_view && F.wpapsk_password_view.checked == true)
		{
			if(F.wpapsk_key_text.value.length < 8)
			{
                        	alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        	F.wpapsk_key_text.focus();
                        	F.wpapsk_key_text.select();
                        	return 0;
			}
		}
		else if(F.wpapsk_key.value.length < 8)
                {
                        alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                        F.wpapsk_key.focus();
                        F.wpapsk_key.select();
                        return 0;
                }
	}
	else
        {
                var key_length, i,obj;
                var key_input = GetValue(F.key_input);

		key_length=GetValue(F.wepkey_length);
                if(key_input == KEY_HEX) key_length = key_length * 2;

                if(obj=CheckWEPKeyLength("wep_key",key_length))
                {
                        alert(MSG_INVALID_WEP_KEY_LENGTH);
                        obj.focus();
                        obj.select();
                        return 0;
                }

                if(key_input == KEY_HEX)
                {
                        if(obj=CheckWEPKeyHex("wep_key",key_length))
                        {
                                alert(MSG_INVALID_WEP_KEY_HEXVALUE);
                                obj.focus();
                                obj.select();
                                return 0;
                        }
                }
        }

	return 1;
}

function CheckEnterpriseAuthEnc(F)
{
	var obj;

	if(obj=CheckIP('radius_server'))
	{
		alert(MSG_INVALID_RADIUS_SERVER);
		obj.focus();
		obj.select();
		return 0;
	}


	if(F.radius_password_view &&  F.radius_password_view.checked == true)
	{
		if(F.radius_secret_text.value == '')
		{
			alert(MSG_INVALID_RADIUS_SECRET);
			F.radius_secret_text.focus();
			F.radius_secret_text.select();
			return 0;
		}
	}
	else if(F.radius_secret.value == '')
	{
		alert(MSG_INVALID_RADIUS_SECRET);
		F.radius_secret.focus();
		F.radius_secret.select();
		return 0;
	}


	if(F.radius_port.value == '' || checkRange(F.radius_port.value,1, 65535))
	{
		alert(MSG_INVALID_RADIUS_PORT);
		F.radius_port.focus();
		F.radius_port.select();
		return 0;
	}

	return 1;
}



function CheckWirelessForm(F)
{
        var run=GetValue(F.run);
	var ssidlen;

	if(run == 0)
		return 1;
	
        if(F.ssid.value == '')
        {
                alert(MSG_BLANK_SSID);
                F.ssid.focus();
                return 0;
        }
	if ((F.ssid.value.indexOf("/") != -1))
	{
                alert("/"+MSG_INVALID_SSID_STRING);
                F.ssid.focus();
                return 0;
	}

        if((ssidlen=StrLenUTF8CharCode(F.ssid.value)) > 32)
        {
                alert(MSG_TOO_LONG_SSID+ssidlen+'bytes');
                F.ssid.focus();
                return;
        }
	


	if(F.use_enterprise && F.use_enterprise.checked == true )
	{
		if(CheckEnterpriseAuthEnc(F) == 0)
			return 0;
	}
	else
	{
		if(CheckPersonalAuthEnc(F) == 0)
			return 0;
	}

        if(F.channel)
        {
                channel=parseInt(GetValue(F.channel));
                if(channel > 50  && channel < 140 )
                {
                        if(!confirm(MSG_DFS_WARNING))
                                return 0;
                }

                if(channel > 35  && channel < 49 )
                {
                        if(F.regulation_warning && !confirm(MSG_5G_LOW_CHANNEL_WARNING))
			{
                		F.channel.focus();
                                return 0;
			}
                }

		if(F.dynamic_channel && F.dynamic_channel.value == '1' && channel != 0)
		{
                        if(!confirm(MSG_DYNAMIC_CHANNEL_WARNING))
			{
				F.channel.focus();
				return 0;
			}
		}

        }


	if(F.other_wwan_enable && (F.other_wwan_enable.value == 1))
	{
		if(GetValue(F.run) == 'wan')
		{
			alert(MSG_WIRELESS_WAN_WARNING);
			return 0;
                }
	}

	return 1;	
}


function ApplyWirelessForm(F)
{
	if(!CheckWirelessForm(F))
		return;

	F2=iframe_wl_apply.submit_fm;
	F2.act.value = 'apply'; 

	F2.run.value = GetValue(F.run);
	F2.wl_mode.value = F.wl_mode.value;
	F2.ssid.value = F.ssid.value;
	F2.channel.value = F.channel.value;
	F2.broadcast_ssid.value = (F.broadcast_ssid.checked == true)?"1":"0";
	F2.personal_list.value = F.personal_list.value;
	if(F.use_enterprise) 
	{
		F2.use_enterprise.value = F.use_enterprise.checked?"on":"off";
		F2.enterprise_list.value= F.enterprise_list.value;
		F2.radius_server.value = GetIP('radius_server');

		if(F.radius_password_view.checked == true) 
			F2.radius_secret.value = F.radius_secret_text.value;
		else
			F2.radius_secret.value = F.radius_secret.value;

		F2.radius_port.value = F.radius_port.value;
	}

	if(F.wpapsk_password_view.checked == true) 
		F2.wpapsk_key.value = F.wpapsk_key_text.value;
	else
		F2.wpapsk_key.value = F.wpapsk_key.value;

	F2.wepkey_length.value = GetValue(F.wepkey_length);
	F2.key_input.value =GetValue(F.key_input);
	F2.default_key.value = GetValue(F.default_key);

	F2.wep_key1.value = F.wep_key1.value;
	F2.wep_key2.value = F.wep_key2.value;
	F2.wep_key3.value = F.wep_key3.value;
	F2.wep_key4.value = F.wep_key4.value;

	F2.submit();
	MaskIt(document,'apply_mask');
}


function CancelBSS(F)
{
        F.act.value = '';
        F.submit();
}


function RemoveBSS(F)
{
	if(confirm(MSG_DEL_MBSSID_WARNING))
	{
		var F2;
		EnableObj(F.ssid);
		F2=iframe_bsslist.submit_fm;
		F2.ssid.value = F.ssid.value;
		F2.ssid_idx.value = F.ssid_idx.value;
		F2.act.value = 'del';
		F2.submit();
		MaskIt(document,'apply_mask');
	}
}


function ClickManualPortMethod(chk_obj,port_obj,port_val)
{
        if(!chk_obj)
                return;
        if (chk_obj.checked == true)
        {
                ReadOnlyObj(port_obj,0);
        }
        else
        {
                port_obj.value=port_val;
                ReadOnlyObj(port_obj,1);
        }

}

function EnableWirelessQos(F)
{
	if(F.qos_enable.checked == true)
	{
		EnableObj(F.tx_rate);
		EnableObj(F.rx_rate);
	}
	else
	{
		DisableObj(F.tx_rate);
		DisableObj(F.rx_rate);
	}
	if(F.tx_rate.value == '0')  
		F.tx_rate.value = '';
	if(F.rx_rate.value == '0')  
		F.rx_rate.value = '';
}

function ModifyBSS(doc,F,idx)
{
        var i, trobj;
        var obj,title_obj,tx_obj,rx_obj;


	title_obj=doc.getElementById('bss_title');
        obj = document.getElementsByName('m_run');
	if(!obj[idx])
	{
		/* For New BSS */
		F.ssid.value="";
		F.mbss_policy.value=0;
		F.personal_list.value='wpa2psk_aes';
		if(F.use_enterprise) 
		{
			F.use_enterprise.checked = false;
			F.enterprise_list.value='wpa2_aes';
			ClearIPDoc(doc,'radius_server');
        		F.radius_secret.value = "";
        		F.radius_secret_text.value = "";
        		F.radius_password_view.checked = false;
        		F.radius_port.value = "1812";
			F.radius_port_method.checked = false;
		}

		SetRadioValue(F.run,'1');
        	F.old_ssid.value = "";
		F.broadcast_ssid.checked = true;
		if(F.tx_rate) F.tx_rate.value = "";
		if(F.rx_rate) F.rx_rate.value = "";
		F.wep_key1.value = "";
        	F.wep_key2.value = "";
        	F.wep_key3.value = "";
        	F.wep_key4.value = "";
        	if(F.default_key) SetRadioValue(F.default_key, '1');
        	if(F.key_input) SetRadioValue(F.key_input, '0');

                HideObj(F.remove_bt);
                HideObj(F.modify_bt);
                ShowObj(F.add_bt);
		SetWirelessForm(doc,F);

		HideItDoc(doc,'basic_bss_td');
		ShowItDoc(doc,'apply_td');
		ShowItDoc(doc,"policy_row");
		UnMaskIt(doc,'bss_mask');
		//title_obj.innerHTML = MSG_NEW_BSS;
		title_obj.value = MSG_NEW_BSS;
		title_obj.style.backgroundColor = "#eeeeee";;
        	F.old_ssid.value = "";
        	F.wpapsk_key.value = "";
		if(F.qos_enable && F.tx_rate && F.rx_rate)
		{
			ShowItDoc(doc,'qos_tr');
			F.qos_enable.checked = false;
			EnableWirelessQos(F);
		}

        	F.ssid_idx.value=document.getElementsByName('m_ssid').length;

		return;
	}


	if(obj[idx]) SetRadioValue(F.run,obj[idx].value);

        obj = document.getElementsByName('m_ssid');
        F.ssid.value = obj[idx].value;
        F.old_ssid.value = obj[idx].value;
	//title_obj.innerHTML = F.ssid.value;
	title_obj.value = F.ssid.value;

        obj = document.getElementsByName('m_ssid_idx');
        F.ssid_idx.value = obj[idx].value;

        obj = document.getElementsByName('m_mbss_policy');
        F.mbss_policy.value = obj[idx].value;

        obj = document.getElementsByName('m_broadcast_ssid');
	F.broadcast_ssid.checked = (obj[idx].value == '1')?true:false;

        obj = document.getElementsByName('m_use_enterprise');
	if(obj && obj[idx] &&(obj[idx].value == '1'))
	{
		var obj2;

		if(F.use_enterprise) F.use_enterprise.checked = true;
        	obj2 = document.getElementsByName('m_enterprise_list');
		F.enterprise_list.value =obj2[idx].value;
	}
	else
	{
		var obj2;

		if(F.use_enterprise) F.use_enterprise.checked = false;
        	obj2 = document.getElementsByName('m_personal_list');
		F.personal_list.value = obj2[idx].value;
	}

        obj = document.getElementsByName('m_tx_rate');
        if(obj[idx]) F.tx_rate.value = obj[idx].value;

        obj = document.getElementsByName('m_rx_rate');
        if(obj[idx]) F.rx_rate.value = obj[idx].value;

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

        obj = document.getElementsByName('m_wepkey_length');
        SetRadioValue( F.wepkey_length, obj[idx].value );

        obj = document.getElementsByName('m_wpapsk');
        F.wpapsk_key.value = obj[idx].value;
        F.wpapsk_key_text.value = obj[idx].value;


        obj = document.getElementsByName('m_radius_server');
        if(obj && obj[idx] && (obj[idx].value!= ''))  
	{
		SetIPDoc(doc,'radius_server',obj[idx].value);
	}

        obj = document.getElementsByName('m_radius_secret');
        if(obj && obj[idx] && F.radius_secret) 
	{
		F.radius_secret.value = obj[idx].value;
		F.radius_secret_text.value = obj[idx].value;
	}

        obj = document.getElementsByName('m_radius_port');
        if(obj && obj[idx] && F.radius_port) 
	{
		F.radius_port.value = obj[idx].value;
		if(F.radius_port.value == 1812)
			F.radius_port_method.checked = false;
		else
			F.radius_port_method.checked = true;
	}




	ShowObj(F.modify_bt);
	ShowObj(F.cancel_bt);
	HideObj(F.add_bt);
	HideItDoc(doc,'nomore_bss');

	//F.title_text.value = F.ssid.value;

	SetWirelessForm(doc,F);



	if(F.tx_rate && F.rx_rate && F.qos_enable)
	{
		if(((F.tx_rate.value == '') || (F.tx_rate.value == '0'))&&((F.rx_rate.value == '') || (F.rx_rate.value == '0')))
			F.qos_enable.checked = false;
		else
			F.qos_enable.checked = true;
		EnableWirelessQos(F);
	}

	if(idx == '0')
	{
		ShowItDoc(doc,'basic_bss_td');
		HideItDoc(doc,'apply_td');
                HideObj(F.add_bt);
                HideObj(F.modify_bt);
                HideObj(F.remove_bt);
		HideItDoc(doc,"policy_row");
		HideItDoc(doc,'qos_tr');
		MaskIt(doc,'bss_mask');
	}
	else
	{
		HideItDoc(doc,'basic_bss_td');
		ShowItDoc(doc,'apply_td');
		ShowObj(F.remove_bt);
		ShowItDoc(doc,"policy_row");
		ShowItDoc(doc,'qos_tr');
		UnMaskIt(doc,'bss_mask');
	}
	title_obj.style.backgroundColor = "#eeeeee";;
}


var click_bss_id;
var click_bss_bg;
var click_bss_img_src;
var click_bss_lock_img_src;

function ClickBss(bss_idx)
{
	var rowobj = document.getElementById('bss_row_'+bss_idx);
	var img_objs = document.getElementsByName('wifi_icon');
	var lock_img_objs = document.getElementsByName('lock_icon');

        if(click_bss_id == bss_idx) return;

        if(click_bss_id != null)
        {
		var prev_row = document.getElementById('bss_row_'+click_bss_id);

		prev_row.style.backgroundColor = click_bss_bg;
		img_objs[click_bss_id].src = click_bss_img_src;
		if(lock_img_objs[click_bss_id])
			lock_img_objs[click_bss_id].src = click_bss_lock_img_src;
        }

	ModifyBSS(parent.document,parent.document.mbssid_fm,bss_idx);

        click_bss_id = bss_idx;
        click_bss_bg = rowobj.style.backgroundColor;
	click_bss_img_src = img_objs[bss_idx].src;
	if(lock_img_objs[bss_idx])
		click_bss_lock_img_src = lock_img_objs[bss_idx].src;

	img_objs[bss_idx].src = "/images2/wifi_select.png";
	
	if(lock_img_objs[bss_idx])
	{
		if(click_bss_lock_img_src.match('nolock'))
			lock_img_objs[bss_idx].src = "/images2/nolock_black.gif";
		else
			lock_img_objs[bss_idx].src = "/images2/lock_black.gif";
	}

        SetCursor(rowobj);

	UnMaskIt(parent.document,'apply_mask');
}


function InitBss(doc,F)
{
	if(parseInt(F.max_bss.value) <= parseInt(F.mbss_num.value))
	{
		HideObj(doc.mbssid_fm.add_bt);
		ShowItDoc(doc,'nomore_bss');
	}
	else
	{
		ShowObj(doc.mbssid_fm.add_bt);
		HideItDoc(doc,'nomore_bss');
	}
}

var click_ap_id;
var click_ap_bg;
var click_ap_img_src;

function Check8021xAuth(auth)
{
	if(auth.match('wpa_') || auth.match('wpa2_') || auth.match('wpawpa2_'))	
		return 1;
	return 0;
}

function ModifyAP(doc,F,ap_idx)
{
        var obj;

	if(!doc || !F) return;

        obj = document.getElementsByName('m_ssid');
        F.ssid.value = obj[ap_idx].value;


	title_obj=doc.getElementById('ssid_title');
	if(title_obj) title_obj.innerHTML = F.ssid.value;
	

        obj = document.getElementsByName('m_personal_list');
	if(Check8021xAuth(obj[ap_idx].value))
	{
		alert(MSG_INVALID_AUTH_FOR_BRIDGE);
		return;
	}

	if(obj)
	{
		F.personal_list.value = obj[ap_idx].value;

                obj = document.getElementsByName('m_wepkey1');
                if(obj[ap_idx]) 
			F.wep_key1.value = obj[ap_idx].value;
		else 
			F.wep_key1.value = "";

                obj = document.getElementsByName('m_wepkey2');
                if(obj[ap_idx]) 
			F.wep_key2.value = obj[ap_idx].value;
		else 
			F.wep_key2.value = "";
                obj = document.getElementsByName('m_wepkey3');
                if(obj[ap_idx]) 
			F.wep_key3.value = obj[ap_idx].value;
		else 
			F.wep_key3.value = "";
                obj = document.getElementsByName('m_wepkey4');
                if(obj[ap_idx]) 
			F.wep_key4.value = obj[ap_idx].value;
		else 
			F.wep_key4.value = "";
  
                obj = document.getElementsByName('m_default_key');
                if(obj[ap_idx]) 
			SetRadioValue(F.default_key, obj[ap_idx].value )
		else
			SetRadioValue(F.default_key, '1');

  
                obj = document.getElementsByName('m_key_type');
                if(obj[ap_idx]) 
			SetRadioValue( F.key_input, obj[ap_idx].value );
		else
			SetRadioValue( F.key_input, '0');
  
	}

	SetWirelessForm(doc,F);
	
        obj = document.getElementsByName('m_wpapsk');
	if(obj)
	{
                if(obj[ap_idx])
			F.wpapsk_key.value = obj[ap_idx].value;
		else
			F.wpapsk_key.value = "";
	}


}


function ModifyAPWds(doc,F,ap_idx)
{
        var obj, ssid;
	var nomore_wds;

	if(!doc || !F) return;

        EnableAllObj(F);

	if(parseInt(document.ap_list_fm.max_wds.value) <= parseInt(document.ap_list_fm.wds_num.value))
		nomore_wds = 1;
	else
		nomore_wds = 0;

        obj = document.getElementsByName('m_ssid');
	if(F.ssid) 
	{
		F.ssid.value = obj[ap_idx].value;
		ssid = obj[ap_idx].value;
	}
	else 
		ssid=obj[ap_idx].value;

        obj = document.getElementsByName('m_bssid');
	SetHWDoc(doc,'wdshw',obj[ap_idx].value);
	F.wds_remove_bssid.value = obj[ap_idx].value;

        obj = document.getElementsByName('m_channel_warn');
	if(obj[ap_idx]) F.channel_warn.value = obj[ap_idx].value;

        obj = document.getElementsByName('m_configured');

	if(obj[ap_idx].value == '1')
	{
               obj = document.getElementsByName('m_wdsname');
 	       if(obj[ap_idx]) F.wdsname.value = obj[ap_idx].value;
 	       else F.wdsname.value = '';

        	ShowObj(F.remove_bt);
        	ShowObj(F.modify_bt);
        	HideObj(F.add_bt);
		HideItDoc(doc,'nomore_wds');
	}
	else
	{
		//if(!F.ssid)
		F.wdsname.value = ssid;

        	HideObj(F.remove_bt);
        	HideObj(F.modify_bt);
		if(nomore_wds) 
		{
			ShowItDoc(doc,'nomore_wds');
		}
		else
        		ShowObj(F.add_bt);

	}
			
	var wds_title_obj = doc.getElementById('wds_title');
	obj = document.getElementsByName('m_wds_title');
	wds_title_obj.innerHTML = obj[ap_idx].value;
}


function ClickAP(ap_idx,wds)
{
	var rowobj = document.getElementById('ap_row_'+ap_idx);
	var img_objs = document.getElementsByName('wifi_icon');

	if( (wds==1) && !parent.document.wds_fm ) return;
	if( (wds==0) && !parent.document.mbridge_fm ) return;

        if(click_ap_id == ap_idx) return;

        if(click_ap_id != null)
        {
		var prev_row = document.getElementById('ap_row_'+click_ap_id);

		prev_row.style.backgroundColor = click_ap_bg;
		img_objs[click_ap_id].src = click_ap_img_src;
        }

	if(wds == 1) 
		ModifyAPWds(parent.document,parent.document.wds_fm,ap_idx);
	else	
		ModifyAP(parent.document,parent.document.mbridge_fm,ap_idx);

        click_ap_id = ap_idx;
        click_ap_bg = rowobj.style.backgroundColor;
	click_ap_img_src = img_objs[ap_idx].src;

	if(click_ap_img_src.match('_1'))
		img_objs[ap_idx].src = "/images2/wifi_select_1.png";
	else if(click_ap_img_src.match('_2'))
		img_objs[ap_idx].src = "/images2/wifi_select_2.png";
	else if(click_ap_img_src.match('_on'))
		img_objs[ap_idx].src = "/images2/wifi_select.png";

        SetCursor(rowobj);

	UnMaskIt(parent.document,'apply_mask');
}


function SetWdsForm(doc,F)
{
	/* Check the wireless ON/OFF */
        var obj,run;

	run=GetValue(F.run);

        if(run == 'off')
        {
                DisableAllObj(F);
                obj=doc.getElementsByName('tmenu');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('smenu');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('act');
                if(obj[0]) EnableObj(obj[0]);
                obj=doc.getElementsByName('run');
                if(obj[0]) EnableObj(obj[0]);
                if(obj[1]) EnableObj(obj[1]);

                obj=doc.getElementsByName('wl_mode');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('apply_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('modify_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('cancel_bt');
                if(obj[0]) EnableObj(obj[0]);

                obj=doc.getElementsByName('remove_bt');
                if(obj[0]) EnableObj(obj[0]);
        }
        else
                EnableAllObj(F);
}


function PrintProgressScan()
{
	var obj;

	obj=document.getElementById('progress');
	if(obj) obj.innerHTML += ".";
	setTimeout("PrintProgressScan();",1000);
}

function StartPrintProgressScan()
{
	setTimeout("PrintProgressScan();",1000);
}



function ApplyWdsForm(F,act)
{
	var F2;

	F.act.value = act;
	if(F.channel_warn.value == '1')
	{
		if(!confirm(MSG_WDS_CHANNEL_WARNING))
			return;
	}

	F2=iframe_aplist.wds_apply_fm;
	F2.act.value = act;
	F2.wds_remove_bssid.value = F.wds_remove_bssid.value; 
	F2.wdshw.value = GetHW('wdshw');
	if(F.ssid) F2.ssid.value = F.ssid.value;
	F2.wdsname.value = F.wdsname.value;
	if(F.ssid && F2.ssid) F2.ssid.value = F.ssid.value;
        F2.submit();

	DisableAllObj(F);
	MaskIt(document,'apply_mask');
}


function InitWds(doc,F)
{
	if(!doc.wds_fm)
		return; /* Page Move */

	if(parseInt(F.max_wds.value) <= parseInt(F.wds_num.value))
	{
		HideObj(doc.wds_fm.add_bt);
		ShowItDoc(doc,'nomore_wds');
	}
	else
	{
		ShowObj(doc.wds_fm.add_bt);
		HideItDoc(doc,'nomore_wds');
	}
}

function ApplyMBSS(F,act)
{
	var F2;

	if(!CheckWirelessForm(F))
		return;

	F.act.value = act;
	F2=iframe_bsslist.submit_fm;
	F2.act.value = act; 

	F2.run.value = GetValue(F.run);
	F2.ssid.value = F.ssid.value;
	F2.old_ssid.value = F.old_ssid.value;
	if(F2.ssid_idx && F.ssid_idx) F2.ssid_idx.value = F.ssid_idx.value;
	F2.broadcast_ssid.value = (F.broadcast_ssid.checked == true)?"1":"0";
	F2.mbss_policy.value = F.mbss_policy.value;
	F2.personal_list.value = F.personal_list.value;
	if(F.use_enterprise) 
	{
		F2.use_enterprise.value = F.use_enterprise.checked?"on":"off";
		F2.enterprise_list.value= F.enterprise_list.value;
		F2.radius_server.value = GetIP('radius_server');

		if(F.radius_password_view.checked == true) 
			F2.radius_secret.value = F.radius_secret_text.value;
		else
			F2.radius_secret.value = F.radius_secret.value;

		F2.radius_port.value = F.radius_port.value;
	}

	if(F.wpapsk_password_view.checked == true) 
		F2.wpapsk_key.value = F.wpapsk_key_text.value;
	else
		F2.wpapsk_key.value = F.wpapsk_key.value;

	F2.wepkey_length.value = GetValue(F.wepkey_length);
	F2.key_input.value =GetValue(F.key_input);
	F2.default_key.value = GetValue(F.default_key);

	F2.wep_key1.value = F.wep_key1.value;
	F2.wep_key2.value = F.wep_key2.value;
	F2.wep_key3.value = F.wep_key3.value;
	F2.wep_key4.value = F.wep_key4.value;



	if(F.qos_enable && F.tx_rate && F.rx_rate)
	{
		if(F.qos_enable.checked == true)
		{
			F2.rx_rate.value = F.rx_rate.value;
			F2.tx_rate.value = F.tx_rate.value;
		}
		else
		{
			F2.rx_rate.value = 0;
			F2.tx_rate.value = 0;
		}
	}

	F2.submit();
	MaskIt(document,'apply_mask');
}


function WifiSchedResetAll(F)
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
        //F.cancel_bt.style.display = 'none';

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

function ClickWifiSched(click_id)
{
        var prev_id = document.main_form.click_id.value;
        var prev_bgcolor=document.main_form.click_bg.value;
        var F=parent.document.wireless_sched_fm;

        if(prev_id != click_id)
        {
		var obj = document.getElementById(click_id);

		if(obj)
		{
                if(prev_id && document.getElementById(prev_id))
                        document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
                document.main_form.click_id.value = click_id;
                document.main_form.click_bg.value = obj.style.backgroundColor;
                SetCursor(obj);
		}
        }

	if(click_id == 'new_sched')
	{
        	WifiSchedResetAll(F);

	        F.add_bt.style.display = '';
       		F.modify_bt.style.display = 'none';
       		//F.cancel_bt.style.display = 'none';
		return;
	}

        var valobj=document.getElementById(click_id+'_v');
        var sched_arr = valobj.value.split(",");

        //alert(valobj.value);

        WifiSchedResetAll(F);


        document.main_form.sched_id.value = click_id;

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
        //F.cancel_bt.style.display = '';

	UnMaskIt(parent.document,'apply_mask');

}


function CheckAllSched(F)
{
        objs=sched_frame.document.getElementsByName('rmcheck');
        for( i = 0 ; i < objs.length; i++)
                objs[i].checked=F.checkall.checked;

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




function ClickRm()
{
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
}


function ApplyWifiSched(act)
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
        //WifiSchedResetAll(F);

        F2.submit();
	MaskIt(document,'apply_mask');
}

function ScanAP(frame, url)
{
	//alert('alias');
	list.location.href = 'timepro.cgi?tmenu=iframe&smenu=ap_list&ifname=&act=scan&apply=0';
}

function ApplyMBridge(F,act)
{
	var F2;

	if(!CheckWirelessForm(F))
		return;



	F.act.value = act;
	F2=iframe_aplist.mbridge_apply_fm;

	F2.act.value = act; 
	F2.run.value = GetValue(F.run);
	F2.ssid.value = F.ssid.value;
	F2.personal_list.value = F.personal_list.value;


	if(F.wpapsk_password_view.checked == true) 
		F2.wpapsk_key.value = F.wpapsk_key_text.value;
	else
		F2.wpapsk_key.value = F.wpapsk_key.value;

	F2.wepkey_length.value = GetValue(F.wepkey_length);
	F2.key_input.value =GetValue(F.key_input);
	F2.default_key.value = GetValue(F.default_key);

	F2.wep_key1.value = F.wep_key1.value;
	F2.wep_key2.value = F.wep_key2.value;
	F2.wep_key3.value = F.wep_key3.value;
	F2.wep_key4.value = F.wep_key4.value;


	if(F2.run.value == 'wan' && F2.need_reboot && F2.need_reboot.value == '1')
	{
		if(!confirm(MSG_NEED_REBOOT_FOR_WWAN))
			return;
	}

	F2.submit();

	DisableAllObj(F);
	MaskIt(document,'apply_mask');
}


function InitMBridge()
{
	if(!parent.document.mbridge_fm)
		return; /* Page Move */
	EnableAllObj(parent.document.mbridge_fm);
	UnMaskIt(parent.document,'apply_mask');
}



var click_mac_id;
var click_mac_bg;

function ClickMac(mac_idx,mac,name)
{
	var rowobj = document.getElementById('mac_row_'+mac_idx);
	var F = parent.document.macauth_fm;

	if(!F) return;

        if(click_mac_id == mac_idx) return;


        if(click_mac_id != null)
        {
		var prev_row = document.getElementById('mac_row_'+click_mac_id);

		prev_row.style.backgroundColor = click_mac_bg;
        }


	SetHWDoc(parent.document,'hw',mac);

	if((name != '') && (name != ' '))
	{
		F.info.value = name;
		F.info.style.color = "#000000";
	}
	else
	{
		F.info.value = F.default_info.value;
		F.info.style.color = "#aaaaaa";

	}

        click_mac_id = mac_idx;
        click_mac_bg = rowobj.style.backgroundColor;

        SetCursor(rowobj);
}

function ModifyMacAuth(doc,F,bss_idx)
{
        var obj,titleobj;

	if(!doc || !F) return;

	EnableAllObj(F);
        obj = document.getElementsByName('m_ssid');
	titleobj=doc.getElementById('ssid_title');
	//alert(obj[bss_idx].value);
	//titleobj.innerHTML = obj[bss_idx].value; 
	titleobj.value = obj[bss_idx].value; 
	titleobj.style.backgroundColor = "#e6e6e6";;

        obj = document.getElementsByName('m_policy');
        if( obj[bss_idx].value == 'open')
	{
		F.macauth_enable.checked = false;
		F.policy_mode.value = "deny";
		DisableObj(F.policy_mode);
	}
	else
	{
		F.macauth_enable.checked = true;
		F.policy_mode.value = obj[bss_idx].value;
		EnableObj(F.policy_mode);
	}

	obj=document.getElementsByName('m_bssidx');
	F.bssidx.value = obj[bss_idx].value;
}


function ClickMacAuthCheck()
{
	var F = document.macauth_fm;

	if(F.macauth_enable.checked == true)
	{
		EnableObj(F.policy_mode);
	}
	else
	{
		DisableObj(F.policy_mode);
	}

}

function ClickMacAuthBss(bss_idx,left,right)
{
	if(!parent.document.macauth_fm) return;

	var rowobj = document.getElementById('bss_row_'+bss_idx);
	var img_objs = document.getElementsByName('wifi_icon');
	var lock_img_objs = document.getElementsByName('lock_icon');

        if(click_bss_id == bss_idx) return;

        if(click_bss_id != null)
        {
		var prev_row = document.getElementById('bss_row_'+click_bss_id);

		prev_row.style.backgroundColor = click_bss_bg;
		img_objs[click_bss_id].src = click_bss_img_src;
		if(lock_img_objs[click_bss_id])
			lock_img_objs[click_bss_id].src = click_bss_lock_img_src;
        }

	ModifyMacAuth(parent.document, parent.document.macauth_fm,bss_idx);

	if(right == '1') parent.macauth_pcinfo.location.href='timepro.cgi?tmenu=iframe&smenu=macauth_pcinfo&bssidx='+parent.document.macauth_fm.bssidx.value;
	if(left == '1') parent.macauth_dblist.location.href='timepro.cgi?tmenu=iframe&smenu=macauth_dblist&bssidx='+parent.document.macauth_fm.bssidx.value;


        click_bss_id = bss_idx;
        click_bss_bg = rowobj.style.backgroundColor;
	click_bss_img_src = img_objs[bss_idx].src;
	if(lock_img_objs[bss_idx])
		click_bss_lock_img_src = lock_img_objs[bss_idx].src;

	img_objs[bss_idx].src = "/images2/wifi_select.png";
	
	if(lock_img_objs[bss_idx])
	{
		if(click_bss_lock_img_src.match('nolock'))
			lock_img_objs[bss_idx].src = "/images2/nolock_black.gif";
		else
			lock_img_objs[bss_idx].src = "/images2/lock_black.gif";
	}

        SetCursor(rowobj);
	UnMaskIt(parent.document,'apply_mask');
	UnMaskIt(parent.document,'left_mask');
	UnMaskIt(parent.document,'right_mask');


}

function ApplyWirelessMacAuth()
{
	var F = document.macauth_fm;
	var F2 = macauth_bsslist.bsslist_fm;

	F2.act.value = 'apply';
	if(F.macauth_enable.checked == true)
		F2.policy.value = F.policy_mode.value;
	else
		F2.policy.value = "open";
	F2.bssidx.value = F.bssidx.value;
	F2.submit();

	DisableAllObj(F);
	MaskIt(document,'apply_mask');
	document.macauth_fm.info.value=document.macauth_fm.default_info.value;
	document.macauth_fm.info.style.color="#aaaaaa";
	ClearHWDoc(document,'hw');

}

function RegisterMacAuth()
{
        var F= macauth_pcinfo.macauth_pcinfo_fm;

	if(CheckAtleastOneCheckDoc(macauth_pcinfo.document,'addmacchk') == false)
	{
		alert(MSG_ADD_MAC_WARNING);
		return;
	}

        document.macauth_fm.add_allchk.checked = false;
	MaskIt(document,'right_mask');
        F.act.value = 'register';
        F.submit();
	
	document.macauth_fm.info.value=document.macauth_fm.default_info.value;
	document.macauth_fm.info.style.color="#aaaaaa";
	ClearHWDoc(document,'hw');


}

function ManualRegisterMacAuth()
{
        var F= document.macauth_fm;
	var F2=macauth_dblist.macauth_dblist_fm;

	if(obj=CheckHW('hw'))
	{
		alert(MSG_INVALID_HWADDR);
		obj.focus();
		obj.select();
		return;
	}

        F.add_allchk.checked = false;
        F2.manual_mac.value = GetHW('hw'); 
        F2.info.value = F.info.value;
        F2.act.value = 'manual_register';
	
	F.info.value=F.default_info.value;
	F.info.style.color="#aaaaaa";
	ClearHWDoc(document,'hw');

        F2.submit();
	DisableAllObj(F);
	MaskIt(document,'left_mask');
}

function UnRegisterMacAuth()
{
	var F=macauth_dblist.macauth_dblist_fm;


	if(CheckAtleastOneCheckDoc(macauth_dblist.document,'rmmacchk') == false)
	{
		alert(MSG_REMOVE_MAC_WARNING);
		return;
	}

        document.macauth_fm.del_allchk.checked = false;
	MaskIt(document,'left_mask');
        F.act.value = 'unregister';
        F.submit();
	
	document.macauth_fm.info.value=document.macauth_fm.default_info.value;
	document.macauth_fm.info.style.color="#aaaaaa";
	ClearHWDoc(document,'hw');
}

function FocusMacAuthInfo()
{
	var F = document.macauth_fm;
	if(F.info.value == F.default_info.value)
	{
	       	document.macauth_fm.info.value = '';
       		document.macauth_fm.info.style.color = "#000000";
	}
}


var click_reg_mac_id;
var click_reg_mac_bg;

function ClickMacReg(mac_idx,mac,name)
{
	if(!parent.document.macauth_fm) return;

	var rowobj = document.getElementById('mac_row_'+mac_idx);
	var F = parent.document.macauth_fm;

        if(click_reg_mac_id == mac_idx) return;

        if(click_reg_mac_id != null)
        {
		var prev_row = document.getElementById('mac_row_'+click_reg_mac_id);

		prev_row.style.backgroundColor = click_reg_mac_bg;
        }


	SetHWDoc(parent.document,'hw',mac);

	if(name != '' && name != ' ')
	{
		F.info.value = name;
		F.info.style.color = "#000000";
	}
	else
	{
		F.info.value = F.default_info.value;
		F.info.style.color = "#aaaaaa";
	}
		

        click_reg_mac_id = mac_idx;
        click_reg_mac_bg = rowobj.style.backgroundColor;

        SetCursor(rowobj);
}




</script>

