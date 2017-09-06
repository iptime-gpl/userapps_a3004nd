<script>
var SAVE_CONFIGURATION_STRING="설정을 저장하시겠습니까?"

function NaviSaveConfig()
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
        if (confirm(SAVE_CONFIGURATION_STRING))
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
        idx=str.indexOf('_');
        str=str.substring(0,idx);
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
                parent.main_body.main.location.href="timepro.cgi?tmenu="+tmenu+"&smenu="+smenu
        }
}
</script>

