## Script (Python) "event_onDeleteParent"
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

def ondelete_parent(doc):
    """
    Actions to perform on deletion of a ParentDocument
    """

    parentKey = script.event_common('parentKey')

    db = doc.getParentDatabase()
    idx = db.getIndex()
    request = {parentKey: doc.getId()}
    res = idx.dbsearch(request)
    toRemove = []
    for rec in res:
        if rec.CASCADE:
            toRemove += [rec.id]
        else:
            rec.getObject().removeItem(parentKey)
    db.deleteDocuments(ids=toRemove, massive=False)
    doc.REQUEST.set('returnurl', db.absolute_url())

ondelete_parent(context)
