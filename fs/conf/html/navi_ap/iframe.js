<script>

function ChangeSearchChannel(F,obj)
{
        var i,chklist, prev_channel;

        chklist = F.channel_chk;
        prev_channel = F.prev_channel.value;

        prev_td_id = "scan_td_"+prev_channel;
        prev_text_id = "scan_text_"+prev_channel;

        cur_td_id = "scan_td_"+obj.value;
        cur_text_id = "scan_text_"+obj.value;

        document.getElementById(prev_td_id).className = document.getElementById('org_td_class_'+prev_channel).value;
        document.getElementById(prev_text_id).className = document.getElementById('org_text_class_'+prev_channel).value;

        document.getElementById(cur_td_id).className = 'slim_selected_td';
        document.getElementById(cur_text_id).className = 'white_text';

        for( i = 0 ; chklist[i]; i++ )
                chklist[i].checked = false;
        if(obj.checked == false)
                obj.checked =true;
        F.prev_channel.value = obj.value;
}

function OnClickAPScan(idx,obj, init_idx)
{
        var i, trobj;
	var apnumObj;

	apnumObj = document.getElementsByName('apnum');

        for( i=0; ; i++)
        {
                trobj = document.getElementById('scan_tr_'+i);
                if(!trobj) break;
                trobj.className = 'big_td';

                textobj = document.getElementById('scan_text_0_'+i);
                if(!textobj) break;
		if( i == init_idx ) textobj.className = 'navy_text';
		else if(apnumObj[i] && apnumObj[i].value == 0 ) textobj.className = 'item_text';
		else textobj.className = 'gray_text';

                textobj = document.getElementById('scan_text_1_'+i);
                if(!textobj) break;
		if( i == init_idx ) textobj.className = 'navy_text';
		else if(apnumObj[i] && apnumObj[i].value == 0 ) textobj.className = 'item_text';
		else textobj.className = 'gray_text';

                textobj = document.getElementById('scan_text_2_'+i);
                if(textobj) textobj.className = 'item_text';
        }

        trobj = document.getElementById('scan_tr_'+idx);
        trobj.className = 'big_selected_td';

        textobj = document.getElementById('scan_text_0_'+idx);
        textobj.className = 'white_text';
        textobj = document.getElementById('scan_text_1_'+idx);
        textobj.className = 'white_text';

        textobj = document.getElementById('scan_text_2_'+idx);
	if(textobj) textobj.className = 'white_text';

        obj.value = idx;
}

function OnDBLClickAPScan(idx)
{
        var obj;

        obj=document.getElementsByName('ssid');
        parent.document.wizard.ssid.value = obj[idx].value;
        obj=document.getElementsByName('bssid');
        parent.document.wizard.bssid.value = obj[idx].value;
        obj=document.getElementsByName('auth_type');
        parent.document.wizard.auth_type.value = obj[idx].value;
        obj=document.getElementsByName('encrypt_type');
        parent.document.wizard.encrypt_type.value = obj[idx].value;

        if(parent.document.wizard.ssid.value == '')
                parent.document.wizard.step.value = 4;
        else if(parent.document.wizard.encrypt_type.value == ENCRYPT_OFF)
                parent.document.wizard.step.value = 5;
        else
                parent.document.wizard.step.value = 4;
        parent.document.wizard.apply.value = 1;
        parent.document.wizard.submit();
}



// lan_pcinfo
function CheckManualLeaseRegister()
{
        var F= document.lan_pcinfo_fm;
        if(F.manual_check.checked == true)
        {
                EnableHW('manual_hw');
                EnableIP('manual_ip');
		F.manual_ip4.focus();
        }
        else
        {
                DisableHW('manual_hw');
                DisableIP('manual_ip');
        }
}

function InitStaticIPLease()
{
        DisableHW('manual_hw');
        DisableIP('manual_ip');
}


function AddPostSubmit()
{
        parent.static_lease.document.static_lease_fm.act.value = '';
        parent.static_lease.document.static_lease_fm.submit();
}

function RemovePostSubmit()
{
        parent.lan_pcinfo.document.lan_pcinfo_fm.act.value = '';
        parent.lan_pcinfo.document.lan_pcinfo_fm.submit();
}





</script>
