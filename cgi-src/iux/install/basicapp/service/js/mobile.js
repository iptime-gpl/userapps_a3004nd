// JavaScript Document
var L_MYSQL_PORT = 3306;
var L_URL_PORT = 8000;
var L_RSYNC_PORT = 1873;
var L_TORRENT_PORT = 9091;
var L_FTP_PORT = 21;
var L_FTP_IPDISKPORT = 9000;
var L_APACHE_PORT = 8080;
var MAX_USER = 5;

var iux_update_local_func = [];
var add_listener_local_func = [];
var submit_local_func = [];

var confirm_mode = null;
var confirm_data = null;

var closePanelFlag = 0;
events.on("panelbeforeopen", function() {
	++closePanelFlag;
});
/*----------template func--------------
iux_update_local_func[anme] = function(id) {};
add_listener_local_func[anme] = function(addoption, bvalue){};
submit_local_func[anme] = function(localpostdata){};*/

function confirm_result_local(flag)
{
	if(flag){
		if(confirm_mode == 'ipdisk'){
			$("#loading").popup("open");
			iux_submit('ipdisk', confirm_data);
		}
	}else{
		if(confirm_mode == 'ipdisk'){
			iux_update("C");
		}
	}
	confirm_mode = null;	confirm_data = null;
}

/*----------ipdisk start func----------*/
iux_update_local_func['ipdisk'] = function(id) 
{
	if(!id) return config_data.ipdisk.hostname + ".ipdisk.co.kr";
};

add_listener_local_func['ipdisk'] = function(addoption, bvalue)
{
};

submit_local_func['ipdisk'] = function(localpostdata)
{
	if(localpostdata)
	{
		if(config_data.ipdisk.run == 1 && $('[sid="C_IPDISK_RUN"]:checked').val() == 0)
		{
			window.confirm(M_lang["S_IPDISK_SERVICE_STOP_CONFIRM"]);
			confirm_mode = 'ipdisk';	confirm_data = localpostdata;
		}
	}
	else {
		if( !check_input_error("C_IPDISK_HOSTNAME", regExp_text) && !check_input_error("C_IPDISK_EMAIL", regExp_email) )
		return true;
	}
	return false;
};

function make_folderlist(sid, val)
{
	if(!sid)	return;
	$("[sid=\""+sid+"\"]").append("<option value=''>" + M_lang['S_FOLDER_ALL_SELECTED'] + "</option>");
	for(var i = 0; i < config_data.mount.datafolder.length; i++)
	{
		if(config_data.mount.datafolder[i].value != "")
		$("[sid=\""+sid+"\"]")
			.append("<option value='" + config_data.mount.datafolder[i].value.replace(/\//,':') + "'>" 
				+ config_data.mount.datafolder[i].text + "</option>");
	}
	$("[sid=\""+sid+"\"]").attr('value', val).val(val).selectmenu('refresh', true);
}

/*----------ftp start func----------*/
iux_update_local_func['ftp'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			status_control_checkbox(bvalue ,"C_FTP_PORT");
			status_control_checkbox(bvalue, "C_FTP_IPDISKPORT");
			for ( var i=0; i<MAX_USER; i++ )
			{
				if( $('[sid="C_FTP_USERPROPERTY'+i+'"]').val() == "off" )
				{
					status_control_enable(false, "C_FTP_USERID"+i);
					status_control_enable(false, "C_FTP_PASSWD"+i);
					status_control_enable(false, "PASSWD_VISIBLE"+i);
					if(config_data.ftp.usefolder)
						status_control_enable(false, "C_FTP_FOLDER"+i);
				}
				else
					status_control_enable(bvalue, "PASSWD_VISIBLE"+i);

				if(config_data.ftp.usefolder){
					make_folderlist("C_FTP_FOLDER"+i, config_data.ftp['folder'+i]);
				}
			}
			if( config_data.afp )
				$("#right_content div.lc_user_desc").show();
			if( !config_data.ftp.usefolder )
				$("[sid=\"M_DATAFOLDER\"]").remove();
			break;
		default:
			var Statustxt = "ftp://" + config_data.ftp.hostname;
			return Statustxt;
	}
};

add_listener_local_func['ftp'] = function(addoption, bvalue)
{
	if(addoption == "run")
	{
		var dvalue;
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_FTP_PORT");
		$('[name="defaultipdiskport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_FTP_IPDISKPORT");
		if(bvalue == 1) {
			$("[sid^='C_']").each(function()
			{
				if(($(this).attr("type") == "select") && ($(this).attr('name').indexOf('userproperty') != -1))
				{
					var enable;
					var name = $(this).attr("name");
					var nIndex = name.substring(name.length - 1); 
					$('option:selected',this).val() == "off" ? enable = false : enable = true;
					status_control_enable(enable, "C_FTP_USERID"+nIndex);
					status_control_enable(enable, "C_FTP_PASSWD"+nIndex);
					status_control_enable(enable, "PASSWD_VISIBLE"+nIndex); 
					if(config_data.ftp.usefolder)
						status_control_enable(enable, "C_FTP_FOLDER"+nIndex);
				}
			});
		}
	}
	else
	{
		for (var i = 0;i < 5 ;i++ )
		{
			ctrlmgr_password_visible("PASSWD_VISIBLE"+i, "C_FTP_PASSWD"+i);
			ctrlmgr_arrayuser(i, "ftp");
		}
		ctrlmgr_defaultvalue("C_FTP_PORT");
		ctrlmgr_defaultvalue("C_FTP_IPDISKPORT");
	}
};

submit_local_func['ftp'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		var result1 = false;
		var result2 = true;
		if( !check_input_error("C_FTP_PORT", regExp_port) && !check_input_error("C_FTP_IPDISKPORT", regExp_port) )
			result1 = true;
		for(var i=0; i<MAX_USER; i ++)
		{
			if(check_input_error("C_FTP_USERID"+i, regExp_text))
			{
				result2 = false; break;
			}		
		}
		if(result1 && result2) return true;
	}
	return false;
};

