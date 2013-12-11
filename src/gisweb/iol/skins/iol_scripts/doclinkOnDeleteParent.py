## Script (Python) "doclinkOnDeleteParent"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
"""
"""

parentKey = script.doclinkCommons('parentKey')

db = context.getParentDatabase()
idx = db.getIndex()
request = {parentKey: context.getId()}
result = idx.dbsearch(request)
docToRemove = map(lambda brain: brain.id, idx.dbsearch(request))
db.deleteDocuments(ids=docToRemove, massive=True)
try:
    db.refreshDB_async()
except:
    db.refreshDB()
context.REQUEST.set('returnurl', db.absolute_url())
