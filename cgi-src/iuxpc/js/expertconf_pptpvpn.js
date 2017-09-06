<script>

var regExp_text = /^([0-9a-zA-Z]|[_]){1,30}$/;

function check_input_error(string, regExp)
{
        if(!string || !string.match(regExp) )
                return true;
        return false;
}

function update_pptpvpn_status(id, val, chkid, disabled)
{
	var ifr = document.pptpvpn_account || document.getElementsByName('pptpvpn_account')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;

	var idval = idoc.getElementById(id);
	if(!idval)	return;
	idval.innerHTML = val;

	var chkbox = idoc.getElementById(chkid);
	if(disabled)	{chkbox.disabled = true; chkbox.checked = false;}
	else		chkbox.disabled = false;
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
	if(!e)	e = window.event;
	e.cancelbubble = true;
	if(e.stopPropagation)	e.stopPropagation();
	if(e.preventDefault)	e.preventDefault();
	return false;
}

function onclick_passview(chk)
{
	var F = document.pptpvpn_conf_fm;
	var passobj = F.password;
	var txtobj = F.password_text;
	if(chk){
		txtobj.value = passobj.value;
		txtobj.style.display = '';
		passobj.style.display = 'none';
	}else{
		passobj.value = txtobj.value;
		txtobj.style.display = 'none';
		passobj.style.display = '';
	}
}

function onclick_alldischk(obj)
{
	var ifr = document.pptpvpn_account || document.getElementsByName('pptpvpn_account')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;

	CheckAllCheckBox(idoc,obj,'dischk'); 
}

function onclick_alldelchk(obj)
{
	var ifr = document.pptpvpn_account || document.getElementsByName('pptpvpn_account')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;

	CheckAllCheckBox(idoc,obj,'delchk'); 
}

function clear_accountpart()
{
        var F=document.pptpvpn_conf_fm;

	F.account.value = '';
	F.password.value = '';
	F.password_text.value = '';
	F.ip4.value = '';
	if(F.captcha_code && F.captcha_file){
		F.captcha_code.value = '';
		F.captcha_file.value = '';
		iframe_captcha.location.reload();
	}
}

function get_pptpvpn_ipstring(F)
{
	return F.ip1.value + '.' + F.ip2.value + '.' + F.ip3.value + '.' + F.ip4.value;
}

function Compare_IPval(idoc, ipval)
{
	if(idoc.getElementById('ipa_'+ipval))	return true;
	else					return false;
}

function Compare_Accountval(idoc, accval)
{
	if(idoc.getElementById('acc_'+accval))	return true;
	else					return false;
}

function AddPPTPServerUser()
{
        var F=document.pptpvpn_conf_fm;
	var ifr = document.pptpvpn_account || document.getElementsByName('pptpvpn_account')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.pptpvpn_account_fm;
        if(!iform)      return;

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

	if(document.getElementById('passview').checked){
        	if(F.password_text.value == '')
        	{
        	        alert(EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK);
        	        F.password_text.focus();
        	        return;
        	}
	}else{
        	if(F.password.value == '')
        	{
        	        alert(EXPERTCONF_PPTPVPN_VPN_PASSWORD_IS_BLANK);
        	        F.password.focus();
        	        return;
        	}
	}
        if(F.account.value == '' || check_input_error(F.account.value, regExp_text))
        {
                alert(EXPERTCONF_PPTPVPN_VPN_ACCOUNT_IS_BLANK);
                F.account.focus();
                return;
        }
        if(obj=CheckIP('ip'))
        {
                alert(EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID);
                obj.focus();
                obj.select();
		return;
        }
        if(obj=CheckIPNetwork('ip'))
        {
                alert(EXPERTCONF_PPTPVPN_IP_ADDRESS_IS_INVALID);
                obj.focus();
                obj.select();
		return;
        }
	if(Compare_IPval(idoc, get_pptpvpn_ipstring(F))){
		alert(EXPERTCONF_PPTPVPN_IPADDR_OVERLAP);
		return;
	}
	if(Compare_Accountval(idoc, F.account.value)){
		alert(EXPERTCONF_PPTPVPN_ACCOUNT_OVERLAP);
		return;
	}

	document.getElementById('pptpvpn_div_msg').innerHTML = EXPERTCONF_PPTPVPN_ADDSTR;
	MaskIt(document, 'apply_mask');

	iform.act.value = 'add';
if(isIE6()){
	add_hiddeninput(iform, F.captcha_code, idoc);
	add_hiddeninput(iform, F.captcha_file, idoc);
	add_hiddeninput(iform, F.account, idoc);
}else{
	add_hiddeninput(iform, F.captcha_code);
	add_hiddeninput(iform, F.captcha_file);
	add_hiddeninput(iform, F.account);
}
	if(document.getElementById('passview').checked){
		F.password.value = F.password_text.value;
	}
if(isIE6()){
	add_hiddeninput(iform, F.password, idoc);
	add_hiddeninput(iform, F.ip1, idoc);
	add_hiddeninput(iform, F.ip2, idoc);
	add_hiddeninput(iform, F.ip3, idoc);
	add_hiddeninput(iform, F.ip4, idoc);
}else{
	add_hiddeninput(iform, F.password);
	add_hiddeninput(iform, F.ip1);
	add_hiddeninput(iform, F.ip2);
	add_hiddeninput(iform, F.ip3);
	add_hiddeninput(iform, F.ip4);
}

	iform.submit();

	clear_accountpart();
}

