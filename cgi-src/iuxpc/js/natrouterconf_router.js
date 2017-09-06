<script>

function rttypeOnchange()       
{ 
        var F = document.router_setup_fm;
        if (F.rtselect.value == 'host') 
                DisableObj(F.netmask);  
        else 
                EnableObj(F.netmask);   
} 

function deleteRT()     
{ 
	function copyDeleteList()
	{
		if(F.delchk.checked)
			F2.delchk.checked = true;
		else
			for( var i = 0; i < F.delchk.length; ++i )
				if( F.delchk[i].checked )
					F2.delchk[i].checked = true;
	}
        var F = document.router_list_fm, 
		F2 = document.getElementsByName('natrouterconf_router_status')[0].contentWindow.document.router_list_fm;

	if(CheckAtleastOneCheck('delchk') == false) 
	{
		alert(MSG_NO_DEL_ROUTING_TABLE);
		return;
	}

        if (!confirm(NETCONF_ROUTE_ENTRY_DELETE))    
		return;

	copyDeleteList();

	MaskIt(parent.document, 'apply_mask');
	F2.submit();     
} 

function natrouterSetCursor( index )
{
	var list = document.getElementsByTagName('TR');
	for ( var i = 0; i < list.length; ++i)
		list[i].className = list[i].className.replace("selected", "");
	document.getElementsByTagName("TR")[index + 1].className = 'selected';
}

function clickRT( index )
{
	function copyTextIpToInput( textIp, inputName, length )
	{
		var ipArray = textIp.split(".");
		for( i = 1; i <= length; ++i )
			doc.getElementsByName(inputName + i)[0].value = ipArray[i - 1];
	}
	function convertNetMask( ipaddress ) {
		if( ipaddress.length === 0 )
			return "";
		var array = ipaddress.split(".");
		for( var i = 0; i < array.length; ++i )
			array[i] = Number(array[i]).toString(2);
		var value = array.join("").indexOf("0");
		if( value === -1 )
			value = 32;
		return value;
	}
	natrouterSetCursor( index );

	if( document.getElementsByTagName('span').length <= 2 )
	{
		return;
	}
	var number = document.getElementsByTagName('span')[index * 5 + 1].innerHTML,
		type = document.getElementsByTagName('span')[index * 5 + 2].innerHTML,
		target = document.getElementsByTagName('span')[index * 5 + 3].innerHTML,
		mask = document.getElementsByTagName('span')[index * 5 + 4].innerHTML,
		gateway = document.getElementsByTagName('span')[index * 5 + 5].innerHTML;

	var doc = parent.document;
	doc.getElementsByName('index')[0].value = number;
	doc.getElementsByName('netmask')[0].value = convertNetMask(mask);
	if( type === 'HOST' )
	{
		doc.getElementsByName('rtselect')[0].value = 'host';
                DisableObj(parent.document.getElementsByName('netmask')[0]);
		
	}
	else if( type === 'NETWORK' )
	{
		doc.getElementsByName('rtselect')[0].value = 'net';
                EnableObj(parent.document.getElementsByName('netmask')[0]);
	}
	copyTextIpToInput( target, 'targetip', 4 );
	copyTextIpToInput( gateway, 'gw', 4 );

	doc.getElementsByName('addbt')[0].style.display = "none";
	doc.getElementsByName('modifybt')[0].style.display = "";

}

function clearInputValue()
{
	var doc = parent.document;
	doc.getElementsByName('index')[0].value = "";
	doc.getElementsByName('rtselect')[0].value = "net";
	doc.getElementsByName('netmask')[0].value = "";
	EnableObj(doc.getElementsByName('netmask')[0]);
	doc.getElementsByName('targetip1')[0].value = "";
	doc.getElementsByName('targetip2')[0].value = "";
	doc.getElementsByName('targetip3')[0].value = "";
	doc.getElementsByName('targetip4')[0].value = "";
	doc.getElementsByName('gw1')[0].value = "";
	doc.getElementsByName('gw2')[0].value = "";
	doc.getElementsByName('gw3')[0].value = "";
	doc.getElementsByName('gw4')[0].value = "";

	doc.getElementsByName('addbt')[0].style.display = "";
	doc.getElementsByName('modifybt')[0].style.display = "none";

	natrouterSetCursor( ( document.getElementsByTagName("span").length - 2 ) / 5 );
}

function AddSubmit( act )
{ 
	function copyRouterSetupFormValue()
	{
		F2.rtselect.value = F.rtselect.value;
		F2.targetip1.value = F.targetip1.value;
		F2.targetip2.value = F.targetip2.value;
		F2.targetip3.value = F.targetip3.value;
		F2.targetip4.value = F.targetip4.value;
		F2.netmask.value = F.netmask.value;
		F2.gw1.value = F.gw1.value;
		F2.gw2.value = F.gw2.value;
		F2.gw3.value = F.gw3.value;
		F2.gw4.value = F.gw4.value;
	}
        var F = document.router_setup_fm, F2 = document.getElementsByName('natrouterconf_router_setup')[0].contentWindow.document.router_setup_fm;
        var obj;
	if(document.getElementsByName('natrouterconf_router_list')[0].contentWindow.document.getElementsByTagName('span').length - 2 >= 500)
	{
		alert(MSG_MAX_IP_RULES);
		return;
	}
        else if (obj=CheckIP('targetip'))    
        { 
                alert(MSG_INVALID_IP);
                obj.focus();    
                obj.select();   
                return;
        } 
        else if (F.rtselect.value == 'net' && checkRange(F.netmask.value,1,32)) 
        { 
		alert(MSG_INVALID_NETMASK);
                F.netmask.focus();      
                F.netmask.select();     
                return;
        } 
        else if (obj=CheckIP('gw'))     
        { 
                alert(MSG_INVALID_IP);
                obj.focus();    
                obj.select();   
                return; 
        } 
        else if (obj=CheckIPNetwork('gw'))     
        { 
                alert(MSG_INVALID_IP);
                obj.focus();    
                obj.select();   
                return;
        } 
        F2.act.value = act;
	if( act === "add")
		document.getElementsByName('index')[0].value = ( document.getElementsByName("natrouterconf_router_list")[0].contentWindow.document.getElementsByTagName('span').length - 2 ) / 5 + 1;
	else if( act === "modify" )
	{
		F2.delchk.value = F.index.value - 1;
	}
	copyRouterSetupFormValue();
	if( F2.rtselect.value === 'host' )
		F2.netmask.value = '';

	MaskIt(document, 'apply_mask');
        F2.submit();
} 

function UnMask( doc, maskName )
{
	setTimeout( function() {
		UnMaskIt( doc, maskName );
	}, 500);
}

function highlightAddedTr()
{
	var index = parent.parent.document.getElementsByName('index')[0].value;

	if( index )
	{
		parent.window.clickRT(index - 1);
	}
	else
	{
		parent.window.natrouterSetCursor( ( parent.document.getElementsByTagName('span').length - 2 ) / 5 );
	}
}


</script>
