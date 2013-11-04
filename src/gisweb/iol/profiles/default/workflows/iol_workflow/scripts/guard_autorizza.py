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

return doc.getItem('documenti_autorizzazione') and isRup
