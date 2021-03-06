## Script (Python) "createDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=model='', grp='', field='',redirect_url=''
##title=Create docx file from PlominoDocument
##
"""
Create docx file from a PlominoDocument giving a template model

model: model template name;
grp: 
field: field of the PlominDocument where to set the docx file created;
redirect_url: where to redirect after this operation (optional)
"""

if context.portal_type != 'PlominoDocument':
    return ''

from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now, open_url
from gisweb.utils import report, Type, requests_post
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import normalizeString

if context.portal_type != 'PlominoDocument':
    return ''

doc = context
#URL del servizio di creazione del documento
urlCreate = context.get_property('ws_createdocx_URL').get('value')
#URL del servizio di lettura del documento
urlRead = context.get_property('ws_readdocument_URL').get('value')

#Progetto Corrente
try:
    proj = context.get_property('project')['value']
except:
    proj = ''

filename=model
if """\\""" in filename:
    filename = filename.split("\\")[-1]
filename = '.'.join(
        [normalizeString(s, encoding='utf-8') 
            for s in filename.split('.')])

#Url con parametri del servizio de lettura
docurl = "%s?app=%s&id=%s&filename=%s&project=%s" %(urlRead,doc.getItem('tipo_app',''),doc.getId(),filename,proj)

#Parametri della chiamata al servizio di creazione
query = dict(
    app = context.REQUEST.get('test_app') or doc.getItem('tipo_app'),
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
    oItem = doc.getItem(field, {}) or {}
    oItem[filename] = c
    doc.setItem(field, oItem)

if redirect_url:
    doc.REQUEST.RESPONSE.redirect(redirect_url)
