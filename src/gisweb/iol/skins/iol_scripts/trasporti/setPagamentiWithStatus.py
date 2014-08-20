db=context.getParentDatabase()

doc=context
#if isinstance(doc, basestring):
 #   doc = context.getParentDatabase().getDocument(doc)
    
if doc.getItem('iol_tipo_richiesta')!='base':
    cod_status={'avvio':['001','003']}
else:
    

    cod_status={'avvio':['001','002']}
db=context.getParentDatabase()


  
stato=doc.wf_getInfoFor('review_state')
 
r=[]

if stato in cod_status.keys():
    for s in cod_status[stato]:
        if doc.getItem('elenco_pagamenti'):
            if (s in [i[0] for i in doc.getItem('elenco_pagamenti')] and ('non pagato' in [i[4] for i in doc.getItem('elenco_pagamenti')]) or ('pagamento annullato' in [i[4] for i in doc.getItem('elenco_pagamenti')]) )  and stato in cod_status.keys():
                 r.append(s)
        
            else:
                r
        else:
            r.append(s)
    dizi=context.trasporti.cod_pagamenti(r)
    return dizi
else:
    return r
