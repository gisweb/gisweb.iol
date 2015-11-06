## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=obj=None, cond=''
##title=Script che renderizza i dati base della pratica



from Products.CMFPlomino.PlominoUtils import json_loads, json_dumps, DateToString, StringToDate, Now, open_url
from iol.gisweb.utils.IolDocument import IolDocument

if not obj:
    return False
if obj.portal_type=='PlominoDatabase':
    result=dict(
        dehor=dict(
            rinnovo=True            
        )
    )
    try:
        res=result[application][cond]
    except:
        res=False

elif obj.portal_type=='PlominoDocument':
    
    res = False
    today = Now()
    autor_start = obj.getItem('autorizzata_dal')
    autor_end = obj.getItem('autorizzata_al')
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
    tot_pagamenti = rate+pagamenti
   
    debito = 0
    if dovuto and pagato:
        debito = dovuto - pagato

    
    if cond=='rinnovo':
        istruttore = IolDocument(obj).verificaRuolo('iol-manager') or IolDocument(obj).verificaRuolo('iol-reviewer')
        if obj.getItem('durata_occupazione') == 'permanente' and ('Owner' in obj.getRoles() or istruttore):           
            
            anno_corrente = DateToString(autor_end,'%Y')
            # se la pratica non è scaduta ed è antecedente il 31/10 dell'anno corrente la pratica non è rinnovabile
            if autor_end >= Now() and Now() <= StringToDate('31/10/%s' %(anno_corrente),'%d/%m/%Y'):                
                res = False
            elif obj.getItem('morosi_opt','no')!='no':
                  res = False    
            # se gestito da SpeziaRisorse il rinnovo è sempre disponibile a meno dei casi qui sopra (perido, morosita')     
            elif obj.getItem('resp_gestione_pagamenti','no')!='no':
                  res = True                                  
            elif len(tot_pagamenti)==0:
                res = True              
            elif len(tot_pagamenti)>0:               

                a=[]
                for i in tot_pagamenti:                                                          
                    if i['stato_pagamento'] in stati and i['data_scadenza']!='':
                        # se c'è un importo non pagato e con data di scadenza superiore al 31/10/anno_corrente allora  la pratica è rinnovabile                                            
                        if StringToDate(i['data_scadenza'],'%d/%m/%Y') <= StringToDate('31/10/%s' %(anno_corrente),'%d/%m/%Y'):                        
                            a.append(False)
                        else:
                            a.append(True)   
                    elif i['stato_pagamento'] in stati:
                        a.append(False)                                                     
                    else:
                        a.append(True)
                   
                if False not in a:
                    res = True
                else:
                    res = False  
            
        
return res
