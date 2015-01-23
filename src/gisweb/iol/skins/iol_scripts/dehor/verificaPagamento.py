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
from gisweb.utils import getChainFor
trans=str(context.REQUEST.get('codTrans'))

if trans:
    codice_trans_pagamento = 'PO-%s' %(trans.split('-')[1])
rurl=doc.absolute_url()

if len(getChainFor(doc))>1:
    # recupera id del wf secondario
    wf_id = getChainFor(doc)[1]
else:
    # recupera id del wf primario
    wf_id = getChainFor(doc)[0] 

wf = getToolByName(doc, 'portal_workflow')

if context.getItem('elenco_pagamenti'):
    diz_dg_pagamenti = context.translateListToDiz(context.getId(),'sub_elenco_pagamenti','elenco_pagamenti')
    for diz_pagamento in diz_dg_pagamenti:
        if diz_pagamento['stato_pagamento']=='pagamento effettuato':
            # il pagamento è stato effettuato
            diz_pagamento['codice_pos'] = '%s-%s' %(codice_trans_pagamento,diz_pagamento['codice_sub_pagamento'])
            
    if not context.getItem('elenco_rate_pagamenti'):        
        # aggiunge la transazione di pagamento al dg principale solo se non si sono le rate
        dg = context.translateDizToList(context.getId(),'sub_elenco_pagamenti','elenco_pagamenti',diz_dg_pagamenti)
        context.setItem('elenco_pagamenti',dg)

transitions_avb =  [act['id'] for act in doc.wf_transitionsInfo(wf_id=wf_id, args=['description'])]
transitions_wf_main =  [act['id'] for act in doc.wf_transitionsInfo(args=['description'])]



if 'effettua_pagamento_online' in transitions_avb:    
    wf.doActionFor(doc, 'effettua_pagamento_online')





doc.redirectTo(rurl)        