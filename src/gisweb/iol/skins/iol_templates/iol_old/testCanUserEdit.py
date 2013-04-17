## Script (Python) "testCanUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
#from AccessControl import getSecurityManager
roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
return context.rolesOfPermission('CMFPlomino: Edit documents')
for perm in  context.rolesOfPermission('CMFPlomino: Edit documents'):
    if perm['selected']=='SELECTED' and perm['name'] in roles:
        return True

return False
