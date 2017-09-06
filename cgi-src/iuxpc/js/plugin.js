<script>

var PLUGIN_STATUS_NOACTION=0
var PLUGIN_STATUS_START_INSTALL=1
var PLUGIN_STATUS_START_UPDATE=2
var PLUGIN_STATUS_START_REMOVE=3
var PLUGIN_STATUS_INSTALLING=4
var PLUGIN_STATUS_UPDATING=5
var PLUGIN_STATUS_REMOVING=6
var PLUGIN_STATUS_INSTALLED=7
var PLUGIN_STATUS_REMOVED=8
var PLUGIN_STATUS_INSTALL_FAIL=10
var PLUGIN_STATUS_REMOVE_FAIL=11
var PLUGIN_STATUS_UPDATE_FAIL=12
var PLUGIN_STATUS_NOT_INSTALLED=20
var PLUGIN_STATUS_NEED_UPDATE=21



function PluginButtonControlInstall()
{
	var bt_objs = document.getElementsByName('package_bt');
	var pkg_objs = document.getElementsByName('package_name');
	var bt_status_objs = document.getElementsByName('package_bt_status');
	var i;
	var status_code;
        var package=document.main_form.click_package.value;

	for(i=0 ; i < bt_objs.length; i++)
	{
		status_code = parseInt(bt_status_objs[i].value);
		switch(status_code)
		{
			case PLUGIN_STATUS_REMOVED:
			case PLUGIN_STATUS_NOT_INSTALLED:
			case PLUGIN_STATUS_INSTALL_FAIL:
				if(package != "" && package == pkg_objs[i].value )
				{
					bt_objs[i].value = PLUGIN_INSTALL_BT_TXT;
					ShowObj(bt_objs[i]);
				}
				else
					HideObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_START_INSTALL:
			case PLUGIN_STATUS_START_UPDATE:
			case PLUGIN_STATUS_INSTALLING:
			case PLUGIN_STATUS_UPDATING:
				bt_objs[i].value = PLUGIN_CANCEL_BT_TXT;
				ShowObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_START_REMOVE:
			case PLUGIN_STATUS_REMOVING:
				HideObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_NEED_UPDATE:
			case PLUGIN_STATUS_UPDATE_FAIL:
				bt_objs[i].value = PLUGIN_UPDATE_BT_TXT;
				ShowObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_INSTALLED:
			case PLUGIN_STATUS_REMOVE_FAIL:
				HideObj(bt_objs[i]);
				break;
		}
	}
}

function PluginButtonControlSetup()
{
	var bt_objs = document.getElementsByName('package_bt');
	var connect_bt_objs = document.getElementsByName('package_connect_bt');
	var pkg_objs = document.getElementsByName('package_name');
	var bt_status_objs = document.getElementsByName('package_bt_status');
	var i;
	var status_code;
        var package=document.main_form.click_package.value;

	for(i=0 ; i < bt_objs.length; i++)
	{
		status_code = parseInt(bt_status_objs[i].value);
		switch(status_code)
		{
			case PLUGIN_STATUS_REMOVED:
			case PLUGIN_STATUS_NOT_INSTALLED:
			case PLUGIN_STATUS_INSTALL_FAIL:
				self.location.href = "timepro.cgi?tmenu=iframe&smenu=plugin_setup";
				break;
			case PLUGIN_STATUS_START_INSTALL:
			case PLUGIN_STATUS_START_UPDATE:
			case PLUGIN_STATUS_INSTALLING:
			case PLUGIN_STATUS_UPDATING:
				HideObj(connect_bt_objs[i]);
				bt_objs[i].value = PLUGIN_CANCEL_BT_TXT;
				ShowObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_START_REMOVE:
			case PLUGIN_STATUS_REMOVING:
				HideObj(connect_bt_objs[i]);
				HideObj(bt_objs[i]);
				break;
			case PLUGIN_STATUS_NEED_UPDATE:
			case PLUGIN_STATUS_UPDATE_FAIL:
				bt_objs[i].value = PLUGIN_UPDATE_BT_TXT;
				break;
			case PLUGIN_STATUS_INSTALLED:
			case PLUGIN_STATUS_REMOVE_FAIL:
				if(package != "" && package == pkg_objs[i].value )
				{
					ShowObj(connect_bt_objs[i]);
					bt_objs[i].value = PLUGIN_REMOVE_BT_TXT;
					ShowObj(bt_objs[i]);
				}	
				else
				{
					HideObj(bt_objs[i]);
					HideObj(connect_bt_objs[i]);
				}
				break;
		}
	}
}

