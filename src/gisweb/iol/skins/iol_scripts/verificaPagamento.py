## Script (Python) "verificaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title= "script che verifica  il pagamento"
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now
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
#data=StringToDate(context.REQUEST.get('data'),'%d/%m/%Y')
ora=str(context.REQUEST.get('orario'))
esito=context.REQUEST.get('esito')
divisa=context.REQUEST.get('divisa')
trans=str(context.REQUEST.get('codTrans'))
aut=context.REQUEST.get('codAut')
totale=context.REQUEST.get('totale') or '0'
session=context.REQUEST.get('session_id')

wf = getToolByName(context, 'portal_workflow')


#if context.REQUEST.SESSION.id == sessione:


context.setItem('importo_pagamento',importo)
#context.setItem('data_pagamento',data)
context.setItem('ora_pagamento',ora)
context.setItem('esito_pagamento',esito)
context.setItem('divisa',divisa)
context.setItem('codTrans_pagamento',trans) 
context.setItem('codAut_pagamento',aut)

if trans:
    codice_trans_pagamento = 'PO-%s' %(trans.split('-')[1])

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
    stati=['non pagato','pagamento annullato']
    cod_non_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        if c[3]==cod_gruppo and c[0] in cod_non_pagati:
            if c[0] not in listRate(lista,c[0]) and context.getItem('esito_pagamento')=='OK':
                c[4]='pagamento effettuato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
            elif c[0] not in listRate(lista,c[0]) and context.getItem('esito_pagamento')=='KO':
                c[4]='pagamento annullato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p) 

def settoVerificaPagamentiTot(lista,cod_gruppo):
    stati=['non pagato','pagamento annullato']
    cod_non_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        if c[0] in cod_non_pagati:
            if c[3]==cod_gruppo and context.getItem('esito_pagamento')=='OK':            
                c[4]='pagamento effettuato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
            elif c[3]==cod_gruppo and context.getItem('esito_pagamento')=='KO':
                c[4]='pagamento annullato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
            p.append(c)
    context.setItem('elenco_pagamenti',p)


def settoVerificaPagamentiCodice(lista,cod_single):
    stati=['non pagato','pagamento annullato']
    cod_non_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        cod_single = cod_single[:-2] + '00'
        if c[0]==cod_single:
            c[4]='pagamento effettuato'
            c[5]=DateToString(Now(),'%d/%m/%Y')
        p.append(c)
    context.setItem('elenco_pagamenti',p)

def settoVerificaRateConcluse(lista,cod_single):
    stati=['non pagato','pagamento annullato']
    cod_non_pagati = [cod[0] for cod in lista if cod[4] in stati]
    p=[]
    for c in lista:
        if c[0] in cod_non_pagati:
            cod_single = cod_single[:-2] + '00'
            if c[0]==cod_single and context.getItem('esito_pagamento')=='OK':
                c[4]='pagamento effettuato'
                c[5]=DateToString(Now(),'%d/%m/%Y')
            elif c[0]==cod_single and context.getItem('esito_pagamento')=='KO':
                c[4]='pagamento annullato'
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
rata = []
elenco_rate = []
if context.getItem('elenco_rate_pagamenti') and context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id) and len(context.getItem('permesso_rate_opt'))>0:    
    elenco_rate = context.getItem('elenco_rate_pagamenti')
    
elif context.wf_getInfoFor('wf_pagamenti',wf_id=wf_id) and len(context.getItem('permesso_rate_opt'))>0:    
    elenco_rate = context.elencoRate(context.getId(),context.getItem('permesso_rate_opt')[0])

if len(elenco_rate) > 0:    
    s=['non pagato','pagamento annullato']
    elenco_rate_no_pagate = filter(lambda cod: cod[4] in s ,elenco_rate)        
    elenco_rate_no_pagate.sort()
    rata_da_pagare = [v[0] for v in elenco_rate_no_pagate]
   
    # 1° caso dg rate non esistente
    if not context.getItem('elenco_rate_pagamenti'):               
        for cod_rata in elenco_rate:            
            if cod_rata[3] == cod_paga and cod_rata[0] == rata_da_pagare[0] and context.getItem('esito_pagamento')=='OK':
                
                cod_rata[4] = 'pagamento effettuato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
                cod_rata[7] = '%s-%s' %(codice_trans_pagamento,cod_rata[0])
                rata = elenco_rate                
                # impostiamo sul dg principale lo stato dei pagamenti es. pagamento rate in corso
                settoVerificaPagamentiCodice(context.getItem('elenco_pagamenti'),cod_rata[0])
        
            elif cod_rata[0] == rata_da_pagare[0] and context.getItem('esito_pagamento')=='KO':
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
                settoVerificaRateConcluse(context.getItem('elenco_pagamenti'),cod_rata[0])
            
        context.setItem('elenco_rate_pagamenti',rata)
        
    # casi successivi il dg rate esiste
    elif context.getItem('elenco_rate_pagamenti'):
        
        for cod_rata in elenco_rate:
            
            if cod_rata[0] == rata_da_pagare[0] and context.getItem('esito_pagamento')=='OK':
                cod_rata[4] = 'pagamento effettuato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
                cod_rata[7] = '%s-%s' %(codice_trans_pagamento,cod_rata[0])
                rata = elenco_rate
                
                settoVerificaPagamentiCodice(context.getItem('elenco_pagamenti'),cod_rata[0])
            elif cod_rata[0] == rata_da_pagare[0] and context.getItem('esito_pagamento')=='KO':                
                cod_rata[4] = 'pagamento annullato'
                cod_rata[5] = DateToString(Now(),'%d/%m/%Y')
                rata = elenco_rate
                
        context.setItem('elenco_rate_pagamenti',rata)
        
db = context.getParentDatabase()
applicazione = db.getId().split('_')[-1]
app = getToolByName(context,applicazione)

scriptName = 'verificaPagamento' 


if scriptName in app.objectIds():
     
    return app.verificaPagamento(context)
              
    

rurl=context.absolute_url()
context.redirectTo(rurl)

