<script>
//natrouterconf_portforward
var forwardData = new Array(60);
for (var i=0;  i<60; i++)
	forwardData[i] = {op:"",iport1:"",iport2:"",proto:"",ip:"",oport:""};
var forwardModifyIndex;

function DrawForward(tbodyID)
{
        var F = pfwd_table.document.iframe_pfwd_list_fm;
	var tr, td, doc;

	document.pfwd_list_fm.allchk.checked = false;

	doc = pfwd_table.document;
	tbody = doc.getElementById(tbodyID);

	// clear child nodes
	while (tbody.childNodes.length > 0) 
	        tbody.removeChild(tbody.firstChild);

	// create holder for accumulated tbody elements and text nodes
	var frag = doc.createDocumentFragment();

	for (var i=0; i< forwardData.length; i++)
	{
		if (forwardData[i].op == "")
			continue;

		tr = createElementTR(doc);
		td = createElementTD(doc, tr, "", "<input type='checkbox' name='chkopt'>","center","42","");
		td = createElementTD(doc, tr, i+1, "","center","40","");
		td = createElementTD(doc, tr, forwardData[i].op, "","center","60","");

		if (forwardData[i].iport2 == "")
			td = createElementTD(doc, tr, forwardData[i].iport1, "","center","110","");
		else
			td = createElementTD(doc, tr, forwardData[i].iport1+"-"+forwardData[i].iport2, "","center","110","");

		td = createElementTD(doc, tr, forwardData[i].proto, "center","","80","");
		td = createElementTD(doc, tr, forwardData[i].ip, "center","","150","");
		td = createElementTD(doc, tr, forwardData[i].oport, "center","","110","");

		frag.appendChild(tr);
	}
	if (!tbody.appendChild(frag)) {
	    	alert("This browser doesn't support dynamic tables.");
	}
}

function MakeForwardList(idx, op, iport1, iport2, proto, ip, oport)
{
	forwardData[idx].op = op;
	forwardData[idx].iport1 = iport1;
	if (iport2 != "0")
		forwardData[idx].iport2 = iport2;
	forwardData[idx].proto = proto;
	forwardData[idx].ip = ip;
	if (oport != "0")
		forwardData[idx].oport =  oport;
}

function add_forward_row(F)
{
	var i;

	for (i=0; i < forwardData.length; i++) {
		if (forwardData[i].op == "")
			break;
	}

	if (i >= forwardData.length) {
		alert(MSG_ADD_NOMORE);
		return;
	}

	forwardData[i].op = "ON";
	forwardData[i].iport1 = F.i_port1.value;
	forwardData[i].iport2 = F.i_port2.value;
	forwardData[i].proto = F.protocol.value;
	forwardData[i].ip = F.os_ip1.value+"."+F.os_ip2.value+"."+F.os_ip3.value+"."+F.os_ip4.value;
	forwardData[i].oport = F.o_port1.value;
}

function modify_forward_row(F)
{
	forwardData[forwardModifyIndex].iport1 = F.i_port1.value;
	forwardData[forwardModifyIndex].iport2 = F.i_port2.value;
	forwardData[forwardModifyIndex].proto = F.protocol.value;
	forwardData[forwardModifyIndex].ip = F.os_ip1.value+"."+F.os_ip2.value+"."+F.os_ip3.value+"."+F.os_ip4.value;
	forwardData[forwardModifyIndex].oport = F.o_port1.value;

	F.addbt.value = "추가";
}

function ForwardAdd()
{
        var F = document.portforward_setup_fm;
        var obj;

        if (obj=CheckIP('os_ip'))
        {
                alert(NATCONF_PORTFORWARD_INVALID_INT_IP_ADDRESS);
                obj.focus();
                obj.select();
                return;
        }
        else if (F.protocol.disabled == false)
        {
                if (F.i_port1.value == '')
                {
                        alert(NATCONF_PORTFORWARD_EXT_PORT_IS_BLANK);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkRange(F.i_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port1.focus();
                        F.i_port1.select();
                        return;
                }
                else if (checkOptionalRange(F.i_port2.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if ((F.i_port2.value != '') &&
				(parseInt(F.i_port1.value) > parseInt(F.i_port2.value)))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT_RANGE);
                        F.i_port2.focus();
                        F.i_port2.select();
                        return;
                }
                else if (checkOptionalRange(F.o_port1.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.o_port1.focus();
                        F.o_port1.select();
                        return;
                }
	}

	if (F.addbt.value == "변경")
		modify_forward_row(F);
	else
		add_forward_row(F);

	F.i_port1.value = "";
	F.i_port2.value = "";
	F.sel_app[0].selected = true;
	F.protocol[0].selected = true;
	F.os_ip4.value = "";
	F.o_port1.value = "";

	DrawForward('pfwdTable');
}

function ForwardOnOff()
{
	var chk;

	chk = pfwd_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				if (forwardData[i].op == "ON")
					forwardData[i].op = "OFF";
				else
					forwardData[i].op = "ON";
			}
		}
	}

	DrawForward('pfwdTable');
}


function ForwardModify()
{
	var chk, cnt = 0, idx;
        var F = document.portforward_setup_fm;
	var ip;

	chk = pfwd_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				forwardModifyIndex = i; 
				cnt++;
			}
		}
		if (cnt == 0)
		{
			alert(MSG_MODIFY_NOSEL);
			return;
		}
		if (cnt > 1)
		{
			alert(MSG_MODIFY_ONE);
			return;
		}


		F.i_port1.value = forwardData[forwardModifyIndex].iport1;
		F.i_port2.value = forwardData[forwardModifyIndex].iport2;
		F.protocol.value = forwardData[forwardModifyIndex].proto;
		F.o_port1.value = forwardData[forwardModifyIndex].oport;

		ip = forwardData[forwardModifyIndex].ip.split(".");
		F.os_ip1.value = ip[0];
		F.os_ip2.value = ip[1];
		F.os_ip3.value = ip[2];
		F.os_ip4.value = ip[3];


		F.addbt.value = "변경";
	}
}

