## Script (Python) "reindex_doc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=(copiato in gisweb.iol, DA CANCELLARE) 
##
db = context.getParentDatabase()
db.getIndex().indexDocument(context)
if db.getIndexInPortal():
    db.portal_catalog.catalog_object(context, "/".join(db.getPhysicalPath() + (context.getId(),)))
