
(function ($) {


        /*var wfdata = {
            "base_url":  "/istanze/iol_praticaweb_demo/0007-2015/content_status_modify?workflow_action=",
            "forms": [
                {'label':'Richiedenti','action':'vai_richiedenti','class':''},
                {'label':'Ubicazione','action':'vai_ubicazione','class':''},
                {'label':'Dati Pratica','action':'vai_dati','class':''},
                {'label':'Altri Soggetti','action':'vai_altri_soggetti','class':''},
                {'label':'Allegati','action':'vai_allegati','class':''},
                {'label':'Oneri','action':'vai_oneri','class':'disabled'},
                {'label':'Riassunto Finale','action':'vai_completata','class':'disabled'}
            ]
        }*/




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

  function addTopToolbar(element){
     
     var html='';
     html+='<div class="navbar-inner" id="toolbar-top">';
     html+='<div class="container">';
     html+='<ul class="nav pull-left">';

     $('.v-content-title').each(function(k,v){
      var id = $(v).attr('id');
      if(id) html+='<li><a id="anc_'+id+'" href="#'+id+'" data-id="'+id+'">' + id+ '</a></li>';
    });
     html+='</ul></div></div>';
     element.html(html);
     element.addClass('navbar navbar-fixed-top');


     $('#top-toolbar-div a').click(function(){
        var d = $(this).data();
        scrollWin('#' + d['id'],element.height()+50); 
         return false;
       })
  }

  function addTopToolbarMenu(element){  
        //Azioni Edit Save Cancel Delete
    var html = '<div class="btn-group pull-right" id="form_button">';
    $.each($('#btn-group > input'),function(k,v){        
        html += '<button class="btn btn-info" data-name="' + $(v).attr('name') + '">' + $(v).val() + '</button>';
    });
    html += '</div>';
    $('#'+element + ' div.container').append(html);
    $.each($('#form_button button'),function(k,v){
        var d=$(v).data();
        $(v).bind('click',function(event){
          event.preventDefault();
          var btn = $("input[name='" + d['name'] + "']");
          btn.trigger('click');
          btn.attr("disabled", "disabled");
          window.setTimeout(function(){btn.removeAttr('disabled')},1000);
        })
    });
  }

  function addWFToolbar(element, wfdata){


     var frm;
     for(var i=0;i<wfdata.forms.length;i++){
         frm = wfdata.forms[i];
         $("#iol-menus").append('<li class="' + frm.class + '"><a href="' + wfdata.base_url + frm.action + '" >' + frm.label + '</a></li>');
     }
      console.log($("#iol-menus"));


      // $('#iol-menus a').click(function(e){
      //   e.preventDefault();
      //   var target =  wfdata . $(this).attr("anchor");
      //   console.log(target);
      // });



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
    
/*

    // aggiunge l'attributo data-dhw=1 a tutti gli input radio con lo stesso name
    $( document ).ready(function() {
        var radio = $("input:radio,checkbox").filter("[data-dhw=1]");        
        $.each(radio,function(i,v){
            var nome = v['name'];            
            $("[name="+ "'" + nome + "'" + "]").each(function(){$(this).attr('data-dhw',1)});          
            
        });
    });

    // aggiunge l'attributo iol-hw=nome del hw a tutti gli input radio con lo stesso name
    $( document ).ready(function() { 

        var radio_hw = $("input:radio[data-dhw]");        
        $.each(radio_hw,function(i,v){
            var attr_name = $(this).attr('data-dhw');
            var nome_hw = v['name'];            
            $("[name="+ "'" + nome_hw + "'" + "]").each(function(){$(this).attr('data-dhw',attr_name)});          
            
        });
    });

    // aggiunge l'attributo iol-hw=nome del hw a tutti gli input radio con lo stesso name
    $( document ).ready(function() { 

        var radio_hw = $("input:radio[hw_value]");        
        $.each(radio_hw,function(i,v){
            var attr_name = $(this).attr('hw_value');
            var nome_hw = v['name'];            
            $("[name="+ "'" + nome_hw + "'" + "]").each(function(){$(this).attr('hw_value',attr_name)});          
            
        });
    });

    
*/
    

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

        //CAMPI NUMERICI
        $('input.NUMBERField-FLOAT').numeric();
        $('input.NUMBERField-DECIMAL').numeric();
        $('input.NUMBERField-INTEGER').numeric(false, function() { alert("Solo valori interi"); this.value = ""; this.focus(); });


        //SE È DEFINITO L'OGGETTO WORKFLOW DI MARCO AGGIUNGO LA NAVBAR
        if(typeof(wfdata)=='object') addWFToolbar('top-toolbar-div',wfdata);



    });




    // hide when dinamico prevede che siano inseriti nel campo html5 attribute gli attributi:
    // 'iol-hw=hw_no_...'  e  'hw_value=valore'
    // è comodo da usare quando è solo uno l'hide when da cui dipende il campo
    $( document ).ready(function() {

       if($('#btn-group').length > 0) addTopToolbarMenu('top-toolbar-div');
       
//?????????????????????????????????????????????????????????????????????

 

    // se presente in code_mirror: btn_hw_dg=['add','edit','delete'] 
    // rimuove i pulsanti del datagrid
    var dg_hw = $("input[btn_hw_dg]"); 
        $.each(dg_hw,function(i,v){
          console.log($(this).attr('btn_hw_dg'));
          var name_dg = $(this).attr('name');          
          var array_btn = eval($(this).attr('btn_hw_dg'));
          $.each(array_btn,function(i,v){              
              $("#" + name_dg + "_" + v + "row").attr("style","display:none")  
          })

        });      
   




   /* 
    var elementi = $("div[class*='span']");
    $.each(elementi,function(){
        
        if ($(this).children().eq(1).hasClass('TEXTFieldRead-TEXT')){
            
            $(this).children().removeClass('label');
            $(this).children().addClass('label1');
            $(this).children().next().addClass('readonly');
        }

        else if ($(this).children().eq(1).hasClass('TEXTFieldRead-TEXTAREA')){
            
            $(this).children().removeClass('label');
            $(this).children().addClass('label1');
            $(this).children().next().addClass('readonly');
             
        }
        else if ($(this).children().hasClass('label')){
            $(this).children().removeClass().addClass('label1');
            if ($(this).children().next().hasClass('label1')){
                $(this).children().next().addClass('readonly');
            }
            
        }
        else if ($(this).children().hasClass('fieldset')){
           //if ($(this).children().children().hasClass('select-field')){
            
               $(this).children().children().removeClass('legend').addClass('label1')
            //} 
                     

        }         

    });

*/
 

           






  /*if ($('form[name]').length > 0){
    $("#portal-column-content").removeClass().addClass("span12")
    $(".portlet").remove();
    $(".managePortletsLink").remove();
    $("#portal-columns").removeClass().addClass('container-fluid');
    $("#portal-columns").attr("style",'margin-top:80px');
    $("div .remove-class-wf").removeClass()
  } */

  




      
      var html='<div id="top-toolbar-div" class="navbar navbar-fixed-top">';
      html+='<div class="navbar-inner" id="toolbar-top">';
     // html+='<div class="container">';
      html+='<ul class="nav pull-left" id="iol-menus">';
      html+='</ul><ul class="nav pull-right" id="iol-buttons">'
      html+='</ul></div></div>'//</div>';

      $("#renderedForm").append(html);


      if(typeof(wfdata)=='undefined'){
        $('.v-content-title').each(function(k,v){
          var title = $(v).attr('title');
          if(title) 
            $("#iol-menus").append('<li><a anchor="' + title + '" >' + title + '</a></li>')
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
      $('.iol-control-buttons > input').each(function(k,v){
        $(v).addClass("btn btn-inverse").appendTo("#iol-buttons")
      });


      $('input[uppercase=1]').keyup(function(){
         this.value = this.value.toUpperCase();
     });







  $("#edit-bar").addClass("row-fluid");




 $("select[name^=modello]").each(function(){
      var href = $('#btn_' + this.name).attr('href');
      $('#btn_' + this.name).attr('data-href',$('#btn_' + this.name).attr('href'));
      $('#btn_' + this.name).removeAttr('href');
      $('#btn_' + this.name).off('click');
      $(this).bind('change',function(){
         var baseHref =  href;
         var v =  this.id;
         var field = 'documenti' + v.substring(v.indexOf('_'));

        if($(this).val()){
           var url = baseHref + '&model=' + $(this).val();
           $('#btn_' + this.name).attr('href', url);
           $('#btn_' + this.name).on('click');
           $('#btn_' + this.name).removeAttr('disabled');
        }
        else{
           $('#btn_' + this.name).off('click');
           //$('#btn_' + this.name).attr('href', baseHref);
           $('#btn_' + this.name).removeAttr('href');
           $('#btn_' + this.name).attr('disabled','disabled');
        }
    });
   });



//VERIFICA INVIO SE NESSUN CAMPO MANDATORY VUOTO FACCIO COMPARIRE INVIO DOMANDA !!!

  if($("div.data-mandatory:visible").length == 0 || $("input.data-mandatory:visible").length == 0){

      $('#section-message-compilazione').addClass('hidden');
      $('#section-invio-domanda').removeClass('hidden');


//VESTIZIONE DEL PULSANTE DI INVIO DOMANDA
      $('#btn_invia_domanda').attr('value','Invia Domanda');
      $('#btn_invia_domanda').addClass('btn');
      $('#btn_invia_domanda').attr('disabled','disabled');

      $('input.accettazione').bind('change',function(){
      var send = true;
      $.each($('input.accettazione'),function(k,v){


          send = send && $(this).is(':checked');
      });

      if (send){
          $('#btn_invia_domanda').removeAttr('disabled');

      }
      else
          $('#btn_invia_domanda').attr('disabled','disabled');
      });
   }

// form dei pagamenti


var formName=$('input[name="Form"]').val();
if (formName=='iol_pagamenti_online'){
    $('#btn_pagamento').bind('click',function(event){
        event.preventDefault();
        
        var frm=$('form[name="iol_pagamenti_online"]');
        frm.attr('action',$(this).attr('data-href'));
        frm.attr('method','POST');
        frm.submit();
    });
}
    

// skins per filed upload/multiupload
  /*var urlImg = window.location.origin + '/images/upload.png'; 
    
  var classFile ='<input class="file" style="display: inline; width: 250px">';
  var iconFile = '<div style="width: 32px; height: 32px; display: inline; position: absolute; overflow: hidden; background:url(' + urlImg + ') 100% 50% no-repeat;">';
  $("input[type=file]").before(classFile);
  $("input[class=file]").after(iconFile);*/

});


})(jQuery);


