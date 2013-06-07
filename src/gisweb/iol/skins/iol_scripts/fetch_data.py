## Script (Python) "fetch_data"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=forms='base_sub_giuridica', distinct='', size=10, page=1, debug=''
##title=
##
"""
Servizio web che restituisce la serializzazione dei dati richiesti

API:

@param forms     C{str}: elenco dei nomi dei form (separati da virgola) contenenti i campi cui si è interessati;
@param distinct  C{str}: elenco dei valori (separati da virgola) che devono essere univoci;
@param page      C{int}: numero pagina;
@param size      C{int}: dimensione paginazione;

NB:
 1. Ogni altro parametro in request viene considerato come parametro di ricerca per la query.
 2. La quantità di dati restituita dipende dai ruoli dell'utente richiedente.

"""

from Products.CMFPlomino.PlominoUtils import json_dumps, Now
from gisweb.utils import serialDoc, getIndexType

db = context.getParentDatabase()

page, size = map(int, (page, size))
start = (page-1)*size

custom_query = dict()
for k,v in context.REQUEST.form.items():
    # considero parametro di ricerca ogni parametro in request corrispondente ad un campo indicizzato
    indexType = getIndexType(context, k)
    if v and indexType:
        if 'ZCTextIndex' in indexType:
            # TODO: implementare un protocollo condiviso per pilotare le ricerche via ajax
            # questi adattamenti sono adatti SOLO al campo "fisica_cf"
            if k == 'fisica_cf':
                custom_query[k] = v.upper() + '*'
            else:
                custom_query[k] = v + '*'
        else:
            custom_query[k] = v

def get_fld_ids():
    frms = forms.split(',')
    flds = [db.getForm(i).getFormFields() for i in frms]
    fld_list = sum(flds[1:], flds[0])
    return [i.getId() for i in fld_list]

fld_ids = get_fld_ids()

if not any([r in context.getRoles()+context.getCurrentUserRoles() for r in (
    'Manager',
    '[iol-reviewer]', '[iol-manager]', )]):
    custom_query['owner'] = db.getCurrentUserId()

idx = db.getIndex()
# TODO??: dato che per problemi di permessi non riesco agevolmente ad usare la Batch si può pensare di salvare i dati in sessione
res = idx.dbsearch(custom_query, sortindex='data_autorizzazione', reverse=1, only_allowed=False, limit=None)[start:start+size]

#res = Batch(items=res, size=size, start=size*int(start/size)+1)

get_sec = lambda d: d*24*3600
def get_data(doc):
    if debug: t_0 = Now()
    out = dict((k,v) for k,v in serialDoc(doc, nest_datagrid=True, serial_as=False, field_list=fld_ids, render=False) if v)
    if debug: out['elapsed'] = get_sec(Now()-t_0)
    return out

data = []
dvalues = []
if debug: t_0 = Now()
for b in res:
    doc = b.getObject()
    if any([doc.getItem(f) for f in fld_ids]):
        if distinct:
            r = [str(doc.getItem(x.strip(), '') or '') for x in distinct.split(',')]
            s = ''.join(r).lower().strip()
            if s and s not in dvalues:
                dvalues.append(s)
                data.append(get_data(doc))
        else:
            data.append(get_data(doc))

out = dict(names=data, total=len(data))
if debug: out['elapsed'] = get_sec(Now()-t_0)

context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
return json_dumps(out)
