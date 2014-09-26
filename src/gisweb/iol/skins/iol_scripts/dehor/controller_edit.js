
$( document ).ready(function() {

	$('#importo_cosap_temp').attr('readonly', true);

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
   	

    

    
});
