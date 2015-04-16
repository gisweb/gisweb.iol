
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

  //MARKERS DALLA TABELLA ALLA MAPPA
  $(document).on('maploaded', function () {


    var overlays = [];
    var mappa = $("#mappa").iolGoogleMap.getMap();
    var gridSettings = $('#elenco_nct_datagrid').dataTable().fnSettings().oInit;
    var polygonOptions = {"strokeColor":"#00FFFF","fillColor":"#00FFFF","strokeWeight": 2};


    function addOverlays(data){
      for(var i=0;i<data.length;i++){
        var geomIndex = gridSettings.geomIndex || (data[i].length-1);
        var coord = data[i][geomIndex];
        if(coord=="") return;
        var polygon = $("#mappa").iolGoogleMap.createOverlay(coord,polygonOptions);
        polygon.setMap(mappa);
        overlays.push(polygon);
        mappa.fitBounds(polygon.getBounds());
      }

    }

    function removeOverlays(){
      for(var i=0;i<overlays.length;i++){
        overlays[i].setMap(null);
        delete overlays[i];
      }
      overlays=[];
    }

    function aggiungiVincoli(data){
      var foglio = data[0];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[1];
      particella = particella.trim();
      //var testRE = particella.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) particella = testRE[1];

      $.ajax({
        'url':"services/elencoVincoli",
        'type':'GET',
        'data':{"sezione":'',"foglio":foglio,"particella":particella},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          var elencoVincoli = data.results;
          var sVincolo;
          for(var i=0;i<elencoVincoli.length;i++){
            sVincolo = elencoVincoli[i].descrizione_tavola + " - " + elencoVincoli[i].descrizione_zona;
            for(var j=1;j<7;j++){
              if($("#vincolo_nome_0" + j).val() == sVincolo)
                break;
              if($("#vincolo_nome_0" + j).val() == ""){
                $("#vincolo_nome_0" + j).val(sVincolo);
                break;
              }
            }
          }

        }

      });
    }

    function aggiungiAmbiti(data){
      var foglio = data[0];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[1];
      particella = particella.trim();
      //var testRE = particella.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) particella = testRE[1];

      $.ajax({
        'url':"services/elencoPUCAmbiti",
        'type':'GET',
        'data':{"sezione":'',"foglio":foglio,"particella":particella},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          var str;
          var elencoAmbiti = data.results;
          var sAmbito = $("#immobile_puc_ambito").val();
          for(var i=0;i<elencoAmbiti.length;i++){
            str = elencoAmbiti[i].descrizione_zona;
            if(sAmbito.indexOf(str)==-1)
              sAmbito += elencoAmbiti[i].descrizione_zona + '\n';
          }
          $("#immobile_puc_ambito").val(sAmbito);
        }

      });
    }

    function aggiungiInondabilita(data){
      var foglio = data[0];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[1];
      particella = particella.trim();
      //var testRE = particella.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) particella = testRE[1];

      $.ajax({
        'url':"services/elencoPDBInondabilita",
        'type':'GET',
        'data':{"sezione":'',"foglio":foglio,"particella":particella},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          var str;
          var elencoAmbiti = data.results;
          var sAmbito = $("#immobile_pdb_inondabilita").val();
          for(var i=0;i<elencoAmbiti.length;i++){
            str = elencoAmbiti[i].descrizione_zona;
            if(sAmbito.indexOf(str)==-1)
              sAmbito += elencoAmbiti[i].descrizione_zona + '\n';
          }
          $("#immobile_pdb_inondabilita").val(sAmbito);
        }

      });
    }

    function aggiungiSuscettivita(data){
      var foglio = data[0];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[1];
      particella = particella.trim();
      //var testRE = particella.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) particella = testRE[1];

      $.ajax({
        'url':"services/elencoPDBSuscettivita",
        'type':'GET',
        'data':{"sezione":'',"foglio":foglio,"particella":particella},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          var str;
          var elencoAmbiti = data.results;
          var sAmbito = $("#immobile_pdb_suscettivita").val();
          for(var i=0;i<elencoAmbiti.length;i++){
            str = elencoAmbiti[i].descrizione_zona;
            if(sAmbito.indexOf(str)==-1)
              sAmbito += elencoAmbiti[i].descrizione_zona + '\n';
          }
          $("#immobile_pdb_suscettivita").val(sAmbito);
        }

      });
    }
    //RIAGGIUNGO TUTTI GLI OVERLAYS
    $('#elenco_nct_datagrid').dataTable().fnSettings().aoDrawCallback.push( {
      "fn": function( oSettings ){
        removeOverlays();
        var data = $('#elenco_nct_datagrid').dataTable().fnGetData();
        addOverlays(data);
        $("#immobile_ambito").val("");
        for(var i=0;i<overlays.length;i++){
          if ($("#vincolo_nome_01").length) aggiungiVincoli(data[i]);
          if ($("#immobile_puc_ambito").length) aggiungiAmbiti(data[i]);
          if ($("#immobile_pdb_inondabilita").length) aggiungiInondabilita(data[i]);
          if ($("#immobile_pdb_suscettivita").length) aggiungiSuscettivita(data[i]);
        }
      }
    });

    addOverlays($('#elenco_nct_datagrid').dataTable().fnGetData());

  });



