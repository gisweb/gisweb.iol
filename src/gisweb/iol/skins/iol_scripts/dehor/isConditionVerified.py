## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=obj=None, cond=''
##title=Script che renderizza i dati base della pratica



from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, Now, open_url


if not obj:
    return False
if obj.portal_type=='PlominoDatabase':
    result=dict(
        cantieri=dict(
            rinnovo=True,
            proroga=True,
            integrazione=True
        )
    )
    try:
        res=result[application][cond]
    except:
        res=False
elif obj.portal_type=='PlominoDocument':
    #Applicazione Trasporti Eccezionali
    # A) Condizioni di Integrabilità :
    #    1) Pratica in corso di Validità 
    # B) Condizioni di prorogabilità :
    #    1) Pratica in corso di Validità
    #    2) Massimo 1 Proroga
    #    3) Tipo Richiesta singola o multipla
    # C) Condizioni di Rinnovo
    #    1) Pratica a un mese dalla scadenza o scaduta da un mese
    #    2) Tipo Richiesta periodica
    today = Now()
    start = obj.getItem('autorizzata_dal')
    end = obj.getItem('autorizzata_al')
    tipoRichiesta = obj.getItem('iol_tipo_richiesta')
    dovuto = context.getItem('dovuto',0)
    pagato = context.getItem('pagato',0)

    if context.getItem('elenco_pagamenti',''):
        pagamenti= context.dehor.translateListToDiz(context.getId(),'sub_elenco_pagamenti','elenco_pagamenti')
    else:
        pagamenti = []
    if context.getItem('elenco_rate_pagamenti',''):
        rate= context.dehor.translateListToDiz(context.getId(),'sub_elenco_pagamenti','elenco_rate_pagamenti')
    else:
        rate = []
    stati=['non pagato','pagamento annullato']
    tot= rate+pagamenti
    
    debito = 0
    if dovuto and pagato:
        debito = dovuto - pagato

    if cond=='rinnovo':
        if obj.getItem('durata_occupazione') == 'permanente':
            
            if len(tot)>0 and not (obj.verificaRuolo('iol-manager') or obj.verificaRuolo('iol-reviewer')):
                a=[]
                for i in tot:
                    if i['stato_pagamento'] in stati:
                        a.append(False)
                    else:
                        a.append(True)
                        
                if False not in a:
                    res = True
                else:
                    res = False    
            else:
                res = True
        else:
            res = False   
    
    else:
        res = False
else:
    res = False
return res
