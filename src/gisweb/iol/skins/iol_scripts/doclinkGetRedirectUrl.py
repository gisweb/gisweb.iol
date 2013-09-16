## Script (Python) "getRedirectUrl"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=name, attribute, query_args={}
##title=
##

"""
name: an object name inside the plominoDatabase (e.g. a PlominoForm or PlominoView name)
attribute: a custom attribute (e.g. template) reachable using spammish acquisition
"""

from gisweb.utils import urllib_urlencode

plominoDatabase = context.getParentDatabase()
destination = plominoDatabase.getView(name) or plominoDatabase.getForm(name) or plominoDatabase

if name and destination==plominoDatabase:
    context.addPortalMessage('Destination object not found using Id: %s' % name, 'error')
elif name and hasattr(destination, attribute):
    URL = '%s/%s' % (destination.absolute_url(), attribute)
elif name:
    URL = destination.absolute_url()
    if attribute:
        context.addPortalMessage("Context has no attribute '%s'" % attribute, 'error')

if query_args:
    URL += '?%s' % urllib_urlencode(query_args)

return URL