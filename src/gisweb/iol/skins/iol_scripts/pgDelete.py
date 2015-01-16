from gisweb.iol.pgReplication import delData

if context.portal_type=="PlominoDocument":
    delData(context)    
