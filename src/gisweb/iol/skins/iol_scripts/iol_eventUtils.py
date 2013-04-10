## Script (Python) "iol_eventUtils"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=k=''
##title=IOL events common params and actions
##

"""
Gestione centralizzata dei valori di alcuni parametri comuni agli script
degli eventi

k: one of the defaults parameter. If none is specified all params are
	returned in a dictionary
	i.e.:
	* "parentKey"
	* "parentLinkKey"
	* "childrenLinstKey"
"""

from gisweb.utils import idx_createFieldIndex

defaults = dict(
    parentKey = 'parentDocument',
    parentLinkKey = 'linkToParent',
    childrenListKey = 'childrenList_%s'
)

# verifico l'indicizzazione di alcuni campi fondamentali
#+ conto sul fatto che questo script venga richiamato da
#+ TUTTI gli script di gestione UNO a MOLTI
idx = context.getParentDatabase().getIndex()

idx_createFieldIndex(idx, defaults['parentKey'])
idx_createFieldIndex(idx, 'CASCADE')

if not k:
    return defaults

return defaults[k]
