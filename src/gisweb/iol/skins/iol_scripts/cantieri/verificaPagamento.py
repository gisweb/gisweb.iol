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
trans=str(doc.REQUEST.get('codTrans'))

if trans:
    codice_trans_pagamento = 'PO-%s' %(trans)
    gruppo = trans.split('-')[1]
rurl=doc.absolute_url()

wf = getToolByName(doc, 'portal_workflow')

if doc.getItem('elenco_pagamenti'):    
    diz_dg_pagamenti = doc.translateListToDiz(doc.getId(),'sub_elenco_pagamenti','elenco_pagamenti')

    for diz_pagamento in diz_dg_pagamenti:        
        # il pagamento e' stato effettuato online
        if diz_pagamento['gruppo_sub_pagamento'] == gruppo:
            diz_pagamento['codice_pos'] = '%s-%s' %(codice_trans_pagamento,diz_pagamento['codice_sub_pagamento'])
            diz_pagamento['modalita_pagamento'] = 'online' 
    dg = doc.translateDizToList(doc.getId(),'sub_elenco_pagamenti','elenco_pagamenti',diz_dg_pagamenti)
        
    doc.setItem('elenco_pagamenti',dg)
transitions_avb =  [act['id'] for act in doc.wf_transitionsInfo(wf_id='iol_cantieri_wf', args=['description'])]
if doc.wf_getInfoFor('review_state') == 'pagamenti_avvio' and doc.getItem('esito_pagamento')=='OK':
        
    wf.doActionFor(doc, 'effettua_pagamento_bolli')
elif 'effettua_pagamento' in transitions_avb and doc.getItem('esito_pagamento')=='OK':
    wf.doActionFor(doc, 'effettua_pagamento')
else:
    doc.redirectTo(rurl)



doc.redirectTo(rurl)
