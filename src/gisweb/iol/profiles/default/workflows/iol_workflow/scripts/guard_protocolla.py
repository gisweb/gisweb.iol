## Script (Python) "guard_protocolla"
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

if doc.wf_getInfoFor('review_state') == 'avvio':
    return True
else:
    isIstruttore = doc.verificaRuolo('iol-reviewer') or doc.verificaRuolo('iol-manager')
    return not doc.getItem('numero_protocollo','') and isIstruttore
