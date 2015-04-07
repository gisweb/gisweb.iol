## Script (Python) "after_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
#script.update_status(state_change)

#from gisweb.utils import sendMail
from iol.gisweb.utils.IolDocument import IolDocument

doc = state_change.object

IolDocument(doc).updateStatus()

#doc.accreditaUtente(group='Accreditati')

Object = "Istanze On Line. Autorizzazione di accreditamento utente"

Text = """Complimenti!
Da questo momento hai accesso a tutti i servizi online del portale e puoi presentare tutti i tipi di istanze online disponibili per ogni servizio.

Grazie per la collaborazione.
"""

#To = doc.fisica_email

#doc.sendMail(Object, Text, To, From='')
