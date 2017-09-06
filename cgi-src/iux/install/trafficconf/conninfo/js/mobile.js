//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;

var KILOBYTE = 1024;
var MEGABYTE = 1048576;
var GIGABYTE = 1073741824;

var listIndex;
//local-global variables end

//local utility functions
function convert_bytes(bytes)
{
	if(bytes > GIGABYTE)
		return (bytes / GIGABYTE).toFixed(1) + " GB";
	else if(bytes > MEGABYTE)
		return (bytes / MEGABYTE).toFixed(1) + " MB";
	else if(bytes > KILOBYTE)
		return (bytes / KILOBYTE).toFixed(1) + " KB";
	else
		return bytes + " B";
}

function graph_width_percentage(value, max)
{
	var width;

	if( value > max / 2)
        {
                width = 75;
		width += (value - max / 2) / (max / 2) * 25;
        }
        else if(value > max / 10)
        {
                width = 50;
		width += (value - max / 10 ) / (max / 2 - max / 10) * 25;
        }
        else if( value > (max/50))
        {
                width = 25;
		width += (value - max / 50 ) / (max / 10 - max / 50) * 25;
        }
        else
                width = value / (max/50) * 25;

	if(width < 0.5)
		width = 0.5;

	return width;
}

function append_main_line(index)
{
	var background = (index % 2 == 1)? 'lc_whitebox_div': 'lc_greenbox_div';

	var HTMLStr = '' +
		 '<div id = "lc_list_' + index + '" class="lc_list_div ' + background + '">' +
                 '       <div class="lc_desc_div">' +
                 '               <div class="lc_priority_div">' + 
                 '                       <div class="lc_line_div"></div>' + 
                 '                       <div class="lc_line_div"></div>' + 
                 '               </div>' +
                 '               <div class="lc_leftbox_div">' +
                 '                       <div class="lc_line_div">' + '</div>' +
                 '                       <div class="lc_line_div lc_grayfont_text">' + '</div>' +
                 '               </div>' +
                 '               <div class="lc_byte_div">' +
                 '                       <div class="lc_line_div">' +
                 '                               <p>' + '</p>' +
                 '                        </div>' +
                 '                        <div class="lc_line_div">' +
                 '                                <p>' + '</p>' +
                 '                        </div>' +
                 '               </div>' +
                 '               <div class="lc_packet_div">' +
                 '                       <div class="lc_line_div">' +
                 '                               <p>' + '</p>' +
                 '                       </div>' +
                 '                       <div class="lc_line_div">' +
                 '                               <p>' + '</p>' +
                 '                       </div>' +
                 '               </div>' +
                 '       </div>' +
                 '       <div class = "lc_graph_div">' +
                 '               <div class = "lc_unknown_div" ></div>' +
                 '               <div class = "lc_icmp_div" ></div>' +
                 '               <div class = "lc_udp_div" ></div>' +
                 '               <div class = "lc_tcp_div" ></div>' +
                 '               <div class = "lc_ptext_div lc_grayfont_text">' + '</div>' +
                 '       </div>' +
                 ' </div>' +
	'';
	$('#maincontent').append( bindEvents( $(HTMLStr).enhanceWithin() ) );
}

function update_list()
{
	for( var i = 0; i < status_data.list.length; ++i )
	{
		update_div( i );
	}
}

