var MODE_G_AND_B=1;
var MODE_B_ONLY=2;
var MODE_G_ONLY=3;

var MODE_N_ONLY=4;
var MODE_G_N=5;
var MODE_B_G_N=6;
var MODE_N_5G=9;
var MODE_11AC=10;
var MODE_11AC_ONLY=11;


function GetChannelBW(val)
{
	if((val == MODE_11AC) || (val==MODE_11AC_ONLY ))
		return '80';
	else if((val == MODE_N_ONLY)||(val==MODE_G_N)||(val==MODE_B_G_N)||(val==MODE_N_5G))
		return '40';
	else
		return '20';
}

function GetFreqDesc(ctl_ch,cent_ch,mode)
{
//	var desc = ctl_ch+'  [ '+((ctl_ch>cent_ch)?'~':'');
	var desc = ctl_ch+'  [ ';

	if(mode == MODE_N_5G || mode == MODE_11AC || mode == MODE_11AC_ONLY)
		desc += '5.'+5*ctl_ch;
	else
	{
		if(ctl_ch == 14)
			desc += '2.484';
		else
			desc += '2.'+(407+5*ctl_ch);
	}
	desc += ' GHz';
//	desc += ((ctl_ch<cent_ch)?'~':'');
	if(ctl_ch != cent_ch)
		desc += ','+((ctl_ch<cent_ch)?UPPER_CHANNEL_TXT:LOWER_CHANNEL_TXT);

	desc += ' ]';
	return desc;
}

function ChangeCountryCode(control_channel, central_channel)
{
        var F=document.basicsetup_fm;
        var country = F.country.value;
        var channeldesc;
        var bw;


/*
	if(F.channel_width.value == '20')
		bw = '20';
	else if(F.channel_width.value == '40')
		bw = '40';
	else if(F.channel_width.value == '80')
		bw = '80';
	else
*/
	bw = GetChannelBW(F.mode.value);
	if(bw > F.channel_width.value)
		bw = F.channel_width.value;

	var ctl_arr = control_channel_arr[country+'_'+bw];
	var cent_arr = central_channel_arr[country+'_'+bw];

//	alert(ctl_arr);
	if(!ctl_arr) return;

        F.channel.length = control_channel_arr[country+'_'+bw].length;

	if(F.smenu.value == 'multibridge') 
		channeldesc = MBRIDGE_AUTO_CHANNEL_SEARCH;
	else
                channeldesc = AUTO_STRING+'('+GetFreqDesc(control_channel,central_channel,F.mode.value)+')';


        F.channel[0] = new Option( channeldesc,'0');
	selectIdx=0;
        for( var i in ctl_arr )
	{
		channeldesc = GetFreqDesc(ctl_arr[i] ,cent_arr[i],F.mode.value);
        	F.channel[parseInt(i)+1] = new Option(channeldesc, ctl_arr[i]+'.'+cent_arr[i]);
		if((ctl_arr[i]+'.'+cent_arr[i]) == (control_channel+'.'+central_channel))
			selectIdx = parseInt(i)+1;
	}

	if(F.auto_channel && (F.auto_channel.value == 1))
		F.channel[0].selected = true;
	else
		F.channel[selectIdx].selected = true;
}
