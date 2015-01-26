## Script (Python) "convertToPdf"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=file_type='documenti_autorizzazione'
##title=
##
"""
Converte il file docx in documenti_autorizzazione in pdf
"""

from gisweb.utils import Type,decode_b64,requests_post, get_headers,is_json
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import open_url, json_loads

if context.portal_type != 'PlominoDocument':
    return ''
if not file_type:
    return ''

doc = context
#URL del servizio di Conversione
serviceURL = context.get_property('ws_converttopdf_URL').get('value')
#Progetto Corrente
#proj = context.get_property('project').get('value') or '' # variabile non usata

files = doc.getItem(file_type, {})
filename = files.keys()[-1]
newfilename = filename.replace('.docx','.pdf').replace('.odt','.pdf')
#info = doc.naming() # variabile non usata
docurl='%s/%s' %(doc.absolute_url(),filename)

url = '%s' %(serviceURL)
query = dict(
    docurl = docurl
    )
try:
    #result = open_url(url, asFile=False)
    r = requests_post(url,query, 'json', timeout=30)
except Exception as error:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = ('%s: %s' % (Type(error), error), 'error')
    context.setItem('test', msg)
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    context.REQUEST.RESPONSE.redirect(context.absolute_url())
else:
    result = r['text']
    if is_json(result):
        res = json_loads(result)

        if res['success']==1:
            text = decode_b64(res['file'])

            context.removeItem(file_type)
            (f,c) = context.setfile(text,filename=newfilename,overwrite=True,contenttype='application/pdf')
            if f and c:
                context.setItem(file_type, {f: c})
            else:
                msg = (res['message'], 'error')
                plone_tools.addPortalMessage(*msg, request=context.REQUEST)
                context.REQUEST.RESPONSE.redirect(context.absolute_url())