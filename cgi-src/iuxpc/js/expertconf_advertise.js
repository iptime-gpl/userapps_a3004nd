<script>
var regExp_string = /[\{\}\[\]\/?;:|*~`!^+<>@$%\\\=\'\"]/g;
var regExp_http = /[\{\}\[\]\?;|*~`!^+<>@$%\\\=\'\"]/g;

function isIE6()
{
	var retv = -1;
	if (window.navigator && navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			retv = parseFloat( RegExp.$1 );
	}
	return ((retv==6.0)?true:false);
}

function add_hiddeninput(F, elem, idoc)
{
        if(!F || !elem) return;

        var crelm = document.createElement('input');
	if(idoc)	crelm = idoc.createElement('input');
        crelm.type = 'hidden';
        /*IE 5*/
        if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');

        if(elem.type == 'checkbox'){
                crelm.value = elem.checked?'on':'off';
                crelm.setAttribute('value', elem.checked?'on':'off');
        }
        else if(elem[0] && elem[0].type == 'radio'){
                crelm.value = GetValue(elem);
                crelm.setAttribute('value', GetValue(elem));
        }
        else{
                crelm.value = elem.value;
                crelm.setAttribute('value', elem.value);
        }

        if(elem[0] && elem[0].type == 'radio'){
                crelm.name = elem[0].name;
                crelm.setAttribute('name', elem[0].name);
        }else{
                crelm.name = elem.name;
                crelm.setAttribute('name', elem.name);
        }

        F.appendChild(crelm);
        /*IE 5*/
        if(!F[elem.name])
                F[elem.name] = crelm;

}

function check_input_error(str, regExp, type)
{
        if(type == 'unpermitted'){if(str.match(regExp)) return true;}
        else if(!type || type == 'match'){if(!str.match(regExp)) return true;}
        return false;
}

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
}

