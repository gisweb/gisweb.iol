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
  var infoMenu = document.getElementById("info_button");
  if(!infoMenu) return;
  inner2.appendChild(infoMenu );
  

  var map = $("#geometry_map").iolGoogleMap.getMap();
  
  map.infowindow = new google.maps.InfoWindow();  




  outer2.onclick = function(){

  if($(this).hasClass("info-selected")){
          google.maps.event.removeListener(clickControl);
          map.setOptions({draggableCursor:'hand'});
          $(this).removeClass("info-selected");
      }
      else{    

          $(this).addClass("info-selected");
          map.setOptions({draggableCursor:'default'});
          clickControl = google.maps.event.addListener(map, 'click', function(e) {
          var zoomLevel = map.getZoom();

      var div=map.getDiv();
      var w = $(div).width();
      var h = $(div).height();
      var x=parseInt(e.pixel.x);
      var y=parseInt(e.pixel.y);
      var sw = map.getBounds().getSouthWest();
      var ne = map.getBounds().getNorthEast();
      var lat = e.latLng.lat();
      var lng = e.latLng.lng();
      var box = sw.lng() + ',' + sw.lat() + ',' + ne.lng() + ',' + ne.lat();
      $.ajax({
                                'type':'GET',
        'url':'services/infoPosizione?lat='+lat+'&lng='+lng,
        'success':function(html){
            if(!html) html='<b>NESSUNA INFORMAZIONE</b>';
            map.infowindow.setOptions({maxWidth:600});
            map.infowindow.setPosition(e.latLng);
            map.infowindow.setContent(html);
            map.infowindow.open(map);

        }
                                
      });

      });

  }

 }
 
 map.controls[google.maps.ControlPosition.TOP_RIGHT].push(outer2); 

});
 