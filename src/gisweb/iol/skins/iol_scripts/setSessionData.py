## Script (Python) "setSessionData"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
from gisweb.utils import serialDoc
doc=context
sdm = context.session_data_manager
session = sdm.getSessionData()
session[doc.getId()] = serialDoc(doc)
return
