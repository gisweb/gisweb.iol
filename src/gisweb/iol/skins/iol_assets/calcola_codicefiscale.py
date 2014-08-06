from gisweb.utils import Type, cf_build
from Products.CMFPlomino.PlominoUtils import json_dumps


result={'success': 0}

keys=container.REQUEST.form.keys()

for k in keys:
    if 'codcat' in k:
        cod_cat_nato=context.REQUEST.get(k)
    elif 'cognome' in k:
        cognome=context.REQUEST.get(k)
        
    elif 'data_nato' in k:
        data_nato=context.REQUEST.get(k)
        
    elif 'nome' in k:
        nome=context.REQUEST.get(k)
        
    elif 'sesso' in k:
        sesso=context.REQUEST.get(k)
        

giorno, mese, anno = map(int, data_nato.split('/'))



data = (cognome, nome, anno, mese, giorno, sesso, cod_cat_nato)

try:
    result['value'] = cf_build(*data)
except Exception as err:
    result['err_type'] = Type(err)
    result['err_msg'] = str(err)
else:
    result['success'] = 1
    
return json_dumps(result)