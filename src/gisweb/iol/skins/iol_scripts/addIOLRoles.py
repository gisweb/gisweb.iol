## Script (Python) "addIOLRoles"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=result_as=None
##title=
##

from gisweb.iol import addIOLRoles

res = addIOLRoles(context)

if result_as == 'json':
    from Products.CMFPlomino.PlominoUtils import json_dumps
    print json_dumps(res)
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return printed
