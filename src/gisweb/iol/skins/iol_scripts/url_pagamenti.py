## Script (Python) "URL Pagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=docUrl='',importo=0,nome='',cognome='',mail='',docId='',dbname='',cod_pagamento='',sessionId='',test=False,divisa='EUR',lingua='ITA',totale=0
##title=pagamenti prove
##

from Products.CMFPlomino.PlominoUtils import urlencode, urlquote


s=str(nome) + ' ' + str(cognome)



if test==True:                  
	url=dict(docUrl=docUrl,importo=importo,nominativo=s,mail=mail,divisa=divisa,lingua=lingua,docId=docId,dbname=dbname,cod_pagamento=cod_pagamento,sessionId=sessionId,test=1,totale=totale)
else:
    url=dict(docUrl=docUrl,importo=importo,nominativo=s,mail=mail,divisa=divisa,lingua=lingua,docId=docId,dbname=dbname,cod_pagamento=cod_pagamento,sessionId=sessionId,test=0,totale=totale)


return urlencode(url)