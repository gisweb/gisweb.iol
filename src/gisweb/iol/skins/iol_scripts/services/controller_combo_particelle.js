
(function ($) {

  var initDialogParticelle = function(_, container){
    var elencoFogli = [];
    var elencoParticelle = [];

    if($("[name='nct_sezione']").length){
      $("[name='nct_sezione']").select2().on("change", function(e) { 
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
      $("[name='nct_sezione']").select2().trigger("change");
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


    $("[name='nct_foglio']").select2({
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
    }).on("change", function(e){
      var data = {"foglio":$(this).val()};
      if($("[name='nct_sezione']").length) data["sezione"] = $("[name='nct_sezione']").select2('val');
      $.ajax({
        'url':"services/elencoParticelle",
        'type':'GET',
        'data': data,
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoParticelle = data.results;
         // $("[name='nct_particella']").select2('data', elencoParticelle);
          //$("[name='nct_particella']").select2('val', null);
          //$("[name='nct_geometry']").val('');
        }
      });
    });

    $("[name='nct_particella']").select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 0,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp('^' + query.term, 'i');
            $.each(elencoParticelle, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text, coords: this.geom?this.geom:''});
              }
            });
            query.callback(data);
        },
        //PER INSERIRE U N VALORE NON IN ELENCO (COMBO EDITABILE)
        createSearchChoice:function(term, data) {
          if ($(data).filter(function() {return this.text.localeCompare(term)===0;}).length===0) {
            return {id:term, text:term};
          } 
        },
        initSelection : function (element, callback) {
          var data ={id: element.val(), text: element.val(), coords:'' } ;
          callback(data);
        }
    }).on("change", function(e){
        var val = e.added && e.added.coords || '';
        $("input[name='nct_geometry']").val(val);
    });

  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialogParticelle);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialogParticelle);


})(jQuery);
