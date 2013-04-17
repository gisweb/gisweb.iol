## Script (Python) "sessionPlominoDataGet"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=id='',fld=''
##title=script di test per restituire i dati in sessione
##
from Products.CMFCore.utils import getToolByName
session_manager = getToolByName(context, 'session_data_manager')
session = session_manager.getSessionData()

return session
