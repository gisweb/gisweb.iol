/*--------------------------------------------------------------------------------------------------------------------------*/
function scrollWin(anc,offset){ 
    target = $(anc);   
    $('html, body').animate({  
        scrollTop: target.offset().top - offset
    }, 500);  
}  

/*---------------------------------------------------------------------------------------------------------------------------*/
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

function addBottomToolbar(element){

   var html='';
   html+='<div class="navbar-inner" id="toolbar-bottom">';
   html+='<div class="container">';
   html+='<ul class="nav pull-left">';

   $('.v-content-title').each(function(k,v){
		var id = $(v).attr('id');
		if(id) html+='<li><a id="anc_'+id+'" href="#'+id+'" data-id="'+id+'">' + id+ '</a></li>';
	});
   html+='</ul></div></div>';
   element.html(html);
   element.addClass('navbar navbar-fixed-bottom');


   $('#bottom-toolbar-div a').click(function(){
      var d = $(this).data();
      scrollWin('#' + d['id'],element.height()+50); 
       return false;
     })
}

/*---------------------------------------------------------------------------------------------------------------------------*/
/*
function addTopToolbarActions(element){
	var  html = '<ul class="nav pull-right">';
        html += '<li><button class="btn btn-info" type="button">Salva</button></li>';
        html += '<li><button class="btn btn-info" type="button">Annulla</button></li>';
        html += '</ul>';
}
*/
function addTopToolbarMenu(element){
        //Azioni di WorkFlow
/*
        var  html = '<ul class="nav pull-right">';
	html += '<li class="dropdown">';
        html += ''
	html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Azioni<b class="caret"></b></a>';
	html += '<ul class="dropdown-menu" id="dropdown-menu">';
	$.each($('#btn-workflow > input'),function(k,v){
	    html += '<li class="no-circle"><a href="#" data-name="' + $(v).attr('name') + '">' + $(v).val() + '</a></li>';
        });
	html += '</ul>';
	html += '</li>';
	html += '</ul>';
	$('#'+element + ' div.container').append(html);
	$.each($('ul#dropdown-menu a'),function(k,v){
		var d=$(v).data();
		$(v).bind('click',function(event){
			event.preventDefault();
			$("input[name='" + d['name'] + "']").trigger('click');
		})
	});
*/
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
/*---------------------------------------------------------------------------------------------------------------------------*/

//GENERAZIONE TOOLBAR TOP
$(document).ready(function(){
    if($('#top-toolbar-div')){
        addTopToolbar($('#top-toolbar-div'));
	//addTopToolbarActions('top-toolbar-div');
	addTopToolbarMenu('top-toolbar-div');
   }
    if($('#bottom-toolbar-div')){
        addBottomToolbar($('#bottom-toolbar-div'));
	//addTopToolbarActions('top-toolbar-div');
	addTopToolbarMenu('bottom-toolbar-div');
   }
   $('#btn-group').hide(); 
});




!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')

    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {


        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {

            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + self.$scrollElement.scrollTop(), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i
console.log(targets)
console.log(activeTarget)


        if (scrollTop >= maxScroll) {


          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }
        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')
        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);