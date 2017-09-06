<script>
function get_wan_internet_speed(doc, wanIdx)
{
	function get_wan1_internet_speed(doc)
	{
		if(doc.getElementById("type_value2"))
			return doc.getElementById("type_value2").innerHTML.replace(/[^0-9]/g, "");
		else
			return doc.getElementById("type1_value2").innerHTML.replace(/[^0-9]/g, "");
	}

	function get_wan2_internet_speed(doc)
	{
		if(doc.getElementById("type2_value2"))
			return doc.getElementById("type2_value2").innerHTML.replace(/[^0-9]/g, "");
		else
			return -1;
	}
	switch(wanIdx)
	{
		case 1: return Number(get_wan1_internet_speed(doc));
		case 2: return Number(get_wan2_internet_speed(doc));
		default: return -1;
	}
}

function get_internet_speed(doc, info, wanIdx)
{
	info.speed = get_wan_internet_speed(doc, wanIdx);
	if(info.speed === -1)
	{
		info.speed = 0;
		return false;
	}
	return true;
}

function getSelectedTr()
{
	var trList = document.getElementsByTagName("TR");
	for( var i = 0; i < trList.length; ++i )
		if( trList[i].id !== "add_rule_tr" && trList[i].className.indexOf("selected") >= 0 )
			return trList[i];
	return null;
}

function getTrIndex( tr )
{
	if(!tr)
		return null;

	var trList = document.getElementsByTagName("TR");
	for( var i = 0; i < trList.length; ++i )
		if( trList[i] === tr )
			return i;
	return null;
}

function setQosCursor( index, menuDoc, ruleDoc )
{
	var prevObj, i;
	var menuList = menuDoc.getElementsByTagName("TR");
	for( i = 0; i < menuList.length; ++i )
		menuList[i].className = menuList[i].className.replace("selected", "");
	var ruleList = ruleDoc.getElementsByTagName("TR");
	for( i = 0; i < ruleList.length; ++i )
		ruleList[i].className = ruleList[i].className.replace("selected", "");
	document.getElementsByTagName("TR")[index].className += " selected";
}

function hideAllSettingTable( doc )
{
	var tableList = doc.getElementById("apply_html").getElementsByTagName("table");
	for( var i = 0; i < tableList.length; ++i )
		tableList[i].style.display = "none";
}

function clickQosMenu( index, trId )
{
	setQosCursor( index, document, ruleWindow(parent.document).document );
	hideAllSettingTable( parent.document );

	parent.document.getElementById( trId + '_table').style.display = "";
}

function clickQosRule( index )
{
	setQosCursor( index, menuWindow(parent.document).document, document );
	hideAllSettingTable( parent.document );

	parent.document.getElementById("rule_table").style.display = "";
}

function clearInputValue( index )
{
	clickQosRule( index );
	parent.document.rule_fm.apply_btn.style.display = "";
	parent.document.rule_fm.modify_btn.style.display = "none";
	DisableObj(parent.document.rule_fm.new_rule_btn)
	DisableObj(parent.document.rule_fm.cancel_btn)

	parent.document.rule_fm.property.value = "2";
	parent.document.rule_fm.dn.value = "";
	parent.document.rule_fm.up.value = "";
	parent.document.rule_fm.priority.value = getMaximumPriority(parent.document);
	parent.document.rule_fm.iptype.value = "single";
	parent.document.rule_fm.ip4.value = "";
	parent.document.rule_fm.ip5.value = "";
	parent.document.rule_fm.bpichk.checked = false;
	parent.document.rule_fm.port_select.value = "manual";
	parent.document.rule_fm.protocol.value = "all";
	parent.document.rule_fm.portfrom.value = "";
	parent.document.rule_fm.portto.value = "";
	if(parent.document.rule_fm.wan_idx)
		parent.document.rule_fm.wan_idx.value = "1";

	changedIptype( parent.document );
	changedPortSelect( parent.document );
}

function getPropertyValue( index )
{
	return !!(ruleWindow(document).document.getElementsByName("property")[index].innerHTML.replace(/\s/g, "").split("(")[0] === lang.sharing_bounded.replace(/\s/g, "") ) && "2" || "3";
}

function getDownloadValue( index )
{
	return parseFloat(ruleWindow(document).document.getElementsByName("download")[index].innerHTML) || "";
}

