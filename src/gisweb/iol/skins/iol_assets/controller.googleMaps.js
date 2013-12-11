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
            if(!$(this).height()) $(this).height(400);//QUANDO MANCA IL FILE RESOURCES.CSS
            pluginOptions.map["zoomControlOptions"] = {"style":google.maps.ZoomControlStyle.LARGE};
            var map = new google.maps.Map(document.getElementById(this.id),pluginOptions.map);
            map.initSettings = pluginOptions.map;
            map.editMode = $(this).data("editMode")==1;
            var fieldId = this.id;
            
           // google.maps.event.addListener(map, 'center_changed', updateMapField);
           // google.maps.event.addListener(map, 'zoom_changed', updateMapField);
           // google.maps.event.addListener(map, 'maptypeid_changed', updateMapField);

            google.maps.event.addListener(map, 'mousemove', onMouseMove);

            /*
            if(window.parent.$.plominoMaps.google.map){
               var parentMap = window.parent.$.plominoMaps.google.map;
               var c = parentMap.getCenter()
               map.setCenter(new google.maps.LatLng(c.lat(),c.lng()));
               map.setZoom(parentMap.getZoom());
            }*/

            //if(document.getElementById(fieldId+"_streetview")){
                //jq("#"+fieldId+"_streetview").height(300);
                //var panorama = new  google.maps.StreetViewPanorama(document.getElementById(fieldId+"_streetview"));
                //map.setStreetView(panorama);
            //}

			if($("#"+map.getDiv().id+"_streetview").get(0)){
                $("#"+map.getDiv().id+"_streetview").height($(this).height());
            }

             if(typeof(pluginOptions.drawingManager) == 'object'){               
                   $.plominoMaps.google.drawingManager = new google.maps.drawing.DrawingManager(pluginOptions.drawingManager);
                   $.plominoMaps.google.drawingManager.setMap(map);
                   google.maps.event.addListener($.plominoMaps.google.drawingManager, 'overlaycomplete', onOverlayComplete);
             } 

            if(pluginOptions.drawingTools && pluginOptions.drawingOptions){
               $("[name='"+ pluginOptions.drawingTools +"']").bind('change',function(){
                    var value = $(this).val();
                    if($(this).is("input") && !$(this).is("input:checked")) value="empty";
                    $.plominoMaps.google.drawingManager.setOptions(pluginOptions.drawingOptions[value])
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

            map.infowindow = new google.maps.InfoWindow(); 
            $.plominoMaps.google.infowindow = new google.maps.InfoWindow(); 
            $.plominoMaps.google.map = map;

     });


  //GENERAZIONE DEI CONTROLLI GEOCODE NUOVI
   $(".geocode-plugin").each(function(){
        if(typeof($(this).data("pluginOptions"))!="object") return;
        var pluginOptions = $(this).data("pluginOptions");
        //pluginOptions.geometryField = $("#"+this.id + '_geometry');  
        pluginOptions.fieldId= this.id;  
        pluginOptions.editMode = $(this).data("editMode")==1;
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;

	if($(this).is('a')) $(this).bind('click',pluginOptions,$.plominoMaps.actions[pluginOptions.action]);
	if($(this).is('img')) $(this).attr('src',pluginOptions.icon);
	if($(this).data("coord")){
            var v = $(this).data("coord").split(' ');console.log(pluginOptions)
            var position = new google.maps.LatLng(parseFloat(v[1]),parseFloat(v[0]));
            $.plominoMaps.updateMarkerPosition(pluginOptions ,position);
	}
    });


  //PLUGIN COORDINATE
   $(".coordinata-plugin").each(function(){
        if(typeof($(this).data('pluginOptions'))!='object') return;
        var pluginOptions = $(this).data('pluginOptions');
        pluginOptions.editMode = $(this).data("editMode")==1;
        pluginOptions.isProg = true;
        pluginOptions.fieldId = this.id;

        //pluginOptions.geometryField = $("#"+this.id + '_geometry');
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;
        $("[name='"+this.id+"_icon']").attr('src',pluginOptions.icon);

        $(this).prev().bind('click',pluginOptions,function(){
             $.plominoMaps.google.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        });
        $(this).next().bind('click',pluginOptions,function(){
            var value = $(this).prev().val();
            if(value){
                value = value.replace(/\s{1,}/g, ' ');
                var coords = value.split(' ');
                var x = parseFloat(coords[0]);
                var y = parseFloat(coords[1]);
                var source = new Proj4js.Proj('EPSG:3003');  
                var dest = new Proj4js.Proj('EPSG:4326');
                var p = new Proj4js.Point(x,y);  
                Proj4js.transform(source, dest, p); 
                var position = new google.maps.LatLng(p.y,p.x);
                if(currentOverlay){
                    currentOverlay.setMap(null);
                    delete(currentOverlay)
                }

                currentOverlay = $.plominoMaps.updateMarkerPosition(pluginOptions,position);
                currentOverlay.setMap($.plominoMaps.google.map);
           } 

       });
       $(this).bind('blur',function(){ if(!$(this).val()) $("#"+this.id + '_geometry').val('') })

       if($(this).data("coord")){
            var v = $(this).data("coord").split(' ');
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

        //pluginOptions.geometryField = $("#"+this.id + '_geometry');
        pluginOptions.fieldId = this.id;
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;
        $("[name='"+this.id+"_icon']").attr('src',pluginOptions.icon);

        $(this).prev().bind('click',pluginOptions,$.plominoMaps.actions[pluginOptions.action]);
        $(this).next().bind('click',pluginOptions,$.plominoMaps.actions[pluginOptions.action]);
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
        //pluginOptions.geometryField = $("#"+this.id + '_geometry');
        if(pluginOptions.icon) pluginOptions.icon = $(this).data("iconPath") + pluginOptions.icon;
        $("[name='"+this.id+"_icon']").attr('src',pluginOptions.icon);

        $(this).next().bind('click',pluginOptions,$.plominoMaps.actions[pluginOptions.action]);
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
        currentOverlay.fieldId = currentOverlay.fieldId || $.plominoMaps.google.map.getDiv().id;
        $.plominoMaps.registerObject(currentOverlay);
    }


    function onMouseMove(e){
         var position = 'Long: ' + e.latLng.lng().toFixed(6) + ' Lat: ' + e.latLng.lat().toFixed(6);
         if($.plominoMaps.google.map.initSettings.coordsrid && Proj4js.defs['EPSG:'+$.plominoMaps.google.map.initSettings.coordsrid]){
              var source = new Proj4js.Proj('EPSG:4326');
              var dest = new Proj4js.Proj('EPSG:'+$.plominoMaps.google.map.initSettings.coordsrid);  
              var p = new Proj4js.Point(e.latLng.lng(),e.latLng.lat());  
              Proj4js.transform(source, dest, p); 
              position = position + ' - X: ' + p.x.toFixed(2) + ' Y: ' + p.y.toFixed(2);
         }

         $("#"+$.plominoMaps.google.map.getDiv().id+"_messageinfo").text(position) ;


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
        marker.geometryType = google.maps.drawing.OverlayType.MARKER;
        google.maps.event.addListener(marker, 'dragend', function() {$.plominoMaps.updateGeometryField(marker);marker.isProg && $.plominoMaps.updateProgField(marker);});
        google.maps.event.addListener(marker, 'click', function() {$.plominoMaps.zoomOnStreetView (marker)});
        $.plominoMaps.google.markers[fieldId] = marker;
    }
    marker.setPosition(position);
    if(typeof(marker.panoMarker)!='undefined') marker.panoMarker.setPosition(position)
    $.plominoMaps.updateGeometryField(marker);
    $.plominoMaps.google.map.setCenter(position);
    $.plominoMaps.google.map.setZoom(Math.min(options.zoom,18)||Math.min($.plominoMaps.google.map.getZoom(),18));
    return marker;
}


e
    }


});

