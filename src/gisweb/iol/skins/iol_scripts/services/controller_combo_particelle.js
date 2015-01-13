
(function ($) {

  var initDialogParticelle = function(_, container){
    var elencoFogli = [];
    var elencoParticelle = [];
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
      $.ajax({
        'url':"services/elencoParticelle",
        'type':'GET',
        'data':{"sezione":$("[name='nct_sezione']").select2('val'), "foglio":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoParticelle = data.results;
          console.log(elencoParticelle)
          $("[name='nct_particella']").select2('data', elencoParticelle);
          $("[name='nct_particella']").select2('val', null);
          $("[name='nct_geometry']").val('');
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
        var val = e.added && e.added.coords || '';
        $("input[name='nct_geometry']").val(val);
    });
    $("[name='nct_sezione']").select2().on("change", function(e) { 
      $.ajax({
        'url':"services/elencoFogli",
        'type':'GET',
        'data':{"sezione":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoFogli = data.results;
          elencoParticelle = [];
          $("[name='nct_foglio']").select2('data', elencoFogli);
          $("[name='nct_foglio']").select2('val', null);
          $("[name='nct_particella']").select2('data', elencoParticelle);
          $("[name='nct_particella']").select2('val', null);
          $("[name='nct_geometry']").val('');
        }
      });
    });
    $("[name='nct_sezione']").select2().trigger("change");

  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialogParticelle);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialogParticelle);

  //MARKERS DALLA TABELLA ALLA MAPPA
  $(document).on('maploaded', function () {


    var mappa = $("#mappa").iolGoogleMap.getMap();

    var gridSettings = $('#elenco_nct_datagrid').dataTable().fnSettings().oInit;


    //EVENTI SUL DATAGRID 
    $('#elenco_nct_datagrid').dataTable().fnSettings().aoRowCreatedCallback.push( {
        "fn": function( nRow, aData, iDataIndex ){ 
            var geomIndex = gridSettings.geomIndex || (aData.length-1);
            
            var coord = aData[geomIndex];
            var testRE = coord.match("<span>(.*)</span>");
            if(testRE.length>0) coord = testRE[1];
            var polygonOptions = {"strokeColor":"#00FFFF","strokeOpacity": 1.0,"strokeWeight": 2};

            var polygon = $("#mappa").iolGoogleMap.createOverlay(coord,polygonOptions);
            polygon.setMap(mappa);

        }
    });
    //EVENTI SUL DATAGRID 

    var aData = $('#elenco_nct_datagrid').dataTable().fnGetData();
    
    var polygonOptions = {"strokeColor":"#00FFFF","fillColor":"#00FFFF","strokeWeight": 2};

    for(i=0;i<aData.length;i++){
      var geomIndex = gridSettings.geomIndex || (aData[0].length-1);
      var coord = aData[i][geomIndex];

      //var testRE = coord.match("<span>(.*)</span>");
      //if(testRE.length>0) coord = testRE[1];
      var polygon = $("#mappa").iolGoogleMap.createOverlay(coord,polygonOptions);
      polygon.setMap(mappa);

    }

  });




})(jQuery);