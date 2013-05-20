<<<<<<< HEAD
//TEST CONTROLLER DI PAGINA
jQuery(document).ready(function () {


     //GENERAZIONE DEI CONTROLLI GEOCODE
     jQuery("[data-plugin='geocode']").each(function(){
          eval("var options = "  + jQuery(this).data('geocodeOptions'));
//console.log(options.icon)
        //  if(jQuery('#'+options.icon)) options.icon = jQuery('#'+options.icon).val();
//console.log(options.icon)

          options.icon = jQuery(this).data('iconPath') + options.icon;
console.log(options.icon)

          options.fieldId  = this.id + '_geometry';
          var field = jQuery('#' + options.fieldId);

          if( field.val()) eval("var v= "  + field.val());
          if(typeof(options)=='object'){
               if(jQuery(this).is('a')) jQuery(this).bind('click',geocode_actions);
               if(jQuery(this).is('img')) jQuery(this).attr('src',options.icon);
               if(typeof(v)=='object' && typeof(options)=='object'){
                   options.pos = v;
                   options.editmode = jQuery(this).is('a');
                   jQuery.plominoMaps.google.addMarker(options)
                   //jQuery.plominoMaps.addMarker(options);
               }
          }

          
      });

});

//Trova un elemento di geometria dato un indice
jQuery.plominoMaps.getElement = function(list,idx){
   if(typeof(idx)=='string')
        for (i=0;i<list.length;i++){
              if(list[i].fieldId==idx) return list[i]
        }
   if(typeof(list[idx])!='undefined') 
       return list[idx]
   return false
}

/*
jQuery.plominoMaps.addMarker = function(options){
    this.google.addMarker(options)
    if(options.pos && this.gisclient.map) this.gisclient.addMarker(options)
}
*/

jQuery.plominoMaps.removeMarker = function(options){
    if(jQuery.plominoMaps.google.map) jQuery.plominoMaps.google.removeMarker (options)
    if(jQuery.plominoMaps.gisclient.map) jQuery.plominoMaps.gisclient.removeMarker(options)
}
jQuery.plominoMaps.updateMarkerPosition = function(options){
    
    jQuery.plominoMaps.updateGeometryField(options)
    
    //Oggetti della mappa
    if(options.pos && jQuery.plominoMaps.google.map) jQuery.plominoMaps.google.updateMarkerPosition (options)
    if(options.pos && jQuery.plominoMaps.gisclient.map) jQuery.plominoMaps.gisclient.updateMarkerPosition (options)
}



jQuery.plominoMaps.updateGeometryField = function(options){

   //Aggiorno il campo di posizione
    //Campo tipo geocode 
    if(jQuery('#' + options.fieldId).length){
          jQuery('#' + options.fieldId).val(jQuery.toJSON(options.pos));
    }
    //Campo tipo datagrid
    if(jQuery('#' + options.fieldId + '_gridvalue').length){
        var field = jQuery('#' + options.fieldId + '_gridvalue');
        var field_data = jq.evalJSON(field.val());
        var gridRow = field_data[options.rowIndex];

        if(options.latIndex){
            gridRow[options.latIndex] = options.pos[0].toFixed(6);
            options.dataTable.fnUpdate(options.pos[0].toFixed(6),options.rowIndex, options.latIndex);
        }
        if(options.lngIndex){
            gridRow[options.lngIndex] = options.pos[1].toFixed(6);
            options.dataTable.fnUpdate(options.pos[1].toFixed(6),options.rowIndex, options.lngIndex);

        }
        if(options.geomIndex) gridRow[options.geomIndex] = options.pos;

        field_data[options.rowIndex] = gridRow;
        field.val(jq.toJSON(field_data));
    }
    //Campi lat e lng se esistono
    if(jQuery("[name^='lat']")) jQuery("[name^='lat']").val(options.pos[0].toFixed(6))
    if(jQuery("[name^='lng']")) jQuery("[name^='lng']").val(options.pos[1].toFixed(6))
    



}


jQuery.plominoMaps.pippo = function(evt){
    
     console.log('pippo')

}






//Funzione che aggiorna il campo con la configurazione della mappa
jQuery.plominoMaps.updateMapField = function(){


console.log('#'+this.getDiv().id+'_settings')


      var v = jQuery('#'+this.getDiv().id+'_settings').val();
      if(v)
           v = jQuery.evalJSON(v) 
      else
           v={};
      v.zoom=this.getZoom();
      v.center=[this.getCenter().lat(),this.getCenter().lng()];
      v.mapTypeId=this.getMapTypeId();
//console.log(jQuery.toJSON(v))
      jQuery('#'+this.getDiv().id+'_settings').val(jQuery.toJSON(v));

}


