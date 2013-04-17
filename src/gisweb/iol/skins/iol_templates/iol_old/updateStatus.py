## Script (Python) "updateStatus"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=item='wf_iol', reindex=1
##title=(copiato in gisweb.iol, DA CANCELLARE)
##
"""

"""
context.setItem(item, context.wf_statesInfo(single=True)['id'])
db = context.getParentDatabase()

if reindex:
    context.reindex_doc()

# ho spostato le righe che seguono in script a parte dato che possono servire a prescindere
#+ dall'aggiornamento dello stato della pratica

#db.getIndex().indexDocument(context)
#if db.getIndexInPortal():
#    db.portal_catalog.catalog_object(context, "/".join(db.getPhysicalPath() + (context.getId(),)))
