## Script (Python) "iol_onOpenDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=IOL onDeleteDocument event common actions
##
# ON OPEN WITH FORM

owf_name = context.REQUEST.get('openwithform')

owf = None if not owf_name else context.getParentDatabase().getForm(owf_name)

if owf and not context.isNewDocument():
    context.setItem('oForm', context.getItem('Form', ''))
