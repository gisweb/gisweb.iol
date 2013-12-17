## Script (Python) "checkIolPermission"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=permission='read', doc=None
##title=
##

"""
Use PlominoUtils.checkUserPermission with shortcuts for custom IOL permissions
"""

from gisweb.iol import IOL_READ_PERMISSION, IOL_EDIT_PERMISSION, IOL_REMOVE_PERMISSION
from gisweb.utils import getRolesOfPermission

db = context.getParentDatabase()

if isinstance(doc, basestring):
    doc = db.getDocument(doc)

if not doc:
    doc = context

aliases = dict(read = IOL_READ_PERMISSION,
    edit = IOL_EDIT_PERMISSION,
    remove = IOL_REMOVE_PERMISSION)

if permission in aliases:
    permission = aliases[permission]

def flt(el):
    rolesInContext = context.portal_membership.getAuthenticatedMember().getRolesInContext(doc)
    return el['selected'] and (el['name'] in rolesInContext)

return len(filter(flt, getRolesOfPermission(doc, permission)))>0


