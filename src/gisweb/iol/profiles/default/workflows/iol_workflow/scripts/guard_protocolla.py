## Script (Python) "guard_protocolla"
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

    def getResponse():
        if doc.WFgetInfoFor('review_state') == 'avvio':
            return True
        else:
            isIstruttore = doc.verificaRuolo('iol-reviewer') or doc.verificaRuolo('iol-manager')
            return not doc.getItem('numero_protocollo','') and isIstruttore

    guard_response = getResponse()

return guard_response

#### SCRIPT ENDS HERE ####
