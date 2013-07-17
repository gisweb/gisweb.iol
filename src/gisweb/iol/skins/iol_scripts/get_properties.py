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
e poi tra gli attributi del PlominoForm corrispondente (in caso di
PlominoDocument come contesto) e del PlominoDatabase.

params: list of parameter names
portal_folders: Plone Property Sheet list of the portal_properties where to look for

output example (not all keys are necessarily setted):
{
    <varname>:{
        'value': <my attribute value>,   # only if available
        'err_msg': <ErrorMessage>,       # only if value NOT available
        'content_url': <container path>  # only if value is available
    }
}

Usage sample:
    * test whether a variable was found:
    nfo = context.get_properties(params='myvar')
    'value' in nfo['myvar']
    True/False
"""

from Products.CMFCore.utils import getToolByName
from gisweb.utils import Type

if params and isinstance(params, basestring):
    params = params.split(',')
elif not params:
    params = tuple()

if isinstance(portal_folders, basestring):
    portal_folders = portal_folders.split(',')

def main(*names):
    """priority: PlominoForm -> PlominoDatabase -> portal_properties """

    result = dict()
    pp = getToolByName(context,'portal_properties')

    placesList = list()
    # Se context è PlominoDocument o PlominoForm cerco anche nel PlominoForm corrispondente
    if context.portal_type == 'PlominoDocument':
        placesList.append(context.getForm())
    elif context.portal_type == 'PlominoForm':
        placesList.append(context)
    # Cerco sempre nel PlominoDatabase
    placesList.append(context.getParentDatabase())
    # Se esistono le cartelle nelle portal_properties cerco anche lì.
    # Preferenze sull'ordine di priorità? Per ora uso l'ordine della lista
    for folder in portal_folders:
        if folder in pp.keys():
            placesList.append(pp[folder])

    for place in placesList:
        # se non specifico variabili da trovare restituisco tutto quello che
        # trovo. Attenzione! In questo caso non ci sarà segnalazione di
        # variabile non trovata ed in caso di omonimia di variabili viene
        # rispettato l'ordine di precedenza specificato sopra.
        varnames = names or dict(place.propertyItems())
        for name in varnames:
            if (name not in result) or (not 'value' in result[name]):
                try:
                    value = getattr(place, name)
                except AttributeError as err:
                    result[name] = dict(
                        error_msg = '%s: %s' % (Type(err), err),
                    )
                else:
                    result[name] = dict(
                        value = value,
                        content_url = place.absolute_url()
                    )

    # in questo modo la mancanza delle variabili richieste
    # viene segnalata all'utente (se l'applicazione è in test)
    for k,v in result.items():
        if 'err_msg' in v and context.test_mode():
                msg = 'ATTENZIONE! Attributo "%s" non trovato in %s.' % (k, v['content_url'].split('/')[-2:].join('/'), )
                script.addPortalMessage(msg, 'error')

    return result
    
return main(*params)
