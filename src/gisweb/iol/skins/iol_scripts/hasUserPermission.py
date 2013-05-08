## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=permission='edit',test=0
##title=
##

"""
Verifica dei permessi locali
"""

short_cut = dict(
    edit = 'CMFPlomino: Edit documents', # the default
    remove = 'CMFPlomino: Remove documents'
)

from gisweb.utils import rolesOfPermission

roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
permission = short_cut.get(permission) or permission

for perm in rolesOfPermission(context, permission):
    if perm['selected']=='SELECTED' and perm['name'] in roles:
        return True

if test:
    return 'NO!'

return False
