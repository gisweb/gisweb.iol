## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
#from AccessControl import getSecurityManager
from Products.CMFCore.utils import getToolByName
roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)

wf = getToolByName(context, 'portal_workflow')
wf_status = wf.getInfoFor(context,'review_state')

if wf_status in ['avvio'] and ('Owner' in roles or 'rup' in roles or 'istruttore' in roles):
    return True
for perm in  context.rolesOfPermission('CMFPlomino: Edit documents'):
    if perm['selected']=='SELECTED' and perm['name'] in roles:
        return True

return False
