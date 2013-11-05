## Script (Python) "after_sospendi"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

#INVIO MAIL SOSPENSIONE
if doc.getItem('tipo_richiesta','')!='integrazione':
    doc.sendThisMail('sospendi')
