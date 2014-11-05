from gisweb.iol.pgReplication import saveData

if context.portal_type=='PlominoDocument':
    saveData(context)