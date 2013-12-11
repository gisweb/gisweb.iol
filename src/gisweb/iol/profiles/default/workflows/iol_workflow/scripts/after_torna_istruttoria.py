## Script (Python) "after_torna_istruttoria"
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

    doc.removeItem('documenti_autorizzazione')
    doc.removeItem('numero_autorizzazione')
    doc.removeItem('label_autorizzazione')
    doc.removeItem('istruttoria_motivo_sospensione')
    doc.removeItem('istruttoria_rigetto_motivazione')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