function getUploadValue( index )
{
	return parseFloat(ruleWindow(document).document.getElementsByName("upload")[index].innerHTML) || "";
}

function getPriorityValue( index )
{
	return ruleWindow(document).document.getElementsByName("index")[index].innerHTML.replace(/<[^>]+>/ig, "");
}

function getIptypeValue( index )
{
        var ip = ruleWindow(document).document.getElementsByName("ip_address")[index].innerHTML.replace(/\[.*\]|\s/g, "").toLowerCase().split(/\.|~/);
        if( ip.length >= 4 )
        {
                if(ip.length == 5)
                        return "range";
                else
                        return "single";
        }
        else
        {
                if(ip[0].indexOf("twin") >= 0)
		{
			if(ip[0].indexOf("wan1") >= 0)
				return "twinip1";
			else if(ip[0].indexOf("wan2") >= 0)
				return "twinip2";
			else
				return "twinip";
		}
                else
                        return "all";
        }
}

function getIp4Address( index )
{
	return ruleWindow(document).document.getElementsByName("ip_address")[index].innerHTML.split(/\.|~/)[3] || "";
}

function getIp5Address( index )
{
	return ruleWindow(document).document.getElementsByName("ip_address")[index].innerHTML.split(/\.|~/)[4] || "";
}

function getBpiChkValue( index )
{
	return !!( getIptypeValue(index) === "range" && ruleWindow(document).document.getElementsByName("property")[index].innerHTML.replace( /\s/g, "").split(/\(|\)/g)[1] !== lang.bpi_off );
}

function getPortSelectValue( index )
{
	var protocol = ruleWindow(document).document.getElementsByName("protocol")[index].innerHTML.toLowerCase().replace(/[^a-z]/g, "");
	if( protocol === "wwwhttp" )
		return "www";
	else if(protocol === "msstreaming")
		return "ms";
	return "manual";
}

function getProtocolValue( index )
{
	var protocol = ruleWindow(document).document.getElementsByName("protocol")[index].innerHTML.replace(/<.*>|\[.*\]|[^A-Z]/g, "").toLowerCase() || "all";
	if( protocol === "wwwhttp" )
		return "tcpudp";
	else if(protocol === "mss")
		return "all";
	return protocol;
}

function getPortFromValue( index )
{
	var protocol = getPortSelectValue( index );
	if( ( protocol ) === "ms" )
		return 1775;
	else if( protocol === "www" )
		return 80;
	return ruleWindow(document).document.getElementsByName("protocol")[index].innerHTML.replace(/[^0-9|-]/g, "").split("-")[0] || "";
}

function getPortToValue( index )
{
	var protocol = getPortSelectValue( index );
	if( ( protocol ) === "ms" )
		return "";
	else if( protocol === "www" )
		return "";
	return ruleWindow(document).document.getElementsByName("protocol")[index].innerHTML.replace(/[^0-9|-]/g, "").split("-")[1] || "";
}

function getWanIfValue( index )
{
	if( index == null)
		return 1;
	var innerHTML = ruleWindow(document).document.getElementsByName("ip_address")[index].innerHTML
	return Number(innerHTML.match(/.*\[.*([0-9]+)\].*/) && innerHTML.match(/.*\[.*([0-9]+)\].*/)[1] || "1");
}

function loadInputValue( index, nocheck )
{
	var iptypeType;

	if(!nocheck && parent.window.hasChanged())
	{
		document.getElementsByName("trafficconf_qos_list_status")[0].contentWindow.
			location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_qos_list_status&index=" + index;
		return;
	}

	clickQosRule( index );
	parent.document.rule_fm.apply_btn.style.display = "none";
	parent.document.rule_fm.modify_btn.style.display = "";
	EnableObj(parent.document.rule_fm.new_rule_btn)
	DisableObj(parent.document.rule_fm.modify_btn)
	DisableObj(parent.document.rule_fm.cancel_btn)

	parent.document.rule_fm.property.value = parent.getPropertyValue( index );
	parent.document.rule_fm.dn.value = parent.getDownloadValue( index );
	parent.document.rule_fm.up.value = parent.getUploadValue( index );
	parent.document.rule_fm.priority.value = parent.getPriorityValue(index);
	parent.document.rule_fm.iptype.value = parent.getIptypeValue( index );
	parent.document.rule_fm.ip4.value = parent.getIp4Address( index );
	parent.document.rule_fm.ip5.value = parent.getIp5Address( index );
	parent.document.rule_fm.bpichk.checked = parent.getBpiChkValue( index );
	parent.document.rule_fm.port_select.value = parent.getPortSelectValue( index );
	parent.document.rule_fm.protocol.value = parent.getProtocolValue( index );
	parent.document.rule_fm.portfrom.value = parent.getPortFromValue( index );
	parent.document.rule_fm.portto.value = parent.getPortToValue( index );
	if(parent.document.rule_fm.wan_idx)
		parent.document.rule_fm.wan_idx.value = parent.getWanIfValue( index );

	changedIptype( parent.document );
	changedPortSelect( parent.document );
}

