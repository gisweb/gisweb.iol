## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO!
##

"""
Tenuto per retro-compatibilità perché usato in bootstrapWF-IOL*.pt
"""

return context.getParentDatabase().hasEditPermission(obj=context)
