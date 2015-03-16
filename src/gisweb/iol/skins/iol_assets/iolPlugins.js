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
                var self = this;
                $.each(childs, function(_,child) {
                    var childName =fieldName.replace('_comune','_'+child.name);
                    var el;
                    var frm_container = $(self).parents("form#plomino_form").first();
                    if($(frm_container).find('[name='+childName+']')){
                        el = $(frm_container).find('[name='+childName+']').first();
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

    };

    $.fn.iolCodicefiscale = function( options ) {
        
        return this.each(function() {
            options = options.pluginOptions;
            var fieldId = this.id;
            var self = this;
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
                var params = getValuesForFields (options.params);
                if(!options.service) return;
                $.ajax({
                    'url':baseUrl + "/" + options.service,
                    'type':'POST',
                    'data':params,
                    'dataType':'JSON',
                    'success':function(data, textStatus, jqXHR){
                        var frm_container = $(self).parents("form#plomino_form").first();
                        var el = $(frm_container).find('[name='+self.name+']').first();
                        $(el).val(data.value);
                        //$('#' + fieldId).val(data.value);
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

            $(button).html(' '+options.title + ' ');
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
                            var sGeom = options.type + ";marker;" + data.lng.toFixed(6) + " " + data.lat.toFixed(6)
                            sGeom = data.lng.toFixed(6) + " " + data.lat.toFixed(6) 
                            $element.val(sGeom);
                            var marker = google.maps.iolMarkers[fieldId];
                            if(marker){
                                marker.setPosition(new google.maps.LatLng(data.lat,data.lng));
                            }
                            else{
                                var markerOptions = {
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


    $.fn.iolDatePicker = function() {

        return this.each(function() {
            $(this).wrap( "<div class='input-append'></div>" );
            var button = document.createElement( "span" );
            $(button).addClass('add-on btn');
            var icon = document.createElement( "span" );
            $(icon).addClass('icon-calendar');
            $(button).after(icon);
            $(this).after(button);
            $(button).append(icon);
            var el = this;
            $(button).click(function(e){
                $(el).datepicker('show');
            });
        });
    };


    $.fn.iolAutocompleteForm = function( options ) {

        return this.each(function() {
            //TODO SISTEMARE LA JSON ED EVITARE EVAL
            eval("options = "  + options.pluginOptions +" || {}");
            var fieldId = this.id;
            var baseUrl = $(this).data('baseUrl') || '';
            options.ajax = {
                url: options.url,
                dataType: 'json',
                quietMillis: 100,
                data: options.data,
                results: function (data, page) {
                    var more = (page * 10) < data.total; // whether or not there are more results available
                    // notice we return the value of more so Select2 knows if more results can be loaded
                    return {results: data.names, more: more};
                }
            };
            options.escapeMarkup =  function (m) { return m; } // we do not want to escape markup since we are displaying html in results
            $(this).select2(options).on("change", function(e) { 
                var childs=e.added;
                if(e.removed){
                    if(!confirm('Attenzione i dati già inseriti verranno rimossi, continuo?')) return;
                    childs=e.removed; 
                } 
                $.each(childs, function(key,value) {
                    var el;
                    if($('[name='+key+']').length>0){
                        el = $('[name='+key+']').eq(0);
                        if(e.added) 
                            setControlValue(el,value);                 
                        else if(e.removed)
                            setControlValue(el,'');
                        el.trigger('change');
                    }
                 });
                 //console.log("change "+JSON.stringify({val:e.val, added:e.added, removed:e.removed})); 


            });

 
        });
      
        function setControlValue(el,value){
             if(el.is(':checkbox')||el.is(':radio')) {
                $("#"+el.attr("name")+'-'+value).attr('checked', true);      
            }
            else{
                el.val(value)
            }
        }    
    };



    $.fn.iolUploadFile = function( options ) {


        function checkUploadFile($element, options) {
            var ret = false;
            options = options || {};
            var file_list = $element.prop("files");
            var allowed = options.filetype || ['pdf','pdf/A','p7m','jpeg','jpg','png'];
            var maxsize = options.maxsize || 6; //MAX 6 MB 
            for (var i = 0, file; file = file_list[i]; i++) {
                ret = true;
                var sFileName = file.name;
                var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
                var iFileSize = file.size;
                var iConvert = (file.size / 1000000).toFixed(2);

                if (allowed.indexOf(sFileExtension) == -1 || iConvert > maxsize) {
                    var txt = "File: " + sFileExtension + "\n\n";
                    txt += "Dimensione: " + iConvert + " MB \n\n";
                    txt += "Attenzione il file deve essere di tipo: " + allowed.join(', ')  + ". Dimensione massima " + maxsize + " MB.\n\n";
                    alert(txt);
                    ret = false;
                    return ret;
                }

            }
            return ret;
        }

        return this.each(function() {
            options = options.pluginOptions;
            var $element = $(this);
            $element.wrap( "<div class='fileUpload'></div>" );
            var $elementRemove = $("<span id='" + this.id + "-remove' class='icon-remove file-remove'>").hide();
            $("label[for='" + this.id + "']").append("<span class='icon-folder-open'>");
            $("label[for='" + this.id + "']").after($elementRemove);
            var left = $("label[for='" + this.id + "'] .icon-folder-open").position().left;
            $elementRemove.animate({left:left},'fast');
            var message = options.emptyMessage || 'Nessun file'
            $element.before("<ul><li class='noFile'>" + message + "</li></ul>")
            $elementRemove.bind("click",function(){
                $element.prev().find(".noFile").show()
                $element.val('');
                $element.prev().find("li").each(function(index,element){
                    if(index>0) $(element).remove();
                })
                $elementRemove.hide();
            })
            $element.bind("change",function(e){
                var ul = $element.prev();
                $element.prev().find("li").each(function(index,element){
                    if(index>0) $(element).remove();
                })
                if(checkUploadFile($element,options)){
                    $element.prev().find(".noFile").hide()
                    var file_list = $element.prop("files");
                    for(var i=0;i<file_list.length;i++){
                        var li = $('<li>' + file_list[i].name + '</li>');
                        $element.prev().append(li);
                    }
                    $elementRemove.show();
                }
                else{
                    $element.prev().find(".noFile").show()
                    $element.text('');
                    $element.val('');
                    $elementRemove.hide();
                }


            })


        });
    }
    
})(jQuery);