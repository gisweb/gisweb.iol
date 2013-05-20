## Script (Python) "after_invia_domanda"
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

info = doc.naming()

doc.setItem('data_pratica',Now())
# ALLEGO LA RICHIESTA

doc.createPdf(filename='domanda_inviata')


# SETTO ISTRUTTORE PREDETERMINATO

if info['tipo_app'] in ('trasporti', ):
    doc.setItem('istruttore', 'speziarisorse')


# 
db = doc.getParentDatabase()

#Recupero la tipologia della domanda
tipo_domanda = doc.getItem('tipo_richiesta')

if tipo_domanda in ['proroga','rinnovo']:
    tipo_app = doc.getItem('tipo_app','')
    sub_parent_form = doc.getParentDatabase().getForm('sub_%s_parent' % tipo_app)
    
    if sub_parent_form:
        for field in sub_parent_form.getFormFields():
            doc.cloneItem(field.getId())
    
    doc.setItem('Form','frm_%s_base' % tipo_app)

    
# Aggiornamento dello stato su plominoDocument
doc.updateStatus()    

#Se disponibile eseguo la transizione di assegnazione
if 'assegna' in [i['id'] for i in doc.wf_transitionsInfo()]:
    wf = getToolByName(doc, 'portal_workflow') # state_change.workflow
    wf.doActionFor(doc, 'assegna')
