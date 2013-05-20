//Questo non serve a nulla


jq(function() {
    try {jq.datepicker.regional['it'].yearRange = "c-110:c+10";}
    catch (e) {}
    jq.datepicker.setDefaults(jq.datepicker.regional['it']);
});

function refreshHidewhen(){

console.log(this)

}

jq.plominoMaps = {points:{},lines:{},polygons:{},gMaps:{}};



//TEST CONTROLLER DI PAGINA
jq(document).ready(function () {

    //GENERAZIONE DEL MENU VERTICALE
    if(jq('#v-menu-div')){
        addVerticalMenu(jq('#v-menu-div'));


   }

    //GENERAZIONE DEI CONTROLLI AUTOCOMPLETE
    jq("input[data-plugin='autocomplete']").each(function(){
        jq.globalEval("var options = "  + jq(this).data('autocompleteOptions') +" || {}");
        if (!options.source) options.source='../application/services/xSuggest';
        if (options.source.indexOf('?') > 0) options.source += '&'; else options.source += '?'; 
        options.source += 'field=' + this.id;
        if (options.extraParams) options.source += '&' + jq.param(options.extraParams);
        options.select = function(event,ui){
             if (typeof(ui.item.child)!='undefined'){
                 jq.each(ui.item.child,function(k,v){
                     if(jq('#'+k)){
                          jq('#'+k).val(v);
                          jq('#'+k).trigger('change');
                     }
                  });  
             }
        };
        jq(this).autocomplete(options);
    });
    
    //GENERAZIONE DEI CONTROLLI DATEPICKER
    jq("input[data-plugin='datepicker']").each(function(){
        jq.globalEval("var options = "  + jq(this).data('datepickerOptions'));
        jq(this).datepicker(options || { });
        if(jq(this).data('format')) jq(this).datepicker( "option", "dateFormat", jq(this).data('format') );

        jq('#btn_' + this.id).click(function(){
            jq(this).datepicker('show');
        });

    });

   //GENERAZIONE DATATABLES
    jq("input[data-plugin='datepicker']").each(function(){
 
      console.log (this);
    });
    //Funzione che aggiorna il campo con la configurazione della mappa
    function updateMapField(){

      var v = jq('#'+this.getDiv().id+'-options').val();
      v = jq.evalJSON(v);
      v.zoom=this.getZoom();
      v.center=[this.getCenter().lat(),this.getCenter().lng()];
      v.mapTypeId=this.getMapTypeId();
      jq('#'+this.getDiv().id+'-options').val(jq.toJSON(v));

    }

    
    //Aggiungo le mappe
    //jq.plominoMaps.gMaps: mapp di google, jq.plominoMaps.gcMaps: mappe gisclient, jq.plominoMaps.olMaps: mappe openlayers ecc......
    if(jq.plominoMaps && jq.plominoMaps.gMaps){
        jq.each(jq.plominoMaps.gMaps,function(mapId,options) {   
           if(options.center) options.center = new google.maps.LatLng(options.center[0],options.center[1]);
          // options.mapTypeControlOptions = {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU};
           jq.plominoMaps.gMaps[mapId] = new google.maps.Map(document.getElementById(mapId),options);


           //Per ogni mappa allineo le modifiche allo zoom e altri parametri con i valori del campo hidden (da rendere opzionale)
           google.maps.event.addListener(jq.plominoMaps.gMaps[mapId], 'center_changed', updateMapField);
           google.maps.event.addListener(jq.plominoMaps.gMaps[mapId], 'zoom_changed', updateMapField);
           google.maps.event.addListener(jq.plominoMaps.gMaps[mapId], 'maptypeid_changed', updateMapField);
           //jq.plominoMaps.gMaps[mapId].pippo();jq.plominoMaps.gMaps[mapId].pluto();



           //Evetuali oprazioni da fare su ogni singola mappa
           //jq.plominoMaps.gMaps[mapId].infowindow = new google.maps.InfoWindow(); //Aggiungo una finestra di popup per ogni mappa


         });

        //Aggiungo gli oggetti vettoriali
        //jq.plominoMaps.points, jq.plominoMaps.lines, jq.plominoMaps.polygons, 
        jq.each(jq.plominoMaps.points,addMarker);


    }


    jQuery17('.icon-info-sign').popover();

    
});


