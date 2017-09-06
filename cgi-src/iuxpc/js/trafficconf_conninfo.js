<script>

function ClearConntrack(ip)
{
        if(!confirm(TRAFFICCONF_CONNINFO_DELETE_CONN ))
		return;

	MaskIt(parent.document, "apply_mask");

        var F = document.getElementsByName("trafficconf_conninfo_info_submit")[0].contentWindow.document.conninfo_fm;
	F.ip.value	= ip;
	F.act.value	= 'clear';
	F.submit();
}

</script>
