## Script (Python) "prorogaAutorizzazione"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=field='',grp='',model=''
##title=
##
from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now
from gisweb.utils import serialDoc, report, Type, requests_post, attachThis, os_path_join
from Products.CMFCore.utils import getToolByName

if context.portal_type != 'PlominoDocument':
    return context.REQUEST.RESPONSE.redirect(context.absolute_url())

doc=context

request = dict(parentDocument=doc.getId(),tipo_richiesta='proroga')

idx = doc.getParentDatabase().getIndex()
res = idx.dbsearch(request)

proroga = None
if res:
    proroga = res[0].getObject()
    
if not proroga: 
    context.REQUEST.RESPONSE.redirect(context.absolute_url())

wf = getToolByName(proroga, 'portal_workflow') #state_change.workflow
next_tr = 'istruttoria_completata'
wf.doActionFor(proroga, next_tr)

proroga.updateStatus()
proroga.copiaPerProroga()

doc.createDoc(field=field,grp=grp,model=model)
