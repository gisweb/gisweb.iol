
/*
 * Inline Editing : compute row as inline Form.
 * - oTable: JQuery DataTables object (returned by the initialisation method)
 * - field_id : field_id to get raw values
 * - formul : url to get edit fields 
 */
function datagrid_edit_inline_form( oTable, field_id, formurl )
{
    var nRow = datagrid_get_selected_row(oTable);
    if ( nRow ) {
        var jqTds = $('>td', nRow);
        var row_index = oTable.fnGetPosition(nRow)  

        var field_data = $.evalJSON( $('#' + field_id + '_gridvalue').val() );
        var row_data = field_data[row_index];
        
        formurl += '&Plomino_datagrid_rowdata=' + $.URLEncode($.toJSON(row_data));

        $.getJSON( formurl, function( data ) 
        {
            for (var i = 0; i < data.length; i++) {
                 $( jqTds[i] ).html( data[i] );
            };
            jqTds[jqTds.length-1].innerHTML += "<button class='btn save' href='#' >Salva</button>   <button class='btn cancel' href='#'>Annulla</button>";
        });

        var addBtnId = oTable.fnSettings().sTableId.replace('_datagrid','_addrow');
        $('#'+addBtnId).hide();
    }
    else {
        alert('You must select a row to edit.');
    }
    return nRow;
}

/*
 * Inline Editing  : save the row.
 * - oTable: JQuery DataTables object (returned by the initialisation method)
 * - nRow : row
 * - field_id : field id of the datagrid Field
 * - form_url : url to use for Ajax
 */
function datagrid_save_inline_row ( oTable, nRow, field_id, form_url ) {

    var jqFields = $('input,textarea,select',nRow);
    var jqTds = $('>td', nRow);
    var url = form_url+"&"+jqFields.serialize();

    $.get(url,function(data)
    {
        message = $(data).filter('#plomino_child_errors').html();
        if(message===null || message==='')
        {
            var row_index = oTable.fnGetPosition(nRow)
            
            // from response
            var row_data = $('span.plominochildfield', data).map(function(d,el){ return el.innerHTML });
            var raw_values = $.evalJSON($('#raw_values', data).html().trim());
            
            //update field_data
            var field = $('#' + field_id + '_gridvalue');
            var field_data= $.evalJSON(field.val());
            field_data[row_index] = $.evalJSON($('#raw_values', data).html().trim());
            field.val($.toJSON(field_data));

            //update datatable
            for (var i=0;i<row_data.length;i++) {
                var cell_data =  row_data[i];
                if(cell_data.replace("\n","").trim()!="" && $(cell_data)!=null && $(cell_data).hasClass('TEXTFieldRead-TEXTAREA')) {
                    cell_data = $(cell_data).html();                
                }
                oTable.fnUpdate( cell_data, nRow, i, false );
            } 
            
            oTable.fnDraw();
            var addBtnId = oTable.fnSettings().sTableId.replace('_datagrid','_addrow');
            $('#'+addBtnId).show();
            return true;
        }
        else
        {
            alert(message);
            return false;
        }
    });
}

/*
 * Inline Editing : add form with empty values to the datagrid.
 * - oTable: JQuery DataTables object (returned by the initialisation method)
 * - fields : needed fields to render the form 
 */
function datagrid_add_inline_row( oTable, fields) {

    var aiNew = oTable.fnAddData( [ fields.map(function(){ return '' }) ] );
    var nRow = oTable.fnGetNodes( aiNew[0] );
    var jqTds = $('>td', nRow);
    for ( var i=0, iLen=jqTds.length ; i<iLen ; i++ ) {
        $(jqTds[i]).html(fields[i]);
    }
    jqTds[jqTds.length-1].innerHTML += "<button class='btn save' href='#' >Aggiungi</button>   <button class='btn cancel' href='#'>Annulla</button>";
    
    $('table.dataTable select').select2();

    var addBtnId = oTable.fnSettings().sTableId.replace('_datagrid','_addrow');
    $('#'+addBtnId).hide();
    return nRow;

}

/*
 * Inline Editing : restore row as a normal datatable row.
 * - oTable: JQuery DataTables object (returned by the initialisation method)
 * - nRow : row
 */
function datagrid_restore_row( oTable, nRow ) {

    function isEmpty(data){
        for (var i = 0; i < data.length; i++) {
            if(data[i]!="") return false;
        }
        return true;
    }

    var aData = oTable.fnGetData(nRow);
    if (aData) {
    if ( isEmpty(aData) ) { oTable.fnDeleteRow(nRow) }
    else {
        var jqTds = $('>td', nRow);
        for ( var i=0, iLen=jqTds.length ; i<iLen ; i++ ) {
            oTable.fnUpdate( aData[i], nRow, i, false );
        }
    }
    }
    oTable.fnDraw();

    var addBtnId = oTable.fnSettings().sTableId.replace('_datagrid','_addrow');
    $('#'+addBtnId).show();
} 
