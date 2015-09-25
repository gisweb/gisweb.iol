
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

  $("[name='btn_invia_domanda']").bind('click',function(){
    var serverUrl = document.URL;
    var urlRedirect = serverUrl + '/inviaDomanda?rate_opt_utente=01200'
    var urlProtocolla = serverUrl + '/protocollaInvia'
    if ($('[name=rate_opt_utente]').is(":checked")){
      window.location = urlRedirect 
    }
    else 
      window.location = urlProtocolla  
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


var url_popup_origin = $("#elenco_rate_pagamenti_addrow").attr('href');
$("#elenco_rate_pagamenti_addrow").bind('click',function(){
   
   valore_dg = 'elenco_rate_pagamenti';
    
    var ordine_gruppo = [];
    var ordine_codice = [];
    var url_popup = '';
    var dgData = $("#"+ valore_dg +"_datagrid").dataTable().fnGetData() 
    if(dgData.length>0){
      for(i=0; i<dgData.length; i++){   
        var gruppo = dgData[i][3];
        var codice = dgData[i][0];
        if ($(gruppo).html()!= null){
          gruppo = $(gruppo).html().trim()
        };
        if ($(codice).html()!= null){
          codice = $(codice).html().trim()
        };        
        ordine_gruppo.push(gruppo);
        ordine_codice.push(codice);      
      };
      
      last_gruppo = ordine_gruppo.sort().slice(-1);
      last_codice = ordine_codice.sort().slice(-1);
      new_group = '00' + String(parseInt(last_gruppo[0])+1);
      new_codice = '0' + String(parseInt(last_codice[0])+1);
      url_popup = url_popup_origin;
      url_popup += "&gruppo_sub_pagamento=" + new_group;
      url_popup += "&codice_sub_pagamento=" + new_codice;
      $("#elenco_rate_pagamenti_addrow").attr('href',url_popup);

         
    };
  
});






    
  
    
});
