## Script (Python) "ratePagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=None, codice_pagamento=''
##title=Script che renderizza l'elenco delle rate richieste

from gisweb.utils import  addToDate
from Products.CMFPlomino.PlominoUtils import StringToDate, DateToString, Now


db=context.getParentDatabase()

doc=db.getDocument(doc)

pagamenti = doc.getItem('elenco_pagamenti')

list_rata = [v for v in pagamenti if codice_pagamento in v[0]][0]

importo = list_rata[1]
rata = float(importo)/4
list_rata[1]=round(rata,2)
list_rata[4]='non pagato' 

k= list_rata[0][:-2]
del list_rata[0]
diz={}
# crea dizionario con chiavi i codici delle rate
for i in range(4):
    key = '%s0%s' %(k,i+1)
    diz[key]=list_rata

fine = doc.getItem('autorizzata_al')
inizio = doc.getItem('autorizzata_dal')
tipo_occupazione = doc.getItem('durata_occupazione')


def scadenzaRate(diz,date_scadenza):
    n_diz = dict()
    anno = DateToString(fine,'%Y')
    diz_ord = diz.keys()
    diz_ord.sort()
    res = dict()
    for idx,rata in enumerate(diz_ord):        
        num_rata = rata[-1]
        alist = list()
        if int(idx) + 1 == int(num_rata):            
            l_rata = diz[rata] 
            data_scad = '%s/%s' %(date_scadenza[idx],anno)
            l_rata[-1] = data_scad
            n_diz[rata] = l_rata
            for i in l_rata:
                alist.append(i)
            res[rata]=alist
     
    return res


def calcolaPeriodoIntermedio(inizio,fine):
    intermedio = []
    durata = int(fine - inizio)/3    
    intermedio.append(DateToString(addToDate(inizio, durata , units='days'),'%d/%m'))
    intermedio.append(DateToString(addToDate(inizio, durata*2 , units='days'),'%d/%m'))
    return intermedio



if fine < addToDate(inizio, 8, units='months') and tipo_occupazione=='permanente':
    # inferiore a 8 - 4 mesi
    scadenza_rate_inf4 = [0,0,0,0] 
          
               
    scadenza_rate_inf4[0] = DateToString(inizio,'%d/%m')
    scadenza_rate_inf4[1] = calcolaPeriodoIntermedio(inizio,fine)[0]
    scadenza_rate_inf4[2] = calcolaPeriodoIntermedio(inizio,fine)[1]
    scadenza_rate_inf4[3] = DateToString(fine,'%d/%m')
    diz_scadenze = scadenzaRate(diz,scadenza_rate_inf4)

# anno solare intero        
else:
    diz_scadenze = scadenzaRate(diz,['31/03','31/05','31/07','31/10'])

# gestione dei fields associati al datagrid    
form = db.getForm('sub_elenco_pagamenti')
fld = form.getFormField('elenco_rate_pagamenti')
elenco_fields = fld.getSettings().field_mapping    
lista_fields = elenco_fields.split(',')    

dg=[]
for v in diz_scadenze.keys():
    lista=[v]
    ll=[i for i in diz_scadenze[v]]
    lista = lista +ll
    if len(lista) < len(lista_fields):
        diff_fields = len(lista_fields) -len(lista)
        # add empty element to list
        for i in range(diff_fields):            
            lista.insert(len(lista),'')
    dg.append(lista)
dg.sort()
return dg