function ForwardDel()
{
	var chk;
	var cnt = 0;

	chk = pfwd_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				forwardData[i].op = "";
				cnt++;
			}
		}

		for (var i=1; i<=cnt; i++)
		{
			for (var j=0; j<forwardData.length; j++)
			{
				if (forwardData[j].op == "")
				{
					if (j != forwardData.length-1)
					{
						for (var k=j; k<forwardData.length-1; k++)
						{
							forwardData[k].op = forwardData[k+1].op; 
							forwardData[k].iport1 = forwardData[k+1].iport1; 
							forwardData[k].iport2 = forwardData[k+1].iport2; 
							forwardData[k].proto = forwardData[k+1].proto; 
							forwardData[k].osip = forwardData[k+1].osip; 
							forwardData[k].oport = forwardData[k+1].oport; 
						}
						forwardData[k].op = "";
					}
					else
						forwardData[j].op == "";
				}
			}
		}
	}

	DrawForward('pfwdTable');
}

function ForwardApply()
{
        var F = pfwd_table.document.iframe_pfwd_list_fm;

	F.list.value = "";

	for (var j=0; j<forwardData.length; j++)
	{
		if (forwardData[j].op == "") 
			continue;
		F.list.value += forwardData[j].op+","+forwardData[j].iport1+","+forwardData[j].iport2+","+forwardData[j].proto+","+forwardData[j].ip+","+forwardData[j].oport+"&";
	}

	F.submit();
}

function ForwardAppSelect()
{
	var F = document.portforward_setup_fm;

	data = F.sel_app.value.split(":");

	if (data[0] == 'tcp')
		F.protocol[0].selected = true;
	else
		F.protocol[1].selected = true;

	F.i_port1.value = data[1];
	F.i_port2.value = data[2];
}


//natrouterconf_twinipdmz

function submit_twinipdmz(wid, cur_mode, is_twinip)
{
        var F = document.ipclone;
        var obj, mode_obj;

        mode_obj = document.getElementsByName('w'+wid+'mode');
        mode =  GetRadioValue(mode_obj);
        if (mode == DMZTWINIP_MODE_DMZ )
        {
                var ip = 'w'+wid+'ip';
                if (obj=CheckIP(ip))
                {
                        alert(MSG_INVALID_IP);
                        obj.focus(); obj.select();
                        return;
                }
        }
        else if (mode == DMZTWINIP_MODE_TWINIP)
        {
                var hw = 'w'+wid+'hw';
                if (obj=CheckHW(hw))
                {
                        alert(MSG_INVALID_HWADDR);
                        obj.focus(); obj.select();
                        return;
                }
        }

        if (cur_mode == DMZTWINIP_MODE_TWINIP && is_twinip && !confirm(NATCONF_TWINIPDMZ_WARNING))
        {
                //F.w1mode[DMZTWINIP_MODE_TWINIP].checked = true;
                mode_obj[DMZTWINIP_MODE_TWINIP].checked = true;
                select_twinipdmz(DMZTWINIP_MODE_TWINIP, wid);
                return;
        }

        F.wanid.value = wid;
        F.act.value = 'w'+wid+'dmztwiip';
        F.submit();
}

function get_hwaddr(obj,wid, hw_addr)
{
        if (obj.checked == false)
                ResetHW('w'+wid+'hw');
        else
                SetHW('w'+wid+'hw', hw_addr);

}

function select_twinipdmz(mode, wid)
{
	var F = document.ipclone;

        if (mode == 1)
        {
                EnableIP('w'+wid+'ip');
                DisableHW('w'+wid+'hw');
		DisableObj(F.w1macbutton);
        }
        else if (mode == 2)
        {
                DisableIP('w'+wid+'ip');
                EnableHW('w'+wid+'hw');
		EnableObj(F.w1macbutton);
        }
        else
        {
                DisableIP('w'+wid+'ip');
                DisableHW('w'+wid+'hw');
		DisableObj(F.w1macbutton);
        }
}

//natrouterconf_misc

function applyFtpPort(max_port)
{
        var F = document.natrouterconf_misc_fm;
        if (F.ftp_port_count.value >= max_port)
                alert(NATCONF_INTAPPS_NO_MORE_ADD_FTP_PORT)
        else if (F.port0.value > 65535)
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else if (F.port1.value > 65535)
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else if (F.port2.value > 65535)
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else if (F.port3.value > 65535)
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else if (F.port4.value > 65535)
                alert(NATCONF_INTAPPS_FTP_PORT_INVALID)
        else
        {
                F.act.value = 'apply_ftpport';
                F.submit();
        }
}

function delFtpPort()
{
        var F = document.natrouterconf_misc_fm;
        F.act.value = 'delftpport';
        F.submit();
}

function onoffFtpPort(mode)
{
        var F = document.natrouterconf_misc_fm;

	if (mode == 0)
	{
		DisableObj(F.port0);
		DisableObj(F.port1);
		DisableObj(F.port2);
		DisableObj(F.port3);
		DisableObj(F.port4);
	}
	else
	{
		EnableObj(F.port0);
		EnableObj(F.port1);
		EnableObj(F.port2);
		EnableObj(F.port3);
		EnableObj(F.port4);
	}
}

function setMulticast()
{
        var F = document.natrouterconf_misc_fm;
        F.act.value = 'mc';
        F.submit();
}

// firewallconf_firewall
var firewallData = new Array(30);
for (var i=0;  i<30; i++)
	firewallData[i] = {op:"",policy:"",dir:"",proto:"",sip1:"",sip2:"",sport1:"",sport2:"",smac:"", dip1:"",dip2:"",dport1:"",dport2:""};
var firewallModifyIndex;



function check_ip_firewall(type)
{
        var F = document.firewall_setup_fm;
        var obj;

   if (type == "source")
   {	   
        if (obj=CheckIP('src_sip'))
        {
            obj.focus();
            obj.select();
            return 0;
        }
	else if (F.src_eip1.value != "0" && F.src_eip1.value != "")
	{
	        if (obj=CheckOptionalIP('src_eip'))
	        {
	            obj.focus();
	            obj.select();
	            return 0;
	        }
		else if((parseInt(F.src_sip4.value) +  parseInt(F.src_sip3.value) * 256 +
	            parseInt(F.src_sip2.value) * 65536 +  parseInt(F.src_sip1.value) * 16777216 ) >=
	           (parseInt(F.src_eip4.value) +  parseInt(F.src_eip3.value) * 256 +
	            parseInt(F.src_eip2.value) * 65536 +  parseInt(F.src_eip1.value) * 16777216 ))
	        {
	                F.src_eip4.focus();
	                F.src_eip4.select();
	                return 0;
	        }
	}
   } 
   else 
   {
        if (obj=CheckOptionalIP('dst_sip'))
        {
            obj.focus();
            obj.select();
            return 0;
        }
	else if (F.dst_eip1.value != "0" && F.dst_eip1.value != "")
	{
	        if (obj=CheckOptionalIP('dst_eip'))
	        {
	            obj.focus();
	            obj.select();
	            return 0;
	        }
		else if((parseInt(F.dst_sip4.value) +  parseInt(F.dst_sip3.value) * 256 +
	            parseInt(F.dst_sip2.value) * 65536 +  parseInt(F.dst_sip1.value) * 16777216 ) >=
	           (parseInt(F.dst_eip4.value) +  parseInt(F.dst_eip3.value) * 256 +
	            parseInt(F.dst_eip2.value) * 65536 +  parseInt(F.dst_eip1.value) * 16777216 ))
	        {
	                F.dst_eip4.focus();
	                F.dst_eip4.select();
	                return 0;
	        }
	}
    }
    return 1;
}


