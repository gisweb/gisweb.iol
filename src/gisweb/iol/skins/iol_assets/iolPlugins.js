(function ($) {
    "use strict";

    function getValuesForFields(fieldList){
         var params={};
         $.each(fieldList, function(key,fieldName) { 
                params[key] = fieldName;
                if($("input:radio[name='"+fieldName+"']:checked").length>0) params[key] = $("input:radio[name='"+fieldName+"']:checked").val();
                else if($("[name='"+fieldName+"']").length>0) params[key] = $("[name='"+fieldName+"']").val();
         });
         return params
    }


    $.fn.iolElencoComuni = function( options ) {

        return this.each(function() {
            //Setto le impostazioni dei childs fisse per questo plugin
            var childs = [{'idx':0,'name':'cod_cat'},{'idx':2,'name':'provincia'},{'idx':3,'name':'cap'}];
            var options = {
                placeholder: 'Seleziona il Comune',
                allowClear: true,
                minimumInputLength: 2,
                width:'off',
                id: function(e) { return e[1]; },
                text: function(e) { return e[1]; },
                formatResult: function(data) { return '<div>' + data[1] + ' (' + data[2] + ')</div>'; },
                formatSelection: function(data) { return data[1]; },
                query: function(query) {
                    var results = [];
                    var re = RegExp('^' + query.term, 'i');
                    $.each(iol_elenco_comuni, function(_, comune) {
                        if (re.test(comune[1])) {results.push(comune)}
                    })
                    query.callback({results: results});
                },
                initSelection : function (element, callback) {
                    var data = ["",element.val(),"","",""];
                    callback(data);
                }
            }
            //$.extend(options,baseOptions);
            $(this).select2(options).on("change", function(e) { 
                var fieldName = this.name;
                $.each(childs, function(_,child) {
                    var childName =fieldName.replace('_comune','_'+child.name);
                    var el;
                    if($('[name='+childName+']').length>0){
                        el = $('[name='+childName+']').eq(0);
                        if(e.added) 
                            el.val(e.added[child.idx]);
                        else if(e.removed) 
                            el.val('');
                        el.trigger('change');
                    }
                });
            });
        });

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );
        console.log(options)

    };

    $.fn.iolCodicefiscale = function( options ) {

        return this.each(function() {
            options = options.pluginOptions;
            var fieldId = this.id;
            var baseUrl = $(this).data('baseUrl') || '';
            $(this).wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "span" );
            $(button).addClass('add-on btn');
            var icon = document.createElement( "span" );
            $(icon).addClass('icon-edit');
            $(button).after(icon);

            $(button).html(' Calcola ')
            $(this).after(button);
            $(button).append(icon);
            $(button).click(function(e){
                e.preventDefault();
                var params = getValuesForFields (options.params)
                if(!options.service) return;
                $.ajax({
                    'url':baseUrl + "/" + options.service,
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

        return this.each(function() {
            options = options.pluginOptions;
            var fieldId = this.id;
            var baseUrl = $(this).data('baseUrl') || '';
            $(this).wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "span" );
            $(button).addClass('add-on btn');
            var icon = document.createElement( "img" );
            //TODO SETTARE IL PATH PARAMETRICO
            icon.src="resources/icons/posizione_mappale.png";
            $(icon).addClass('icon-' + options.type);
            $(button).after(icon);

            $(button).html(' '+options.title + ' ')
            $(this).after(button);
            $(button).append(icon);
/*
            if(editMode){
                $("label:[for='mappale_geometry']")
                    .append( "<img class='icon-button' src='" + iconPath + "' />" )
                    .appendTo(button);
                $element.after(button);
            }
*/
            $(button).click(function(e){
                e.preventDefault();
                var params = getValuesForFields (options.params)
                if(!options.service) return;
                $.ajax({
                    'url':baseUrl + "/services/" + options.service,
                    'type':'POST',
                    'data':params,
                    'dataType':'JSON',
                    'success':function(data, textStatus, jqXHR){
                        if(data.success){
                            sGeom = options.type + ";marker;" + data.lng.toFixed(6) + " " + data.lat.toFixed(6) 
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
                                    title: options.title,
                                    map:google.maps.iolMaps[options.mapName],
                                    geometryType: google.maps.drawing.OverlayType.MARKER,
                                    elementType: options.type,
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

    $.fn.iolDatePicker = function( ) {
        return this.each(function() {
            $(this).wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "span" );
            $(button).addClass('add-on btn');
            var icon = document.createElement( "span" );
            $(icon).addClass('icon-calendar');
            $(button).after(icon);
            $(this).after(button);
            $(button).append(icon);
            $(button).click(function(){

                $(this).datepicker('show');

            });
        });
    }




    $.fn.iolUploadFile = function( options ) {

        function checkUploadFile() {

            var file_list = $(this).prop("files");
            eval("var options = "  + jQuery(this).data('fileOptions') +" || {}");
            var allowed = (options && options.filetype) || ['pdf','pdf/A','p7m','jpeg','jpg','png'];
            var maxsize = (options && options.maxsize) || 6; //MAX 6 MB 
            for (var i = 0, file; file = file_list[i]; i++) {
                var sFileName = file.name;
                var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
                var iFileSize = file.size;
                var iConvert = (file.size / 1000000).toFixed(2);

                if (allowed.indexOf(sFileExtension) == -1 || iConvert > maxsize) {
                    txt = "File: " + sFileExtension + "\n\n";
                    txt += "Dimensione: " + iConvert + " MB \n\n";
                    txt += "Attenzione il file deve essere di tipo: " + allowed.join(', ')  + ". Dimensione massima " + maxsize + " MB.\n\n";
                    alert(txt);
                    $(this).text('');
                    $(this).val('');
                }

            }
        }

        return this.each(function() {
            options = options.pluginOptions;
            var fieldId = this.id;
            $element = $(this);
            $element.addClass("upload");
            $element.before($("<span id='" + this.id + "_span' class='upload uneditable-input'></span><span class='removeUpload'></span>"))
            var baseUrl = $(this).data('baseUrl') || '';
            $(this).wrap( "<div class='fileUpload btn btn-inverse'></div>" );
            var button = document.createElement( "span" );
            $(button).html(' Carica ')
            $element.before(button);
            
            $element.bind("change",function(e){
                console.log($element.prop("files"))
                if($element.prop("files").length > 0){
                    $("#" + this.id +"_span").html($element.prop("files")[0].name);
                    $(".removeUpload").addClass("icon-remove")
                }
                else{
                    $("#" + this.id +"_span").html("");
                    $(".removeUpload").removeClass("icon-remove")
                }

            })
            $(".removeUpload").bind("click",function(){
                $("#" + $element.attr("id") +"_span").html("");
                $(this).removeClass("icon-remove");
                delete($element.prop("files"));


            }) 


        });
    }







	
})(jQuery);