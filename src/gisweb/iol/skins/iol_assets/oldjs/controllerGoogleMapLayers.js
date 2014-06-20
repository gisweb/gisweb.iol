$(document).ready(function() {
  if($("#swingbox").length==0) return;
  var chosen = [];
  var g = google.maps;
  var me = this;
  $("#swingbox input").click(function(){switchLayer(this.checked, this.id)});
  $("#remover").click(function(){hideAll()});

  var outer = document.createElement("div");
  outer.style.width = "93px";

  var inner = document.createElement("div");
  inner.id = "more_inner";
  inner.className = "button";
  inner.title ="Show/Hide layers";
  var text = document.createElement("div");
  text.id = "clicktarget";
  text.appendChild(document.createTextNode("Livelli"));
  inner.appendChild(text);
  outer.appendChild(inner);

  // Take care of the clicked target
  inner.onclick = toggleLayers;

  var swingmenu = document.getElementById("swingbox");
  inner.appendChild(swingmenu);

  outer.onmouseover = function() {
    if (me.timer) clearTimeout(me.timer);
    swingmenu.style.display = "block";
  };

  outer.onmouseout = function() {
    me.timer = setTimeout(function() {
      swingmenu.style.display = "none";
    }, 300);
  };
  
  $.plominoMaps.google.map.controls[g.ControlPosition.TOP_RIGHT].push(outer); 
  google.maps.event.addListener($.plominoMaps.google.map, 'zoom_changed', updateLayersTool);
  
  //DA RIFARE CON JQUERY

  $.plominoMaps.OpenGisClientMap =  function(mapset){
    var center = $.plominoMaps.google.map.getCenter().lng()+';'+$.plominoMaps.google.map.getCenter().lat()+';'+$.plominoMaps.google.map.getZoom();
    mapset = $.plominoMaps.gisclient.mapset || mapset;
    window.open("http://sis.provincia.sp.it/gisclient/template/siti/iol.php?mapset="+mapset)
  }
  $.plominoMaps.OpenGisClient2Map =  function(mapset){
    window.open("http://siti.provincia.sp.it/gisclient/template/catasto_strade/iol.php?mapset=catasto_strade&extent=1540704.23,4873548.768,1581884.695,4914868.542")
  }

  //CONFIGURAZIONE DEI LAYERS ******************************************************
  google.maps.event.addListenerOnce($.plominoMaps.google.map, 'idle', function(){

    var layer;
    for (i in jQuery.plominoMaps.google.layers){
        layer = jQuery.plominoMaps.google.layers[i];

        //BASI
        if(jQuery.plominoMaps.google.mapTypeIds.indexOf(layer.name)!=-1){
            jQuery.plominoMaps.google.map.mapTypes.set(layer.name, layer);
        }

        //OVERLAYS ACCESI
        else if(jQuery.plominoMaps.google.LAYERS_ON.indexOf(layer.name)!=-1){
            switchLayer(true, 'mapLayers-'+layer.name);
            $("#mapLayers-"+layer.name).attr('checked','checked')
        }
     
    }

    $.plominoMaps.google.map.setOptions({mapTypeControlOptions: {
        mapTypeIds:jQuery.plominoMaps.google.mapTypeIds,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }});
    if(jQuery.plominoMaps.google.BASE_LAYER)  jQuery.plominoMaps.google.map.setMapTypeId(jQuery.plominoMaps.google.BASE_LAYER);


  });


  function updateLayersTool(){
    var disabled;
    var map=this;
    $("#swingbox input").each(function(_,el){
      //disabled = $.plominoMaps.google.layers[el.id].minZoom != 'undefined' && map.getZoom() < $.plominoMaps.google.layers[el.id].minZoom;
      //disabled = !disabled && $.plominoMaps.google.layers[el.id].maxZoom != 'undefined' && map.getZoom() > $.plominoMaps.google.layers[el.id].maxZoom;
      el.disabled=disabled;
    });
  }

  function adaptButton(is_on) {

    var hider = $("#remover").get(0);
    var text = $("#clicktarget").get(0);

    if (is_on) {
      // Reset chosen array
      chosen.length = 0;
      // Highlight the link and make the button font bold
      //hider.className ="highlight";
      //text.style.fontWeight = "bold";
    }
    else {
      // Reset the link and the button when all checkboxes are unchecked
      if ($("#swingbox input:checked").length==0) {
       //hider.blur();
       //hider.className ="";
        //text.style.fontWeight = "normal";
      }
    }
  }

  function switchLayer(is_on, id) {
    var i,idx,layer; //count per compatibilità
    count = 0;
    for (i in $.plominoMaps.google.layers){
      if('mapLayers-'+ $.plominoMaps.google.layers[i].name == id){
        layer = $.plominoMaps.google.layers[i];
        idx=i;
        break;
      }
    }

    if(!layer) return;
    // var overlay = $.plominoMaps.google.map.overlayMapTypes.getAt(idx)
    idx=$.plominoMaps.google.map.overlayMapTypes.length;
    if (is_on) { 
      //console.log("setto " + layer.name + " a " + idx);
      $.plominoMaps.google.map.overlayMapTypes.setAt(idx,layer);
    } else {
      //console.log("rimuovo  da " + idx);
      $.plominoMaps.google.map.overlayMapTypes.forEach(function(element,index){
        //console.log(index)
        //console.log(element)
        if(element==layer) $.plominoMaps.google.map.overlayMapTypes.removeAt(index);
       
      });

    }

    adaptButton(is_on);

  }

  function hideAll() {
    $("#swingbox input:checked").each(function(_,el){
      switchLayer(false, el.id);
      chosen.push(el.id);
    })
  }

  function toggleLayers(e) {

    /* Taking care of the clicked target
    *  because every click on a checkbox may also be a button click.
    *  We only need real button clicks here
    */
    var target = e ? e.target : window.event.srcElement;
    if (target.id != "clicktarget") return;

    if (chosen.length > 0 ) {
     /* Make an independent copy of chosen array
     *  since it possibly will be reset.
     */
     var copy = chosen.slice();
     for (var i = 0, m; m = copy[i]; i++) {
       switchLayer(true, m);
       document.getElementById(m).checked = true;
     }
    }
    else {
     hideAll();
    }
  }

});

