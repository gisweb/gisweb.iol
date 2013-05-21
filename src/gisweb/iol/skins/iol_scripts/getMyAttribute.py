## Script (Python) "getMyAttribute"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=name, key='services_configuration'
##title=Get application attributes
##

"""
Restituisce il valore di un attributo cercandolo prima nel Plone Property
Sheet specificato nel parametro "key" (default: "services_configuration")
e poi tra gli attributi del PlominoDatabase.

name: Attribute name
key: Name of a specific Plone Property Sheet of the portal_properties

output:
{
    'success': 0/1,
    'value': <my attribute value>,
    'err_msg': <ErrorMessage>,
    'err_type': <ErrorInstanceType>,
    'content_url': <where the attribute was found>
}
"""

from Products.CMFCore.utils import getToolByName
from gisweb.utils import Type

def main(name, key='services_configuration'):

    result = dict(success=0)
    error = dict()

    pp = getToolByName(context,'portal_properties')

    placesList = [context]
    if key in pp.keys():
        placesList.append(pp[key])

    placesList.reverse()

    for place in placesList:
        try:
            result['value'] = getattr(place, name)
        except AttributeError as err:
            error['err_msg'] = '%s' % err
            error['err_type'] = Type(err)
        else:
            result['content_url'] = place.absolute_url()
            result['success'] = 1
            break

    if not 'value' in result:
        result.update(error)
        # in questo modo la mancanza di una variabile settata
        #+ viene segnalata all'utente se l'applicazione è in test
        if context.test_mode():
            msg = 'ATTENZIONE! Attributo non trovato! %s: %s' % (Type(err), err, )
            script.addPortalMessage(msg, 'error')

    return result

return main(name, key)
