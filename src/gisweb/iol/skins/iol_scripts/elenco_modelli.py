## Script (Python) "elenco_modelli"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=sub_path='', test=''
##title=Elenco dei modelli di stampa
##

"""
Interroga il servizio e restituisce la lista dei modelli di stampa
"""

from Products.CMFPlomino.PlominoUtils import json_loads, open_url, urlencode

if context.portal_type != 'PlominoDocument':
    return ''

app = context.naming('tipo_app')

url = context.getLocalProperties('ws_listmodel_URL')

#if url == str(-1):
    #return None

nullchoice = 'Manca il modello, scegliere un modello di stampa per abilitare la funzione|'

query = dict(
    app = app,
    group = sub_path
)

uu = '%s?%s' %(url, urlencode(query))
result = json_loads(open_url(uu))

return [nullchoice] + result