iux_update_local_func['afp'] = function(id, bvalue)
{
        switch(id)
        {
                case 'C':
                        for ( var i=0; i<MAX_USER; i++ )
                        {
                                if( $('[sid="C_AFP_USERPROPERTY'+i+'"]').val() == "off" )
                                {
                                        status_control_enable(false, "C_AFP_USERID"+i);
                                        status_control_enable(false, "C_AFP_PASSWD"+i);
                                        status_control_enable(false, "PASSWD_VISIBLE"+i);
					if(config_data.afp.usefolder)
						status_control_enable(false, "C_AFP_FOLDER"+i);
                                }
                                else
                                        status_control_enable(bvalue, "PASSWD_VISIBLE"+i);

				if(config_data.afp.usefolder){
					make_folderlist("C_AFP_FOLDER"+i, config_data.afp['folder'+i]);
				}
                        }
			if( config_data.ftp )
				$("#right_content div.lc_user_desc").show();
			if( !config_data.afp.usefolder )
				$("[sid=\"M_DATAFOLDER\"]").remove();
                        break;
                default:
                        var Statustxt = config_data.afp.name;
                        return Statustxt;
        }
};

add_listener_local_func['afp'] = function(addoption, bvalue)
{
        if(addoption == "run")
        {
                if(bvalue == 1) {
                        $("[sid^='C_']").each(function()
                        {
				if(($(this).attr("type") == "select") && ($(this).attr('name').indexOf('userproperty') != -1))
                                {
                                        var enable;
                                        var name = $(this).attr("name");
                                        var nIndex = name.substring(name.length - 1);
                                        $('option:selected',this).val() == "off" ? enable = false : enable = true;
                                        status_control_enable(enable, "C_AFP_USERID"+nIndex);
                                        status_control_enable(enable, "C_AFP_PASSWD"+nIndex);
                                        status_control_enable(enable, "PASSWD_VISIBLE"+nIndex);
					if(config_data.afp.usefolder)
						status_control_enable(enable, "C_AFP_FOLDER"+nIndex);
                                }
                        });
                }
        }
        else
        {
                for (var i = 0;i < 5 ;i++ )
                {
                        ctrlmgr_password_visible("PASSWD_VISIBLE"+i, "C_AFP_PASSWD"+i);
                        ctrlmgr_arrayuser(i, "afp");
                }
        }
};

submit_local_func['afp'] = function(localpostdata)
{
        if(localpostdata)
                return true;
        else
        {
		if( check_input_error("C_AFP_NAME", regExp_text) )
			return false;
                for(var i=0; i<MAX_USER; i ++)
                {
                        if(check_input_error("C_AFP_USERID"+i, regExp_text))
				return false;
                }
        }
        return true;
};

function displayPluginAppPanel( service )
{
	if( !config_data || !config_data[service] || !status_data || status_data[service].install_state === undefined )
		return;

	if( status_data[service].status.indexOf("NOT_INSTALLED") === -1 )
	{
		$("#right_content div.plugin_install").remove();
		return;
	}
	$("#right_content div.plugin_setup").remove();
	$("#right_content div.plugin_install").show();
	if( needLoadingImg( status_data[service].install_state ) )
	{
		$("#right_main div.plugin_install").html([
			"<p>",
				M_lang["S_INSTALLING1"],
			"</p>",
			"<p>",
				M_lang["S_INSTALLING2"],
			"</p>",

		].join("")).enhanceWithin();
		$("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").remove();
		var flag = closePanelFlag;
		setTimeout(function() {
			if( flag === closePanelFlag )
				$("#right_panel").panel("close");
		}, 2000);
	}
	else if( status_data[service].install_state.indexOf("ERR_") != -1 )
	{
		
		$("#right_main div.plugin_install").html([
			"<p>", 
				M_lang[ "S_" + status_data[service].install_state + "_PANEL" ],
				$("#right_header p").text(),
				M_lang["S_ERR_POSTFIX"],
			"</p>",
		].join("")).enhanceWithin();
		$("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").remove();
	}
	else
	{
		var descText = [
			"<p>", 
				M_lang["S_PLUGIN_INSTALL1"],
				$("#right_header p").text(),
				M_lang["S_PLUGIN_INSTALL2"],
			"</p>",
		];
		if( status_data[service].status === "NOT_INSTALLED_FS" )
			descText.push([
			"<p>", 
				M_lang["S_PLUGIN_INSTALL3"],
			"</p>",
			].join(""));
		descText.push([
			"<p>", 
				"(", M_lang["S_PLUGIN_INSTALL4"], " : /HDD1/", config_data[service].productid, "_plugin)",
			"</p>"
		].join(""));
		$("#right_main div.plugin_install").html(descText.join("")).enhanceWithin();
		$("#right_content [sid=S_PLUGIN_INSTALL]").val(	M_lang["S_PLUGIN_BUTTON1"] );
	}
}

function displayPluginAppState( service )
{
	if( status_data[service].install_state === undefined || !config_data )
		return;
	$("#" + service + " div.line_value img").remove();
	if( status_data[service].status.indexOf("NOT_INSTALLED") === 0 && status_data[service].install_state !== "" )
	{
		$("#" + service + " p[sid=" + service.toUpperCase() + "_VALUE]").text(M_lang[ "S_" + status_data[service].install_state]);
		if( needLoadingImg( status_data[service].install_state ))
			$("#" + service + " p[sid=" + service.toUpperCase() + "_VALUE]").after('<img src="/common/images/loading.gif">');
	}
	else if( status_data[service].status === "STARTED_STATUS" )
	{
		var msg;
		if( service === "samba" )
			msg = "\\\\" + config_data[service].name;
		else if( service === "torrent" )
			msg = "http://" +  config_data.torrent.hostname + ":" + config_data.torrent.port;
		else if( service === "media" )
			msg = config_data.media.name + ", " + config_data.media.datafolder;
		else
			msg = "";
		$("#" + service + " p[sid=" + service.toUpperCase() + "_VALUE]").text( msg );
	}
	else
		$("#" + service + " p[sid=" + service.toUpperCase() + "_VALUE]").text("");
}

function needLoadingImg( state )
{
	if( state === "PLUGIN_STATUS_START_INSTALL_TXT"
		|| state === "PLUGIN_STATUS_START_UPDATE_TXT"
		|| state === "PLUGIN_STATUS_START_REMOVE_TXT"
		|| state === "PLUGIN_STATUS_ISNTALLING_TXT"
		|| state === "PLUGIN_STATUS_UPDATING_TXT"
		|| state === "PLUGIN_STATUS_REMOVING_TXT" )
		return true;
	return false;
}

