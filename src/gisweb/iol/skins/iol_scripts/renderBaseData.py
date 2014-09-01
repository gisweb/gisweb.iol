## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= applicazione=''
##title=Script che renderizza i dati base della pratica
##
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              # 
################################################################################################

#if not context.portal_type in ('PlominoForm','PlominoDocument'):
 #   return '<div class="error">Il contesto non è ne un documento se un form. %s</div>' %(context.portal_type)

#Plomino Database    

from Products.CMFCore.utils import getToolByName

db = context.getParentDatabase()
app = getToolByName(context,applicazione)
doc = context







scriptName = 'renderBaseData'



if scriptName in app.objectIds():
     
    return app.renderBaseData(doc)
else:
    return 'not found'

