
(function ($) {

  var initDialogCivici = function(_, container){
    var elencoCivici = [];
    $("input[name='civico_civico']").select2({
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
        var val = e.added && e.added.coords || '';
        $("input[name='civico_geometry']").val(val);
    });

    $("select[name='civico_via']").select2().on("change", function(e) { 
      //$("input[name='civico_nomevia']").val(e.added.text);
      $.ajax({
        'url':"services/elencoCivici",
        'type':'GET',
        'data':{"idvia":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoCivici = data.results;
          //$("input[name='civico_civico']").select2('data', elencoCivici);
          //$("input[name='civico_civico']").select2('val', null);
          //$("input[name='civico_geometry']").val('');
        }
      });
    });
  }
  //codice da eseguire sull'apertura del dialog
  $(document).on('opendialog', initDialogCivici);

  //per i test anche in creazione del doc
  $(document).on('ready', initDialogCivici);



  //MARKERS DALLA TABELLA ALLA MAPPA
  $(document).on('maploaded', function () {

    var gridSettings = $('#elenco_civici_datagrid').dataTable().fnSettings().oInit;
    var options = {"markerOptions":{"icon":portal_url+'/images/iol-marker.png'}};
    var mappa = $("#mappa").iolGoogleMap.getMap();
    var overlays = [];

    function addOverlays(data){
      for(var i=0;i<data.length;i++){
        var geomIndex = gridSettings.geomIndex || (data[i].length-1);
        var coord = data[i][geomIndex];
        if(!coord) return;
        var marker = $("#mappa").iolGoogleMap.createOverlay(coord,options);
        marker.setMap(mappa);
        overlays.push(marker);
        mappa.setCenter(marker.getPosition());
        mappa.setZoom(16);      
      }

    }

    function removeOverlays(){
      for(var i=0;i<overlays.length;i++){
        overlays[i].setMap(null);
        delete overlays[i];
      }
      overlays=[];
    }

    //RIAGGIUNGO TUTTI GLI OVERLAYS
    $('#elenco_civici_datagrid').dataTable().fnSettings().aoDrawCallback.push( {
      "fn": function( oSettings ){
        removeOverlays();
        var data = $('#elenco_civici_datagrid').dataTable().fnGetData();
        addOverlays(data);
      }
    })



    addOverlays($('#elenco_civici_datagrid').dataTable().fnGetData());

  });


})(jQuery);