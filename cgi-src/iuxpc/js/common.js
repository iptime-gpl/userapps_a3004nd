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

function isalpha(c) {
    return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
}

function isdigit(c) {
    return ((c >= '0') && (c <= '9'));
}

function isalnum(c) {
    return (isalpha(c) || isdigit(c));
}


function GetValue( obj )
{
	if(obj[0] && obj[0].type == 'radio')
		return GetRadioValue(obj);
	if(obj && obj.type == 'select-one') 
		return obj.options[obj.selectedIndex].value;

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

// for mac address input box 
function HWKeyUp(prefix,idx)
{
}

function CheckHex(keynum)
{
	if( ((keynum >= 97) && keynum <= 102) 
	  ||((keynum >= 48) && keynum <= 57)
	  ||((keynum >= 65) && keynum <= 70)
	  )
		return true;
	return false;
}

function HWKeyDown(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var nextidx = idx+1;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

	if( keynum == 45 )
	{
		if(obj[0].value.length == 2)
		{
			obj=document.getElementsByName(prefix+nextidx);
			if(obj[0]) obj[0].focus();
		}
	}

	return CheckHex(keynum);
}

function IPKeyUp(prefix,idx)
{
}

function CheckNum(keynum)
{
      	if((keynum >= 48) && (keynum <= 57))
	{
              return true;
	}
      	return false;
}


function IPKeyDown(prefix,idx)
{
	var obj=document.getElementsByName(prefix+idx);
	var nextidx = idx + 1;

       	if(window.event)
		keynum = event.keyCode;
	else if(e.which) // Netscape/Firefox/Opera
		keynum = event.which;

	if(keynum == 46) /* if '.' */
	{
		if(obj[0].value.length != 0)
		{
			obj=document.getElementsByName(prefix+nextidx);
			if(obj[0]) obj[0].focus();
		}
	}
	return CheckNum(keynum);
}


function ChangePage( tmenu, smenu, opt )
{
	var p;
	p="timepro.cgi?tmenu="+tmenu+"&smenu="+smenu+"&"+opt;
	window.location.href=p;
}

function DisableObj(obj)
{

	if(obj && !obj.type)
	{
		if(obj[0].type == 'radio')
		{
			for( var i = 0 ; i <  obj.length; i++ )
			{
				obj[i].disabled = true;
				if(obj[i].type == 'text' || obj[i].type == 'password') 
					obj[i].style.backgroundColor = "#EEEEEE";
			}
		}
		return;
	}

	if(obj)
	{
		obj.disabled = true;
		if(obj.type == 'text' || obj.type == 'password' || obj.type == 'select') 
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
	if(obj && !obj.type)
	{
		if(obj[0].type == 'radio')
		{
			for( var i = 0 ; i <  obj.length; i++ )
			{
				obj[i].disabled = false;
				obj[i].style.backgroundColor = "";
			}
		}
		return;
	}


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

function DisableIPDoc(doc,name)
{
	for( i = 1; i <= 4; i++)
	{
		obj=doc.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "#EEEEEE";
			obj[0].disabled = true;
		}
	}
}


function EnableIPDoc(doc,name)
{
	for( i = 1; i <= 4; i++)
	{
		obj=doc.getElementsByName(name+i);
		if(obj[0])
		{
			obj[0].style.backgroundColor = "";
			obj[0].disabled = false;
		}
	}
}

function EnableHWDoc(doc,name)
{
	for( i = 1; i <= 6; i++)
	{
		obj=doc.getElementsByName(name+i);
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

function SetIPDoc(doc, name, value)
{
	var iparr = value.split(".");

	for( i = 1; i <= 4; i++)
	{
		obj=doc.getElementsByName(name+i);
		if(obj[0])
			obj[0].value = iparr[i-1];
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
			break;
		}
		if ((i == 1) && (checkRange(obj[0].value, 1, 255)))
			return obj[0];
		else if(checkRange(obj[0].value, 0, 255))
			return obj[0];
	}
	return 0;
}

function CheckIPAllowLocalBroadcast( name )
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
		else if(checkRange(obj[0].value, 0, 256))
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
	for( i = 1; i <= 4; i++)
	{
	        obj=document.getElementsByName(name+i);
	      	if(obj[0])
	                obj[0].value = '';
	        else
	                alert("Bug:No obj name:"+name+i);
	}
}

function ResetIP4(name)
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
                SetIP(ipname, ipaddr);
                EnableIP(ipname)
        }
        else
        {
                ResetIP4(ipname);
        }
}

