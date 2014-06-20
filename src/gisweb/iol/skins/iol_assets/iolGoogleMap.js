(function ( $ ) {



    var svClient = new google.maps.StreetViewService;
    var svGeocoder = new google.maps.Geocoder();
    google.maps.iolMarkers = {};
    google.maps.iolMaps = {};




    $.fn.iolGoogleMap = function( options ) {

        var mapOverlays = [];

        console.log( $(this.selector) )
        var self;

        options = $.extend({
            test: 'Test'
        }, options);


        $.fn.iolGoogleMap.method = function(text) {
            return '<strong>' + text + '</strong>';
        };

        $.fn.iolGoogleMap.getMap = function(index) {
            return google.maps.iolMaps[index];
        };


        $.fn.iolGoogleMap.addGeometry = function(geometryOptions) {

            return ;

        };
        $.fn.iolGoogleMap.addMarker = function(mapName, markerOptions) {

            //createOverlay('sdfsdf','sdfsdf')
            console.log(markerOptions)
            console.log(mapName)




            
        };
        $.fn.iolGoogleMap.registerObject = function(overlay){
            registerObject(overlay)
        }
        $.fn.iolGoogleMap.updateGeometryField = function(overlay){
            updateGeometryField(overlay)
        }
        $.fn.iolGoogleMap.zoomOnStreetView = function(marker){
            zoomOnStreetView(marker)
        }         

        $.fn.iolGoogleMap.settings = options;

        //AGGIUNGE UN OGGETTO IN MAPPA CREANDO UN NUOVO OVERLAY (LE OPZIONI SONO MEMORIZZATE NEL FIELD DI PLOMINO)
        var createOverlay = function  (stringGeom,options){
            if(!options) return;
            var overlay,pos;
            var v = stringGeom.split(';');
            var elementType = v[0];
            var geometryType = v[1];
            var sGeom = v[2];

            if(geometryType == "point"){ 
                overlay = new google.maps.Marker(options.markerOptions||{});
                pos = sGeom.split(' ');
                overlay.setPosition(new google.maps.LatLng(pos[1],pos[0]))
                overlay.geometryType = geometryType;
            }
            else if(geometryType == google.maps.drawing.OverlayType.POLYLINE){
                overlay = new google.maps.Polyline(options.polylineOptions||{});
                overlay.setPath(google.maps.geometry.encoding.decodePath(sGeom))
                overlay.geometryType = google.maps.drawing.OverlayType.POLYLINE;
            }
            else if(geometryType == google.maps.drawing.OverlayType.POLYGON){
                overlay = new google.maps.Polygon(options.polygonOptions||{});
                overlay.setPath(google.maps.geometry.encoding.decodePath(sGeom))
                overlay.geometryType = google.maps.drawing.OverlayType.POLYGON;
            }
            //STRINGA DI COORDINATE
            else if(geometryType == "coords"){
                overlay = new google.maps.Polygon(options.polygonOptions||{});
                overlay.setPath(getPathFromCoord(sGeom));
                overlay.geometryType = google.maps.drawing.OverlayType.POLYGON;
            }
            overlay.elementType = elementType;
            return overlay;
        }

        //REGISTRA GLI EVENTI PER TENERE AGGIONATI I CAMPI DELLE GEOMETRIE MODIFICANDO O SPOSTANDO GLI OGGETTI
        var registerObject = function (overlay){
            var encodeString,infoString;
            
            if (overlay.geometryType != "marker" && overlay.geometryType != "point") {
                if(overlay.editMode){
                    overlay.setEditable(true);
                    google.maps.event.addListener(overlay.getPath(), 'set_at', function(index) {
                        encodeString = google.maps.geometry.encoding.encodePath(this);
                        infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this).toFixed(2);
                        if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this).toFixed(2);
                        if (encodeString) updateGeometryField(overlay);
                    });
                    google.maps.event.addListener(overlay.getPath(), 'insert_at', function(index) {
                        encodeString = google.maps.geometry.encoding.encodePath(this);
                        infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(this).toFixed(2);
                        if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(this).toFixed(2);
                        if (encodeString) updateGeometryField(overlay,infoString);
                    });
                }

                encodeString = google.maps.geometry.encoding.encodePath(overlay.getPath());
                infoString = 'lunghezza: ' + google.maps.geometry.spherical.computeLength(overlay.getPath()).toFixed(2);
                if (overlay.geometryType == google.maps.drawing.OverlayType.POLYGON) infoString += ', superficie: ' + google.maps.geometry.spherical.computeArea(overlay.getPath()).toFixed(2);
                if (encodeString) updateGeometryField(overlay,infoString);
                
            }
            else{
                if(overlay.editMode){
                    overlay.setDraggable(true);
                    google.maps.event.addListener(overlay, 'dragend', function() {
                        infoString = 'posizione lat = ' + overlay.getPosition().lat().toFixed(6) + ' lon= ' + overlay.getPosition().lng().toFixed(6);
                        updateGeometryField(overlay,infoString);
                    })
                }
                //SUI MARKER AGGIUNGO LO ZOOM SU STREETVIEW
                google.maps.event.addListener(overlay,'click', function(){zoomOnStreetView(overlay)})
                infoString = 'posizione lat = ' + overlay.getPosition().lat().toFixed(6) + ' lon= ' + overlay.getPosition().lng().toFixed(6);
                updateGeometryField(overlay,infoString);
            }
        }
        //AGGIORNA I CAMPI DELLE GEOMETRIE
        var updateGeometryField = function (overlay){
           //Aggiorno il campo di posizione
            if(overlay.dataTable){
              //Campo tipo datagrid 
                if($('#' + overlay.fieldId + '_gridvalue').length){
                    var field = $('#' + overlay.fieldId + '_gridvalue');
                    var field_data = $.evalJSON(field.val());
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
                    field.val($.toJSON(field_data));

                }
            }else{
                var sGeom;
                if(overlay.geometryType == "point"){
                    sGeom = overlay.elementType + ';' + overlay.geometryType + ';' + overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
                }
                else if(overlay.geometryType == google.maps.drawing.OverlayType.MARKER){
                    sGeom = overlay.getPosition().lng().toFixed(6) + " " + overlay.getPosition().lat().toFixed(6);
                    //Campi lat e lng se esistono
                    if($("[name^='lat']")) $("[name^='lat']").val(overlay.getPosition().lat().toFixed(6))
                    if($("[name^='lng']")) $("[name^='lng']").val(overlay.getPosition().lng().toFixed(6))
                }
                else
                    sGeom = overlay.elementType + ';' + overlay.geometryType + ';' + google.maps.geometry.encoding.encodePath(overlay.getPath());

                $("#"+ overlay.fieldId).val(sGeom);
                //$("#"+ overlay.fieldId + '_geometry').val(sGeom);
                //$element.val(sGeom);
                //if(message) $("#" + $element.attr('id') + '_info').text(message);
            }
         
        }



        //GESTIONE DI STREETVIEW IN FINESTRA SEPARATA
        var zoomOnStreetView = function (marker){

            var panorama;

            console.log(marker)

            var sViewContainer = $("#" + marker.fieldId + "_streetview").get(0);
            
            if(!sViewContainer){
                //switchtoStreetView(marker.getPosition());
                return;
            }

            if(!$(sViewContainer).height()) $(sViewContainer).height(300);//QUANDO MANCA IL FILE RESOURCES.CSS

            if(!panorama){
                panorama= new  google.maps.StreetViewPanorama(sViewContainer);
                marker.map.setStreetView(panorama);
            }
            svClient.getPanoramaByLocation(marker.getPosition(),50,function (panoData, status) {

                if (status == google.maps.StreetViewStatus.OK) {
                    /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
                    console.log(status)
                    var position = marker.getPosition();     
                    if(typeof(marker.panoMarker)=='undefined'){
                       marker.panoMarker = new google.maps.Marker({
                          map:panorama,
                          icon:marker.getIcon(),
                          position:position,
                          draggable:true});
                       google.maps.event.addListener(marker.panoMarker, 'dragend', function() {
                              marker.setPosition(marker.panoMarker.getPosition())
                              updateGeometryField(marker);
                              marker.isProg && updateProgField(marker);
                       });
                       google.maps.event.addListener(marker, 'dragend', function() {
                              marker.panoMarker.setPosition(marker.getPosition());
                       });
                    }
                    var panoCenter = panoData.location.latLng;//trovo la posizione del frame
                    var heading = google.maps.geometry.spherical.computeHeading(panoCenter, position);//calcolo heading con la differenza
                    panorama.setPosition(position);
                    panorama.setPov({heading:heading , pitch:-15, zoom:0});
                    $(sViewContainer).show()
                    $(".no-streetview").addClass('hidden');
                    $(sViewContainer).removeClass('hidden');

                } else {
                    $(sViewContainer).hide()
                    $(sViewContainer).addClass('hidden');
                    $(".no-streetview").removeClass('hidden');
                    console.log('no streetview')
                }
           });
        }

        return this.each(function() {

            var $element = $( this );
            var mapOptions = options.pluginOptions || {};
            var baseUrl = options.baseUrl;
            var editMode = options.editMode;
            if(mapOptions.center) mapOptions.center = new google.maps.LatLng(mapOptions.center[0],mapOptions.center[1]);
            var mapdiv = document.createElement( "div" );
            var stViewdiv = document.createElement( "div" );
            var infodiv = document.createElement( "div" );
            mapdiv.id = this.id + '_map';
            stViewdiv.id = this.id + '_streetview';
            infodiv.id = this.id + '_info';

            $(mapdiv).addClass("plominomap");
            $(stViewdiv).addClass("plominomap-streetview");
            $(infodiv).addClass("plominomap-info");

            $element.before(mapdiv);
            $element.before(stViewdiv);
            $element.before(infodiv);

            var mapOverlays, mapTypeIds;
            var map = new google.maps.Map(mapdiv,mapOptions);
            var defaultMapTypeIds = [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID];


            //CCORDINATE SU MOSEMOVE
            google.maps.event.addListener(map, 'mousemove', function(e){
                var position = 'Lng: ' + e.latLng.lng().toFixed(6) + ' Lat: ' + e.latLng.lat().toFixed(6);
                if(mapOptions.coordsrid && Proj4js.defs['EPSG:'+mapOptions.coordsrid]){
                      var source = new Proj4js.Proj('EPSG:4326');
                      var dest = new Proj4js.Proj('EPSG:' + mapOptions.coordsrid);  
                      var p = new Proj4js.Point(e.latLng.lng(),e.latLng.lat());  
                      Proj4js.transform(source, dest, p); 
                      position = position + ' - X: ' + p.x.toFixed(2) + ' Y: ' + p.y.toFixed(2);
                }
                $(infodiv).text(position);

            });

            //ELENCO DEI LIVELLI
            if(options.mapLayers) {
                console.log(options.mapLayers)
                var layerSettings = $("[name='" + options.mapLayers + "']").data('mapLayers');
                if(typeof(layerSettings)=='string')  layerSettings = JSON.parse(layerSettings.replace(/[\n\r]/g, ''));
                
                if(layerSettings) {

                    mapTypeIds = $("[name='" + options.mapLayers + "']").data('mapTypes');
                    mapTypeIds = mapTypeIds && mapTypeIds.split(',') || defaultMapTypeIds;

                    var baseType = $("[name='" + options.mapLayers + "']").data('baseType');
                    mapOverlays = addMapLayers(layerSettings);
                    if(baseType) 
                        map.setMapTypeId(baseType);
                    else
                        map.setMapTypeId(mapTypeIds[0]);
                    //google.maps['mapLayers'].toggleLayer = toggleLayer;
                   // map.setMapTypeId(mapTypeIds[0]);
                    $("[name='" + options.mapLayers + "']").on("click", toggleLayer);
                    $("[name='" + options.mapLayers + "']").each(toggleLayer);
                    setLayersControl();

                }
                else {
                    mapTypeIds = defaultMapTypeIds;
                    map.setMapTypeId(mapTypeIds[0]);
                }
            }

            //EDITING VETTORIALE
            if(options.drawingTools){
                var currentOverlay;
                var drawingSettings = $("[name='"+ options.drawingTools +"']").data("drawingOptions");
                if(typeof(drawingSettings)=='string')  drawingSettings = JSON.parse(drawingSettings.replace(/[\n\r]/g, ''));

                //console.log(drawingSettings)

                if(drawingSettings){
                    var currentValue;
                    var drawingManager = new google.maps.drawing.DrawingManager({'drawingControl':false});
                    drawingManager.setMap(map);
                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e){

                        drawingManager.setDrawingMode(null);
                        if(currentOverlay){
                            currentOverlay.setMap(null);
                            delete(currentOverlay)
                        }
                        console.log(e)
                        currentOverlay = e.overlay;
                        currentOverlay.elementType = currentValue; 
                        currentOverlay.geometryType = (e.type=='marker')?'point':e.type;
                        //currentOverlay.editMode = true;
                        currentOverlay.fieldId = currentOverlay.fieldId || $element.attr('id');
                        registerObject(currentOverlay);
                        if(currentOverlay.geometryType == "point")  zoomOnStreetView(currentOverlay)
                        console.log(currentOverlay)

                    });

                    $("[name='"+ options.drawingTools +"']").bind('change',function(){
                        currentValue = $(this).val();
                        if($(this).is("input") && !$(this).is("input:checked")) currentValue="empty";
                        drawingManager.setOptions(drawingSettings[currentValue])
                    });

                    //AGGIUNGO LA GEOMETRIA SALVATA SUL CAMPO
                    var sGeom = $(this).val();
                    if(sGeom){
                        var v = sGeom.split(';');
                        var elementType = (v.length == 3 && v[0]);
                        currentOverlay = createOverlay(sGeom, drawingSettings[elementType]); 
                        currentOverlay.setMap(map);
                        currentOverlay.editMode = 1;
                        currentOverlay.fieldId = $element.attr('id');
                        registerObject(currentOverlay);
                        if(currentOverlay.geometryType == "point")  zoomOnStreetView(currentOverlay)
                   }

                }

            }




            google.maps.iolMaps[this.id] = map;


            //AGGIUNGO I MARKERS PRESENTI SULLA FORM (dopo aver caricato la mappa???)




 

            google.maps.event.addListenerOnce(map, 'idle', function(){

                console.log('mappa caricata');
                var markerOptions
                $("[data-plugin='iolMarker']").each(function(){      
                    if($(this).val()){  
                        var pluginOptions = $(this).data();
                        if(typeof(pluginOptions)=='string')  pluginOptions = JSON.parse(pluginOptions.replace(/[\n\r]/g, ''));
                        var Options = pluginOptions.pluginOptions;
                        var coords = $(this).val().split(' ');
                        console.log(Options)
                        iconPath = baseUrl + "/resources/icons/" + Options.type +".png";
                        markerOptions = {
                            position: new google.maps.LatLng(coords[1],coords[0]),
                            icon: iconPath,
                            title: Options.title,
                            map:map,
                            geometryType: google.maps.drawing.OverlayType.MARKER,
                            elementType: Options.type,
                            editMode: editMode,
                            fieldId: this.id
                        } 
                        marker = new google.maps.Marker(markerOptions);
                        registerObject(marker);
                        google.maps.iolMarkers[this.id] = marker;

                    }

                    /*


*/
                    console.log(this)

                });



                //google.maps.iolMarkers[0].setMap(map)
                //registerObject(google.maps.iolMarkers[0])

                //console.log(google.maps.iolMarkers)





            });

            function addMapLayers(layersSettings){

                var dMenu = false;
                var layer, layers = {};

                $.each(layersSettings, function(_,layerOptions){

                    layerOptions.getTileUrl = getTileUrl(layerOptions)

                    layerOptions.tileSize = new google.maps.Size(256, 256);
                    layerOptions.isPng = true;
                    if(layerOptions.minZoom == 'undefined') layerOptions.minZoom = mapOptions.minZoom || 0;
                    if(layerOptions.maxZoom == 'undefined') layerOptions.maxZoom = mapOptions.maxZoom || 22;

                    layer = new google.maps.ImageMapType(layerOptions);

                    //BASE LAYERS
                    if(mapTypeIds.indexOf(layer.name)!=-1){
                        dMenu = true;
                        map.mapTypes.set(layer.name, layer);
                    }
                    else {
                        layers[layer.name] = layer;
                        //toggleLayer(true, layer.name);
                        //$("#mapLayers-"+layer.name).attr('checked','checked')
                        //console.log(layer)
                        //map.overlayMapTypes.setAt(map.overlayMapTypes.length, layer);

                    }


                })

                
                if(dMenu){
                    map.setOptions({"mapTypeControlOptions": {
                            "mapTypeIds": mapTypeIds,
                            "style": google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    }});
                }    

                return layers


            }


            function getTileUrl(layerOptions){

                var fn;
                if(layerOptions.type == "WMS"){

                    fn = function(tile, zoom) {
                        var projection = map.getProjection();
                        var zpow = Math.pow(2, zoom);
                        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
                        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
                        var ulw = projection.fromPointToLatLng(ul);
                        var lrw = projection.fromPointToLatLng(lr);
                        var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
                        return layerOptions.url + "&SERVICE=WMS&VERSION=1.1.1&EXCEPTIONS=XML&REQUEST=GetMap&STYLES=default&FORMAT=image%2Fpng&SRS=EPSG:4326&BBOX=" + bbox + "&width=256&height=256";
                    }
                }
                else if(layerOptions.type == "TMS"){

                    fn = function (coord, zoom) {
                        return layerOptions.url + "/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                    };
                }

                return fn
            }


            function setLayersControl() {

                var layerBox = document.getElementById("layerbox");
                if(!layerBox) return;
                var g = google.maps;
                var me = this;
                var outer = document.createElement("div");
                outer.style.width = "93px";

                var inner = document.createElement("div");
                inner.id = "layers_inner";
                inner.className = "button";
                inner.title ="Show/Hide layers";
                var text = document.createElement("div");
                //text.id = "clicktarget";
                text.appendChild(document.createTextNode("Livelli"));
                inner.appendChild(text);
                outer.appendChild(inner);

              
                if(layerBox) inner.appendChild(layerBox);

                outer.onmouseover = function() {
                    if (me.timer) clearTimeout(me.timer);
                    layerBox.style.display = "block";
                };

                outer.onmouseout = function() {
                me.timer = setTimeout(function() {
                    layerBox.style.display = "none";
                    }, 300);
                };

              map.controls[g.ControlPosition.TOP_RIGHT].push(outer);
            }

            function toggleLayer(){
                var layer;
                layerName = $(this).val();
                layer = mapOverlays[layerName]
                if(!layer) return;

                if ($(this).is(':checked')) { 
                    map.overlayMapTypes.setAt(map.overlayMapTypes.length, layer);
                } else {
                    map.overlayMapTypes.forEach(function(element,index){
                        if(element && element.name == layerName){
                            map.overlayMapTypes.removeAt(index);
                        } 
                    });
                }
            }


            function switchtoStreetView (position){

                 //SE C'è STRTEETVIEW VADO SU QUELLO SENZA AGGIUNGERE MARKERS
                
                   var svClient = new google.maps.StreetViewService();
                   svClient.getPanoramaByLocation(position, 50,function (panoData, status) {
                   var panorama = map.getStreetView();
                   if (status == google.maps.StreetViewStatus.OK) {
                          /**** http://dreamdealer.nl/tutorials/point_the_streetview_camera_to_a_marker.html */
                          var panoCenter = panoData.location.latLng;//trovo la posizione del frame
                          var heading = google.maps.geometry.spherical.computeHeading(panoCenter, position);//calcolo heading con la differenza
                          panorama.setPosition(position);
                          panorama.setPov({heading:heading , pitch:-15, zoom:0});
                          panorama.setVisible(true);

                   } else {
                          alert('Le immagini del servizio Street View di Google non sono disponibili in questo punto')

                      }
                });

            }

            function updateProgField (marker){

                if($.plominoMaps.actions["snapto_strada"])$.plominoMaps.actions["snapto_strada"](marker)


            };




            

        });


    };



}( jQuery ));