function PluginInstall(package_name)
{
	var obj=document.getElementById('package_bt_status_'+package_name);
	var bt_obj=document.getElementById('package_bt_'+package_name);

	if(document.main_form.numofmount.value == '0' )
	{
		alert(MSG_PLUGIN_NO_USB_HDD);
		return;
	}

	if(bt_obj && (bt_obj.value == PLUGIN_CANCEL_BT_TXT))
		iframe_plugin_action.plugin_action_fm.act.value = 'cancel';
	else 
	{
		iframe_plugin_action.plugin_action_fm.act.value = 'install';
		if(obj) obj.value=PLUGIN_STATUS_START_INSTALL;
	}

	iframe_plugin_action.plugin_action_fm.package.value = package_name;
	iframe_plugin_action.plugin_action_fm.submit();

	PluginButtonControlInstall();
}

function PluginHideSetupLine(package)
{
	var pkg_objs = document.getElementsByName('package_name');
	var line_obj;
	var rownum=0;
	var blank_line_objs = document.getElementsByName('blank_line');

	for(i=0 ; i < pkg_objs.length; i++)
	{
		line_obj=document.getElementById(pkg_objs[i].value+'_setup_line');
		if(package == pkg_objs[i].value)
		{		
			HideObj(document.getElementById(package+'_setup_line'));
			continue;
		}

		if(line_obj.style.display == 'none') continue;

		if(rownum%2)
			line_obj.style.backgroundColor="#f7f7f7";
		else	
			line_obj.style.backgroundColor="#ffffff";
		rownum++;
	}

	if(blank_line_objs)
	{
		for(i=0 ; i < blank_line_objs.length; i++)
		{
			if(rownum%2)
				blank_line_objs[i].style.backgroundColor="#f7f7f7";
			else	
				blank_line_objs[i].style.backgroundColor="#ffffff";
			rownum++;
		}

		for(i=0 ; i < blank_line_objs.length; i++)
		{
			if(blank_line_objs[i].style.display=='none')
			{
				blank_line_objs[i].style.display='';
				break;	
			}
		}

	}
}

function UpdatePluginButtonStatus(package,status)
{
	var bt_status = parent.document.getElementById('package_bt_status_'+package);

	bt_status.value = status;
	if(parent.main_form.smenu.value == 'plugin_install')
		parent.PluginButtonControlInstall();
	else
		parent.PluginButtonControlSetup();
}


function ClickPluginInstall(package)
{
        var prev_id = document.main_form.click_id.value;
        var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = package+'_install_line';
	var obj = document.getElementById(click_id);
	var package_status=document.getElementById('package_bt_status_'+package);


	if(!obj) return;
	if( (document.main_form.prohibit_click.value!='')
	&& (document.main_form.prohibit_click.value != package)) return; 

        if(prev_id == click_id) return;

        if(prev_id)
                document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;

        document.main_form.click_package.value = package;
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;

        if(obj)
        {
                obj.style.backgroundColor='#C9D5E9';
                obj.style.color='#000000';
        }

	PluginButtonControlInstall();
}


function ClickPluginSetup(package)
{
        var prev_id = document.main_form.click_id.value;
        var prev_bgcolor=document.main_form.click_bg.value;
        var click_id = package+'_setup_line';
	var obj = document.getElementById(click_id);

	if(!obj) return;
	if( (document.main_form.prohibit_click.value!='')
	&& (document.main_form.prohibit_click.value != package)) return; 

        if(prev_id == click_id) return;

        if(prev_id)
                document.getElementById(prev_id).style.backgroundColor = prev_bgcolor;

        document.main_form.click_package.value = package;
        document.main_form.click_id.value = click_id;
        document.main_form.click_bg.value = obj.style.backgroundColor;

        if(obj)
        {
                obj.style.backgroundColor='#C9D5E9';
                obj.style.color='#000000';
        }

	PluginButtonControlSetup();
}


function PluginRemove(package_name)
{
	var obj=document.getElementById('package_bt_status_'+package_name);
	var bt_obj=document.getElementById('package_bt_'+package_name);

	if(bt_obj && (bt_obj.value == PLUGIN_CANCEL_BT_TXT))
	{
		PluginButtonControlSetup();
		iframe_plugin_action.plugin_action_fm.act.value = 'cancel';
		iframe_plugin_action.plugin_action_fm.package.value = package_name;
		iframe_plugin_action.plugin_action_fm.submit();
	}
	else 
	{
		if(!confirm(MSG_REMOVE_PLUGIN_APP))
			return;

		if(obj) obj.value=PLUGIN_STATUS_START_REMOVE;

		PluginButtonControlSetup();
		iframe_plugin_action.plugin_action_fm.act.value = 'remove';
		iframe_plugin_action.plugin_action_fm.package.value = package_name;
		iframe_plugin_action.plugin_action_fm.submit();
	}
}

function PluginFinishInstall(package_name)
{
	var obj=document.getElementById('package_bt_status_'+package_name);

	if(!confirm(MSG_INSTALL_FINISH_MOVE_PAGE))
		return;
	parent.parent.MovePagetoMainURL('plugin','setup','package='+package_name );
}

function ConnectApacheApps(url)
{
	if(document.main_form.apache_run.value == '1')
	{
		window.open(url);
	}
	else
		alert(MSG_APACHE_RUN_WARNING);

}


</script>
