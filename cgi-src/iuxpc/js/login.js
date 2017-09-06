<script>

//login_navi
function login_main(url,flag,width,height)
{
	if(flag)
	{
        	Child_id=window.open(url,'login_main','width='+width+',height='+height+',scrollbars=auto,menubar=no,toolbar=no,resizable=no');
		Child_id.focus();
	}
	else
	{
		location.href = url;
	}
}

function login_wizard(url,link)
{
        if(link==1)
                Child_id=window.open(url,'login_wizard','width=550px,height=293px,scrollbars=no,menubar=no,toolbar=no,resizable=no,status=no');
        else
                Child_id=window.open(url,'login_wirelesswizard','width=550px,height=293px,scrollbars=no,menubar=no,toolbar=no,resizable=no,status=yes');
	Child_id.focus();
}


</script>
