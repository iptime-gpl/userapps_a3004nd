<script>

// utilities 
function IsHex(s) 
{
	var i;

	for( i = 0 ; i < s.length; i++ )
		if( !(
		((s.charAt(i) >= 'a') && (s.charAt(i) <= 'f')) || 
		((s.charAt(i) >= 'A' ) && (s.charAt(i) <= 'F')) || 
		((s.charAt(i) >= '0' ) && (s.charAt(i) <= '9')) ))
			return 1;
	return 0;
}

function GetValue( obj )
{
	if(obj[0] && obj[0].type == 'radio')
		return GetRadioValue(obj);
	return obj.value;
}

function GetRadioValue( radioobj )
{
	for( var i = 0 ; i <  radioobj.length; i++ )
	{
		if(radioobj[i].checked)
			return radioobj[i].value;
	}
	return "";
}

function SetRadioValue( radioobj, value )
{
	for( var i = 0 ; i <  radioobj.length; i++ )
	{
		if(radioobj[i].value == value)
			radioobj[i].checked = true;
		else
			radioobj[i].checked = false;
	}
	return;
}


function DisableRadio( radioobj )
{
	for( var i = 0 ; i <  radioobj.length; i++ )
		DisableObj(radioobj[i]);
	return;
}


function EnableRadio( radioobj )
{
	for( var i = 0 ; i <  radioobj.length; i++ )
		EnableObj(radioobj[i]);
	return;
}

function DisableCheckBox( checkobj )
{
	if(checkobj.length == null)
	{
		DisableObj(checkobj); 
		return;
	}
	for( var i = 0 ; i <  checkobj.length; i++ )
		DisableObj(checkobj[i]);
	return;
}

function EnableCheckBox( checkobj )
{
	if(checkobj.length == null)
	{
		EnableObj(checkobj); 
		return;
	}
	for( var i = 0 ; i <  checkobj.length; i++ )
		EnableObj(checkobj[i]);
	return;
}

// for apply wait page
var Pos = 0;
var ProgressColor = 'skyblue';
var ApplyAniBgColor = 'navy';
var ProgressInterval = 40;
var ProgressTimer;
var Direction = 'right';
var BarWidth = 10;

function StartApplyAni()
{
	Pos = 0; 
	ProgressColor = 'skyblue';
	ApplyAniBgColor = 'navy'; 
	ProgressInterval = 40; 
	ProgressTimer; 
	Direction = 'right'; 
	BarWidth = 10;

	for( idx = 1 ;  ; idx ++ )
	{
	       	obj = document.getElementById('progress'+idx );
		if(!obj) break;
	       	obj.style.backgroundColor = ApplyAniBgColor;
	}
	AniUpdate();
}

function AniUpdate() 
{ 
	var HideIdx;

	if(Direction == 'right') Pos++;
	else Pos--;

	if(Direction == 'right')
		HideIdx = Pos - BarWidth; 
	else
		HideIdx = Pos + BarWidth; 

	obj = document.getElementById('progress'+HideIdx);
	if(obj) obj.style.backgroundColor = 'navy';
	if(HideIdx > 0 &&  !obj)
		Pos = 0;
	obj = document.getElementById('progress'+Pos);
	if(obj) obj.style.backgroundColor = ProgressColor;
	ProgressTimer = setTimeout('AniUpdate()',ProgressInterval);
}


// for upgrade or reboot page
function StartProgress(interval)
{
	Pos = 0; 
	ProgressColor = 'skyblue';
	ApplyAniBgColor = 'navy'; 
	ProgressInterval = interval; 
	Direction = 'right'; 

	for( idx = 1 ;  ; idx ++ )
	{
	       	obj = document.getElementById('progress'+idx );
		if(!obj) break;
	       	obj.style.backgroundColor = ApplyAniBgColor;
	}
	ProgressUpdate();
}

