## Script (Python) "guard_assegna"
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

    istr = doc.getItem('istruttore')
    prot = doc.getItem('numero_protocollo')
    guard_response = istr and prot

return guard_response

#### SCRIPT ENDS HERE ####
