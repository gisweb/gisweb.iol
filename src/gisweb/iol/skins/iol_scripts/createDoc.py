## Script (Python) "createDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=model='', grp='', field='documenti_autorizzazione', url='ws_createdocx_URL', redirect_url='', test=False
##title=createDoc (interfaccia client al servizio xCreate)
##

"""
Create docx file from a PlominoDocument giving a template model

model: name of the template;
grp: group
field: field of the PlominDocument where to set the docx file created;
redirect_url: where to redirect after this operation (optional)
"""

assert context.portal_type == 'PlominoDocument', "Context is not a PlominoDocument"
assert field, "item parameter is mandatory!"

from Products.CMFPlone.utils import normalizeString
from gisweb.utils import requests_post, decode_b64, Type

res = context.get_property(url)
if 'value' in res:
    # in caso contrario considero sia stata passata una url castom
    url = res.get('value')

def getFileName(m):
    """ """
    f = m
    for c in ('\\', '/', ):
        if c in m:
            f = f.split(c)[-1]
    f = '.'.join([normalizeString(s, encoding='utf-8') 
        for s in f.split('.')])
    return f

def test_path(o, v, *a):
    """ Verifica la presenza di tutte le chiavi annidate in 'a' e
    testa il valore dell'ultima variavile che sia uguale a 'v'
    """
    foo = dict(o)
    for k in a:
        if not k in foo:
            return False
        else:
            foo = foo.get(k, {})
    return foo == v

def redirect_with_warning(msg, level='error'):
    """ """
    from Products.CMFCore.utils import getToolByName
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    plone_tools.addPortalMessage(msg, level, request=context.REQUEST)
    context.REQUEST.RESPONSE.redirect(context.absolute_url())

#Progetto Corrente
proj = context.get_property('project').get('value', '')
filename = getFileName(model)

query = dict(
    app = context.REQUEST.get('test_app') or context.getItem('iol_tipo_app'),
    model = model,
    group = grp,
    project = proj,
    dataType = 'JSON',
    #mode = 'show',
    data = context.serialDoc(format='json', render=True),
    id = context.id,
    filename = filename,
    download = 'false'
)

try:
    res = requests_post(url, query, 'json', timeout=30)
except Exception as error:
    msg = '%s: %s' % (Type(error), error)
    redirect_with_warning(msg)
else:
    if res['status_code'] == 200:
        if test_path(res, 1, 'json', 'success'):
            text = decode_b64(res['json']['file'])
            if test is False:
                context.removeItem(field)
                (f,c) = context.setfile(text, filename=filename, overwrite=True,
                    contenttype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                if f and c:
                        context.setItem(field, {f: c})
            else:
                return res
        if test_path(res, 0, 'json', 'success'):
            msg = res['json']['message']
            redirect_with_warning(msg)

if redirect_url is True:
    context.REQUEST.RESPONSE.redirect(context.absolute_url())
elif redirect_url:
    context.REQUEST.RESPONSE.redirect(redirect_url)
