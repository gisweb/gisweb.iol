## Script (Python) "guard_invia_domanda"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object
db = doc.getParentDatabase()

guard_response = script.run_script(doc, script.id)

if guard_response == None:

    #### OTHER CODE HERE ####

    def getResponse():
        test = doc.test_mode()

        # Se rinnovo, proroga o simili la pratica genitore deve essere stata approvata
        ParentDocument_id = doc.getItem('parentDocument')
        ParentDocument = db.getDocument(ParentDocument_id)

        if not test:
            if ParentDocument:
                return ParentDocument.wf_getInfoFor('wf_autorizzata')

        return True

    guard_response = getResponse()

return guard_response

#### SCRIPT ENDS HERE ####
