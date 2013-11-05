## Script (Python) "guard_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFCore.utils import getToolByName

doc = state_change.object

isRup = doc.verificaRuolo('iol-manager')

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)

return doc.getItem('documenti_autorizzazione') and isRup
