## Script (Python) "verificaRicevuta_pagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=setta flag per variabile wf wf_ricevuta_pagamento
##


#allegato_pagamento = [x for x in [i for i in context.getItems() if i.startswith('ricevuta_pagamento')] if context.getItem(x)!={}]
#allegato_pagamento_rate = [x for x in [i for i in context.getItems() if i.startswith('rate_pagamento')] if context.getItem(x)!={}]
allegato_pagamento=[]
allegato_pagamento_rate=[]
if context.getItem('ricevuta_pagamento'):
    allegato_pagamento = context.getItem('ricevuta_pagamento').keys()
if context.getItem('rate_pagamento_ricevuta'):    
    allegato_pagamento_rate = context.getItem('rate_pagamento_ricevuta').keys()

ricevuta = False

if len(allegato_pagamento) > 0:
    ricevuta = True
    
#if len(allegato_pagamento_rate) > 0:
   # ricevuta=True
    
numero_rate = context.getItem('numero_rate_allegate') 
if len(allegato_pagamento_rate) > 0:
    if len(allegato_pagamento_rate) >= numero_rate:
        ricevuta = True
    else:
        ricevuta = False
        
if context.wf_getInfoFor('review_state') == 'autorizzata':
    
    s=['pagamento annullato','non pagato']
    num_rate_non_pagate = len(filter(lambda c: c[4] in s,context.getItem('elenco_rate_pagamenti')))
    
    if num_rate_non_pagate > 0:
        
        ricevuta=True
    else:
        ricevuta = False
        
if context.wf_getInfoFor('review_state') == 'avvio' and context.getItem('iol_tipo_richiesta')=='rinnovo':
    ricevuta = True        

return ricevuta