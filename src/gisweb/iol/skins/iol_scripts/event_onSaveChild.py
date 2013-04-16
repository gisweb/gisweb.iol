## Script (Python) "event_onSaveChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=backToParent=False
##title=
##

"""
"""

def onsave_child(doc, backToParent=False):
    """
    Actions to perform on save of a ChildDocument
    """
    
    if not doc.isNewDocument():
        if doc.getItem('plominoredirecturl') and not backToParent:
            doc.removeItem('plominoredirecturl')

onsave_child(context, backToParent=backToParent)
