## Script (Python) "printDistintaPagamento"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc='',field = 'documento_distinta_pagamento', grp = 'distinta'
##title=stampoa distinta pagamento
##

from Products.CMFPlomino.PlominoUtils import json_loads
field = context.REQUEST.get('field')
grp = context.REQUEST.get('grp')
info = json_loads(context.printModelli(context.getParentDatabase().getId(),field=field,grp=grp))

context.aq_parent.createDoc(model=info['model'],field=field,grp=grp,redirect_url=context.getDocument(doc).absolute_url())

