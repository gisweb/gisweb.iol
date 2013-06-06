jQuery(document).ready(function () {

//Autosuggest per l'elenco dei nomi e compilazione campi
jQuery(".iol-autocomplete-form").each(function(){
  eval("var options = "  + jQuery(this).data('autocompleteformOptions') +" || {}");
  var baseUrl = jQuery(this).data('baseUrl');

  $(this).select2({
    placeholder: options.placeolder,
    allowClear: options.allowClear,
    minimumInputLength: options.minimumInputLength,
    id: options.id,
    formatResult: options.formatResult,
    formatSelection: options.formatSelection,
    ajax: {
        url: options.url,
        dataType: 'json',
        quietMillis: 100,
        data: options.data,
        results: function (data, page) {
            var more = (page * 10) < data.total; // whether or not there are more results available
 
            // notice we return the value of more so Select2 knows if more results can be loaded
            return {results: data.names, more: more};
        }
      },
      escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
  }).on("change", function(e) { 
             var childs=e.added;
             if(e.removed){
                    if(!confirm('Attenzione i dati già inseriti verranno rimossi, continuo?')) return;
                    childs=e.removed; 
             } 
             $.each(childs, function(key,value) {
                  var el;
                  if($('[name='+key+']').length>0){
                       el = $('[name='+key+']').eq(0);
                       if(e.added) 
                          el.val(value);
                       else if(e.removed){
                            el.val('');console.log(el)}
                       el.trigger('change');
                   }
             });
             console.log("change "+JSON.stringify({val:e.val, added:e.added, removed:e.removed})); 
        });
});


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


$("input[data-plugin='elencocomuni']").each(function(){
        eval("var baseOptions = "  + jQuery(this).data('elencocomuniOptions') +" || {}");
        //Setto le impostazioni dei childs fisse per questo plugin
        var childs = [{'idx':0,'name':'cod_cat'},{'idx':2,'name':'provincia'},{'idx':3,'name':'cap'}];
        var options = {
                placeholder: 'Seleziona il Comune',
                allowClear: true,
           	minimumInputLength: 2,
		id: function(e) { return e[1]; },
		text: function(e) { return e[1]; },
		formatResult: function(data) { return '<div>' + data[1] + ' (' + data[2] + ')</div>'; },
		formatSelection: function(data) { return data[1]; },
		query: function(query) {
			var results = [];
			var re = RegExp('^' + query.term, 'i');
			jQuery.each(iol_elenco_comuni, function(_, comune) {
				if (re.test(comune[1])) {results.push(comune)}
			})
			query.callback({results: results});
		},
                initSelection : function (element, callback) {
                     var data = ["",element.val(),"","",""];
                     callback(data);
               }
	}
        $.extend(options,baseOptions);
        $(this).select2(options).on("change", function(e) { 
             var fieldName = this.name;
             $.each(childs, function(_,child) {
                  var childName =fieldName.replace('_comune','_'+child.name);
                  var el;
                  if($('[name='+childName+']').length>0){
                       el = $('[name='+childName+']').eq(0);
                       if(e.added) 
                          el.val(e.added[child.idx]);
                       else if(e.removed) 
                          el.val('');
                       el.trigger('change');
                   }
             });
             console.log("change "+JSON.stringify({val:e.val, added:e.added, removed:e.removed})); 
        });
    });

	
    jQuery("input[data-plugin='comunifield']").each(function(){
        var fieldname = this.name;
        var fieldname_tokens = this.name.split(/_/);
        var formname = fieldname_tokens[0];
        var field_basename = fieldname_tokens[fieldname_tokens.length - 1];
        var options = {
            "minlength": 2,
            source: function(query, process) {
                if (query.term.length < 2) {return [];}
                var result = [];
                var query_re = RegExp('^' + query.term, 'i');
                for (var i = window.comuni.length - 1; i >= 0; i--) {
                    var comune = window.comuni[i];
                    if (query_re.test(comune.name_it)) {
                        var child =  {};
                        child[fieldname.replace('_comune', "_provincia")] = comune.prv.ref;
                        child[fieldname.replace('_comune', "_cod_cat")] = comune.ref;
                        child[fieldname.replace('_comune', "_cap")] = comune.cap;
                        result.push({
                            id: comune.name_it + '|' + comune.prv.ref,
                            child:child,
                            label: comune.name_it + ' (' + comune.prv.ref + ')',
                            value: comune.name_it
                        });
                    }
                }
                process(result);
            },
            select: function(event,ui){
                if (typeof(ui.item.child)!='undefined'){
                 jQuery.each(ui.item.child,function(k,v){
                     if(jQuery('#'+k)){
                          jQuery('#'+k).val(v);
                          jQuery('#'+k).trigger('change');
                     }
                  });
                }
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
        var params={'pippo':'pluto'};
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
     imagewidth : 32,
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