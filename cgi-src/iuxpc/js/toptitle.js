<script>
function NaviSaveConfig(msg)
{
        var F;
        var tmenu;
        var smenu;
        F=TBarFm.TBarHidden;
        if(F.value=="none")
        {
                tmenu='system';
                smenu='info';
        }
        else
        {
                tmenu=GetTmenu(F.value);
                smenu=GetSmenu(F.value);
        }
        if (confirm(msg))
        {
                parent.main_body.main.location.href="timepro.cgi?saveconfig=1&tmenu="+tmenu+"&smenu="+smenu;
        }
}

function GetTmenu(value)
{
        var idx;
        var str;
        idx=value.indexOf('_');
        str=value.substring(0,idx);
        return str;
}

function GetSmenu(value)
{
        var idx;
        var str;
        idx=value.indexOf('_');
        str=value.substring(idx+1);
        idx=str.lastIndexOf('_');
        str=str.substring(0,idx-2);  /* tmenu_smenu_3_td */
        return str;
}

function NaviHelp()
{
        var F;
        var tmenu;
        var smenu;
        var link;
        F=TBarFm.TBarHidden;
        if(F.value=="none")
                link="timepro.cgi?helpmenu=1&tmenu=system&smenu=info"
        else
        {
                tmenu=GetTmenu(F.value);
                smenu=GetSmenu(F.value);
                link="timepro.cgi?helpmenu=1&tmenu="+tmenu+"&smenu="+smenu
        }
        Child_id=window.open(link, null, 'toolbar=0,directoriefs=0,status=0,menubar=0,scrollbars=0,resizable=0,width=688,height=600');
	Child_id.focus();
}

function NaviRefresh()
{
        var F;
        var tmenu;
        var smenu;
        F=TBarFm.TBarHidden;
        if(F.value=="none")
                parent.main_body.main.location.href="timepro.cgi?tmenu=system&smenu=info"
        else
        {
                tmenu=GetTmenu(F.value);
                smenu=GetSmenu(F.value);
		var opt = parent.main_body.menu_title.document.getElementsByTagName('select');
		if(opt && opt.length > 0)
		{
			if(smenu === "macauth" || smenu === "multibridge")
				parent.main_body.main.location.href="timepro.cgi?tmenu="+tmenu+"&smenu="+smenu+"&wl_mode="+opt[0].value;
			else
				parent.main_body.main.location.href="timepro.cgi?tmenu="+tmenu+"&smenu="+smenu+"&mode="+opt[0].value;
		}
		else
		{
                	parent.main_body.main.location.href="timepro.cgi?tmenu="+tmenu+"&smenu="+smenu;
		}
        }
}

function NaviHelp2(width,height)
{
        var F;
        var tmenu;
        var smenu;
        var link;
        F=TBarFm.TBarHidden;
        if(F.value=="none")
                link="timepro.cgi?helpframe=1&helpmenu=1&tmenu=system&smenu=info"
        else
        {
                tmenu=GetTmenu(F.value);
                smenu=GetSmenu(F.value);
                link="timepro.cgi?helpframe=1&helpmenu=1&tmenu="+tmenu+"&smenu="+smenu
        }
        Child_id=window.open(link, null, 'toolbar=0,directoriefs=0,status=0,menubar=0,scrollbars=0,resizable=1,width='+width+' ,height='+height);
	Child_id.focus();
}


</script>

