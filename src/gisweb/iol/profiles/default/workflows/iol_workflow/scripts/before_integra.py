## Script (Python) "before_integra"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##

doc = state_change.object

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    # 1. Creo documento di integrazione
    fname = 'integrazione'
    doc.createPdf(filename=fname)

    # 2. INVIO MAIL INTEGRAZIONE
    if doc.naming('richiesta') != 'integrazione':
        doc.sendThisMail('integra')

    # 3. RIMUOVO FLAG DI PRONTA PER INTEGRAZIONE
    doc.removeItem('pronta_per_integrazione')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
