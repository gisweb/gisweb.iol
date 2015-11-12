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
docToRemove = []
for i in result:
    if i.CASCADE:
        docToRemove.append(i.id)
    else:
        i.getObject().removeItem(parentKey)
db.deleteDocuments(ids=docToRemove, massive=True)
try:
    db.refreshDB_async()
except:
    db.refreshDB()
context.REQUEST.set('returnurl', db.absolute_url())
