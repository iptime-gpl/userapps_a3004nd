<script>

var ApplyMBridge = (function()
{
	function CheckPersonalAuthEnc(F)
	{
		var pl_val;

		pl_val=GetValue(F.personal_list);

		if(pl_val == 'nouse')
			return 1;

		if( pl_val.match('tkip') && !pl_val.match('tkipaes'))
		{
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
			return 0;
		}

		return 1;
	}
	function CheckWirelessForm(F)
	{
		var run=GetValue(F.run), ssidlen;

		if(run == 'stop' || run == 'wds')
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
		if(CheckPersonalAuthEnc(F) == 0)
			return 0;
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
	return function(F, act, wireless_mode)
	{
		var F2;
		
		if(!CheckWirelessForm(F))
			return;

		F.act.value = act;
		F2=iframe_mbridge_apply.mbridge_apply_fm;

		F2.act.value = act;
		F2.run.value = GetValue(F.run);
		F2.ssid.value = F.ssid.value;
		F2.personal_list.value = F.personal_list.value;


		if(F.wpapsk_password_view.checked == true)
		{
			F2.wpapsk_key.value = F.wpapsk_key_text.value;
			F.wpapsk_key.value = F.wpapsk_key_text.value;
		}
		else
		{
			F2.wpapsk_key.value = F.wpapsk_key.value;
			F.wpapsk_key_text.value = F.wpapsk_key.value;
		}
		if( wireless_mode !== 0 )
		{
			if( !confirm(MBRIDGE_DISCONNECT_CONFIRM_TXT))
				return;
		}
		if(F2.wdshw)
		{
			if(F2.run.value === "wds" && GetHW('wdshw').length !== 17)
			{
				alert(MSG_INVALID_HWADDR);
				return;
			}
			F2.wdshw.value = GetHW('wdshw');
		}

		F2.submit();

//		DisableAllObj2(F);
		iframe_aplist.document.body.scrollTop = 0;
		setTimeout(function(){
			MaskIt(document,'apply_mask');
		}, 50);
	}
})();


var ClickAP = (function()
{
	var click_ap_id;
	var click_ap_bg;

	function Check8021xAuth(auth)
	{
		if(auth.match('wpa_') || auth.match('wpa2_') || auth.match('wpawpa2_'))
			return 1;
		return 0;
	}
	function canUse( apIndex )
	{
		var obj = document.getElementsByName('m_personal_list');
		if( obj[apIndex] && Check8021xAuth(obj[apIndex].value))
			return false;
		return true;
	}
	function ModifyAP(doc,F,ap_idx)
	{
		var obj;

		if(!doc || !F) return;

		obj = document.getElementsByName('m_ssid');
		if( obj[ap_idx] && F.ssid )
			F.ssid.value = obj[ap_idx].value;


		title_obj=doc.getElementById('ssid_title');
		if(title_obj && F.ssid )
			title_obj.innerHTML = F.ssid.value;


		obj = document.getElementsByName('m_personal_list');
		if( obj[ap_idx] && Check8021xAuth(obj[ap_idx].value))
		{
			alert(MSG_INVALID_AUTH_FOR_BRIDGE);
			return;
		}

		if( obj[ap_idx] && F.personal_list )
		{
			F.personal_list.value = obj[ap_idx].value;
		}

		SetWirelessForm(doc, F);

		obj = document.getElementsByName('bssid');
		if( obj[ap_idx] && !!doc.getElementsByName('wdshw1')[0] )
			SetHWDoc(doc,'wdshw',obj[ap_idx].value);

		obj = document.getElementsByName('m_wpapsk');
		if(obj && obj[ap_idx] > 0 && F.wpapsk_key )
		{
			if(obj[ap_idx])
				F.wpapsk_key.value = obj[ap_idx].value;
			else
				F.wpapsk_key.value = "";
		}
	}
	return function(ap_idx) {
		if( !(ap_idx >= 0) )
		{
			if( document.getElementById("ap_row_0").style.display === "none" )
				ap_idx = 1;
			else
				ap_idx = 0;
			var size = document.getElementsByTagName("TR").length;
			while( ap_idx < size && !canUse(ap_idx))
				++ap_idx;
		}
		var rowobj = document.getElementById('ap_row_'+ap_idx);

		if( !rowobj )
			return;

		if(click_ap_id != null)
		{
			var prev_row = document.getElementById('ap_row_'+click_ap_id);

			prev_row.style.backgroundColor = click_ap_bg;
		}

		ModifyAP(parent.document,parent.document.mbridge_fm,ap_idx);

		click_ap_id = ap_idx;
		click_ap_bg = rowobj.style.backgroundColor;


		SetCursor(rowobj);

		UnMaskIt(parent.document,'apply_mask');
	}
})();

var DisableAllObj2 = (function()
{
	function setDisabledObjectBackground( F, color )
	{
		for( i = 0 ; F.elements[i]; i++ )
		{
			if( F.elements[i].tagName === "SELECT" && F.elements[i].disabled === true )
			{
				F.elements[i].style.backgroundColor = color;
				F.elements[i].style.color = "#777";
			}
			else if( F.elements[i].tagName === "INPUT" )
			{
				var e1 = F.elements[i];
				if( e1.type.toLowerCase() !== "checkbox" )
				{
					e1.style.color = "#777";
					e1.style.border = "1px solid #CCC";
				}
				else if( e1.nextSibling && e1.nextSibling.tagName === "LABEL" )
				{
					e1.nextSibling.style.color = "#777";
				}
			}
		}
	}
	return function( F )
	{
		DisableAllObj( F );
		setDisabledObjectBackground( F, "#EEE");
	}
})();

var EnableObj2 = (function()
{
	function restoreObject( obj )
	{
		obj.style.color = "";
		obj.style.border = "";

		if( obj.tagName === "INPUT" && obj.nextSibling && obj.nextSibling.tagName === "LABEL" )
			obj.nextSibling.style.color = "";
	}
	return function( obj )
	{
		if( !obj )
			return;
		restoreObject( obj );
		EnableObj( obj );
	}
})();

var EnableAllObj2 = function( F )
{
        for( var i = 0 ; F.elements[i]; i++ )
                EnableObj2(F.elements[i]);
}

var SetWirelessForm = (function()
{
	function ShowPersonalAuthEnc(doc,F)
	{
		var pl_val;

		if( !F.personal_list.value )
			return;
		pl_val=GetValue(F.personal_list);

		if(pl_val == 'nouse')
		{
			HideItDoc(doc,'wpapsk_key');
			ShowItDoc(doc,'no_key');
		}
		else if(pl_val.match('wpa'))
		{
			ShowItDoc(doc,'wpapsk_key');
			HideItDoc(doc,'no_key');

			F.wpapsk_password_view.checked = false;
			PasswordView(F.wpapsk_key,F.wpapsk_key_text,F.wpapsk_password_view);
		}
	}
	return function(doc,F)
	{
		var obj,run;

		if(!doc || !F )
			return;

		run=GetValue(F.run);

		if(run == 'stop')
		{
			DisableAllObj2(F);
			EnableObj2( doc.getElementById('bridge_frequency') );
			EnableObj2( doc.getElementsByName('tmenu')[0] );
			EnableObj2( doc.getElementsByName('smenu')[0] );
			EnableObj2( doc.getElementsByName('act')[0] );
			obj = doc.getElementsByName('run');
			EnableObj2(obj[0] );
			EnableObj2(obj[1] );
			EnableObj2(obj[2] );
			EnableObj2( doc.getElementsByName('wl_mode')[0] );
			EnableObj2( doc.getElementsByName('old_ssid')[0] );
			EnableObj2( doc.getElementsByName('apply_bt')[0] );
			EnableObj2( doc.getElementsByName('modify_bt')[0] );
			EnableObj2( doc.getElementsByName('cancel_bt')[0] );
			EnableObj2( doc.getElementsByName('remove_bt')[0] );
		}
		else
		{
			EnableAllObj2(F);
		}

		ShowPersonalAuthEnc(doc, F);

		if(!!doc.getElementById("tr_hwaddr") && doc.getElementsByName("run")[0].value === "wds" )
		{
			HideObj( doc.getElementById("tr_pw") );
			ShowObj( doc.getElementById("tr_hwaddr") );
		}
		else
		{
			HideObj( doc.getElementById("tr_hwaddr") );
			ShowObj( doc.getElementById("tr_pw") );
		}

		var personal_list = doc.getElementsByName("personal_list")[0];
		if( personal_list.value.indexOf("wep") >=  0 )
		{
			alert(MBRIDGE_WEP_ALERT);
			personal_list.value = personal_list.options[1].value;
		}
	}
})();

function setCss( object, cssList )
{
	for( var key in cssList )
		object.style[key] = cssList[key];
}

function setHWInputsCss( name )
{
	var css = {
		"margin"	: "0 2px 0 2px",
		"text-align"	: "center"
	},
	css2 = {
		"width"		: "20pt"
	},
	css3 = {
		"width"		: "21pt"
	};
	var object = [], i;
	for( i = 0; i < 6; ++i )
	{
		object[i] =  document.getElementsByName( name + (i + 1) )[0];
		setCss( object[i], css );
	}
	for( i = 0; i < 4; ++i )
		setCss( object[i], css3 );
	for( i = 4; i < 6; ++i )
		setCss( object[i], css2 );
	setCss( object[0], { "margin" : "0 2px 0 0" } );
}

function printStatus( data )
{
	function printRow()
	{
		var apinfo = document.getElementById("ap_row_0");
		var connected_ap = parent.document.getElementById("ap_row_0");
		if( apinfo && data.ssid && connected_ap && connected_ap.classList[0].indexOf("connected") >= 0 )
		{
			var bgColor = connected_ap.style.backgroundColor;
			apinfo.style.backgroundColor = bgColor;
			connected_ap.outerHTML = apinfo.outerHTML;
			parent.document.getElementById("connected_apinfo").innerHTML = document.getElementById("connected_apinfo").innerHTML;
		}
		else
			connected_ap.style.display = "none";
	}
	function printState()
	{
		var state = "", power, html;
		var ap_status = document.getElementById("ap_status");
		if( ap_status && ap_status.innerHTML )
		{
			for( var key in data.status_list )
			{
				if( data.status_list[key] === ap_status.innerHTML )
				{
					state = eval("MBRIDGE_" + key.toUpperCase());
					break;
				}
			}
		}
		if( state === "" )
		{
			parent.parent.document.getElementById("status_td").innerHTML = "";
			return;
		}

		power = document.getElementById("norm_power");
		if( power )
			power = power.innerHTML;

		html = "<img src=\"/images2/wifi_v3_select.png\" style=\"height: 15px; width: 15px; vertical-align: middle; \">&nbsp;<span style=\"margin: 2px; \">"
			+ data.ssid + " " + state;
		if( power && state !== MBRIDGE_TRY_CONNECT )
			html += "(" + MBRIDGE_NORM_POWER + " : " + power + ")</span>";
		if( state === MBRIDGE_TRY_CONNECT )
			parent.document.getElementById("ap_row_0").getElementsByTagName("img")[0].src = "/images2/wifi_v3_on_0.png"

		parent.parent.document.getElementById("status_td").innerHTML = html;
	}
	function setDisplayTR( doc )
	{
		var ssid, trList = doc.getElementsByTagName("TBODY")[0].getElementsByTagName("TR");
		if( !trList[0] || trList[0].style.display === "none" || trList[0].getElementsByTagName("TD").length === 0 || trList[0].getElementsByTagName("B").length === 0 )
			ssid = "";
		else
			ssid = trList[0].getElementsByTagName("TD")[1].getElementsByTagName("B")[0].innerHTML;
		for( var i = 1; i < trList.length; ++i )
		{
			if( trList[i].getElementsByTagName("TD").length < 2 )
				continue;
			if( trList[i].getElementsByTagName("TD")[1].getElementsByTagName("SPAN")[0].innerHTML === ssid )
				trList[i].style.display = "none";
			else
				trList[i].style.display = "";
		}

	}

	printRow();
	printState();
	setDisplayTR( parent.document );
	setTimeout(function() {
		location.href ='timepro.cgi?tmenu=iframe&smenu=apinfostatus&ifname=' + data.ifname;
	}, 3000);
}

function startAPScan( ifname )
{
	var button = document.getElementById("apscan_button");
	if( button.disabled )
		return;

	disableAPScan( button );
	parent.main.iframe_aplist.location.href='timepro.cgi?tmenu=iframe&smenu=ap_list&ifname=' + ifname + '&act=scan';
}

function enableAPScan( doc )
{
	var button = doc.getElementById("apscan_button");
	button.disabled = false;
	button.style.cursor = "pointer";
	button.style.opacity = 1;
}

function disableAPScan( button )
{
	if( !button )
		return;
	button.disabled = true;
	button.style.cursor = "";
	button.style.opacity = 0.6;
}

function addEvent()
{
	var id = setInterval(addWlChangeEvent, 500);
	function addWlChangeEvent() 
	{
		var select = parent.frames[3].document.getElementById('wirelessmode');
		if(select)
		{
			select.onchange = function()
			{
				parent.main.location.href = 'timepro.cgi?tmenu=wirelessconf&smenu=multibridge&wl_mode=' + this.value;
			}
			clearInterval(id);
		}
	}
}

</script>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
