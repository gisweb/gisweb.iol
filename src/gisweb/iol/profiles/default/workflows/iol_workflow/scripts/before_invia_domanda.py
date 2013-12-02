## Script (Python) "before_invia_domanda"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
# dopo l'invio della domanda eseguo la protocollazione
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import Now, StringToDate

doc = state_change.object

db = doc.getParentDatabase()

doc.setItem('data_pratica',Now())
# ALLEGO LA RICHIESTA

doc.createPdf(filename='domanda_inviata')


# SETTO ISTRUTTORE PREDETERMINATO
iol_tipo_app = doc.getItem('iol_tipo_app','')

if iol_tipo_app in ('trasporti', ):
    doc.setItem('istruttore', 'ufficio_trasporti')


#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)
