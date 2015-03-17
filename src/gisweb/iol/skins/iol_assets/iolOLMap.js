

(function ( $ ) {

    //"use strict";

    $.fn.iolOLMap = function( options ) {

        var map, self;

        options = $.extend({
            test: 'Test'
        }, options);


        $.fn.iolOLMap.method = function(text) {
            return '<strong>' + text + '</strong>';
        };

        $.fn.iolOLMap.getMap = function() {
            return map;
        };


        $.fn.iolOLMap.addGeometry = function(geometryOptions) {

            return ;

        };
        $.fn.iolOLMap.addMarker = function(mapName, markerOptions) {

            //createOverlay('sdfsdf','sdfsdf')

        };
        $.fn.iolOLMap.registerObject = function(overlay){
            registerObject(overlay)
        }
        $.fn.iolOLMap.updateGeometryField = function(overlay){
            updateGeometryField(overlay)
        }
        $.fn.iolOLMap.zoomOnStreetView = function(marker){
            zoomOnStreetView(marker)
        }         

        $.fn.iolOLMap.settings = options;

        return this.each(function() {

            var $element = $( this );
            var mapOptions = options.pluginOptions || {};
            var baseUrl = options.baseUrl;
            var editMode = parseInt(options.editMode);
            var mapdiv = document.createElement( "div" );
            var stViewdiv = document.createElement( "div" );
            var infodiv = document.createElement( "div" );
            mapdiv.id = this.id + '_map';
            infodiv.id = this.id + '_info';

          var box_extents = [
                [1096300, 5482410, 1096600, 5482540]
            ];

            var boxes  = new OpenLayers.Layer.Vector( "Boxes" );
    
                for (var i = 0; i < box_extents.length; i++) {
                    ext = box_extents[i];
                    bounds = OpenLayers.Bounds.fromArray(ext);
                    
                    box = new OpenLayers.Feature.Vector(bounds.toGeometry());
                    boxes.addFeatures(box);
            }

            $(mapdiv).addClass("plominomap");
            $(infodiv).addClass("plominomap-info");

            $element.before(mapdiv);
            $element.before(infodiv);
            
            $(mapdiv).append('<div  unselectable="on" style="z-index:1005; position:absolute; top:400px; left:400px; width:80px; height:80px; border-color:red; border-style:solid; border-width:2px;">&nbsp;</div>');


            mapOptions.theme = null;
            mapOptions.div = mapdiv;
            if(!mapOptions.projection) mapOptions.projection = "EPSG:3857";

            if(mapOptions.center){
                mapOptions.center = new OpenLayers.Geometry.Point(mapOptions.center[1],mapOptions.center[0]).transform("EPSG:4326", mapOptions.projection);
                mapOptions.center = mapOptions.center.getBounds().getCenterLonLat();
            }

            map = new OpenLayers.Map(mapOptions);

            map.addLayers([new OpenLayers.Layer.OSM(),boxes]);

            map.addControl(new OpenLayers.Control.MousePosition());
return;

            //ELENCO DEI LIVELLI
            //IN "mapLayers" C'E' L'ELENCO DEI LIVELLI DEFINITI DA UN OGGETTO JSON
            if(options.mapLayers) {
                var layerSettings = $("[name='" + options.mapLayers + "']").data('mapLayers');
                if(typeof(layerSettings)=='string')  layerSettings = JSON.parse(layerSettings.replace(/[\n\r]/g, ''));
            }




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
                    zoomOnOverlay(currentOverlay);
                    if(currentOverlay.geometryType == "marker")  zoomOnStreetView(currentOverlay)
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
                        zoomOnOverlay(currentOverlay);
                        //ZOOM SU OGGETTO????
                    });

                     //SUL CHIUDI ELIMINO IL MARKER SE NON HO SALVATO
                    $("#" + options.drawingTarget + "_editform").dialog().bind("dialogclose", 
                        function(event, ui){ 
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





