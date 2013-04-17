## Script (Python) "elenca_form_pratica"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
"""
Restituisce la lista dei form delle istanze
"""

db = context.getParentDatabase()

frm_key = context.naming_manager('frm_key')

test = lambda x: x.startswith(frm_key) and not x.endswith('_info')

return [f for f in db.getForms() if test(f.getFormName())]
