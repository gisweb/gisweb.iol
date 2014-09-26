## Script (Python) "elementiRinnovo
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= doc=None, field_dg='elenco_pagamenti'
##title=Script che renderizza i dati base della pratica
##



db=context.getParentDatabase()
doc=db.getDocument(doc)

parentId=doc.getItem('parentDocument')

parent = db.getDocument(parentId)


elementi_origine  = parent.getItem(field_dg)

if len(elementi_origine) > 0:
    doc.setItem(field_dg, elementi_origine)
