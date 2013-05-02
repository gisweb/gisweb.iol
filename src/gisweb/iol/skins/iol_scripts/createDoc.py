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

url1 = context.getMyAttribute('ws_readdocument_URL').get('value')

if """\\""" in filename:
    filename = filename.split("\\")[-1]
filename = '.'.join(
        [normalizeString(s, encoding='utf-8')
            for s in filename.split('.')])

docurl = "%s?app=%s&id=%s&filename=%s" %(url1, context.getItem('tipo_app', ''), context.getId(), filename)

try:
    res = open_url(docurl,asFile=False)
except Exception as err:
    from gisweb.utils import Type
    msg1 = "%s: %s" % (Type(err), err)
    msg2 = "Attenzione! Non è stato possibile allegare il file: %s" % filename
    script.addPortalMessage(msg1, 'error')
    script.addPortalMessage(msg2, 'warning')
else:
    (f,c) = context.setfile(res,filename=filename,overwrite=True,contenttype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    if f and c:
        context.setItem(field,{filename:c})

