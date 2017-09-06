<script>
// for apply wait page
var Pos = 0;
var ProgressColor = '#9ccb4a';
var ApplyAniBgColor = '#399242';
var ProgressInterval = 40;
var ProgressTimer;
var Direction = 'right';
var BarWidth = 10;

function StartApplyAni()
{
	Pos = 0; 
	ProgressColor = '#9ccb4a';
	ApplyAniBgColor = '#399242'; 
	ProgressInterval = 40; 
	ProgressTimer; 
	Direction = 'right'; 
	BarWidth = 10;

	for( idx = 1 ;  ; idx ++ )
	{
	       	obj = document.getElementById('progress'+idx );
		if(!obj) break;
	       	obj.style.backgroundColor = ApplyAniBgColor;
	}
	AniUpdate();
}

function AniUpdate() 
{ 
	var HideIdx;

	if(Direction == 'right') Pos++;
	else Pos--;

	if(Direction == 'right')
		HideIdx = Pos - BarWidth; 
	else
		HideIdx = Pos + BarWidth; 

	obj = document.getElementById('progress'+HideIdx);
	if(obj) obj.style.backgroundColor = '#399242';
	if(HideIdx > 0 &&  !obj)
		Pos = 0;
	obj = document.getElementById('progress'+Pos);
	if(obj) obj.style.backgroundColor = ProgressColor;
	ProgressTimer = setTimeout('AniUpdate()',ProgressInterval);
}


// for upgrade or reboot page
function StartProgress(interval)
{
	Pos = 0; 
	ProgressColor = '#9ccb4a';
	ApplyAniBgColor = '#399242'; 
	ProgressInterval = interval; 
	Direction = 'right'; 

	for( idx = 1 ;  ; idx ++ )
	{
	       	obj = document.getElementById('progress'+idx );
		if(!obj) break;
	       	obj.style.backgroundColor = ApplyAniBgColor;
	}
	ProgressUpdate();
}

function ProgressUpdate() 
{ 
	var HideIdx;

	Pos++;
	obj = document.getElementById('progress'+Pos);
	if(obj) obj.style.backgroundColor = ProgressColor;
	ProgressTimer = setTimeout('ProgressUpdate()',ProgressInterval);
}
</script>
