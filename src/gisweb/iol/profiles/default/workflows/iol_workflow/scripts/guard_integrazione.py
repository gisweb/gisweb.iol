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
return doc.getItem('pronta_per_integrazione',0)
