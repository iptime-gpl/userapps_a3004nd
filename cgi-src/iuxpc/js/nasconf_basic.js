<script>

function RemoveUSB(value)
{
        var F2 = parent.document.getElementsByName("nasconf_basic_device_submit")[0].contentWindow.document.usbmgmt_fm;

	MaskIt(parent.document,'apply_mask');

        F2.act.value="remove";
        F2.devname.value=value;
        F2.submit();
}

function MountUSB(value)
{
        var F2 = parent.document.getElementsByName("nasconf_basic_device_submit")[0].contentWindow.document.usbmgmt_fm;

	MaskIt(parent.document,'apply_mask');

        F2.act.value="mount";
        F2.devname.value=value;
        F2.submit();
}

function unmaskLoadingImage( unknownMsg )
{
	var previousStatusMsg = parent.document.getElementsByName("port_status");
	var presentStatusMsg = document.getElementsByName("port_status");

	if( previousStatusMsg.length === 0 || presentStatusMsg.length === 0)
		return;

	if(previousStatusMsg[0].innerHTML !== presentStatusMsg[0].innerHTML && presentStatusMsg[0].innerHTML !== unknownMsg)
		UnMaskIt(parent.parent.document, 'apply_mask');

	setTimeout(function() { UnMaskIt(parent.parent.document, 'apply_mask'); }, 30000);
}

</script>