function update_div( index )
{
	var listDiv = $('#maincontent .lc_list_div:gt(0)').eq( index ),
		$ip = listDiv.find(".lc_desc_div .lc_leftbox_div .lc_line_div").eq(0),
		$hostname = listDiv.find(".lc_desc_div .lc_leftbox_div .lc_line_div").eq(1),
		$rxBytes = listDiv.find(".lc_desc_div .lc_byte_div .lc_line_div p").eq(0),
		$txBytes = listDiv.find(".lc_desc_div .lc_byte_div .lc_line_div p").eq(1),
		$rxPackets = listDiv.find(".lc_desc_div .lc_packet_div .lc_line_div p").eq(0),
		$txPackets = listDiv.find(".lc_desc_div .lc_packet_div .lc_line_div p").eq(1),
		$unknownGraph = listDiv.find(".lc_graph_div .lc_unknown_div"),
		$icmpGraph = listDiv.find(".lc_graph_div .lc_icmp_div"),
		$udpGraph = listDiv.find(".lc_graph_div .lc_udp_div"),
		$tcpGraph = listDiv.find(".lc_graph_div .lc_tcp_div"),
		$usageText = listDiv.find(".lc_graph_div .lc_ptext_div");

        var obj = status_data.list[index],
		max             = Number(config_data.conninfo.max),
		hostname        = obj.hostname,
		ip              = obj.ip,
		tcp_cnt         = Number(obj.tcp_cnt),
		udp_cnt         = Number(obj.udp_cnt),
		icmp_cnt        = Number(obj.icmp_cnt),
		unknown_cnt     = Number(obj.unknown_cnt),
		rx_pkts         = obj.rx_pkts,
		tx_pkts         = obj.tx_pkts,
		rx_bytes        = convert_bytes(obj.rx_bytes),
		tx_bytes        = convert_bytes(obj.tx_bytes);

	var sum = tcp_cnt + udp_cnt + icmp_cnt + unknown_cnt,
		sum_width = graph_width_percentage(sum, max),
		tcp_width = tcp_cnt / sum * sum_width,
		udp_width = udp_cnt / sum * sum_width + tcp_width,
		icmp_width = icmp_cnt / sum * sum_width + udp_width,
		unknown_width = unknown_cnt / sum * sum_width + icmp_width;

	var usage = (sum / max * 100).toFixed(2) + "%" + " (" + sum + ")";

	$ip.text( ip );
	$hostname.text( hostname );
	$rxBytes.text( rx_bytes );
	$txBytes.text( tx_bytes );
	$rxPackets.text( rx_pkts );
	$txPackets.text( tx_pkts );
	$unknownGraph.width( unknown_width + "%" );
	$icmpGraph.width( icmp_width + "%" );
	$udpGraph.width( udp_width + "%" );
	$tcpGraph.width( tcp_width + "%" );
	$usageText.text( usage );
}

function bindEvents( object )
{
	if(config_data.conninfo.canremove == "0")
		return object;

	object.on( "taphold", function(event) {
                $( event.target ).addClass( "taphold" );
                listIndex = $(this).attr('id').split('_')[2];
		events.confirm({ msg: M_lang['S_CONFIRM_MSG'], title: M_lang['S_CONFIRM_TITLE'], runFunc: function( flag ) {
			if( flag )
				submit_local('main');
		}});
        });
	return object;
}

function confirm_result_local(flag)
{
}
                                                        
function add_type_desc()
{
	var HTMLStr = '' +
		'<div>Unknown</div>' +
		'<div class = "unknown_block"></div>' +
		'<div>ICMP</div>' +
		'<div class = "icmp_block"></div>' +
		'<div>UDP</div>' +
		'<div class = "udp_block"></div>' +
		'<div>TCP</div>' +
		'<div class = "tcp_block"></div>' +
	'';
	$('#header_content_theme1 .PAGE_TITLE div .cc_rightheader_div').append(HTMLStr).enhanceWithin();
}

