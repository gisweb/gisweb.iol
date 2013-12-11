## Script (Python) "guard_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=NON UTILIZZATA - Disponibile anche per gli utenti per App Trasporti
##
return False
from Products.CMFCore.utils import getToolByName

doc = state_change.object
db = doc.getParentDatabase()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    return db.resources[scriptName](doc)

# Transizione Automatica per i Trasporti 
if doc.getItem('iol_tipo_app','') in ['trasporti']:
    return doc.wf_getInfoFor('wf_richiesta_proroga') and doc.getItem('documenti_proroga')
else:
    roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(doc)
    isIstruttore = 'rup' in roles or 'Manager' in roles or 'istruttore' in roles
    return doc.wf_getInfoFor('wf_richiesta_proroga') and isIstruttore and doc.getItem('documenti_proroga')