function print_firewall_ip_form(F, prefix, disable)
{
        if (disable)
        {
                DisableIP(prefix+'_sip');
                DisableIP(prefix+'_eip');
		obj=document.getElementsByName(prefix+'_port1');
		DisableObj(obj[0]);
		obj=document.getElementsByName(prefix+'_port2');
		DisableObj(obj[0]);
        }
        else
        {
                EnableIP(prefix+'_sip');
                EnableIP(prefix+'_eip');
        	if ((F.protocol.value == 'tcp') || (F.protocol.value == 'udp'))
		{
			obj=document.getElementsByName(prefix+'_port1');
			EnableObj(obj[0]);
			obj=document.getElementsByName(prefix+'_port2');
			EnableObj(obj[0]);
		}
        }
}

function print_firewall_mac_form(F, prefix, disable)
{
        if (disable)
        {
                DisableHW(prefix+'_hw');
                DisableObj(F.macbutton);
        }
        else
        {
                EnableHW(prefix+'_hw');
                EnableObj(F.macbutton);
        }
}

function print_js_one_ip_form(F, prefix, disable)
{
        if (disable)
        {
		obj=document.getElementsByName('all_'+prefix+'_port1');
		DisableObj(obj[0]);
		obj=document.getElementsByName('all_'+prefix+'_port2');
		DisableObj(obj[0]);
        }
        else
        {
        	if ((F.protocol.value == 'tcp') || (F.protocol.value == 'udp'))
		{
			obj=document.getElementsByName('all_'+prefix+'_port1');
			EnableObj(obj[0]);
			obj=document.getElementsByName('all_'+prefix+'_port2');
			EnableObj(obj[0]);
		}
        }
}

function disable_Address_Form(flag, prefix)
{
        var F = document.firewall_setup_fm;
        if (flag == 'ip')
        {
                print_firewall_ip_form(F, prefix, 0);
                print_firewall_mac_form(F, prefix, 1);
                print_js_one_ip_form(F, prefix, 1);
        }
	else if (flag == 'mac')
        {
                print_firewall_ip_form(F, prefix, 1);
                print_firewall_mac_form(F, prefix, 0);
                print_js_one_ip_form(F, prefix, 1);
        }
	else if (flag == 'all')
        {
                print_firewall_ip_form(F, prefix, 1);
                print_firewall_mac_form(F, prefix, 1);
                print_js_one_ip_form(F, prefix, 0);
        }
}

function SetFWPort(where)
{
	var F = document.firewall_setup_fm;

	if (where == 'source')
		data = F.sport_sel.value.split(":");
	else
		data = F.dport_sel.value.split(":");

	if (data[0] == 'tcp')
		F.protocol[1].selected = true;
	else if (data[0] == 'udp')
		F.protocol[2].selected = true;
	else
		F.protocol[0].selected = true;

	if (where == 'source')
	{
		var src_type = GetRadioValue(F.sel_src)
		if (src_type === 'ipaddr')
		{
			EnableObj(F.src_port1);
			EnableObj(F.src_port2);
			F.src_port1.value = data[1];
			F.src_port2.value = data[2];
		}
		else if (src_type == 'all_src')
		{
			EnableObj(F.all_src_port1);
			EnableObj(F.all_src_port2);
			F.all_src_port1.value = data[1];
			F.all_src_port2.value = data[2];
		}
	}
	else
	{
		var src_type = GetRadioValue(F.sel_dst)
		if (src_type === 'ipaddr')
		{
			EnableObj(F.dst_port1);
			EnableObj(F.dst_port2);
			F.dst_port1.value = data[1];
			F.dst_port2.value = data[2];
		}
		else if (src_type == 'all_dst')
		{
			EnableObj(F.all_dst_port1);
			EnableObj(F.all_dst_port2);
			F.all_dst_port1.value = data[1];
			F.all_dst_port2.value = data[2];
		}
	}
}

function disable_DPort_Form()
{
        var F = document.firewall_setup_fm;
       	if ((F.protocol.value == 'tcp') || (F.protocol.value == 'udp'))
        { // enable
		var src_type = GetRadioValue(F.sel_src);
		if (src_type === 'ipaddr')
		{
			EnableObj(F.src_port1);
			EnableObj(F.src_port2);
		}
		else if (src_type == 'all_src')
		{
			EnableObj(F.all_src_port1);
			EnableObj(F.all_src_port2);
		}

		var dst_type = GetRadioValue(F.sel_dst);
		if (dst_type === 'ipaddr')
		{
			EnableObj(F.dst_port1);
			EnableObj(F.dst_port2);
		}
		else if (dst_type == 'all_dst')
		{
			EnableObj(F.all_dst_port1);
			EnableObj(F.all_dst_port2);
		}
        }
        else
        { // disable
		var src_type = GetRadioValue(F.sel_src);
		if (src_type === 'ipaddr')
		{
			DisableObj(F.src_port1);
			DisableObj(F.src_port2);
		}
		else if (src_type == 'all_src')
		{
			DisableObj(F.all_src_port1);
			DisableObj(F.all_src_port2);
		}

		var dst_type = GetRadioValue(F.sel_dst);
		if (dst_type === 'ipaddr')
		{
			DisableObj(F.dst_port1);
			DisableObj(F.dst_port2);
		}
		else if (dst_type == 'all_dst')
		{
			DisableObj(F.all_dst_port1);
			DisableObj(F.all_dst_port2);
		}
        }
}

