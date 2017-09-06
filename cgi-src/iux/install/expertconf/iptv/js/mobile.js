//local-global variables
var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];
var result_submit_func = [];

var regExp_onlynum = /^[0-9]*$/g;
var regExp_korspchar = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_spchar = /[\{\}\[\]\/,;:|\)*~`!^\-_+<>@\#$%\\\(\'\"]/g;
var regExp_ip = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
var regExp_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;

var confirm_menu = "";
var prevIGMP;
//local-global variables end

//local utility functions
function lock_object(object, proptype)
{
        object.prop(proptype, true);
        object.parent().addClass('ui-state-disabled');
}

function unlock_object(object, proptype)
{
        object.prop(proptype, false);
        object.parent().removeClass('ui-state-disabled');
}

function getGroupLength()
{
	return Object.keys(status_data.grouplist).length - 1;
}

function getMemberLength( groupIndex )
{
	return Object.keys( getGroupData( groupIndex ) ).length - 3;
}

function getGroupData( index )
{
	return status_data.grouplist[ "groupip" +  index ];
}

function getGroupDOM( groupIndex )
{
	return $("#right_main .lc_contents_div >div").eq( groupIndex );
}

function getGroupDivLength()
{
	return $("#contents_div >div").length;
}

function getMemberDivLength( group )
{
	if(typeof group !== "object")
		group = status_data[group];
	return $(group).children(".group_member_div").length;
}

function resizeGroupDiv()
{
	var groupLength = getGroupLength(),
		groupDivLength = getGroupDivLength();
	for(var i = 0; i < groupLength - groupDivLength; ++i)
		appendGroupDiv();
	if(groupLength == 0)
		$("#contents_div >div").remove();
	else	
		$("#contents_div >div:gt(" + Number(groupLength - 1) + ")").remove();
}

function resizeMemberDiv( groupIndex )
{
	var memberLength = getMemberLength( groupIndex),
		memberDivLength = getMemberDivLength( groupIndex ),
		groupDOM = getGroupDOM( groupIndex );
	for(var i = 0; i < memberLength - memberDivLength; ++i)
		appendMemberDiv( groupDOM );
	if(memberLength == 0)
		groupDOM.find(".group_member_div").remove();
	else	
		groupDOM.find(".group_member_div:gt(" + Number( memberLength - 1 ) + ")").remove();
}

function appendMemberDiv( groupDOM )
{
	groupDOM.append([
		'<div class="group_member_div">',
			'<div class="member_ip_div">',
				'<p class = "mcip_p"></p>',
			'</div>',
			'<div class="member_port_div">',
				'<p class = "mcip_p"></p>',
			'</div>',
			'<div class="member_status_div">',
				'<p class = "mcip_p"></p>',
			'</div>',
		'</div>'
	].join(""));
	
}

function appendGroupDiv()
{
	$( "#contents_div" ).append([
		'<div class="lc_group_div">',
			'<div class="group_ip_div">',
				'<p class = "mcip_p"></p>',
				'<p class = "mcmac_p"></p>',
			'</div>',
		'</div>'
	].join(""));
}

function updateGroupDiv( groupIndex )
{
	var group = getGroupDOM( groupIndex ),
		groupData = getGroupData( groupIndex);
	group.find(".group_ip_div p.mcip_p").text( groupData.mcip );
	group.find(".group_ip_div p.mcmac_p").text( "(" + groupData.mcmac + ")" );
	updateMemberDiv( groupIndex );
}

function updateMemberDiv( groupIndex )
{
	var memberArray = getGroupDOM( groupIndex ).children(".group_member_div"),
		groupData = getGroupData( groupIndex);
	for( var i = 0; i < memberArray.length; ++i )
	{
		var member = memberArray.eq( i );
		member.find(".member_ip_div p").text( groupData[ "member" + i ].ip );
		var portText = groupData[ "member" + i ].port;
		if(portText === "wireless")
			portText = M_lang["S_MEMBER_STATE1"];
		member.find(".member_port_div p").text( portText );
		member.find(".member_status_div p").text( groupData[ "member" + i ]["status"] );
	}
}

function updateStatusData()
{
	resizeGroupDiv();

	var groupLength = getGroupLength();
	for( var i = 0; i < groupLength; ++i )
	{
		resizeMemberDiv( i );
		updateGroupDiv( i );
	}
}

function GroupHTML()
{
	var groupDiv = $("<div>").attr("class", "lc_group_div");
	groupDiv.innerHTML([
		'<div class="group_ip_div">',
			'<p class = "mcip_p"></p>',
			'<p class = "mcmac_p"></p>',
		'</div>'
	].join(""));
}

function MemberHTML()
{
	groupDiv.find(".group_member_div").innerHTML([
		'<div class="member_ip_div">',
			'<p class = "mcip_p"></p>',
		'</div>',
		'<div class="member_port_div">',
			'<p class = "mcip_p"></p>',
		'</div>',
		'<div class="member_status_div">',
			'<p class = "mcip_p"></p>',
		'</div>'
	].join(""));
}

function immediately_submit_event_add(service_name, sid)
{
        $('[sid = "' + sid + '"]').change(function(){
		submit_local(service_name);
        });
}

function reboot_submit(service_name, localdata)
{
        if(!service_name.match(regExp_spchar)){
                var remaining = parseInt(config_data[service_name].rebootsec);
                iux_submit(service_name, localdata);

                if( service_name === 'igmp' && status_data.igmp.menu == "1" )
                        remaining += 20;
                reboot_timer(remaining);
		stopstatus = true;
                $('#loading_reboot').popup('open');
        }
}

function reboot_timer(remaining)
{
        if(remaining == 0){
                $('#loading_reboot').popup('close');
                location.reload();
        }
        else{
                $('[sid="REBOOT_MSG"]').text(M_lang['S_REBOOT_REMAINING_MSG1'] + remaining + M_lang['S_REBOOT_REMAINING_MSG2']);
                remaining --;
                setTimeout("reboot_timer("+remaining+")",1000);
        }
}

//local utility functions end
iux_update_local_func['grouplist'] = function(identifier)
{
        if(identifier != "D")
		return;

	updateStatusData()
};

iux_update_local_func['igmp'] = function(identifier)
{
	if( !identifier && config_data.igmp.portnumber )
	{
		$('[sid="IGMP_MENU2"]').text( M_lang["S_IGMP_MENU2"] + M_lang["S_IGMP_TEXT1"] + config_data.igmp.portnumber + M_lang["S_IGMP_TEXT2"] );
	}
	if( !status_data || !status_data.igmp || !status_data.igmp.menu || ( prevIGMP == status_data.igmp.menu && $("input[name='menu']:checked").length  == 1 ) )
		return;
	prevIGMP = status_data.igmp.menu;
	if(status_data.igmp.menu == 0)
		$('#not_use').prop('checked', true);
	else if(status_data.igmp.menu == 1)
		$('#igmp_kt').prop('checked', true);
	else if(status_data.igmp.menu == 2)
		$('#igmp_skt_lgu').prop('checked', true);
	$("input[type='radio']").checkboxradio('refresh');
};

submit_local_func['igmp'] = function()
{
        if( config_data.igmp.mustreboot || status_data.igmp.menu == "1" || $('[sid="IGMP_MENU"]:checked').val() == 1 )
        {
		confirm_menu = "reboot";
                confirm(M_lang['S_REBOOT_ALERT_MSG']);
                return false;
        }
        $('#loading').popup('open');
        return iux_submit('igmp');
};

add_listener_local_func['igmp'] = function()
{
        immediately_submit_event_add('igmp', 'IGMP_MENU');
};


function confirm_result_local(flag)
{
        if(!flag)
	{
		$("input[name='menu']:checked").prop("checked", false);
		iux_update("C");
		iux_update_local();
                return;
	}
	if(confirm_menu == "reboot")
	{
		confirm_menu = "";
                reboot_submit('igmp');
	}
}

$(document).ready(function() {
	window.tmenu = "expertconf";
	window.smenu = "iptv";
	
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);
});

function loadLocalPage()
{
	if( !config_data.igmp.portnumber )
	{
		$("form >div").eq(2).remove();
                $("form >div").eq(1).find("[sid=S_IGMP_MENU3]").attr("sid", "S_IGMP_MENU4").text(M_lang["S_IGMP_MENU4"]);
	}
	iux_update_local();
	iux_set_onclick_local();

	if( config_data.igmp.cangetlist === "1" )
	{
		GetGroupList();
	} 
	else
	{
		$('#groupListDiv').remove();
	}
}

function result_config()
{
}

function iux_set_onclick_local()
{
	listener_add_local();
}

function iux_update_local(identifier)
{
	iux_update_local_func['igmp']( identifier );
}

function listener_add_local()
{
        for(var articleName in config_data)
        {
                if(!config_data.hasOwnProperty(articleName) || articleName == "")
                        continue;

                var caller_func = add_listener_local_func[articleName];
                if(caller_func) caller_func.call();
        }

	$('#groupListDiv').click(function()
	{
		load_rightpanel("grouplist");
		$("#right_panel").panel("open");	
	});
}

function submit_local(service_name, localdata)
{
	submit_local_func[service_name].call(this, localdata);
}

function result_submit(act, result)
{
        if(errorcode != "0")
        {
                alert(M_lang['S_UNKNOWN_ERROR_MSG'] + "(" + errorcode + ")");
        }
        if(result_submit_func[act])
                result_submit_func[act].call(this, result);
        iux_update('C');
        iux_update_local();
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
                        }
                        else
                                alert("Error: " + xhr.status + "Not Found");
                });
}

function GetGroupList()
{
	var $data, $elements = [], $content, stopStatus;

        $(document).on("panelopen", "#right_panel", loadPanel.bind(this) );
        $(document).on("panelclose", "#right_panel", closePanel.bind(this) );
        $(document).on("updatedStatusData", iux_update_local_func['grouplist'] );

	function loadPanel ()
	{
		content = $("#contents_div");
		stopStatus = false;
		getListData( window.tmenu, window.smenu, 2000 );
	}
	function closePanel ()
	{
		stopStatus = true;
	}
	function getListData ( _tmenu, _smenu, _retime )
	{
		$.ajaxSetup({async : true, timeout : 4000});
		var _data = [];
		_data.push({ name : "tmenu", value : _tmenu });
		_data.push({ name : "smenu", value : _smenu });
		_data.push({ name : "act", value : "status2" });

		$.getJSON('/cgi/iux_get.cgi', _data)
		.done(function(data) {
			if(json_validate(data, '') == true)
			{
				status_data = data;
				iux_update("D");
				$( document ).trigger("updatedStatusData");
			}
		})
		.fail(function(jqxhr, textStatus, error) {
		})
		.always(function() {
			setTimeout(function( _tm, _sm, _rt ){
				if(stopStatus)
					return;
				getListData( _tm, _sm, _rt );
			}, _retime || 2000, _tmenu, _smenu, _retime );
		});
	}
}


