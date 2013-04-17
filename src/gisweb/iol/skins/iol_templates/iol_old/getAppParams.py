## Script (Python) "getAppParams"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=args=''
##title=
##
from Products.CMFCore.utils import getToolByName

pp = getToolByName(context,'portal_properties')
if not 'services_configuration' in pp.keys():
    return ''

sc = pp['services_configuration']

if args:
    return sc.get(args,'NOT FOUND')

result = dict()
for k in pp.services_configuration.contentItems():
    key = k[0]
    result[key]=sc.get(k[1])

return result