/*----------samba start func----------*/
iux_update_local_func['samba'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			displayPluginAppPanel( "samba" );
			for ( var i=0; i<MAX_USER; i++ )
			{
				if( $('[sid="C_SAMBA_USERPROPERTY'+i+'"]').val() == "off" )
				{
					status_control_enable(false, "C_SAMBA_USERID"+i);
					status_control_enable(false, "C_SAMBA_PASSWD"+i);
					status_control_enable(false, "PASSWD_VISIBLE"+i);
					if(config_data.samba.usefolder)
						status_control_enable(false, "C_SAMBA_FOLDER"+i);
				}
				else
					status_control_enable(bvalue, "PASSWD_VISIBLE"+i);

				if(config_data.samba.usefolder){
					make_folderlist("C_SAMBA_FOLDER"+i, config_data.samba['folder'+i]);
				}
			}
			if( !config_data.samba.usefolder )
				$("[sid=\"M_DATAFOLDER\"]").remove();
			break;
		case 'D':
			displayPluginAppState( "samba" );
			break;
		default:
			var Statustxt = "\\\\" + config_data.samba.name;
			return Statustxt;
	}
};

add_listener_local_func['samba'] = function(addoption, bvalue)
{
	if(addoption == "run")
	{
		$("[sid^='C_']").each(function()
		{
			if(($(this).attr("type") == "select") && ($(this).attr('name').indexOf('userproperty') != -1))
			{
				var enable;
				var name = $(this).attr("name");
				var nIndex = name.substring(name.length - 1); 
				$('option:selected',this).val() == "off" ? enable = false : enable = true;
				status_control_enable(enable, "C_SAMBA_USERID"+nIndex);
				status_control_enable(enable, "C_SAMBA_PASSWD"+nIndex);
				status_control_enable(enable, "PASSWD_VISIBLE"+nIndex);
				if(config_data.samba.usefolder)
					status_control_enable(enable, "C_SAMBA_FOLDER"+nIndex);
			}
		});
	}
	else
	{
		for (var i = 0;i < 5 ;i++ )
		{
			ctrlmgr_password_visible("PASSWD_VISIBLE"+i, "C_SAMBA_PASSWD"+i);
			ctrlmgr_arrayuser(i, "samba");
		}
	}
	$("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").click(function() {
		var localpostdata = [];
		localpostdata.push({name : "installsamba", value : 1});
		submit_local("samba", localpostdata);
		$("#right_panel").panel("close");
		$(this).unbind("click");
	});
};

submit_local_func['samba'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		var result1 = false;
		var result2 = true;
		if( !check_input_error("C_SAMBA_NAME", regExp_text) && !check_input_error("C_SAMBA_GROUP", regExp_text) )
			result1 = true;
		for(var i=0; i<MAX_USER; i ++)
		{
			if( check_input_error("C_SAMBA_USERID"+i, regExp_text))
				{result2 = false; break;}
		}
		if(result1 && result2) return true;
	}
	return false;
};

/*----------apache start func----------*/
iux_update_local_func['apache'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			insert_apache_serverfolder();
			insert_hddlist("C_APACHE_DATAFOLDER");
			insert_hddlist("C_APACHE_SERVERFOLDER");
			status_control_visible (false, "L_APACHE_DATAFOLDER" ); 
			status_control_visible (false, "L_APACHE_SERVERFOLDER" );
			status_control_checkbox(bvalue ,"C_APACHE_PORT");
			insertDefaultOption( 'apache' )
			break;
		default:
			var Statustxt = "http://" + config_data.apache.hostname + ":" + config_data.apache.port;
			return Statustxt;		
	}
};

add_listener_local_func['apache'] = function(addoption, bvalue)
{
	var dvalue;
	if(addoption == "run")
	{
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_APACHE_PORT");
	}
	else
	{
		ctrlmgr_defaultvalue("C_APACHE_PORT");
		ctrlmgr_dirselect("C_APACHE_DATAFOLDER");
		ctrlmgr_dirselect("C_APACHE_SERVERFOLDER");
	}
};

submit_local_func['apache'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		if( !check_input_error("C_APACHE_PORT", regExp_port) && !check_input_error("L_APACHE_DATAFOLDER", regExp_kor) &&
		!check_input_error("C_APACHE_DATAFOLDER") && !check_input_error("L_APACHE_SERVERFOLDER", regExp_kor) && 
		!check_input_error("C_APACHE_SERVERFOLDER") )
		{
			insert_postdata_datafolder("L_APACHE_DATAFOLDER");
			insert_postdata_datafolder("L_APACHE_SERVERFOLDER");
			return true;
		}
	}
	return false;
};

/*----------mysql start func----------*/
iux_update_local_func['mysql'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			insert_hddlist("C_MYSQL_DATAFOLDER");
			status_control_visible(false, "L_MYSQL_DATAFOLDER" ); 
			status_control_checkbox(bvalue ,"C_MYSQL_PORT");
			status_control_checkbox(bvalue, "C_MYSQL_CLIENTUSESERVERCHAR");
			status_control_checkbox(bvalue, "C_MYSQL_CHARCASE");
			status_selectmenu_item("C_MYSQL_CHARSET");
			insertDefaultOption( 'mysql' )
			break;
		default:
			var Statustxt = "Port : " + config_data.mysql.port;
			return Statustxt;			
	}
};

add_listener_local_func['mysql'] = function(addoption, bvalue)
{
	var dvalue;
	if(addoption == "run")
	{
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_MYSQL_PORT");
	}
	else
	{
		ctrlmgr_defaultvalue("C_MYSQL_PORT");
		ctrlmgr_dirselect("C_MYSQL_DATAFOLDER");
	}
};

submit_local_func['mysql'] = function(localpostdata)
{
	if(localpostdata) { return true; }
	else
	{
		if( !check_input_error("C_MYSQL_PORT", regExp_port) && !check_input_error("C_MYSQL_MAXALLOWPACKET", regExp_map) &&
		!check_input_error("L_MYSQL_DATAFOLDER", regExp_kor) && !check_input_error("C_MYSQL_DATAFOLDER") )
		{
			insert_postdata_datafolder("L_MYSQL_DATAFOLDER");
			return true;
		}
	}
	return false;	
};

/*----------torrent start func----------*/
iux_update_local_func['torrent'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			displayPluginAppPanel( "torrent" );
			insert_hddlist("C_TORRENT_DATAFOLDER");
			status_control_checkbox(bvalue ,"C_TORRENT_PORT");
			status_control_enable(bvalue, "PASSWD_VISIBLE");
			status_control_visible (false, "L_TORRENT_DATAFOLDER" );
			insertDefaultOption( 'torrent' )
			break;
		case 'D':
			displayPluginAppState( "torrent" );
			break;
		default:
			var Statustxt = "http://" +  config_data.torrent.hostname + ":" + config_data.torrent.port;
			return Statustxt;	
	}
};