function DrawFirewall(tbodyID)
{
        var F = firewall_table.document.iframe_firewall_list_fm;
        var F2 = document.firewall_setup_fm;
	var tr, td, doc;
	var buf;

	document.pfwd_list_fm.allchk.checked = false;

	doc = firewall_table.document;
	tbody = doc.getElementById(tbodyID);

	// clear child nodes
	while (tbody.childNodes.length > 0) 
	        tbody.removeChild(tbody.firstChild);

	// create holder for accumulated tbody elements and text nodes
	var frag = doc.createDocumentFragment();

	for (var i=0; i< firewallData.length; i++)
	{
		if (firewallData[i].op == "")
			continue;

		tr = createElementTR(doc);
		td = createElementTD(doc, tr, "", "<input type='checkbox' name='chkopt'>","center","42","");
		td = createElementTD(doc, tr, i+1, "","center","30","");
		td = createElementTD(doc, tr, firewallData[i].op, "","center","60","");

		// Policy
		if (firewallData[i].policy == "DROP")
			buf = "차단";
		else
			buf = "허용";
		td = createElementTD(doc, tr, buf, "","right","46","");

		// Direction
		if (firewallData[i].dir == "in_ex")
			buf = "내부->외부";
		else	
			buf = "외부->내부";
		td = createElementTD(doc, tr, buf, "","right","80","");

		// Protocol
		if (firewallData[i].proto == "")
			buf = "ALL";
		else
			buf = firewallData[i].proto;
		td = createElementTD(doc, tr, buf.toUpperCase(), "","center","72","");

		// Rule
		if (firewallData[i].sip2 != "")
			buf = firewallData[i].sip1+'~'+firewallData[i].sip2+':';
		else if (firewallData[i].sip1 != "")
			buf = firewallData[i].sip1+':';
		else if (firewallData[i].smac != "")
			buf = firewallData[i].smac;
		else
			buf = "모든 IP:";

		if (firewallData[i].smac == "")
		{
			if (firewallData[i].sport1 != "")
				buf = buf+firewallData[i].sport1+'~'+firewallData[i].sport2;
			else
				buf = buf+'0~0';
		}
		td = createElementTD(doc, tr, buf, "br", "center","260","");

		if (firewallData[i].dip2 != "")
			buf = firewallData[i].dip1+'~'+firewallData[i].dip2;
		else if (firewallData[i].dip1 != "")
			buf = firewallData[i].dip1;
		else
			buf = "모든 IP";
		buf = buf+':';
		if (firewallData[i].dport2 != "")
			buf = buf+firewallData[i].dport1+'~'+firewallData[i].dport2;
		else
			buf = buf+'0~0';
		txt = doc.createTextNode(buf);
		td.appendChild(txt);

		frag.appendChild(tr);
	}
	if (!tbody.appendChild(frag)) {
	    	alert("This browser doesn't support dynamic tables.");
	}
}

function MakeFirewallList(idx, op, policy, dir, proto, sip1, sip2, sport1, sport2, smac, dip1, dip2, dport1, dport2)
{
	firewallData[idx].op = op;
	firewallData[idx].policy =  policy;
	firewallData[idx].dir = dir;
	firewallData[idx].proto =  proto;
	firewallData[idx].sip1 = sip1;
	firewallData[idx].sip2 = sip2;	
	if (sport1 != "0")
		firewallData[idx].sport1 = sport1;
	if (sport2 != "0")
		firewallData[idx].sport2 = sport2;
	firewallData[idx].smac =  smac;
	firewallData[idx].dip1 =  dip1;
	firewallData[idx].dip2 =  dip2;
	if (dport1 != "0")
		firewallData[idx].dport1 = dport1;
	if (dport2 != "0")
		firewallData[idx].dport2 = dport2;
}

function update_firewall_data(F, idx)
{
	firewallData[idx].policy = F.policy.value;
	firewallData[idx].dir = F.dir.value;
	firewallData[idx].proto = F.protocol.value;

	firewallData[idx].sip1 = "";
	firewallData[idx].sip2 = "";
	firewallData[idx].smac = "";

	if (F.sel_src[0].checked == true)
	{
		firewallData[idx].sip1 = F.src_sip1.value+"."+F.src_sip2.value+"."+F.src_sip3.value+"."+F.src_sip4.value;
		if (F.src_eip1.value != "0")
			firewallData[idx].sip2 = F.src_eip1.value+"."+F.src_eip2.value+"."+F.src_eip3.value+"."+F.src_eip4.value;
	}
	if (F.sel_src[1].checked == true)
	{
		firewallData[idx].smac = F.src_hw1.value+':'+F.src_hw2.value +':'+F.src_hw3.value +':'+F.src_hw4.value+':'+F.src_hw5.value +':'+F.src_hw6.value;
	}


	if (F.sel_src[0].checked == true)
	{
		firewallData[idx].sport1 =  F.src_port1.value;
		firewallData[idx].sport2 =  F.src_port2.value;
	}
	else if (F.sel_src[2].checked == true)
	{
		firewallData[idx].sport1 =  F.all_src_port1.value;
		firewallData[idx].sport2 =  F.all_src_port2.value;
	}
	else
	{
		firewallData[idx].sport1 =  "";
		firewallData[idx].sport2 =  "";
	}

	firewallData[idx].dip1 = "";
	firewallData[idx].dip2 = "";
	if (F.sel_dst[0].checked == true)
	{
		firewallData[idx].dip1 = F.dst_sip1.value+"."+F.dst_sip2.value+"."+F.dst_sip3.value+"."+F.dst_sip4.value;
		if ( F.dst_eip1.value != "0")
			firewallData[idx].dip2 = F.dst_eip1.value+"."+F.dst_eip2.value+"."+F.dst_eip3.value+"."+F.dst_eip4.value;
	}

	if (F.sel_dst[0].checked == true)
	{
		firewallData[idx].dport1 =  F.dst_port1.value;
		firewallData[idx].dport2 =  F.dst_port2.value;
	}
	else
	{
		firewallData[idx].dport1 =  F.all_dst_port1.value;
		firewallData[idx].dport2 =  F.all_dst_port2.value;
	}
}

function add_firewall_row(F)
{
	var i;

	for (i=0; i < firewallData.length; i++) {
		if (firewallData[i].op == "")
			break;
	}

	if (i >= firewallData.length) {
		alert(MSG_ADD_NOMORE);
		return;
	}

	firewallData[i].op = "ON";
	update_firewall_data(F, i);
}

function modify_firewall_row(F)
{
	update_firewall_data(F, firewallModifyIndex);
	F.addbt.value = "추가";
}

