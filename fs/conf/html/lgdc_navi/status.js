<script>

//status_internet
function SubmitStatusInternet(val) 
{
	var F=document.status_internet_fm;
	F.act.value = val;
	F.submit();
}

//status_network
function ApplyLinkSetup(port)
{
	var F=document.linksetup_fm;
	F.act.value = "setport"; 
	F.port.value = port;
	F.submit(); 
}

function ClearLinkStat()
{
	var F=document.linkstat_fm; 
	F.act.value = "clear"; 
	F.submit();
}

function SelectLinkMode(port)
{
	var F=document.linksetup_fm;
	var obj = document.getElementsByName('mode'+port);

	if(obj[0].value == 'auto')
	{
		DisableObjNames('speed'+port); 
		DisableObjNames('duplex'+port); 
	}
	else
	{
		EnableObjNames('speed'+port); 
		EnableObjNames('duplex'+port); 
	}
}

//sysconf_syslog
function ApplySyslog()
{
        var F=document.syslog_fm;
        F.act.value = 'apply';
        F.submit();
}

function ToggleEmailLog()
{
        var F=document.syslog_fm;;
        if(F.log_email_chk.checked == false )
        {
                F.email_hour.disabled = true;
                F.log_rmflag_chk.disabled = true;
        }
        else if(F.log_email_chk.checked == true )
        {
                F.email_hour.disabled = false;
                F.log_rmflag_chk.disabled = false;
        }
}

function Apply_Email()
{
        var F=document.syslog_fm;
        if((F.log_email_chk.checked == true) && checkRange(F.email_hour.value, 0, 23))
                alert(SYSCONF_SYSLOG_WANRING );
        else
        {
                F.act.value = "apply";
                F.submit();
        }
}

function Send_Email()
{
        var F=document.syslog_fm;
        if(confirm(SYSCONF_SYSLOG_EMAIL_CONFIRM ))
        {
                F.act.value = "sendmail";
                F.submit();
        }
}

function RemoveLog()
{
        var F=document.syslog_fm;
        if(confirm(SYSCONF_SYSLOG_CLEAR_CONFIRM ))
        {
                F.act.value = "remove";
                F.submit();
        }
}

function RefreshDdnsHost()
{
	var F = document.status_internet_fm;
	F.act.value = "refreshhost";
	F.submit();
}


</script>
