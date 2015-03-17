$(document).ready(function() {
if ($("form#plomino_form").length > 0) {
   $(".grp-alimenti").attr("style","display: none;");
   }




function checkDelegato(){
  if(this.fnGetData().length>0){
     
     
      for(i=0; i<this.fnGetData().length; i++){
         if (this.fnGetData()[i][8]=='delegato'){

                 $("[name='acquisizione_preposto_somministrazione']").each(function(){
                      
                     if ($(this).val()=='sottoscritto_preposto_somministrazione'){  
                          
                        if ($(this).is(":checked")){
                           alert ("Attenzione! Dato che il soggetto che presenta la richiesta si assume la funzione di preposto alla somministrazione, Non è necessario inserire i dati anagrafici del delegato nella tabella dei requisiti morali. Per proseguire con il salvataggio della pratica cancellare la riga della tabella con soggetto 'delegato' ")
                           $("#btn_salva").attr('disabled','disabled');
                         }
                     }
                });
          }   
      }
          
      
   }   
};


var delegato = $("#morali_soggetti_datagrid > tbody > tr > td")
         


function checkAlimentari(){
   if(this.fnGetData().length>0){
     elem=[]
     for(i=0; i<this.fnGetData().length; i++){
        elem.push(this.fnGetData()[i][0])
        
        if ((this.fnGetData()[i][0]) == 'alimentare'){
              $(".grp-alimenti").attr("style","display: block;");
        }
        else if (((this.fnGetData()[i][0]) != 'alimentare') && (elem.indexOf('alimentare')==-1))  {
            $(".grp-alimenti").attr("style","display: none;"); 
        }
        
                       
     }
   }
};



$("#btn_salva").bind('click',function() {

});



/*if (jQuery('#elenco_superfici_datagrid').length>0){
$("#elenco_superfici_datagrid").dataTable().fnSettings().aoDrawCallback.push({fn: checkAlimentari});
 }
if (jQuery('#morali_soggetti_datagrid').length>0){
$("#morali_soggetti_datagrid").dataTable().fnSettings().aoDrawCallback.push({fn: checkDelegato});
}

*/





// GESTIONE PULSANTE VOLTURA
$("#btn_wf_voltura").bind('click',function(event) {
       event.preventDefault();
       var radio = $("input:checked").val();       
       var u =$(this).attr('href') + radio;              
       window.location=u
    });


// CALCOLA NUMERO DI CHECK: ACCESSI PRIORITARI

function calcolaAccessi(prior,no_prior) {
   var tot = [];
   var a=[];
   var b=[];
   $("[name='requisiti_oggettivi']").each(function(){      
     if ($(this).val().split('_').slice(-1)[0]=='prio') 
       
         {
         if ($(this).is(":checked")) 
            {
             a.push($(this).is(":checked"))
             tot.push($(this).is(":checked"))           
            }            
         }         
     });

    $("[name='requisiti_soggettivi']").each(function(){      
     if ($(this).val().split('_').slice(-1)[0]=='prio') 
         {
         if ($(this).is(":checked")) 
            {
             a.push($(this).is(":checked"))
             tot.push($(this).is(":checked"))                         
            }            
         }
                
     });
     
    
      
    // CALCOLA NUMERO DI CHECK: ACCESSI NON PRIORITARI
  
  
   $("[name='requisiti_oggettivi']").each(function(){      
     if ($(this).val().split('_').slice(-1)[0]!='prio') 
         {
         if ($(this).is(":checked")) 
            {
             b.push($(this).is(":checked"))
             tot.push($(this).is(":checked"))                         
            }            
         }         
     });

    $("[name='requisiti_soggettivi']").each(function(){      
     if ($(this).val().split('_').slice(-1)[0]!='prio') 
         {
         if ($(this).is(":checked")) 
            {
             b.push($(this).is(":checked"))
             tot.push($(this).is(":checked"))                         
            }            
         }         
     });
    
     if ((a.length<prior && tot.length < (no_prior + prior)) || (b.length<no_prior && tot.length < (no_prior + prior)) || (b.length>no_prior && a.length<prior && tot.length >= (no_prior + prior))) {
          alert("Attenzione!! REQUISITI di ACCESSO non sufficienti. Per la zona selezionata sono necessari almeno" + " " + prior + " " + " requisiti prioritari e un totale di " + " " + (prior + no_prior) + " " + "requisiti" )
          $("#btn_salva").attr('disabled','disabled');
          }
     
};

//ZONA RESTITUITA DI DEFAULT

geom=$("#ubicazione_civico_geometry").val();


$.ajax({
        url:'resources/scrZonaCommercio', 
        type: 'GET',
        data: {the_geom: geom},
        dataType: 'json',
        cache:false,           
        success:geometria_zona
          
       });

function geometria_zona(data){

  if (data.zona=="CENTRO STORICO") {
     $(".accesso_centro").attr("style","display: block;");
     $(".accesso_levante").attr("style","display: none;");                  
     $(".accesso_collinari").attr("style","display: none;");
  }
  else if (data.zona=="ZONA OVEST" || data.zona=="ZONA DI LEVANTE") {
     $(".accesso_centro").attr("style","display: none;");
     $(".accesso_levante").attr("style","display: block;");                  
     $(".accesso_collinari").attr("style","display: none;");
  }
  else {
     $(".accesso_centro").attr("style","display: none;");
     $(".accesso_levante").attr("style","display: none;");                  
     $(".accesso_collinari").attr("style","display: block;");
  }
};



   


$("[name='requisiti_accesso_opt']").bind('change',function(){
    var geom=$("[name='ubicazione_civico_geometry']").attr('value');
    portale_href=location.href.split('/')[2]
    //url=portale_href + '/' + 'iol_scia/resources/scrZonaCommercio'

    $.ajax({
        url:'resources/scrZonaCommercio', 
        type: 'GET',
        data: {the_geom: geom},
        dataType: 'json',
        cache:false,           
           success:function(data){
              if (data.zona=="CENTRO STORICO"){
                $(".accesso_centro").attr("style","display: block;");
                 $(".accesso_levante")                    
                     .attr("style","display: none;");
                 $(".accesso_collinari")                    
                     .attr("style","display: none;");
                   $("#btn_salva").bind('click',function(){
                         calcolaAccessi(4,6)
                    });
               
                  
                   }
               else if (data.zona=="ZONA OVEST" || data.zona=="ZONA DI LEVANTE") {                        
                     $(".accesso_levante").attr("style","display: block;");                  
                     $(".accesso_centro")
                        .attr("style","display: none;");                   
                   $(".accesso_collinari")                    
                        .attr("style","display: none;");   

                    $("#btn_salva").bind('click',function(){
                         calcolaAccessi(3,6)
                     });                 
                  
                     }
                else {
                      $(".accesso_collinari").attr("style","display: block;"); 
                      $(".accesso_centro")
                        .attr("style","display: none;");
                      $(".accesso_levante")
                        .attr("style","display: none;");
                      $("#btn_salva").bind('click',function(){
                          calcolaAccessi(2,3) 
                       });                    
                
                     }
               }
            });



                   
                    
    });

// SUBMAPPALE E FOGLIO

$("[name='nceu_foglio']").bind('change',function(){
 
    var fog=$("[name='nceu_foglio']").val();

    
    $.ajax({
        url:'resources/elenco_mappali', 
        type: 'GET',
        data: {f: fog},
        dataType: 'json',
        cache:false,           
        success:function(data){
                   $("[name='nceu_mappale']")
                     .empty()
                     .append($("<option></option>"));
                     
                 $.each(data,function(i,v) {
                       
                       $("[name='nceu_mappale']").append($("<option value="+v['numero']+">"+v['numero']+"</option>"));
                          
                 });
               
             
        }
   });  
});

$("[name='nceu_mappale']").bind('change',function(){
 
    var mappale=$("[name='nceu_mappale']").val();

  
    $.ajax({
        url:'resources/elenco_subalterni', 
        type: 'GET',
        data: {mp: mappale},
        dataType: 'json',
        cache:false,           
        success:function(data){
                   $("[name='nceu_subalterno']")
                     .empty()
                     .append($("<option></option>"));        
                 $.each(data,function(i,v) {
                       $("[name='nceu_subalterno']").append($("<option value="+v['subalterno']+">"+v['subalterno']+"</option>"));
                          
                 });
               
             
        }
   });  
});





// CONTROLLO SE ALIMENTARI NEL COMMERCIO
$("#elenco_superfici_datagrid > tbody > tr > td").each(function()
          {
            if ($(this).text()=='alimentare'){
                 $(".alimentari").attr("style","display: none;");
              }
                 
          });
    

   
    


//FUNZIONE PER AGGIUNGERE RIGA TOTALI A PIE DI DATAGRID

 var getTotals = function(){
	if(this.fnGetData().length>0){
		var totals = [];
		for(j=0; j<this.fnGetData()[0].length; j++) totals[j]=0;
		for(i=0; i<this.fnGetData().length; i++){
			for(j=0; j<this.fnGetData()[i].length; j++) totals[j] = totals[j] + (parseFloat(this.fnGetData()[i][j])||0);
		}
		var footer = '<tr class="grid-totals"><td>' + 'TOTALI' + '</td>';
		for(j=1;j<this.fnGetData()[0].length; j++) footer+='<td>'+totals[j]+'</td>';
		footer += "</tr>";
		this.append(footer);
	}
    }


// VISUALIZZA INFO SULLA PRATICA SUBENTRANTE
$("[name='modello_volture']").bind('change',function() {
       
              
       var radio = $("input:checked").val();
   
       if (!$("#url_volt").attr('baseurl')){
            $("#url_volt").attr('baseurl',$("#url_volt").attr('href'));      
             if (radio!=''){       
                 $("#url_volt").attr('href',$("#url_volt").attr('baseurl')+'/'+radio).html("Visualizza la pratica uscente");           
                 }
             } 
       else if ($("#url_volt").attr('baseurl')) {   
                 
             $("#url_volt").attr('href',$("#url_volt").attr('baseurl')+'/'+radio).html("Visualizza la pratica uscente");
             if (radio!=''){       
                 $("#url_volt").attr('href',$("#url_volt").attr('baseurl')+'/'+radio).html("Visualizza la pratica uscente");           
                 }                                        
   
             }         
       
       
                
          
});
          





var formName=$('input[name="Form"]').val();
if (formName=='iol_pagamenti_online'){
    $('#btn_pagamento').bind('click',function(event){
        event.preventDefault();
        
        var frm=$('form[name="iol_pagamenti_online"]');
        frm.attr('action',$(this).attr('data-href'));
        frm.attr('method','POST');
        frm.submit();
    });
}








});