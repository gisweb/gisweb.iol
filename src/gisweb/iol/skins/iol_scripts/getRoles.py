## Script (Python) "getRoles"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=Get current user roles
##

"""
Expose the getRolesInContext method
"""

return context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
