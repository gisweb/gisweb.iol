## Script (Python) "doAction"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=action=''
##title=
##
from Products.CMFCore.utils import getToolByName

wf = getToolByName(context, 'portal_workflow')

if action in [tr['id'] for tr in wf.getTransitionsFor(context)]:
    wf.doActionFor(context, action)
#context.REQUEST.RESPONSE.redirect(context.absolute_url())
