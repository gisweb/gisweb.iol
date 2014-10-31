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
totale = str(context.REQUEST.get('totale'))

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
    p=[]
    for c in lista:
        if c[3]==cod_gruppo:
            if c[0] not in listRate(lista,c[0]):
                c[4]='pagamento annullato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p) 

def settoAnnulloPagamentiTot(lista,cod_gruppo):
    p=[]
    for c in lista:
        if c[3]==cod_gruppo:            
            c[4]='pagamento annullato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)



def settoAnnulloPagamentiTot(lista,cod_gruppo):
    p=[]
    for c in lista:
        if c[3]==cod_gruppo:            
            c[4]='pagamento annullato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)



def settoAnnulloPagamentiCodice(lista,cod_single):
    p=[]
    for c in lista:
        cod_single = cod_single[:-2] + '00'
        if c[0]==cod_single:
            c[4]='pagamento rate'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)



# aggiorno lo stato dei pagamenti solo per i pagamenti non rateizzabili
# nota totale è un parametro di REQUEST proveniente dal servizio di pagamento cartasi
if context.getItem('elenco_pagamenti') and totale == '0':
    settoAnnulloPagamentiGruppo(context.getItem('elenco_pagamenti'),cod_paga)

# aggiorno lo stato dei pagamenti per tutti i pagamenti - totale     

if context.getItem('elenco_pagamenti') and totale == '0':
    settoAnnulloPagamentiGruppo(context.getItem('elenco_pagamenti'),cod_paga)

# aggiorno lo stato dei pagamenti per tutti pagamenti - totale     
elif context.getItem('elenco_pagamenti') and totale == '1':
    settoAnnulloPagamentiTot(context.getItem('elenco_pagamenti'),cod_paga)


# aggiorna lo stato di pagamento delle rate
rate = []
elenco_rate = []
if context.getItem('elenco_rate_pagamenti') and context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id)==True:
    elenco_rate = context.getItem('elenco_rate_pagamenti')
elif context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id)=='True' and cod_paga[:-2] + '00' in context.getItem('permesso_rate_opt'):
    elenco_rate = context.elencoRate(context.getId(),cod_paga[:-2] + '00')

if elenco_rate:
    # 1° caso dg rate non esistente
    if not context.getItem('elenco_rate_pagamenti'):       
        for cod_rata in elenco_rate:
            if cod_rata[0] == cod_paga:
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
            rate.append(cod_rata)
        context.setItem('elenco_rate_pagamenti',rate)
        # impostiamo sul dg principale lo stato dei pagamenti es. pagamento rate in corso
        settoAnnulloPagamentiCodice(context.getItem('elenco_pagamenti'),cod_paga)
    # casi successivi il dg rate esiste
    elif context.getItem('elenco_rate_pagamenti'):
        for cod_rata in context.getItem('elenco_rate_pagamenti'):
            if cod_rata[0] == cod_paga:
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
            rate.append(cod_rata)
        context.setItem('elenco_rate_pagamenti',rate)

        

    

rurl=context.absolute_url()
context.redirectTo(rurl)

