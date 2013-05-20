$(document).ready(function() {
    
	var options = {
		'punto_cantiere':{drawingMode:'marker',drawingControlOptions:{drawingModes:['marker']},markerOptions:{icon:'../resources/icons/cantiere.png',	title:'questo cantiere??'}},
		'punto_scavo':{drawingMode:'marker',drawingControlOptions:{drawingModes:['marker']},markerOptions:{icon:'../resources/icons/scavo.png',	title:'questo scavo??'}},
		'linea_scavo':{drawingMode:'polyline',drawingControlOptions:{drawingModes:['polyline']},polylineOptions:{strokeColor:'#00FFFF',strokeOpacity: 1.0,strokeWeight: 2}},
		'area_cantiere':{drawingMode:'polygon',drawingControlOptions:{drawingModes:['polygon']},polygonOptions:{strokeColor:'#00FFFF',strokeOpacity: 1.0,strokeWeight: 2}}
	}
	var elTipo = $('#elemento_tipo');
	var elGeom = $('#elemento_geom');
	
	var tipo = elTipo.attr('value');
	var geom = elGeom.val();
	var editMode = elGeom.data('editMode')==1;
	var type,overlay,currentOverlay;
	if (tipo && geom){
		options[tipo].drawingMode = null;
		switch(tipo){
			case 'punto_cantiere':
			case 'punto_scavo':
				var v = geom.split(' ');
				overlay = new google.maps.Marker(options[tipo].markerOptions);
				overlay.setPosition(new google.maps.LatLng(v[0],v[1]));
				type = google.maps.drawing.OverlayType.MARKER;
				$.plominoMaps.google.map.setZoom(16);
				$.plominoMaps.google.map.setCenter(overlay.getPosition());
				console.log(overlay)
				break;
			case 'linea_scavo':
				overlay = new google.maps.Polyline(options[tipo].polylineOptions);
				overlay.setPath(google.maps.geometry.encoding.decodePath(geom));
				type = google.maps.drawing.OverlayType.POLYLINE;
				$.plominoMaps.google.map.fitBounds(overlay.getBounds())
				break;
			case 'area_cantiere':
				overlay = new google.maps.Polygon(options[tipo].polygonOptions);
				overlay.setPath(google.maps.geometry.encoding.decodePath(geom));
				type = google.maps.drawing.OverlayType.POLYGON;
				$.plominoMaps.google.map.fitBounds(overlay.getBounds())
				break;	  
		}
		overlay.setMap($.plominoMaps.google.map);
		onGeometryAdd({'type':type,'overlay':overlay})
	}

	if(editMode){
		var drawingManager = new google.maps.drawing.DrawingManager(options[tipo])
		drawingManager.setMap($.plominoMaps.google.map);
		elTipo.bind('change',function(){drawingManager.setOptions(options[$(this).val()])})
		google.maps.event.addListener(drawingManager, 'overlaycomplete', onGeometryAdd);
	}
	
	function onGeometryAdd(e) {

		if(drawingManager) drawingManager.setDrawingMode(null);// Switch back to non-drawing mode after drawing a shape.
		if(currentOverlay) currentOverlay.setMap(null);//Lascio solo 1 overlay sulla mappa
		currentOverlay = e.overlay;
		
		if (e.type != google.maps.drawing.OverlayType.MARKER) {
			google.maps.event.addListener(currentOverlay.getPath(), 'set_at', function(index) {
				var encodeString = google.maps.geometry.encoding.encodePath(this);
				var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this);
				if (e.type == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this);
				if (encodeString) setGeometryValue(encodeString,infoString);
			});
			google.maps.event.addListener(currentOverlay.getPath(), 'insert_at', function(index) {
				var encodeString = google.maps.geometry.encoding.encodePath(this);
				var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this);
				if (e.type == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this);
				if (encodeString) setGeometryValue(encodeString,infoString);
			});
			currentOverlay.setEditable(editMode);
			var encodeString = google.maps.geometry.encoding.encodePath(currentOverlay.getPath());
			var infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(currentOverlay.getPath());
			if (e.type == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(currentOverlay.getPath());
			if (encodeString) setGeometryValue(encodeString,infoString);	
	    }
		else{
			google.maps.event.addListener(currentOverlay, 'dragend', function() {
				setGeometryValue(currentOverlay.getPosition().lat()+' '+currentOverlay.getPosition().lng(),'posizione: lat=' + currentOverlay.getPosition().lat().toFixed(3) + ', lng=' + currentOverlay.getPosition().lng().toFixed(3));
			})
			currentOverlay.setDraggable(editMode);		
			setGeometryValue(currentOverlay.getPosition().lat()+' '+currentOverlay.getPosition().lng(),'posizione: lat=' + currentOverlay.getPosition().lat().toFixed(3) + ', lng=' + currentOverlay.getPosition().lng().toFixed(3));
		}
	} 
	
	function setGeometryValue(geomValue,infoValue){
		elGeom.val(geomValue);
		$('#'+$.plominoMaps.google.map.getDiv().id+'_info').html(infoValue)
	}
});