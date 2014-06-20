(function ($) {


    function getValuesForFields(fieldList){
         var params={};
         $.each(fieldList, function(key,fieldName) { 
                params[key] = fieldName;
                if($("input:radio[name='"+fieldName+"']:checked").length>0) params[key] = $("input:radio[name='"+fieldName+"']:checked").val();
                else if($("[name='"+fieldName+"']").length>0) params[key] = $("[name='"+fieldName+"']").val();
         });
         return params
    }


    $.fn.iolCodicefiscale = function( options ) {
        return this.each(function() {
            options = options.codicefiscaleOptions;
            var fieldId = this.id;
            var baseUrl = $(this).data('baseUrl');
            $(this).wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "button" );
            $(button).addClass('button');

            $(button).html('Calcola')
            $(this).after(button);
            $(button).click(function(){
                /*
                $.each(options.fieldlist, function(index, txtId) {
                    var value = $('#' + txtId).val();
                    if(!value) value = $('input:radio[name = ' + txtId+ ']:checked').val();
                    if(!value){alert ('Campo ' + txtId + ' vuoto');return}
                    params[txtId] = value;
                });
*/
                $.ajax({
                    'url':baseUrl + options.source,
                    'type':'POST',
                    'data':params,
                    'dataType':'JSON',
                    'success':function(data, textStatus, jqXHR){
                        $('#' + fieldId).val(data.value);
                    }
                });
            });
        });
    };

    $.fn.iolMarker = function( options ) {
        console.log(options)

        return this.each(function() {
            var baseUrl = options.baseUrl;
            var editMode = options.editMode == 1;
            var pluginOptions = options.pluginOptions;
            var marker, fieldId = this.id;
            $element = $(this);

            var iconPath =  baseUrl + "/resources/icons/" + pluginOptions.type +".png";
            $element.wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "button" );
            $(button).addClass('button');

            if(editMode){
                $("label:[for='mappale_geometry']")
                    .append( "<img class='icon-button' src='" + iconPath + "' />" )
                    .appendTo(button);
                $element.after(button);
            }

            $(button).click(function(e){
                e.preventDefault();
                params = getValuesForFields (pluginOptions.params)
                $.ajax({
                    'url':baseUrl + "/services/" + pluginOptions.service,
                    'type':'POST',
                    'data':params,
                    'dataType':'JSON',
                    'success':function(data, textStatus, jqXHR){
                        if(data.success){
                            sGeom = pluginOptions.type + ";marker;" + data.lng.toFixed(6) + " " + data.lat.toFixed(6) 
                            sGeom = data.lng.toFixed(6) + " " + data.lat.toFixed(6) 
                            $element.val(sGeom);
                            marker = google.maps.iolMarkers[fieldId];
                            if(marker){
                                marker.setPosition(new google.maps.LatLng(data.lat,data.lng));
                            }
                            else{
                                markerOptions = {
                                    position: new google.maps.LatLng(data.lat,data.lng),
                                    icon: iconPath,
                                    title: pluginOptions.title,
                                    map:google.maps.iolMaps[pluginOptions.mapName],
                                    geometryType: google.maps.drawing.OverlayType.MARKER,
                                    elementType: pluginOptions.type,
                                    editMode: editMode,
                                    fieldId: fieldId
                                }
                                marker = new google.maps.Marker(markerOptions);
                                $.fn.iolGoogleMap.registerObject(marker);
                                google.maps.iolMarkers[fieldId] = marker;
                            }
                        }        
                        else{
                            alert(markerOptions.message)
                        }
                    }


                });
                
            });
        });
    };




})(jQuery);