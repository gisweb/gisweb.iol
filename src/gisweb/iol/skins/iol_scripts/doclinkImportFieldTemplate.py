## Script (Python) "doclinkImportFieldTemplate"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=dtml, redirect='folder_contents'
##title=
##

"""
redirect: manage_main/folder_contents/
"""

# from gisweb.utils import importElementFromXML, json_loads
# if kw and isinstance(kw, basestring):
# 	kw = json_loads(kw)

keys = (k for k in context.REQUEST.form if k not in (dtml, redirect, ))

kw = dict([('custom_'+k,v) for k,v in context.REQUEST.form.items()
		if k in keys], custom_form_name=context.getFormName())

context.doclinkImportTool(dtml, kw=kw, redirect=redirect)