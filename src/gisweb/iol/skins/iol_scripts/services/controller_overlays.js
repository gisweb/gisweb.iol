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
      var foglio = data[1];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[2];
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
      var foglio = data[1];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[2];
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
      var foglio = data[1];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[2];
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
      var foglio = data[1];
      foglio = foglio.trim();
      //var testRE = foglio.match("<span>(.*)</span>");
      //if(testRE && testRE.length>0) foglio = testRE[1];

      var particella = data[2];
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