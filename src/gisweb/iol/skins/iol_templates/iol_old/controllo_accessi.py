## Script (Python) "controllo_accessi"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=usr='', gruppi=[], ruoli=[]
##title=DEPRECATO (da cancellare)
##
"""
"""

usr = usr or context.portal_membership.getAuthenticatedMember().getId()

return any([grp in gruppi for grp in context.portal_groups.getGroupsByUserId(usr)]) or \
    any([role in ruoli for role in context.portal_membership.getAuthenticatedMember().getRolesInContext(context)])
