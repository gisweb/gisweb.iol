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

def settaElencoTransazioni():
    trans = doc.getItem('codTrans_pagamento','')
    if trans!='':
        elenco = doc.getItem('elencoTransazioniPagamenti',[])
        if elenco == [] or elenco==None:         
            elenco = [trans]
        else:
            if trans not in elenco:
                elenco.append(trans)
        doc.setItem('elencoTransazioniPagamenti',elenco)

wf = getToolByName(doc, 'portal_workflow')
transitions_avb =  [act['id'] for act in doc.wf_transitionsInfo(wf_id='iol_cantieri_wf', args=['description'])]
if doc.wf_getInfoFor('review_state') == 'pagamenti_avvio' and doc.getItem('esito_pagamento')=='OK':
    settaElencoTransazioni()
    wf.doActionFor(doc, 'effettua_pagamento_bolli')
elif 'effettua_pagamento' in transitions_avb and doc.getItem('esito_pagamento')=='OK':
    settaElencoTransazioni()	
    wf.doActionFor(doc, 'effettua_pagamento')
else:
    doc.redirectTo(rurl)



doc.redirectTo(rurl)