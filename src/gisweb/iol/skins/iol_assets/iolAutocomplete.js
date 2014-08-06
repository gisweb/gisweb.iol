// DA SISTEMARE!!!!!!!!!!!!!!!!!!
(function ($) {
	$(document).ready(function () {
        //Autosuggest per l'elenco dei nomi e compilazione campi
        $("[data-plugin = iolAutocompleteForm]").each(function(){
          eval("var options = "  + $(this).data('autocompleteformOptions') +" || {}");
          var baseUrl = $(this).data('baseUrl');

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
                                   setControlValue(el,value);                 
                               else if(e.removed)
                                    setControlValue(el,'');
                                el.trigger('change');
            
                           }
                     });
                     //console.log("change "+JSON.stringify({val:e.val, added:e.added, removed:e.removed})); 
                });
        });

        //ATTENZIONE SISTEMARE IN SERIALDOC LA RESTITUZIONE DEI VALORI AL POSTO DELLE LABEL, PER ORA DOVE SERVE USO VALORE=LABEL
        function setControlValue(el,value){
           if(el.is(':checkbox')||el.is(':radio')) {
              $("#"+el.attr("name")+'-'+value).attr('checked', true);
              //console.log("#"+el.attr("name")+'-'+value)
            }
           else{
              el.val(value)
           }
        }

    });
})(jQuery);