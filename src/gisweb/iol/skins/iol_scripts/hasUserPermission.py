## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=permission='edit',user_id='',test=0
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

if user_id:
    from Products.CMFCore.utils import getToolByName
    mt = getToolByName(context, 'portal_membership')
    member = mt.getMemberById(user_id)
else:
    member = context.portal_membership.getAuthenticatedMember()

roles = member.getRolesInContext(context)
permission = short_cut.get(permission) or permission

for perm in rolesOfPermission(context, permission):
    if perm['selected']=='SELECTED' and perm['name'] in roles:
        return True

if test:
    return 'NO!'

return False
