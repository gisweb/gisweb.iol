## Script (Python) "guard_h1"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
doc = state_change.object

if doc.getItem('iol_tipo_richiesta') in ['fine_lavori','inizio_lavori','integrazione_lavori']:
    return True
else:
    
    return not doc.wf_getInfoFor('wf_presentata')
