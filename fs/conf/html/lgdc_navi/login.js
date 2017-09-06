<script>

//login_navi
function login_main(flag)
{
	/*
	if(flag)
	{
        	Child_id=window.open('../cgi-bin/timepro.cgi?m1=main_frame&m2=main_frame','login_main','width=895px,height=661px,scrollbars=auto,menubar=no,toolbar=no,resizable=no');
		Child_id.focus();
	}
	else
	*/
	{
		location.href = "../cgi-bin/timepro.cgi?m1=main_frame&m2=main_frame";
	}
}

function login_wizard(link)
{
        if(link==1)
                Child_id=window.open('../cgi-bin/timepro.cgi?tmenu=wizard','login_wizard','width=550px,height=293px,scrollbars=no,menubar=no,toolbar=no,resizable=no,status=no');
        else
                Child_id=window.open('../cgi-bin/timepro.cgi?tmenu=wirelesswizard','login_wirelesswizard','width=550px,height=293px,scrollbars=no,menubar=no,toolbar=no,resizable=no,status=yes');
	Child_id.focus();
}


</script>