function ProgressUpdate() 
{ 
	var HideIdx;

	Pos++;
	obj = document.getElementById('progress'+Pos);
	if(obj) obj.style.backgroundColor = ProgressColor;
	ProgressTimer = setTimeout('ProgressUpdate()',ProgressInterval);
}



// for mac address input box 
function HWKeyUp(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var nextidx = idx + 1;
	var keynum;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

//	alert(keynum);
	if(keynum == TAB_CODE || keynum == BS_CODE) return;

	if(obj[0].value.length == 2)
	{
		obj=document.getElementsByName(prefix+nextidx);
		if(obj[0]) obj[0].focus();
		return;
	}
}

function CheckHex(keynum)
{
	if( ((keynum >= 96) && keynum <= 105) 
	  ||((keynum >= 48) && keynum <= 57)
	  ||((keynum >= 65) && keynum <= 70)
	  )
		return true;
	return false;
}

function HWKeyDown(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var previdx = idx - 1;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

	if((keynum == TAB_CODE)
	    || (keynum == DEL_CODE) 
	    || (keynum == BS_CODE) )
	{
		if(obj[0].value.length == 0 && event.keyCode == BS_CODE)
		{
			obj=document.getElementsByName(prefix+previdx);
			if(obj[0]) obj[0].focus();
		}
		return 1;
	}


	return CheckHex(keynum);
}


function IPKeyUp(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var len;
	var nextidx = idx + 1;
	var keynum;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

//	alert(keynum);

	if(keynum == TAB_CODE || keynum == BS_CODE) return;

	len = obj[0].value.length;
	if(len == 3 || event.keyCode == DOT_CODE || event.keyCode == DOT2_CODE)
	{
		if(len == 0) return;
		obj=document.getElementsByName(prefix+nextidx);
		if(obj[0]) obj[0].focus();
		return;
	}
}

function CheckNum(keynum)
{
	if( ((keynum >= 96) && keynum <= 105) 
	  ||((keynum >= 48) && keynum <= 57)
	  )
		return true;
	return false;
}

function IPKeyDown(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var previdx = idx - 1;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

	if((keynum == TAB_CODE)
	    || (keynum == DEL_CODE) 
	    || (keynum == BS_CODE) )
	{
		if(obj[0].value.length == 0 && event.keyCode == BS_CODE)
		{
			obj=document.getElementsByName(prefix+previdx);
			if(obj[0]) obj[0].focus();
		}
		return 1;
	}


	return CheckNum(keynum);
}


function ChangePage( m1, m2, m3 )
{
	var p;
	p="timepro.cgi?m1="+m1+"&m2="+m2+"&m3="+m3;
	window.location.href=p;
}

function DisableObj(obj)
{
	if(obj)
	{
		obj.disabled = true;
		if(obj.type == 'text' || obj.type == 'password') 
			obj.style.backgroundColor = "#EEEEEE";
	}
}

function DisableObjNames(name)
{
	var i;
	var obj=document.getElementsByName(name);

	for( i = 0 ; obj[i]; i++ )
		DisableObj(obj[i]);
}

function EnableObjNames(name)
{
	var i;
	var obj=document.getElementsByName(name);

	for( i = 0 ; obj[i]; i++ )
		EnableObj(obj[i]);
}


function EnableObj(obj)
{
	if(obj)
	{
		obj.disabled = false;
		obj.style.backgroundColor = "";
	}
}


function DisableIP(name)
{
	for( i = 1; i <= 4; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "#EEEEEE";
			obj[0].disabled = true;
		}
	}
}

function EnableIP(name)
{
	for( i = 1; i <= 4; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "";
			obj[0].disabled = false;
		}
	}
}

function EnableHW(name)
{
	for( i = 1; i <= 6; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "";
			obj[0].disabled = false;
			obj[0].readOnly = false;
		}
	}
}

function DisableHW(name)
{
	for( i = 1; i <= 6; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "#EEEEEE";
			obj[0].disabled = true;
		}
	}
}

