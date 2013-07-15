## Script (Python) "formInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=details=0,format='json'
##title=
##
assert context.portal_type in ('PlominoForm', 'PlominoDocument', ), 'PlominoDocument expected, got %s instead' % context.portal_type
assert context.getParentDatabase().hasCurrentUserRight('PlominoAuthor'), "You don't have rights!"

from gisweb.utils import json_dumps
#from Products.CMFPlone.utils import safe_unicode
from gisweb.utils import Type

form = context if context.portal_type == 'PlominoForm' else context.getForm()

raw_data = dict(
    name = form.getFormName(),
    title = form.Title()
)

raw_data['isPage'] = form.isPage
raw_data['isSearchForm'] = form.isSearchForm

raw_data['fields'] = dict([(field.getId(), field.getFieldType()) for field in form.getFormFields(includesubforms=(int(details or 0)>0))])

subforms = form.getSubforms(applyhidewhen=False)
raw_data['subform_count'] = len(subforms)
raw_data['subforms'] = subforms

# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(raw_data)
elif format == 'text':
    print json_dumps(raw_data, indent=4)
    #for k,v in raw_data.items():
    #    print '%s: \n\t%s' % (k,v)
    return printed
else:
    return raw_data
