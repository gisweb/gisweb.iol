$.plominoMaps = {"google":{"points":[],"lines":[],"polygons":[],markers:{}},"gisclient":{"points":[],"lines":[],"polygons":[]},"actions":{}};
if (!google.maps.Polyline.prototype.getBounds) {
   google.maps.Polyline.prototype.getBounds = function(latLng) {
      var bounds = new google.maps.LatLngBounds();
      var path = this.getPath();
      for (var i = 0; i < path.getLength(); i++) {
         bounds.extend(path.getAt(i));
      }
      return bounds;
   }
}
if (!google.maps.Polygon.prototype.getBounds) google.maps.Polygon.prototype.getBounds = google.maps.Polyline.prototype.getBounds

var svClient = new google.maps.StreetViewService();
var svGeocoder = new google.maps.Geocoder();
var myPanorama;

$(function(){

     //MAPPA GOOGLE
     $(".googlemap-plugin").each(function(){
        if(typeof($(this).data("pluginOptions"))!="object") return;
        var pluginOptions = $(this).data("pluginOptions");

            if(pluginOptions.map.center) 
                pluginOptions.map.center = new google.maps.LatLng(pluginOptions.map.center[0],pluginOptions.map.center[1]);
            if(!$(this).height()) $(this).height(300);//QUANDO MANCA IL FILE RESOURCES.CSS
            pluginOptions.map["zoomControlOptions"] = {"style":google.maps.ZoomControlStyle.LARGE};
            var map = new google.maps.Map(document.getElementById(this.id),pluginOptions.map);
            map.initSettings = pluginOptions.map;
            map.editMode = $(this).data("editMode")==1;
            var fieldId = this.id;
            
           // google.maps.event.addListener(map, 'center_changed', updateMapField);
           // google.maps.event.addListener(map, 'zoom_changed', updateMapField);
           // google.maps.event.addListener(map, 'maptypeid_changed', updateMapField);


            /*
            if(window.parent.jQuery.plominoMaps.google.map){
               var parentMap = window.parent.jQuery.plominoMaps.google.map;
               var c = parentMap.getCenter()
               map.setCenter(new google.maps.LatLng(c.lat(),c.lng()));
               map.setZoom(parentMap.getZoom());
            }*/

            if(document.getElementById(fieldId+"_streetview")){
                //jq("#"+fieldId+"_streetview").height(300);
                //var panorama = new  google.maps.StreetViewPanorama(document.getElementById(fieldId+"_streetview"));
                //map.setStreetView(panorama);
            }

            map.infowindow = new google.maps.InfoWindow(); 
            $.plominoMaps.google.map = map;

                  

     });




  //GENERAZIONE DEI CONTROLLI GEOCODE NUOVI
   $(".geocode-plugin").each(function(){
        if(typeof($(this).data("pluginOptions"))!="object") return;
        var pluginOptions = $(this).data("pluginOptions");
        pluginOptions.fieldId= this.id;  
        pluginOptions.editMode = $(this).data("editMode")==1;
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;

	if($(this).is('a')) $(this).bind('click',pluginOptions,jQuery.plominoMaps.actions[pluginOptions.action]);
	if($(this).is('img')) $(this).attr('src',pluginOptions.icon);
	if($(this).data("coord")){
            var v = $(this).data("coord").split(' ');console.log(pluginOptions)
            var position = new google.maps.LatLng(parseFloat(v[1]),parseFloat(v[0]));
            $.plominoMaps.updateMarkerPosition(pluginOptions ,position);
	}
    });


   //PLUGIN PROGRESSIVE
   $(".progressive-plugin").each(function(){
        if(typeof($(this).data('pluginOptions'))!='object') return;
        var pluginOptions = $(this).data('pluginOptions');
        pluginOptions.editMode = $(this).data("editMode")==1;
        pluginOptions.isProg = true;
        pluginOptions.fieldId = this.id;
      
        pluginOptions.fieldId = this.id;
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;
        $("[name='"+this.id+"_icon']").attr('src',pluginOptions.icon);

        $(this).prev().bind('click',pluginOptions,jQuery.plominoMaps.actions[pluginOptions.action]);
        $(this).next().bind('click',pluginOptions,jQuery.plominoMaps.actions[pluginOptions.action]);
        $(this).bind('blur',function(){ if(!$(this).val()) $("#"+this.id + '_geometry').val('') })
	
        if($(this).data("coord")){
            var v = $(this).data("coord").split(' ');
            var position = new google.maps.LatLng(parseFloat(v[1]),parseFloat(v[0]));
            $.plominoMaps.updateMarkerPosition(pluginOptions ,position);
	}
    });
   
   //PLUGIN GEOCODE GOOGLE ADDRESS
   $(".address-plugin").each(function(){
        if(typeof($(this).data('pluginOptions'))!='object') return;
        var pluginOptions = $(this).data('pluginOptions');
        pluginOptions.editMode = $(this).data("editMode")==1;
        pluginOptions.fieldId = this.id;
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;
        $("[name='"+this.id+"_icon']").attr('src',pluginOptions.icon);

        $(this).next().bind('click',pluginOptions,jQuery.plominoMaps.actions[pluginOptions.action]);
        $(this).bind('blur',function(){ if(!$(this).val()) $("#"+this.id + '_geometry').val('') })
	
        if($(this).data("coord")){
            var v = $(this).data("coord").split(' ');
            var position = new google.maps.LatLng(parseFloat(v[1]),parseFloat(v[0]));
            $.plominoMaps.updateMarkerPosition(pluginOptions ,position);
	}
    });

});




  $.plominoMaps.updateMarkerPosition = function(options,position){
    //var fieldId = (options.geometryField && options.geometryField.attr('id'))||options.fieldId;
    var fieldId = options.fieldId;
    var marker = $.plominoMaps.google.markers[fieldId];
    if(typeof(marker)=="undefined"){
        marker = new google.maps.Marker(options);
        marker.setMap($.plominoMaps.google.map);
        marker.setDraggable(options.editMode);
        google.maps.event.addListener(marker, 'dragend', function() {$.plominoMaps.updateGeometryField(marker);marker.isProg && $.plominoMaps.updateProgField(marker);});
        google.maps.event.addListener(marker, 'click', function() {$.plominoMaps.zoomOnStreetView (marker)});
        $.plominoMaps.google.markers[fieldId] = marker;
    }
    marker.setPosition(position);
    if(typeof(marker.panoMarker)!='undefined') marker.panoMarker.setPosition(position)
    $.plominoMaps.updateGeometryField(marker);
    $.plominoMaps.google.map.setCenter(position);
    $.plominoMaps.google.map.setZoom(Math.max(options.zoom,18)||Math.max($.plominoMaps.google.map.getZoom(),18));
    return marker;
}