add_listener_local_func['torrent'] = function(addoption, bvalue)
{
	var dvalue;
	if(addoption == "run")
	{
		status_control_enable(bvalue, "PASSWD_VISIBLE");
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_TORRENT_PORT");
	} else 
	{
		ctrlmgr_defaultvalue("C_TORRENT_PORT");
		ctrlmgr_dirselect("C_TORRENT_DATAFOLDER");
		ctrlmgr_password_visible("PASSWD_VISIBLE", "C_TORRENT_PASSWD");
	}
	$("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").click(function() {
                var localpostdata = [];
                localpostdata.push({name : "installtorrent", value : 1});
                submit_local("torrent", localpostdata);
                $("#right_panel").panel("close");
                $(this).unbind("click");
        });

};

submit_local_func['torrent'] = function(localpostdata)
{
	if(localpostdata) { return true; }
	else
	{
		if( !check_input_error("C_TORRENT_USERID", regExp_text) &&
			!check_input_error("C_TORRENT_PORT", regExp_port) && !check_input_error("L_TORRENT_DATAFOLDER", regExp_kor) &&
			!check_input_error("C_TORRENT_DATAFOLDER") ) 
		{
			insert_postdata_datafolder("L_TORRENT_DATAFOLDER")
			return true;
		}
	}
	return false;
};

/*----------media start func----------*/
iux_update_local_func['media'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			displayPluginAppPanel( "media" );
			insert_hddlist("C_MEDIA_DATAFOLDER");
			status_control_enable(bvalue,"S_BUTTON_UPDATE");
			status_control_visible(false, "L_MEDIA_DATAFOLDER");
			if(config_data.media.hardname == "") $('[sid="S_MEDIADB_DIR"]').text("--");
			else $('[sid="S_MEDIADB_DIR"]').text("/" + config_data.media.hardname + "/" + "MediaDB");
			var time = config_data.media.realtime;
			if(config_data.media.realtime == "none")
				$('[sid="S_MEDIA_REALTIME"]').text("(-)");
			else
				$('[sid="S_MEDIA_REALTIME"]').text(config_data.media.realtime);
			insertDefaultOption( 'media' )
			break;
		case 'D':
			displayPluginAppState( "media" );
			break;
		default:
			var Statustxt = config_data.media.name + ", " + config_data.media.datafolder;
			return Statustxt;		
	}
};

add_listener_local_func['media'] = function(addoption, bvalue)
{
	ctrlmgr_dirselect("C_MEDIA_DATAFOLDER");
	$('[sid="S_BUTTON_UPDATE"]').click(function()
	{
		var localpostdata = [];
		localpostdata.push({name : "updatedatadb", value : 1});
		submit_local("media", localpostdata);
	});
        $("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").click(function() {
                var localpostdata = [];
                localpostdata.push({name : "installmedia", value : 1});
                submit_local("media", localpostdata);
                $("#right_panel").panel("close");
                $(this).unbind("click");
        });
};

submit_local_func['media'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		update_button_postdata =[];
		if( !check_input_error("C_MEDIA_NAME", regExp_text) && !check_input_error("L_MEDIA_DATAFOLDER", regExp_kor) &&
			!check_input_error("C_MEDIA_DATAFOLDER") )
		{
			insert_postdata_datafolder("L_MEDIA_DATAFOLDER");
			return true;
		}
	}
	return false;
};

iux_update_local_func['itunes'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			displayPluginAppPanel( "itunes" );
			insert_hddlist("C_ITUNES_DATAFOLDER");
			status_control_enable(bvalue,"S_BUTTON_UPDATE");
			status_control_visible(false, "L_ITUNES_DATAFOLDER");
			if(config_data.itunes.hardname == "") $('[sid="S_ITUNESDB_DIR"]').text("--");
			else $('[sid="S_MEDIADB_DIR"]').text("/" + config_data.itunes.hardname + "/" + "MediaDB");
			var time = config_data.itunes.realtime;
			if(config_data.itunes.realtime == "none")
				$('[sid="S_ITUNES_REALTIME"]').text("(-)");
			else
				$('[sid="S_ITUNES_REALTIME"]').text(config_data.itunes.realtime);
			insertDefaultOption( 'itunes' )
			break;
		case 'D':
			displayPluginAppState( "itunes" );
			break;
		default:
			return config_data.itunes.name + ", " + config_data.itunes.datafolder;
	}
};

add_listener_local_func['itunes'] = function(addoption, bvalue)
{
	ctrlmgr_dirselect("C_ITUNES_DATAFOLDER");
	$('[sid="S_BUTTON_UPDATE"]').click(function()
	{
		var localpostdata = [];
		localpostdata.push({name : "updatedatadb", value : 1});
		submit_local("itunes", localpostdata);
	});
        $("#right_content .plugin_install input[sid='S_PLUGIN_INSTALL']").click(function() {
                var localpostdata = [];
                localpostdata.push({name : "installtunes", value : 1});
                submit_local("itunes", localpostdata);
                $("#right_panel").panel("close");
                $(this).unbind("click");
        });
};

submit_local_func['itunes'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		update_button_postdata =[];
		if( !check_input_error("C_ITUNES_NAME", regExp_text) && !check_input_error("L_ITUNES_DATAFOLDER", regExp_kor) &&
			!check_input_error("C_ITUNES_DATAFOLDER") )
		{
			insert_postdata_datafolder("L_ITUNES_DATAFOLDER");
			return true;
		}
	}
	return false;
};

/*----------rsync start func----------*/
iux_update_local_func['rsync'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			insert_hddlist("C_RSYNC_DATAFOLDER");
			status_control_checkbox(bvalue ,"C_RSYNC_PORT");
			status_control_enable(bvalue, "PASSWD_VISIBLE");
			status_control_visible(false, "L_RSYNC_DATAFOLDER" );
			insertDefaultOption( 'rsync' )
			break;
		default:
			if(config_data.rsync.datafolder && config_data.rsync.datafolder.length != 0)
			{
				var s_datafolder = config_data.rsync.datafolder.split("/");							
				var Statustxt = "http://" + config_data.rsync.hostname + ":" + config_data.rsync.port + "/" + s_datafolder[1];
			}
			return Statustxt;
	}
};