function getSelectedTrIndex( doc )
{
	var length = ruleWindow(doc).document.getElementsByName("ip_address").length,
		trList = ruleWindow(doc).document.getElementsByTagName("Tr"), 
		target = ruleWindow(doc).document.getElementsByClassName("selected")[0];
	for(var i = 0; i < length; ++i)
		if(trList[i] === target)
			return i;
	return null;
}

function changedProperty( doc )
{
	doc.rule_fm.priority.value = getMaximumPriority( doc );
}

function changedIptype( doc )
{
	var state = doc.rule_fm.iptype.value;
	if( state === "range" )
	{
		doc.getElementById("ip_tilde").style.display = "";
		doc.rule_fm.ip5.style.display = "";
		doc.rule_fm.bpichk.style.display = "";
		doc.getElementById("bpi_text").style.display = "";
	}
	else
	{
		doc.getElementById("ip_tilde").style.display = "none";
		doc.rule_fm.ip5.style.display = "none";
		doc.rule_fm.bpichk.style.display = "none";
		doc.getElementById("bpi_text").style.display = "none";
	}

	if( state.indexOf("twinip") >= 0 )
	{
		DisableObj(doc.rule_fm.ip4);
		if(doc.rule_fm.wan_idx)
		{
			DisableObj(doc.rule_fm.wan_idx);
			doc.rule_fm.wan_idx.value = doc.rule_fm.iptype.value.replace(/[^0-9]+/g, "")
			doc.rule_fm.wan_idx.style.backgroundColor = "#EEE";
		}
	}
	else if( state === "all" )
	{
		DisableObj(doc.rule_fm.ip4);
		if(doc.rule_fm.wan_idx)
		{
			EnableObj(doc.rule_fm.wan_idx);
			doc.rule_fm.wan_idx.style.backgroundColor = "";
		}
	}
	else
	{
		EnableObj(doc.rule_fm.ip4);
		if(doc.rule_fm.wan_idx)
		{
			EnableObj(doc.rule_fm.wan_idx);
			doc.rule_fm.wan_idx.style.backgroundColor = "";
		}
	}
}

function changedPortSelect( doc )
{
	var state = doc.rule_fm.port_select.value;
	if( state === "www" )
	{
		doc.rule_fm.protocol.value = "tcp";
		doc.rule_fm.portfrom.value = 80;
		doc.rule_fm.portto.value = "";
		DisableObj(doc.rule_fm.protocol);
		DisableObj(doc.rule_fm.portfrom);
		DisableObj(doc.rule_fm.portto);
		doc.rule_fm.protocol.style.backgroundColor = "#EEE";
		doc.rule_fm.portfrom.style.backgroundColor = "#EEE";
		doc.rule_fm.portto.style.backgroundColor = "#EEE";
	}
	else if( state === "ms" )
	{
		doc.rule_fm.protocol.value = "udp";
		doc.rule_fm.portfrom.value = 1775;
		doc.rule_fm.portto.value = "";
		DisableObj(doc.rule_fm.protocol);
		DisableObj(doc.rule_fm.portfrom);
		DisableObj(doc.rule_fm.portto);
		doc.rule_fm.protocol.style.backgroundColor = "#EEE";
		doc.rule_fm.portfrom.style.backgroundColor = "#EEE";
		doc.rule_fm.portto.style.backgroundColor = "#EEE";
	}
	else
	{
		EnableObj(doc.rule_fm.protocol);
		EnableObj(doc.rule_fm.portfrom);
		EnableObj(doc.rule_fm.portto);
		doc.rule_fm.protocol.style.backgroundColor = "";
	}
	changedProtocol( doc );
}

