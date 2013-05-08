## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=test=0
##title=
##

from Products.CMFCore.utils import getToolByName
from gisweb.utils import rolesOfPermission

roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)

for perm in rolesOfPermission(context, 'CMFPlomino: Edit documents'):
    if perm['selected']=='SELECTED' and perm['name'] in roles:
        return True

if test:
    return 'NO!'
return False
