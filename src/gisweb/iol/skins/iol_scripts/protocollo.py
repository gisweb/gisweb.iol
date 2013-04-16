## Script (Python) "protocollo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=params={}, auto=False
##title=Protocollo
##

'''
script di gestione della protocollazione
Casistiche considerate:
1. esiste uno script di protocollazione
2. la protocollazione è manuale
3. si usa una procedura base
'''

from Products.CMFPlomino.PlominoUtils import Now, DateToString, StringToDate

db = context.getParentDatabase()
doc = context

def richiedi_protocollo():
	"""
	lenght: lunghezza della stringa (default: 8)
	
	informazioni per il servizio di protocollazione:
	tipo: stringa che identifica se Enbtrata o Uscita
	oggetto: oggetto della protocollazione
	data: data di richiesta della protocollazione
	"""

    # 0. se espressamente richiesto uso la procedura di default per la protocollazione
    if auto:
        idx = db.getIndex()
        res = idx.dbsearch({}, sortindex='numero_protocollo', reverse=1, only_allowed=False)
        length = params.get('length') or 8 # di default la lunghezza della stringa è fissata a 8 caratteri
        
        if res:
            last_prot = res[0].numero_protocollo
            int_prot = int(last_prot)
            next_prot = length*'0' + str(int_prot+1)
        else:
            next_prot = length*'0' + '1'
        
        return dict(numero=next_prot[-8:], data=DateToString(Now()))
    
    # 1. se esiste uso lo script interno al PlominoDatabase
    if 'inserisci_protocollo' in db.resources.keys():
        res = db.resources.inserisci_protocollo(context,
            tipo = params.get('tipo') or 'E',      # protocollo in Entrata (E) o Uscita (U)
            oggetto = params.get('oggetto') or '', # Inserire qui l'oggetto per la protocollazione
            data = params.get('data') or Now()     # data della richiesta del protocollo.
                                                   #+ In alternativa si può usare la data di presentazione.
        )
        return res
    
    # 2. non è prevista una procedura automatica di protocollazione... si deve procedere con quella manuale
    return {}

return richiedi_protocollo()
