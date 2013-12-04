## Script (Python) "after_sospendi"
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

    # 1. INVIO MAIL RIGETTO
    if doc.naming('richiesta') != 'integrazione':
        doc.sendThisMail('sospendi')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
