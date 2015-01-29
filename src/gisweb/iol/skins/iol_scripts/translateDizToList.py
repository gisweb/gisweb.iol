## Script (Python) "translateDizToList"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=None, form='', field='', diz_dg_elements=[]
##title=Script che trasforma una lista di dizionari in una lista di liste


doc=context
db=doc.getParentDatabase()
form = db.getForm(form)
fld = form.getFormField(field)
elenco_fields = fld.getSettings().field_mapping    
lista_fields = elenco_fields.split(',')




dg=[]
for diz_element in diz_dg_elements:
    diz_pos = {}
    dg_element = []
    for key in diz_element.keys():
        if key in lista_fields:        
            pos = lista_fields.index(key)
            diz_pos[pos]=key        
    for i in range(len(diz_pos)):        
        k = diz_pos[i]
        dg_element.append(diz_element[k])
    dg.append(dg_element)
return dg  

