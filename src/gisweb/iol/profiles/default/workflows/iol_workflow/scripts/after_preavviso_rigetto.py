## Script (Python) "after_preavviso_rigetto"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object
db = doc.getParentDatabase()

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

#INVIO MAIL PREAVVISO RIGETTO
if doc.getItem('iol_tipo_richiesta','')!='integrazione':
    doc.sendThisMail('preavviso_rigetto')
