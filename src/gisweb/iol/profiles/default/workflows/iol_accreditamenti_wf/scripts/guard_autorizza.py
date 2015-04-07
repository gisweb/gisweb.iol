## Script (Python) "guard_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFCore.utils import getToolByName

doc = state_change.object

return True
#if not doc.controllo_accessi(ruoli=['rup', 'istruttore', 'Manager']):
   # return False

# Il gruppo "Accreditati" è una dipendenza di questo workflow
#+ se non è presente lo script di transizione va in errore

#grp_name = 'Accreditati'

#tool = getToolByName(context, 'portal_groups')
#group = tool.getGroupById(grp_name)

#if group:
    #return True
#else:
    #err_msg = 'Attenzione! Il gruppo "%s" non è presente nel portale!' % grp_name
    #err = (unicode(err_msg, errors='replace'), 'error')
    #plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    #plone_tools.addPortalMessage(*err, request=context.REQUEST)
    #return False
