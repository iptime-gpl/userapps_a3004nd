<script>

var regExp_text = /^([0-9a-zA-Z]|[-]){1,32}$/;
var regExp_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

function CheckHostNameValue(obj)
{
	var chr = obj.value;
	var objname = obj.name;
	for (i=0; i<chr.length; i++)
	{
		var ch = chr.charAt(i);
		if (( ch < "a" || ch > "z") && (ch < "A" || ch > "Z") && (ch < "0" || ch > "9" ) && ( ch != ".")  && (ch != "-"))
		{
			alert(DDNS_HOSTNAME_RULE_TXT);
			obj.value = chr.replace(ch, "");
			obj.blur();
		}
	}
}

function check_input_error(string, regExp)
{
        if(!string || !string.match(regExp) )
                return true;
        return false;
}

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

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
}

function AddHost()
{
	var F = document.dyndns_conf;
        var ifr = document.hiddenddnssetup_iframe || document.getElementsByName('hiddenddnssetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hiddenddnssetup;
        if(!iform)      return;

	if(F.captcha_code)
        {
                if(F.captcha_code.value == '' || F.captcha_code.value == F.default_captcha_desc.value)
                {
                        alert(EXPERTCONF_DDNS_CAPTCHACHECK);
                        F.captcha_code.focus();
                        return;
                }
                F.captcha_file.value=iframe_captcha.captcha_form.captcha_file.value;
        }

	if(F.hostname.value == '' || check_input_error(F.hostname.value, regExp_text))
	{
		alert(EXPERTCONF_DDNS_HOSTNAMECHECK);
		F.hostname.focus();
		if(F.hostname.select)	F.hostname.select();
		return;
	}
	if(F.userid.value == '' || check_input_error(F.userid.value, regExp_email))
	{
		alert(EXPERTCONF_DDNS_USERIDCHECK);
		F.userid.focus();
		if(F.userid.select)	F.userid.select();
		return;
	}

	document.getElementById('ddns_div_msg').innerHTML = EXPERTCONF_DDNS_ADDSTR;
        MaskIt(document, 'apply_mask');
	
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenddnssetup';
	F.act.value = 'addhost';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.select_ddns, idoc);
	add_hiddeninput(iform, F.select_wan, idoc);
	add_hiddeninput(iform, F.hostname, idoc);
	iform.hostname.value = iform.hostname.value + '.iptime.org';
	add_hiddeninput(iform, F.userid, idoc);
	add_hiddeninput(iform, F.captcha_code, idoc);
	add_hiddeninput(iform, F.captcha_file, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.select_ddns);
	add_hiddeninput(iform, F.select_wan);
	add_hiddeninput(iform, F.hostname);
	iform.hostname.value = iform.hostname.value + '.iptime.org';
	add_hiddeninput(iform, F.userid);
	add_hiddeninput(iform, F.captcha_code);
	add_hiddeninput(iform, F.captcha_file);
}	
	iform.submit();

	F.act.value = '';
	F.tmenu.value = '';
	F.smenu.value = '';
	F.hostname.value = '';
	F.userid.value = '';
	if(F.captcha_code)	F.captcha_code.value = '';
	if(F.captcha_file)	F.captcha_file.value = '';
	if(document.iframe_captcha)	iframe_captcha.location.reload();
}

function update_status_ddns(viewstat,hname, stat, ipaddr, last, next, uid, viewrefresh)
{
	if(viewstat)
	{
		MaskIt(document, 'setup_mask');
		document.getElementById('STATTABLE').style.display = '';

		document.getElementById('HOSTNAMEVAL').innerHTML = hname;
		document.getElementById('CONNSTATUSVAL').innerHTML = stat;
		document.getElementById('IPADDRVAL').innerHTML = ipaddr;
		document.getElementById('LASTVAL').innerHTML = last;
		document.getElementById('NEXTVAL').innerHTML = next;
		document.getElementById('IDVAL').innerHTML = uid;

		if(viewrefresh){
			document.getElementById('ref_bt').style.display = '';
		}else{
			document.getElementById('ref_bt').style.display = 'none';
		}
		if(document.dyndns_conf.refhostname)	document.dyndns_conf.refhostname.value = hname;
	}
	else
	{
		UnMaskIt(document, 'setup_mask');
		document.getElementById('STATTABLE').style.display = 'none';
	}
}

function RefreshHost() 
{ 
        var F = document.dyndns_conf; 
        var ifr = document.hiddenddnssetup_iframe || document.getElementsByName('hiddenddnssetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hiddenddnssetup;
        if(!iform)      return;

	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenddnssetup';
        F.act.value = "refreshhost"; 
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.refhostname, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.refhostname);
}

	document.getElementById('ddns_div_msg').innerHTML = EXPERTCONF_DDNS_REFRESHSTR;
        MaskIt(document, 'apply_mask');
	iform.submit();
} 

function DelHost()
{
	if(!confirm(EXPERTCONF_DDNS_DELCONFIRM))	return;

        var F = document.dyndns_conf;
        var ifr = document.hiddenddnssetup_iframe || document.getElementsByName('hiddenddnssetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hiddenddnssetup;
        if(!iform)      return;

        F.act.value = "delhost";
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenddnssetup';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.refhostname, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.refhostname);
}

	document.getElementById('ddns_div_msg').innerHTML = EXPERTCONF_DDNS_DELSTR;
        MaskIt(document, 'apply_mask');
	iform.submit();
}

function resetInputForm(hname, id)
{
	var F = document.dyndns_conf;
	if(hname)
		F.hostname.value = hname.split('.')[0];
	F.userid.value = id;
}

function InitDDNS()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
}

</script>
