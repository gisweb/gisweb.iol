## Script (Python) "WFgetWorkflowAttr"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=args=None, wf_id=None
##title=
##

from gisweb.iol import getWorkflowAttr

return getWorkflowAttr(context, args=args, wf_id=wf_id)
