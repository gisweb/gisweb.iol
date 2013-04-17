## Script (Python) "iol_onSaveDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, backToParent=False
##title=
##
"""
Standardizzazione dele operazioni da svolgere al salvataggio di una istanza
child_events: True o False (lancia gli script di gestione dell'uno a molti)
backToParent: False o True o 'anchor'
"""

if child_events == True:
    context.onsave_child(backToParent=backToParent)

def doActionIfAny(doc):
    """
    Esegue le transizioni del workflow che devono essere eseguite al salvataggio della pratica
    """
    from Products.CMFCore.utils import getToolByName
    pw=getToolByName(doc,'portal_workflow')

    actions = [i['id'] for i in pw.getTransitionsFor(doc) if i['id'] in pw.getInfoFor(doc, 'transition_on_save')]

    if actions:
        pw.doActionFor(doc,actions[0])
    
    return None

doActionIfAny(context)

# Per eseguire transizioni al salvataggio è sufficiente aggiungere in
# <portale>/portal_workflow/<workflow>/transitions/<transizione>/manage_propertiesForm
# la variabile booleana 'on_save' settata a True
#for tr in context.wf_transitionsInfo(args=['on_save']):
#    if tr.get('on_save'):
#        from Products.CMFCore.utils import getToolByName
#        pw = getToolByName(context, 'portal_workflow')
#        pw.doActionFor(context, tr['id'])
