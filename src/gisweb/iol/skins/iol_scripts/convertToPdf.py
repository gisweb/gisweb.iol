## Script (Python) "convertToPdf_rewrite"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=item='documenti_autorizzazione', url='ws_converttopdf_URL_dev', test=False
##title=convertToPdf (interfaccia client al servizio xConvert)
##
"""
Converte il file docx in documenti_autorizzazione in pdf
"""

assert context.portal_type == 'PlominoDocument', "Context is not a PlominoDocument!"
assert item, "item parameter is mandatory!"

from gisweb.utils import Type, decode_b64, requests_post, encode_b64

res = context.get_property(url)
if 'value' in res:
    # in caso contrario considero sia stata passata una url castom
    url = res.get('value')

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

files = context.getItem(item, {})
convertibles = [c for c in files.items() if c[0].endswith('.docx')]

if len(convertibles)>0:
    filename, mime = convertibles[0]
else:
    return ''

query = dict(
    #docurl = '%s/%s' %(context.absolute_url(), filename),
    file = encode_b64(context.getfile(filename)),
    app = context.getItem('iol_tipo_app'),
    id = context.getId(),
)
    
try:
    res = requests_post(url, query, 'json', 'headers')
except Exception as error:
    msg = '%s: %s' % (Type(error), error)
    redirect_with_warning(msg, level='error')
else:
    if res['status_code'] == 200:
        if test_path(res, 1, 'json', 'success'):
            # interrogazione avvenuta con successo
            text = decode_b64(res['json']['file'])
            if test is False:
                newfilename = filename.replace('.docx','.pdf')
                (f,c) = context.setfile(text, filename=newfilename, overwrite=True, contenttype='application/pdf')
                if f and c:
                    context.setItem(item, {f: c})
            else:
                return res
        elif test_path(res, 0, 'json', 'success'):
            msg = res['json']['message']
            redirect_with_warning(msg)
        else:
            raise Excetion('NotImplementedError: risposta non prevista.')
            
    else:
        # gestione dell'erroe di comunicazione col servizio
        msg = 'Il servizio ha risposto con uno status: %s' % res['status_code']
        redirect_with_warning(msg, level='error')