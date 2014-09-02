
(function ($) {

  var initDialog = function(_, container){

    $("#elenco_elementi_addrow").hide();
    //$('#elemento_tipo').select2('val', null);

    var elencoCivici = [];
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
                data.results.push({id: this.id, text: this.text, coords: this.lng + ' ' + this.lat});
              }
            });
            query.callback(data);
        },
/*        //PER INSERIRE U N VALORE NON IN ELENCO (COMBO EDITABILE)
        createSearchChoice:function(term, data) {
          if ($(data).filter(function() {return this.text.localeCompare(term)===0;}).length===0) {
            return {id:term, text:term};
          } 
        },
        initSelection : function (element, callback) {
          var data ={id: element.val(), text: element.val(), coords:'' } ;
          callback(data);
        }*/
    }).on("change", function(e){
        //$("#geometry").val(e.added.coords);
        var coords = e.added.coords.split(" ");
        var map = $("#mappa").iolGoogleMap.getMap();
        map.setCenter(new google.maps.LatLng(parseFloat(coords[1]),parseFloat(coords[0])));
        map.setZoom(16);



    });



    $("#via").select2().on("change", function(e) { 
      $.ajax({
        'url':"services/elencoCivici",
        'type':'GET',
        'data':{"idvia":$(this).val()},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          elencoCivici = data.results;
          $('#civico').select2('data', elencoCivici);
          $('#civico').select2('val', null);
          //$("#geometry").val('');
        }
      });
    });
  }

  //per i test anche in creazione del doc
  $(document).on('ready', initDialog);


  $(document).on('maploaded', function () {


    var map = $("#mappa").iolGoogleMap.getMap();
    google.maps.event.addListener(map, 'overlaycomplete', function(overlay){
        var geom = "", points = [];
        if(overlay.geometryType=='point')
          geom = "SRID=4326;POINT(" + overlay.getPosition().lng() + " " + overlay.getPosition().lat() + ")";
        else{
          overlay.getPath().forEach(function(point,_){
            points.push(point.lng() + " " +point.lat());
          })
          geom = "SRID=4326;LINESTRING(" + points.join(",") + ")";
        }

        $.ajax({
        'url':"scavi/trovaCategoria",
        'type':'POST',
        'data':{"geom":geom},
        'dataType':'JSON',
        'success':function(data, textStatus, jqXHR){
          //elencoCivici = data.results;
          //$('#civico').select2('data', elencoCivici);
          //$('#civico').select2('val', null);
          //$("#geometry").val('');
          //SE STO USANDO IL DATAGRID
          var datagridLink = $("#" + overlay.fieldId + "_addrow").get(0);
          if(datagridLink){
            var datagridLinkTarget = datagridLink && $(datagridLink).attr("href");
            if(datagridLinkTarget) $(datagridLink).attr("href", datagridLinkTarget + "&categoria=" + data[0].categoria)
            $(datagridLink).trigger('click');
          }

          //SE STO USANDO LA COMBO SULLA FORM
          if($('#categoria_cosap').length)
            $('#categoria_cosap').select2('val', data[0].categoria);
          

        }
      });


    });




  });


})(jQuery);