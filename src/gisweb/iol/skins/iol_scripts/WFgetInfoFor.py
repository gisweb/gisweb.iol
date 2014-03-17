## Script (Python) "WFgetInfoFor"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=arg, wf_id=None, default=None
##title=
##

from gisweb.iol import getInfoFor

return getInfoFor(context, arg, wf_id=wf_id, default=default)