jq(document).ready(function() {

      var drawingManager;
      var selectedShape;
      var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
      var selectedColor;
      var colorButtons = {};


        var polyOptions = {
          strokeWeight: 0,
          fillOpacity: 0.45,
          editable: true
        };

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
        //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          selectedShape.setMap(null);
        }
      }


var map=jq.plominoMaps.gMap;


        // Creates a drawing manager attached to the map that allows the user to draw
        // markers, lines, and shapes.
        drawingManager = new google.maps.drawing.DrawingManager({


           drawingControl: true,
          drawingControlOptions: {position: google.maps.ControlPosition.TOP_CENTER,drawingModes: [google.maps.drawing.OverlayType.MARKER,
      google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON,google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.RECTANGLE ],
          
          markerOptions: {
            draggable: true
          },
          polylineOptions: {
            editable: true
          },
          rectangleOptions: polyOptions,
          circleOptions: polyOptions,
          polygonOptions: polyOptions,
          map: map
        });
         

				    console.log(drawingManager)

					google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {


                        drawingManager.setDrawingMode(null);

                        if (e.type != google.maps.drawing.OverlayType.MARKER) {
                        // Switch back to non-drawing mode after drawing a shape.
                        
            
                        // Add an event listener that selects the newly-drawn shape when the user
                        // mouses down on it.
                        var newShape = e.overlay;
                        newShape.type = e.type;
                        google.maps.event.addListener(newShape, 'click', function() {
                          setSelection(newShape);
                        });



                 google.maps.event.addListener(newShape, 'capturing_changed', function() {


                            if(!newShape.capturing) console.log(newShape.getPath().getArray().toString())


                        });



                        setSelection(newShape);
                        console.log(newShape.getPath().getArray().toString())
                        geom = newShape.getPath().getArray().toString();


                      }
                        else{
                             var newMarker = e.overlay;
                             console.log(newMarker.getPosition().toString())
                             geom = newMarker.getPosition().toString();
                                
                        }


        		} );

                google.maps.event.addListener(map, 'click', function(e) {

                       console.log(e)
               
 
                })



});