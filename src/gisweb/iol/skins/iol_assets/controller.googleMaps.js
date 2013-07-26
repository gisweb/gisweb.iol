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
    var currentOverlay;
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

            map.infowindow = new google.maps.InfoWindow(); 
            $.plominoMaps.google.map = map;


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

            if(pluginOptions.drawingTools && pluginOptions.drawingOptions){
               $("[name='"+ pluginOptions.drawingTools +"']").bind('change',function(){
                    $.plominoMaps.google.drawingManager.setOptions(pluginOptions.drawingOptions[$(this).val()])
               });
               $.plominoMaps.google.drawingManager = new google.maps.drawing.DrawingManager({'drawingControl':false});
               $.plominoMaps.google.drawingManager.setMap(map);
               google.maps.event.addListener($.plominoMaps.google.drawingManager, 'overlaycomplete', onOverlayComplete);
               var sGeom = $("#"+fieldId+"_geometry").val();
               if(sGeom){
                   var elementType = $("[name='"+ pluginOptions.drawingTools +"']").attr('value');
                   currentOverlay = $.plominoMaps.addObject(sGeom,pluginOptions.drawingOptions[elementType]); 
                   currentOverlay.editMode = map.editMode;
                   currentOverlay.fieldId = map.getDiv().id;
                   $.plominoMaps.registerObject(currentOverlay);
               }
            }      
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

    function onOverlayComplete(e){
        $.plominoMaps.google.drawingManager.setDrawingMode(null);
        if(currentOverlay){
            currentOverlay.setMap(null);
            delete(currentOverlay)
        }
		currentOverlay = e.overlay;
        currentOverlay.geometryType = e.type;
        currentOverlay.editMode = true;
        currentOverlay.fieldId = $.plominoMaps.google.map.getDiv().id;
        $.plominoMaps.registerObject(currentOverlay);
    }
});


/************************************/

//Dato un oggetto lo trasforma in marker
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

//AGGIORNA I CAMPI DELLE GEOMETRIE
$.plominoMaps.updateGeometryField = function(overlay,message){
   //Aggiorno il campo di posizione
    if(overlay.dataTable){
      //Campo tipo datagrid 
        if($('#' + overlay.fieldId + '_gridvalue').length){
			var field = $('#' + overlay.fieldId + '_gridvalue');
			var field_data = jq.evalJSON(field.val());
			var gridRow = field_data[overlay.rowIndex];

			if(overlay.latIndex){
				gridRow[overlay.latIndex] = overlay.getPosition().lat().toFixed(6)
				overlay.dataTable.fnUpdate(overlay.getPosition().lat().toFixed(6),overlay.rowIndex, overlay.latIndex);
			}
			if(overlay.lngIndex){
				gridRow[overlay.lngIndex] = overlay.getPosition().lng().toFixed(6)
				overlay.dataTable.fnUpdate(overlay.getPosition().lng().toFixed(6),overlay.rowIndex, overlay.lngIndex);

			}

			if(typeof(overlay.geomIndex)!='undefined'){
				if(overlay.geometryType == google.maps.drawing.OverlayType.MARKER)
					gridRow[overlay.geomIndex] = overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
				else
					gridRow[overlay.geomIndex] = overlay.geometryType +';'+google.maps.geometry.encoding.encodePath(overlay.getPath()); 
			}

			field_data[overlay.rowIndex] = gridRow;
			field.val(jq.toJSON(field_data));
		}
	}else{
		var sGeom;
		if(overlay.geometryType == google.maps.drawing.OverlayType.MARKER){
			sGeom = overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
		        //Campi lat e lng se esistono
		        if($("[name^='lat']")) $("[name^='lat']").val(overlay.getPosition().lat().toFixed(6))
		        if($("[name^='lng']")) $("[name^='lng']").val(overlay.getPosition().lng().toFixed(6))
                }
		else
			sGeom = overlay.geometryType +';'+google.maps.geometry.encoding.encodePath(overlay.getPath());
		
		$("#"+ overlay.fieldId + '_geometry').val(sGeom);
                if(message) $("#"+ overlay.fieldId + '_messageinfo').text(message);
	}
 
}