/*
    //EVENTI SUL DATAGRID 
    $('#elenco_nct_datagrid').dataTable().fnSettings().aoRowCreatedCallbackpush( {
        "fn": function( nRow, aData, iDataIndex ){ 
            var geomIndex = gridSettings.geomIndex || (aData.length-1);


            
            var coord = aData[geomIndex];
            var testRE = coord.match("<span>(.*)</span>");
            if(testRE.length>0) coord = testRE[1];
            var polygonOptions = {"strokeColor":"#00FFFF","strokeOpacity": 1.0,"strokeWeight": 2};

            var polygon = $("#mappa").iolGoogleMap.createOverlay(coord,polygonOptions);
            polygon.setMap(mappa);

            var foglio = aData[1];
            var testRE = foglio.match("<span>(.*)</span>");
            if(testRE.length>0) foglio = testRE[1];

            var particella = aData[2];
            var testRE = particella.match("<span>(.*)</span>");
            if(testRE.length>0) particella = testRE[1];
            console.log(aData)

        $.ajax({
          'url':"services/elencoVincoli",
          'type':'GET',
          'data':{"sezione":'',"foglio":foglio,"particella":particella},
          'dataType':'JSON',
          'success':function(data, textStatus, jqXHR){
            elencoVincoli = data.results;
            console.log(elencoVincoli)
            var sVincolo;
            for(var i=0;i<elencoVincoli.length;i++){
              sVincolo = elencoVincoli[i].descrizione_tavola + " - " + elencoVincoli[i].descrizione_zona;
              for(var j=1;j<7;j++){
                if($("#vincolo_nome_0" + j).val() == sVincolo)
                  break;
                if($("#vincolo_nome_0" + j).val() == ""){
                  $("#vincolo_nome_0" + j).val(sVincolo);
                  break;
                }
              }
            }

          }

        });



        }
    });
    //EVENTI SUL DATAGRID 
/*
    var aData = $('#elenco_nct_datagrid').dataTable().fnGetData();
    

    for(i=0;i<aData.length;i++){
      var geomIndex = gridSettings.geomIndex || (aData[0].length-1);
      var coord = aData[i][geomIndex];

      //var testRE = coord.match("<span>(.*)</span>");
      //if(testRE.length>0) coord = testRE[1];
      var polygon = $("#mappa").iolGoogleMap.createOverlay(coord,polygonOptions);
      polygon.setMap(mappa);
      overlays.push(polygon);

    }

*/


})(jQuery);
