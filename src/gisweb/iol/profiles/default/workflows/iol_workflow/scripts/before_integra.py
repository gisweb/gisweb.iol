## Script (Python) "before_integra"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
#from Products.CMFCore.utils import getToolByName
#from Products.CMFPlomino.Utils import Now,DateToString

#wf = getToolByName(state_change.object, 'portal_workflow') #state_change.workflow
doc = state_change.object
db = doc.getParentDatabase()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

fname = 'integrazione' #%DateToString(Now(),'%d%m%Y')
doc.createPdf(filename=fname)

#INVIO MAIL INTEGRAZIONE
if doc.getItem('iol_tipo_richiesta','')!='integrazione':
    doc.sendThisMail('integra')


#RIMUOVO FLAG DI PRONTA PER INTEGRAZIONE
doc.removeItem('pronta_per_integrazione')

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()
