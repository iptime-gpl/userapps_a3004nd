<script>
var regExp_url = /[-a-zA-Z0-9@%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

function validate_string(str, regExp, type)
{
        if(type == 'unpermitted'){if(str.match(regExp)) return false;}
        else if(!type || type == 'match'){if(!str.match(regExp)) return false;}
        return true;
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

function add_hiddeninput(F, elem, idoc, checkopt)
{
        if(!F || !elem) return;

        var crelm = document.createElement('input');
	if(idoc)	crelm = idoc.createElement('input');
        crelm.type = 'hidden';
        /*IE 5*/
        if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');

        if(elem.type == 'checkbox'){
		if(checkopt){
			if(!elem.checked)	return;
                	crelm.value = elem.value;
                	crelm.setAttribute('value', elem.value);
		}else{
                	crelm.value = elem.checked?'on':'off';
                	crelm.setAttribute('value', elem.checked?'on':'off');
		}
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

function onclick_etclist()
{
	var lists = document.getElementsByName('etcline');
	var timg = document.getElementById('timg');
	if(!lists || lists.length == 0)	lists = document.getElementsByTagName('tr');
	if(!timg)	return;

	if(timg.src.indexOf('closed') == -1){
		for(var i = 0; i < lists.length; i++){
			if(lists[i].getAttribute('name') == 'etcline')
				HideObj(lists[i]);
		}
		timg.src = timg.src.replace('opened', 'closed');
	}else{
		for(var i = 0; i < lists.length; i++){
			if(lists[i].getAttribute('name') == 'etcline')
				ShowObj(lists[i]);
		}
		timg.src = timg.src.replace('closed', 'opened');
	}
}

function onclick_onoffbtn(obj)
{
	if(!obj)	return;
	var idval = obj.id;
	if(!idval)	return;
	idval = idval.split('_');
	var nameval = '';
	for(var i = 0; i < idval.length-1 ; i++){
		if(i != 0)	nameval += '_';
		nameval += idval[i];
	}
	
	var hobj = document.getElementsByName(nameval);
	if(!hobj || !hobj[0])	return;
	hobj = hobj[0];
	
	if(hobj.value == '1'){
		obj.src = obj.src.replace('trigger_on', 'trigger_off');
		hobj.value = '0';
	}
	else if(hobj.value == 'on'){
		obj.src = obj.src.replace('trigger_on', 'trigger_off');
		hobj.value = 'off';
	}
	else if(hobj.value == 'off'){
		obj.src = obj.src.replace('trigger_off', 'trigger_on');
		hobj.value = 'on';
	}
	else{
		obj.src = obj.src.replace('trigger_off', 'trigger_on');
		hobj.value = '1';
	}
}

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
}

function ext_partsubmit(obj, ip)
{
	var F = document.ext_ipform;
	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

	if(!obj)	return;
	
	var nomore = F.nomore.value;
	var noadd = F.noadd.value;
	var isinternal = F.isinternal.value;
	
        if(obj.checked == true)
        {
                if(nomore == 'true')
                {
			if(isinternal == 'false' && noadd == 'true'){
                        	if(confirm(ACCESSLIST_AUTO_NOADD)){
                        	        F.act.value = 'ext_run';
				}else{
					obj.checked = false;
					disableFormAccessList();
					return;
				}
			}else{
				F.act.value = 'ext_run';
			}
                }
                else
		{
			if(isinternal == 'false' && noadd == 'true'){
                        	if(confirm(ACCESSLIST_NOIPLISTMSG_1+ip+ACCESSLIST_NOIPLISTMSG_2)){
                        	        F.act.value = 'ext_run';
				}
				else{
					obj.checked = false;
					disableFormAccessList();
					return;
				}
			}else{
				F.act.value = 'ext_run';
			}
		}
        }
        else
                F.act.value = 'ext_stop';

	document.getElementById('access_div_msg').innerHTML = ACCESSLIST_APPLYSTR;
        MaskIt(document, 'apply_mask');

	F.tmenu.value = 'iframe';
	F.smenu.value = 'hasetup';

if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.rmgmt_chk, idoc);
	add_hiddeninput(iform, F.ext_chk, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.rmgmt_chk);
	add_hiddeninput(iform, F.ext_chk);
}

	iform.submit();
}

function int_partsubmit(obj, ip)
{
	var F = document.int_ipform;

	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

	if(!obj)	return;

        if(CheckNoPassword(F)){
		obj.checked = false;
		disableFormAccessList();
		return;
	}

	var nomore = F.nomore.value;
	var noadd = F.noadd.value;
	var isinternal = F.isinternal.value;
	
        if(obj.checked == true)
        {
                if(nomore == 'true')
                {
			if(isinternal == 'true' && noadd == 'true'){
                        	if(confirm(ACCESSLIST_AUTO_NOADD)){
                        	        F.act.value = 'int_run';
				}else{
					obj.checked = false;
					disableFormAccessList();
					return;
				}
			}else{
				F.act.value = 'int_run';
			}
                }
                else
		{
			if(isinternal == 'true' && noadd == 'true'){
                        	if(confirm(ACCESSLIST_NOIPLISTMSG_1+ip+ACCESSLIST_NOIPLISTMSG_2)){
                        	        F.act.value = 'int_run';
				}
				else{
					obj.checked = false;
					disableFormAccessList();
					return;
				}
			}else{
				F.act.value = 'int_run';
			}
		}
        }
        else
                F.act.value = 'int_stop';

	document.getElementById('access_div_msg').innerHTML = ACCESSLIST_APPLYSTR;
        MaskIt(document, 'apply_mask');

	F.tmenu.value = 'iframe';
	F.smenu.value = 'hasetup';

if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.int_chk, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.int_chk);
}

	iform.submit();
}

