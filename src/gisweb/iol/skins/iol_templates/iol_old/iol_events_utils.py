## Script (Python) "iol_events_utils"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=k=''
##title=copiato in gisweb.iol come event_common.py, DA CANCELLARE
##
"""
Qui setto alcuni parametri comuni agli script degli eventi
"""

defaults = dict(
    parentKey = 'parentDocument',
    parentLinkKey = 'linkToParent',
    childrenListKey = 'childrenList_%s'
)

# verifico l'indicizzazione di alcuni campi fondamentali
#+ conto sul fatto che questo script venga richiamato da
#+ TUTTI gli script di gestione UNO a MOLTI
indexFields = (defaults['parentKey'], 'CASCADE', )
idx = context.getParentDatabase().getIndex()
fieldsToBeIndexed = [f for f in indexFields if f in idx.indexes()]    
for fieldname in fieldsToBeIndexed:
    # ATTENZIONE! Il metodo createFieldIndex richiede che lo script
    #+ venga eseguito con il ruolo di "Manager"
    idx.createFieldIndex(fieldname, 'TEXT', refresh=True)

if not k:
    return defaults

return defaults[k]
