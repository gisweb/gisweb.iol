$(document).ready(function() {

  var clickControl;
  var outer2 = document.createElement("div");
  outer2.style.width = "93px";
  var inner2 = document.createElement("div");
  inner2.id = "more_inner2";
  inner2.className = "button";
  inner2.title ="Show WMS info";
  var text2 = document.createElement("div");
  text2.innerHTML="<i class='icon-question-sign'></i> - Info";
  text2.id = "clicktarget2";
  inner2.appendChild(text2);
  outer2.appendChild(inner2);
  var infoMenu = document.getElementById("infoButton");
  inner2.appendChild(infoMenu );
  
  outer2.onclick = function(){

  if($(this).hasClass("info-selected")){
          google.maps.event.removeListener(clickControl);
          $.plominoMaps.google.map.setOptions({draggableCursor:'hand'});
          $(this).removeClass("info-selected");
      }
      else{    

          $(this).addClass("info-selected");
          $.plominoMaps.google.map.setOptions({draggableCursor:'default'});
          clickControl = google.maps.event.addListener($.plominoMaps.google.map, 'click', function(e) {
          var zoomLevel = $.plominoMaps.google.map.getZoom();

			var div=$.plominoMaps.google.map.getDiv();
			var w = $(div).width();
			var h = $(div).height();
			var x=parseInt(e.pixel.x);
			var y=parseInt(e.pixel.y);
			var sw = $.plominoMaps.google.map.getBounds().getSouthWest();
			var ne = $.plominoMaps.google.map.getBounds().getNorthEast();
			var lat = e.latLng.lat();
			var lng = e.latLng.lng();
			var box = sw.lng() + ',' + sw.lat() + ',' + ne.lng() + ',' + ne.lat();
			$.ajax({
                                'type':'GET',
				'url':'http://iol.comune.rr.nu/cgi-bin/mapserv?map=/apps/gisclient-3.2/map/servizicomunali/occupazione_suolo.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureinfo&QUERY_LAYERS=elementi_scavi.elementi_puntuali&LAYERS=elementi_scavi.elementi_puntuali&SRS=EPSG:4326&BBOX='+box+'&X='+x+'&Y='+y+'&WIDTH='+w+'&HEIGHT='+h+'&INFO_FORMAT=text/html',
				'success':function(html){
                                        console.log(html)
                                        if(!html) html='<b>NESSUNA INFORMAZIONE</b>';
                                        $.plominoMaps.google.map.infowindow.setPosition(e.latLng);
                                        $.plominoMaps.google.map.infowindow.setContent(html);
                                        $.plominoMaps.google.map.infowindow.open($.plominoMaps.google.map);

				}
                                
			});

		  });

	}

 }
 
 $.plominoMaps.google.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(outer2); 

});
 