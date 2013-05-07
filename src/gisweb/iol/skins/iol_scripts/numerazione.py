## Script (Python) "numerazione"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=item_name='numero_pratica'
##title=Gestione della numerazione delle pratiche
##

"""
1. verificare l'esistenza di uno script dedicato di numerazione
2. usare una procedura standard (getMaxOf)

item_name: nome del campo di numerazione. Il campo deve essere indicizzato
    e di tipo numerico (default: numero_pratica).

questo script sarà usato dalla formula di calcolo del campo.
"""

try:
    return context.resources.numerazione(item_name=item_name)
except Exception as err:
    # in custom o su fs vengono sollevate eccezioni differenti!
    # "SystemError: Excessive recursion" oppure "RuntimeError: maximum recursion depth exceeded while calling a Python object"
    messages = ('Excessive recursion', 'maximum recursion depth exceeded while calling a Python object', )
    if str(err) in messages:
        return script.getMaxOf(item_name) + 1
    else:
        raise err

