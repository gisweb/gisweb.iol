## Script (Python) "verificaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= doc=''
##title= "script che verifica  il pagamento dei dehor"
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now
from Products.CMFCore.utils import getToolByName

rurl=doc.absolute_url()

if len(getChainFor(doc))>1:
    # recupera id del wf secondario
    wf_id = getChainFor(doc)[1]
else:
    # recupera id del wf primario
    wf_id = getChainFor(doc)[0] 

wf = getToolByName(doc, 'portal_workflow')

transitions_avb =  [act['id'] for act in doc.wf_transitionsInfo(wf_id=wf_id, args=['description'])]
transitions_wf_main =  [act['id'] for act in doc.wf_transitionsInfo(args=['description'])]

if doc.getItem('iol_tipo_richiesta')=='rinnovo' and 'invia_domanda_autorizzazione' in transitions_wf_main:
    wf.doActionFor(doc, 'invia_domanda_autorizzazione')

if 'effettua_pagamento_online' in transitions_avb:    
    wf.doActionFor(doc, 'effettua_pagamento_online')

if doc.getItem('iol_tipo_richiesta')=='base':    
    if 'autorizza' in transitions_wf_main:
        wf.doActionFor(doc, 'autorizza')
else:
	doc.redirectTo(rurl)



doc.redirectTo(rurl)        