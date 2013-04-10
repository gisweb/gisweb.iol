## Script (Python) "createDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=model='', grp='', field='', workflow_action=''
##title=Create docx file from PlominoDocument
##

"""
Create docx file

model:
grp:
field:
workflow_action:
"""

from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now, open_url
from gisweb.utils import serialDoc, report, Type, requests_post, attachThis, os_path_join
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import normalizeString

printServer = 'iol.vmserver'

if context.portal_type != 'PlominoDocument':
    return ''

doc = context

url = context.appProperties('ws_createdocx_URL')
url1 = context.appProperties('ws_readdocument_URL')
filename = model

if """\\""" in filename:
    filename = filename.split("\\")[-1]
filename = '.'.join(
        [normalizeString(s, encoding='utf-8') 
            for s in filename.split('.')])

docurl = "%s?app=%s&id=%s&filename=%s" %(url1,doc.getItem('tipo_app',''),doc.getId(),filename)

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

try:
    result = requests_post(url,query, 'json', timeout=30)
except Exception as error:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = ('%s: %s' % (Type(error), error), 'error')
    context.setItem('test',msg)
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    doc.REQUEST.RESPONSE.redirect(context.absolute_url())
else:
    valueToSubmit = result['json']['filename']


#dummy = attachThis(context, valueToSubmit, field, filename=model, overwrite=True)
res = open_url(docurl,asFile=False)
(f,c) = doc.setfile(res,filename=filename,overwrite=True,contenttype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
if f and c:
    doc.setItem(field,{filename:c})
#dummy = attachThis(context, res, field, filename=model, overwrite=True)
if workflow_action:
    #wf = getToolByName(context, 'portal_workflow')
    #wf.doActionFor(context, workflow_action)
    context.REQUEST.RESPONSE.redirect(context.absolute_url()+'/content_status_modify?workflow_action='+workflow_action)
else:
    context.REQUEST.RESPONSE.redirect(context.absolute_url())
