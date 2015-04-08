## Script (Python) "after_ripristina"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
#script.update_status(state_change)
from iol.gisweb.utils.IolDocument import IolDocument

doc = state_change.object

IolDocument(doc).updateStatus()
IolDocument(doc).accreditaUtente()
