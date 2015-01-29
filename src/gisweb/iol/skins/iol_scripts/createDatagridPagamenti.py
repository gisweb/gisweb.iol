## Script (Python) "createDatagridPagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=codici_pagamenti, field_allegato='ricevuta_pagamento', field_dg='elenco_pagamenti', codice_allegato=''
##title=pagamenti datagrid prove
##

from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now
from Products.CMFCore.utils import getToolByName



diz_pagamenti=context.createMapPagamenti(codici_pagamenti)
db = context.getParentDatabase()
doc = context

wf = getToolByName(doc, 'portal_workflow')


applicazione = db.getId().split('_')[-1]
app = getToolByName(context,applicazione)

scriptName = 'createDatagridPagamenti' 


if scriptName in app.objectIds():
    
    return app.createDatagridPagamenti(context,codici_pagamenti)
              
    




# crea il datagrid con l'elenco dei primi pagamenti
def createDatagrid(diz_pagamenti,stato_pagamento):
    lista_codici = diz_pagamenti.keys()
    elenco_dg = []
    for codice in lista_codici:
        sub_diz = diz_pagamenti[codice]
        cod = sub_diz['codice']
        label = sub_diz['label']
        grp = sub_diz['gruppo']
        importo = sub_diz['importo']
        stato = stato_pagamento
        data = DateToString(Now(),'%d/%m/%Y')
        dg = [cod,importo,label,grp,stato,data]
        elenco_dg.append(dg)
    return elenco_dg


# aggiorna il datagrid con i nuovi pagamenti
def updateDatagrid(diz_pagamenti,diz_code_pagamenti, stato_pagamento, dg_exist, allegato,codice_allegato):
       
    lista_codici = diz_pagamenti.keys()    
    old_codici = map(lambda codice: codice[0] ,dg_exist)    
    new_codici = filter(lambda codice: codice not in old_codici ,lista_codici)
    new_diz_value={}
    if len(lista_codici) > len(old_codici):
        
        new_diz_value = {k:codici_pagamenti[0][k] for k in diz_code_pagamenti.keys() if diz_code_pagamenti[k]!=codici_pagamenti[0][k] and codici_pagamenti[0][k]!=''}
    else:
        
        new_diz_value = {k:codici_pagamenti[0][k] for k in lista_codici}
    
        
    if len(new_codici)==0 and new_diz_value =={}:
        
             
        aa = filter(lambda stato: stato[4]!=stato_pagamento,dg_exist)
                               
        new_state = [code[0] for code in aa]
        
        for codice in new_state:
            dg_exist_new = [dg_exist.pop(cod[0]) for cod in enumerate(dg_exist) if cod[1][0] == codice]            
            sub_diz = diz_pagamenti[codice]            
            cod = sub_diz['codice']
            label = sub_diz['label']
            grp = sub_diz['gruppo']
            importo = sub_diz['importo']                           
            if allegato == False:           
                stato = dg_exist_new[0][4]                 
            else: 
                if codice_allegato == codice: 
                    stato = stato_pagamento
                else:
                     stato = dg_exist_new[0][4]
            data = DateToString(Now(),'%d/%m/%Y')            
            dg = [cod,importo,label,grp,stato,data]
            dg_exist.append(dg)
           
        return dg_exist
              
    elif len(new_codici) > 0:
           
        for codice in new_codici:
        
            sub_diz = diz_pagamenti[codice]
            cod = sub_diz['codice']
            label = sub_diz['label']
            grp = sub_diz['gruppo']
            importo = sub_diz['importo']
            stato = stato_pagamento        
            data = DateToString(Now(),'%d/%m/%Y')
            dg = [cod,importo,label,grp,stato,data]
            dg_exist.append(dg)
        return dg_exist

    elif new_diz_value !={}:        
        
        dg_exist_t = []
        for k_code in new_diz_value.keys():            
            dg_exist_rmv_value = [dg_exist.pop(cod[0]) for cod in enumerate(dg_exist) if cod[1][0]==k_code][0]            
            cod = dg_exist_rmv_value[0]
            label = dg_exist_rmv_value[2]
            grp = dg_exist_rmv_value[3]
            #importo = new_diz_value[k_code]
            importo=diz_pagamenti[k_code]['importo']
            stato = dg_exist_rmv_value[4]        
            data = dg_exist_rmv_value[5]
            dg = [cod,importo,label,grp,stato,data]            
            dg_exist_t.append(dg)
        return dg_exist_t



allegato_pagamento = [x for x in [i for i in doc.getItems() if i.startswith('ricevuta_pagamento')] if doc.getItem(x)!={}]

dg_esistente = doc.getItem(field_dg)

codici_pagamenti_new={}
for v in dg_esistente:
    codici_pagamenti_new[v[0]]=v[1]

if not doc.getItem(field_dg):
    if len(allegato_pagamento) > 0:
        wf.doActionFor(doc, 'effettua_pagamento')
        return createDatagrid(diz_pagamenti,stato_pagamento='in attesa di verifica')
    else:
        return createDatagrid(diz_pagamenti,stato_pagamento='non pagato')
        
elif doc.getItem(field_dg):
    if doc.wf_getInfoFor('wf_ricevuta_pagamento',wf_id='pagamenti_allegati') == True or doc.wf_getInfoFor('wf_ricevuta_pagamento',wf_id='pagamenti_allegati')=='true':
        
        if doc.wf_getInfoFor('wf_effettuato_pagamento',wf_id='pagamenti_allegati') == True:            
            if doc.wf_getInfoFor('review_state',wf_id='pagamenti_allegati')=='pagamenti':
                wf.doActionFor(doc, 'effettua_pagamento')
        
        return updateDatagrid(diz_pagamenti,diz_code_pagamenti={},stato_pagamento='in attesa di verifica',dg_exist=dg_esistente,allegato=True,codice_allegato=codice_allegato)
                
    else:
        
        return updateDatagrid(diz_pagamenti,diz_code_pagamenti=codici_pagamenti_new,stato_pagamento='non pagato',dg_exist=dg_esistente,allegato=False,codice_allegato=codice_allegato)
