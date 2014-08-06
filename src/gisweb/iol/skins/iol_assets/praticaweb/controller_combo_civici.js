
(function ($) {

  var initDialog = function(_, container){
    var elencoCivici = [];
    $('#civico_civico').select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 0,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp('^' + query.term, 'i');
            $.each(elencoCivici, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text, coords: this.lng + ' ' + this.lat});
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
        $("#civico_geometry").val(e.added.coords);
    });

    $("#civico_via").select2().on("change", function(e) { 
      $("#civico_nomevia").val(e.added.text);
      $.ajax({
        'url':"services/elencoCivici",
        'type':'GET',
        'data':{"idvia":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoCivici = data.results;
          $('#civico_civico').select2('data', elencoCivici);
          $('#civico_civico').select2('val', null);
          $("#civico_geometry").val('');
        }
      });
    });
  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialog);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialog);



  //MARKERS DALLA TABELLA ALLA MAPPA
  $(document).on('maploaded', function () {


    var mappa = $("#mappa").iolGoogleMap.getMap();


    console.log(mappa)
    console.log(this)
    console.log($.fn.iolGoogleMap.settings)

    //EVENTI SUL DATAGRID 
    $('#elenco_civici_datagrid').dataTable().fnSettings().aoRowCreatedCallback.push( {
        "fn": function( nRow, aData, iDataIndex ){ 
            console.log("AGGIUNTA LA RIGA")

            //SETTO PER DEFAULT ULTIMA E PENULTIMA COLONNA DEL GRID PER I VALORI DI GEOMETRIA E TIPO
/*            currentOverlay.dataTable = this;
            currentOverlay.geomIndex = settings.geomIndex;
            currentOverlay.typeIndex = settings.typeIndex;
            currentOverlay.lngIndex = settings.lngIndex;
            currentOverlay.latIndex = settings.latIndex;
            currentOverlay.saved = true;
            currentOverlay.rowIndex = iDataIndex;
            registerObject(currentOverlay)*/

        }
    });




  });


})(jQuery);