$.plominoMaps.updateGeometryField = function(marker){

   //Aggiorno il campo di posizione

    if(marker.dataTable){
      //Campo tipo datagrid 
        if($('#' + marker.fieldId + '_gridvalue').length){
           var field = $('#' + marker.fieldId + '_gridvalue');
           var field_data = jq.evalJSON(field.val());
           var gridRow = field_data[marker.rowIndex];

           if(marker.latIndex){
              gridRow[marker.latIndex] = marker.getPosition().lat().toFixed(6)
              marker.dataTable.fnUpdate(marker.getPosition().lat().toFixed(6),marker.rowIndex, marker.latIndex);
           }
           if(marker.lngIndex){
             gridRow[marker.lngIndex] = marker.getPosition().lng().toFixed(6)
             marker.dataTable.fnUpdate(marker.getPosition().lng().toFixed(6),marker.rowIndex, marker.lngIndex);

          }
          if(marker.geomIndex) gridRow[marker.geomIndex] = marker.getPosition().lng().toFixed(6)+" "+marker.getPosition().lat().toFixed(6);

          field_data[marker.rowIndex] = gridRow;
          field.val(jq.toJSON(field_data));
      }
  }else{
      $("#"+ marker.fieldId + '_geometry').val(marker.getPosition().lng().toFixed(6)+" "+marker.getPosition().lat().toFixed(6));
      //Campi lat e lng se esistono
     // if(jQuery("[name^='lat']")) jQuery("[name^='lat']").val(marker.getPosition().lat().toFixed(6))
     // if(jQuery("[name^='lng']")) jQuery("[name^='lng']").val(marker.getPosition().lng().toFixed(6))
  }
 
}

