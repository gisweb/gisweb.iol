effettuato=False

allegato_pagamento=[]
allegato_pagamento_rate=[]
if context.getItem('ricevuta_pagamento'):
    allegato_pagamento = context.getItem('ricevuta_pagamento').keys()
if context.getItem('rate_pagamento_ricevuta'):    
    allegato_pagamento_rate = context.getItem('rate_pagamento_ricevuta').keys()

stati=['non pagato','pagamento annullato']
if context.getItem('elenco_pagamenti'):
    cod_non_pagati = filter(lambda x: x[4] in stati ,context.getItem('elenco_pagamenti'))
    
if context.getItem('esito_pagamento')=='OK':
    effettuato=True
    
# se in assegnata è presente almeno una ricevuta di pagamento per tipo allora non si può riproporre il pagamento
# a meno che non si: rimuove un allegato e si imposta la corrispondente voce nel/i dg a pagamento annullato o pagamento non effettuato
              
elif context.wf_getInfoFor('review_state')=='istruttoria_ok' and context.getItem('iol_tipo_richiesta')=='base':
    if len(allegato_pagamento) > 0:
        effettuato=True
elif context.wf_getInfoFor('review_state')=='avvio' and context.getItem('iol_tipo_richiesta')=='rinnovo':
    if len(allegato_pagamento) > 0:
        effettuato=True        

# in caso di autorizzata per il pagamento delle rate successive, se sono presenti un numero di allegati per il campo "allegati rate" inferiore
# al numero di rate allegate allora il pagamento sarà riproponibile
elif context.wf_getInfoFor('review_state')=='autorizzata':
    s=['pagamento annullato','non pagato']
    num_rate_non_pagate = len(filter(lambda c: c[4] in s,context.getItem('elenco_rate_pagamenti')))    
    if  num_rate_non_pagate > 0:
        effettuato=False
    else:
        effettuato=True
        
# caso rinnovo       
elif context.getItem('iol_tipo_richiesta')=='rinnovo' and context.wf_getInfoFor('review_state')=='avvio':
    if len(allegato_pagamento) > 0 and len(allegato_pagamento_rate)>0:
        effettuato=True
    else:
        effettuato =True
            
    
    
elif context.getItem('esito_pagamento')=='KO':
    effettuato=False
    
return effettuato
