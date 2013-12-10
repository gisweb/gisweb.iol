## Script (Python) "doclinkOnCreateChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=redirect=True
##title=Actions for child document creation event
##
"""
Actions for child document creation:
set parent reference in child document

redirect: True/False/anchor name
"""

parentKey = script.doclinkCommons('parentKey')
plominoDatabase = context.getParentDatabase()

parentId = context.REQUEST.get(parentKey)
assert parentId, "Attenzione! Nessun valore trovato in request per il campo \"%s\"" % parentKey
parentDocument = plominoDatabase.getDocument(parentId)

if redirect:
    backUrl = parentDocument.doclinkCommons('doc_path')
    if isinstance(redirect, basestring):
        backUrl = '%s#%s' % (backUrl, redirect)
    context.setItem('plominoredirecturl', backUrl)

childhood_name = context.REQUEST.get('parentField')
assert childhood_name, "Attenzione! Nessun valore trovato in request per il campo \"parentField\""
childhood_value = parentDocument.getItem(childhood_name, []) or []
childhood_value.append(context.doclinkCommons('doc_path'))
parentDocument.setItem(childhood_name, childhood_value)
