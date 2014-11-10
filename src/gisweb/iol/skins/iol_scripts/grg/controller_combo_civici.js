
(function ($) {


  var initDialog = function(_, container){
    var elencoVie = [];
    var elencoCivici = [];


    $("#comune").select2({
      allowClear: true,
      placeholder: '---'
    }).on("change", function(e) { 
      $("#via").val(e.added.text);
      $.ajax({
        'url':"resources/elencoVie",
        'type':'GET',
        'data':{"comune":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoVie = data.results;
          $('#via').select2('data', elencoVie);
          $('#via').select2('val', null);
          //$("#civico_geometry").val('');
        }
      });
    });


    $('#via').select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 2,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp(query.term, 'i');
            $.each(elencoVie, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text, coords: this.coord});
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
      //$("#civico_nomevia").val(e.added.text);
      $.ajax({
        'url':"resources/elencoCivici",
        'type':'GET',
        'data':{"via":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoCivici = data.results;
          $('#civico').select2('data', elencoCivici);
          $('#civico').select2('val', null);
          //$("#civico_geometry").val('');
        }
      });
    });
    
    $('#civico').select2({
          placeholder: '---',
          allowClear: true,
          minimumInputLength: 0,
          width:'off',      
          query: function (query){
            var data = {results: []};
            var re = RegExp('^' + query.term, 'i');
            $.each(elencoCivici, function(){
              if (re.test(this.text)){
                data.results.push({id: this.id, text: this.text, x: this.x, y: this.y});
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
          var data ={id: element.val(), text: element.val(), x:'', y:'' } ;
          callback(data);
        }
    }).on("change", function(e){
        $("#civico_geometry").val(e.added.coords);
    });


 
  }


  //per i test anche in creazione del doc
  $(document).on('ready', initDialog);
  //codice da eseguire sull'apertura del dialog
  //$(document).on('opendialog', initDialog);


/*  //MARKERS DALLA TABELLA ALLA MAPPA
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
           currentOverlay.dataTable = this;
            currentOverlay.geomIndex = settings.geomIndex;
            currentOverlay.typeIndex = settings.typeIndex;
            currentOverlay.lngIndex = settings.lngIndex;
            currentOverlay.latIndex = settings.latIndex;
            currentOverlay.saved = true;
            currentOverlay.rowIndex = iDataIndex;
            registerObject(currentOverlay)

        }
    });




  });*/


})(jQuery);