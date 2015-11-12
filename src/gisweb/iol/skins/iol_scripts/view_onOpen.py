## Script (Python) "view_onOpen"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=IOL on Open View event common actions
##

db = context.getParentDatabase()
user=db.getCurrentUser()

if not ("Manager" in user.getRolesInContext(db) or db.hasUserRole(db.getCurrentUser().id,"[iol-reviewer]") or db.hasUserRole(db.getCurrentUser().id,
"[iol-manager]")):
    return 'Non si dispone dei diritti per visualizzare la pagina'