function updateMap(data,mapId){

    jQuery.each(data, function(index, row) { 
       var n = row.length - 1;
       var tipo = row[n-1];
       var aPos = eval(row[n]);

       var newMarker = new google.maps.Marker({
            icon:'../resources/icons/' + tipo,
            title:row[0],
            map:jQuery.plominoMaps.gMap,
            position: new google.maps.LatLng(aPos[0],aPos[1])
        });
        
       jQuery.plominoMaps.points[index] = newMarker;

   });

  
}

function clearMap(type){
   var list = jQuery.plominoMaps[type];
   for (i=0;i<list.length;i++){
        list[i].setMap(null) 
   }
}



//Vale solo x i punti RIVEDERE
function zoomToObject(id,dr){
  var marker;  
  if(typeof(id)=='string')
       marker = getGeometryElement('points',id);
  else
       marker = jQuery.plominoMaps.points[id];
  if(marker){
     marker.setDraggable(dr);
     marker.map.infowindow.setContent(marker.title);
     marker.map.infowindow.open(marker.map, marker);
  }
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
jQuery.ajax({
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








//ACTIONS
function geocode_actions(){
    eval("var options = "  + jQuery(this).data('geocodeOptions'));
    options.icon = jQuery(this).data('iconPath') + options.icon;
    options.fieldId = this.id + '_geometry';
    if(typeof(options)!='object'){
        alert('Verificare la configurazione in custom attributes');
        return;
    } 

    switch(options.action)
    {
    case 'codeaddress':
      geocode_address(options);
      break;
    case 'codecatasto':
      geocode_catasto(options);
      break;
    case 'codestrada':
      geocode_strada(options);
      break;
    default:
      //IN QUESTO CASO PRENDO IL VALORE DAL CONTROLLO CHE HA ID INDICATO IN ACTIONS
        var v=jQuery("input[name='"+options.action+"']:checked").val();
        //RICORSIONE???????????? BOH
        switch(v)
        {
        case 'codeaddress':
          geocode_address(id,options);
          break;
        case 'codecatasto':
          geocode_catasto(id,options);
          break;
        case 'codestrada':
          geocode_strada(id,options);
          break;
        default:
          alert("Attenzione valore non ammesso " + v)
     
        }
 
    }

}

function geocode_address(options){

	var address='Italy';
	jQuery.each(options.fieldlist, function(index, txtId) { 
             if(!jQuery('#' + txtId).val()) alert ('Campo ' + txtId + ' vuoto')
		address += ' ' +  jQuery('#' + txtId).val();
	});

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK){
                     var position = results[0].geometry.location;
                     options.pos = [position.lat(),position.lng()];
console.log(options)
                     if(jQuery('#'+options.icon)) options.icon = jQuery('#'+options.icon).val();

console.log(options)

                     jQuery.plominoMaps.updateMarkerPosition(options);
		}
                else{
                     alert('Non è possibile individuare l\'indirizzo ' + address)
                }
	});
}


function geocode_catasto(options){

	var params={'field':'geocode_cat','prefix':options.prefix};
	jQuery.each(options.fieldlist, function(index, txtId) { 
		params[txtId] = jQuery('#' + txtId).val();
	});

	jQuery.ajax({
                'url':'../resources/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                    if(data.lat){ 
                        options.pos = [data.lat,data.lon];
                        jQuery.plominoMaps.updateMarkerPosition(options);
		    }		 
                    else
                        alert('Dato non trovato')
                }
	});
}           


function geocode_strada(options){
 
	var params={'field':'geocode_strada','prefix':options.prefix};
	jQuery.each(options.fieldlist, function(index, fieldId) { 
                //fieldId = options.prefix + '_' + txtId;
		params[fieldId] = jQuery('#' + fieldId).val();
	});
	jQuery.ajax({'url':'../resources/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                   if(data.lat){  		 
                       options.pos = [data.lat,data.lon];
                       jQuery.plominoMaps.updateMarkerPosition(options);

                       jQuery('#cartello_comune').val(data.comune);
                       jQuery('#cartello_codice_comune').val(data.codice);
                       jQuery('#cartello_tipo').val(options.tipo);
		   }
                   else
                      alert('Dato non trovato')



/*                    //TODO FARE PARAMETRICO COME MARCO IN AUTOCOMPLETE *************************
                     jQuery.each(options.child,function(k,v){
                         if(jQuery('#'+k)){
                            console.log('#'+ options.prefix + '_' + v)
                            jQuery('#'+k).val(v);
                            jQuery('#'+k).trigger('change');
                         }
                     });
*/               

	      }
	});
}           

