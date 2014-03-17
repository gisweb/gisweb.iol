## Script (Python) "updateStatus"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=itemname='wf_iol', reindex=1
##title=Update the workflow status item
##

"""
Update the workflow status item

itemname: name of the item in wich save the status
reindex: if evaluated as True the PlominoDocument will be reindexed

"""

context.setItem(itemname, context.WFgetInfoFor('review_state'))
db = context.getParentDatabase()

if reindex:
    context.reindex_doc()
