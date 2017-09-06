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

	F.add_bt.value = MODIFY_OP;
	F.act.value = 'modifyvlan';
}

function setupStp()
{
	var F=document.stp_fm;
	F.submit();
}

function setupStpBridge()
{
	var F=document.stp_bridge_fm;

	if (F.br_prio.value > 65535)
	{
		alert(MSG_INVALID_VALUE);
		F.br_prio.focus();
		F.br_prio.select();
		return;
	}
	if ((F.br_fd.value < 4) || (F.br_fd.value > 30))
	{
		alert(MSG_INVALID_VALUE);
		F.br_fd.focus();
		F.br_fd.select();
		return;
	}
	if ((F.br_maxage.value < 6) || (F.br_maxage.value > 40))
	{
		alert(MSG_INVALID_VALUE);
		F.br_maxage.focus();
		F.br_maxage.select();
		return;
	}
	if ((F.br_hello.value < 1) || (F.br_hello.value > 10))
	{
		alert(MSG_INVALID_VALUE);
		F.br_hello.focus();
		F.br_hello.select();
		return;
	}

	F.submit();
}

function setupStpPort()
{
	var F=document.stp_port_fm;

	if (F.port_prio.value > 255)
	{
		alert(MSG_INVALID_VALUE);
		F.port_prio.focus();
		F.port_prio.select();
		return;
	}
	if (F.port_cost.value > 65535)
	{
		alert(MSG_INVALID_VALUE);
		F.port_cost.focus();
		F.port_cost.select();
		return;
	}

	F.submit();
}


function setupMirroring(numlan)
{
	var F=document.mirroring_fm;
	var op, i;

	op = F.op.value;

	if (op)
	{
		for (i=1; i<= numlan; i++)
		{
			obj = document.getElementsByName('p'+i);
			if (!obj) 
				continue;
			if (obj[0].checked == true)
				break;
		}

		if (i > numlan)
		{
			alert(SELECT_VLAN_PORT_WARNING);
			return;
		}

		if (F.mirroring_port.value == 0)
		{
			alert(SELECT_VLAN_PORT_WARNING);
			F.mirroring_port.focus();
			F.mirroring_port.select();
			return;
		}
	}

	F.submit();
}

function checkMirroredPort(numlan)
{
	var F=document.mirroring_fm;
	var i;

	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('p'+i);
		if (!obj) 
			continue;

		if (F.mirroring_port.value == i)
		{
			obj[0].checked = false;
			obj[0].disabled = true;
		}
		else if (obj[0].disabled == true)
			obj[0].disabled = false;
	}
}


function addTRUNK(numlan, max_member)
{
	var F=document.trunk_fm;
	var trunkmap, member_count;
	var i, rst, msg;

	if (F.tname.value == '')
	{
		alert(MSG_RULE_NAME_IS_BLANK);
		F.tname.focus();
		F.tname.select();
		return;
	}

	trunkmap = 0;
	member_count = 0;	
	for (i=1; i<= numlan; i++)
	{
		obj = document.getElementsByName('p'+i);
		if (obj && (obj[0].checked == true))
		{
			trunkmap |= (1 << (i-1));
			member_count++;
		}
	}

	if (trunkmap & F.trunkmembers.value)
	{
		alert(ALREADY_OTHER_GROUP_MEMBER);
		return;
	}

	for (var i=0; i<F.vlanmap.length; i++) 
	{
		rst = F.vlanmap[i].value & trunkmap;
		if ((rst != trunkmap) && (rst != 0))
		{
			msg = sprintf(SELECT_TRUNK_PORT_VLAN_WARNING, F.vlanname[i].value);
			alert(msg);
			return;
		}
	}


	if ((trunkmap == 0) || (member_count == 1))
		alert(SELECT_TRUNK_PORT_WARNING);
	else if (member_count > max_member)
	{
		msg = sprintf(MAX_MEMBER_TRUNK_WARNING, max_member);
		alert(msg);
	}
	else
	{
		F.act.value = 'addtrunk';
		F.submit();
	}
}

function removeTRUNK()
{
	var F=document.trunk_fm;
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
	F.act.value = 'removetrunk';
	F.submit();
}

function cancelTRUNK()
{
	var F=document.trunk_fm;
	F.act.value = '';
	F.submit();
}

function modifyTRUNK(tname, portmap, numlan)
{
	var F=document.trunk_fm;
	var i;

	obj = document.getElementsByName('tname');
	obj[0].value = tname;

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


	F.tname.readOnly = true;
	EnableObj(F.cancel_bt)
	DisableObj(F.del_bt);

	F.add_bt.value = MODIFY_OP;
	F.act.value = 'modifytrunk';
}


</script>