//REGISTRA GLI EVENTI PER TENERE AGGIONATI I CAMPI DELLE GEOMETRIE MODIFICANDO O SPOSTANDO GLI OGGETTI
$.plominoMaps.registerObject = function(overlay){
        var encodeString,infoString;
	if (overlay.geometryType != google.maps.drawing.OverlayType.MARKER) {
		if(overlay.editMode){
			overlay.setEditable(true);
			google.maps.event.addListener(overlay.getPath(), 'set_at', function(index) {
				encodeString = google.maps.geometry.encoding.encodePath(this);
				infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this).toFixed(2);
				if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this).toFixed(2);
				if (encodeString) $.plominoMaps.updateGeometryField(overlay);
			});
			google.maps.event.addListener(overlay.getPath(), 'insert_at', function(index) {
				encodeString = google.maps.geometry.encoding.encodePath(this);
				infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this).toFixed(2);
				if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this).toFixed(2);
				if (encodeString) $.plominoMaps.updateGeometryField(overlay,infoString);
			});
		}

		encodeString = google.maps.geometry.encoding.encodePath(overlay.getPath());
		infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(overlay.getPath()).toFixed(2);
		if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(overlay.getPath()).toFixed(2);
		if (encodeString) $.plominoMaps.updateGeometryField(overlay,infoString);
		
	}
	else{
		if(overlay.editMode){
			overlay.setDraggable(true);
			google.maps.event.addListener(overlay, 'dragend', function() {
                                infoString = 'posizione lat = ' + overlay.getPosition().lat().toFixed(6) + ' lon= ' + overlay.getPosition().lng().toFixed(6);
				$.plominoMaps.updateGeometryField(overlay,infoString);
			})
		}
                //SUI MARKER AGGIUNGO LO ZOOM SU STREETVIEW
                google.maps.event.addListener(overlay,'click', function(){$.plominoMaps.zoomStreetView(overlay.getPosition())})
                infoString = 'posizione lat = ' + overlay.getPosition().lat().toFixed(6) + ' lon= ' + overlay.getPosition().lng().toFixed(6);
		$.plominoMaps.updateGeometryField(overlay,infoString);
	}
}

//AGGIUNGE UN OGGETTO IN MAPPA CREANDO UN NUOVO OVERLAY (LE OPZIONI SONO MEMORIZZATE NEL FIELD DI PLOMINO)
$.plominoMaps.addObject = function(stringGeom,options){
	var overlay,pos;
	var v = stringGeom.split(';');
	if(v[0] == google.maps.drawing.OverlayType.POLYLINE){
		overlay = new google.maps.Polyline(options.polylineOptions||{});
		overlay.setPath(google.maps.geometry.encoding.decodePath(v[1]))
		overlay.geometryType = google.maps.drawing.OverlayType.POLYLINE;
	}
	else if(v[0] == google.maps.drawing.OverlayType.POLYGON){
		overlay = new google.maps.Polygon(options.polygonOptions||{});
		overlay.setPath(google.maps.geometry.encoding.decodePath(v[1]))
		overlay.geometryType = google.maps.drawing.OverlayType.POLYGON;
	}
	else{ 
		overlay = new google.maps.Marker(options.markerOptions||{});
		pos = stringGeom.split(' ');
		overlay.setPosition(new google.maps.LatLng(pos[1],pos[0]))
		overlay.geometryType = google.maps.drawing.OverlayType.MARKER;
	}
	overlay.setMap($.plominoMaps.google.map);
	return overlay;
}

//AGGIORNA LE PROGRESSIVE (????????)
$.plominoMaps.updateProgField = function(overlay){
    if($.plominoMaps.actions["snapto_strada"]) $.plominoMaps.actions["snapto_strada"](overlay)
};


//GESTIONE DI STREETVIEW IN FINESTRA SEPARATA
$.plominoMaps.zoomOnStreetView = function(marker){

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

//var markerCluster = new MarkerClusterer(jQuery.plominoMaps.google.map, jQuery.plominoMaps.google.points);

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