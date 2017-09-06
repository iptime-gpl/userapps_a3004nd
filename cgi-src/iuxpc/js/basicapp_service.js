<script>


function ClickNasService(obj)
{
        var prev_id = document.main_form.click_id.value;
        var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = obj.id;

        if(prev_id == click_id) return;

        if(prev_id)
        {
                document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;
                parent.document.getElementById(prev_id+"_table").style.display = "none";
        }

        parent.document.getElementById(click_id+"_table").style.display = "block";
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;
        SetCursor(obj);
        parent.document.nasmisc_fm.act.value = obj.id;

	if(obj.id == 'torrent')
	{
		var torrent_setup_table=parent.document.getElementById('torrent_setup_table');

                if(torrent_setup_table && torrent_setup_table.style.display == "none")
			HideItDoc(parent.document,'apply_bt');
		else
			ShowItDoc(parent.document,'apply_bt');
	}
	else if(obj.id == 'media')
	{
		var media_setup_table=parent.document.getElementById('media_setup_table');

                if(media_setup_table && media_setup_table.style.display == "none")
			HideItDoc(parent.document,'apply_bt');
		else
			ShowItDoc(parent.document,'apply_bt');
	}

	else
		ShowItDoc(parent.document,'apply_bt');
		
}


var INVALID_FOLDER_STR="&;|`\\><\"'`/";

function CheckAscii(s)
{
	for(i=0;i<s.length;i++)
	{		
		if(s.charCodeAt(i)>0x7F) 
			return 0;
	}		
	return 1;
}

function CheckFolderStr(val, check_ascii)
{
	for(i=0;i<INVALID_FOLDER_STR.length;i++)
	{		
		if(val.indexOf(INVALID_FOLDER_STR.charAt(i))!=-1)
			return (MSG_INVALID_FOLDER_STR+"\n( "+INVALID_FOLDER_STR+".."+MSG_CANT_BE_USED+")");
	}		

	if(val.indexOf("..") != -1)
		return MSG_INVALID_FOLDER_2DOTS_STR;

	if(val.charAt(0) == '.')
		return MSG_INVALID_FOLDER_DOT_STR;

	if(check_ascii)
	{
		if(!CheckAscii(val))
			return MSG_INVALID_FOLDER_NON_ASCII_STR;
	}
	return 0;
}

var INVALID_PASSWORD_STR="',";

function CheckPasswordStr(val)
{
	for(i=0;i<INVALID_PASSWORD_STR.length;i++)
	{		
		if(val.indexOf(INVALID_PASSWORD_STR.charAt(i))!=-1)
			return (MSG_INVALID_PASSWORD_STR+"\n( "+INVALID_PASSWORD_STR+' '+MSG_CANT_BE_USED+")");
	}		
	return 0;
}



function ClickFTPPortMethod()
{
	var F = document.nasmisc_fm;

	if(!F.ftp_port_method)
		return;

	if(F.ftp_port_method.checked == false)
		ReadOnlyObj(F.ftp_port,0);
	else
	{
		F.ftp_port.value=21;
		ReadOnlyObj(F.ftp_port,1);
	}
}


function ClickServicePortMethod()
{
        var F = document.nasmisc_fm;

        if (!F.ipdisk_port_method)
		return;

        if (F.ipdisk_port_method.checked == false)
		ReadOnlyObj(F.ipdisk_port,0);
	else
	{
		F.ipdisk_port.value=9000;
		ReadOnlyObj(F.ipdisk_port,1);
	}

}

function ClickURLPortMethod()
{
        var F = document.nasmisc_fm;

	if(!F.url_port_method)
		return;
        if (F.url_port_method.checked == false)
	{
		ReadOnlyObj(F.url_port,0);
	}
	else
	{
		F.url_port.value=8000;
		ReadOnlyObj(F.url_port,1);
	}

}



function InitIPDISKService()
{
        var F = document.nasmisc_fm;


	if(F.url_port_method)
	{
		if(F.url_port.value == '8000') 
		{
                	F.url_port_method.checked = false;
			ReadOnlyObj(F.url_port,1);
		}
		else
		{
                	F.url_port_method.checked = true;
			ReadOnlyObj(F.url_port,0);
		}
	}

}



function check_login_id(s)
{
        for( i = 0 ; i < s.length; i++ )
        {
                if(((s.charAt(i) >= 'a') && (s.charAt(i) <= 'z')) ||
                        ((s.charAt(i) >= 'A' ) && (s.charAt(i) <= 'Z')) ||
                        ((s.charAt(i) >= '0' ) && (s.charAt(i) <= '9')) )
                                continue;
        	else
                        return false;
       }

       return true;
}


function check_unallowed_id(s)
{
	if( s == 'root')
		return false;
	if( s == 'nobody')
		return false;


       return true;
}

function CheckUser(userid,passwdorg,passwd_text,passwd_view, property)
{
	var passwd;
	
	if(property && property.value == 'off')
		return 0;

        if(userid.value.length == 0 )
        {
                alert(MSG_BLANK_ACCOUNT);
                userid.focus();
                userid.select();
                return 1;
        }

	if(passwd_view.checked == true)
		passwd = passwd_text;
	else
		passwd = passwdorg;

        if( passwd.value.length == 0 )
        {
                alert(MSG_BLANK_PASSWORD);
                passwd.focus();
                passwd.select();
                return 1;
        }

	if (check_login_id(userid.value) == false)
	{
                alert(SYSCONF_LOGIN_INVALID_NEW_ID);
                userid.focus();
                userid.select();
                return 1;
	}

	ret=CheckPasswordStr(passwd.value);
	if(ret)
	{
		alert(ret);
		passwd.focus();
		return 1;
	}



	if (check_unallowed_id(userid.value) == false)
	{
                alert(UNALLOWED_ID_MSG);
                userid.focus();
                userid.select();
                return 1;
	}

	return 0;
}

