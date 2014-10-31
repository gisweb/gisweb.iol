## Script (Python) "verificaPagamento_effettuato"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=setta flag per variabile wf wf_effettuato_pagamento
##


effettuato=False

allegato_pagamento = [x for x in [i for i in context.getItems() if i.startswith('ricevuta_pagamento')] if context.getItem(x)!={}]
allegato_pagamento_rate = [x for x in [i for i in context.getItems() if i.startswith('rate_pagamento')] if context.getItem(x)!={}]

stati=['non pagato','pagamento annullato']
if context.getItem('elenco_pagamenti'):
    cod_non_pagati = filter(lambda x: x[4] in stati ,context.getItem('elenco_pagamenti'))
    
if context.getItem('esito_pagamento')=='OK':
    effettuato=True
# se sono presenti tutte le ricevute 
elif len(allegato_pagamento) > 0 and len(allegato_pagamento_rate)>0:
    effettuato=True
    
    
elif context.getItem('esito_pagamento')=='ANNULLO':
    effettuato=False
return effettuato