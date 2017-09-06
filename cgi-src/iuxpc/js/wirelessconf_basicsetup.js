<script>

var regExp_onlynum = /^[0-9]*$/g;
var regExp_spchar = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_hex = /[0-9a-fA-F]{64}/

function DisableObj_V2(obj)
{
	if(!obj)	return;
	obj.disabled = true;
	obj.style.opacity = '0.4';
}

function EnableObj_V2(obj)
{
	if(!obj)	return;
	obj.disabled = false;
	obj.style.opacity = '';
}

function HideObj_V2(obj)
{
	if(!obj)	return;
	if(obj.style.display != 'none')
		obj.prevDisplay = obj.style.display;
	obj.style.display = 'none';
}

function ShowObj_V2(obj)
{
	if(!obj)	return;
	if(obj.prevDisplay)
		obj.style.display = obj.prevDisplay;
	else
		obj.style.display = '';
}

function ClickEventPropagater(e)
{
	if(!e) var e = window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
}

function toggle_title(target, img)
{
	if(!target || !img)	return;
	if(!target.length)	target = document.getElementsByTagName('tr');
	var ifr = parent.document.extendsetup_iframe || parent.document.getElementsByName('extendsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;

	if(img.src.indexOf('closed') == -1){
		img.src = img.src.replace('opened', 'closed');
		for(var i = 0; i < target.length; i++){
			if(target[i].id == 'extendsetuptitle')	continue;
			HideObj_V2(target[i]);
		}
	}else{
		img.src = img.src.replace('closed', 'opened');
		for(var i = 0; i < target.length; i++){
			if(target[i].id == 'extendsetuptitle')	continue;
			ShowObj_V2(target[i]);
		}
	}
	resize_iframe_height(parent.document.getElementsByName('extendsetup_iframe')[0], idoc);
}

function resize_iframe_height(ifr, idoc, ifrsize)
{
	if(!ifr || !idoc)	return;
	if(idoc.body.childNodes[0])	ifr.style.height = ((ifrsize)?ifrsize:idoc.body.childNodes[0].scrollHeight) + 'px';
	else				ifr.style.height = ((ifrsize)?ifrsize:idoc.body.scrollHeight) + 'px';
}

function get_mbssidnames_for_ie5(doc)
{
	if(!doc)	return;
	var objs = [];
	var idx = 0;
	objs.length = 0;
	var tmp = null;
	
	for(var i = 1 ; i < 4; i++)
	{
		for(var j = 1; j < 4; j++){
			tmp = doc.getElementById('BSSID_' + i + '_' + j + '_0');
			if(tmp){	objs[idx] = tmp;	objs.length+=1;	idx+=1;	}
			tmp = doc.getElementById('BSSID_' + i + '_' + j + '_1');
			if(tmp){	objs[idx] = tmp;	objs.length+=1;	idx+=1;	}
		}
	}
	return objs;
}

function toggle_guests(target, img)
{
	var ifr = parent.document.multibssid_iframe || parent.document.getElementsByName('multibssid_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.multibssid_fm;
	if(!F)	return;

	if(!target || !img)	return;
	//if(!target.length)	target = idoc.getElementsByName('GUESTS');
	if(!target.length)	target = get_mbssidnames_for_ie5(idoc);
	
	if(img.src.indexOf('closed') == -1){
		img.src = img.src.replace('opened', 'closed');	F.opened.value = '0';
		for(var i = 0; i < target.length; i++){HideObj_V2(target[i]);}
	}else{
		img.src = img.src.replace('closed', 'opened');	F.opened.value = '1';
		for(var i = 0; i < target.length; i++){ShowObj_V2(target[i]);}
	}
	resize_iframe_height(parent.document.getElementsByName('multibssid_iframe')[0], idoc);
}

function check_current_connmode(doc, wlval)
{
	if(!doc)	return false;
	var current_conn = false;

	var F = doc.wireless_main_fm;

	if(wlval){
		if(wlval == F.connmode.value)	current_conn = true;
	}else{
		var ifr = doc.hiddenwlsetup_iframe || doc.getElementsByName('hiddenwlsetup_iframe')[0];
		if(!ifr)	return false;
		var idoc = ifr.document || ifr.contentWindow.document;
		if(!idoc)	return false;
		var iF = idoc.hiddenwlsetup_fm;
		if(!iF)		return false;
		if(iF.wlmode.value == F.connmode.value)	current_conn = true;
	}

	return current_conn;
}

function set_disenable_by_checkbox(my, target)
{
	if(!my || !target)	return;

	if(my.checked){
		EnableObj_V2(target);
	}else{
		DisableObj_V2(target);
	}
}

function validate_string(str, regExp, type)
{
        if(type == 'unpermitted'){if(str.match(regExp)) return false;}
        else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
        return true;
}

function set_passview_by_checkbox(my, target)
{
	if(!my || !target)	return;

	if(my.checked){
		var newtarget = document.getElementsByName(target.name + '_text')[0];
		newtarget.value = target.value;
		HideObj_V2(target);
		ShowObj_V2(newtarget);
	}else{
		var newtarget = document.getElementsByName(target.name + '_text')[0];
		target.value = newtarget.value;
		HideObj_V2(newtarget);
		ShowObj_V2(target);
	}
}

function change_onoff_val(doc, obj, update)
{
	if(!doc || !obj)	return;

	var hobj = doc.getElementsByName(obj.id.split('_')[0])[0];
	var origin_val = hobj.value;
	
	if(update){
		if(origin_val == '0'){
			obj.src = obj.src.replace('trigger_on', 'trigger_off');
		}else{
			obj.src = obj.src.replace('trigger_off', 'trigger_on');
		}
	}else{
		if(origin_val == '0'){
			obj.src = obj.src.replace('trigger_off', 'trigger_on');
			hobj.value = '1';
		}else{
			obj.src = obj.src.replace('trigger_on', 'trigger_off');
			hobj.value = '0';
		}
	}
}

function set_authline_by_select(doc, val)
{
	var tmp;
	if(val == 'nouse'){
		tmp = doc.getElementById('WEPALERT');
		tmp.style.display = 'none';
		tmp = doc.getElementsByName('NORMALSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = '';}
		var passview = doc.getElementsByName('password')[0];
		var passviewtext = doc.getElementsByName('password_text')[0];
		var passchk = doc.getElementsByName('wpapskpassview')[0];
		DisableObj_V2(passview);
		DisableObj_V2(passviewtext);
		DisableObj_V2(passchk);
	}
	else if(val == 'auto_wep' || val == 'open_wep' || val == 'key_wep'){
		tmp = doc.getElementById('WEPALERT');
		tmp.style.display = '';
		tmp = doc.getElementsByName('NORMALSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = 'none';}
	}
	else{
		tmp = doc.getElementById('WEPALERT');
		tmp.style.display = 'none';
		tmp = doc.getElementsByName('NORMALSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = '';}
		var passview = doc.getElementsByName('password')[0];
		var passviewtext = doc.getElementsByName('password_text')[0];
		var passchk = doc.getElementsByName('wpapskpassview')[0];
		EnableObj_V2(passview);
		EnableObj_V2(passviewtext);
		EnableObj_V2(passchk);
	}
}

function set_enterprisemode_by_checkbox(doc, checked)
{
	var tmp;
	if(checked){
		doc.getElementById('personallist').style.display = 'none';
		doc.getElementById('enterpriselist').style.display = '';
		tmp = doc.getElementsByName('NORMALSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = 'none';}
		tmp = doc.getElementById('WEPALERT');
		tmp.style.display = 'none';
		tmp = doc.getElementsByName('RADIUSSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = '';}
	}else{
		doc.getElementById('personallist').style.display = '';
		doc.getElementById('enterpriselist').style.display = 'none';
		tmp = doc.getElementsByName('RADIUSSET');
		for(var tp = 0; tp < tmp.length; tp ++){tmp[tp].style.display = 'none';}
		set_authline_by_select(doc, doc.getElementById('personallist').value);
	}
}

function set_dynchannel_view_by_slider()
{
	var ifr = parent.document.extendsetup_iframe || parent.document.getElementsByName('extendsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.extendsetup_fm;
	if(!F)	return;

	var origin_val = F.dynchannel.value;
	if(origin_val == '1')
		EnableObj_V2(F.dcsperiodhour);
	else
		DisableObj_V2(F.dcsperiodhour);
}

function get_radius_ipval(frm)
{
	if(!frm)	return '';

	if(frm.radiusserver1.value != '' || frm.radiusserver2.value != '' || frm.radiusserver3.value != '' || frm.radiusserver4.value != '')
		return frm.radiusserver1.value + '.' + frm.radiusserver2.value + '.' + frm.radiusserver3.value + '.' + frm.radiusserver4.value;
	else
		return '';
}

function is_footerbtn_disabled()
{
	var obj = parent.document.getElementsByName('apply_btn')[0];
	
	if(obj.disabled)	return true;
	else			return false;
}

function ByteLenUTF8CharCode(charCode)
{
    if (charCode <= 0x00007F) {
          return 1;
        } else if (charCode <= 0x0007FF) {
          return 2;
        } else if (charCode <= 0x00FFFF) {
          return 3;
        } else {
          return 4;
        }
}

function StrLenUTF8CharCode(val)
{
        var len=0, i=0;

        for(i=0;val.charCodeAt(i);i++)
                len+=ByteLenUTF8CharCode(val.charCodeAt(i));
        return len;
}

function onclick_searchwlbtn()
{
	var ifr = parent.document.wlsearch_iframe || parent.document.getElementsByName('wlsearch_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.wl_searchiframe;
	if(!F)	return;

	var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr2)	return;
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	if(!idoc2)	return;
	var F2 = idoc2.hiddenwlsetup_fm;
	if(!F2)	return;

	parent.document.getElementById('loadingwllist').style.display = 'block';
	parent.document.getElementById('searchwllist').style.display = 'none';
	parent.document.getElementById('searchwllist').innerHTML = '';

	MaskIt(parent.document, 'search_mask');

	F.wlmode.value = F2.wlmode.value;
	F.bw.value = F2.realchanwidth.value;
	F.country.value = F2.country.value;

	F.submit();
}

function ChangeToOverColor(obj)
{
	if(!obj)	return;
	var ifr = document.basicsetup_iframe || document.getElementsByName('basicsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.basicsetup_fm;
	if(!F)	return;
	
	if(F.ocolor)
		F.ocolor.value = obj.style.backgroundColor;
	obj.style.backgroundColor = '#E8E8E8';
}

function ChangeToOutColor(obj)
{
	if(!obj)	return;
	var ifr = document.basicsetup_iframe || document.getElementsByName('basicsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.basicsetup_fm;
	if(!F)	return;
	
	if(F.ocolor)
		obj.style.backgroundColor = F.ocolor.value;
	F.ocolor.value = '';
}

function SelectSearchResult(val)
{
	var ifr = document.basicsetup_iframe || document.getElementsByName('basicsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.basicsetup_fm;
	if(!F)	return;

	if(F.channel)
		F.channel.value = val;

	UnMaskIt(document, 'search_mask');

	if(F.ocolor)
		F.ocolor.value = '';
}

function refresh_wps_view(wl_mode, activated)
{
	var ifr = parent.document.wpssetup_iframe || parent.document.getElementsByName('wpssetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var pf = idoc.wps_fm || idoc.getElementsByName('wps_fm')[0];

	if(wl_mode == '2g'){
		if(activated)	EnableObj_V2(idoc.getElementById('wpsconn2g'));
		else		DisableObj_V2(idoc.getElementById('wpsconn2g'));
		idoc.getElementById('wpsconn2g').innerHTML = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
		idoc.getElementById('wpsstatus').innerHTML = '';
		pf.act2gbtn.value = '';
	}else{
		if(activated)	EnableObj_V2(idoc.getElementById('wpsconn5g'));
		else		DisableObj_V2(idoc.getElementById('wpsconn5g'));
		idoc.getElementById('wpsconn5g').innerHTML = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
		idoc.getElementById('wpsstatus').innerHTML = '';
		pf.act5gbtn.value = '';
	}
}

function onclick_wps_button(wl_mode)
{
	var ifr = document.wpssubmit_iframe || document.getElementsByName('wpssubmit_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.wpssubmit_fm;
	if(!F)		return;
	var pf = document.wps_fm || document.getElementsByName('wps_fm')[0];

	F.wlmode.value = wl_mode;
	if(wl_mode == '2g'){
		F.action.value = pf.act2gbtn.value;
		DisableObj_V2(document.getElementById('wpsconn2g'));
		DisableObj_V2(document.getElementById('wpsconn5g'));
		pf.act2gbtn.value = '';
	}
	else{
		F.action.value = pf.act5gbtn.value;
		DisableObj_V2(document.getElementById('wpsconn2g'));
		DisableObj_V2(document.getElementById('wpsconn5g'));
		pf.act5gbtn.value = '';
	}

	pf.submitted.value = '1';
	F.submit();
}

function onclick_bssid_onoff(obj)
{
	if(!obj)	return;
	var hobj = document.getElementsByName(obj.id + '_hidden')[0];
	var origin_val = hobj.value;
	
	if(check_current_connmode(parent.document, obj.id.split('_')[3])){
		if(!confirm(WIRELESSCONF_DISCONN_ALERT))	return true;
	}

	if(origin_val == '0'){
		obj.src = obj.src.replace('trigger_off', 'trigger_on');
		hobj.value = '1';
	}else{
		obj.src = obj.src.replace('trigger_on', 'trigger_off');
		hobj.value = '0';
	}

	if(obj.src.indexOf('trigger_off') == -1)		origin_val = 1;
	else							origin_val = 0;

	var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr2)	return;
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	if(!idoc2)	return;
	var F2 = idoc2.hiddenwlsetup_fm;
	if(!F2)	return;
	
	F2.sidx.value = obj.id.split('_')[1];
	F2.uiidx.value = obj.id.split('_')[2];
	F2.wlmode.value = obj.id.split('_')[3];
	F2.run.value = origin_val;
	F2.action.value = 'bssidonoff';
	MaskIt(parent.document, 'apply_mask');
	F2.submit();
}

function onclick_allsubmit()
{
	if(!check_values_error())
		submit_all_data();
}

function check_values_error()
{
	var ifr1 = document.hiddenwlsetup_iframe || document.getElementsByName('hiddenwlsetup_iframe')[0];
	var idoc1 = ifr1.document || ifr1.contentWindow.document;
	var ifr2 = document.basicsetup_iframe || document.getElementsByName('basicsetup_iframe')[0];
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	var ifr3 = document.extendsetup_iframe || document.getElementsByName('extendsetup_iframe')[0];
	var idoc3 = ifr3.document || ifr3.contentWindow.document;
	var F1 = idoc1.hiddenwlsetup_fm;
	var F2 = idoc2.basicsetup_fm;
	var F3 = idoc3.extendsetup_fm;

	var val = '';
	var slen = 0;

	val = F2.ssid.value;
	if(val == ''){
		alert(WIRELESSCONF_BASICSETUP_SSID_BLANK);	return true;
	}
	if((slen = StrLenUTF8CharCode(val)) > 32){
		alert(WIRELESSCONF_BASICSETUP_SSID_OVERFLOW + slen + 'bytes');	return true;
	}
	val = F2.useenterprise.checked;
	if(val){
		if(get_radius_ipval(F2) == '' || !validate_string(get_radius_ipval(F2), regExp_ip, 'match')){
                        alert(WIRELESSCONF_BASICSETUP_RADIUSSERVER_INVALID);        return true;
                }
                val = F2.radiusport.value;
                if(!validate_string(val, regExp_onlynum, 'match')){
                        alert(WIRELESSCONF_BASICSETUP_RADIUSPORT_INVALID);  return true;
                }
                if(parseInt(val) < 0 || parseInt(val) > 65535){
                        alert(WIRELESSCONF_BASICSETUP_RADIUSPORT_INVALID);  return true;
                }
		if(F2.radiussecret.style.display == 'none')
                	val = F2.radiussecret_text.value;
		else
                	val = F2.radiussecret.value;
                if(val == ''){
                        alert(WIRELESSCONF_BASICSETUP_RADIUSSECRET_INVALID);        return true;
                }
	}else{
		val = F2.personallist.value;
                if(val == 'auto_wep' || val == 'open_wep' || val == 'key_wep'){
                        alert(WIRELESSCONF_BASICSETUP_WEP_NOTSUPPORT);      return true;
                }
                if(val != 'nouse'){
			if(F2.password.style.display == 'none')
                        	val = F2.password_text.value;
			else
                        	val = F2.password.value;
                        if(val == ''){
                                alert(WIRELESSCONF_BASICSETUP_WPAPSK_BLANKED);      return true;
                        }
                        if(val.length < 8){
                                alert(WIRELESSCONF_BASICSETUP_WPAPSK_INVALID);      return true;
                        }
                        if(val.length >= 64){
                                if(!validate_string(val, regExp_hex, 'match')){
                                        alert(WIRELESSCONF_BASICSETUP_WPAPSK_HEX_INVALID);  return true;
                                }
                        }
                }
	}
	if(F1.sidx.value != '0'){
		if(F2.qosenable){
			val = F2.qosenable.checked;
			if(val){
				if(F2.rxrate){
					val = F2.rxrate.value;
					if(val == '' || !validate_string(val, regExp_onlynum, 'match')){
						alert(WIRELESSCONF_BASICSETUP_RXRATE_INVALID);	return true;
					}
				}
				if(F2.txrate){
					val = F2.txrate.value;
					if(val == '' || !validate_string(val, regExp_onlynum, 'match')){
						alert(WIRELESSCONF_BASICSETUP_TXRATE_INVALID);	return true;
					}
				}
			}
		}
	}
	if(F1.sidx.value == '0'){
	if(F3.txpower){
		val = F3.txpower.value;
		if(val == ''){
			alert(WIRELESSCONF_EXTENDSETUP_TXPOWER_BLANKED);	return true;
		}
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(WIRELESSCONF_EXTENDSETUP_TXPOWER_INVALID);	return true;
		}
		if(parseInt(val) < 1 || parseInt(val) > 100){
			alert(WIRELESSCONF_EXTENDSETUP_TXPOWER_INVALID);	return true;
		}
	}
	if(F3.beacon){
		val = F3.beacon.value;
		if(val == ''){
			alert(WIRELESSCONF_EXTENDSETUP_BEACON_BLANKED);	return true;
		}
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(WIRELESSCONF_EXTENDSETUP_BEACON_INVALID);	return true;
		}
		if(parseInt(val) < 50 || parseInt(val) > 1024){
			alert(WIRELESSCONF_EXTENDSETUP_BEACON_INVALID);	return true;
		}
	}
	if(F3.rts){
		val = F3.rts.value;
		if(val == ''){
			alert(WIRELESSCONF_EXTENDSETUP_RTS_BLANKED);	return true;
		}
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(WIRELESSCONF_EXTENDSETUP_RTS_INVALID);	return true;
		}
		if(parseInt(val) < 0 || parseInt(val) > 2347){
			alert(WIRELESSCONF_EXTENDSETUP_RTS_INVALID);	return true;
		}
	}
	if(F3.fragmentation){
		val = F3.fragmentation.value;
		if(val == ''){
			alert(WIRELESSCONF_EXTENDSETUP_FRAG_BLANKED);	return true;
		}
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(WIRELESSCONF_EXTENDSETUP_FRAG_INVALID);	return true;
		}
		if(parseInt(val) < 256 || parseInt(val) > 2346){
			alert(WIRELESSCONF_EXTENDSETUP_FRAG_INVALID);	return true;
		}
	}
	if(F3.dcsperiodhour && !F3.dcsperiodhour.disabled){
		val = F3.dcsperiodhour.value;
		if(val == ''){
			alert(WIRELESSCONF_EXTENDSETUP_DYN_BLANKED);	return true;
		}
		if(!validate_string(val, regExp_onlynum, 'match')){
			alert(WIRELESSCONF_EXTENDSETUP_DYN_INVALID);	return true;
		}
		if(parseInt(val) < 1 || parseInt(val) > 100){
			alert(WIRELESSCONF_EXTENDSETUP_DYN_INVALID);	return true;
		}
	}
	}

	if(F1.rwarning){
		if(F1.sidx.value == '0'){
			var ctlchan = parseInt(F2.channel.value.split('.')[0]);
			if(ctlchan > 35 && ctlchan < 49){
				if(!confirm(WIRELESSCONF_BASICSETUP_REGULATION_WARNING))	return true;
			}
		}
	}

	if(check_current_connmode(document)){
		if(!confirm(WIRELESSCONF_DISCONN_ALERT))	return true;
	}

	return false;
}

function submit_all_data()
{
	var ifr1 = document.hiddenwlsetup_iframe || document.getElementsByName('hiddenwlsetup_iframe')[0];
	var idoc1 = ifr1.document || ifr1.contentWindow.document;
	var ifr2 = document.basicsetup_iframe || document.getElementsByName('basicsetup_iframe')[0];
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	var ifr3 = document.extendsetup_iframe || document.getElementsByName('extendsetup_iframe')[0];
	var idoc3 = ifr3.document || ifr3.contentWindow.document;
	var F1 = idoc1.hiddenwlsetup_fm;
	var F2 = idoc2.basicsetup_fm;
	var F3 = idoc3.extendsetup_fm;

	F1.ssid.value = F2.ssid.value;
	F1.broadcast.value = ((F2.broadcast.checked)?'1':'0');
	if(F2.useenterprise.checked){
		F1.useenterprise.value = '1';
		F1.enterpriselist.value = F2.enterpriselist.value;
		F1.radiusserver.value = get_radius_ipval(F2);
		if(F2.manual.checked){
			F1.radiusport.value = F2.radiusport.value;
		}else{
			F1.radiusport.value = '1812';
		}
		if(F2.radiussecret.style.display == 'none')
			F1.radiussecret.value = F2.radiussecret_text.value;
		else
			F1.radiussecret.value = F2.radiussecret.value;
	}else{
		F1.useenterprise.value = '0';
		F1.personallist.value = F2.personallist.value;
		if(F1.personallist.value == 'nouse'){
			F1.wpapsk.value = '';
		}else{
			if(F2.password.style.display == 'none')
				F1.wpapsk.value = F2.password_text.value;
			else
				F1.wpapsk.value = F2.password.value;
		}
	}
	if(F1.sidx.value == '0'){
		if(F2.channel.value == '0'){
			F1.autochannel.value = '1';
		}else{
			F1.autochannel.value = '0';
			F1.ctlchannel.value = F2.channel.value.split('.')[0];
			F1.cntchannel.value = F2.channel.value.split('.')[1];
		}
	}else{
		F1.mbsspolicy.value = F2.mbsspolicy.value;
		if(F2.qosenable){
			if(F2.qosenable.checked){
				F1.qosenable.value = '1';
			}else{
				F1.qosenable.value = '0';
			}
		}
		if(F2.txrate)F1.txrate.value = F2.txrate.value;
		if(F2.rxrate)F1.rxrate.value = F2.rxrate.value;
	}
	if(F1.sidx.value == '0'){
	if(F1.txpower)		F1.txpower.value = F3.txpower.value;
	if(F1.beacon)		F1.beacon.value = F3.beacon.value;
	if(F1.rts)		F1.rts.value = F3.rts.value;
	if(F1.wpsmode)		F1.wpsmode.value = F3.wpsmode.value;
	if(F1.fragmentation)	F1.fragmentation.value = F3.fragmentation.value;
	if(F1.wirelessmode)	F1.wirelessmode.value = F3.wirelessmode.value;
	if(F1.channelwidth)	F1.channelwidth.value = F3.channelwidth.value;
	if(F1.country)		F1.country.value = F3.country.value;

	if(F1.wpsnoti)		F1.wpsnoti.value = F3.wpsnoti.value;
	if(F1.ldpc)		F1.ldpc.value = F3.ldpc.value;
	if(F1.wmm)		F1.wmm.value = F3.wmm.value;
	if(F1.phywatchdog)	F1.phywatchdog.value = F3.phywatchdog.value;
	if(F1.dynchannel){
		F1.dynchannel.value = F3.dynchannel.value;
		F1.dcsperiodhour.value = F3.dcsperiodhour.value;
	}
	if(F1.stbc)		F1.stbc.value = F3.stbc.value;
	if(F1.dfs)		F1.dfs.value = F3.dfs.value;
	if(F1.txbfmumode)	F1.txbfmumode.value = F3.txbfmumode.value;
	if(F1.muflag)		F1.muflag.value = F3.muflag.value;
	if(F1.mimoant && F3.mimoant)		F1.mimoant.value = F3.mimoant.value;
	}

	F1.action.value = 'allsubmit';
	F1.submit();
	MaskIt(document, 'apply_mask');
}

function get_freq_desc(ctl_ch, cnt_ch, wl_mode)
{
	var idoc = parent.document || parent.contentWindow.document;
	if(!idoc)	return;
	var F2 = idoc.wireless_main_fm;
	if(!F2)	return;

	var desc = ctl_ch + ' [ '; 
	var ghz = (wl_mode == '5g')?5:2;

	if(ghz == 5)	desc += '5.'+5*ctl_ch;
	else{
		if(ctl_ch == 14)	desc += '2.484';
		else			desc += '2.'+(407+5*ctl_ch);
	}
	desc += ' GHz';
	if(ctl_ch != cnt_ch)	desc += ',' + ((ctl_ch < cnt_ch)?WIRELESSCONF_BASICSETUP_UPPERCHANNEL : WIRELESSCONF_BASICSETUP_LOWERCHANNEL);
	desc += ' ]';
	return desc;
}

function update_channel_options(country, bw, val, isauto, wl_mode)
{
	var ifr = parent.document.basicsetup_iframe || parent.document.getElementsByName('basicsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.basicsetup_fm;
	if(!F)	return;

	if(!country || !bw){
		var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
		if(!ifr2)	return;
		var idoc2 = ifr2.document || ifr2.contentWindow.document;
		if(!idoc2)	return;
		var F2 = idoc2.hiddenwlsetup_fm;
		if(!F2)	return;

		country = F2.country.value;
		bw = F2.channelwidth.value;
	}

	for(var i = 0; i < F.channel.options.length; i ++)	F.channel.options[i] = null;
	F.channel.options.length = 0;

	if(wl_mode == '2g'){
		var ctl_arr = parent.control_channel_arr2g[country + '_' + bw];
		var cnt_arr = parent.central_channel_arr2g[country + '_' + bw];
	}else{
		var ctl_arr = parent.control_channel_arr5g[country + '_' + bw];
		var cnt_arr = parent.central_channel_arr5g[country + '_' + bw];
	}
	var ctl_ch = parseInt(val.split('.')[0]);
	var cnt_ch = parseInt(val.split('.')[1]);
	var optext = WIRELESSCONF_BASICSETUP_AUTOCHANNEL_STRING + '(' + get_freq_desc(ctl_ch, cnt_ch, wl_mode) + ')';
	
	F.channel.options[0] = new Option(optext,'0');
	var idx = 1;
	var is_correct = false;
	for(var i in ctl_arr){
		optext = get_freq_desc(ctl_arr[i], cnt_arr[i], wl_mode);
		F.channel.options[idx++] = new Option(optext, ctl_arr[i]+'.'+cnt_arr[i]);
		if((ctl_ch == ctl_arr[i]) && (cnt_ch == cnt_arr[i]))	is_correct = true;
	}
	if(!is_correct){
		for(var i in ctl_arr){
			if(ctl_ch == ctl_arr[i])	val = (ctl_arr[i] + '.' + cnt_arr[i]);
		}
	}
	if(isauto)	F.channel.value = '0';
	else		F.channel.value = val;
}

function update_basicsetup_view(doc, sidx)
{
	if(sidx == '0'){
		if(doc.getElementById('CHANNEL_LINE'))doc.getElementById('CHANNEL_LINE').style.display = '';
		if(doc.getElementById('POLICY_LINE'))doc.getElementById('POLICY_LINE').style.display = 'none';
	}else{
		if(doc.getElementById('CHANNEL_LINE'))doc.getElementById('CHANNEL_LINE').style.display = 'none';
		if(doc.getElementById('POLICY_LINE'))doc.getElementById('POLICY_LINE').style.display = '';
	}
	var lines = doc.getElementsByName('BASICSETUP_LINE');
	if(!lines || lines.length == 0)	lines = doc.getElementsByTagName('tr');
	var len = lines.length;

	for(var i = 0, j = 0; i < len; i ++){
		if(lines[i].id == 'basicsetuptitle')	continue;
		if(lines[i].style.display == 'none')	continue;
		lines[i].style.backgroundColor = (j % 2 == 0)?'#FFFFFF':'#F7F7F7';	j++;
	}
}

function AllEnableBasicsetup(F)
{
	EnableObj_V2(F.ssid); 		EnableObj_V2(F.broadcast);
	EnableObj_V2(F.channel);	EnableObj_V2(F.search_channel_bt);
	EnableObj_V2(F.personallist); 	EnableObj_V2(F.useenterprise); 		EnableObj_V2(F.enterpriselist);
	EnableObj_V2(F.wpapskpassview); EnableObj_V2(F.radiuspassview);
	EnableObj_V2(F.password); 	EnableObj_V2(F.password_text);		EnableObj_V2(F.passview);
	EnableObj_V2(F.radiusserver1); 	EnableObj_V2(F.radiusserver2);		EnableObj_V2(F.radiusserver3); 	EnableObj_V2(F.radiusserver4);
	EnableObj_V2(F.radiusport); 	EnableObj_V2(F.manual);			EnableObj_V2(F.radiussecret); 	EnableObj_V2(F.radiussecret_text);
	EnableObj_V2(F.mbsspolicy); 	EnableObj_V2(F.qosenable);		EnableObj_V2(F.rxrate); 	EnableObj_V2(F.txrate);
}

function AllDisableBasicsetup(F)
{
	DisableObj_V2(F.ssid); 		DisableObj_V2(F.broadcast);
	DisableObj_V2(F.channel);	DisableObj_V2(F.search_channel_bt);
	DisableObj_V2(F.personallist); 	DisableObj_V2(F.useenterprise); 	DisableObj_V2(F.enterpriselist);
	DisableObj_V2(F.wpapskpassview);DisableObj_V2(F.radiuspassview);
	DisableObj_V2(F.password); 	DisableObj_V2(F.password_text);		DisableObj_V2(F.passview);
	DisableObj_V2(F.radiusserver1); DisableObj_V2(F.radiusserver2);		DisableObj_V2(F.radiusserver3); DisableObj_V2(F.radiusserver4);
	DisableObj_V2(F.radiusport); 	DisableObj_V2(F.manual);		DisableObj_V2(F.radiussecret); 	DisableObj_V2(F.radiussecret_text);
	DisableObj_V2(F.mbsspolicy); 	DisableObj_V2(F.qosenable);		DisableObj_V2(F.rxrate); 	DisableObj_V2(F.txrate);
}

function update_basicsetup_lines(wl_mode)
{
	var ifr = parent.document.basicsetup_iframe || parent.document.getElementsByName('basicsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.basicsetup_fm;
	if(!F)	return;

	var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr2)	return;
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	if(!idoc2)	return;
	var F2 = idoc2.hiddenwlsetup_fm;
	if(!F2)	return;

	if(F2.sidx.value == '0'){
		update_channel_options(F2.country.value, F2.realchanwidth.value, F2.ctlchannel.value + '.' 
			+ F2.cntchannel.value, F2.autochannel.value == '1'?true:false, wl_mode);
		idoc.getElementById('basicsetup_title_p').innerHTML = ((wl_mode=='2g')?"2.4 GHz ":"5 GHz ") + WIRELESSCONF_BASICSETUP_DEFNET;
	}else{
		idoc.getElementById('basicsetup_title_p').innerHTML = ((wl_mode=='2g')?"2.4 GHz ":"5 GHz ") + WIRELESSCONF_BASICSETUP_GSTNET + ' ' + F2.uiidx.value;
	}

	update_basicsetup_view(idoc, F2.sidx.value);

	if(F2.run.value == '1')
		AllEnableBasicsetup(F);
	
	F.ssid.value = F2.ssid.value;
	F.personallist.value = F2.personallist.value;
	set_authline_by_select(idoc, F.personallist);

	if(F.useenterprise){
		if(F2.useenterprise.value == '1')	F.useenterprise.checked = true;
		else					F.useenterprise.checked = false;
		set_enterprisemode_by_checkbox(idoc, F.useenterprise.checked);
		F.radiussecret.value = F2.radiussecret.value;
		F.radiussecret_text.value = F2.radiussecret.value;
		F.radiusport.value = F2.radiusport.value;
		if(F.radiusport.value == '1812')	F.manual.checked = false;
		else					F.manual.checked = true;
		set_disenable_by_checkbox(F.manual, F.radiusport);
		
		if(F2.radiusserver.value != ''){
			var rip = F2.radiusserver.value.split('.');
			for(var i = 0; i < 4; i ++){
				idoc.getElementsByName('radiusserver'+(i+1))[0].value = rip[i];
			}
		}
	}

	F.password.value = F2.wpapsk.value;
	F.password_text.value = F2.wpapsk.value;
	if(F2.broadcast.value == '1')	F.broadcast.checked = true;
	else				F.broadcast.checked = false;

	if(F2.sidx.value != '0'){	
		if(F.txrate)F.txrate.value = F2.txrate.value;
		if(F.rxrate)F.rxrate.value = F2.rxrate.value;
		if(F.qosenable){
			if(F2.qosenable.value == '1')	F.qosenable.checked = true;
			else				F.qosenable.checked = false;
		}
		set_disenable_by_checkbox(F.qosenable, F.txrate);
		set_disenable_by_checkbox(F.qosenable, F.rxrate);
		F.mbsspolicy.value = F2.mbsspolicy.value;
	}

	if(F2.run.value == '0')
		AllDisableBasicsetup(F);

	UnMaskIt(parent.document, 'apply_mask');
}

function update_ext_options(doc, F, wl_mode)
{
	if(F.wirelessmode){
		for(var i = 0; i < F.wirelessmode.options.length; i++)	F.wirelessmode.options[i] = null;
		F.wirelessmode.options.length = 0;

		if(wl_mode == '2g' && doc.options2g){
			for(var i = 0; i < doc.options2g.length; i++){
				F.wirelessmode.options[i] = new Option(doc.options2g[i].text, doc.options2g[i].value);
			}
		}else if(doc.options5g){
			for(var i = 0; i < doc.options5g.length; i++){
				F.wirelessmode.options[i] = new Option(doc.options5g[i].text, doc.options5g[i].value);
			}
		}
	}
	if(F.channelwidth){
		for(var i = 0; i < F.channelwidth.options.length; i++)	F.channelwidth.options[i] = null;
		F.channelwidth.options.length = 0;

		if(wl_mode == '2g' && doc.chanwidth2g){
			for(var i = 0; i < doc.chanwidth2g.length; i++){
				F.channelwidth.options[i] = new Option(doc.chanwidth2g[i].text, doc.chanwidth2g[i].value);
			}
		}else if(doc.chanwidth5g){
			for(var i = 0; i < doc.chanwidth5g.length; i++){
				F.channelwidth.options[i] = new Option(doc.chanwidth5g[i].text, doc.chanwidth5g[i].value);
			}
		}
	}
	if(F.txbfmumode){
		for(var i = 0; i < F.txbfmumode.options.length; i++)	F.txbfmumode.options[i] = null;
		F.txbfmumode.options.length = 0;

		if(wl_mode == '2g' && doc.mumimo2g){
			for(var i = 0; i < doc.mumimo2g.length; i++){
				F.txbfmumode.options[i] = new Option(doc.mumimo2g[i].text, doc.mumimo2g[i].value);
			}
		}else if(doc.mumimo5g){
			for(var i = 0; i < doc.mumimo5g.length; i++){
				F.txbfmumode.options[i] = new Option(doc.mumimo5g[i].text, doc.mumimo5g[i].value);
			}
		}
	}
	if(F.muflag){
		for(var i = 0; i < F.muflag.options.length; i++)	F.muflag.options[i] = null;
		F.muflag.options.length = 0;

		if(wl_mode == '2g' && doc.mumimo2g){
			for(var i = 0; i < doc.mumimo2g.length; i++){
				F.muflag.options[i] = new Option(doc.mumimo2g[i].text, doc.mumimo2g[i].value);
			}
		}else if(doc.mumimo5g){
			for(var i = 0; i < doc.mumimo5g.length; i++){
				F.muflag.options[i] = new Option(doc.mumimo5g[i].text, doc.mumimo5g[i].value);
			}
		}
	}
	if(F.mimoant){
		for(var i = 0; i < F.mimoant.options.length; i++)	F.mimoant.options[i] = null;
		F.mimoant.options.length = 0;

		if(wl_mode == '2g' && doc.mimoant2g){
			for(var i = 0; i < doc.mimoant2g.length; i++){
				F.mimoant.options[i] = new Option(doc.mimoant2g[i].text, doc.mimoant2g[i].value);
			}
		}else if(doc.mimoant5g){
			for(var i = 0; i < doc.mimoant5g.length; i++){
				F.mimoant.options[i] = new Option(doc.mimoant5g[i].text, doc.mimoant5g[i].value);
			}
		}
	}
}

function update_extendsetup_lines(channelupdate)
{
	var ifr = parent.document.extendsetup_iframe || parent.document.getElementsByName('extendsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.extendsetup_fm;
	if(!F)	return;

	var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr2)	return;
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	if(!idoc2)	return;
	var F2 = idoc2.hiddenwlsetup_fm;
	if(!F2)	return;

	var wl_mode = F2.wlmodetxt.value;

	var titlep = idoc.getElementById('EXTTITLE');
	if(titlep)	titlep.innerHTML = ((wl_mode=='2g')?"2.4 GHz ":"5 GHz ") + parent.document.exttitle;

	if(F2.mimoant){
		ShowObj_V2(idoc.getElementById('MIMOANT_TITLE'));	ShowObj_V2(F.mimoant);
	}else{
		HideObj_V2(idoc.getElementById('MIMOANT_TITLE'));	HideObj_V2(F.mimoant);
	}
	update_ext_options(parent.document, F, wl_mode);

	F.txpower.value = F2.txpower.value;
	F.beacon.value = F2.beacon.value;
	if(F.rts && F2.rts)
		F.rts.value = F2.rts.value;
	if(F.fragmentation && F2.fragmentation)
		F.fragmentation.value = F2.fragmentation.value;
	F.wirelessmode.value = F2.wirelessmode.value;
	F.country.value = F2.country.value;
	if(F.channelwidth)	F.channelwidth.value = F2.channelwidth.value;
	
	F.wpsmode.value = F2.wpsmode.value;
	change_onoff_val(idoc, idoc.getElementById('wpsmode_id'), true);
	F.wmm.value = F2.wmm.value;
	change_onoff_val(idoc, idoc.getElementById('wmm_id'), true);
	if(F2.wpsnoti){
		F.wpsnoti.value = F2.wpsnoti.value;
		change_onoff_val(idoc, idoc.getElementById('wpsnoti_id'), true);
	}
	if(F2.ldpc){
		F.ldpc.value = F2.ldpc.value;
		change_onoff_val(idoc, idoc.getElementById('ldpc_id'), true);
	}
	if(F2.phywatchdog){
		F.phywatchdog.value = F2.phywatchdog.value;
		change_onoff_val(idoc, idoc.getElementById('phywatchdog_id'), true);
	}
	if(F2.dynchannel){
		F.dynchannel.value = F2.dynchannel.value;
		change_onoff_val(idoc, idoc.getElementById('dynchannel_id'), true);
		F.dcsperiodhour.value = F2.dcsperiodhour.value;
		set_dynchannel_view_by_slider();
	}
	if(F2.stbc){
		F.stbc.value = F2.stbc.value;
		change_onoff_val(idoc, idoc.getElementById('stbc_id'), true);
	}
	if(F2.dfs){
		F.dfs.value = F2.dfs.value;
		change_onoff_val(idoc, idoc.getElementById('dfs_id'), true);
	}
	if(F2.txbfmumode){
		F.txbfmumode.value = F2.txbfmumode.value;
	}
	if(F2.muflag){
		if(wl_mode === '2g')
		{
			F.muflag.value = '0';
			DisableObj_V2(F.muflag);
		}
		else
		{
			F.muflag.value = F2.muflag.value;
			EnableObj_V2(F.muflag);
		}
	}
	if(F2.mimoant){
		F.mimoant.value = F2.mimoant.value;
	}

	if(channelupdate){
		update_channel_options(F2.country.value, F2.realchanwidth.value, F2.ctlchannel.value + '.' 
			+ F2.cntchannel.value, F2.autochannel.value == '1'?true:false, wl_mode);
	}
	var titlestat = idoc.getElementById('timg').src.indexOf('closed');
	var trs = idoc.getElementsByName('tableunit');
	if(!trs || trs.length == 0)	idoc.getElementsByTagName('tr');
	if(titlestat == -1){
		for(var i = 0; i < trs.length; i ++){
			if(trs[i].id == 'extendsetuptitle')	continue;
			ShowObj_V2(trs[i]);
		}
	}else{
		for(var i = 0; i < trs.length; i ++){
			if(trs[i].id == 'extendsetuptitle')	continue;
			HideObj_V2(trs[i]);
		}
	}
	UnMaskIt(parent.document, 'apply_mask');
}

function update_multibssid_lines()
{
	var ifr = parent.document.multibssid_iframe || parent.document.getElementsByName('multibssid_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.multibssid_fm;
	if(!F)	return;
	var ifr2 = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr2)	return;
	var idoc2 = ifr2.document || ifr2.contentWindow.document;
	if(!idoc2)	return;
	var F2 = idoc2.hiddenwlsetup_fm;
	if(!F2)	return;

	F.action.value = 'refresh';
	F.clicked_id.value = 'BSSID_'+F2.sidx.value+'_'+F2.uiidx.value+'_'+F2.wlmode.value;
	F.submit();
	UnMaskIt(parent.document, 'apply_mask');
}

function Clicked_Multibssid(frm, obj)
{
	var F = document.multibssid_fm;

	if(frm)		F = frm;
	if(!obj)	return;

	var ifr = parent.document.hiddenwlsetup_iframe || parent.document.getElementsByName('hiddenwlsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F2 = idoc.hiddenwlsetup_fm;
	if(!F2)	return;

	if(F.clicked_id.value == obj.id)	return;	

	if(F.clicked_id.value != ''){
		document.getElementById(F.clicked_id.value).style.backgroundColor = F.clicked_bg.value;
		var wpsobj2 = document.getElementById(F.clicked_id.value + '_wps');
		if(wpsobj2)	wpsobj2.style.backgroundColor=F.clicked_bg.value;
	}

	F.clicked_bg.value = obj.style.backgroundColor;
	F.clicked_id.value = obj.id;
	obj.style.backgroundColor='#C9D5E9';
	var wpsobj = document.getElementById(obj.id + '_wps');
	if(wpsobj)	wpsobj.style.backgroundColor='#C9D5E9';

	F2.action.value = 'changebssid';
	F2.sidx.value = obj.id.split('_')[1];
	if(F2.sidx.value == '0'){
		ShowObj_V2(parent.document.getElementById('extline'));
	}else{
		HideObj_V2(parent.document.getElementById('extline'));
	}

	F2.uiidx.value = obj.id.split('_')[2];
	F2.wlmode.value = obj.id.split('_')[3];
	F2.submit();
}

function init_hiddensetup(wl_mode, mupdate, bupdate, eupdate, chanup)
{	
	if(!iframe_ready(parent))
	{
		setTimeout(function() { init_hiddensetup(wl_mode, mupdate, bupdate, eupdate, chanup); }, 10);
		return;
	}
	var F = document.hiddenwlsetup_fm;
	if(mupdate)
		update_multibssid_lines();
	if(bupdate)
		update_basicsetup_lines(wl_mode);
	if(eupdate){
		update_extendsetup_lines(chanup);
	}
}

function init_multibssid(ifrsize)
{
	var F = document.multibssid_fm;
	var Obj = document.getElementById('BSSID_0_0_1');
	if(!Obj)	Obj = document.getElementById('BSSID_0_0_0');
	var ifr = parent.document.getElementsByName('multibssid_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;

	if(!F || !Obj)	return;

	F.clicked_bg.value = Obj.style.backgroundColor;
	F.clicked_id.value = Obj.id;
	Obj.style.backgroundColor='#C9D5E9';
	var wpsobj = document.getElementById(Obj.id + '_wps');
	if(wpsobj)	wpsobj.style.backgroundColor='#C9D5E9';
	resize_iframe_height(ifr, idoc, ifrsize);
}

function init_basicsetup(wl_mode)
{
	if(!iframe_ready(parent))
	{
		setTimeout(function() { init_basicsetup(wl_mode); }, 10);
		return;
	}
	update_basicsetup_lines(wl_mode);
}

function init_extendsetup(ifrsize)
{
	if(!iframe_ready(parent))
	{
		setTimeout(function() { init_extendsetup(ifrsize); }, 10);
		return;
	}
	var ifr = parent.document.getElementsByName('extendsetup_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	update_extendsetup_lines(false);
	resize_iframe_height(ifr, idoc, ifrsize);
}

function init_wpsstatus(time, firstload)
{
	if(!iframe_ready(parent))
	{
		setTimeout(function() { init_wpsstatus(time, firstload); }, 10);
		return;
	}
	if(firstload)
		wps_processing_func();
	else
		setTimeout(wps_processing_func, time);
}

function wps_processing_func()
{
	var pdoc = document;
	var pf = document.wps_fm || document.getElementsByName('wps_fm')[0];
	if(!pf){return;}
	var ifr = document.wpsstatus_iframe || document.getElementsByName('wpsstatus_iframe')[0];
	if(!ifr)	return;
	var idoc = ifr.document || ifr.contentWindow.document;
	if(!idoc)	return;
	var F = idoc.wpsstatus_fm || idoc.getElementsByName('wpsstatus_fm')[0];
	if(!F){return;}
	var mfr = parent.document.multibssid_iframe || parent.document.getElementsByName('multibssid_iframe')[0];
	if(!mfr)	return;
	var mdoc = mfr.document || mfr.contentWindow.document;
	if(!mdoc)	return;

	var rtime2g = parseInt(F.remaintime2g.value);
	if(F.remaintime5g)	var rtime5g = parseInt(F.remaintime5g.value);

	var stat2g = F.statusval2g.value;
	if(F.statusval5g)	var stat5g = F.statusval5g.value;

	if(F.statusval5g){
		var stat = F.statusval2g.value;
		switch(stat5g){
			case 'WPS_STOP':case 'WPS_IDLE':case 'WPS_ERROR':case 'WPS_TIMEOUT':case 'WPS_START':case 'NONE':
				if(stat2g != 'WPS_CONFIGURED' && stat2g != 'WPS_PROCESSING')	stat = 'NONE';
				break;
			case 'WPS_CONFIGURED':
				if(stat2g != 'WPS_CONFIGURED' && stat2g != 'WPS_PROCESSING')	stat = 'WPS_CONFIGURED';
				break;
			case 'WPS_PROCESSING':
				if(stat2g != 'WPS_CONFIGURED' && stat2g != 'WPS_PROCESSING')	stat = 'WPS_PROCESSING';
				break;
		}
	}else{
		var stat = F.statusval2g.value;
	}
	
	var activated2g = (F.run2g.value == '1' && F.wpsmode2g.value == '1');
	if(F.run5g && F.wpsmode5g)	var activated5g = (F.run5g.value == '1' && F.wpsmode5g.value == '1');
	else				var activated5g = false;

	var activated = (activated2g || activated5g);
	var msg = '';

	if(pf.submitted.value != ''){F.submit();	return;}
	if(F.run2g && F.wpsmode2g){
		if(activated2g){	
			EnableObj_V2(pdoc.getElementById('wpsconn2g'));
			switch(stat2g){
				case 'WPS_STOP':case 'WPS_IDLE':case 'WPS_ERROR':case 'WPS_TIMEOUT':case 'WPS_START':case 'NONE':
					pf.act2gbtn.value = 'start';
					msg = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
					pdoc.getElementById('wpsconn2g').innerHTML = msg;
					HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE2G'));
					break;
				case 'WPS_CONFIGURED':
					pf.act2gbtn.value = 'start';
					msg = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
					pdoc.getElementById('wpsconn2g').innerHTML = msg;
					HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE2G'));
					break;
				case 'WPS_PROCESSING':
					pf.act2gbtn.value = 'stop';
					msg = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSDISSBTN;
					pdoc.getElementById('wpsconn2g').innerHTML = msg;
					msg = 'WPS ' + rtime2g + WIRELESSCONF_BASICSETUP_SECOND;
					var mobj = mdoc.getElementById('WPSSTATUS_TEXT2G');
					if(mobj)	mobj.innerHTML = msg;
					mobj = null;
					ShowObj_V2(mdoc.getElementById('WPSSTATUS_LINE2G'));
					break;
				default:		break;
			}
		}else{
			pf.act2gbtn.value = '';
			msg = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
			pdoc.getElementById('wpsconn2g').innerHTML = msg;
			DisableObj_V2(pdoc.getElementById('wpsconn2g'));
			HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE2G'));
		}
	}

	if(F.run5g && F.wpsmode5g){
		if(activated5g){	
			EnableObj_V2(pdoc.getElementById('wpsconn5g'));
			switch(stat5g){
				case 'WPS_STOP':case 'WPS_IDLE':case 'WPS_ERROR':case 'WPS_TIMEOUT':case 'WPS_START':case 'NONE':
					pf.act5gbtn.value = 'start';
					msg = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
					pdoc.getElementById('wpsconn5g').innerHTML = msg;
					HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE5G'));
					break;
				case 'WPS_CONFIGURED':
					pf.act5gbtn.value = 'start';
					msg = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
					pdoc.getElementById('wpsconn5g').innerHTML = msg;
					HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE5G'));
					break;
				case 'WPS_PROCESSING':
					pf.act5gbtn.value = 'stop';
					msg = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSDISSBTN;
					pdoc.getElementById('wpsconn5g').innerHTML = msg;
					msg = 'WPS ' + rtime5g + WIRELESSCONF_BASICSETUP_SECOND;
					var mobj = mdoc.getElementById('WPSSTATUS_TEXT5G');
					if(mobj)	mobj.innerHTML = msg;
					mobj = null;
					ShowObj_V2(mdoc.getElementById('WPSSTATUS_LINE5G'));
					break;
				default:		break;
			}
		}else{
			pf.act5gbtn.value = '';
			msg = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
			pdoc.getElementById('wpsconn5g').innerHTML = msg;
			DisableObj_V2(pdoc.getElementById('wpsconn5g'));
			HideObj_V2(mdoc.getElementById('WPSSTATUS_LINE5G'));
		}
	}

	if(activated){
		switch(stat){
			case 'WPS_STOP':case 'WPS_IDLE':case 'WPS_ERROR':case 'WPS_TIMEOUT':case 'WPS_START':case 'NONE':
				pdoc.getElementById('wpsstatus').innerHTML = '';
				break;
			case 'WPS_CONFIGURED':
				pdoc.getElementById('wpsstatus').innerHTML = WIRELESSCONF_WPSSETUP_CONFIGURED;
				break;
			case 'WPS_PROCESSING':
				pdoc.getElementById('wpsstatus').innerHTML = WIRELESSCONF_WPSSETUP_PROCESSING;
				break;
			default:
				pdoc.getElementById('wpsstatus').innerHTML = '';
				break;
		}
	}

	F.submit();
	try{
		rtime5g = null;	stat5g = null; activated5g = null;	
	}finally
	{
		pdoc = null;	pf = null;	ifr = null; idoc = null;	F = null; mfr = null; mdoc = null;
		rtime2g = null;	stat2g = null;	stat = null;	activated2g = null;	activated = null;	msg = null;
	}
}

function init_wpssetup()
{
	var btn2g = document.getElementById('wpsconn2g');
	if(btn2g)	btn2g.innerHTML = '2.4 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
	var btn5g = document.getElementById('wpsconn5g');
	if(btn5g)	btn5g.innerHTML = '5 GHz ' + WIRELESSCONF_BASICSETUP_WPSCONNBTN;
}

function init_mainsetup_form()
{
	var settext = parent.frames[3].document.getElementById('wireless_basicsetup_text');

	if(!settext){
		setTimeout(init_mainsetup_form, 1000);	return;
	}

	if(settext){
		settext.innerHTML = WIRELESSCONF_BASICSETUP_TITLESTR;
	}
}

function iframe_ready(mainFrame)
{
	if( mainFrame.iframe_searchwireless && mainFrame.iframe_multibssid && mainFrame.iframe_hiddenwlsetup && mainFrame.iframe_wpssubmit 
	&& mainFrame.iframe_wpsstatus && mainFrame.iframe_wpssetup && mainFrame.iframe_basicsetup && mainFrame.iframe_extendsetup)
		return true;
	return false;
}

</script>
