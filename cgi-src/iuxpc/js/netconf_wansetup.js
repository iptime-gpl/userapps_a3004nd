<script>
function OnCheckEnableMTU(obj,name)
{
        if(obj.checked == true)
                EnableObjNames(name)
        else
                DisableObjNames(name);
}

function update_wanstatus_line(doc)
{
	if(!doc)	doc = document;
	
	var F = doc.netconf_wansetup;
	var backupF = doc.backup_wansetup;
	if(!F || !backupF)	return;

    	var wan_type = GetValue(F.wan_type);
	if(!backupF.wan_type)	return;

	if(wan_type != backupF.wan_type.value){
		doc.getElementById('conntitle').style.display = 'none';
		doc.getElementById('connstatus').style.display = 'none';
	}else{
		doc.getElementById('conntitle').style.display = '';
		doc.getElementById('connstatus').style.display = '';
	}
}

function ChangeToOverColor(obj)
{
	var F = document.netconf_wansetup;
	if(!F)	return;
	
	if(F.ocolor)
		F.ocolor.value = obj.style.backgroundColor;
	obj.style.backgroundColor = '#E8E8E8';
}

function ChangeToOutColor(obj)
{
	var F = document.netconf_wansetup;
	if(!F)	return;
	
	if(F.ocolor)
		obj.style.backgroundColor = F.ocolor.value;
	F.ocolor.value = '';
}

function ShowWansetup(ifname,wan_type)
{
    var mode;
    var F=document.netconf_wansetup;

    if (wan_type == "static")
    {
            ShowIt('static');
            HideIt('pppoe');
            HideIt('dynamic');
            HideIt('pptp');
            HideIt('pppoe_sched');
    }
    else if (wan_type == "dynamic")
    {
            HideIt('static');
            HideIt('pppoe');
            ShowIt('dynamic');
            HideIt('pptp');
            HideIt('pppoe_sched');
    }
    else if (wan_type == "pppoe")
    {
            HideIt('static');
            ShowIt('pppoe');
            HideIt('dynamic');
            HideIt('pptp');
            ShowIt('pppoe_sched');
    }
    else if (wan_type == "pptp")
    {
            HideIt('static');
            HideIt('pppoe');
            HideIt('dynamic');
            ShowIt('pptp');
            HideIt('pppoe_sched');
    }
    update_wanstatus_line();

    obj=document.getElementsByName('mtu.'+wan_type+'.'+ifname+'.'+'check');
    obj2=document.getElementsByName('mtu.'+wan_type+'.'+ifname);
    if(obj[0] && obj2[0])
    {
        if(obj[0].checked == false)
                DisableObj(obj2[0]);
        else
                EnableObj(obj2[0]);
    }

}

function check_dns_dynamic()
{
    var F=document.netconf_wansetup
    if (!F.dns_dynamic_chk) return;

    if (F.dns_dynamic_chk.checked == false )
    {
            DisableIP('fdns_dynamic');
            DisableIP('sdns_dynamic');
    }
    else
    {
            EnableIP('fdns_dynamic');
            EnableIP('sdns_dynamic');
    }
}

function OnCheckEnableLCP()
{
        var F = document.netconf_wansetup;

        if(!F.lcp_flag)
                return;

        if(F.lcp_flag.checked == true)
        {
                EnableObj(F.lcp_echo_interval);
                EnableObj(F.lcp_echo_failure);

        }
        else
        {
                DisableObj(F.lcp_echo_interval);
                DisableObj(F.lcp_echo_failure);
        }

}

function enableMaxIdle()
{
    var F=document.netconf_wansetup
    if(F.idle_flag.checked == true)
    {
            EnableObj(F.timeout);
            F.cod[0].disabled = false;
            F.cod[1].disabled = false;
            if(F.timeout.value == "")
                    F.timeout.value = "10";
    }
    else
    {
            DisableObj(F.timeout);
            F.cod[0].disabled = true;
            F.cod[1].disabled = true;
    }
}

function check_dns_pppoe()
{
    var F=document.netconf_wansetup
    if (!F.dns_pppoe_chk) return;

    if (F.dns_pppoe_chk.checked == false )
    {
            DisableIP('fdns_pppoe');
            DisableIP('sdns_pppoe');
    }
    else
    {
            EnableIP('fdns_pppoe');
            EnableIP('sdns_pppoe');
    }
}