function ReadOnlyHW(name)
{
	for( i = 1; i <= 6; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "";
			obj[0].readOnly = true;
		}
		else
			alert("Bug:No obj name:"+name+i);
	}
}

function SetIP(name, value)
{
	var iparr = value.split(".");

	for( i = 1; i <= 4; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
			obj[0].value = iparr[i-1];
		else
			alert("Bug:No obj name:"+name+i);
	}
}


function SetHW(name, value)
{
	for( i = 1; i <= 6; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
			obj[0].value = value.substr((i-1)*3,2);
		else
			alert("Bug:No obj name:"+name+i);
	}
}


function SetHWDoc(doc,name, value)
{
	for( i = 1; i <= 6; i++)
	{
		obj=doc.getElementsByName(name+i);
		if(obj[0])
			obj[0].value = value.substr((i-1)*3,2);
		else
			alert("Bug:No obj name:"+name+i);
	}
}


function SetHWOnCheckEnableHW(obj,hwname,hwaddr)
{
	if(obj.checked == true)
	{
		SetHW(hwname,hwaddr);
		EnableHW(hwname)
	}
	else
	{
		ResetHW(hwname);
		DisableHW(hwname)
	}
}
function SetHWOnCheckEnableHWButton(obj,hwname,hwaddr,btname)
{
	if(obj.checked == true)
	{
		SetHW(hwname,hwaddr);
		EnableHW(hwname)
 		EnableObjNames(btname)
	}
	else
	{
		ResetHW(hwname);
		DisableHW(hwname)
 		DisableObjNames(btname)
	}
}
function SetHWOnCheck(obj,hwname,hwaddr)
{
	if(obj.checked == true)
	{
		SetHW(hwname,hwaddr);
		EnableHW(hwname)
	}
	else
	{
		ResetHW(hwname);
		DisableHW(hwname);
	}
}

function SetHWOnCheckNoDisable(obj,hwname,hwaddr)
{
      if(obj.checked == true)
              SetHW(hwname,hwaddr);
      else
              ResetHW(hwname);
}

function SelectHWMethod(tag, mode)
{
	var hwname = "hw_"+tag;
	var btname = "mac_clone_"+tag;

	if (mode == 0)
	{
		EnableHW(hwname);
		EnableObjNames(btname);
	}
	else
	{
		DisableHW(hwname);
		DisableObjNames(btname);
	}
}

function SetHWCloneButton(hwname, hwaddr)
{
	SetHW(hwname,hwaddr);
}

function ResetHW(name)
{
	for( i = 1; i <= 6; i++)
	{
		obj=document.getElementsByName(name+i);
		if(obj[0])
			obj[0].value = '';
		else
			alert("Bug:No obj name:"+name+i);
	}
}

function ChangeToClickColor(obj)
{
	if( (obj.style.backgroundColor == '#ccccff') 
	||  (obj.style.backgroundColor == '#bbbbff') 
	|| (obj.style.backgroundColor == 'rgb(187, 187, 255)' )
	|| (obj.style.backgroundColor == 'rgb(204, 204, 255)' )
       	)
	{
		obj.style.backgroundColor='';
	}
	else	
        	obj.style.backgroundColor='#ccccff';
}


function ChangeToOverColor(obj)
{
	if(obj.style.backgroundColor == '')
        	obj.style.backgroundColor='#e8e8e8';
	else
        	obj.style.backgroundColor='#bbbbff';
	
}

function ChangeToOutColor(obj)
{
	// rgh => for firefox
	if(obj.style.backgroundColor == '#e8e8e8' || obj.style.backgroundColor == 'rgb(232, 232, 232)')
		obj.style.backgroundColor='';
	else if(obj.style.backgroundColor!='') 
		obj.style.backgroundColor='#ccccff';
}


