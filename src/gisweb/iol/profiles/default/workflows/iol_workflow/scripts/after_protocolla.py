## Script (Python) "after_protocolla"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    # 1. Dopo la protocollazione se disponibile eseguo la transizione di assegnazione
    if 'assegna' in map(lambda tr: tr['id'], doc.WFgetTransitionsAttr()):
        from Products.CMFCore.utils import getToolByName
        wf = getToolByName(doc, 'portal_workflow') # state_change.workflow
        wf.doActionFor(doc, 'assegna')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
