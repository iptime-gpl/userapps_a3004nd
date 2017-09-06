<script>
function findChildNode(node, name)
{
        var temp;
        if (node == null)
        {
                return null;
        }
        node = node.firstChild;
        while (node != null)
        {
                if (node.nodeName == name)
                {
                        return node;
                }
                temp = findChildNode(node, name);
                if (temp != null)
                {
                        return temp;
                }
                node = node.nextSibling;
        }
        return null;
}

function GetNaviFrameIndex(value)
{
        var idx;
        var div;
        idx=value.lastIndexOf('_');
        div=value.substring(idx-1,idx);
        return div;
}
function GetTmenu(value)
{
	var idx;
	var str;
	idx=value.indexOf('_');
	str=value.substring(0,idx);
	return str;
}

function toggle_detail_help(tdid)
{
	var tdmenu;
	var F;
	var fidx;
	var TbarF;
	var menu;
	var id;
	var tmenu;
								

        F=parent.navi_menu_advance.document.navi_advance_form.navi_advance_hidden;
        if(tdid=='')
        {
		F.value=top.opener.document.TBarFm.TBarHidden.value;
                idx=GetNaviFrameIndex(F.value);
		if(idx!=2)
		{
			tmenu=GetTmenu(F.value);
			id=tmenu+'_setup';
			menu=parent.navi_menu_advance.document.getElementById('advance_setup');
			if(menu.style.display!="block" || menu.style.display=="table-cell")
       				changeNaviTitleMenuState('advance_setup');
       			menu=parent.navi_menu_advance.document.getElementById(id);
       			if(menu.style.display!="block" || menu.style.display=="table-cell")
       				changeNaviTitleMenuState(id);
		}
                tdid=F.value;
        }

        if(F.value=="none")
        {
                idx=GetNaviFrameIndex(tdid);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(tdid);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(tdid);
                tdmenu.style.background="#aabcdc";
                F.value=tdid;
                tdmenu = findChildNode(tdmenu, "SPAN");
                if(tdmenu.className=="linknavimenu")
                {
                        tdmenu.className = "blurnavimenu" ;
                }
        }
        else
        {
                idx=GetNaviFrameIndex(F.value);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(F.value);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(F.value);
                tdmenu.style.background="#ffffff";

                tdmenu = findChildNode(tdmenu, "SPAN");
                if(tdmenu.className=="blurnavimenu")
                        tdmenu.className = "linknavimenu" ;

                idx=GetNaviFrameIndex(tdid);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(tdid);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(tdid);
                tdmenu.style.background="#aabcdc";

                F.value=tdid;
                tdmenu = findChildNode(tdmenu, "SPAN");
                tdmenu.className = "blurnavimenu" ;
        }
}

function toggle_detail(tdid)
{
        var tdmenu;
        var F;
        var fidx;
        var TbarF;

        TBarF=parent.parent.parent.nave_menu.document.TBarFm.TBarHidden;
        F=parent.navi_menu_advance.document.navi_advance_form.navi_advance_hidden;
        if(F.value=="none")
        {
                idx=GetNaviFrameIndex(tdid);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(tdid);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(tdid);
                tdmenu.style.background="#aabcdc";
                F.value=tdid;
                TBarF.value=tdid;
                tdmenu = findChildNode(tdmenu, "SPAN");
                if(tdmenu.className=="linknavimenu")
                {
                        tdmenu.className = "blurnavimenu" ;
                }
        }
        else
        {
                idx=GetNaviFrameIndex(F.value);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(F.value);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(F.value);
                tdmenu.style.background="#ffffff";

                tdmenu = findChildNode(tdmenu, "SPAN");
                if(tdmenu.className=="blurnavimenu")
                        tdmenu.className = "linknavimenu" ;

                idx=GetNaviFrameIndex(tdid);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(tdid);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(tdid);
                tdmenu.style.background="#aabcdc";

                F.value=tdid;
                TBarF.value=tdid;
                tdmenu = findChildNode(tdmenu, "SPAN");
                tdmenu.className = "blurnavimenu" ;
        }
}

