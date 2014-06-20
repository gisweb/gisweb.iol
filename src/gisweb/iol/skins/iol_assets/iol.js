
(function ($) {


    //Little plugin for mandatory function
    $.fn.iolMandatory = function( options ) {
        return this.each(function() {
            var label = $("label[for='"+$(this).attr('id')+"']");
            label.addClass("mandatory");
        });
    }


    //I can pass a plugin name or set the plugin name in element's attributes
    function initializePlugin (){
        var $element = $(this);
        var pluginOptions = $element.data() || {};
        if(typeof(pluginOptions)=='string')  pluginOptions = JSON.parse(pluginOptions.replace(/[\n\r]/g, ''));

        var pluginName = pluginOptions['plugin'];
        console.log(pluginName)

        //Force select2 plugin from select elements
        if($element.is('select')) pluginName = 'select2';


        if ($.fn.hasOwnProperty(pluginName)){
            $.fn[pluginName].call($element, pluginOptions);
        }
        else{
            console.log ('jQuery Plugin ' + pluginName + ' not found.');
        }

    }

    function addSendMandatoryClass(){

        console.log(this)

    }

    $(function () {
        //select2 plugin
        $('.plomino_form select').each(initializePlugin);
        $(document).on('popupLoaded',function(_, container){
            $(container).find('select').each(initializePlugin)
        })

        //custom plugins
        $("*[data-plugin]").each(initializePlugin);
        $(document).on('popupLoaded',function(_, container){
             setTimeout(function() { $(container).find("*[data-plugin]").each(initializePlugin) }, 100)
        })

        //mandatory for sending
        $("*[data-send-mandatory='true']").each(initializePlugin);
        $(document).on('popupLoaded',function(_, container){
            $(container).find("*[data-send-mandatory='true']").each(initializePlugin)
        })




       //maps = $('#mappa_1').iolGoogleMap.getMap();
        //console.log(maps)



    });





})(jQuery);