$.plominoMaps.updateProgField = function(marker){

    if(jQuery.plominoMaps.actions["snapto_strada"])jQuery.plominoMaps.actions["snapto_strada"](marker)


};

//CENTRA UN OGGETTO DI TIPO OVERLAY
$.plominoMaps.google.zoomToObject = function (overlay){



  if(marker){
     marker.setDraggable(dr);
     marker.map.infowindow.setContent(marker.title);
     marker.map.infowindow.open(marker.map, marker);
  }
}









$.plominoMaps.zoomOnStreetView = function(marker){

console.log(marker)
    var panorama;
    var map = marker.map;
    var sViewContainer = jq("#"+map.getDiv().id+"_streetview").get(0);
    
    if(!sViewContainer) return;

    if(!$(sViewContainer).height()) $(sViewContainer).height(300);//QUANDO MANCA IL FILE RESOURCES.CSS

    if(!myPanorama){
        myPanorama= new  google.maps.StreetViewPanorama(sViewContainer);
        map.setStreetView(myPanorama);
    }
    svClient.getPanoramaByLocation(marker.getPosition(),50,function (panoData, status) {

        if (status == google.maps.StreetViewStatus.OK) {
            /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
            var position = marker.getPosition();     
            if(typeof(marker.panoMarker)=='undefined'){
               marker.panoMarker = new google.maps.Marker({
                  map:myPanorama,
                  icon:marker.getIcon(),
                  position:position,
                  draggable:true});
               google.maps.event.addListener(marker.panoMarker, 'dragend', function() {
                      marker.setPosition(marker.panoMarker.getPosition())
                      $.plominoMaps.updateGeometryField(marker);
                      marker.isProg && $.plominoMaps.updateProgField(marker);
               });
               google.maps.event.addListener(marker, 'dragend', function() {
                      marker.panoMarker.setPosition(marker.getPosition());
               });
            }
            var panoCenter = panoData.location.latLng;//trovo la posizione del frame
            var heading = google.maps.geometry.spherical.computeHeading(panoCenter, position);//calcolo heading con la differenza
            myPanorama.setPosition(position);
            myPanorama.setPov({heading:heading , pitch:-15, zoom:0});
            $(".no-streetview").addClass('hidden');
            $(sViewContainer).removeClass('hidden');

        } else {
             $(sViewContainer).addClass('hidden');
             $(".no-streetview").removeClass('hidden');
        }
   });
}

//Aggiorna la mappa con i dati presenti in una datatable
$.plominoMaps.google.updateMap = function (dataTable){
     var data = dataTable.fnGetData();
     var conf = dataTable.fnSettings().oInit;

    jQuery.each(data, function(index, row) { 
       var pos = row[conf.geomIndex];
       if(typeof(pos)=='string') pos = pos.split(" ");
       if(pos.length==2){

          //AGGIUNGO I PUNTI
          pos[0]=parseFloat(pos[0]);pos[1]=parseFloat(pos[1]);
          var options = {
            icon:conf.iconPath + row[conf.iconIndex],
            iconh:null,
            iconw:null,
            dataTable:dataTable,
            //editmode:conf.editMode,
            fieldId:conf.fieldId+'|'+index,
            //action: options.action,
            rowIndex:index,
            geomIndex:conf.geomIndex,
            latIndex:conf.latIndex,
            lngIndex:conf.lngIndex,
            title:row[conf.titleIndex]
       }
       var marker = $.plominoMaps.updateMarkerPosition(options,new google.maps.LatLng(parseFloat(pos[1]),parseFloat(pos[0])));
       if(conf.editMode==1) marker.setDraggable(true);
       google.maps.event.addListener(marker, 'click', function() {
            datagrid_deselect_rows(dataTable);
            jq(dataTable.fnGetNodes()[marker.rowIndex]).addClass('datagrid_row_selected');
       });
     }
     else{
         //Aggiungo poligoni o linee
         var options = {
            dataTable:dataTable,
            editmode:conf.editMode,
            fieldId:row[0],
            //action: options.action,
            title:row[conf.titleIndex],
            geom:row[conf.geomIndex],
            geomType:row[conf.geomTypeIndex],
            }
         jQuery.plominoMaps.google.addEncodedGeometry(options);

     }









   });

  //var markerCluster = new MarkerClusterer(jQuery.plominoMaps.google.map, jQuery.plominoMaps.google.points);


}


