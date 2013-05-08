## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=hasReadPermission
##

"""
Tenuto per retro-compatibilità
"""

return context.getParentDatabase().hasReadPermission(obj=context)
