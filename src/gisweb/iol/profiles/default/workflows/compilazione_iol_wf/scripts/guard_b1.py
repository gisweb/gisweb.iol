## Script (Python) "guard_b1"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
doc = state_change.object
return doc.wf_getInfoFor('review_state')=='ubicazione_scia' and not doc.wf_getInfoFor('wf_dati')
