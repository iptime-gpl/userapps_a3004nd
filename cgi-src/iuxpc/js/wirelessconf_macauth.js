<script>

var EnableAllObj2 = function( F )
{
        for( var i = 0 ; F.elements[i]; i++ )
                EnableObj2(F.elements[i]);
}

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


var ClickMacAuthBss = (function()
{
	var click_bss_index;
	var click_bss_bg;

	function disableAllInputExcept( name, index )
	{
		var inputArray = document.getElementsByName( name );
		for( var i = 0; i < inputArray.length; ++i )
		{
			inputArray[i].disabled = true;
		}
		inputArray[index].disabled = false;
	}

	function disableBssListInputExcept( index )
	{
		disableAllInputExcept( "policy_mode", index );
		disableAllInputExcept( "m_ssid", index );
		disableAllInputExcept( "m_policy", index );
		disableAllInputExcept( "m_bssidx", index );
	}

	function ModifyMacAuth(doc, F, index)
	{
		var obj,titleobj;

		if(!doc || !F) return;

		EnableAllObj2(F);

		obj = document.getElementsByName("policy_mode")[index];
		titleobj=doc.getElementById('ssid_status');
		titleobj.innerHTML = '<b>' + document.getElementsByName("m_ssid")[index].value + '&nbsp' + MACAUTH_AUTH_TXT + '</b>&nbsp;(' + obj.options[obj.selectedIndex].text + ')';

		obj = document.getElementsByName("m_bssidx");
		F.bssidx.value = obj.value;
	}

	return function( index, bss_idx )
	{
		if(!parent.document.macauth_fm) return;
		var rowobj = document.getElementById('bss_row_'+ index);

		if( click_bss_index === index ) return;

		disableBssListInputExcept( index );
		document.getElementsByName("policy_mode")[index].style.display = "";
		document.getElementsByTagName("span")[index].style.display = "none";
		if( click_bss_index !== undefined )
		{
			document.getElementsByName("policy_mode")[click_bss_index].style.display = "none";
			document.getElementsByTagName("span")[click_bss_index].style.display = "";
			document.getElementById('bss_row_'+ click_bss_index).style.backgroundColor = click_bss_bg;
		}

		ModifyMacAuth(parent.document, parent.document.macauth_fm, index);
		if( !parent.macauth_pcinfo.document.macauth_pcinfo_fm || !parent.macauth_pcinfo.document.macauth_pcinfo_fm.bssidx )
			parent.macauth_pcinfo.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_pcinfo&bssidx=' + bss_idx;
		else if( parent.macauth_pcinfo.document.macauth_pcinfo_status )
			parent.macauth_pcinfo.document.macauth_pcinfo_status.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_pcinfo_status&bssidx=' + bss_idx;
		else if( Number(parent.macauth_pcinfo.document.macauth_pcinfo_fm.bssidx.value) !== bss_idx )
			parent.macauth_pcinfo.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_pcinfo&bssidx=' + bss_idx;

		if( !parent.macauth_dblist.document.macauth_dblist_fm || !parent.macauth_dblist.document.macauth_dblist_fm.bssidx )
			parent.macauth_dblist.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_dblist&bssidx=' + bss_idx;
		else if( parent.macauth_dblist.document.macauth_dblist_submit )
			parent.macauth_dblist.document.macauth_dblist_submit.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_dblist_submit&bssidx=' + bss_idx;
		else if( Number(parent.macauth_dblist.document.macauth_dblist_fm.bssidx.value) !== bss_idx )
			parent.macauth_dblist.location.href = 'timepro.cgi?tmenu=iframe&smenu=macauth_dblist&bssidx=' + bss_idx;


		click_bss_index = index;
		click_bss_bg = rowobj.style.backgroundColor;

		SetCursor(rowobj);
		UnMaskIt(parent.document,'apply_mask');
	}
})();

function getAvailableInputValue( name )
{
	var list = document.getElementsByName(name);
	for( var i = 0; i < list.length; ++i)
		if( !list[i].disabled )
			return list[i].value;
	return "";
}
function SubmitMacAuthPolicy( mac, bssidx, policy )
{
        var F = parent.macauth_fm;
        var F2 = parent.macauth_bsslist.macauth_bsslist_submit.bsslist_fm;

	var list = parent.macauth_pcinfo.document.getElementsByName("pcmac");
	for( var i = 0; i < list.length; ++i )
	{
		if(list[i].innerHTML !== mac )
			continue;
		if( !confirm(MACAUTH_DISCONNECT_CONFIRM_TXT))
		{
			document.getElementById("bssidx_" + bssidx + "_policy").selectedIndex = policy;
			return;
		}
	}
	F2.policy_mode.value = getAvailableInputValue('policy_mode');
	F2.m_ssid.value = getAvailableInputValue('m_ssid');
	F2.m_policy.value = getAvailableInputValue('m_policy');
	F2.m_bssidx.value = getAvailableInputValue('m_bssidx');
        F2.act.value = 'apply';
        F2.submit();

        DisableAllObj2(F);
        MaskIt(parent.document,'apply_mask');
        F.info.value = F.default_info.value;
        F.info.style.color = "#aaaaaa";
        ClearHWDoc(parent.document,'hw');
}