function check_dns_pptp()
{
    var F=document.netconf_wansetup
    if (!F.dns_pptp_chk) return;

    if (F.dns_pptp_chk.checked == false )
    {
            DisableIP('fdns_pptp');
            DisableIP('sdns_pptp');
    }
    else
    {
            EnableIP('fdns_pptp');
            EnableIP('sdns_pptp');
    }
}

function is_viewing_element(obj)
{
	var node = null;

	if(typeof obj.length == 'undefined'){
        	node = obj;
        	while(node){
        		if(typeof(node.style) != 'undefined' && node.style.display == 'none') 
                		return false;
            		node = node.parentNode;
        	}
		return true;
    	}else{
		for(i=0; i < obj.length; i++){
			node = obj[i];

			var node_display = true;
			while(node){
				if(typeof(node.style) != 'undefined' && node.style.display == 'none'){
					node_display = false;	break;
				}
				node = node.parentNode;
			}
            		if(node_display) return true;
        	}
        	return false;
    	}
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

function copy_formvalues(original_form, copied_form, idoc)
{
	var F = original_form;
	var iform = copied_form;

	for(var i = 0; i < F.length; i++){
		if(F[i] && F[i].tagName && F[i].tagName == 'INPUT' && F[i].name && !F[i].disabled){
			if(is_viewing_element(F[i])){
				var crelm = document.createElement('input');
				if(idoc)	crelm = idoc.createElement('input');
				crelm.type = 'hidden';
				/*IE 5*/
				if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
				if(F[i].type == 'checkbox' || F[i].type == 'radio'){
					if(F[i].checked){
						crelm.value = F[i].value;
						crelm.name = F[i].name;
						/*IE 5*/
						crelm.setAttribute('name', F[i].name);
						crelm.setAttribute('value', F[i].value);
					}else	continue;
				}
				else if(F[i].type == 'button'){
					continue;
				}
				else{
					crelm.value = F[i].value;
					crelm.name = F[i].name;
					/*IE 5*/
					crelm.setAttribute('name', F[i].name);
					crelm.setAttribute('value', F[i].value);
				}
				iform.appendChild(crelm);
				/*IE 5*/
				if(!iform[F[i].name])
					iform[F[i].name] = crelm;
			}
		}
	}
}

function reset_form(F)
{
	if(!F)	return;

	for(var i = 0; i < F.length;){
		if(F[i] && F[i].tagName && F[i].tagName == 'INPUT' && F[i].name){
			var nm = F[i].name;
			F.removeChild(F[i]);
			if(F[nm])	F[nm] = null;
		}else i++;
	}
}

function check_change_value(doc)
{
	if(!doc)	doc = document;
	var backupF = doc.backup_wansetup;
	var F = doc.netconf_wansetup;

	for(var i = 0; i < F.length; i++){
		if(F[i] && F[i].tagName && F[i].tagName == 'INPUT' && F[i].name){
			if(is_viewing_element(F[i])){
				var nm = F[i].name;
				if(F[i].type == 'checkbox'){
					if(F[i].checked && !backupF[nm])	return true;
					else if(!F[i].checked && backupF[nm])	return true;
				}else if(F[i].type == 'radio'){
					if(!F[i].checked)	continue;
					if(!backupF[nm] || F[i].value != backupF[nm].value)	return true;
				}else{
					if(F[i].disabled)	continue;
					if(!backupF[nm] || F[i].value != backupF[nm].value)	return true;
				}
			}
		}
	}
	return false;
}

function clicked_passview(checked, idval)
{
	var pel = document.getElementById(idval + '_passwd');
	var tel = document.getElementById(idval + '_text');
	var F = document.netconf_wansetup;
	
	if(checked){
		tel.name = pel.name;	tel.setAttribute('name', pel.name);
		pel.name = null;	pel.removeAttribute('name');
		F[tel.name] = tel;
		tel.value = pel.value;
		pel.style.display = 'none';
		tel.style.display = '';
	}else{
		pel.name = tel.name;	pel.setAttribute('name', tel.name);
		tel.name = null;	tel.removeAttribute('name');
		F[pel.name] = pel;
		pel.value = tel.value;
		tel.style.display = 'none';
		pel.style.display = '';
	}
}

function apply_connection(wanname,ifname)
{
	var ifr = document.hiddenwansetup_iframe || document.getElementsByName('hiddenwansetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
	var iform = idoc.netconf_wansetup;

	var ifr2 = document.hiddenwanstatus_iframe || document.getElementsByName('hiddenwanstatus_iframe')[0];
        if(!ifr2)        return;
        var idoc2 = ifr2.document || ifr2.contentWindow.document;
        if(!idoc2)       return;
	var iform2 = idoc2.waninfostatus_fm;
	if(!iform2)	return;

	var val = iform2.buttonact.value;
	if(val != 'connect' && val != 'disconnect')	return;
	
	var crelm = document.createElement('input');
	if(isIE6())	crelm = idoc.createElement('input');
	crelm.type = 'hidden';	if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
	crelm.name = 'tmenu';	crelm.setAttribute('name', 'tmenu');
	crelm.value = 'iframe';	crelm.setAttribute('value', 'iframe');

	iform.appendChild(crelm);
	if(!iform['tmenu'])		iform['tmenu'] = crelm;
	
	crelm = document.createElement('input');
	if(isIE6())	crelm = idoc.createElement('input');
	crelm.type = 'hidden';		if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
	crelm.name = 'smenu';		crelm.setAttribute('name', 'smenu');
	crelm.value = 'hiddenwansetup';	crelm.setAttribute('value', 'hiddenwansetup');

	iform.appendChild(crelm);
	if(!iform['smenu'])		iform['smenu'] = crelm;
	
	crelm = document.createElement('input');
	if(isIE6())	crelm = idoc.createElement('input');
	crelm.type = 'hidden';		if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
	crelm.name = 'act';		crelm.setAttribute('name', 'act');
	crelm.value = val;		crelm.setAttribute('value', val);

	iform.appendChild(crelm);
	if(!iform['act'])		iform['act'] = crelm;
	
	crelm = document.createElement('input');
	if(isIE6())	crelm = idoc.createElement('input');
	crelm.type = 'hidden';		if(crelm.getAttribute('type') != 'hidden')	crelm.setAttribute('type', 'hidden');
	crelm.name = 'wan';		crelm.setAttribute('name', 'wan');
	crelm.value = wanname;		crelm.setAttribute('value', wanname);

	iform.appendChild(crelm);
	if(!iform['wan'])		iform['wan'] = crelm;

	if(val == 'connect')	document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_CONNSTR;
	else			document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_DISCONNSTR;
	DisableObj(document.getElementById('conbtn'));
    	MaskIt(document, 'apply_mask');
	iform.submit();
}

function apply_wansetup(wanname,ifname)
{
	var ifr = document.hiddenwansetup_iframe || document.getElementsByName('hiddenwansetup_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
	var iform = idoc.netconf_wansetup;
    var F=document.netconf_wansetup;
    var copyF=document.backup_wansetup;
    var obj;
    var wan_type = GetValue(F.wan_type);

    if (wan_type == 'static')
    {
            if(static_apply(ifname))
            {
                    if(CheckNetworkConfig())
                    {
                            F.act.value = "save";
			    document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_APPLYSTR;
			    MaskIt(document, 'apply_mask');
				copy_formvalues(F, iform, ((isIE6())?idoc:null));
				iform.tmenu.value = 'iframe';
				iform.smenu.value = 'hiddenwansetup';
		 	    	iform.submit();
				reset_form(copyF);
				copy_formvalues(F, copyF);
				footerbtn_view_control();
                    }
            }
    }
    else if (wan_type == 'dynamic')
    {
            if(dynamic_apply(ifname))
            {
                    F.act.value = "save";
		    document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_APPLYSTR;
		    MaskIt(document, 'apply_mask');
				copy_formvalues(F, iform, ((isIE6())?idoc:null));
				iform.tmenu.value = 'iframe';
				iform.smenu.value = 'hiddenwansetup';
	 	    		iform.submit();
				reset_form(copyF);
				copy_formvalues(F, copyF);
				footerbtn_view_control();
            }
    }
    else if (wan_type == 'pppoe')
    {
            if(pppoe_apply(ifname))
            {
                    F.act.value = "save";
		    document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_APPLYSTR;
		    MaskIt(document, 'apply_mask');
				copy_formvalues(F, iform, ((isIE6())?idoc:null));
				iform.tmenu.value = 'iframe';
				iform.smenu.value = 'hiddenwansetup';
	 	    		iform.submit();
				reset_form(copyF);
				copy_formvalues(F, copyF);
				footerbtn_view_control();
            }
    }
    else if (wan_type == 'pptp')
    {
            if(pptp_apply(ifname))
            {
                    F.act.value = "save";
		    document.getElementById('wansetup_div_msg').innerHTML = NETCONF_WANSETUP_APPLYSTR;
		    MaskIt(document, 'apply_mask');
				copy_formvalues(F, iform, ((isIE6())?idoc:null));
				iform.tmenu.value = 'iframe';
				iform.smenu.value = 'hiddenwansetup';
	 	    		iform.submit();
				reset_form(copyF);
				copy_formvalues(F, copyF);
				footerbtn_view_control();
            }
    }
    else{
            F.act.value = "";	return;
	}
	update_wanstatus_line();
}

function CheckMTU(wan_type,ifname,maxmtu)
{
        var chkobj,mtuobj;

        chkobj=document.getElementsByName('mtu.'+wan_type+'.'+ifname+'.'+'check');
	if(chkobj.length == 0)
		return 0;
        if(chkobj[0].check == false)
                return 0;
        mtuobj=document.getElementsByName('mtu.'+wan_type+'.'+ifname);
	if(mtuobj.length == 0)
		return 0;
        if(mtuobj[0].value > maxmtu)
                return mtuobj[0];
        return 0;
}

function dynamic_apply(ifname)
{
    var F=document.netconf_wansetup
    var obj;
    if (F.hw_conf_dynamic.checked == true)
    {
            if(obj=CheckHW('hw_dynamic'))
            {
                    alert(MSG_INVALID_HWADDR);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }

    if (obj=CheckMTU('dynamic',ifname,1500))
    {
            alert(NETCONF_INTERNET_DHCP_MTU_INVALID);
            obj.focus();
            obj.select();
            return 0;
    }


    if (F.dns_dynamic_chk && F.dns_dynamic_chk.checked == true )
    {

        if(CheckNoPassword(F)) return;

            if(obj=CheckIP('fdns_dynamic'))
            {
                    alert(MSG_INVALID_FDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }

            if(obj=CheckIPNetwork('fdns_dynamic'))
            {
                    alert(MSG_INVALID_FDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }

            if(obj=CheckOptionalIP('sdns_dynamic'))
            {
                    alert(MSG_INVALID_SDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }

            if(obj=CheckIPNetwork('sdns_dynamic'))
            {
                    alert(MSG_INVALID_SDNS);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }
    return 1;
}

function pppoe_apply(ifname)
{
    var F=document.netconf_wansetup
        var obj;

        if (F.userid.value == "")
        {
                F.userid.focus();
                F.userid.select();
                alert(MSG_BLANK_ACCOUNT);
        }
        else if (F.passwd.value == "")
        {
                F.passwd.focus();
                F.passwd.select();
                alert(MSG_BLANK_PASSWORD);
        }
        else if (F.idle_flag && F.timeout && (F.idle_flag.checked == true) && checkRange(F.timeout.value, 0,1000))
        {
                F.timeout.focus();
                F.timeout.select();
                alert(NETCONF_INTERNET_KEEP_ALIVE_MSG);
        }
        else
        {
                if (F.dns_pppoe_chk && F.dns_pppoe_chk.checked == true )
                {

                        if(CheckNoPassword(F)) return;

                        if(obj=CheckIP('fdns_pppoe'))
                        {
                                alert(MSG_INVALID_FDNS);
                                obj.focus();
                                obj.select();
                                return 0;
                        }

                        if(obj=CheckIPNetwork('fdns_pppoe'))
                        {
                                alert(MSG_INVALID_FDNS);
                                obj.focus();
                                obj.select();
                                return 0;
                        }

                        if(obj=CheckOptionalIP('sdns_pppoe'))
                        {
                                alert(MSG_INVALID_SDNS);
                                obj.focus();
                                obj.select();
                                return 0;
                        }

                        if(obj=CheckIPNetwork('sdns_pppoe'))
                        {
                                alert(MSG_INVALID_SDNS);
                                obj.focus();
                                obj.select();
                                return 0;
                        }
                }

                if (obj=CheckMTU('pppoe',ifname,1492))
                {
                        alert(NETCONF_INTERNET_PPP_MTU_INVALID);
                        obj.focus();
                        obj.select();
                        return 0;
                }

                return 1;
        }
        return 0;
}

function static_apply(ifname)
{
    var F=document.netconf_wansetup
    var obj;


    if(obj=CheckIP('ip'))
    {
            alert(MSG_INVALID_IP);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('ip'))
    {
            alert(MSG_INVALID_IP);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIP('sm'))
    {
            alert(MSG_INVALID_NETMASK);
            obj.focus();
            obj.select();
            return 0;
    }
    if(obj=CheckIP('gw'))
    {
            alert(MSG_INVALID_GATEWAY);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('gw'))
    {
            alert(MSG_INVALID_GATEWAY);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIP('fdns_static'))
    {
            alert(MSG_INVALID_FDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('fdns_static'))
    {
            alert(MSG_INVALID_FDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckOptionalIP('sdns_static'))
    {
            alert(MSG_INVALID_SDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if(obj=CheckIPNetwork('sdns_static'))
    {
            alert(MSG_INVALID_SDNS);
            obj.focus();
            obj.select();
            return 0;
    }

    if (obj=CheckMTU('static',ifname,1500))
    {
            alert(NETCONF_INTERNET_DHCP_MTU_INVALID);
            obj.focus();
            obj.select();
            return 0;
    }

	if (F.hw_conf_static.checked == true)
    {
            if(obj=CheckHW('hw_static'))
            {
                    alert(MSG_INVALID_HWADDR);
                    obj.focus();
                    obj.select();
                    return 0;
            }
    }
    return 1;
}

function pptp_apply(ifname)
{
        var F=document.netconf_wansetup;
        var obj;

        if (F.pptp_userid.value == "")
        {
                F.pptp_userid.focus();
                F.pptp_userid.select();
                alert(MSG_BLANK_ACCOUNT);
                return 0;
        }

        if (F.pptp_passwd.value == "")
        {
                F.pptp_passwd.focus();
                F.pptp_passwd.select();
                alert(MSG_BLANK_PASSWORD);
                return 0;
        }


        if(obj=CheckIP('pptp_server_ip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return 0;
        }

        if(obj=CheckIP('pptp_ip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return 0;
        }

        if(obj=CheckIPNetwork('pptp_ip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return 0;
        }

        if(obj=CheckIP('pptp_sm'))
        {
                alert(MSG_INVALID_NETMASK);
                obj.focus();
                obj.select();
                return 0;
        }

        if(obj=CheckOptionalIP('pptp_gw'))
        {
                alert(MSG_INVALID_GATEWAY);
                obj.focus();
                obj.select();
                return 0;
        }
	
	if (F.dns_pptp_chk && F.dns_pptp_chk.checked == true )
        {
                if(obj=CheckIP('fdns_pptp'))
                {
                        alert(MSG_INVALID_FDNS);
                        obj.focus();
                        obj.select();
                        return 0;
                }

                if(obj=CheckIPNetwork('fdns_pptp'))
                {
                        alert(MSG_INVALID_FDNS);
                        obj.focus();
                        obj.select();
                        return 0;
                }

                if(obj=CheckOptionalIP('sdns_pptp'))
                {
                        alert(MSG_INVALID_SDNS);
                        obj.focus();
                        obj.select();
                        return 0;
                }

                if(obj=CheckIPNetwork('sdns_pptp'))
                {
                        alert(MSG_INVALID_SDNS);
                        obj.focus();
                        obj.select();
                        return 0;
                }
        }

        if (obj=CheckMTU('pptp',ifname,1492))
        {
                alert(NETCONF_INTERNET_PPP_MTU_INVALID);
                obj.focus();
                obj.select();
                return 0;
        }

        if (F.hw_conf_pptp.checked == true)
        {
                if(obj=CheckHW('hw_pptp'))
                {
                        alert(MSG_INVALID_HWADDR);
                        obj.focus();
                        obj.select();
                        return 0;
                }
        }

        return 1;
}

function check_dns()
{
    check_dns_dynamic();
    check_dns_pppoe();
    check_dns_pptp();
}

function footerbtn_view_control(doc)
{
	if(!doc) 	doc = document;
	if(!doc)	return;
	
	var conbtn = doc.getElementById('conbtn');
	var appbtn = doc.getElementById('appbtn');
	var F = doc.netconf_wansetup;
	var wan_type = 'dynamic';
	if(F){
		wan_type = GetValue(F.wan_type);
	}

	if(!conbtn || !appbtn)	return;

	if(conbtn.value == '' || wan_type == 'static'){
		conbtn.style.display = 'none';
		appbtn.style.display = '';
		return;
	}

	if(check_change_value(doc)){
		conbtn.style.display = 'none';
		appbtn.style.display = '';
	}else{
		conbtn.style.display = '';
		appbtn.style.display = 'none';
	}
}

function init_checkform()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
	var F = document.netconf_wansetup;
	var copyF = document.backup_wansetup;

	reset_form(copyF);
	copy_formvalues(F, copyF);
	
	for(var i = 0; i < F.length; i++){
		if(F[i] && F[i].tagName && F[i].tagName == 'INPUT' && F[i].name){
			switch(F[i].type){
				case 'radio':
				case 'checkbox':
					if(F[i].addEventListener){
						F[i].addEventListener('click', function(){footerbtn_view_control();}, false);
					}else if(F[i].attachEvent){
						F[i].attachEvent('onclick', function(){footerbtn_view_control();});
					}
					break;
				case 'text':
				case 'password':
					if(F[i].addEventListener){
						F[i].addEventListener('keyup', function(){footerbtn_view_control();}, false);
					}else if(F[i].attachEvent){
						F[i].attachEvent('onkeyup', function(){footerbtn_view_control();});
					}
					break;
			}
		}
	}
	footerbtn_view_control();
}

function update_addrs(doc, pdoc)
{
	var F = doc.waninfostatus_fm;
	if(!F)	return;
	
	var ipaddr = F.ip.value;
	var smaddr = F.sm.value;
	var gwaddr = F.gw.value;

	if(ipaddr != '')	ipaddr = ipaddr.split('.');
	else			ipaddr = ['','','',''];
	if(smaddr != '')	smaddr = smaddr.split('.');
	else			smaddr = ['','','',''];
	if(gwaddr != '')	gwaddr = gwaddr.split('.');
	else			gwaddr = ['','','',''];

	for(var i = 1; i <= 4; i ++){
		if(pdoc.getElementById('disabled_dynamicip'+i))	pdoc.getElementById('disabled_dynamicip'+i).value = ipaddr[i-1];
		if(pdoc.getElementById('disabled_pppoeip'+i))	pdoc.getElementById('disabled_pppoeip'+i).value = ipaddr[i-1];
		if(pdoc.getElementById('disabled_pptp_ip'+i))	pdoc.getElementById('disabled_pptp_ip'+i).value = ipaddr[i-1];
		if(pdoc.getElementById('disabled_dynamicsm'+i))	pdoc.getElementById('disabled_dynamicsm'+i).value = smaddr[i-1];
		if(pdoc.getElementById('disabled_pppoesm'+i))	pdoc.getElementById('disabled_pppoesm'+i).value = smaddr[i-1];
		if(pdoc.getElementById('disabled_pptp_sm'+i))	pdoc.getElementById('disabled_pptp_sm'+i).value = smaddr[i-1];
		if(pdoc.getElementById('disabled_dynamicgw'+i))	pdoc.getElementById('disabled_dynamicgw'+i).value = gwaddr[i-1];
		if(pdoc.getElementById('disabled_pppoegw'+i))	pdoc.getElementById('disabled_pppoegw'+i).value = gwaddr[i-1];
		if(pdoc.getElementById('disabled_pptp_gw'+i))	pdoc.getElementById('disabled_pptp_gw'+i).value = gwaddr[i-1];
	}
}

function SelectMacFromPopup(prefix, macaddr)
{
	var macval = macaddr.split('-');
	for(var i = 1; i <= 6; i ++){
		document.getElementsByName(prefix+i)[0].value = macval[i-1];
	}

	UnMaskIt(document, 'macsearch_mask');
}

function onclick_macsearchbtn(prefix)
{
	document.getElementById('searchmaclist').innerHTML = '';
	MaskIt(document, 'macsearch_mask');

	var ifr = document.hiddenmacsearch_iframe || document.getElementsByName('hiddenmacsearch_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
	var iform = idoc.netconf_macsearchiframe;

	iform.act.value = 'refresh';
	iform.inputprefix.value = prefix;

	iform.submit();
}

function setdefaultmac(obj, hwname, hwaddr)
{
	if(!obj.checked)
		SetHW(hwname,hwaddr);
}
</script>
