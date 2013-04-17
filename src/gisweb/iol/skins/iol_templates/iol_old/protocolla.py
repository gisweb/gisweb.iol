## Script (Python) "protocolla"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=''
##title=DEPRECATO (usare: doc.protocollo(auto=True))
##
'''
restituisce un numero di protocollo
'''

try:
    db = context.getParentDatabase()
except:
    from Products.CMFCore.utils import getToolByName
    db = getToolByName(context, 'iol_provsp')
    
idx = db.getIndex()

res = idx.dbsearch({}, sortindex='numero_protocollo', reverse=1, only_allowed=False)

#return [i.numero_protocollo for i  in res]

length = 8

if res:
    last_prot = res[0].numero_protocollo
    int_prot = int(last_prot)
    next_prot = length*'0' + str(int_prot+1)
else:
    next_prot = length*'0' + '1'

return dict(prot=next_prot[-8:], data=DateTime())
