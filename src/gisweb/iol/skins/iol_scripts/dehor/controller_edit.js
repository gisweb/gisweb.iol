
$( document ).ready(function() {

	$('#importo_cosap_temp').attr('readonly', true);
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

//resetta il campo importo cosap 
   	$("[name='occupazioni_ridotta_cosap_opt'],#categoria_cosap,#superficie_occupata,[name='occupazioni_cosap_lavori_edili'],[name='occupazioni_no_cosap_opt']").bind('click',function(){
       $("#importo_cosap_temp").val('');
       $("#importo_cosap").val('');
  	})


//resetta il campo importo cosap 
   	$("#occupazione_larghezza,#occupazione_lunghezza").bind('change',function(){
   		var lung= $("#occupazione_lunghezza").val();
   		var larg= $("#occupazione_larghezza").val();
   		var superficie = lung*larg;
   		$("#occupazione_superficie").val(superficie.toFixed(2));
   	});
   	

// rimuove pulsante add al  datagrid dei pagamenti
   $("#elenco_pagamenti_addrow").remove();


    
  
    
});
