## Script (Python) "translateListToDiz"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=None, form='', field=''
##title=Script che trasforma una lista in dizionario
##
db=context.getParentDatabase()

doc=db.getDocument(doc)



form = db.getForm(form)
fld = form.getFormField(field)
elenco_fields = fld.getSettings().field_mapping    
lista_fields = elenco_fields.split(',')


diz_tot=[]
for idx,itm in enumerate(context.getItem(field)):
    diz = {}
    for k,v in enumerate(lista_fields):
        diz[v] = context.getItem(field)[idx][k]
    diz_tot.append(diz)
return diz_tot