## Script (Python) "WFStateInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=args=None, state_id=None, wf_id=None
##title=
##

from gisweb.iol import getStateAttr

return getStateAttr(context, args=args, state_id=state_id, wf_id=wf_id)