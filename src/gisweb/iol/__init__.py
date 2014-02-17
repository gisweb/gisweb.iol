from AccessControl import allow_module
allow_module('gisweb.iol.scripts.frm_beforeCreateDocument')
allow_module('gisweb.iol')

import permissions

from permissions import IOL_READ_PERMISSION, IOL_EDIT_PERMISSION, IOL_REMOVE_PERMISSION

from scripts.acl_utils import addIOLRoles
