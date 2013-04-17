## Script (Python) "elenca_tipo_pratica"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
"""
Restituisce la lista delle tipologie di istanze
"""

return ['%s|%s' % (f.Title(), f.naming_manager('tipo_pratica')) for f in context.elenca_form_pratica()]
