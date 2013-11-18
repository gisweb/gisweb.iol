## Script (Python) "importFromPortal"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=user, password, address, objId, portal='', port='', instance='client1'
##title=
##

"""
    user:     a valid username in the remote Plone portal
    password: valid password of the user
    address:  the remote portal address
    objId:    object Id to export from remote portal
    portal:   the remote portal name
    port:     the remote port number
    instance: local instance folder name containing the import folder
"""

from gisweb.utils import importFromPortal

urlpars = dict(
    user = user,
    password = password,
    address = address,
    portal = portal,
    port = port
)

remoteAddress = "http://%(user)s:%(password)s@%(address)s" % urlpars

if port != '':
    remoteAddress += ':%(port)s' % urlpars

if portal:
    remoteAddress += '/%(portal)s' % urlpars

out = importFromPortal(remoteAddress, objId, instance=instance)

# redirect to the imoprtExportForm method
redirecturl = '%s/manage_importExportForm' % context.portal_skins.aq_inner.aq_parent.absolute_url()
context.REQUEST.RESPONSE.redirect(redirecturl)