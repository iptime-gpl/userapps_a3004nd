// JavaScript Document
function iux_update(identifier)
{
	var VAL_ID = 0;
	var VAL_ARTICLE = 1;
	var VAL_TAGNAME = 2;

	$("[sid^='" + identifier + "_']").each(function()
	{
		var sid = $(this).attr("sid");	
		var type = $(this).attr("type");
		var l_sid = sid.toLowerCase();
		var l_sid_s = l_sid.split("_");
	
		if(identifier == "C")
		{	
			if( $(this).hasClass("ip") || $(this).hasClass("mac") )
			{
				var getvalue = eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME]);
				var value_s;
				if(!getvalue)
					var value_s = ["","","","","",""];
				else
				{
					if( $(this).hasClass("ip") )
						var value_s = getvalue.split(".");
					else if( $(this).hasClass("mac") )
						var value_s = getvalue.split("-");
						if(value_s.length == 1)
							value_s = getvalue.split(":");
				}
				var arraycount = value_s.length;
				if(arraycount > 0)
				{
					for(var i=0;i<arraycount;i++)
						$('[sid="VALUE'+i+'"]', this).val(value_s[i]);
				}
			}
			else
			{
				switch(type)
				{	
					case "radio":
						if(eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME]) == 1 )
						{
							$("#" + l_sid_s[VAL_TAGNAME] + "_true").prop('checked', true).checkboxradio("refresh");
							$("#" + l_sid_s[VAL_TAGNAME] + "_false").removeAttr('checked').checkboxradio("refresh"); 
						}
						else
						{
							$("#" + l_sid_s[VAL_TAGNAME] + "_true").removeAttr('checked').checkboxradio("refresh");
							$("#" + l_sid_s[VAL_TAGNAME] + "_false").prop('checked', true).checkboxradio("refresh"); 
						}
						break;
						
					case "checkbox":
						eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME]) == 1 ? 
							$('[sid="' + sid + '"]').prop('checked', 'checked').checkboxradio("refresh") :
							$('[sid="' + sid + '"]').removeAttr('checked').checkboxradio("refresh") ;
						break;	
					case "select":
						//static strings input first
						var predefined_str = ("S_"+l_sid_s[VAL_ARTICLE]+"_"+l_sid_s[VAL_TAGNAME]).toUpperCase();
						var val = eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + $(this).attr("name"));
						var listObjs = S_lang[predefined_str];
						
						$('[sid="' + sid + '"]').find('option').remove();
	
						for(var idx = 0; (listObjs && idx < listObjs.length); idx++){
							var nm = listObjs[idx];
							$('[sid="' + sid + '"]')
								.append("<option value='" + nm.value + ( (val == nm.value)?"' selected>":"' >")	+ nm.text + "</option>");
						}		

						//config select data input last
						var list_s = eval("config_data." + l_sid_s[VAL_ARTICLE] + ".select");
						if(list_s)
							list_s = eval("list_s." + l_sid_s[VAL_TAGNAME]);
							
						if(list_s){
							for(var i=0; i<list_s.length; i++)
							{
								if(list_s[i].value != ""){
									$('[sid="' + sid + '"]')
										.append("<option value='" + list_s[i].value 
										+ ((list_s[i].value == val)?"' selected>":"'>")+list_s[i].text+"</option>");
								}
							}
						}
						$(this).attr("value", val);
						$('[sid="' + sid + '"]').selectmenu('refresh', true);
						break;					
					case "text":
					case "number" :
					case "password":
						var pholder = M_lang[("S_"+l_sid_s[VAL_ARTICLE]+"_"+l_sid_s[VAL_TAGNAME]).toUpperCase()];
						if(pholder)
							$('[sid="' + sid + '"]').attr('placeholder',pholder);
						$('[sid="' + sid + '"]').val(eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME]));
						break;
					case "slider":
						$('[sid="' + sid + '"]')
							.val(eval("config_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME])).slider('refresh');
						break;
				}
			}
		}

		else if (identifier == "D")
		{
			if( $(this).hasClass("ip") || $(this).hasClass("mac") )
			{
				var getvalue = eval("status_data." + l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME]);
				var value_s;
				if(!getvalue)
					var value_s = ["","","",""];
				else
				{
					if( $(this).hasClass("ip") )
						var value_s = getvalue.split(".");
					else if( $(this).hasClass("mac") )
						var value_s = getvalue.split("-");
				}
				var arraycount = value_s.length;
				if(arraycount > 0)
				{
					for(var i=0;i<arraycount;i++)
						$('[sid="VALUE'+i+'"]', this).val(value_s[i]);
				}
			}
			else
				$('[sid="' + sid + '"]').text(M_lang["D_" + eval("status_data."+ l_sid_s[VAL_ARTICLE] + "." + l_sid_s[VAL_TAGNAME] + "")]);
		}	
		else // (identifier == "S" or etc)
		{
			if(type){
				switch(type){
					case "select":
					case "text":
					case "number" :
					case "password":
					case "radio":
					case "checkbox":
					default:
						$('[sid="' + sid + '"]').attr('value',M_lang[sid]);
						break;
				}
			}
			else
				$('[sid="' + sid + '"]').text(M_lang[sid]);
		}	
	});
	events.emit( "iux_update."+ identifier );
	iux_update_local(identifier);
}
