## Script (Python) "frm_onSaveDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, backToParent=False
##title=IOL onSaveDocument event common actions
##
from Products.CMFPlone.utils import normalizeString
from Products.CMFPlomino.PlominoUtils import Now,DateToString
"""
Standardizzazione dele operazioni da svolgere al salvataggio di una istanza
child_events: True o False (lancia gli script di gestione dell'uno a molti)
backToParent: False o True o 'anchor'
"""

# ON OPEN WITH FORM
items = context.getItems()
if 'oForm' in items:
    oFormName = context.getItem('oForm')
    # previene l'associazione di un form inesistente
    if context.getParentDatabase().getForm(oFormName):
        context.setItem('Form', oFormName)
    context.removeItem('oForm')
    if 'first' in items:
        res = context.naming()
        context.setItem('iol_tipo_app',res['iol_tipo_app'])
        context.setItem('iol_tipo_richiesta',res['iol_tipo_richiesta'])
        context.setItem('iol_tipo_pratica',res['iol_tipo_pratica'])
        #context.removeItem('first')
        context.setTitle('%s istanza n. %s del %s' %(context.getForm().Title(),context.getItem('numero_pratica',''),DateToString(Now(),'%d/%m/%Y')))


# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if child_events == True:
    context.event_onSaveChild(backToParent=backToParent)

if not 'oForm' in items and 'first_step' in items:
    context.removeItem('first_step')
    context.removeItem('plominoredirecturl')    

# Se è stata sospesa, al salvataggio setto un item che abiliti la transizione di integrazione
if context.wf_getInfoFor('review_state') == 'sospesa':
    context.setItem('pronta_per_integrazione', 1)


# EVENTI DI WORKFLOW

def doActionIfAny(doc):
    """
    Esegue le transizioni del workflow che devono essere eseguite al salvataggio della pratica
    """
    from Products.CMFCore.utils import getToolByName
    pw=getToolByName(doc,'portal_workflow')

    actions = [i['id'] for i in pw.getTransitionsFor(doc) if i['id'] in pw.getInfoFor(doc, 'transition_on_save')]

    if actions:
        pw.doActionFor(doc,actions[0])

doActionIfAny(context)
