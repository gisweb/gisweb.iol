## Script (Python) "event_onDeleteChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=anchor=True
##title=
##

"""
"""

def ondelete_child(doc, anchor=True):
    '''
    Actions to perform on deletion of a ChildDocument
    '''

    parentKey = script.event_common('parentKey')
    childrenListKey = script.event_common('childrenListKey')

    if parentKey in doc.getItems():
        db = doc.getParentDatabase()
        ParentDocument = db.getDocument(doc.getItem(parentKey))
        childrenList_name = childrenListKey % doc.Form
        childrenList = ParentDocument.getItem(childrenList_name)
        url = doc.doc_path()
        childrenList.remove(url)
        ParentDocument.setItem(childrenList_name, childrenList)

        backUrl = ParentDocument.absolute_url()
        if anchor:
            backUrl = '%s#%s' % (backUrl, childrenList_name)
        doc.REQUEST.set('returnurl', backUrl)

ondelete_child(context, anchor=anchor)
