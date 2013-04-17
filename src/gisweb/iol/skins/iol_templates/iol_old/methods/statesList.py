## Script (Python) "statesList"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO: usare plominoDocument.wf_statesInfo(state_id=None, single=False)
##
"""
DEPRECATED! usare plominoDocument.wf_statesInfo(state_id=None, single=False) al suo posto.
Nel caso specifico per avere lo stesso risultato: ['%(id)s|%(title)s' % i for i in plominoDocument.wf_statesInfo(state_id=None, single=False)]
"""

return ['%(id)s|%(title)s' % x for x in context.wf_statesInfo(state_id=None, single=False)]

from Products.CMFCore.utils import getToolByName
wf = getToolByName(context,'portal_workflow')
result=[]
for i in wf.iol_workflow.states:
    status = getToolByName(wf.iol_workflow.states, i)
    result.append('%s|%s' %(getattr(status,'title'),i))
return result
