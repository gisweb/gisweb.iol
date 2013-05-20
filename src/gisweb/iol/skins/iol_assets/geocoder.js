jQuery(document).ready(function () {




});



















/**
  Description here
  2011-04-25 / (brad@gowalla.com)
**/
if (typeof (Gowalla) === 'undefined') Gowalla = {};

Gowalla.PageOrComponentName = (function ($) {

  // *-* public methods *-*

  var setup = function () {
    $("#header").click(eventHeaderClicked);
  };

  // *-* utility methods *-*

  var doThing = function (x) {
    return x + x;
  };

  // *-* event methods *-*

  var eventHeaderClicked = function () {
    doThing(this.attr('id'));
  };

  // expose public methods
  return {
    setup: setup
  };
})(jQuery);

jQuery(document).ready(Gowalla.PageOrComponentName.setup);