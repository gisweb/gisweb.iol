## Script (Python) "searchDocuments"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

from Products.CMFCore.utils import getToolByName
#from plone import api

#if api.user.is_anonymous():
#    return []

#current = api.user.get_current()

result = list()
catalog = getToolByName(context, 'portal_catalog')
dbList = list()
viewList = list()
for i in catalog.searchResults({'portal_type': 'PlominoDatabase'}):
    db = i.getObject()
    view = db.getView('ricerca')
    if view:
        viewList.append(view)
return dbList
request = dict(
    cognome = 'dimattia'
)
for v in viewList:
    filter = dict(request_query = request)
    d = v.tojson(filter)
    result.append(d)
        
return result