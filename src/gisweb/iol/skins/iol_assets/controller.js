$.plominoFormChanged = false;
function showLoading (){

        vScrollPosition = $(document).scrollTop()+150;
        hPosition = parseInt(jq(document).width()/2);

        $("#info-loading").css({
            top: (vScrollPosition),
            left: (hPosition)
        }).fadeIn(200);  
    
    }

    	function refreshHidewhen() {
        	var onsuccess = function(data, textStatus, xhr) {
                $("#info-loading").fadeOut(1000);
            	for (var hw in data)
                	$('.hidewhen-' + hw).css('display', data[hw]?'none':'block');
        	}
 
                showLoading ()
        	$.post('computehidewhens', $('#plomino_form').serialize(), onsuccess, 'json');
    	}





//TEST CONTROLLER DI PAGINA
$(document).ready(function () {
     

    $(".field").bind('change',function(){$.plominoFormChanged=true})
     
    //Combo SELECT2
	 $("select.combobox").select2();

    //HIDEWHEN PORTATI QUI
    $("[data-dhw='dynamicHidewhen']").change(refreshHidewhen);

    $('.wf-actions').bind('click',function(){showLoading();});

   //GENERAZIONE DEL MENU VERTICALE
    if($('#v-menu-div')){
        addVerticalMenu($('#v-menu-div'));


   }
   jq('#anc_Azioni').click(function(){
      var d = jq(this).data();
      scrollWin('#' + d['id'],50); 
       return false;
   })

   $('input.decimal').numeric();
   $('input.integer').numeric(false, function() { alert("Solo valori interi"); this.value = ""; this.focus(); });

    $('input.data-uppercase').keyup(function(){
         this.value = this.value.toUpperCase();
    });






// SE ISTRUTTORE RIMUOVO IL CAPO fisica_email DA data-mandatory

var isIstruttore = ($('#iol-reviewer').val()== '1') || ($('#iol-manager').val()=='1');

if (isIstruttore) {
    $('#fisica_email').removeClass('data-mandatory');
    $('#fisica_email').parents('div:first').find('span.data-mandatory').remove();
}

//VERIFICA INVIO SE NESSUN CAMPO MANDATORY VUOTO FACCIO COMPARIRE INVIO DOMANDA !!!

if($("div.data-mandatory:visible").length == 0){

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



   //GENERAZIONE DATATABLES
    $("table[data-plugin='datatable']").each(function(){
 
      //alert(this.name);

    });

    $('.icon-info-sign').popover();

    
});

function winPopup(id,marker,options){
    var serviceURL = options.baseURL + '/application/services/renderInfoFormMap';
    $.ajax({
                url: serviceURL + '?' + $.param(options.winpopup.params),
                success: function (data) {
                    $.plominoMaps.infowindow.setContent(data);
                    $.plominoMaps.infowindow.open(id, marker)
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
    
    $('.v-content-title').each(function(k,v){
		var id = $(v).closest('p').attr('id');
		var title = $(v).html();
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

    $('#loader').addClass("loading"); 

    var field_selector = "#" + field_id + "_myeditform";
    $(field_selector).html(
        '<iframe style="width:100%;height:100%"></iframe>'
    );
    var iframe = $("#" + field_id + "_myeditform iframe");

    //$(field_selector).append('<div id="loading-image"><img src="http://iol.vmserver/portal_skins/custom/loading.gif" alt="Loading..." /></div>');return;

    iframe.attr('src', formurl);
    iframe.load(function() {
        var popup;
        var body = iframe[0].contentDocument.body;
        // Edit-form close button
		$("input[name=plomino_close]", body).removeAttr('onclick').click(function() {
			//popup.dialog('close');
                         alert('chiudi a mano che non ho capito come si fa');popup.hide();
		});
		// Edit form submission
		$('form', body).submit(function(){
			var message = "";

			$.ajax({url: this.action+"?"+$(this).serialize(),
				async: false,
				//context: $('#plomino_form'),
				error: function() {
					alert("Error while validating.");
				},
				success: function(data) {
					message = $(data).filter('#plomino_child_errors').html();
					return false;
				}
			});

			if(!(message === null || message === '')) {
				alert(message);
                // Avoid Plone message "You already submitted this form", since we didn't
                $(this).find('input[type="submit"].submitting').removeClass('submitting');
				return false;
			}
			$.get(this.action, $(this).serialize(), function(data, textStatus, XMLHttpRequest){
				// Call back function with new row
				var rowdata = [];
				$('span.plominochildfield', data).each(function(){
					rowdata.push(this.innerHTML);
				});
				var raw = $.evalJSON($('#raw_values', data).text());
				onsubmit(rowdata, raw);
			});
			//popup.dialog('close');
                        alert('chiudi a mano che non ho capito come si fa');popup.hide();
			return false;
		});
		// Prepare and display the dialog
		$('.documentActions', body).remove();
		//popup.dialog("option", "title", $('.documentFirstHeading', body).remove().text());
		//popup.dialog('open');
                field_selector = "#" + field_id + "_lightbox";
                popup =  $(field_selector).lightbox();
                //$('#loading-image').remove();
                $('#loader').removeClass("loading"); 

	});


}

$.datepicker.setDefaults($.datepicker.regional['it']);