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

from Products.CMFPlomino.PlominoUtils import json_dumps
#from Products.CMFPlone.utils import safe_unicode
from gisweb.utils import Type

form = context if context.portal_type == 'PlominoForm' else context.getForm()

raw_data = dict(
    name = form.getFormName(),
    title = form.Title()
)

raw_data['isPage'] = form.isPage
raw_data['isSearchForm'] = form.isSearchForm

raw_data['fields'] = [dict(id=field.getId(), type=field.getFieldType(), label=field.Title(), url=field.absolute_url()) for field in form.getFormFields(includesubforms=(int(details or 0)>0))]

subforms = form.getSubforms(applyhidewhen=False)
raw_data['subform_count'] = len(subforms)
raw_data['subforms'] = subforms
if not details:
    raw_data['more_details'] = context.REQUEST.get('URL')+'?details=1'
else:
    raw_data['less_details'] = context.REQUEST.get('URL')

# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(raw_data, sort_keys=True)
elif format == 'text':
    print json_dumps(raw_data, indent=4, sort_keys=True)
    #for k,v in raw_data.items():
    #    print '%s: \n\t%s' % (k,v)
    return printed
else:
    return raw_data
