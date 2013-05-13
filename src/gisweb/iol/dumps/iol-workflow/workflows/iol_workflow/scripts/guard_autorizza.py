## Script (Python) "guard_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFCore.utils import getToolByName

doc = state_change.object
db = doc.getParentDatabase()

#Recupero tipologia domanda e applicazione

#tipo_richiesta = doc.getItem('tipo_richiesta','')
#tipo_app = doc.getItem('tipo_app','')

#Recupero Informazioni sul ruolo dell'utente

isRup = doc.verificaRuolo('rup')

#Verificata se:
#1) proroga sempre
#2) Altrimenti solo rup o manager ed è stato salvato il modello di autorizzazione
#if tipo_richiesta=='proroga':
#    return True
#else:
return doc.getItem('documenti_autorizzazione') and isRup
