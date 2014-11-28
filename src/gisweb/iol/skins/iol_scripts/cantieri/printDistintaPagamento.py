## Script (Python) "printDistintaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc='',field = 'documento_distinta_pagamento', grp = 'distinta'
##title=stampoa distinta pagamento
##

from Products.CMFPlomino.PlominoUtils import json_loads, Now
context.setItem('data_distinta_pagamento',Now())

elenco = context.getItem('elenco_pagamenti')
stati = ['non pagato','pagamento annullato']
cod_non_pagati = [cod[0] for cod in elenco if cod[4] in stati]
if elenco:
    aa = []
    for elem in elenco:
        if elem[0] in cod_non_pagati:
            importo=elem[1]
            causale=elem[2] 
            data = elem[-1]
            array=[importo,causale,data]
            aa.append(array)
    if len(aa) > 0:        
        context.setItem('elenco_pagamenti_print',aa)
    importo_list=[float(cod[1]) for cod in context.getItem('elenco_pagamenti') if cod[0] in cod_non_pagati]   
    if len(importo_list)>0:
        importo=sum(filter(lambda v:v,importo_list))
        context.setItem('importo_totale_no_pagato',importo)
    
            

field = context.REQUEST.get('field')
grp = context.REQUEST.get('grp') or 'distinta'
info = json_loads(context.printModelli(context.getParentDatabase().getId(),field=field,grp=grp))

context.aq_parent.createDoc(model=info['distinta_pagamento.docx']['model'],field=field,grp=grp,redirect_url=context.getDocument(doc).absolute_url())