function CheckSameSubnet( subnet1, subnet2)
{
	return ((subnet1.substr(0,3) == subnet2.substr(0,3)) &&
		(subnet1.substr(4,3) == subnet2.substr(4,3)) &&
		(subnet1.substr(8,3) == subnet2.substr(8,3)) &&
		(subnet1.substr(12,3) == subnet2.substr(12,3)));
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

function GetNetworkAddress(ip,mask)
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

function GetLocalBroadcastAddress(ip , sm)
{
        ip1=document.getElementsByName(ip+1)[0].value;
        ip2=(document.getElementsByName(ip+2))[0].value;
        ip3=(document.getElementsByName(ip+3))[0].value;
        ip4=(document.getElementsByName(ip+4))[0].value;

        sm1=document.getElementsByName(sm+1)[0].value;
        sm2=(document.getElementsByName(sm+2))[0].value;
        sm3=(document.getElementsByName(sm+3))[0].value;
        sm4=(document.getElementsByName(sm+4))[0].value;

        nw1 = eval(sm1 & ip1);
        nw2 = eval(sm2 & ip2);
        nw3 = eval(sm3 & ip3);
        nw4 = eval(sm4 & ip4);

        broad1 = (nw1 ^ ~ sm1 & 255);
        broad2 = (nw2 ^ ~ sm2 & 255);
        broad3 = (nw3 ^ ~ sm3 & 255);
        broad4 = (nw4 ^ ~ sm4 & 255);

        return (broad1+'.'+broad2+'.'+broad3+'.'+broad4);
}

function GetIP( ip )
{
        ip1=Number((document.getElementsByName(ip+1))[0].value);
        ip2=Number((document.getElementsByName(ip+2))[0].value);
        ip3=Number((document.getElementsByName(ip+3))[0].value);
        ip4=Number((document.getElementsByName(ip+4))[0].value);

        return (ip1+'.'+ip2+'.'+ip3+'.'+ip4);
}

function HideIt(id)
{
	if(document.getElementById(id)) document.getElementById(id).style.display = "none";
}

function ShowIt(id)
{
	if(document.getElementById(id))
	{
		if (navigator.appName.indexOf("Microsoft") != -1)
			document.getElementById(id).style.display = "block";
		else
			document.getElementById(id).style.display = "table-row";
	}
				
}

function ToggleView(show_id,hide_id)
{
   	document.getElementById(hide_id).style.display = "none";
	if (navigator.appName.indexOf("Microsoft") != -1)
		document.getElementById(show_id).style.display = "block";
	else
		document.getElementById(show_id).style.display = "table-row";
}

function MovePagetoMain(tmenu,smenu)
{
        var tdid=tmenu+"_"+smenu+"_3_td";
        var id=tmenu+'_setup';
        var menu=parent.navi_menu_advance.document.getElementById('advance_setup');

	if((menu.style.display!="block") && (menu.style.display!="table-cell"))
                changeNaviTitleMenuState('advance_setup');

        menu=parent.navi_menu_advance.document.getElementById(id);
	if((menu.style.display!="block") && (menu.style.display!="table-cell"))
                changeNaviTitleMenuState(id);

        toggle_detail(tdid);

        ChangePage( tmenu, smenu,'' );
        parent.menu_title.location.href='timepro.cgi?tmenu=menu_titlebar&smenu='+tmenu+'_'+smenu;

}

function MovePagetoMainURL(tmenu,smenu,url)
{
        var tdid=tmenu+"_"+smenu+"_3_td";
        var id=tmenu+'_setup';
        var menu=parent.navi_menu_advance.document.getElementById('advance_setup');

	if((menu.style.display!="block") && (menu.style.display!="table-cell"))
                changeNaviTitleMenuState('advance_setup');

        menu=parent.navi_menu_advance.document.getElementById(id);
	if((menu.style.display!="block") && (menu.style.display!="table-cell"))
                changeNaviTitleMenuState(id);

        toggle_detail(tdid);

        ChangePage( tmenu, smenu,url );
        parent.menu_title.location.href='timepro.cgi?tmenu=menu_titlebar&smenu='+tmenu+'_'+smenu;

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
        if(top.opener && top.opener.closed)
                alert(REBOOT_CHANGEIP_RETRY_NOLOGIN_WINDOWS);
        else
        {
		if(top.opener)
		{
                	top.opener.location.href='http://'+url;
			top.opener.focus();
		}
		else
		{
                	top.location.href='http://'+url;
			top.focus();
		}
        }

        if(top.opener) top.close();
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

function CheckAtleastOneCheck(name)
{
	obj = document.getElementsByName(name);

	for( i = 0 ; i < obj.length ; i++ )
	{
		if (obj[i].type != 'checkbox')
			continue;
		if( obj[i].checked == true )
			return true;
	}
	return false;	
}

function CheckHour(hour)
{
	var ihour=parseInt(hour);

	if(!isInteger(hour) || ihour > 23 || ihour < 0 )
		return false;
	return true;
}

function CheckMin(min)
{
	var imin=parseInt(min);

	if(!isInteger(min) || imin > 59 || imin < 0 )
		return false;
	return true;
}

function ReadOnlyObj(obj,flag)
{
	if(flag == '1')
	{
		obj.readOnly=true;
		obj.style.backgroundColor='#eeeeee';
	}
	else
	{
		obj.readOnly=false;
		obj.style.backgroundColor='';
	}
}




function PasswordView(password,password_text,password_view)
{
        if(password_view.checked == true)
        {
                password.style.display = "none";
                password_text.style.display = "inline";
                password_text.value = password.value;
        }
        else
        {
                password_text.style.display = "none";
                password.value = password_text.value;
                password.style.display = "inline";
        }
}


function ShowObj(obj)
{
        if(obj)
        {
                if (navigator.appName.indexOf("Microsoft") != -1)
                        obj.style.display = "inline";
                else
                        //obj.style.display = "table-row";
                        obj.style.display = "";
        }
}

function HideObj(obj)
{
        if(obj) obj.style.display = 'none';
}



function CheckAtleastOneCheckDoc(doc,name)
{
        obj = doc.getElementsByName(name);

        for( i = 0 ; i < obj.length ; i++ )
        {
                if (obj[i].type != 'checkbox')
                        continue;
                if( obj[i].checked == true )
                        return true;
        }
        return false;
}

function GetHW( name )
{
        var hwval=(document.getElementsByName(name+1))[0].value+'-';

        hwval+=(document.getElementsByName(name+2))[0].value+'-';
        hwval+=(document.getElementsByName(name+3))[0].value+'-';
        hwval+=(document.getElementsByName(name+4))[0].value+'-';
        hwval+=(document.getElementsByName(name+5))[0].value+'-';
        hwval+=(document.getElementsByName(name+6))[0].value;

        return hwval;
}


function ClearHWDoc(doc,name)
{
        for( i = 1; i <= 6; i++)
        {
                obj=doc.getElementsByName(name+i);
                if(obj[0])
                        obj[0].value = '';
                else
                        alert("Bug:No obj name:"+name+i);
        }
}


function ClearIPDoc(doc, name)
{
        for( i = 1; i <= 4; i++)
        {
                obj=doc.getElementsByName(name+i);
                if(obj[0]) obj[0].value = "";
        }
}

function MaskIt(doc,mask_name)
{
	var obj = doc.getElementById(mask_name);

	if(obj)
	{
                if (navigator.appName.indexOf("Microsoft") != -1)
                        obj.style.display = "block";
                else
                        obj.style.display = "table-row";
	}
}


function UnMaskIt(doc,mask_name)
{
	var obj;

	obj=doc.getElementById(mask_name);
        if(obj)	obj.style.display = "none";
}


function HideItDoc(doc,id)
{
        if(doc.getElementById(id)) doc.getElementById(id).style.display = "none";
}

function ShowItDoc(doc,id)
{
        if(doc.getElementById(id))
        {
                if (navigator.appName.indexOf("Microsoft") != -1)
                       doc.getElementById(id).style.display = "block";
                else
                        doc.getElementById(id).style.display = "table-row";
        }
}


function CheckNoPassword(F)
{
	if(F.nopassword && F.nopassword.value == '1')
	{
		if(confirm(PASSWORD_NEEDED_TO_SET_THIS))
			MovePagetoMain('sysconf','login');
		return 1;
	}
	return 0;
}


function FocusCaptcha(F)
{
        if(F.default_captcha_desc.value == F.captcha_code.value)
                F.captcha_code.value="";
}

function BlurCaptcha(F)
{
        if(F.captcha_code.value == '')
                F.captcha_code.value=F.default_captcha_desc.value;
}


function RunTimer(id,time,action)
{
        var obj;

        obj=parent.document.getElementById(id);
        if(obj) obj.innerHTML = time;
        time--;
        if(time)
                setTimeout("RunTimer('"+id+"',"+time+",'"+action+"' );",1000);
        else
                setTimeout(action,1000);
}


var UNPERMITTED_CHARS="&;|\\><\"'`/";

function CheckUnpermittedChars(val)
{
        for(i=0;i<UNPERMITTED_CHARS.length;i++)
        {
                if(val.indexOf(UNPERMITTED_CHARS.charAt(i))!=-1)
                        return 1;
        }

        return 0;
}


var TimerController = null;
function IsCanceledMask(doc,mask_name,msg){
	var obj;
	
	obj = doc.getElementById(mask_name);

	if(obj){
		if(obj.style.display != 'none'){
			if(msg)
				alert(msg);
			else
				alert(WIRELESSCONF2_LOGOUTMSG);
		}
	}
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

function CheckUTF8Str(val)
{
        var len=0, i=0;

        for(i=0;val.charCodeAt(i);i++)
	{
                if(val.charCodeAt(i) > 0x00007F)
			return 1;
	}
        return 0;
}

function SetCursor(obj)
{
        if(obj)
        {
                obj.style.backgroundColor='#C9D5E9';
                obj.style.color='#000000';
        }
}

</script>
