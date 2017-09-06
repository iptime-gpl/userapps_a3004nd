<script>

function ApplyLinkSetup(port)
{
        var F=document.linksetup_fm;
        F.act.value = "setport";
        F.port.value = port;
        F.submit();
}

function ClearLinkStat()
{
        var F=document.linkstat_fm;
        F.act.value = "clear";
        F.submit();
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
