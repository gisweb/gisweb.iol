## Script (Python) "doclinkImportXml"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=dtml, kw={}, redirect=''
##title=
##

"""
redirect: manage_main/folder_contents/
"""

from gisweb.utils import importElementFromXML, json_loads
if kw and isinstance(kw, basestring):
	kw = json_loads(kw)

xml = getattr(context, dtml)(**kw)
importElementFromXML(xml, context)
if redirect:
	context.REQUEST.RESPONSE.redirect('/'.join((context.absolute_url(), redirect, )))