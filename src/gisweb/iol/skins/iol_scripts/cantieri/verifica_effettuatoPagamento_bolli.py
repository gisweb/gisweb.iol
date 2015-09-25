## Script (Python) "verificaPagamento_effettuato_bolli"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=setta flag per variabile wf wf_effettuato_pagamento
##

stati=['non pagato','pagamento annullato']
effettuato = False

if context.getItem('allegato_bolli_utente',{})!={}:
	effettuato = True

#if context.getItem('elenco_pagamenti'):
#    cod_non_pagati = filter(lambda x: x[4] in stati ,context.getItem('elenco_pagamenti'))

#return len(cod_non_pagati)>0
return effettuato
