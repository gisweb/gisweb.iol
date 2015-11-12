## Script (Python) "get_property"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=propname
##title=
##
"""
Restituisce il valore di un attributo cercandolo prima nel Plone Property
Sheet specificato nel parametro "key" (default: "services_configuration")
e poi tra gli attributi del PlominoForm corrispondente (in caso di
PlominoDocument come contesto) e del PlominoDatabase.

propname: name of property you are looking for

output example (not all keys are necessarily setted):
{
    'value': <my attribute value>,   # only if available
    'err_msg': <ErrorMessage>,       # only if value NOT available
    'content_url': <container path>  # only if value is available
}

Usage sample:
    * test whether a variable was found:
    nfo = context.get_property('myvar')
    'value' in nfo
    True/False
"""
return context.get_properties(params=(propname, )).values()[0]
