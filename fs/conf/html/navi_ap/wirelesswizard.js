
<script>

// wireless config wizard
function APModeGotoPage(step)
{
        var F = document.wizard;

        if(step == 4)
        {
                if(F.ssid.value == '')
                {
                        alert(MSG_BLANK_SSID);
                        F.ssid.select();
                        F.ssid.focus();
                        return;
                }
        }
        else if(step == 5)
        {
                if( parent.iframe_scan )
                        F.channel.value = parseInt(parent.iframe_scan.document.channellist_fm.channel_idx.value) + 1;
        }
        else if(step == 7)
        {
                var auth_type;
                auth_type=GetRadioValue(F.auth_type);
                if(auth_type== AUTH_OPEN || auth_type == AUTH_NOCHANGE)
                        step = 9;

        }
        else if(step == 8)
        {
                if(F.auth_type.value== AUTH_NOCHANGE || F.auth_type.value == AUTH_OPEN)
                        step = 6;

        }
        else if(step == 9)
        {
                if((F.encrypt_type.value == ENCRYPT_TKIP) || (F.encrypt_type.value == ENCRYPT_AES))
                {
                        if( F.key.value.length < 8 )
                        {
                                alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
                                F.key.select();
                                F.key.focus();
                                return;
                        }
                }
                else if(F.encrypt_type.value == ENCRYPT_64)
                {
                        if( F.key.value.length != 5 )
                        {
                                alert(MSG_INVALID_5_KEY_LENGTH);
                                F.key.select();
                                F.key.focus();
                                return;
                        }
                }
                else if(F.encrypt_type.value == ENCRYPT_128)
                {
                        if( F.key.value.length != 13 )
                        {
                                alert(MSG_INVALID_13_KEY_LENGTH);
                                F.key.select();
                                F.key.focus();
                                return;
                        }
                }

                if( F.encrypt_type.value != ENCRYPT_OFF)
                {
                        if( F.key.value != F.confirm_key.value )
                        {
                                alert(MSG_INVALID_WPAPSK_KEY_MISMATCH);
                                F.key.select();
                                F.key.focus();
                                return;
                        }
                }
        }
        else if(step == 'save')
        {
                F.commit.value = 'manual_wireless_wizard';
		if(F.modechange.value == 1)
                	F.nextstep.value = 'reboot';
		else
		       	F.nextstep.value = 'finish';
        }

        F.step.value = step;
        F.submit();
}

function ClientModeGotoPage(step)
{
	var F = document.wizard;

	if(step == 5)
	{
		var enc = F.encrypt_type.value;
		if((enc == ENCRYPT_TKIP) || (enc == ENCRYPT_AES))
		{
			if( F.key.value.length < 8)
			{
				alert(MSG_INVALID_WPAPSK_KEY_LENGTH);
				F.key.focus();
				F.key.select();
				return;
			}
		}
		else if((enc == ENCRYPT_64) || (enc == ENCRYPT_128))
		{
			if( !(
				(F.key.value.length == 5) ||
				(F.key.value.length == 10) ||
				(F.key.value.length == 13) ||
				(F.key.value.length == 26) 
			     )
			  )
			{
				alert(MSG_INVALID_WEP_KEY_LENGTH);
				F.key.focus();
				F.key.select();
				return;
			}

			if((F.key.value.length == 10) || (F.key.value.length == 26))	
			{
				if(IsHex(F.key.value))
				{
					alert(F.key.value.length+MSG_INVALID_WEP_KEY_HEXVALUE2);
					F.key.focus();
					F.key.select();
					return;
				}
			}

		}
		parent.document.wizard.apply.value = 1;
	}

	F.step.value = step;
	F.submit();
}

function WirelessWizardGotoPage(step)
{
	var F = document.wizard;

	if(step == 1 || step== 0)
	{
		F.step.value = step;
		F.submit();
		return;
	}

	if(F.wireless_mode.value == WIRELESS_AP_MODE)
		APModeGotoPage(step);
	else
		ClientModeGotoPage(step);

}



function CheckSSIDOverlap()
{
        var F = document.wizard;

        if(F.ssid.value == '')
        {
                alert(MSG_BLANK_SSID);
                F.ssid.select();
                F.ssid.focus();
                return;
        }

        parent.check_ssid.document.check_fm.ssid.value = F.ssid.value;
        parent.check_ssid.document.check_fm.submit();
}



</script>
