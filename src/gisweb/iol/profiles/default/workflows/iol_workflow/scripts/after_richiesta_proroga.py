## Script (Python) "after_richiesta_proroga"
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

doc.updateStatus()
#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)