## Script (Python) "canUserEdit"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=test=0
##title=DEPRECATO! Usare hasUserPermission
##

"""
Mantenuto solo per retro-compatibilità del codice
"""

return context.hasUserPermission(test=test)