function assign_value()
{
	var connection_sum = [0, 0, 0, 0], sum, rpacket = 0, tpacket = 0, rbyte = 0, tbyte = 0;
	for(var i = 0; i < status_data.list.length; i++)
	{
		if(!status_data.list[i].ip)
			continue;
		connection_sum[0] += parseInt(status_data.list[i].tcp_cnt) 
		connection_sum[1] += parseInt(status_data.list[i].udp_cnt)
		connection_sum[2] += parseInt(status_data.list[i].icmp_cnt)
		connection_sum[3] += parseInt(status_data.list[i].unknown_cnt);

		rpacket += parseInt(status_data.list[i].rx_pkts);
		tpacket += parseInt(status_data.list[i].tx_pkts);
		rbyte += parseInt(status_data.list[i].rx_bytes);
		tbyte += parseInt(status_data.list[i].tx_bytes);
	}
	
	$('#lc_total_rpacket').text(rpacket);
	$('#lc_total_tpacket').text(tpacket);
	if(config_data.conninfo.usestatistics == "1")
	{
		rbyte = convert_bytes(rbyte);
		tbyte = convert_bytes(tbyte);
		$('#lc_total_rbyte').text(rbyte);
		$('#lc_total_tbyte').text(tbyte);

		$('.lc_packet_div, .lc_byte_div').css('display', '');
	}
	else
	{
		$('.lc_packet_div, .lc_byte_div').css('display', 'none');
	}

	sum = connection_sum[0] + connection_sum[1] + connection_sum[2] + connection_sum[3];
	$("[sid='TOTAL_CONNECTION']").text("(" + sum + " / " + config_data.conninfo.max + ")");
	
	var sum_width = graph_width_percentage(sum, config_data.conninfo.max),
	tcp_width = connection_sum[0] / sum * sum_width,
	udp_width = connection_sum[1] / sum * sum_width + tcp_width,
	icmp_width = connection_sum[2] / sum * sum_width + udp_width,
	unknown_width = connection_sum[3] / sum * sum_width + icmp_width;

	$('#maincontent >.lc_list_div:first .lc_graph_div .lc_unknown_div').css('width', unknown_width + '%');
	$('#maincontent >.lc_list_div:first .lc_graph_div .lc_icmp_div').css('width', icmp_width + '%');
	$('#maincontent >.lc_list_div:first .lc_graph_div .lc_udp_div').css('width', udp_width + '%');
	$('#maincontent >.lc_list_div:first .lc_graph_div .lc_tcp_div').css('width', tcp_width + '%');
	$('#maincontent >.lc_list_div:first .lc_graph_div .lc_ptext_div').text((sum / config_data.conninfo.max * 100).toFixed(2) + "%" + " (" + sum + ")");
}
//local utility functions end

iux_update_local_func['main'] = function(identifier)
{
	var currentLength = $('#maincontent .lc_list_div:gt(0)').length;
	for(var i = 0; i < status_data.list.length - currentLength - 1; i++)
	{
		append_main_line(i);
	}
	$('#maincontent .lc_list_div:gt(0)').filter(function(index){ return status_data.list.length - 1 <= index; }).remove();
	update_list();
	assign_value();
};

submit_local_func['main'] = function()
{
        var localdata = [];

        localdata.push({name : "ip", value : status_data.list[listIndex].ip});


        $('#loading').popup('open');
        return iux_submit('clear', localdata);
}

$(document).ready(function() {
	window.tmenu = "trafficconf";
	window.smenu = "conninfo";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu );
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();

	add_type_desc();
}

function result_config()
{
}

function result_submit( act, result )
{

}

function iux_set_onclick_local()
{
}

function iux_update_local(identifier)
{
	if( identifier == "C" )
	{
		if( status_data )
			iux_update_local_func["main"]();
	} else if( identifier == "D" )
	{
		if( config_data )
			iux_update_local_func["main"]();
	}
}

function listener_add_local(aname)
{
	add_listener_local_func[aname].call();
}

function submit_local(service_name, localdata)
{
	if(submit_local_func[service_name].call(this, localdata)){
		return true;
	}
	return false;
}

function load_rightpanel(_aname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
	$("#right_content").load(
		'html/'+_aname+'.html',
		function(responseTxt, statusTxt, xhr) 
		{
			if (statusTxt == "success") 
			{
				$(this).trigger('create');	
				load_header(RIGHT_HEADER, _aname);
				iux_update("C");
				iux_update("S");
				listener_add_local(_aname);
			}
			else
				alert("Error: " + xhr.status + "Not Found");
		});
}


