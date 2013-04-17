## Script (Python) "test_manuele"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
myForm = context.getForm()
doc = context
return myForm.getFormField('istruttore').getFieldRender(myForm, doc, doc.isEditMode(), False, request=doc.REQUEST)
