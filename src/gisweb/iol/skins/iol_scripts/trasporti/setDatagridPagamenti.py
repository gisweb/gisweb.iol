from Products.CMFPlomino.PlominoUtils import StringToDate,DateToString, Now

db=context.getParentDatabase()

doc=context
#if isinstance(doc, basestring):
 #   doc = context.getParentDatabase().getDocument(doc)

l_diz=context.setPagamentiWithStatus()


r=[]
if not doc.getItem('elenco_pagamenti'):  
    
    if doc.getItem('pagamenti_istruttoria') or doc.getItem('pagamenti_istruttoria')!={}:
        for i in  l_diz:
             cod=i['codice']
             importo=i['importo']
             label=i['label']
             gruppo=i['gruppo']
             stato='in attesa di verifica'
             data=DateToString(Now(),'%d/%m/%Y')
             a=[cod,importo,label,gruppo,stato,data]
             r.append(a)
        return r    
    
    elif not doc.getItem('pagamenti_istruttoria') or doc.getItem('pagamenti_istruttoria')=={}:
        for i in  l_diz:
             cod=i['codice']
             importo=i['importo']
             label=i['label']
             gruppo=i['gruppo']
             stato='non pagato'
             data=DateToString(Now(),'%d/%m/%Y')
             a=[cod,importo,label,gruppo,stato,data]
             r.append(a)
        return r

else:
    if doc.getItem('pagamenti_istruttoria') and doc.getItem('pagamenti_istruttoria')!={} and 'pagamento effettuato' not in [i[4] for i in doc.getItem('elenco_pagamenti')]:
        for i in  l_diz:
             cod=i['codice']
             importo=i['importo']
             label=i['label']
             gruppo=i['gruppo']
             stato='in attesa di verifica'
             data=DateToString(Now(),'%d/%m/%Y')
             a=[cod,importo,label,gruppo,stato,data]
             r.append(a)
        return r    
    
    elif doc.getItem('pagamenti_istruttoria')=={}:
        for i in  l_diz:
             cod=i['codice']
             importo=i['importo']
             label=i['label']
             gruppo=i['gruppo']
             stato='non pagato'
             data=DateToString(Now(),'%d/%m/%Y')
             a=[cod,importo,label,gruppo,stato,data]
             r.append(a)
        return r
    
    #return doc.getItem('elenco_pagamenti')
