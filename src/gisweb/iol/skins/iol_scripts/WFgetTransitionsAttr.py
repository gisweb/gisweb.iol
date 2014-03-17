## Script (Python) "WFgetTransitionsAttr"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=args=None, state_id=None, wf_id=None, supported_only=True, as_sorted_list='id', reverse=False
##title=
##

from gisweb.iol import getTransitionsAttr

trnfos = getTransitionsAttr(context, args=args, state_id=state_id, wf_id=wf_id, supported_only=supported_only)

if as_sorted_list:
    trnfos = trnfos.values()
    trnfos.sort(key=lambda v: v.get(as_sorted_list), reverse=not not reverse)

return trnfos