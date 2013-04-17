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

nome_script = 'numerazione'

numerazione = context.getParentDatabase().resources[context.naming('tipo_app')].get(nome_script)

if numerazione:
    return numerazione(item_name)
else:
    return script.getMaxOf(item_name) + 1

