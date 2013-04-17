//TEST CONTROLLER DI PAGINA
jQuery(document).ready(function () {

    jQuery("div[data-plugin='googlemap']").each(function(){
        eval("var options = "  + jQuery(this).data('googlemapOptions'));
        if(options.center) options.center = new google.maps.LatLng(options.center[0],options.center[1]);
        var map = new google.maps.Map(document.getElementById(this.id),options);

        //google.maps.event.addListener(map, 'center_changed', updateMapField);
        //google.maps.event.addListener(map, 'zoom_changed', updateMapField);
        //google.maps.event.addListener(map, 'maptypeid_changed', updateMapField);

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

       // var panorama = new  google.maps.StreetViewPanorama(document.getElementById("streetview"));
       // map.setStreetView(panorama);

        if(jQuery.plominoMaps.drawingManager){
            jQuery.plominoMaps.drawingManager.setMap(map);     
            jQuery('#drawingManagerTools').bind('click',function(){
                  jQuery.plominoMaps.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER)
            });
        }                    

    });



//TESTS

var osmMapType = new google.maps.ImageMapType({
                    getTileUrl: function (coord, zoom) {
                        return "http://tile.openstreetmap.org/" +
		            zoom + "/" + coord.x + "/" + coord.y + ".png";
                    },
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    alt: "OpenStreetMap",
                    name: "OSM",
                    maxZoom: 19
                });
jQuery.plominoMaps.google.map.mapTypes.set('OSM', osmMapType );

wmsMapType = new google.maps.ImageMapType({
            alt: "OpenLayers",
            getTileUrl: WMSGetTileUrl,
            isPng: false,
            maxZoom: 17,
            minZoom: 1,
            name: "OpenLayers",
            url: "http://demo.cubewerx.com/cubewerx/cubeserv.cgi?",
            tileSize: new google.maps.Size(256, 256)

 });
jQuery.plominoMaps.google.map.mapTypes.set('WMS', wmsMapType );

sfondoMapType = new google.maps.ImageMapType({
            alt: "Sfondo",
            getTileUrl: WMSGetTileUrl,
            isPng: false,
            maxZoom: 28,
            minZoom: 1,
            name: "Sfondo",
           // url: " http://iol.provincia.sp.rr.nu/mapcache?PROJECT=siti&MAP=istanze&",
            url: "http://localhost:8080/service?",
            tileSize: new google.maps.Size(256, 256)

 });
jQuery.plominoMaps.google.map.mapTypes.set('SFONDO', sfondoMapType );





        jQuery.plominoMaps.google.map.setOptions({
            mapTypeControlOptions: {
                mapTypeIds: [
		  'OSM',
		  'WMS',
                  'SFONDO',
		   google.maps.MapTypeId.ROADMAP
		],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
        });





});

jQuery.plominoMaps.google.addMarker = function(options){
    if(options.pos){
        var newMarker = new google.maps.Marker({
            icon:options.icon,
            iconh:options.iconh,
            iconw:options.iconw,
            draggable:options.editmode,
            fieldId:options.fieldId,
            action: options.action,
            dataTable:options.dataTable,

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
                  jQuery.plominoMaps.google.zoomTo(newMarker)
                  if(jQuery.plominoMaps.gisclient.map) jQuery.plominoMaps.gisclient.updateMarkerPosition (newMarker)

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
    var marker = jQuery.plominoMaps.getElement(jQuery.plominoMaps.google.points,options.fieldId);
    var position = new google.maps.LatLng(options.pos[0],options.pos[1]);

    if(!marker){
         options.editmode = true;
         marker = jQuery.plominoMaps.google.addMarker(options);
    } 

   marker.setPosition(position);
   jQuery.plominoMaps.google.zoomTo(marker)


}

jQuery.plominoMaps.google.zoomTo =  function(marker){

      //SE C'è STRTEETVIEW VADO SU QUELLO
       var svClient = new google.maps.StreetViewService();
       var panorama = jQuery.plominoMaps.google.map.getStreetView();
      /*
        if(panorama.marker){
            panorama.marker.setPosition(marker.position)
       }
       else{
             panorama.marker = new google.maps.Marker({position:marker.position,map:panorama,icon:marker.icon});
       }
*/
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

           } else {
                      panorama.setVisible(false);

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

    jQuery.each(data, function(index, row) { 
       var pos = row[conf.geomIndex];
       if(typeof(pos)=='string') pos = eval(pos);
       var options = {
            icon:conf.iconPath + row[conf.iconIndex],
            iconh:null,
            iconw:null,
            dataTable:dataTable,
            editmode:conf.editMode,
            fieldId:conf.fieldId,
            //action: options.action,
            rowIndex:index,
            geomIndex:conf.geomIndex,
            latIndex:conf.latIndex,
            lngIndex:conf.lngIndex,
            title:row[conf.titleIndex],
            pos:pos
       }

       jQuery.plominoMaps.google.addMarker(options);








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


console.log('#'+this.getDiv().id+'_settings')


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
      var projection = jQuery.plominoMaps.google.map.getProjection();
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