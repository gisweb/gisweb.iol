## Script (Python) "reindex_doc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=Reindex the PlominoDocument item values
##

"""
Reindex the PlominoDocument item values

courtesy of: https://github.com/silviot/Plomino/blob/1.15/Products/CMFPlomino/PlominoDocument.py#L397
"""

db = context.getParentDatabase()
# update index
db.getIndex().indexDocument(context)
# update portal_catalog
if db.getIndexInPortal():
    db.portal_catalog.catalog_object(context, "/".join(db.getPhysicalPath() + (context.getId(),)))
