## Script (Python) "updateStatus"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO! usare: context.setItem('wf_status', context.wf_statesInfo(single=True)['id'])
##
"""
DEPRECATO!
basta usare il comando: context.setItem('wf_status', context.wf_statesInfo(single=True)['id'])
tendenzialmente lo stato non è l'unico valore settato quindi poi sarebbe necessario un altra re-indicizzazione del documento.
"""
context.setItem('wf_status', context.wf_statesInfo(single=True)['id'])
db = context.getParentDatabase()
db.getIndex().indexDocument(context)
if db.getIndexInPortal():
    db.portal_catalog.catalog_object(context, "/".join(db.getPhysicalPath() + (context.getId(),)))
