## Script (Python) "openMyUrl"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=url
##title=
##
from Products.CMFPlomino.PlominoUtils import open_url, urlencode
content=open_url(url)
return content
