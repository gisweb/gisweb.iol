## Script (Python) "getRoles"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=solo per TEST
##
print str(DateTime())
print context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
print context.absolute_url()
return printed
