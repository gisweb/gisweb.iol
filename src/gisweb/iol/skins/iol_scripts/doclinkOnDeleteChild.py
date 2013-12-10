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

childhood_name = context.REQUEST.get('parentField')
assert childhood_name, "Attenzione! Nessun valore trovato in request per il campo \"parentField\""
childhood_value = parentDocument.getItem(childhood_name, []) or []

childhood_value.pop(childhood_value.index(context.doclinkCommons('doc_path')))

parentDocument.setItem(childhood_name, childhood_value)

backUrl = parentDocument.doclinkCommons('doc_path')

if redirect:
    backUrl = '%s#%s' % (backUrl, redirect)
context.REQUEST.set('returnurl', backUrl)