//AGGIORNA I CAMPI DELLE GEOMETRIE
$.plominoMaps.updateGeometryField_NEW = function(overlay,message){
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
                        if(message) $("#"+ overlay.fieldId + '_messageinfo').text(message);

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
				if (encodeString) $.plominoMaps.updateGeometryField_NEW(overlay);
			});
			google.maps.event.addListener(overlay.getPath(), 'insert_at', function(index) {
				encodeString = google.maps.geometry.encoding.encodePath(this);
				infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this).toFixed(2);
				if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this).toFixed(2);
				if (encodeString) $.plominoMaps.updateGeometryField_NEW(overlay,infoString);
			});
		}

		encodeString = google.maps.geometry.encoding.encodePath(overlay.getPath());
		infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(overlay.getPath()).toFixed(2);
		if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(overlay.getPath()).toFixed(2);
		if (encodeString) $.plominoMaps.updateGeometryField_NEW(overlay,infoString);
		
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
if(!options) return;
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
    //STRINGA DI COORDINATE
	else if(v[0] == "coords"){
		overlay = new google.maps.Polygon(options.polygonOptions||{});
		overlay.setPath(getPathFromCoord(v[1]));
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

function getPathFromCoord(sCoord){
if(!sCoord) return '';
   var v = sCoord.split(",");
   var path = [];
   for(i=0;i<v.length;i++){
       path.push(new google.maps.LatLng(v[i],v[i+1]));
       i++;
   }

   return path

}




//AGGIORNA LE PROGRESSIVE (????????)
$.plominoMaps.updateProgField = function(overlay){
    if($.plominoMaps.actions["snapto_strada"]) $.plominoMaps.actions["snapto_strada"](overlay)
};


//GESTIONE DI STREETVIEW IN FINESTRA SEPARATA
$.plominoMaps.zoomOnStreetView_NEW = function(marker){

    var panorama;
    var map = marker.map;
    var sViewContainer = jq("#"+map.getDiv().id+"_streetview").get(0);
    
    if(!sViewContainer){
		switchtoStreetView(marker.getPosition());
		return;
	}

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

function switchtoStreetView (position){

     //SE C'è STRTEETVIEW VADO SU QUELLO SENZA AGGIUNGERE MARKERS
    
       var svClient = new google.maps.StreetViewService();
       svClient.getPanoramaByLocation(position, 50,function (panoData, status) {
       var panorama = $.plominoMaps.google.map.getStreetView();
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










$.plominoMaps.updateGeometryField = function(marker){


   //Aggiorno il campo di posizione

    if(marker.dataTable){
      //Campo tipo datagrid 
        var v = marker.fieldId.split('|');
        var fieldId = v[0];
        if($('#' + fieldId + '_gridvalue').length){
           var field = $('#' + fieldId + '_gridvalue');
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
          field.val(jq.toJSON(field_data)).change();
      }
  }else{
      $("#"+ marker.fieldId + '_geometry').val(marker.getPosition().lng().toFixed(6)+" "+marker.getPosition().lat().toFixed(6)).change();
      //Campi lat e lng se esistono
     // if($("[name^='lat']")) $("[name^='lat']").val(marker.getPosition().lat().toFixed(6))
     // if($("[name^='lng']")) $("[name^='lng']").val(marker.getPosition().lng().toFixed(6))
  }
 
}

$.plominoMaps.updateProgField = function(marker){

    if($.plominoMaps.actions["snapto_strada"])$.plominoMaps.actions["snapto_strada"](marker)


};

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

//Aggiorna la mappa con i dati presenti in una datatable
$.plominoMaps.google.updateMap = function (dataTable){
     var data = dataTable.fnGetData();
     var conf = dataTable.fnSettings().oInit;

    $.each(data, function(index, row) { 
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
         $.plominoMaps.google.addEncodedGeometry(options);

     }









   });

  //var markerCluster = new MarkerClusterer($.plominoMaps.google.map, $.plominoMaps.google.points);


}




























$.plominoMaps.google.addMarker = function(options){

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
            map:$.plominoMaps.google.map
        });

        if(options.dataTable){
              google.maps.event.addListener(newMarker, 'click', function() {
                 datagrid_deselect_rows(newMarker.dataTable);
                 $(newMarker.dataTable.fnGetNodes()[newMarker.rowIndex]).addClass('datagrid_row_selected');

              }); 
        };

        if (options.editmode) {
            google.maps.event.addListener(newMarker, 'dragend', function() {
                  newMarker.pos = [newMarker.position.lat(),newMarker.position.lng()];
                  $.plominoMaps.updateGeometryField(newMarker)
                  
                  //Se c'è anche gisclient allineo il marker su gc

                 //if($.plominoMaps.gisclient.map)$.plominoMaps.updateMarkerPosition(newMarker);
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
        $.plominoMaps.google.points.push(newMarker);
        return newMarker;
    }
}

$.plominoMaps.google.removeMarker = function(id){
  var marker = $.plominoMaps.getElement($.plominoMaps.google.points,id);
  marker.setMap(null)
  $.plominoMaps.google.points.splice(id,1);
}




$.plominoMaps.google.addEncodedGeometry = function(options){

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
         if(options.geomType=='line')$.plominoMaps.google.lines.push(overlay)
         if(options.geomType=='polygon')$.plominoMaps.google.polygons.push(overlay)

         
    }
}

//Trova un elemento di geometria dato un indice
$.plominoMaps.getElement = function(list,idx){
   if(typeof(idx)=='string')
        for (i=0;i<list.length;i++){
              if(list[i].fieldId==idx) return list[i]
        }
   if(typeof(list[idx])!='undefined') 
       return list[idx]
   return false
}







$.plominoMaps.google.getOverlay =  function(id){
  var el=false;
  el = $.plominoMaps.getElement($.plominoMaps.google.points,id);
  if (el) return el;
  el = $.plominoMaps.getElement($.plominoMaps.google.lines,id);
  if (el) return el;
  el = $.plominoMaps.getElement($.plominoMaps.google.polygons,id);
  if (el) return el;
  return el;
}

$.plominoMaps.google.zoomTozzzz =  function(marker){

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
       $.plominoMaps.google.map.setCenter(marker.position);
       $.plominoMaps.google.map.setZoom(16);
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


$.plominoMaps.google.zoomToxxxxxx =  function(position,zoom){

//SE C'è STRTEETVIEW VADO SU QUELLO
    
       var svClient = new google.maps.StreetViewService();
       svClient.getPanoramaByLocation(position, 50,function (panoData, status) {
       var panorama = $.plominoMaps.google.map.getStreetView();












           if (status == google.maps.StreetViewStatus.OK) {
                   
                    /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
                     
                    var panoCenter = panoData.location.latLng;//trovo la posizione del frame
                     var heading = google.maps.geometry.spherical.computeHeading(panoCenter, position);//calcolo heading con la differenza


                       
                       panorama.setPosition(position);
                       panorama.setPov({heading:heading , pitch:-30, zoom:0});
                       panorama.setVisible(true);


           } else {
                      panorama.setVisible(false);
                      $.plominoMaps.google.map.setCenter(position);
                      $.plominoMaps.google.map.setZoom(zoom);

          }
    });

}


//Vale solo x i punti RIVEDERE
$.plominoMaps.google.zoomToObjectXX = function (id,dr){
  var marker = $.plominoMaps.getElement($.plominoMaps.google.points,id);
  if(marker){
     marker.setDraggable(dr);
     marker.map.infowindow.setContent(marker.title);
     marker.map.infowindow.open(marker.map, marker);
  }
}



function clearMap(type){
   var list = $.plominoMaps[type];
   for (i=0;i<list.length;i++){
        list[i].setMap(null) 
   }
}





//Funzione che aggiorna il campo con la configurazione della mappa
function updateMapField(){


//console.log('#'+this.getDiv().id+'_settings')


      var v = $('#'+this.getDiv().id+'_settings').val();
      if(v)
           v = $.evalJSON(v) 
      else
           v={};
      v.zoom=this.getZoom();
      v.center=[this.getCenter().lat(),this.getCenter().lng()];
      v.mapTypeId=this.getMapTypeId();
//console.log($.toJSON(v))
      $('#'+this.getDiv().id+'_settings').val($.toJSON(v));

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
$.ajax({
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
    var map=$.plominoMaps.google.map;
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
      var baseURL = this.url;
      if(jq("[name='ubicazione_strada_elenco']").val()) 
           baseURL = this.url + "&GCFILTERS=grafo.archi@cod_stra='" + jq("[name='ubicazione_strada_elenco']").val() +"'";

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

  function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    // tile range in one direction
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc.
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
      return null;
    }

    // repeat accross x-axis
    if (x < 0 || x >= tileRange) {
      x = (x % tileRange + tileRange) % tileRange;
    }

    return { x: x, y: y };
  }

  
$.plominoMaps.actions["geocode_address"] = function (e){
        var options = e.data;
	var address='';
        var txt;
	$.each(options.fieldlist, function(index, fieldId) { 
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
  
$.plominoMaps.actions["geocode_point"] = function (e){

         if(!drawingManager) return;
         drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
         drawingManager.markerOptions = e.data;

         jq("#gMapMessage").addClass("alert-error");
         jq("#gMapMessage").text(e.data.message);



}


$.plominoMaps.actions["geocode_catasto"] = function (e){
        var options = e.data;
        var dataParams = getValuesForFields(options.params)
	$.ajax({
                'url':'services/xSuggest',
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