function addlayer(id,options){
    var map=jQuery.plominoMaps.gMap;
              map.overlayMapTypes.setAt(2, new google.maps.ImageMapType({
                    getTileUrl: getGCTileURL,
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    url:"http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624",
                    map:map,
                    name:'mappale'
               }));

=======
//TEST CONTROLLER DI PAGINA
jQuery(document).ready(function () {


     //GENERAZIONE DEI CONTROLLI GEOCODE
     jQuery("[data-plugin='geocode']").each(function(){
          eval("var options = "  + jQuery(this).data('geocodeOptions'));
//console.log(options.icon)
        //  if(jQuery('#'+options.icon)) options.icon = jQuery('#'+options.icon).val();
//console.log(options.icon)

          options.icon = jQuery(this).data('iconPath') + options.icon;
console.log(options.icon)

          options.fieldId  = this.id + '_geometry';
          var field = jQuery('#' + options.fieldId);

          if( field.val()) eval("var v= "  + field.val());
          if(typeof(options)=='object'){
               if(jQuery(this).is('a')) jQuery(this).bind('click',geocode_actions);
               if(jQuery(this).is('img')) jQuery(this).attr('src',options.icon);
               if(typeof(v)=='object' && typeof(options)=='object'){
                   options.pos = v;
                   options.editmode = jQuery(this).is('a');
                   jQuery.plominoMaps.google.addMarker(options)
                   //jQuery.plominoMaps.addMarker(options);
               }
          }

          
      });

});

//Trova un elemento di geometria dato un indice
jQuery.plominoMaps.getElement = function(list,idx){
   if(typeof(idx)=='string')
        for (i=0;i<list.length;i++){
              if(list[i].fieldId==idx) return list[i]
        }
   if(typeof(list[idx])!='undefined') 
       return list[idx]
   return false
}

/*
jQuery.plominoMaps.addMarker = function(options){
    this.google.addMarker(options)
    if(options.pos && this.gisclient.map) this.gisclient.addMarker(options)
}
*/

jQuery.plominoMaps.removeMarker = function(options){
    if(jQuery.plominoMaps.google.map) jQuery.plominoMaps.google.removeMarker (options)
    if(jQuery.plominoMaps.gisclient.map) jQuery.plominoMaps.gisclient.removeMarker(options)
}
jQuery.plominoMaps.updateMarkerPosition = function(options){
    
    jQuery.plominoMaps.updateGeometryField(options)
    
    //Oggetti della mappa
    if(options.pos && jQuery.plominoMaps.google.map) jQuery.plominoMaps.google.updateMarkerPosition (options)
    if(options.pos && jQuery.plominoMaps.gisclient.map) jQuery.plominoMaps.gisclient.updateMarkerPosition (options)
}



jQuery.plominoMaps.updateGeometryField = function(options){

   //Aggiorno il campo di posizione
    //Campo tipo geocode 
    if(jQuery('#' + options.fieldId).length){
          jQuery('#' + options.fieldId).val(jQuery.toJSON(options.pos));
    }
    //Campo tipo datagrid
    if(jQuery('#' + options.fieldId + '_gridvalue').length){
        var field = jQuery('#' + options.fieldId + '_gridvalue');
        var field_data = jq.evalJSON(field.val());
        var gridRow = field_data[options.rowIndex];

        if(options.latIndex){
            gridRow[options.latIndex] = options.pos[0].toFixed(6);
            options.dataTable.fnUpdate(options.pos[0].toFixed(6),options.rowIndex, options.latIndex);
        }
        if(options.lngIndex){
            gridRow[options.lngIndex] = options.pos[1].toFixed(6);
            options.dataTable.fnUpdate(options.pos[1].toFixed(6),options.rowIndex, options.lngIndex);

        }
        if(options.geomIndex) gridRow[options.geomIndex] = options.pos;

        field_data[options.rowIndex] = gridRow;
        field.val(jq.toJSON(field_data));
    }
    //Campi lat e lng se esistono
    if(jQuery("[name^='lat']")) jQuery("[name^='lat']").val(options.pos[0].toFixed(6))
    if(jQuery("[name^='lng']")) jQuery("[name^='lng']").val(options.pos[1].toFixed(6))
    



}


jQuery.plominoMaps.pippo = function(evt){
    
     console.log('pippo')

}






//Funzione che aggiorna il campo con la configurazione della mappa
jQuery.plominoMaps.updateMapField = function(){


console.log('#'+this.getDiv().id+'_settings')


      var v = jQuery('#'+this.getDiv().id+'_settings').val();
      if(v)
           v = jQuery.evalJSON(v) 
      else
           v={};
      v.zoom=this.getZoom();
      v.center=[this.getCenter().lat(),this.getCenter().lng()];
      v.mapTypeId=this.getMapTypeId();
//console.log(jQuery.toJSON(v))
      jQuery('#'+this.getDiv().id+'_settings').val(jQuery.toJSON(v));

}


function updateMap(data,mapId){

    jQuery.each(data, function(index, row) { 
       var n = row.length - 1;
       var tipo = row[n-1];
       var aPos = eval(row[n]);

       var newMarker = new google.maps.Marker({
            icon:'../resources/icons/' + tipo,
            title:row[0],
            map:jQuery.plominoMaps.gMap,
            position: new google.maps.LatLng(aPos[0],aPos[1])
        });
        
       jQuery.plominoMaps.points[index] = newMarker;

   });

  
}

function clearMap(type){
   var list = jQuery.plominoMaps[type];
   for (i=0;i<list.length;i++){
        list[i].setMap(null) 
   }
}



//Vale solo x i punti RIVEDERE
function zoomToObject(id,dr){
  var marker;  
  if(typeof(id)=='string')
       marker = getGeometryElement('points',id);
  else
       marker = jQuery.plominoMaps.points[id];
  if(marker){
     marker.setDraggable(dr);
     marker.map.infowindow.setContent(marker.title);
     marker.map.infowindow.open(marker.map, marker);
  }
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
jQuery.ajax({
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








//ACTIONS
function geocode_actions(){
    eval("var options = "  + jQuery(this).data('geocodeOptions'));
    options.icon = jQuery(this).data('iconPath') + options.icon;
    options.fieldId = this.id + '_geometry';
    if(typeof(options)!='object'){
        alert('Verificare la configurazione in custom attributes');
        return;
    } 

    switch(options.action)
    {
    case 'codeaddress':
      geocode_address(options);
      break;
    case 'codecatasto':
      geocode_catasto(options);
      break;
    case 'codestrada':
      geocode_strada(options);
      break;
    default:
      //IN QUESTO CASO PRENDO IL VALORE DAL CONTROLLO CHE HA ID INDICATO IN ACTIONS
        var v=jQuery("input[name='"+options.action+"']:checked").val();
        //RICORSIONE???????????? BOH
        switch(v)
        {
        case 'codeaddress':
          geocode_address(id,options);
          break;
        case 'codecatasto':
          geocode_catasto(id,options);
          break;
        case 'codestrada':
          geocode_strada(id,options);
          break;
        default:
          alert("Attenzione valore non ammesso " + v)
     
        }
 
    }

}

function geocode_address(options){

	var address='Italy';
	jQuery.each(options.fieldlist, function(index, txtId) { 
             if(!jQuery('#' + txtId).val()) alert ('Campo ' + txtId + ' vuoto')
		address += ' ' +  jQuery('#' + txtId).val();
	});

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK){
                     var position = results[0].geometry.location;
                     options.pos = [position.lat(),position.lng()];
console.log(options)
                     if(jQuery('#'+options.icon)) options.icon = jQuery('#'+options.icon).val();

console.log(options)

                     jQuery.plominoMaps.updateMarkerPosition(options);
		}
                else{
                     alert('Non è possibile individuare l\'indirizzo ' + address)
                }
	});
}


function geocode_catasto(options){

	var params={'field':'geocode_cat','prefix':options.prefix};
	jQuery.each(options.fieldlist, function(index, txtId) { 
		params[txtId] = jQuery('#' + txtId).val();
	});

	jQuery.ajax({
                'url':'../resources/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                    if(data.lat){ 
                        options.pos = [data.lat,data.lon];
                        jQuery.plominoMaps.updateMarkerPosition(options);
		    }		 
                    else
                        alert('Dato non trovato')
                }
	});
}           


