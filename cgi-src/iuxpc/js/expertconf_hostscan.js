<script>
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

function hostscanSel_disableForm()
{
        var F=document.hostscan_fm;
        if (F.ping_type.value == ICMP_PING )
        {
                EnableObj(F.datasize);
        }
        else if(F.ping_type.value ==ARP_PING)
        {
                DisableObj(F.datasize);
        }
}


function hostscanRadio_disableForm(flag)
{
        var F=document.hostscan_fm;
        if ( flag == 0)
        {
                F.sel.value =  PING_SCAN;
                EnableIP('ip');
                EnableObj(F.count);
                EnableObj(F.timeout);
                EnableObj(F.datasize);
                EnableObj(F.ping_type);
                DisableIP('pip');
                DisableObj(F.start);
                DisableObj(F.end);
                if(F.ping_type.value == ARP_PING)
                        DisableObj(F.datasize);
        }
        else if(flag == 1)
        {
                F.sel.value = TCP_PORT_SCAN;
                DisableIP('ip');
                DisableObj(F.count);
                DisableObj(F.timeout);
                DisableObj(F.datasize);
                DisableObj(F.ping_type);
                EnableIP('pip');
                EnableObj(F.start);
                EnableObj(F.end);
        }
}

function hostscanStart()
{
        var F=document.hostscan_fm;
	var ifr = document.hostscansubmit_iframe || document.getElementsByName('hostscansubmit_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hostscansubmit;
        if(!iform)      return;

        var obj;

        if(F.sel[0].checked == true)
        {
                if(obj=CheckIP('ip'))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
                        obj.select();
                        return;
                }
                else if(F.timeout.value=='')
                {
                        alert(SYSINFO_HOST_INVALID_TIMEOUT);
                        F.timeout.focus();
                        F.timeout.select();
                        return;
                }
                else if(checkRange(F.timeout.value, 1, 99))
                {
                        alert(SYSINFO_HOST_TIMERANGE);
                        F.timeout.focus();
                        F.timeout.select();
                        return;
                }

                if(F.ping_type.value == '0')
                {
                        if(F.datasize.value=='')
                        {
                                alert(SYSINFO_HOST_INVALID_DATASIZE);
                                F.datasize.focus();
                                F.datasize.select();
                                return;
                        }
                        else if(checkRange(F.datasize.value, 0, 65535))
                        {
                                alert(SYSINFO_HOST_DATARANGE);
                                F.datasize.focus();
                                F.datasize.select();
                                return;
                        }
if(isIE6()){
			add_hiddeninput(iform, F.datasize, idoc);
}else{
			add_hiddeninput(iform, F.datasize);
}
                }
if(isIE6()){
		add_hiddeninput(iform, F.ip1, idoc);
		add_hiddeninput(iform, F.ip2, idoc);
		add_hiddeninput(iform, F.ip3, idoc);
		add_hiddeninput(iform, F.ip4, idoc);
		add_hiddeninput(iform, F.timeout, idoc);
		add_hiddeninput(iform, F.ping_type, idoc);
		add_hiddeninput(iform, F.count, idoc);
}else{
		add_hiddeninput(iform, F.ip1);
		add_hiddeninput(iform, F.ip2);
		add_hiddeninput(iform, F.ip3);
		add_hiddeninput(iform, F.ip4);
		add_hiddeninput(iform, F.timeout);
		add_hiddeninput(iform, F.ping_type);
		add_hiddeninput(iform, F.count);
}
        }
        else if(F.sel[1].checked == true)
        {
                if(obj=CheckIP('pip'))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus();
                        obj.select();
                        return;
                }
                if(F.start.value=='')
                {
                        alert(SYSINFO_HOST_INVALID_START);
                        F.start.focus();
                        F.start.select();
                        return;
                }
                else if(checkRange(F.start.value, 0, 65535))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.start.focus();
                        F.start.select();
                        return;
                }

                if( F.end.value == '' )
                        F.end.value = F.start.value;
                else if(checkRange(F.end.value, 0, 65535))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.end.focus();
                        F.end.select();
                        return;
                }

                if(parseInt(F.start.value) > parseInt(F.end.value))
                {
                        alert(SYSINFO_HOST_PORTRANGE);
                        F.end.focus();
                        F.end.select();
                        return;
                }
if(isIE6()){
		add_hiddeninput(iform, F.pip1, idoc);
		add_hiddeninput(iform, F.pip2, idoc);
		add_hiddeninput(iform, F.pip3, idoc);
		add_hiddeninput(iform, F.pip4, idoc);
		add_hiddeninput(iform, F.start, idoc);
		add_hiddeninput(iform, F.end, idoc);
}else{
		add_hiddeninput(iform, F.pip1);
		add_hiddeninput(iform, F.pip2);
		add_hiddeninput(iform, F.pip3);
		add_hiddeninput(iform, F.pip4);
		add_hiddeninput(iform, F.start);
		add_hiddeninput(iform, F.end);
}
        }
	document.getElementById('hostscan_div_msg').innerHTML = SYSINFO_HOST_STARTING;
        MaskIt(document, 'apply_mask');

	F.act.value = 'start';
	F.submitted.value = '0';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
	add_hiddeninput(iform, F.sel, idoc);
}else{
	add_hiddeninput(iform, F.act);
	add_hiddeninput(iform, F.sel);
}

        iform.submit();
}
function hostscanStop()
{
        var F=document.hostscan_fm;
	var ifr = document.hostscansubmit_iframe || document.getElementsByName('hostscansubmit_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hostscansubmit;
        if(!iform)      return;

	document.getElementById('hostscan_div_msg').innerHTML = SYSINFO_HOST_STOPPING;
        MaskIt(document, 'apply_mask');

        F.act.value = 'stop';
	F.submitted.value = '0';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
}else{
	add_hiddeninput(iform, F.act);
}

        iform.submit();
}

function hostscanClear()
{
        var F=document.hostscan_fm;
	var ifr = document.hostscansubmit_iframe || document.getElementsByName('hostscansubmit_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.expertconf_hostscansubmit;
        if(!iform)      return;

	document.getElementById('hostscan_div_msg').innerHTML = SYSINFO_HOST_DELETING;
        MaskIt(document, 'apply_mask');

        F.act.value = 'clear';
	F.submitted.value = '0';
if(isIE6()){
	add_hiddeninput(iform, F.act, idoc);
}else{
	add_hiddeninput(iform, F.act);
}

        iform.submit();
}

function init_hostscan_status(doc, stat)
{
	if(!doc)	return;
	setTimeout(
		function(){
			if(doc.expertconf_hostscanstatus)	doc.expertconf_hostscanstatus.submit();
		}, 1500);

	var F = document.hostscan_fm;
	var ifr = document.hostscanlist_iframe || document.getElementsByName('hostscanlist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
	var origin = doc.getElementById('statline');
	var copied = idoc.getElementById('hostscan_list');

	if(!origin || !copied)	return;

	copied.innerHTML = origin.innerHTML;
	
	if(F.submitted.value == '1'){
		UnMaskIt(document, 'apply_mask');
		F.submitted.value = '0';
	}

	if(stat){
		EnableObj(document.getElementById('stopbtn'));
		DisableObj(document.getElementById('startbtn'));
		copied.scrollTop = idoc.getElementsByName('listtable')[0].offsetHeight;
	}else{
		DisableObj(document.getElementById('stopbtn'));
		EnableObj(document.getElementById('startbtn'));
	}
}

function init_hostscan_submit()
{
	var F = document.hostscan_fm;
	F.submitted.value = '1';
}

function init_hostscan()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
}
</script>
