## Script (Python) "getSessionData"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=id='',fld=''
##title=
##
from Products.CMFPlomino.PlominoUtils import json_loads
sdm = context.session_data_manager
session = sdm.getSessionData()
if session.has_key(id):
    data = json_loads(session[id])
    if fld and data.has_key(fld):
        return data[fld]
    elif not fld:
        return data
    else:
        return None
else:
    return None
