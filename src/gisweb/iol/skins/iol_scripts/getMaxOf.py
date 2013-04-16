## Script (Python) "getMaxOf"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=item_name, query={}
##title=Max of item values
##

"""
Returns the max setted value of the requested item in the PlominoDatabase.

item_name: an item name
query: a dictionary to be used as query search request

Restituisce il massimo valore per l'item richiesto in base al filtro fornito.

E' necessario che:
 * l'item richiesto sia un campo indicizzato
 * l'item richiesto sia di tipo numerico (o quanto meno compatibile con la condizione {"query": 0, "range": "min"})
query: filtro di ricerca. Utile se si volessero differenziare le numerazioni in base a una qualunque campo indicizzato.
"""

if isinstance(query, basestring):
    # casomai si richiamasse questo script via url 
    from Products.CMFPlomino.PlominoUtils import json_loads
    query = json_loads(query)

query.update({item_name: dict(query=0, range='min')})

res = context.getParentDatabase().getIndex().dbsearch(query, sortindex=item_name, reverse=1, only_allowed=False)

massimo = max([0]+[getattr(i, item_name) for i in res])

return massimo
