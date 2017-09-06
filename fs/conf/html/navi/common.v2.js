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

function sprintf()
{
        if (!arguments || arguments.length < 1 || !RegExp)
        {
                return;
        }
        var str = arguments[0];
        var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
        var a = b = [], numSubstitutions = 0, numMatches = 0;
        while (a = re.exec(str))
        {
                var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
                var pPrecision = a[5], pType = a[6], rightPart = a[7];



                numMatches++;
                if (pType == '%')
                {
                        subst = '%';
                }
                else
                {
                        numSubstitutions++;
                        if (numSubstitutions >= arguments.length)
                        {
                                alert('Error! Not enough function arguments (' + (arguments.length - 1) + ', excluding the string)\nfor the number of substitution parameters in string (' + numSubstitutions + ' so far).');
                        }
                        var param = arguments[numSubstitutions];
                        var pad = '';
                               if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
                          else if (pPad) pad = pPad;
                        var justifyRight = true;
                               if (pJustify && pJustify === "-") justifyRight = false;
                        var minLength = -1;
                               if (pMinLength) minLength = parseInt(pMinLength);
                        var precision = -1;
                               if (pPrecision && pType == 'f') precision = parseInt(pPrecision.substring(1));
                        var subst = param;
                               if (pType == 'b') subst = parseInt(param).toString(2);
                          else if (pType == 'c') subst = String.fromCharCode(parseInt(param));
                          else if (pType == 'd') subst = parseInt(param) ? parseInt(param) : 0;
                          else if (pType == 'u') subst = Math.abs(param);
                          else if (pType == 'f') subst = (precision > -1) ? Math.round(parseFloat(param) * Math.pow(10, precision)) / Math.pow(10, precision): parseFloat(param);
                          else if (pType == 'o') subst = parseInt(param).toString(8);
                          else if (pType == 's') subst = param;
                          else if (pType == 'x') subst = ('' + parseInt(param).toString(16)).toLowerCase();
                          else if (pType == 'X') subst = ('' + parseInt(param).toString(16)).toUpperCase();
                }
                str = leftpart + subst + rightPart;
        }
        return str;
}

</script>
