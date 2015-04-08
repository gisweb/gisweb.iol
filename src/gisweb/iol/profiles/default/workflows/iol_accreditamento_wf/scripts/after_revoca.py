## Script (Python) "after_revoca"
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
IolDocument(doc).revocaUtente()
#doc.revocaUtente(group='Accreditati')
Object = "Istanze On Line. Revoca di accreditamento utente"

Text = """Attenzione!
Da questo momento non più hai accesso ai servizi online del portale per la presentazione di istanze online.

Grazie per la collaborazione.
"""

To = doc.fisica_email

args = (Object, Text, To, None, )

#doc.getParentDatabase().callScriptMethod('app_methods', 'sandMail', *args)
