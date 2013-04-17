## Script (Python) "sessionPlominoDataSet"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=script di test per inserire i dati in sessione
##
context=doc

if not doc.portal_type == 'PlominoDocument':
    return

db = doc.getParentDatabase()


sdm = context.session_data_manager
session = sdm.getSessionData(create=True)

obj=dict()
for fld in doc.getItems():
    obj[fld]=doc.getItem(fld)

session[doc.getId()]=obj
return