//**************** FUNZIONE PER LA GESTIONE DELLE GEOMETRIE IN DATAGRID ***********************//
function datagrid_add_geometry(dTable,fieldId,nRow,iDataIndex,obj){

    var updateGeometryField = function(overlay){

       if($('#' + overlay.fieldId + '_gridvalue').length){
           var field = $('#' + overlay.fieldId + '_gridvalue');
           var field_data = jq.evalJSON(field.val());
           var gridRow = field_data[overlay.rowIndex];

           if(overlay.latIndex && overlay.getPosition){
              gridRow[overlay.latIndex] = overlay.getPosition().lat().toFixed(6)
              dTable.fnUpdate(overlay.getPosition().lat().toFixed(6),overlay.rowIndex, overlay.latIndex);
           }
           if(overlay.lngIndex && overlay.getPosition){
             gridRow[overlay.lngIndex] = overlay.getPosition().lng().toFixed(6)
             dTable.fnUpdate(overlay.getPosition().lng().toFixed(6),overlay.rowIndex, overlay.lngIndex);

          }
          if(typeof(overlay.geomIndex)!='undefined'){
              if(overlay.getPosition)
                  gridRow[overlay.geomIndex] = overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
              else{
                  gridRow[overlay.geomIndex] = overlay.geometryType +';'+google.maps.geometry.encoding.encodePath(overlay.getPath());   
              }
          }

          field_data[overlay.rowIndex] = gridRow;
          field.val(jq.toJSON(field_data));
      }


   }


                obj.dataTable = true;
                obj.fieldId = fieldId;
                var tbConf = dTable.fnSettings().oInit;
                obj.geomIndex = tbConf.geomIndex;
                obj.rowIndex = iDataIndex;

		if (obj.geometryType != google.maps.drawing.OverlayType.MARKER) {
			google.maps.event.addListener(obj.getPath(), 'set_at', function(index) {
                                var encodeString = google.maps.geometry.encoding.encodePath(this);
				var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this);
				if (obj.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this);
                                if (encodeString) updateGeometryField(obj);
			});
			google.maps.event.addListener(obj.getPath(), 'insert_at', function(index) {
				var encodeString = google.maps.geometry.encoding.encodePath(this);
				var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this);
				if (obj.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this);
                                if (encodeString) updateGeometryField(obj);
			});
			var encodeString = google.maps.geometry.encoding.encodePath(obj.getPath());
			var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(obj.getPath());
			if (obj.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(obj.getPath());
                        if (encodeString) updateGeometryField(obj);
	        }
		else{
			google.maps.event.addListener(obj, 'dragend', function() {
			        updateGeometryField(obj);
                        })
	                updateGeometryField(obj);
		}


}
























