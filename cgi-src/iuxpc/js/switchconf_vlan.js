<script>

function addVLAN(numlan)
{
	var F=document.vlan_fm;
	var vlanmap;
	var i, rst, msg;

	if (F.vname.value == '')
	{
		alert(MSG_RULE_NAME_IS_BLANK);
		F.vname.focus();
		F.vname.select();
		return;
	}

	vlanmap = 0;
	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('p'+i);
		if (obj && (obj[0].checked == true))
			vlanmap |= (1 << (i-1));
	}

	for (var i=0; i<F.trunkmap.length; i++) 
	{
		rst = F.trunkmap[i].value & vlanmap;
		if ((rst != F.trunkmap[i].value) && (rst != 0))
		{
			msg = sprintf(SELECT_VLAN_PORT_TRUNK_WARNING, F.trunkname[i].value);
			alert(msg);
			return;
		}
	}

	if (vlanmap == 0)
		alert(SELECT_VLAN_PORT_WARNING);
	else
	{
		if (F.act.value == '')
			F.act.value = 'addvlan';
		F.submit();
	}
}

function removeVLAN()
{
	var F=document.vlan_fm;
	if(!F.vdel)
		return;
	var len = F.vdel.length
	var dellist = '';

	if (confirm(MSG_DELETE_RULE_CONFIRM))
	{
		if (len)
		{
			for (i=0; i<len; i++)
			{
				if (F.vdel[i].type == 'checkbox')
					if (F.vdel[i].checked)
					{
						dellist += F.vdel[i].value;
						dellist += ',';
					}
			}
		}
		else
		{
			if (F.vdel.checked)
				dellist = F.vdel.value+',';
		}
	}

	F.dellist.value = dellist;
	F.act.value = 'removevlan';
	F.submit();
}

function cancelVLAN()
{
	var F=document.vlan_fm;
	F.act.value = '';
	F.submit();
}

function modifyVLAN(vname, portmap, numlan)
{
	var F=document.vlan_fm;
	var i;

	obj = document.getElementsByName('vname');
	obj[0].value = vname;

	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('p'+i);
		if (!obj) 
			continue;

		if (parseInt(portmap) & (1 << (i-1)))
			obj[0].checked = true;
		else
			obj[0].checked = false;
	}


	F.vname.readOnly = true;
	EnableObj(F.cancel_bt)
	DisableObj(F.del_bt);
	F.del_bt.style.color = "gray";

	F.add_bt.value = MODIFY_OP;
	F.act.value = 'modifyvlan';
}

</script>
