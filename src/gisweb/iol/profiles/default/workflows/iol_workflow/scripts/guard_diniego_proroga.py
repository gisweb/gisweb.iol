## Script (Python) "guard_diniego_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=NON UTILIZZATA
##
return False

doc = state_change.object

guard_response = script.run_script(doc, script.id)

if guard_response == None:

    #### OTHER CODE HERE ####

    guard_response = doc.WFgetInfoFor('wf_richiesta_proroga')

return guard_response

#### SCRIPT ENDS HERE ####
