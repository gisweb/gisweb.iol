## Script (Python) "doclinkFieldFormula"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=formname, sortindex='created'
##title=
##

"""
Calcola i documenti figli.
sorting: created/modified or other brain attributes you want to use for sorting
"""

def get_sort_key(b, attr):
    return getattr(b, attr)

parentKey = script.doclinkCommons('parentKey')
idx = context.getParentDatabase().getIndex()
assert parentKey in idx.indexes(), "No %s index found!" % parentKey
 
idx.refresh()
query = dict(Form=formname, parentDocument=context.getId())
raw = [(get_sort_key(i, sortindex), i.getPath(), ) for i in idx.dbsearch(query)] 
raw.sort()
return [i[1] for i in raw]