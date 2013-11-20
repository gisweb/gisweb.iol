from Products.CMFCore import permissions as CMFCorePermissions
from AccessControl.SecurityInfo import ModuleSecurityInfo
from Products.CMFCore.permissions import setDefaultRoles

security = ModuleSecurityInfo('gisweb.iol')

security.declarePublic('IOL_READ_PERMISSION')
IOL_READ_PERMISSION = 'gisweb.iol: Read iol documents'
setDefaultRoles(IOL_READ_PERMISSION, ())

security.declarePublic('IOL_EDIT_PERMISSION')
IOL_EDIT_PERMISSION = 'gisweb.iol: Edit iol documents'
setDefaultRoles(IOL_EDIT_PERMISSION, ())

security.declarePublic('IOL_REMOVE_PERMISSION')
IOL_REMOVE_PERMISSION = 'gisweb.iol: Delete iol documents'
setDefaultRoles(IOL_REMOVE_PERMISSION, ())
