## Script (Python) "cod_pagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=codici_pagamento
##title=cod_pagamenti
##

from gisweb.utils import Type



db=context.getParentDatabase()

list_diz=[]
for cod_pagamento in codici_pagamento:

    cod='pagamenti-' + str(cod_pagamento)
    
    value=db.get_property(cod)['value'].replace('\n','')
    
    
    re=[]
    dict_codici=dict()
    for v in value.split(','):
        key= v.split(':')[0]
        value=v.split(':')[1]
        dict_codici[key]=value
    
        
    
    list_diz.append(dict_codici)
return list_diz
