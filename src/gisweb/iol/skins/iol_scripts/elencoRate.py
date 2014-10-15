## Script (Python) "ratePagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=None, codice_pagamento=''
##title=Script che renderizza l'elenco delle rate richieste




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
    
dg=[]
for v in diz.keys():
    lista=[v]
    ll=[i for i in list_rata]
    lista = lista +ll
    dg.append(lista)
dg.sort()
return dg 