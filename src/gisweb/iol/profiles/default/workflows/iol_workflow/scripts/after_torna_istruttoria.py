## Script (Python) "after_torna_istruttoria"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
#Aggiornamento dello stato su plominoDocument
doc = state_change.object
db = doc.getParentDatabase()

doc.removeItem('documenti_autorizzazione')
doc.removeItem('numero_autorizzazione')
doc.removeItem('label_autorizzazione')
doc.removeItem('istruttoria_motivo_sospensione')
doc.removeItem('istruttoria_rigetto_motivazione')

doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)
