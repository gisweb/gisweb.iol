## Script (Python) "before_istruttoria_completata"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import Now,StringToDate

doc = state_change.object
db = doc.getParentDatabase()

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)


#Recupero tipologia domanda e applicazione
tipo_richiesta = doc.getItem('tipo_richiesta','')
tipo_app = doc.getItem('tipo_app','')

# Setto il progressivo del numero di autorizzazione
if not doc.getItem('numero_autorizzazione'):
    prog = doc.getMaxOf('numero_autorizzazione', query={'tipo_app': tipo_app}) + 1
    doc.setItem('numero_autorizzazione', prog)
doc.setItem('data_autorizzazione', Now())

if not doc.getItem('numero_protocollo_autorizzazione'):
    #Protocollazione Autorizzazione
    params = dict(
        oggetto = 'Autorizazione pratica prot. %s' %doc.getItem('numero_protocollo',''),
        tipo = 'U',
        data = Now()
    )
    
    resp = doc.protocollo(params=params)
  
    if resp:
        data = StringToDate(resp['data'], format='%Y-%m-%d')
        doc.setItem('numero_protocollo_autorizzazione', '%s' % resp['numero'])
        doc.setItem('data_protocollo_autorizzazione', data)


if doc.REQUEST.get('model') and doc.REQUEST.get('field'):
    model = doc.REQUEST.get('model') or ''
    field = doc.REQUEST.get('field') or ''
    grp = doc.REQUEST.get('grp') or ''

    doc.createDoc(model=model, field=field, grp=grp)
