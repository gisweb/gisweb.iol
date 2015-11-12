## Script (Python) "protocollaInvia"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

if context.portal_type!='PlominoDocument':
    context.REQUEST.RESPONSE.redirect(context.absolute_url())

from Products.CMFCore.utils import getToolByName
wf = getToolByName(context, 'portal_workflow') #state_change.workflow
tr_ids = [i['id'] for i in wf.getTransitionsFor(obj=context, container=None, REQUEST=None)]

next_tr = 'protocolla'
if next_tr in tr_ids:
    wf.doActionFor(context, next_tr)

context.updateStatus()
db = context.getParentDatabase()
urlAction='%s/content_status_modify?workflow_action=invia_domanda' %(context.absolute_url())
context.REQUEST.RESPONSE.redirect(urlAction)