function RemovePPTPUser(F)
{
	if(!F.delchk || F.delchk.length == 0){
		alert(EXPERTCONF_PPTPVPN_NOSELECT);	return;
	}
	else{
		var chkcount = 0;
		if(F.delchk.length){
			for(var i = 0; i < F.delchk.length; i++){
				if(!F.delchk[i].disabled && F.delchk[i].checked)	chkcount += 1;
			}
		}else{
			if(!F.delchk.disabled && F.delchk.checked)	chkcount += 1;
		}
		if(chkcount == 0){
			alert(EXPERTCONF_PPTPVPN_NOSELECT);	return;
		}
	}

        if (confirm(EXPERTCONF_PPTPVPN_DO_YOU_WANT_DELETE))
        {
		document.getElementById('pptpvpn_div_msg').innerHTML = EXPERTCONF_PPTPVPN_DELETESTR;
		MaskIt(document, 'apply_mask');
		F.act.value = 'del';
		F.submit();
        }
}

function DisconnectPPTPUser(F)
{
	if(!F.dischk || F.dischk.length == 0){
		alert(EXPERTCONF_PPTPVPN_NOSELECT);	return;
	}
	else{
		var chkcount = 0;
		if(F.dischk.length){
			for(var i = 0; i < F.dischk.length; i++){
				if(!F.dischk[i].disabled && F.dischk[i].checked)	chkcount += 1;
			}
		}else{
			if(!F.dischk.disabled && F.dischk.checked)	chkcount += 1;
		}
		if(chkcount == 0){
			alert(EXPERTCONF_PPTPVPN_NOSELECT);	return;
		}
	}

	document.getElementById('pptpvpn_div_msg').innerHTML = EXPERTCONF_PPTPVPN_DISCONNSTR;
	MaskIt(document, 'apply_mask');
	F.act.value = 'disconnect';
        F.submit();
}

function ApplyPPTP()
{
        var F = document.pptpvpn_conf_fm;
	var ifr = document.hiddenpptpvpnsetup_iframe || document.getElementsByName('hiddenpptpvpnsetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hiddenvpnsetup;
        if(!iform)      return;

	document.getElementById('pptpvpn_div_msg').innerHTML = EXPERTCONF_PPTPVPN_APPLYSTR;
	MaskIt(document, 'apply_mask');

        F.act.value='apply';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hiddenpptpvpnsetup';

if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.operation, idoc);
	add_hiddeninput(iform, F.mppe, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.operation);
	add_hiddeninput(iform, F.mppe);
}
	F.act.value = '';

        iform.submit();
}

function init_pptpvpn()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
}
</script>
