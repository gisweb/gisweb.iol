
(function ($) {

  var initDialog = function(_, container){
    var elencoFogli = [];
    var elencoParticelle = [];
    $('#n_foglio').select2({
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
      $.ajax({
        'url':"services/elencoParticelle",
        'type':'GET',
        'data':{"sezione":$('#nct_sezione').select2('val'), "foglio":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoParticelle = data.results;
          $('#nct_particella').select2('data', elencoParticelle);
          $('#nct_particella').select2('val', null);
          $("#nct_geometry").val('');
        }
      });
    });
    $('#nct_particella').select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 0,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp('^' + query.term, 'i');
            $.each(elencoParticelle, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text, coords: this.geom});
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
        $("#nct_geometry").val(e.added.coords);
    });
    $("#nceu_sezione").select2().on("change", function(e) { 
      $.ajax({
        'url':"services/elencoFogli",
        'type':'GET',
        'data':{"sezione":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoFogli = data.results;
          elencoParticelle = [];
          $('#nct_foglio').select2('data', elencoFogli);
          $('#nct_foglio').select2('val', null);
          $('#nct_particella').select2('data', elencoParticelle);
          $('#nct_particella').select2('val', null);
          $("#nct_geometry").val('');
        }
      });
    });
    $("#nceu_sezione").select2().trigger("change");

  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialog);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialog);


})(jQuery);