<script>

function CheckIPTVForm()
{
        var F = document.iptv_fm;

        if(!F.mc_run || !F.mcgroup_bt )
		return;

	if (GetRadioValue(F.mc_run) == 0 || GetRadioValue(F.mc_run) == 1)
		DisableListButton(F.mcgroup_bt);
	else
		EnableListButton(F.mcgroup_bt);
}

function EnableListButton( button )
{
	if(!button)
		return;

	EnableObj(button);
	button.style.color = "";
}

function DisableListButton( button )
{
	if(!button)
		return;

	DisableObj(button);
	button.style.color = "gray";
}

function setIPTV( rebootSeconds, alwaysReboot )
{
	var F = document.iptv_fm,
		F2 = document.getElementsByName("expertconf_iptv_setup_status")[0].contentWindow.document.iptv_fm;

	if (alwaysReboot || F.cur_op.value == 1 || GetRadioValue(F.mc_run) == 1)
	{
		if(!confirm(MSG_IGMP_REBOOT))
			return;
		maskRebootMsg( rebootSeconds );
	}
	else
	{
		MaskIt(document, "apply_mask");
	}
	if(F.mc_run.value == 2)
		EnableListButton(document.getElementsByName('mcgroup_bt')[0]);
	else
		DisableListButton(document.getElementsByName('mcgroup_bt')[0]);

	
	for(var i = 0; i < F.mc_run.length; ++i)
		if(F.mc_run[i].checked)
			F2.mc_run.value = F.mc_run[i].value;
	F2.act.value = 'mc';
	F2.submit();
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

function showGroupList()
{
	MaskIt(document, "macgroup_list");

	document.getElementsByName("experconf_iptv_macgroup")[0].contentWindow.document.getElementsByName("experconf_iptv_macgroup_status")[0].contentWindow.
		location.href = "timepro.cgi?tmenu=iframe&smenu=experconf_iptv_macgroup_status&act=print";
}

function hideGroupList()
{
	UnMaskIt(document, "macgroup_list");

	document.getElementsByName("experconf_iptv_macgroup")[0].contentWindow.location.reload();
}

</script>
