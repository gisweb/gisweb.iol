## Script (Python) "after_protocolla"
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


#Aggiornamento dello stato su plominoDocument
doc.updateStatus()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

# Dopo la protocollazione  se possibile avviene l'assegnazione
wf = getToolByName(state_change.object, 'portal_workflow') #state_change.workflow

next_transitions = wf.getTransitionsFor(state_change.object)
next_tr = 'assegna'

if next_tr in [i['id'] for i in next_transitions]:
    wf.doActionFor(state_change.object, next_tr)