function ChangeUserProperty(service, idx) 
{
	var useridobj=document.getElementsByName(service+'_userid');
	var propertyobj=document.getElementsByName(service+'_property');
	var passobj=document.getElementsByName(service+'_passwd');
	var passtextobj=document.getElementsByName(service+'_passwd_text');
	var passviewobj=document.getElementsByName(service+'_password_view');
	var folderobj=document.getElementsByName(service+'_folder');
	
	if(propertyobj[idx].value == 'off')
	{		
		DisableObj(useridobj[idx]);
		DisableObj(passobj[idx]);
		DisableObj(passtextobj[idx]);
		DisableObj(passviewobj[idx]);
		DisableObj(folderobj[idx]);
	}
	else
	{
		EnableObj(useridobj[idx]);
		EnableObj(passobj[idx]);
		EnableObj(passtextobj[idx]);
		EnableObj(passviewobj[idx]);
		EnableObj(folderobj[idx]);
	}
}

function CheckIDList(user_id,my_idx,userobj,propertyobj)
{
	var i;

	for(i=0;i<propertyobj.length;i++)
	{
		if(my_idx == i) continue;

		if(userobj[i].value != '')
		{
			if(userobj[i].value == user_id)
				return 1;
		}
	}
	return 0;
}

function CheckDuplicateID(userobj,propertyobj)
{
	var i;

	for(i=0;i<propertyobj.length;i++)
	{
		if(userobj[i].value != '')
		{
			if(CheckIDList(userobj[i].value,i,userobj,propertyobj))
			{
				userobj[i].focus();
				userobj[i].select();
				return 1;
			}
		}
	}
	return 0;
}

function CheckUserForm(service)
{
	var i;
        var F2=nas_service_iframe.main_form;
	var service2;

	var useridobj=document.getElementsByName(service+'_userid');
	var passobj=document.getElementsByName(service+'_passwd');
	var passtextobj=document.getElementsByName(service+'_passwd_text');
	var passviewobj=document.getElementsByName(service+'_password_view');
	var propertyobj=document.getElementsByName(service+'_property'); /* only in FTP/Samba */
	var folderobj=document.getElementsByName(service+'_folder'); /* only in FTP/Samba/AFP */

	for(i=0;i < useridobj.length;i++)
	{
		if(CheckUser(useridobj[i],passobj[i],passtextobj[i],passviewobj[i],propertyobj?propertyobj[i]:null))
			return 0;
		F2.user_id[i].value = useridobj[i].value;

		if(passviewobj[i].checked == true)
			F2.passwd[i].value = passtextobj[i].value;
		else
			F2.passwd[i].value = passobj[i].value;

		if(propertyobj[i]) F2.property[i].value = propertyobj[i].value;
		else F2.property[i].value = 'readwrite';

		if(F2.folder && F2.folder[i] && folderobj && folderobj[i])
			F2.folder[i].value = folderobj[i].value;
	}

	if(propertyobj[0])
	{
		for(i=0;i<propertyobj.length;i++)
		{
			if(propertyobj[i].value != 'off')
				break;
		}
        
		if(i == propertyobj.length)
		{
			alert(MSG_ENABLE_ONE_SERVICE_ID);
			return 0;
		}
        
        
		if(CheckDuplicateID(useridobj,propertyobj))
		{
			alert(MSG_DUPLICATE_SERVICE_ID);
			return 0;
		}
	}


	if(service == 'ftp') service2='afp';
	else if(service == 'afp') service2='ftp';
	if(service2)
	{
		var useridobj2=document.getElementsByName(service2+'_userid');
		var passobj2=document.getElementsByName(service2+'_passwd');
		var passtextobj2=document.getElementsByName(service2+'_passwd_text');
		var passviewobj2=document.getElementsByName(service2+'_password_view');

		for(i=0;i < useridobj2.length;i++)
		{
			useridobj2[i].value = useridobj[i].value;
			if(passviewobj[i].checked == true)
				passobj2[i].value=passtextobj2[i].value=passtextobj[i].value;
			else
				passobj2[i].value=passtextobj2[i].value=passobj[i].value;
		}
	}



	return 1;
}

function ChangeMediaFolder()
{
        var F = document.nasmisc_fm;

	if(GetValue(F.media_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.media_new_folder);

           	F.media_new_folder.value = F.media_default_folder.value;
                F.media_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.media_new_folder);

}

function InstallMedia()
{
        var F=document.nasmisc_fm;
        var F2=nas_service_iframe.main_form;

	F2.service.value = 'media';
	F2.install_media.value = 'install';
	F2.submit();
	DisableObj(F.media_install);
	F.media_install.color="#eeeeee";
	MaskIt(document,'apply_mask');
}

function UpdateMediaDB()
{
        var F2=nas_service_iframe.main_form;
        var F = document.nasmisc_fm;

	F2.update_media_db.value = 'update';
        if(document.getElementById('media_db_update_file'))
		document.getElementById('media_db_update_file').innerHTML = '';
        if(document.getElementById('media_db_status'))
		document.getElementById('media_db_status').innerHTML = '';
	ApplyNas();
}

function InitMedia()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.media_run) == 0)
	{
		DisableObj(F.media_name);
		DisableObj(F.media_path);
		DisableObj(F.media_new_folder);
		DisableObj(F.update_db);
	}
	else
	{
		EnableObj(F.media_name);
		EnableObj(F.media_path);
		EnableObj(F.media_new_folder);
		EnableObj(F.update_db);
	}
}


function ChangeiTunesFolder()
{
        var F = document.nasmisc_fm;

	if(GetValue(F.itunes_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.itunes_new_folder);

           	F.itunes_new_folder.value = F.itunes_default_folder.value;
                F.itunes_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.itunes_new_folder);

}

function InstalliTunes()
{
        var F=document.nasmisc_fm;
        var F2=nas_service_iframe.main_form;

	F2.service.value = 'itunes';
	F2.install_itunes.value = 'install';
	F2.submit();
	DisableObj(F.itunes_install);
	F.itunes_install.color="#eeeeee";
	MaskIt(document,'apply_mask');
}

