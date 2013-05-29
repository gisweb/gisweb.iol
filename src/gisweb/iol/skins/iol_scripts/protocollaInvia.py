## Script (Python) "protocollaInvia"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

from Products.CMFPlomino.PlominoUtils import Now,StringToDate
from Products.CMFCore.utils import getToolByName

doc = context
if doc.portal_type!='PlominoDocument':
    context.REQUEST.RESPONSE.redirect(context.absolute_url())

db = doc.getParentDatabase()

# Dopo la protocollazione  se possibile avviene l'assegnazione
wf = getToolByName(doc, 'portal_workflow') #state_change.workflow
next_tr = 'protocolla'
wf.doActionFor(doc, next_tr)

doc.updateStatus()
urlAction='%s/%s/content_status_modify?workflow_action=invia_domanda' %(db.absolute_url(),doc.getId())
context.REQUEST.RESPONSE.redirect(urlAction)
