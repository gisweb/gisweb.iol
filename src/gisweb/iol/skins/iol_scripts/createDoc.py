## Script (Python) "createDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=filename='', grp='', field=''
##title=Create docx file from PlominoDocument
##

"""
Create docx file

filename:
grp:
field:
workflow_action:
"""

from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now, open_url
from gisweb.utils import serialDoc, report, Type, requests_post, attachThis, os_path_join
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import normalizeString

if context.portal_type != 'PlominoDocument':
    return ''

doc = context
#URL del servizio di creazione del documento
urlCreate = context.getMyAttribute('ws_createdocx_URL').get('value')
#URL del servizio di lettura del documento
urlRead = context.getMyAttribute('ws_readdocument_URL').get('value')
model=filename
if """\\""" in filename:
    filename = filename.split("\\")[-1]
filename = '.'.join(
        [normalizeString(s, encoding='utf-8') 
            for s in filename.split('.')])

#Url con parametri del servizio de lettura
docurl = "%s?app=%s&id=%s&filename=%s" %(urlRead,doc.getItem('tipo_app',''),doc.getId(),filename)

#Parametri della chiamata al servizio di creazione
query = dict(
    app = context.REQUEST.get('test_app') or doc.getItem('tipo_app'),
    model = model,
    group = grp,
    dataType = 'JSON',
    #mode = 'show',
    data = serialDoc(context, serial_as='json'),
    id = context.id,
    filename = filename,
    download = 'false'
)
#Creazione del documento tramite webservice
try:
    result = requests_post(urlCreate,query, 'json', timeout=30)
except Exception as error:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = ('%s: %s' % (Type(error), error), 'error')
    context.setItem('test',msg)
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    doc.REQUEST.RESPONSE.redirect(context.absolute_url())


#Lettura del documento da webservice
res = open_url(docurl,asFile=False)
(f,c) = doc.setfile(res,filename=filename,overwrite=True,contenttype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
if f and c:
    doc.setItem(field,{filename:c})
