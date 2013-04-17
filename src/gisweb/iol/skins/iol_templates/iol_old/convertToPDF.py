## Script (Python) "convertToPDF"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=file_type='documenti_autorizzazione'
##title=(copiato in gisweb.iol, DA CANCELLARE)
##
from gisweb.utils import requests_post,attachThis,Type
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import open_url

if context.portal_type != 'PlominoDocument':
    return ''
if not file_type:
    return ''


#result = open_url('http://iol.vmserver/printservice/services/xConvert.php?dirname=trasporti/dcdc8d9912ef4ae68bc958ab15ae0b89&mode=show&filename=autorizzazione-trasporti-eccezionali.docx')
#context.REQUEST.RESPONSE.setHeader("Content-type", "application/pdf")
#return result

doc = context
serviceURL = context.appProperties('ws_converttopdf_URL')

files = doc.getItem(file_type, {})
filename = files.keys()[-1]
newfilename = filename.replace('.docx','.pdf')
info = doc.naming_manager()
docurl='%s/%s' %(doc.absolute_url(),filename)
#query = dict(
#    dirname = '%s/%s' %(info['tipo_app'],doc.getId()),    filename = filename,
#    mode='show'
#)

#url = '%s?mode=%s&dirname=%s&filename=%s' %(serviceURL,query['mode'],query['dirname'],query['filename'])
url = '%s?mode=%s&docurl=%s' %(serviceURL,'show',docurl)
#return url
try:
    result = open_url(url,asFile=False)
except Exception as error:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = ('%s: %s' % (Type(error), error), 'error')
    context.setItem('test',msg)
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    context.REQUEST.RESPONSE.redirect(context.absolute_url())
    return

    
#return result
context.removeItem(file_type)
#return valueToSubmit
dummy = attachThis(context, result, file_type, filename=newfilename, overwrite=True)
return 
return str(result) # debug: erase me
context.REQUEST.RESPONSE.setHeader("Content-type", "application/pdf")
return result['content'] or 'vuoto'
