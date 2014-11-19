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

app = context.naming('iol_tipo_app')
nullchoice = 'Manca il modello, scegliere un modello di stampa per abilitare la funzione|'
outlist = [nullchoice]

url_info = context.get_property('ws_listmodel_URL')
try:
    proj = context.get_property('project')['value']
except:
    proj = ''
def open_my_url(url, **args):
    uu = '%s?%s' %(url, urlencode(args))
    return json_loads(open_url(uu))

modello=json_loads(context.printModelli(context.getParentDatabase().getId()))

if modello['success']==1:   
   outlist.append('%s|%s' %(modello['model'].split('/')[-1],modello['model'].split('/')[-1]))

elif 'value' in url_info:
    outlist += open_my_url(url_info['value'], app=context.naming('iol_tipo_app'), group=sub_path, project=proj)

if context.test_mode() and len(outlist)==1:
    outlist += ['test|test']


return outlist
