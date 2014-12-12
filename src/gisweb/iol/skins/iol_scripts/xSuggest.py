## Script (Python) "xSuggest"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=field='',term=''
##title=
##
from Products.CMFPlomino.PlominoUtils import json_dumps
from gisweb.utils import  suggestFromTable
result=[]

if field.count('comune')>0:
    for res in suggestFromTable('SQLA_siti', 'e_comuni', 'comune', others='all', schema='istanze', tip=term, **context.REQUEST):
        obj = '%(comune)s|%(provincia)s' % res
        label = '%(comune)s (%(provincia)s)' % res
        child=dict()
        child[field.replace('comune','provincia')]=res['provincia']
        child[field.replace('comune','cap')]=res[u'cap'] or ''
        child[field.replace('comune','cod_cat')]=res['cod_cat']
        result.append({'id':obj,'label':label,'value':res['comune'],'child':child})

elif field=='geocode_cat':
    prm1=context.REQUEST.get('ubicazione_cod_cat','')
    prm2=context.REQUEST.get('ubicazione_foglio','')
    prm3=context.REQUEST.get('ubicazione_mappale','')
    
    for res in context.getCoord(cod_cat=prm1,fg=prm2,mp=prm3).dictionaries():
        result=res
        result['success']=1
elif field=='geocode_strada':
    prm1=context.REQUEST.get('cartello_strada','')
    prm2=context.REQUEST.get('cartello_km','')
    prm2=prm2.replace(",",".")
    
    for res in context.getPosizioneCartello(strada=prm1,km=prm2).dictionaries():
        result=res
        result['success']=1       
        
return json_dumps(result)
