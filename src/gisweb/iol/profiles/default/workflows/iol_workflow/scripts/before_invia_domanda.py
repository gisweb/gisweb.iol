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
tipo_app = doc.getItem('tipo_app','')

if tipo_app in ('trasporti', ):
    doc.setItem('istruttore', 'ufficio_trasporti')


# Se nel pDb esiste lo script: beforeinvioDomanda allora lo eseguo

if 'before_invia_domanda' in db.resources.keys():
    db.resources.before_invia_domanda(doc)