jQuery.plominoMaps.google.addMarker = function(options){

    if(options.pos){

        var newMarker = new google.maps.Marker({
            icon:options.icon,
            iconh:options.iconh,
            iconw:options.iconw,
            dataTable:options.dataTable,
            draggable:options.editmode,
            fieldId:options.fieldId,
            action: options.action,


            rowIndex:options.rowIndex,
            iconIndex:options.geomIndex,
            geomIndex:options.geomIndex,
            latIndex:options.latIndex,
            lngIndex:options.lngIndex,
            title:options.title,

            position:new google.maps.LatLng(options.pos[0],options.pos[1]),
            map:jQuery.plominoMaps.google.map
        });

        if(options.dataTable){
              google.maps.event.addListener(newMarker, 'click', function() {
                 datagrid_deselect_rows(newMarker.dataTable);
                 jQuery(newMarker.dataTable.fnGetNodes()[newMarker.rowIndex]).addClass('datagrid_row_selected');

              }); 
        };

        if (options.editmode) {
            google.maps.event.addListener(newMarker, 'dragend', function() {
                  newMarker.pos = [newMarker.position.lat(),newMarker.position.lng()];
                  jQuery.plominoMaps.updateGeometryField(newMarker)
                  
                  //Se c'è anche gisclient allineo il marker su gc

                 //if(jQuery.plominoMaps.gisclient.map)jQuery.plominoMaps.updateMarkerPosition(newMarker);
                   //console.log(options)

            });
        }
        else{
            if(options.winpopup && options.winpopup.params){
                 options.winpopup.params['field'] = id;
                 google.maps.event.addListener(newMarker, 'click', function() {
                    
                    winPopup(id,newMarker,options);
                })
            }
        }; 
        jQuery.plominoMaps.google.points.push(newMarker);
        return newMarker;
    }
}

jQuery.plominoMaps.google.removeMarker = function(id){
  var marker = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.points,id);
  marker.setMap(null)
  jQuery.plominoMaps.google.points.splice(id,1);
}




jQuery.plominoMaps.google.addEncodedGeometry = function(options){

    //console.log(options)
   var overlay;
    var path = google.maps.geometry.encoding.decodePath(options.geom);
    if(options.geomType=='line') overlay = new google.maps.Polyline({strokeColor:'#00FFFF',strokeOpacity: 1.0,strokeWeight: 2});
    if(options.geomType=='polygon') overlay = new google.maps.Polygon({strokeColor:'#00FFFF',strokeOpacity: 1.0,strokeWeight: 2});

    if(overlay) {
         overlay.fieldId =  options.fieldId;   
         overlay.geomType = options.geomType;
         overlay.setPath(path);
         overlay.setMap($.plominoMaps.google.map);
         //$.plominoMaps.google.map.fitBounds(overlay.getBounds())
         if(options.geomType=='line')jQuery.plominoMaps.google.lines.push(overlay)
         if(options.geomType=='polygon')jQuery.plominoMaps.google.polygons.push(overlay)

         
    }
}

//Trova un elemento di geometria dato un indice
jQuery.plominoMaps.getElement = function(list,idx){
   if(typeof(idx)=='string')
        for (i=0;i<list.length;i++){
              if(list[i].fieldId==idx) return list[i]
        }
   if(typeof(list[idx])!='undefined') 
       return list[idx]
   return false
}







jQuery.plominoMaps.google.getOverlay =  function(id){
  var el=false;
  el = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.points,id);
  if (el) return el;
  el = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.lines,id);
  if (el) return el;
  el = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.polygons,id);
  if (el) return el;
  return el;
}

$.plominoMaps.switchOnStreetView =  function(marker){

      //SE C'è STRTEETVIEW VADO SU QUELLO
       var svClient = new google.maps.StreetViewService();
       var panorama = $.plominoMaps.google.map.getStreetView();













      
        if(panorama.marker){
            panorama.marker.setPosition(marker.position)
       }
       else{
            panorama.marker = new google.maps.Marker({position:marker.position,map:panorama,icon:marker.icon});
            google.maps.event.addListener(panorama.marker, 'dragend', function() {

                console.log('xcvxcv')
            })
           
       }
       panorama.marker.setDraggable(true)
       jQuery.plominoMaps.google.map.setCenter(marker.position);
       jQuery.plominoMaps.google.map.setZoom(16);
       svClient.getPanoramaByLocation(marker.position, 50,function (panoData, status) {

              if (status == google.maps.StreetViewStatus.OK) {
                    /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
                     
                    var panoCenter = panoData.location.latLng;//trovo la posizione del frame
                     var heading = google.maps.geometry.spherical.computeHeading(panoCenter, marker.position);//calcolo heading con la differenza

                       panorama.setPosition(marker.position);
                       panorama.setPov({heading:heading , pitch:-30, zoom:0});
                       panorama.setVisible(true);
                      jq("#concessione_mappa_streetview").removeClass('hidden');
console.log(panorama)

           } else {
                      jq("#concessione_mappa_streetview").addClass('hidden');
                      panorama.setVisible(false);

          }
    });

}


