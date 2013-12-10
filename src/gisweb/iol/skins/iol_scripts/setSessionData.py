## Script (Python) "setSessionData"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=sessionId='', params=''
##title=
##
from Products.CMFPlomino.PlominoUtils import json_loads,json_dumps
doc=context
sdm = context.session_data_manager
session = sdm.getSessionData()
if not sessionId:
    sessionId=doc.getId()
if not params:
    prms=doc.serialDoc(format='json')
else:
    prms=json_dumps(params)

session[sessionId] = prms
return
