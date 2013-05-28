jQuery.plominoMaps = {"google":{"points":[],"lines":[],"polygons":[]},"gisclient":{"points":[],"lines":[],"polygons":[]}};
 


function showLoading (){

        vScrollPosition = jQuery(document).scrollTop()+150;
        hPosition = parseInt(jq(document).width()/2);

        jQuery("#info-loading").css({
            top: (vScrollPosition),
            left: (hPosition)
        }).fadeIn(200);  
    
    }

    	function refreshHidewhen() {
        	var onsuccess = function(data, textStatus, xhr) {
                jQuery("#info-loading").fadeOut(1000);
            	for (var hw in data)
                	jQuery('.hidewhen-' + hw).css('display', data[hw]?'none':'block');
        	}
 
                showLoading ()
        	jQuery.post('computehidewhens', jQuery('#plomino_form').serialize(), onsuccess, 'json');
    	}





//TEST CONTROLLER DI PAGINA
jQuery(document).ready(function () {


    //HIDEWHEN PORTATI QUI
    jQuery("[data-dhw='dynamicHidewhen']").change(refreshHidewhen);

    jQuery('.wf-actions').bind('click',function(){showLoading();});

   //GENERAZIONE DEL MENU VERTICALE
    if(jQuery('#v-menu-div')){
        addVerticalMenu(jQuery('#v-menu-div'));


   }
   jq('#anc_Azioni').click(function(){
      var d = jq(this).data();
      scrollWin('#' + d['id'],50); 
       return false;
   })

   jQuery('input.decimal').numeric();
   jQuery('input.integer').numeric(false, function() { alert("Solo valori interi"); this.value = ""; this.focus(); });

    jQuery('input.data-uppercase').keyup(function(){
         this.value = this.value.toUpperCase();
    });


 var myOptions = { val1 : 'Suganthar', val2 : 'Suganthar2'};

    $.each(myOptions, function(val, text) {
       $('#combo').append(new Option(text, val));
    });

/*
  //CHOSEN X MULTISELECT E BOOTSTRAP-COMBO
     jQuery('.chzn-select').chosen();
     var v = jQuery('.combobox').combobox({
            source: function(query, process) {
                return ["Deluxe Bicycle", "Super Deluxe Trampoline", "Super Duper Scooter"];
            }
        });

console.log( $('#combo'))


        $('#typeahead').typeahead({
            source: function(query, process) {
                return ["Deluxe Bicycle", "Super Deluxe Trampoline", "Super Duper Scooter"];
            }
        });

*/
 $("#combo").select2();
 $("#multiselect").select2({ maximumSelectionSize: 3 });
 $("#typeahead").select2({
    data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}]
});



//VERIFICA INVIO SE NESSUN CAMPO MANDATORY VUOTO FACCIO COMPARIRE INVIO DOMANDA !!!
  if(true){
  //if(jQuery("div.data-mandatory:visible").length == 0){

    jQuery('#section-message-compilazione').addClass('hidden');
    jQuery('#section-invio-domanda').removeClass('hidden');

    //VESTIZIONE DEL PULSANTE DI INVIO DOMANDA
    jQuery('#btn_invia_domanda').attr('value','Invia Domanda');
    jQuery('#btn_invia_domanda').addClass('btn');
    jQuery('#btn_invia_domanda').attr('disabled','disabled');
    jQuery('input.accettazione').bind('change',function(){
    var send = true;
    jQuery.each(jQuery('input.accettazione'),function(k,v){
        send = send && jQuery(this).is(':checked');
    });

    if (send){
        jQuery('#btn_invia_domanda').removeAttr('disabled');
    }
    else
        jQuery('#btn_invia_domanda').attr('disabled','disabled');
    });
 }



   //GENERAZIONE DATATABLES
    jQuery("table[data-plugin='datatable']").each(function(){
 
      //alert(this.name);

    });

    jQuery('.icon-info-sign').popover();

    
});

function winPopup(id,marker,options){
    var serviceURL = options.baseURL + '/application/services/renderInfoFormMap';
    jQuery.ajax({
                url: serviceURL + '?' + jQuery.param(options.winpopup.params),
                success: function (data) {
                    jQuery.plominoMaps.infowindow.setContent(data);
                    jQuery.plominoMaps.infowindow.open(id, marker)
                }
    })

};


/*---------------------------------------------------------------------------------------------------------------------------*/
/*        Funzione che aggiunge il menu verticale sui plomino Document                                                       */
/*---------------------------------------------------------------------------------------------------------------------------*/
function addVerticalMenu(element){
        var html='';
        html+='<div class="affix">';
	html+='<ul id="v-menu" class="nav nav-list bs-docs-sidenav">';
    
    jQuery('.v-content-title').each(function(k,v){
		var id = jQuery(v).closest('p').attr('id');
		var title = jQuery(v).html();
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

    jQuery('#loader').addClass("loading"); 

    var field_selector = "#" + field_id + "_myeditform";
    jQuery(field_selector).html(
        '<iframe style="width:100%;height:100%"></iframe>'
    );
    var iframe = jQuery("#" + field_id + "_myeditform iframe");

    //jQuery(field_selector).append('<div id="loading-image"><img src="http://iol.vmserver/portal_skins/custom/loading.gif" alt="Loading..." /></div>');return;

    iframe.attr('src', formurl);
    iframe.load(function() {
        var popup;
        var body = iframe[0].contentDocument.body;
        // Edit-form close button
		jQuery("input[name=plomino_close]", body).removeAttr('onclick').click(function() {
			//popup.dialog('close');
                         alert('chiudi a mano che non ho capito come si fa');popup.hide();
		});
		// Edit form submission
		jQuery('form', body).submit(function(){
			var message = "";

			jQuery.ajax({url: this.action+"?"+jQuery(this).serialize(),
				async: false,
				//context: jQuery('#plomino_form'),
				error: function() {
					alert("Error while validating.");
				},
				success: function(data) {
					message = jQuery(data).filter('#plomino_child_errors').html();
					return false;
				}
			});

			if(!(message === null || message === '')) {
				alert(message);
                // Avoid Plone message "You already submitted this form", since we didn't
                jQuery(this).find('input[type="submit"].submitting').removeClass('submitting');
				return false;
			}
			jQuery.get(this.action, jQuery(this).serialize(), function(data, textStatus, XMLHttpRequest){
				// Call back function with new row
				var rowdata = [];
				jQuery('span.plominochildfield', data).each(function(){
					rowdata.push(this.innerHTML);
				});
				var raw = jQuery.evalJSON(jQuery('#raw_values', data).text());
				onsubmit(rowdata, raw);
			});
			//popup.dialog('close');
                        alert('chiudi a mano che non ho capito come si fa');popup.hide();
			return false;
		});
		// Prepare and display the dialog
		jQuery('.documentActions', body).remove();
		//popup.dialog("option", "title", jQuery('.documentFirstHeading', body).remove().text());
		//popup.dialog('open');
                field_selector = "#" + field_id + "_lightbox";
                popup =  jQuery(field_selector).lightbox();
                //jQuery('#loading-image').remove();
                jQuery('#loader').removeClass("loading"); 

	});


}

jQuery.datepicker.setDefaults(jQuery.datepicker.regional['it']);
  
