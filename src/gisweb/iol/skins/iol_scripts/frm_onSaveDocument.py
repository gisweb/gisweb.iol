## Script (Python) "iol_onSaveDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, backToParent=False
##title=IOL onSaveDocument event common actions
##

"""
Standardizzazione dele operazioni da svolgere al salvataggio di una istanza
child_events: True o False (lancia gli script di gestione dell'uno a molti)
backToParent: False o True o 'anchor'
"""

# ON OPEN WITH FORM

if 'oForm' in context.getItems():
    oFormName = context.getItem('oForm')
    # previene l'associazione di un form inesistente
    if context.getParentDatabase().getForm(oFormName):
        context.setItem('Form', oFormName)
    context.removeItem('oForm')



# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if child_events == True:
    context.event_onSaveChild(backToParent=backToParent)


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
