$(document).ready(function() {
   
    $("#dialog").dialog({
      autoOpen: false,
      height: 400,
      width: 500,
      dialogClass: "alert",
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });

    $("#btn_salva").bind('click',function(){
       $("#dialog").dialog("open");
    })
    

});