function geocode_strada(options){
 
	var params={'field':'geocode_strada','prefix':options.prefix};
	jQuery.each(options.fieldlist, function(index, fieldId) { 
                //fieldId = options.prefix + '_' + txtId;
		params[fieldId] = jQuery('#' + fieldId).val();
	});
	jQuery.ajax({'url':'../resources/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                   if(data.lat){  		 
                       options.pos = [data.lat,data.lon];
                       jQuery.plominoMaps.updateMarkerPosition(options);

                       jQuery('#cartello_comune').val(data.comune);
                       jQuery('#cartello_codice_comune').val(data.codice);
                       jQuery('#cartello_tipo').val(options.tipo);
		   }
                   else
                      alert('Dato non trovato')



/*                    //TODO FARE PARAMETRICO COME MARCO IN AUTOCOMPLETE *************************
                     jQuery.each(options.child,function(k,v){
                         if(jQuery('#'+k)){
                            console.log('#'+ options.prefix + '_' + v)
                            jQuery('#'+k).val(v);
                            jQuery('#'+k).trigger('change');
                         }
                     });
*/               

	      }
	});
}           

function addlayer(id,options){
    var map=jQuery.plominoMaps.gMap;
              map.overlayMapTypes.setAt(2, new google.maps.ImageMapType({
                    getTileUrl: getGCTileURL,
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    url:"http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624",
                    map:map,
                    name:'mappale'
               }));

>>>>>>> bd0bcd8321adb5ec03f07daf8d948f71d22160f4
}