function FirewallAdd()
{
        var F = document.firewall_setup_fm;
        var obj;

        if (F.sel_src[0].checked == true && !check_ip_firewall("source"))
        {
                alert(FIREWALLCONF_FIREWALL_INVALID_SOURCE_IP);
                return;
        }
        if (F.sel_src[1].checked == true)
        {
                if(obj=CheckHW('src_hw'))
                {
                        alert(FIREWALLCONF_FIREWALL_INVALID_SOURCE_HW);
                        obj.focus();
                        obj.select();
                        return;
                }
        }
        if (F.sel_dst[0].checked == true && !check_ip_firewall("dest"))
        {
                alert(FIREWALLCONF_FIREWALL_INVALID_DEST_IP);
                return;
        }

        F.rule_type.value = USER_FWSCHED_TYPE;

	if (F.addbt.value == "변경")
		modify_firewall_row(F);
	else
		add_firewall_row(F);

	F.policy[0].selected = true;
	F.dir[0].selected = true;
	F.protocol[0].selected = true;
	F.src_sip1.value = F.src_sip2.value = F.src_sip3.value = F.src_sip4.value = "0";
	F.src_eip1.value = F.src_eip2.value = F.src_eip3.value = F.src_eip4.value = "0";
	F.src_port1.value = F.src_port2.value = "";
	F.all_src_port1.value = F.all_src_port2.value = "";
	F.dport_sel[0].selected = true;
	F.dst_sip1.value = F.dst_sip2.value = F.dst_sip3.value = F.dst_sip4.value = "0";
	F.dst_eip1.value = F.dst_eip2.value = F.dst_eip3.value = F.dst_eip4.value = "0";
	F.dst_port1.value = F.dst_port2.value = "";
	F.all_dst_port1.value = F.all_dst_port2.value = "";
	F.dport_sel[0].selected = true;

	DrawFirewall('firewallTable');
}

function FirewallOnOff()
{
	var chk;

	chk = firewall_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				if (firewallData[i].op == "ON")
					firewallData[i].op = "OFF";
				else
					firewallData[i].op = "ON";
			}
		}
	}

	DrawFirewall('firewallTable');
}

function FirewallModify()
{
	var chk, cnt = 0, idx;
        var F = document.firewall_setup_fm;
	var ip;

	chk = firewall_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				firewallModifyIndex = i; 
				cnt++;
			}
		}
		if (cnt == 0)
		{
			alert(MSG_MODIFY_NOSEL);
			return;
		}
		if (cnt > 1)
		{
			alert(MSG_MODIFY_ONE);
			return;
		}


		F.policy.value = firewallData[firewallModifyIndex].policy;
		F.dir.value = firewallData[firewallModifyIndex].dir;
		F.protocol.value = firewallData[firewallModifyIndex].proto;

		F.src_sip1.value = F.src_sip2.value = F.src_sip3.value = F.src_sip4.value = "0";
		F.src_eip1.value = F.src_eip2.value = F.src_eip3.value = F.src_eip4.value = "0";
		F.src_port1.value = F.src_port2.value = "";
		F.all_src_port1.value = F.all_src_port2.value = "";
		F.dst_sip1.value = F.dst_sip2.value = F.dst_sip3.value = F.dst_sip4.value = "0";
		F.dst_eip1.value = F.dst_eip2.value = F.dst_eip3.value = F.dst_eip4.value = "0";
		F.dst_port1.value = F.dst_port2.value = "";
		F.all_dst_port1.value = F.all_dst_port2.value = "";

		if (firewallData[firewallModifyIndex].sip1 != "")
		{
			F.sel_src[0].checked = true;

			ip = firewallData[firewallModifyIndex].sip1.split(".");
			F.src_sip1.value = ip[0];
			F.src_sip2.value = ip[1];
			F.src_sip3.value = ip[2];
			F.src_sip4.value = ip[3];

			if (firewallData[firewallModifyIndex].sip2 != "")
			{
				ip = firewallData[firewallModifyIndex].sip2.split(".");
				F.src_eip1.value = ip[0];
				F.src_eip2.value = ip[1];
				F.src_eip3.value = ip[2];
				F.src_eip4.value = ip[3];
			}

			F.src_port1.value = firewallData[firewallModifyIndex].sport1;
			F.src_port2.value = firewallData[firewallModifyIndex].sport2;

			disable_Address_Form('ip', 'src');
			if (F.src_port1.value == "") DisableObj(F.src_port1);
			if (F.src_port2.value == "") DisableObj(F.src_port2);
		}
		else if (firewallData[firewallModifyIndex].smac != "")
		{
			F.sel_src[1].checked = true;

			mac = firewallData[firewallModifyIndex].smac.split(":");
			F.src_hw1.value = mac[0];
			F.src_hw2.value = mac[1];
			F.src_hw3.value = mac[2];
			F.src_hw4.value = mac[3];
			F.src_hw5.value = mac[4];
			F.src_hw6.value = mac[5];

			disable_Address_Form('mac', 'src');
		}
		else
		{
			F.sel_src[2].checked = true;
			
			F.all_src_port1.value = firewallData[firewallModifyIndex].sport1;
			F.all_src_port2.value = firewallData[firewallModifyIndex].sport2;

			disable_Address_Form('all', 'src');
			if (F.all_src_port1.value == "") DisableObj(F.all_src_port1);
			if (F.all_src_port2.value == "") DisableObj(F.all_src_port2);
		}

		F.sport_sel[0].selected = true;

		if (firewallData[firewallModifyIndex].dip1 != "")
		{
			F.sel_dst[0].checked = true;

			ip = firewallData[firewallModifyIndex].dip1.split(".");
			F.dst_sip1.value = ip[0];
			F.dst_sip2.value = ip[1];
			F.dst_sip3.value = ip[2];
			F.dst_sip4.value = ip[3];
			
			if (firewallData[firewallModifyIndex].dip2 != "")
			{
				ip = firewallData[firewallModifyIndex].dip2.split(".");
				F.dst_eip1.value = ip[0];
				F.dst_eip2.value = ip[1];
				F.dst_eip3.value = ip[2];
				F.dst_eip4.value = ip[3];
			}

			F.dst_port1.value = firewallData[firewallModifyIndex].dport1;
			F.dst_port2.value = firewallData[firewallModifyIndex].dport2;

			disable_Address_Form('ip', 'dst');
			if (F.dst_port1.value == "") DisableObj(F.dst_port1);
			if (F.dst_port2.value == "") DisableObj(F.dst_port2);
		}
		else
		{
			F.sel_dst[1].checked = true;

			F.all_dst_port1.value = firewallData[firewallModifyIndex].dport1;
			F.all_dst_port2.value = firewallData[firewallModifyIndex].dport2;

			disable_Address_Form('all', 'dst');
			if (F.all_dst_port1.value == "") DisableObj(F.all_dst_port1);
			if (F.all_dst_port2.value == "") DisableObj(F.all_dst_port2);
		}

		F.dport_sel[0].selected = true;


		F.addbt.value = "변경";
	}
}

