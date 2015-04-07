## Script (Python) "before_completa"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

from Products.CMFPlomino.PlominoUtils import StringToDate, json_loads

info = json_loads(context.printModelli(context.getParentDatabase().getId()))

model = info['modello_scia_savona.docx']['model']
field = info['modello_scia_savona.docx']['field']

grp = 'autorizzazione'

return context.createDoc(model=model,field=field,grp=grp,redirect_url=context.absolute_url())
#actionPrint = '%s/createDoc?model=%s&field=%s&grp=%s&redirect_url=%s' %(context.absolute_url(),model,field,grp,context.absolute_url())
