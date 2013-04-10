## Script (Python) "addUser"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=group, owner_item='owner'
##title=Add the user specified in the context item to the group
##

"""
Aggiunge l'utente specificato nel item "owner" del documento al gruppo specificato
"""

from Products.CMFCore.utils import getToolByName
portal_groups = getToolByName(context, 'portal_groups')

member = doc.getItem(owner_item, '')

portal_groups.addPrincipalToGroup(member, group)
