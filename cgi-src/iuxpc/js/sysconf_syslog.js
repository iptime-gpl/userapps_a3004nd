<script>

function ChangeToClickColor(obj)
{
	if(obj.className.indexOf("highlight_selected") >= 0 )
		obj.className = obj.className.replace("highlight_selected", "highlight");
	else if(obj.className.indexOf("selected") >= 0)
		obj.className = obj.className.replace("selected", "");
	else if(obj.className.indexOf("highlight") >= 0)
		obj.className = obj.className.replace("highlight", "highlight_selected");
	else
		obj.className += " selected";
}

function ChangeToOverColor(obj)
{
	if(obj.className.indexOf("highlight_selected") >= 0 || obj.className.indexOf("highlight") >= 0 )
		return;

	if(obj.className.indexOf("selected") >= 0 )
		obj.className = obj.className.replace("selected", "highlight_selected");
	else if(obj.className.replace(/\s/, "").length === 0)
		obj.className = obj.className = "highlight";
}

function ChangeToOutColor(obj)
{
	if(obj.className.indexOf("highlight_selected") >= 0 )
		obj.className = obj.className.replace("highlight_selected", "selected");
	else if(obj.className.indexOf("highlight") >= 0 )
		obj.className = obj.className.replace("highlight", "");
}

function ApplySyslog()
{
	function copySyslogInputValue()
	{
		for( var i = 0; i < F2.log_flag.length; ++i)
			F2.log_flag[i].checked = F.log_flag[i].checked;
		if(F2.log_email_chk)
			F2.log_email_chk.checked= F.log_email_chk.checked;
		if(F2.log_rmflag_chk)
			F2.log_rmflag_chk.checked= F.log_rmflag_chk.checked;
		if(F2.email_hour)
			F2.email_hour.value = F.email_hour.value;
	}
	var F = document.syslog_fm,
		F2 = document.getElementsByName("sysconf_syslog_setup_status")[0].contentWindow.document.syslog_fm;

	if( !!F.log_email_chk && (F.log_email_chk.checked == true) && checkRange(F.email_hour.value, 0, 23)) 
	{
		alert(SYSCONF_SYSLOG_WANRING );
		return;
	}
	copySyslogInputValue();

	MaskIt(parent.document, 'apply_mask');
	F2.act.value = 'apply';
	F2.submit();
}

function Send_Email()
{
	var F2 = document.getElementsByName("sysconf_syslog_setup_status")[0].contentWindow.document.syslog_fm;
	if(!confirm(SYSCONF_SYSLOG_EMAIL_CONFIRM))
		return;

	MaskIt(parent.document, 'apply_mask');
	F2.act.value = "sendmail";
	F2.submit(); 
}

function RemoveLog()
{
	var F2 = document.getElementsByName("sysconf_syslog_log_clear")[0].contentWindow.document.syslog_fm;
	if(!confirm(SYSCONF_SYSLOG_CLEAR_CONFIRM ))
		return;

	MaskIt(document, 'apply_mask');
	F2.submit(); 
}

function setTRBackgroundColor()
{
	var color1 = parent.document.getElementsByTagName("TR")[0].style.backgroundColor;
	var color2 = color1.match("255")? "#F7F7F7": "#FFF";
	var newTr = document.getElementsByTagName("TR");
	for(var i = newTr.length - 2; i >= 0; i -= 2)
		newTr[i].style.backgroundColor = color1;
	for(var i = newTr.length - 1; i >= 0; i -= 2)
		newTr[i].style.backgroundColor = color2;
}

function DeleteBlankTr()
{
	var blankTr = parent.document.getElementsByTagName("p");
	if(blankTr.length === 0)
		return;
	var count = parent.document.getElementsByTagName("tr").length;
	var length = blankTr.length;

	for( var index = blankTr.length - 1; index >= 0 && count + index >= 14 + length; --index)
		blankTr[index].parentNode.parentNode.style.display = "none";
}

function toggleTimeCheckbox()
{
	var timeInput = document.getElementById('email_hour');
	if(!timeInput)
		return;

	if( document.getElementById('log_email_chk').checked )
	{
		timeInput.style.backgroundColor = "";
		timeInput.disabled = false;
	}
	else
	{
		timeInput.style.backgroundColor = "#EEE";
		timeInput.disabled = true;
	}
}

</script>
