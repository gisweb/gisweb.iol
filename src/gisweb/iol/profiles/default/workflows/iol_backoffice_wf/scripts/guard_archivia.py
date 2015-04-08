## Script (Python) "guard_archivia"
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

    guard_response = doc.getItem('autorizzata_al') < DateTime()


return guard_response

#### SCRIPT ENDS HERE ####
