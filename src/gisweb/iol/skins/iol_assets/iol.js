
(function ($) {

    "use strict";
    //I can pass a plugin name or set the plugin name in element's attributes
    function initializePlugin (){
        var $element = $(this);
        var pluginOptions = $element.data() || {};
        if(typeof(pluginOptions)=='string')  pluginOptions = JSON.parse(pluginOptions.replace(/[\n\r]/g, ''));

        var pluginName = pluginOptions['plugin'];
        //console.log(pluginName)

        //Force select2 plugin from select elements
        if($element.is('select')) pluginName = 'select2';


        if ($.fn.hasOwnProperty(pluginName)){
            $.fn[pluginName].call($element, pluginOptions);
        }
        else{
            console.log ('jQuery Plugin ' + pluginName + ' not found.');
        }

    }

    function addTopNavbar(){

      var html='<div id="top-toolbar-div" class="navbar navbar-fixed-top">';
      html+='<div class="navbar-inner" id="toolbar-top">';
     // html+='<div class="container">';
      html+='<ul class="nav pull-left" id="iol-menus">';
      html+='</ul><ul class="nav pull-right" id="iol-buttons">'
      html+='</ul></div></div>'//</div>';
      $(".plomino_form").append(html);

      $('.v-content-title').each(function(k,v){
        var title = $(v).attr('title');
        if(title) 
          $("#iol-menus").append('<li><a anchor="' + title + '" >' + title + '</a></li>')
      });

      $('.iol-control-buttons > input').each(function(k,v){
        $(v).addClass("btn btn-inverse").appendTo("#iol-buttons")
      });

      $('#iol-menus a').click(function(e){
        e.preventDefault();
        var target = $("[title='" + $(this).attr("anchor") + "']");  
        var offset = 50;
        console.log(target)
        if(target)
          $('html, body').animate({scrollTop: target.offset().top - offset}, 500);  
      });

    }


    function addMandatory(){
        var label = $("label[for='"+$(this).attr('id')+"']");
        label.addClass("mandatory");
    }

    function addTooltip(label, message){
        var icon = $(' <i class="icon-info-sign"></i> ' );
        label.append(icon);
        icon.tooltipster({
            delay:200,
            animation: 'fade',
            contentAsHTML: true,
            content: message
        });
        label.on("mouseover",function(){icon.tooltipster('show')});
        label.on("mouseout",function(){icon.tooltipster('hide')})
    }

    $(function () {

        //AGGIUNGO LA CLASSE POI SAREBBE MEGLIO SOSTITUIRE NEL TEMPLATE ID CON CLASS
        $("#content").addClass("container-fluid");
        //$("#plomino_form").addClass("plomino_form");

        //PER BOOTSTRAP 3
        //$("input").addClass("form-control");
        //$("*[data-plugin]").removeClass("form-control");
        //$("table").removeClass("dataTable");
        //$("table").addClass("display table-bordered table plominoview")
        $(".add-row").addClass("btn");
        $(".edit-row").addClass("btn");
        $(".delete-row").addClass("btn");
        //$("input:file").addClass("btn")


//class read input-xlarge uneditable-input


        //select2 plugin
        $('.plomino_form select').each(initializePlugin);

        //custom plugins
        $("*[data-plugin]").each(initializePlugin);

        //tooltips
        $("*[data-tooltip]").each(function(){
            addTooltip($("label[for='"+$(this).attr('id')+"']"),$(this).data("tooltip"));
        });

        //mandatory for sending
        $("*[data-mandatory]").each(addMandatory);


        //SE C'E' LA PULSANTIERA AGGIUNGO LA BARRA IN ALTO
        if($('.iol-control-buttons').length > 0) addTopNavbar();


        //INIZIALIZZO TUTTO IL CONTENUTO DEL DIALOG DOPO AVER APERTO IL DIALOG DEL DATAGRID
        $(document).on('opendialog',function(_, container){
            $(container).addClass("plomino_form");
            $(container).find('select').each(initializePlugin);
            $(container).find("*[data-mandatory]").each(addMandatory)
            setTimeout(function() { $(container).find("*[data-plugin]").each(initializePlugin) }, 100)
            $(container).find("*[data-tooltip]").each(function(){
                addTooltip($(container).find("label[for='"+$(this).attr('id')+"']"),$(this).data("tooltip"));
            });
        });



    });





})(jQuery);


