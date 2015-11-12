## Script (Python) "guard_assegna"
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
istr = doc.getItem('istruttore')
prot = doc.getItem('numero_protocollo')

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)

return istr and prot
