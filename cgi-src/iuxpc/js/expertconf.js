<script>
// expertconf_kai
function EnableStaticHw(obj)
{
      if(obj.checked == true) EnableHW('static_hw');
      else DisableHW('static_hw');
}


function ApplyKAIConfig()
{
        var F = document.kai_basicconf_fm;
      var mode, oldmode;

      oldmode = F.cmode.value;
      mode = GetRadioValue(F.mode);
      if( mode == oldmode )
              return;
//      if( oldmode != KAID_MODE_INIT )
//     {
              ApplyReboot(F,'kai');
              return;
//      }
        F.act.value = 'changemode';
        F.submit();
}

function RestartKai()
{
        var F = document.kai_fm;
        alert(KAID_RESTART_KAI_UI);
        F.act.value = 'kaid_restart';
        F.submit();
}

function ScanPSP()
{
        var F = document.kai_fm;
        var obj;
        if(F.psphw_chk && F.psphw_chk.checked == true)
        {
                obj=CheckHW('static_hw');
                if(obj)
                {
                        obj.focus();
                        obj.select();
                        return;
                }
        }
        F.act.value = "scanpsp";
        F.submit();
}

function StopPSP()
{
        var F = document.kai_fm;
        F.act.value = "stoppsp";
        F.submit();
}

function SelectObtServer()
{
        var F = document.kai_fm;
        var chkstat=false;
        for(i=0;i<F.obtchk.length;i++)
        {
                if(F.obtchk[i].checked)
                {
                        chkstat=true;
                        break;
                }
        }
        if(chkstat==false)
        {
                alert(KAID_MUST_SELECT_OBT_SERVER);
        }
        else
        {
                F.act.value = "selectobt";
                F.submit();
        }
}

function ChangeObtServer()
{
        var F = document.kai_fm;
        alert(KAID_RESTART_KAI_UI);
        F.act.value = "changeobt";
        F.submit();
}


function ChangeKAIMac()
{
        var F = document.kai_fm;
        F.act.value = 'mac_clone';
        F.submit();
}





</script>