function UpdateiTunesDB()
{
        var F2=nas_service_iframe.main_form;
        var F = document.nasmisc_fm;

	F2.update_itunes_db.value = 'update';
        if(document.getElementById('itunes_db_update_file'))
		document.getElementById('itunes_db_update_file').innerHTML = '';
        if(document.getElementById('itunes_db_status'))
		document.getElementById('itunes_db_status').innerHTML = '';
	ApplyNas();
}

function InitiTunes()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.itunes_run) == 0)
	{
		DisableObj(F.itunes_name);
		DisableObj(F.itunes_path);
		DisableObj(F.itunes_new_folder);
		DisableObj(F.update_itunes_db_bt);
		DisableObj(F.itunes_scan_chk);
		DisableObj(F.itunes_scan_period);
	}
	else
	{
		EnableObj(F.itunes_name);
		EnableObj(F.itunes_path);
		EnableObj(F.itunes_new_folder);
		EnableObj(F.update_itunes_db_bt);
		EnableObj(F.itunes_scan_chk);
		if(F.itunes_scan_chk.checked == true )
			EnableObj(F.itunes_scan_period);
		else
			DisableObj(F.itunes_scan_period);

	}
}


function check_valid_apache_document_root(mount_name)
{
	var fsobj=document.getElementById(mount_name+'_fs');

	if(!fsobj) return 1;

	if( (fsobj.value == 'ntfs')
	    || (fsobj.value == 'tntfs')
	    || (fsobj.value == 'ext3')
	    || (fsobj.value == 'ext4')
	    || (fsobj.value == 'ext2')
	)
		return 1;
	if(confirm(MSG_APACHE_INVALID_FS))
		return 1;
	return 0;
}


