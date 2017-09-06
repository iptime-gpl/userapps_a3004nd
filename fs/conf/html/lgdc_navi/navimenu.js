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

function ChangeNaviPicon(alias, value)
{
        var picon = document.getElementById('picon_'+alias);
	if(picon)
	{
		if(value == 'block') 
			picon.src = "/images/navimenu_minusnode.gif";
		else 
			picon.src = "/images/navimenu_plusnode.gif";
	}
}

function ShowNaviTable(alias, value)
{
	var i;
	var table_arr=document.all.tags("table");
	var table_alias = "table_"+alias;

	for( i = 0 ; table_arr[i]; i++ )
	{
		if(value == 'block')
		{
			if( table_arr[i].id && table_arr[i].id == table_alias )
			{
				if (navigator.appName.indexOf("Microsoft") != -1)
					table_arr[i].style.display = value;
				else
					table_arr[i].style.display = "table-cell";
			}
		}
		else
		{
			if( table_arr[i].id && table_arr[i].id.substring(0, table_alias.length) == table_alias )
				table_arr[i].style.display = value;
		}
	}
}

function ClearNaviPicon(alias)
{
	var i;
	var picon_arr=document.all.tags("img");
	var picon_alias = "picon_"+alias;

	for( i = 0 ; picon_arr[i]; i++ )
	{
		if( picon_arr[i].id && picon_arr[i].id.substring(0, picon_alias.length) == picon_alias )
			picon_arr[i].src = "/images/navimenu_plusnode.gif";
	}
}


function ClearDisplayFlag(alias)
{
	var i;
	var F=document.navi_form;
	var hidden_alias = "display_flag_"+alias;

	for( i = 0 ; F.elements[i]; i++ )
	{
		if(!F.elements[i].type)
			continue;
		if(F.elements[i].type != 'hidden')
			continue;
		if( F.elements[i].name && F.elements[i].name.substring(0, hidden_alias.length) == hidden_alias )
			F.elements[i].value = 'none';
	}
}

var prev_m1_text;
var prev_m1_td;
function ChangeM1Class(alias)
{
	if(!prev_m1_td) prev_m1_td = document.getElementsByName('m1_td_status')[0];
	if(!prev_m1_text) prev_m1_text = document.getElementsByName('m1_text_status')[0];

	m1_td = document.getElementsByName('m1_td_'+alias);
	m1_text = document.getElementsByName('m1_text_'+alias);

	if(prev_m1_text) prev_m1_text.className='m1_text';
	if(prev_m1_td) prev_m1_td.className='m1_td';

	(m1_td[0].className=="m1_td")?(m1_td[0].className = "m1_s_td"):(m1_td[0].className = "m1_td"); 
	(m1_text[0].className=="m1_text")?(m1_text[0].className = "m1_s_text"):(m1_text[0].className = "m1_text"); 

	prev_m1_td = m1_td[0];
	prev_m1_text = m1_text[0];
}


function toggle(alias)
{
        var tdmenu;
        var picon;
        var menu;
        var foldericon;
        var F_advance;
        var F_basic;
        var fidx;

	var forms;

	var F= document.navi_form;

	flag=document.getElementsByName('display_flag_'+alias);
	flag[0].value = (flag[0].value=='none')?'block':'none';

	ShowNaviTable( alias, flag[0].value );
	ChangeNaviPicon(alias, flag[0].value);
	if(flag[0].value == 'none')
	{
		ClearDisplayFlag(alias);
        	ClearNaviPicon(alias);
	}

	return;


        if(F.display_flag.value =="none")
        {
                if(tdid!="")
                {
                        tdid.style.background="#aabcdc";
                        F.display_flag.value=tdid.id;
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
}
</script>