function ViewDetail(id)
{
	var detail_id= 'detail_'+id;
	var toggle_id= 'toggle_'+id;

   	if(document.getElementById(toggle_id).value == '1')
	{
		document.getElementById(toggle_id).value = '0';
   		document.getElementById(detail_id).style.display = "none";
	}
	else
	{
		document.getElementById(toggle_id).value = '1';
		if (navigator.appName.indexOf("Microsoft") != -1)
			document.getElementById(detail_id).style.display = "block";
		else
			document.getElementById(detail_id).style.display = "table-row";
					
	}
}

function DisableAllObj(F)
{
	var i;
	for( i = 0 ; F.elements[i]; i++ )
		DisableObj(F.elements[i]);
}

function EnableAllObj(F)
{
	var i;
	for( i = 0 ; F.elements[i]; i++ )
		EnableObj(F.elements[i]);

}


function isDigit(c)
{
	return ((c >= '0') && (c <= '9'));
}

function isInteger(s)
{
	var i;
	for( i = 0 ; i < s.length; i++ )
		if(!isDigit(s.charAt(i))) { return false; } 
	return true;
}

function checkRange(address, srange, erange)
{
	var addr;

	if(isInteger(address) == false )
		return 1; 

	addr=parseInt(address);
	if (addr == 0)
	{
		if ((addr < srange) || (addr > erange))
			return 1;
		else
			return 0;
	}
	else
	{
		if ((!addr) || (addr < srange) || (addr > erange)) 
			return 1;
		else 
			return 0;
	}
}

// option = 0(mandatory) , option = 1 (optional)
function checkHardwareRange(s, option)
{
	if(option && s.length  == 0 ) return 0;
	if( s.length != 2 ) return 1;

	for( i = 0 ; i < s.length; i++ )
		if(IsHex(s)) return 1;
	return 0;
}

function checkOptionalRange(address, srange, erange)
{
	var addr; 
	if (address == "") 
		return 0;
	addr=parseInt(address);
	if (addr == 0) 
	{
		if ((addr < srange) || (addr > erange))
			return 1;
		else
			return 0;
	}
	else
	{
		if ((!addr) || (addr < srange) || (addr > erange))
			return 1;
		else
			return 0;
	}
}

function CheckIP( name )
{
	var i;
	for( i=1;i<= 4 ;i++)
	{
		obj=document.getElementsByName(name+i); 
		if(!obj[0])
		{
			alert("Bug:Invalid IP Obj"+name+i); 
			break;
		}
		if ((i == 1) && (checkRange(obj[0].value, 1, 255)))
			return obj[0];
		else if(checkRange(obj[0].value, 0, 255))
			return obj[0];
	}
	return 0;
}

function CheckIPObj( ifr, name )
{
	var i;
	for( i=1;i<= 4 ;i++)
	{
		obj=ifr.document.getElementsByName(name+i); 
		if(!obj[0])
		{
			alert("Bug:Invalid IP Obj"+name+i); 
			break;
		}
		if ((i == 1) && (checkRange(obj[0].value, 1, 255)))
			return obj[0];
		else if(checkRange(obj[0].value, 0, 255))
			return obj[0];
	}
	return 0;
}

function ResetIP(name)
{
        obj=document.getElementsByName(name+4);
        if(obj[0])
                obj[0].value = '';
        else
                alert("Bug:No obj name:"+name+4);
}

function SetIP4(name, value)
{
        obj = document.getElementsByName(name+4);
        if(obj[0])
                obj[0].value = value;
        else
                alert("Bug:No obj name:"+name+4);
}


function OnCheckEnableIP(obj,ipname, ipaddr)
{
        if(obj.checked == true)
        {
                SetIP4(ipname, ipaddr);
                EnableIP(ipname)
        }
        else
        {
                ResetIP(ipname);
        }
}

function CheckSameSubnet(ip1,ip2,mask)
{
	if(GetNetworkAddress(ip1,mask) == GetNetworkAddress(ip2,mask))
		return 1;
	else
		return 0;

}

