## Script (Python) "before_proroga"
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
db = doc.getParentDatabase()

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
    doc.setItem('autorizzata_al',proroga.getItem('autorizzata_al'))
    wf = getToolByName(proroga, 'portal_workflow')
    next_transitions = wf.getTransitionsFor(proroga)
    next_tr = 'autorizza'
    # Autorizzazione del documento figlio
    if next_tr in [i['id'] for i in next_transitions]:
        wf.doActionFor(proroga, next_tr)
        proroga.copiaPerProroga()
    if 'proroga' in doc.getItem('iol_tipo_pratica'):
        proroga.delete(REQUEST={}) # specifico una REQUEST vuota per evitare il redirect indesiderato

#INVIO MAIL ISTANZA PROROGATA
#doc.inviaMail(tipo='rigetto')
