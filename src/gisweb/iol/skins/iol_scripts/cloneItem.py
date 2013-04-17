## Script (Python) "cloneItem"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=itemname, source='parentDocument'
##title=Clone the specified PlominoItem from source to context
##

"""
Clones the specified PlominoItem from source to context, in case of
attachment field type takes care of the file attachment displacement
between PlominoDocuments

itemname: item to clone
source: PlominoDocument from where copy value
"""

db = context.getParentDatabase()

if isinstance(source, basestring):
	source = db.getDocument(source) or db.getDocument(context.getItem(source))

field = context.getForm().getFormField(itemname) or source.getForm().getFormField(itemname)
fieldtype = field.getFieldType()

if fieldtype == 'ATTACHMENT':
	value = source.copyFileTo(context, itemname, setItem=False)
else:
	value = source.getItem(itemname)

return value
