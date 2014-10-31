
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

/*//resetta il campo importo cosap 
   	$("[name='occupazioni_ridotta'],#categoria_cosap,#superficie_interna,#autorizzata_dal,#autorizzata_al").bind('change',function(){
       //$("#importo_cosap_temp").val('');
       $("#importo_cosap").val('');
  	})  */





//resetta il campo importo cosap 
   /*	$("#occupazione_larghezza,#occupazione_lunghezza").bind('change',function(){
   		var lung= $("#occupazione_lunghezza").val();
   		var larg= $("#occupazione_larghezza").val();
   		var superficie = lung*larg;
   		$("#occupazione_superficie").val(superficie.toFixed(2));
   	});

    function checkLunghezza(){
     if(this.fnGetData().length>0){
        $("#importo_cosap").val(''); 
     }
    }; 

 //resetta il campo importo cosap per datagrid
$(document).on('datatable_complete',function(e){ 
  if ($("#elementi_dehor_dg_datagrid").length>0){      
     $("#elementi_dehor_dg_datagrid").dataTable().fnSettings().aoDrawCallback.push({fn: checkLunghezza});
       
  }
}); */








    
  
    
});
