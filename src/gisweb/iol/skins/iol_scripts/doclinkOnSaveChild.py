## Script (Python) "doclinkOnSaveChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=redirect=False
##title=Actions for child document save event
##
"""
"""

parentKey = script.doclinkCommons('parentKey')

if not context.isNewDocument():
    if context.getItem('plominoredirecturl') and not redirect:
        context.removeItem('plominoredirecturl')

plominoDatabase = context.getParentDatabase()
plominoDatabase.getIndex().indexDocument(context)
parentId = context.getItem(parentKey)
parentDocument = plominoDatabase.getDocument(parentId)
parentDocument.refresh()
