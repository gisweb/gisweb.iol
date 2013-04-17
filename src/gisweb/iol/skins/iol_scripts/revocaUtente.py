## Script (Python) "revocaUtente"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=group='', owner_item='owner'
##title=
##

from Products.CMFCore.utils import getToolByName
doc = context
member = doc.getItem(owner_item, '')
portal_groups = getToolByName(context, 'portal_groups')
portal_groups.removePrincipalFromGroup(member, group)
return 1
