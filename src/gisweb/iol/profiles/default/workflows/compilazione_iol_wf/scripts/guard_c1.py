## Script (Python) "guard_c1"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
doc = state_change.object
return doc.wf_getInfoFor('review_state')=='dati_scia' and not doc.wf_getInfoFor('wf_altri_soggetti')