add_listener_local_func['rsync'] = function(addoption, bvalue)
{
	var dvalue;
	if(addoption == "run")
	{
		status_control_enable(bvalue, "PASSWD_VISIBLE");	
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_RSYNC_PORT");
	} 
	else
	{
		ctrlmgr_defaultvalue("C_RSYNC_PORT");
		ctrlmgr_dirselect("C_RSYNC_DATAFOLDER");
		ctrlmgr_password_visible("PASSWD_VISIBLE", "C_RSYNC_PASSWD");
	}
};

submit_local_func['rsync'] = function(localpostdata)
{
	if(localpostdata) { return true; }
	else
	{
		if( !check_input_error("C_RSYNC_USERID", regExp_text) &&
		!check_input_error("C_RSYNC_PORT", regExp_port) && !check_input_error("L_RSYNC_DATAFOLDER", regExp_kor) &&
		!check_input_error("C_RSYNC_DATAFOLDER") )
		{
			insert_postdata_datafolder("L_RSYNC_DATAFOLDER");
			return true;
		}
	}
	return false;
};

/*----------url start func----------*/
iux_update_local_func['url'] = function(id, bvalue)
{
	switch(id)
	{
		case 'C':
			status_control_enable(bvalue, "PASSWD_VISIBLE");
			var authstatus;
			bvalue == 1 ? authstatus = $('[name="' + $('[sid="C_URL_ENABLEAUTH"]').attr('name') + '"]:checked').val()
				: authstatus = bvalue;
			status_control_enable(authstatus, "C_URL_USERID");
			status_control_enable(authstatus, "C_URL_PASSWD");
			status_control_enable(authstatus, "PASSWD_VISIBLE");
			status_control_checkbox(bvalue ,"C_URL_PORT");
			break;
		default:
			var Statustxt = "http://" + config_data.url.hostname + ":" + config_data.url.port + "/list";
			return Statustxt;
	}
};

add_listener_local_func['url'] = function(addoption, bvalue)
{
	var dvalue;
	if(addoption == "run") 
	{
		status_control_enable(bvalue, "PASSWD_VISIBLE");
		$('[name="defaultport"]:checked').val() == 1 ? dvalue = false : dvalue = true;
			status_control_enable(dvalue, "C_URL_PORT");
		var authstatus = $('[name="' + $('[sid="C_URL_ENABLEAUTH"]').attr('name') + '"]:checked').val();
		status_control_enable(authstatus, "C_URL_USERID");
		status_control_enable(authstatus, "C_URL_PASSWD");
		status_control_enable(authstatus, "PASSWD_VISIBLE");
	} 
	else
	{
		$('[sid="C_URL_ENABLEAUTH"]').unbind();
		$('[sid="C_URL_ENABLEAUTH"]').change(function(){
			var bvalue = $('[name="'+$('[sid="C_URL_ENABLEAUTH"]').attr('name') + '"]:checked').val();
			if(!bvalue) bvalue = 0;
			status_control_enable(bvalue, "C_URL_USERID");
			status_control_enable(bvalue, "C_URL_PASSWD");
			status_control_enable(bvalue, "PASSWD_VISIBLE");
			check_change_value() ? status_control_enable(true, "S_BUTTON_SUBMIT") :
				status_control_enable(false, "S_BUTTON_SUBMIT");
		});
		ctrlmgr_defaultvalue("C_URL_PORT");
		ctrlmgr_password_visible("PASSWD_VISIBLE", "C_URL_PASSWD");
	}
};

submit_local_func['url'] = function(localpostdata)
{
	if(localpostdata)
		return true;
	else
	{
		if( !check_input_error("C_URL_USERID", regExp_text) &&
		!check_input_error("C_URL_PORT", regExp_port) )		
		return true;
	}
	return false;
};

/*----------tethering start func----------*/
iux_update_local_func['tethering'] = function(id, bvalue)
{
};

add_listener_local_func['tethering'] = function(addoption, bvalue)
{

	$('[sid="C_TETHERING_RUN"]').unbind('change');
        sliderButtonEvent( { object: $('[sid="C_TETHERING_RUN"]'), runFunc: function(){
			submit_local("tethering");
	}});
};

submit_local_func['tethering'] = function(localpostdata)
{
	return true;
};

/*----------cupsd start func----------*/
iux_update_local_func['cupsd'] = function(id, bvalue)
{

	if($('[sid=\"C_CUPSD_RUN\"]').val() == '0'){
		$('[sid=\"C_CUPSD_REMOTE\"]').prop('readonly',true);
		$('[sid=\"C_CUPSD_REMOTE\"]').next().addClass("ui-state-disabled");
	}else{
		$('[sid=\"C_CUPSD_REMOTE\"]').removeAttr('readonly');
		$('[sid=\"C_CUPSD_REMOTE\"]').next().removeClass("ui-state-disabled");
	}
	$("#spool_warning1").text(M_lang["S_CUPSD_DESC3"] + config_data.cupsd.maxspoolsize + M_lang["S_MB"] + M_lang["S_CUPSD_DESC4"]);
	switch(id)
	{
		default:
			var Statustxt = "http://" + config_data.cupsd.hostname + ":" + config_data.cupsd.port + "/printers/"+	config_data.cupsd.name;
			return Statustxt;
	}
};

add_listener_local_func['cupsd'] = function(addoption, bvalue)
{
	$('[sid=\"C_CUPSD_RUN\"]').unbind('change');
        sliderButtonEvent( { object: $('[sid=\"C_CUPSD_RUN\"]'), runFunc: function(){
		var val = $(this).val();
		if(check_change_value())
		{
			var localpostdata = [];
			localpostdata.push({name : "run", value : val});
			submit_local('cupsd', localpostdata);
		}
	}});
	$('[sid=\"C_CUPSD_REMOTE\"]').unbind('change');
        sliderButtonEvent( { object: $('[sid=\"C_CUPSD_REMOTE\"]'), runFunc: function() {
		var val = $(this).val();
		if(check_change_value())
		{
			var localpostdata = [];
			localpostdata.push({name : "remote", value : val});
			submit_local('cupsd', localpostdata);
		}
	}});
};

submit_local_func['cupsd'] = function(localpostdata)
{
	return true;
};

/*---------- page run func----------*/
$(document).ready(function()
{
	window.tmenu = "basicapp"; window.smenu = "service";
	make_M_lang(S_lang, D_lang);
	iux_init(window.tmenu, window.smenu);

	$(document).on("panelbeforeopen", "#right_panel", function () {
                $('.ui-page').css("overflow","hidden");
                $('#right_panel').css("overflow","auto");
                $('#right_panel').css("position","fixed");
        });

        $(document).on("panelbeforeclose", "#right_panel", function () {
                $('.ui-page').css("overflow","auto");
                $('.ui-page').css("position","relative");
        });
});

