## Script (Python) "appProperties"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=attr=''
##title=(copiato in gisweb.iol come getLocalProperties, DA CANCELLARE)
##
from Products.CMFCore.utils import getToolByName
if not attr:
    return '-1'
pp = getToolByName(context, 'portal_properties', None)
if hasattr(pp,'services_configuration'):
    sc=getattr(pp,'services_configuration')
    return getattr(sc,attr,'-1')
return '-1'