function CheckOptionalIP( name )
{
	var i;
	for( i=1;i<= 4 ;i++)
	{
		obj=document.getElementsByName(name+i); 
		if(!obj[0])
		{
			alert("Bug:Invalid Obj"+name+i); 
			break;
		}
		if ((i == 1) && (checkOptionalRange(obj[0].value, 1, 255)))
			return obj[0];
		else if(checkOptionalRange(obj[0].value, 0, 255))
			return obj[0];
	}
	return 0;
}


function CheckHW( name )
{
	var i;
	for( i=1;i<= 6 ;i++)
	{
		obj=document.getElementsByName(name+i); 
		if(!obj[0])
		{
			alert("Bug:Invalid Obj"+name+i); 
			break;
		}

		if(checkHardwareRange(obj[0].value,0))
			return obj[0];
	}
	return 0;
}


function CheckHWObj(ifr,name)
{
        var i;
        var name;
        for( i=1;i<= 6 ;i++)
        {
                obj=ifr.document.getElementsByName(name+i);
                if(!obj[0])
                {
                        alert("Bug:Invalid Obj"+name);
                        break;
                }

                if(checkHardwareRange(obj[0].value,0))
                        return obj[0];
        }
        return 0;
}


function CheckOptionalHW( name )
{
	var i;
	for( i=1;i<= 6 ;i++)
	{
		obj=document.getElementsByName(name+i); 
		if(!obj[0])
		{
			alert("Bug:Invalid Obj"+name+i); 
			break;
		}

		if(checkHardwareRange(obj[0].value,1))
			return obj[0];
	}
	return 0;
}

function CheckMask(name)
{
	var maskvalue = new Array();
	var sm = new Array();
	
	maskvalue[0] = 255; maskvalue[1] = 254; maskvalue[2] = 252;
	maskvalue[3] = 248; maskvalue[4] = 240; maskvalue[5] = 224;
	maskvalue[6] = 192; maskvalue[7] = 128; maskvalue[8] = 0;
	
	for( i=1; i<= 4 ;i++)
	{
		obj=document.getElementsByName(name+i);

		if(!obj[0])
			return obj[0];
		if ((i == 1) && (checkRange(obj[0].value, 1, 255)))
			return obj[0];
		else if(checkRange(obj[0].value, 0, 255))
			return obj[0];
								
		for (j=0; j < 9; j++)
		{
			if (obj[0].value == maskvalue[j])
				break;
		}
		if (j == 9)
			return obj[0];
		sm[i-1] = obj[0].value;
	}
	if ((sm[0] != 255) && ((sm[1]!= 0)||(sm[2] != 0)||(sm[3] != 0))) 
			return obj[0];
	else if ((sm[1] != 255) &&  ((sm[2] != 0)||(sm[3] != 0))) 
			return obj[0];
	else if ((sm[2] != 255) && (sm[3] != 0))
			return obj[0];
	return 0;
	
}
function GetNetworkAddress( ip , mask)
{
	var i;
	var rt_value,obj_ip,obj_mask;
	for( i=1;i<= 4;i++)
	{
		obj_ip=document.getElementsByName(ip+i); 
		obj_mask=document.getElementsByName(mask+i); 
		if(!obj_ip[0] || !obj_mask[0])
		{
			alert("Bug:Invalid Obj"+name+i); 
			break;
		}
		if(i!=1)
		rt_value+=parseInt(obj_ip[0].value) & parseInt(obj_mask[0].value);
		else
		rt_value=parseInt(obj_ip[0].value) & parseInt(obj_mask[0].value);
		if(i!=4)
			rt_value+=".";
		else
			return rt_value;
	}
	return 0;
	
}
function HideIt(id)
{
   	document.getElementById(id).style.display = "none";
}

function ShowIt(id)
{
	if (navigator.appName.indexOf("Microsoft") != -1)
		document.getElementById(id).style.display = "block";
	else
		document.getElementById(id).style.display = "table-row";
				
}

function ToggleView(show_id,hide_id)
{
   	document.getElementById(hide_id).style.display = "none";
	if (navigator.appName.indexOf("Microsoft") != -1)
		document.getElementById(show_id).style.display = "block";
	else
		document.getElementById(show_id).style.display = "table-row";
}

