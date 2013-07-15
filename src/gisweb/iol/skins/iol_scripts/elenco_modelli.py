## Script (Python) "elenco_modelli"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=sub_path=''
##title=Elenco dei modelli di stampa
##
"""
Interroga il servizio e restituisce la lista dei modelli di stampa
"""

from Products.CMFPlomino.PlominoUtils import json_loads, open_url, urlencode

app = context.naming('tipo_app')
nullchoice = 'Manca il modello, scegliere un modello di stampa per abilitare la funzione|'
outlist = [nullchoice]

url_info = context.getMyAttribute('ws_listmodel_URL')

def open_my_url(url, **args):
    uu = '%s?%s' %(url, urlencode(args))
    return json_loads(open_url(uu))

if url_info['success']:
    outlist += open_my_url(url_info['value'], app=context.naming('tipo_app'), group=sub_path)

if context.test_mode() and len(outlist)==1:
    outlist += ['test|test']


return outlist
