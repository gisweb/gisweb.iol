$(document).ready(function() {
    
	var drawingManager,currentOverlay;

	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: 'marker',
		drawingControlOptions: {
			drawingModes: ['marker']
		},
		markerOptions: {
			icon:'../resources/icons/cantiere.png',
			title:'questo cantiere??',
			draggable: true
		},
		map: $.plominoMaps.google.map
	});

	
	$("#elemento_tipo").bind('change',onselectTools)
	
	function onselectTools(){
	
		var tipo = $(this).val();
		var options;
		console.log(tipo)
		
		if(tipo=='punto_scavo'){
			options={
				drawingMode: google.maps.drawing.OverlayType.MARKER,
				drawingControlOptions: {drawingModes: ['marker']},
				markerOptions: {
					icon:'../resources/icons/scavo.png',
					title:'questo scavo??',
					draggable: true
				}
			}
		}
		if(tipo=='punto_cantiere'){
			options={
				drawingMode: google.maps.drawing.OverlayType.MARKER,
				drawingControlOptions: {drawingModes: ['marker']},
				markerOptions: {
					icon:'../resources/icons/cantiere.png',
					title:'questo scavo??',
					draggable: true
				}
			}
		}
		if(tipo=='linea'){
			options={
				drawingMode: google.maps.drawing.OverlayType.POLYLINE,
				drawingControlOptions: {drawingModes: ['polyline']},
				polylineOptions: {
					editable: true
				}
			}
		}
		if(tipo=='area_cantiere'){
			options={
				drawingMode: google.maps.drawing.OverlayType.POLYGON,
				drawingControlOptions: {drawingModes: ['polygon']},
				polygonOptions: {
					editable: true
				}
			}
		}
		
		drawingManager.setOptions(options) 
		
		
	
	}

	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {

		drawingManager.setDrawingMode(null);
		if(currentOverlay) currentOverlay.setMap(null);
		currentOverlay = e.overlay;
		
		
		if (e.type != google.maps.drawing.OverlayType.MARKER) {
		// Switch back to non-drawing mode after drawing a shape.
		
			google.maps.event.addListener(currentOverlay.getPath(), 'set_at', function(index) {
				var encodeString = google.maps.geometry.encoding.encodePath(this);
				if (encodeString) {
					$('#map_geometry').val(encodeString);
					$('#'+$.plominoMaps.google.map.getDiv().id+'_info').html('misura: ' + google.maps.geometry.spherical.computeLength(this))
				}
			});
			google.maps.event.addListener(currentOverlay.getPath(), 'insert_at', function(index) {
			console.log(index)
				var encodeString = google.maps.geometry.encoding.encodePath(this);
				if (encodeString) {
					$('#map_geometry').val(encodeString);
					$('#'+$.plominoMaps.google.map.getDiv().id+'_info').html('misura: ' + google.maps.geometry.spherical.computeLength(this))
				}
			});

			var encodeString = google.maps.geometry.encoding.encodePath(currentOverlay.getPath());
			if (encodeString) {
			    $('#map_geometry').val(encodeString);
				$('#'+$.plominoMaps.google.map.getDiv().id+'_info').html('misura: ' + google.maps.geometry.spherical.computeLength(currentOverlay.getPath()))
			}
			

	    }
		else{
			var newMarker = e.overlay;
			console.log(newMarker.getPosition().toString())
			geom = newMarker.getPosition().toString();
					
		}


	});
	
	
	
	
	
	
	
});