function loadLocalPage()
{
	iux_update_local();
	iux_set_onclick_local();
	load_userlist("userlist");
}

function result_config()
{
	if( config_data.apache )
		config_data.apache.select = config_data.mount;
	if( config_data.mysql )
		config_data.mysql.select = config_data.mount;
	if( config_data.torrent )
		config_data.torrent.select = config_data.mount;
	if( config_data.media )
		config_data.media.select = config_data.mount;
	if( config_data.rsync )
		config_data.rsync.select = config_data.mount;
	if( config_data.itunes )
	{
		config_data.itunes.select = config_data.mount;
		if( config_data.itunes.scan === "0" )
			config_data.itunes.scan = "3";
	}
}

function result_submit()
{
	iux_update("C");
	iux_update_local();
}

function iux_set_onclick_local()
{
	for(var articleName in config_data)
	{
		if(config_data.hasOwnProperty(articleName) && articleName != "")
		{
			$("#"+articleName).on('click', function() {
				load_rightpanel(this.id);
			}).on("mousedown touchstart", function() {
				$(this).find("a").addClass("animation_blink")
				.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
					$(this).removeClass("animation_blink");
				});
			});
		}
	}
}

function load_userlist(userlist)
{
	$("#userlist").on('click', function(){
		$("#right_content").load('html/userlist.html', function(responseTxt, statusTxt, xhr) {
				if (statusTxt == "success")
				{
					$(this).trigger('create');	
					load_header(RIGHT_HEADER, userlist);
					iux_update("S");
				}
		});
	});
}

function load_rightpanel(aname) 
{
	$.ajaxSetup({ async : true, timeout : 20000 });
		$("#right_content").load('html/'+aname+'.html', function(responseTxt, statusTxt, xhr) {
				if (statusTxt == "success")
				{
					$(this).trigger('create');	
					load_header(RIGHT_HEADER, aname);
					iux_update("C");
					iux_update("S");
					add_listener_local(aname);
				}
		});
}

function iux_update_local(id)
{
	if(id == 'C')
	{
		var aname = $("#right_content :first-child").attr('id');
		if( !aname )
			return;
		var bvalue = $('[sid="C_'+aname.toUpperCase()+'_RUN"]:checked').val();
		if(typeof(bvalue) == 'undefined'){
			//bvalue = $('[sid="C_'+aname.toUpperCase()+'_RUN"]').val();
			bvalue = true;
		}
		status_control_enable(false, "S_BUTTON_SUBMIT");
		status_control_enable(bvalue);
		iux_update_local_func[aname].call(this, "C", bvalue);
	}
	else if(id == 'D')
	{
		var usertext = M_lang["S_USERLIST_USERTEXT"].split("_");
		var numuser = status_data.connected.user.length;
		$("[sid='USERLIST_VALUE']").text(usertext[0] + (numuser-1) + usertext[1]); 

		$('[sid="CONNECTUSER_LISTVIEW"] li').remove();
		if(status_data.connected.user.length == 1)
		{
			$('[sid="CONNECTUSER_LISTVIEW"]').append("<li class='lc_connectuser'>"
				+ "<div class='lc_user lc_user_center'><p id='lc_loaduser' "
				+ "sid='S_USERLIST_NOUSER'>"+M_lang["S_USERLIST_NOUSER"]+"</p></div>"
				+ "<div class='lc_ipaddr'><p sid='S_USERLIST_IPADDR'> </p></div>"
				+ "<div class='lc_time'><p sid='S_USERLIST_TIME'> </p></div></li>");
		}
		else
		{
			for(var i =0; i< status_data.connected.user.length-1; i++ )
			{
				var userid = status_data.connected.user[i].user;
				var ip = status_data.connected.user[i].ip;
				var time = status_data.connected.user[i].time;
				var service = status_data.connected.user[i].service;
				$('[sid="CONNECTUSER_LISTVIEW"]').append("<li class='lc_connectuser'>"
					+ "<div class='lc_user'><p>["+service+"]"+userid+"</p></div>"
					+ "<div class='lc_ipaddr'><p sid='S_USERLIST_IPADDR'>"+ip+"</p></div>"
					+ "<div class='lc_time'><p sid='S_USERLIST_TIME'>"+time+"</p></div></li>");
			}
		}
		$("[sid='CONNECTUSER_LISTVIEW']").listview('refresh');

		if( config_data.samba )
			iux_update_local_func['samba'](id);
		if( config_data.torrent )
			iux_update_local_func['torrent'](id);
		if( config_data.media )
			iux_update_local_func['media'](id);
		if( config_data.itunes )
			iux_update_local_func['itunes'](id);
 	}
	else if(id == 'S')
	{
	}
	else // etc
	{
		for (var aname in iux_update_local_func)
		{
			if( !config_data[aname] )
				return;
			var Current_Status = iux_update_local_func[aname].call();
			if(Current_Status && Current_Status != "" && eval("config_data."+ aname + ".run") == 1)
				$("[sid='" + aname.toUpperCase() + "_VALUE']").text(Current_Status);
			else 
				$("[sid='" + aname.toUpperCase() + "_VALUE']").text("");
		}
	}
}

function add_listener_local(aname)
{
	$("[sid^='C_'],[sid^='L_']").each(function()
	{
		switch($(this).attr("type"))
		{
			case "radio":
			case "slider":
				$(this).unbind('change').change(function(){
					var bvalue = 0;
					if($(this).attr('type') == 'radio')
						bvalue = $('[name="'+$(this).attr('name') + '"]:checked').val();
					else if($(this).attr('type') == 'slider') {
						bvalue = $('[name="'+$(this).attr('name') + '"]').val();
						$(this).slider("refresh");
					}
					if(!bvalue) bvalue = 0;
					status_control_enable(bvalue);	
					if(bvalue == 1 && check_change_value)
						status_control_enable(true, "S_BUTTON_SUBMIT");
					else
						status_control_enable(false, "S_BUTTON_SUBMIT");
					add_listener_local_func[aname].call(this, "run", bvalue); //additional option
					if(bvalue != 1)	{
						if(check_change_value())
						{
							var localpostdata = [];
							localpostdata.push({name : "run", value : bvalue});
							submit_local(aname, localpostdata);
						}
					}
				});
				break;
			case "text":
			case "number":
			case "password":
				$(this).unbind('keyup').keyup(function() {
					check_change_value() ? status_control_enable(true, "S_BUTTON_SUBMIT")
						: status_control_enable(false, "S_BUTTON_SUBMIT"); });
				break;
			case "checkbox":
			case "select":
				$(this).change(function() {
					check_change_value() ? status_control_enable(true, "S_BUTTON_SUBMIT") :
					status_control_enable(false, "S_BUTTON_SUBMIT");
				});
				break;
		}
	});
	if( add_listener_local_func[aname] )
		add_listener_local_func[aname].call();
	$('[sid="S_BUTTON_SUBMIT"]').click(function() { submit_local(aname); });
}

