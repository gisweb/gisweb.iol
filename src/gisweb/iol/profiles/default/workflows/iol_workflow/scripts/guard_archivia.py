## Script (Python) "guard_archivia"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object
from Products.CMFPlomino.PlominoUtils import Now
db = doc.getParentDatabase()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)


# disponibile dopo la scadenza della richiesta
return doc.getItem('autorizzata_al') < Now()

#isIstruttore = doc.verificaRuolo('istruttore')

#return isIstruttore and isExpired
