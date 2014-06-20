(function ($) {
	
    $.fn.iolAutocompleteForm = function( options ) {
        return this.each(function() {


            console.log(options)
           // var baseUrl = $(this).data('baseUrl');

            var formatResult =  function(name){ return" "+name.fisica_cognome+" "+name.fisica_nome+" cf: "+name.fisica_cf+" nato a "+name.fisica_comune_nato+" il "+name.fisica_data_nato+" " };
            var formatSelection = function(name){return name.fisica_cognome+ " "+name.fisica_nome+" cf: "+name.fisica_cf };
            var data = function(term,page){return {"forms":"base_sub_fisica","distinct":"fisica_cf","fisica_cf":term,"page":page,"size":10}};
            $element = $(this);
            console.log($element)
            $element.select2({
                placeholder: "Digitare il codice fiscale della persona da ricercare",
                allowClear: true,
                minimumInputLength: 0,
                id: $element.attr('id'),
                formatResult: formatResult,
                formatSelection: formatSelection,
                ajax: {
                    url: "fetch_data",
                    dataType: 'json',
                    quietMillis: 100,
                    data: data,
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
    };

})(jQuery);