function changedProtocol( doc )
{
	var state = doc.rule_fm.protocol.value;
	if( state === "all" )
	{
		DisableObj(doc.rule_fm.portfrom);
		doc.rule_fm.portfrom.style.backgroundColor = "#EEE";
		DisableObj(doc.rule_fm.portto);
		doc.rule_fm.portto.style.backgroundColor = "#EEE";
	}
	else if( doc.rule_fm.port_select.value == "manual" )
	{
		EnableObj(doc.rule_fm.portfrom);
		doc.rule_fm.portfrom.style.backgroundColor = "";
		EnableObj(doc.rule_fm.portto);
		doc.rule_fm.portto.style.backgroundColor = "";
	}
}

function clickNewRuleButton()
{
	ruleWindow(document).document.getElementsByName("trafficconf_qos_list_status")[0].contentWindow.
		location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_qos_list_status";
}

function hasChanged()
{
	var tr = ruleWindow(document).getSelectedTr();
	if( !tr )
		return false;

	if( tr.id === "add_rule_tr" )
	{
		if( document.rule_fm.property.value != 2 )
			return true;
		else if( document.rule_fm.priority.value != getMaximumPriority(document) )
			return true;
		else if( document.rule_fm.dn.value != "" )
			return true;
		else if( document.rule_fm.up.value != "" )
			return true;
		else if( document.rule_fm.iptype.value != "single" )
			return true;
		else if( document.rule_fm.ip4.value != "" )
			return true;
		else if( document.rule_fm.ip5.value != "" )
			return true;
		else if( document.rule_fm.bpichk.checked == true )
			return true;
		else if( document.rule_fm.port_select.value != "manual" )
			return true;
		else if( document.rule_fm.protocol.value != "all" )
			return true;
		else if( document.rule_fm.portfrom.value != "" )
			return true;
		else if( document.rule_fm.portto.value  != "" )
			return true;
		else if( document.rule_fm.wan_idx && document.rule_fm.wan_idx.value != "1")
			return true;
		return false;
	}

	var trIndex = ruleWindow(document).getTrIndex( tr );
	if(document.rule_fm.property.value.replace(/\s/g, "") != getPropertyValue( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.dn.value.replace(/\s/g, "") != getDownloadValue( trIndex ))
		return true;
	else if(document.rule_fm.up.value.replace(/\s/g, "") != getUploadValue( trIndex ))
		return true;
	else if(document.rule_fm.priority.value.replace(/\s/g, "") != getPriorityValue( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.iptype.value.replace(/\s/g, "") != getIptypeValue( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.ip4.value.replace(/\s/g, "") != getIp4Address( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.ip5.value.replace(/\s/g, "") != getIp5Address( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.bpichk.checked != getBpiChkValue( trIndex ))
		return true;
	else if(document.rule_fm.port_select.value.replace(/\s/g, "") != getPortSelectValue( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.protocol.value.replace(/\s/g, "") != getProtocolValue( trIndex ).replace(/\s/g, ""))
		return true;
	else if(document.rule_fm.portfrom.value.replace(/\s/g, "") != getPortFromValue( trIndex ))
		return true;
	else if(document.rule_fm.portto.value.replace(/\s/g, "") != getPortToValue( trIndex ))
		return true;
	else if( document.rule_fm.wan_idx && document.rule_fm.wan_idx.value != getWanIfValue( trIndex ))
		return true;
	return false;
}

function clickCancelButton()
{
	
	if( ruleWindow(document).getSelectedTr().id === "add_rule_tr" )
	{
		clickNewRuleButton();
		return;
	}
	var tr = ruleWindow(document).getSelectedTr();
		
	ruleWindow(document).loadInputValue( ruleWindow(document).getTrIndex( tr ));
}

function menuWindow( mainDoc )
{
	return mainDoc.getElementsByName("trafficconf_qos_menu")[0].contentWindow;
}

function ruleWindow( mainDoc )
{
	return mainDoc.getElementsByName("trafficconf_qos_list")[0].contentWindow;
}

function movePriorityUp( )
{
	var tr = ruleWindow(document).getSelectedTr();
	if( !tr )
		return;

	var priority = document.rule_fm.priority.value - 1;
	if( priority <= 0 )
	{
		document.rule_fm.priority.value = 1;
		return;
	}
	var prevTr = ruleWindow(document).document.getElementsByTagName("tr")[priority - 1];
	if( !prevTr)
		return;
	var thisProperty;
	if( tr.id === "add_rule_tr" )
		thisProperty = Number(document.rule_fm.property.value);
	else
		thisProperty = getPropertyValue( ruleWindow(document).getTrIndex( tr ) );
	var upperProperty = getPropertyValue( ruleWindow(document).getTrIndex( prevTr ) );
	if( thisProperty < upperProperty )
		return;

	document.rule_fm.priority.value = priority;

	if( tr.id !== "add_rule_tr" )
		tr.parentNode.insertBefore(tr, prevTr);

	checkChanges();
}

function movePriorityDown()
{
	var tr = ruleWindow(document).getSelectedTr();
	if( !tr )
		return;
	var ruleSize = ruleWindow(document).document.getElementsByName("index").length;
	var priority = Number(document.rule_fm.priority.value) + 1;
	if( ( tr.id === "add_rule_tr" && priority > ruleSize + 1 ) || ( tr.id !== "add_rule_tr" && priority > ruleSize ) )
	{
		document.rule_fm.priority.value = ruleSize;
		return;
	}
	var nextTr = ruleWindow(document).document.getElementsByTagName("tr")[priority - 1];
	if( !nextTr )
		return;
	var thisProperty;
	if( tr.id === "add_rule_tr" )
		thisProperty = Number(document.rule_fm.property.value);
	else
		thisProperty = getPropertyValue( ruleWindow(document).getTrIndex( tr ) );
	var upperProperty = getPropertyValue( ruleWindow(document).getTrIndex( nextTr ) );
	if( thisProperty > upperProperty )
		return;

	document.rule_fm.priority.value = priority;

	if( tr.id !== "add_rule_tr")
		tr.parentNode.insertBefore(nextTr, tr);

	checkChanges();
}

function checkChanges()
{
	if(hasChanged())
	{
		EnableObj(document.rule_fm.modify_btn);
		EnableObj(document.getElementsByName("cancel_btn")[0]);
	}
	else
	{
		DisableObj(document.getElementsByName("modify_btn")[0]);
		DisableObj(document.getElementsByName("cancel_btn")[0]);
	}
}

function setServiceRate(F, down, up)
{
	F.dn.value = down;
	F.up.value = up;
}

function selectService(wanIdx)
{
        var F = document["bandwidth_fm" + wanIdx];

	switch (F.svc.value)
	{
	case 'xdsl' :
		setServiceRate(F, '20', '20');
		break;
	case 'optical' :
		setServiceRate(F, '100', '100');
		break;
	case 'liteoptical' :
		setServiceRate(F, '500', '500');
		break;
	case 'gigaoptical' :
		setServiceRate(F, '1000', '1000');
		break;
	default :
		setServiceRate(F, '', '');
	}
}

function onoffSubmit(seconds)
{
	var F2 = document.getElementsByName("trafficconf_qos_setup")[0].contentWindow.document.qos_onoff_fm;
	for(var i = 0; i < document.onoff_fm.run.length; ++i)
		if(document.onoff_fm.run[i].checked )
			F2.run.value = document.onoff_fm.run[i].value;

        if(F2.reboot && F2.reboot.value === "true")
        {
                if(confirm(MSG_QOS_REBOOT))
			maskRebootMsg(seconds);
                else
                        return;
        }
        else
		MaskIt(document, 'apply_mask');
	F2.submit();
}

function bandwidthSubmit(wanIdx, seconds)
{
	var F = document["bandwidth_fm" + wanIdx],
		F2 = document.getElementsByName("trafficconf_qos_setup")[0].contentWindow.document["qos_wan" + wanIdx + "_bandwidth_fm"];

	if( isNaN(F.dn.value) || F.dn.value <= 0 )
	{
		alert(QOS_USERRULE_WARNING_BANDWIDTH_SPEED);
		F.dn.focus();
		F.dn.select();
		return;
	}
	if( isNaN(F.up.value) || F.up.value <= 0 )
	{
		alert(QOS_USERRULE_WARNING_BANDWIDTH_SPEED);
		F.up.focus();
		F.up.select();
		return;
	}

	if( getRuleSize() > 0 && !confirm(QOS_SMARTQOS_WARNING_USERRULE_DELETE))
		return;

	F2.svc.value = F.svc.value;
	F2.dn.value = (F.dn.value * 1024).toFixed(0);
	F2.up.value = (F.up.value * 1024).toFixed(0);

        if(F2._reboot && F2._reboot.value === "true")
        {
                if(confirm(MSG_QOS_REBOOT))
			maskRebootMsg(seconds);
                else
                        return;
        }
        else
		MaskIt(document, 'apply_mask');
	F2.submit();
}

function smartqosSubmit()
{
	var F2 = document.getElementsByName("trafficconf_qos_setup")[0].contentWindow.document.qos_smartqos_fm;
	for(var i = 0; i < document.smartqos_fm.run.length; ++i)
	{
		if(document.smartqos_fm.run[i].checked)
		{
			F2.run.value = document.smartqos_fm.run[i].value;
		}
	}

	var info = {}, wanIdx = 0;
	while(get_internet_speed(menuWindow(document).document, info, ++wanIdx))
	{
		if(info.speed === 0)
		{
			alert(QOS_USERRULE_WARNING_NEED_BANDWIDTH);
			return true;
		}
	}

	if( getRuleSize() > 0 && F2.run.value == 1 && !confirm(QOS_SMARTQOS_WARNING_USERRULE_DELETE))
		return;

	MaskIt(document, 'apply_mask');
	F2.submit();
}

function deleteUserRule()
{
	var F = ruleWindow(document).document.rule_list_fm;
	var F2 = ruleWindow(document).document.getElementsByName('trafficconf_qos_list_status')[0].contentWindow.document.rule_list_fm;

        if (!F.del || !confirm(MSG_DELETE_RULE_CONFIRM))
		return;

	if(F.del.length)
	{
		for (i=0; i < F.del.length; ++i)
		{
			F2.del[i].checked = F.del[i].checked;
			F2.del[i].value = F.del[i].value;
		}
	}
	else
	{
		F2.del.checked = F.del.checked;
		F2.del.value = F.del.value;
	}

	MaskIt(document, 'apply_mask');
	F2.submit();
}

function ruleSubmit( act )
{
	function isEnabledIp()
	{
		return (F.iptype.value.indexOf("twinip") < 0 && F.iptype.value !== "all");
	}
	var log = 0;
	var F = document.rule_fm,
		F2 = document.getElementsByName("trafficconf_qos_setup")[0].contentWindow.document.qos_rule_fm;

	if(hasError(F, act))
		return;

	var ruleSize = getRuleSize();
	if( F.priority.value === "" )
		F.priority.value = getMaximumPriority( document );
	else if( F.priority.value < 1 )
		F.priority.value = 1;
	else if( F.priority.value > ruleSize + 1) 
		F.priority.value = ruleSize + 1;
	if( F.priority.value < getMinimumPriority( document ) )
	{
		if(!confirm(QOS_USERRULE_WARNING_PRIORITY_ORDER))
			return;
		F.priority.value = getMinimumPriority( document );
	}
	if( F.priority.value > getMaximumPriority( document ) )
	{
		if(!confirm(QOS_USERRULE_WARNING_PRIORITY_ORDER))
			return;
		F.priority.value = getMaximumPriority( document );
	}
	F2.priority.value = 	F.priority.value;

	F2.act.value =	 	act;
	F2.property.value = 	F.property.value;
	F2.dn.value = 		(F.dn.value * 1024).toFixed(0);
	if( F2.dn.value <= 0 )
		F2.dn.value = 0;
	else if( F2.dn.value < 32 )
		F2.dn.value = 32;
	F2.up.value = 		(F.up.value * 1024).toFixed(0);
	if( F2.up.value <= 0 )
		F2.up.value = 0;
	else if( F2.up.value < 32 )
		F2.up.value = 32;
	F2.iptype.value = 	(F.iptype.value.indexOf( "twinip") < 0)? 0 : (F.iptype.value.match(/[0-9]/) && F.iptype.value.match(/[0-9]/)[0]) || 1;
	F2.sip1.value = 	F.ip1.value;
	F2.sip2.value = 	F.ip2.value;
	F2.sip3.value = 	F.ip3.value;
	if(isEnabledIp())
		F2.sip4.value = F.ip4.value;
	else
		F2.sip4.value = "";
	F2.eip1.value = 	F.ip1.value;
	F2.eip2.value = 	F.ip2.value;
	F2.eip3.value = 	F.ip3.value;
	if(isEnabledIp())
		F2.eip4.value = F.ip5.value;
	else
		F2.eip4.value = "";
	F2.bpichk.value = 	F.bpichk.checked;
	F2.protocol.value = 	F.protocol.value;
	F2.portfrom.value = 	F.portfrom.value;
	F2.portto.value = 	F.portto.value;
	if(F.wan_idx)
	F2.wan_idx.value = 	F.wan_idx.value;

	var trIndex = ruleWindow(document).getTrIndex(ruleWindow(document).getSelectedTr());

	if(act === "modify")
	{
		if(ruleWindow(document).document.rule_list_fm.del.length)
			F2.del.value = ruleWindow(document).document.rule_list_fm.del[trIndex].value;
		else
			F2.del.value = ruleWindow(document).document.rule_list_fm.del.value;
	}
	MaskIt(document, 'apply_mask');
	F2.submit();
}

function getRuleSize()
{
	return ruleWindow(document).document.getElementsByName("index").length;
}

function getPropertyAt( index )
{
	var property = ruleWindow(document).document.getElementsByName("property")[index];
	if(!property)
		return 0;

	if( lang.sharing_bounded.replace(/\s/g, "") === property.innerHTML.replace(/\s|\(.*\)/g, "") )
		return 2;
	return 3;
}

function getMinimumPriority( doc )
{
	var priority = doc.rule_fm.priority.value;
	var property = doc.rule_fm.property.value;
	
	if(property == 3)
		return 1;

	var ruleSize = getRuleSize();
	for(var i = 0; i < ruleSize; ++i)
	{
		if( getPropertyAt( i ) <= property )
			return i + 1;
	}
	return ruleSize + 1;
}

function getMaximumPriority( doc )
{
	var priority = doc.rule_fm.priority.value;
	var property = doc.rule_fm.property.value;
	
	var ruleSize = ruleWindow(doc).document.getElementsByName("index").length;
	if(property == 2)
		return ruleSize + 1;

	for(var i = 0; i < ruleSize; ++i)
	{
		if( getPropertyAt( i ) < property )
			return i + 1;
	}
	return ruleSize + 1;
}

function hasError(F, act)
{
	function hasErrorAtBpiRange()
	{
		var count;
		if (F.bpichk.checked)
		{
			count = parseInt(F.ip5.value) - parseInt(F.ip4.value) + 1;
			if ((count > 31) || (count < 2))
				return true;
		}
		return false;
	}
	function hasErrorAtIP()
	{
		var obj;
		if ( F.iptype.value.indexOf("twinip") >= 0 || F.iptype.value === "all" )
			return false;
		if (obj=CheckIP('ip') )
		{
			alert(MSG_INVALID_IP);
			obj.focus();
			obj.select();
			return true;
		}
		if (obj=CheckIPNetwork('ip'))
		{
			alert(MSG_INVALID_IP);
			obj.focus();
			obj.select();
			return true;
		}
		if( F.iptype.value === "range" )
		{
			if( F.ip5.value === "" || !(Number(F.ip5.value) > 0 && Number(F.ip5.value) < 255 && Number(F.ip4.value) < Number(F.ip5.value)) )
			{
				alert(MSG_INVALID_IP);
				F.ip5.focus();
				F.ip5.select();
				return true;
			}
			if (hasErrorAtBpiRange())
			{
				alert(QOS_BPI_RANGE);
				F.ip5.focus();
				F.ip5.select();
				return true;
			}
		}
		return false;
	}
	function hasErrorAtPort()
	{
		if( F.protocol.value === "all" )
		{
/*
			if( F.portfrom.value !== '' || F.portto.value !== '' )
			{
				alert(QOS_PROTOCOL_SELECT);
				F.protocol.focus();
				return true;
			}
*/
		}
		else
		{
			if( F.portfrom.value === '' )
			{
				alert(QOS_PORT_PORTRANGE);
				F.portfrom.focus();
				F.portfrom.select();
				return true;
			}
		}
		if( F.portfrom.value !== "" )
		{
			if( F.portfrom.value <= 0 || F.portfrom.value > 65535 )
			{
				alert(QOS_PORT_PORTRANGE);
				F.portfrom.focus();
				F.portfrom.select();
				return true;
			}
		}
		if( F.portto.value !== "" )
		{
			if( F.portto.value <= 0 || F.portto.value > 65535 )
			{
				alert(QOS_PORT_PORTRANGE);
				F.portto.focus();
				F.portto.select();
				return true;
			}
			if( !(Number(F.portfrom.value) > 0) || !(Number(F.portfrom.value) < Number(F.portto.value)) )
			{
				alert(QOS_PORT_INVALID_EXT_PORT_RANGE);
				F.portto.focus();
				F.portto.select();
				return true;
			}
		}
		return false;
	}
	function hasErrorAtSpeed()
	{
		var info = {}, wan_idx = (F.wan_idx && F.wan_idx.value) || 1;
		
		if( get_wan_internet_speed(menuWindow(document).document, Number(wan_idx)) === 0)
		{
			alert(QOS_USERRULE_WARNING_NEED_BANDWIDTH);
			F.dn.focus();
			return true;
		}
		if( F.dn.value=='0' && F.up.value=='0' )
		{
			alert(QOS_BADNWIDTH_EMPTY);
			F.dn.focus();
			return true;
		}

		var td_index = 2 + Number(wan_idx) * 3;
		var maxSpeed = menuWindow(document).document.getElementsByTagName("TD")[td_index].innerHTML.replace(/[^0-9| ]/g, "").split(" ");
		var speed = [ Number(F.dn.value), Number(F.up.value) ];
		if( F.property.value == 2 )
		{
			if( speed[0] > Number(maxSpeed[0]) || speed[1] > Number(maxSpeed[1]) )
			{
				alert(QOS_COMMON_EXCCED_MAX_SPEED);
				F.dn.focus();
				return true;
			}
		}
		else if( F.property.value == 3 )
		{
			var selectedIndex = ruleWindow(document).getTrIndex(ruleWindow(document).getSelectedTr());
			speed[0] += getSumofDownloadSpeed(lang.sharing_borrow, selectedIndex);
			speed[1] += getSumofUploadSpeed(lang.sharing_borrow, selectedIndex);
			if( speed[0] > Number(maxSpeed[0]) || speed[1] > Number(maxSpeed[1]) )
			{
				alert(QOS_COMMON_ISOLATED_EXCEED);
				F.dn.focus();
				return true;
			}
		}
		return false;
	}

	if( hasErrorAtIP() || hasErrorAtPort() || hasErrorAtSpeed() )
		return true;

	return false;
}

function getSumofDownloadSpeed( property, except )
{
	var sum = 0, length = ruleWindow(document).document.getElementsByName("download").length;
	for( var i = 0; i < length; ++i )
	{
		if(typeof except === "number" && except === i)
			continue;
		if( document.rule_fm.wan_idx && getWanIfValue(i) != document.rule_fm.wan_idx.value )
			continue;
		if( property && ruleWindow(document).document.getElementsByName("property")[i].innerHTML.indexOf(property) < 0 )
			continue;

		sum += Number(ruleWindow(document).document.getElementsByName("download")[i].innerHTML.replace(/[^0-9]/g, ""));
	}
	return sum;
}

function getSumofUploadSpeed( property, except )
{
	var sum = 0, length = ruleWindow(document).document.getElementsByName("upload").length;
	for( var i = 0; i < length; ++i )
	{
		if(typeof except === "number" && except === i)
			continue;
		if( document.rule_fm.wan_idx && getWanIfValue(i) != document.rule_fm.wan_idx.value )
			continue;
		if( property && ruleWindow(document).document.getElementsByName("property")[i].innerHTML.indexOf(property) < 0 )
			continue;

		sum += Number(ruleWindow(document).document.getElementsByName("upload")[i].innerHTML.replace(/[^0-9]/g, ""));
	}
	return sum;
}

function maskRebootMsg( seconds )
{
        function refresh( seconds )
        {
                if( seconds < 0 )
                {
                        document.getElementById('reboot_seconds').innerHTML = "";
                        location.reload();
                        return;
                }
                document.getElementById('reboot_seconds').innerHTML = MSG_REBOOT_SECONDS_REMAINS1 + seconds + MSG_REBOOT_SECONDS_REMAINS2;
                setTimeout(function() {
                        refresh( --seconds );
                }, 1000);
        }

        MaskIt(document, 'reboot_mask');
        refresh( seconds );
}

</script>