var ClickMac = (function()
{
	var click_mac_id;
	var click_mac_bg;

	return function(mac_idx,mac,name)
	{
		var rowobj = document.getElementById('mac_row_'+mac_idx);
		var F = parent.document.macauth_fm;

		if( !rowobj || !F)
			return;

		if( click_mac_id !== undefined )
		{
			var prev_row = document.getElementById('mac_row_' + click_mac_id);
			prev_row.className = "";
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

		SetCursor2(rowobj);
	}
})();

function SetCursor2( obj )
{
	obj.className += "selected";
	SetCursor( obj );
}

function updatePcInfo()
{
	function getSelectedMac( doc )
	{
		var list = doc.macauth_pcinfo_fm.getElementsByTagName("TR");
		for( var i = 0; i < list.length; ++i )
			if( list[i].className === "selected" )
				return list[i].children[0].innerHTML;
		return null;
	}
	var mac = getSelectedMac( parent.document );
	if( mac )
	{
		var list = document.macauth_pcinfo_fm.getElementsByTagName("TR");
		for( var i = 0; i < list.length; ++i )
		{
			if( list[i].children[0].innerHTML === mac )
			{
				SetCursor2( list[i] );
			}
		}
	}
	parent.macauth_pcinfo_fm.innerHTML = document.macauth_pcinfo_fm.innerHTML;
	setTimeout(function() {
		location.reload();
	}, 3000);
}

function ManualRegisterMacAuth( pcaddr )
{
        var F = document.macauth_fm;
        var F2 = macauth_dblist.macauth_dblist_submit.macauth_dblist_fm;

        if(obj=CheckHW('hw'))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
                return;
        }

        F2.manual_mac.value = GetHW('hw');
	if( F2.manual_mac.value === pcaddr 
		&& macauth_bsslist.document.getElementById("bssidx_" + macauth_dblist.macauth_dblist_submit.macauth_dblist_fm.bssidx.value + "_policy").value === "accept"
		&& !confirm(MACAUTH_DISCONNECT_CONFIRM_TXT) )
		return;

        F2.info.value = F.info.value;
        F2.act.value = 'manual_register';

        F.info.value=F.default_info.value;
        F.info.style.color="#aaaaaa";
        ClearHWDoc(document,'hw');

        F2.submit();
        DisableAllObj2(F);
        MaskIt(document,'apply_mask');
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

function UnRegisterMacAuth( pcmac )
{
        var F=macauth_dblist.macauth_dblist_submit.macauth_dblist_fm;

        if(CheckAtleastOneCheckDoc(macauth_dblist.document,'rmmacchk') == false)
        {
                alert(MSG_REMOVE_MAC_WARNING);
                return;
        }

        document.macauth_fm.del_allchk.checked = false;
        F.act.value = 'unregister';
	F.rmmacchk = macauth_dblist.macauth_dblist_fm.rmmacchk;

	if( macauth_bsslist.document.getElementById("bssidx_" + macauth_dblist.macauth_dblist_submit.macauth_dblist_fm.bssidx.value + "_policy").value === "reject" )
	{
		if( F.rmmacchk.length )
		{
			for(var i = 0; i < F.rmmacchk.length; ++i )
			{
				if( !F.rmmacchk[i].checked || F.rmmacchk[i].value !== pcmac )
					continue;
				if( confirm(MACAUTH_DISCONNECT_CONFIRM_TXT) )
					break;
				else
					return;
			}
		}
		else if( F.rmmacchk.checked && F.rmmacchk.value === pcmac && !confirm(MACAUTH_DISCONNECT_CONFIRM_TXT) )
			return;
	}
        F.submit();

        MaskIt(document,'apply_mask');
        document.macauth_fm.info.value=document.macauth_fm.default_info.value;
        document.macauth_fm.info.style.color="#aaaaaa";
        ClearHWDoc(document,'hw');
}

var ClickMacReg = (function()
{
	var click_reg_mac_id;
	var click_reg_mac_bg;

	return function(mac_idx,mac,name)
	{
		if(!parent.document.macauth_fm) return;

		var rowobj = document.getElementById('mac_row_'+mac_idx);
		var F = parent.document.macauth_fm;

		if(click_reg_mac_id != null)
		{
			var prev_row = document.getElementById('mac_row_'+click_reg_mac_id);
			if( prev_row )
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
})();

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
				parent.main.location.href = 'timepro.cgi?tmenu=wirelessconf&smenu=macauth&wl_mode=' + this.value;
			}
			clearInterval(id);
		}
	}
}

</script>
