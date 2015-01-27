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
rate = context.getItem('elenco_rate_pagamenti',[])
stati = ['non pagato','pagamento annullato']
cod_non_pagati = [cod[0] for cod in elenco if cod[4] in stati]
cod_non_pagati_rate = [cod[0] for cod in rate if cod[4] in stati]
importo_tot = 0
if elenco:
    aa = []
    for elem in elenco:
        if elem[0] in cod_non_pagati:
            importo = elem[1]
            causale = elem[2] 
            data = elem[5]
            array = [causale,importo,data]
            aa.append(array)
    if len(aa) > 0:        
        context.setItem('elenco_pagamenti_print',aa)
    if context.getItem('rate_opt_utente'):

        importo_list = [float(cod[1]) for cod in context.getItem('elenco_pagamenti') if cod[0] in cod_non_pagati and cod[0] != '01200']   
    else:
        importo_list = [float(cod[1]) for cod in context.getItem('elenco_pagamenti') if cod[0] in cod_non_pagati]    
        
    if len(importo_list)>0:
        importo_tot += sum(filter(lambda v:v,importo_list))
        
    
if len(rate) > 0:
    list_rate = []
    for rata in rate:
        codice_rata = rata[0]
        importo_rata = rata[1]
        causale_rata = rata[2]
        data_scadenza = rata[6]
        array_rate = [codice_rata,causale_rata,importo_rata,data_scadenza]                
        list_rate.append(array_rate)      

    context.setItem('elenco_pagamenti_rate_print',list_rate) 
    importo_list_rate =[float(cod[1]) for cod in context.getItem('elenco_rate_pagamenti') if cod[0] in cod_non_pagati_rate]   
    if importo_list_rate:
        importo_tot += sum(filter(lambda v:v,importo_list_rate))

context.setItem('importo_totale_no_pagato',importo_tot)
context.setItem('data_distinta_pagamento',Now())   

field = context.REQUEST.get('field')
grp = context.REQUEST.get('grp') or 'distinta'
info = json_loads(context.printModelli(context.getParentDatabase().getId(),field=field,grp=grp))

context.aq_parent.createDoc(model=info['distinta_pagamento.docx']['model'],field=field,grp=grp,redirect_url=context.getDocument(doc).absolute_url())

