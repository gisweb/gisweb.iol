## Script (Python) "before_invia_domanda"
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

    # 1. 
    doc.setItem('data_pratica',Now())

    # 2. 
    doc.createPdf(filename='domanda_inviata')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