function changeNaviTitleMenuState(id)
{
        if(id=="")
                return ;
        menu = parent.navi_menu_advance.document.getElementById(id);

	if(parent.navi_menu_basic.document.navi_basic_form.image_prefix)
		image_prefix = parent.navi_menu_basic.document.navi_basic_form.image_prefix.value;
	else
		image_prefix = '/images';

        if(id=="basic_setup")
        {
                foldericon = parent.navi_menu_advance.document.getElementById('basic_foldericon');
        }
        else if(id=="advance_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('advance_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('advance_foldericon');
                if(menu.style.display=="none" || menu.style.display=="")
                {
			if (navigator.appName.indexOf("Microsoft") != -1)
				menu.style.display="block";
			else
				menu.style.display="table-cell";
                        picon.src = image_prefix+"/navimenu_minusnode.gif";
                }
                else
                {
                        menu.style.display="none";
                        picon.src = image_prefix+"/navimenu_plusnode.gif";
                }
                return ;
        }
        else if(id=="netconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('netconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('netconf_foldericon');
        }
        else if(id=="wirelessconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('wirelessconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('wirelessconf_foldericon');
        }
        else if(id=="wirelessconf5g_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('wirelessconf5g_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('wirelessconf5g_foldericon');
        }
        else if(id=="natrouterconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('natrouterconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('natrouterconf_foldericon');
        }
        else if(id=="wirelessband_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('wirelessband_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('wirelessband_foldericon');
        }
        else if(id=="firewallconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('firewallconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('firewallconf_foldericon');
        }
        else if(id=="expertconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('expertconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('expertconf_foldericon');
        }
        else if(id=="trafficconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('trafficconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('trafficconf_foldericon');
        }
        else if(id=="nasconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('nasconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('nasconf_foldericon');
        }
	else if(id=="basicapp_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('basicapp_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('basicapp_foldericon');
        }
	else if(id=="pluginapp_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('pluginapp_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('pluginapp_foldericon');
        }
        else if(id=="sysconf_setup")
        {
                picon = parent.navi_menu_advance.document.getElementById('sysconf_picon');
                foldericon = parent.navi_menu_advance.document.getElementById('sysconf_foldericon');
                if(menu.style.display=="block" || menu.style.display=="table-cell")
                {
                        menu.style.display="none";
                        picon.src = image_prefix+"/last_plus.gif";
                }
                else
                {
			if (navigator.appName.indexOf("Microsoft") != -1)
				menu.style.display="block";
			else
				menu.style.display="table-cell";
                        picon.src = image_prefix+"/last_minus.gif";
                }
                return ;
        }

        if(menu.style.display=="block" || menu.style.display=="table-cell")
        {
                menu.style.display="none";
                picon.src = image_prefix+"/middle_plus.gif";
        }
        else
        {
		if (navigator.appName.indexOf("Microsoft") != -1)
			menu.style.display="block";
		else
			menu.style.display="table-cell";
                picon.src = image_prefix+"/middle_minus.gif";
        }
}

function toggle(id,tdid)
{
        var tdmenu;
        var picon;
        var menu;
        var foldericon;
        var F_advance;
        var F_basic;
        var fidx;

        if(id=="basic_setup")
                return ;
        F=parent.navi_menu_advance.document.navi_advance_form.navi_advance_hidden;
        if(F.value=="none")
        {
                if(tdid!="")
                {
                        tdid.style.background="#aabcdc";
                        F.value=tdid.id;
                }
        }
        else
        {
                idx=GetNaviFrameIndex(F.value);
                if(idx==2)
                        tdmenu = parent.navi_menu_basic.document.getElementById(F.value);
                else
                        tdmenu = parent.navi_menu_advance.document.getElementById(F.value);
                if(tdid=="")
                {
                        tdmenu.style.background="#ffffff";
                        tdmenu = findChildNode(tdmenu, "SPAN");
                        if(tdmenu.className=="blurnavimenu")
                                tdmenu.className = "linknavimenu" ;
                        F.value="none";
                }
                else
                {
                        tdmenu.style.background="#ffffff";
                        tdmenu = findChildNode(tdmenu, "SPAN");
                        if(tdmenu.className=="blurnavimenu")
                                tdmenu.className = "linknavimenu" ;
                        tdid.style.background="#aabcdc";
                        F.value=tdid.id;
                }
        }
        changeNaviTitleMenuState(id)
}
</script>

