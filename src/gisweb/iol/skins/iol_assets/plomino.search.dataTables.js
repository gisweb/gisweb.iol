/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
    //"sDom": "<'row-fluid'<'span6'><'span6'>r>t<'row-fluid'<'span4'l><'span4'i><'span4'p>>",
    "sDom": "<'row-fluid'<'span12'>r>t<'row-fluid'<'span3'l><'span4'i><'span5'p>>",
    "sPaginationType": "bootstrap",
/*    "aoColumnDefs": [
        {
            "aTargets": ['_all'],
            "bUseRendered": false,
            "fnRender": function (oObj) {
                var cell = oObj.aData[oObj.iDataColumn];
                if (oObj.iDataColumn > 0) {
                    if (findInArray(cell, '<a') == -1) {
                        return '<a href="../' + oObj.aData[0] + '" class="viewlink">' + cell + '</a>';
                    }
                    else
                        return cell;
                }
                else {
                    return '<input disabled=disabled type="checkbox" value="' + oObj.aData[0] + '" />';
                }
            }
        },
        { "aTargets": [0], "bSearchable": false, "bSortable": false, "sWidth": "0" }
    ],
*/
"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ){
    $(nRow).addClass('linkToDocument');
    $(nRow).bind('click',function(){
        window.location='../'+aData[0];
    });
},
    "sServerMethod":"POST",
    'fnServerParams':function(aoData){
        var form_query = {};
        jQuery.each(jQuery('.staticSearch'),function(){
            var query = jQuery(this).serializeZopeQuery();
            form_query = jQuery.extend(form_query,query);
        });
        aoData.push({name:'query', value: JSON.stringify(form_query)});
     },
    'fnServerData': function ( sSource, aoData, fnCallback, oSettings ) {
     oSettings.jqXHR = jq.ajax( {
        'dataType': 'json',
        'type': 'POST',
        'url': sSource,
        'data': aoData,
        'success': fnCallback
      } );
    },
    "oLanguage": {
        "sUrl": "@@collective.js.datatables.translation"
    }
});
var plominoSearchTables = new Array();
$(document).ready(function(){
    $('.dynamicSearch').bind('change',function(event){
        jQuery.each(plominoSearchTables,function(k,table){
            jQuery('#'+table).dataTable().fnDraw();
        });
    });
    $('#avanzata_opt-avanzata').bind('click',function(){
        $('#advancedSearchDiv').toggle();
    });
});