## Script (Python) "guard_a1"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change,workflow
##title=
##
from iol.gisweb.utils.IolDocument import IolDocument 
doc = state_change.object
if not doc.isDocument():
    return True

idoc = IolDocument(doc)
return idoc.wfState() == 'richiedenti'