function FirewallDel()
{
	var chk;
	var cnt = 0;

	chk = firewall_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				firewallData[i].op = "";
				cnt++;
			}
		}

		for (var i=1; i<=cnt; i++)
		{
			for (var j=0; j<firewallData.length; j++)
			{
				if (firewallData[j].op == "")
				{
					if (j != firewallData.length-1)
					{
						for (var k=j; k<firewallData.length-1; k++)
						{
							firewallData[k].op = firewallData[k+1].op; 
							firewallData[k].policy = firewallData[k+1].policy; 
							firewallData[k].dir = firewallData[k+1].dir; 
							firewallData[k].proto = firewallData[k+1].proto; 
							firewallData[k].sip1 = firewallData[k+1].sip1; 
							firewallData[k].sip2 = firewallData[k+1].sip2; 
							firewallData[k].sport1 = firewallData[k+1].sport1; 
							firewallData[k].sport2 = firewallData[k+1].sport2; 
							firewallData[k].smac = firewallData[k+1].smac; 
							firewallData[k].dip1 = firewallData[k+1].dip1; 
							firewallData[k].dip2 = firewallData[k+1].dip2; 
							firewallData[k].dport1 = firewallData[k+1].dport1; 
							firewallData[k].dport2 = firewallData[k+1].dport2; 
						}
						firewallData[k].op = "";
					}
					else
						firewallData[j].op == "";
				}
			}
		}
	}

	DrawFirewall('firewallTable');
}

function FirewallMove(where)
{
	var chk, cnt = 0, idx1, idx2;
        var F = document.firewall_setup_fm;

	chk = firewall_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				idx1 = i; 
				cnt++;
			}
		}
		if (cnt == 0)
		{
			alert(MSG_NO_SEL);
			return;
		}
		if (cnt > 1)
		{
			alert(MSG_ONE_SEL);
			return;
		}

		idx2 = -1;
		if (where == "up" && idx1 != 0) 
			idx2 = idx1 - 1;
		if (where == "down" && idx1 != (chk.length - 1)) 
			idx2 = idx1 + 1;

		if (idx2 < 0)
		{
			chk[idx1].checked = false;
			return;
		}

		tmp     = firewallData[idx1].op; 
		firewallData[idx1].op     = firewallData[idx2].op; 
		firewallData[idx2].op     = tmp;

		tmp = firewallData[idx1].policy; 
		firewallData[idx1].policy  = firewallData[idx2].policy; 
		firewallData[idx2].policy  = tmp;

		tmp    = firewallData[idx1].dir; 
		firewallData[idx1].dir    = firewallData[idx2].dir; 
		firewallData[idx2].dir    = tmp;
		
		tmp  = firewallData[idx1].proto; 
		firewallData[idx1].proto  = firewallData[idx2].proto; 
		firewallData[idx2].proto  = tmp;
		
		tmp   = firewallData[idx1].sip1; 
		firewallData[idx1].sip1   = firewallData[idx2].sip1; 
		firewallData[idx2].sip1   = tmp;

		tmp   = firewallData[idx1].sip2; 
		firewallData[idx1].sip2   = firewallData[idx2].sip2; 
		firewallData[idx2].sip2   = tmp;

		tmp = firewallData[idx1].sport1; 
		firewallData[idx1].sport1 = firewallData[idx2].sport1; 
		firewallData[idx2].sport1 = tmp;

		tmp = firewallData[idx1].sport2; 
		firewallData[idx1].sport2 = firewallData[idx2].sport2; 
		firewallData[idx2].sport2 = tmp;

		tmp   = firewallData[idx1].smac; 
		firewallData[idx1].smac   = firewallData[idx2].smac; 
		firewallData[idx2].smac   = tmp;

		tmp   = firewallData[idx1].dip1; 
		firewallData[idx1].dip1   = firewallData[idx2].dip1; 
		firewallData[idx2].dip1   = tmp;

		tmp   = firewallData[idx1].dip2; 
		firewallData[idx1].dip2   = firewallData[idx2].dip2; 
		firewallData[idx2].dip2   = tmp;

		tmp = firewallData[idx1].dport1; 
		firewallData[idx1].dport1 = firewallData[idx2].dport1; 
		firewallData[idx2].dport1 = tmp;

		tmp = firewallData[idx1].dport2; 
		firewallData[idx1].dport2 = firewallData[idx2].dport2; 
		firewallData[idx2].dport2 = tmp;

		DrawFirewall('firewallTable');
		chk[idx2].checked = true;
	}
}

function FirewallApply()
{
        var F = firewall_table.document.iframe_firewall_list_fm;

	F.list.value = "";

	for (var j=0; j<firewallData.length; j++)
	{
		if (firewallData[j].op == "") 
			continue;
		F.list.value += firewallData[j].op+","+ firewallData[j].policy+","+ firewallData[j].dir+","+ firewallData[j].proto+","+ firewallData[j].sip1+","+ firewallData[j].sip2+","+ firewallData[j].sport1+","+ firewallData[j].sport2+","+ firewallData[j].smac+","+ firewallData[j].dip1+","+ firewallData[j].dip2+","+ firewallData[j].dport1+","+ firewallData[j].dport2+"&" }

	F.submit();
}

//natrouterconf_router

var routeData = new Array(MAX_ROUTE_COUNT);
for (var i=0; i<MAX_ROUTE_COUNT; i++)
	routeData[i] = {op:"", dst:"", mask:"", gw:""};
var routeModifyIndex;

function DrawRoute(tbodyID)
{
	var F = route_table.document.iframe_route_list_fm;
	var tr, td, doc;

	document.router_list_fm.allchk.checked = false;

	doc = route_table.document;
	tbody = doc.getElementById(tbodyID);

	// clear child nodes
	while (tbody.childNodes.length > 0) 
	        tbody.removeChild(tbody.firstChild);

	// create holder for accumulated tbody elements and text nodes
	var frag = doc.createDocumentFragment();

	for (var i=0; i< routeData.length; i++)
	{
		if (routeData[i].op == "")
			continue;

		tr = createElementTR(doc);
		td = createElementTD(doc, tr, "", "<input type='checkbox' name='chkopt'>","center","42","");
		td = createElementTD(doc, tr, i+1, "","center","40","");
		td = createElementTD(doc, tr, routeData[i].op, "","center","60","");
		td = createElementTD(doc, tr, routeData[i].dst, "","center","150","");
		td = createElementTD(doc, tr, routeData[i].mask, "","center","150","");
		td = createElementTD(doc, tr, routeData[i].gw, "center","","148","");

		frag.appendChild(tr);
	}
	if (!tbody.appendChild(frag)) {
	    	alert("This browser doesn't support dynamic tables.");
	}
}

