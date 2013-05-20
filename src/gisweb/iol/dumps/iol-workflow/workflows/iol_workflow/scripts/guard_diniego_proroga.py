## Script (Python) "guard_diniego_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=NON UTILIZZATA
##
return False
doc = state_change.object

return doc.wf_getInfoFor('wf_richiesta_proroga')
