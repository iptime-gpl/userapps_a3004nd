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

function ChangeToOverColor(obj)
{
        if(!obj)        return;
        var F = document.remotepc_fm;
        if(!F)  return;

        if(F.ocolor)
                F.ocolor.value = obj.style.backgroundColor;
        obj.style.backgroundColor = '#E8E8E8';
}

function ChangeToOutColor(obj)
{
        if(!obj)        return;
        var F = document.remotepc_fm;
        if(!F)  return;

        if(F.ocolor)
                obj.style.backgroundColor = F.ocolor.value;
        F.ocolor.value = '';
}

function ClickEventPropagater(e)
{
        if(!e)  e = window.event;
        e.cancelbubble = true;
        if(e.stopPropagation)   e.stopPropagation();
        if(e.preventDefault)    e.preventDefault();
        return false;
}

function clear_addform()
{
	var F = document.remotepc_fm;

	F.hw1.value = '';
	F.hw2.value = '';
	F.hw3.value = '';
	F.hw4.value = '';
	F.hw5.value = '';
	F.hw6.value = '';

	F.pcname.value = '';
	document.getElementById('curpcmacchk').checked = false;
}

function AddPC()
{
        var F=document.remotepc_fm;
        var ifr = document.wollist_iframe || document.getElementsByName('wollist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.remotepc_wollist;
	if(!iform)	return;

        var obj;
        if(F.pcname.value=='')
        {
                alert(EXPERTCONF_WOL_PC_NAME_IS_BLANK);
                F.pcname.focus();
                return;
        }
        else if(obj=CheckHW('hw'))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
        }
        else
        {
		document.getElementById('wol_div_msg').innerHTML = EXPERTCONF_WOL_ADDSTR;
	        MaskIt(document, 'apply_mask');
	
                F.act.value='add';
if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
		add_hiddeninput(iform, F.hw1, idoc);
		add_hiddeninput(iform, F.hw2, idoc);
		add_hiddeninput(iform, F.hw3, idoc);
		add_hiddeninput(iform, F.hw4, idoc);
		add_hiddeninput(iform, F.hw5, idoc);
		add_hiddeninput(iform, F.hw6, idoc);
		add_hiddeninput(iform, F.pcname, idoc);
}else{
		add_hiddeninput(iform, F.act);
		add_hiddeninput(iform, F.hw1);
		add_hiddeninput(iform, F.hw2);
		add_hiddeninput(iform, F.hw3);
		add_hiddeninput(iform, F.hw4);
		add_hiddeninput(iform, F.hw5);
		add_hiddeninput(iform, F.hw6);
		add_hiddeninput(iform, F.pcname);
}
                iform.submit();
		clear_addform();
        }
}
function DeleteRemotePC(index)
{
        var F=document.remotepc_fm;
        var ifr = document.wollist_iframe || document.getElementsByName('wollist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.remotepc_wollist;

        if (confirm(EXPERTCONF_WOL_DEL_PC))
        {
		document.getElementById('wol_div_msg').innerHTML = EXPERTCONF_WOL_DELSTR;
	        MaskIt(document, 'apply_mask');

                F.act.value='del';
if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
}else{
		add_hiddeninput(iform, F.act);
}
                iform.submit();
        }
}

function WakeUp(index)
{
        var F=document.remotepc_fm;
        var ifr = document.wollist_iframe || document.getElementsByName('wollist_iframe')[0];
        if(!ifr)        return;
        var idoc = ifr.document || ifr.contentWindow.document;
        if(!idoc)       return;
        var iform = idoc.remotepc_wollist;

        if (confirm(EXPERTCONF_WOL_WANT_TO_WAKE_UP_PC))
        {
		document.getElementById('wol_div_msg').innerHTML = EXPERTCONF_WOL_RUNSTR;
	        MaskIt(document, 'apply_mask');

                F.act.value = 'wake';
if(isIE6()){
		add_hiddeninput(iform, F.act, idoc);
}else{
		add_hiddeninput(iform, F.act);
}
                iform.submit();
        }
}

function SelectMacFromPopup(prefix, macaddr, pcname)
{
        var macval = macaddr.split('-');
        for(var i = 1; i <= 6; i ++){
                document.getElementsByName(prefix+i)[0].value = macval[i-1];
        }
	document.remotepc_fm.pcname.value = pcname;

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
        var iform = idoc.expertconf_macsearchiframe;

        iform.act.value = 'refresh';
	iform.inputprefix.value = prefix;

        iform.submit();
}

function init_wolmain()
{
	document.body.style.backgroundColor='#EEEEEE';  document.body.children[0].style.backgroundColor='#EEEEEE';
}
</script>
