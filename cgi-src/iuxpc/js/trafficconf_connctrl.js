<script>

function DefaultConnCtrl()
{
	var F = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.document.connctrl_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_connctrl_status")[0].contentWindow.document.connctrl_fm;

	F.all.value = F2.default_all.value;
	F.udp_max.value = F2.default_udp_max.value;
	F.icmp_max.value = F2.default_icmp_max.value;
	F.rate_per_ip.value = F2.default_rate_per_ip.value;
}

function copyCtrlInputValue()
{
	var F = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.document.connctrl_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_connctrl_status")[0].contentWindow.document.connctrl_fm;

	F2.all.value 		= F.all.value;
	F2.udp_max.value 	= F.udp_max.value;
	F2.icmp_max.value 	= F.icmp_max.value;
	F2.rate_per_ip.value 	= F.rate_per_ip.value;
}

function ApplyConnCtrl()
{
	var F = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.document.connctrl_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_connctrl")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_connctrl_status")[0].contentWindow.document.connctrl_fm;

	var all=parseInt(F.all.value);
	def_all=parseInt(F2.default_all.value);

	if(all == 0 || all > def_all ) 
	{
		if(!confirm(MSG_CONNECTION_MAX_WARNING))
		{
			F.all.focus();
			F.all.select();
			return;
		}
	}

	if(all!=0 && all < 512)
	{
		alert(MSG_CONNECTION_MAX_TOO_SMALL);
		F.all.focus();
		F.all.select();
		return;
	}

	udp_max=parseInt(F.udp_max.value);
	if(udp_max!=0 && (udp_max > all || udp_max < 10))
	{
		alert(MSG_UDP_CONNECTION_MAX_TOO_BIG);
		F.udp_max.focus();
		F.udp_max.select();
		return;
	}

	icmp_max=parseInt(F.icmp_max.value);
	if(icmp_max > all)
	{
		alert(MSG_ICMP_CONNECTION_MAX_TOO_BIG);
		F.icmp_max.focus();
		F.icmp_max.select();
		return;
	}

	rate_per_ip=parseInt(F.rate_per_ip.value);
	if(rate_per_ip < 0 || rate_per_ip > 100 )
	{
		alert(MSG_INVALID_RATE_PER_MAX);
		F.rate_per_ip.focus();
		F.rate_per_ip.select();
		return;
	}

	MaskIt(document, "apply_mask");

	copyCtrlInputValue();
	F2.act.value="apply";
	F2.submit();
}

function ApplyConnTimeout()
{
	var F = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.document.conntimeout_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_timeout_status")[0].contentWindow.document.conntimeout_fm;
	var val,i;

	for(i=0; i<F.elements.length; i++)
	{
		if(F.elements[i].type == 'number')
		{
			val=parseInt(F.elements[i].value);
			if(val <= 0)
			{
				alert(TRAFFICCONF_CONNCTRL_INVALID_TIME);
				F.elements[i].focus();
				F.elements[i].select();
				return;
			}
		}

	}

	MaskIt(document, "apply_mask");
	copyTimeoutInputValue();

	F2.act.value="apply_timeout";
	F2.submit();
}

function copyTimeoutInputValue()
{
	var F = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.document.conntimeout_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_timeout_status")[0].contentWindow.document.conntimeout_fm;
	F2.tcp_timeout_syn_sent.value 		= F.tcp_timeout_syn_sent.value;
	F2.tcp_timeout_syn_recv.value 		= F.tcp_timeout_syn_recv.value;
	F2.tcp_timeout_eastablished.value 	= F.tcp_timeout_eastablished.value;
	F2.tcp_timeout_fin_wait.value 		= F.tcp_timeout_fin_wait.value;
	F2.tcp_timeout_close_wait.value 	= F.tcp_timeout_close_wait.value;
	F2.tcp_timeout_last_ack.value 		= F.tcp_timeout_last_ack.value;
	F2.tcp_timeout_time_wait.value 		= F.tcp_timeout_time_wait.value;
	F2.tcp_timeout_close_value.value	= F.tcp_timeout_close_value.value;
	F2.udp_timeout.value 			= F.udp_timeout.value;
	F2.udp_timeout_stream.value 		= F.udp_timeout_stream.value;
	F2.icmp_timeout.value 			= F.icmp_timeout.value;
	F2.generic_timeout.value 		= F.generic_timeout.value;
}

function DefaultConnTimeout()
{
	var F = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.document.conntimeout_fm;
	var F2 = document.getElementsByName("trafficconf_connctrl_timeout")[0].contentWindow.
		document.getElementsByName("trafficconf_connctrl_timeout_status")[0].contentWindow.document.conntimeout_fm;

	F.tcp_timeout_syn_sent.value 		= F2.default_tcp_timeout_syn_sent.value;
	F.tcp_timeout_syn_recv.value 		= F2.default_tcp_timeout_syn_recv.value;
	F.tcp_timeout_eastablished.value 	= F2.default_tcp_timeout_eastablished.value;
	F.tcp_timeout_fin_wait.value 		= F2.default_tcp_timeout_fin_wait.value;
	F.tcp_timeout_close_wait.value 		= F2.default_tcp_timeout_close_wait.value;
	F.tcp_timeout_last_ack.value 		= F2.default_tcp_timeout_last_ack.value;
	F.tcp_timeout_time_wait.value 		= F2.default_tcp_timeout_time_wait.value;
	F.tcp_timeout_close_value.value 	= F2.default_tcp_timeout_close_value.value;
	F.udp_timeout.value 			= F2.default_udp_timeout.value;
	F.udp_timeout_stream.value 		= F2.default_udp_timeout_stream.value;
	F.icmp_timeout.value 			= F2.default_icmp_timeout.value;
	F.generic_timeout.value 		= F2.default_generic_timeout.value;
}


</script>
