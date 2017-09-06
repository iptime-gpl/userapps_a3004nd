<script>

function toggleDisplay( ifname, checked )
{
	function convertPw( str )
	{
		var value = "";
		for( var i = 0; i < str.length; ++i )
			value += "*";
		return value;
	}
	function setPw( pw )
	{
		var checkbox = document.getElementById("pwCheckbox_" + ifname ),
			pwCell = document.getElementById("pwCell_" + ifname );
		checked = checked || checkbox.checked;
		if( !pw || pw.length == 0 )
		{
			pwCell.innerHTML = BLANK_PW_TXT;
			checkbox.style.display = "none";
			checkbox.nextSibling.style.display = "none";
		}
		else 
		{
			checkbox.style.display = "";
			checkbox.nextSibling.style.display = "";
			if( checked )
				pwCell.innerHTML = pw.replace(/&/g, "&amp;")
							.replace(/</g, "&lt;")
							.replace(/>/g, "&gt;")
							.replace(/"/g, "&quot;")
							.replace(/'/g, "&#039;");
			else
				pwCell.innerHTML = convertPw( pw );
		}
	}
	setPw( document.getElementById("pwValue_" + ifname ).value );
}

function setPasswordDisplay( ifname )
{
	function hasChecked()
	{
		var parent_checkbox = parent.document.getElementById("pwCheckbox_" + ifname);
		return !!parent_checkbox && !!parent_checkbox.checked;
	}
	function setCheck( checked )
	{
		if( checked )
			checkbox.setAttribute("checked", "checked");
	}
	var checkbox = document.getElementById("pwCheckbox_" + ifname);
	if( !checkbox)
		return;
	var checked = hasChecked();
	setCheck( checked );
	toggleDisplay( ifname, checked);
}


</script>
