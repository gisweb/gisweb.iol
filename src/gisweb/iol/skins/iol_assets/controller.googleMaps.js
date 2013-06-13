//TEST CONTROLLER DI PAGINA
$(function () {

    jQuery("div[data-plugin='googlemap']").each(function(){
        eval("var options = "  + jQuery(this).data('googlemapOptions'));
        if(options.center) options.center = new google.maps.LatLng(options.center[0],options.center[1]);
        var map = new google.maps.Map(document.getElementById(this.id),options);
        map.initSettings = options;

        google.maps.event.addListener(map, 'center_changed', updateMapField);
        google.maps.event.addListener(map, 'zoom_changed', updateMapField);
        google.maps.event.addListener(map, 'maptypeid_changed', updateMapField);

        //Evetuali oprazioni da fare su ogni singola mappa
        //map.infowindow = new google.maps.InfoWindow(); //Aggiungo una finestra di popup per ogni mappa
        //Setto centro ed estensione del parent se esiste
        /*
        if(window.parent.jQuery.plominoMaps.google.map){
             var parentMap = window.parent.jQuery.plominoMaps.google.map;
             var c = parentMap.getCenter()
             map.setCenter(new google.maps.LatLng(c.lat(),c.lng()));
             map.setZoom(parentMap.getZoom());
        }*/
        
        jQuery.plominoMaps.google.map = map;
        map.infowindow = new google.maps.InfoWindow();

        if(jQuery.plominoMaps.drawingManager){
            jQuery.plominoMaps.drawingManager.setMap(map);     
            jQuery('#drawingManagerTools').bind('click',function(){
                  jQuery.plominoMaps.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER)
            });
        }                    

    });

});

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


jQuery.plominoMaps.google.updateMarkerPosition = function(options){
    console.log(jQuery.plominoMaps.google.points);
    var marker = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.points,options.fieldId);
    var position = new google.maps.LatLng(options.pos[0],options.pos[1]);
    
    if(!marker){
         options.editmode = true;
         marker = jQuery.plominoMaps.google.addMarker(options);
    } 
   marker.setPosition(position);
   jQuery.plominoMaps.google.zoomTo(position,options.zoom||18)


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



jQuery.plominoMaps.google.zoomTo =  function(position,zoom){

//SE C'è STRTEETVIEW VADO SU QUELLO
    
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
                      panorama.setVisible(false);
                      jQuery.plominoMaps.google.map.setCenter(position);
                      jQuery.plominoMaps.google.map.setZoom(zoom);
          }
    });

}

//Vale solo x i punti RIVEDERE
jQuery.plominoMaps.google.zoomToObjectXX = function (id,dr){
  var marker = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.points,id);
  if(marker){
     marker.setDraggable(dr);
     marker.map.infowindow.setContent(marker.title);
     marker.map.infowindow.open(marker.map, marker);
  }
}


//Aggiorna la mappa con i dati presenti in una datatable
jQuery.plominoMaps.google.updateMap = function (dataTable){
    var data = dataTable.fnGetData();
     var conf = dataTable.fnSettings().oInit;

console.log(conf)
    jQuery.each(data, function(index, row) { 
       var pos = row[conf.geomIndex];

       if(typeof(pos)=='string') pos = pos.split(" ");
       if(pos.length==2){
            pos[0]=parseFloat(pos[0]);pos[1]=parseFloat(pos[1]);
console.log(pos)
       var options = {
            icon:conf.iconPath + row[conf.iconIndex],
            iconh:null,
            iconw:null,
            dataTable:dataTable,
            editmode:conf.editMode,
            fieldId:row[0],
            //action: options.action,
            rowIndex:index,
            geomIndex:conf.geomIndex,
            latIndex:conf.latIndex,
            lngIndex:conf.lngIndex,
            title:row[conf.titleIndex],
            pos:pos
       }
       jQuery.plominoMaps.google.addMarker(options);
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

  var markerCluster = new MarkerClusterer(jQuery.plominoMaps.google.map, jQuery.plominoMaps.google.points);

console.log(jQuery.plominoMaps);

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