function updateFieldGeom(fieldId,value){
    var field = jq('#' + fieldId);
    field.val(jq.toJSON(value));
}

function addMarker(id,options){

    if(options.position){
        var aPos = options.position;
        var newMarker = new google.maps.Marker({
            icon:options.baseURL + '/resources/' + options.icon,
            map:jq.plominoMaps.gMaps[options.map],
            draggable:options.editmode,
            position: new google.maps.LatLng(aPos[0],aPos[1]),
            action: options.action,
            fieldlist: options.fieldlist
        });

        if (options.editmode) {
            google.maps.event.addListener(newMarker, 'dragend', function() {
                updateFieldGeom(id,[newMarker.position.lat(),newMarker.position.lng()])
            });
            google.maps.event.addListener(newMarker, 'dragend', markerDragEnd);
      
        }
        else{
            if(options.winpopup && options.winpopup.params){
                 options.winpopup.params['field'] = id;
                 google.maps.event.addListener(newMarker, 'click', function() {
                    winPopup(id,newMarker,options);
                })
            }
        }; 
        jq.plominoMaps.points[id] = newMarker;
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
jq.ajax({
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

//Setta il datagrid x ora il campo geometria è sempre l'ultimo) e aggiorna la geometria (da controllare)
//TODO VERIFICARE CHE LA GEOCODIFICA MI DIA IL PUNTO NEL BOUNDING BOX CHE SERVE


function geocode(id){


    var options = jq.plominoMaps.points[id];

    if(typeof(options)!='object'){
        alert('Verificare la configurazione in jsSettings');
        return;
    } 

    switch(jq.plominoMaps.points[id].action)
    {
    case 'codeaddress':
      geocode_address(id,jq.plominoMaps.points[id].fieldlist);
      break;
    case 'codecatasto':
      geocode_catasto(id,options);
      break;
    case 'codestrada':
      geocode_strada(id,jq.plominoMaps.points[id].fieldlist);
      break;
    default:
      //IN QUESTO CASO PRENDO IL VALORE DAL CONTROLLO CHE HA ID INDICATO IN ACTIONS
        var v=jq("input[name='"+options.action+"']:checked").val();
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

function geocode_address(id,fieldlist){

	var address='Italy';
	jq.each(fieldlist, function(index, txtId) { 
             if(!jq('#' + txtId).val()) alert ('Campo ' + txtId + ' vuoto')
		address += ' ' +  jq('#' + txtId).val();
	});

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK){
                     var position = [results[0].geometry.location.lat(),results[0].geometry.location.lng()];
                     updateFieldGeom(id,position);

                     if(typeof(jq.plominoMaps.points[id].map)=='object'){ //é un marker esistente -> lo sposto  
                             jq.plominoMaps.points[id].setPosition(new google.maps.LatLng(position[0],position[1]));
                     }
                     else{
                          jq.plominoMaps.points[id].position = position
	                  addMarker(id,jq.plominoMaps.points[id]);
                    }
		}
                else{
                     alert('Non è possibile individuare l\'indirizzo ' + address)
                }
	});
}


function geocode_catasto(id,options){
	var params={'field':'geocode_cat'};
	jq.each(options.parcels, function(index, txtId) { 
		params[txtId] = jq('#' + txtId).val();
	});
	jq.ajax({
  'url':'/istanzeonline/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
		
			console.log(data)
		
		}
	});
}           


function geocode_strada(id,fieldlist){
	var params={'field':'geocode_strada'};
	jq.each(fieldlist, function(index, txtId) { 
		params[txtId] = jq('#' + txtId).val();
	});
	jq.ajax({'url':'/istanzeonline/application/services/xSuggest',
		'type':'POST',
		'data':params,
		'dataType':'JSON',
		'success':function(data, textStatus, jqXHR){
                     var position = [data.lat,data.lon];
                     updateFieldGeom(id,position);

                     if(typeof(jq.plominoMaps.points[id].map)=='object'){ //é un marker esistente -> lo sposto  
                             jq.plominoMaps.points[id].setPosition(new google.maps.LatLng(position[0],position[1]));
                     }
                     else{
                          jq.plominoMaps.points[id].position = position
	                  addMarker(id,jq.plominoMaps.points[id]);
                    }

                    jq('#cartelli_comune').val(data.comune);
                    jq('#cartelli_codice_comune').val(data.codice);
                    jq.plominoMaps.points[id].map.setCenter(jq.plominoMaps.points[id].position);
                    jq.plominoMaps.points[id].map.setZoom(18);
		
	      }
	});
}           


function winPopup(id,marker,options){
    var serviceURL = options.baseURL + '/application/services/renderInfoFormMap';
    jq.ajax({
                url: serviceURL + '?' + jq.param(options.winpopup.params),
                success: function (data) {
                    jq.plominoMaps.infowindow.setContent(data);
                    jq.plominoMaps.infowindow.open(id, marker)
                }
    })

};


function addlayer(id,options){
    var map=jq.plominoMaps.gMaps[options.map];
              map.overlayMapTypes.setAt(2, new google.maps.ImageMapType({
                    getTileUrl: getGCTileURL,
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    url:"http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624",
                    map:map,
                    name:'mappale'
               }));

}


/*---------------------------------------------------------------------------------------------------------------------------*/
/*        Funzione che aggiunge il menu verticale sui plomino Document                                                       */
/*---------------------------------------------------------------------------------------------------------------------------*/
function addVerticalMenu(element){
        var html='';
        html+='<div class="affix">';
	html+='<ul id="v-menu" class="nav nav-list bs-docs-sidenav">';
    
    jq('.v-content-title').each(function(k,v){
		var id = jq(v).closest('p').attr('id');
		var title = jq(v).html();
		var li = '<li><a href="' + window.location + '#' + id + '">' + title + '</a></li>';
		html+=li;
	});
	html+='</ul></div>';
	element.html(html);
}


  



/*---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*                                          UNA BELINATA DI ROBERTO PER USARE GLI OVERLAY AL POSTO DEI DIALOG                                                    */
/*---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function datagrid_show_form_soloperprov(field_id, formurl, onsubmit) {

    jq('#loader').addClass("loading"); 

    var field_selector = "#" + field_id + "_myeditform";
    jq(field_selector).html(
        '<iframe style="width:100%;height:100%"></iframe>'
    );
    var iframe = jq("#" + field_id + "_myeditform iframe");

    //jq(field_selector).append('<div id="loading-image"><img src="http://iol.vmserver/portal_skins/custom/loading.gif" alt="Loading..." /></div>');return;

    iframe.attr('src', formurl);
    iframe.load(function() {
        var popup;
        var body = iframe[0].contentDocument.body;
        // Edit-form close button
		jq("input[name=plomino_close]", body).removeAttr('onclick').click(function() {
			//popup.dialog('close');
                         alert('chiudi a mano che non ho capito come si fa');popup.hide();
		});
		// Edit form submission
		jq('form', body).submit(function(){
			var message = "";

			jq.ajax({url: this.action+"?"+jq(this).serialize(),
				async: false,
				//context: jq('#plomino_form'),
				error: function() {
					alert("Error while validating.");
				},
				success: function(data) {
					message = jq(data).filter('#plomino_child_errors').html();
					return false;
				}
			});

			if(!(message === null || message === '')) {
				alert(message);
                // Avoid Plone message "You already submitted this form", since we didn't
                jQuery(this).find('input[type="submit"].submitting').removeClass('submitting');
				return false;
			}
			jq.get(this.action, jq(this).serialize(), function(data, textStatus, XMLHttpRequest){
				// Call back function with new row
				var rowdata = [];
				jq('span.plominochildfield', data).each(function(){
					rowdata.push(this.innerHTML);
				});
				var raw = jq.evalJSON(jq('#raw_values', data).text());
				onsubmit(rowdata, raw);
			});
			//popup.dialog('close');
                        alert('chiudi a mano che non ho capito come si fa');popup.hide();
			return false;
		});
		// Prepare and display the dialog
		jq('.documentActions', body).remove();
		//popup.dialog("option", "title", jq('.documentFirstHeading', body).remove().text());
		//popup.dialog('open');
                field_selector = "#" + field_id + "_lightbox";
                popup =  jq(field_selector).lightbox();
                //jq('#loading-image').remove();
                jq('#loader').removeClass("loading"); 

	});


}


  