function ext_RemoteConn(count, ip)
{
        var F = document.ext_ipform;
	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

        if(F.rmgmt_chk.checked == true)
        {
                if (checkOptionalRange(F.rmgmt_port.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.rmgmt_port.focus();
                        F.rmgmt_port.select();
                        return;
                }
        }

        if(CheckNoPassword(F)){
		F.ext_chk.checked = false;
		disableFormAccessList();
		return;
	}

        if(F.ext_chk.checked == true)
                F.act.value='ext_run';
        else
                F.act.value='ext_stop';

	if(!F.rmgmt_chk.checked && F.noadd.value == 'true' && F.isinternal.value == 'false'){
		if(!confirm(ACCESSLIST_EXTOFF_CONFIRM)){
			return;
		}
	}

	document.getElementById('access_div_msg').innerHTML = ACCESSLIST_APPLYSTR;
        MaskIt(document, 'apply_mask');

	F.tmenu.value = 'iframe';
	F.smenu.value = 'hasetup';

if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.rmgmt_chk, idoc);
	add_hiddeninput(iform, F.ext_chk, idoc);
	add_hiddeninput(iform, F.rmgmt_port, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.rmgmt_chk);
	add_hiddeninput(iform, F.ext_chk);
	add_hiddeninput(iform, F.rmgmt_port);
}

	iform.submit();
}

