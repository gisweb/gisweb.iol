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
from gisweb.utils import getChainFor

if len(getChainFor(context))>1:
    # recupera id del wf secondario
    wf_id = getChainFor(context)[1]
else:
    # recupera id del wf primario
    wf_id = getChainFor(context)[0]   




importo=context.REQUEST.get('importo')
esito=context.REQUEST.get('esito')
divisa=context.REQUEST.get('divisa')
trans=str(context.REQUEST.get('codTrans'))
totale = str(context.REQUEST.get('totale')) or '0'

context.setItem('importo_pagamento',importo)
context.setItem('esito_pagamento',esito)
context.setItem('divisa',divisa)
context.setItem('codTrans_pagamento',trans)


cod_paga=trans.split('-')[-1]


# devo verificare che il codice non sia presente nell'elenco delle rate
# 'permesso_rate_opt' è un cambo combo con l'elenco dei codici dei pagamenti rateizzabili
#cod_pagam = c[0]
def listRate(lista,codice_pagam):
    for c in lista:
        elenco_codici_rate = context.getItem('permesso_rate_opt')
        if elenco_codici_rate:       
            list_codici_rate = [codice_pagam for i in elenco_codici_rate if i == codice_pagam]
        else:
            list_codici_rate = []    
    return list_codici_rate   



def settoAnnulloPagamentiGruppo(lista,cod_gruppo):
    stati=['pagamento effettuato','in attesa di verifica']
    cod_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        if c[3]==cod_gruppo and c[0] not in cod_pagati:
            if c[0] not in listRate(lista,c[0]):
                c[4]='pagamento annullato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p) 

def settoAnnulloPagamentiTot(lista,cod_gruppo):
    stati=['pagamento effettuato','in attesa di verifica']
    cod_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        if c[3]==cod_gruppo and c[0] not in cod_pagati:          
            c[4]='pagamento annullato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)



def settoAnnulloPagamentiCodice(lista,cod_single):
    stati=['pagamento effettuato','in attesa di verifica']
    cod_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        cod_single = cod_single[:-2] + '00'
        if c[0]==cod_single and c[0] not in cod_pagati:
            c[4]='pagamento annullato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)



# aggiorno lo stato dei pagamenti solo per i pagamenti non rateizzabili
# nota totale è un parametro di REQUEST proveniente dal servizio di pagamento cartasi
if context.getItem('elenco_pagamenti') and totale == '0':
    settoAnnulloPagamentiGruppo(context.getItem('elenco_pagamenti'),cod_paga)


# aggiorno lo stato dei pagamenti per tutti pagamenti - totale     
elif context.getItem('elenco_pagamenti') and totale == '1':
    settoAnnulloPagamentiTot(context.getItem('elenco_pagamenti'),cod_paga)


# aggiorna lo stato di pagamento delle rate
rata = []
elenco_rate=[]
if context.getItem('elenco_rate_pagamenti') and context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id) and len(context.getItem('permesso_rate_opt'))>0: 
    elenco_rate = context.getItem('elenco_rate_pagamenti')
    
elif context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id) and len(context.getItem('permesso_rate_opt'))>0:
    elenco_rate = context.elencoRate(context.getId(),context.getItem('permesso_rate_opt')[0])

if len(elenco_rate)>0:    
    s=['non pagato','pagamento annullato']
    elenco_rate_no_pagate = filter(lambda cod: cod[4] in s ,elenco_rate)        
    elenco_rate_no_pagate.sort()
    rate_da_pagare = [v[0] for v in elenco_rate_no_pagate]
    
    # 1° caso dg rate non esistente
    if not context.getItem('elenco_rate_pagamenti'):       
        for idx,cod_rata in enumerate(elenco_rate):
            if cod_rata[3] == cod_paga and cod_rata[0] == rate_da_pagare[0]:
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
                rata = elenco_rate
                #rata.insert(idx,cod_rata)
                # impostiamo sul dg principale lo stato dei pagamenti es. pagamento rate in corso
                settoAnnulloPagamentiCodice(context.getItem('elenco_pagamenti'),cod_rata[0])
        context.setItem('elenco_rate_pagamenti',rata)
        
    # casi successivi il dg rate esiste
    
    elif context.getItem('elenco_rate_pagamenti'):
                
        for idx,cod_rata in enumerate(elenco_rate):
            
            if cod_rata[0] == rate_da_pagare[0]:
                
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')             

                settoAnnulloPagamentiCodice(context.getItem('elenco_pagamenti'),cod_rata[0])
                   
        context.setItem('elenco_rate_pagamenti',elenco_rate)
        
        
        

    

rurl=context.absolute_url()
context.redirectTo(rurl)
