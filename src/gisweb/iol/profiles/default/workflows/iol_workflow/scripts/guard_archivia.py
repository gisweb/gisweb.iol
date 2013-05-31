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


# disponibile dopo la scadenza della richiesta
isExpired = doc.getItem('autorizzata_al') < Now()

isIstruttore = doc.verificaRuolo('istruttore')

return isIstruttore and isExpired