function submit_local(aname, localpostdata)
{
	if( submit_local_func[aname] && submit_local_func[aname].call(this, localpostdata) ) {
		$("#loading").popup("open");
		iux_submit(aname, localpostdata);
	}
}

/*---------- controller current status func----------*/
function status_control_enable(boolvalue, targetsid)
{
	if(boolvalue == true)
	{
		if(!targetsid)
		{
			$("[sid^='C_'],[sid^='L_']").each(function() {
				var s_sid = $(this).attr("sid").split("_");
				if(s_sid[VAL_ID] == "L" && ( $(this).attr("type") == "text" || $(this).attr("type") == "number"))
					return;
				if(s_sid[VAL_TAGNAME] != "RUN") 
				{
					$(this).removeAttr('readonly');
					$(this).parent().removeClass("ui-state-disabled");
				}
			});
		}
		else
		{
			$('[sid="' + targetsid + '"]').removeAttr('readonly');
			$('[sid="' + targetsid + '"]').parent().removeClass("ui-state-disabled");
		}
	}
	else
	{
		if(!targetsid)
		{
			$("[sid^='C_'],[sid^='L_']").each(function() {
				var s_sid = $(this).attr("sid").split("_");
				if(s_sid[VAL_ID] == "L" && ( $(this).attr("type") == "text" || $(this).attr("type") == "number"))
					return;
				if(s_sid[VAL_TAGNAME] != "RUN")
				{
					$(this).prop('readonly',true);
					$(this).parent().addClass("ui-state-disabled");
				}
			});
		}
		else
		{
			$('[sid="' + targetsid + '"]').prop('readonly',true);
			$('[sid="' + targetsid + '"]').parent().addClass("ui-state-disabled");
		}
	}
}

function status_control_visible(bval, targetsid )
{
	if(bval)
	{
		$('[sid="'+targetsid+'"]').parent().show();
		$('[sid="'+targetsid+'"]').removeAttr("readonly");
	}
	else 
	{
		$('[sid="'+targetsid+'"]').parent().hide();
		$('[sid="'+targetsid+'"]').val("");
		$('[sid="'+targetsid+'"]').prop("readonly",true);
	}
}

function status_control_checkbox(bvalue, sid)
{
	var s_sid = sid.split("_");
	var ctrl_sid = "L_" + s_sid[VAL_ARTICLE] + "_" + s_sid[VAL_TAGNAME];
	if(s_sid[VAL_TAGNAME] == "PORT" || s_sid[VAL_TAGNAME] == "IPDISKPORT")
	{
		var defaultport = eval(ctrl_sid);
		var currentport = $('[sid="'+sid+'"]').val();
		if( currentport == defaultport )
		{	
			$('[sid="'+ctrl_sid+'"]').prop('checked', true).checkboxradio("refresh");
			$('[sid="'+sid+'"]').prop('readonly', true);
			$('[sid="'+sid+'"]').parent().addClass("ui-state-disabled");
			status_control_enable(false, sid);
		}
		else
		{ 
			$('[sid="'+ctrl_sid+'"]').prop('checked', false).checkboxradio("refresh");
			$('[sid="'+sid+'"]').removeAttr('readonly')
			$('[sid="'+sid+'"]').parent().removeClass("ui-state-disabled");
			bvalue == 0 ? status_control_enable(false, sid) : status_control_enable(true, sid);
		}
		status_control_enable(bvalue, ctrl_sid);
	}
	else
	{
		eval("config_data." + s_sid[VAL_ARTICLE].toLowerCase() + "." + s_sid[VAL_TAGNAME].toLowerCase()) == 1 ? 
		$('[sid="' + sid + '"]').prop('checked', 'checked').checkboxradio("refresh") :
		$('[sid="' + sid + '"]').removeAttr('checked').checkboxradio("refresh");
		status_control_enable(bvalue, sid);
	}
}

function status_selectmenu_item(sid)
{
	var s_sid = sid.split("_");
	$('[sid="'+sid+'"] option').each(function() {
		if($(this).attr("value") == eval("config_data." + s_sid[VAL_ARTICLE].toLowerCase() + "." + s_sid[VAL_TAGNAME].toLowerCase()) )
			$(this).attr("selected", true);
		else $(this).removeAttr("selected");
	});
	$('[sid="' + sid + '"]').selectmenu('refresh', true);
}

/*---------- controller manager func----------*/
function ctrlmgr_arrayuser(i, aname)
{
	var bvalue;
	$('[sid="C_'+aname.toUpperCase()+'_USERPROPERTY'+i+'"]').unbind();
	$('[sid="C_'+aname.toUpperCase()+'_USERPROPERTY'+i+'"]').change(function() {
		$('[sid="C_'+aname.toUpperCase()+'_USERPROPERTY'+i+'"]').selectmenu("refresh", true);
		$('option:selected',this).val() == "off" ? bvalue = 0 : bvalue = 1;	
		status_control_enable(bvalue, "C_"+aname.toUpperCase()+"_USERID"+i);
		status_control_enable(bvalue, "C_"+aname.toUpperCase()+"_PASSWD"+i);
		if(config_data[aname]['usefolder'])
			status_control_enable(bvalue, "C_"+aname.toUpperCase()+"_FOLDER"+i);
		status_control_enable(bvalue, "PASSWD_VISIBLE"+i);
		check_change_value() ? status_control_enable(true, "S_BUTTON_SUBMIT") :
		status_control_enable(false, "S_BUTTON_SUBMIT");
	});
}