function ApplyReboot(F, value)
{
	if(value == '') return;
	if(value == 'default' && !confirm(MSG_RESTART_CONFIRM_DEFAULT)) return;
	else if(value == 'upnp' && !confirm(MSG_RESTART_CONFIRM_UPNP)) return;
	else if(value == 'lanip_chg'&& !confirm(MSG_RESTART_CONFIRM_CHANGE_LANIP)) return;
	else if(value == 'nat' && !confirm(MSG_RESTART_CONFIRM_NAT)) return;
	else if(value == 'reboot' && !confirm(MSG_RESTART_CONFIRM_REBOOT)) return;
	else if(value == 'restore' && !confirm(MSG_RESTART_CONFIRM_RESTORE)) return;
	else if(value == 'wireless' && !confirm(MSG_RESTART_CONFIRM_WIRELESS)) return;
	else if(value == 'kai' && !confirm(MSG_KAID_MODE_CHANGE_WARNING)) return;

        F.m1.value='background';
        F.m2.value='reboot';
        F.commit.value=value;
        F.submit();
}

function MovePagetoMain(m1,m2,m3)
{
        ChangePage(m1,m2,m3 );
        parent.menu_title.location.href='timepro.cgi?menutitlebar=1&m1='+m1+"&m2="+m2+"&m3="+m3;

}


function GetOptionCount(obj)
{
        var i;
        for( i = 0 ; obj.options[i] ; i++ );
        return i;
}



function AddOptionTail(obj,count,addcount)
{
        var i,chnum;

        for( i = 0 ; i < addcount; i++ )
        {
                var oOption = document.createElement("OPTION");
                chnum = count + i + 1;
                oOption.text = "ch "+chnum;
                oOption.value= count + i;
                obj.add(oOption,count+i);
        }
}

function RemoveOptionTail(obj,count,rmcount)
{
        for( i = 0 ; i < rmcount; i++ )
                obj.remove(count-i-1);
}



function RefreshOpener(url)
{
        alert(REBOOT_CHANGEIP_RETRY_LOGIN);
        top.location.href='http://'+url;
}

function RestoreClose()
{
        alert(SYSCONF_RESTORE_RETRY_CONNET);
        top.close();
}

function popup_button(url,name,opt)
{
	win=window.open(url,name,opt);
	win.focus();
}

function CheckAllCheckBox(doc, obj, chk_name)
{
	chkobj = doc.getElementsByName(chk_name);

	if(!chkobj)
		return;
	
	if(obj.checked == true)
	{
		if(chkobj.length == null)
		{
			chkobj.checked = true;
			return;
		}
	
		for( var i = 0 ; i < chkobj.length; i++ )
		{
			if(chkobj[i].disabled == false) chkobj[i].checked = true;
		}
	}
	else
	{	
		if(chkobj.length == null)
                {
                        chkobj.checked = false;
			return;
		}										                
		for( var i = 0 ; i < chkobj.length; i++ )
			chkobj[i].checked = false;
	}	
}

function redir_login()
{
	location.href = "../login/login.cgi";
}

function createElementTR(doc)
{
	return doc.createElement("tr");
}

function createElementTD(doc, tr, td_txt, td_elem, align, width, height)
{
	var td, txt, elem;

	td = doc.createElement("td");
	if (td_txt != "")
	{
		txt = doc.createTextNode(td_txt);
		td.appendChild(txt);
	}
	if (td_elem != "")
	{
		elem = doc.createElement(td_elem);
		td.appendChild(elem);
	}
	if (align != "") 
		td.setAttribute("align", align);
	else
		td.setAttribute("align", "center");
	if (width)
		td.setAttribute("width", width);
	if (height)
		td.setAttribute("height", height);

	td.setAttribute("className", "item_td_smallfont");

	tr.appendChild(td);

	return td;
}


</script>