function ext_IPadd()
{
        var obj;
        var F = document.ext_ipform;
	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

	var ifrv = document.haext_iframe || document.getElementsByName('haext_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var iformv = idocv.ext_ipform_list;
        if(!iformv)      return;

        if(CheckNoPassword(F)) return;

	if(!isNaN(iformv.rcount.value) && !isNaN(iformv.maxcount.value)){
		var rcount = parseInt(iformv.rcount.value);
		var mcount = parseInt(iformv.maxcount.value);
		if(rcount >= mcount){
			alert(ACCESSLIST_NO_MORE);	return;
		}
	}
	var desclen;

        if(obj = CheckIP('ext_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(obj = CheckIPNetwork('ext_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(F.ext_ipexplan.value=="")
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.ext_ipexplan.focus();
        }
	else if((desclen = StrLenUTF8CharCode(F.ext_ipexplan.value)) > 32)
	{
		alert(MSG_DESC_TOO_LONG+desclen+'bytes');
                F.ext_ipexplan.focus();
                F.ext_ipexplan.select();
                return;
	}
        else
        {
		document.getElementById('access_div_msg').innerHTML = ACCESSLIST_ADDSTR;
		MaskIt(document, 'apply_mask');

                F.act.value = 'ext_ipadd';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'hasetup';

if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
		add_hiddeninput(iform, F.ext_ipexplan, idoc);
		add_hiddeninput(iform, F.ext_regip1, idoc);
		add_hiddeninput(iform, F.ext_regip2, idoc);
		add_hiddeninput(iform, F.ext_regip3, idoc);
		add_hiddeninput(iform, F.ext_regip4, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
		add_hiddeninput(iform, F.ext_ipexplan);
		add_hiddeninput(iform, F.ext_regip1);
		add_hiddeninput(iform, F.ext_regip2);
		add_hiddeninput(iform, F.ext_regip3);
		add_hiddeninput(iform, F.ext_regip4);
}

		iform.submit();

		F.ext_regip1.value = '';
		F.ext_regip2.value = '';
		F.ext_regip3.value = '';
		F.ext_regip4.value = '';
		F.ext_ipexplan.value = '';
        }
}
function int_IPadd()
{
        var obj;
        var F = document.int_ipform;
	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

	var ifrv = document.haint_iframe || document.getElementsByName('haint_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var iformv = idocv.int_ipform_list;
        if(!iformv)      return;

        if(CheckNoPassword(F)) return;

	if(!isNaN(iformv.rcount.value) && !isNaN(iformv.maxcount.value)){
		var rcount = parseInt(iformv.rcount.value);
		var mcount = parseInt(iformv.maxcount.value);
		if(rcount >= mcount){
			alert(ACCESSLIST_NO_MORE);	return;
		}
	}
	var desclen;
        if(obj = CheckIP('int_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(obj = CheckIPNetwork('int_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(F.int_ipexplan.value=="")
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.int_ipexplan.focus();
        }
	else if((desclen = StrLenUTF8CharCode(F.int_ipexplan.value)) > 32)
	{
		alert(MSG_DESC_TOO_LONG+desclen+'bytes');
                F.int_ipexplan.focus();
                F.int_ipexplan.select();
                return;
	}
        else
        {
		document.getElementById('access_div_msg').innerHTML = ACCESSLIST_ADDSTR;
		MaskIt(document, 'apply_mask');
                F.act.value = 'int_ipadd';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'hasetup';

if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
		add_hiddeninput(iform, F.int_ipexplan, idoc);
		add_hiddeninput(iform, F.int_regip1, idoc);
		add_hiddeninput(iform, F.int_regip2, idoc);
		add_hiddeninput(iform, F.int_regip3, idoc);
		add_hiddeninput(iform, F.int_regip4, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
		add_hiddeninput(iform, F.int_ipexplan);
		add_hiddeninput(iform, F.int_regip1);
		add_hiddeninput(iform, F.int_regip2);
		add_hiddeninput(iform, F.int_regip3);
		add_hiddeninput(iform, F.int_regip4);
}

		iform.submit();

		F.int_regip4.value = '';
		F.int_ipexplan.value = '';
        }
}

function refresh_extlist()
{
	var ifrv = document.haext_iframe || document.getElementsByName('haext_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var F = idocv.ext_ipform_list;
        if(!F)      return;

	F.act.value = '';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'haext';
	F.submit();
}

function refresh_intlist()
{
	var ifrv = document.haint_iframe || document.getElementsByName('haint_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var F = idocv.int_ipform_list;
        if(!F)      return;

	F.act.value = '';
	F.tmenu.value = 'iframe';
	F.smenu.value = 'haint';
	F.submit();
}

function ext_allcheckfunc(obj)
{
	var ifrv = document.haext_iframe || document.getElementsByName('haext_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
	CheckAllCheckBox(idocv,obj,'ext_delchk');
}

function int_allcheckfunc(obj)
{
	var ifrv = document.haint_iframe || document.getElementsByName('haint_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
	CheckAllCheckBox(idocv,obj,'int_delchk');
}

function ext_IPdel()
{
	var ifrv = document.haext_iframe || document.getElementsByName('haext_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var F = idocv.ext_ipform_list;
        if(!F)      return;

	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

        if(CheckNoPassword(F)) return;

	if(!F.ext_delchk || F.ext_delchk.length == 0){
		alert(ACCESSLIST_PLEASE_CHECK);	return;
	}
	else{
		var chkcount = 0;
		if(F.ext_delchk.length){
			for(var i = 0; i < F.ext_delchk.length; i++){
				if(!F.ext_delchk[i].disabled && F.ext_delchk[i].checked)	chkcount += 1;
			}
		}else{
			if(!F.ext_delchk.disabled && F.ext_delchk.checked)	chkcount += 1;
		}
		if(chkcount == 0){
			alert(ACCESSLIST_PLEASE_CHECK);	return;
		}
	}

        if(confirm(ACCESSLIST_DEL_WANT))
        {
		document.getElementById('access_div_msg').innerHTML = ACCESSLIST_DELSTR;
		MaskIt(document, 'apply_mask');
                F.act.value = 'ext_del';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'hasetup';

if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
}

		var objs = idocv.getElementsByName('ext_delchk');
		for(var i = 0; i < objs.length; i++){
if(isIE6()){
			add_hiddeninput(iform, objs[i], idoc, true);
}else{
			add_hiddeninput(iform, objs[i], null, true);
}
		}

		iform.submit();
		document.ext_ipform.ext_allcheck.checked = false;
        }
}

function int_IPdel()
{
	var ifrv = document.haint_iframe || document.getElementsByName('haint_iframe')[0];
        if(!ifrv)        return;
        var idocv = ifrv.document || ifrv.contentWindow.document;
        if(!idocv)       return;
        var F = idocv.int_ipform_list;
        if(!F)      return;

	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

        if(CheckNoPassword(F)) return;

	if(!F.int_delchk || F.int_delchk.length == 0){
		alert(ACCESSLIST_PLEASE_CHECK);	return;
	}
	else{
		var chkcount = 0;
		if(F.int_delchk.length){
			for(var i = 0; i < F.int_delchk.length; i++){
				if(!F.int_delchk[i].disabled && F.int_delchk[i].checked)	chkcount += 1;
			}
		}else{
			if(!F.int_delchk.disabled && F.int_delchk.checked)	chkcount += 1;
		}
		if(chkcount == 0){
			alert(ACCESSLIST_PLEASE_CHECK);	return;
		}
	}

        if(confirm(ACCESSLIST_DEL_WANT))
        {
		document.getElementById('access_div_msg').innerHTML = ACCESSLIST_DELSTR;
		MaskIt(document, 'apply_mask');
                F.act.value = 'int_del';
		F.tmenu.value = 'iframe';
		F.smenu.value = 'hasetup';

if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.tmenu, idoc);
		add_hiddeninput(iform, F.smenu, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.tmenu);
		add_hiddeninput(iform, F.smenu);
}

		var objs = idocv.getElementsByName('int_delchk');
		for(var i = 0; i < objs.length; i++){
if(isIE6()){
			add_hiddeninput(iform, objs[i], idoc, true);
}else{
			add_hiddeninput(iform, objs[i], null, true);
}
		}

		iform.submit();
		document.int_ipform.int_allcheck.checked = false;
        }
}
function disableFormAccessList()
{
        var F=document;

        if(F.ext_ipform.rmgmt_chk.checked == true)
        {
                EnableAllObj(F.ext_ipform);
                EnableObj(document.getElementById('extbt'));
                if(F.ext_ipform.ext_chk.checked == false)
                {
                        DisableIP('ext_regip');
                        DisableObj(F.ext_ipform.ext_ipexplan);
                        DisableObj(F.ext_ipform.ext_ipadd);
                        DisableObj(document.getElementById('extbt'));
                }
        }
        else
        {
                DisableObj(F.ext_ipform.rmgmt_port);
                DisableObj(F.ext_ipform.ext_chk);
                EnableObj(document.getElementById('extbt'));
                DisableIP('ext_regip');
                DisableObj(F.ext_ipform.ext_ipexplan);
                DisableObj(F.ext_ipform.ext_ipadd);
        }

        if(F.int_ipform.int_chk.checked == true){
                EnableAllObj(F.int_ipform);
                EnableObj(document.getElementById('intbt'));
	}
        else
        {
                DisableIP('int_regip');
                DisableObj(F.int_ipform.int_ipexplan);
                DisableObj(F.int_ipform.int_ipadd);
                DisableObj(document.getElementById('intbt'));
        }
}

function submitDoS()
{
        var F = document.firewallconfetc;
	var ifr = document.hasetup_iframe || document.getElementsByName('hasetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.firewallconf_hasetup;
        if(!iform)      return;

        if(F.arp_protection)
        {
                if(F.arp_protection.value == '1')
                {

                        if(
                           (!isInteger(F.period.value)) ||
                           (F.period.value > 100 ) || (F.period.value < 1 ))
                        {
                                alert(DESC_INVALID_ARP_PERIOD);
                                F.period.focus();
                                return;
                        }
                }
        }

	if(F.whitedomains && F.whitedomains.value != ''){
		var domains = F.whitedomains.value.split(',');
		for(var i = 0; i < domains.length; i++){
			if(!validate_string(domains[i], regExp_url, "match")){
				alert(ACCESSLIST_INVALID_WHITES);
				F.whitedomains.focus();
				F.whitedomains.select();
				return;
			}
		}
	}

	document.getElementById('access_div_msg').innerHTML = ACCESSLIST_APPLYSTR;
	MaskIt(document, 'apply_mask');
        F.act.value = "dos_submit";
	F.tmenu.value = 'iframe';
	F.smenu.value = 'hasetup';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.tmenu, idoc);
	add_hiddeninput(iform, F.smenu, idoc);
	add_hiddeninput(iform, F.csrf, idoc);
	add_hiddeninput(iform, F.whitedomains, idoc);
	add_hiddeninput(iform, F.arp_protection, idoc);
	add_hiddeninput(iform, F.period, idoc);
	add_hiddeninput(iform, F.synflood, idoc);
	add_hiddeninput(iform, F.smurf, idoc);
	add_hiddeninput(iform, F.sourceroute, idoc);
	add_hiddeninput(iform, F.ipspoof, idoc);
	add_hiddeninput(iform, F.icmpblock, idoc);
	add_hiddeninput(iform, F.internal_icmpbk, idoc);
	add_hiddeninput(iform, F.ifname, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.tmenu);
	add_hiddeninput(iform, F.smenu);
	add_hiddeninput(iform, F.csrf);
	add_hiddeninput(iform, F.whitedomains);
	add_hiddeninput(iform, F.arp_protection);
	add_hiddeninput(iform, F.period);
	add_hiddeninput(iform, F.synflood);
	add_hiddeninput(iform, F.smurf);
	add_hiddeninput(iform, F.sourceroute);
	add_hiddeninput(iform, F.ipspoof);
	add_hiddeninput(iform, F.icmpblock);
	add_hiddeninput(iform, F.internal_icmpbk);
	add_hiddeninput(iform, F.ifname);
}

        iform.submit();
}

function ChangeARPProtection()
{
        var F = document.firewallconfetc;

        if(F.arp_protection.value == '1')
        {
                EnableObj(F.period);
                if(F.ifname) EnableObj(F.ifname);
        }
        else
        {
                DisableObj(F.period);
                if(F.ifname) DisableObj(F.ifname);
        }
}

function init_accesslist()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
}

function init_accessform(stat, nomore, noadd, isinternal)
{
	var F = document.int_ipform;
	var F2 = document.ext_ipform;

	if(stat == 'int' && F){
		F.nomore.value = nomore;
		F.noadd.value = noadd;
		F.isinternal.value = isinternal;
	}
	if(stat == 'ext' && F2){
		F2.nomore.value = nomore;
		F2.noadd.value = noadd;
		F2.isinternal.value = isinternal;
	}
}
function redirect_loginpage_and_logout(mgmtport)
{
	var loc = 'http://';
	if(mgmtport){
		var tmp = top.location.host;
		tmp = tmp.split(':');
		loc += tmp[0] + ':' + mgmtport;
		tmp = top.location.pathname;
		if(tmp.indexOf('sess-bin') == -1){
			loc += '/login/login.cgi?logout=1';
		}else{
			loc += '/sess-bin/login_session.cgi?logout=1';
		}
		top.location.href = loc;
	}else{
		var tmp = top.location.host;
		loc += tmp;
		tmp = top.location.pathname;
		if(tmp.indexOf('sess-bin') == -1){
			loc += '/login/login.cgi?logout=1';
		}else{
			loc += '/sess-bin/login_session.cgi?logout=1';
		}
		top.location.href = loc;
	}
}
</script>
