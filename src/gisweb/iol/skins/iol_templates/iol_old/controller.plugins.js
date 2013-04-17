jQuery(document).ready(function () {

    //GENERAZIONE DEI CONTROLLI AUTOCOMPLETE
    jQuery("input[data-plugin='autocomplete']").each(function(){
        eval("var options = "  + jQuery(this).data('autocompleteOptions') +" || {}");
        var baseUrl = jQuery(this).data('baseUrl');

        if (!options.source) options.source = '/services/xSuggest';
        if (options.source.indexOf('?') > 0) options.source += '&'; else options.source += '?'; 
        options.source += 'field=' + this.id;

        if (options.extraParams) options.source += '&' + jQuery.param(options.extraParams);
        options.source =  baseUrl + options.source;
        options.select = function(event,ui){
             if (typeof(ui.item.child)!='undefined'){
                 jQuery.each(ui.item.child,function(k,v){
                     if(jQuery('#'+k)){
                          jQuery('#'+k).val(v);
                          jQuery('#'+k).trigger('change');
                     }
                  });  
             }
        };
        jQuery(this).autocomplete(options);
    });
    

    //GENERAZIONE DEI CONTROLLI DATEPICKER
    jQuery("input[data-plugin='datepicker']").each(function(){
        eval("var options = "  + jQuery(this).data('datepickerOptions'));
        jQuery(this).datepicker(options || { });
        jQuery(this).datepicker( jQuery.datepicker.regional[ "it" ] );

        jQuery('#btn_' + this.id).click(function(){
            jQuery(this).datepicker('show');
        });
    });

  //GENERAZIONE DEI CONTROLLI CODICE FISCALE
    jQuery("input[data-plugin='codicefiscale']").each(function(){
        eval("var options = "  + jQuery(this).data('codicefiscaleOptions'));
        var params={};
        var fieldId = this.id;
        var baseUrl = jQuery(this).data('baseUrl');
        jQuery('#btn_' + this.id).click(function(){
			jQuery.each(options.fieldlist, function(index, txtId) { 
				   var value = jQuery('#' + txtId).val();
				   if(!value) value = jQuery('input:radio[name = ' + txtId+ ']:checked').val();
					if(!value){alert ('Campo ' + txtId + ' vuoto');return}
			params[txtId] = value;
			});
			jQuery.ajax({
				'url':baseUrl + options.source,
				'type':'POST',
				'data':params,
				'dataType':'JSON',
				'success':function(data, textStatus, jqXHR){
							 //console.log(data)
                                      jQuery('#' + fieldId).val(data.value);

				}
			});
		});
	});

    //GENERAZIONE DEL CONTROLLO PULSANTE RICERCA
    jQuery("input[data-plugin='dataTable-search']").each(function(){
        
        jQuery(this).button().bind('click',function(event){
            event.preventDefault();
            var target=jQuery(this).data('target');
            var form_query = jq('#'+target).serializeZopeQuery();
            jQuery.each(jQuery('[data-plugin="datatables"]'),function(k,table){
                jQuery('#'+jQuery(table).attr('id')).dataTable().fnDraw();
            });
        });
    });


jQuery("input[type=file]").filestyle({ 
     image: "upload.png",
     imageheight : 32,
     imagewidth : 50,
     width : 250
 });


         //GENERAZIONE DEL CONTROLLO MODELLI DI STAMPA 

   jQuery("select[id^=modello]").each(function(){
      jQuery(this).bind('change',function(){
         var href = jQuery('#btn_' + this.id).attr('href');
         var baseHref =  href.substring(0,href.indexOf('&')) || href;
         var v =  this.id;
         var group = v.substring(v.indexOf('_') + 1);
         var field = 'documenti' + v.substring(v.indexOf('_'));
        
        if(jQuery(this).val()){
           var url = baseHref + '&field=' + field + '&grp=' + group + '&model=' + jQuery(this).val();
           jQuery('#btn_' + this.id).attr('href', url);
           jQuery('#btn_' + this.id).removeAttr('disabled');
        }
        else{
           jQuery('#btn_' + this.id).attr('href',baseHref);
           jQuery('#btn_' + this.id).attr('disabled','disabled');
        }
    });
   });





});