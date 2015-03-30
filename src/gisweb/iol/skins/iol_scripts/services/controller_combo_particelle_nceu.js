
(function ($) {

  var initDialogParticelleCU = function(_, container){
    var elencoFogliCU = [];
    var elencoParticelle = [];

    if($("[name='nceu_sezione']").length){
      $("[name='nceu_sezione']").select2().on("change", function(e) { 
        $.ajax({
          'url':"services/elencoFogli",
          'type':'GET',
          'data':{"sezione":$(this).val()},
          'dataType':'JSON',
          'success':function(data, textStatus, jqXHR){
            elencoFogli = data.results;
            elencoParticelle = [];
            //$("[name='nceu_foglio']").select2('data', elencoFogli);
            //$("[name='nceu_foglio']").select2('val', null);
            //$("[name='nceu_particella']").select2('data', elencoParticelle);
            //$("[name='nceu_particella']").select2('val', null);
            //$("[name='nceu_geometry']").val('');
          }
        });
      });
      $("[name='nceu_sezione']").select2().trigger("change");
    }
    else{
      $.ajax({
        'url':"services/elencoFogli",
        'type':'GET',
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoFogli = data.results;
          elencoParticelle = [];
        }
      });
    }

    $("[name='nceu_foglio']").select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 0,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp('^' + query.term, 'i');
            $.each(elencoFogli, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text});
              }
            });
            query.callback(data);
        },
        initSelection : function (element, callback) {
          var data ={id: element.val(), text: element.val()} ;
          callback(data);
        }
    })
  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialogParticelleCU);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialogParticelleCU);


})(jQuery);