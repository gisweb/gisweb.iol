## Script (Python) "verificaRuolo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=ruolo=''
##title=
##
roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
return ruolo in roles or 'Manager' in roles