function MakeRouteList(idx, op, dst, mask, gw)
{
	routeData[idx].op = op;
	routeData[idx].dst = dst;
	routeData[idx].mask =  mask;
	routeData[idx].gw = gw;
}

function add_route_row(F)
{
	var i;

	for (i=0; i < routeData.length; i++) {
		if (routeData[i].op == "")
			break;
	}

	if (i >= routeData.length) {
		alert(MSG_ADD_NOMORE);
		return;
	}

	routeData[i].op = "ON";
	routeData[i].dst = F.targetip1.value+"."+F.targetip2.value+"."+F.targetip3.value+"."+F.targetip4.value;
	routeData[i].mask =  F.netmask1.value+"."+F.netmask2.value+"."+F.netmask3.value+"."+F.netmask4.value;
	routeData[i].gw = F.gw1.value+"."+F.gw2.value+"."+F.gw3.value+"."+F.gw4.value;
}

function modify_route_row(F)
{
	routeData[routeModifyIndex].dst = F.targetip1.value+"."+F.targetip2.value+"."+F.targetip3.value+"."+F.targetip4.value;
	routeData[routeModifyIndex].mask =  F.netmask1.value+"."+F.netmask2.value+"."+F.netmask3.value+"."+F.netmask4.value;
	routeData[routeModifyIndex].gw = F.gw1.value+"."+F.gw2.value+"."+F.gw3.value+"."+F.gw4.value;

	F.addbt.value = "추가";
}

function RouteAdd()
{
        var F = document.router_setup_fm;
        var obj;
        if (obj=CheckIP('targetip'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return
        }
        else if (obj=CheckIP('netmask'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return
        }
        else if (obj=CheckIP('gw'))
        {
                alert(MSG_INVALID_IP);
                obj.focus();
                obj.select();
                return
        }

	if (F.addbt.value == "변경")
		modify_route_row(F);
	else
		add_route_row(F);

	F.targetip1.value = "0";
	F.targetip2.value = "0";
	F.targetip3.value = "0";
	F.targetip4.value = "0";

	F.netmask1.value = "0";
	F.netmask2.value = "0";
	F.netmask3.value = "0";
	F.netmask4.value = "0";

	F.gw1.value = "0";
	F.gw2.value = "0";
	F.gw3.value = "0";
	F.gw4.value = "0";

	DrawRoute('routeTable');
}

function RouteOnOff()
{
	var chk;

	chk = route_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				if (routeData[i].op == "ON")
					routeData[i].op = "OFF";
				else
					routeData[i].op = "ON";
			}
		}
	}

	DrawRoute('routeTable');
}

function RouteModify()
{
	var chk, cnt = 0, idx;
        var F = document.router_setup_fm;
	var t_dst, t_mask, t_gw;

	chk = route_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				routeModifyIndex = i; 
				cnt++;
			}
		}
		if (cnt == 0)
		{
			alert(MSG_MODIFY_NOSEL);
			return;
		}
		if (cnt > 1)
		{
			alert(MSG_MODIFY_ONE);
			return;
		}

		t_dst = routeData[routeModifyIndex].dst.split(".");
		t_mask = routeData[routeModifyIndex].mask.split(".");
		t_gw = routeData[routeModifyIndex].gw.split(".");

		F.targetip1.value = t_dst[0];
		F.targetip2.value = t_dst[1];
		F.targetip3.value = t_dst[2];
		F.targetip4.value = t_dst[3];

		F.netmask1.value = t_mask[0];
		F.netmask2.value = t_mask[1];
		F.netmask3.value = t_mask[2];
		F.netmask4.value = t_mask[3];

		F.gw1.value = t_gw[0];
		F.gw2.value = t_gw[1];
		F.gw3.value = t_gw[2];
		F.gw4.value = t_gw[3];

		F.addbt.value = "변경";
	}
}

function RouteDel()
{
	var chk;
	var cnt = 0;

	chk = route_table.document.getElementsByName("chkopt");
	if(chk != null)
	{
		for (var i=0; i<chk.length; i++)
		{
			if (chk[i].checked == true)
			{
				routeData[i].op = "";
				cnt++;
			}
		}

		for (var i=1; i<=cnt; i++)
		{
			for (var j=0; j<routeData.length; j++)
			{
				if (routeData[j].op == "")
				{
					if (j != routeData.length-1)
					{
						for (var k=j; k<routeData.length-1; k++)
						{
							//alert(routeData[k].dst+','+routeData[k+1].dst);
							routeData[k].op = routeData[k+1].op; 
							routeData[k].dst = routeData[k+1].dst; 
							routeData[k].mask = routeData[k+1].mask; 
							routeData[k].gw = routeData[k+1].gw; 
						}
						routeData[k].op = "";
					}
					else
						routeData[j].op == "";
				}
			}
		}
	}

	DrawRoute('routeTable');
}

function RouteApply()
{
        var F = route_table.document.iframe_route_list_fm;

	F.list.value = "";

	for (var j=0; j<routeData.length; j++)
	{
		if (routeData[j].op == "") 
			continue;
		F.list.value += routeData[j].op+","+routeData[j].dst+","+routeData[j].mask+","+routeData[j].gw+"&";
	}

	F.submit();
}



//expertconf_remotepc
function AddPC()
{
        var F=document.remotepc_fm;
        var obj;
        if(obj=CheckHW('hw'))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
        }
        else
        {
                F.act.value='add';
                F.submit();
        }
}
function DeleteRemotePC(index)
{
        var F=document.remotepc_fm;
        if (confirm(EXPERTCONF_WOL_DEL_PC))
        {
                F.act.value='del';
                F.submit();
        }
}

function WakeUp(index)
{
        var F=document.remotepc_fm;
        var hw = 'hw'+index+'pc';

        if (obj=CheckHW(hw))
        {
                alert(MSG_INVALID_HWADDR);
                obj.focus();
                obj.select();
        }
	else 
        {
                F.index.value = index;
                F.act.value = 'wake';
                F.submit();
        }
}

