## Script (Python) "guard_vai_dati"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
doc = state_change.object
return doc.wf_getInfoFor('wf_dati')
