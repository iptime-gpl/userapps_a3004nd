<script>

function StartFirmUp()
{
	var F2= document.getElementsByName('sysconf_swupgrade_online_status')[0].contentWindow.document.firmup_fm;

	if(!confirm(SYSCONF_ONLINE_UPGRADE_CONFIRM))
		return;

	F2.act.value = 'update';	
	F2.submit();
}

function CancelFirmUp()
{
	var F2= document.getElementsByName('sysconf_swupgrade_online_status')[0].contentWindow.document.firmup_fm;

	F2.act.value = 'cancel';	
	F2.submit();
}

function FirmUpView()
{
	var F=document.view_fm;
	
	if(GetRadioValue(F.firmup) == 'online')
	{
		ShowIt('online');
		HideIt('auto');
		HideIt('manual');
	}
	else if(GetRadioValue(F.firmup) == 'auto')
	{
		HideIt('online');
		ShowIt('auto');
		HideIt('manual');

	}
	else
	{
		HideIt('online');
		HideIt('auto');
		ShowIt('manual');
		document.getElementById("firmup_manual").checked = true;
	}
}

function PrintRemainTime(id, time)
{
        var obj = document.getElementById(id);
        if(!obj)
		return;
	obj.innerHTML = time;

        if(time--)
		setTimeout(function () { PrintRemainTime(id, time); }, 1000);
        else
        {
		alert(FIRMUP_DONE_TXT);
                top.location.reload();
        }
}


function PrintDot(id,count,max)
{
        var obj = parent.document.getElementById(id);;
	if(!obj)
		return;

	if(--count)
		obj.innerHTML += '.';
	else
	{
		obj.innerHTML = '.';
		count = max;
	}

	setTimeout(function() { PrintDot(id, count, max); }, 500);
}

function EnableUpgradeObjects()
{
	var i;
	var iframe = parent.document.getElementsByName("sysconf_swupgrade_manual_file_form");
	iframe[0].style.display = "";
	iframe[1].style.display = "none";

	parent.document.getElementById('manual_status_table').style.display = "";
	parent.document.getElementById('manual_upload_table').style.display = "none";

	var radioButton = parent.document.getElementsByName("firmup");
	for( i = 0; i < radioButton.length; ++i)
		radioButton[i].disabled = false;
	var labelList = parent.document.getElementsByTagName("label");
	for( i = 0; i < labelList.length; ++i)
		labelList[i].style.color = "";
}

function DisableUpgradeObjects()
{
	var i;
	var iframe = parent.document.getElementsByName("sysconf_swupgrade_manual_file_form");
	iframe[0].style.display = "none";
	iframe[1].style.display = "";

	parent.document.getElementById('manual_status_table').style.display = "none";
	parent.document.getElementById('manual_upload_table').style.display = "";

	var radioButton = parent.document.getElementsByName("firmup");
	for( i = 0; i < radioButton.length; ++i)
		radioButton[i].disabled = true;
	var labelList = parent.document.getElementsByTagName("label");
	for( i = 0; i < labelList.length; ++i)
		labelList[i].style.color = "gray";
}

function firmwareSubmit()
{
	DisableUpgradeObjects();

	var F2 = document.image_upload;

	F2.act.value = "upgrade";
	F2.submit();
}

function onChangeForm( obj, maxSize )
{
	if(obj.value === "")
	{
		DisableObj(document.getElementsByName("upload_submit")[0]);
		document.getElementsByName("upload_submit")[0].style.color = "gray";
	}
	else
	{
		EnableObj(document.getElementsByName("upload_submit")[0]);
		document.getElementsByName("upload_submit")[0].style.color = "";

		if(obj.files && obj.files[0] && obj.files[0].size > maxSize )
		{
			alert(MSG_INVALID_FILE_STR);
			obj.value = "";
		}
	}
}

</script>
