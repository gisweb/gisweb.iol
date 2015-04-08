## Script (Python) "before_invia_domanda"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from iol.gisweb.utils.IolDocument import IolDocument

doc = state_change.object

IolDocument(doc).accreditaUtente()

# aggiorna lo stato del documento
IolDocument(doc).updateStatus()
