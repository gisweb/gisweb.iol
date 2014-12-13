## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=the_geom='' 
##title=Script che renderizza i dati base della pratica


from Products.CMFPlomino.PlominoUtils import json_dumps

the_geom = 'POINT(%s)' %(the_geom)
ret=dict()

try:
    res = context.getParentDatabase().resources.getZonaCommercio(loc=the_geom).dictionaries()
except:
    res=dict()


if len(res)==0:
    ret['success']=0
else:
    ret['success']=1
    ret['zona']=res[0]['zona']
    
return json_dumps(ret)
