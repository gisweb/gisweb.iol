## Script (Python) "after_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=NON UTILIZZATA
##
return None
doc = state_change.object

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

# Dopo che la pratica è stata prorogata posso rimuovere il documento di proroga e il doclink relativo
db = doc.getParentDatabase()
idx = db.getIndex()
for br in idx.dbsearch(dict(parentDocument=doc.getId)):
    proroga = br.getObject()
    if 'proroga' in proroga.getItem('tipo_richiesta'):
        proroga.delete(REQUEST={}) # specifico una REQUEST vuota per evitare il redirect indesiderato

doc.convertToPDF(file_type='documenti_proroga')    
#INVIO MAIL ISTANZA PROROGATA
#doc.inviaMail(tipo='rigetto')
