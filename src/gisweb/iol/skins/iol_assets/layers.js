
$(document).ready(function() {

	var osmMapType = new google.maps.ImageMapType({
						getTileUrl: function (coord, zoom) {
							return "http://tile.openstreetmap.org/" +
						zoom + "/" + coord.x + "/" + coord.y + ".png";
						},
						tileSize: new google.maps.Size(256, 256),
						isPng: true,
						alt: "OpenStreetMap",
						name: "OSM",
						maxZoom: 19
					});
	$.plominoMaps.google.map.mapTypes.set('OSM', osmMapType );

	wmsMapType = new google.maps.ImageMapType({
				alt: "OpenLayers",
				getTileUrl: WMSGetTileUrl,
				isPng: false,
				maxZoom: 17,
				minZoom: 1,
				name: "OpenLayers",
				url: "http://demo.cubewerx.com/cubewerx/cubeserv.cgi?",
				tileSize: new google.maps.Size(256, 256)

	 });
	$.plominoMaps.google.map.mapTypes.set('WMS', wmsMapType );

	sfondoMapType = new google.maps.ImageMapType({
				alt: "Sfondo",
				getTileUrl: WMSGetTileUrl,
				isPng: false,
				maxZoom: 28,
				minZoom: 1,
				name: "Sfondo",
			   // url: " http://iol.provincia.sp.rr.nu/mapcache?PROJECT=siti&MAP=istanze&",
				url: "http://localhost:8080/service?",
				tileSize: new google.maps.Size(256, 256)

	 });
	$.plominoMaps.google.map.mapTypes.set('SFONDO', sfondoMapType );


			$.plominoMaps.google.map.setOptions({
				mapTypeControlOptions: {
					mapTypeIds: [
			  'OSM',
			  'WMS',
					  'SFONDO',
			   google.maps.MapTypeId.ROADMAP
			],
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
				}
			});

});			
			
			
function addlayer(id,options){
    var map=$.plominoMaps.google.map;
              map.overlayMapTypes.setAt(2, new google.maps.ImageMapType({
                    getTileUrl: getGCTileURL,
                    tileSize: new google.maps.Size(256, 256),
                    isPng: true,
                    url:"http://www.cartografiarl.regione.liguria.it/mapserver/mapserv.exe?MAP=E:/Progetti/mapfiles/repertoriocartografico/PIANIFICAZIONE/1047.map&LAYERS=L2624",
                    map:map,
                    name:'mappale'
               }));

}


function WMSGetTileUrl(tile, zoom) {
console.log(zoom)
      var projection = $.plominoMaps.google.map.getProjection();
      var zpow = Math.pow(2, zoom);
      var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
      var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
      var ulw = projection.fromPointToLatLng(ul);
      var lrw = projection.fromPointToLatLng(lr);
      //The user will enter the address to the public WMS layer here.  The data must be in WGS84
      var baseURL = this.url;
      var version = "1.3.0";
      var request = "GetMap";
      var format = "image%2Fjpeg"; //type of image returned  or image/jpeg
      //The layer ID.  Can be found when using the layers properties tool in ArcMap or from the WMS settings 
      var layers = "sfondo";
      //projection to display. This is the projection of google map. Don't change unless you know what you are doing.  
      //Different from other WMS servers that the projection information is called by crs, instead of srs
      var crs = "EPSG:4326"; 
      //With the 1.3.0 version the coordinates are read in LatLon, as opposed to LonLat in previous versions
      var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
      var service = "WMS";
      //the size of the tile, must be 256x256
      var width = "256";
      var height = "256";
      //Some WMS come with named styles.  The user can set to default.
      var styles = "default";
      //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
      var url = baseURL + "Layers=" + layers + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height;
      return url;
  }