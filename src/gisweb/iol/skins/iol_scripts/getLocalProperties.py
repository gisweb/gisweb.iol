## Script (Python) "getLocalProperties"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=attr
##title=getLocalProperties (DEPRECATED use get_properties or get_property instead)
##

from Products.CMFCore.utils import getToolByName

pp = getToolByName(context, 'portal_properties')
sc = getattr(pp, 'services_configuration')

return getattr(sc, attr)
