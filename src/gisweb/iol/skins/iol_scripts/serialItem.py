## Script (Python) "serialItem"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=name, nest=1, render=1, follow=1, fieldsubset='', fieldnames='', format=''
##title=A brand new serialItem
##
assert context.portal_type == 'PlominoDocument', 'PlominoDocument expected, got %s instead' % context.portal_type
assert context.getParentDatabase().isCurrentUserAuthor(context), "You don't have read permission in this document"

from Products.CMFPlomino.PlominoUtils import json_dumps
from Products.CMFPlone.utils import safe_unicode
from gisweb.utils import Type

try:
    from gisweb.utils import dict2xml
except ImportError as err:
    GOT_XML = False
else:
    GOT_XML = True

def renderSimpleItem(db, doc, itemvalue, render, field, fieldtype):
    """ How simple item values are rendered """

    if not fieldtype:
        fieldtype = field.getFieldType()

    # if I need data representation (or metadata) for printing porposes
    if itemvalue and render and field and fieldtype not in ('TEXT', 'NUMBER', ):
        # not worth it to call the template to render text and numbers
        # it is an expensive operation
        fieldtemplate = db.getRenderingTemplate('%sFieldRead' % fieldtype) \
            or db.getRenderingTemplate('DefaultFieldRead')
        renderedValue = fieldtemplate(fieldname=name,
            fieldvalue = itemvalue,
            selection = field.getSettings().getSelectionList(doc),
            field = field,
            doc = doc
        ).strip()
    # if I need data value
    else:
        if not itemvalue:
            renderedValue = ''
        elif fieldtype == 'TEXT':
            renderedValue = safe_unicode(str(itemvalue)).encode('utf-8').decode('ascii', 'ignore')
        elif fieldtype == 'NUMBER':
            if render:
                custom_format = None if not field else field.getSettings('format')
                renderedValue = str(itemvalue) if not custom_format else custom_format % itemvalue
            else:
                renderedValue = itemvalue
        elif fieldtype == 'DATETIME':
            if field:
                custom_format = field.getSettings('format') or db.getDateTimeFormat()
            else:
                custom_format = db.getDateTimeFormat()
            renderedValue = itemvalue.strftime(custom_format)
        else:
            # in order to prevent TypeError for unknown not JSON serializable objects
            try:
                json_dumps(itemvalue)
            except TypeError:
                renderedValue = u'%s' % itemvalue
            else:
                renderedValue = itemvalue
    return renderedValue


def serialItem(doc, name, fieldtype=None, nest=True, render=True, follow=True, fieldsubset=[], fieldnames=[]):
    """
    Returns a list of 2-tuples with the data contained in the document item

    doc         : the PlominoDocument;
    name        : the item name;
    nest        : whether the fields of type DATAGRID and DOCLINK has to be
                  serialized nested in a list;
    render      : if you are interested in the data value serialization
                  set it to False, otherwise you'll obtain the data renderization
                  through the item basic read template,
    follow      : follow doclink?
    """

    result = list()
    itemvalue = doc.getItem(name)
    db = doc.getParentDatabase()

    form = doc.getForm()
    if not fieldnames:
        fieldnames = [i.getId() for i in form.getFormFields(includesubforms=True, doc=None, applyhidewhen=False)]

    if name in fieldnames:
        field = form.getFormField(name)
        fieldtype = field.getFieldType()
    else:
        field = None
        # try a guess
        if isinstance(itemvalue, (int, float, )):
            fieldtype = 'NUMBER'
        elif isinstance(itemvalue, DateTime):
            fieldtype = 'DATETIME'
        # by-pass Plone error using isinstance as in other cases
        # using isinstance(itemvalue, list) I get
        # TypeError: isinstance() arg 2 must be a class, type, or tuple of classes and types
        # even if "list" is a class itself
        elif 'list' in Type(itemvalue):
            fieldtype = 'SELECTION'
        # good for everyone
        else:
            fieldtype = 'TEXT'


    assert fieldtype, 'No fieldtype is specified for "%(name)s" with value "%(itemvalue)s"' % locals()

    # arbitrary assumption
    if fieldtype == 'DATE':
        fieldtype = 'DATETIME'

    if fieldtype == 'DATAGRID' or (follow and fieldtype == 'DOCLINK'):
        #result.append((name, fieldtype))
        if nest:
            sub_result = list()

        if fieldtype == 'DATAGRID':
            grid_form = db.getForm(field.getSettings().associated_form)
            grid_field_names = field.getSettings().field_mapping.split(',')

        for innervalue in itemvalue or []:
            if fieldtype == 'DOCLINK':
                sub_doc = db.getDocument(innervalue)
                sub_element = dict(sub_doc.serialDoc(fieldsubset=fieldsubset, nest=nested, render=render, follow=False))
            else:
                sub_element = dict([(
                    k, renderSimpleItem(db, doc, v, render,
                        grid_form.getFormField(k),
                        None)
                ) for k,v in zip(grid_field_names, innervalue)])

            if nest:
                sub_result.append(sub_element)
            else:
                result += [('%s.%s' % (name, k), v) for k,v in sub_element.items()]

        if nest:
            result.append((name, sub_result))

    else:
        renderedValue = renderSimpleItem(db, doc, itemvalue, render, field, fieldtype)
        #key = prefix + fieldname
        result.append((name, renderedValue, ))
    return result

# trick
if fieldsubset and isinstance(fieldsubset, basestring):
    fieldsubset = fieldsubset.split(',')
if fieldnames and isinstance(fieldnames, basestring):
    fieldnames = fieldnames.split(',')

raw_data = serialItem(context, name, nest=nest, render=render, follow=follow, fieldsubset=fieldsubset, fieldnames=fieldsubset)

# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(dict(raw_data))
elif format == 'xml':
    assert GOT_XML, '%s' % err
    context.REQUEST.RESPONSE.setHeader("Content-type", "text/xml")
    return dict2xml(dict(raw_data))
else:
    return raw_data
