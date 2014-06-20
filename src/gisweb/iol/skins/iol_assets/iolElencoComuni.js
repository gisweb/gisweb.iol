(function ($) {

    $.fn.iolElencoComuni = function( options ) {

        return this.each(function() {
            //Setto le impostazioni dei childs fisse per questo plugin
            var childs = [{'idx':0,'name':'cod_cat'},{'idx':2,'name':'provincia'},{'idx':3,'name':'cap'}];
            var options = {
                placeholder: 'Seleziona il Comune',
                allowClear: true,
                minimumInputLength: 2,
                width:'off',
                id: function(e) { return e[1]; },
                text: function(e) { return e[1]; },
                formatResult: function(data) { return '<div>' + data[1] + ' (' + data[2] + ')</div>'; },
                formatSelection: function(data) { return data[1]; },
                query: function(query) {
                    var results = [];
                    var re = RegExp('^' + query.term, 'i');
                    $.each(iol_elenco_comuni, function(_, comune) {
                        if (re.test(comune[1])) {results.push(comune)}
                    })
                    query.callback({results: results});
                },
                initSelection : function (element, callback) {
                    var data = ["",element.val(),"","",""];
                    callback(data);
                }
            }
            //$.extend(options,baseOptions);
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
            });
        });

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );
        console.log(options)

    };
	
})(jQuery);