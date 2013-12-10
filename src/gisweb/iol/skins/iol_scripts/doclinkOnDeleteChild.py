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
parentDocument = db.getDocument(parentId)

targetvalue = context.doclinkCommons('doc_path')
for fld in filter(lambda f: f.getFieldType()=='DOCLINK', parentDocument.getForm().getFormFields(includesubforms=True)):
    fldname = fld.getId()
    value = parentDocument.getItem(fldname, []) or []
    if targetvalue in value:
        value.pop(value.index(targetvalue))
        parentDocument.setItem(fldname, value)

backUrl = parentDocument.doclinkCommons('doc_path')

if redirect:
    backUrl = '%s#%s' % (backUrl, redirect)
context.REQUEST.set('returnurl', backUrl)
