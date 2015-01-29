## Script (Python) "inviaDomanda"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

codice_rata = context.REQUEST.get('rate_opt_utente')

# nel caso di delega
if context.getItem('Form')=='frm_dehor_delega':
    context.setItem('stato','inviata')
    context.redirectTo(context.absolute_url())
    
    
elif context.getItem('iol_tipo_richiesta')=='rinnovo' and codice_rata:
    rata = context.REQUEST.get('rate_opt_utente')
    context.setItem('rate_opt_utente',[rata])
    context.setItem('permesso_rate_opt',[rata])
    elenco_rate = context.dehor.ratePagamenti(context.getId(),rata)
    context.setItem('elenco_rate_pagamenti',elenco_rate)
    url = '%s/%s/content_status_modify?workflow_action=%s&req_pagamenti=0' %(context.getParentDatabase().absolute_url(),context.getId(),'richiedi_pagamento')
    context.redirectTo(url)
elif context.getItem('iol_tipo_richiesta')=='rinnovo':
    url = '%s/%s/content_status_modify?workflow_action=%s&req_pagamenti=0' %(context.getParentDatabase().absolute_url(),context.getId(),'richiedi_pagamento')
    context.redirectTo(url)
else:  
    # recupara codice rate da url 
    rata = context.REQUEST.get('rate_opt_utente')
    context.setItem('rate_opt_utente',rata)
    
    
    #protocolla
    context.protocollaInvia()
