## Script (Python) "verificaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title= "script che verifica  il pagamento"
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString
from Products.CMFCore.utils import getToolByName
from gisweb.utils import getChainFor

if len(getChainFor(context))>1:
    # recupera id del wf secondario
    wf_id = getChainFor(context)[1]
else:
    # recupera id del wf primario
    wf_id = getChainFor(context)[0] 


#doc=str(context.REQUEST.get('url'))
importo=context.REQUEST.get('importo')
data=StringToDate(context.REQUEST.get('data'),'%d/%m/%Y')
ora=str(context.REQUEST.get('orario'))
esito=context.REQUEST.get('esito')
divisa=context.REQUEST.get('divisa')
trans=str(context.REQUEST.get('codTrans'))
aut=context.REQUEST.get('codAut')
totale=context.REQUEST.get('totale')
session=context.REQUEST.get('session_id')

wf = getToolByName(context, 'portal_workflow')


#if context.REQUEST.SESSION.id == sessione:


context.setItem('importo_pagamento',importo)
context.setItem('data_pagamento',data)
context.setItem('ora_pagamento',ora)
context.setItem('esito_pagamento',esito)
context.setItem('divisa',divisa)
context.setItem('codTrans_pagamento',trans)
context.setItem('codAut_pagamento',aut)


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



def settoVerificaPagamentiGruppo(lista,cod_gruppo):
    p=[]
    for c in lista:
        if c[3]==cod_gruppo:
            if c[0] not in listRate(lista,c[0]):
                c[4]='pagamento effettuato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p) 

def settoVerificaPagamentiTot(lista,cod_gruppo):
    p=[]
    for c in lista:
        if c[3]==cod_gruppo:            
            c[4]='pagamento effettuato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)


def settoVerificaPagamentiCodice(lista,cod_single):
    p=[]
    for c in lista:
        cod_single = cod_single[:-2] + '00'
        if c[0]==cod_single:
            c[4]='pagamento rate'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)

def settoVerificaRateConcluse(lista,cod_single):
    p=[]
    for c in lista:
        cod_single = cod_single[:-2] + '00'
        if c[0]==cod_single:
            c[4]='pagamento effettuato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)    



# aggiorno lo stato dei pagamenti solo per i pagamenti non rateizzabili

if context.getItem('elenco_pagamenti') and totale == '0':
    settoVerificaPagamentiGruppo(context.getItem('elenco_pagamenti'),cod_paga)


# aggiorno lo stato dei pagamenti per tutti pagamenti - totale   
elif context.getItem('elenco_pagamenti') and totale == '1':
    settoVerificaPagamentiTot(context.getItem('elenco_pagamenti'),cod_paga)


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
                cod_rata[4] = 'pagamento effettuato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
            rate.append(cod_rata)
        context.setItem('elenco_rate_pagamenti',rate)
        # impostiamo sul dg principale lo stato dei pagamenti es. pagamento rate in corso
        settoVerificaPagamentiCodice(context.getItem('elenco_pagamenti'),cod_paga)
    # casi successivi il dg rate esiste
    elif context.getItem('elenco_rate_pagamenti'):
        for cod_rata in context.getItem('elenco_rate_pagamenti'):
            if cod_rata[0] == cod_paga:
                cod_rata[4] = 'pagamento effettuato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
            rate.append(cod_rata)
        context.setItem('elenco_rate_pagamenti',rate)
        rate_da_pagare = filter(lambda cod_rata: cod_rata[4]=='non pagato' ,context.getItem('elenco_rate_pagamenti'))
        if len(rate_da_pagare) == 0:
            # rate terminate setto stato pagamento rate concluse
            settoVerificaRateConcluse(context.getItem('elenco_pagamenti'),cod_paga)

        
                  
    

rurl=context.absolute_url()
context.redirectTo(rurl)
