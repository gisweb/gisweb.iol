## Script (Python) "elencoModelli"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=sub_path='', test=''
##title=(copiato in gisweb.iol, DA CANCELLARE)
##
#pd = context
# 1. distinguere il caso in cui il context sia un PlominoForm (caso di creazione del documento. TEST: isNewDocument())

from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now, open_url,urlencode
from gisweb.utils import serialDoc, report, Type, requests_post, attachThis, os_path_join
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import normalizeString

if context.portal_type != 'PlominoDocument':
    return ''

doc = context
app = doc.getItem('tipo_app','')
url = context.appProperties('ws_listmodel_URL')

if url == str(-1):
    return None

nullchoice = 'Manca il modello, scegliere un modello di stampa per abilitare la funzione|'

query = dict(
    app= app,
    group = sub_path
)
uu = '%s?%s' %(url,urlencode(query))
#return uu
result = json_loads(open_url(uu))
return [nullchoice] + result





############################################################################################
"""
from gisweb.utils import os_path_join
printservice_path = '/apps/printService/modelli/'

nullchoice = 'Manca il modello, scegliere un modello di stampa per abilitare la funzione|'

if not test and context.portal_type != 'PlominoDocument':
    return [nullchoice]

from gisweb.utils import os_listdir

tipo = 'trasporti' if test else context.getItem('tipo_app','') or ''

path = os_path_join(printservice_path, tipo, sub_path)

try:
    return [nullchoice] + os_listdir(path)
except OSError as err:
    return None
"""
