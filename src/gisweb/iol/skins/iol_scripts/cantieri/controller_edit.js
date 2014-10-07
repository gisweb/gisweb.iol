
$( document ).ready(function() {

	$('#importo_cosap_temp').attr('readonly', true);
    $('#categoria_cosap').attr('readonly', true);


//resetta il campo importo cosap 
   	$("[name='occupazioni_ridotta_cosap_opt'],#categoria_cosap,#superficie_occupata,[name='occupazioni_cosap_lavori_edili'],[name='occupazioni_no_cosap_opt']").bind('click',function(){
       $("#importo_cosap_temp").val('');
       $("#importo_cosap").val('');
  	})

   	
// rimuove pulsante add al  datagrid dei pagamenti
   $("#elenco_pagamenti_addrow").remove();

function checkLunghezza(){
	if(this.fnGetData().length>0){
		
		for(i=0; i<this.fnGetData().length; i++){			
			if(parseFloat(this.fnGetData()[i][2])>5){
				$(".alertCantiereLength").attr("style","display: block;")
			}
			else if (parseFloat(this.fnGetData()[i][3])>5){
				$(".alertCantiereLength").attr("style","display: block;")
			}
			else {
				$(".alertCantiereLength").attr("style","display: none;")
			}

		};
	};
};

$(document).on('datatable_complete',function(e){ console.log(e)
	if ($("#elementi_scavo_dg_datagrid").length>0){
	$(".alertCantiereLength").attr("style","display: none;")	
	   $("#elementi_scavo_dg_datagrid").dataTable().fnSettings().aoDrawCallback.push({fn: checkLunghezza});
	   	 
	};


});

    
});
