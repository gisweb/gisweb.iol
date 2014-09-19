

(function ( $ ) {

   // "use strict";

    var svClient = new google.maps.StreetViewService;
    var svGeocoder = new google.maps.Geocoder();
    //google.maps.iolMarkers = {};
    //google.maps.iolMaps = {};

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



    $.fn.iolGoogleMap = function( options ) {
        var iolMarkers = {};
        var mapOverlays = [];
        var map, self;


        options = $.extend({
            test: 'Test'
        }, options);


        $.fn.iolGoogleMap.method = function(text) {
            return '<strong>' + text + '</strong>';
        };

        $.fn.iolGoogleMap.getMap = function() {
            return map;
        };


        $.fn.iolGoogleMap.addGeometry = function(geometryOptions) {

            return ;

        };
        $.fn.iolGoogleMap.addMarker = function(mapName, markerOptions) {

            //createOverlay('sdfsdf','sdfsdf')
            console.log(markerOptions);
            console.log(mapName);




            
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
            if(typeof(options)!='object') return;
            var overlay,pos;
            var patt = /\((.*?)\)/;
            var sCoordinates = stringGeom.match(patt)[1]

            if(stringGeom.indexOf('POINT')!=-1){
                overlay = new google.maps.Marker(options.markerOptions||{});
                pos = sCoordinates.split(' ');
                overlay.setPosition(new google.maps.LatLng(pos[1],pos[0]))
                overlay.geometryType = google.maps.drawing.OverlayType.MARKER;
            }
            if((stringGeom.indexOf('LINESTRING')!=-1) || (stringGeom.indexOf('POLYGON')!=-1)){

                if(stringGeom.indexOf('LINESTRING')!=-1){
                    overlay = new google.maps.Polyline(options.polylineOptions||{});
                    overlay.geometryType = google.maps.drawing.OverlayType.POLYLINE;
                }
                else{
                    overlay = new google.maps.Polygon(options.polygonOptions||{});
                    overlay.geometryType = google.maps.drawing.OverlayType.POLYGON;
                }
                var v, points = [];
                var pos = sCoordinates.split(',');
                for(var i=0;i<pos.length;i++){
                    v = pos[i].split(" ");
                    points.push(new google.maps.LatLng(v[1],v[0]));
                }
                overlay.setPath(points);
            }

            if(stringGeom.indexOf('POLYGON')!=-1){
                points = [];
                pos = sCoordinates.split(',');
                for(var i=0;i<pos.length;i++){
                    v = pos[i].split(" ");
                    points.push(new google.maps.LatLng(v[1],v[0]));
                }
                console.log(options)

                overlay.setPath(points);

            }
 /* 
            //STRINGA DI COORDINATE
            else if(geometryType == "coords"){
                overlay = new google.maps.Polygon(options.polygonOptions||{});
                overlay.setPath(getPathFromCoord(sGeom));
                overlay.geometryType = google.maps.drawing.OverlayType.POLYGON;
            }*/

            //overlay.elementType = elementType;
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

            mapOverlays.push(overlay);
        }
        //AGGIORNA I CAMPI DELLE GEOMETRIE CON LE INFORMAZIONI DELL'OGGETTO OVERLAY
        var updateGeometryField = function (overlay){
           //Aggiorno il campo di posizione
            if(overlay.dataTable){
              //Campo tipo datagrid 
/*            In questo caso definire sulla configurazione js del datagrid gli indici delle colonne dove sono memorizzate le informazioni del marker/overlay
              geomIndex: indice del valore della GEOMETRIA
              typeIdex: indice per la classificazione dell'OGGETTO
              latIndex: indice per il valore lat
              lngIndex: indice per il valore lng
              le informazioni vengono settate suull'oggetto overlay*/

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

                    //VEDERE SE DIFFERENZIARE POINT E MARKER
                    if(typeof(overlay.geomIndex)!='undefined'){
                        if(overlay.geometryType == google.maps.drawing.OverlayType.MARKER)
                            gridRow[overlay.geomIndex] = overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
                        else if (overlay.geometryType == 'point')
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
                    //sGeom = overlay.elementType + ';' + overlay.geometryType + ';' + overlay.getPosition().lng().toFixed(6)+" "+overlay.getPosition().lat().toFixed(6);
                    sGeom = "SRID=4326;POINT(" + overlay.getPosition().lng().toFixed(6) + " " + overlay.getPosition().lat().toFixed(6) + ")";
                }
                else if(overlay.geometryType == google.maps.drawing.OverlayType.MARKER){
                    //sGeom = overlay.getPosition().lng().toFixed(6) + " " + overlay.getPosition().lat().toFixed(6);
                    sGeom = "SRID=4326;POINT(" + overlay.getPosition().lng().toFixed(6) + " " + overlay.getPosition().lat().toFixed(6) + ")";
                    //Campi lat e lng se esistono
                    if($("[name^='lat']")) $("[name^='lat']").val(overlay.getPosition().lat().toFixed(6))
                    if($("[name^='lng']")) $("[name^='lng']").val(overlay.getPosition().lng().toFixed(6))
                }
                else{
                    var points = [];
                    overlay.getPath().forEach(function(point,_){
                        points.push(point.lng().toFixed(6) + " " +point.lat().toFixed(6));
                    })
                    if(overlay.geometryType == google.maps.drawing.OverlayType.POLYLINE)
                        sGeom = "SRID=4326;LINESTRING(" + points.join(",") + ")";
                    if(overlay.geometryType == google.maps.drawing.OverlayType.POLYGON){
                        points.push(points[0]);
                        sGeom = "SRID=4326;POLYGON(" + points.join(",") + ")";
                    }
                    //sGeom = overlay.elementType + ';' + overlay.geometryType + ';' + google.maps.geometry.encoding.encodePath(overlay.getPath());
                    //sGeom = overlay.elementType + ';' + overlay.geometryType + ';' + overlay.getPath().toString();
                }
                $("#"+ overlay.fieldId).val(sGeom);
            }
         
        }

        var zoomOnOverlay = function(overlay){
            if(overlay.geometryType == "point"){
                map.setCenter(overlay.position);
                map.setZoom(overlay.zoom || 16);
            }
            else{
                map.fitBounds(overlay.getBounds());
            }
        }


        //GESTIONE DI STREETVIEW IN FINESTRA SEPARATA
        var zoomOnStreetView = function (marker){

            var panorama;

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
                    //????????????????????? vedere
                    panorama.setPov({heading:heading , pitch:-15, zoom:0});
  
                } else {
                    $(sViewContainer).html('');
                }
           });
        }

        return this.each(function() {

            var $element = $( this );
            var mapOptions = options.pluginOptions || {};
            var baseUrl = options.baseUrl;
            var editMode = parseInt(options.editMode);
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

            var mapLayers, mapTypeIds;
            map = new google.maps.Map(mapdiv,mapOptions);
            var defaultMapTypeIds = [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID];

            var currentOverlay;
            //COORDINATE SU MOSEMOVE
            //SETTARE L'ATTRIBUTO "coordsrid" SULL'OGGETTO CONFIGURAZIONE DELLA MAPPA PER AVERE LE COORDINATE IN ALTRO SISTEMA
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
            //IN "mapLayers" C'E' L'ELENCO DEI LIVELLI DEFINITI DA UN OGGETTO JSON
            if(options.mapLayers) {
                var layerSettings = $("[name='" + options.mapLayers + "']").data('mapLayers');
                if(typeof(layerSettings)=='string')  layerSettings = JSON.parse(layerSettings.replace(/[\n\r]/g, ''));
                
                if(layerSettings) {

                    mapTypeIds = $("[name='" + options.mapLayers + "']").data('mapTypes');
                    mapTypeIds = mapTypeIds && mapTypeIds.split(',') || defaultMapTypeIds;

                    var baseType = $("[name='" + options.mapLayers + "']").data('baseType');
                    mapLayers = addMapLayers(layerSettings);
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
            else {
                mapTypeIds = defaultMapTypeIds;
                map.setMapTypeId(mapTypeIds[0]);
            }

            //EDITING VETTORIALE
/*          IN "drawingOptions" DEFINISCO LE OPZIONI DI CONFIGURAZIONE DEL DRAWINGMANAGER (VEDI API GOOGLE)
            INOLTRE IN data("drawingTarget") DEFINISCO L'ID DEL CAMPO DOVE VA A FINIRE IL VALORE IN STRINGA DELLA GEOMETRIA
            SE NON VIENE DEFINITA L'OPZIONE, LA GEOMETRIA VIENE SCRITTA SUL CAMPO ID DELLA MAPPA 
            ESEMPIO:
                data-drawing-tools='inserisci_elemento_in_mappa'
                data-drawing-target = 'elenco_elementi'
                data-drawing-options='{"
                empty":{"drawingControl":false,"drawingMode":null,"title":""},
                "punto_cantiere":{"drawingControl":true,"drawingMode":"marker","title":"Punto di occupazione del cantiere",
                    "drawingControlOptions":{"drawingModes":["marker"]},
                    "markerOptions":{"icon":"resources/icons/posizione_indirizzo.png","title":"Punto di occupazione del cantiere"}
                },
                "linea_cantiere":{"drawingControl":true,"drawingMode":"polyline","title":"Linea del cantiere",
                   "drawingControlOptions":{"drawingModes":["polyline"]},
                   "polylineOptions":{"strokeColor":"#00FF00","strokeOpacity": 1.0,"strokeWeight": 2}
                },
                "area_cantiere":{"drawingControl":true,"drawingMode":"polygon","title":"Area del cantiere",
                   "drawingControlOptions":{"drawingModes":["polygon"]},
                   "polygonOptions":{"strokeColor":"#00FFFF","strokeOpacity": 1.0,"strokeWeight": 2}
                }}'*/


            if(options.drawingOptions){

                var drawingManager = new google.maps.drawing.DrawingManager({'drawingControl':false});
                drawingManager.setMap(map);

                var drawingOptions = options.drawingOptions;
                if(typeof(drawingOptions)=='string')  drawingOptions = JSON.parse(options.drawingOptions.replace(/[\n\r]/g, ''));

                //CHECK SE IL DATO INSERITO VIENE SCRITTO SU DATAGRID
                var datagridLink = $("#" + options.drawingTarget + "_addrow").get(0);
                var datagridLinkTarget = datagridLink && $(datagridLink).attr("href");
                var openDialog = options.openDialog;
                var elementType = '';

                //SETTO IL TOOL DI DISEGNO DALLA COMBO
                $("[name='"+ options.drawingTools +"']").bind('change',function(){
                    //if($(this).is("input") && !$(this).is("input:checked")) currentValue="empty";
                    elementType = $(this).val();
                    drawingManager.setOptions(drawingOptions[$(this).val()]);
                    if(datagridLinkTarget) $(datagridLink).attr("href", datagridLinkTarget + "&" + options.drawingTools + "=" + $(this).val())
                })

                //EVENTO SULL'INSERIMENTO DEL NUOVO OGGETTO
                google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e){
                    //DISABILITO LA MODALITA' DISEGNO E AGGIUNGO GLI ATTRIBUTI ALL'OVERLAY
                    

                    drawingManager.setDrawingMode(null);
                    e.overlay.geometryType = (e.type=='marker')?'point':e.type;
                    e.overlay.editMode = editMode;

                    e.overlay.fieldId = options.drawingTarget || $element.attr('id');
                    e.overlay.elementType = elementType;


                    google.maps.event.trigger(map,'overlaycomplete', e.overlay);

                    //SE STO AGGIUNGENDO ELEMENTI AD UN DATAGRID APRO IL DIALOG
                    if(datagridLink && openDialog){
                        currentOverlay = e.overlay;
                        $(datagridLink).trigger('click');
                    }
                    else{
                        if(currentOverlay) currentOverlay.setMap(null);//una sola geometria per il campo non datagrid
                        currentOverlay = e.overlay;
                        registerObject(e.overlay);
                        if(e.overlay.geometryType == "point")  zoomOnStreetView(e.overlay)
                    }



                });


                //AGGIUNGO LE GEOMETRIE PRESENTI COME CAMPI SULLA FORM
                var sGeom = $element.val();
                if(sGeom){
                    elementType = $("[name='"+ options.drawingTools +"']").val();
                    currentOverlay = createOverlay(sGeom, drawingOptions[elementType]); 
                    currentOverlay.setMap(map);
                    currentOverlay.editMode = editMode;
                    currentOverlay.fieldId = $element.attr('id');
                    registerObject(currentOverlay);
                    if(currentOverlay.geometryType == "point")  zoomOnStreetView(currentOverlay)
               }


            }

            //google.maps.iolMaps[this.id] = map;

            //AGGIUNGO I MARKERS PRESENTI SULLA FORM E SUI DATAGRID DOPO IL CARICAMENTO DELLA MAPPA
            google.maps.event.addListenerOnce(map, 'idle', function(){

                $(document).trigger('maploaded');
                //AGGIUNGO I MARKERS
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
                        iolMarkers[this.id] = marker;

                    }
                });


                //SETTO I DATAGRIDS INTEGRATI (DA VEDERE I DATAGRIDS NON DIPENDENTI DA DRAWINGTOOLS)
                //AGGIUNGO GLI ELEMENTI GEOMETRICI PRESENTI NEI DATAGRIDS
                if($('#'+ options.drawingTarget +'_datagrid').length && $('#'+ options.drawingTarget +'_datagrid').dataTable()){
                    var settings = $('#'+ options.drawingTarget +'_datagrid').dataTable().fnSettings().oInit
                    var overlay, sGeom, elementType, geomIndex, typeIndex;
                    $.each($('#'+ options.drawingTarget +'_datagrid').dataTable().fnGetData(),function(index,data){

                        sGeom = data[settings.geomIndex];  
                        elementType = data[settings.typeIndex]; 
                        overlay = createOverlay(sGeom, drawingOptions[elementType]); 
                        overlay.dataTable = this;
                        overlay.setMap(map);
                        overlay.editMode = editMode;
                        overlay.fieldId =  options.drawingTarget;
                        overlay.lngIndex = settings.lngIndex;
                        overlay.latIndex = settings.latIndex;
                        overlay.geomIndex = settings.geomIndex;
                        overlay.saved = true;
                        overlay.rowIndex = index;
                        registerObject(overlay);

                    });

                    //EVENTI SUL DATAGRID 
                    var oTable = $('#'+ options.drawingTarget +'_datagrid').dataTable();
                    oTable.fnSettings().aoRowCreatedCallback.push( {
                        "fn": function( nRow, aData, iDataIndex ){ 
                            console.log("AGGIUNTA LA RIGA")

                            //SETTO PER DEFAULT ULTIMA E PENULTIMA COLONNA DEL GRID PER I VALORI DI GEOMETRIA E TIPO
                            currentOverlay.dataTable = this;
                            currentOverlay.geomIndex = settings.geomIndex;
                            currentOverlay.typeIndex = settings.typeIndex;
                            currentOverlay.lngIndex = settings.lngIndex;
                            currentOverlay.latIndex = settings.latIndex;
                            currentOverlay.saved = true;
                            currentOverlay.rowIndex = iDataIndex;
                            registerObject(currentOverlay)

                        }
                    });

                    //EVENTI SULLA SELEZIONE DELLA RIGA
                    $('#'+ options.drawingTarget +'_datagrid > tbody > tr').click(function() {
                        var currentRow = oTable.fnGetPosition(this);
                        currentOverlay = mapOverlays[currentRow];
                        console.log(currentOverlay);
                        zoomOnOverlay(currentOverlay);
                        //ZOOM SU OGGETTO????
                    });

                     //SUL CHIUDI ELIMINO IL MARKER SE NON HO SALVATO
                    $("#" + options.drawingTarget + "_editform").dialog().bind("dialogclose", 
                        function(event, ui){ 
                            console.log("CLOSE!!!!!!!!!!!!")
                            setTimeout(function(){
                                if(!currentOverlay.saved) currentOverlay.setMap(null);
                            },500)} 
                    );
/*
                     $('#'+ options.drawingTarget +'_datagrid').dataTable().fnSettings().aoDrawCallback.push( {
                        "fn": function( oSettings ){ 
                            console.log("?????????'' LA RIGA")
                            console.log(oSettings.aoData)

                        }
                    })*/

                    $('#'+ options.drawingTarget +'_deleterow').bind("click", function(){
                        currentOverlay.setMap(null);
                    });

                }

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
                var timer;
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
                    if (timer) clearTimeout(timer);
                    layerBox.style.display = "block";
                };

                outer.onmouseout = function() {
                    timer = setTimeout(function() {
                     layerBox.style.display = "none";
                     }, 300);
                };

              map.controls[g.ControlPosition.TOP_RIGHT].push(outer);
            }

            function toggleLayer(){
                var layer, layerName;
                layerName = $(this).val();
                layer = mapLayers[layerName]
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


            function updateDatagridField (marker){



            }

            

        });


    };



}( jQuery ));





