## Script (Python) "verificaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= doc=''
##title= "script che verifica  il pagamento dei cantieri"
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now
from Products.CMFCore.utils import getToolByName

rurl=doc.absolute_url()

wf = getToolByName(doc, 'portal_workflow')
transitions_avb =  [act['id'] for act in doc.wf_transitionsInfo(wf_id='iol_cantieri_wf', args=['description'])]
if doc.wf_getInfoFor('review_state') == 'pagamenti_avvio' and doc.getItem('esito_pagamento')=='OK':
	wf.doActionFor(doc, 'effettua_pagamento_bolli')
elif 'effettua_pagamento' in transitions_avb and doc.getItem('esito_pagamento')=='OK':
    wf.doActionFor(doc, 'effettua_pagamento')
else:
	doc.redirectTo(rurl)



doc.redirectTo(rurl)