## Script (Python) "annullaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title= "script per annullare il pagamento"
##


from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now




importo=context.REQUEST.get('importo')
esito=context.REQUEST.get('esito')
divisa=context.REQUEST.get('divisa')
trans=str(context.REQUEST.get('codTrans'))


context.setItem('importo_pagamento',importo)
context.setItem('esito_pagamento',esito)
context.setItem('divisa',divisa)
context.setItem('codTrans_pagamento',trans)



p=[]
if context.getItem('elenco_pagamenti'):
    for c in context.getItem('elenco_pagamenti'):
        
        c[4]='pagamento annullato'
        c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)

    context.setItem('elenco_pagamenti',p)

rurl=context.absolute_url()
context.redirectTo(rurl)
