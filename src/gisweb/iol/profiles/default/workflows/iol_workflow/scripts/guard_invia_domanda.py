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

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)

test = doc.test_mode()

# Se rinnovo, proroga o simili la pratica genitore deve essere stata approvata

ParentDocument_id = doc.getItem('parentDocument')
ParentDocument = db.getDocument(ParentDocument_id)

if not test:
    if ParentDocument:
        return ParentDocument.wf_getInfoFor('wf_autorizzata')

return True
