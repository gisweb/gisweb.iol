
$( document ).ready(function() {

	$('#importo_cosap_temp').attr('readonly', true);
	$('#categoria_cosap').attr('readonly', true);
  $('#marche_bollo').attr('readonly', true);
  

  // imposta il valore di data fine se occupazione è permanente
  var data = new Date()
  anno = data.getFullYear();  
  fine = '31/12/' + anno 
  $("[name=durata_occupazione]").bind("change",function(){
    
    if ($("[name=durata_occupazione]").val()=='permanente'){
      $("#autorizzata_al").val(fine)
      $("#autorizzata_al").attr('readonly', true);
    }
    else {
      $("#autorizzata_al").val("");
      $("#autorizzata_al").attr('readonly', false);
    }
  });

  $("#btn_invia_domanda").bind('click',function(){
    var serverUrl = document.URL;
    var urlRedirect = serverUrl + '/inviaDomanda?rate_opt_utente=01200'
    var urlProtocolla = serverUrl + '/protocollaInvia'
    if ($('[name=rate_opt_utente]').is(":checked")){
      window.location = urlRedirect 
    }
    else 
      window.location = urlProtocolla  
  });


  



   
  $("[name=tipologia_parere]").bind('click',function(){
    console.log($(this).val());
    
     

    
    $("[name=tipologia_parere]").each(function(){
      if ($("[name=tipologia_parere]").is(":checked")==true){
        console.log(true)
        $("#btn_tipologia_parere").removeAttr('disabled');              
          
      }
      else {
        console.log(false)
        $("#btn_tipologia_parere").off('click');     
        //$("#btn_tipologia_parere").removeAttr('href');
        $("#btn_tipologia_parere").attr('disabled','disabled');
      }        
    });
   
    
     
  }); 

  $("#btn_tipologia_parere").bind('click',function(){
      
      tipologie = [] 
      $("[name=tipologia_parere]").each(function(){
             
        if ($(this).is(":checked")){
          if ($.inArray($(this).val(),tipologie) == -1){
              tipologie.push($(this).val())  
          }        
        }      
      })
      var baseHref = $('#btn_tipologia_parere').attr('href');
      var url = baseHref + '&tipologia_parere=' + tipologie.toString(); 
      console.log(url);
      $("#btn_tipologia_parere").attr('href',url); 
    }) 




  

  
  
    
});
