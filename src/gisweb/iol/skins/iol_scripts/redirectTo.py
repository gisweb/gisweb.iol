## Script (Python) "redirectTo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=url='',params=None
##title=
##
from Products.CMFPlomino.PlominoUtils import urlencode

if not context.portal_type in ['PlominoDocument','PlominoForm']:
    return 

if not url:
    url=context.absolute_url()
if not params:
    params=dict()

redirectUrl='%s?%s' %(url,urlencode(params))
context.REQUEST.RESPONSE.redirect(redirectUrl)
