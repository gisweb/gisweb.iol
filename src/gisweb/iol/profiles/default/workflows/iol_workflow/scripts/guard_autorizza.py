## Script (Python) "guard_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##

doc = state_change.object

guard_response = script.run_script(doc, script.id)

if guard_response == None:

    #### OTHER CODE HERE ####

    isRup = doc.verificaRuolo('iol-manager')
    guard_response = doc.getItem('documenti_autorizzazione') and isRup

return guard_response

#### SCRIPT ENDS HERE ####
