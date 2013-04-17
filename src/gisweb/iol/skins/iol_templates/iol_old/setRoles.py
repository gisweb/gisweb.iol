## Script (Python) "setRoles"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=group='',role=''
##title=
##
doc = context
if group and role:
    doc.manage_addLocalRoles(group, [role,])
