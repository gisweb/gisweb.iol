## Script (Python) "iol_onOpenDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
"""
Standardizzazione dele operazioni da svolgere all'apertura di una richiesta
"""

db = context.getParentDatabase()
#tipo_domanda = genera_tipo_domanda(plominoDocument.getFormName())
# all'apertura di nuovo documento plominoDocument è un plominoForm
if context.isNewDocument():
    
    if 'rinnovo' == context.naming_manager('tipo_richiesta'):
        parentDocument = db.getDocument(context.REQUEST.get('parentDocument'))
        if parentDocument.naming_manager('tipo_richiesta') != 'periodica':
            return "ATTENZIONE! Non è possibile rinnovare una richiesta NON periodica."
        
        if parentDocument.getItem('numero_rinnovi') == 2:
            return "ATTENZIONE! Non è possibile rinnovare ulteriormente la pratica selezionata!"

return ''