function ApplyAdvertise(act)
{
        var F=document.advertise_fm;
	var ifr = document.hiddenadvertisesetup_iframe || document.getElementsByName('hiddenadvertisesetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hiddenadvertisesetup;
        if(!iform)      return;

	var desclen;
	
	if(F.url_redir_url.value == '' || check_input_error(F.url_redir_url.value, regExp_http, 'unpermitted')){
		alert(EXPERTCONF_ADVERTISE_URLREDIR_INVALID);
		F.url_redir_url.focus();
		F.url_redir_url.select();
		return;
	}
	var cycleval = F.cycle.value;
	if(cycleval == '' || isNaN(cycleval) || ((parseInt(cycleval)) % 5) != 0){
		alert(EXPERTCONF_ADVERTISE_CYCLE_INVALID);
		F.cycle.focus();
		F.cycle.select();
		return;
	}
	if(F.btnmsg.value != '' && check_input_error(F.btnmsg.value, regExp_string, 'unpermitted')){
		alert(EXPERTCONF_ADVERTISE_BTNMSG_INVALID);
		F.btnmsg.focus();
		F.btnmsg.select();
		return;
	}
	if(F.btnmsg.value != ''){
		if((desclen=StrLenUTF8CharCode(F.btnmsg.value)) > 255)
                {
                        alert(MSG_DESC_TOO_LONG+desclen+'bytes');
			F.btnmsg.focus();
			F.btnmsg.select();
                        return;
                }
	}
	if(F.usermsg.value != '' && check_input_error(F.usermsg.value, regExp_string, 'unpermitted')){
		alert(EXPERTCONF_ADVERTISE_USERMSG_INVALID);
		F.usermsg.focus();
		F.usermsg.select();
		return;
	}
	if(F.usermsg.value != ''){
		if((desclen=StrLenUTF8CharCode(F.usermsg.value)) > 255)
                {
                        alert(MSG_DESC_TOO_LONG+desclen+'bytes');
			F.usermsg.focus();
			F.usermsg.select();
                        return;
                }
	}
	if(F.usermsg2.value != '' && check_input_error(F.usermsg2.value, regExp_string, 'unpermitted')){
		alert(EXPERTCONF_ADVERTISE_USERMSG2_INVALID);
		F.usermsg2.focus();
		F.usermsg2.select();
		return;
	}
	if(F.usermsg2.value != ''){
		if((desclen=StrLenUTF8CharCode(F.usermsg2.value)) > 255)
                {
                        alert(MSG_DESC_TOO_LONG+desclen+'bytes');
			F.usermsg2.focus();
			F.usermsg2.select();
                        return;
                }
	}
	if(F.whitelist.value != '' && check_input_error(F.whitelist.value, regExp_http, 'unpermitted')){
		alert(EXPERTCONF_ADVERTISE_WHITELIST_INVALID);
		F.whitelist.focus();
		F.whitelist.select();
		return;
	}

	document.getElementById('advertise_div_msg').innerHTML = EXPERTCONF_ADVERTISE_APPLYSTR;
	MaskIt(document, 'apply_mask');

        F.act.value=act;
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenadvertisesetup';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.url_redir, idoc);
	add_hiddeninput(iform, F.url_redir_url, idoc);
	add_hiddeninput(iform, F.url_redir_autoconfirm, idoc);
	add_hiddeninput(iform, F.cycle, idoc);
	add_hiddeninput(iform, F.btnmsg, idoc);
	add_hiddeninput(iform, F.usermsg, idoc);
	add_hiddeninput(iform, F.usermsg2, idoc);
	add_hiddeninput(iform, F.whitelist, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.url_redir);
	add_hiddeninput(iform, F.url_redir_url);
	add_hiddeninput(iform, F.url_redir_autoconfirm);
	add_hiddeninput(iform, F.cycle);
	add_hiddeninput(iform, F.btnmsg);
	add_hiddeninput(iform, F.usermsg);
	add_hiddeninput(iform, F.usermsg2);
	add_hiddeninput(iform, F.whitelist);
}

        iform.submit();
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
        var F=document.advertise_fm;
	var ifr = document.advertiseexlist_iframe || document.getElementsByName('advertiseexlist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.advertisefreedevice_fm;
        if(!iform)      return;
	var desclen;

        if (obj=CheckIP('free_sip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus(); obj.select();
                return;
        }
        if (F.free_eip4.value != '' && (obj=CheckIP('free_eip')))
        {
                alert(MSG_INVALID_IP);
                obj.focus(); obj.select();
                return;
        }
        if((parseInt(F.free_sip4.value) +  parseInt(F.free_sip3.value) * 256 +
            parseInt(F.free_sip2.value) * 65536 +  parseInt(F.free_sip1.value) * 16777216 ) >
           (parseInt(F.free_eip4.value) +  parseInt(F.free_eip3.value) * 256 +
            parseInt(F.free_eip2.value) * 65536 +  parseInt(F.free_eip1.value) * 16777216 ))
        {
                alert(EXPERTCONF_ADVERTISE_IPRANGE_INVALID);
                F.free_eip4.focus();
                F.free_eip4.select();
                return;
        }
        if (F.dev_desc.value=='' || check_input_error(F.dev_desc.value, regExp_string, 'unpermitted'))
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.dev_desc.focus();
                return;
        }
	if(F.dev_desc.value != ''){
		if((desclen=StrLenUTF8CharCode(F.dev_desc.value)) > 128)
                {
                        alert(MSG_DESC_TOO_LONG2+desclen+'bytes');
			F.dev_desc.focus();
			F.dev_desc.select();
                        return;
                }
	}

	document.getElementById('advertise_div_msg').innerHTML = EXPERTCONF_ADVERTISE_ADDSTR;
	MaskIt(document, 'apply_mask');

	F.act.value='add';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'advertiseexlist';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.free_sip1, idoc);
	add_hiddeninput(iform, F.free_sip2, idoc);
	add_hiddeninput(iform, F.free_sip3, idoc);
	add_hiddeninput(iform, F.free_sip4, idoc);
	if(F.free_eip4 != ''){
		add_hiddeninput(iform, F.free_eip1, idoc);
		add_hiddeninput(iform, F.free_eip2, idoc);
		add_hiddeninput(iform, F.free_eip3, idoc);
		add_hiddeninput(iform, F.free_eip4, idoc);
	}
	add_hiddeninput(iform, F.dev_desc, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.free_sip1);
	add_hiddeninput(iform, F.free_sip2);
	add_hiddeninput(iform, F.free_sip3);
	add_hiddeninput(iform, F.free_sip4);
	if(F.free_eip4 != ''){
		add_hiddeninput(iform, F.free_eip1);
		add_hiddeninput(iform, F.free_eip2);
		add_hiddeninput(iform, F.free_eip3);
		add_hiddeninput(iform, F.free_eip4);
	}
	add_hiddeninput(iform, F.dev_desc);
}
	iform.submit();

	F.free_sip4.value = '';
	F.free_eip4.value = '';
	F.dev_desc.value = '';
}

function DeleteAdvertiseFreeDevice(index)
{
        var F=document.advertise_fm;
	var ifr = document.advertiseexlist_iframe || document.getElementsByName('advertiseexlist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.advertisefreedevice_fm;
        if(!iform)      return;

	if(!iform.delchk || iform.delchk.length == 0){
		alert(EXPERTCONF_ADVERTISE_NOCHECK_DEL);	return;
	}else{
		var chk_count = 0;
		if(iform.delchk.length){
			for(var i = 0; i < iform.delchk.length; i++){
				if(iform.delchk[i].checked)	chk_count += 1;
			}
		}else{
			if(iform.delchk.checked)	chk_count += 1;
		}
		if(chk_count == 0){
			alert(EXPERTCONF_ADVERTISE_NOCHECK_DEL);	return;
		}
	}

        if (confirm(MSG_DELETE_RULE_CONFIRM))
        {
		document.getElementById('advertise_div_msg').innerHTML = EXPERTCONF_ADVERTISE_DELSTR;
	        MaskIt(document, 'apply_mask');

                F.act.value='del';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'advertiseexlist';
if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
}
                iform.submit();
        }
}

function setAddBtnDisable(flag)
{
	if(flag){
		DisableObj(document.getElementById('addbtn'));
	}else{
		EnableObj(document.getElementById('addbtn'));
	}
}
</script>
