## Script (Python) "getViewInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

from Products.CMFPlomino.PlominoUtils import json_dumps
columns = context.getColumns()

context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
print json_dumps([dict(
    aTargets = [n+1],
    sTitle = c.Title(),
    sName = c.id,
    mData = c.id,
    bVisible = not getattr(c, 'HiddenColumn', False)) for n,c in enumerate(columns)])
return printed