function ApplyNas()
{
        var F = document.nasmisc_fm;
        var F2=nas_service_iframe.main_form;
	var service = F.act.value;
	var i;

	F2.service.value = service;
	if(service == 'ipdisk')	
	{
		F2.run.value = GetRadioValue(F.ipdisk_run);
		if(F2.run.value == 0)
		{
			if(confirm(MSG_REMOVE_IPDISK_DDNS))
			{
				F2.hostname.value = F.hostname.value;
				F2.email.value = F.email.value;

				F.hostname.value = '';
				F.email.value = '';
				F2.submit();
				MaskIt(document,'apply_mask');
				return;
			}
			else
				return;
		}

                if((F.hostname.value.indexOf('_') != -1) || (F.hostname.value.indexOf('.') != -1))
                {
                        alert(EXPERTCONF_IPTIMEDDNS_INVALID_HOSTNAME);
                        F.hostname.focus();
                        F.hostname.select();
                        return;
                }
 
                if ((F.email.value.indexOf('@') == -1))
                {
                        alert(EXPERTCONF_IPTIMEDDNS_INVALID_USERID);
                        F.email.focus();
                        F.email.select();
                        return;
                }

		F2.hostname.value = F.hostname.value;
		F2.email.value = F.email.value;
		F2.submit();
		MaskIt(document,'apply_mask');
		return;
	}
	else if(service == 'ftp')
	{
		if (GetRadioValue(F.ftp_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}


		if (F.ftp_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.ftp_port.focus();
                        F.ftp_port.select();
                        return;
		}
        
		if (checkRange(F.ftp_port.value, 1, 65535) || (F.ftp_port.value == '80'))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.ftp_port.focus();
                        F.ftp_port.select();
                        return;
		}


                if (F.ipdisk_port)
                {
			if (F.ipdisk_port.value == '')
			{
                                alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        	F.ipdisk_port.focus();
                        	F.ipdisk_port.select();
                                return;
			} 

			if (checkRange(F.ipdisk_port.value, 1, 65535) || (F.ipdisk_port.value == '80'))
			{
                                alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        	F.ipdisk_port.focus();
                        	F.ipdisk_port.select();
                                return;
			}
 	       }

		F2.run.value = GetRadioValue(F.ftp_run);
		F2.port_method.value = (F.ftp_port_method.checked == true)?"default":"";
		if(F.ipdisk_port_method) F2.ipdisk_port_method.value = (F.ipdisk_port_method.checked == true)?"default":"";
		F2.ftp_encoding.value = F.ftp_encoding.value;
		F2.ftp_port.value = F.ftp_port.value;
		if(F.ipdisk_port) F2.ipdisk_port.value = F.ipdisk_port.value;
	}
	else if(service == 'samba')
	{
		if (GetRadioValue(F.samba_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.samba_name.value == '')
		{
                        alert(NASCONF_SAMBANAME_BLANK);
                        F.samba_name.focus();
                        F.samba_name.select();
                        return;
		}

		if (F.samba_group.value == '')
		{
                        alert(NASCONF_SAMBAGROUP_BLANK);
                        F.samba_group.focus();
                        F.samba_group.select();
                        return;
		}

		F2.run.value = GetRadioValue(F.samba_run);
		F2.samba_name.value = F.samba_name.value;
		F2.samba_group.value = F.samba_group.value;
	}
	else if(service == 'url')
	{
		if (GetRadioValue(F.url_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.url_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.url_port.focus();
                        F.url_port.select();
                        return;
		}
        
		if (checkRange(F.url_port.value, 1, 65535) || (parseInt(F.url_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.url_port.focus();
                        F.url_port.select();
                        return;
		}

		F2.run.value = GetRadioValue(F.url_run);
		F2.url_login.value = GetRadioValue(F.url_login);
		F2.url_port.value = F.url_port.value;
		F2.port_method.value = (F.url_port_method.checked == true)?"default":"";
	}
	else if(service == 'rsync')	
	{
		if (GetRadioValue(F.rsync_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.rsync_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.rsync_port.focus();
                        F.rsync_port.select();
                        return;
		}
        
		if (checkRange(F.rsync_port.value, 1, 65535) || (parseInt(F.rsync_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.rsync_port.focus();
                        F.rsync_port.select();
                        return;

		}

		if (F.new_folder.style.display != 'none' && (F.new_folder.value =='' || F.new_folder.value == F.default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.new_folder.focus();
                        return;
		}

		if (GetValue(F.rsync_path) == 'select_backup_folder')
		{
		        alert(MSG_SELECT_FOLDER_ERR);
                        F.rsync_path.focus();
                        return;
		}

		if(GetValue(F.rsync_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.rsync_path).split('_');
			var option_val, found;

			F.rsync_hddname.value = arr[0];
                        F.rsync_folder.value = F.new_folder.value;

			ret=CheckFolderStr(F.new_folder.value,0);
			if(ret)
			{
				alert(ret);
				F.new_folder.focus();
				return;
			}

			option_val = F.rsync_hddname.value+':'+F.rsync_folder.value;

			found = 0;
			for(i = 0 ; i < F.rsync_path.length; i++)
			{
				if(F.rsync_path[i].value == option_val)
				{
					F.rsync_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.rsync_path[F.rsync_path.length] = new Option('/'+F.rsync_hddname.value+'/'+F.rsync_folder.value, option_val);
				F.rsync_path.value = F.rsync_hddname.value+':'+F.rsync_folder.value;
			}

			ChangeBackupFolder();
		}
		else
		{
			var arr = GetValue(F.rsync_path).split(':');

			F.rsync_hddname.value = arr[0];
			F.rsync_folder.value = arr[1];
		}

		F2.run.value = GetRadioValue(F.rsync_run);
		F2.rsync_port.value = F.rsync_port.value;
		F2.port_method.value = (F.rsync_port_method.checked == true)?"default":"";
		F2.rsync_hddname.value = F.rsync_hddname.value;
		F2.rsync_folder.value = F.rsync_folder.value;
	}
	else if(service == 'torrent')	
	{
		if (GetRadioValue(F.torrent_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.tr_remote_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.tr_remote_port.focus();
                        F.tr_remote_port.select();
                        return;
		}
        
		if (checkRange(F.tr_remote_port.value, 1, 65535) || (parseInt(F.tr_remote_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.tr_remote_port.focus();
                        F.tr_remote_port.select();
                        return;

		}

		if (F.torrent_new_folder.style.display != 'none' && (F.torrent_new_folder.value =='' || F.torrent_new_folder.value == F.torrent_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.torrent_new_folder.focus();
                        return;
		}

		if (GetValue(F.torrent_path) == 'select_torrent_folder')
		{
		        alert(MSG_SELECT_TORRENT_FOLDER_ERR);
                        F.torrent_path.focus();
                        return;
		}

		if(GetValue(F.torrent_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.torrent_path).split('_');
			var option_val, found;

			F.torrent_hddname.value = arr[0];
                        F.torrent_folder.value = F.torrent_new_folder.value;

			ret=CheckFolderStr(F.torrent_new_folder.value,0);
			if(ret)
			{
				alert(ret);
				F.torrent_new_folder.focus();
				return;
			}


			option_val = F.torrent_hddname.value+':'+F.torrent_folder.value;

			found = 0;
			for(i = 0 ; i < F.torrent_path.length; i++)
			{
				if(F.torrent_path[i].value == option_val)
				{
					F.torrent_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.torrent_path[F.torrent_path.length] = new Option('/'+F.torrent_hddname.value+'/'+F.torrent_folder.value, option_val);
				F.torrent_path.value = F.torrent_hddname.value+':'+F.torrent_folder.value;
			}

			ChangeTorrentFolder();
		}
		else
		{
			var arr = GetValue(F.torrent_path).split(':');

			F.torrent_hddname.value = arr[0];
			F.torrent_folder.value = arr[1];
		}

		F2.run.value = GetRadioValue(F.torrent_run);
		F2.tr_remote_port.value = F.tr_remote_port.value;
		F2.port_method.value = (F.tr_remote_port_method.checked == true)?"default":"";
		F2.torrent_hddname.value = F.torrent_hddname.value;
		F2.torrent_folder.value = F.torrent_folder.value;
	}
	else if(service == 'media')	
	{
		if (GetRadioValue(F.media_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.media_name.value == '')
		{
                        alert(MSG_MEDIA_NAME_ERR);
                        F.media_name.focus();
			return;
		}

		if (F.media_new_folder.style.display != 'none' && (F.media_new_folder.value =='' || F.media_new_folder.value == F.media_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.media_new_folder.focus();
                        return;
		}

		if (GetValue(F.media_path) == 'select_media_folder')
		{
		        alert(MSG_SELECT_MEDIA_FOLDER_ERR);
                        F.media_path.focus();
                        return;
		}

		if(GetValue(F.media_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.media_path).split('_');
			var option_val, found;

			F.media_hddname.value = arr[0];
                        F.media_folder.value = F.media_new_folder.value;

			ret=CheckFolderStr(F.media_new_folder.value,0);
			if(ret)
			{
				alert(ret);
				F.media_new_folder.focus();
				return;
			}

			option_val = F.media_hddname.value+':'+F.media_folder.value;

			found = 0;
			for(i = 0 ; i < F.media_path.length; i++)
			{
				if(F.media_path[i].value == option_val)
				{
					F.media_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.media_path[F.media_path.length] = new Option('/'+F.media_hddname.value+'/'+F.media_folder.value, option_val);
				F.media_path.value = F.media_hddname.value+':'+F.media_folder.value;
			}

			ChangeMediaFolder();
		}
		else
		{
			var arr = GetValue(F.media_path).split(':');

			F.media_hddname.value = arr[0];
			F.media_folder.value = arr[1];
		}

		F2.run.value = GetRadioValue(F.media_run);
		F2.media_name.value = F.media_name.value;
		F2.media_hddname.value = F.media_hddname.value;
		F2.media_folder.value = F.media_folder.value;
		InitMedia();
	}
	else if(service == 'itunes')	
	{
		if (GetRadioValue(F.itunes_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.itunes_name.value == '')
		{
                        alert(MSG_MEDIA_NAME_ERR);
                        F.itunes_name.focus();
			return;
		}

		if (F.itunes_new_folder.style.display != 'none' && (F.itunes_new_folder.value =='' || F.itunes_new_folder.value == F.itunes_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.itunes_new_folder.focus();
                        return;
		}

		if (GetValue(F.itunes_path) == 'select_itunes_folder')
		{
		        alert(MSG_SELECT_ITUNES_FOLDER_ERR);
                        F.itunes_path.focus();
                        return;
		}

		if(GetValue(F.itunes_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.itunes_path).split('_');
			var option_val, found;

			F.itunes_hddname.value = arr[0];
                        F.itunes_folder.value = F.itunes_new_folder.value;

			option_val = F.itunes_hddname.value+':'+F.itunes_folder.value;

			found = 0;
			for(i = 0 ; i < F.itunes_path.length; i++)
			{
				if(F.itunes_path[i].value == option_val)
				{
					F.itunes_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.itunes_path[F.itunes_path.length] = new Option('/'+F.itunes_hddname.value+'/'+F.itunes_folder.value, option_val);
				F.itunes_path.value = F.itunes_hddname.value+':'+F.itunes_folder.value;
			}

			ChangeiTunesFolder();
		}
		else
		{
			var arr = GetValue(F.itunes_path).split(':');

			F.itunes_hddname.value = arr[0];
			F.itunes_folder.value = arr[1];
		}

		F2.run.value = GetRadioValue(F.itunes_run);
		F2.itunes_name.value = F.itunes_name.value;
		F2.itunes_hddname.value = F.itunes_hddname.value;
		F2.itunes_folder.value = F.itunes_folder.value;
		F2.itunes_scan_period.value = F.itunes_scan_period.value;
		InitiTunes();
	}
	else if(service == 'apache')	
	{

		if (GetRadioValue(F.apache_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}
		if (F.apache_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.apache_port.focus();
                        F.apache_port.select();
                        return;
		}


		if(F.mgmt_port && F.mgmt_port.value == F.apache_port.value )
		{
                        if(confirm(MSG_NASCONF_SAME_AS_MGMT_PORT))
			{
				MovePagetoMainURL('sysconf','misc','act=mgmt_port');
			}
			else
			{
                        	F.apache_port.focus();
                        	F.apache_port.select();
			}
                        return;
		}

		if (checkRange(F.apache_port.value, 1, 65535) || (!F.mgmt_port && parseInt(F.apache_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.apache_port.focus();
                        F.apache_port.select();
                        return;

		}

		if (F.apache_doc_new_folder.style.display != 'none' && (F.apache_doc_new_folder.value =='' || F.apache_doc_new_folder.value == F.apache_doc_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.apache_doc_new_folder.focus();
                        return;
		}

		if (GetValue(F.apache_doc_path) == 'select_apache_doc_folder')
		{
		        alert(MSG_SELECT_APACHE_DOC_FOLDER_ERR);
                        F.apache_doc_path.focus();
                        return;
		}

		if(GetValue(F.apache_doc_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.apache_doc_path).split('_');
			var option_val, found;

			F.apache_doc_hddname.value = arr[0];
                        F.apache_doc_folder.value = F.apache_doc_new_folder.value;

			ret=CheckFolderStr(F.apache_doc_folder.value,1);
			if(ret)
			{
				alert(ret);
				F.apache_doc_new_folder.focus();
				return;
			}

			option_val = F.apache_doc_hddname.value+':'+F.apache_doc_folder.value;

			found = 0;
			for(i = 0 ; i < F.apache_doc_path.length; i++)
			{
				if(F.apache_doc_path[i].value == option_val)
				{
					F.apache_doc_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.apache_doc_path[F.apache_doc_path.length] = new Option('/'+F.apache_doc_hddname.value+'/'+F.apache_doc_folder.value, option_val);
				F.apache_doc_path.value = F.apache_doc_hddname.value+':'+F.apache_doc_folder.value;
			}

			ChangeApacheDocFolder();
		}
		else
		{
			var arr = GetValue(F.apache_doc_path).split(':');
			F.apache_doc_hddname.value = arr[0];
			F.apache_doc_folder.value = arr[1];
		}

		if (F.apache_server_new_folder.style.display != 'none' && (F.apache_server_new_folder.value =='' || F.apache_server_new_folder.value == F.apache_server_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.apache_server_new_folder.focus();
                        return;
		}

		if(!check_valid_apache_document_root(F.apache_doc_hddname.value))
		{
                        F.apache_doc_path.focus();
			return;	
		}

		if (GetValue(F.apache_server_path) == 'select_apache_server_folder')
		{
		        alert(MSG_SELECT_APACHE_SERVER_FOLDER_ERR);
                        F.apache_server_path.focus();
                        return;
		}

		if(GetValue(F.apache_server_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.apache_server_path).split('_');
			var option_val, found;

			F.apache_server_hddname.value = arr[0];
                        F.apache_server_folder.value = F.apache_server_new_folder.value;

			ret=CheckFolderStr(F.apache_server_folder.value,1);
			if(ret)
			{
				alert(ret);
				F.apache_server_new_folder.focus();
				return;
			}

			option_val = F.apache_server_hddname.value+':'+F.apache_server_folder.value;

			found = 0;
			for(i = 0 ; i < F.apache_server_path.length; i++)
			{
				if(F.apache_server_path[i].value == option_val)
				{
					F.apache_server_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.apache_server_path[F.apache_server_path.length] = new Option('/'+F.apache_server_hddname.value+'/'+F.apache_server_folder.value, option_val);
				F.apache_server_path.value = F.apache_server_hddname.value+':'+F.apache_server_folder.value;
			}

			ChangeApacheServerFolder();
		}
		else
		{
			var arr = GetValue(F.apache_server_path).split(':');
			F.apache_server_hddname.value = arr[0];
			F.apache_server_folder.value = arr[1];
		}





		F2.run.value = GetRadioValue(F.apache_run);
		F2.apache_port.value = F.apache_port.value;
		F2.port_method.value = (F.apache_port_method.checked == true)?"default":"";
		F2.apache_doc_hddname.value = F.apache_doc_hddname.value;
		F2.apache_doc_folder.value = F.apache_doc_folder.value;
		F2.apache_server_hddname.value = F.apache_server_hddname.value;
		F2.apache_server_folder.value = F.apache_server_folder.value;

		InitApache();
	}
	else if(service == 'mysql')	
	{
		if (GetRadioValue(F.mysql_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.mysql_port.value == '')
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_EMPTY);
                        F.mysql_port.focus();
                        F.mysql_port.select();
                        return;
		}
        
		if (checkRange(F.mysql_port.value, 1, 65535) || (parseInt(F.mysql_port.value) == 80))
		{
                        alert(NATCONF_INTAPPS_FTP_PORT_INVALID);
                        F.mysql_port.focus();
                        F.mysql_port.select();
                        return;

		}

		if (F.mysql_new_folder.style.display != 'none' && (F.mysql_new_folder.value =='' || F.mysql_new_folder.value == F.mysql_default_folder.value))
		{
                        alert(MSG_NEW_FOLDER_ERR);
                        F.mysql_new_folder.focus();
                        return;
		}

		if (GetValue(F.mysql_path) == 'select_mysql_folder')
		{
		        alert(MSG_SELECT_MYSQL_FOLDER_ERR);
                        F.mysql_path.focus();
                        return;
		}

		if(GetValue(F.mysql_path).match('_create_DxLoE2LK'))
		{
			var arr = GetValue(F.mysql_path).split('_');
			var option_val, found;

			F.mysql_hddname.value = arr[0];
                        F.mysql_folder.value = F.mysql_new_folder.value;

			ret=CheckFolderStr(F.mysql_new_folder.value,1);
			if(ret)
			{
				alert(ret);
				F.mysql_new_folder.focus();
				return;
			}

			option_val = F.mysql_hddname.value+':'+F.mysql_folder.value;

			found = 0;
			for(i = 0 ; i < F.mysql_path.length; i++)
			{
				if(F.mysql_path[i].value == option_val)
				{
					F.mysql_path.value = option_val;
					found = 1;
					break;
				}
			}

			if(found == 0)
			{
				F.mysql_path[F.mysql_path.length] = new Option('/'+F.mysql_hddname.value+'/'+F.mysql_folder.value, option_val);
				F.mysql_path.value = F.mysql_hddname.value+':'+F.mysql_folder.value;
			}

			ChangeMySQLFolder();
		}
		else
		{
			var arr = GetValue(F.mysql_path).split(':');
			F.mysql_hddname.value = arr[0];
			F.mysql_folder.value = arr[1];
		}

		F2.run.value = GetRadioValue(F.mysql_run);
		F2.mysql_port.value = F.mysql_port.value;
		F2.mysql_charset.value = F.mysql_charset.value;
		F2.mysql_use_case.value = (F.mysql_use_case.checked==true)?"1":"0";
		F2.mysql_use_client_charset.value = (F.mysql_use_client_charset.checked==true)?"1":"0";
		F2.mysql_max_allow_packet.value = F.mysql_max_allow_packet.value;

		F2.port_method.value = (F.mysql_port_method.checked == true)?"default":"";
		F2.mysql_hddname.value = F.mysql_hddname.value;
		F2.mysql_folder.value = F.mysql_folder.value;

		InitMySQL();
	}
	else if(service == 'tethering')	
		F2.run.value = GetRadioValue(F.tethering_run);
	else if(service == 'cupsd')	
	{
		F2.run.value = GetRadioValue(F.cupsd_run);
		F2.cupsd_remote.value = GetRadioValue(F.cupsd_remote);
	}
	else if(service == 'afp')
	{
		if (GetRadioValue(F.afp_run) == 0)
		{
			F2.run.value="0";
        		F2.submit();
			MaskIt(document,'apply_mask');
			return;
		}

		if (F.afp_name.value == '')
		{
                        alert(NASCONF_SAMBANAME_BLANK);
                        F.afp_name.focus();
                        F.afp_name.select();
                        return;
		}

		F2.run.value = GetRadioValue(F.afp_run);
		F2.afp_name.value = F.afp_name.value;
	}


	
	if((service =='url') && (GetRadioValue(F.url_login)=='0'))
	{
        	F2.submit();
		MaskIt(document,'apply_mask');
		return;	
	}
	else if(!CheckUserForm(service))
		return;

        F2.submit();
	MaskIt(document,'apply_mask');
}


function InitURL()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.url_run) == 0)
	{
		if(F.url_port_method) DisableObj(F.url_port_method);
		DisableObj(F.url_port);
		DisableObj(F.url_login);
		DisableObj(F.url_userid);
		DisableObj(F.url_passwd);
		DisableObj(F.url_passwd_text);
		DisableObj(F.url_password_view);
	}
	else
	{
		if(F.url_port_method) EnableObj(F.url_port_method);
		EnableObj(F.url_port);
		EnableObj(F.url_login);
		EnableObj(F.url_login);

		if(GetRadioValue(F.url_login) == 1)
		{
			EnableObj(F.url_userid);
			EnableObj(F.url_passwd);
			EnableObj(F.url_passwd_text);
			EnableObj(F.url_password_view);
		}
		else
		{
			DisableObj(F.url_userid);
			DisableObj(F.url_passwd);
			DisableObj(F.url_passwd_text);
			DisableObj(F.url_password_view);
		}
	}
	ClickURLPortMethod();
}

function InitSamba()
{
        var F = document.nasmisc_fm;

	if(GetRadioValue(F.samba_run) == 0)
	{
		DisableObj(F.samba_name);
		DisableObj(F.samba_group);

		DisableObjNames('samba_property');
		DisableObjNames('samba_userid');
		DisableObjNames('samba_passwd');
		DisableObjNames('samba_passwd_text');
		DisableObjNames('samba_password_view');
		DisableObjNames('samba_folder');
	}
	else
	{
		EnableObj(F.samba_name);
		EnableObj(F.samba_group);

		EnableObjNames('samba_property');
		EnableObjNames('samba_userid');
		EnableObjNames('samba_passwd');
		EnableObjNames('samba_passwd_text');
		EnableObjNames('samba_password_view');
		EnableObjNames('samba_folder');

		for(i=0;i<F.samba_userid.length;i++)
			ChangeUserProperty('samba',i);
	}
}

function InstallSamba()
{
        var F=document.nasmisc_fm;
        var F2=nas_service_iframe.main_form;

        F2.service.value = 'samba';
        F2.install_samba.value = 'install';
        F2.submit();
        DisableObj(F.samba_install);
        F.samba_install.color="#eeeeee";
        MaskIt(document,'apply_mask');
}
        

function InitFTP()
{
        var F = document.nasmisc_fm;
	var i;

	if(GetRadioValue(F.ftp_run) == 0)
	{
		if(F.ftp_port_method) DisableObj(F.ftp_port_method);
		DisableObj(F.ftp_port);
		DisableObj(F.ftp_encoding);

		DisableObjNames('ftp_property');
		DisableObjNames('ftp_userid');
		DisableObjNames('ftp_passwd');
		DisableObjNames('ftp_passwd_text');
		DisableObjNames('ftp_password_view');
		DisableObjNames('ftp_folder');

		if(F.ipdisk_port_method) 
		{
			DisableObj(F.ipdisk_port_method);
			DisableObj(F.ipdisk_port);
		}
	}
	else
	{
		if(F.ftp_port_method) EnableObj(F.ftp_port_method);

		EnableObj(F.ftp_port);
		EnableObj(F.ftp_encoding);

		EnableObjNames('ftp_property');
		EnableObjNames('ftp_userid');
		EnableObjNames('ftp_passwd');
		EnableObjNames('ftp_passwd_text');
		EnableObjNames('ftp_password_view');
		EnableObjNames('ftp_folder');

		if(F.ipdisk_port_method) 
		{
			EnableObj(F.ipdisk_port_method);
			EnableObj(F.ipdisk_port);
		}

		for(i=0;i<F.ftp_userid.length;i++)
			ChangeUserProperty('ftp',i);
	}

	ClickServicePortMethod();
	ClickFTPPortMethod();

}


function InitipDISK()
{
        var F = document.nasmisc_fm;

	if(GetRadioValue(F.ipdisk_run) == 0)
	{
		DisableObj(F.hostname);
		DisableObj(F.email);
	}
	else
	{
		EnableObj(F.hostname);
		EnableObj(F.email);
	}
}




function ClickRsyncPortMethod()
{
        var F = document.nasmisc_fm;

	if(!F.rsync_port_method)
		return;
        if (F.rsync_port_method.checked == false)
	{
		ReadOnlyObj(F.rsync_port,0);
	}
	else
	{
		F.rsync_port.value=1873;
		ReadOnlyObj(F.rsync_port,1);
	}

}


function InitRsync()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.rsync_run) == 0)
	{
		if(F.rsync_port_method) DisableObj(F.rsync_port_method);
		DisableObj(F.rsync_port);
		DisableObj(F.rsync_userid);
		DisableObj(F.rsync_passwd);
		DisableObj(F.rsync_passwd_text);
		DisableObj(F.rsync_password_view);
		DisableObj(F.rsync_path);
		DisableObj(F.new_folder);
	}
	else
	{
		if(F.rsync_port_method) EnableObj(F.rsync_port_method);
		EnableObj(F.rsync_port);
		EnableObj(F.rsync_userid);
		EnableObj(F.rsync_passwd);
		EnableObj(F.rsync_passwd_text);
		EnableObj(F.rsync_password_view);
		EnableObj(F.rsync_path);
		EnableObj(F.new_folder);
	}
	ClickRsyncPortMethod();
}


function ChangeBackupFolder()
{
        var F = document.nasmisc_fm;

	if(GetValue(F.rsync_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.new_folder);

           	F.new_folder.value = F.default_folder.value;
                F.new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.new_folder);

	

}

function  FocusNewFolder(obj,defaultobj)
{
        if(obj.value == defaultobj.value)
        {
                obj.value = '';
                obj.style.color = "#000000";
        }
}



function ClickTorrentPortMethod()
{
        var F = document.nasmisc_fm;

	if(!F.tr_remote_port_method)
		return;
        if (F.tr_remote_port_method.checked == false)
	{
		ReadOnlyObj(F.tr_remote_port,0);
	}
	else
	{
		F.tr_remote_port.value=9091;
		ReadOnlyObj(F.tr_remote_port,1);
	}

}


function InitTorrent()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.torrent_run) == 0)
	{
		if(F.tr_remote_port_method) DisableObj(F.tr_remote_port_method);
		DisableObj(F.tr_remote_port);
		DisableObj(F.torrent_userid);
		DisableObj(F.torrent_passwd);
		DisableObj(F.torrent_passwd_text);
		DisableObj(F.torrent_passwd_view);
		DisableObj(F.torrent_path);
		DisableObj(F.torrent_new_folder);
	}
	else
	{
		if(F.tr_remote_port_method) EnableObj(F.tr_remote_port_method);
		EnableObj(F.tr_remote_port);
		EnableObj(F.torrent_userid);
		EnableObj(F.torrent_passwd);
		EnableObj(F.torrent_passwd_text);
		EnableObj(F.torrent_passwd_view);
		EnableObj(F.torrent_path);
		EnableObj(F.torrent_new_folder);
	}
	ClickTorrentPortMethod();
}


function ChangeTorrentFolder()
{
        var F = document.nasmisc_fm;

	if(GetValue(F.torrent_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.torrent_new_folder);

           	F.torrent_new_folder.value = F.torrent_default_folder.value;
                F.torrent_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.torrent_new_folder);

}

function InstallTorrent()
{
        var F=document.nasmisc_fm;
        var F2=nas_service_iframe.main_form;

	F2.service.value = 'torrent';
	F2.install_torrent.value = 'install';
	F2.submit();
	DisableObj(F.torrent_install);
	F.torrent_install.color="#eeeeee";
	MaskIt(document,'apply_mask');
}

function ChangeApacheDocFolder()
{
        var F = document.nasmisc_fm;

	if(F.apache_doc_path.value.indexOf("_create_DxLoE2LK") < 0 && F.apache_doc_path.value === F.apache_server_path.value)
	{
		alert(MSG_APACHE_DOCROOT_SERVERROOT_WARNING);
		F.apache_doc_path.value = "select_apache_doc_folder";
	}

	if(GetValue(F.apache_doc_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.apache_doc_new_folder);

           	F.apache_doc_new_folder.value = F.apache_doc_default_folder.value;
                F.apache_doc_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.apache_doc_new_folder);

}


function ChangeApacheServerFolder()
{
        var F = document.nasmisc_fm;

	if(F.apache_doc_path.value.indexOf("_create_DxLoE2LK") < 0 && F.apache_doc_path.value === F.apache_server_path.value)
	{
		alert(MSG_APACHE_DOCROOT_SERVERROOT_WARNING);
		F.apache_server_path.value = "select_apache_server_folder";
	}

	if(GetValue(F.apache_server_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.apache_server_new_folder);

           	F.apache_server_new_folder.value = F.apache_server_default_folder.value;
                F.apache_server_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.apache_server_new_folder);

}


function ClickApachePortMethod()
{
        var F = document.nasmisc_fm;

        if(!F.apache_port_method)
                return;

        if(F.apache_port_method.checked == false)
                ReadOnlyObj(F.apache_port,0);
        else
        {
                F.apache_port.value=8080;
                ReadOnlyObj(F.apache_port,1);
        }
}


function InitApache()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.apache_run) == 0)
	{
		DisableObj(F.apache_doc_path);
		DisableObj(F.apache_port);
		DisableObj(F.apache_server_path);
		DisableObj(F.apache_doc_new_folder);
		DisableObj(F.apache_server_new_folder);
		DisableObj(F.apache_port_method);
	}
	else
	{
		EnableObj(F.apache_doc_path);
		EnableObj(F.apache_port);
		EnableObj(F.apache_server_path);
		EnableObj(F.apache_doc_new_folder);
		EnableObj(F.apache_server_new_folder);
		EnableObj(F.apache_port_method);
	}
	ClickApachePortMethod();
}


function ChangeMySQLFolder()
{
        var F = document.nasmisc_fm;

	if(GetValue(F.mysql_path).match('_create_DxLoE2LK'))
	{
		ShowObj(F.mysql_new_folder);

           	F.mysql_new_folder.value = F.mysql_default_folder.value;
                F.mysql_new_folder.style.color = "#aaaaaa";
	}
	else
		HideObj(F.mysql_new_folder);

}

function InitMySQL()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.mysql_run) == 0)
	{
		DisableObj(F.mysql_path);
		DisableObj(F.mysql_port);
		DisableObj(F.mysql_new_folder);
		DisableObj(F.mysql_use_client_charset);
		DisableObj(F.mysql_use_case);
		DisableObj(F.mysql_charset);
		DisableObj(F.mysql_max_allow_packet);
		DisableObj(F.mysql_port_method);
	}
	else
	{
		EnableObj(F.mysql_path);
		EnableObj(F.mysql_port);
		EnableObj(F.mysql_new_folder);
		EnableObj(F.mysql_use_client_charset);
		EnableObj(F.mysql_use_case);
		EnableObj(F.mysql_max_allow_packet);
		EnableObj(F.mysql_charset);
		EnableObj(F.mysql_port_method);
	}
	ClickMySQLPortMethod();
}



function ClickMySQLPortMethod()
{
        var F = document.nasmisc_fm;

        if(!F.mysql_port_method)
                return;

        if(F.mysql_port_method.checked == false)
                ReadOnlyObj(F.mysql_port,0);
        else
        {
                F.mysql_port.value=3306;
                ReadOnlyObj(F.mysql_port,1);
        }
}


function ClickAFPPortMethod()
{
	var F = document.nasmisc_fm;

	if(!F.afp_port_method)
		return;

	if(F.afp_port_method.checked == false)
		ReadOnlyObj(F.afp_port,0);
	else
	{
		F.afp_port.value=548;
		ReadOnlyObj(F.afp_port,1);
	}
}


function InitAFP()
{
        var F = document.nasmisc_fm;
	var i;

	if(GetRadioValue(F.afp_run) == 0)
	{
		if(F.afp_port_method) DisableObj(F.afp_port_method);
		DisableObj(F.afp_port);

		DisableObjNames('afp_property');
		DisableObjNames('afp_userid');
		DisableObjNames('afp_passwd');
		DisableObjNames('afp_passwd_text');
		DisableObjNames('afp_password_view');
		DisableObjNames('afp_folder');
	}
	else
	{
		if(F.afp_port_method) EnableObj(F.afp_port_method);

		EnableObj(F.afp_port);

		EnableObjNames('afp_property');
		EnableObjNames('afp_userid');
		EnableObjNames('afp_passwd');
		EnableObjNames('afp_passwd_text');
		EnableObjNames('afp_password_view');
		EnableObjNames('afp_folder');

		for(i=0;i<F.afp_userid.length;i++)
			ChangeUserProperty('afp',i);
	}

	ClickServicePortMethod();
	ClickAFPPortMethod();

}

function InitCUPS()
{
        var F = document.nasmisc_fm;
	if(GetRadioValue(F.cupsd_run) == 0)
		DisableObj(F.cupsd_remote);
	else
 		EnableObj(F.cupsd_remote);
}


</script>

