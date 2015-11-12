## Script (Python) "get_properties"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=params='', portal_folders=('services_configuration', )
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

if params and isinstance(params, basestring):
    params = params.split(',')
else:
    params = tuple()

if isinstance(portal_folders, basestring):
    portal_folders = portal_folders.split(',')

def main(*names):
    """ form -> db -> pp """

    result = dict()
    pp = getToolByName(context,'portal_properties')

    placesList = list()
    # Se PlominoDocument o PlominoForm cerco anche nel PlominoForm corrispondente
    if context.portal_type == 'PlominoDocument':
        placesList.append(context.getForm())
    elif context.portal_type == 'PlominoForm':
        placesList.append(context)
    # Cerco sempre nel PlominoDatabase
    placesList.append(context.getParentDatabase())
    # Se esistono le cartelle nelle portal_properties cerco anche lì.
    # Preferenze sull'ordine di priorità? Per ora lascio uso l'ordine della lista
    for folder in portal_folders:
        if folder in pp.keys():
            placesList.append(pp[folder])

    for place in placesList:
        # se non specifico variabili da trovare restituisco tutto quello che
        # trovo. Attenzione! In questo caso non ci sarà segnalazione di
        # variabile non trovata
        varnames = names or dict(place.propertyItems())
        for name in varnames:
            if (name not in result) or (not 'value' in result[name]):
                try:
                    value = getattr(place, name)
                except AttributeError as err:
                    result[name] = dict(
                        error_msg = '%s' % err,
                        #content_url = place.absolute_url()
                    )
                else:
                    result[name] = dict(
                        value = value,
                        content_url = place.absolute_url()
                    )

    # in questo modo la mancanza di una variabile settata
    #+ viene segnalata all'utente se l'applicazione è in test
    for k,v in result.items():
        if 'err_msg' in v and context.test_mode():
                msg = 'ATTENZIONE! Attributo "%s" non trovato in %s.' % (k, v['content_url'].split('/')[-2:].join('/'), )
                script.addPortalMessage(msg, 'error')

    return result

return main(*params)