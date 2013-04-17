## Script (Python) "accreditaUtente"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=group='', owner_item='owner'
##title=copiato in gisweb.iol come addUser.py, DA CANCELLARE
##
"""
questa funzione aggiunge il creator del contesto al gruppo specificato
"""
from Products.CMFCore.utils import getToolByName
doc = context
member = doc.getItem(owner_item,'')
portal_groups = getToolByName(context, 'portal_groups')

portal_groups.addPrincipalToGroup(member, group)

return 1
