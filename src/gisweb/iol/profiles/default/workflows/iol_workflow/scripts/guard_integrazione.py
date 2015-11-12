## Script (Python) "guard_integrazione"
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

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)

return doc.getItem('pronta_per_integrazione',0)
