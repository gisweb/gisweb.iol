## Script (Python) "doclinkFieldSearchFormula"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=fieldname, colnames=''
##title=
##
"""
Calcola i documenti figli.
"""

if context.isNewDocument(): return []

from gisweb.utils import serialItem, json_dumps

db = context.getParentDatabase()
idx = db.getIndex()

ids = context.getItem(fieldname, []) or []

out = []
for docpath in context.getItem(fieldname, []) or []:
    doc = db.getDocument(docpath)
    if doc:
        nfo = dict(doc.serialDoc(fieldsubset=colnames, render=True))
        out.append('|%s' % json_dumps([doc.getId()] + [nfo.get(k) or '' for k in colnames]))

return out
