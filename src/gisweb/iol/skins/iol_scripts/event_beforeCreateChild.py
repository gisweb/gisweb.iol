## Script (Python) "doclinkBeforeCreateChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=redirect_to='', using='', custom_message='', query_args={}, errors=''
##title=
##
"""
redirect_to: PlominoForm/PlominoView name to redirect in case no document id passed in the request
using: valid script method name of the form/view
custom_message: custom warning message
query_args: arguments to be pass to the redirecturl
errors: assert/plomino/
"""

db = context.getParentDatabase()
parentKey = script.doclinkCommons('parentKey')
parentId = context.REQUEST.get(parentKey)
parentDocument = db.getDocument(parentId)

error_message = "No plominoDocument found corresponding to given id: %s" % parentId
assert not (errors=="assert" and not parentDocument), error_message
if errors=='plomino' and not parentDocument: return error_message
elif not parentDocument and not 'test' in context.REQUEST.keys():
    # concept is: for a child creation a parent is necessary.
    # In case a parent document is not given it returns an URL where to redirect
    # e.g. e view where to chose a parent document or a form in compiling mode
    # for the creation of a brand new parentDocument.

    destinationUrl = context.doclinkGetRedirectUrl(redirect_to, using, query_args)

    if context.REQUEST.get(parentKey):
        context.addPortalMessage(error_message, 'error')
    else:
        context.addPortalMessage(custom_message or 'No plominoDocument id given.', 'warning')
    context.REQUEST.RESPONSE.redirect(destinationUrl)

field_ids = context.objectIds(spec='PlominoField')
if parentKey not in field_ids:
    context.doclinkImportTool(dtml='parentDocumentFieldBase', kw=dict(custom_field_name=parentKey))
if 'CADCADE' not in field_ids:
    # Plomino versions < 1.17 does not support BOOLEAN data type
    if db.plomino_version < '1.17':
        kw = dict(custom_field_type='INTEGER', custom_field_value=1)
    else:
        kw = dict(custom_field_type='BOOLEAN', custom_field_value=True)
    context.doclinkImportTool(dtml='cascadeFieldBase')
