<script>
function copyInputValue()
{
	var list = document.getElementsByTagName("select"), 
		submitDoc = document.getElementsByName('trafficconf_linksetup_linksetup_status')[0].contentWindow.document;
	for( var i = 0; i < list.length; ++i )
		submitDoc.getElementsByName(list[i].name)[0].value = list[i].value;
}

function ApplyLinkSetup(port)
{
	var F = document.linksetup_fm, F2 = document.getElementsByName('trafficconf_linksetup_linksetup_status')[0].contentWindow.document.linksetup_fm;

	copyInputValue();

	MaskIt(parent.document, "apply_mask");

	F2.act.value = "setport";
	F2.port.value = port;
	F2.submit();
}

function ClearLinkStat()
{
	var F = document.getElementsByName('trafficconf_linksetup_linkstat_clear')[0].contentWindow.document.linkstat_fm;

	MaskIt(document, "apply_mask");

	F.act.value = "clear"; 

	F.submit();
}

function refreshLinkStatus( mainDoc )
{
	var linkstatusFrame = mainDoc.getElementsByName('trafficconf_linksetup_linkstatus')[0]
	if(!linkstatusFrame)
		return;
	var statusFrame = linkstatusFrame.contentWindow.document.getElementsByName('trafficconf_linksetup_linkstatus_status')[0];
	if(!statusFrame)
		return;
	statusFrame.contentWindow.location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_linksetup_linkstatus_status";
}

function refreshLinkStat( mainDoc )
{
	var linkstatFrame = mainDoc.getElementsByName('trafficconf_linksetup_linkstat')[0];
	if(!linkstatFrame)
		return;
	var statusFrame = linkstatFrame.contentWindow.document.getElementsByName('trafficconf_linksetup_linkstat_status')[0];
	if(!statusFrame)
		return;
	statusFrame.contentWindow.location.href = "timepro.cgi?tmenu=iframe&smenu=trafficconf_linksetup_linkstat_status";
}

function SelectLinkMode(port)
{
	var obj = document.getElementsByName('mode'+port);

	if(!obj[0])
		return;

	if(obj[0].value == 'auto')
	{
		DisableObjNames('speed' + port); 
		document.getElementsByName('speed' + port)[0].style.backgroundColor = "#EEE"
		DisableObjNames('duplex'+port); 
		document.getElementsByName('duplex' + port)[0].style.backgroundColor = "#EEE"
	}
	else
	{
		EnableObjNames('speed'+port);
		document.getElementsByName('speed' + port)[0].style.backgroundColor = ""

		var obj = document.getElementsByName('speed'+port);
		if(obj && obj[0])
		{
			var val=GetValue(obj[0]);
			if(val == '1000')
			{
				DisableObjNames('duplex'+port);
				document.getElementsByName('duplex' + port)[0].style.backgroundColor = "#EEE"
			}
			else
			{
				EnableObjNames('duplex'+port); 
				document.getElementsByName('duplex' + port)[0].style.backgroundColor = ""
			}
		}
	}
}

</script>
