//TEST CONTROLLER DI PAGINA
jQuery(document).ready(function () {

    jQuery("div[data-plugin='gisclientmap']").each(function(){
        eval("var options = "  + jQuery(this).data('gisclientmapOptions'));
        options.editMode = jQuery(this).data('editMode');
        //Aggiungo il parametro per la configurazione permanente della mappa

        var src = options.url + '&mapsettings=' + this.id + '_settings' + '&mapgeometry=' + this.id + '_geometry';
        if(options.editMode){
             if(options.edit.point) src += '&editpoint=1';
             if(options.edit.line) src += '&editline=1';
             if(options.edit.polygon) src += '&editpolygon=1';
        }

	jQuery(this).html(
		'<iframe width="100%" height="'+options.height+'" src="'+src+'"></iframe>'
	);
    });


});


jQuery.plominoMaps.gisclient.updateMarkerPosition = function(options){

    jQuery.plominoMaps.gisclient.map.gcTools["wktedit"].updateMarkerPosition(options)

}


