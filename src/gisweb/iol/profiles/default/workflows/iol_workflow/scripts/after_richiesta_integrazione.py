## Script (Python) "after_richiesta_integrazione"
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
doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)
