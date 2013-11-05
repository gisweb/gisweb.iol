## Script (Python) "before_protocolla"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFPlomino.PlominoUtils import Now,StringToDate
from Products.CMFCore.utils import getToolByName

doc = state_change.object

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)
	
params = dict(
    oggetto = '',
    tipo = 'E',
    data = Now()
)

resp = doc.protocollo(params=params)

if resp:
    data = StringToDate(resp['data'], format='%Y-%m-%d')
    doc.setItem('numero_protocollo', '%s' % resp['numero'])
    doc.setItem('data_protocollo', data)

doc.updateStatus()
