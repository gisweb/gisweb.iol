## Script (Python) "after_invia_domanda"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
# dopo l'invio della domanda eseguo la protocollazione
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import Now, StringToDate

doc = state_change.object
db = doc.getParentDatabase()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

#Se disponibile eseguo la transizione di assegnazione
if 'assegna' in [i['id'] for i in doc.wf_transitionsInfo()]:
    wf = getToolByName(doc, 'portal_workflow') # state_change.workflow
    wf.doActionFor(doc, 'assegna')
    

# Aggiornamento dello stato su plominoDocument
doc.updateStatus()