// expertconf_ddns

function onoffDDNS(mode)
{
        var F = document.dyndns_conf;

	if (mode == 0)
	{
		DisableObj(F.select_ddns);
		DisableObj(F.userid);
		DisableObj(F.passwd);
		DisableObj(F.hostname);
		DisableObj(F.wildcard);
	}
	else
	{
		EnableObj(F.select_ddns);
		EnableObj(F.userid);
		EnableObj(F.passwd);
		EnableObj(F.hostname);
		EnableObj(F.wildcard);
	}
}

function DdnsRegistUrl()
{
	window.open("http://www.dyndns.org", "ddns", "width=800, height=600, location=yes, menubar=yes, toolbars=no, scrollbars=yes, status=yes, resizable=yes");
}

function RefreshInfo()
{
        var F = document.dyndns_conf;
        F.act.value = "";
        F.submit();
}

function CheckipTIMEorg(value)
{
        if(value.indexOf('iptime.org')==-1)
                return 0;
        else
        {
                org_str=value.substring(value.lastIndexOf('.')+1);
                if(org_str!='org')
                        return 0;
                else
                {
                        org_str=value.substring(0,value.lastIndexOf('.'));
                        iptime_str=org_str.substring(org_str.lastIndexOf('.')+1);
                        if(iptime_str=='iptime')
                                return 1;
                }
        }
}

function AddHost()
{
        var F = document.dyndns_conf;

        var selectval = F.select_ddns.options[F.select_ddns.selectedIndex].value;
        if( F.hostname.value.length == 0)
        {
                alert( EXPERTCONF_DDNS_HOSTNAME_IS_BLANK);
                F.hostname.focus();
                F.hostname.select();
                return;
        }

        if( (selectval == 'iptime_null') )
        {
                if( (F.iptimecnt.value == 1) )
                {
                        alert( EXPERTCONF_IPTIMEDNS_NOMORE_WANRING1);
                        return;
                }
                if(!CheckipTIMEorg(F.hostname.value))
                {
                        alert( EXPERTCONF_DDNS_HOSTNAME_NOT_IPTIMEORG);
                        F.hostname.focus();
                        F.hostname.select();
                        return;
                }
                if( (F.userid.value.indexOf('@') == -1) )
                {
                        alert( EXPERTCONF_IPTIMEDDNS_INVALID_USERID);
                        F.userid.focus();
                        F.userid.select();
                        return;
                }
        }
        else if( (selectval == 'dyndns_null') && ( F.dyndnscnt.value == 5 ))
        {
                alert( EXPERTCONF_DYNDNS_NOMORE_WANRING1);
                return;
        }

        if( F.userid.value.length == 0 )
        {
                alert(MSG_BLANK_ACCOUNT);
                F.passwd.focus();
                F.passwd.select();
                return;
        }

        if( F.passwd.value.length == 0 )
        {
                alert(MSG_BLANK_PASSWORD);
                F.passwd.focus();
                F.passwd.select();
                return;
        }


        F.act.value = "addhost";
        F.submit();
}

function DelHost()
{
        var F = document.dyndns_conf;
        F.act.value = "delhost";
        F.submit();
}

var previous_select_val = "iptime_null";
function DisplayDesc(v)
{
        var F = document.dyndns_conf;

        if (navigator.appName.indexOf("Microsoft") != -1)
                document.getElementById(v).style.display = "block";
        else
                document.getElementById(v).style.display = "table-row";

        if( previous_select_val != "" )
                document.getElementById( previous_select_val ).style.display = "none";
        previous_select_val = v;
}

function send_EMAIL()
{
        F = document.forget_email
        if( (F.email.value.indexOf('@') == -1) )
        {
                F.email.focus();
                F.email.select();
                alert(INVALID_EMAIL_ADDRESS_STR);
                return;
        }
        F.submit();
}

//firewallconf_accesslist
function RemoteConn()
{
        var F = document.remote_fm;
        var obj, mode_obj;

        mode_obj = document.getElementsByName('rmgmt');
        mode =  GetRadioValue(mode_obj);
	if (mode != 0)
        {
                if (checkOptionalRange(F.rmgmt_port.value, 1, 65535))
                {
                        alert(NATCONF_PORTFORWARD_INVALID_EXT_PORT);
                        F.rmgmt_port.focus();
                        F.rmgmt.select();
                        return;
                }
		F.act.value = 'start';
        }
	else
		F.act.value = 'stop';
        F.submit();
}

function disable_remote_mport()
{
        var F=document.remote_fm;
        var obj, mode_obj;

        mode_obj = document.getElementsByName('rmgmt');
        mode =  GetRadioValue(mode_obj);
        if (mode == 0 )
                DisableObj(F.rmgmt_port);
	else
                EnableObj(F.rmgmt_port);
}

function ext_IPadd()
{
        var obj;
        var F = document.ext_ipform;
        if(obj = CheckIP('ext_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(F.ext_ipexplan.value=="")
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.ext_ipexplan.focus();
        }
        else
        {
                F.act.value = 'ext_ipadd';
                F.submit();
        }
}
function int_IPadd()
{
        var obj;
        var F = document.int_ipform;

        if(obj = CheckIP('int_regip'))
        {
                alert(ACCESSLIST_WRONG_INPUT_IP);
                obj.focus();
                obj.select();
        }
        else if(F.int_ipexplan.value=="")
        {
                alert(ACCESSLIST_WRITE_EXPLAIN);
                F.int_ipexplan.focus();
        }
        else
        {
                F.act.value = 'int_ipadd';
                F.submit();
        }
}


function ext_IPdel()
{
        var F=document.ext_ipform_list;

        if(confirm(ACCESSLIST_DEL_WANT))
        {
                F.act.value = 'ext_del';
                F.submit();
        }
}

function int_IPdel()
{
        var F=document.int_ipform_list;

        if(confirm(ACCESSLIST_DEL_WANT))
        {
                F.act.value = 'int_del';
                F.submit();
        }
}


//sysconf_realtime
function SelectTimeServer()
{
      var F = document.realtime_fm;
      if(F.server_list.value == 'null')
              EnableObj(F.server_edit);
      else
              DisableObj(F.server_edit);
}
function ApplyTimeServer()
{
      var F=document.realtime_fm;
      F.act.value='apply';
      F.submit();
}


// misc - qos
function ApplyQos()
{
      var F=document.qos_fm;
      F.act.value='apply';
      F.submit();
}


</script>

