## Script (Python) "WFgetChainFor"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=Get associated workflow id's
##

from gisweb.iol import getChainFor

return getChainFor(context)