$.plominoMaps.zoomStreetView =  function(position){

     //SE C'è STRTEETVIEW VADO SU QUELLO SENZA AGGIUNGERE MARKERS
    
       var svClient = new google.maps.StreetViewService();
       svClient.getPanoramaByLocation(position, 50,function (panoData, status) {
       var panorama = jQuery.plominoMaps.google.map.getStreetView();
       if (status == google.maps.StreetViewStatus.OK) {
              /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
              var panoCenter = panoData.location.latLng;//trovo la posizione del frame
              var heading = google.maps.geometry.spherical.computeHeading(panoCenter, position);//calcolo heading con la differenza
              panorama.setPosition(position);
              panorama.setPov({heading:heading , pitch:-30, zoom:0});
              panorama.setVisible(true);


       } else {
              alert('Le immagini del servizio Street View di Google non sono disponibili in questo punto')

          }
    });

}






function clearMap(type){
   var list = jQuery.plominoMaps[type];
   for (i=0;i<list.length;i++){
        list[i].setMap(null) 
   }
}





//Funzione che aggiorna il campo con la configurazione della mappa
function updateMapField(){


//console.log('#'+this.getDiv().id+'_settings')


      var v = jQuery('#'+this.getDiv().id+'_settings').val();
      if(v)
           v = jQuery.evalJSON(v) 
      else
           v={};
      v.zoom=this.getZoom();
      v.center=[this.getCenter().lat(),this.getCenter().lng()];
      v.mapTypeId=this.getMapTypeId();
//console.log(jQuery.toJSON(v))
      jQuery('#'+this.getDiv().id+'_settings').val(jQuery.toJSON(v));

}


function markerDragEnd(evt){

var params={
   "SERVICE":"WMS",
   "QUERY_LAYERS":"L2624",
   "SRS":"EPSG:900913",
   "VERSION":"1.1.1",
   "REQUEST":"GetFeatureInfo",
   "BBOX":"1045222.2862269861,5479002.891666667,1110735.2862269864,5528137.641666667",
   "WIDTH":1200,
   "HEIGHT":900,
   "INFO_FORMAT":"application/vnd.ogc.gml",
   "X":400,
   "Y":400}
jQuery.ajax({
  'url':'http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624',
		'type':'GET',
		'data':params,
                'async': false,
                'contentType': "application/vnd.ogc.gml",
		'dataType':'JSON',
                'success':function(data, textStatus, jqXHR){
                              console.log(data)
                          }
	});



}




         

function addlayer(id,options){
    var map=jQuery.plominoMaps.google.map;
              map.overlayMapTypes.setAt(2, new google.maps.ImageMapType({
                    getTileUrl: getGCTileURL,
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    url:"http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624",
                    map:map,
                    name:'mappale'
               }));

}
function WMSGetTileUrl(tile, zoom) {
console.log(zoom)
      var projection = $.plominoMaps.google.map.getProjection();
      var zpow = Math.pow(2, zoom);
      var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
      var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
      var ulw = projection.fromPointToLatLng(ul);
      var lrw = projection.fromPointToLatLng(lr);
      //The user will enter the address to the public WMS layer here.  The data must be in WGS84
      var baseURL = this.url;

      var version = "1.3.0";
      var request = "GetMap";
      var format = "image%2Fjpeg"; //type of image returned  or image/jpeg
      //The layer ID.  Can be found when using the layers properties tool in ArcMap or from the WMS settings 
      var layers = "sfondo";
      //projection to display. This is the projection of google map. Don't change unless you know what you are doing.  
      //Different from other WMS servers that the projection information is called by crs, instead of srs
      var crs = "EPSG:4326"; 
      //With the 1.3.0 version the coordinates are read in LatLon, as opposed to LonLat in previous versions
      var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
      var service = "WMS";
      //the size of the tile, must be 256x256
      var width = "256";
      var height = "256";
      //Some WMS come with named styles.  The user can set to default.
      var styles = "default";
      //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
      var url = baseURL + "Layers=" + layers + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height;
      return url;
  }

