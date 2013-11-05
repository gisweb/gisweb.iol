## Script (Python) "doclinkOnDeleteChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=redirect=''
##title=
##
"""
"""

parentKey = script.doclinkCommons('parentKey')
db = context.getParentDatabase()
parentId = context.getItem(parentKey)
ParentDocument = db.getDocument(parentId)
ParentDocument.refresh()
backUrl = ParentDocument.absolute_url()
if redirect:
    backUrl = '%s#%s' % (backUrl, redirect)
context.REQUEST.set('returnurl', backUrl)