function ctrlmgr_defaultvalue(sid)
{
	var bvalue;
	var s_sid = sid.split("_");
	var ctrl_sid = "L_" + s_sid[VAL_ARTICLE] + "_" + s_sid[VAL_TAGNAME];
	$('[sid="'+ctrl_sid+'"]').unbind();
	$('[sid="'+ctrl_sid+'"]').change(function(){
		status_control_enable(true, "S_BUTTON_SUBMIT");
		$('[sid="'+ctrl_sid+'"]').is(":checked") ? bvalue = 0 : bvalue = 1;
		status_control_enable(bvalue, sid);
		if(bvalue == 0)
			$('[sid="'+sid+'"]').val( eval(ctrl_sid) );
	});
}

function ctrlmgr_password_visible(ctrl_sid, target_sid)
{
	$('[sid="'+ctrl_sid+'"]').unbind();
	$('[sid="'+ctrl_sid+'"]').change(function()	{
		if( $('[sid="'+ctrl_sid+'"]').is(":checked") )
			$('[sid="'+target_sid+'"]').attr("type","text");
		else $('[sid="'+target_sid+'"]').attr("type","password");
	});
}

function ctrlmgr_dirselect(sid)
{
	var s_sid = sid.split("_");
	var strTargetInput = "L_"+s_sid[VAL_ARTICLE]+"_"+s_sid[VAL_TAGNAME];
	$('[sid="'+sid+'"]').unbind();
	$('[sid="'+sid+'"]').change(function() {
		$('[sid="'+sid+'"]').selectmenu("refresh", true);
		status_control_enable(true, "S_BUTTON_SUBMIT");
		var targetValue = $('[sid="'+sid+'"] option:selected').val();
		if(!targetValue)
		{
			status_control_visible(false, strTargetInput); 
			return;
		}
		if(targetValue.indexOf("/") == -1 )
		{
			$('[sid="'+strTargetInput+'"]').val("");
			$('[sid="'+strTargetInput+'"]').attr('placeholder',M_lang["S_NEWFOLDER"]);
			status_control_visible(true, strTargetInput);
		}
		else
		{
			status_control_visible(false, strTargetInput);
			check_change_value() ? status_control_enable(true, "S_BUTTON_SUBMIT") :
			status_control_enable(false, "S_BUTTON_SUBMIT");
		}
	});
}

/*---------- insert func----------*/
function insertDefaultOption( service )
{
	var $select = $("[sid=C_" + service.toUpperCase() + "_DATAFOLDER]");
	if( config_data[service].datafolder === "" || $select.children("option").filter(function(){ return $(this).val(); }).length != 0 )
		return;
	$select.append( $("<option>").val(config_data[service].datafolder).text(config_data[service].datafolder) )
		.val( config_data[service].datafolder ).selectmenu("refresh");
}

function insert_hddlist(sid)
{
	var s_sid = sid.split("_");
        var hdd = eval("config_data."+s_sid[VAL_ARTICLE].toLowerCase()+".select");
	if(hdd)	hddlist = eval("hdd.hddlist");              
	if(hddlist)
	{
		var result = true;
		$('[sid="'+sid+'"] option').each(function() {
			if($(this).attr("value") != "" && $(this).attr("value").indexOf("/") == -1)
				result = false; 
		});
		if(result)
		{
			for(var i = hddlist.length-1 ; i >= 0; i--) 
			{
				if(hddlist[i].value != "")
				{
					var target = hddlist[i];
					if(target.value == '')	break;
					var makeStr = target.value + M_lang["S_ADD_NEW_DIR"];
					$('[sid="'+sid+'"] option[value=""]').after("<option value='" + target.value + "'>" + makeStr + "</option>");
				}
			}
		}
	}
}

function insert_apache_serverfolder()
{
	$('[sid="C_APACHE_SERVERFOLDER"]').find('option').remove();
	var listObjs = S_lang["S_APACHE_SERVERFOLDER"];
	for(var idx = 0; (listObjs && idx < listObjs.length); idx++)
	{ 
		var nm = listObjs[idx];
		$('[sid="C_APACHE_SERVERFOLDER"]').append("<option value='" + nm.value + "' >" + nm.text + "</option>");
	}
        var datafolder = eval("config_data.apache.select");
	if(datafolder)
		datafolder = eval("datafolder.datafolder");
	var currentval = config_data.apache.serverfolder;
	if(datafolder)
	{
		for(var i=0; i<datafolder.length; i++)
		{
			if(datafolder[i].value != "")
			{
				$('[sid="C_APACHE_SERVERFOLDER"]').append("<option value='" + datafolder[i].value 
					+ ((datafolder[i].value == currentval)?"' selected>":"'>")+datafolder[i].text+"</option>");
			}
		}
	}
	$('[sid="C_APACHE_SERVERFOLDER"]').selectmenu('refresh', true);
}

function insert_postdata_datafolder(sid)
{
	var s_sid = sid.split("_");
	if( $('[sid="'+sid+'"]').val() )
	{
		$('[sid="C_'+s_sid[VAL_ARTICLE]+'_'+s_sid[VAL_TAGNAME]+'"] option:selected').val(
		$('[sid="C_'+s_sid[VAL_ARTICLE]+'_'+s_sid[VAL_TAGNAME]+'"] option:selected').val() + "/" + $('[sid="'+sid+'"]').val() );
	}
}

/*---------- check func----------*/

function check_input_error(sid, regExp)
{
	var s_sid = sid.split("_");
	if( !( $('[sid="'+sid+'"]').attr("readonly") ))
	{	
		if( $('[sid="'+sid+'"]').attr("type") == "text" || $('[sid="'+sid+'"]').attr("type") == "number" || $('[sid="'+sid+'"]').attr("type") == "password" )
		{
			var s_sid = sid.split("_");
			if( !($('[sid="'+sid+'"]').val().match(regExp)) ||  $('[sid="'+sid+'"]').val() == "" )
			{
				if(s_sid[VAL_ID] == "L")
					alert(M_lang["S_"+s_sid[VAL_TAGNAME]+"_ERROR_NEWDIR"]);
				else
					alert(M_lang["S_"+s_sid[VAL_TAGNAME]+"_ERROR"]);
				return true;
			}
		}
		else if ($('[sid="'+sid+'"]').attr("type") == "select")
		{
			if( $('[sid="'+sid+'"] option:selected').val() == "")
			{
				if(s_sid[VAL_ID] == "L")
					alert(M_lang["S_"+s_sid[VAL_TAGNAME]+"_ERROR_NEWDIR"]);
				else 
					alert(M_lang["S_"+s_sid[VAL_TAGNAME]+"_ERROR"]);
				return true;
			}
		}
	}
	return false;
}
