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

from gisweb.utils import requests_post,attachThis,Type
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import open_url

if context.portal_type != 'PlominoDocument':
    return ''
if not file_type:
    return ''

doc = context
serviceURL = context.getLocalProperties('ws_converttopdf_URL')

files = doc.getItem(file_type, {})
filename = files.keys()[-1]
newfilename = filename.replace('.docx','.pdf')
info = doc.naming()
docurl='%s/%s' %(doc.absolute_url(),filename)

url = '%s?mode=%s&docurl=%s' %(serviceURL,'show',docurl)

try:
    result = open_url(url,asFile=False)
except Exception as error:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = ('%s: %s' % (Type(error), error), 'error')
    context.setItem('test',msg)
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    context.REQUEST.RESPONSE.redirect(context.absolute_url())
else:
    context.removeItem(file_type)
    #attachThis(context, result, file_type, filename=newfilename, overwrite=True)
    (f,c) = context.setfile(result,filename=newfilename,overwrite=True,contenttype='application/pdf')
    if f and c:
        context.setItem(file_type,{newfilename:c})
