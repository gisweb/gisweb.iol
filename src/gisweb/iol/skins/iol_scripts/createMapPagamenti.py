## Script (Python) "createMapPagamenti"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=codici_pagamenti
##title=pagamenti prove
##




# codici_pagamenti: dizionario dei codici pagamenti richiesti in quel momento
# l'elenco dei cod_pagamenti=[{'007':'12','010':''}] può essere aggiornato più volte semplicemente aggiungendo
# nuovi elementi al dizionario, ovviamente con codici diversi. 
# ad esempio a seconda dello stato di wf possiamo aggiungere i diversi codici
# sarà poi lo script createDatagridPgamenti.py a gestire i pagamenti esistenti dai nuovi
# in tal modo è possibile gestire gruppi di pagamenti che dovranno essere richiesti in diversi stati della pratica



# l'elenco de	

def updateDictPagamenti(codici_pagamenti):
	if len(codici_pagamenti)>0:
		cod_pagamenti = codici_pagamenti[0]

		db=context.getParentDatabase()
		lista_codici_pagamenti = cod_pagamenti.keys()
		list_codici = map(lambda codice: 'pagamenti-' + str(codice) ,lista_codici_pagamenti) 	
		diz_pagamenti = dict()
		for codice in list_codici:
			diz_pagamento = dict()
			for v in db.get_property(codice)['value'].replace('\n','').split(','):
				# cod_lista es.'007' 
				cod_lista = codice.split('-')[1]
				key = v.split(':')[0]
				value = v.split(':')[1]			

				if key == 'importo' and cod_pagamenti[cod_lista] == '':
				    diz_pagamento[key]=value
				elif key == 'importo':
					diz_pagamento[key]=cod_pagamenti[cod_lista]	   
				else:    
					diz_pagamento[key]=value

			diz_pagamenti[codice.split('-')[1]]=diz_pagamento	
		return diz_pagamenti
	else:
		return dict()



return updateDictPagamenti(codici_pagamenti)