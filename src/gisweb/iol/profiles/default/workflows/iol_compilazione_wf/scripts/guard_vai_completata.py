## Script (Python) "guard_vai_completata"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
doc = state_change.object
if doc.getItem('iol_tipo_richiesta') in ['fine_lavori','inizio_lavori','integrazione']:
    return True
else:
    return doc.wf_getInfoFor('wf_completata')
