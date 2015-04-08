## Script (Python) "after_invia_domanda"
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
from iol.gisweb.savona.IolApp import IolApp
doc = state_change.object
db=context.getParentDatabase()
IolDocument(doc).updateStatus()


#from gisweb.utils import attachThis



#filename = 'accreditamento_%s_%s.pdf' % (doc.getItem('fisica_cognome'), doc.getItem('fisica_nome'))

#modulo_pdf = doc.restrictedTraverse('@@wkpdf').get_pdf_file()
#attachThis(context, modulo_pdf, 'documenti_pdf', filename=filename, overwrite=True)

Object = "Istanze On Line. Richiesta di accreditamento utente"

Text = """Complimenti!
Hai compilato con successo il modulo di ACCREDITAMENTO.
Questo ente ha adottato un sistema che consente ai cittadini ACCREDITATI di compilare via web i tradizionali moduli cartacei, integrarli con gli allegati richiesti ed inviarli per via telematica agli uffici competenti.
Ora che hai compilato e inviato il modulo con successo puoi accedere ai servizi dello Sportello SUAP on line.


Grazie
Cordiali saluti.
"""

IolApp(doc).sendThisMail('richiesta_accreditamento')
