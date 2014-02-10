## Script (Python) "serialDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=fieldsubset='', get_id=0, nest=True, render=0, follow=0, format=''
##title=A brand new serialDoc
##
assert context.portal_type == 'PlominoDocument', 'PlominoDocument expected, got %s instead' % context.portal_type
db = context.getParentDatabase()
assert context.isReader(), "You don't have read permission in this document"

from Products.CMFPlomino.PlominoUtils import json_dumps

try:
    from gisweb.utils import dict2xml
except ImportError as err:
    GOT_XML = False
else:
    GOT_XML = True

def serialDoc(doc, fieldsubset=[], nest=True, render=True, follow=False):
    """
    Take a Plomino document :doc: and extract its data in a JSON-serializable
    structure for printing porposes. Item values are renderized according to
    the field definition and by default only defined fields will be considered.

    doc          : the PlominoDocument that contains data to serialize;
    fieldsubset : subset of item to be serialized, you can just specify the
                   list if item name you need;
    nest         : whether the fields of type DATAGRID and DOCLINK has to be
                   serialized nested in a list;
    render       : if True Item values are renderized according to the field
                   definition and by default only defined fields will be considered.
    format       : json/xml;
    follow      : follow doclink?
    """

    form = doc.getForm()
    fieldnames = [i.getId() for i in form.getFormFields(includesubforms=True, doc=None, applyhidewhen=False)]

    contentKeys = fieldnames + [i for i in doc.getItems() if i not in fieldnames]
    if fieldsubset:
        contentKeys = [i for i in contentKeys if i in fieldsubset]

    result = [] if not get_id else [('id', doc.getId(), )]
    for key in contentKeys:
        result += doc.serialItem(key, nest, render=render, follow=follow, fieldsubset=fieldsubset, fieldnames=fieldnames)
    return result

# trick
if fieldsubset and isinstance(fieldsubset, basestring):
    rawsubset = fieldsubset.split(',')
elif fieldsubset: # I suppose a list or tuple instance
    rawsubset = fieldsubset
else:
    rawsubset = list()

subset = list()
for el in rawsubset:
    tmpfrm = db.getForm(el)
    if tmpfrm:
        subset += [i.getId() for i in tmpfrm.getFormFields()]
    else:
        subset.append(el)

raw_data = serialDoc(context, fieldsubset=subset, nest=nest, render=render, follow=follow)

# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(dict(raw_data))
elif format == 'xml':
    assert GOT_XML, '%s' % err
    context.REQUEST.RESPONSE.setHeader("Content-type", "text/xml")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + dict2xml(dict(info=dict(raw_data)))
else:
    return raw_data