getGCTileURL = function(tile, zoom) {
      var projection = $.plominoMaps.google.map.getProjection();
      var zpow = Math.pow(2, zoom);
      var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
      var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
      var ulw = projection.fromPointToLatLng(ul);
      var lrw = projection.fromPointToLatLng(lr);
      //The user will enter the address to the public WMS layer here.  The data must be in WGS84
      var baseURL;// = this.url;
      if(jq("#ubicazione_strada_elenco").val()) 
           baseURL = this.url + "&GCFILTERS=grafo.archi@cod_stra='" + jq("#ubicazione_strada_elenco").val() +"'";
      else
           return false
      var version = "1.1.1";
      var request = "GetMap";
      var format = "image%2Fpng"; //type of image returned  or image/jpeg
      //The layer ID.  Can be found when using the layers properties tool in ArcMap or from the WMS settings 
      //projection to display. This is the projection of google map. Don't change unless you know what you are doing.  
      //Different from other WMS servers that the projection information is called by crs, instead of srs
      var srs = "EPSG:4326"; 
      //With the 1.1.1 version the coordinates are read in LonLat 
      var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
      var service = "WMS";
      //the size of the tile, must be 256x256
      var width = "256";
      var height = "256";
      //Some WMS come with named styles.  The user can set to default.
      var styles = "default";
      //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
      var url = baseURL + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&SRS=" + srs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height;
      return url;
  }


jQuery.plominoMaps.actions["geocode_address"] = function (e){
        var options = e.data;
	var address='';
        var txt;
	jQuery.each(options.fieldlist, function(index, fieldId) { 
             if($('#' + fieldId).is('select')) 
                 txt = $("#" + fieldId +" option:selected").text();
             else if($('#' + fieldId).is('input')) 
                 txt = $('#' + fieldId).val();
             else if($('#' + fieldId).length==0)
                 txt = fieldId;
             if(!txt) alert ('Campo ' + fieldId+ ' vuoto')
	     address = address + txt + ', ';
	});
	svGeocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK){
                    var marker = $.plominoMaps.updateMarkerPosition(options,results[0].geometry.location);
                    $.plominoMaps.zoomOnStreetView (marker)
                }
                else{
                     alert('Non è possibile individuare l\'indirizzo ' + address)
                }
	});
}

$.plominoMaps.actions["geocode_civico"] = function (e){
        var options = e.data;
        var dataParams = getValuesForFields(options.params)

	$.ajax({
                'url':'resources/xSuggest',
		'type':'POST',
		'data':dataParams,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                    if(data.success){
                        var position = new google.maps.LatLng(data.lat,data.lng)
                        $.plominoMaps.updateMarkerPosition(options,position);
		    }		 
                    else
                        alert('Il civico inserito non risulta presente in archivio')
                }
	});
} 

$.plominoMaps.actions["geocode_catasto"] = function (e){
        var options = e.data;
        var dataParams = getValuesForFields(options.params)
	$.ajax({
                'url':'resources/xSuggest',
		'type':'POST',
		'data':dataParams,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                    if(data.success){
                        var position = new google.maps.LatLng(data.lat,data.lng)
                        $.plominoMaps.updateMarkerPosition(options,position);
		    }		 
                    else
                        alert('Il mappale inserito non risulta presente in archivio')
                }
	});
}           

function getValuesForFields(obj){
     var params={};
     $.each(obj, function(key,fieldName) { 
          params[key] = fieldName;
          if($("[name='"+fieldName+"']").length>0) params[key] = $("[name='"+fieldName+"']").val()
     });
     return params
}