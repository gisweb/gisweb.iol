## Script (Python) "verificaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title= "script che verifica  il pagamento"
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString
from Products.CMFCore.utils import getToolByName


#doc=str(context.REQUEST.get('url'))
importo=context.REQUEST.get('importo')
data=StringToDate(context.REQUEST.get('data'),'%d/%m/%Y')
ora=str(context.REQUEST.get('orario'))
esito=context.REQUEST.get('esito')
divisa=context.REQUEST.get('divisa')
trans=str(context.REQUEST.get('codTrans'))
aut=context.REQUEST.get('codAut')

session=context.REQUEST.get('session_id')

wf = getToolByName(context, 'portal_workflow')


#if context.REQUEST.SESSION.id == sessione:


context.setItem('importo_pagamento',importo)
context.setItem('data_pagamento',data)
context.setItem('ora_pagamento',ora)
context.setItem('esito_pagamento',esito)
context.setItem('divisa',divisa)
context.setItem('codTrans_pagamento',trans)
context.setItem('codAut_pagamento',aut)


cod_paga=trans.split('-')[-1]

p=[]
if context.getItem('elenco_pagamenti'):
    for c in context.getItem('elenco_pagamenti'):
        if c[3]==cod_paga:
            c[4]='pagamento effettuato'
            c[5]=DateToString(data,'%d/%m/%Y')
            p.append(c)

    context.setItem('elenco_pagamenti',p)
  	wf = getToolByName(context, 'portal_workflow')


    
rurl=context.absolute_url()

context.redirectTo(rurl)
