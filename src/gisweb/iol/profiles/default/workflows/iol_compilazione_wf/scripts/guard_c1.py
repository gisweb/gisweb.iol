## Script (Python) "guard_c1"
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
idoc = IolDocument(doc)
return idoc.wfState() == 'dati'
