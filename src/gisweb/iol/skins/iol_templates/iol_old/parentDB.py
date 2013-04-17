## Script (Python) "parentDB"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
obj = context
while getattr(obj, 'meta_type', '') != 'PlominoDatabase':
    obj = obj.aq_parent
return obj
